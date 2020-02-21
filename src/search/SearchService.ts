import { Folder } from "../folders/Folder";
import { FolderRepository } from "../folders/FolderRepository";
import { Context } from "../framework/Context";
import { Note } from "../notes/Note";
import { NoteRepository } from "../notes/NoteRepository";
import { SearchDto } from "./SearchDto";

export interface IAllSearchResult {
    folderIds: number[];
    noteIds: number[];
}

export class SearchService {
    private readonly noteRepository: NoteRepository;

    private readonly folderRepository: FolderRepository;

    constructor(noteRepository: NoteRepository, folderRepository: FolderRepository) {
        this.noteRepository = noteRepository;
        this.folderRepository = folderRepository;
    }

    public async searchAll(
        context: Context,
        dto: SearchDto,
        userId: number,
    ): Promise<IAllSearchResult> {
        const notes = await this.noteRepository.searchNotes(context, userId, dto.query);
        const folders = await this.folderRepository.searchFolders(context, userId, dto.query);

        const noteIds = notes.map((note: Note) => note.id);
        const folderIds = folders.map((folder: Folder) => folder.id);

        return {
            folderIds,
            noteIds,
        };
    }
}
