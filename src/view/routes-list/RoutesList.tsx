import classNames from 'classnames';
import React, { useLayoutEffect } from 'react';
import Loader from 'react-spinners/PuffLoader';
import { Route, Props as RouteProps } from './route/Route';
import mapPointIcon from './map-point.svg';
import styles from './RoutesList.css';

export type Props = {
  routes: Omit<RouteProps, 'type' | 'connect'>[];
  error?: string;
  loading?: boolean;
};

type ScrollStateGetter = () => ({ isMax: boolean; max: number } | void);

export const RoutesList: React.FC<Props> = props => {
  const rootRef = React.useRef<HTMLDivElement>(null);

  const [scrollToBottom, setScrollToBottom] = React.useState<boolean>(true);

  const getScrollState = React.useMemo<ScrollStateGetter>(
    () => () => {
      if (!rootRef.current) {
        return;
      }

      const max = rootRef.current.scrollHeight - rootRef.current.clientHeight;

      return {
        isMax: max === rootRef.current.scrollTop,
        max,
      };
    },
    []
  );

  const onScroll = React.useCallback(() => {
    const state = getScrollState();

    if (!state) {
      return;
    }

    if (state.isMax && !scrollToBottom) {
      setScrollToBottom(true);
    } else if (scrollToBottom) {
      setScrollToBottom(false);
    }
  }, [setScrollToBottom, getScrollState]);

  useLayoutEffect(() => {
    const state = getScrollState();

    if (!state) {
      return;
    }

    if (!state.isMax && scrollToBottom) {
      rootRef.current!.scrollTop = state.max;
    }
  }, [props.routes, scrollToBottom, getScrollState]);

  return (
    <div
      ref={rootRef}
      className={classNames(styles.root, {[styles.loading]: props.loading})}
      onScroll={onScroll}
    >
      {
        props.routes.length !== 0 && (
          <ul>
            {
              props.routes.map((route, index) => (
                <Route
                  key={route.ip}
                  {...route}
                  type={
                    index === 0
                      ? 'start'
                      : !props.loading && (props.routes.length - 1 === index)
                      ? 'end'
                      : undefined
                  }
                  connect={index !== 0}
                />
              ))
            }
          </ul>
        )
      }
      {
        !props.loading && props.routes.length === 0 && (
          <div className={styles.empty}>
            <div>
              <img src={mapPointIcon} alt="Icon" />
              <p>No data</p>
            </div>
          </div>
        )
      }
      {
        !!props.loading && (
          <div className={styles.loaderContainer}>
            <Loader
              color="#F7F7F7"
              loading
            />
          </div>
        )
      }
    </div>
  );
};
