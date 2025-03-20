import { Router } from "express";
import { examController } from "../controllers/ExamController";
import { loginRequired } from "../middlewares/loginRequired";

export const examRoutes = Router();

examRoutes.post("/", examController.store);
examRoutes.get("/", examController.showAll);
examRoutes.get("/:id", examController.showOne);
examRoutes.put("/:id", loginRequired, examController.update);
examRoutes.delete("/:id", loginRequired, examController.delete);
