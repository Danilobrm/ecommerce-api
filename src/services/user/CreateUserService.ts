import prismaClient from '../../prisma';

export interface UserRequest {
  name: string;
  email: string;
  password: string;
}

export class CreateUserService {
  async create({ name, email, password }: UserRequest) {
    const response = await prismaClient.user.create({
      data: { name: name, email: email, password: password },
      select: { id: true, name: true, email: true },
    });

    return response;
  }
}
