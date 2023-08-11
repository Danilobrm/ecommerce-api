import { NextFunction, Request, Response } from 'express';
import { prismaMock } from '../../singleton';
import { Cart, User } from '@prisma/client';
import { CheckUserCart } from '../../middlewares/crud/validation/CheckUserCart';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
  mockNext: NextFunction;
}

describe('test create cart middleware', () => {
  it('should be called once', async () => {
    const sut = new CheckUserCart();
    const spy = jest.spyOn(sut, 'check');

    prismaMock.cart.create.mockResolvedValue({
      id: 'cartid',
      status: false,
      draft: true,
      user_id: 'userid',
    });

    _dependencies.mockRequest.body.cart_id = 'cartid';

    await sut.check(_dependencies.mockRequest, _dependencies.mockResponse, _dependencies.mockNext);

    expect(spy).toBeCalledTimes(1);
  });

  it('should create cart and call next function', async () => {
    _dependencies.mockRequest.body.cart_id = '';
    const sut = new CheckUserCart();

    prismaMock.cart.create.mockResolvedValue({
      id: 'cartid',
      status: false,
      draft: true,
      user_id: 'userid',
    });

    // check cart id before looking for the user
    // and create a cart
    expect(_dependencies.mockRequest.body.cart_id).toBeUndefined();
    const userCart = await sut.check(_dependencies.mockRequest, _dependencies.mockResponse, _dependencies.mockNext);
    expect(userCart).toBeUndefined();
  });

  it('should call next if already exists a cart', async () => {
    const sut = new CheckUserCart();

    const mockResolvedValue = {
      cart: {
        id: 'cart_id_exists',
        status: false,
        draft: true,
        user_id: '_dependencies.mockRequest.user_id',
      },
      user_id: _dependencies.mockRequest.user_id,
    } as unknown as User;

    prismaMock.user.findUnique.mockResolvedValue(mockResolvedValue);

    // check cart id before looking for the user
    // and asserting the user already have a cart
    expect(_dependencies.mockRequest.body.cart_id).toBeUndefined();

    const userCart = await sut.check(_dependencies.mockRequest, _dependencies.mockResponse, _dependencies.mockNext);
    expect(userCart).toBeUndefined();

    // check cart id after have looked for the user
    expect(_dependencies.mockRequest.body.cart_id).toEqual('cart_id_exists');
  });
});

const _dependencies: Dependencies = {
  mockRequest: {
    user_id: 'userid',
    body: {
      cart_id: '',
    },
  } as unknown as Request,
  mockResponse: {
    json: jest.fn((response: Cart) => JSON.stringify(response)),
    status: jest.fn((status: number) => status),
  } as unknown as Response,
  mockNext: jest.fn(),
};
