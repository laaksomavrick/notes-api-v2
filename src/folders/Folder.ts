export class Folder {
    public id: number;

    public userId: number;

    public name: string;

    public deleted: boolean;

    public createdAt: string;

    public updatedAt: string;

    constructor(
        id: number,
        userId: number,
        name: string,
        deleted: boolean,
        createdAt: string,
        updatedAt: string,
    ) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
