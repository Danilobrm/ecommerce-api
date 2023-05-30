import { Validator } from '../../interfaces/validate/validate';

export class PasswordValidator implements Validator<string, string> {
  validate(password: string): string {
    if (!password) {
      return 'campo senha não pode ficar vazio.';
    }
    if (password.length < 6) {
      return 'senha precisa ser maior que 6 caracteres.';
    }
    return '';
  }
}
