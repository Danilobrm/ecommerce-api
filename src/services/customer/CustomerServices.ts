import prismaClient from '../../prisma';
import { ICustomer, ICreateCustomerService } from '../../interfaces/customer';
import { hash } from 'bcryptjs';

class CreateCustomerService implements ICreateCustomerService {
  async execute({ name, email, password }: ICustomer) {
    const passwordHash = await hash(password, 8);

    const customer = await prismaClient.customer.create({
      data: {
        name: name,
        email: email,
        password: passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return customer;
  }
}

export { CreateCustomerService };
