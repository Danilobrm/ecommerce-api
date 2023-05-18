import { Request, Response } from 'express';

export interface ICreateCustomer {
  create(req: Request, res: Response): Promise<Response>;
}

export interface ICustomerData {
  name: string;
  email: string;
  password: string;
}

export interface ICustomerSelectedData {
  id: number;
  name: string;
  email: string;
}
