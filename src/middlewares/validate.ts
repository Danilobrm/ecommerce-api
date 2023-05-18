import { NextFunction, Request, Response } from 'express';
import { Errors, Validator } from '../interfaces/validate';
import isEmail from 'validator/lib/isEmail';
import prismaClient from '../prisma';

export class ValidateUser {
  async validate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const { name, email, password } = req.body;

    const emailValidator: Validator<
      string,
      Promise<string[]>
    > = new EmailValidator();

    // create class to validate
    const passwordValidator: Validator<string, string[]> =
      new PasswordValidator();
    const nameValidator: Validator<string, string[]> = new NameValidator();

    // validate data
    const nameErrors = await emailValidator.validate(email);
    const emailErrors = nameValidator.validate(name);
    const passwordErrors = passwordValidator.validate(password);

    //get the returned list of erros
    const errors: Errors = {
      nameErrors: nameErrors,
      emailErrors: emailErrors,
      passwordErros: passwordErrors,
    };

    // look for errors in lists
    for (const error in errors) {
      if (errors[error as keyof Errors].length > 0) return res.json(errors);
    }
    return next();
  }
}
class EmailValidator implements Validator<string, Promise<string[]>> {
  emailErros: string[] = [];
  async validate(email: string): Promise<string[]> {
    // empty field
    if (!email) {
      this.emailErros.push('campo email não pode ficar vazio.');
      return this.emailErros;
    }
    if (!isEmail(email)) this.emailErros.push('email inválido.');

    await this.checkForEmailOnDatabase(email);

    return this.emailErros;
  }

  async checkForEmailOnDatabase(email: string): Promise<void> {
    const userAlreadyExists = await prismaClient.customer.findFirst({
      where: {
        email: email,
      },
    });

    if (userAlreadyExists) {
      this.emailErros.push('o email informado já está em uso.');
    }
  }
}

class PasswordValidator implements Validator<string, string[]> {
  passwordErros: string[] = [];
  validate(password: string): string[] {
    if (!password) {
      this.passwordErros.push('campo senha não pode ficar vazio.');
      return this.passwordErros;
    }
    if (password.length < 6)
      this.passwordErros.push('senha precisa ser maior que 6 caracteres.');
    return this.passwordErros;
  }
}

class NameValidator implements Validator<string, string[]> {
  nameErros: string[] = [];
  validate(name: string): string[] {
    if (!name) this.nameErros.push('campo nome não pode ficar vazio.');
    return this.nameErros;
  }
}
