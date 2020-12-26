import React from 'react';
import { Hop, Traceroute } from '../../traceroute';
import { Context, context, TraceRouteState } from './context';

const Provider = context.Provider;

export const TraceRouteContextProvider: React.FC<React.PropsWithChildren<
  Record<string, unknown>
>> = props => {
  const stopRef = React.useRef<() => void>();
  const stateRef = React.useRef<TraceRouteState>({
    status: 'wait',
    routes: [],
  });

  const [state, setState] = React.useState<TraceRouteState>(stateRef.current);

  const trace = React.useCallback(async (destination: string) => {
    if (stateRef.current.status === 'tracing') {
      return;
    }

    stateRef.current = {
      status: 'tracing',
      routes: [],
    };

    setState(stateRef.current);

    let stopped = false;

    const traceroute = new Traceroute(destination);

    stopRef.current = _stop;

    async function onHop(hop: Hop) {
      if (stopped) {
        return;
      }

      stateRef.current = {
        ...stateRef.current,
        routes: stateRef.current.routes.concat({
          ip: hop.ip,
          domain: hop.domain,
          unknown: hop.unknown,
          point: hop.location
            ? [hop.location.lat, hop.location.long]
            : undefined,
          location: hop.location?.name,
        }),
      };
      setState(stateRef.current);
    }

    function _stop() {
      traceroute.off('hop', onHop);
      stopped = true;
      stopRef.current = undefined;
    }

    traceroute.on('hop', onHop);

    try {
      await traceroute.trace();

      if (stopped) {
        return;
      }

      stateRef.current = {
        ...stateRef.current,
        status: 'completed',
      };
      setState(stateRef.current);
    } catch (error) {
      console.error(error);
      stateRef.current = {
        ...stateRef.current,
        status: 'error',
        error: error.message,
      };
      setState(stateRef.current);
      _stop();
    }
  }, []);

  const stop = React.useCallback(() => {
    if (stateRef.current.status === 'wait') {
      return;
    }

    if (stopRef.current) {
      stopRef.current();
    }

    stateRef.current = {
      status: 'wait',
      routes: [],
    };

    setState(stateRef.current);
  }, []);

  const value = React.useMemo<Context>(
    () => ({
      state,
      trace,
      stop,
    }),
    [state, stop, trace]
  );

  return <Provider value={value}>{props.children}</Provider>;
};
