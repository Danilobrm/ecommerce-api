import { Request, Response } from 'express';
import { ICreateCustomer } from '../../interfaces/customer';
import { Repository } from '../../services/repository';
import { ModelSelect } from '../../interfaces/repository';
import { ICustomerData } from '../../interfaces/customer';
import { hash } from 'bcryptjs';

export class CreateCustomer implements ICreateCustomer {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    const createCustomerService = new Repository();

    const customerData: ICustomerData = {
      name,
      email,
      password: await hash(password, 8),
    };

    const select: ModelSelect['customer'] = {
      id: true,
      name: true,
      email: true,
    };

    const customer = await createCustomerService.create(
      'customer',
      customerData,
      select,
    );

    return res.json(customer);
  }
}
