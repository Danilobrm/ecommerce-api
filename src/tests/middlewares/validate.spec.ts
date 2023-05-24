import { NextFunction, Request, Response } from 'express';
<<<<<<< HEAD
import { Errors, Validator } from '../../interfaces/validate';

class EmailValidator implements Validator<string, Promise<string[]>> {
  emailErros: string[] = [];
  async validate(email: string): Promise<string[]> {
    if (!email) this.emailErros.push('erro');
    return this.emailErros;
  }
}
=======
import { ValidationError, Validator } from '../../interfaces/validate';
>>>>>>> master

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
<<<<<<< HEAD
  async validate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Errors | void> {
    const { name, email, password } = req.body;

    const emailValidator: Validator<
      string,
      Promise<string[]>
    > = new EmailValidator();
    const passwordValidator: Validator<string, string[]> =
      new PasswordValidator();
    const nameValidator: Validator<string, string[]> = new NameValidator();

    const errors: Errors = {
      emailErrors: await emailValidator.validate(email),
      nameErrors: nameValidator.validate(name),
      passwordErros: passwordValidator.validate(password),
    };

    for (const error in errors) {
      if (errors[error as keyof Errors].length > 0) return errors;
    }
=======
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

>>>>>>> master
    next();
  }
}

<<<<<<< HEAD
=======
class EmailValidator implements Validator<string, string | void> {
  validate(email: string): string | void {
    if (!email) return 'erro';
  }
}

>>>>>>> master
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
<<<<<<< HEAD
  const spyValidate = jest.spyOn(sut, 'validate');

  it('should call validate method once', () => {
    sut.validate(mockRequest, mockResponse, mockNext);
=======
  const spyValidate = jest.spyOn(sut, 'userValidate');

  it('should call validate method once', () => {
    sut.userValidate(mockRequest, mockResponse, mockNext);
>>>>>>> master

    expect(spyValidate).toHaveBeenCalledTimes(1);
  });

  it('should call next() if no errors is given', async () => {
    expect(
<<<<<<< HEAD
      await sut.validate(mockRequest, mockResponse, mockNext),
=======
      await sut.userValidate(mockRequest, mockResponse, mockNext),
>>>>>>> master
    ).toBeUndefined();
  });

  it('should return error if no data was provided', async () => {
    mockRequest.body = {
      name: '',
      email: '',
      password: '',
    };
<<<<<<< HEAD
    expect(await sut.validate(mockRequest, mockResponse, mockNext)).toEqual({
      emailErrors: ['erro'],
      nameErrors: ['erro'],
      passwordErros: ['erro'],
    });
=======
    expect(await sut.userValidate(mockRequest, mockResponse, mockNext)).toEqual(
      {
        email: { message: 'erro' },
      },
    );
>>>>>>> master
  });
});
