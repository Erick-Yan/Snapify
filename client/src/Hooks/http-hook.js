import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // useRef forces activeHttpRequests to remain unchanged when useHttpClient re-runs when the component that uses 
  // this hook re-renders.
  const activeHttpRequests = useRef([]);

  // Sends an HTTP Request.
  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      // We will be working with AbortController in the scenario where you are signing in, and before the sign 
      // up is complete, you move to another page. This action should cancel the sign-in process. When abort 
      // is called from the AbortController, we reject the Promise that's being made (indicated by the await),
      // and we direct ourselves to the catch block.
      const httpAbortCtrl = new AbortController();
      // Each request has an AbortController connected to it.
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          // Below links the AbortController to this fetch request, which can be used to cancel this request.
          signal: httpAbortCtrl.signal 
        });

        const responseData = await response.json();

        // Once the response has been received, we can disconnect the AbortController from this request.
        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false); // Finish loading.
        return responseData; // Send the response data back to the component to use.
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  // useEffect can facilitate clean-up logic when a component unmounts (in the middle of authentication).
  useEffect(() => {
    // When we return a function inside useEffect function, it acts as a clean-up function before the next time useEffect
    // runs again or the component using the useEffect (or the http-hook) unmounts.
    return () => {
      // Iterate through all Abort Controllers connected to each HTTP request, and abort all those requests
      // when the component unmounts.
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};