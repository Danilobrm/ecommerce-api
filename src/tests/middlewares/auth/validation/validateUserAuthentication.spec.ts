import { NextFunction, Request, Response } from 'express';
import { QueryRequestService } from '../../../../interfaces/services';
import { User } from '@prisma/client';
import { prismaMock } from '../../../../singleton';
import prismaClient from '../../../../prisma';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
  mockNext: NextFunction;
}

describe('test validateUserAuthentication', () => {
  const _dependencies: Dependencies = {
    mockRequest: {
      body: {
        email: 'teste@email.com',
        password: '12345678',
      },
    } as unknown as Request,
    mockResponse: {
      json: jest.fn((response: User) => JSON.stringify(response)),
      status: jest.fn((status: number) => status),
    } as unknown as Response,
    mockNext: jest.fn(),
  };

  it('should be called once', async () => {
    const sut = new MockValidateUserAuthentication();
    const spy = jest.spyOn(sut, 'validate');

    await sut.validate(_dependencies.mockRequest, _dependencies.mockResponse, _dependencies.mockNext);

    expect(spy).toBeCalledTimes(1);
  });

  it('should define req.body.id/req.body.name and call next function', async () => {
    const sut = new MockValidateUserAuthentication();

    const mockResolvedValue = {
      id: 'userid',
      name: 'teste',
      email: _dependencies.mockRequest.body.email,
      password: _dependencies.mockRequest.body.password,
      created_at: mockDate,
      updated_at: mockDate,
    };
    prismaMock.user.findFirst.mockResolvedValue(mockResolvedValue);

    const validate = await sut.validate(_dependencies.mockRequest, _dependencies.mockResponse, _dependencies.mockNext);
    expect(_dependencies.mockRequest.body).toHaveProperty('id', 'userid');
    expect(_dependencies.mockRequest.body).toHaveProperty('name', 'teste');
    expect(validate).toBeUndefined();
  });

  it('should return email error if no email was provided', async () => {
    const sut = new MockValidateUserAuthentication();

    _dependencies.mockRequest.body.email = '';
    _dependencies.mockRequest.body.password = '12345678';
    const validate = await sut.validate(_dependencies.mockRequest, _dependencies.mockResponse, _dependencies.mockNext);
    expect(_dependencies.mockRequest.body).toHaveProperty('email', '');
    expect(_dependencies.mockRequest.body).toHaveProperty('password', '12345678');
    expect(validate).toEqual(JSON.stringify({ status: 400, response: { email: 'Email inválido.' } }));
    // expect(_dependencies.mockRequest.body).toHaveProperty('name', 'teste');
  });

  it('should return password error if no password was provided', async () => {
    const sut = new MockValidateUserAuthentication();

    _dependencies.mockRequest.body.email = 'teste@email.com';
    _dependencies.mockRequest.body.password = '';
    const validate = await sut.validate(_dependencies.mockRequest, _dependencies.mockResponse, _dependencies.mockNext);

    expect(_dependencies.mockRequest.body).toHaveProperty('email', 'teste@email.com');
    expect(_dependencies.mockRequest.body).toHaveProperty('password', '');
    expect(validate).toEqual(JSON.stringify({ status: 400, response: { password: 'Senha inválida.' } }));
  });

  it('should return email error if no user was found', async () => {
    const sut = new MockValidateUserAuthentication();

    _dependencies.mockRequest.body.email = 'notfoundemail@email.com';
    _dependencies.mockRequest.body.password = '12345678';
    const mockResolvedValue = null;
    prismaMock.user.findFirst.mockResolvedValue(mockResolvedValue);
    const validate = await sut.validate(_dependencies.mockRequest, _dependencies.mockResponse, _dependencies.mockNext);

    expect(validate).toEqual(
      JSON.stringify({
        status: 400,
        response: { email: 'Usuário não encontrado.' },
      }),
    );
  });

  it('should return password error if the password dont match databases password', async () => {
    const sut = new MockValidateUserAuthentication();

    _dependencies.mockRequest.body.email = 'teste@email.com';
    _dependencies.mockRequest.body.password = '12345678';
    const mockResolvedValue = {
      id: 'userid',
      name: 'teste',
      email: _dependencies.mockRequest.body.email,
      password: _dependencies.mockRequest.body.password,
      created_at: mockDate,
      updated_at: mockDate,
    };
    prismaMock.user.findFirst.mockResolvedValue(mockResolvedValue);

    _dependencies.mockRequest.body.password = 'wrongpassword';
    const validate = await sut.validate(_dependencies.mockRequest, _dependencies.mockResponse, _dependencies.mockNext);

    expect(validate).toEqual(
      JSON.stringify({
        status: 400,
        response: { password: 'Senha incorreta.' },
      }),
    );
  });
});

export class MockValidateUserAuthentication {
  async validate(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!email)
      return res.json({
        status: 400,
        response: { email: 'Email inválido.' },
      });
    if (!password)
      return res.json({
        status: 400,
        response: { password: 'Senha inválida.' },
      });

    const queryUser = new MockQueryUserService();
    const user = await queryUser.queryUserByEmail(email);
    if (!user)
      return res.json({
        status: 400,
        response: { email: 'Usuário não encontrado.' },
      });

    const passwordMatch = password === user.password;
    if (!passwordMatch)
      return res.json({
        status: 400,
        response: { password: 'Senha incorreta.' },
      });

    req.body.name = user.name;
    req.body.id = user.id;
    next();
  }
}

interface QueryRequest {
  email: string;
}

export class MockQueryUserService implements QueryRequestService<QueryRequest, User | null> {
  async queryUserByEmail({ email }: QueryRequest): Promise<User | null> {
    const userAlreadyExists = await prismaClient.user.findFirst({ where: { email: email } });

    return userAlreadyExists;
  }
}

const mockDate = new Date() as Date;
