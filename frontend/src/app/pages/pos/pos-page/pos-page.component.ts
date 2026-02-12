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
  const quantityToAdd = product.tempQuantity || 1; // Si no ha movido nada, es 1
  const existing = this.cart.find((item) => item.product_id === product._id);

  if (existing) {
    // Validamos que la suma no supere el stock
    if (existing.quantity + quantityToAdd <= product.stock) {
      existing.quantity += quantityToAdd;
    } else {
      alert('No puedes agregar más de lo que hay en stock');
    }
  } else {
    this.cart.push({
      product_id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantityToAdd,
    });
  }
  
  // Opcional: Resetear el selector a 1 después de agregar
  product.tempQuantity = 1;
}

  changeSelector(product: any, amount: number) {
  if (!product.tempQuantity) product.tempQuantity = 1;
  
  const newQuantity = product.tempQuantity + amount;
  
  // Validamos que no sea menos de 1 y no supere el stock disponible
  if (newQuantity >= 1 && newQuantity <= product.stock) {
    product.tempQuantity = newQuantity;
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


    this.salesService.createSale(saleRequest).subscribe({
      next: (res) => {
        this.cart.forEach(cartItem => {
        const product = this.products.find(p => p._id === cartItem.product_id);
        if (product) {
          product.stock -= cartItem.quantity; 
        }
      });
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
