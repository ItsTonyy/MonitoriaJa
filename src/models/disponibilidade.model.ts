type Horario = string;

export interface Disponibilidade {
  seg: Horario[] | null;
  ter: Horario[] | null;
  qua: Horario[] | null;
  qui: Horario[] | null;
  sex: Horario[] | null;
  sab: Horario[] | null;
  dom: Horario[] | null;
}
