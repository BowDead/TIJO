// Błędy domenowe nie znają protokołu HTTP — kody statusu przypisuje errorHandler.
export class DomainError extends Error {
  constructor(code, params) {
    super(code);
    this.name = new.target.name;
    this.code = code;
    this.params = params;
  }
}

export class InvalidInputError extends DomainError {}

export class InputTooLargeError extends DomainError {}

export class UnsupportedFileTypeError extends DomainError {}

export class NoTextContentError extends DomainError {}
