export type PostCategory = 'NOTICE' | 'QNA' | 'FREE';

export type Post = {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: PostCategory;
  tags: string[];
  createdAt: string;
};

export type PostListResponse = {
  items: Post[];
  nextCursor?: string;
  prevCursor?: string;
};

export type PostCreateRequest = {
  title: string;
  body: string;
  category: PostCategory;
  tags: string[];
};

export type PostUpdateRequest = Partial<PostCreateRequest>;

export type PostQueryParams = {
  limit?: number;
  prevCursor?: string;
  nextCursor?: string;
  sort?: 'createdAt' | 'title';
  order?: 'asc' | 'desc';
  category?: PostCategory;
  from?: string;
  to?: string;
  search?: string;
};
