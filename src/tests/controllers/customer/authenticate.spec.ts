import { Request, Response } from 'express';
import { AuthenticateRequest } from '../../../interfaces/customer/controllers/authUserControllerProtocol';

class MockAuthenticateCustomer implements AuthenticateRequest {
  async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const user = {
      id: 1,
      name: 'danilo',
      email: email,
      token: 'token',
    };

    return res.json(user);
  }
}

const createSut = () => {
  return new MockAuthenticateCustomer();
};

const mockReq = {
  body: {
    email: 'danilo@teste.com',
    password: '123456',
  },
} as unknown as Request;

const mockRes = {} as unknown as Response;
mockRes.json = (data: Request): Response =>
  JSON.stringify(data) as unknown as Response;

describe('should login user on application', () => {
  it('should call once', async () => {
    const sut = createSut();
    const login = await sut.authenticate(mockReq, mockRes);
    expect(login).toEqual(
      JSON.stringify({
        id: 1,
        name: 'danilo',
        email: 'danilo@teste.com',
        token: 'token',
      }),
    );
  });
});
