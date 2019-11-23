export class Folder {
    public id: number;

    public userId: number;

    public name: string;

    public createdAt: Date;

    public updatedAt: Date;

    constructor(id: number, userId: number, name: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
