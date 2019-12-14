import { Request } from "express";
import { Dto } from "../framework/Dto";

export class GetNotesDto extends Dto {
    public folderId?: number;

    constructor(folderId: number) {
        super();
        this.folderId = folderId;
    }

    public static build(req: Request): GetNotesDto | undefined {
        if (req == null) {
            return undefined;
        }

        const folderId = req.query.folderId;

        return new GetNotesDto(folderId);
    }

    public isValid(): boolean {
        return true;
    }
}
