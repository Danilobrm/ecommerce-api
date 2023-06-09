import express, { Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';

import { router } from './routes';

const app = express();
app.use(express.json());
app.use(cors());

app.use(router);

app.use((err: Error, req: Request, res: Response) => {
  if (err instanceof Error) {
    // Se for uma instancia do tipo erro
    return res.status(400).json({
      error: err.message,
    });
  }
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3002, () => {
  console.log('Servidor online');
});
