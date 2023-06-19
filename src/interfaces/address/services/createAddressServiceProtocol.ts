export interface AddressData {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  postal_code: string;
  user: { connect: { id: string } };
}
