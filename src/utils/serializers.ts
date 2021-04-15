export const serialize = (
    obj: any,
    callback?: (this: any, key: string, value: any) => any,
    space = 4
): string => {
    return JSON.stringify(obj, callback, space)
}

export const deserialize = <T>(obj: string, callback?: (this: any, key: string, value: any) => any): T => {
    return JSON.parse(obj, callback)
}
