import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTicketComponent } from './sale-ticket.component';

describe('SaleTicketComponent', () => {
  let component: SaleTicketComponent;
  let fixture: ComponentFixture<SaleTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
