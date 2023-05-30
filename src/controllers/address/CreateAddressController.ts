import { Request, Response } from 'express';
import { CreateAddressService } from '../../services/address/CreateAddressService';
import { CreateRequest } from '../../interfaces/controllers/CRUD';

export class CreateAddressController implements CreateRequest {
  async create(req: Request, res: Response): Promise<Response> {
    const { street, number, district, city, state, postal_code, customer_id } =
      req.body;

    const createAddressRepository = new CreateAddressService();

    const address = await createAddressRepository.create({
      street: street,
      number: number,
      district: district,
      city: city,
      state: state,
      postal_code: postal_code,
      customer: { connect: { id: customer_id } },
    });

    return res.json(address);
  }
}
