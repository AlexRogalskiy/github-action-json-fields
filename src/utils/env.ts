import { Profile } from '../../typings/enum-types'
import { ProfileOptions } from '../../typings/domain-types'

import { hasProperty } from './validators'

import { CONFIG } from '../configs/configs'

const getProfile = (): ProfileOptions => {
    return process.env.NODE_ENV && hasProperty(CONFIG, process.env.NODE_ENV)
        ? CONFIG[process.env.NODE_ENV]
        : CONFIG[Profile.dev]
}

export const profile = getProfile()
