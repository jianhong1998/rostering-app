import { ServerAxiosClient } from '@/utils/axios-client';
import { EnvironmentVariableUtil } from '@/utils/environment-variable.util';
import { isAxiosError } from 'axios';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  const url = `auth`;
  const { searchParams } = req.nextUrl;
  const tokenId = searchParams.get('id');
  const { clientHost } = EnvironmentVariableUtil.getEnvVarList();

  try {
    const { headers, data } = await ServerAxiosClient.get<{
      hashedSecret: string;
    }>(url, {
      params: {
        id: tokenId,
      },
    });

    const cookieString = headers['set-cookie']?.join(';') ?? '';

    const { hashedSecret } = data;

    const res = Response.json(
      { hashedSecret },
      {
        status: 200,
        headers: {
          'Set-Cookie': cookieString,
        },
      },
    );

    return res;
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
