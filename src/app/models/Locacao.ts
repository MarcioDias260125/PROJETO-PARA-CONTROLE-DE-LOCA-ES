export interface Locacao {
  id: number;
  equipamentoId: number;
  nomeEquipamento: string;
  nomeObra: string;
  responsavelObra: string;
  telefoneResponsavel: string;
  dataInicio: Date;
  dataFim: Date;
  status: 'Ativa' | 'Encerrada';
}
