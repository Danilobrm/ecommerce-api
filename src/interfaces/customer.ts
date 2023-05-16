export interface ICustomer {
  name: string;
  email: string;
  password: string;
}

export interface ICreateCustomerController {
  create: (req: Request, res: Response) => Response;
}

export interface ICreateCustomerService {
  execute: ({ name, email, password }: ICustomer) => Promise<{
    name: string;
    email: string;
    id: number;
  }>;
}

type Request = {
  body: {
    name: string;
    email: string;
    password: string;
  };
};

type Response = {
  status: jest.Mock<any, any, any>;
  json: jest.Mock<any, any, any>;
};
