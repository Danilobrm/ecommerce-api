import { Request, Response } from 'express';
import { CreateRequest } from '../../../../interfaces/controllers/CRUD';
import { prismaMock } from '../../../../singleton';
import prismaClient from '../../../../prisma';
import { hash } from 'bcryptjs';
import { CreateRequestService } from '../../../../interfaces/services';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
}

describe('user create account test', () => {
  const _dependencies: Dependencies = {
    mockRequest: { body: { name: 'teste', email: 'teste@email.com', password: '12345678' } } as unknown as Request,
    mockResponse: {
      json: jest.fn((response: ResponseData) => JSON.stringify(response)),
      status: jest.fn((status: number) => status),
    } as unknown as Response,
  };

  it('should be called once', async () => {
    const sut = new MockCreateUserController();
    const spy = jest.spyOn(sut, 'create');

    await sut.create(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

  it('should return a user json made with res.json', async () => {
    const mockRequest = { body: { name: 'teste', email: 'teste@email.com', password: '12345678' } } as Request;

    const mockResolvedValue = { id: '1', ...mockRequest.body, created_at: mockDate, updated_at: mockDate };
    prismaMock.user.create.mockResolvedValue(mockResolvedValue);

    const sut = new MockCreateUserController();
    const response = await sut.create(_dependencies.mockRequest, _dependencies.mockResponse);
    expect(response).toEqual(JSON.stringify(mockResolvedValue));
  });

  it('should return a user object created from the database', async () => {
    const mockRequest = { body: { name: 'teste', email: 'teste@email.com', password: '12345678' } } as Request;

    const mockResolvedValue = { id: '1', ...mockRequest.body, created_at: mockDate, updated_at: mockDate };
    prismaMock.user.create.mockResolvedValue(mockResolvedValue);

    const sut = new MockCreateUserService();
    const response = await sut.create(_dependencies.mockRequest.body);

    expect(response).toEqual(mockResolvedValue);
  });
});

class MockCreateUserController implements CreateRequest {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    const passwordHash = await hash(password, 8);

    const createUserService = new MockCreateUserService();
    const user = await createUserService.create({ name, email, password: passwordHash });

    return res.json(user);
  }
}

interface RequestData {
  name: string;
  email: string;
  password: string;
}

interface ResponseData {
  id: string;
  name: string;
  email: string;
}

class MockCreateUserService implements CreateRequestService<RequestData, ResponseData> {
  async create({ name, email, password }: RequestData): Promise<ResponseData> {
    const user = await prismaClient.user.create({
      data: { name: name, email: email, password: password },
      select: { id: true, name: true, email: true },
    });

    return user;
  }
}

export const mockDate = new Date() as Date;
