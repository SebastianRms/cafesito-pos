import { Component, EventEmitter, Output } from '@angular/core';
import { PaymentMethod } from '../../../services/sales/sales.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sale-form',
  imports: [CommonModule],
  templateUrl: './sale-form.component.html',
  styleUrl: './sale-form.component.css'
})
export class SaleFormComponent {
  @Output() onConfirm = new EventEmitter<PaymentMethod>();

  method: PaymentMethod = 'cash';

  setMethod(m: PaymentMethod): void {
    this.method = m;
  }

  confirmSale(): void {
    this.onConfirm.emit(this.method);
  }
}
