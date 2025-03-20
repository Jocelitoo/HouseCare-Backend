import { Request, Response } from "express";
import { prisma } from "../client";

interface ScheduleBodyRequestProps {
  userId: string;
  name: string;
  email: string;
  phone: string;
  clinic: string;
  specialty: string;
  date: string;
  hour: string;
  price: number;
}

class ScheduleController {
  store = async (
    req: Request<{}, {}, ScheduleBodyRequestProps>,
    res: Response
  ) => {
    try {
      const {
        name,
        email,
        phone,
        clinic,
        specialty,
        date,
        hour,
        price,
        userId,
      } = req.body; // Pega os dados enviados no body da requisição

      // Verificar se o usuário que está fazendo a requisição existe
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        res.status(404).json({
          error: "Usuário não encontrado",
        });

        return;
      }

      // Validar dados
      const formErrorMsg: string[] = [];

      if (!name) formErrorMsg.push("O nome é obrigatório");
      if (!email) formErrorMsg.push("Um email é obrigatório");
      if (!phone) formErrorMsg.push("Um telefone é obrigatório");
      if (!clinic) formErrorMsg.push("Uma clínica é obrigatória");
      if (!specialty) formErrorMsg.push("Uma especialidade é obrigatória");
      if (!date) formErrorMsg.push("Uma data é obrigatória");
      if (!hour) formErrorMsg.push("Uma hora é obrigatória");
      if (!price) formErrorMsg.push("Um preço é obrigatório");

      if (formErrorMsg.length > 0) {
        res.status(409).json({
          errors: formErrorMsg,
        });

        return;
      }

      // Verificar se a clínica existe
      const clinicExist = await prisma.clinic.findUnique({
        where: { name: clinic },
      });

      if (!clinicExist) {
        res.status(404).json({
          error: "Clínica não encontrada",
        });

        return;
      }

      // Verificar se a especialidade existe
      const specialtyExist = await prisma.specialty.findUnique({
        where: { name: specialty },
      });

      if (!specialtyExist) {
        res.status(404).json({
          error: "Especialidade não encontrada",
        });

        return;
      }

      // Criar o item na bd
      await prisma.schedule.create({
        data: {
          name,
          email,
          phone,
          clinic,
          specialty,
          date,
          hour,
          price,
          user: { connect: { id: userId } },
        },
      });

      res.json({ message: "Consulta agendada com sucesso" });
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
      // Pegar todos os agendamentos
      const schedules = await prisma.schedule.findMany({
        orderBy: { createdAt: "desc" },
      });

      if (schedules.length === 0) {
        res.json({ message: "Nenhum agendamento encontrado" });
        return;
      }

      res.json(schedules);
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };

  showUserSchedules = async (
    req: Request<{}, {}, { userId: string }>,
    res: Response
  ) => {
    try {
      // Pegar os itens enviado no body da requisição
      const { userId } = req.body;

      // Verificar se o usuário que está fazendo a requisição existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { schedule: true },
      });

      if (!user) {
        res.status(404).json({
          error: "Usuário não encontrado",
        });

        return;
      }

      // Verificar se o usuário tem algum agendamento
      if (user.schedule.length === 0) {
        res.json({ message: "Nenhum agendamento encontrado" });
        return;
      }

      res.json(user.schedule);
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

      // Pegar o agendamento
      const schedule = await prisma.schedule.findUnique({ where: { id } });

      if (!schedule) {
        res.json({ message: "Nenhum agendamento encontrado" });
        return;
      }

      res.json(schedule);
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };

  update = async (
    req: Request<{ id: string }, {}, ScheduleBodyRequestProps>,
    res: Response
  ) => {
    try {
      // Pegar o id do agendamento enviado no parâmetro da requisição
      const { id } = req.params;

      // Verificar se o agendamento existe
      const schedule = await prisma.schedule.findUnique({ where: { id } });

      if (!schedule) {
        res.status(404).json({
          error: "Agendamento não encontrado",
        });

        return;
      }

      // Pegar os itens enviado no body da requisição
      const {
        name,
        email,
        phone,
        clinic,
        specialty,
        date,
        hour,
        price,
        userId,
      } = req.body; // Pega os dados enviados no body da requisição

      // Verificar se o usuário que está fazendo a requisição existe
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        res.status(404).json({
          error: "Usuário não encontrado",
        });

        return;
      }

      // Validar os dados
      const formErrorMsg: string[] = [];

      if (!name) formErrorMsg.push("O nome é obrigatório");
      if (!email) formErrorMsg.push("Um email é obrigatório");
      if (!phone) formErrorMsg.push("Um telefone é obrigatório");
      if (!clinic) formErrorMsg.push("Uma clínica é obrigatória");
      if (!specialty) formErrorMsg.push("Uma especialidade é obrigatória");
      if (!date) formErrorMsg.push("Uma data é obrigatória");
      if (!hour) formErrorMsg.push("Uma hora é obrigatória");
      if (!price) formErrorMsg.push("Um preço é obrigatório");

      if (formErrorMsg.length > 0) {
        res.status(409).json({
          errors: formErrorMsg,
        });

        return;
      }

      // Verificar se a clínica existe
      const clinicExist = await prisma.clinic.findUnique({
        where: { name: clinic },
      });

      if (!clinicExist) {
        res.status(404).json({
          error: "Clínica não encontrada",
        });

        return;
      }

      // Verificar se a especialidade existe
      const specialtyExist = await prisma.specialty.findUnique({
        where: { name: specialty },
      });

      if (!specialtyExist) {
        res.status(404).json({
          error: "Especialidade não encontrada",
        });

        return;
      }

      // Atualizar o agendamento
      await prisma.schedule.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          clinic,
          specialty,
          date,
          hour,
          price,
        },
      });

      res.json({ message: "Agendamento atualizado com sucesso" });
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

      // Verificar se o agendamento existe
      const schedule = await prisma.schedule.findUnique({ where: { id } });

      if (!schedule) {
        res.status(404).json({
          error: "Agendamento não encontrado",
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

      // Deletar o agendamento
      await prisma.schedule.delete({
        where: { id },
      });

      res.json({ message: "Agendamento deletado com sucesso" });
      return;
    } catch (error) {
      res.status(500).json({
        error: error,
      });

      return;
    }
  };
}

export const scheduleController = new ScheduleController();
