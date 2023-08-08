import prismaClient from '../../prisma';

interface DetailRequest {
  cart_id: string;
}

class DetailCartService {
  async execute({ cart_id }: DetailRequest) {
    const cart = await prismaClient.item.findMany({ where: { cart_id: cart_id }, include: { product: true, cart: true } });

    return cart;
  }
}

export { DetailCartService };
