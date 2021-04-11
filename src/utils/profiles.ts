import { Optional } from '../../typings/standard-types'
import { ProfileOptions } from '../../typings/domain-types'

import { CONFIG } from '../configs/configs'

const { NODE_ENV } = process && process.env

export const getProfileByEnv = (env: Optional<string> = NODE_ENV): ProfileOptions => {
    return env && Object.prototype.hasOwnProperty.call(CONFIG, env) ? CONFIG[env] : CONFIG.dev
}

export const profile = getProfileByEnv()
