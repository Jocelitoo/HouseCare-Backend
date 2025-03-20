import { Request, Response } from "express";
import { isEmail } from "validator";
import { prisma } from "../client";
import bcrypt from "bcryptjs";

interface UserRequestBody {
  name: string;
  email: string;
  password: string;
}

class UserController {
  store = async (req: Request<{}, {}, UserRequestBody>, res: Response) => {
    try {
      const { name, email, password } = req.body; // Pega os dados enviados no body da requisição

      // Validar name, email e password
      const formErrorMsg: string[] = [];

      if (name.length < 2 || name.length > 15)
        formErrorMsg.push("Campo NOME precisa ter entre 2 e 15 caracteres");
      if (!isEmail(email)) formErrorMsg.push("Email inválido");
      if (password.length < 6 || password.length > 20)
        formErrorMsg.push("Campo Senha precisa ter entre 6 e 20 caracteres");

      if (formErrorMsg.length > 0) {
        res.status(409).json({
          errors: formErrorMsg,
        });

        return;
      }

      // Verificar se o name já existe na base de dados
      const nameExists = await prisma.user.findUnique({
        where: { name: name },
      });

      if (nameExists) {
        res.status(409).json({
          error: "Esse Nome já está em uso",
        });

        return;
      }

      // Verificar se o email já existe na base de dados
      const emailExists = await prisma.user.findUnique({
        where: { email: email },
      });

      if (emailExists) {
        res.status(409).json({
          error: "Esse EMAIL já está em uso",
        });

        return;
      }

      // Criptografar password
      const passwordHash = await bcrypt.hash(password, 8); // passwordHash ira receber o password  no formato "decodificado". Não utilize um valor de salt tão alto pra n gastar muito poder de processamento do servidor, prefira entre 8 e 10

      // Criar o usuário
      await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: passwordHash,
        },
      });

      res.json({ message: "Usuário criado com sucesso" });
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };

  showAll = async (req: Request, res: Response) => {
    try {
      // Pegar todos os usuários
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true },
        orderBy: { createdAt: "desc" },
      });

      if (users.length === 0) {
        res.json({ message: "Nenhum usuário encontrado" });
        return;
      }

      res.json(users);
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };

  showOne = async (req: Request<{ id: string }, {}, {}>, res: Response) => {
    try {
      // Pegar o id enviado como parâmetro
      const { id } = req.params;

      // Pegar o usuário
      const user = await prisma.user.findUnique({
        where: { id: id },
        select: { id: true, name: true, email: true },
      });

      if (!user) {
        res.json({ message: "Nenhum usuário encontrado" });
        return;
      }

      res.json(user);
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };

  showLoggedUser = async (
    req: Request<{}, {}, { userId: string }>,
    res: Response
  ) => {
    try {
      // Pegar o id enviado no body da requisição
      const { userId } = req.body;

      // Pegar o usuário
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      });

      if (!user) {
        res.json({ message: "Nenhum usuário encontrado" });
        return;
      }

      res.json(user);
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };

  update = async (
    req: Request<{}, {}, { name: string; userId: string }>,
    res: Response
  ) => {
    try {
      const { name, userId } = req.body; // Pegar o name enviado no body

      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({
          error: "Usuário não encontrado",
        });

        return;
      }

      // Verificar se o name é válido
      if (name.length < 2 || name.length > 15) {
        res.status(409).json({
          error: "Campo NOME precisa ter entre 2 e 15 caracteres",
        });

        return;
      }

      const nameExist = await prisma.user.findUnique({
        where: { name: name },
      });

      if (nameExist) {
        res.status(409).json({
          error: "Esse nome já está em uso",
        });

        return;
      }

      // Atualizar o usuário
      await prisma.user.update({
        where: { id: userId },
        data: { name: name },
      });

      res.json({ message: "Usuário atualizado com sucesso" });
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };

  delete = async (
    req: Request<{ id: string }, {}, { userId: string }>,
    res: Response
  ) => {
    try {
      // Pegar o id enviado no parâmetro da requisição
      const { id } = req.params;

      // Verificar se o usuário à ser deletado existe
      const userToDelete = await prisma.user.findUnique({
        where: { id },
      });

      if (!userToDelete) {
        res.status(404).json({
          error: "Usuário não encontrado",
        });

        return;
      }

      // Pegar o userId enviado pelo middleware loginRequired
      const { userId } = req.body;

      // Verificar se o usuário que fez o request existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({
          error: "Usuário não encontrado",
        });

        return;
      }

      // Deletar o usuário
      await prisma.user.delete({ where: { id } });

      res.json({ message: "Usuário deletado com sucesso" });
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };
}

export const userController = new UserController();
