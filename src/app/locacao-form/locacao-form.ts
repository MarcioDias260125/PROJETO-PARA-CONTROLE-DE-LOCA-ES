import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule, ActivatedRoute } from '@angular/router'; // Adicionamos o ActivatedRoute
import { LocacaoService } from '../service/locacao-service'; 
import { Locacao } from '../models/Locacao';

@Component({
  selector: 'app-locacao-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './locacao-form.html',
  styleUrl: './locacao-form.css'
})
export class LocacaoFormComponent implements OnInit {
  novaLocacao: Partial<Locacao> = { 
    status: 'Ativa',
    nomeEquipamento: '' 
  };
  
  dataInicioStr: string = '';
  dataFimStr: string = '';
  isEdicao: boolean = false; // Flag para saber se estamos editando

  equipamentosDisponiveis: string[] = [
    'Betoneira 400L',
    'Andaime Tubular (Painel)',
    'Martelete Rompedor 15kg',
    'Furadeira de Impacto',
    'Compactador de Solo (Sapo)',
    'Placa Vibratória',
    'Esmerilhadeira Angular'
  ];

  constructor(
    private locacaoService: LocacaoService,
    private router: Router,
    private route: ActivatedRoute // Injetamos a rota para ler o ID
  ) {}

  ngOnInit() {
    // Verifica se tem um ID na URL (modo edição)
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEdicao = true;
      const locacao = this.locacaoService.getLocacaoById(Number(id));
      
      if (locacao) {
        this.novaLocacao = { ...locacao };
        
        // Converte as datas do formato Date para texto (YYYY-MM-DD) para aparecer no HTML
        this.dataInicioStr = locacao.dataInicio.toISOString().substring(0, 10);
        this.dataFimStr = locacao.dataFim.toISOString().substring(0, 10);
      }
    }
  }

  salvar() {
    if (!this.novaLocacao.nomeEquipamento || !this.novaLocacao.nomeObra || !this.dataInicioStr || !this.dataFimStr) {
      alert('⚠️ Por favor, preencha todos os campos importantes!');
      return;
    }

    this.novaLocacao.dataInicio = new Date(this.dataInicioStr + 'T00:00:00');
    this.novaLocacao.dataFim = new Date(this.dataFimStr + 'T00:00:00');

    if (this.isEdicao) {
      // Se for edição, atualiza a existente
      this.locacaoService.atualizarLocacao(this.novaLocacao as Locacao);
    } else {
      // Se for nova, cria uma nova
      this.novaLocacao.id = Math.floor(Math.random() * 10000); 
      this.locacaoService.adicionarLocacao(this.novaLocacao as Locacao);
    }
    
    this.router.navigate(['/dashboard']);
  }
}