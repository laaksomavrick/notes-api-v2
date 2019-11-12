import bcrypt from "bcrypt";
import { Repository } from "../framework/Repository";
import { CreateUserDto } from "./CreateUserDto";
import { User } from "./User";

export class UserRepository extends Repository<User> {
    protected tableName = "users";

    public async findByEmail(email: string): Promise<User | undefined> {
        const { rows } = await this.database.query(
            `
            SELECT id, email, created_at, updated_at
            FROM users
            WHERE email = $1`,
            [email],
        );
        const [row] = rows;

        if (row) {
            return this.parseRowToType(row);
        } else {
            return undefined;
        }
    }

    // TODO refactor
    public async findByEmailWithPassword(email: string): Promise<User | undefined> {
        const { rows } = await this.database.query(
            `
            SELECT id, email, password, created_at, updated_at
            FROM users
            WHERE email = $1`,
            [email],
        );
        const [row] = rows;

        if (row) {
            return this.parseRowToType(row);
        } else {
            return undefined;
        }
    }

    public async create(dto: CreateUserDto): Promise<User> {
        const email = dto.email;
        const password = dto.password;

        // TODO: can we specify the seed?
        const hashed = await bcrypt.hash(password, 10);

        const queryResult = await this.database.query(
            `
            INSERT INTO users (email, password)
            VALUES ($1, $2)
            RETURNING id`,
            [email, hashed],
        );

        const [{ id }] = queryResult.rows;

        return this.findByIdOrThrow(id, ["id", "email", "created_at", "updated_at"]);
    }

    // tslint:disable-next-line:no-any
    protected parseRowToType(row: any): User {
        return new User(
            row.id,
            row.email,
            row.password,
            new Date(row.created_at),
            new Date(row.updated_at),
        );
    }
}
