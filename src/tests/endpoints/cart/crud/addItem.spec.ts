import { Request, Response } from 'express';
import prismaClient from '../../../../prisma';
import { Item } from '@prisma/client';
import { prismaMock } from '../../../../singleton';

class MockAddItemController {
  async add(req: Request, res: Response) {
    const { cart_id, product_id, amount } = req.body;

    const addItem = new MockAddItemService();

    const cart = await addItem.execute({
      cart_id,
      product_id,
      amount,
    });

    return res.json(cart);
  }
}

interface ItemRequest {
  cart_id: string;
  product_id: string;
  amount: number;
}

class MockAddItemService {
  async execute({ cart_id, product_id, amount }: ItemRequest) {
    const cart = await prismaClient.item.create({
      data: {
        cart_id: cart_id,
        product_id: product_id,
        amount: amount,
      },
    });
    return cart;
  }
}

export const createSutAddItem = () => {
  return new MockAddItemController();
};

describe('test user cart', () => {
  const sut = createSutAddItem();
  it('should add item', async () => {
    prismaMock.item.create.mockResolvedValue({
      id: 'itemid',
      amount: 1,
      cart_id: 'cartid',
      product_id: 'productid',
    });
    const add = await sut.add(addItem.mockReq, addItem.mockRes);

    expect(add).toEqual(
      JSON.stringify({
        id: 'itemid',
        amount: 1,
        cart_id: 'cartid',
        product_id: 'productid',
      }),
    );
  });
});

const addItem = {
  mockReq: {
    body: {
      cart_id: 'cartid',
      product_id: 'productid',
      amount: 1,
    },
  } as Request,

  mockRes: {
    json: (item: Item) => JSON.stringify(item),
  } as unknown as Response,
};
