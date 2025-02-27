// signals.ts
import { signal } from "@preact/signals-react";

export const validationMessages = signal<Record<string, string>>({});
