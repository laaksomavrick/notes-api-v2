import { Dto } from "./Dto";

export class PaginatedResourceDto extends Dto {
    public page: number;
    public size: number;

    constructor(page: number, size: number) {
        super();
        this.page = page;
        this.size = size;
    }

    // tslint:disable-next-line:no-any
    public static build<T>(body: any): PaginatedResourceDto | undefined {
        if (body == null) {
            return undefined;
        }

        if (body.paginate == null) {
            return undefined;
        }

        const pageOk = body.paginate.page != null;

        if (!pageOk) {
            return undefined;
        }

        const sizeOk = body.paginate.size != null;

        if (!sizeOk) {
            return undefined;
        }

        return new PaginatedResourceDto(body.paginate.page, body.paginate.size);
    }

    public isValid(): boolean {
        return this.page >= 0 && this.size > 0 && this.size <= 50;
    }
}
