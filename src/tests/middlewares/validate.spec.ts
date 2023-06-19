import { NextFunction, Request, Response } from 'express';
import { Validator } from '../../interfaces/validate/validate';

class EmailValidator implements Validator<string, Promise<string>> {
  emailErros: string[] = [];
  async validate(email: string): Promise<string> {
    if (!email) return 'erro';
    return '';
  }
}

class PasswordValidator implements Validator<string, string> {
  validate(password: string): string {
    if (!password) return 'erro';
    return '';
  }
}

class NameValidator implements Validator<string, string> {
  nameErros: string[] = [];
  validate(name: string): string {
    if (!name) return 'erro';
    return '';
  }
}

const nameValidator = new NameValidator();
const emailValidator = new EmailValidator();
const passwordValidator = new PasswordValidator();

class ValidateUserRegister {
  async validate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const { name, email, password } = req.body;

    // validate data
    const nameErrors = nameValidator.validate(name);
    const emailErrors = await emailValidator.validate(email);
    const passwordErrors = passwordValidator.validate(password);

    //get the returned list of erros
    const validationErrors: { [key: string]: string } = {};

    if (nameErrors) {
      validationErrors.name = nameErrors;
    }

    if (emailErrors) {
      validationErrors.email = emailErrors;
    }

    if (passwordErrors) {
      validationErrors.password = passwordErrors;
    }

    if (Object.keys(validationErrors).length > 0) {
      return {
        status: res.status(400),
        data: res.json(validationErrors),
      } as unknown as Response;
    }

    return next() as undefined;
  }
}

const createSut = () => {
  return new ValidateUserRegister();
};

describe('test data validator', () => {
  const sut = createSut();
  const spyValidate = jest.spyOn(sut, 'validate');

  it('should call validate method once', () => {
    sut.validate(mockRequest, mockResponse, mockNext);

    expect(spyValidate).toHaveBeenCalledTimes(1);
  });

  it('should call next() if no errors is given', async () => {
    const validate = await sut.validate(mockRequest, mockResponse, mockNext);

    expect(validate).toEqual(undefined);
  });

  it('should return error if no data was provided', async () => {
    mockRequest.body = {
      name: '',
      email: '',
      password: '',
    };
    expect(await sut.validate(mockRequest, mockResponse, mockNext)).toEqual({
      data: JSON.stringify({
        name: 'erro',
        email: 'erro',
        password: 'erro',
      }),
      status: 400,
    });
  });
});

const mockRequest = {
  body: {
    name: 'test',
    email: 'test@example.com',
    password: '12345678',
  },
} as unknown as Request;

const mockNext = () => undefined as unknown as NextFunction;
const mockResponse = {
  status: (num: number) => num,
  json: (data: { [key: string]: string }) => JSON.stringify(data),
} as unknown as Response;
