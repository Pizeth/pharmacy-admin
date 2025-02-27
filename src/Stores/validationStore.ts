// src/store/validationStore.ts
import { atom } from "jotai";

export const validationMessagesAtom = atom<Record<string, string>>({});

export const setValidationMessageAtom = atom(
  null,
  (get, set, update: { source: string; message: string }) => {
    set(validationMessagesAtom, (prev) => ({
      ...prev,
      [update.source]: update.message,
    }));
  },
);

export const clearValidationMessageAtom = atom(
  null,
  (get, set, source: string) => {
    set(validationMessagesAtom, (prev) => {
      const newMessages = { ...prev };
      delete newMessages[source];
      return newMessages;
    });
  },
);
