import { Request, Response } from "express";
import { isEmail } from "validator";
import { prisma } from "../client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface TokenRequestBodyParams {
  email: string;
  password: string;
}

class TokenController {
  create = async (
    req: Request<{}, {}, TokenRequestBodyParams>,
    res: Response
  ) => {
    try {
      // Pegar os dados enviados no body da requisição
      const { email, password } = req.body;

      // Validar email e password
      const formErrorMsg = [];

      if (!isEmail(email)) formErrorMsg.push("Email inválido");
      if (password.length < 6 || password.length > 20)
        formErrorMsg.push("Campo SENHA precisa ter entre 6 e 20 caracteres");

      if (formErrorMsg.length > 0) {
        res.status(409).json({
          error: formErrorMsg,
        });

        return;
      }

      // Verificar se existe algum usuário com o email enviado
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        res.status(401).json({
          error: ["Email ou senha incorreto"], // Por segurança, é importante não especificarmos se é o email que está errado ou o password
        });

        return;
      }

      // Verificar se o password está correto
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        res.status(401).json({
          error: ["Email ou senha incorreta"], // Por segurança, é importante não especificarmos se é o email que está errado ou o password
        });

        return;
      }

      // Gerar o token
      // Enviamos o user.id para que possamos identificar de qual usuário pertence o token através do id presente no token
      const token = jwt.sign(
        { id: user.id },
        process.env.TOKEN_SECRET as string,
        {
          expiresIn: 3 * 24 * 60 * 60, // 3 dias
        }
      );

      res.json({
        token,
      });

      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };
}

export const tokenController = new TokenController();
