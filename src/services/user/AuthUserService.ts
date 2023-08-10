import { sign } from 'jsonwebtoken';
import { AuthenticateService } from '../../interfaces/services';

interface RequestData {
  id: string;
  name: string;
  email: string;
}

interface ResponseData {
  id: string;
  name: string;
  email: string;
  token: string;
}

export class AuthUserService implements AuthenticateService<RequestData, ResponseData | ResponseData | string> {
  async authenticate(data: RequestData): Promise<ResponseData | string> {
    const { name, email, id } = data;
    const secretOrPrivateKey = process.env.JWT_SECRET;
    if (!secretOrPrivateKey) return 'Invalid secret or private key';

    // gerar token para o usuario
    const token = sign({ name: name, email: email }, secretOrPrivateKey, { subject: id, expiresIn: '30d' });

    return { ...data, token: token };
  }
}
