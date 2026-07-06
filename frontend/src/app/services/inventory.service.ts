import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = '/api/inventory';

  getStock(barcode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${barcode}`);
  }

  updateStock(barcode: string, count: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${barcode}`, { count });
  }
}
