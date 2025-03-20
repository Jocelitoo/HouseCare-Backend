import { Router } from "express";
import { userRoutes } from "./userRoutes";
import { tokenRoutes } from "./tokenRoutes";
import { examRoutes } from "./examRoutes";
import { specialtyRoutes } from "./specialtyRoutes";
import { clinicRoutes } from "./clinicRoutes";
import { medicRoutes } from "./medicRoutes";
import { scheduleRoutes } from "./scheduleRoutes";

export const routes = Router();

routes.use("/users", userRoutes); // Se na URL da requisição houver '/users', será usado as rotas de userRoutes
routes.use("/tokens", tokenRoutes); // Se na URL da requisição houver '/tokens', será usado as rotas de tokenRoutes
routes.use("/exams", examRoutes); // Se na URL da requisição houver '/exams', será usado as rotas de examRoutes
routes.use("/specialtys", specialtyRoutes); // Se na URL da requisição houver '/specialtys', será usado as rotas de specialtyRoutes
routes.use("/clinics", clinicRoutes); // Se na URL da requisição houver '/clinics', será usado as rotas de clinicRoutes
routes.use("/medics", medicRoutes); // Se na URL da requisição houver '/medics', será usado as rotas de medicRoutes
routes.use("/schedules", scheduleRoutes); // Se na URL da requisição houver '/schedules', será usado as rotas de scheduleRoutes
