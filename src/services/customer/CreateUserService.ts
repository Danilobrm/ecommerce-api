import {
  ICreateUserService,
  IUserCreateData,
  IUserSelectedData,
} from '../../interfaces/customer/services/createUserServiceProtocol';
import prismaClient from '../../prisma';

export class CreateUserService implements ICreateUserService {
  async create({
    name,
    email,
    password,
  }: IUserCreateData): Promise<IUserSelectedData> {
    const response = await prismaClient.customer.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return response as IUserSelectedData;
  }
}
