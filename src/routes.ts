import { Router } from 'express';
import { CreateCustomer } from './controllers/customer/createCustomer';
import { ValidateUser } from './middlewares/validate';

const router = Router();

router.post(
  '/register',
  new ValidateUser().validate,
  new CreateCustomer().create,
);

export { router };
