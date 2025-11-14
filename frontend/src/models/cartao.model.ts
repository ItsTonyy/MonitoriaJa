import { Usuario } from "./usuario.model";

export interface Cartao{
    id?: number;
    usuario?: Usuario | string; 
    numero?: string;
    titular?: string;
    validade?: string;
    cvv?: string;
    bandeira?: string;
    ultimosDigitos?: string;
}