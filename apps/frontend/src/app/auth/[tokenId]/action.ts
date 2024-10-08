'use server';

import { AxiosClient } from '@/utils/axios-client';
import { isAxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const getToken = async (tokenId: string) => {
  const url = `/auth`;
  const cookieStore = cookies();

  try {
    const res = await AxiosClient.get<{ hashedSecret: string }>(url, {
      params: {
        id: tokenId,
      },
    });

    const cookieList = res.headers['set-cookie'];

    cookieList?.map((cookie) => {
      const stringArr = cookie.split('=');
      const key = stringArr[0];
      const value = stringArr.filter((_, index) => index !== 0).join('');

      cookieStore.set(key, value, { httpOnly: true });
    });

    const { hashedSecret } = res.data;
    return NextResponse.json({ status: 200, hashedSecret }, { status: 200 });
  } catch (error) {
    let resStatus: number;
    let errorCode: string;
    let errorMessage: string;

    if (isAxiosError(error)) {
      const { status, response } = error;

      resStatus = status ?? 500;
      errorCode =
        response?.data.error.error ?? response?.data.error ?? 'UNKOWN_ERROR';
      errorMessage = response?.data.error.message ?? response?.data.message;
    } else if (error instanceof Error) {
      resStatus = 500;
      errorCode = error.name;
      errorMessage = error.message;
    } else {
      resStatus = 500;
      errorCode = 'UNKOWN_ERROR';
      errorMessage = JSON.stringify(error);
    }

    return NextResponse.json(
      {
        status: resStatus,
        error: errorCode,
        message: errorMessage,
      },
      { status: resStatus },
    );
  }
};
