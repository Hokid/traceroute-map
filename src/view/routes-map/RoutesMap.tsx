import React, { useEffect } from 'react';
import { Icon, LatLngBounds, Map } from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

export type Route = {
  ip: string;
  domain: string;
  location: string;
  point: [number, number];
};

export type Props = {
  // TODO: my ip address route
  routes: Route[];
};

const redIcon = new Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const RoutesMap: React.FC<Props> = props => {
  const points = React.useMemo(() => props.routes.map(_ => _.point), [
    props.routes,
  ]);
  const bounds = React.useMemo(
    () =>
      new LatLngBounds(
        points.length === 0
          ? [
              [57.893914, 25.806204],
              [50.709048, 58.557921],
            ]
          : points
      ),
    [points]
  );
  const map = React.useRef<Map>();

  useEffect(() => {
    if (map.current) {
      map.current.fitBounds(bounds);
    }
  }, [bounds]);

  return (
    <MapContainer
      trackResize
      style={{
        height: '100%',
      }}
      preferCanvas
      center={bounds.getCenter()}
      bounds={bounds}
      scrollWheelZoom
      whenCreated={_ => {
        map.current = _;
        // Fix wrong map size on start up
        map.current.invalidateSize();
        map.current.fitBounds(bounds);
      }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={points} />
      {/* @ts-ignore */}
      <MarkerClusterGroup>
        {props.routes.map((route, index) => {
          const icon =
            index === 0
              ? greenIcon
              : index === props.routes.length - 1
              ? redIcon
              : new Icon.Default();

          return (
            <Marker
              key={route.ip}
              position={route.point}
              icon={icon}
              zIndexOffset={index === 0 ? 2 : 1}
            >
              <Popup>
                <div>{route.ip}</div>
                <div>{route.domain}</div>
                <div>{route.location}</div>
                <div>
                  {route.point[0]}, {route.point[1]}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};
