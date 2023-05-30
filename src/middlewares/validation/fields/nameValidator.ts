import { Validator } from '../../../interfaces/validate/validate';

export class NameValidator implements Validator<string, string> {
  validate(name: string): string {
    if (!name) {
      return 'campo nome não pode ficar vazio.';
    }
    if (name.length < 5) {
      return 'nome precisa ser maior que 4 caracteres.';
    }
    return '';
  }
}
