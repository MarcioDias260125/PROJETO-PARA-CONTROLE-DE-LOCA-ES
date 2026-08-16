import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Locacao } from '../../models/Locacao';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  
  // Simulando dados que viriam de um Banco de Dados/Service
  locacoesAtivas: Locacao[] = [
    {
      id: 1,
      equipamentoId: 101,
      nomeEquipamento: 'Betoneira 400L',
      nomeObra: 'Edifício Aracaju',
      responsavelObra: 'Carlos Silva',
      telefoneResponsavel: '(79) 99999-0000',
      dataInicio: new Date('2026-07-20'),
      dataFim: new Date('2026-08-19'), // Vence em 3 dias (considerando hoje 16/08)
      status: 'Ativa'
    },
    {
      id: 2,
      equipamentoId: 102,
      nomeEquipamento: 'Andaime Tubular',
      nomeObra: 'Reforma Centro',
      responsavelObra: 'Mariana Santos',
      telefoneResponsavel: '(79) 98888-1111',
      dataInicio: new Date('2026-08-01'),
      dataFim: new Date('2026-08-30'), // Vence em 14 dias
      status: 'Ativa'
    }
  ];

  locacoesProximasDoVencimento: Locacao[] = [];

  ngOnInit() {
    this.verificarVencimentos();
  }

  verificarVencimentos() {
    const hoje = new Date();
    
    this.locacoesProximasDoVencimento = this.locacoesAtivas.filter(locacao => {
      // Pega o tempo em milissegundos e converte para dias
      const diferencaTempo = locacao.dataFim.getTime() - hoje.getTime();
      const diasRestantes = Math.ceil(diferencaTempo / (1000 * 3600 * 24));

      // Se faltar 5 dias ou menos (e não for negativo, o que indicaria já atrasado), entra no alerta
      return diasRestantes <= 5 && diasRestantes >= 0; 
    });
  }

  calcularDiasRestantes(dataFim: Date): number {
    const hoje = new Date();
    const diferenca = dataFim.getTime() - hoje.getTime();
    return Math.ceil(diferenca / (1000 * 3600 * 24));
  }
}