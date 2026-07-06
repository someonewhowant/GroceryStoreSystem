import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private http = inject(HttpClient);
  private apiUrl = '/api/checkout/orders';

  orderId = signal<string | null>(null);
  cartState = signal<any>({ items: [], subtotal: 0, total: 0 });

  startOrder(): Observable<any> {
    return this.http.post<any>(this.apiUrl, {}).pipe(
      tap(res => {
        if (res.orderId) {
          this.orderId.set(res.orderId);
          this.refreshCartState().subscribe();
        }
      })
    );
  }

  addItem(barcode: string, quantity: number): Observable<any> {
    const id = this.orderId();
    if (!id) throw new Error('Order not started');
    
    return this.http.post<any>(`${this.apiUrl}/${id}/items`, { barcode, quantity }).pipe(
      tap(() => this.refreshCartState().subscribe())
    );
  }

  getCartState(): Observable<any> {
    const id = this.orderId();
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  refreshCartState(): Observable<any> {
    return this.getCartState().pipe(
      tap(state => this.cartState.set(state))
    );
  }

  pay(amount: number): Observable<any> {
    const id = this.orderId();
    if (!id) throw new Error('Order not started');

    return this.http.post<any>(`${this.apiUrl}/${id}/pay`, { paymentAmount: amount }).pipe(
      tap(() => {
        this.orderId.set(null);
        this.cartState.set({ items: [], subtotal: 0, total: 0 });
      })
    );
  }
}
