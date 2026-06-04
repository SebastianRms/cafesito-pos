import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleFormComponent } from './sale-form.component';
import { FormsModule } from '@angular/forms';
import { ComponentRef } from '@angular/core';
import { ToastService } from '../../../services/toast/toast.service';

describe('SaleFormComponent', () => {
  let component: SaleFormComponent;
  let fixture: ComponentFixture<SaleFormComponent>;
  let componentRef: ComponentRef<SaleFormComponent>;
  let mockToastService: any;

  beforeEach(async () => {
    mockToastService = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning'),
      info: jasmine.createSpy('info')
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, SaleFormComponent],
      providers: [
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SaleFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir searchCustomerEvent al hacer clic en Validar', () => {
    const searchSpy = spyOn(component.searchCustomerEvent, 'emit');
    component.customerInput = '1234567890';
    component.searchCustomer();
    
    expect(searchSpy).toHaveBeenCalledWith('1234567890');
  });

  it('debería cambiar el método de pago localmente', () => {
    component.setMethod('card');
    expect(component.method).toBe('card');
  });

  it('debería emitir confirmSaleEvent con los datos correctos', () => {
    const confirmSpy = spyOn(component.confirmSaleEvent, 'emit');
    component.method = 'transfer';
    component.customerInput = 'test@cafecito.com';
    
    componentRef.setInput('isNewCustomer', false);
    fixture.detectChanges();

    component.confirmSale();
    expect(confirmSpy).toHaveBeenCalledWith({
      method: 'transfer',
      customerInput: 'test@cafecito.com',
      customerName: undefined
    });
  });

  it('debería disparar un warning de toast si intenta confirmar un nuevo cliente sin nombre', () => {
    const confirmSpy = spyOn(component.confirmSaleEvent, 'emit');

    componentRef.setInput('isNewCustomer', true);
    component.customerName = ''; 
    fixture.detectChanges();

    component.confirmSale();
    
    expect(mockToastService.warning).toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('debería emitir resetCustomerEvent y limpiar estado al hacer clearCustomer', () => {
    const resetSpy = spyOn(component.resetCustomerEvent, 'emit');
    component.customerInput = '123';
    component.customerName = 'Juan';
    component.method = 'card';

    component.clearCustomer();

    expect(component.customerInput).toBe('');
    expect(component.customerName).toBe('');
    expect(component.method).toBe('cash');
    expect(resetSpy).toHaveBeenCalled();
  });
});
