import { Component, EventEmitter, inject, Output } from '@angular/core';
import { PaymentMethod } from '../../../services/sales/sales.service';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer/customer.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sale-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './sale-form.component.html',
  styleUrl: './sale-form.component.css',
})
export class SaleFormComponent {
  private customerService = inject(CustomerService);

  @Output() onConfirm = new EventEmitter<PaymentMethod>();
  @Output() onCustomerSelected = new EventEmitter<string | null>();

  method: PaymentMethod = 'cash';
  errorMessage: string | null = null;

  customerQuery = '';
  customerName = '';
  selectedCustomer: any = null;
  isNew = false;

  checkCustomer() {
    this.errorMessage = null;
    this.isNew = false;
    this.selectedCustomer = null;

    this.customerService
      .getOrCreate({ phone_or_email: this.customerQuery })
      .subscribe({
        next: (res) => {
          this.selectedCustomer = res;
          this.isNew = false;
          this.onCustomerSelected.emit(res._id); 
        },
        error: (err) => {
      if (err.status === 404) {
        this.isNew = true;
      } else if (err.status === 422) {
        alert(" Formato incorrecto:\n- El teléfono debe ser de 10 dígitos.\n- O el email debe ser válido.");
      } else {
        alert(" Error de conexión con el servidor.");
      }
    },
      });
  }

  confirmNewCustomer() {
    this.customerService
      .getOrCreate({
        phone_or_email: this.customerQuery,
        name: this.customerName,
      })
      .subscribe((res) => {
        this.selectedCustomer = res;
        this.isNew = false;
        this.onCustomerSelected.emit(res._id);
      });
  }

  removeCustomer() {
    this.selectedCustomer = null;
    this.onCustomerSelected.emit(null);
  }

  setMethod(m: PaymentMethod): void {
    this.method = m;
  }

confirmSale(): void {
  this.onConfirm.emit(this.method);
  this.resetCustomer(); 
}

resetCustomer(): void {
  this.selectedCustomer = null;
  this.customerQuery = '';
  this.customerName = '';
  this.isNew = false;
  this.onCustomerSelected.emit(null); 
}


}