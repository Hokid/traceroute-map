import React, { forwardRef } from 'react';
import { Button, Props as ButtonProps } from '../../../button';
import styles from './InfoButton.css';
import mapPointIcon from './map-point.svg';

export type Props = Pick<ButtonProps, 'onClick' | 'disabled'>;

export const InfoButton = forwardRef<HTMLButtonElement, Props>((props, ref) => (
  <Button
    ref={ref}
    className={styles.button}
    onClick={props.onClick}
    disabled={props.disabled}
  >
    <img src={mapPointIcon} alt="Icon" />
  </Button>
));

InfoButton.displayName = 'InfoButton';
