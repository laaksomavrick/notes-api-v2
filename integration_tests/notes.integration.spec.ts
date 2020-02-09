import { isAfter, parseISO } from "date-fns";
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
import { sleep } from "./helpers";

describe("notes", () => {
    const application = Application.build();
    const app = application.server;
    const config = application.config;
    const context = new Context();
    const userRepo = new UserRepository(application.database);
    const folderRepo = new FolderRepository(application.database);
    const noteRepo = new NoteRepository(application.database);

    let jwt: string;
    let secondJwt: string;
    let userId: number;
    let secondUserId: number;

    let folderId: number;

    beforeAll(async () => {
        const email = faker.internet.email(faker.random.word());
        const secondEmail = `${email}aaa`;

        const password = faker.random.uuid();

        const createUserDto = new CreateUserDto(email, password);
        const secondCreateUserDto = new CreateUserDto(secondEmail, password);

        await userRepo.create(context, createUserDto);
        await userRepo.create(context, secondCreateUserDto);

        const user = await userRepo.findByEmail(context, email);
        const secondUser = await userRepo.findByEmail(context, secondEmail);

        if (!user || !secondUser) {
            throw new Error("No user found, something went terribly wrong.");
        }

        userId = user.id;
        secondUserId = secondUser.id;

        jwt = await createJwt(user.id, config.jwtSecret);
        jwt = `Bearer ${jwt}`;

        secondJwt = await createJwt(secondUser.id, config.jwtSecret);
        secondJwt = `Bearer ${secondJwt}`;

        const createFolderDto = new CreateFolderDto(faker.random.word());
        const folder = await folderRepo.create(context, createFolderDto, userId);

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

    describe("GET /notes", () => {
        let secondFolderId: number;

        beforeAll(async () => {
            await application.database.truncate(["notes"]);

            // We want two folders
            const createFolderDto = new CreateFolderDto(faker.random.word());
            const folder = await folderRepo.create(context, createFolderDto, userId);
            secondFolderId = folder.id;

            // Three notes, one in folder one, the other in folder two
            const createNoteDtoForFolderOne = new CreateNoteDto("name", "content", folderId);

            const createNoteDtoForFolderTwo = new CreateNoteDto("name", "content", secondFolderId);

            await noteRepo.create(context, createNoteDtoForFolderOne, userId);
            await noteRepo.create(context, createNoteDtoForFolderTwo, userId);

            // for updatedAt to be different, need to wait 1s
            await sleep(1000);

            await noteRepo.create(context, createNoteDtoForFolderTwo, userId);
        });

        it("can get all notes belonging to a user", async (done: jest.DoneCallback) => {
            const response = await request(app)
                .get(`/notes`)
                .set({
                    Authorization: jwt,
                })
                .send();
            expect(response.status).toBe(200);
            expect(response.body.resource.notes).toBeDefined();
            expect(response.body.resource.notes.length).toBe(3);
            done();
        });

        it("can get all notes belonging to a folder", async (done: jest.DoneCallback) => {
            const response = await request(app)
                .get(`/notes?folderId=${folderId}`)
                .set({
                    Authorization: jwt,
                })
                .send();
            expect(response.status).toBe(200);
            expect(response.body.resource.notes).toBeDefined();
            expect(response.body.resource.notes.length).toBe(1);
            done();
        });

        it("can get all notes in a particular order", async (done: jest.DoneCallback) => {
            const response = await request(app)
                .get(`/notes?folderId=${secondFolderId}`)
                .set({
                    Authorization: jwt,
                })
                .send();

            const [firstNote, secondNote] = response.body.resource.notes;
            const isRightOrder = isAfter(
                parseISO(firstNote.updatedAt),
                parseISO(secondNote.updatedAt),
            );

            expect(response.status).toBe(200);
            expect(isRightOrder).toBeTruthy();
            done();
        });

        it("fails retrieving notes for an unauthorized user", async (done: jest.DoneCallback) => {
            const response = await request(app)
                .get(`/notes`)
                .send();
            expect(response.status).toBe(401);
            expect(response.body.error).toBeDefined();
            done();
        });
    });

    describe("PATCH /notes", () => {
        const validName = "aaaaaaaa";
        const validContent = "aaaaaaaa";
        let updateableNoteId: number;
        let updateableNoteUrl: string;

        beforeAll(async () => {
            const createNoteDto = new CreateNoteDto("name", "content", folderId);
            const note = await noteRepo.create(context, createNoteDto, userId);

            updateableNoteId = note.id;
            updateableNoteUrl = `/notes/${updateableNoteId}`;
        });

        it("can update a note", async (done: jest.DoneCallback) => {
            const newName = "qweqweqwe";
            const payload = { note: { name: newName, content: validContent, folderId } };
            const response = await request(app)
                .patch(updateableNoteUrl)
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(200);
            expect(response.body.resource.note).toBeDefined();
            expect(response.body.resource.note.name).toBe(newName);
            done();
        });

        it("fails updating a note for an unauthorized request ", async (done: jest.DoneCallback) => {
            const payload = { note: { name: validName, content: validContent, folderId } };
            const response = await request(app)
                .patch(updateableNoteUrl)
                .send(payload);
            expect(response.status).toBe(401);
            expect(response.body.error).toBeDefined();
            done();
        });

        it("fails updating a note that does not exist ", async (done: jest.DoneCallback) => {
            const payload = { note: { name: validName, content: validContent, folderId } };
            const response = await request(app)
                .patch(`/notes/${updateableNoteId + 1}`)
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(404);
            expect(response.body.error).toBeDefined();
            done();
        });

        it("fails updating a note that belongs to another user", async (done: jest.DoneCallback) => {
            const payload = { note: { name: validName, content: validContent, folderId } };
            const response = await request(app)
                .patch(`/notes/${updateableNoteId}`)
                .set({
                    Authorization: secondJwt,
                })
                .send(payload);
            expect(response.status).toBe(404);
            expect(response.body.error).toBeDefined();
            done();
        });

        it("fails updating a note for a malformed request ", async (done: jest.DoneCallback) => {
            const payload = {};
            const response = await request(app)
                .patch(updateableNoteUrl)
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            done();
        });
    });

    describe("DELETE /notes", () => {
        let noteId: number;

        beforeEach(async () => {
            await application.database.truncate(["notes"]);
            const createNoteDto = new CreateNoteDto("name", "content", folderId);
            const note = await noteRepo.create(context, createNoteDto, userId);
            noteId = note.id;
        });

        it("it can delete a note", async (done: jest.DoneCallback) => {
            const response = await request(app)
                .delete(`/notes/${noteId}`)
                .set({
                    Authorization: jwt,
                })
                .send();
            expect(response.status).toBe(200);
            done();
        });

        it("it cannot delete a note that doesn't exist", async (done: jest.DoneCallback) => {
            const response = await request(app)
                .delete(`/notes/999`)
                .set({
                    Authorization: jwt,
                })
                .send();
            expect(response.status).toBe(404);
            done();
        });

        it("it cannot delete a note that doesn't belong to the user", async (done: jest.DoneCallback) => {
            const response = await request(app)
                .delete(`/notes/${noteId}`)
                .set({
                    Authorization: secondJwt,
                })
                .send();
            expect(response.status).toBe(404);
            done();
        });
    });
});
