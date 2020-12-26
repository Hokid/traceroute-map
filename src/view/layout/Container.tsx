import React from 'react';
import styles from './layout.css';

export const Container: React.FC<React.PropsWithChildren<
  Record<string, unknown>
>> = ({ children }) => {
  return <main className={styles.container}>{children}</main>;
};
