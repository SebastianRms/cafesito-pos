import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosPageComponent } from './pos-page.component';
import { SalesService } from '../../../services/sales/sales.service';
import { CustomerService } from '../../../services/customer/customers.service';
import { CartStore } from '../../../services/sales/cart.store';
import { ToastService } from '../../../services/toast/toast.service';
import { of, throwError } from 'rxjs';

describe('PosPageComponent', () => {
  let component: PosPageComponent;
  let fixture: ComponentFixture<PosPageComponent>;
  
  let mockSalesService: any;
  let mockCustomerService: any;
  let mockToastService: any;
  let cartStore: CartStore;

  beforeEach(async () => {
    mockSalesService = {
      getProducts: jasmine.createSpy('getProducts').and.returnValue(of({ data: [
        { _id: 'p1', name: 'Café', price: 10, stock: 5 },
        { _id: 'p2', name: 'Muffin', price: 20, stock: 0 }
      ]})),
      createSale: jasmine.createSpy('createSale').and.returnValue(of({ ticket: { id: 't1' } }))
    };

    mockCustomerService = {
      getOrCreate: jasmine.createSpy('getOrCreate').and.returnValue(of({ _id: 'c1', name: 'Juan' }))
    };

    mockToastService = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning'),
      info: jasmine.createSpy('info')
    };

    await TestBed.configureTestingModule({
      imports: [PosPageComponent],
      providers: [
        { provide: SalesService, useValue: mockSalesService },
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: ToastService, useValue: mockToastService },
        CartStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PosPageComponent);
    component = fixture.componentInstance;
    cartStore = TestBed.inject(CartStore);
    fixture.detectChanges();
  });

  it('debería crearse y cargar el catálogo de productos', () => {
    expect(component).toBeTruthy();
    expect(mockSalesService.getProducts).toHaveBeenCalled();
    expect(component.products().length).toBe(2);
  });

  it('debería cambiar la cantidad temporal sin mutar el producto original', () => {
    const product = component.products()[0]; 
    expect(component.getTempQuantity(product._id)).toBe(1);

    component.changeSelector(product, 2);
    expect(component.getTempQuantity(product._id)).toBe(3);

    component.changeSelector(product, 3);
    expect(component.getTempQuantity(product._id)).toBe(3);

    component.changeSelector(product, -1);
    expect(component.getTempQuantity(product._id)).toBe(2);
  });

  it('debería agregar productos al CartStore y reiniciar la cantidad temporal', () => {
    const product = component.products()[0];
    component.changeSelector(product, 2); 
    
    component.addToCart(product);

    expect(cartStore.items().length).toBe(1);
    expect(cartStore.items()[0].quantity).toBe(3);
    expect(component.getTempQuantity(product._id)).toBe(1);
  });

  it('debería buscar un cliente y actualizar el estado reactivo', () => {
    mockCustomerService.getOrCreate.and.returnValue(of({ _id: 'c2', name: 'Maria', purchases_count: 3 }));
    
    component.handleSearchCustomer('555-555');
    
    expect(mockCustomerService.getOrCreate).toHaveBeenCalledWith({ phone_or_email: '555-555' });
    expect(component.selectedCustomer()).toEqual({ _id: 'c2', name: 'Maria', purchases_count: 3 });
    expect(component.isNewCustomer()).toBeFalse();
  });

  it('debería establecer isNewCustomer si la búsqueda del cliente retorna 404', () => {
    mockCustomerService.getOrCreate.and.returnValue(throwError(() => ({ status: 404 })));
    
    component.handleSearchCustomer('notfound');
    
    expect(component.isNewCustomer()).toBeTrue();
    expect(component.selectedCustomer()).toBeNull();
  });

  it('debería procesar la venta registrando primero al cliente si es un socio nuevo', () => {
    cartStore.addToCart({ _id: 'p1', name: 'Café', price: 10, stock: 5 }, 1);
    mockCustomerService.getOrCreate.and.returnValue(of({ _id: 'cNew', name: 'Pedro' }));
    
    const event = {
      method: 'cash' as any,
      customerInput: '555-000',
      customerName: 'Pedro'
    };

    component.handleConfirmSale(event);

    expect(mockCustomerService.getOrCreate).toHaveBeenCalledWith({
      phone_or_email: '555-000',
      name: 'Pedro'
    });
    expect(mockSalesService.createSale).toHaveBeenCalledWith({
      customer_id: 'cNew',
      payment_method: 'cash',
      items: [{ product_id: 'p1', quantity: 1 }]
    });
  });

  it('debería procesar la venta directamente si es un cliente existente', () => {
    cartStore.addToCart({ _id: 'p1', name: 'Café', price: 10, stock: 5 }, 2);
    
    component.selectedCustomer.set({ _id: 'cExisting', name: 'Juan' });

    const event = {
      method: 'card' as any,
      customerInput: 'juan@email.com',
      customerName: undefined
    };

    component.handleConfirmSale(event);

    expect(mockSalesService.createSale).toHaveBeenCalledWith({
      customer_id: 'cExisting',
      payment_method: 'card',
      items: [{ product_id: 'p1', quantity: 2 }]
    });
    expect(cartStore.items().length).toBe(0); 
    expect(component.selectedCustomer()).toBeNull(); 
  });
});
