import { Injectable } from '@angular/core';
import { Fornecedor } from '../models/Fornecedor';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

// @Injectable com providedIn: 'root' disponibiliza esse serviço
// para toda a aplicação automaticamente, sem precisar registrar
// ele em nenhum módulo manualmente
@Injectable({
    providedIn: 'root',
})
export class FornecedorService {

    // Injeção de dependência do HttpClient: é ele quem faz as
    // requisições HTTP (GET, POST, etc) para a API do mockapi.io
    constructor(private http: HttpClient) { }

    // ATENÇÃO: troque SEU_ID e NOME_PROJETO pela URL real
    // do seu projeto no mockapi.io antes de testar
    private urlApi = `https://SEU_ID.mockapi.io/NOME_PROJETO/fornecedores`

    // Busca todos os fornecedores cadastrados na API (requisição GET)
    // Retorna um Observable<Fornecedor[]> porque a chamada é assíncrona:
    // quem chamar esse método precisa fazer .subscribe() para
    // realmente receber os dados quando a resposta chegar
    listarFornecedores(): Observable<Fornecedor[]> {
        return this.http.get<Fornecedor[]>(this.urlApi)
    }

    // Envia um novo fornecedor para a API (requisição POST)
    // Recebe o objeto já preenchido e retorna o fornecedor criado
    // (já com o "id" gerado automaticamente pela API)
    adicionarFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
        return this.http.post<Fornecedor>(this.urlApi, fornecedor)
    }

}