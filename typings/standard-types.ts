/**
 * Optional
 * @desc Type representing [`Optional`] in TypeScript: `T | null | undefined`
 */
export type Optional<T> = T | null | undefined

/**
 * BiPredicate
 * @desc Type representing binary predicate function type in TypeScript
 * @example
 *   type BiPredicate = (v1, v2) => return v1 === v2
 */
export type BiPredicate<T> = (a: T, b: T) => boolean

/**
 * Comparator types
 */
export type Comparator<T> = (a: T, b: T) => number
export type PropertyComparator<T> = (a: T, b: T, value: string) => number

/**
 * Comparator modes
 */
export type ComparatorMode = 'asc' | 'desc'
