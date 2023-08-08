import { NextFunction, Request, Response } from 'express';
import { RemoveItemService } from '../../services/cart/RemoveItemService';
import { DetailCartService } from '../../services/cart/DetailCartService';

class RemoveItemController {
  async remove(req: Request, res: Response, next: NextFunction) {
    const item_id = req.query.item_id as string;

    const removeItemService = new RemoveItemService();
    const item = await removeItemService.execute({ item_id });

    const cart_id = item.cart_id;
    const detailCartService = new DetailCartService();
    const cart = await detailCartService.execute({ cart_id });

    if (cart.length > 0) return res.json(item);
    req.cart_id = item.cart_id;

    next();
  }
}

export { RemoveItemController };
