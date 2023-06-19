import prismaClient from '../../prisma';

interface OrderRequest {
  user_id: string;
}

class CreateCartService {
  async execute({ user_id }: OrderRequest) {
    const cart = await prismaClient.cart.create({
      data: {
        user: {
          connect: { id: user_id },
        },
      },
    });

    return cart;
  }
}

export { CreateCartService };
