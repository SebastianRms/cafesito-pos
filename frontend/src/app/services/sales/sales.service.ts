export type PaymentMethod = 'cash' | 'card' | 'transfer';

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3001/api';

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
  }

  searchCustomer(query: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/customers`, { phone_or_email: query });
  }

  createSale(saleData: { 
    customerId: string | null; 
    items: Array<{ productId: string; quantity: number }>; 
    paymentMethod: PaymentMethod; 
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/sales`, saleData);
  }
}