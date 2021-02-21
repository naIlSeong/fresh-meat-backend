import session from 'express-session';
import { User } from 'src/user/user.entity';
import express from 'express';

export interface IContext {
  req: express.Request;
  res: express.Response;
}

declare module 'express-session' {
  interface SessionData extends session.Session {
    user?: User;
  }
}
