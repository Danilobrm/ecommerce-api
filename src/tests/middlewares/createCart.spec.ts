import { NextFunction, Request, Response } from 'express';
import prismaClient from '../../prisma';
import { prismaMock } from '../../singleton';
import { CreateRequestService } from '../../interfaces/services';
import { Cart, User } from '@prisma/client';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
  mockNext: NextFunction;
}

describe('test create cart middleware', () => {
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

  it('should be called once', async () => {
    const sut = new MockUserHaveCart();
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
    const sut = new MockUserHaveCart();

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
    const sut = new MockUserHaveCart();

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

export class MockUserHaveCart {
  async check(req: Request, res: Response, next: NextFunction) {
    const user_id = req.user_id;

    // Check if a cart exists for the user
    const user = await prismaClient.user.findUnique({ where: { id: user_id }, include: { cart: true } });

    if (!user?.cart) {
      const createCartService = new MockCreateCartService();
      const cart = await createCartService.create({ user_id });
      req.body.cart_id = cart.id;
      next();
    }

    req.body.cart_id = user?.cart?.id;
    next();
  }
}

interface OrderRequest {
  user_id: string;
}

class MockCreateCartService implements CreateRequestService<OrderRequest> {
  async create({ user_id }: OrderRequest): Promise<Cart> {
    const cart = await prismaClient.cart.create({ data: { user: { connect: { id: user_id } } } });

    return cart;
  }
}
