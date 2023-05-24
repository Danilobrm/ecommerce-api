import { Prisma } from '@prisma/client';
import {
  ICustomerRepository,
  ICustomerSelectedData,
} from '../../interfaces/customer';
import prismaClient from '../../prisma';

export class Repository implements ICustomerRepository {
  async create(
    data: Prisma.CustomerCreateInput,
    select: Prisma.CustomerSelect,
  ): Promise<ICustomerSelectedData> {
    const response = await prismaClient.customer.create({
      data: data,
      select: select,
    });

    return response as ICustomerSelectedData;
  }
}
