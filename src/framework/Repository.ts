import { Database } from "../../lib/database";
import { LoggerFactory } from "../../lib/logger";
import { PaginatedResourceDto } from "./PaginatedResourceDto";

export interface IWhereClause {
    field: string;
    value: string | number | boolean;
}

export interface IPaginatedQueryResponse<T> {
    resource: T[];
    remainingPages: number;
}

export abstract class Repository<T> {
    protected abstract tableName: string;

    protected readonly database: Database;

    protected readonly logger = LoggerFactory.getLogger();

    constructor(database: Database) {
        this.database = database;
    }

    // tslint:disable-next-line:no-any
    protected abstract parseRowToType(row: any): T;

    public async findAll(fields?: string[], wheres?: IWhereClause[]): Promise<T[]> {
        const { values, whereClause } = this.getWhereClause(wheres);
        const fieldSelection = this.getFieldSelection(fields);

        const resourceQueryResult = await this.database.query(
            `
            SELECT ${fieldSelection}
            FROM ${this.tableName}
            ${whereClause}
            `,
            [...values],
        );

        const rows = resourceQueryResult.rows;
        // tslint:disable-next-line:no-any
        return rows.map((row: any) => this.parseRowToType(row));
    }

    public async paginatedFindAll(
        dto: PaginatedResourceDto,
        fields?: string[],
        wheres?: IWhereClause[],
    ): Promise<IPaginatedQueryResponse<T>> {
        const { values, whereClause } = this.getWhereClause(wheres);
        const fieldSelection = this.getFieldSelection(fields);
        const limit = dto.size;
        const offset = dto.page * limit;

        const limitIndex = values.length + 1;
        const offsetIndex = limitIndex + 1;
        const resourceQueryResult = await this.database.query(
            `
            SELECT ${fieldSelection}
            FROM ${this.tableName}
            ${whereClause}
            LIMIT $${limitIndex}
            OFFSET $${offsetIndex}
            `,
            [...values, limit, offset],
        );

        const rows = resourceQueryResult.rows;
        // tslint:disable-next-line:no-any
        const resource = rows.map((row: any) => this.parseRowToType(row));

        const countQueryResult = await this.database.query(
            `
            SELECT COUNT(id)
            FROM ${this.tableName}
            ${whereClause}
          `,
            values,
        );

        const [countRow] = countQueryResult.rows;
        const count = countRow.count;

        let remainingPages = Math.floor(count / (limit * (offset + 1)));
        remainingPages = remainingPages >= 0 ? remainingPages : 0;

        return {
            remainingPages,
            resource,
        };
    }

    public async findById(id: number, fields?: string[]): Promise<T | undefined> {
        const fieldSelection = this.getFieldSelection(fields);
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

    private getWhereClause(
        wheres?: IWhereClause[],
    ): { whereClause: string; values: Array<string | number | boolean> } {
        const values = [];
        let whereClause = "";

        if (wheres) {
            for (const [i, where] of wheres.entries()) {
                const j = i + 1;
                if (i === 0) {
                    whereClause = `WHERE ${where.field} = $${j}`;
                } else {
                    whereClause = `${whereClause} AND ${where.field} = $${j}`;
                }
                values.push(where.value);
            }
        }

        return { whereClause, values };
    }

    private getFieldSelection(fields?: string[]): string {
        return fields ? fields.join(",") : "*";
    }
}
