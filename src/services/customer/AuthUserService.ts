import { compare } from 'bcryptjs';
import {
  IAuthUserService,
  IUserAuthData,
  IUserAuthReturn,
} from '../../interfaces/customer/services/authUserServiceProtocol';
import { sign } from 'jsonwebtoken';
import { emailValidatorDatabase } from '../../middlewares/fields/emailValidator';

export class AuthUserService implements IAuthUserService {
  async authenticate({
    email,
    password,
  }: IUserAuthData): Promise<IUserAuthReturn | void> {
    const secretOrPrivateKey = process.env.JWT_SECRET;
    if (!secretOrPrivateKey) {
      return;
    }

    const user = await emailValidatorDatabase.validate(email);
    if (!user) return;

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) return;

    // gerar token para o usuario
    const token = sign(
      { name: user.name, email: user.email },
      secretOrPrivateKey,
      {
        subject: user.id,
        expiresIn: '30d',
      },
    );

    return { id: user.id, name: user.name, email: user.email, token: token };
  }
}
