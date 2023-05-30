import { ICreateUserService } from '../../../../interfaces/customer/services/createUserServiceProtocol';
import { IUserCreateData } from '../../../../interfaces/customer/services/createUserServiceProtocol';
import { IUserSelectedData } from '../../../../interfaces/customer/services/createUserServiceProtocol';
import prismaClient from '../../../../prisma';
import { prismaMock } from '../../../../singleton';

export class MockCreateCustomerRepository implements ICreateUserService {
  async create({
    name,
    email,
    password,
  }: IUserCreateData): Promise<IUserSelectedData> {
    const response = await prismaClient.customer.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return response;
  }
}

export const createSut = () => {
  return new MockCreateCustomerRepository();
};

afterEach(() => jest.clearAllMocks());

describe('test create customer on database', () => {
  const sut = createSut();

  it('should create customer', async () => {
    prismaMock.customer.create.mockResolvedValue(mockResolvedUser);

    await expect(sut.create(mockData)).resolves.toEqual({
      id: '1',
      name: 'test',
      email: 'test@example.com',
      password: '12345678',
      created_at: mockDate,
      updated_at: mockDate,
    });
  });
});

// data to be sent to create user
export const mockData: IUserCreateData = {
  name: 'test',
  email: 'test@example.com',
  password: '12345678',
};

// resolved data
export const mockDate = new Date() as Date;
export const mockResolvedUser = {
  id: '1',
  name: 'test',
  email: 'test@example.com',
  password: '12345678',
  created_at: mockDate,
  updated_at: mockDate,
};
