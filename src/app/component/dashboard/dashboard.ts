import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Para podermos usar links
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

  // Injetamos o serviço aqui no construtor
  constructor(private locacaoService: LocacaoService) {}

  ngOnInit() {
    // Busca as locações do serviço
    this.locacoesAtivas = this.locacaoService.getLocacoes();
    this.verificarVencimentos();
  }

  verificarVencimentos() {
    const hoje = new Date();
    
    this.locacoesProximasDoVencimento = this.locacoesAtivas.filter(locacao => {
      const diferencaTempo = locacao.dataFim.getTime() - hoje.getTime();
      const diasRestantes = Math.ceil(diferencaTempo / (1000 * 3600 * 24));
      return diasRestantes <= 5 && diasRestantes >= 0; 
    });
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
      
      // Recarrega as listas para remover a locação encerrada da visão principal (se desejar)
      this.locacoesAtivas = this.locacaoService.getLocacoes();
      this.verificarVencimentos();
    }
  }
}