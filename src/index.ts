import * as core from '@actions/core'
import * as jp from 'jsonpath'

import { basename } from 'path'
import boxen from 'boxen'

import { ConfigOptions } from '../typings/domain-types'
import { JsonMode } from '../typings/enum-types'
import { BiPredicate, Comparator } from '../typings/standard-types'

import { valueError } from './errors/errors'
import { getType, isArray, isValidFile } from './utils/validators'
import { compareBy, compareByPropertyKey, compareIgnoreCase } from './utils/comparators'
import { getDataAsJson, storeDataAsJson } from './utils/files'
import { serialize } from './utils/serializers'

import { profile } from './utils/env'

const getFilter = <T>(jsonMode: JsonMode): BiPredicate<T> => (a: T, b: T) =>
    jsonMode === JsonMode.unique ? a === b : a !== b

const getComparator = (fields: string[]): Comparator<any> => {
    const comparators = fields.map(field =>
        compareByPropertyKey(field, (a: string, b: string) => compareIgnoreCase(a, b))
    )

    return compareBy(...comparators)
}

const processJsonQuery = async <T>(
    jsonData: T,
    jsonPath: string,
    jsonMode: JsonMode,
    jsonFields: string[]
): Promise<void> => {
    const propertyData = jp.query(jsonData, jsonPath)
    const filter = getFilter(jsonMode)
    const comparator = getComparator(jsonFields)

    if (!isArray(propertyData)) {
        throw valueError(
            `Invalid data type: ${getType(propertyData)} for property: ${jsonPath}, should be an array`
        )
    }

    const parentPath = jp.stringify(jp.parse(jsonPath).slice(0, -1))
    const filteredData = propertyData.filter((item, index, self) =>
        filter(
            index,
            self.findIndex(value => comparator(value, item) === 0)
        )
    )

    jp.value(jsonData, parentPath, filteredData)
}

const processSourceFile = async (options: ConfigOptions): Promise<boolean> => {
    core.info(boxen(`Processing input file with options: ${serialize(options)}`, profile.outputOptions))

    const { sourceFile, targetPath, targetFile, mode, jsonPath, jsonFields } = options

    try {
        const jsonData = getDataAsJson<any>(sourceFile)

        await processJsonQuery(jsonData, jsonPath, mode, jsonFields)

        await storeDataAsJson(targetPath, targetFile, jsonData)

        return true
    } catch (e) {
        core.error(`Cannot process input file: ${sourceFile}`)
        throw e
    }
}

const buildConfigOptions = (options: Partial<ConfigOptions>): ConfigOptions => {
    const sourceFile = options.sourceFile || getRequiredProperty('sourceFile')
    const targetPath = options.targetPath || getRequiredProperty('targetPath')
    const targetFile = options.targetFile || getProperty('targetFile') || basename(sourceFile)

    const mode = options.mode || JsonMode[getRequiredProperty('mode')]

    const jsonPath = options.jsonPath || getRequiredProperty('jsonPath')
    const jsonFields = options.jsonFields || getRequiredProperty('jsonFields').split(',')

    return {
        sourceFile,
        targetPath,
        targetFile,
        mode,
        jsonPath,
        jsonFields,
    }
}

const getRequiredProperty = (property: string): string => {
    return getProperty(property, { required: true })
}

const getProperty = (property: string, options?: core.InputOptions): string => {
    return core.getInput(property, options)
}

const executeOperation = async (...options: Partial<ConfigOptions>[]): Promise<boolean> => {
    const result: boolean[] = []

    for (const option of options) {
        const options = buildConfigOptions(option)
        const status = await processSourceFile(options)
        result.push(status)
    }

    return result.every(value => value)
}

const runFilterOperation = async (): Promise<void> => {
    const sourceData = core.getInput('sourceData')

    let status: boolean
    if (isValidFile(sourceData)) {
        const options = getDataAsJson<Partial<ConfigOptions>[]>(sourceData)
        status = await executeOperation(...options)
    } else {
        status = await executeOperation({})
    }

    core.setOutput('changed', status)
}

export default async function run(): Promise<void> {
    try {
        await runFilterOperation()
    } catch (e) {
        core.setFailed(`Cannot process input JSON data, message: ${e.message}`)
    }
}

void run()
