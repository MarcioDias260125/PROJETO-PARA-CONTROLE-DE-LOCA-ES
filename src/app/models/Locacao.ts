export interface ItemLocacao {
  id?: number;
  nomeEquipamento: string;
  quantidade: number;
}

export interface ItemDevolvido {
  id?: number;
  nomeEquipamento: string;
  quantidade: number;
  dataDevolucao?: Date | string;
}

export interface Locacao {
  id: number;
  nomeObra: string;
  responsavelObra: string;
  telefoneResponsavel: string;
  dataInicio: Date | string;
  dataFim: Date | string;
  status: string;
  valorTotal: number;
  numeroOrdemCompra?: string;
  numeroContrato?: string;
  tipoPeriodicidade?: string;
  fornecedor?: string;
  itens: ItemLocacao[];
  itensDevolvidos?: ItemDevolvido[];
}