import { Cart } from '@prisma/client';
import { DeleteService } from '../../interfaces/services';
import prismaClient from '../../prisma';

interface RequestData {
  cart_id: string;
}

class DeleteCartService implements DeleteService<RequestData, Cart> {
  async delete({ cart_id }: RequestData): Promise<Cart> {
    const cart = await prismaClient.cart.delete({ where: { id: cart_id } });

    return cart;
  }
}

export { DeleteCartService };
