import { Request, Response } from 'express';
import { Cart } from '@prisma/client';
import { prismaMock } from '../../../../singleton';
import { DeleteCartController } from '../../../../controllers/cart/DeleteCartController';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
}

describe('delete user cart test', () => {
  it('should be called once', async () => {
    const sut = new DeleteCartController();
    const spy = jest.spyOn(sut, 'delete');
    await sut.delete(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

  it('should delete the user cart', async () => {
    const mockResolvedValue = {
      id: _dependencies.mockRequest.cart_id,
      status: false,
      draft: true,
      user_id: _dependencies.mockRequest.user_id,
    } as Cart;

    prismaMock.cart.delete.mockResolvedValue(mockResolvedValue);
    const sut = new DeleteCartController();
    const cart = await sut.delete(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(cart).toEqual(JSON.stringify(mockResolvedValue));
  });
});

const _dependencies: Dependencies = {
  mockRequest: {
    query: { cart_id: 'cartid' },
    user_id: 'userid',
  } as unknown as Request,
  mockResponse: {
    status: jest.fn((status: number) => status),
    json: jest.fn((response: Cart) => JSON.stringify(response)),
  } as unknown as Response,
};
