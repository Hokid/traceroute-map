import React from 'react';
import styles from './layout.css';

export const Canvas: React.FC<React.PropsWithChildren<
  Record<string, unknown>
>> = ({ children }) => {
  return <section className={styles.canvas}>{children}</section>;
};
