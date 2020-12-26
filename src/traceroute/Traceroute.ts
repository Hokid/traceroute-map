import dns from 'dns';
import { EventEmitter } from 'events';
import Impl, { Hop as ImplHop } from 'nodejs-traceroute';
import myIp from 'public-ip';
import { LocationSearch } from './LocationSearch';
import { Hop, Hops, Location } from './output';

type Middleware = (hop: Partial<Hop>) => Promise<Partial<Hop>> | Partial<Hop>;

// TODO: custom timeout
export class Traceroute extends EventEmitter {
  private impl = new Impl();
  private completed = false;
  private current: Promise<Hops> | undefined;
  private hops: Hops = [];

  constructor(public destination: string) {
    super();
  }

  trace(): Promise<Hops> {
    if (this.current) {
      return this.current;
    }

    if (this.completed) {
      return Promise.resolve(this.hops);
    }

    this.current = new Promise<Hops>(async (_resolve, _reject) => {
      const hopsQueue: Promise<Hop | void>[] = [];
      let stop = false;

      const reject = (error: unknown) => {
        if (stop) {
          return;
        }
        this.hops = [];
        this.current = undefined;
        stop = true;
        const message = error instanceof Error ? error.message : 'unknown';
        _reject(new Error(`Traceroute error: ${message}`));
      };

      const resolve = () => {
        if (stop) {
          return;
        }
        stop = true;
        this.completed = true;
        this.current = undefined;
        _resolve(this.hops);
      };

      this.impl.on('hop', (implHop: ImplHop) => {
        if (stop) {
          return;
        }

        const prev =
          hopsQueue.length !== 0 ? hopsQueue[hopsQueue.length - 1] : undefined;

        const middlewares: Middleware[] = [
          async (hop: Partial<Hop>) => {
            hop.domain = await this.getDomain(hop.ip!);
            return hop;
          },
          async (hop: Partial<Hop>) => {
            if (hop.unknown) {
              return hop;
            }

            const location = await this.getLocation(hop.ip!);

            if (location) {
              hop.location = location;
            } else {
              hop.unknown = true;
            }

            return hop;
          },
          hop => {
            if (prev) {
              return prev.then(() => hop);
            }
            return hop;
          },
          (hop: Partial<Hop>) => {
            this.hops.push(hop as Hop);
            this.emit('hop', hop);
            return hop as Hop;
          },
        ];

        const origin = Promise.resolve().then<Partial<Hop>>(() => ({
          ip: implHop.ip,
          unknown: implHop.ip === '*',
        }));

        const hopResolver = middlewares.reduce((step, middleware) => {
          return step.then(hop => {
            if (stop) {
              return hop;
            }
            return middleware(hop);
          });
        }, origin) as Promise<Hop>;

        hopsQueue.push(
          hopResolver.catch(error => {
            reject(error);
          })
        );
      });

      this.impl.on('close', async (code: number) => {
        if (code !== 0) {
          return reject(new Error(`Process exit with code ${code}.`));
        }

        Promise.all(hopsQueue).then(resolve);
      });

      try {
        const self = await this.getSelf();
        this.onHop(self);
        this.impl.trace(this.destination);
      } catch (error) {
        reject(error);
      }
    });

    return this.current;
  }

  private onHop(hop: Hop) {
    this.hops.push(hop);
    this.emit('hop', hop);
  }

  private async getSelf(): Promise<Hop> {
    const selfIp = await myIp.v4();
    const domain = await this.getDomain(selfIp);
    const location = await this.getLocation(selfIp);
    return {
      ip: selfIp,
      unknown: !location,
      domain,
      location,
    };
  }

  private getLocation(ip: string): Promise<Location | undefined> {
    const searcher = new LocationSearch(ip);
    return searcher.search();
  }

  private getDomain(ip: string): Promise<string | undefined> {
    return new Promise<string>(resolve => {
      if (ip === '*') {
        return resolve();
      }

      dns.reverse(ip, (error, hosts) => {
        if (error) {
          return resolve();
        }

        if (ip === hosts[0]) {
          resolve();
        }

        resolve(hosts[0]);
      });
    });
  }
}
