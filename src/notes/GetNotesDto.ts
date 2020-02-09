import { Request } from "express";
import { Dto } from "../framework/Dto";
import { OrderByQuery } from "../framework/OrderByQuery";
import { Note } from "./Note";

// tslint:disable-next-line:max-classes-per-file
export class GetNotesDto extends Dto {
    public folderId?: number;
    public orderBy?: OrderByQuery<Note>;

    constructor(folderId: number, orderBy?: OrderByQuery<Note>) {
        super();
        this.folderId = folderId;
        this.orderBy = orderBy;
    }

    public static build(req: Request): GetNotesDto | undefined {
        let orderBy;

        if (req == null) {
            return undefined;
        }

        const folderId = req.query.folderId;

        if (req.query.orderBy) {
            orderBy = new OrderByQuery<Note>(req.query.orderBy);
        }

        return new GetNotesDto(folderId, orderBy);
    }

    public isValid(): boolean {
        return true;
    }
}
