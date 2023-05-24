import isEmail from 'validator/lib/isEmail';
import { Validator } from '../../interfaces/validate';
import prismaClient from '../../prisma';

export class EmailValidator implements Validator<string, Promise<string>> {
  async validate(email: string): Promise<string> {
    // empty field
    if (!email) {
      return 'campo email não pode ficar vazio.';
    }
    if (!isEmail(email)) {
      return 'email inválido.';
    }

    const userAlreadyExists = await prismaClient.customer.findFirst({
      where: {
        email: email,
      },
    });

    if (userAlreadyExists) {
      return 'o email informado já está em uso.';
    }
    return '';
  }
}
