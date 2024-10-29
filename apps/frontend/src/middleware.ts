import { NextRequest, NextResponse } from 'next/server';

import { AuthRouteMiddleware } from './middlewares/auth-route.middleware';
import { EnvironmentVariableUtil } from './utils/environment-variable.util';
import { FetchClient } from './utils/fetch-client';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

const loginPathRegExp = /^\/login/;
/* Path: /auth/{uuid} */
const validAuthPathRegExp =
  /^\/auth\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

const PUBLIC_PATH_LIST = [loginPathRegExp, validAuthPathRegExp];

export const middleware = async (req: NextRequest) => {
  const { clientHost } = EnvironmentVariableUtil.getEnvVarList();
  const jwtToken = req.cookies.get('token')?.value;
  const path = req.nextUrl.pathname;

  const isPathInPublicList = PUBLIC_PATH_LIST.some((publicPathRegExp) =>
    publicPathRegExp.test(path),
  );
  const isAuthPath = AuthRouteMiddleware.checkIsAuthPath(path);

  let isTokenValid = false;

  /**
   * This part is doing verification about token.
   * If user visit non-public page without valid token, then should be redirected to login page
   */

  if (!isPathInPublicList && !jwtToken) {
    return NextResponse.redirect(`${clientHost}/login`);
  }

  if (jwtToken) {
    try {
      const { serverHost } = EnvironmentVariableUtil.getEnvVarList();
      const url = `${serverHost}/auth/verify`;

      const res = await FetchClient.sendJsonRequest(url, {
        config: {
          method: 'POST',
          body: JSON.stringify({ token: jwtToken }),
          cache: 'no-cache',
        },
      });

      const data = (await res.json()) as { isTokenValid: boolean };

      isTokenValid = data.isTokenValid;
    } catch {
      isTokenValid = false;
    }
  }

  if (!isPathInPublicList && !isTokenValid) {
    const res = NextResponse.redirect(`${clientHost}/login`);
    res.cookies.delete('token');
    return res;
  }

  /**
   * This part is to handle if the case of path is auth path
   */

  if (isAuthPath) {
    const res = AuthRouteMiddleware.handler(isTokenValid, path);
    if (res) return res;
  }
};
