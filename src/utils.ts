import { existsSync, mkdirSync } from 'fs'

export const toString = (value: string | string[]): string => (Array.isArray(value) ? value[0] : value)

export const ensureDirExists = (dir: string): void => {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
    }
}

export const hasPrototypeProperty = (obj: any, name: string): boolean => {
    return !obj.hasOwnProperty(name) && name in obj
}

export const hasProperty = (obj: any, prop: PropertyKey): boolean => {
    const proto = obj.__proto__ || obj.constructor.prototype

    //return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
    return prop in obj || prop in proto || proto[prop] === obj[prop]
}

export const serialize = (
    obj: any,
    callback?: (this: any, key: string, value: any) => any,
    space = 4
): string => {
    // return isFunction(callback) ? JSON.stringify(obj, callback, space) : JSON.stringify(obj)
    return JSON.stringify(obj, callback, space)
}

export const deserialize = (obj: string, callback?: (this: any, key: string, value: any) => any): any => {
    // return isFunction(callback) ? JSON.parse(obj, callback) : JSON.parse(obj)
    return JSON.parse(obj, callback)
}

export const getDataByKeys = <T>(obj: T, keys: PropertyKey[]): any => {
    for (const key of keys) {
        obj = obj && obj[key]
    }

    return obj
}

export const setDataByKeys = <T>(obj: T, value: any, keys: PropertyKey[]): void => {
    const last = keys.length - 1
    const prop = keys[last]

    keys = keys.slice(0, last)
    for (const key of keys) {
        obj = obj && obj[key]
    }

    obj[prop] = value
}
