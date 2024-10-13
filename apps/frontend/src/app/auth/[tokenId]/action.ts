'use server';

import { cookies } from 'next/headers';

import { ServerAxiosClient } from '@/utils/axios-client';

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
