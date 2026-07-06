import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <h2>Inventory Management</h2>
      <p>Inventory Placeholder</p>
    </div>
  `,
  styles: [`
    .admin-container {
      color: var(--text-primary);
    }
  `]
})
export class AdminInventoryComponent {}
