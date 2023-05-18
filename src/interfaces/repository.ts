import { Prisma } from '@prisma/client';
import { ICustomerSelectedData } from './customer';

export interface IRepository {
  create<T extends keyof ModelInputs>(
    tableName: T,
    data: ModelInputs[T],
    select: ModelSelect[T],
  ): Promise<ICustomerSelectedData>;
}

export interface ModelNames {
  customer: Uncapitalize<Prisma.ModelName>;
  // Add other models here
}

export interface ModelInputs {
  customer: Prisma.CustomerCreateInput;
}

export interface ModelSelect {
  customer: Prisma.CustomerSelect;
}
