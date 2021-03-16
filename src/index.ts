import * as core from '@actions/core'
import * as jp from 'jsonpath'
import { readFileSync, writeFile } from 'fs'
import { join } from 'path'

import { JsonMode } from '../typings/types'

import { deserialize, ensureDirExists, serialize } from './utils'
import { getType, isArray } from './validators'
import { valueError } from './errors'
import { Comparator, compareBy, compareByPropertyKey, compareIgnoreCase } from './comparators'

const getFilter = <T>(jsonMode: JsonMode) => (a: T, b: T): boolean =>
    jsonMode === JsonMode.unique ? a === b : a !== b

const getComparator = (fields: PropertyKey[]): Comparator<any> => {
    const comparators = fields.map(field =>
        compareByPropertyKey(field, (a: string, b: string) => compareIgnoreCase(a, b))
    )

    return compareBy(...comparators)
}

const getJsonData = (fileName: string): any => {
    const fileData = readFileSync(fileName)

    return deserialize(fileData.toString())
}

const processSourceFile = async (
    fileName: string,
    jsonMode: JsonMode,
    jsonPath: string,
    fields: PropertyKey[]
): Promise<any> => {
    const filterMode = getFilter(jsonMode)
    const comparator = getComparator(fields)
    const jsonData = getJsonData(fileName)

    const propertyData = jp.query(jsonData, jsonPath)

    if (!isArray(propertyData)) {
        throw valueError(
            `Invalid data type: ${getType(propertyData)} for property: ${jsonPath}, should be an array`
        )
    }

    const parentPath = jp.stringify(jp.parse(jsonPath).slice(0, -1))
    const filteredData = propertyData.filter((item, index, self) =>
        filterMode(
            index,
            self.findIndex(value => comparator(value, item) === 0)
        )
    )

    jp.value(jsonData, parentPath, filteredData)

    return jsonData
}

const storeJsonData = async (filePath: string, fileName: string, data: any): Promise<boolean> => {
    ensureDirExists(filePath)

    const targetPath = join(filePath, fileName)

    core.info(`Storing JSON data to target file: ${targetPath}`)

    writeFile(targetPath, serialize(data), err => {
        if (err) {
            throw err
        }
    })

    return true
}

export default async function run(): Promise<void> {
    try {
        const sourceFile = core.getInput('sourceFile', { required: true })
        const targetPath = core.getInput('targetPath', { required: true })
        const targetFile = core.getInput('targetFile', { required: true })

        const mode = core.getInput('mode', { required: true })
        const jsonPath = core.getInput('jsonPath', { required: true })
        const jsonFields = core.getInput('jsonFields', { required: true }).split(',')

        const jsonMode: JsonMode = JsonMode[mode]

        core.info(
            `Processing source JSON file: ${sourceFile} with mode: ${jsonMode}, path: ${jsonPath}, fields: ${jsonFields}`
        )

        const jsonData = await processSourceFile(sourceFile, jsonMode, jsonPath, jsonFields)
        const changed = await storeJsonData(targetPath, targetFile, jsonData)

        core.setOutput('changed', changed)
    } catch (e) {
        core.setFailed(`Cannot process JSON data, message: ${e.message}`)
    }
}

run()
