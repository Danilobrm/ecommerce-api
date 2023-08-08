import { Request, Response } from 'express';
import prismaClient from '../../../../prisma';
import { Cart } from '@prisma/client';
import { prismaMock } from '../../../../singleton';

class MockDetailCartController {
  async read(req: Request, res: Response) {
    const cart_id = req.query.cart_id as string;

    const detailCartService = new MockDetailCartService();
    const cart = await detailCartService.execute({
      cart_id,
    });

    return res.json(cart);
  }
}

interface DetailRequest {
  cart_id: string;
}

class MockDetailCartService {
  async execute({ cart_id }: DetailRequest) {
    const cart = await prismaClient.item.findMany({ where: { cart_id: cart_id }, include: { product: true, cart: true } });

    return cart;
  }
}

const createSut = () => {
  return new MockDetailCartController();
};

describe('test detail cart', () => {
  const sut = createSut();
  it('should return the cart', async () => {
    prismaMock.item.findMany.mockResolvedValue([
      { amount: 1, cart_id: 'cartid', id: 'itemid', product_id: 'productid' },
      { amount: 1, cart_id: 'cartid', id: 'itemid2', product_id: 'productid2' },
      { amount: 1, cart_id: 'cartid', id: 'itemid3', product_id: 'productid3' },
    ]);

    await expect(sut.read(mockReq, mockRes)).resolves.toEqual(
      JSON.stringify([
        { amount: 1, cart_id: 'cartid', id: 'itemid', product_id: 'productid' },
        {
          amount: 1,
          cart_id: 'cartid',
          id: 'itemid2',
          product_id: 'productid2',
        },
        {
          amount: 1,
          cart_id: 'cartid',
          id: 'itemid3',
          product_id: 'productid3',
        },
      ]),
    );
  });
});

const mockReq = {
  query: {
    cart_id: 'cartid',
  },
} as unknown as Request;

const mockRes = {
  json: (item: Cart) => JSON.stringify(item),
} as unknown as Response;
