import React from 'react';
import styles from './Record.css';

export type Props = {
  title: string;
  children: string;
}

export const Record: React.FC<Props> = props => (
  <div className={styles.root}>
    <h6>{props.title}</h6>
    <p>{props.children}</p>
  </div>
)
