import { Dto } from "../framework/Dto";

export class AuthorizeUserDto extends Dto {
    public email: string;

    public password: string;

    constructor(email: string, password: string) {
        super();
        this.email = email;
        this.password = password;
    }

    // tslint:disable-next-line:no-any
    public static build(body: any): AuthorizeUserDto | undefined {
        if (body == null) {
            return undefined;
        }

        if (body.auth == null) {
            return undefined;
        }

        const emailOk = body.auth.email != null;

        if (!emailOk) {
            return undefined;
        }

        const passwordOk = body.auth.password != null;

        if (!passwordOk) {
            return undefined;
        }

        return new AuthorizeUserDto(body.auth.email, body.auth.password);
    }

    public isValid(): boolean {
        // TODO: and is an email
        return this.email.length > 0 && this.password.length >= 8;
    }
}
