import { Usuario } from "./usuario.model";

export interface Disciplina{
    _id?: string;
    nome?: string;
    listaMonitores?: (Usuario | string)[];

}