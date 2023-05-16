import { NextFunction, Request, Response } from 'express';
import prismaClient from '../prisma';
import { isEmail } from 'validator';

type Errors = ErrorMessage[];
type ErrorMessage = string[];

export class Validate {
  async validate(req: Request, res: Response, next: NextFunction) {
    const errors: Errors = [];
    const { name, email, password } = req.body;
    const validateName = new ValidateName().validate(name);
    errors.push(validateName);

    const validateEmail = await new ValidateEmail().validate(email);
    errors.push(validateEmail);

    const validatePassword = new ValidatePassword().validate(password);
    errors.push(validatePassword);

    for (const error of errors) {
      if (error) {
        if (error.length > 0) {
          return res.json(errors.filter((error) => error));
        }
      }
    }

    next();
  }
}

class ValidateName {
  nameErrors: ErrorMessage = [];
  validate(name) {
    if (!name) {
      this.nameErrors.push('insira um nome.');
    }

    if (this.nameErrors.length > 0) {
      return this.nameErrors;
    }

    return;
  }
}

class ValidatePassword {
  passwordErrors: ErrorMessage = [];
  validate(password) {
    if (!password) {
      this.passwordErrors.push('insira uma senha.');
      return this.passwordErrors;
    }

    if (password.length < 6) {
      this.passwordErrors.push('senha precisa ser maior que 5 caracteres.');
    }

    if (this.passwordErrors.length > 0) {
      return this.passwordErrors;
    }

    return;
  }
}

class ValidateEmail {
  emailErrors: ErrorMessage = [];
  async validate(email) {
    if (!email) {
      this.emailErrors.push('insira um email.');
      return this.emailErrors;
    }

    if (!isEmail(email)) {
      this.emailErrors.push('email incorreto.');
    }
    // verificar se email já está cadastrado
    const userAlreadyExists = await prismaClient.customer.findFirst({
      where: {
        email: email,
      },
    });

    if (userAlreadyExists) {
      this.emailErrors.push('O email informado já está cadastrado.');
    }

    if (this.emailErrors.length > 0) {
      return this.emailErrors;
    }

    return;
  }
}
