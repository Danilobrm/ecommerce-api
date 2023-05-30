import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { CreateUserService } from '../../services/customer/CreateUserService';
import { CreateRequest } from '../../interfaces/controllers/CRUD';

export class CreateUserController implements CreateRequest {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const passwordHash = await hash(password, 8);

    const createCustomerService = new CreateUserService();

    const customer = await createCustomerService.create({
      name,
      email,
      password: passwordHash,
    });

    return res.json(customer);
  }
}
