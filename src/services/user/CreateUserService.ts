import prismaClient from '../../prisma';
import { CreateRequestService } from '../../interfaces/services';

interface RequestData {
  name: string;
  email: string;
  password: string;
}

interface ResponseData {
  id: string;
  name: string;
  email: string;
}

export class CreateUserService implements CreateRequestService<RequestData, ResponseData> {
  async create({ name, email, password }: RequestData): Promise<ResponseData> {
    const user = await prismaClient.user.create({
      data: { name: name, email: email, password: password },
      select: { id: true, name: true, email: true },
    });
    console.log(user);
    return user;
  }
}
