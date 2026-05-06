import { effect, signal, WritableSignal } from '@angular/core';

export function localStorageSignal<T>(
  key: string,
  initial: T
): WritableSignal<T> {
  let restored: T = initial;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) restored = JSON.parse(raw) as T;
  } catch {
    restored = initial;
  }

  const sig = signal<T>(restored);

  effect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(sig()));
    } catch {
      /* quota / private mode — ignore */
    }
  });

  return sig;
}
