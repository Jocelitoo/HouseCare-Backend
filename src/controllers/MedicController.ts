import { Request, Response } from "express";
import { prisma } from "../client";

interface MedicBodyRequestProps {
  imageUrl: string;
  name: string;
  specialty: string;
  crm: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

class MedicController {
  store = async (
    req: Request<{}, {}, MedicBodyRequestProps>,
    res: Response
  ) => {
    try {
      const { imageUrl, name, specialty, crm, userId } = req.body; // Pega os dados enviados no body da requisição

      // Verificar se o usuário que está fazendo a requisição existe
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        res.status(404).json({
          error: "Usuário não encontrado",
        });

        return;
      }

      // Verificar se o crm já está sendo usado
      const crmExist = await prisma.medic.findUnique({ where: { crm } });

      if (crmExist) {
        res.status(409).json({
          error: "Esse crm já está em uso",
        });

        return;
      }

      // Validar imageUrl,name,specialty,crm
      const formErrorMsg: string[] = [];

      if (!imageUrl) formErrorMsg.push("Uma imagem é obrigatória");
      if (!name) formErrorMsg.push("O nome é obrigatório");
      if (!specialty) formErrorMsg.push("Uma especialidade é obrigatória");
      if (!crm) formErrorMsg.push("O crm é obrigatório");

      if (formErrorMsg.length > 0) {
        res.status(409).json({
          errors: formErrorMsg,
        });

        return;
      }

      // Criar o item na bd
      await prisma.medic.create({
        data: {
          imageUrl,
          name,
          specialty,
          crm,
        },
      });

      res.json({ message: "Médico criado com sucesso" });
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
      // Pegar todos os médicos
      const medics = await prisma.medic.findMany({
        orderBy: { createdAt: "desc" },
      });

      if (medics.length === 0) {
        res.json({ message: "Nenhum médico encontrado" });
        return;
      }

      res.json(medics);
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

      // Pegar o médico
      const medic = await prisma.medic.findUnique({ where: { id } });

      if (!medic) {
        res.json({ message: "Nenhum médico encontrado" });
        return;
      }

      res.json(medic);
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };

  update = async (
    req: Request<{ id: string }, {}, MedicBodyRequestProps>,
    res: Response
  ) => {
    try {
      // Pegar o id do médico enviado no parâmetro da requisição
      const { id } = req.params;

      // Verificar se o médico existe
      const medic = await prisma.medic.findUnique({ where: { id } });

      if (!medic) {
        res.status(404).json({
          error: "Médico não encontrado",
        });

        return;
      }

      // Pegar os itens enviado no body da requisição
      const { name, imageUrl, crm, specialty, userId } = req.body;

      // Verificar se o usuário que está fazendo a requisição existe
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        res.status(404).json({
          error: "Usuário não encontrado",
        });

        return;
      }

      // Verificar se o crm já está sendo usado por outro usuário
      const crmExist = await prisma.medic.findUnique({ where: { crm } });

      if (crmExist?.id !== id) {
        res.status(409).json({
          error: "Esse crm já está em uso",
        });

        return;
      }

      // Validar imageUrl,name,specialty,crm
      const formErrorMsg: string[] = [];

      if (!imageUrl) formErrorMsg.push("Uma imagem é obrigatória");
      if (!name) formErrorMsg.push("O nome é obrigatório");
      if (!specialty) formErrorMsg.push("Uma especialidade é obrigatória");
      if (!crm) formErrorMsg.push("O crm é obrigatório");

      if (formErrorMsg.length > 0) {
        res.status(409).json({
          errors: formErrorMsg,
        });

        return;
      }

      // Atualizar o médico
      await prisma.medic.update({
        where: { id },
        data: {
          imageUrl,
          name,
          specialty,
          crm,
        },
      });

      res.json({ message: "Médico atualizado com sucesso" });
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
      // Pegar o id do médico enviada no parâmetro da requisição
      const { id } = req.params;

      // Verificar se o médico existe
      const medic = await prisma.medic.findUnique({ where: { id } });

      if (!medic) {
        res.status(404).json({
          error: "Médico não encontrado",
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

      // Deletar o médico
      await prisma.medic.delete({
        where: { id },
      });

      res.json({ message: "Médico deletado com sucesso" });
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };
}

export const medicController = new MedicController();
