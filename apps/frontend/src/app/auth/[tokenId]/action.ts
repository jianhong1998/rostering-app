'use server';

import { cookies } from 'next/headers';

import { ServerAxiosClient } from '@/utils/axios-client';
import { EnvironmentVariableUtil } from '@/utils/environment-variable.util';
import { CookieHandler } from '@/utils/cookie-handler.utill';

export const login = async (tokenId: string) => {
  const { data, headers } = await ServerAxiosClient.get<{
    hashedSecret: string;
  }>(`/auth`, {
    params: {
      id: tokenId,
    },
  });

  const cookieStore = cookies();

  headers['set-cookie']?.forEach((cookie) => {
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

  return data;
};

export const loginWithFetch = async (tokenId: string) => {
  const { serverHost } = EnvironmentVariableUtil.getEnvVarList();
  const url = `${serverHost}/auth?id=${tokenId}`;

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-cache',
  });

  if (!res.ok) {
    throw new Error(
      `${res.status}[${res.statusText}]: ${JSON.stringify(await res.json())}`,
    );
  }

  const data = (await res.json()) as { hashedSecret: string };

  const cookieStore = cookies();
  const setCookieArray = res.headers.getSetCookie();
  CookieHandler.handleSetCookies(cookieStore, setCookieArray);

  return { hashedSecret: data.hashedSecret };
};
