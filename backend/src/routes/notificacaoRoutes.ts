import dotenv from "dotenv";
dotenv.config({quiet: true});
import express from "express";
import Notificacao from "../models/notificacao.model";
import jwt from "jsonwebtoken";
import autenticar from "../middleware/auth";
import adminAuth from "../middleware/adminAuth";
const router = express.Router();
// CREATE - Adiciona uma nova notificação
router.post("/", autenticar, async (req, res) => {
  const notificacao = req.body;

  try {
    await Notificacao.create(notificacao);
    res.status(201).json({ message: "Notificação criada com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// READ ALL - Lista todas as notificações (com destinatario e agendamento populados)
router.get("/",adminAuth, async (req, res) => {
  try {
    const notificacoes = await Notificacao.find()
      .populate("destinatario")
      .populate("agendamento");
    res.status(200).json(notificacoes);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// READ ONE - Busca notificação por id (com destinatario e agendamento populados)
router.get("/user", autenticar, async (req, res) => {
  const id = req.headers.authorization?.split(" ")[1];
  try {
    const notificacao = await Notificacao.findOne({ _id: id })
      .populate("destinatario")
      .populate("agendamento");

    if (!notificacao) {
      res.status(404).json({ message: "Notificação não encontrada!" });
      return;
    }

    res.status(200).json(notificacao);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// UPDATE - Atualiza notificação por id
router.put("/update", autenticar, async (req, res) => {
  const id = req.headers.authorization?.split(" ")[1];
  const update = req.body;

  try {
    const updatedNotificacao = await Notificacao.updateOne({ _id: id }, update);

    if (updatedNotificacao.matchedCount === 0) {
      res.status(404).json({ message: "Notificação não encontrada!" });
      return;
    }

    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// PATCH - Marca notificação como lida
router.patch("/:id/marcar-lida", autenticar, async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if(!token){
      return res.status(401).json({message:"Token de autenticação ausente."});
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as { id: string; role: string };
    
    const notificacao = await Notificacao.findById(id);

    if (!notificacao) {
      res.status(404).json({ message: "Notificação não encontrada!" });
      return;
    }

    if(notificacao.destinatario.toString() !== decoded.id){
      return res.status(403).json({message:"Você não tem permissão para marcar esta notificação como lida."});
    }

    const updatedNotificacao = await Notificacao.findByIdAndUpdate(
      id,
      { status: 'LIDA', dataLeitura: new Date() },
      { new: true }
    ).populate({
      path: "agendamento",
      populate: [
        { path: "monitor", select: "nome email telefone" },
        { path: "aluno", select: "nome email telefone" }
      ]
    });

    const notificacaoFormatada = {
      id: (updatedNotificacao as any)?._id.toString(),
      titulo: updatedNotificacao?.titulo,
      mensagem: updatedNotificacao?.mensagem,
      tipo: updatedNotificacao?.tipo,
      status: 'LIDA',
      dataEnvio: updatedNotificacao?.dataEnvio,
      dataLeitura: updatedNotificacao?.dataLeitura,
      destinatario: updatedNotificacao?.destinatario,
      agendamento: updatedNotificacao?.agendamento ? {
        id: (updatedNotificacao.agendamento as any)._id?.toString(),
        monitor: (updatedNotificacao.agendamento as any).monitor,
        aluno: (updatedNotificacao.agendamento as any).aluno,
        servico: (updatedNotificacao.agendamento as any).servico,
        data: (updatedNotificacao.agendamento as any).data,
        hora: (updatedNotificacao.agendamento as any).hora,
        duracao: (updatedNotificacao.agendamento as any).duracao,
        link: (updatedNotificacao.agendamento as any).link,
        status: (updatedNotificacao.agendamento as any).status,
        valor: (updatedNotificacao.agendamento as any).valor,
        formaPagamento: (updatedNotificacao.agendamento as any).formaPagamento,
        statusPagamento: (updatedNotificacao.agendamento as any).statusPagamento,
        topicos: (updatedNotificacao.agendamento as any).topicos,
        motivoCancelamento: (updatedNotificacao.agendamento as any).motivoCancelamento
      } : null,
      prioridade: updatedNotificacao?.prioridade,
      lida: true
    };

    res.status(200).json(notificacaoFormatada);
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    res.status(500).json({ erro: error });
  }
});

// DELETE - Remove notificação por id
router.delete("/delete", adminAuth, async (req, res) => {
  const id = req.headers.authorization?.split(" ")[1];

  const notificacao = await Notificacao.findOne({ _id: id });

  if (!notificacao) {
    res.status(404).json({ message: "Notificação não encontrada!" });
    return;
  }

  try {
    await Notificacao.deleteOne({ _id: id });
    res.status(200).json({ message: "Notificação removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// GET - Todas as notificações de um destinatário específico
router.get("/destinatario/", autenticar, async (req, res) => {
  const destinatarioId = req.headers.authorization?.split(" ")[1];
  if(!destinatarioId){
    return res.status(401).json({message:"Token de autenticação ausente."});
  }

  const decoded = jwt.verify(destinatarioId, process.env.JWT_KEY as string) as { id: string; role: string }
  try {
    const notificacoes = await Notificacao.find({ destinatario: decoded.id })
      .populate("destinatario")
      .populate({
        path: "agendamento",
        populate: [
          { path: "monitor", select: "nome email telefone" },
          { path: "aluno", select: "nome email telefone" }
        ]
      });
    
    const notificacoesFormatadas = notificacoes.map((n: any) => ({
      id: n._id.toString(),
      titulo: n.titulo,
      mensagem: n.mensagem,
      tipo: n.tipo,
      status: n.status,
      dataEnvio: n.dataEnvio,
      dataLeitura: n.dataLeitura,
      destinatario: n.destinatario,
      agendamento: n.agendamento ? {
        id: n.agendamento._id?.toString(),
        monitor: n.agendamento.monitor,
        aluno: n.agendamento.aluno,
        servico: n.agendamento.servico,
        data: n.agendamento.data,
        hora: n.agendamento.hora,
        duracao: n.agendamento.duracao,
        link: n.agendamento.link,
        status: n.agendamento.status,
        valor: n.agendamento.valor,
        formaPagamento: n.agendamento.formaPagamento,
        statusPagamento: n.agendamento.statusPagamento,
        topicos: n.agendamento.topicos,
        motivoCancelamento: n.agendamento.motivoCancelamento
      } : null,
      prioridade: n.prioridade,
      lida: n.status === 'LIDA'
    }));
    
    res.status(200).json(notificacoesFormatadas);
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    res.status(500).json({ erro: error });
  }
});

export default router;