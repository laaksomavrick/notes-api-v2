// tslint:disable:object-literal-sort-keys

import convict from "convict";

export default convict({
    env: {
        doc: "",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV",
    },
    host: {
        doc: "The IP address to bind.",
        format: "ipaddress",
        default: "127.0.0.1",
        env: "HOST",
    },
    port: {
        doc: "The port to bind.",
        format: "port",
        default: 3000,
        env: "PORT",
    },
    database: {
        host: {
            default: "localhost",
            env: "DB_HOST",
        },
        port: {
            default: 5432,
            env: "DB_PORT",
        },
        username: {
            default: "postgres",
            env: "DB_USERNAME",
        },
        password: {
            default: null,
            env: "DB_PASSWORD",
        },
        schema: {
            default: "notes",
            env: "DB_SCHEMA",
        },
    },
    secret: {
        jwt: {
            default: "aaaaaaaaaaaaaaaa", // TODO read from file
            env: "SECRET_JWT",
        },
        bcrypt: {
            default: "aaaaaaaaaaaaaaaa", // TODO read from file
            env: "SECRET_BCRYPT",
        },
    },
});
