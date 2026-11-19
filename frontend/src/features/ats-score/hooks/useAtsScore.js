import { useEffect, useState } from "react";
import { isAbortError } from "@/shared/api/httpClient";
import { useAbortableRequest } from "@/shared/hooks/useAbortableRequest";
import { scoreCv } from "../api/atsApi";

const INITIAL_STATE = { forResult: null, status: "idle", data: null, error: null };

// Zwraca stan po zakończeniu żądania albo null, gdy żądanie anulowano
async function fetchScoreState(result, jobDescription, previousData, signal) {
  try {
    const data = await scoreCv(result.text, jobDescription, signal);
    return { forResult: result, status: "done", data, error: null };
  } catch (error) {
    if (isAbortError(error)) return null;
    return { forResult: result, status: "error", data: previousData, error };
  }
}

// Ocena liczona jest automatycznie dla każdego nowego CV,
// a potem można ją przeliczyć z treścią ogłoszenia.
export function useAtsScore(cvResult) {
  const [state, setState] = useState(INITIAL_STATE);
  const { start, abort } = useAbortableRequest();

  useEffect(() => {
    if (!cvResult) return undefined;
    fetchScoreState(cvResult, "", null, start()).then((nextState) => {
      if (nextState) setState(nextState);
    });
    return abort;
  }, [cvResult, start, abort]);

  const isCurrent = cvResult !== null && state.forResult === cvResult;
  const currentData = isCurrent ? state.data : null;

  function rescore(jobDescription) {
    if (!cvResult) return;
    setState({ forResult: cvResult, status: "loading", data: currentData, error: null });
    fetchScoreState(cvResult, jobDescription, currentData, start()).then(
      (nextState) => {
        if (nextState) setState(nextState);
      },
    );
  }

  return {
    data: currentData,
    status: isCurrent ? state.status : cvResult ? "loading" : "idle",
    error: isCurrent ? state.error : null,
    rescore,
  };
}
