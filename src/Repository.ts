import { Database } from "../lib/database";

export abstract class Repository<T> {
    protected abstract tableName: string;

    protected readonly database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    // tslint:disable-next-line:no-any
    protected abstract parseRowToType(row: any): T;

    public async findById(id: number, fields?: string[]): Promise<T | undefined> {
        const fieldSelection = fields ? fields.join(",") : "*";
        const { rows } = await this.database.query(
            `
            SELECT ${fieldSelection}
            FROM ${this.tableName}
            WHERE id = $1`,
            [id],
        );
        const [row] = rows;

        if (row) {
            return this.parseRowToType(row);
        } else {
            return undefined;
        }
    }

    public async findByIdOrThrow(id: number, fields?: string[]): Promise<T> {
        const found = this.findById(id, fields);
        if (found === undefined) {
            throw new Error(`findByIdOrThrow throwing, cannot find ${id}`);
        } else {
            // TODO: ugly
            return (found as unknown) as T;
        }
    }
}
