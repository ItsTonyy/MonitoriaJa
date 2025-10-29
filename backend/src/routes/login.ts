import { Request, Response, NextFunction } from "express";
const router = require("express").Router()
const {users} = require("../db-mock")

router.post("/login",(req: Request,res: Response, next: NextFunction)=>{
    const {email, password}: {email: string, password:string} = req.body
    const user = users.find((u:any ) => u.email === email && u.password === password);
    if(!user){
        res.status(401).json({message:"Erro ao logar."});
    }
    res.status(200).json({message:user});
});

module.exports = router;