import { Database } from "../../lib/database";
import { LoggerFactory } from "../../lib/logger";
import { Context } from "./Context";
import { PaginatedResourceDto } from "./PaginatedResourceDto";

export enum OrderByValue {
    ASC = "ASC",
    DESC = "DESC",
}

export interface IOrderByClause {
    field: string;
    value: OrderByValue;
}

export interface IWhereClause {
    field: string;
    value: string | number | boolean;
}

export interface ISearchClause {
    field: string;
    value: string;
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

    public async findAll(
        context: Context,
        fields?: string[],
        wheres?: IWhereClause[],
        orderBy?: IOrderByClause,
        search?: ISearchClause,
    ): Promise<T[]> {
        const { values, whereClause } = this.getWhereClause(wheres, search);
        const orderByClause = this.getOrderByClause(orderBy);
        const fieldSelection = this.getFieldSelection(fields);

        const resourceQueryResult = await this.database.query(
            `
            SELECT ${fieldSelection}
            FROM ${this.tableName}
            ${whereClause}
            ${orderByClause}
            `,
            [...values],
            context,
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

    public async findById(context: Context, id: number, fields?: string[]): Promise<T | undefined> {
        const fieldSelection = this.getFieldSelection(fields);
        const { rows } = await this.database.query(
            `
            SELECT ${fieldSelection}
            FROM ${this.tableName}
            WHERE id = $1`,
            [id],
            context,
        );
        const [row] = rows;

        if (row) {
            return this.parseRowToType(row);
        } else {
            return undefined;
        }
    }

    public async findByIdAndUserId(
        context: Context,
        id: number,
        userId: number,
        fields?: string[],
    ): Promise<T | undefined> {
        const fieldSelection = this.getFieldSelection(fields);
        const { rows } = await this.database.query(
            `
            SELECT ${fieldSelection}
            FROM ${this.tableName}
            WHERE id = $1
            AND user_id = $2
            `,
            [id, userId],
            context,
        );
        const [row] = rows;

        if (row) {
            return this.parseRowToType(row);
        } else {
            return undefined;
        }
    }

    public async findByIdOrThrow(context: Context, id: number, fields?: string[]): Promise<T> {
        const found = this.findById(context, id, fields);
        if (found === undefined) {
            throw new Error(`findByIdOrThrow throwing, cannot find ${id}`);
        } else {
            // TODO: ugly
            return (found as unknown) as T;
        }
    }

    private getWhereClause(
        wheres?: IWhereClause[],
        search?: ISearchClause,
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

        if (search) {
            const lowercased = search.value.toLowerCase();
            const happyParamQuery = `%${lowercased}%`;
            if (whereClause === "") {
                whereClause = `WHERE ${search.field} LIKE $${0}`;
            } else {
                const searchIndex = values.length + 1;
                whereClause = `${whereClause} AND ${search.field} LIKE $${searchIndex}`;
            }

            values.push(happyParamQuery);
        }

        return { whereClause, values };
    }

    private getOrderByClause(orderBy?: IOrderByClause): string {
        let orderByClause = "";

        if (orderBy) {
            orderByClause = `ORDER BY ${orderBy.field} ${orderBy.value}`;
        }

        return orderByClause;
    }

    private getFieldSelection(fields?: string[]): string {
        return fields ? fields.join(",") : "*";
    }
}
