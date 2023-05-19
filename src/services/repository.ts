import prismaClient from '../prisma';
import {
  IRepository,
  ModelInputs,
  ModelSelect,
  ModelSelectReturn,
} from '../interfaces/repository';

export class Repository implements IRepository {
  async create<T extends keyof ModelInputs>(
    tableName: T,
    data: ModelInputs[T],
    select: ModelSelect[T],
  ): Promise<ModelSelectReturn[T]> {
    const response = (await prismaClient[tableName].create({
      data: data,
      select: select,
    })) as ModelSelectReturn[T];

    return response;
  }
}
