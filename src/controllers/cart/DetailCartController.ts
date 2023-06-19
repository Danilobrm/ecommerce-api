import { Request, Response } from 'express';
import { DetailCartService } from '../../services/cart/DetailCartService';

class DetailCartController {
  async read(req: Request, res: Response) {
    const cart_id = req.query.cart_id as string;

    const detailCartService = new DetailCartService();

    const cart = await detailCartService.execute({
      cart_id,
    });
    return res.json(cart);
  }
}

export { DetailCartController };
