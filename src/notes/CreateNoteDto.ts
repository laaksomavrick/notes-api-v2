import { Request } from "express";
import { Dto } from "../framework/Dto";

export class CreateNoteDto extends Dto {
    public content: string;

    public folderId: number;

    constructor(content: string, folderId: number) {
        super();
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

        const contentOk = body.note.content != null;

        if (!contentOk) {
            return undefined;
        }

        const folderIdOk = body.note.folderId != null;

        if (!folderIdOk) {
            return undefined;
        }

        const { content, folderId } = body.note;

        return new CreateNoteDto(content, folderId);
    }

    public isValid(): boolean {
        return true;
    }
}
