import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

import { ResponseSale } from '../../interfaces/Ventes/Response-sale';
import { Sales } from '../../interfaces/Ventes/Sales';
import { SalesPages } from '../../interfaces/Ventes/Sales-pages';
import { SalesFilter } from '../../interfaces/Ventes/Sales-filter';

@Injectable({
  providedIn: 'root'
})
export class VentesService {
  private baseUrl: string = environment.apiUrl;
  private url = `${this.baseUrl}/api/sales`;

  constructor(private http: HttpClient) { }

  createSale(sale: Sales): Observable<SalesPages> {
    return this.http.post<SalesPages>(this.url, sale);
  }


  updateSale(sale: Sales, id: string): Observable<ResponseSale> {
    return this.http.put<ResponseSale>(`${this.url}/${id}`, sale);
  }

  getSalesByFilter(filterModel: Partial<SalesFilter> | null = null): Observable<SalesPages> {
    let params = new HttpParams();

    if (filterModel) {
      if (filterModel.start_date) {
        params = params.set('start_date', filterModel.start_date);
      }
      if (filterModel.end_date) {
        params = params.set('end_date', filterModel.end_date);
      }
      if (filterModel.client_id) {
        params = params.set('client_id', filterModel.client_id.toString());
      }
      if (filterModel.product_id) {
        params = params.set('product_id', filterModel.product_id.toString());
      }
      if (filterModel.min_total_price) {
        params = params.set('min_total_price', filterModel.min_total_price.toString());
      }
      if (filterModel.max_total_price) {
        params = params.set('max_total_price', filterModel.max_total_price.toString());
      }
    }

    return this.http.get<SalesPages>(this.url, { params });
  }


  getSaleById(id: string): Observable<ResponseSale> {
    return this.http.get<ResponseSale>(`${this.url}/${id}`);
  }

  deleteSale(saleId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${saleId}`);
  }
}
