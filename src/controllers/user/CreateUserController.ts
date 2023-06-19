import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { CreateUserService } from '../../services/user/CreateUserService';
import { CreateRequest } from '../../interfaces/controllers/CRUD';

export class CreateUserController implements CreateRequest {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const passwordHash = await hash(password, 8);

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      name,
      email,
      password: passwordHash,
    });

    return res.json(user);
  }
}
