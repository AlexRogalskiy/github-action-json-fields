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
 * Comparator
 * @desc Type representing comparator function
 */
export type Comparator<T> = (a: T, b: T) => number

/**
 * PropertyComparator
 * @desc Type representing property comparator function
 */
export type PropertyComparator<T> = (a: T, b: T, value: string) => number

/**
 * ComparatorMode
 * @desc Type representing supported comparator modes
 */
export type ComparatorMode = 'asc' | 'desc'
