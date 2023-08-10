import prismaClient from '../../../../prisma';
import { Request, Response } from 'express';
import { prismaMock } from '../../../../singleton';
import { CreateRequest } from '../../../../interfaces/controllers/CRUD';
import { CreateRequestService } from '../../../../interfaces/services';
import { Address } from '@prisma/client';

class MockCreateAddressController implements CreateRequest {
  async create(req: Request, res: Response): Promise<Response> {
    const user_id = req.user_id;

    const createAddressRepository = new MockCreateAddressService();
    const address = await createAddressRepository.create({ ...req.body, user: { connect: { id: user_id } } });

    return res.json(address);
  }
}

interface RequestData {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  postal_code: string;
  user: { connect: { id: string } };
}

class MockCreateAddressService implements CreateRequestService<RequestData, Address> {
  async create(data: RequestData): Promise<Address> {
    const response = await prismaClient.address.create({ data: data });

    return response;
  }
}

const createSut = () => {
  return new MockCreateAddressController();
};

describe('user create address', () => {
  const sut = createSut();
  it('should return a address created json', async () => {
    prismaMock.address.create.mockResolvedValue(mockResolvedAddress);

    await expect(sut.create(mockRequest, mockResponse)).resolves.toEqual(
      JSON.stringify({
        id: '1',
        complement: '',
        street: 'rua 8',
        number: 'SN',
        city: 'luziânia',
        district: 'Parque estrela dalva VII',
        postal_code: '72830080',
        state: 'Goiás',
        user_id: '1',
      }),
    );
  });
});

const mockResolvedAddress = {
  id: '1',
  complement: '',
  street: 'rua 8',
  number: 'SN',
  city: 'luziânia',
  district: 'Parque estrela dalva VII',
  postal_code: '72830080',
  state: 'Goiás',
  user_id: '1',
};

const mockRequest = {
  body: {
    id: '1',
    complement: '',
    street: 'rua 8',
    number: 'SN',
    city: 'luziânia',
    district: 'Parque estrela dalva VII',
    state: 'Goiás',
    postal_code: '72830080',
  },
  user_id: 1,
} as unknown as Request;

const mockResponse = {} as unknown as Response;
mockResponse.json = (data: Request): Response => JSON.stringify(data) as unknown as Response;
