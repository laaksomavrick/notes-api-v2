import faker from "faker";
import request from "supertest";
import { Application } from "../src/Application";

// TODO: clear database between runs

describe("users", () => {
    const application = Application.build();
    const app = application.server;

    afterAll(async () => {
        await application.database.truncate(["users"]);
    });

    describe("POST /users", () => {
        it("can create a user", async (done: jest.DoneCallback) => {
            const payload = { user: { email: faker.internet.email(), password: "qweqweqwe" } };
            const response = await request(app)
                .post("/users")
                .send(payload);
            expect(response.status).toBe(200);
            expect(response.body.resource.user).toBeDefined();
            done();
        });

        it("fails creating a user for a malformed request ", async (done: jest.DoneCallback) => {
            const payload = {};
            const response = await request(app)
                .post("/users")
                .send(payload);
            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            done();
        });

        it("fails creating a user for an invalid request ", async (done: jest.DoneCallback) => {
            const payload = { user: { email: faker.internet.email(), password: "q" } };
            const response = await request(app)
                .post("/users")
                .send(payload);
            expect(response.status).toBe(422);
            expect(response.body.error).toBeDefined();
            done();
        });

        it("fails creating a user when the user already exists", async (done: jest.DoneCallback) => {
            const payload = { user: { email: faker.internet.email(), password: "qweqweqwe" } };
            await request(app)
                .post("/users")
                .send(payload);
            const response = await request(app)
                .post("/users")
                .send(payload);
            expect(response.status).toBe(409);
            expect(response.body.error).toBeDefined();
            done();
        });
    });
});
