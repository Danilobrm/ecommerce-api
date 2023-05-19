import { prismaMock } from '../../../singleton';
import {
  createSut,
  mockData,
  mockResolvedAddress,
  mockSelect,
} from './mockRepository';

afterEach(() => jest.clearAllMocks());

describe('test create customer on database', () => {
  const sut = createSut();

  it('should create customer', async () => {
    prismaMock.address.create.mockResolvedValue(mockResolvedAddress);

    await expect(sut.create(mockData, mockSelect)).resolves.toEqual({
      id: 1,
      complement: '',
      street: 'rua 8',
      number: 'SN',
      city: 'luziânia',
      district: 'Parque estrela dalva VII',
      postal_code: '72830080',
      state: 'Goiás',
      customer_id: 1,
    });
  });
});
