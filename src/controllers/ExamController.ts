import { Request, Response } from "express";
import { prisma } from "../client";

interface ExamRequestBody {
  imageUrl: string;
  name: string;
  description: string;
  price: number;
}

interface UpdateExameRequestBody {
  imageUrl: string;
  name: string;
  description: string;
  price: number;
  userId: string;
}

class ExamController {
  store = async (req: Request<{}, {}, ExamRequestBody>, res: Response) => {
    try {
      const { imageUrl, name, description, price } = req.body; // Pega os dados enviados no body da requisição

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
      await prisma.exam.create({
        data: {
          imageUrl,
          name,
          description,
          price,
        },
      });

      res.json({ message: "Exame criado com sucesso" });
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
      // Pegar todos os exames
      const exams = await prisma.exam.findMany({
        orderBy: { createdAt: "desc" },
      });

      if (exams.length === 0) {
        res.json({ message: "Nenhum exame encontrado" });
        return;
      }

      res.json(exams);
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

      // Pegar o exame
      const exam = await prisma.exam.findUnique({ where: { id } });

      if (!exam) {
        res.json({ message: "Nenhum exame encontrado" });
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
    req: Request<{ id: string }, {}, UpdateExameRequestBody>,
    res: Response
  ) => {
    try {
      // Pegar o examId enviado no parâmetro da requisição
      const { id } = req.params;

      // Verificar se o exame existe
      const exam = await prisma.exam.findUnique({ where: { id } });

      if (!exam) {
        res.status(404).json({
          error: "Exame não encontrado",
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

      // Atualizar o exame
      await prisma.exam.update({
        where: { id },
        data: {
          imageUrl,
          name,
          description,
          price,
        },
      });

      res.json({ message: "Exame atualizado com sucesso" });
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
      // Pegar o examId enviado no parâmetro da requisição
      const { id } = req.params;

      // Verificar se o exame existe
      const exam = await prisma.exam.findUnique({ where: { id } });

      if (!exam) {
        res.status(404).json({
          error: "Exame não encontrado",
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

      // Deletar o exame
      await prisma.exam.delete({
        where: { id },
      });

      res.json({ message: "Exame deletado com sucesso" });
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };
}

export const examController = new ExamController();
