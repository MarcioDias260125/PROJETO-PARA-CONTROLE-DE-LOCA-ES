// Model (classe de dados) que representa um Fornecedor de equipamentos
// Cada propriedade já vem com um valor padrão, evitando erros de
// "undefined" quando o formulário ainda está vazio

export class Fornecedor {

    // ID gerado automaticamente pela API (mockapi.io) ao cadastrar
    id: number = 0

    // Nome do fornecedor/empresa. Ex: "Locadora Silva Equipamentos"
    nome: string = ''

    // Telefone de contato do fornecedor, para negociações e emergências
    telefone: string = ''

}