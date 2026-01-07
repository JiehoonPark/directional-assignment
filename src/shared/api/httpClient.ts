import { API_BASE_URL } from '@/shared/config/constants';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  token?: string;
  signal?: AbortSignal;
};

export async function httpRequest<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse | null> {
  const { token, method = 'GET', headers, body, signal } = options;

  const mergedHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers ?? {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: mergedHeaders,
    body: body ? JSON.stringify(body) : undefined,
    signal,
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = response.statusText || '요청이 실패했습니다.';
    try {
      const errorBody = await response.json();
      const rawMessage = errorBody?.message;
      if (typeof rawMessage === 'string') {
        message = rawMessage;
      }
    } catch {
      // ...
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json() as TResponse;
}
