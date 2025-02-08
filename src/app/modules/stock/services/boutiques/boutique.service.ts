import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Boutique } from '../../interfaces/boutiques/boutique';
import { Observable } from 'rxjs';
import { BoutiquesPaged } from '../../interfaces/boutiques/boutiques-paged';

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {
  private baseUrl: string = environment.apiUrl; 
  private url = `${this.baseUrl}/api/boutiques`;
  
  constructor(private http: HttpClient) { }

  addShop(boutique: Boutique): Observable<Boutique> {
    return this.http.post<Boutique>(this.url, boutique);
  }

  updateShop( boutique: Boutique,id:string): Observable<Boutique> {
    return this.http.put<Boutique>(`${this.url}/${id}`, boutique);
  }

  getShopByFilter(filterModel: Boutique | null = null): Observable<BoutiquesPaged> {
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

    return this.http.get<BoutiquesPaged>(this.url, { params });
  }

  getShopById(id: string): Observable<BoutiquesPaged> {
    return this.http.get<BoutiquesPaged>(`${this.url}/${id}`);
  }

  deleteShop(boutiqueId: number): Observable<void> {
    const deleteUrl = `${this.url}/${boutiqueId}`;
    return this.http.delete<void>(deleteUrl);
  }
}
