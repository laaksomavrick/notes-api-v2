export class Note {
    public id: number;

    public userId: number;

    public folderId: number;

    public name: string;

    public content: string;

    public createdAt: Date;

    public updatedAt: Date;

    constructor(
        id: number,
        userId: number,
        folderId: number,
        name: string,
        content: string,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.userId = userId;
        this.folderId = folderId;
        this.name = name;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
