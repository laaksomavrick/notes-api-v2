import { Context } from "../framework/Context";
import { Repository } from "../framework/Repository";
import { CreateFolderDto } from "./CreateFolderDto";
import { Folder } from "./Folder";
import { UpdateFolderDto } from "./UpdateFolderDto";

export class FolderRepository extends Repository<Folder> {
    protected tableName = "folders";

    public async getAllFoldersForUser(context: Context, userId: number): Promise<Folder[]> {
        return this.findAll(
            context,
            ["id", "name", "created_at", "updated_at"],
            [{ field: "user_id", value: userId }, { field: "deleted", value: false }],
        );
    }

    public async searchFolders(context: Context, userId: number, query: string): Promise<Folder[]> {
        const fields = ["id", "name"];
        const wheres = [{ field: "user_id", value: userId }, { field: "deleted", value: false }];
        const searchWhere = { field: "name", value: query };

        return this.findAll(context, fields, wheres, undefined, searchWhere);
    }

    public async create(context: Context, dto: CreateFolderDto, userId: number): Promise<Folder> {
        const name = dto.name;

        const queryResult = await this.database.query(
            `
            INSERT INTO folders (name, user_id)
            VALUES ($1, $2)
            RETURNING id`,
            [name, userId],
            context,
        );

        const [{ id }] = queryResult.rows;

        return this.findByIdOrThrow(context, id, [
            "id",
            "user_id",
            "name",
            "created_at",
            "updated_at",
        ]);
    }

    public async update(context: Context, dto: UpdateFolderDto, folderId: number): Promise<Folder> {
        const name = dto.name;

        const queryResult = await this.database.query(
            `
            UPDATE folders
            SET name = $1
            WHERE id = $2
            RETURNING id`,
            [name, folderId],
            context,
        );

        const [{ id }] = queryResult.rows;

        return this.findByIdOrThrow(context, id, [
            "id",
            "user_id",
            "name",
            "created_at",
            "updated_at",
        ]);
    }

    public async delete(context: Context, folderId: number): Promise<void> {
        await this.database.query(
            `
            UPDATE folders
            SET deleted = true
            WHERE id = $1
            AND deleted = false
            RETURNING id`,
            [folderId],
            context,
        );
    }

    public async getActiveCountForUser(context: Context, userId: number): Promise<number> {
        const queryResult = await this.database.query(
            `
            SELECT COUNT(*)
            FROM folders
            WHERE user_id = $1
            AND deleted = false`,
            [userId],
        );

        const [{ count }] = queryResult.rows;

        return count;
    }

    // tslint:disable-next-line:no-any
    protected parseRowToType(row: any): Folder {
        return new Folder(
            row.id,
            row.user_id,
            row.name,
            row.deleted,
            row.created_at,
            row.updated_at,
        );
    }
}
