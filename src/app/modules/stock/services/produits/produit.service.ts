import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Produit } from '../../interfaces/produits/produit';
import { ProduitsPaged } from '../../interfaces/produits/produits-paged';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private baseUrl: string = environment.apiUrl;
  private url = `${this.baseUrl}/api/produits`;
  private magazinUrl = `${this.baseUrl}/api/produits/magasin`;
  private boutiqueUrl = `${this.baseUrl}/api/produits/boutique`;

  constructor(private http: HttpClient) { }

  addProduitToMagasin(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.magazinUrl, produit);
  }

  addProduitToBoutique(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.boutiqueUrl, produit);
  }

  updateProduit(produit: Produit, id: string): Observable<Produit> {
    return this.http.put<Produit>(`${this.url}/${id}`, produit);
  }

getProduitsByFilter(filters?: any): Observable<ProduitsPaged> {
  const safeFilters = filters && typeof filters === 'object' ? filters : {};
  let params = new HttpParams();

  Object.keys(safeFilters).forEach(key => {
    if (
      safeFilters[key] !== null &&
      safeFilters[key] !== undefined &&
      safeFilters[key] !== ''
    ) {
      params = params.set(key, safeFilters[key]);
    }
  });

  return this.http.get<ProduitsPaged>(this.url, { params });
}


  getProduitById(id: string): Observable<ProduitsPaged> {
    return this.http.get<ProduitsPaged>(`${this.url}/${id}`);
  }

  deleteProduit(produitId: number): Observable<void> {
    const deleteUrl = `${this.url}/${produitId}`;
    return this.http.delete<void>(deleteUrl);
  }

  getProduitsByMagasin(magasinId: number, filters: any = {}): Observable<ProduitsPaged> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<ProduitsPaged>(`${this.url}/magasin/${magasinId}`, { params });
  }

  getProduitsByBoutique(boutiqueId: number, filters: any = {}): Observable<ProduitsPaged> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<ProduitsPaged>(`${this.url}/boutique/${boutiqueId}`, { params });
  }
}
