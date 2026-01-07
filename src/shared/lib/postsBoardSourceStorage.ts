type PostsBoardSource = 'public' | 'private';

const STORAGE_KEY = 'posts-board-source';
const ALLOWED_VALUES: PostsBoardSource[] = ['public', 'private'];

const isBrowser = () => typeof window !== 'undefined';

export const postsBoardSourceStorage = {
  save(nextSource: PostsBoardSource) {
    if (!isBrowser()) return;
    window.sessionStorage.setItem(STORAGE_KEY, nextSource);
  },
  consume(): PostsBoardSource | null {
    if (!isBrowser()) return null;
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
    if (!stored || !ALLOWED_VALUES.includes(stored as PostsBoardSource)) {
      return null;
    }
    return stored as PostsBoardSource;
  },
};
