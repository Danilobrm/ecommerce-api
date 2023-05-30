import { Request, Response } from 'express';
import { prismaMock } from '../../../../singleton';
import { CreateRequest } from '../../../../interfaces/controllers/CRUD';

class CreateUserController implements CreateRequest {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const customer = {
      id: 1,
      name: name,
      email: email,
    };

    return res.json(customer);
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
  return new CreateUserController();
};

describe('customer create account', () => {
  const sut = createSut();
  it('should call the function once', () => {
    const spy = jest.spyOn(sut, 'create');

    sut.create(mockRequest, mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

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

export const mockDate = new Date() as Date;
