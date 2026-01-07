'use client';

import { useState } from 'react';

import { defaultPostFilters } from '../config/defaults';
import type { PostFiltersState } from './types';

export function usePostFiltersState(initialState?: Partial<PostFiltersState>) {
  const [filters, setFilters] = useState<PostFiltersState>({
    ...defaultPostFilters,
    ...initialState,
  });

  const updateFilters = (patch: Partial<PostFiltersState>) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      ...patch,
    }));
  };

  return { filters, setFilters, updateFilters };
}
