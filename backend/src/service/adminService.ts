import User from "../models/usuario.model";
async function AdminCheck(id: string) {
    try {
        if(!id){
            throw new Error("Insira o id");
        }
        const userFound = await User.findById(id);
        if (!userFound) {
            throw new Error("Acesso negado!");
        }
        return {message:"Acesso garantido"};

    } catch (error) {
        const err = error as Error;
        console.error("Erro ao verificar usuário por ID:", err.message);
        return null;
    }
}

export default AdminCheck ;