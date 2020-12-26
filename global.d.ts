declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module 'nodejs-traceroute' {
  import { EventEmitter } from 'events';

  class Traceroute extends EventEmitter {
    trace(destination: string): void;
  }

  export type Hop = {
    hop: number;
    ip: string;
    rtt1: string;
  };

  export default Traceroute;
}

declare module 'is-valid-domain' {
  function isValidHost(value: string): boolean;
  export default isValidHost;
}
