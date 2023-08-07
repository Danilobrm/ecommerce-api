import { Request, Response } from 'express';
import { CreateRequest } from '../../../../interfaces/controllers/CRUD';
import prismaClient from '../../../../prisma';
import { prismaMock } from '../../../../singleton';

class MockCreateCategoryController implements CreateRequest {
  async create(req: Request, res: Response) {
    const { name } = req.body;

    const createCategoryService = new MockCreateCategoryService();

    const category = await createCategoryService.execute({ name });

    return res.json(category);
  }
}

export interface CategoryRequest {
  name: string;
}

class MockCreateCategoryService {
  async execute({ name }: CategoryRequest) {
    if (name === '') {
      return 'Nome inválido.';
    }

    const category = await prismaClient.category.create({
      data: {
        name: name,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return category;
  }
}

const createSut = () => {
  return new MockCreateCategoryController();
};

describe('test create category controller', () => {
  const sut = createSut();
  it('should be called once', () => {
    const spy = jest.spyOn(sut, 'create');

    sut.create(mockRequest, mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

  it('should return category json', async () => {
    prismaMock.category.create.mockResolvedValue({
      id: 'id',
      name: 'roupas',
      created_at: mockDate,
      updated_at: mockDate,
    });

    await expect(sut.create(mockRequest, mockResponse)).resolves.toEqual(
      JSON.stringify({
        id: 'id',
        name: 'roupas',
        created_at: mockDate,
        updated_at: mockDate,
      }),
    );
  });
});

const mockRequest = {
  body: { name: 'roupas' },
} as unknown as Request;

const mockResponse = {} as unknown as Response;
mockResponse.json = (data: Request): Response =>
  JSON.stringify(data) as unknown as Response;

export const mockDate = new Date() as Date;
