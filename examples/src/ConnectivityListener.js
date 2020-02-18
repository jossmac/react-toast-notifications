import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useToasts } from '../../src';

export const ConnectivityListener = () => {
  useConnectivityListener();
  return null;
};

export function useConnectivityListener() {
  const { addToast, removeToast } = useToasts();
  const [isOnline, setOnline] = useState(
    window ? window.navigator.onLine : false
  );
  const toastId = useRef(null);

  useEffect(() => {
    const onlineHandler = () => setOnline(true);
    const offlineHandler = () => setOnline(false);

    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);

    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }, []);

  useUpdateEffect(
    () => {
      const content = (
        <Fragment>
          <strong>{isOnline ? 'Online' : 'Offline'}</strong>
          <div>
            {isOnline
              ? 'Editing is available again'
              : 'Changes you make may not be saved'}
          </div>
        </Fragment>
      );

      // remove the existing offline notification if it exists, otherwise store
      // the added toast id for use later
      const callback = isOnline
        ? () => {
            removeToast(toastId.current);
            toastId.current = null;
          }
        : id => {
            toastId.current = id;
          };

      // add the applicable toast
      addToast(
        content,
        { appearance: 'info', autoDismiss: isOnline },
        callback
      );
    },
    [isOnline]
  );
}

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * @param {Function} effect
 */
function useUpdateEffect(effect, deps = []) {
  const initialMount = useRef(true);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
    } else {
      effect();
    }
  }, deps);
}
