import { NextResponse } from 'next/server';

import { EnvironmentVariableUtil } from '@/utils/environment-variable.util';

const loginPathRegExp = /^\/login/;
/* Path: /auth/{uuid} */
const validAuthPathRegExp =
  /^\/auth\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
const invalidAuthPathRegExp = /^\/auth(\/.*)?$/;

export class AuthRouteMiddleware {
  private static AUTH_PATH_LIST = [
    loginPathRegExp,
    validAuthPathRegExp,
    invalidAuthPathRegExp,
  ];

  private constructor() {}

  public static handler(
    isTokenValid: boolean,
    path: string,
  ): NextResponse | null {
    const { clientHost } = EnvironmentVariableUtil.getEnvVarList();

    if (validAuthPathRegExp.test(path)) {
      return null;
    }

    if (isTokenValid || invalidAuthPathRegExp.test(path))
      return NextResponse.redirect(`${clientHost}/`);

    return null;
  }

  public static checkIsAuthPath(path: string): boolean {
    const isAuthPath = this.AUTH_PATH_LIST.some((regExp) => regExp.test(path));

    return isAuthPath;
  }
}
