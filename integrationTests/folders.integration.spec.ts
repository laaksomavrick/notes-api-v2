import faker from "faker";
import request from "supertest";
import { Application } from "../src/Application";
import { createJwt } from "../src/users/AuthorizeUserHandler";
import { CreateUserDto } from "../src/users/CreateUserDto";
import { UserRepository } from "../src/users/UserRepository";

describe("folders", () => {
    const application = Application.build();
    const app = application.server;
    const config = application.config;
    const userRepo = new UserRepository(application.database);

    let jwt: string;

    beforeAll(async () => {
        const email = faker.internet.email(faker.random.word());
        const password = faker.random.uuid();
        const createUserDto = new CreateUserDto(email, password);
        await userRepo.create(createUserDto);
        const user = await userRepo.findByEmail(email);

        if (!user) {
            throw new Error("No user found, something went terribly wrong.");
        }

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
            const payloadTooShort = { folder: { name: "" } };
            const payloadTooLong = { folder: { name: faker.lorem.text(33) } };
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
});
