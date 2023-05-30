import {
  IAddressCreateData,
  IAddressSelectedData,
  ICreateAddressService,
} from '../../../interfaces/address/services/createAddressServiceProtocol';
import prismaClient from '../../../prisma';
import { prismaMock } from '../../../singleton';

export class MockCreateAddressService implements ICreateAddressService {
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

const createSut = () => {
  return new MockCreateAddressService();
};

afterEach(() => jest.clearAllMocks());

describe('test create customer on database', () => {
  const sut = createSut();

  it('should create customer', async () => {
    prismaMock.address.create.mockResolvedValue(mockResolvedAddress);

    await expect(sut.create(mockData)).resolves.toEqual({
      id: '1',
      complement: '',
      street: 'rua 8',
      number: 'SN',
      city: 'luziânia',
      district: 'Parque estrela dalva VII',
      postal_code: '72830080',
      state: 'Goiás',
      customer_id: '1',
    });
  });
});

const mockData: IAddressCreateData = {
  street: 'rua 8',
  number: 'SN',
  city: 'luziânia',
  district: 'Parque estrela dalva VII',
  postal_code: '72830080',
  state: 'Goiás',
  customer: { connect: { id: '1' } },
};

const mockResolvedAddress = {
  id: '1',
  complement: '',
  street: 'rua 8',
  number: 'SN',
  city: 'luziânia',
  district: 'Parque estrela dalva VII',
  postal_code: '72830080',
  state: 'Goiás',
  customer_id: '1',
};
