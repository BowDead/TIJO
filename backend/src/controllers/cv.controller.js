import { parseCv } from "../services/cv.service.js";
import { anonymizeCv } from "../services/anonymizer.service.js";
import { scoreCv } from "../services/ats/ats-score.service.js";
import { anonymizedCvView, atsScoreView, parsedCvView } from "../views/cv.view.js";

export async function postParseCv(req, res) {
  const parsedCv = await parseCv(req.file);
  res.json(parsedCvView(parsedCv));
}

export async function postAnonymizeCv(req, res) {
  const segments = anonymizeCv(req.body?.text);
  res.json(anonymizedCvView(segments));
}

export async function postAtsScore(req, res) {
  const result = scoreCv(req.body?.text, req.body?.jobDescription);
  res.json(atsScoreView(result));
}
