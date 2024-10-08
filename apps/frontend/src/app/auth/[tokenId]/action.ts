import { NextAxiosClient } from '@/utils/axios-client';

export const getToken = async (tokenId: string) => {
  const url = `auth/${tokenId}/api`;

  const { data } = await NextAxiosClient.get<{ hashedSecret: string }>(url, {
    params: {
      id: tokenId,
    },
  });

  localStorage.setItem('key', data.hashedSecret);
};
