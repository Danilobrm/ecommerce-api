import {
  IRepository,
  ModelInputs,
  ModelSelect,
  ModelSelectReturn,
} from '../../interfaces/repository';
import prismaClient from '../../prisma';
import { prismaMock } from '../../singleton';
import { mockDate, mockData, mockSelect, mockResolvedUser } from './mockData';

export class MockRepository implements IRepository {
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

describe('test database repository', () => {
  const sut = createSut();

  it('check if the functions was called with its params', async () => {
    const spyRepository = jest.spyOn(sut, 'create');

    await sut.create('customer', mockData, mockSelect);

    expect(spyRepository).toBeCalledTimes(1);
    expect(spyRepository).toHaveBeenCalledWith(
      'customer',
      mockData,
      mockSelect,
    );
  });

  it('should create user', async () => {
    prismaMock.customer.create.mockResolvedValue(mockResolvedUser);

    await expect(sut.create('customer', mockData, mockSelect)).resolves.toEqual(
      {
        id: 1,
        name: 'test',
        email: 'test@example.com',
        password: '12345678',
        created_at: mockDate,
        updated_at: mockDate,
      },
    );
  });
});
