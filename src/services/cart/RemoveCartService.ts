import prismaClient from '../../prisma';

interface OrderRequest {
  cart_id: string;
}

class RemoveCartService {
  async execute({ cart_id }: OrderRequest) {
    const cart = await prismaClient.cart.delete({
      where: {
        id: cart_id,
      },
    });

    return cart;
  }
}

export { RemoveCartService };
