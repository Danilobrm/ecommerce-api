import { Request, Response } from 'express';
import { CreateRequest } from '../../../../interfaces/controllers/CRUD';
import { prismaMock } from '../../../../singleton';
import prismaClient from '../../../../prisma';
import { hash } from 'bcryptjs';

class MockCreateUserController implements CreateRequest {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    const passwordHash = await hash(password, 8);

    const createUserService = new MockCreateUserService();
    const user = await createUserService.execute({ name, email, password: passwordHash });

    return res.json(user);
  }
}

export interface IUserCreateData {
  name: string;
  email: string;
  password: string;
}

export class MockCreateUserService {
  async execute({ name, email, password }: IUserCreateData) {
    const response = await prismaClient.user.create({
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

const createSut = () => {
  return new MockCreateUserController();
};

describe('user create account', () => {
  const sut = createSut();
  it('should call the function once', () => {
    const spy = jest.spyOn(sut, 'create');

    sut.create(mockRequest, mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

  it('should return a user created json', async () => {
    prismaMock.user.create.mockResolvedValue({
      id: '1',
      name: 'test',
      email: 'test@example.com',
      password: '12345678',
      created_at: mockDate,
      updated_at: mockDate,
    });

    await expect(sut.create(mockRequest, mockResponse)).resolves.toEqual(
      JSON.stringify({
        user: {
          id: '1',
          name: 'test',
          email: 'test@example.com',
          password: '12345678',
          created_at: mockDate,
          updated_at: mockDate,
        },
      }),
    );
  });
});

export const mockDate = new Date() as Date;

const mockRequest = {
  body: {
    name: 'test',
    email: 'test@example.com',
    password: '12345678',
  },
} as unknown as Request;

const mockResponse = {} as unknown as Response;
mockResponse.json = (data: Request): Response => JSON.stringify(data) as unknown as Response;
