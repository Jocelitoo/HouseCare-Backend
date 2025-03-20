import { Router } from "express";
import { loginRequired } from "../middlewares/loginRequired";
import { scheduleController } from "../controllers/ScheduleController";

export const scheduleRoutes = Router();

scheduleRoutes.post("/", loginRequired, scheduleController.store);
scheduleRoutes.get("/", scheduleController.showAll);
scheduleRoutes.get("/", loginRequired, scheduleController.showUserSchedules);
scheduleRoutes.get("/:id", scheduleController.showOne);
scheduleRoutes.put("/:id", loginRequired, scheduleController.update);
scheduleRoutes.delete("/:id", loginRequired, scheduleController.delete);
