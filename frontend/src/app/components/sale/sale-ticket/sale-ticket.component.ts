import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sale-ticket',
  imports: [CommonModule],
  templateUrl: './sale-ticket.component.html',
  styleUrl: './sale-ticket.component.css'
})
export class SaleTicketComponent {
  @Input() ticket: any; 
  @Output() onClose = new EventEmitter<void>();
}
