export class User {
    public id: number;

    public email: string;

    public password: string;

    public createdAt: Date;

    public updatedAt: Date;

    constructor(id: number, email: string, password: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
