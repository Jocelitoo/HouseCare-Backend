import { Router } from "express";
import { userController } from "../controllers/UserController";
import { loginRequired } from "../middlewares/loginRequired";

export const userRoutes = Router();

userRoutes.post("/", userController.store);
userRoutes.get("/", userController.showAll);
userRoutes.get("/logged", loginRequired, userController.showLoggedUser);
userRoutes.get("/:id", userController.showOne);
userRoutes.put("/", loginRequired, userController.update);
userRoutes.delete("/:id", loginRequired, userController.delete);
