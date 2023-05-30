import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { AuthenticateRequest } from '../../interfaces/customer/controllers/authUserControllerProtocol';

class AuthCustomerController implements AuthenticateRequest {
  authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authUserService = new AuthUserService();
  }
}
