import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-catalog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <h2>Catalog Management</h2>
      <p>Catalog Placeholder</p>
    </div>
  `,
  styles: [`
    .admin-container {
      color: var(--text-primary);
    }
  `]
})
export class AdminCatalogComponent {}
