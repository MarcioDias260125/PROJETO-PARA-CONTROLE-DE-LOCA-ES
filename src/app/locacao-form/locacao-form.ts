import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LocacaoService } from '../service/locacao-service'; 
import { Locacao, ItemLocacao } from '../models/Locacao';

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
    valorTotal: 0,
    numeroOrdemCompra: '',
    numeroContrato: '',
    fornecedor: ''
  };

  itensLocacao: ItemLocacao[] = [
    { nomeEquipamento: '', quantidade: 1 }
  ];

  dataInicioStr: string = '';
  dataFimStr: string = '';
  isEdicao: boolean = false;
  listaFornecedores: string[] = [];

  equipamentosDisponiveis: string[] = [
    'Andaime Tubular (Painel)',
    'Escora Metálica',
    'Roldana / Roda para Andaime',
    'Betoneira 400L',
    'Martelete Rompedor 15kg',
    'Furadeira de Impacto',
    'Compactador de Solo (Sapo)',
    'Placa Vibratória',
    'Esmerilhadeira Angular'
  ];

  constructor(
    private locacaoService: LocacaoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.carregarFornecedores();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdicao = true;
      const locacao = this.locacaoService.getLocacaoById(Number(id));
      if (locacao) {
        this.novaLocacao = { ...locacao };
        this.itensLocacao = locacao.itens && locacao.itens.length > 0 
          ? [...locacao.itens] 
          : [{ nomeEquipamento: (locacao as any).nomeEquipamento || '', quantidade: 1 }];
        
        this.dataInicioStr = new Date(locacao.dataInicio).toISOString().substring(0, 10);
        this.dataFimStr = new Date(locacao.dataFim).toISOString().substring(0, 10);
      }
    }
  }

  carregarFornecedores() {
    const dados = localStorage.getItem('sergamix_fornecedores');
    if (dados) {
      const fornecedoresSalvos = JSON.parse(dados);
      this.listaFornecedores = fornecedoresSalvos.map((f: any) => f.nomeEmpresa);
    }
  }

  adicionarEquipamento() {
    this.itensLocacao.push({ nomeEquipamento: '', quantidade: 1 });
  }

  removerEquipamento(index: number) {
    if (this.itensLocacao.length > 1) {
      this.itensLocacao.splice(index, 1);
    } else {
      alert('A locação precisa ter pelo menos 1 equipamento.');
    }
  }

  get periodicidadeCalculada(): string {
    if (!this.dataInicioStr || !this.dataFimStr) return 'Aguardando datas...';

    const inicio = new Date(this.dataInicioStr + 'T00:00:00');
    const fim = new Date(this.dataFimStr + 'T00:00:00');
    const diffTime = fim.getTime() - inicio.getTime();
    const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (dias <= 0) return 'Data final inválida';
    if (dias < 7) return `Diária (${dias} dias)`;
    if (dias >= 7 && dias < 15) return `Semanal (${dias} dias)`;
    if (dias >= 15 && dias < 28) return `Quinzenal (${dias} dias)`;
    return `Mensal (${dias} dias)`;
  }

  salvar() {
    const temEquipamentoInvalido = this.itensLocacao.some(item => !item.nomeEquipamento || item.quantidade <= 0);
    if (temEquipamentoInvalido) {
      alert('⚠️ Selecione os equipamentos e informe quantidades válidas.');
      return;
    }

    if (!this.novaLocacao.nomeObra || !this.dataInicioStr || !this.dataFimStr) {
      alert('⚠️ Preencha os campos obrigatórios da obra e as datas.');
      return;
    }

    this.novaLocacao.itens = this.itensLocacao;
    this.novaLocacao.dataInicio = new Date(this.dataInicioStr + 'T00:00:00');
    this.novaLocacao.dataFim = new Date(this.dataFimStr + 'T00:00:00');
    this.novaLocacao.tipoPeriodicidade = this.periodicidadeCalculada;

    if (this.isEdicao) {
      this.locacaoService.atualizarLocacao(this.novaLocacao as Locacao);
    } else {
      this.novaLocacao.id = Math.floor(Math.random() * 10000); 
      this.locacaoService.adicionarLocacao(this.novaLocacao as Locacao);
    }
    
    this.router.navigate(['/dashboard']);
  }
}