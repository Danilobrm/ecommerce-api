import { Router } from 'express';
import { ValidateUserRegister } from './middlewares/crud/validation/create';
import { ValidateUserAuth } from './middlewares/auth/validation/validation';
import { CreateAddressController } from './controllers/address/CreateAddressController';
import { CreateUserController } from './controllers/customer/CreateUserController';
import { AuthUserController } from './controllers/customer/AuthUserController';

const router = Router();

router.post(
  '/register',
  new ValidateUserRegister().validate,
  new CreateUserController().create,
);

router.post(
  '/login',
  new ValidateUserAuth().validate,
  new AuthUserController().authenticate,
);

router.post('/address', new CreateAddressController().create);

export { router };
