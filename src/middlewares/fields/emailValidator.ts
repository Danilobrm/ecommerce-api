import isEmail from 'validator/lib/isEmail';
import { Validator } from '../../interfaces/validate/validate';
import prismaClient from '../../prisma';
import { Customer } from '@prisma/client';

export class EmailValidator implements Validator<string, Promise<string>> {
  async validate(email: string): Promise<string> {
    // empty field
    if (!email) {
      return 'campo email não pode ficar vazio.';
    }
    if (!isEmail(email)) {
      return 'email inválido.';
    }

    const emailValidatorDatabase = new EmailValidatorDatabase();
    const userAlreadyExists = await emailValidatorDatabase.validate(email);

    if (userAlreadyExists) {
      return 'o email informado já está em uso.';
    }

    return '';
  }
}

export class EmailValidatorDatabase {
  async validate(email: string): Promise<Customer | null> {
    const userAlreadyExists = await prismaClient.customer.findFirst({
      where: {
        email: email,
      },
    });

    return userAlreadyExists;
  }
}

const emailValidatorDatabase = new EmailValidatorDatabase();
const emailValidator: Validator<string, Promise<string>> = new EmailValidator();

export { emailValidator, emailValidatorDatabase };
