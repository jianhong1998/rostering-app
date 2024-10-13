'use server';

import { cookies } from 'next/headers';

import { IServerActionResponse } from '@/common/types/server-action-response.type';
import { ServerAxiosClient } from '@/utils/axios-client';

type IAuthEndpointResponse = {
  hashedSecret: string;
};

export const login = async (
  tokenId: string,
): Promise<IServerActionResponse<IAuthEndpointResponse>> => {
  try {
    const { data, headers } =
      await ServerAxiosClient.get<IAuthEndpointResponse>(`/auth`, {
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

    console.log({
      hashedSecret: data.hashedSecret,
      cookies: cookieStore.getAll().map(({ name, value }) => ({ name, value })),
    });

    return { isSuccess: true, data };
  } catch (error) {
    console.error(error);
    return {
      isSuccess: false,
      error,
    };
  }
};
