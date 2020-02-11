export class Note {
    public id: number;

    public userId: number;

    public folderId: number;

    public content: string;

    public deleted: boolean;

    public createdAt: Date;

    public updatedAt: Date;

    constructor(
        id: number,
        userId: number,
        folderId: number,
        content: string,
        deleted: boolean,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.userId = userId;
        this.folderId = folderId;
        this.content = content;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
