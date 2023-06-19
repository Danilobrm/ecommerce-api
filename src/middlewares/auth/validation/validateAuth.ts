import { NextFunction, Request, Response } from 'express';
import { EmailValidatorDatabase } from '../../fields/emailValidator';
import { compare } from 'bcryptjs';

export class ValidateUserAuth {
  async validate(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    // verify user in database
    const lookForUser = new EmailValidatorDatabase();
    const user = await lookForUser.validate(email);

    const validationErrors: { [key: string]: string } = {};

    if (!user) {
      validationErrors.email = 'Email incorreto';
      return res.status(400).json(validationErrors);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      validationErrors.password = 'Senha incorreta';
      return res.status(400).json(validationErrors);
    }
    next();
  }
}
