import { NextFunction, Request, Response } from 'express';
import prismaClient from '../../../prisma';
import { CreateCartService } from '../../../services/cart/CreateCartService';

export class CheckUserCart {
  async check(req: Request, res: Response, next: NextFunction) {
    const user_id = req.user_id;

    // Check if a cart exists for the user
    const user = await prismaClient.user.findUnique({ where: { id: user_id }, include: { cart: true } });

    let userCart = user?.cart;

    if (!userCart) {
      const createCartService = new CreateCartService();
      userCart = await createCartService.create({ user_id });
    }

    req.body.cart_id = userCart.id;
    next();
  }
}
