class CreateCustomerControllerMock {
  create(req, res) {
    const { name, email, password } = req.body;

    const customerService = new CreateCustomerServiceMock();

    const customer = customerService.execute({
      name,
      email,
      password,
    });

    return JSON.stringify(customer);
  }
}

class CreateCustomerServiceMock {
  execute({ name, email, password }) {
    const customer = {
      id: 1,
      email: email,
      name: name,
    };
    return customer;
  }
}

const createCustomer = () => {
  const req = {
    body: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '12345678',
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  return new CreateCustomerControllerMock().create(req, res);
};

afterEach(() => jest.clearAllMocks());

describe('customer', () => {
  it('creates a new customerr', async () => {
    const sut = await createCustomer();

    expect(sut).toStrictEqual(
      JSON.stringify({
        id: 1,
        email: 'john.doe@example.com',
        name: 'John Doe',
      }),
    );
  });
});
