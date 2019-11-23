import faker from "faker";
import request from "supertest";
import { Application } from "../src/Application";
import { createJwt } from "../src/users/AuthorizeUserHandler";
import { CreateUserDto } from "../src/users/CreateUserDto";
import { UserRepository } from "../src/users/UserRepository";

describe("users", () => {
    const application = Application.build();
    const app = application.server;
    const config = application.config;
    const userRepo = new UserRepository(application.database);

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

    describe("GET /users/me", () => {
        let email;
        let password;
        let jwt: string;

        beforeAll(async () => {
            email = faker.internet.email(faker.random.word());
            password = faker.random.uuid();
            const createUserDto = new CreateUserDto(email, password);
            await userRepo.create(createUserDto);
            const user = await userRepo.findByEmail(email);

            if (!user) {
                throw new Error("No user found, something went terribly wrong.");
            }

            jwt = await createJwt(user.id, config.jwtSecret);
        });

        it("can get a user with a valid jwt", async (done: jest.DoneCallback) => {
            const response = await request(app)
                .get("/me")
                .set({
                    Authorization: `Bearer ${jwt}`,
                });
            expect(response.status).toBe(200);
            expect(response.body.resource.user).toBeDefined();
            expect(response.body.resource.user.email).toBeDefined();
            done();
        });

        it("fails getting a user without a valid jwt", async (done: jest.DoneCallback) => {
            const response = await request(app).get("/me");
            expect(response.status).toBe(401);
            expect(response.body.error).toBeDefined();
            done();
        });
    });
});
