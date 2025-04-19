import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Transfert } from '../../interfaces/Transferts/Tranfert';
import { TransfertFilter } from '../../interfaces/Transferts/Transfert-filter';


@Injectable({
  providedIn: 'root'
})
export class TransfertsService {
  private baseUrl: string = environment.apiUrl;
  private transferUrl: string = `${this.baseUrl}/api/transfer`;

  constructor(private http: HttpClient) {}

  /**
   * Crée un nouveau transfert.
   */
  createTransfer(payload: Partial<Transfert>): Observable<Transfert> {
    return this.http.post<Transfert>(this.transferUrl, payload);
  }

  /**
   * Récupère la liste des transferts, éventuellement filtrée.
   */
  getTransfers(filter?: TransfertFilter): Observable<Transfert[]> {
    let params = new HttpParams();

    if (filter) {
      if (filter.startDate) { params = params.set('start_date', filter.startDate); }
      if (filter.endDate)   { params = params.set('end_date',   filter.endDate); }
      if (filter.fromType)  { params = params.set('from_type',  filter.fromType); }
      if (filter.fromId)    { params = params.set('from_id',    filter.fromId.toString()); }
      if (filter.toType)    { params = params.set('to_type',    filter.toType); }
      if (filter.toId)      { params = params.set('to_id',      filter.toId.toString()); }
    }

    return this.http.get<Transfert[]>(this.transferUrl, { params });
  }

}
