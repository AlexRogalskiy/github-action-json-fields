import { Optional } from '../typings/types'

import { hasProperty } from './utils'
import { valueError } from './errors'
import { isArray, isFunction, isNullOrUndefined, isObject, isString } from './validators'

/**
 * Comparator types
 */
export type Comparator<T> = (a: T, b: T) => number
export type PropertyComparator<T> = (a: T, b: T, value: string) => number
/**
 * Comparator modes
 */
export type ComparatorMode = 'asc' | 'desc'

/**
 * @public
 * @param {String} a Input value.
 * @param {String} b Input value to compare with.
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export const compareByOrder = (a: any, b: any): number => {
    if (a === b) {
        return 0
    }

    if (typeof a === typeof b) {
        if (hasProperty(a, 'compareTo')) {
            return a.compareTo(b)
        }

        return a < b ? -1 : 1
    }

    return typeof a < typeof b ? -1 : 1
}

/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export const compare = <T>(a: T, b: T): number => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (a === null) - (b === null) || +(a > b) || -(a < b)
}

/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {ComparatorMode} mode comparator mode (ascending / descending)
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export const compareByLocale = <T extends string>(a: T, b: T, mode: ComparatorMode = 'asc'): number => {
    let a_ = a === null ? '' : `${a}`
    let b_ = b === null ? '' : `${b}`

    if (mode !== 'asc') {
        b_ = [a_, (a_ = b_)][0]
    }

    return a_.localeCompare(b_)
}

/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {ComparatorMode} mode comparator mode (ascending / descending)
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export const compareIgnoreCase = <T extends string>(a: T, b: T, mode: ComparatorMode = 'asc'): number => {
    let a_ = a.toLowerCase()
    let b_ = b.toLowerCase()

    if (mode !== 'asc') {
        b_ = [a_, (a_ = b_)][0]
    }

    return a_ < b_ ? -1 : a_ > b_ ? 1 : 0
}

/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {ComparatorMode} mode comparator mode (ascending / descending)
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export const compareByLocaleIgnoreCase = <T extends string>(
    a: T,
    b: T,
    mode: ComparatorMode = 'asc'
): number => {
    let a_: string = a === null ? '' : `${a}`
    let b_: string = b === null ? '' : `${b}`

    if (mode !== 'asc') {
        b_ = [a_, (a_ = b_)][0]
    }

    return a_.toLowerCase().localeCompare(b_.toLowerCase())
}

/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {ComparatorMode} mode comparator mode (ascending / descending)
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export const compareByLength = <T extends string>(a: T, b: T, mode: ComparatorMode = 'asc'): number => {
    let a_ = a === null ? '' : `${a}`
    let b_ = b === null ? '' : `${b}`

    if (mode !== 'asc') {
        b_ = [a_, (a_ = b_)][0]
    }

    const diff = a_.length - b_.length

    return diff < 0 ? -1 : diff ? 1 : 0
}

/**
 * @public
 * @param {PropertyKey} prop initial input {@link String} or {@link Number} property name to compare by
 * @param {String} comparator Input string to compare with.
 * @return {Function} -1 - lower, 0 - equals, 1 - greater
 */
export const compareByPropertyKey = <T>(prop: PropertyKey, comparator: Comparator<T>): Comparator<T> => {
    return <TT>(a: TT, b: TT) => {
        if (isObject(a) && isObject(b)) {
            const a_ = a[prop]
            const b_ = b[prop]

            const comparator_ = isFunction(comparator) ? comparator : null

            if (comparator_) {
                return comparator_(a_, b_)
            }

            if (typeof a_ === typeof b_) {
                if (isObject(a_) || isArray(a_)) {
                    return a_.equals(b_)
                }
                return compareByLocaleOptions(a_, b_)
            }

            return typeof a_ < typeof b_ ? -1 : 1
        }

        throw valueError(`Expected object with a valid property < ${String(prop)} >`)
    }
}

/**
 * @public
 * @param {PropertyKey} prop initial input {@link String} or {@link Number} property name to compare by
 * @return {@link Number} -1 - lower, 0 - equals, 1 - greater
 */
