import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Purchase } from '../../interfaces/Achats/Purchase';
import { PurchasesPaged } from '../../interfaces/Achats/PurchasesPaged';
import { ResponsePurchase } from '../../interfaces/Achats/ResponsePurchase';

@Injectable({
  providedIn: 'root'
})
export class AchatsService {
  private baseUrl: string = environment.apiUrl;
  private url = `${this.baseUrl}/api/purchases`;

  constructor(private http: HttpClient) { }

  addPurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(this.url, purchase);
  }

  updatePurchase(purchase: Purchase, id: string): Observable<Purchase> {
    return this.http.put<Purchase>(`${this.url}/${id}`, purchase);
  }

  getPurchasesByFilter(filterModel: Partial<Purchase> | null = null): Observable<PurchasesPaged> {
    let params = new HttpParams();

    if (filterModel) {
      if (filterModel.supplier_id) {
        params = params.set('supplier_id', filterModel.supplier_id.toString());
      }
    }

    return this.http.get<PurchasesPaged>(this.url, { params });
  }

  getPurchaseById(id: string): Observable<ResponsePurchase> {
    return this.http.get<ResponsePurchase>(`${this.url}/${id}`);
  }

  deletePurchase(purchaseId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${purchaseId}`);
  }
}
