import faker from "faker";
import request from "supertest";
import { Application } from "../src/Application";
import { CreateFolderDto } from "../src/folders/CreateFolderDto";
import { FolderRepository } from "../src/folders/FolderRepository";
import { createJwt } from "../src/users/AuthorizeUserHandler";
import { CreateUserDto } from "../src/users/CreateUserDto";
import { UserRepository } from "../src/users/UserRepository";

describe("folders", () => {
    const application = Application.build();
    const app = application.server;
    const config = application.config;
    const userRepo = new UserRepository(application.database);
    const folderRepo = new FolderRepository(application.database);

    let jwt: string;
    let userId: number;

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
    });

    afterAll(async () => {
        await application.database.truncate(["users", "folders"]);
    });

    describe("POST /folders", () => {
        it("can create a folder", async (done: jest.DoneCallback) => {
            const payload = { folder: { name: faker.random.word() } };
            const response = await request(app)
                .post("/folders")
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(200);
            expect(response.body.resource.folder).toBeDefined();
            done();
        });

        it("fails creating a folder for an unauthorized request ", async (done: jest.DoneCallback) => {
            const payload = { folder: { name: faker.random.word() } };
            const response = await request(app)
                .post("/folders")
                .send(payload);
            expect(response.status).toBe(401);
            expect(response.body.error).toBeDefined();
            done();
        });

        it("fails creating a folder for a malformed request ", async (done: jest.DoneCallback) => {
            const payload = {};
            const response = await request(app)
                .post("/folders")
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            done();
        });

        it("fails creating a folder for an invalid request ", async (done: jest.DoneCallback) => {
            const longString = Array.from(Array(32))
                // tslint:disable-next-line:typedef
                .map(_ => "A")
                .join("");
            const payloadTooShort = { folder: { name: "" } };
            const payloadTooLong = { folder: { name: longString } };
            const payloads = [payloadTooLong, payloadTooShort];

            for (const payload of payloads) {
                const response = await request(app)
                    .post("/folders")
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

    describe("GET /folders", () => {
        beforeAll(async () => {
            await application.database.truncate(["folders"]);
            const createFolderDto = new CreateFolderDto(faker.random.word());
            await folderRepo.create(createFolderDto, userId);
        });

        it("can get folders belonging to a user", async (done: jest.DoneCallback) => {
            const payload = { paginate: { page: 0, size: 5 } };
            const response = await request(app)
                .get(`/folders`)
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(200);
            expect(response.body.resource.folders).toBeDefined();
            expect(response.body.resource.folders.length).toBe(1);
            expect(response.body.paginate).toBeDefined();
            expect(response.body.paginate.remainingPages).toBe(0);
            done();
        });

        it("fails retrieving folders for an unauthorized user", async (done: jest.DoneCallback) => {
            const payload = { paginate: { page: 0, size: 5 } };
            const response = await request(app)
                .get(`/folders`)
                .send(payload);
            expect(response.status).toBe(401);
            expect(response.body.error).toBeDefined();
            done();
        });

        it("fails retrieving folders for a malformed request", async (done: jest.DoneCallback) => {
            const payload = {};
            const response = await request(app)
                .get(`/folders`)
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            done();
        });

        it("fails retrieving folders for an invalid request", async (done: jest.DoneCallback) => {
            const payload = { paginate: { page: 0, size: 999 } };
            const response = await request(app)
                .get(`/folders`)
                .set({
                    Authorization: jwt,
                })
                .send(payload);
            expect(response.status).toBe(422);
            expect(response.body.error).toBeDefined();
            done();
        });
    });
});
