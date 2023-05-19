import { Prisma } from '@prisma/client';
import prismaClient from '../../../prisma';
import {
  IAddressRepository,
  IAddressSelectedData,
} from '../../../interfaces/address';

export class MockRepository implements IAddressRepository {
  async create(
    data: Prisma.AddressCreateInput,
    select: Prisma.AddressSelect,
  ): Promise<IAddressSelectedData> {
    const response = await prismaClient.address.create({
      data: data,
      select: select,
    });

    return response as IAddressSelectedData;
  }
}

export const createSut = () => {
  return new MockRepository();
};

// data to be sent to create user
export const mockData: Prisma.AddressCreateInput = {
  street: 'rua 8',
  number: 'SN',
  city: 'luziânia',
  district: 'Parque estrela dalva VII',
  postal_code: '72830080',
  state: 'Goiás',
  customer: { connect: { id: 1 } },
};

export const mockSelect: Prisma.AddressSelect = {
  street: true,
  number: true,
  city: true,
  district: true,
  postal_code: true,
  state: true,
  customer_id: true,
};

// resolved data
export const mockResolvedAddress = {
  id: 1,
  complement: '',
  street: 'rua 8',
  number: 'SN',
  city: 'luziânia',
  district: 'Parque estrela dalva VII',
  postal_code: '72830080',
  state: 'Goiás',
  customer_id: 1,
};
