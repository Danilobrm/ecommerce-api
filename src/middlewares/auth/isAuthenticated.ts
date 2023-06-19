import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
  sub: string;
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const secretOrPrivateKey = process.env.JWT_SECRET;
  if (!secretOrPrivateKey) {
    return null;
  }

  // receber o token
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).end();
  }

  const [, token] = authToken.split(' ');

  try {
    // validar o token
    const { sub } = verify(token, secretOrPrivateKey) as Payload;

    // recuperar o id do token e colocar dentro
    // de uma variável user_id dentro do req
    req.user_id = sub;

    return next();
  } catch (error) {
    return res.status(401).end();
  }
}
