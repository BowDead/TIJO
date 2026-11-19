import { HttpError } from "../errors/HttpError.js";
import {
  DomainError,
  InputTooLargeError,
  InvalidInputError,
  NoTextContentError,
  UnsupportedFileTypeError,
} from "../errors/domain-errors.js";

const STATUS_BY_DOMAIN_ERROR = new Map([
  [InvalidInputError, 400],
  [InputTooLargeError, 413],
  [UnsupportedFileTypeError, 415],
  [NoTextContentError, 422],
]);

function statusFor(err) {
  if (err instanceof DomainError) {
    return STATUS_BY_DOMAIN_ERROR.get(err.constructor) ?? 400;
  }
  return err.status || 500;
}

function genericCodeFor(status) {
  if (status === 413) {
    return "PAYLOAD_TOO_LARGE";
  }
  return status < 500 ? "INVALID_INPUT" : "INTERNAL_ERROR";
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = statusFor(err);

  if (status >= 500) {
    console.error(err);
  }

  if (err instanceof HttpError || err instanceof DomainError) {
    return res.status(status).json({ error: err.code, params: err.params });
  }

  res.status(status).json({ error: genericCodeFor(status) });
}
