'use server';

import { ServerAxiosClient } from '@/utils/axios-client';

export const requestLogin = async (email: string): Promise<void> => {
  await ServerAxiosClient.post('/auth', { email });
};
