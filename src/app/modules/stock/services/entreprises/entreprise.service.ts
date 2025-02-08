import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Entreprise } from '../../interfaces/entreprises/entreprise';
import { Observable } from 'rxjs';
import { EntreprisesPaged } from '../../interfaces/entreprises/entreprises-paged';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private baseUrl: string = environment.apiUrl; 
  private url = `${this.baseUrl}/api/entreprises`;
  
  constructor(private http: HttpClient) { }

  addEntreprise(entreprise: Entreprise): Observable<Entreprise> {
    return this.http.post<Entreprise>(this.url, entreprise);
  }

  updateagazin( entreprise: Entreprise,id:string): Observable<Entreprise> {
    return this.http.put<Entreprise>(`${this.url}/${id}`, entreprise);
  }

  getEntrepriseByFilter(filterModel: Entreprise | null = null): Observable<EntreprisesPaged> {
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

    return this.http.get<EntreprisesPaged>(this.url, { params });
  }

  getEntrepriseById(id: string): Observable<EntreprisesPaged> {
    return this.http.get<EntreprisesPaged>(`${this.url}/${id}`);
  }

  deleteEntreprise(EntrepriseId: number): Observable<void> {
    const deleteUrl = `${this.url}/${EntrepriseId}`;
    return this.http.delete<void>(deleteUrl);
  }
}
