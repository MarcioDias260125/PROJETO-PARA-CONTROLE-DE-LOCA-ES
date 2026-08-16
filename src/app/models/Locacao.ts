export interface ItemLocacao {
  nomeEquipamento: string;
  quantidade: number;
}

export interface Locacao {
  id: number;
  itens: ItemLocacao[]; // Lista de equipamentos e quantidades
  nomeObra: string;
  responsavelObra: string;
  telefoneResponsavel: string;
  dataInicio: Date;
  dataFim: Date;
  status: 'Ativa' | 'Encerrada';
  
  // Novos campos exigidos:
  valorTotal: number;
  numeroOrdemCompra?: string;
  numeroContrato?: string;
  tipoPeriodicidade?: string; // Diária, Semanal, Quinzenal ou Mensal
}