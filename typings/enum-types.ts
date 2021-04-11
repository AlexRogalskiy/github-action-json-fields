/**
 * Profile
 * @desc Type representing supported profiles
 */
export enum Profile {
    dev = 'dev',
    prod = 'prod',
    test = 'test',
}

//--------------------------------------------------------------------------------------------------
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

//--------------------------------------------------------------------------------------------------
/**
 * ErrorType
 * @desc Type representing supported errors
 */
export enum ErrorType {
    general_error = 'GeneralError',
    parser_error = 'ParserError',
    validation_error = 'ValidationError',
    request_error = 'RequestError',
    response_error = 'ResponseError',
    parameter_error = 'ParameterError',
    type_error = 'TypeError',
    value_error = 'ValueError',
}

//--------------------------------------------------------------------------------------------------
