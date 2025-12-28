interface ApiError extends Error {
    statusCode: number
    data: null
    message: string
    success: boolean
    errors: Error[]
}

class ApiError extends Error implements ApiError {
    constructor(
        statusCode: number,
        message= "Something went wrong",
        errors: Error[] = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}