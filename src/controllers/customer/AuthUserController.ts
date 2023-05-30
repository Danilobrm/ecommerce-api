import { Request, Response } from 'express';
import { AuthenticateRequest } from '../../interfaces/customer/controllers/authUserControllerProtocol';
import { AuthUserService } from '../../services/customer/AuthUserService';

export class AuthUserController implements AuthenticateRequest {
  async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authUserService = new AuthUserService();

    const auth = await authUserService.authenticate({ email, password });

    return res.json(auth);
  }
}
