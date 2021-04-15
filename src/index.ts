import * as core from '@actions/core'
import * as jp from 'jsonpath'

import { basename } from 'path'

import { ConfigOptions } from '../typings/domain-types'
import { JsonMode } from '../typings/enum-types'
import { BiPredicate, Comparator } from '../typings/standard-types'

import { valueError } from './errors/value.error'

import { compareBy, compareByPropertyKey, compareIgnoreCase } from './utils/comparators'
import { getProperty, getRequiredProperty } from './utils/properties'
import { getType, isArray, isValidFile } from './utils/validators'
import { getDataAsJson, storeDataAsJson } from './utils/files'
import { serialize } from './utils/serializers'

import { coreError, coreInfo } from './utils/loggers'

const getFilter = <T>(jsonMode: JsonMode): BiPredicate<T> => (a: T, b: T) =>
    jsonMode === JsonMode.unique ? a === b : a !== b

const getComparator = (fields: string[]): Comparator<any> => {
    const comparators = fields.map(field =>
        compareByPropertyKey(field, (a: string, b: string) => compareIgnoreCase(a, b))
    )

    return compareBy(...comparators)
}

const processJsonQuery = <T>(
    jsonData: T,
    jsonPath: string,
    jsonMode: JsonMode,
    jsonFields: string[]
): void => {
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
    coreInfo(`Processing input file with options: ${serialize(options)}`)

    const { sourceFile, targetPath, targetFile, mode, jsonPath, jsonFields } = options

    try {
        const jsonData = getDataAsJson<any>(sourceFile)

        processJsonQuery(jsonData, jsonPath, mode, jsonFields)

        storeDataAsJson(targetPath, targetFile, jsonData)

        return Promise.resolve(true)
    } catch (error) {
        coreError(`Cannot process input file: ${sourceFile}`)
        throw error
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

const executeOperation = async (...options: Partial<ConfigOptions>[]): Promise<boolean> => {
    const promises: Promise<boolean>[] = []

    for (const option of options) {
        const value = buildConfigOptions(option)
        promises.push(processSourceFile(value))
    }

    const result = await Promise.all(promises)

    return result.every(value => value)
}

const runFilterOperation = async (): Promise<void> => {
    const sourceData = getProperty('sourceData')

    const params = isValidFile(sourceData) ? getDataAsJson<Partial<ConfigOptions>[]>(sourceData) : [{}]
    const status = await executeOperation(...params)

    core.setOutput('changed', status)
}

export default async function run(): Promise<void> {
    try {
        await runFilterOperation()
    } catch (error) {
        core.setFailed(`Cannot process input JSON data, message: ${error.message}`)
    }
}

run()
