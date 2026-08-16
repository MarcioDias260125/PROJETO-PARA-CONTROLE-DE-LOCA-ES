import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Locacao, ItemLocacao } from '../models/Locacao';
import { LocacaoService } from '../service/locacao-service';

@Component({
  selector: 'app-locacao-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './locacao-form.html',
  styleUrl: './locacao-form.css'
})
export class LocacaoFormComponent implements OnInit {
  novaLocacao: Locacao = {
    id: 0,
    nomeObra: '',
    responsavelObra: '',
    telefoneResponsavel: '',
    dataInicio: new Date(),
    dataFim: new Date(),
    status: 'Ativa',
    valorTotal: 0,
    numeroOrdemCompra: '',
    numeroContrato: '',
    tipoPeriodicidade: 'Diária',
    fornecedor: '',
    itens: []
  };

  itensLocacao: ItemLocacao[] = [
    { nomeEquipamento: '', quantidade: 1 }
  ];

  listaFornecedores: string[] = [
    'Escoras & Cia',
    'Andaimes Sergipe',
    'Rental Equipamentos',
    'LocaMais'
  ];

  equipamentosDisponiveis: string[] = [
    'Andaime Tubular 1.0m',
    'Escora Metálica 3.20m',
    'Betoneira 400L',
    'Compactador de Solo (Sapo)',
    'Martelete Rompedor 15kg',
    'Gerador de Energia 5500W',
    'Bomba Submersa 2"'
  ];

  dataInicioStr: string = new Date().toISOString().split('T')[0];
  dataFimStr: string = new Date().toISOString().split('T')[0];
  isEdicao: boolean = false;

  constructor(
    private locacaoService: LocacaoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.isEdicao = true;
      this.locacaoService.getLocacaoById(id).subscribe({
        next: (loc) => {
          if (loc) {
            this.novaLocacao = loc;
            if (loc.itens && loc.itens.length > 0) {
              this.itensLocacao = [...loc.itens];
            }
            if (loc.dataInicio) {
              this.dataInicioStr = new Date(loc.dataInicio).toISOString().split('T')[0];
            }
            if (loc.dataFim) {
              this.dataFimStr = new Date(loc.dataFim).toISOString().split('T')[0];
            }
          }
        },
        error: (err) => alert('Erro ao carregar a locação: ' + err.message)
      });
    }
  }

  get periodicidadeCalculada(): string {
    if (!this.dataInicioStr || !this.dataFimStr) return 'Pendente';
    const inicio = new Date(this.dataInicioStr);
    const fim = new Date(this.dataFimStr);
    const diffTime = fim.getTime() - inicio.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Data Inválida';
    if (diffDays === 1) return 'Diária (1 dia)';
    if (diffDays <= 7) return `Semanal (${diffDays} dias)`;
    if (diffDays <= 15) return `Quinzena (${diffDays} dias)`;
    if (diffDays <= 31) return `Mensal (${diffDays} dias)`;
    return `Longo Prazo (${diffDays} dias)`;
  }

  adicionarEquipamento(): void {
    this.itensLocacao.push({ nomeEquipamento: '', quantidade: 1 });
  }

  removerEquipamento(index: number): void {
    if (this.itensLocacao.length > 1) {
      this.itensLocacao.splice(index, 1);
    }
  }

  salvar(): void {
    if (!this.novaLocacao.nomeObra || !this.novaLocacao.responsavelObra || !this.novaLocacao.telefoneResponsavel) {
      alert('Por favor, preencha os campos obrigatórios da obra!');
      return;
    }

    const itensValidos = this.itensLocacao.filter(i => i.nomeEquipamento && i.quantidade > 0);
    if (itensValidos.length === 0) {
      alert('Selecione pelo menos um equipamento válido na lista.');
      return;
    }

    this.novaLocacao.itens = itensValidos;
    this.novaLocacao.dataInicio = new Date(this.dataInicioStr);
    this.novaLocacao.dataFim = new Date(this.dataFimStr);
    this.novaLocacao.tipoPeriodicidade = this.periodicidadeCalculada;

    if (this.isEdicao) {
      this.locacaoService.atualizarLocacao(this.novaLocacao.id, this.novaLocacao).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => alert('Erro ao atualizar: ' + err.message)
      });
    } else {
      this.locacaoService.adicionarLocacao(this.novaLocacao).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => alert('Erro ao salvar: ' + err.message)
      });
    }
  }
}