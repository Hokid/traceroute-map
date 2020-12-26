import React from 'react';
import styles from './layout.css';

export const Controls: React.FC<React.PropsWithChildren<
  Record<string, unknown>
>> = ({ children }) => {
  return <aside className={styles.controls}>{children}</aside>;
};
