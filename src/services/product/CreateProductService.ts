import { Product } from '@prisma/client';
import { CreateRequestService } from '../../interfaces/services';
import prismaClient from '../../prisma';

class CreateProductService implements CreateRequestService<Product> {
  async create({ name, price, description, banner, category_id }: Product): Promise<Product> {
    const product = await prismaClient.product.create({ data: { name, price, description, banner, category_id } });

    return product;
  }
}

export { CreateProductService };
