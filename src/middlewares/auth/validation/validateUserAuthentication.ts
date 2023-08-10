import { NextFunction, Request, Response } from 'express';
import { compare } from 'bcryptjs';
import { QueryUserService } from '../../../services/user/QueryUserService';

export class ValidateUserAuthentication {
  async validate(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ email: 'Email inválido.' });
    if (!password) return res.status(400).json({ email: 'Senha inválida.' });

    const queryUser = new QueryUserService();
    const user = await queryUser.queryUserByEmail(email);
    if (!user) return res.status(400).json({ email: 'Usuário não encontrado.' });

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ password: 'Senha incorreta.' });

    req.body.name = user.name;
    req.body.id = user.id;
    next();
  }
}
