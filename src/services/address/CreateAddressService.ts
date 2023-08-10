import { Address } from '@prisma/client';
import { CreateRequestService } from '../../interfaces/services';
import prismaClient from '../../prisma';

interface RequestData {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  postal_code: string;
  user: { connect: { id: string } };
}

export class CreateAddressService implements CreateRequestService<RequestData, Address> {
  async create(data: RequestData): Promise<Address> {
    const response = await prismaClient.address.create({ data: data });

    return response;
  }
}
