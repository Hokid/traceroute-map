import React from 'react';

export type Route = {
  ip: string;
  unknown: boolean;
  domain?: string;
  point?: [number, number];
  location?: string;
};

export type TraceRouteState = {
  destination?: string;
  status: 'wait' | 'tracing' | 'completed' | 'error';
  error?: string;
  routes: Route[];
};

export type Trace = (destination: string) => Promise<void>;
export type Stop = () => void;

export type Context = {
  state: TraceRouteState;
  trace: Trace;
  stop: Stop;
};

export const context = React.createContext<Context>({
  state: {
    status: 'wait',
    routes: [],
  },
  trace: () => Promise.resolve(),
  stop: () => {},
});
