import { Request, Response } from 'express';
import { AuthenticateRequest } from '../../../controllers/user/AuthUserController';
import { AuthenticateService } from '../../../interfaces/services';
import { sign } from 'jsonwebtoken';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
}

describe('test authenticate user generate JWT token', () => {
  const _dependencies: Dependencies = {
    mockRequest: {
      body: {
        id: 'userid',
        name: 'username',
        email: 'teste@teste.com',
      },
    } as unknown as Request,
    mockResponse: {
      json: jest.fn((response: ResponseData | string) => JSON.stringify(response)),
      status: jest.fn((status: number) => status),
    } as unknown as Response,
  };

  it('should be called once', () => {
    const sut = new MockAuthUserController();
    const spy = jest.spyOn(sut, 'authenticate');

    sut.authenticate(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

  it('should return authentication object with users token if the data is equal to database data', async () => {
    const sut = new MockAuthUserController();
    mockJWTSECRET = 'abcde';

    const token = mockSign({ ..._dependencies.mockRequest.body, secretOrPrivateKey: mockJWTSECRET });
    const authenticate = await sut.authenticate(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(mockSign).toBeCalledWith({ email: 'teste@teste.com', id: 'userid', name: 'username', secretOrPrivateKey: 'abcde' });
    expect(authenticate).toEqual(JSON.stringify({ ..._dependencies.mockRequest.body, token }));
  });

  it('should return error if there is no JWT secret', async () => {
    const sut = new MockAuthUserController();
    mockJWTSECRET = '';
    const authenticate = await sut.authenticate(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(authenticate).toEqual(JSON.stringify('Invalid secret or private key'));
  });
});

export class MockAuthUserController implements AuthenticateRequest {
  async authenticate(req: Request, res: Response): Promise<Response> {
    const { name, email, id } = req.body;

    const authUserService = new MockAuthUserService();
    const auth = await authUserService.authenticate({ id, name, email });

    return res.json(auth);
  }
}

interface RequestData {
  id: string;
  name: string;
  email: string;
}

interface ResponseData {
  id: string;
  name: string;
  email: string;
  token: string;
}

export class MockAuthUserService implements AuthenticateService<RequestData, ResponseData | string> {
  async authenticate(data: RequestData): Promise<ResponseData | string> {
    const { name, email, id } = data;

    const secretOrPrivateKey = mockJWTSECRET;
    if (!secretOrPrivateKey) return 'Invalid secret or private key';

    // gerar token para o usuario
    const token = mockSign({ name, email, secretOrPrivateKey, id });

    return { ...data, token: token };
  }
}

interface MockSignParams {
  name: string;
  email: string;
  secretOrPrivateKey: string;
  id: string;
}

const mockSign = jest.fn(({ name, email, id, secretOrPrivateKey }: MockSignParams) =>
  sign({ name: name, email: email }, secretOrPrivateKey, { subject: id, expiresIn: '30d' }),
);

let mockJWTSECRET = '';
