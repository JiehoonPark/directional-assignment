export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://fe-hiring-rest-api.vercel.app';

export const BANNED_WORDS = ['캄보디아', '프놈펜', '불법체류', '텔레그램'] as const;

export const POST_TAG_MAX = 5;
export const POST_TAG_LENGTH_MAX = 24;
export const POST_TITLE_MAX = 80;
export const POST_BODY_MAX = 2000;
