import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from 'src/common/common.constant';
import { IContext, ISession } from 'src/common/common.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx: IContext = GqlExecutionContext.create(context).getContext();
    const session: ISession = ctx.req.session;
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('Cookie : ', ctx.req.headers.cookie);

    if (isPublic) {
      return true;
    }
    if (ctx.req.headers['cookie'] && session.user) {
      return true;
    }
    return false;
  }
}
