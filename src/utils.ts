import { hasProperty } from './validators'

export const toString = (value: string | string[]): string => (Array.isArray(value) ? value[0] : value)

export const getDataByKeys = <T>(obj: T, keys: PropertyKey[]): any => {
    for (const key of keys) {
        obj = hasProperty(obj, key) && obj[key]
    }

    return obj
}

export const setDataByKeys = <T>(obj: T, value: any, keys: PropertyKey[]): void => {
    const last = keys.length - 1
    const prop = keys[last]

    keys = keys.slice(0, last)
    for (const key of keys) {
        obj = hasProperty(obj, key) && obj[key]
    }

    obj[prop] = value
}
