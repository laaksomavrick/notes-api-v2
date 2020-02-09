import { snakeCase } from "change-case";

export class OrderByQuery<T> {
    private readonly field: keyof T;

    constructor(prop: keyof T) {
        this.field = prop;
    }

    public getField(): keyof T {
        return this.field;
    }

    public getFieldSnakeCase(): string {
        return snakeCase(`${this.field}`);
    }
}
