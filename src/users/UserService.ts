import { Database } from "../../lib/database";
import { CreateFolderDto } from "../folders/CreateFolderDto";
import { FolderRepository } from "../folders/FolderRepository";
import { Context } from "../framework/Context";
import { CreateUserDto } from "./CreateUserDto";
import { User } from "./User";
import { UserRepository } from "./UserRepository";

export class UserService {
    private readonly database: Database;

    private readonly userRepository: UserRepository;

    private readonly folderRepository: FolderRepository;

    constructor(db: Database, ur: UserRepository, fr: FolderRepository) {
        this.database = db;
        this.userRepository = ur;
        this.folderRepository = fr;
    }

    public async createUser(context: Context, email: string, password: string): Promise<User> {
        const createUserDto = new CreateUserDto(email, password);
        const createDefaultFolderDto = new CreateFolderDto("Default");
        const execs = async (): Promise<void> => {
            const user = await this.userRepository.create(context, createUserDto);
            await this.folderRepository.create(context, createDefaultFolderDto, user.id);
        };

        await this.database.transaction(execs);

        return this.userRepository.findByEmailOrThrow(context, email);
    }
}
