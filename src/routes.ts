import multer from 'multer';
import { Router } from 'express';

import { ValidateUserRegister } from './middlewares/crud/validation/validateRegister';
import { ValidateUserAuth } from './middlewares/auth/validation/validateAuth';
import { ValidateCategory } from './middlewares/crud/validation/validateCategory';
import { isAuthenticated } from './middlewares/auth/isAuthenticated';

import { CreateUserController } from './controllers/user/CreateUserController';
import { CreateAddressController } from './controllers/address/CreateAddressController';
import { CreateCategoryController } from './controllers/category/CreateCategoryController';
import { CreateProductController } from './controllers/product/CreateProductController';

import { AddItemController } from './controllers/cart/AddItemController';

import { AuthUserController } from './controllers/user/AuthUserController';
import {
  CreateCart,
  DeleteCart,
} from './middlewares/crud/validation/validateCart';
import { RemoveItemController } from './controllers/cart/RemoveItemController';

import uploadConfig from './config/multer';
import { DetailCartController } from './controllers/cart/DetailCartController';

const router = Router();

const upload = multer(uploadConfig.upload(`./tmp`));

// auth routes

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

// category routes

router.post(
  '/category',
  isAuthenticated,
  new ValidateCategory().validate,
  new CreateCategoryController().create,
);

// product routes

router.post(
  '/product',
  isAuthenticated,
  upload.single('file'),
  new CreateProductController().create,
);

// cart items routes
router.post(
  '/cart/add',
  isAuthenticated,
  new CreateCart().validate,
  new AddItemController().add,
);

router.delete(
  '/cart/remove',
  isAuthenticated,
  new RemoveItemController().remove,
  new DeleteCart().validate,
);

router.get('/cart/detail', isAuthenticated, new DetailCartController().read);

export { router };
