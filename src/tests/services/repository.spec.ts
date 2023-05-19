import { prismaMock } from '../../singleton';
import { createSut } from './mockRepository';
import {
  mockDate,
  mockData,
  mockSelect,
  mockResolvedUser,
} from './customer/mockDataCustomer';

afterEach(() => jest.clearAllMocks());

describe('test database repository create function', () => {
  const sut = createSut();

  it('should create customer', async () => {
    prismaMock.customer.create.mockResolvedValue(mockResolvedUser);

    await expect(sut.create('customer', mockData, mockSelect)).resolves.toEqual(
      {
        id: 1,
        name: 'test',
        email: 'test@example.com',
        password: '12345678',
        created_at: mockDate,
        updated_at: mockDate,
      },
    );
  });
});
