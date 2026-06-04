import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentMethod } from '../../../services/sales/sales.service';
import { ToastService } from '../../../services/toast/toast.service';

export interface ConfirmSaleEvent {
  method: PaymentMethod;
  customerInput: string;
  customerName?: string;
}

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale-form.component.html',
  styleUrl: './sale-form.component.css'
})
export class SaleFormComponent {
  private toastService = inject(ToastService);

  readonly selectedCustomer = input<any | null>(null);
  readonly isNewCustomer = input<boolean>(false);
  readonly errorMessage = input<string>('');

  readonly searchCustomerEvent = output<string>();
  readonly confirmSaleEvent = output<ConfirmSaleEvent>();
  readonly resetCustomerEvent = output<void>();

  method: PaymentMethod = 'cash';
  customerInput: string = '';   
  customerName: string = '';    

  setMethod(m: PaymentMethod): void {
    this.method = m;
  }

  searchCustomer(): void {
    const inputVal = this.customerInput.trim();
    if (!inputVal) {
      this.toastService.warning('Por favor, ingresa un teléfono o correo electrónico.');
      return;
    }
    this.searchCustomerEvent.emit(inputVal);
  }

  confirmSale(): void {
    if (this.isNewCustomer() && !this.customerName.trim()) {
      this.toastService.warning('Por favor, ingresa el nombre para registrar al nuevo socio.');
      return;
    }

    this.confirmSaleEvent.emit({
      method: this.method,
      customerInput: this.customerInput,
      customerName: this.isNewCustomer() ? this.customerName : undefined
    });
  }

  clearCustomer(): void {
    this.customerInput = '';
    this.customerName = '';
    this.method = 'cash';
    this.resetCustomerEvent.emit();
  }
}