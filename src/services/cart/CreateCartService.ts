import prismaClient from '../../prisma';
import { CreateRequestService } from '../../interfaces/services';
import { Cart } from '@prisma/client';

interface RequestData {
  user_id: string;
}

class CreateCartService implements CreateRequestService<RequestData> {
  async create({ user_id }: RequestData): Promise<Cart> {
    const cart = await prismaClient.cart.create({ data: { user: { connect: { id: user_id } } } });

    return cart;
  }
}

export { CreateCartService };
