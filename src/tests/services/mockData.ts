import { ModelSelect } from '../../interfaces/repository';

export const mockSelect: ModelSelect['customer'] = {
  id: true,
  name: true,
  email: true,
};

export const mockDate = new Date() as Date;

// data to be sent to create user
export const mockData = {
  name: 'test',
  email: 'test@example.com',
  password: '12345678',
};

// resolved data
export const mockResolvedUser = {
  id: 1,
  name: 'test',
  email: 'test@example.com',
  password: '12345678',
  created_at: mockDate,
  updated_at: mockDate,
};
