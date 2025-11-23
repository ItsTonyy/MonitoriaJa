// utils/disciplinaUtils.ts

/**
 * Busca os IDs das disciplinas pelo nome
 * @param nomesDisciplinas - Array com nomes das disciplinas
 * @returns Array com IDs das disciplinas
 */
export const buscarIdsDisciplinas = async (nomesDisciplinas: string[]): Promise<string[]> => {
  try {
    const ids: string[] = [];

    for (const nome of nomesDisciplinas) {
      // Busca cada disciplina pelo nome
      const response = await fetch(`http://localhost:3001/disciplina`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar disciplinas`);
      }

      const disciplinas: Array<{ nome: string; _id?: string }> = await response.json();
      
      // Encontra a disciplina com o nome correspondente
      const disciplinaEncontrada = disciplinas.find(d => d.nome === nome);
      
      if (disciplinaEncontrada && disciplinaEncontrada._id) {
        ids.push(disciplinaEncontrada._id);
      }
    }

    return ids;
  } catch (error) {
    console.error('Erro ao buscar IDs das disciplinas:', error);
    throw error;
  }
};

/**
 * Versão otimizada: busca todas as disciplinas uma vez
 * @param nomesDisciplinas - Array com nomes das disciplinas
 * @returns Array com IDs das disciplinas
 */
export const buscarIdsDisciplinasOtimizado = async (nomesDisciplinas: string[]): Promise<string[]> => {
  try {
    // Busca todas as disciplinas uma única vez
    const response = await fetch(`http://localhost:3001/disciplina`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar disciplinas`);
    }

    const disciplinas: Array<{ nome: string; _id: string }> = await response.json();
    
    // Mapeia os nomes para IDs
    const ids = nomesDisciplinas
      .map(nome => {
        const disciplina = disciplinas.find(d => d.nome === nome);
        return disciplina?._id;
      })
      .filter((id): id is string => id !== undefined);

    return ids;
  } catch (error) {
    console.error('Erro ao buscar IDs das disciplinas:', error);
    throw error;
  }
};