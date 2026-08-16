import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Fornecedor {
  id: number;
  nomeEmpresa: string;
  cnpjOuCpf?: string;
  telefone: string;
  email?: string;
  servicoPrestado?: string;
}

@Component({
  selector: 'app-fornecedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fornecedor-component.html',
  styleUrl: './fornecedor-component.css'
})
export class FornecedorComponent implements OnInit {
  listaFornecedores: Fornecedor[] = [];
  novoFornecedor: Partial<Fornecedor> = {};

  ngOnInit() {
    this.carregarFornecedores();
  }

  carregarFornecedores() {
    const dados = localStorage.getItem('sergamix_fornecedores');
    if (dados) {
      this.listaFornecedores = JSON.parse(dados);
    } else {
      this.listaFornecedores = [
        {
          id: 1,
          nomeEmpresa: 'Manutenção Sergipe LTDA',
          cnpjOuCpf: '12.345.678/0001-90',
          telefone: '(79) 98888-7777',
          email: 'contato@manutencaose.com',
          servicoPrestado: 'Manutenção Preventiva / Peças'
        }
      ];
      this.salvarStorage();
    }
  }

  salvarStorage() {
    localStorage.setItem('sergamix_fornecedores', JSON.stringify(this.listaFornecedores));
  }

  cadastrar() {
    if (!this.novoFornecedor.nomeEmpresa || !this.novoFornecedor.telefone) {
      alert('⚠️ Preencha pelo menos o Nome e o Telefone do fornecedor.');
      return;
    }

    const fornecedorCompleto: Fornecedor = {
      id: Math.floor(Math.random() * 10000),
      nomeEmpresa: this.novoFornecedor.nomeEmpresa,
      cnpjOuCpf: this.novoFornecedor.cnpjOuCpf || '',
      telefone: this.novoFornecedor.telefone,
      email: this.novoFornecedor.email || '',
      servicoPrestado: this.novoFornecedor.servicoPrestado || ''
    };

    this.listaFornecedores.push(fornecedorCompleto);
    this.salvarStorage();
    this.novoFornecedor = {};
  }

  excluir(id: number, nome: string) {
    if (confirm(`Deseja remover o fornecedor "${nome}"?`)) {
      this.listaFornecedores = this.listaFornecedores.filter(f => f.id !== id);
      this.salvarStorage();
    }
  }
}