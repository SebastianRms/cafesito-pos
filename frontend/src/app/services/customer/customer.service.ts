import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3001/api/customers';

  getOrCreate(data: { phone_or_email: string; name?: string }): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }
}