import { useRef, useState } from "react";
import { scoreCv } from "@/features/cv-upload/api/cvApi";

// Wynik z uploadu (bez ogłoszenia) można przeliczyć ponownie z treścią ogłoszenia
export function useAtsScore(cv) {
  const [state, setState] = useState({ forResult: null, status: "idle" });
  const controllerRef = useRef(null);

  const result = cv.status === "done" ? cv.result : null;
  const own = result !== null && state.forResult === result;

  async function rescore(jobDescription) {
    if (!result) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState({ forResult: result, status: "loading", data: own ? state.data : null });
    try {
      const data = await scoreCv(result.text, jobDescription, controller.signal);
      setState({ forResult: result, status: "done", data });
    } catch (error) {
      if (error.name === "AbortError") return;
      setState({ forResult: result, status: "error", error });
    }
  }

  return {
    data: own && state.data ? state.data : (result?.ats ?? null),
    status: own ? state.status : result ? "done" : "idle",
    error: own ? state.error : null,
    rescore,
  };
}
