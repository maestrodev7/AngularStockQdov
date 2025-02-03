import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Client } from '../../interfaces/clients/client';
import { Observable } from 'rxjs';
import { ClientsPaged } from '../../interfaces/clients/clients-paged';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
private baseUrl: string = environment.apiUrl; 
  private url = `${this.baseUrl}/api/clients`;
  
  constructor(private http: HttpClient) { }

  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.url, client);
  }

  updateClient( client: Client,id:string): Observable<Client> {
    return this.http.put<Client>(`${this.url}/${id}`, client);
  }

  getClientsByFilter(filterModel: Client | null = null): Observable<ClientsPaged> {
    let params = new HttpParams();
    
    if (filterModel) {
      if (filterModel.nom) {
        params = params.set('nom', filterModel.nom);
      }
      if (filterModel.adresse) {
        params = params.set('adresse', filterModel.adresse);
      }
      if (filterModel.telephone) {
        params = params.set('telephone', filterModel.telephone);
      }
    }

    return this.http.get<ClientsPaged>(this.url, { params });
  }

  getClientById(id: string): Observable<ClientsPaged> {
    return this.http.get<ClientsPaged>(`${this.url}/${id}`);
  }

  deleteClient(clientId: number): Observable<void> {
    const deleteUrl = `${this.url}/${clientId}`;
    return this.http.delete<void>(deleteUrl);
  }
}
