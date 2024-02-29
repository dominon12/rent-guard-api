import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { JwtPayload } from './interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;
    return data ? user?.[data] : user;
  },
);
