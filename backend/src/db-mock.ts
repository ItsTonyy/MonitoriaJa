import { Aluno, Admin } from "./models/usuario.model";
import { Notificacao } from "./models/notificacao.model";
import { Monitor } from "./models/monitor.model"
import { Cartao } from "./models/cartao.model";

export const users: (Aluno | Admin)[] = [
    {id:"1", nome: "Luciano", email:"user@teste.com",password:"123456",telefone:"99999999999",foto:"/usr/foto", tipoUsuario: 'ALUNO'},
    {id:"2", nome: "Admin", email:"admin@teste.com",password:"admin123",telefone:"88888888888",foto:"/usr/admin", tipoUsuario: 'ADMIN'},
]

export const monitores: Monitor[] = [
    {id:"3", nome: "Monitor", email:"monitor@teste.com",password:"123456",telefone:"77777777777"}
]

export const cartoes:Cartao[] =[
    {id: 1, numero: "1234567812345678", titular: "Luciano", validade: "10/10/2026", cvv: "123", bandeira: "Visa"}
]

export const notificacoes: Notificacao[] = [
    {
        id: 1,
        titulo: "Monitoria de Cálculo Agendada",
        mensagem: "Sua monitoria de Cálculo I foi agendada para 15/11/2025 às 14h",
        tipo: "AGENDAMENTO",
        status: "NAO_LIDA",
        dataEnvio: new Date("2025-10-28T10:00:00"),
        destinatario: users[0],
        remetente: "users[1]",
        prioridade: "ALTA"
    },
    {
        id: 2,
        titulo: "Avalie sua última monitoria",
        mensagem: "Avalie a monitoria de Programação Web que você participou",
        tipo: "AVALIACAO",
        status: "NAO_LIDA",
        dataEnvio: new Date("2025-10-27T16:30:00"),
        destinatario: users[0],
        prioridade: "MEDIA"
    },
    {
        id: 3,
        titulo: "Monitoria Cancelada",
        mensagem: "A monitoria de Estrutura de Dados foi cancelada devido a imprevistos",
        tipo: "CANCELAMENTO",
        status: "LIDA",
        dataEnvio: new Date("2025-10-26T09:15:00"),
        dataLeitura: new Date("2025-10-26T10:00:00"),
        destinatario: users[0],
        remetente: "users[1]",
        prioridade: "ALTA"
    },
    {
        id: 4,
        titulo: "Monitoria Remarcada",
        mensagem: "Sua monitoria foi remarcada para 20/11/2025 às 16h",
        tipo: "REAGENDAMENTO",
        status: "LIDA",
        dataEnvio: new Date("2025-10-25T14:20:00"),
        dataLeitura: new Date("2025-10-25T15:00:00"),
        destinatario: users[0],
        remetente: "users[1]",
        prioridade: "MEDIA"
    },
    {
        id: 5,
        titulo: "Manutenção do Sistema",
        mensagem: "O sistema passará por manutenção no dia 30/10/2025 das 2h às 4h",
        tipo: "SISTEMA",
        status: "ARQUIVADA",
        dataEnvio: new Date("2025-10-20T08:00:00"),
        dataLeitura: new Date("2025-10-20T09:30:00"),
        destinatario: users[0],
        prioridade: "BAIXA"
    }
]