import { Request, Response, Router } from 'express';
import { CreateCustomer } from './controllers/customer/createCustomer';
import { CreateAddress } from './controllers/address/createAddress';
import prismaClient from './prisma';
import { ValidateUserRegister } from './middlewares/validation/validateUser';

const router = Router();

router.post(
  '/register',
  new ValidateUserRegister().validate,
  new CreateCustomer().create,
);

router.get('/customers', async (req: Request, res: Response) => {
  const users = await prismaClient.customer.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return res.json(users);
});

router.post('/address', new CreateAddress().create);

export { router };
