import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Locacao } from '../models/Locacao';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocacaoService {
  private API_URL = `${environment.apiUrl}/locacoes`;

  constructor(private http: HttpClient) {}

  getLocacoes(): Observable<Locacao[]> {
    return this.http.get<Locacao[]>(this.API_URL);
  }

  adicionarLocacao(locacao: Locacao): Observable<Locacao> {
    return this.http.post<Locacao>(this.API_URL, locacao);
  }

  renovarLocacao(id: number, dias: number): Observable<Locacao> {
    return this.http.patch<Locacao>(`${this.API_URL}/${id}/renovar`, { dias });
  }

  devolverParcial(idLocacao: number, indexItem: number, quantidadeDevolver: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${idLocacao}/baixa`, { indexItem, quantidadeDevolver });
  }

  encerrarLocacao(id: number): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/encerrar`, {});
  }
}