import { prismaMock } from '../../../singleton';
import {
  createSut,
  mockData,
  mockDate,
  mockResolvedUser,
  mockSelect,
} from './mockRepository';

afterEach(() => jest.clearAllMocks());

describe('test create customer on database', () => {
  const sut = createSut();

  it('should create customer', async () => {
    prismaMock.customer.create.mockResolvedValue(mockResolvedUser);

    await expect(sut.create(mockData, mockSelect)).resolves.toEqual({
      id: 1,
      name: 'test',
      email: 'test@example.com',
      password: '12345678',
      created_at: mockDate,
      updated_at: mockDate,
    });
  });
});
