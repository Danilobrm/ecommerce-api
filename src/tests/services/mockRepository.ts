import {
  IRepository,
  ModelInputs,
  ModelSelect,
  ModelSelectReturn,
} from '../../interfaces/repository';
import prismaClient from '../../prisma';

class MockRepository implements IRepository {
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

export const createSut = () => {
  return new MockRepository();
};
