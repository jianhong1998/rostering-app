import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export class CookieHandler {
  private constructor() {}

  public static handleSetCookies(
    cookieStore: ReadonlyRequestCookies,
    setCookieArray: string[],
  ) {
    setCookieArray?.forEach((cookie) => {
      const attributes = cookie.split('; ');
      const cookieName = attributes[0].split('=')[0];

      const map = new Map(
        attributes.map((att) => {
          const [key, ...value] = att.split('=');
          return [key, value?.join()];
        }),
      );

      cookieStore.set(cookieName, map.get(cookieName) ?? '', {
        httpOnly: map.has('HttpOnly'),
        domain: map.get('Domain'),
        path: map.get('Path'),
        sameSite: map.get('SameSite') as 'lax' | 'strict' | 'none' | undefined,
        secure: map.has('Secure'),
      });
    });
  }
}
