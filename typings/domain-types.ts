import boxen from 'boxen'

import { JsonMode } from './enum-types'

/**
 * ProfileOptions
 * @desc Type representing profile options
 */
export type ProfileOptions = {
    /**
     * Output options
     */
    readonly outputOptions?: boxen.Options
}

/**
 * ConfigOptions
 * @desc Type representing configuration options
 */
export type ConfigOptions = {
    /**
     * Source file to process
     */
    readonly sourceFile: string
    /**
     * Target path to store processed files
     */
    readonly targetPath: string
    /**
     * Target file name
     */
    readonly targetFile: string
    /**
     * Supported json modes
     */
    readonly mode: JsonMode
    /**
     * Json path to fetch data from
     */
    readonly jsonPath: string
    /**
     * List of json fields to process
     */
    readonly jsonFields: string[]
}
