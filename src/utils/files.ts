import { join } from 'path'
import {
    accessSync,
    constants,
    existsSync,
    MakeDirectoryOptions,
    mkdirSync,
    readFileSync,
    writeFile,
} from 'fs'

import { coreInfo } from './loggers'
import { deserialize, serialize } from './serializers'

export const ensureDirExists = (dir: string, options: MakeDirectoryOptions = { recursive: true }): void => {
    existsSync(dir) || mkdirSync(dir, options)
}

export const getDataAsJson = <T>(fileName: string): T => {
    const fileData = readFileSync(fileName)

    return deserialize<T>(fileData.toString())
}

export const storeDataAsJson = (filePath: string, fileName: string, data: any): void => {
    ensureDirExists(filePath)

    const targetPath = join(filePath, fileName)

    coreInfo(`Storing JSON data to target file: ${targetPath}`)

    writeFile(targetPath, serialize(data), err => {
        if (err) {
            throw err
        }
    })
}

export const checkFileExists = (fileName: string, mode = constants.F_OK | constants.R_OK): boolean => {
    try {
        accessSync(fileName, mode)

        return true
    } catch (error) {
        return false
    }
}
