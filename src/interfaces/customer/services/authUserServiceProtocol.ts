export interface IUserAuthData {
  email: string;
  password: string;
}

export interface IUserAuthReturn {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface IAuthUserService {
  authenticate({
    email,
    password,
  }: IUserAuthData): Promise<IUserAuthReturn | void>;
}
