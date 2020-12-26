import React, { useEffect } from 'react';
import Popup from 'reactjs-popup';
import { Button } from './button';
import { HostInput } from './host-input';
import { Canvas } from './layout/Canvas';
import { Container } from './layout/Container';
import { Controls } from './layout/Controls';
import { RoutesList } from './routes-list';
import { RoutesMap } from './routes-map/RoutesMap';
import { context, Route } from './traceroute-context';
import styles from './View.css';

export const View: React.FC = () => {
  const tracerouteContext = React.useContext(context);

  const [destination, setDestination] = React.useState<string>('');
  const [errorPopupOpen, setErrorPopupOpen] = React.useState<boolean>(false);

  useEffect(() => {
    if (tracerouteContext.state.error) {
      setErrorPopupOpen(true);
    }
  }, [tracerouteContext.state.error, setErrorPopupOpen])

  const closeErrorPopup = React.useCallback(
    () => setErrorPopupOpen(false),
    [setErrorPopupOpen]
  );

  const routes = React.useMemo<Required<Route>[]>(
    () => tracerouteContext.state.routes.filter((_): _ is Required<Route> => !_.unknown),
    [tracerouteContext.state]
  );

  const trace = React.useCallback(() => {
    tracerouteContext
      .trace(destination)
      .catch(() => {});
  }, [
    destination,
    tracerouteContext.trace
  ]);

  return (
    <>
      <Container>
        <Canvas>
          <RoutesMap routes={routes} />
        </Canvas>
        <Controls>
          <div className={styles.controlsContent}>
            <div className={styles.hostInput}>
              <HostInput
                value={destination}
                onChange={setDestination}
                loading={tracerouteContext.state.status === 'tracing'}
                onTrace={trace}
                disabled={tracerouteContext.state.status === 'tracing'}
                onCancel={tracerouteContext.stop}
              />
            </div>
            <div className={styles.routesList}>
              <RoutesList
                routes={routes}
                loading={tracerouteContext.state.status === 'tracing'}
                error={tracerouteContext.state.error}
              />
            </div>
          </div>
        </Controls>
      </Container>
      <Popup
        open={errorPopupOpen}
        closeOnDocumentClick
        onClose={closeErrorPopup}
        contentStyle={{
          borderRadius: 3
        }}
      >
        <div className={styles.errorPopupContent}>
          <p>{tracerouteContext.state.error}</p>
          <Button onClick={closeErrorPopup}>OK</Button>
        </div>
      </Popup>
    </>
);
};
