import { CreateNoteDto } from "./CreateNoteDto";

export class UpdateNoteDto extends CreateNoteDto {
    public isValid(): boolean {
        return true;
    }
}
