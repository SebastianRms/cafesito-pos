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

  products: any[] = []; 
  cart: any[] = []; 
  selectedCustomerId: string | null = null;
  showTicket = false;
  lastTicket: any = null;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.salesService
      .getProducts()
      .subscribe((res) => (this.products = res.data));
  }

  addToCart(product: any) {
  const quantityToAdd = product.tempQuantity || 1; 
  const existing = this.cart.find((item) => item.product_id === product._id);

  if (existing) {
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
  
  product.tempQuantity = 1;
}

  changeSelector(product: any, amount: number) {
  if (!product.tempQuantity) product.tempQuantity = 1;
  
  const newQuantity = product.tempQuantity + amount;
  
  if (newQuantity >= 1 && newQuantity <= product.stock) {
    product.tempQuantity = newQuantity;
  }
}

  processSale(saleData: { method: PaymentMethod, customer_id?: string }) {
  if (this.cart.length === 0) return alert("Carrito vacío");

  const saleRequest = {
    customer_id: saleData.customer_id || null, 
    payment_method: saleData.method,
    items: this.cart.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    })),
  };

  this.salesService.createSale(saleRequest).subscribe({
    next: (res) => {
      this.lastTicket = res.ticket;
      this.showTicket = true;
      this.cart = [];
    },
    error: (err) => {
      console.log('Errores de Zod:', err.error.errors);
      alert('Error: ' + (err.error.message || 'No se pudo procesar la venta'));
    }
  });
}

  get total(): number {
  return this.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
}

}
