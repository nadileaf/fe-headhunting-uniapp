import type { VNodeChild } from 'vue';

export type VueNode = VNodeChild | JSX.Element;

// https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
export const tuple = <T extends string[]>(...args: T) => args;
export const tupleNum = <T extends number[]>(...args: T) => args;

export function truthy<T>(value: T): value is Util.Truthy<T> {
  return !!value;
}
