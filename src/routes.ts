import { Router } from 'express';
import { ValidateUserRegister } from './middlewares/validation/validateUser';
import { CreateAddressController } from './controllers/address/CreateAddressController';
import { CreateUserController } from './controllers/customer/CreateUserController';

const router = Router();

router.post(
  '/register',
  new ValidateUserRegister().validate,
  new CreateUserController().create,
);

router.post('/address', new CreateAddressController().create);

export { router };
