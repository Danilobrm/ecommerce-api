import { Request, Response } from 'express';
import { CreateCategoryService } from '../../services/category/CreateCategoryService';
import { CreateRequest } from '../../interfaces/controllers/CRUD';

class CreateCategoryController implements CreateRequest {
  async create(req: Request, res: Response) {
    const { name } = req.body;

    console.log(req.body);

    const createCategoryService = new CreateCategoryService();

    const category = await createCategoryService.execute({ name });

    return res.json(category);
  }
}

export { CreateCategoryController };
