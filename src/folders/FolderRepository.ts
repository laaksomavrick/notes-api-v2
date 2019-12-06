import { PaginatedResourceDto } from "../framework/PaginatedResourceDto";
import { IPaginatedQueryResponse, Repository } from "../framework/Repository";
import { CreateFolderDto } from "./CreateFolderDto";
import { Folder } from "./Folder";
import { UpdateFolderDto } from "./UpdateFolderDto";

export class FolderRepository extends Repository<Folder> {
    protected tableName = "folders";

    public async getAllFoldersForUser(
        dto: PaginatedResourceDto,
        userId: number,
    ): Promise<IPaginatedQueryResponse<Folder>> {
        return this.paginatedFindAll(
            dto,
            ["id", "name", "created_at", "updated_at"],
            [{ field: "user_id", value: userId }],
        );
    }

    public async create(dto: CreateFolderDto, userId: number): Promise<Folder> {
        const name = dto.name;

        const queryResult = await this.database.query(
            `
            INSERT INTO folders (name, user_id)
            VALUES ($1, $2)
            RETURNING id`,
            [name, userId],
        );

        const [{ id }] = queryResult.rows;

        return this.findByIdOrThrow(id, ["id", "user_id", "name", "created_at", "updated_at"]);
    }

    public async update(dto: UpdateFolderDto, folderId: number): Promise<Folder> {
        const name = dto.name;

        // TODO: generalize fields and where clause in repository
        const queryResult = await this.database.query(
            `
            UPDATE folders
            SET name = $1
            WHERE id = $2
            RETURNING id`,
            [name, folderId],
        );

        const [{ id }] = queryResult.rows;

        return this.findByIdOrThrow(id, ["id", "user_id", "name", "created_at", "updated_at"]);
    }

    // tslint:disable-next-line:no-any
    protected parseRowToType(row: any): Folder {
        return new Folder(
            row.id,
            row.user_id,
            row.name,
            new Date(row.created_at),
            new Date(row.updated_at),
        );
    }
}
