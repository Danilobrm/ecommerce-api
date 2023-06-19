import { NextFunction, Request, Response } from 'express';

export class ValidateCategory {
  validate(req: Request, res: Response, next: NextFunction): void | Response {
    const { name } = req.body;

    const validationErrors: { [key: string]: string } = {};

    if (!name) {
      validationErrors.name = 'Nome inválido.';
    }

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json('Nome inválido.');
    }

    return next();
  }
}
