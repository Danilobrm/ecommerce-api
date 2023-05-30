import { Request, Response } from 'express';
import { prismaMock } from '../../../../singleton';
import { CreateRequest } from '../../../../interfaces/controllers/CRUD';
import { MockCreateAddressService } from '../../../services/address/addressRepository.spec';

class CreateAddress implements CreateRequest {
  async create(req: Request, res: Response): Promise<Response> {
    const { street, number, district, city, state, postal_code, customer_id } =
      req.body;

    const createAddressRepository = new MockCreateAddressService();

    const address = await createAddressRepository.create({
      street: street,
      number: number,
      district: district,
      city: city,
      state: state,
      postal_code: postal_code,
      customer: { connect: { id: customer_id } },
    });

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

const mockResolvedAddress = {
  id: 1,
  complement: '',
  street: 'rua 8',
  number: 'SN',
  city: 'luziânia',
  district: 'Parque estrela dalva VII',
  postal_code: '72830080',
  state: 'Goiás',
  customer_id: 1,
};
