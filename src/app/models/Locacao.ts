export interface ItemLocacao {
  nomeEquipamento: string;
  quantidade: number;
}

export interface ItemDevolvido {
  nomeEquipamento: string;
  quantidade: number;
  dataDevolucao: Date;
}

export interface Locacao {
  id: number;
  itens: ItemLocacao[];
  itensDevolvidos?: ItemDevolvido[]; // Guarda o histórico da obra
  nomeObra: string;
  responsavelObra: string;
  telefoneResponsavel: string;
  dataInicio: Date;
  dataFim: Date;
  status: 'Ativa' | 'Encerrada';
  valorTotal: number;
  numeroOrdemCompra?: string;
  numeroContrato?: string;
  tipoPeriodicidade?: string;
  fornecedor?: string;
}