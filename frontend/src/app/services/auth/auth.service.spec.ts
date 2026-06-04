import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería inicializarse con estado vacío (no autenticado)', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.userRole()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.getRole()).toBeNull();
  });

  it('debería actualizar el estado tras un login exitoso', () => {
    const mockCredentials = { email: 'admin@cafecito.com', password: 'password' };
    const mockResponse = {
      token: 'jwt-token-xyz',
      user: { role: 'admin' }
    };

    service.login(mockCredentials).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.isAuthenticated()).toBeTrue();
    expect(service.userRole()).toBe('admin');
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.getRole()).toBe('admin');
    
    expect(localStorage.getItem('token')).toBe('jwt-token-xyz');
    expect(localStorage.getItem('role')).toBe('admin');
  });

  it('debería limpiar el estado al hacer logout', () => {
    localStorage.setItem('token', 'jwt-token-xyz');
    localStorage.setItem('role', 'admin');
    const expiresAt = Date.now() + 10000;
    localStorage.setItem('expiresAt', expiresAt.toString());

    // Reinicializar para cargar de localStorage
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);

    expect(service.isAuthenticated()).toBeTrue();

    service.logout();

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.userRole()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
