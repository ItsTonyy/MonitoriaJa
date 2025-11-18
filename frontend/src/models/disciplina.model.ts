import { Usuario } from "./usuario.model";

export interface Disciplina{
    id?: number;
    nome?: string;
    listaMonitores?: (Usuario | string)[];

}