import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Language = createParamDecorator((_, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return request.headers['x-custom-lang'] || process.env.FALLBACK_LANGUAGE;
});
