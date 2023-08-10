import { Request, Response } from 'express';
import { Cart } from '@prisma/client';
import { DeleteService } from '../../../../interfaces/services';
import prismaClient from '../../../../prisma';
import { prismaMock } from '../../../../singleton';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
}

describe('delete user cart test', () => {
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

  it('should be called once', async () => {
    const sut = new MockDeleteCartController();
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
    const sut = new MockDeleteCartController();
    const cart = await sut.delete(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(cart).toEqual(JSON.stringify(mockResolvedValue));
  });
});

export class MockDeleteCartController {
  async delete(req: Request, res: Response) {
    const cart_id = req.cart_id;

    const removeCartService = new MockDeleteCartService();
    const cart = await removeCartService.delete({ cart_id });

    return res.json(cart);
  }
}

interface RequestData {
  cart_id: string;
}

class MockDeleteCartService implements DeleteService<RequestData, Cart> {
  async delete({ cart_id }: RequestData): Promise<Cart> {
    const cart = await prismaClient.cart.delete({ where: { id: cart_id } });

    return cart;
  }
}
