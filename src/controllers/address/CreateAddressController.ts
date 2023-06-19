import { Request, Response } from 'express';
import { CreateAddressService } from '../../services/address/CreateAddressService';
import { CreateRequest } from '../../interfaces/controllers/CRUD';

export class CreateAddressController implements CreateRequest {
  async create(req: Request, res: Response): Promise<Response> {
    const { street, number, district, city, state, postal_code, user_id } =
      req.body;

    const createAddressRepository = new CreateAddressService();

    const address = await createAddressRepository.execute({
      street: street,
      number: number,
      district: district,
      city: city,
      state: state,
      postal_code: postal_code,
      user: { connect: { id: user_id } },
    });

    return res.json(address);
  }
}
