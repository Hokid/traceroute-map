import React from 'react';
import classNames from 'classnames';
import Popup from 'reactjs-popup';
import { InfoButton } from './info-button/InfoButton';
import { InfoContent } from './info-content/InfoContent';
import styles from './Route.css';


export type Props = {
  type?: 'start' | 'end';
  connect?: boolean;
  ip: string;
  domain?: string;
  point: [number, number];
  location: string;
}

export const Route: React.FC<Props> = props => {
  return (
    <li className={classNames(styles.root, {[styles.connect]: props.connect})}>
      <span className={classNames(styles.point, {
        [styles.start]: props.type === 'start',
        [styles.end]: props.type === 'end',
      })}/>
      <span className={props.ip}>{props.ip}</span>
      <Popup
        trigger={<InfoButton/>}
        position="left top"
        keepTooltipInside
      >
        <InfoContent
          ip={props.ip}
          domain={props.domain}
          location={props.location}
          point={props.point}
        />
      </Popup>
    </li>
  )
}
