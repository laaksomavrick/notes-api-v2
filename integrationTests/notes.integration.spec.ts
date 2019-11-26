import faker from "faker";
import request from "supertest";
import { Application } from "../src/Application";
import { CreateFolderDto } from "../src/folders/CreateFolderDto";
import { FolderRepository } from "../src/folders/FolderRepository";
import { NoteRepository } from "../src/notes/NoteRepository";
import { createJwt } from "../src/users/AuthorizeUserHandler";
import { CreateUserDto } from "../src/users/CreateUserDto";
import { UserRepository } from "../src/users/UserRepository";

describe("notes", () => {
    const application = Application.build();
    const app = application.server;
    const config = application.config;
    const userRepo = new UserRepository(application.database);
    const folderRepo = new FolderRepository(application.database);
    const noteRepo = new NoteRepository(application.database);

    let jwt: string;
    let userId: number;
    let folderId: number;

    beforeAll(async () => {
        const email = faker.internet.email(faker.random.word());
        const password = faker.random.uuid();
        const createUserDto = new CreateUserDto(email, password);

        await userRepo.create(createUserDto);
        const user = await userRepo.findByEmail(email);

        if (!user) {
            throw new Error("No user found, something went terribly wrong.");
        }

        userId = user.id;

        jwt = await createJwt(user.id, config.jwtSecret);
        jwt = `Bearer ${jwt}`;

        const createFolderDto = new CreateFolderDto(faker.random.word());
        const folder = await folderRepo.create(createFolderDto, userId);

        folderId = folder.id;
    });

    afterAll(async () => {
        await application.database.truncate(["users", "folders", "notes"]);
    });

    describe("POST /notes", () => {
        it("can create a note", async (done: jest.DoneCallback) => {
            const payload = {
                note: { name: faker.random.word(), content: faker.lorem.paragraph(), folderId },
            };
            const response = await request(app)
                .post("/notes")
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(200);
            expect(response.body.resource.note).toBeDefined();
            done();
        });

        it("fails creating a note for an unauthorized request ", async (done: jest.DoneCallback) => {
            const payload = {
                note: { name: faker.random.word(), content: faker.lorem.paragraph(), folderId },
            };
            const response = await request(app)
                .post("/notes")
                .send(payload);
            expect(response.status).toBe(401);
            expect(response.body.error).toBeDefined();
            done();
        });

        it("fails creating a note for a malformed request ", async (done: jest.DoneCallback) => {
            const payload = {};
            const response = await request(app)
                .post("/notes")
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            done();
        });

        it("fails creating a note for an invalid request ", async (done: jest.DoneCallback) => {
            const longString = Array.from(Array(32))
                // tslint:disable-next-line:typedef
                .map(_ => "A")
                .join("");
            const payloadTooShort = { note: { name: "", content: "", folderId } };
            const payloadTooLong = { note: { name: longString, content: "", folderId } };
            const payloads = [payloadTooLong, payloadTooShort];

            for (const payload of payloads) {
                const response = await request(app)
                    .post("/notes")
                    .set({
                        Authorization: jwt,
                    })
                    .send(payload);
                expect(response.status).toBe(422);
                expect(response.body.error).toBeDefined();
            }
            done();
        });
    });
});
