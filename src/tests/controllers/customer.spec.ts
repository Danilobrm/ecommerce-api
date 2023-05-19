import { Request, Response } from 'express';
import { mockDate } from '../services/customer/mockRepository';
import { ICreateCustomer } from '../../interfaces/customer';
import { prismaMock } from '../../singleton';

class CreateCustomer implements ICreateCustomer {
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
  return new CreateCustomer();
};

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
