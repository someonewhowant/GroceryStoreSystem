import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutService } from '../../services/checkout.service';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent {
  checkoutService = inject(CheckoutService);

  barcodeInput = '';
  quantityInput = 1;
  errorMsg = signal<string>('');
  
  showPaymentModal = signal<boolean>(false);
  paymentAmount = 0;
  paymentError = signal<string>('');
  
  receiptData = signal<any>(null);

  startOrder() {
    this.checkoutService.startOrder().subscribe({
      next: () => this.errorMsg.set(''),
      error: (err) => this.errorMsg.set('Failed to start order')
    });
  }

  addItem() {
    this.errorMsg.set('');
    this.checkoutService.addItem(this.barcodeInput, this.quantityInput).subscribe({
      next: () => {
        this.barcodeInput = '';
        this.quantityInput = 1;
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Error adding item');
      }
    });
  }

  processPayment() {
    this.paymentError.set('');
    this.checkoutService.pay(this.paymentAmount).subscribe({
      next: (res) => {
        this.showPaymentModal.set(false);
        this.receiptData.set(res.receipt);
        this.paymentAmount = 0;
      },
      error: (err) => {
        this.paymentError.set(err.error?.message || 'Payment failed');
      }
    });
  }

  closeReceipt() {
    this.receiptData.set(null);
  }
}
