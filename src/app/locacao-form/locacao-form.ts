import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para formulários
import { Router, RouterModule } from '@angular/router';
import { Locacao } from '../models/Locacao';
import { LocacaoService } from '../service/locacao-service';

@Component({
  selector: 'app-locacao-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './locacao-form.html',
  styleUrl: './locacao-form.css'
})
export class LocacaoFormComponent {
  novaLocacao: Partial<Locacao> = { status: 'Ativa' };
  
  // Strings temporárias para receber do input type="date" do HTML
  dataInicioStr: string = '';
  dataFimStr: string = '';

  constructor(
    private locacaoService: LocacaoService,
    private router: Router
  ) {}

  salvar() {
    // Converte as strings do formulário para objeto Date real do JavaScript
    this.novaLocacao.dataInicio = new Date(this.dataInicioStr + 'T00:00:00');
    this.novaLocacao.dataFim = new Date(this.dataFimStr + 'T00:00:00');
    this.novaLocacao.id = Math.floor(Math.random() * 10000); // Gera um ID aleatório por enquanto

    // Salva no serviço
    this.locacaoService.adicionarLocacao(this.novaLocacao as Locacao);
    
    // Volta para o dashboard
    this.router.navigate(['/dashboard']);
  }
}