import { Request } from "express";
import { Dto } from "../framework/Dto";

export class CreateNoteDto extends Dto {
    public name: string;

    public content: string;

    public folderId: number;

    constructor(name: string, content: string, folderId: number) {
        super();
        this.name = name;
        this.content = content;
        this.folderId = folderId;
    }

    // tslint:disable-next-line:no-any
    public static build(req: Request): CreateNoteDto | undefined {
        const body = req.body;

        if (body == null) {
            return undefined;
        }

        if (body.note == null) {
            return undefined;
        }

        const nameOk = body.note.name != null;

        if (!nameOk) {
            return undefined;
        }

        const contentOk = body.note.content != null;

        if (!contentOk) {
            return undefined;
        }

        const folderIdOk = body.note.folderId != null;

        if (!folderIdOk) {
            return undefined;
        }

        const { name, content, folderId } = body.note;

        return new CreateNoteDto(name, content, folderId);
    }

    public isValid(): boolean {
        return this.name.length > 0 && this.name.length < 32 && this.content.length >= 0;
    }
}
