import { Dto } from "../framework/Dto";

export class CreateFolderDto extends Dto {
    public name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    // tslint:disable-next-line:no-any
    public static build(body: any): CreateFolderDto | undefined {
        if (body == null) {
            return undefined;
        }

        if (body.folder == null) {
            return undefined;
        }

        const nameOk = body.folder.name != null;

        if (!nameOk) {
            return undefined;
        }

        return new CreateFolderDto(body.folder.name);
    }

    public isValid(): boolean {
        return this.name.length > 0 && this.name.length < 32;
    }
}
