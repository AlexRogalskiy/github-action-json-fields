import { hasProperty } from '../utils/validators'

/**
 * Error type enumeration
 */
export enum ErrorType {
    general_error = 'GeneralError',
    parser_error = 'ParserError',
    validation_error = 'ValidationError',
    type_error = 'TypeError',
    value_error = 'ValueError',
}

/**
 * ExtendableError
 * @desc Class representing extendable error
 */
export class ExtendableError extends Error {
    /**
     * Extendable error constructor by input parameters
     * @param type initial input {@link ErrorType}
     * @param message initial input {@link string} message
     */
    constructor(readonly type: ErrorType, readonly message: string) {
        super(message)

        Object.defineProperty(this, 'message', {
            configurable: true,
            enumerable: false,
            value: message,
            writable: true,
        })

        Object.defineProperty(this, 'type', {
            configurable: true,
            enumerable: false,
            value: type,
            writable: true,
        })

        Object.defineProperty(this, 'name', {
            configurable: true,
            enumerable: false,
            value: this.constructor.name,
            writable: true,
        })

        if (hasProperty(Error, 'captureStackTrace')) {
            Error.captureStackTrace(this, this.constructor)
            return
        }

        Object.defineProperty(this, 'stack', {
            configurable: true,
            enumerable: false,
            value: new Error(message).stack,
            writable: true,
        })
    }
}

/**
 * GeneralError
 * @desc Class representing general error
 */
export class GeneralError extends ExtendableError {
    /**
     * Error arguments
     */
    readonly args: any[] = []

    /**
     * General error constructor by input parameters
     * @param type initial input {@link ErrorType}
     * @param message initial input {@link string} message
     * @param args initial input {@link Array} of arguments
     */
    constructor(readonly type: ErrorType, readonly message: string, ...args: any[]) {
        super(type, message)
        this.args = args
    }

    /**
     * Updates current logging information
     * @protected
     */
    protected logMessage(): void {
        console.error(this.message, this.args)
    }
}

/**
 * ValueError
 * @desc Class representing value error
 */
export class ValueError extends GeneralError {
    /**
     * Value error constructor by input parameters
     * @param message initial input {@link string} message
     * @param args initial input {@link Array} of arguments
     */
    constructor(readonly message: string, ...args: any[]) {
        super(ErrorType.value_error, message, args)
    }
}

export const valueError = (message: string, ...args: any[]): ValueError => {
    return new ValueError(message, args)
}
