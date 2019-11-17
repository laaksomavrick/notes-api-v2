import faker from "faker";
import request from "supertest";
import { Application } from "../src/Application";
import { CreateUserDto } from "../src/users/CreateUserDto";
import { UserRepository } from "../src/users/UserRepository";

describe("auth", () => {
    const application = Application.build();
    const app = application.server;
    const userRepo = new UserRepository(application.database);

    let email: string;
    let password: string;

    beforeAll(async () => {
        email = faker.internet.email(faker.random.word());
        password = faker.random.uuid();
        const createUserDto = new CreateUserDto(email, password);
        await userRepo.create(createUserDto);
    });

    test("it can authorize a user", async (done: jest.DoneCallback) => {
        const payload = { auth: { email, password } };
        const response = await request(app)
            .post("/auth")
            .send(payload);
        expect(response.status).toBe(200);
        expect(response.body.resource.token).toBeDefined();
        done();
    });

    test("it rejects a malformed request", async (done: jest.DoneCallback) => {
        const payload = {};
        const response = await request(app)
            .post("/auth")
            .send(payload);
        expect(response.status).toBe(400);
        done();
    });

    test("it rejects an invalid request", async (done: jest.DoneCallback) => {
        const payload = { auth: { email: "foo", password: "bar" } };
        const response = await request(app)
            .post("/auth")
            .send(payload);
        expect(response.status).toBe(422);
        done();
    });

    test("it rejects when the user doesn't exist", async (done: jest.DoneCallback) => {
        const payload = { auth: { email: "something@gmail.com", password: "qweqweqwe" } };
        const response = await request(app)
            .post("/auth")
            .send(payload);
        expect(response.status).toBe(404);
        done();
    });

    // tslint:disable-next-line:max-line-length
    test("it rejects when the wrong password is provided", async (done: jest.DoneCallback) => {
        const payload = { auth: { email, password: "notqweqweqwe" } };
        const response = await request(app)
            .post("/auth")
            .send(payload);
        expect(response.status).toBe(403);
        done();
    });
});
