import prismaClient from '../../prisma';

import {
  IAddressCreateData,
  IAddressSelectedData,
  ICreateAddressService,
} from '../../interfaces/address/services/createAddressServiceProtocol';

export class CreateAddressService implements ICreateAddressService {
  async create(data: IAddressCreateData): Promise<IAddressSelectedData> {
    const response = await prismaClient.address.create({
      data: data,
      select: {
        street: true,
        number: true,
        city: true,
        district: true,
        postal_code: true,
        state: true,
        customer_id: true,
      },
    });

    return response as IAddressSelectedData;
  }
}
