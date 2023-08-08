import { NextFunction, Request, Response } from 'express';
import prismaClient from '../../../../prisma';
import { Item } from '@prisma/client';
import { prismaMock } from '../../../../singleton';

class MockRemoveItemController {
  async remove(req: Request, res: Response, next: NextFunction) {
    const item_id = req.query.item_id as string;

    const removeItemService = new MockRemoveItemService();
    const item = await removeItemService.execute({ item_id });

    const cart_id = item.cart_id;
    const detailCartService = new MockDetailCartService();
    const cart = await detailCartService.execute({ cart_id });

    if (cart.length > 0) return res.json(item);
    req.cart_id = item.cart_id;

    next();
  }
}

interface ItemRequest {
  item_id: string;
}

class MockRemoveItemService {
  async execute({ item_id }: ItemRequest) {
    const item = await prismaClient.item.delete({ where: { id: item_id } });

    return item;
  }
}

interface DetailRequest {
  cart_id: string;
}

class MockDetailCartService {
  async execute({ cart_id }: DetailRequest) {
    const cart = await prismaClient.item.findMany({
      where: {
        cart_id: cart_id,
      },
      include: {
        product: true,
        cart: true,
      },
    });

    return cart;
  }
}

export const createSutRemoveItem = () => {
  return new MockRemoveItemController();
};

describe('test remove item from cart', () => {
  const sut = createSutRemoveItem();

  it('should remove item and call next if the cart is empty', async () => {
    prismaMock.item.delete.mockResolvedValue({
      id: 'itemid',
      amount: 1,
      cart_id: 'cartid',
      product_id: 'productid',
    });

    prismaMock.item.findMany.mockResolvedValue([]);

    const cart = await sut.remove(mockReq, mockRes, mockNext);

    expect(cart).toEqual(undefined);
  });

  it('should remove item and return the cart if still there is item in the cart', async () => {
    prismaMock.item.delete.mockResolvedValue({
      id: 'itemid',
      amount: 1,
      cart_id: 'cartid',
      product_id: 'productid',
    });

    prismaMock.item.findMany.mockResolvedValue([
      { amount: 1, cart_id: 'cartid', id: 'itemid', product_id: 'productid' },
      { amount: 1, cart_id: 'cartid', id: 'itemid2', product_id: 'productid2' },
      { amount: 1, cart_id: 'cartid', id: 'itemid3', product_id: 'productid3' },
    ]);

    await expect(sut.remove(mockReq, mockRes, mockNext)).resolves.toEqual(
      JSON.stringify({
        id: 'itemid',
        amount: 1,
        cart_id: 'cartid',
        product_id: 'productid',
      }),
    );
  });
});

const mockReq = {
  query: {
    item_id: 'itemid',
  },
} as unknown as Request;

const mockRes = {
  json: (item: Item[]) => JSON.stringify(item),
} as unknown as Response;

const mockNext = () => undefined;
