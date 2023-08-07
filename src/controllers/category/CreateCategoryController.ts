import { Request, Response } from 'express';
import { CreateCategoryService } from '../../services/category/CreateCategoryService';
import { CreateRequest } from '../../interfaces/controllers/CRUD';

class CreateCategoryController implements CreateRequest {
  async create(req: Request, res: Response) {
    const { name } = req.body;
    if (!name) res.status(400).json('Categoria precisa de um nome!');

    const createCategoryService = new CreateCategoryService();
    const category = await createCategoryService.execute({ name });

    return res.json(category);
  }
}

export { CreateCategoryController };
