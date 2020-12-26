import React, { forwardRef, MouseEventHandler, PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './Button.css';

export type Props = PropsWithChildren<{
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}>;

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => (
  <button
    ref={ref}
    type="button"
    className={classNames(styles.button, props.className)}
    onClick={props.onClick}
    disabled={props.disabled}
    children={props.children}
  />
));

Button.displayName = 'Button';
