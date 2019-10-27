import { Dto } from "../Dto";

export class CreateUserDto extends Dto {
    public email: string;

    public password: string;

    constructor(email: string, password: string) {
        super();
        this.email = email;
        this.password = password;
    }

    // tslint:disable-next-line:no-any
    public static build(body: any): CreateUserDto | undefined {
        if (body == null) {
            return undefined;
        }

        if (body.user == null) {
            return undefined;
        }

        const emailOk = body.user.email != null;

        if (!emailOk) {
            return undefined;
        }

        const passwordOk = body.user.password != null;

        if (!passwordOk) {
            return undefined;
        }

        return new CreateUserDto(body.user.email, body.user.password);
    }

    public isValid(): boolean {
        return this.email.length > 0 && this.password.length > 0;
    }
}
