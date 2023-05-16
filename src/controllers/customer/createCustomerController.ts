import { Request, Response } from 'express';
import { CreateCustomerService } from '../../services/customer/CustomerServices';

class CreateCustomerController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const customerService = new CreateCustomerService();

    const customer = await customerService.execute({ name, email, password });

    return res.json(customer);
  }
}

export { CreateCustomerController };
