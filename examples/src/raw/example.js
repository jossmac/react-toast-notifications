export function useConnectivityListener() {
  const { addToast, removeToast } = useToasts();
  const [online, setOnline] = useState(
    () => (typeof window === 'undefined' ? false : window.navigator.onLine)
  );
  const toastId = useRef(null);

  // NOTE: online/offline event listeners omitted for brevity

  useUpdateEffect(
    () => {
      function onlineCallback() {
        removeToast(toastId.current);
        toastId.current = null;
      }
      function offlineCallback(id) {
        toastId.current = id;
      }

      const content = (
        <>
          <strong>{online ? 'Online' : 'Offline'}</strong>
          <div>
            {online
              ? 'Editing is available again'
              : 'Changes you make may not be saved'}
          </div>
        </>
      );

      const callback = online ? onlineCallback : offlineCallback;

      addToast(content, { appearance: 'info', autoDismiss: online }, callback);
    },
    [online]
  );
}
