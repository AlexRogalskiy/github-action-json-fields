import { Profile } from '../../typings/enum-types'
import { ProfileOptions } from '../../typings/domain-types'

import { OUTPUT_OPTIONS } from '../constants/constants'

/**
 * ProfileRecord
 * @desc Type representing profile configuration options
 */
export type ProfileRecord = Record<Profile, Partial<ProfileOptions>>

/**
 * Configuration options
 */
export const CONFIG: Readonly<ProfileRecord> = {
    dev: {
        outputOptions: OUTPUT_OPTIONS,
    },
    prod: {
        outputOptions: OUTPUT_OPTIONS,
    },
    test: {
        outputOptions: OUTPUT_OPTIONS,
    },
}
