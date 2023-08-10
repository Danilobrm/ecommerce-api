import { Request, Response } from 'express';
import { DeleteCartService } from '../../services/cart/DeleteCartService';

export class DeleteCartController {
  async delete(req: Request, res: Response) {
    const cart_id = req.cart_id;

    const removeCartService = new DeleteCartService();
    const cart = await removeCartService.delete({ cart_id });

    return res.json(cart);
  }
}
