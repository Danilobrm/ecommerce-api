export interface CreateRequestService<T, U = undefined> {
  create(data: T): Promise<U | T>;
}

export interface ReadRequestService<T, U = undefined> {
  read(data: T): Promise<U | T>;
}
export interface QueryRequestService<T, U = undefined> {
  queryUserByEmail(data: T): Promise<U | T>;
}

export interface DeleteService<T, U> {
  delete(data: T): Promise<U>;
}

export interface AuthenticateService<T, U> {
  authenticate(data: T): Promise<U>;
}
