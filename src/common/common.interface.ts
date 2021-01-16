import { Request, Response } from 'express';
import session from 'express-session';
import { User } from 'src/user/user.entity';

export interface IContext {
  req: Request;
  res: Response;
}

export interface ISession extends session.Session {
  user?: User;
}
