import { Request, Response } from 'express';
import { Cart } from '@prisma/client';
import { prismaMock } from '../../../../singleton';
import { AddItemController } from '../../../../controllers/cart/AddItemController';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
}

describe('add item to user cart test', () => {
  it('should be called once', async () => {
    const sut = new AddItemController();
    const spy = jest.spyOn(sut, 'add');
    await sut.add(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

  it('should add item in database cart and return its json', async () => {
    const mockResolvedValue = { id: 'itemid', amount: 1, cart_id: 'cartid', product_id: 'productid' };
    prismaMock.item.create.mockResolvedValue(mockResolvedValue);

    const sut = new AddItemController();
    const cartItemAdd = await sut.add(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(cartItemAdd).toEqual(JSON.stringify(mockResolvedValue));
  });
});

const _dependencies: Dependencies = {
  mockRequest: {
    body: { cart_id: 'cartid', product_id: 'productid', amount: 1 },
  } as unknown as Request,
  mockResponse: {
    status: jest.fn((status: number) => status),
    json: jest.fn((response: Cart) => JSON.stringify(response)),
  } as unknown as Response,
};
