export class Folder {
    public id: number;

    public userId: number;

    public name: string;

    public deleted: boolean;

    public createdAt: Date;

    public updatedAt: Date;

    constructor(
        id: number,
        userId: number,
        name: string,
        deleted: boolean,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
