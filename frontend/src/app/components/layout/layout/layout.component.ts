import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from '../../toast/toast-container.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  readonly authService = inject(AuthService);
  private router = inject(Router);

  isPosRoute(): boolean {
    return this.router.url === '/pos';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
