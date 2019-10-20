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

/**
 * A validation error. Typically used to signal wrong or missing req params.
 */
export class ValidationError extends HttpError {
    constructor(errors: IErrorDetail[] | undefined) {
        super("The request was invalid", 400, errors);
    }
}

/**
 * A not found error. Typically used to signal a requested resource doesn't exist.
 */
export class NotFoundError extends HttpError {
    constructor(errors: IErrorDetail[] | undefined) {
        super("The requested resource was not found", 404, errors);
    }
}

/**
 * A forbidden error. Typically used to signal that a user lacks permissions for the
 * requested resource.
 */
export class ForbiddenError extends HttpError {
    constructor(errors: IErrorDetail[] | undefined) {
        super("The requested resource is forbidden", 403, errors);
    }
}

/**
 * An unauthorized error. Typically used to signal that a user lacks authorization
 * for the requested resource (e.g. missing jwt)
 */
export class UnauthorizedError extends HttpError {
    constructor(errors: IErrorDetail[] | undefined) {
        super("The request does not have proper credentials", 401, errors);
    }
}
