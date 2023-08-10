import multer from 'multer';
import uploadConfig from './config/multer';
import { Router } from 'express';

import { ValidateUserRegister } from './middlewares/crud/validation/validateRegister';
import { ValidateUserAuthentication } from './middlewares/auth/validation/validateUserAuthentication';
import { isAuthenticated } from './middlewares/auth/isAuthenticated';

import { CreateUserController } from './controllers/user/CreateUserController';
import { CreateAddressController } from './controllers/address/CreateAddressController';
import { CreateCategoryController } from './controllers/category/CreateCategoryController';
import { CreateProductController } from './controllers/product/CreateProductController';

import { AddItemController } from './controllers/cart/AddItemController';

import { AuthUserController } from './controllers/user/AuthUserController';
import { CheckUserCart } from './middlewares/crud/validation/CheckUserCart';
import { RemoveItemController } from './controllers/cart/RemoveItemController';

import { DetailCartController } from './controllers/cart/DetailCartController';
import { DeleteCartController } from './controllers/cart/DeleteCartController';

const router = Router();
const upload = multer(uploadConfig.upload(`./tmp`));

// auth routes
router.post('/register', new ValidateUserRegister().validate, new CreateUserController().create);
router.post('/login', new ValidateUserAuthentication().validate, new AuthUserController().authenticate);
router.post('/address', isAuthenticated, new CreateAddressController().create);

// category routes
router.post('/category', isAuthenticated, new CreateCategoryController().create);

// product routes
router.post('/product', isAuthenticated, upload.single('file'), new CreateProductController().create);

// cart items routes
router.post('/cart/add', isAuthenticated, new CheckUserCart().check, new AddItemController().add);
router.delete('/cart/remove', isAuthenticated, new RemoveItemController().remove, new DeleteCartController().delete);
router.get('/cart/detail', isAuthenticated, new DetailCartController().read);

export { router };
