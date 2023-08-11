import { Request, Response } from 'express';
import { prismaMock } from '../../../../singleton';
import { Category } from '@prisma/client';
import { CreateCategoryController } from '../../../../controllers/category/CreateCategoryController';

interface Dependencies {
  mockRequest: Request;
  mockResponse: Response;
}

describe('create category test', () => {
  it('should be called once', async () => {
    const sut = new CreateCategoryController();
    const spy = jest.spyOn(sut, 'create');
    await sut.create(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(spy).toBeCalledTimes(1);
  });

  it('should create category in database and return its json', async () => {
    const sut = new CreateCategoryController();
    const mockResolvedValue = { id: 'id', name: 'roupas', created_at: mockDate, updated_at: mockDate };
    prismaMock.category.create.mockResolvedValue(mockResolvedValue);

    await expect(sut.create(_dependencies.mockRequest, _dependencies.mockResponse)).resolves.toEqual(
      JSON.stringify(mockResolvedValue),
    );
  });

  it('should give error if no category name was provided', async () => {
    _dependencies.mockRequest.body.name = '';

    const sut = new CreateCategoryController();
    const category = await sut.create(_dependencies.mockRequest, _dependencies.mockResponse);

    expect(category).toEqual(JSON.stringify({ status: 400, response: 'Categoria precisa de um nome!' }));
  });
});

const _dependencies: Dependencies = {
  mockRequest: {
    body: { name: 'roupas' },
  } as unknown as Request,
  mockResponse: {
    status: jest.fn((status: number) => status),
    json: jest.fn((response: Category) => JSON.stringify(response)),
  } as unknown as Response,
};

const mockDate = new Date() as Date;
