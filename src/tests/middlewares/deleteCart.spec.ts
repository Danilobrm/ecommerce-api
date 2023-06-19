import { Request, Response } from 'express';
import prismaClient from '../../prisma';
import { prismaMock } from '../../singleton';
import { Item } from '@prisma/client';

export class MockDeleteCart {
  async validate(req: Request, res: Response) {
    const cart_id = req.cart_id;

    const removeCartService = new MockRemoveCartService();
    const cart = await removeCartService.execute({ cart_id });

    return res.json(cart);
  }
}

interface OrderRequest {
  cart_id: string;
}

class MockRemoveCartService {
  async execute({ cart_id }: OrderRequest) {
    const cart = await prismaClient.cart.delete({
      where: {
        id: cart_id,
      },
    });

    return cart;
  }
}

const createSut = () => {
  return new MockDeleteCart();
};

describe('test delete cart', () => {
  const sut = createSut();
  it('should delete cart', async () => {
    prismaMock.cart.findUnique.mockResolvedValue({
      id: 'cartid',
      status: false,
      draft: true,
      user_id: mockReq.user_id,
    });

    prismaMock.item.findMany.mockResolvedValue([
      { amount: 1, cart_id: 'cartid', id: 'itemid', product_id: 'productid' },
      { amount: 1, cart_id: 'cartid', id: 'itemid2', product_id: 'productid2' },
      { amount: 1, cart_id: 'cartid', id: 'itemid3', product_id: 'productid3' },
    ]);

    await expect(sut.validate(mockReq, mockRes)).resolves.toEqual(undefined);
  });
});

const mockReq = {
  cart_id: 'cartid',
} as unknown as Request;
const mockRes = {
  json: (item: Item[]) => JSON.stringify(item),
} as unknown as Response;
