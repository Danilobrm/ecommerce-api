export interface IUserCreateData {
  name: string;
  email: string;
  password: string;
}

export interface IUserSelectedData {
  id: number;
  name: string;
  email: string;
}

export interface ICreateUserService {
  create({
    name,
    email,
    password,
  }: IUserCreateData): Promise<IUserSelectedData>;
}
