import { httpRequest } from '@/shared/api';

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
  };
};

export async function login(payload: LoginPayload) {
  return httpRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}
