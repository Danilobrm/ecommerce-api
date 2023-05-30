import { Errors, Validator } from '../../interfaces/validate/validate';
import { PasswordValidator } from './fields/passwordValidator';
import { NameValidator } from './fields/nameValidator';
import { EmailValidator } from './fields/emailValidator';
import { NextFunction, Request, Response } from 'express';

export class ValidateUserRegister {
  async validate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const { name, email, password } = req.body;
    // create class to validate
    const emailValidator: Validator<
      string,
      Promise<string>
    > = new EmailValidator();
    const passwordValidator: Validator<string, string> =
      new PasswordValidator();
    const nameValidator: Validator<string, string> = new NameValidator();

    // validate data
    const nameErrors = nameValidator.validate(name);
    const emailErrors = await emailValidator.validate(email);
    const passwordErrors = passwordValidator.validate(password);

    //get the returned list of erros
    const errors: Errors = {
      nameErrors: '',
      emailErrors: '',
      passwordErrors: '',
    };

    if (nameErrors) {
      errors.nameErrors = nameErrors;
    }

    if (emailErrors) {
      errors.emailErrors = emailErrors;
    }

    if (passwordErrors) {
      errors.passwordErrors = passwordErrors;
    }

    for (const field in errors) {
      if (errors[field as keyof Errors]) {
        return res.status(400).json(errors);
      }
    }
    return next();
  }
}
