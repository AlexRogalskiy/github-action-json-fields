import { Comparator, ComparatorMode, Optional, PropertyComparator } from '../../typings/standard-types'

import { hasProperty, isArray, isFunction, isObject, isString, notNullOrUndefined } from './validators'

import { valueError } from '../errors/value.error'

import { errorLogs } from './loggers'

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
export const compareByLocale = <T extends string>(
    a: Optional<T>,
    b: Optional<T>,
    mode: ComparatorMode = 'asc'
): number => {
    let a_ = !a ? '' : `${a}`
    let b_ = !b ? '' : `${b}`

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
export const compareIgnoreCase = <T extends string>(
    a: Optional<T>,
    b: Optional<T>,
    mode: ComparatorMode = 'asc'
): number => {
    let a_ = !a ? '' : `${a}`.toLowerCase()
    let b_ = !b ? '' : `${b}`.toLowerCase()

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
    a: Optional<T>,
    b: Optional<T>,
    mode: ComparatorMode = 'asc'
): number => {
    let a_: string = !a ? '' : `${a}`.toLowerCase()
    let b_: string = !b ? '' : `${b}`.toLowerCase()

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
export const compareByLength = <T extends string>(
    a: Optional<T>,
    b: Optional<T>,
    mode: ComparatorMode = 'asc'
): number => {
    let a_ = !a ? '' : `${a}`
    let b_ = !b ? '' : `${b}`

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
export const compareByPropertyKey = <T>(
    prop: PropertyKey,
    comparator: Comparator<T> = compareByOrder
): Comparator<T> => {
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
 * @param comparator initial input {@link Comparator} to operate by
 * @return {@link Number} -1 - lower, 0 - equals, 1 - greater
 */
export const compareByPropertyDefault = <T>(
    prop: PropertyKey,
    comparator: Comparator<T> = compareByOrder
): Comparator<T> => {
    return <TT>(a: TT, b: TT) => {
        if (!hasProperty(a, prop)) {
            throw valueError(`Property=${String(prop)} not exists on object=${a}`)
        }

        if (!hasProperty(b, prop)) {
            throw valueError(`Property=${String(prop)} not exists on object=${b}`)
        }

        if (!isFunction(comparator)) {
            throw valueError(`Invalid comparator type: ${typeof comparator}, should be [Function]`)
        }

        return comparator(a[prop], b[prop])
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
    a: Optional<T>,
    b: Optional<T>,
    prop: PropertyKey,
    mode: ComparatorMode = 'asc'
): number => {
    let a_ = !a ? '' : `${a[prop]}`
    let b_ = !b ? '' : `${b[prop]}`

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
export const compareByLocaleOptions = ((localeOptions: any): any => {
    return <T extends string>(
        a: Optional<T>,
        b: Optional<T>,
        mode: ComparatorMode = 'asc',
        locale?: string,
        options?: any
    ): number => {
        let a_ = !a ? '' : `${a}`
        let b_ = !b ? '' : `${b}`

        if (mode !== 'asc') {
            b_ = [a_, (a_ = b_)][0]
        }

        const locale_: string | string[] = isString(locale) ? locale : localeOptions.locale
        const options_: Intl.CollatorOptions = isObject(options) ? options : localeOptions.options

        const compareByCollator = <TT extends string>(aa: TT, bb: TT): Optional<number> => {
            try {
                return new Intl.Collator(locale_, options_).compare(aa, bb)
            } catch (error) {
                errorLogs(`Invalid locale collation, message: ${error.message}`)

                return null
            }
        }

        return (
            [compareByCollator, compareByLocale]
                .map(func => func.call(null, a_, b_))
                .find(notNullOrUndefined) || 0
        )
    }
})({ locale: 'en', options: { sensitivity: 'base' } })

/**
 * @public
 * @return {number} -1 - lower, 0 - equals, 1 - greater
 * @param list initial input {@link string} array of items to compare by
 */
export const normalizeAndCompare = ((...list: string[]): PropertyComparator<any> => {
    return (a: any, b: any, value: string): number => {
        if (a === null || b === null) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return (a === null) - (b === null)
        }

        const value_ = list.includes(value) ? value : list[0]
        const first = a.normalize(value_)
        const second = b.normalize(value_)

        return +(first > second) || -(first < second) || 0
    }
})('NFC', 'NFD', 'NFKC', 'NFKD')
