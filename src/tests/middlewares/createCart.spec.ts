import { NextFunction, Request, Response } from 'express';
import prismaClient from '../../prisma';
import { prismaMock } from '../../singleton';

export class MockCreateCart {
  async validate(req: Request, res: Response, next: NextFunction) {
    const user_id = req.user_id;

    // Check if a cart exists for the user
    const user = await prismaClient.user.findUnique({
      where: { id: user_id },
      include: { cart: true },
    });

    if (!user?.cart) {
      const createCartService = new MockCreateCartService();
      await createCartService.execute({ user_id });
      next();
    }

    req.body.cart_id = user?.cart?.id;
    next();
  }
}

interface OrderRequest {
  user_id: string;
}

class MockCreateCartService {
  async execute({ user_id }: OrderRequest) {
    const cart = await prismaClient.cart.create({
      data: {
        user: {
          connect: { id: user_id },
        },
      },
    });

    return cart;
  }
}

const createSut = () => {
  return new MockCreateCart();
};

describe('test create cart middleware', () => {
  const sut = createSut();

  it('should be called once', async () => {
    const spy = jest.spyOn(sut, 'validate');

    await sut.validate(mockReq, mockRes, mockNext);

    expect(spy).toBeCalledTimes(1);
  });

  it('should create cart', async () => {
    prismaMock.cart.create.mockResolvedValue({
      id: 'cartid',
      status: false,
      draft: true,
      user_id: 'userid',
    });

    await expect(
      sut.validate(mockReq, mockRes, mockNext),
    ).resolves.toBeUndefined();
  });
});

export const mockDate = new Date() as Date;

const mockReq = {
  user_id: 'userid',
  body: {
    cart_id: '',
  },
} as unknown as Request;

const mockRes = {
  json: (data: Request) => JSON.stringify(data),
} as unknown as Response;

const mockNext = jest.fn();
