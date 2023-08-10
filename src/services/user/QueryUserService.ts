import { User } from '@prisma/client';
import { QueryRequestService } from '../../interfaces/services';
import prismaClient from '../../prisma';

interface QueryRequest {
  email: string;
}

export class QueryUserService implements QueryRequestService<QueryRequest, User | null> {
  async queryUserByEmail({ email }: QueryRequest): Promise<User | null> {
    const userAlreadyExists = await prismaClient.user.findFirst({ where: { email: email } });

    return userAlreadyExists;
  }
}
