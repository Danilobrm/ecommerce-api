import { Request, Response } from 'express';
import { AddItemService } from '../../services/cart/AddItemService';

class AddItemController {
  async add(req: Request, res: Response) {
    const { cart_id, product_id, amount } = req.body;

    const addItem = new AddItemService();
    const cart = await addItem.execute({ cart_id, product_id, amount });

    return res.json(cart);
  }
}

export { AddItemController };
