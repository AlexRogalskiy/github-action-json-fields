import { JsonMode } from './enum-types'

/**
 * ConfigOptions
 * @desc Type representing configuration options
 */
export type ConfigOptions = {
    /**
     * Source file to process
     */
    readonly sourceFile?: string
    /**
     * Target path to store processed files
     */
    readonly targetPath?: string
    /**
     * Target file name
     */
    readonly targetFile?: string
    /**
     * Supported json mode (unique/duplicate)
     */
    readonly jsonMode?: JsonMode
    /**
     * Json path to fetch data from
     */
    readonly jsonPath?: string
    /**
     * Array of json fields to process
     */
    readonly jsonFields?: string[]
}