export const compareByPropertyDefault = <T>(prop: PropertyKey): Comparator<T> => {
    return (a: T, b: T) => {
        if (!hasProperty(a, prop)) {
            throw valueError(`Property=${String(prop)} not exists on object=${a}`)
        }

        if (!hasProperty(b, prop)) {
            throw valueError(`Property=${String(prop)} not exists on object=${b}`)
        }

        return compareByOrder(a[prop], b[prop])
    }
}

/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {PropertyKey} prop initial input {@link String} or {@link Number} property name to compare by
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export const compareByProperty = <T>(a: T, b: T, prop: PropertyKey): number => {
    return +(a[prop] > b[prop]) || +(a[prop] === b[prop]) - 1
}

/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {PropertyKey} prop initial input {@link String} or {@link Number} property name to compare by
 * @param {ComparatorMode} mode comparator mode (ascending / descending)
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export const compareByPropertyOrder = <T>(
    a: T,
    b: T,
    prop: PropertyKey,
    mode: ComparatorMode = 'asc'
): number => {
    let a_ = a === null ? '' : `${a[prop]}`
    let b_ = b === null ? '' : `${b[prop]}`

    if (a_ === b_) {
        return 0
    }

    if (mode !== 'asc') {
        b_ = [a_, (a_ = b_)][0]
    }

    return a_ < b_ ? -1 : a_ > b_ ? 1 : 0
}

/**
 * @public
 * @param {Comparator} comparators collection to operate by
 */
export const compareBy = <T>(...comparators: Comparator<any>[]): Comparator<T> => {
    return (a, b): number => {
        for (const comparator of comparators) {
            const value = comparator(a, b)
            if (value !== 0) {
                return value
            }
        }

        return 0
    }
}

/**
 * @public
 * @param {String} a Input string.
 * @param {String} b Input string to compare with.
 * @param {ComparatorMode} mode comparator mode (ascending / descending)
 * @param {PropertyKey} props initial input {@link String} or {@link Number} property name to compare by
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 */
export const compareByProperties = <T>(
    a: T,
    b: T,
    mode: ComparatorMode = 'asc',
    ...props: PropertyKey[]
): number => {
    for (const item of props) {
        a = a[item]
        b = b[item]
    }

    if (mode !== 'asc') {
        b = [a, (a = b)][0]
    }

    return a < b ? -1 : a > b ? 1 : 0
}

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
export const compareByLocaleOptions = (() => {
    const DEFAULT_OPTIONS = { sensitivity: 'base' }
    const DEFAULT_LOCALE = 'en'

    return <T extends string>(
        a: T,
        b: T,
        mode: ComparatorMode = 'asc',
        locale?: string,
        options?: any
    ): number => {
        let a_ = a === null ? '' : `${a}`
        let b_ = b === null ? '' : `${b}`

        if (mode !== 'asc') {
            b_ = [a_, (a_ = b_)][0]
        }

        const locale_ = isString(locale) ? locale : DEFAULT_LOCALE
        const options_ = isObject(options) ? options : DEFAULT_OPTIONS

        const localeCompareSupportsCollator = <T extends string>(a: T, b: T): Optional<number> => {
            try {
                return new Intl.Collator(locale_, options_).compare(a, b)
            } catch (e) {
                console.log(`ERROR: invalid locale supports collator < ${e.message} >`)
                return null
            }
        }

        const localeCompareSupportsLocales = <T extends string>(a: T, b: T): Optional<number> => {
            try {
                return new Intl.Collator(locale_, options_).compare(a, b)
            } catch (e) {
                console.log(`ERROR: invalid supports locales < ${e.message} >`)
                return null
            }
        }

        let result = localeCompareSupportsCollator(a_, b_)
        if (isNullOrUndefined(result)) {
            result = localeCompareSupportsLocales(a_, b_)
            if (isNullOrUndefined(result)) {
                return compareByLocale(a_, b_)
            }
        }

        return 0
    }
})()

/**
 * @public
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 * @param list initial input {@link string} array of items to compare by
 */
export const normalizeAndCompare = (list: string[]): PropertyComparator<any> => {
    return (a: any, b: any, value: string): number => {
        if (a === null || b === null) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return (a === null) - (b === null)
        }

        const value_ = list.includes(value) ? value : list[0]
        const first = a.normalize(value_)
        const second = b.normalize(value_)

        return +(first > second) || -(first < second) || 1
    }
}
