import { Request, Response } from "express";
import { prisma } from "../client";

interface ClinicBodyRequestProps {
  name: string;
  address: string;
  mapUrl: string;
  userId: string;
}

class ClinicController {
  store = async (
    req: Request<{}, {}, ClinicBodyRequestProps>,
    res: Response
  ) => {
    try {
      const { name, address, mapUrl, userId } = req.body; // Pega os dados enviados no body da requisição

      // Verificar se o usuário que está fazendo a requisição existe
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        res.status(404).json({
          error: "Usuário não encontrado",
        });

        return;
      }

      // Validar name, address, mapUrl
      const formErrorMsg: string[] = [];

      if (!name) formErrorMsg.push("O nome é obrigatório");
      if (!address) formErrorMsg.push("O endereço é obrigatório");
      if (!mapUrl) formErrorMsg.push("O link para o mapa é obrigatório");

      if (formErrorMsg.length > 0) {
        res.status(409).json({
          errors: formErrorMsg,
        });

        return;
      }

      // Verificar se o name já está em uso
      const nameExist = await prisma.clinic.findUnique({ where: { name } });

      if (nameExist) {
        res.status(404).json({
          error: "Esse nome já está em uso",
        });

        return;
      }

      // Criar o item na bd
      await prisma.clinic.create({
        data: {
          name,
          address,
          mapUrl,
        },
      });

      res.json({ message: "Clínica criada com sucesso" });
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
      // Pegar todos as clínicas
      const specialtys = await prisma.clinic.findMany({
        orderBy: { createdAt: "desc" },
      });

      if (specialtys.length === 0) {
        res.json({ message: "Nenhuma clínica encontrada" });
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

      // Pegar a clínica
      const clinic = await prisma.clinic.findUnique({ where: { id } });

      if (!clinic) {
        res.json({ message: "Nenhuma clínica encontrada" });
        return;
      }

      res.json(clinic);
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };

  update = async (
    req: Request<{ id: string }, {}, ClinicBodyRequestProps>,
    res: Response
  ) => {
    try {
      // Pegar o id da clínica enviado no parâmetro da requisição
      const { id } = req.params;

      // Verificar se a clínica existe
      const specialty = await prisma.clinic.findUnique({ where: { id } });

      if (!specialty) {
        res.status(404).json({
          error: "Clínica não encontrada",
        });

        return;
      }

      // Pegar os itens enviado no body da requisição
      const { name, address, mapUrl, userId } = req.body;

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

      if (!name) formErrorMsg.push("O nome é obrigatório");
      if (!address) formErrorMsg.push("O endereço é obrigatório");
      if (!mapUrl) formErrorMsg.push("O link para o mapa é obrigatório");

      if (formErrorMsg.length > 0) {
        res.status(409).json({
          errors: formErrorMsg,
        });

        return;
      }

      // Atualizar a clinica
      await prisma.clinic.update({
        where: { id },
        data: {
          name,
          address,
          mapUrl,
        },
      });

      res.json({ message: "Clínica atualizada com sucesso" });
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
      // Pegar o id da clínica enviada no parâmetro da requisição
      const { id } = req.params;

      // Verificar se a clínica existe
      const clinic = await prisma.clinic.findUnique({ where: { id } });

      if (!clinic) {
        res.status(404).json({
          error: "Clínica não encontrada",
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

      // Deletar a clínica
      await prisma.clinic.delete({
        where: { id },
      });

      res.json({ message: "Clínica deletada com sucesso" });
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };
}

export const clinicController = new ClinicController();
