import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Fournisseur } from '../../interfaces/fournisseurs/fournisseur';
import { Observable } from 'rxjs';
import { FournisseursPaged } from '../../interfaces/fournisseurs/fournisseurs-paged';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  
  private baseUrl: string = environment.apiUrl; 
  private url = `${this.baseUrl}/api/fournisseurs`;
  
  constructor(private http: HttpClient) { }

  addFournisseurs(client: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.url, client);
  }

  updateFournisseur( fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.url}`, fournisseur);
  }

  getFournisseursByFilter(filterModel: Fournisseur | null = null): Observable<FournisseursPaged> {
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

    return this.http.get<FournisseursPaged>(this.url, { params });
  }

  deleteFournisseur(fournisseurId: number): Observable<void> {
    const deleteUrl = `${this.url}/${fournisseurId}`;
    return this.http.delete<void>(deleteUrl);
  }
}
