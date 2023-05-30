export interface IAddressCreateData {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  postal_code: string;
  customer: Customer;
}

interface Customer {
  connect: { id: string };
}

export interface IAddressSelectedData {
  street: string;
  number: string;
  city: string;
  district: string;
  postal_code: string;
  state: string;
  customer_id: string;
}

export interface ICreateAddressService {
  create(data: IAddressCreateData): Promise<IAddressSelectedData>;
}
