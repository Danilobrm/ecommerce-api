import { Request, Response } from 'express';
import { AddressData } from '../../../../interfaces/address/services/createAddressServiceProtocol';
import prismaClient from '../../../../prisma';
import { prismaMock } from '../../../../singleton';
import { CreateRequest } from '../../../../interfaces/controllers/CRUD';

class MockCreateAddressController implements CreateRequest {
  async create(req: Request, res: Response): Promise<Response> {
    const { street, number, district, city, state, postal_code, user_id } =
      req.body;

    const createAddressRepository = new MockCreateAddressService();

    const address = await createAddressRepository.execute({
      street: street,
      number: number,
      district: district,
      city: city,
      state: state,
      postal_code: postal_code,
      user: { connect: { id: user_id } },
    });

    return res.json(address);
  }
}

class MockCreateAddressService {
  async execute(data: AddressData) {
    const address = await prismaClient.address.create({
      data: data,
      select: {
        street: true,
        number: true,
        city: true,
        district: true,
        postal_code: true,
        state: true,
        user_id: true,
      },
    });

    return address;
  }
}

const createSut = () => {
  return new MockCreateAddressController();
};

describe('user create address', () => {
  const sut = createSut();
  it('should return a address created json', async () => {
    prismaMock.address.create.mockResolvedValue(mockResolvedAddress);

    await expect(sut.create(mockRequest, mockResponse)).resolves.toEqual(
      JSON.stringify({
        id: '1',
        complement: '',
        street: 'rua 8',
        number: 'SN',
        city: 'luziânia',
        district: 'Parque estrela dalva VII',
        postal_code: '72830080',
        state: 'Goiás',
        user_id: '1',
      }),
    );
  });
});

const mockResolvedAddress = {
  id: '1',
  complement: '',
  street: 'rua 8',
  number: 'SN',
  city: 'luziânia',
  district: 'Parque estrela dalva VII',
  postal_code: '72830080',
  state: 'Goiás',
  user_id: '1',
};

const mockRequest = {
  body: {
    id: '1',
    complement: '',
    street: 'rua 8',
    number: 'SN',
    city: 'luziânia',
    district: 'Parque estrela dalva VII',
    state: 'Goiás',
    postal_code: '72830080',
    user_id: 1,
  },
} as unknown as Request;

const mockResponse = {} as unknown as Response;
mockResponse.json = (data: Request): Response =>
  JSON.stringify(data) as unknown as Response;
