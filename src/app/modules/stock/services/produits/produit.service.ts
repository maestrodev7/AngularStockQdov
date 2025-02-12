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

  getProduitsByFilter(filterModel: Produit | null = null): Observable<ProduitsPaged> {
    let params = new HttpParams();

    if (filterModel) {
      if (filterModel.nom) {
        params = params.set('nom', filterModel.nom);
      }
      if (filterModel.categorie_id) {
        params = params.set('categorie_id', filterModel.categorie_id.toString());
      }
      if (filterModel.magasin_id) {
        params = params.set('magasin_id', filterModel.magasin_id.toString());
      }
      if (filterModel.boutique_id) {
        params = params.set('boutique_id', filterModel.boutique_id.toString());
      }
    }

    return this.http.get<ProduitsPaged>(this.url, { params });
  }

  getProduitById(id: string): Observable<ProduitsPaged> {
    return this.http.get<ProduitsPaged>(`${this.url}/${id}`);
  }

  deleteProduit(produitId: number): Observable<void> {
    const deleteUrl = `${this.url}/${produitId}`;
    return this.http.delete<void>(deleteUrl);
  }

  getProduitsByMagasin(magasinId: number): Observable<ProduitsPaged> {
    return this.http.get<ProduitsPaged>(`${this.url}/magasin/${magasinId}`);
  }

  getProduitsByBoutique(magasinId: number): Observable<ProduitsPaged> {
    return this.http.get<ProduitsPaged>(`${this.url}/boutique/${magasinId}`);
  }
}