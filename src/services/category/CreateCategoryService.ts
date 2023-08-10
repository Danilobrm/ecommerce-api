import { CreateRequestService } from '../../interfaces/services';
import prismaClient from '../../prisma';

interface RequestData {
  name: string;
}

class CreateCategoryService implements CreateRequestService<RequestData, { name: string; id: string }> {
  async create({ name }: RequestData): Promise<{ name: string; id: string }> {
    const category = await prismaClient.category.create({ data: { name: name }, select: { id: true, name: true } });

    return category;
  }
}
export { CreateCategoryService };
