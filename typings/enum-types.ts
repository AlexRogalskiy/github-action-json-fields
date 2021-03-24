/**
 * Profile
 * @desc Type representing supported profiles
 */
export enum Profile {
    dev = 'dev',
    prod = 'prod',
    test = 'test',
}

/**
 * JsonMode
 * @desc Type representing json operation modes
 */
export enum JsonMode {
    /**
     * Only unique strings processed
     */
    unique = 'unique',
    /**
     * Only duplicate strings processed
     */
    duplicate = 'duplicate',
}
