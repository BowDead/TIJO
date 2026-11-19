import { useCallback, useRef } from "react";

// Każde nowe żądanie anuluje poprzednie, które jeszcze trwa
export function useAbortableRequest() {
  const controllerRef = useRef(null);

  const start = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    return controller.signal;
  }, []);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  return { start, abort };
}
