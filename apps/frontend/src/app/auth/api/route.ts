'use server';

import { EnvironmentVariableUtil } from '@/utils/environment-variable.util';
import axios, { isAxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  const { serverHost } = EnvironmentVariableUtil.getEnvVarList();
  const url = `${serverHost}/auth`;
  const { searchParams } = req.nextUrl;
  const tokenId = searchParams.get('id');

  const cookieStore = cookies();

  try {
    const response = await axios.get<{ hashedSecret: string }>(url, {
      params: {
        id: tokenId,
      },
    });

    const cookies = response.headers['set-cookie'];
    cookies?.map((cookie) => {
      const stringArr = cookie.split('=');
      const key = stringArr[0];
      const value = stringArr.filter((_, index) => index !== 0).join('');

      cookieStore.set(key, value, { httpOnly: true });
    });

    const { hashedSecret } = response.data;

    return Response.json({ hashedSecret }, { status: 200 });
  } catch (error) {
    let resStatus: number;
    let errorCode: string;
    let errorMessage: string;

    if (isAxiosError(error)) {
      const { status, response } = error;

      resStatus = status ?? 500;
      errorCode = response?.data.error.error ?? 'UNKOWN_ERROR';
      errorMessage = response?.data.error.message;
    } else if (error instanceof Error) {
      resStatus = 500;
      errorCode = error.name;
      errorMessage = error.message;
    } else {
      resStatus = 500;
      errorCode = 'UNKOWN_ERROR';
      errorMessage = JSON.stringify(error);
    }

    return Response.json(
      {
        status: resStatus,
        error: errorCode,
        message: errorMessage,
      },
      { status: resStatus },
    );
  }
};
