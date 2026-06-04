import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryComponent } from './inventory.component';
import { ProductService } from '../../../services/product/product.service';
import { ToastService } from '../../../services/toast/toast.service';
import { of } from 'rxjs';

describe('InventoryComponent', () => {
  let component: InventoryComponent;
  let fixture: ComponentFixture<InventoryComponent>;
  let mockProductService: any;
  let mockToastService: any;

  beforeEach(async () => {
    mockProductService = {
      getProducts: jasmine.createSpy('getProducts').and.returnValue(of({ data: [] })),
      createProduct: jasmine.createSpy('createProduct').and.returnValue(of({})),
      updateProduct: jasmine.createSpy('updateProduct').and.returnValue(of({})),
      deleteProduct: jasmine.createSpy('deleteProduct').and.returnValue(of({}))
    };

    mockToastService = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning'),
      info: jasmine.createSpy('info')
    };

    await TestBed.configureTestingModule({
      imports: [InventoryComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ToastService, useValue: mockToastService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse y cargar productos', () => {
    expect(component).toBeTruthy();
    expect(mockProductService.getProducts).toHaveBeenCalled();
  });
});
