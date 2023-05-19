import { Prisma } from '@prisma/client';
import prismaClient from '../../prisma';
import {
  IAddressRepository,
  IAddressSelectedData,
} from '../../interfaces/address';

export class Repository implements IAddressRepository {
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
