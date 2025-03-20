import { Router } from "express";
import { specialtyController } from "../controllers/SpecialtyController";
import { loginRequired } from "../middlewares/loginRequired";

export const specialtyRoutes = Router();

specialtyRoutes.post("/", loginRequired, specialtyController.store);
specialtyRoutes.get("/", specialtyController.showAll);
specialtyRoutes.get("/:id", specialtyController.showOne);
specialtyRoutes.put("/:id", loginRequired, specialtyController.update);
specialtyRoutes.delete("/:id", loginRequired, specialtyController.delete);
