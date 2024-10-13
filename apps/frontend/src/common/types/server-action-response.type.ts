export type IServerActionResponse<T> =
  | {
      isSuccess: true;
      data: T;
    }
  | {
      isSuccess: false;
      error: unknown;
    };
