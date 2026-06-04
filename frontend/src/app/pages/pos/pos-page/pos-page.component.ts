import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentMethod, SalesService } from '../../../services/sales/sales.service';
import { CustomerService } from '../../../services/customer/customers.service';
import { CartStore } from '../../../services/sales/cart.store';
import { ToastService } from '../../../services/toast/toast.service';
import { SaleFormComponent, ConfirmSaleEvent } from '../../../components/sale/sale-form/sale-form.component';
import { SaleTicketComponent } from '../../../components/sale/sale-ticket/sale-ticket.component';

@Component({
  selector: 'app-pos-page',
  standalone: true,
  imports: [CommonModule, SaleFormComponent, SaleTicketComponent],
  templateUrl: './pos-page.component.html',
})
export class PosPageComponent implements OnInit {
  private salesService = inject(SalesService);
  private customerService = inject(CustomerService);
  readonly cartStore = inject(CartStore);
  private toastService = inject(ToastService);

  readonly products = signal<any[]>([]);
  readonly showTicket = signal<boolean>(false);
  readonly lastTicket = signal<any>(null);

  readonly tempQuantities = signal<Record<string, number>>({});

  readonly selectedCustomer = signal<any | null>(null);
  readonly isNewCustomer = signal<boolean>(false);
  readonly customerErrorMessage = signal<string>('');

  readonly currentPage = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly limit = 12;

  ngOnInit() {
    this.loadProducts();
    this.cartStore.clear();
  }

  loadProducts() {
    this.salesService.getProducts(this.currentPage(), this.limit).subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.totalPages.set(res.pages || Math.ceil((res.total || 0) / this.limit) || 1);
      },
      error: (err) => {
        console.error('Error al cargar catálogo:', err);
        this.toastService.error('Error al cargar el catálogo de productos.');
      }
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadProducts();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadProducts();
    }
  }

  getTempQuantity(productId: string): number {
    return this.tempQuantities()[productId] || 1;
  }

  changeSelector(product: any, amount: number) {
    const current = this.tempQuantities()[product._id] || 1;
    const nextVal = current + amount;
    
    if (nextVal >= 1 && nextVal <= product.stock) {
      this.tempQuantities.update(q => ({
        ...q,
        [product._id]: nextVal
      }));
    } else if (nextVal > product.stock) {
      this.toastService.warning(`Solo hay ${product.stock} unidades de este café en stock.`);
    }
  }

  addToCart(product: any) {
    const qty = this.getTempQuantity(product._id);
    this.cartStore.addToCart(product, qty);
    
    this.tempQuantities.update(q => ({
      ...q,
      [product._id]: 1
    }));
    
    this.toastService.success(`Agregado al pedido: ${qty}x ${product.name}`);
  }

  handleSearchCustomer(input: string) {
    this.customerErrorMessage.set('');
    
    this.customerService.getOrCreate({ phone_or_email: input }).subscribe({
      next: (customer) => {
        this.selectedCustomer.set(customer);
        this.isNewCustomer.set(false);
        this.customerErrorMessage.set('');
        this.toastService.success(`Socio identificado: ${customer.name}`);
      },
      error: (err) => {
        if (err.status === 404) {
          this.isNewCustomer.set(true);
          this.selectedCustomer.set(null);
          this.customerErrorMessage.set('');
          this.toastService.info('Socio no registrado. Ingresa un nombre para afiliarlo.');
        } else {
          this.customerErrorMessage.set('Formato inválido. Usa 10 dígitos o un correo válido.');
          this.toastService.error('Formato de identificación inválido.');
        }
      }
    });
  }

  handleConfirmSale(event: ConfirmSaleEvent) {
    if (this.cartStore.items().length === 0) {
      this.toastService.warning('Tu pedido está vacío. Agrega productos antes de cobrar.');
      return;
    }

    if (event.customerName) {
      this.customerService.getOrCreate({
        phone_or_email: event.customerInput,
        name: event.customerName
      }).subscribe({
        next: (newCustomer) => {
          this.toastService.success(`Socio nuevo registrado con éxito.`);
          this.executeSale(event.method, newCustomer._id);
        },
        error: () => {
          this.toastService.error('Error al registrar el socio nuevo en el servidor.');
        }
      });
    } else {
      this.executeSale(event.method, this.selectedCustomer()?._id || null);
    }
  }

  private executeSale(method: PaymentMethod, customerId: string | null) {
    const saleRequest = {
      customer_id: customerId,
      payment_method: method,
      items: this.cartStore.items().map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }))
    };

    this.salesService.createSale(saleRequest).subscribe({
      next: (res) => {
        this.lastTicket.set(res.ticket);
        this.showTicket.set(true);
        this.cartStore.clear();
        this.resetCustomerState();
        this.loadProducts(); 
        this.toastService.success('Venta procesada con éxito. Ticket generado.');
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'No se pudo procesar la venta.');
      }
    });
  }

  resetCustomerState() {
    this.selectedCustomer.set(null);
    this.isNewCustomer.set(false);
    this.customerErrorMessage.set('');
  }
}
