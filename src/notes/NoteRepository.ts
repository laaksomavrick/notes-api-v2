import { Context } from "../framework/Context";
import { OrderByValue, Repository } from "../framework/Repository";
import { CreateNoteDto } from "./CreateNoteDto";
import { GetNotesDto } from "./GetNotesDto";
import { Note } from "./Note";
import { UpdateNoteDto } from "./UpdateNoteDto";

export class NoteRepository extends Repository<Note> {
    protected tableName = "notes";

    public async findAllNotes(context: Context, dto: GetNotesDto, userId: number): Promise<Note[]> {
        const folderId = dto.folderId;
        const wheres = [{ field: "user_id", value: userId }, { field: "deleted", value: false }];

        let orderBy;

        if (folderId) {
            wheres.push({ field: "folder_id", value: folderId });
        }

        if (dto.orderBy) {
            orderBy = { field: dto.orderBy.getFieldSnakeCase(), value: OrderByValue.DESC };
        }

        return this.findAll(context, ["*"], wheres, orderBy);
    }

    public async searchNotes(context: Context, userId: number, query: string): Promise<Note[]> {
        const wheres = [{ field: "user_id", value: userId }, { field: "deleted", value: false }];
        const searchWhere = { field: "content", value: query };

        return this.findAll(
            context,
            ["id", "content", "folder_id"],
            wheres,
            undefined,
            searchWhere,
        );
    }

    public async create(context: Context, dto: CreateNoteDto, userId: number): Promise<Note> {
        const content = dto.content;
        const folderId = dto.folderId;

        const queryResult = await this.database.query(
            `
            INSERT INTO notes (user_id, folder_id, content)
            VALUES ($1, $2, $3)
            RETURNING id`,
            [userId, folderId, content],
            context,
        );

        const [{ id }] = queryResult.rows;

        return this.findByIdOrThrow(context, id, [
            "id",
            "user_id",
            "folder_id",
            "content",
            "created_at",
            "updated_at",
        ]);
    }

    public async update(context: Context, dto: UpdateNoteDto, noteId: number): Promise<Note> {
        const content = dto.content;
        const folderId = dto.folderId;

        const queryResult = await this.database.query(
            `
            UPDATE notes
            SET content = $1,
                folder_id = $2
            WHERE id = $3
            RETURNING id`,
            [content, folderId, noteId],
            context,
        );

        const [{ id }] = queryResult.rows;

        return this.findByIdOrThrow(context, id, [
            "id",
            "user_id",
            "content",
            "folder_id",
            "created_at",
            "updated_at",
        ]);
    }

    public async delete(context: Context, noteId: number): Promise<void> {
        await this.database.query(
            `
                    UPDATE notes
                    SET deleted = true
                    WHERE id = $1
                      AND deleted = false RETURNING id`,
            [noteId],
            context,
        );
    }

    // tslint:disable-next-line:no-any
    protected parseRowToType(row: any): Note {
        return new Note(
            row.id,
            row.user_id,
            row.folder_id,
            row.content,
            row.deleted,
            row.created_at,
            row.updated_at,
        );
    }
}
