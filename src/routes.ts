import { Router } from 'express';
import { CreateCustomer } from './controllers/customer/createCustomer';
import { ValidateUser } from './middlewares/validate';
import { CreateAddress } from './controllers/address/createAddress';

const router = Router();

router.post(
  '/register',
  new ValidateUser().validate,
  new CreateCustomer().create,
);

router.post('/address', new CreateAddress().create);

export { router };
