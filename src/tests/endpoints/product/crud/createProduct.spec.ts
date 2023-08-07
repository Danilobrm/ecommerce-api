import { Request, Response } from 'express';
import prismaClient from '../../../../prisma/index';
import { prismaMock } from '../../../../singleton';

class MockCreateProductController {
  async create(req: Request, res: Response) {
    const { name, price, description, category_id } = req.body;

    const createProductService = new MockCreateProductService();

    if (!req.file) {
      throw new Error('error upload file');
    }

    // const { originalname, filename: banner } = req.file;

    const banner = 'opa';

    const product = await createProductService.execute({
      name,
      price,
      description,
      banner,
      category_id,
    });

    return res.json(product);
  }
}

interface ProductRequest {
  name: string;
  price: string;
  description: string;
  banner: string;
  category_id: string;
}
class MockCreateProductService {
  async execute({
    name,
    price,
    description,
    banner,
    category_id,
  }: ProductRequest) {
    const product = await prismaClient.product.create({
      data: {
        name: name,
        price: price,
        description: description,
        banner: banner,
        category_id: category_id,
      },
    });
    return product;
  }
}

const createSut = () => {
  return new MockCreateProductController();
};

describe('test create product', () => {
  const sut = createSut();
  it('should be called once', async () => {
    const spy = jest.spyOn(sut, 'create');

    await sut.create(mockRequest, mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

  it('should create product in database', async () => {
    // upload.single('file');

    prismaMock.product.create.mockResolvedValue({
      id: 'idstring',
      name: 'camiseta',
      price: '20',
      description: 'confortável',
      banner: 'file.png',
      category_id: 'category',
      created_at: mockDate,
      updated_at: mockDate,
    });

    await expect(sut.create(mockRequest, mockResponse)).resolves.toEqual(
      JSON.stringify({
        id: 'idstring',
        name: 'camiseta',
        price: '20',
        description: 'confortável',
        banner: 'file.png',
        category_id: 'category',
        created_at: mockDate,
        updated_at: mockDate,
      }),
    );
  });

  it('should give error if no banner was provided', async () => {
    prismaMock.product.create.mockResolvedValue({
      id: 'idstring',
      name: 'camiseta',
      price: '20',
      description: 'confortável',
      banner: 'file.png',
      category_id: 'category',
      created_at: mockDate,
      updated_at: mockDate,
    });

    mockRequest.file = undefined;

    await expect(sut.create(mockRequest, mockResponse)).rejects.toThrowError();
  });
});

const mockRequest = {
  body: {
    name: 'camiseta',
    price: '20',
    description: 'confortável',
    category_id: 'category',
  },
  file: 'file.png',
} as unknown as Request;

const mockResponse = {} as unknown as Response;
mockResponse.json = (data: Request): Response =>
  JSON.stringify(data) as unknown as Response;

export const mockDate = new Date() as Date;
