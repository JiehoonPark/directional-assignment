let runtimeToken: string | null = null;

export const tokenStorage = {
  save(token: string) {
    runtimeToken = token;
  },
  load(): string | null {
    return runtimeToken;
  },
  clear() {
    runtimeToken = null;
  },
};
