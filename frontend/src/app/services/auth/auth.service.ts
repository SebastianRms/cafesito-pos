import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3001/api/auth';


register(data: any): Observable<any> {
  const url = `${this.baseUrl}/register`; 
  return this.http.post<any>(url, data);
}

  login(credentials: any) {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.user.role);

        const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
        localStorage.setItem('expiresAt', expiresAt.toString()); 
      }),
    );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expiresAt');

    if (!token || !expiresAt) return false;

    return Date.now() < Number(expiresAt);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  logout() {
    localStorage.clear();
  }
}
