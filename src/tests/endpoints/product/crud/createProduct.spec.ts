import { Request, Response } from 'express';
import { prismaMock } from '../../../../singleton';
import { Product } from '@prisma/client';
import { CreateProductController } from '../../../../controllers/product/CreateProductController';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
}

describe('create product test', () => {
  it('should be called once', async () => {
    const sut = new CreateProductController();
    const spy = jest.spyOn(sut, 'create');
    await sut.create(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

  it('should create product in database and return its json', async () => {
    const sut = new CreateProductController();
    const mockResolvedValue = {
      id: 'idproduct',
      ..._dependencies.mockRequest.body,
      banner: _dependencies.mockRequest.file,
      created_at: mockDate,
      updated_at: mockDate,
    };

    prismaMock.product.create.mockResolvedValue(mockResolvedValue);
    const product = await sut.create(_dependencies.mockRequest, _dependencies.mockResponse);
    expect(product).toEqual(JSON.stringify(mockResolvedValue));
  });

  it('should give error if no banner was provided', async () => {
    prismaMock.product.create.mockRejectedValue('erro');
    _dependencies.mockRequest.file = undefined;

    const sut = new CreateProductController();
    const product = await sut.create(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(product).toEqual(JSON.stringify({ status: 400, response: 'error upload file' }));
  });
});

const _dependencies: Dependencies = {
  mockRequest: {
    body: { name: 'camiseta', price: '20', description: 'confortável', category_id: 'category' },
    file: 'file.png',
  } as unknown as Request,
  mockResponse: {
    status: jest.fn((status: number) => status),
    json: jest.fn((response: Product) => JSON.stringify(response)),
  } as unknown as Response,
};

const mockDate = new Date() as Date;
