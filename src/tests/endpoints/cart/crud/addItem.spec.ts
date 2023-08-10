import { Request, Response } from 'express';
import prismaClient from '../../../../prisma';
import { Cart } from '@prisma/client';
import { prismaMock } from '../../../../singleton';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
}

describe('add item to user cart test', () => {
  const _dependencies: Dependencies = {
    mockRequest: {
      body: { cart_id: 'cartid', product_id: 'productid', amount: 1 },
    } as unknown as Request,
    mockResponse: {
      status: jest.fn((status: number) => status),
      json: jest.fn((response: Cart) => JSON.stringify(response)),
    } as unknown as Response,
  };

  it('should be called once', async () => {
    const sut = new MockAddItemController();
    const spy = jest.spyOn(sut, 'add');
    await sut.add(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

  it('should add item in database cart and return its json', async () => {
    const mockResolvedValue = { id: 'itemid', amount: 1, cart_id: 'cartid', product_id: 'productid' };
    prismaMock.item.create.mockResolvedValue(mockResolvedValue);

    const sut = new MockAddItemController();
    const cartItemAdd = await sut.add(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(cartItemAdd).toEqual(JSON.stringify(mockResolvedValue));
  });
});

class MockAddItemController {
  async add(req: Request, res: Response) {
    const { cart_id, product_id, amount } = req.body;

    const addItem = new MockAddItemService();
    const cart = await addItem.execute({ cart_id, product_id, amount });

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
      data: { cart_id: cart_id, product_id: product_id, amount: amount },
    });

    return cart;
  }
}
