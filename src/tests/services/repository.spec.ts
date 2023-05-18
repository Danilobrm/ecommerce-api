import { ICustomerSelectedData } from '../../interfaces/customer';
import {
  IRepository,
  ModelInputs,
  ModelSelect,
} from '../../interfaces/repository';
import prismaClient from '../../prisma';
import { prismaMock } from '../../singleton';

class Repository implements IRepository {
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

const select: ModelSelect['customer'] = {
  id: true,
  name: true,
  email: true,
};

const createSut = () => {
  return new Repository();
};

const mockDate = new Date() as Date;

const mockdata = {
  name: 'test',
  email: 'test@example.com',
  password: '12345678',
};

describe('test database repository', () => {
  it('should create user', async () => {
    const sut = createSut();

    const mockResolvedUser = {
      id: 1,
      name: 'test',
      email: 'test@example.com',
      password: '12345678',
      created_at: mockDate,
      updated_at: mockDate,
    };

    prismaMock.customer.create.mockResolvedValue(mockResolvedUser);

    await expect(sut.create('customer', mockdata, select)).resolves.toEqual({
      id: 1,
      name: 'test',
      email: 'test@example.com',
      password: '12345678',
      created_at: mockDate,
      updated_at: mockDate,
    });
  });
});
