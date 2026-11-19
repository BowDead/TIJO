import { request } from "@/shared/api/httpClient";

export function scoreCv(text, jobDescription, signal) {
  return request("/cv/ats-score", {
    method: "POST",
    body: { text, jobDescription },
    signal,
  });
}
