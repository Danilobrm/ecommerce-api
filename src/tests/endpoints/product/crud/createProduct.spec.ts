import { Request, Response } from 'express';
import prismaClient from '../../../../prisma/index';
import { prismaMock } from '../../../../singleton';
import { CreateRequestService } from '../../../../interfaces/services';
import { Product } from '@prisma/client';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
}

describe('create product test', () => {
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

  it('should be called once', async () => {
    const sut = new MockCreateProductController();
    const spy = jest.spyOn(sut, 'create');
    await sut.create(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

  it('should create product in database and return its json', async () => {
    // upload.single('file');
    const sut = new MockCreateProductController();
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

    const sut = new MockCreateProductController();
    const product = await sut.create(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(product).toEqual(JSON.stringify({ status: 400, response: 'error upload file' }));
  });
});

class MockCreateProductController {
  async create(req: Request, res: Response) {
    if (!req.file)
      return res.json({
        status: 400,
        response: 'error upload file',
      });
    const { filename: banner } = req.file;

    const createProductService = new MockCreateProductService();
    const product = await createProductService.create({ ...req.body, banner });

    return res.json(product);
  }
}

class MockCreateProductService implements CreateRequestService<Product> {
  async create({ name, price, description, banner, category_id }: Product): Promise<Product> {
    const product = await prismaClient.product.create({ data: { name, price, description, banner, category_id } });

    return product;
  }
}

export const mockDate = new Date() as Date;
