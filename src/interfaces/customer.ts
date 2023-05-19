import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

export interface ICreateCustomer {
  create(req: Request, res: Response): Promise<Response>;
}

export interface ICustomerSelectedData {
  id: number;
  name: string;
  email: string;
}

export interface ICustomerRepository {
  create(
    data: Prisma.CustomerCreateInput,
    select: Prisma.CustomerSelect,
  ): Promise<ICustomerSelectedData>;
}
