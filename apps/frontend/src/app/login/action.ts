'use server';

import { CommonErrorMessage } from '@/common/enums/error-message.enum';
import { EnvironmentVariableUtil } from '@/utils/environment-variable.util';
import { FetchErrorHandler } from '@/utils/error-handler.util';
import { FetchClient } from '@/utils/fetch-client';

export const requestLogin = async (email: string): Promise<void> => {
  const { serverHost } = EnvironmentVariableUtil.getEnvVarList();

  const url = `${serverHost}/auth`;
  const res = await FetchClient.sendJsonRequest(url, {
    config: {
      body: JSON.stringify({ email }),
      method: 'POST',
      cache: 'no-cache',
    },
  });

  if (!res.ok) {
    FetchErrorHandler.log({
      logKey: 'Request Login',
      res,
      payload: { email },
    });

    throw new Error(CommonErrorMessage.SOMETHING_WENT_WRONG);
  }
};
