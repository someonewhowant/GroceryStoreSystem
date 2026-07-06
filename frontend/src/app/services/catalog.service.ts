import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);
  private apiUrl = '/api/catalog';

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getItemByBarcode(barcode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${barcode}`);
  }

  createItem(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }

  deleteItem(barcode: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${barcode}`);
  }
}
