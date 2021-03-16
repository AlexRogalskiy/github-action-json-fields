/**
 * JSON mode type
 */
export enum JsonMode {
    unique = 'unique',
    duplicate = 'duplicate',
}

/**
 * Optional
 * @desc Type representing [`Optional`] in TypeScript: `T | null | undefined`
 */
export type Optional<T> = T | null | undefined

/**
 * ConfigOptions
 * @desc Type representing configuration options
 */
export type ConfigOptions = {
    sourceFile?: string
    targetPath?: string
    targetFile?: string
    jsonMode?: JsonMode
    jsonPath?: string
    jsonFields?: string[]
}
