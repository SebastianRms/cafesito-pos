import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthState {
  token: string | null;
  role: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/auth';

  // 1. Estado reactivo interno privado
  private state = signal<AuthState>({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role')
  });

  // 2. Signals reactivos de solo lectura para consumo externo (como el layout)
  readonly isAuthenticated = computed(() => {
    const token = this.state().token;
    const expiresAt = localStorage.getItem('expiresAt');
    if (!token || !expiresAt) return false;
    return Date.now() < Number(expiresAt);
  });

  readonly userRole = computed(() => this.state().role);

  register(data: any): Observable<any> {
    const url = `${this.baseUrl}/register`; 
    return this.http.post<any>(url, data);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res) => {
        const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
        
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('expiresAt', expiresAt.toString()); 

        // Actualizar el estado para notificar reactivamente
        this.state.set({
          token: res.token,
          role: res.user.role
        });
      }),
    );
  }

  // 3. Métodos síncronos para compatibilidad con Guards
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getRole(): string | null {
    return this.state().role;
  }

  logout() {
    localStorage.clear();
    // Limpiar el estado de los signals
    this.state.set({
      token: null,
      role: null
    });
  }
}
