import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentMethod } from '../../../services/sales/sales.service';
import { CustomerService } from '../../../services/customer/customers.service';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale-form.component.html',
  styleUrl: './sale-form.component.css'
})
export class SaleFormComponent {
  private customerService = inject(CustomerService);

  @Output() onConfirm = new EventEmitter<{ method: PaymentMethod, customer_id?: string }>();

  method: PaymentMethod = 'cash';

  customerInput: string = '';   
  customerName: string = '';    
  isNewCustomer: boolean = false;
  selectedCustomer: any = null;
  errorMessage: string = '';

  
  setMethod(m: PaymentMethod): void {
    this.method = m;
  }

  
  searchCustomer(): void {
    const input = this.customerInput.trim();
    if (!input) return;

    this.errorMessage = '';
    
    this.customerService.getOrCreate({ phone_or_email: input }).subscribe({
      next: (customer) => {
        this.selectedCustomer = customer;
        this.isNewCustomer = false;
        this.customerName = customer.name;
        this.errorMessage = '';
      },
      error: (err) => {
        if (err.status === 404) {
          this.isNewCustomer = true;
          this.selectedCustomer = null;
          this.customerName = ''; 
        } else {
          this.errorMessage = 'Formato inválido. Usa 10 dígitos o un correo válido.';
        }
      }
    });
  }

  confirmSale(): void {
    if (this.isNewCustomer && !this.customerName.trim()) {
      alert("Por favor, ingresa el nombre para registrar al cliente nuevo.");
      return;
    }

    if (this.isNewCustomer) {
      this.customerService.getOrCreate({ 
        phone_or_email: this.customerInput, 
        name: this.customerName 
      }).subscribe({
        next: (newCustomer) => {
          this.onConfirm.emit({ 
            method: this.method, 
            customer_id: newCustomer._id 
          });
          this.clearCustomer(); 
        },
        error: () => alert("Error al registrar el cliente.")
      });
    } else {
      this.onConfirm.emit({ 
        method: this.method, 
        customer_id: this.selectedCustomer?._id 
      });
      this.clearCustomer(); 
    }
  }

  clearCustomer(): void {
    this.customerInput = '';
    this.customerName = '';
    this.isNewCustomer = false;
    this.selectedCustomer = null;
    this.errorMessage = '';
  }
}