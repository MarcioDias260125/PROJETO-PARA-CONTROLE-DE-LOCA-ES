import { Injectable } from '@angular/core';
import { Locacao, ItemDevolvido } from '../models/Locacao';

@Injectable({
  providedIn: 'root'
})
export class LocacaoService {
  private locacoes: Locacao[] = [];

  constructor() {
    this.carregarDados();
  }

  private carregarDados() {
    const dados = localStorage.getItem('sergamix_locacoes');
    if (dados) {
      this.locacoes = JSON.parse(dados);
    }
  }

  private salvarDados() {
    localStorage.setItem('sergamix_locacoes', JSON.stringify(this.locacoes));
  }

  getLocacoes(): Locacao[] {
    return this.locacoes;
  }

  getLocacaoById(id: number): Locacao | undefined {
    return this.locacoes.find(l => l.id === id);
  }

  adicionarLocacao(locacao: Locacao) {
    locacao.itensDevolvidos = [];
    this.locacoes.push(locacao);
    this.salvarDados();
  }

  atualizarLocacao(locacao: Locacao) {
    const index = this.locacoes.findIndex(l => l.id === locacao.id);
    if (index !== -1) {
      this.locacoes[index] = locacao;
      this.salvarDados();
    }
  }

  // RENOVAÇÃO RÁPIDA: Adiciona X dias no vencimento
  renovarLocacao(id: number, dias: number) {
    const loc = this.getLocacaoById(id);
    if (loc) {
      const dataAtual = new Date(loc.dataFim);
      dataAtual.setDate(dataAtual.getDate() + dias);
      loc.dataFim = dataAtual;
      this.salvarDados();
    }
  }

  // DEVOLUÇÃO PARCIAL: Baixa uma quantidade do equipamento na obra
  devolverParcial(idLocacao: number, indexItem: number, quantidadeDevolver: number) {
    const loc = this.getLocacaoById(idLocacao);
    if (!loc) return;

    const item = loc.itens[indexItem];
    if (item && quantidadeDevolver > 0 && quantidadeDevolver <= item.quantidade) {
      item.quantidade -= quantidadeDevolver;

      if (!loc.itensDevolvidos) loc.itensDevolvidos = [];
      loc.itensDevolvidos.push({
        nomeEquipamento: item.nomeEquipamento,
        quantidade: quantidadeDevolver,
        dataDevolucao: new Date()
      });

      // Se devolveu tudo do item, remove do contrato
      if (item.quantidade === 0) {
        loc.itens.splice(indexItem, 1);
      }

      // Se a obra não tem mais nenhum equipamento ativo, encerra a locação automaticamente
      if (loc.itens.length === 0) {
        loc.status = 'Encerrada';
      }

      this.salvarDados();
    }
  }

  encerrarLocacao(id: number) {
    const loc = this.getLocacaoById(id);
    if (loc) {
      loc.status = 'Encerrada';
      this.salvarDados();
    }
  }
}