import { Request, Response } from 'express';
import { AuthUserService } from '../../services/user/AuthUserService';

export interface AuthenticateRequest {
  authenticate(req: Request, res: Response): Promise<Response>;
}

export class AuthUserController implements AuthenticateRequest {
  async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authUserService = new AuthUserService();
    const auth = await authUserService.authenticate({ email, password });

    return res.json(auth);
  }
}
