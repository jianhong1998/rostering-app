import { IBackendErrorResponse } from '@/common/types/backend-response.type';

export class FetchErrorHandler {
  private constructor() {}

  public static async log(params: {
    logKey: string;
    res: Response;
    payload?:
      | Record<string, unknown>
      | string
      | number
      | boolean
      | bigint
      | unknown[];
  }) {
    const { logKey, res, payload } = params;

    const errorData = (await res.json()) as unknown;

    if (!this.isBackendErrorResponse(errorData)) {
      console.error(errorData);
      return;
    }

    console.error({
      key: logKey,
      payload,
      errorData,
    });
  }

  private static isBackendErrorResponse(
    responseBody: unknown,
  ): responseBody is IBackendErrorResponse {
    if (typeof responseBody !== 'object' || responseBody === null) return false;

    return (
      'statusCode' in responseBody &&
      typeof responseBody.statusCode === 'number' &&
      'message' in responseBody &&
      typeof responseBody.message === 'string' &&
      'error' in responseBody &&
      typeof responseBody.error === 'string'
    );
  }
}
