export interface Validator<T, U> {
  validate(data: T): U;
}
