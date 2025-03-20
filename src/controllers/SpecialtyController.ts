import { Request, Response } from "express";
import { prisma } from "../client";

interface SpecialtyRequestBodyProps {
  imageUrl: string;
  name: string;
  description: string;
  price: number;
  userId: string;
}

class SpecialtyController {
  store = async (
    req: Request<{}, {}, SpecialtyRequestBodyProps>,
    res: Response
  ) => {
    try {
      const { imageUrl, name, description, price, userId } = req.body; // Pega os dados enviados no body da requisição

      // Verificar se o usuário que está fazendo a requisição existe
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        res.status(404).json({
          error: "Usuário não encontrado",
        });

        return;
      }

      // Validar imageUrl, name, description, price
      const formErrorMsg: string[] = [];

      if (!imageUrl) formErrorMsg.push("A url da imagem é obrigatória");
      if (!name) formErrorMsg.push("O nome é obrigatório");
      if (!description) formErrorMsg.push("A descrição é obrigatória");
      if (!price) formErrorMsg.push("O preço é obrigatório");

      if (formErrorMsg.length > 0) {
        res.status(409).json({
          errors: formErrorMsg,
        });

        return;
      }

      // Criar o item na bd
      await prisma.specialty.create({
        data: {
          imageUrl,
          name,
          description,
          price,
        },
      });

      res.json({ message: "Especialidade criada com sucesso" });
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
      // Pegar todos as especialidade
      const specialtys = await prisma.specialty.findMany({
        orderBy: { createdAt: "desc" },
      });

      if (specialtys.length === 0) {
        res.json({ message: "Nenhuma especialidade encontrada" });
        return;
      }

      res.json(specialtys);
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };

  showOne = async (req: Request<{ id: string }>, res: Response) => {
    try {
      // Pegar o id enviado como parâmetro
      const { id } = req.params;

      // Pegar a especialidade
      const exam = await prisma.specialty.findUnique({ where: { id } });

      if (!exam) {
        res.json({ message: "Nenhuma especialidade encontrada" });
        return;
      }

      res.json(exam);
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };

  update = async (
    req: Request<{ id: string }, {}, SpecialtyRequestBodyProps>,
    res: Response
  ) => {
    try {
      // Pegar o id da especialidade enviado no parâmetro da requisição
      const { id } = req.params;

      // Verificar se a especialidade existe
      const specialty = await prisma.specialty.findUnique({ where: { id } });

      if (!specialty) {
        res.status(404).json({
          error: "Especialidade não encontrada",
        });

        return;
      }

      // Pegar os itens enviado no body da requisição
      const { imageUrl, name, description, price, userId } = req.body;

      // Verificar se o usuário que está fazendo a requisição existe
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        res.status(404).json({
          error: "Usuário não encontrado",
        });

        return;
      }

      // Verificar se os dados são válidos
      const formErrorMsg: string[] = [];

      if (!imageUrl) formErrorMsg.push("A url da imagem é obrigatória");
      if (!name) formErrorMsg.push("O nome é obrigatório");
      if (!description) formErrorMsg.push("A descrição é obrigatória");
      if (!price) formErrorMsg.push("O preço é obrigatório");

      if (formErrorMsg.length > 0) {
        res.status(409).json({
          errors: formErrorMsg,
        });

        return;
      }

      // Atualizar a especialidade
      await prisma.specialty.update({
        where: { id },
        data: {
          imageUrl,
          name,
          description,
          price,
        },
      });

      res.json({ message: "Especialidade atualizada com sucesso" });
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
      // Pegar o id da especialidade enviada no parâmetro da requisição
      const { id } = req.params;

      // Verificar se a especialidade existe
      const specialty = await prisma.specialty.findUnique({ where: { id } });

      if (!specialty) {
        res.status(404).json({
          error: "Especialidade não encontrada",
        });

        return;
      }

      // Pegar os itens enviado no body da requisição
      const { userId } = req.body;

      // Verificar se o usuário que está fazendo a requisição existe
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        res.status(404).json({
          error: "Usuário não encontrado",
        });

        return;
      }

      // Deletar a especialidade
      await prisma.specialty.delete({
        where: { id },
      });

      res.json({ message: "Especialidade deletada com sucesso" });
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };
}

export const specialtyController = new SpecialtyController();
