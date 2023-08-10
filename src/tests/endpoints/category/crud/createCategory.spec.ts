import { Request, Response } from 'express';
import { CreateRequest } from '../../../../interfaces/controllers/CRUD';
import prismaClient from '../../../../prisma';
import { prismaMock } from '../../../../singleton';
import { Category } from '@prisma/client';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
}

describe('create category test', () => {
  const _dependencies: Dependencies = {
    mockRequest: {
      body: { name: 'roupas' },
    } as unknown as Request,
    mockResponse: {
      status: jest.fn((status: number) => status),
      json: jest.fn((response: Category) => JSON.stringify(response)),
    } as unknown as Response,
  };

  it('should be called once', async () => {
    const sut = new MockCreateCategoryController();
    const spy = jest.spyOn(sut, 'create');
    await sut.create(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

  it('should create category in database and return its json', async () => {
    const sut = new MockCreateCategoryController();
    const mockResolvedValue = { id: 'id', name: 'roupas', created_at: mockDate, updated_at: mockDate };
    prismaMock.category.create.mockResolvedValue(mockResolvedValue);

    await expect(sut.create(_dependencies.mockRequest, _dependencies.mockResponse)).resolves.toEqual(
      JSON.stringify(mockResolvedValue),
    );
  });

  it('should give error if no category name was provided', async () => {
    _dependencies.mockRequest.body.name = '';

    const sut = new MockCreateCategoryController();
    const category = await sut.create(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(category).toEqual(JSON.stringify({ status: 400, response: 'Categoria precisa de um nome!' }));
  });
});

class MockCreateCategoryController implements CreateRequest {
  async create(req: Request, res: Response) {
    const { name } = req.body;
    if (!name)
      return res.json({
        status: 400,
        response: 'Categoria precisa de um nome!',
      });

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
    const category = await prismaClient.category.create({ data: { name: name }, select: { id: true, name: true } });

    return category;
  }
}

export const mockDate = new Date() as Date;
