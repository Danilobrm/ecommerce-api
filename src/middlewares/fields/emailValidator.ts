import isEmail from 'validator/lib/isEmail';
import { Validator } from '../../interfaces/validate/validate';
import { QueryUserService } from '../../services/user/QueryUserService';

interface RequestData {
  email: string;
}

export class EmailValidator implements Validator<RequestData, Promise<string>> {
  async validate({ email }: RequestData): Promise<string> {
    // empty field
    if (!email) return 'campo email não pode ficar vazio.';

    if (!isEmail(email)) return 'email inválido.';

    const emailValidatorDatabase = new QueryUserService();
    const userAlreadyExists = await emailValidatorDatabase.queryUserByEmail({ email });
    if (userAlreadyExists) return 'o email informado já está em uso.';

    return '';
  }
}
