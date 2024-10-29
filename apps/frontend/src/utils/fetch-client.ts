export class FetchClient {
  private constructor() {}

  public static async sendJsonRequest(
    url: string,
    init?: {
      config?: Omit<RequestInit, 'headers'>;
      headers?: Headers;
    },
  ) {
    const config = init?.config ?? {};
    const headers = init?.headers ?? new Headers();

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return await fetch(url, { ...config, headers });
  }
}
