/**
 * Comparator types
 */
export declare type Comparator<T> = (a: T, b: T) => number;
export declare type PropertyComparator<T> = (a: T, b: T, value: string) => number;
/**
 * Comparator modes
 */
export declare type ComparatorMode = 'asc' | 'desc';
/**
 * @public
 * @param {String} a Input value.
 * @param {String} b Input value to compare with.
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export declare const compareByOrder: (a: any, b: any) => number;
/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export declare const compare: <T>(a: T, b: T) => number;
/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {ComparatorMode} mode comparator mode (ascending / descending)
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export declare const compareByLocale: <T extends string>(a: T, b: T, mode?: ComparatorMode) => number;
/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {ComparatorMode} mode comparator mode (ascending / descending)
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export declare const compareIgnoreCase: <T extends string>(a: T, b: T, mode?: ComparatorMode) => number;
/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {ComparatorMode} mode comparator mode (ascending / descending)
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export declare const compareByLocaleIgnoreCase: <T extends string>(a: T, b: T, mode?: ComparatorMode) => number;
/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {ComparatorMode} mode comparator mode (ascending / descending)
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export declare const compareByLength: <T extends string>(a: T, b: T, mode?: ComparatorMode) => number;
/**
 * @public
 * @param {PropertyKey} prop initial input {@link String} or {@link Number} property name to compare by
 * @param {String} comparator Input string to compare with.
 * @return {Function} -1 - lower, 0 - equals, 1 - greater
 */
export declare const compareByPropertyKey: <T>(prop: PropertyKey, comparator: Comparator<T>) => Comparator<T>;
/**
 * @public
 * @param {PropertyKey} prop initial input {@link String} or {@link Number} property name to compare by
 * @return {@link Number} -1 - lower, 0 - equals, 1 - greater
 */
export declare const compareByPropertyDefault: <T>(prop: PropertyKey) => Comparator<T>;
/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {PropertyKey} prop initial input {@link String} or {@link Number} property name to compare by
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export declare const compareByProperty: <T>(a: T, b: T, prop: PropertyKey) => number;
/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {PropertyKey} prop initial input {@link String} or {@link Number} property name to compare by
 * @param {ComparatorMode} mode comparator mode (ascending / descending)
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export declare const compareByPropertyOrder: <T>(a: T, b: T, prop: PropertyKey, mode?: ComparatorMode) => number;
/**
 * @public
 * @param {Comparator} comparators collection to operate by
 */
export declare const compareBy: <T>(...comparators: Comparator<T>[]) => Comparator<T>;
/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {ComparatorMode} mode comparator mode (ascending / descending)
 * @param {PropertyKey} props initial input {@link String} or {@link Number} property name to compare by
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export declare const compareByProperties: <T>(a: T, b: T, mode?: ComparatorMode, ...props: PropertyKey[]) => number;
/**
 * @public

 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {String} locale Language locale.
 * @param {Object} options Optional. Additional properties of comparison.
 * @param {ComparatorMode} mode comparator mode (ascending / descending)
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 *
 * @example
 * options = { sensitivity: 'base' }
 * locale = 'sv'
 */
export declare const compareByLocaleOptions: <T extends string>(a: T, b: T, mode?: ComparatorMode, locale?: string | undefined, options?: any) => number;
/**
 * @public
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 * @param list initial input {@link string} array of items to compare by
 */
export declare const normalizeAndCompare: (list: string[]) => PropertyComparator<any>;
//# sourceMappingURL=comparators.d.ts.map