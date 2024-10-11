'use server';

import { cookies } from 'next/headers';

import { ServerAxiosClient } from '@/utils/axios-client';

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
