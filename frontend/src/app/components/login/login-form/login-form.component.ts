import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
  @Output() loginSubmit = new EventEmitter<any>();
  @Input() error: string = ''; 

  credentials = { email: '', password: '' };

  onSubmit() {
    this.loginSubmit.emit(this.credentials);
  }
}