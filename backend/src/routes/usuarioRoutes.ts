import express from "express";
import Usuario from "../models/usuario.model";
import bcrypt from "bcrypt";
import autenticar from "../middleware/auth";
import ownerOrAdminAuth from "../middleware/ownerOrAdminAuth";
import autenticarAdmin from "../middleware/adminAuth";
const router = express.Router();

// CREATE - Adiciona um novo usuário
router.post("/", async (req, res) => {
  const usuario = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(usuario.password, salt);
    usuario.password = hash;
    await Usuario.create({ ...usuario, isAtivo: true });
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// GET todos os usuários ativos (com nomes das disciplinas ministradas)
router.get("/", autenticarAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find({ isAtivo: true }).populate({
      path: "listaDisciplinas",
      select: "nome -_id",
    });

    const usuariosFormatados = usuarios.map((u) => ({
      ...u.toObject(),
      listaDisciplinas: u.listaDisciplinas
        ? u.listaDisciplinas.map((d: any) => d.nome)
        : [],
    }));

    res.status(200).json(usuariosFormatados);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// GET usuários ativos filtrando por tipoUsuario (ex: /usuario/tipo/MONITOR)
router.get("/tipo/:tipoUsuario", async (req, res) => {
  const tipoUsuario = req.params.tipoUsuario.toUpperCase();
  try {
    const usuarios = await Usuario.find({
      isAtivo: true,
      tipoUsuario,
    }).populate({
      path: "listaDisciplinas",
      select: "nome -_id",
    });

    const usuariosFormatados = usuarios.map((u) => ({
      ...u.toObject(),
      listaDisciplinas: u.listaDisciplinas
        ? u.listaDisciplinas.map((d: any) => d.nome)
        : [],
    }));

    res.status(200).json(usuariosFormatados);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// GET usuário ativo por id (com nomes das disciplinas ministradas)
router.get("/:id", autenticar, ownerOrAdminAuth, async (req, res) => {
  const id = req.params.id;
  try {
    const usuario = await Usuario.findOne({ _id: id, isAtivo: true }).populate({
      path: "listaDisciplinas",
      select: "nome -_id",
    });
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }
    const usuarioFormatado = {
      ...usuario.toObject(),
      listaDisciplinas: usuario.listaDisciplinas
        ? usuario.listaDisciplinas.map((d: any) => d.nome)
        : [],
    };
    res.status(200).json(usuarioFormatado);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// UPDATE - Atualiza usuário ativo por id
router.patch("/:id", autenticar, ownerOrAdminAuth, async (req, res) => {
  const id = req.params.id;
  const usuario = req.body;
  try {
    const updatedUsuario = await Usuario.updateOne(
      { _id: id, isAtivo: true },
      usuario
    );

    if (updatedUsuario.matchedCount === 0) {
      res.status(404).json({ message: "Usuário não encontrado!" });
      return;
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// DELETE - Exclusão lógica: marca isAtivo como false
router.delete("/:id", autenticarAdmin, async (req, res) => {
  const id = req.params.id;

  const usuario = await Usuario.findOne({ _id: id, isAtivo: true });

  if (!usuario) {
    res.status(404).json({ message: "Usuário não encontrado!" });
    return;
  }

  try {
    await Usuario.updateOne({ _id: id }, { isAtivo: false });
    res.status(200).json({ message: "Usuário excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// Adiciona uma disciplina à listaDisciplinas do usuário ativo
router.post("/disciplina", autenticar, ownerOrAdminAuth, async (req, res) => {
  const { usuarioId, disciplinaId } = req.body;
  try {
    const usuario = await Usuario.findOneAndUpdate(
      { _id: usuarioId, isAtivo: true },
      { $addToSet: { listaDisciplinas: disciplinaId } },
      { new: true }
    );
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }
    res.status(200).json({ message: "Disciplina adicionada ao usuário!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// Remove uma disciplina da listaDisciplinas do usuário ativo
router.delete("/disciplina", autenticar, ownerOrAdminAuth, async (req, res) => {
  const { usuarioId, disciplinaId } = req.body;
  try {
    const usuario = await Usuario.findOneAndUpdate(
      { _id: usuarioId, isAtivo: true },
      { $pull: { listaDisciplinas: disciplinaId } },
      { new: true }
    );
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }
    res.status(200).json({ message: "Disciplina removida do usuário!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// Rota específica para alteração de senha
router.patch("/:id/alterar-senha", autenticar, ownerOrAdminAuth, async (req, res) => {
  const id = req.params.id;
  const { senhaAnterior, novaSenha } = req.body;

  console.log('🔍 BACKEND - ID recebido:', id); // ✅ Debug
  console.log('🔍 BACKEND - Corpo recebido:', { senhaAnterior: !!senhaAnterior, novaSenha: !!novaSenha }); // ✅ Debug

  try {
    // ✅ Validações obrigatórias
    if (!senhaAnterior || !novaSenha) {
      return res.status(400).json({ message: "Senha anterior e nova senha são obrigatórias!" });
    }

    // Buscar usuário
    const usuario = await Usuario.findOne({ _id: id, isAtivo: true });
    
    console.log('🔍 BACKEND - Usuário encontrado:', usuario ? 'Sim' : 'Não'); // ✅ Debug
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // ✅ VERIFICAR SE A SENHA EXISTE NO USUÁRIO
    if (!usuario.password) {
      return res.status(400).json({ message: "Usuário não possui senha definida!" });
    }

    // ✅ VERIFICAR SENHA ANTERIOR
    const isSenhaAnteriorCorreta = await bcrypt.compare(senhaAnterior, usuario.password);
    if (!isSenhaAnteriorCorreta) {
      return res.status(400).json({ message: "Senha anterior incorreta!" });
    }

    // Gerar hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const hashNovaSenha = await bcrypt.hash(novaSenha, salt);

    // Atualizar senha
    await Usuario.updateOne(
      { _id: id, isAtivo: true },
      { password: hashNovaSenha }
    );

    res.status(200).json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Rota ESPECIAL para admin alterar senha de qualquer usuário (sem verificação de senha anterior)
router.patch("/:id/alterar-senha-admin", autenticarAdmin, async (req, res) => {
  const id = req.params.id;
  const { novaSenha } = req.body;

  try {
    // ✅ Apenas validação básica para admin
    if (!novaSenha) {
      return res.status(400).json({ message: "Nova senha é obrigatória!" });
    }

    // Buscar usuário
    const usuario = await Usuario.findOne({ _id: id, isAtivo: true });
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // Gerar hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const hashNovaSenha = await bcrypt.hash(novaSenha, salt);

    // Atualizar senha
    await Usuario.updateOne(
      { _id: id, isAtivo: true },
      { password: hashNovaSenha }
    );

    res.status(200).json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

export default router;