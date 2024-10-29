'use server';

import { cookies } from 'next/headers';

import { IBackendErrorResponse } from '@/common/types/backend-response.type';
import { IServerActionResponse } from '@/common/types/server-action-response.type';
import { CookieHandler } from '@/utils/cookie-handler.utill';
import { EnvironmentVariableUtil } from '@/utils/environment-variable.util';
import { FetchClient } from '@/utils/fetch-client';

export const login = async (
  tokenId: string,
): Promise<IServerActionResponse<{ hashedSecret: string }>> => {
  const { serverHost } = EnvironmentVariableUtil.getEnvVarList();
  const url = `${serverHost}/auth?id=${tokenId}`;

  const res = await FetchClient.sendJsonRequest(url, {
    config: {
      method: 'GET',
      credentials: 'include',
      cache: 'no-cache',
    },
  });

  if (!res.ok) {
    const errorData = (await res.json()) as IBackendErrorResponse;

    console.error({ key: 'Failed to login', payload: { tokenId }, errorData });

    return {
      isSuccess: false,
      error: {
        statusCode: res.status,
        errorMessage: errorData.message,
      },
    };
  }

  const data = (await res.json()) as { hashedSecret: string };

  const cookieStore = cookies();
  const setCookieArray = res.headers.getSetCookie();
  CookieHandler.handleSetCookies(cookieStore, setCookieArray);

  return {
    isSuccess: true,
    data: {
      hashedSecret: data.hashedSecret,
    },
  };
};
