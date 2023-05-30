export interface Validator<T, U> {
  validate(data: T): U;
}

export interface ValidationError {
  message: string;
}

export interface Errors {
  emailErrors: string;
  nameErrors: string;
  passwordErrors: string;
}
