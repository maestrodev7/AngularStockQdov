import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Magazin } from '../../interfaces/magazins/magazin';
import { Observable } from 'rxjs';
import { MagazinsPaged } from '../../interfaces/magazins/magazins-paged';

@Injectable({
  providedIn: 'root'
})
export class MagazinService {

private baseUrl: string = environment.apiUrl; 
  private url = `${this.baseUrl}/api/magasins`;
  
  constructor(private http: HttpClient) { }

  addMagazin(magazin: Magazin): Observable<Magazin> {
    return this.http.post<Magazin>(this.url, magazin);
  }

  updateMagazin( magazin: Magazin,id:string): Observable<Magazin> {
    return this.http.put<Magazin>(`${this.url}/${id}`, magazin);
  }

  getMagazinByFilter(filterModel: Magazin | null = null): Observable<MagazinsPaged> {
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

    return this.http.get<MagazinsPaged>(this.url, { params });
  }

  getMagazinById(id: string): Observable<MagazinsPaged> {
    return this.http.get<MagazinsPaged>(`${this.url}/${id}`);
  }

  deleteMagazin(magazinId: number): Observable<void> {
    const deleteUrl = `${this.url}/${magazinId}`;
    return this.http.delete<void>(deleteUrl);
  }
}
