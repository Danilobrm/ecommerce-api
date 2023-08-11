import { NextFunction, Request, Response } from 'express';
import { EmailValidator } from '../../fields/emailValidator';
import { NameValidator } from '../../fields/nameValidator';
import { PasswordValidator } from '../../fields/passwordValidator';

export class ValidateUserRegister {
  async validate(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    const { name, email, password } = req.body;

    // validate data
    const emailErrors = await new EmailValidator().validate(name);
    const nameErrors = new NameValidator().validate(email);
    const passwordErrors = new PasswordValidator().validate(password);

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
      return res.status(400).json(validationErrors);
    }

    return next();
  }
}
