import { Request, Response } from "express";
const router = require("express").Router();
const { notificacoes, users } = require("../db-mock.ts");

router.get("/notificacoes", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Notificações encontradas",
    notificacoes,
  });
});

router.get("/notificacoes/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const notificacoesUser = notificacoes.filter(
    (n: any) => n.destinatario.id === id
  );

  if (notificacoesUser.length === 0) {
    return res
      .status(404)
      .json({ message: "Não há notificações para este usuário." });
  }

  res.status(200).json({
    message: "Notificações encontradas",
    notificacoesUser,
  });
});

router.post("/criar/notificacao/:id", (req: Request, res: Response) => {
  const { tipo } = req.body;
  const userId = req.params.id;
  const user = users.find((u: any) => u.id===userId);
  console.log("User",user)
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  const lastId = notificacoes.at(-1)?.id || 0;

  let newNotificacao: any;

  if (tipo === "AVALIACAO" && user.tipoUsuario === "ALUNO") {
    newNotificacao = {
      id: lastId + 1,
      titulo: "Avalie sua última monitoria",
      mensagem: "Avalie a monitoria de XXXX",
      tipo,
      status: "NAO_LIDA",
      dataEnvio: new Date(),
      destinatario: user,
      prioridade: "ALTA",
    };
  } else if (tipo === "CANCELAMENTO") {
    newNotificacao = {
      id: lastId + 1,
      titulo: "Monitoria cancelada",
      mensagem: "A monitoria foi cancelada devido a imprevistos.",
      tipo,
      status: "NAO_LIDA",
      dataEnvio: new Date(),
      destinatario: user,
      prioridade: "ALTA",
    };
  } else {
    return res.status(400).json({ message: "Tipo de notificação inválido" });
  }

  notificacoes.push(newNotificacao);
  console.log(newNotificacao)
  res.status(201).json({
    message: "Notificação criada.",
    notificacao: newNotificacao,
  });
});

module.exports = router;
