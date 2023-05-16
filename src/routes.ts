import { Router } from 'express';
import { CreateCustomerController } from './controllers/customer/createCustomerController';
import { Validate } from './middlewares/validate';

const router = Router();

router.post(
  '/register',
  new Validate().validate,
  new CreateCustomerController().create,
);

export { router };
