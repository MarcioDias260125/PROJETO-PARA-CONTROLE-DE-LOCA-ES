import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Locacao } from '../../models/Locacao';
import { LocacaoService } from '../../service/locacao-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  
  locacoesAtivas: Locacao[] = [];
  locacoesProximasDoVencimento: Locacao[] = [];
  
  // Nossos totalizadores
  totalEmAndamento: number = 0;
  totalEncerradas: number = 0;
  totalVencendo: number = 0;

  constructor(private locacaoService: LocacaoService) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const todasAsLocacoes = this.locacaoService.getLocacoes();
    
    // Filtra apenas as ativas para a tabela
    this.locacoesAtivas = todasAsLocacoes.filter(l => l.status === 'Ativa');
    
    // Calcula os totais para as caixinhas de resumo
    this.totalEmAndamento = this.locacoesAtivas.length;
    this.totalEncerradas = todasAsLocacoes.filter(l => l.status === 'Encerrada').length;
    
    this.verificarVencimentos(this.locacoesAtivas);
  }

  verificarVencimentos(locacoesAtivas: Locacao[]) {
    const hoje = new Date();
    
    this.locacoesProximasDoVencimento = locacoesAtivas.filter(locacao => {
      const diferencaTempo = locacao.dataFim.getTime() - hoje.getTime();
      const diasRestantes = Math.ceil(diferencaTempo / (1000 * 3600 * 24));
      return diasRestantes <= 5 && diasRestantes >= 0; 
    });

    this.totalVencendo = this.locacoesProximasDoVencimento.length;
  }

  calcularDiasRestantes(dataFim: Date): number {
    const hoje = new Date();
    const diferenca = dataFim.getTime() - hoje.getTime();
    return Math.ceil(diferenca / (1000 * 3600 * 24));
  }

  encerrar(id: number, nomeEquipamento: string) {
    const confirmacao = window.confirm(`Deseja realmente encerrar a locação da ${nomeEquipamento}?`);
    
    if (confirmacao) {
      this.locacaoService.encerrarLocacao(id);
      this.carregarDados(); // Recarrega tudo para atualizar os números e sumir com a locação da tabela
    }
  }
}