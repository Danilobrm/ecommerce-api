import { Request, Response } from 'express';

export interface CreateRequest {
  create(req: Request, res: Response): Promise<Response>;
}

export interface ReadRequest {
  read(req: Request, res: Response): Promise<Response>;
}

export interface UpdateRequest {
  update(req: Request, res: Response): Promise<Response>;
}

export interface DeleteRequest {
  delete(req: Request, res: Response): Promise<Response>;
}
