import { Injectable } from '@angular/core';
import { Locacao } from '../models/Locacao';

@Injectable({
  providedIn: 'root'
})
export class LocacaoService {
  private locacoes: Locacao[] = [];
  
  // Nome da "chave" onde vamos guardar os dados no navegador
  private storageKey = 'controle_locacoes_dados';

  constructor() {
    this.carregarDados();
  }

  // 1. Carrega os dados quando o sistema abre
  private carregarDados() {
    const dadosSalvos = localStorage.getItem(this.storageKey);
    
    if (dadosSalvos) {
      // O LocalStorage salva tudo como texto. Precisamos converter as datas de volta para o formato Date do JavaScript
      const locacoesParse = JSON.parse(dadosSalvos);
      this.locacoes = locacoesParse.map((loc: any) => ({
        ...loc,
        dataInicio: new Date(loc.dataInicio),
        dataFim: new Date(loc.dataFim)
      }));
    }
  }

  // 2. Salva os dados sempre que houver alguma mudança
  private salvarDados() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.locacoes));
  }

  getLocacoes(): Locacao[] {
    return this.locacoes;
  }

  adicionarLocacao(locacao: Locacao) {
    this.locacoes.push(locacao);
    this.salvarDados(); // Salva após adicionar
  }

  encerrarLocacao(id: number) {
    const locacao = this.locacoes.find(l => l.id === id);
    if (locacao) {
      locacao.status = 'Encerrada';
      this.salvarDados(); // Salva após encerrar
    }
  }
  // Busca uma locação específica para preencher o formulário
  getLocacaoById(id: number): Locacao | undefined {
    return this.locacoes.find(l => l.id === id);
  }

  // Substitui os dados antigos pelos novos
  atualizarLocacao(locacaoAtualizada: Locacao) {
    const index = this.locacoes.findIndex(l => l.id === locacaoAtualizada.id);
    if (index !== -1) {
      this.locacoes[index] = locacaoAtualizada;
      this.salvarDados();
    }
  }
}