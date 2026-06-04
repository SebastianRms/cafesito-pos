export type PaymentMethod = 'cash' | 'card' | 'transfer';

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  getProducts(page: number = 1, limit: number = 12): Observable<any> {
    return this.http.get(`${this.apiUrl}/products?page=${page}&limit=${limit}`);
  }

  searchCustomer(query: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/customers`, { phone_or_email: query });
  }


createSale(saleData: { 
  customer_id: string | null; 
  items: Array<{ product_id: string; quantity: number }>; 
  payment_method: PaymentMethod; 
}): Observable<any> {
  return this.http.post(`${this.apiUrl}/sales`, saleData);
}
}