import { Request, Response } from 'express';
import { CreateProductService } from '../../services/product/CreateProductService';

class CreateProductController {
  async create(req: Request, res: Response) {
    if (!req.file) return res.status(400).json('error upload file');
    const { filename: banner } = req.file;

    const createProductService = new CreateProductService();
    const product = await createProductService.execute({ ...req.body, banner });

    return res.json(product);
  }
}

export { CreateProductController };
