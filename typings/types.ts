import { JsonMode } from './enum-types'

/**
 * ConfigOptions
 * @desc Type representing configuration options
 */
export type ConfigOptions = {
    readonly sourceFile?: string
    readonly targetPath?: string
    readonly targetFile?: string
    readonly jsonMode?: JsonMode
    readonly jsonPath?: string
    readonly jsonFields?: string[]
}
