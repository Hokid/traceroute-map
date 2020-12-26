import isValidIP from 'is-ip';
import isValidDomain from 'is-valid-domain';
import React from 'react';
import { Button } from '../button';
import cancelIcon from './cancel.svg';
import styles from './HostInput.css';
import traceIcon from './trace.svg';

export type Props = {
  value: string;
  onChange(value: string): void;
  onTrace(): void;
  onCancel(): void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
};

export const HostInput: React.FC<Props> = props => {
  const [hasError, setHasError] = React.useState<boolean>(false);

  const onTrace = React.useCallback(() => {
    const isValid = isValidDomain(props.value) || isValidIP.v4(props.value);
    setHasError(!isValid);
    if (isValid) {
      props.onTrace();
    }
  }, [props.onTrace, props.value, setHasError]);

  const onKeyUp = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        onTrace();
      }
    },
    [onTrace]
  );

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange(e.target.value);
      if (hasError) {
        setHasError(false);
      }
    },
    [props.onChange, hasError, setHasError]
  );

  return (
    <div className={styles.root}>
      <div>
        <input
          placeholder={props.placeholder}
          className={styles.input}
          value={props.value}
          onChange={onChange}
          disabled={props.disabled}
          onKeyUp={onKeyUp}
          type="text"
        />
        <Button
          className={styles.button}
          onClick={props.loading ? props.onCancel : onTrace}
          disabled={!props.value || hasError}
        >
          <img
            src={props.loading ? cancelIcon : traceIcon}
            alt={props.loading ? 'Cancel' : 'Trace'}
          />
        </Button>
      </div>
      {hasError && <p className={styles.error}>Invalid host</p>}
    </div>
  );
};
