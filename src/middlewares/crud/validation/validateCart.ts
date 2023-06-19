import { NextFunction, Request, Response } from 'express';
import prismaClient from '../../../prisma';
import { CreateCartService } from '../../../services/cart/CreateCartService';
import { RemoveCartService } from '../../../services/cart/RemoveCartService';

export class CreateCart {
  async validate(req: Request, res: Response, next: NextFunction) {
    const user_id = req.user_id;

    // Check if a cart exists for the user
    const user = await prismaClient.user.findUnique({
      where: { id: user_id },
      include: { cart: true },
    });

    if (!user?.cart) {
      const createCartService = new CreateCartService();
      const cart = await createCartService.execute({ user_id });
      req.body.cart_id = cart.id;
      next();
    }

    req.body.cart_id = user?.cart?.id;
    next();
  }
}

export class DeleteCart {
  async validate(req: Request, res: Response, next: NextFunction) {
    const user_id = req.user_id;

    console.log(user_id);

    const cart = await prismaClient.cart.findUnique({
      where: { user_id: user_id },
    });

    const cartItems = await prismaClient.item.findMany({
      where: { cart_id: cart?.id },
    });

    // if (cart) {
    //   if (cartItems.length === 1) {
    //     const removeCartService = new RemoveCartService();
    //     await removeCartService.execute({ cart_id: cart?.id });
    //   }
    // }

    console.log(cartItems);
  }
}
