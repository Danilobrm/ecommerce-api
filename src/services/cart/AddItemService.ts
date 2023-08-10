import { Item } from '@prisma/client';
import { CreateRequestService } from '../../interfaces/services';
import prismaClient from '../../prisma';

interface RequestData {
  cart_id: string;
  product_id: string;
  amount: number;
}

class AddItemService implements CreateRequestService<RequestData, Item> {
  async create({ cart_id, product_id, amount }: RequestData): Promise<Item> {
    const item = await prismaClient.item.create({ data: { cart_id, product_id, amount } });

    return item;
  }
}

export { AddItemService };
