'use server';

import { cookies } from 'next/headers';

import { ServerAxiosClient } from '@/utils/axios-client';
import { EnvironmentVariableUtil } from '@/utils/environment-variable.util';

export const getUser = async (authKey: string) => {
  const useCookie = cookies();
  const token = useCookie.get('token')?.value ?? '';

  const { serverHost } = EnvironmentVariableUtil.getEnvVarList();
  const url = `${serverHost}/user`;

  // const res = await ServerAxiosClient.get('/user', {
  //   headers: {
  //     Cookie: `token=${token}`,
  //     Authorization: `Bearer ${authKey}`,
  //   },
  // });
  const headers = new Headers({
    Cookie: useCookie
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; '),
    Authorization: `Bearer ${authKey}`,
  });
  const res = await fetch(url, {
    headers,
    credentials: 'include',
    method: 'GET',
    cache: 'default',
  });

  const data = await res.json();

  return data;
};
