import { Prisma } from '@prisma/client';
import prismaClient from '../../../prisma';
import {
  ICustomerRepository,
  ICustomerSelectedData,
} from '../../../interfaces/customer';

export class MockRepository implements ICustomerRepository {
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

export const createSut = () => {
  return new MockRepository();
};

// data to be sent to create user
export const mockData: Prisma.CustomerCreateInput = {
  name: 'test',
  email: 'test@example.com',
  password: '12345678',
};

export const mockSelect: Prisma.CustomerSelect = {
  id: true,
  name: true,
  email: true,
};

// resolved data
export const mockDate = new Date() as Date;
export const mockResolvedUser = {
  id: 1,
  name: 'test',
  email: 'test@example.com',
  password: '12345678',
  created_at: mockDate,
  updated_at: mockDate,
};
