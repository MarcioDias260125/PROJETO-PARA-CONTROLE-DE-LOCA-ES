import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Fornecedor } from '../../models/Fornecedor';
import { FornecedorService } from '../../service/fornecedor-service';

@Component({
  selector: 'app-fornecedor-component',
  standalone: true,
  // FormsModule é necessário para usar [(ngModel)] no HTML
  // (liga o input à variável do componente).
  // CommonModule é necessário para usar *ngFor no HTML
  // (permite repetir um elemento para cada item de uma lista)
  imports: [FormsModule, CommonModule],
  templateUrl: './fornecedor-component.html',
  styleUrl: './fornecedor-component.css'
})
export class FornecedorComponent {

  // ===== Variáveis ligadas aos campos do formulário (via ngModel) =====
  nome: string = ''
  telefone: string = ''

  // Lista de fornecedores já cadastrados, exibida na tela
  // Começa vazia e é preenchida quando o componente carrega
  fornecedores: Fornecedor[] = []

  // Injeção do FornecedorService para chamar os métodos
  // de listar/adicionar fornecedor na API
  constructor(private fornecedorService: FornecedorService) { }

  // ngOnInit é um "gancho de ciclo de vida" do Angular: roda
  // automaticamente assim que o componente é carregado na tela.
  // Aqui usamos para já buscar a lista de fornecedores ao abrir a página
  ngOnInit() {
    this.carregarFornecedores()
  }

  // Busca a lista atualizada de fornecedores na API
  // e guarda no array "fornecedores" para exibir na tela
  carregarFornecedores() {
    this.fornecedorService.listarFornecedores().subscribe((dados) => {
      this.fornecedores = dados
    })
  }

  // Método chamado quando o usuário clica no botão "Cadastrar"
  salvar() {

    // Cria um novo objeto Fornecedor com os valores padrão do model
    const fornecedor = new Fornecedor()

    // Copia os valores digitados no formulário para o objeto
    fornecedor.nome = this.nome
    fornecedor.telefone = this.telefone

    // Envia para a API. Como adicionarFornecedor() retorna um
    // Observable, é preciso fazer .subscribe() para a requisição
    // realmente ser disparada
    this.fornecedorService.adicionarFornecedor(fornecedor).subscribe(() => {
      this.limparDados()          // limpa o formulário
      this.carregarFornecedores() // atualiza a lista exibida na tela
    })
  }

  // Reseta os campos do formulário para os valores iniciais
  limparDados() {
    this.nome = ''
    this.telefone = ''
  }
}