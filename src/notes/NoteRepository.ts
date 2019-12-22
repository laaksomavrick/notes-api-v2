import { Folder } from "../folders/Folder";
import { UpdateFolderDto } from "../folders/UpdateFolderDto";
import { Repository } from "../framework/Repository";
import { CreateNoteDto } from "./CreateNoteDto";
import { GetNotesDto } from "./GetNotesDto";
import { Note } from "./Note";
import { UpdateNoteDto } from "./UpdateNoteDto";

export class NoteRepository extends Repository<Note> {
    protected tableName = "notes";

    public async findAllNotes(dto: GetNotesDto, userId: number): Promise<Note[]> {
        const folderId = dto.folderId;
        const wheres = [{ field: "user_id", value: userId }];

        if (folderId) {
            wheres.push({ field: "folder_id", value: folderId });
        }

        return this.findAll(["*"], wheres);
    }

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

    public async update(dto: UpdateNoteDto, noteId: number): Promise<Note> {
        const name = dto.name;
        const content = dto.content;
        const folderId = dto.folderId;

        // TODO: generalize fields and where clause in repository
        const queryResult = await this.database.query(
            `
            UPDATE notes
            SET name = $1,
                content = $2,
                folder_id = $3
            WHERE id = $4
            RETURNING id`,
            [name, content, folderId, noteId],
        );

        const [{ id }] = queryResult.rows;

        return this.findByIdOrThrow(id, [
            "id",
            "user_id",
            "name",
            "content",
            "folder_id",
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
