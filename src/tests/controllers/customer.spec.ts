import { hash } from 'bcryptjs';
import {
  ICreateCustomer,
  ICustomerData,
  ICustomerSelectedData,
} from '../../interfaces/customer';
import prismaClient from '../../prisma';
import { Request, Response } from 'express';
import { prismaMock } from '../../singleton';
import {
  IRepository,
  ModelInputs,
  ModelSelect,
} from '../../interfaces/repository';

class CreateCustomer implements ICreateCustomer {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createCustomerService = new Repository();

    const userData: ICustomerData = {
      name,
      email,
      password: await hash(password, 8),
    };

    const select: ModelSelect['customer'] = {
      id: true,
      name: true,
      email: true,
    };

    const customer = await createCustomerService.create(
      'customer',
      userData,
      select,
    );

    return res.json(customer);
  }
}

class Repository implements IRepository {
  async create<T extends 'customer'>(
    tableName: T,
    data: ModelInputs[T],
    select: ModelSelect[T],
  ): Promise<ICustomerSelectedData> {
    await prismaClient[tableName].create({
      data: data,
      select: select,
    });

    return {
      id: 1,
      name: data.name,
      email: data.email,
    };
  }
}

const mockRequest = {
  body: {
    name: 'test',
    email: 'test@example.com',
    password: '12345678',
  },
} as unknown as Request;

const mockResponse = {} as unknown as Response;
mockResponse.json = (data: Request): Response =>
  JSON.stringify(data) as unknown as Response;

const createSut = () => {
  return new CreateCustomer();
};

const mockDate = new Date() as Date;

describe('customer create account', () => {
  const sut = createSut();
  it('should return a customer created json', async () => {
    const mockResolvedUser = {
      id: 1,
      name: 'test',
      email: 'test@example.com',
      password: '12345678',
      created_at: mockDate,
      updated_at: mockDate,
    };

    prismaMock.customer.create.mockResolvedValue(mockResolvedUser);

    await expect(sut.create(mockRequest, mockResponse)).resolves.toEqual(
      JSON.stringify({
        id: 1,
        name: 'test',
        email: 'test@example.com',
      }),
    );
  });
});
