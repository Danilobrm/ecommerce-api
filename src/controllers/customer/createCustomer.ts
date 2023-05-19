import { Request, Response } from 'express';
import { ICreateCustomer } from '../../interfaces/customer';
import { Repository } from '../../services/customer/repository';
import { hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';

export class CreateCustomer implements ICreateCustomer {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    const createCustomerService = new Repository();

    const customerData: Prisma.CustomerCreateInput = {
      name,
      email,
      password: await hash(password, 8),
    };

    const select: Prisma.CustomerSelect = {
      id: true,
      name: true,
      email: true,
    };

    const customer = await createCustomerService.create(customerData, select);

    return res.json(customer);
  }
}
