export interface Validator<T, U> {
  validate(data: T): U;
}

export interface Errors {
  emailErrors: string[];
  nameErrors: string[];
  passwordErros: string[];
}
