import { Request, Response } from 'express';
import { ICreateAddress } from '../../interfaces/address';
import {
  MockRepository,
  mockResolvedAddress,
} from '../services/address/mockRepository';
import { Prisma } from '@prisma/client';
import { prismaMock } from '../../singleton';

class CreateAddress implements ICreateAddress {
  async create(req: Request, res: Response): Promise<Response> {
    const { street, number, district, city, state, postal_code, customer_id } =
      req.body;
    const createAddressRepository = new MockRepository();

    const mockAddressData: Prisma.AddressCreateInput = {
      street: street,
      number: number,
      district: district,
      city: city,
      state: state,
      postal_code: postal_code,
      customer: { connect: { id: customer_id } },
    };

    const mockSelect: Prisma.AddressSelect = {
      id: true,
      street: true,
      number: true,
      district: true,
      city: true,
      state: true,
      postal_code: true,
      customer_id: true,
    };

    const address = await createAddressRepository.create(
      mockAddressData,
      mockSelect,
    );

    return res.json(address);
  }
}

const mockRequest = {
  body: {
    id: 1,
    complement: '',
    street: 'rua 8',
    number: 'SN',
    city: 'luziânia',
    district: 'Parque estrela dalva VII',
    state: 'Goiás',
    postal_code: '72830080',
    customer_id: 1,
  },
} as unknown as Request;

const mockResponse = {} as unknown as Response;
mockResponse.json = (data: Request): Response =>
  JSON.stringify(data) as unknown as Response;

const createSut = () => {
  return new CreateAddress();
};

describe('customer create address', () => {
  const sut = createSut();
  it('should return a address created json', async () => {
    prismaMock.address.create.mockResolvedValue(mockResolvedAddress);

    await expect(sut.create(mockRequest, mockResponse)).resolves.toEqual(
      JSON.stringify({
        id: 1,
        complement: '',
        street: 'rua 8',
        number: 'SN',
        city: 'luziânia',
        district: 'Parque estrela dalva VII',
        postal_code: '72830080',
        state: 'Goiás',
        customer_id: 1,
      }),
    );
  });
});
