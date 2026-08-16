import { Injectable } from '@angular/core';
import { Locacao } from '../models/Locacao';

@Injectable({
  providedIn: 'root'
})
export class LocacaoService {
  // Vamos começar com uma locação de teste na memória
  private locacoes: Locacao[] = [
    {
      id: 1,
      equipamentoId: 101,
      nomeEquipamento: 'Betoneira 400L',
      nomeObra: 'Edifício Aracaju',
      responsavelObra: 'Carlos Silva',
      telefoneResponsavel: '(79) 99999-0000',
      dataInicio: new Date('2026-08-01'),
      dataFim: new Date('2026-08-20'), // Vence em breve
      status: 'Ativa'
    }
  ];

  getLocacoes(): Locacao[] {
    return this.locacoes;
  }

  adicionarLocacao(locacao: Locacao) {
    this.locacoes.push(locacao);
  }
}