import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserDBUtil } from 'src/user/utils/userDB.util';
import { TokenUtil } from '../utils/token.util';
import { PUBLIC_DECORATOR_KEY } from 'src/common/constants';
import { Request } from 'express';

@Injectable()
export class AuthGuardService implements CanActivate {
  private readonly unauthorizedMessage =
    'You are required to log in before continue.';

  constructor(
    private readonly reflector: Reflector,
    private readonly userDBUtil: UserDBUtil,
    private readonly tokenUtil: TokenUtil,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_DECORATOR_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromRequest(req);
    const verificationCode = this.extractVerificationCodeFromRequest(req);
    const isTokeValid = this.tokenUtil.verifyToken(token, verificationCode);

    if (!isTokeValid) {
      console.log(`Token no longer valid: ${token}`);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    const { userId } = this.tokenUtil.decodeToken<{ userId: string }>(token);

    if (!userId) {
      console.log(`Invalid userId in token: ${userId}`);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    const user = await this.userDBUtil.getOne({
      criterial: {
        uuid: userId,
      },
      relation: {
        account: true,
      },
    });

    if (!user) {
      console.log(`User not found: ${userId}`);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    req.user = user;
    return true;
  }

  private extractTokenFromRequest(req: Request): string {
    if (!('token' in req.cookies)) {
      console.log(
        `Token is not found in request cookies: ${JSON.stringify(req.cookies)}`,
      );
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    const { token } = req.cookies;

    if (typeof token !== 'string') {
      console.log(`Invalid token: (Type - ${typeof token}) ${token}`);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    return token;
  }

  private extractVerificationCodeFromRequest(req: Request) {
    if (!req.headers.authorization) {
      console.log(
        `Verification code is not in request header authorization section`,
      );
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    if (typeof req.headers.authorization !== 'string') {
      console.log(
        `Invalid verification code: (Type - ${typeof req.headers.authorization}) ${req.headers.authorization}`,
      );
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    const [authLevel, verificationCode] = req.headers.authorization.split(' ');

    if (authLevel.toLowerCase() !== 'bearer') {
      console.log(`Invalid authLevel: ${authLevel}`);
      throw new UnauthorizedException(this.unauthorizedMessage);
    }

    return verificationCode;
  }
}
