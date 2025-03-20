import { NextFunction, Request, Response } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { prisma } from "../client";

export const loginRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Pega o authorization enviado no headers da requisição que é 'Bearer token'
    const { authorization } = req.headers;

    if (!authorization) {
      res.status(401).json({
        error: ["Login required"],
      });

      return;
    }

    const [text, token] = authorization.split(" "); // Separa o 'Bearer' do 'token'

    // Decodificar o token
    const data = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as JwtPayload;

    // Pegar os dados do usuário contidos no token
    const id: string = data.id;

    // Verificar se existe algum usuário com o mesmo id e email contidos no token
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      res.status(404).json({
        error: ["Token inválido"],
      });

      return;
    }

    // Enviar os dados para a função que vai ser executada dps do middleware
    req.body.userId = id;

    next(); // Responsável por permitir que a função que vem dps da middleware seja executada
    return;
  } catch (error) {
    res.status(500).json({
      error: error,
    });

    return;
  }
};
