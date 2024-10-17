'use server';

import { cookies } from 'next/headers';

import { CookieHandler } from '@/utils/cookie-handler.utill';
import { EnvironmentVariableUtil } from '@/utils/environment-variable.util';

export const getUser = async (authKey: string) => {
  const cookieStore = cookies();

  const { serverHost } = EnvironmentVariableUtil.getEnvVarList();
  const url = `${serverHost}/user`;

  const headers = new Headers({
    Cookie: CookieHandler.extractAllCookies(cookieStore),
    Authorization: `Bearer ${authKey}`,
  });
  const res = await fetch(url, {
    headers,
    credentials: 'include',
    method: 'GET',
    cache: 'default',
    next: {
      tags: ['all-users'],
    },
  });

  const data = await res.json();

  return data;
};
