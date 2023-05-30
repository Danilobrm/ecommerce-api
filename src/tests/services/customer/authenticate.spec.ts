import {
  AuthUserService,
  IUserAuthData,
  IUserAuthReturn,
} from '../../../interfaces/customer/services/authUserServiceProtocol';

class MockAuthenticateCustomerRepository implements AuthUserService {
  async authenticate({
    email,
    password,
  }: IUserAuthData): Promise<IUserAuthReturn> {
    return {
      id: 1,
      name: 'John Doe',
      email: email,
      token: '1234567890',
    };
  }
}

const createSut = () => {
  return new MockAuthenticateCustomerRepository();
};

const mockData = {
  email: 'test@example.com',
  password: '123456789',
};

describe('should authenticate the user in the database', () => {
  it('should be called once', async () => {
    const sut = createSut();
    const spy = jest.spyOn(sut, 'authenticate');

    const login = await sut.authenticate(mockData);

    expect(spy).toBeCalledTimes(1);
    expect(login).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'test@example.com',
      token: '1234567890',
    });
  });
});
