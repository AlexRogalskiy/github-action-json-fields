/**
 * Optional
 * @desc Type representing [`Optional`] in TypeScript: `T | null | undefined`
 */
export declare type Optional<T> = T | null | undefined;
/**
 * BiPredicate
 * @desc Type representing binary predicate function type in TypeScript
 * @example
 *   type BiPredicate = (v1, v2) => return v1 === v2
 */
export declare type BiPredicate<T> = (a: T, b: T) => boolean;
/**
 * Comparator types
 */
export declare type Comparator<T> = (a: T, b: T) => number;
export declare type PropertyComparator<T> = (a: T, b: T, value: string) => number;
/**
 * Comparator modes
 */
export declare type ComparatorMode = 'asc' | 'desc';
//# sourceMappingURL=standard-types.d.ts.map