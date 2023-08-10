import { passwordValidator } from '../../fields/passwordValidator';
import { nameValidator } from '../../fields/nameValidator';
import { emailValidator } from '../../fields/emailValidator';
import { NextFunction, Request, Response } from 'express';

export class ValidateUserRegister {
  async validate(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
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
      return res.status(400).json(validationErrors);
    }

    return next();
  }
}
