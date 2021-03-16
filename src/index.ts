import * as core from '@actions/core'
import { readFileSync, writeFile } from 'fs'
import { join } from 'path'

import { JsonMode } from '../typings/types'

import { deserialize, ensureDirExists, serialize } from './utils'
import { getType, isArray } from './validators'
import { valueError } from './errors'
import { compareBy, compareByPropertyKey, compareIgnoreCase } from './comparators'

const getPropertyData = <T>(obj: T, keys: PropertyKey[]): any => {
    for (const key of keys) {
        obj = obj && obj[key]
    }

    return obj
}

const setPropertyData = <T>(obj: T, value: any, keys: PropertyKey[]): void => {
    const prop = keys[keys.length - 1]

    keys = keys.slice(0, keys.length - 1)
    for (const key of keys) {
        obj = obj && obj[key]
    }

    obj[prop] = value
}

const createData = async (
    fileName: string,
    jsonMode: JsonMode,
    keys: PropertyKey[],
    fields: PropertyKey[]
): Promise<any> => {
    const filter = <T>(a: T, b: T): boolean => (jsonMode === JsonMode.unique ? a === b : a !== b)
    const comparators = fields.map(field =>
        compareByPropertyKey(field, (a: string, b: string) => compareIgnoreCase(a, b))
    )
    const complexComparator = compareBy(...comparators)

    const fileData = readFileSync(fileName)
    const jsonData = deserialize(fileData.toString())
    const propertyData = getPropertyData(jsonData, keys)

    if (!isArray(propertyData)) {
        throw valueError(`Invalid property data type: ${getType(propertyData)}, should be array`)
    }

    const filteredData = propertyData.filter((arr, index, self) =>
        filter(
            index,
            self.findIndex(t => complexComparator(t, arr) === 0)
        )
    )

    setPropertyData(jsonData, filteredData, keys)

    return jsonData
}

const storeData = async (filePath: string, fileName: string, data: any): Promise<boolean> => {
    const targetPath = join(filePath, fileName)
    core.info(`Storing JSON data to target file: ${targetPath}`)

    ensureDirExists(filePath)

    writeFile(fileName, serialize(data), err => {
        if (err) {
            throw err
        }
    })

    return true
}

export default async function run(): Promise<void> {
    const jsonMode = core.getInput('jsonMode', { required: true })
    const sourceFile = core.getInput('sourceFile', { required: true })

    const destPath = core.getInput('targetPath', { required: true })
    const destFile = core.getInput('destFile', { required: true })

    const targetProperty = core.getInput('targetProperty', { required: true }).split('/')
    const fieldsToCompare = core.getInput('fields', { required: true }).split(',')

    const mode: JsonMode = JsonMode[jsonMode]

    try {
        core.info(
            `Processing JSON file by path: ${sourceFile}, mode: ${mode}, target property: ${targetProperty}, fields: ${fieldsToCompare}`
        )

        const jsonData = await createData(sourceFile, mode, targetProperty, fieldsToCompare)
        const status = await storeData(destPath, destFile, jsonData)

        core.setOutput('status', status)
    } catch (e) {
        core.setFailed(
            `Cannot store JSON data to file: ${destFile}, path: ${destPath}, message: ${e.message}`
        )
    }
}

run()
