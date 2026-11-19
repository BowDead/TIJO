import { useCallback, useRef, useState } from "react";
import { isAbortError } from "@/shared/api/httpClient";
import { useAbortableRequest } from "@/shared/hooks/useAbortableRequest";
import { anonymizeCv, parseCv } from "../api/cvApi";
import { validateCvFile } from "../utils/validateCvFile";

const INITIAL_STATE = {
  status: "idle", // idle | uploading | done | error
  file: null,
  previewUrl: null,
  result: null,
  error: null,
};

function usePreviewUrl() {
  const previewUrlRef = useRef(null);

  return useCallback((file) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = file ? URL.createObjectURL(file) : null;
    return previewUrlRef.current;
  }, []);
}

export function useCvUpload() {
  const [state, setState] = useState(INITIAL_STATE);
  const { start, abort } = useAbortableRequest();
  const replacePreviewUrl = usePreviewUrl();

  const upload = useCallback(
    async (file) => {
      abort();

      const validationError = validateCvFile(file);
      if (validationError) {
        replacePreviewUrl(null);
        setState({ ...INITIAL_STATE, status: "error", error: validationError });
        return;
      }

      const signal = start();
      const previewUrl = replacePreviewUrl(file);
      setState({ ...INITIAL_STATE, status: "uploading", file, previewUrl });

      try {
        const parsed = await parseCv(file, signal);
        const { segments } = await anonymizeCv(parsed.text, signal);
        setState((prev) => ({
          ...prev,
          status: "done",
          result: { ...parsed, segments },
        }));
      } catch (error) {
        if (isAbortError(error)) return;
        setState((prev) => ({ ...prev, status: "error", error }));
      }
    },
    [abort, start, replacePreviewUrl],
  );

  const reset = useCallback(() => {
    abort();
    replacePreviewUrl(null);
    setState(INITIAL_STATE);
  }, [abort, replacePreviewUrl]);

  return { ...state, upload, reset };
}
