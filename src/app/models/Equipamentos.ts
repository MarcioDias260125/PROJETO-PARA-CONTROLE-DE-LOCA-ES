export interface Equipamento {
  id: number;
  descricao: string; // Ex: Betoneira, Andaime, Furadeira
  valorDiaria: number;
  status: 'Disponível' | 'Alugado' | 'Manutenção';
}