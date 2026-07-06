import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private http = inject(HttpClient);
  private apiUrl = '/api/discounts';

  getCampaigns(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createCampaign(campaign: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, campaign);
  }
}
