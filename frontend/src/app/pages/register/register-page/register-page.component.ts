import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RegisterFormComponent } from '../../../components/register/register-form/register-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, RegisterFormComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);


  errorMessage: string = '';

handleRegister(credentials: any) {
  this.errorMessage = '';

  this.authService.register(credentials).subscribe({
    next: (response) => {
      console.log('Registro exitoso en Cafecito Feliz');
      
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Error al crear la cuenta. Intenta de nuevo.';
      console.error('Error en el registro:', err);
    }
  });
}

}
