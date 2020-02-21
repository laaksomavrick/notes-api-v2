import faker from "faker";
import request from "supertest";
import { Application } from "../src/Application";
import { CreateFolderDto } from "../src/folders/CreateFolderDto";
import { FolderRepository } from "../src/folders/FolderRepository";
import { Context } from "../src/framework/Context";
import { CreateNoteDto } from "../src/notes/CreateNoteDto";
import { NoteRepository } from "../src/notes/NoteRepository";
import { createJwt } from "../src/users/AuthorizeUserHandler";
import { CreateUserDto } from "../src/users/CreateUserDto";
import { UserRepository } from "../src/users/UserRepository";

describe("search", () => {
    const application = Application.build();
    const app = application.server;
    const config = application.config;
    const context = new Context();

    const userRepo = new UserRepository(application.database);
    const folderRepo = new FolderRepository(application.database);
    const noteRepo = new NoteRepository(application.database);

    const folderName = "foo";

    const firstNoteName = folderName;
    const secondNoteName = "bar";

    let jwt: string;
    let userId: number;
    let folderId: number;
    let firstNoteId: number;
    let secondNoteId: number;

    beforeAll(async () => {
        const email = faker.internet.email(faker.random.word());
        const password = faker.random.uuid();

        const createUserDto = new CreateUserDto(email, password);

        await userRepo.create(context, createUserDto);

        const user = await userRepo.findByEmail(context, email);

        if (!user) {
            throw new Error("No user found, something went terribly wrong.");
        }

        userId = user.id;

        jwt = await createJwt(user.id, config.jwtSecret);
        jwt = `Bearer ${jwt}`;

        const createFolderDto = new CreateFolderDto(folderName);
        const folder = await folderRepo.create(context, createFolderDto, userId);

        folderId = folder.id;

        const firstCreateNoteDto = new CreateNoteDto(firstNoteName, folderId);
        const secondCreateNoteDto = new CreateNoteDto(secondNoteName, folderId);

        const firstNote = await noteRepo.create(context, firstCreateNoteDto, userId);
        const secondNote = await noteRepo.create(context, secondCreateNoteDto, userId);

        firstNoteId = firstNote.id;
        secondNoteId = secondNote.id;
    });

    afterAll(async () => {
        await application.database.truncate(["users", "folders", "notes"]);
    });

    describe("POST /search/all", () => {
        it("will not produce matches for a query that does not match", async (done: jest.DoneCallback) => {
            const payload = { search: { query: "asdasdqrwraf" } };
            const response = await request(app)
                .post("/search/all")
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(200);
            expect(response.body.resource.folderIds).toEqual([]);
            expect(response.body.resource.noteIds).toEqual([]);
            done();
        });

        it("produces a match when only one entity is matched", async (done: jest.DoneCallback) => {
            const payload = { search: { query: secondNoteName } };
            const response = await request(app)
                .post("/search/all")
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(200);
            expect(response.body.resource.folderIds).toEqual([]);
            expect(response.body.resource.noteIds).toEqual([secondNoteId]);
            done();
        });

        it("produces a match when both folders and notes are matched", async (done: jest.DoneCallback) => {
            const payload = { search: { query: firstNoteName } };
            const response = await request(app)
                .post("/search/all")
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(200);
            expect(response.body.resource.folderIds).toEqual([folderId]);
            expect(response.body.resource.noteIds).toEqual([firstNoteId]);
            done();
        });

        it("fails search for an unauthorized request", async (done: jest.DoneCallback) => {
            const payload = { search: { query: firstNoteName } };
            const response = await request(app)
                .post("/search/all")
                .send(payload);
            expect(response.status).toBe(401);
            expect(response.body.error).toBeDefined();
            done();
        });

        it("fails search for a malformed request ", async (done: jest.DoneCallback) => {
            const payload = {};
            const response = await request(app)
                .post("/search/all")
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            done();
        });
    });
});
