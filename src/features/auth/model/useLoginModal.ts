'use client';

import { useSyncExternalStore } from 'react';

type Listener = () => void;

let isOpen = false;
const listeners = new Set<Listener>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => isOpen;

const open = () => {
  if (isOpen) return;
  isOpen = true;
  emit();
};

const close = () => {
  if (!isOpen) return;
  isOpen = false;
  emit();
};

export function useLoginModal() {
  const openState = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    isOpen: openState,
    open,
    close,
  };
}

export const loginModalStore = {
  open,
  close,
  subscribe,
  getSnapshot,
};
