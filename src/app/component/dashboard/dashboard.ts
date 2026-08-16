import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Locacao } from '../../models/Locacao';
import { LocacaoService } from '../../service/locacao-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  
  locacoesAtivas: Locacao[] = [];
  locacoesProximasDoVencimento: Locacao[] = [];
  
  totalEmAndamento: number = 0;
  totalEncerradas: number = 0;
  totalVencendo: number = 0;

  // Filtro para saber o que tem/passou na obra
  obraSelecionada: string = '';
  listaObras: string[] = [];

  constructor(private locacaoService: LocacaoService) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const todas = this.locacaoService.getLocacoes();
    
    this.locacoesAtivas = todas.filter(l => l.status === 'Ativa');
    this.totalEmAndamento = this.locacoesAtivas.length;
    this.totalEncerradas = todas.filter(l => l.status === 'Encerrada').length;

    // Lista de obras únicas para o filtro
    this.listaObras = Array.from(new Set(todas.map(l => l.nomeObra)));

    this.verificarVencimentos(this.locacoesAtivas);
  }

  verificarVencimentos(locacoesAtivas: Locacao[]) {
    const hoje = new Date();
    this.locacoesProximasDoVencimento = locacoesAtivas.filter(locacao => {
      const dataFim = new Date(locacao.dataFim);
      const diferencaTempo = dataFim.getTime() - hoje.getTime();
      const diasRestantes = Math.ceil(diferencaTempo / (1000 * 3600 * 24));
      return diasRestantes <= 5 && diasRestantes >= 0; 
    });
    this.totalVencendo = this.locacoesProximasDoVencimento.length;
  }

  calcularDiasRestantes(dataFimInput: Date | string): number {
    const hoje = new Date();
    const dataFim = new Date(dataFimInput);
    const diferenca = dataFim.getTime() - hoje.getTime();
    return Math.ceil(diferenca / (1000 * 3600 * 24));
  }

  renovar(id: number) {
    const diasStr = prompt('Quantos dias deseja prorrogar esta locação?', '7');
    if (diasStr) {
      const dias = parseInt(diasStr, 10);
      if (!isNaN(dias) && dias > 0) {
        this.locacaoService.renovarLocacao(id, dias);
        this.carregarDados();
      }
    }
  }

  // Ação de baixa completa com escolha de equipamento e confirmação
  darBaixaLocacao(loc: Locacao) {
    if (!loc.itens || loc.itens.length === 0) {
      alert('Não há equipamentos ativos nesta locação.');
      return;
    }

    let indexItem = 0;

    // Se houver mais de um equipamento no mesmo contrato, solicita a escolha
    if (loc.itens.length > 1) {
      const listaOpcoes = loc.itens
        .map((item, idx) => `${idx + 1}: ${item.nomeEquipamento} (Qtd na obra: ${item.quantidade})`)
        .join('\n');

      const escolhaStr = prompt(`Selecione o número do equipamento para dar baixa:\n\n${listaOpcoes}`);
      if (!escolhaStr) return;

      const escolha = parseInt(escolhaStr, 10) - 1;
      if (isNaN(escolha) || escolha < 0 || escolha >= loc.itens.length) {
        alert('Opção inválida.');
        return;
      }
      indexItem = escolha;
    }

    const itemSelecionado = loc.itens[indexItem];
    const qtdStr = prompt(`Quantas unidades de "${itemSelecionado.nomeEquipamento}" foram devolvidas? (Em obra: ${itemSelecionado.quantidade})`, '1');
    
    if (!qtdStr) return;
    
    const qtd = parseInt(qtdStr, 10);
    if (isNaN(qtd) || qtd <= 0 || qtd > itemSelecionado.quantidade) {
      alert('⚠️ Quantidade inválida!');
      return;
    }

    // Janela de confirmação final
    const confirmacao = window.confirm(
      `CONFIRMAÇÃO DE BAIXA\n\n` +
      `Obra: ${loc.nomeObra}\n` +
      `Equipamento: ${itemSelecionado.nomeEquipamento}\n` +
      `Quantidade a dar baixa: ${qtd}\n\n` +
      `Deseja realmente confirmar esta baixa?`
    );

    if (confirmacao) {
      this.locacaoService.devolverParcial(loc.id, indexItem, qtd);
      this.carregarDados();
    }
  }

  // Disparo de lembrete para você mesmo / WhatsApp
  notificarSelf(loc: Locacao) {
    const msg = `🚨 *SERGAMIX - LEMBRETE DE VENCIMENTO*%0A` +
                `Obra: *${loc.nomeObra}*%0A` +
                `Resp: ${loc.responsavelObra} (${loc.telefoneResponsavel})%0A` +
                `Vence em: ${new Date(loc.dataFim).toLocaleDateString('pt-BR')}`;
    
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  }

  obterNomeEquipamentos(loc: any): string {
    if (loc.itens && loc.itens.length > 0) {
      return loc.itens.map((i: any) => `${i.quantidade}x ${i.nomeEquipamento}`).join(', ');
    }
    return loc.nomeEquipamento || 'Equipamento não especificado';
  }

  encerrar(id: number, identificacao: string) {
    if (window.confirm(`Deseja realmente encerrar a ${identificacao}?`)) {
      this.locacaoService.encerrarLocacao(id);
      this.carregarDados();
    }
  }

  // Métodos para o Raio-X da Obra
  get locacoesDaObraSelecionada(): Locacao[] {
    if (!this.obraSelecionada) return [];
    return this.locacaoService.getLocacoes().filter(l => l.nomeObra === this.obraSelecionada);
  }
}