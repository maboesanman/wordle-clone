
export type ImportClass<T, K extends keyof T> = T extends Record<K, infer S>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? S extends new (...args: any[]) => infer R
    ? R
    : never
  : never;

export type ImportType<T, K extends keyof T> = T extends Record<K, infer R>
  ? R
  : never;
