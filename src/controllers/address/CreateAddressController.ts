import { Request, Response } from 'express';
import { CreateAddressService } from '../../services/address/CreateAddressService';
import { CreateRequest } from '../../interfaces/controllers/CRUD';

export class CreateAddressController implements CreateRequest {
  async create(req: Request, res: Response): Promise<Response> {
    const user_id = req.user_id;

    const createAddressRepository = new CreateAddressService();
    const address = await createAddressRepository.execute({ ...req.body, user: { connect: { id: user_id } } });

    return res.json(address);
  }
}
