import { Request, Response } from 'express';

export interface AuthenticateRequest {
  authenticate(req: Request, res: Response): Promise<Response>;
}
