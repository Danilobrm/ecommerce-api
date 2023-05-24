import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ICreateAddress } from '../../interfaces/address';
import { Repository } from '../../services/address/repository';

export class CreateAddress implements ICreateAddress {
  async create(req: Request, res: Response): Promise<Response> {
    const { street, number, district, city, state, postal_code, customer_id } =
      req.body;
    const createAddressRepository = new Repository();

    const addressData: Prisma.AddressCreateInput = {
      street: street,
      number: number,
      district: district,
      city: city,
      state: state,
      postal_code: postal_code,
      customer: { connect: { id: customer_id } },
    };

    const select: Prisma.AddressSelect = {
      id: true,
      street: true,
      number: true,
      district: true,
      city: true,
      state: true,
      postal_code: true,
      customer_id: true,
    };

    const address = await createAddressRepository.create(addressData, select);

    return res.json(address);
  }
}
