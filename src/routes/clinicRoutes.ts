import { Router } from "express";
import { loginRequired } from "../middlewares/loginRequired";
import { clinicController } from "../controllers/ClinicController";

export const clinicRoutes = Router();

clinicRoutes.post("/", loginRequired, clinicController.store);
clinicRoutes.get("/", clinicController.showAll);
clinicRoutes.get("/:id", clinicController.showOne);
clinicRoutes.put("/:id", loginRequired, clinicController.update);
clinicRoutes.delete("/:id", loginRequired, clinicController.delete);
