import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
   @Output() registerSubmit = new EventEmitter<any>();
  @Input() error: string = ''; 

  credentials = { name: '', email: '', password: '', role: 'vendor' };

  onSubmit() {
    this.registerSubmit.emit(this.credentials);
  }
}
