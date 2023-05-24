import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

export interface ICreateAddress {
  create(req: Request, res: Response): Promise<Response>;
}

export interface IAddressSelectedData {
  street: string;
  number: string;
  city: string;
  district: string;
  postal_code: string;
  state: string;
  customer_id: number;
}

export interface IAddressRepository {
  create(
    data: Prisma.AddressCreateInput,
    select: Prisma.AddressSelect,
  ): Promise<IAddressSelectedData>;
}
