// tslint:disable:max-classes-per-file

/**
 * The shape of an error's details
 */
export interface IErrorDetail {
    param: string;
    msg: string;
}

/**
 * An http error object. Derived from to form various http errors.
 */
export class HttpError extends Error {
    constructor(
        public message: string,
        public status: number,
        public errors?: IErrorDetail[] | undefined,
    ) {
        super();
    }
}

export class BadRequestError extends HttpError {
    constructor(errors?: IErrorDetail[] | undefined) {
        super("The request was malformed", 400, errors);
    }
}

export class UnprocessableEntityError extends HttpError {
    constructor(errors?: IErrorDetail[] | undefined) {
        super("The request was well formed, but invalid", 422, errors);
    }
}

export class NotFoundError extends HttpError {
    constructor(errors?: IErrorDetail[] | undefined) {
        super("The requested resource was not found", 404, errors);
    }
}

export class ForbiddenError extends HttpError {
    constructor(errors?: IErrorDetail[] | undefined) {
        super("The requested resource is forbidden", 403, errors);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(errors?: IErrorDetail[] | undefined) {
        super("The request does not have proper credentials", 401, errors);
    }
}
