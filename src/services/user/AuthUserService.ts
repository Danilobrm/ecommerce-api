import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { emailValidatorDatabase } from '../../middlewares/fields/emailValidator';

interface IUserAuthData {
  email: string;
  password: string;
}

export class AuthUserService {
  async execute({ email, password }: IUserAuthData) {
    const secretOrPrivateKey = process.env.JWT_SECRET;
    if (!secretOrPrivateKey) {
      return null;
    }

    const user = await emailValidatorDatabase.validate(email);
    if (!user) return null;

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) return null;

    // gerar token para o usuario
    const token = sign(
      { name: user.name, email: user.email },
      secretOrPrivateKey,
      {
        subject: user.id,
        expiresIn: '30d',
      },
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: token,
      },
    };
  }
}
