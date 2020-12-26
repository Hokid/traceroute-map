import React from 'react';
import { TraceRouteContextProvider } from './view/traceroute-context';
import { View } from './view/View';

export default function App() {
  return (
    <TraceRouteContextProvider>
      <View />
    </TraceRouteContextProvider>
  );
}
