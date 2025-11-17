import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
const router = require("express").Router()
import User from "../models/usuario.model"
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", async (req: Request,res: Response, next: NextFunction)=>{
    const {email, password}: {email: string, password:string} = req.body
    const userFound = await User.findOne({email: email});
    if(!userFound){
        return res.status(401).json({message:"Erro ao logar."});;
    }
    const senhaComparada = await bcrypt.compare(password, userFound.password);
    if(!senhaComparada){
        return res.status(401).json({message:"Erro ao logar."});;
    }
    const payload = {
        id: userFound._id,
        role: userFound.tipoUsuario
    }
    const token = jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '24h'});
    res.status(200).json({message:token});
});


async function adminCheck(req: Request, res: Response, next: NextFunction){
 try{
        const id = req.id;
        if(!id){
            throw new Error("Insira o id.");
        }
        const check = await User.findById(id);
        if(!check){
            return res.status(404).json({message:"Acesso negado."});
        }
        return res.status(200).json({message:"Acesso permitido."});
        }catch(error){
        throw new Error("Acesso negado!");
    }
}
export default router;