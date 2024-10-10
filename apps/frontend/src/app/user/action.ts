'use server';

import { ServerAxiosClient } from '@/utils/axios-client';
import { cookies } from 'next/headers';

export const getUser = async (authKey: string) => {
  const useCookie = cookies();
  const token = useCookie.get('token')?.value ?? '';

  const res = await ServerAxiosClient.get('/user', {
    headers: {
      Cookie: `token=${token}`,
      Authorization: `Bearer ${authKey}`,
    },
  });

  return res.data;
};
