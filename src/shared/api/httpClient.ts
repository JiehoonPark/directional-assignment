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
    throw new Error(response.statusText);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json() as TResponse;
}
