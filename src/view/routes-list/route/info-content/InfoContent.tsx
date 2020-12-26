import React from 'react';
import styles from './InfoContent.css';
import { Record } from './record/Record';

export type Props = {
  ip: string;
  domain?: string;
  location: string;
  point: [number, number];
}

export const InfoContent: React.FC<Props> = props => (
  <div className={styles.root}>
    <Record
      title="IP"
      children={props.ip}
    />
    {
      !!props.domain && (
        <Record
          title="Domain"
          children={props.domain}
        />
      )
    }
    <Record
      title="Location"
      children={props.location}
    />
    <Record
      title="Coordinates"
      children={`${props.point[0]}, ${props.point[1]}`}
    />
  </div>
)

InfoContent.displayName = 'InfoContent';
