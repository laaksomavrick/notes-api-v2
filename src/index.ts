import bodyParser from "body-parser";
import cors from "cors";
import express, { Router } from "express";
import { Database } from "./database";
import { helloWorldHandler } from "./handlers";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const router = Router();
router.get("*", helloWorldHandler);

app.use(router);

const database = new Database({
    database: "notes",
    host: "localhost",
    port: 5432,
    user: "postgres",
});

(async (): Promise<void> => {
  await database.init();
  app.listen(3000, () => {
    console.log("app listening on 3000");
  });
})();
