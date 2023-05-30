export interface IUserAuthData {
  email: string;
  password: string;
}

export interface IUserAuthReturn {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface AuthUserService {
  authenticate({ email, password }: IUserAuthData): Promise<IUserAuthReturn>;
}
