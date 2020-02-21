import { Request } from "express";
import { Dto } from "../framework/Dto";

export interface ISearchRequest {
    search: {
        query: string;
    };
}

export class SearchDto extends Dto {
    public query: string;

    constructor(query: string) {
        super();
        this.query = query;
    }

    // tslint:disable-next-line:no-any
    public static build(req: Request): SearchDto | undefined {
        const body = req.body;

        if (body == null) {
            return undefined;
        }

        if (body.search == null) {
            return undefined;
        }

        const query = body.search.query;

        const queryOk = query != null;

        if (!queryOk) {
            return undefined;
        }

        return new SearchDto(query);
    }

    public isValid(): boolean {
        // If performance is prohibitive, can make this at least 3 chars (trigram
        return this.query.length > 0;
    }
}
