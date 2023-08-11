import { Request, Response } from 'express';
import { CreateRequest } from '../../../../interfaces/controllers/CRUD';
import { prismaMock } from '../../../../singleton';
import { hash } from 'bcryptjs';
import { CreateUserService } from '../../../../services/user/CreateUserService';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
}

describe('user create account test', () => {
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

    const sut = new CreateUserService();
    const response = await sut.create(_dependencies.mockRequest.body);

    expect(response).toEqual(mockResolvedValue);
  });
});

class MockCreateUserController implements CreateRequest {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    const passwordHash = await hash(password, 8);

    const createUserService = new CreateUserService();
    const user = await createUserService.create({ name, email, password: passwordHash });

    return res.json(user);
  }
}

interface ResponseData {
  id: string;
  name: string;
  email: string;
}

const _dependencies: Dependencies = {
  mockRequest: { body: { name: 'teste', email: 'teste@email.com', password: '12345678' } } as unknown as Request,
  mockResponse: {
    json: jest.fn((response: ResponseData) => JSON.stringify(response)),
    status: jest.fn((status: number) => status),
  } as unknown as Response,
};

const mockDate = new Date() as Date;
