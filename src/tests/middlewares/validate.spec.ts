import { NextFunction, Request, Response } from 'express';
import { ValidationError, Validator } from '../../interfaces/validate';

class PasswordValidator implements Validator<string, string[]> {
  passwordErros: string[] = [];
  validate(password: string): string[] {
    if (!password) this.passwordErros.push('erro');
    return this.passwordErros;
  }
}

class NameValidator implements Validator<string, string[]> {
  nameErros: string[] = [];
  validate(name: string): string[] {
    if (!name) this.nameErros.push('erro');
    return this.nameErros;
  }
}

class ValidateUser {
  errors: Record<string, ValidationError> = {};
  async userValidate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Record<string, ValidationError> | void> {
    const { email } = req.body;

    const validateEmail = new EmailValidator();
    const emailErrors = validateEmail.validate(email);

    if (emailErrors) {
      this.errors.email = { message: emailErrors };
      return this.errors;
    }

    next();
  }
}

class EmailValidator implements Validator<string, string | void> {
  validate(email: string): string | void {
    if (!email) return 'erro';
  }
}

const createSut = () => {
  return new ValidateUser();
};

const mockRequest = {
  body: {
    name: 'test',
    email: 'test@example.com',
    password: '12345678',
  },
} as unknown as Request;

const mockNext = () => jest.fn();
const mockResponse = jest.fn() as unknown as Response;

describe('test data validator', () => {
  const sut = createSut();
  const spyValidate = jest.spyOn(sut, 'userValidate');

  it('should call validate method once', () => {
    sut.userValidate(mockRequest, mockResponse, mockNext);

    expect(spyValidate).toHaveBeenCalledTimes(1);
  });

  it('should call next() if no errors is given', async () => {
    expect(
      await sut.userValidate(mockRequest, mockResponse, mockNext),
    ).toBeUndefined();
  });

  it('should return error if no data was provided', async () => {
    mockRequest.body = {
      name: '',
      email: '',
      password: '',
    };
    expect(await sut.userValidate(mockRequest, mockResponse, mockNext)).toEqual(
      {
        email: { message: 'erro' },
      },
    );
  });
});
