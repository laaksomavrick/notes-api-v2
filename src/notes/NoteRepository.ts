import { Repository } from "../framework/Repository";
import { CreateNoteDto } from "./CreateNoteDto";
import { Note } from "./Note";

export class NoteRepository extends Repository<Note> {
    protected tableName = "notes";

    public async create(dto: CreateNoteDto, userId: number): Promise<Note> {
        const name = dto.name;
        const content = dto.content;
        const folderId = dto.folderId;

        const queryResult = await this.database.query(
            `
            INSERT INTO notes (name, user_id, folder_id, content)
            VALUES ($1, $2, $3, $4)
            RETURNING id`,
            [name, userId, folderId, content],
        );

        const [{ id }] = queryResult.rows;

        return this.findByIdOrThrow(id, [
            "id",
            "user_id",
            "folder_id",
            "name",
            "content",
            "created_at",
            "updated_at",
        ]);
    }

    // tslint:disable-next-line:no-any
    protected parseRowToType(row: any): Note {
        return new Note(
            row.id,
            row.user_id,
            row.folder_id,
            row.name,
            row.content,
            new Date(row.created_at),
            new Date(row.updated_at),
        );
    }
}
