import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import { prismaMock } from '../../../../singleton';
import { ValidateUserAuthentication } from '../../../../middlewares/auth/validation/validateUserAuthentication';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
  mockNext: NextFunction;
}

describe('test validateUserAuthentication', () => {
  it('should be called once', async () => {
    const sut = new ValidateUserAuthentication();
    const spy = jest.spyOn(sut, 'validate');

    await sut.validate(_dependencies.mockRequest, _dependencies.mockResponse, _dependencies.mockNext);

    expect(spy).toBeCalledTimes(1);
  });

  it('should define req.body.id/req.body.name and call next function', async () => {
    const sut = new ValidateUserAuthentication();

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
    const sut = new ValidateUserAuthentication();

    _dependencies.mockRequest.body.email = '';
    _dependencies.mockRequest.body.password = '12345678';
    const validate = await sut.validate(_dependencies.mockRequest, _dependencies.mockResponse, _dependencies.mockNext);
    expect(_dependencies.mockRequest.body).toHaveProperty('email', '');
    expect(_dependencies.mockRequest.body).toHaveProperty('password', '12345678');
    expect(validate).toEqual(JSON.stringify({ status: 400, response: { email: 'Email inválido.' } }));
    // expect(_dependencies.mockRequest.body).toHaveProperty('name', 'teste');
  });

  it('should return password error if no password was provided', async () => {
    const sut = new ValidateUserAuthentication();

    _dependencies.mockRequest.body.email = 'teste@email.com';
    _dependencies.mockRequest.body.password = '';
    const validate = await sut.validate(_dependencies.mockRequest, _dependencies.mockResponse, _dependencies.mockNext);

    expect(_dependencies.mockRequest.body).toHaveProperty('email', 'teste@email.com');
    expect(_dependencies.mockRequest.body).toHaveProperty('password', '');
    expect(validate).toEqual(JSON.stringify({ status: 400, response: { password: 'Senha inválida.' } }));
  });

  it('should return email error if no user was found', async () => {
    const sut = new ValidateUserAuthentication();

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
    const sut = new ValidateUserAuthentication();

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

const _dependencies: Dependencies = {
  mockRequest: {
    body: {
      email: 'teste@email.com',
      password: '12345678',
    },
  } as unknown as Request,
  mockResponse: {
    status: function (status: number) {
      return status;
    },
    json: function (body: User) {
      return body;
    },
  } as unknown as Response,
  mockNext: jest.fn(),
};

const mockDate = new Date() as Date;
