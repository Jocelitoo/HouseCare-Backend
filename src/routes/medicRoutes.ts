import { Router } from "express";
import { loginRequired } from "../middlewares/loginRequired";
import { medicController } from "../controllers/MedicController";

export const medicRoutes = Router();

medicRoutes.post("/", loginRequired, medicController.store);
medicRoutes.get("/", medicController.showAll);
medicRoutes.get("/:id", medicController.showOne);
medicRoutes.put("/:id", loginRequired, medicController.update);
medicRoutes.delete("/:id", loginRequired, medicController.delete);
