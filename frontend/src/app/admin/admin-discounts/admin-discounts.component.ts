import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-discounts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <h2>Discount Campaigns Management</h2>
      <p>Discounts Placeholder</p>
    </div>
  `,
  styles: [`
    .admin-container {
      color: var(--text-primary);
    }
  `]
})
export class AdminDiscountsComponent {}
