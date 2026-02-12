import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PaymentMethod,
  SalesService,
} from '../../../services/sales/sales.service';
import { SaleFormComponent } from '../../../components/sale/sale-form/sale-form.component';
import { SaleTicketComponent } from '../../../components/sale/sale-ticket/sale-ticket.component';

@Component({
  selector: 'app-pos-page',
  standalone: true,
  imports: [CommonModule, SaleFormComponent, SaleTicketComponent],
  templateUrl: './pos-page.component.html',
})
export class PosPageComponent implements OnInit {
  private salesService = inject(SalesService);

  // Estado de la página
  products: any[] = []; // Catálogo que viene del Back
  cart: any[] = []; // Lo que el cliente lleva ahora
  selectedCustomerId: string | null = null;
  showTicket = false;
  lastTicket: any = null;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    // Primera flecha del diagrama: Cargar lista
    this.salesService
      .getProducts()
      .subscribe((res) => (this.products = res.data));
  }

  addToCart(product: any) {
    // 1. Usar product_id (con guion bajo) para ser consistentes con el contrato
    const existing = this.cart.find((item) => item.product_id === product._id);

    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({
        product_id: product._id, // CAMBIADO: de productId a product_id
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }
  }

  processSale(method: PaymentMethod) {
    const saleRequest = {
      customer_id: this.selectedCustomerId || null,
      payment_method: method,
      items: this.cart.map((item) => ({
        product_id: item.product_id, // AHORA SÍ: coincidirá con lo que guardaste arriba
        quantity: item.quantity,
      })),
    };

    console.log('📦 Enviando a la API:', JSON.stringify(saleRequest, null, 2));

    this.salesService.createSale(saleRequest).subscribe({
      next: (res) => {
        this.lastTicket = res.ticket;
        this.showTicket = true;
        this.cart = [];
      },
      error: (err) => {
        alert(
          'Error: ' + (err.error.message || 'No se pudo procesar la venta'),
        );
      },
    });
  }

  get total(): number {
  return this.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
}
}
