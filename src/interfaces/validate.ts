export interface Validator<T, U> {
  validate(data: T): U;
}

<<<<<<< HEAD
export interface Errors {
  emailErrors: string[];
  nameErrors: string[];
  passwordErros: string[];
=======
export interface ValidationError {
  message: string;
}

export interface Errors {
  emailErrors: string;
  nameErrors: string;
  passwordErrors: string;
>>>>>>> master
}
