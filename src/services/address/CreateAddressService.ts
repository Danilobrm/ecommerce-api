import prismaClient from '../../prisma';
import { AddressData } from '../../interfaces/address/services/createAddressServiceProtocol';

export class CreateAddressService {
  async execute(data: AddressData) {
    const response = await prismaClient.address.create({
      data: data,
      select: { street: true, number: true, city: true, district: true, postal_code: true, user_id: true },
    });

    return response;
  }
}
