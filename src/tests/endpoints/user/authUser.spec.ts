import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { AuthUserController } from '../../../controllers/user/AuthUserController';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
}

describe('test authenticate user generate JWT token', () => {
  it('should be called once', () => {
    const sut = new AuthUserController();
    const spy = jest.spyOn(sut, 'authenticate');

    sut.authenticate(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

  it('should return authentication object with users token if the data is equal to database data', async () => {
    const sut = new AuthUserController();
    mockJWTSECRET = 'abcde';

    const token = mockSign({ ..._dependencies.mockRequest.body, secretOrPrivateKey: mockJWTSECRET });
    const authenticate = await sut.authenticate(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(mockSign).toBeCalledWith({ email: 'teste@teste.com', id: 'userid', name: 'username', secretOrPrivateKey: 'abcde' });
    expect(authenticate).toEqual(JSON.stringify({ ..._dependencies.mockRequest.body, token }));
  });

  it('should return error if there is no JWT secret', async () => {
    const sut = new AuthUserController();
    mockJWTSECRET = '';
    const authenticate = await sut.authenticate(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(authenticate).toEqual(JSON.stringify('Invalid secret or private key'));
  });
});

interface ResponseData {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface MockSignParams {
  name: string;
  email: string;
  secretOrPrivateKey: string;
  id: string;
}

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

const mockSign = jest.fn(({ name, email, id, secretOrPrivateKey }: MockSignParams) =>
  sign({ name: name, email: email }, secretOrPrivateKey, { subject: id, expiresIn: '30d' }),
);

let mockJWTSECRET = '';
