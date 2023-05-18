import prismaClient from '../../prisma';
import {
  IRepository,
  ModelInputs,
  ModelSelect,
} from '../../interfaces/repository';
import { ICustomerSelectedData } from '../../interfaces/customer';

export class Repository implements IRepository {
  async create<T extends keyof ModelInputs>(
    tableName: T,
    data: ModelInputs[T],
    select: ModelSelect[T],
  ): Promise<ICustomerSelectedData> {
    const response = await prismaClient[tableName].create({
      data: data,
      select: select,
    });

    return response as ICustomerSelectedData;
  }
}
