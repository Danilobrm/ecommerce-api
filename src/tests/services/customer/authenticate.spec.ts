import {
  IAuthUserService,
  IUserAuthData,
  IUserAuthReturn,
} from '../../../interfaces/customer/services/authUserServiceProtocol';

class MockAuthenticateCustomerRepository implements IAuthUserService {
  async authenticate({
    email,
    password,
  }: IUserAuthData): Promise<IUserAuthReturn> {
    const user = {
      email: email === 'test@example.com',
      password: '123456789',
    };

    if (!user.email) {
      throw new Error('Usuário não encontrado');
    }

    const passwordMatch = password === user.password;

    if (!passwordMatch) {
      throw new Error('Senha incorreta!');
    }

    return {
      id: '1',
      name: 'John Doe',
      email: email,
      token: '123456789',
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
  const sut = createSut();
  it('should be called once', async () => {
    const spy = jest.spyOn(sut, 'authenticate');
    await sut.authenticate(mockData);

    expect(spy).toBeCalledTimes(1);
  });

  it('should return auth data', async () => {
    const login = await sut.authenticate({
      email: 'test@example.com',
      password: '123456789',
    });

    expect(login).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'test@example.com',
      token: '123456789',
    });
  });
});
