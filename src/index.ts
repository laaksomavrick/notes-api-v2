import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response, Router } from "express";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const router = Router();
router.get("*", (req: Request, res: Response) => {
    res.json({ hello: "world" });
});

app.use(router);

app.listen(3000, () => {
    console.log("app listening on 3000");
});
