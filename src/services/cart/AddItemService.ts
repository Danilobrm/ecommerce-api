import prismaClient from '../../prisma';

interface ItemRequest {
  cart_id: string;
  product_id: string;
  amount: number;
}

class AddItemService {
  async execute({ cart_id, product_id, amount }: ItemRequest) {
    const cart = await prismaClient.item.create({
      data: { cart_id: cart_id, product_id: product_id, amount: amount },
    });

    return cart;
  }
}

export { AddItemService };
