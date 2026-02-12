import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginFormComponent } from '../../../components/login/login-form/login-form.component';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage: string = '';

   
  handleLogin(credentials: any) {
    this.errorMessage = '';

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login exitoso, bienvenido a Cafecito Feliz');
        this.router.navigate(['/pos']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error de conexión con el servidor';
        console.error('Error en el login:', err);
      }
    });
  }
}