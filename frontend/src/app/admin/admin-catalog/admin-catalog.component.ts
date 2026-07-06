import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-admin-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="header-actions">
        <h2>Catalog Management</h2>
      </div>

      <div class="layout-grid">
        <div class="glass-panel form-panel">
          <h3>Add New Product</h3>
          <form (ngSubmit)="onSubmit()" #itemForm="ngForm">
            <div class="form-group">
              <label>Barcode</label>
              <input type="text" [(ngModel)]="newItem.barcode" name="barcode" required>
            </div>
            <div class="form-group">
              <label>Name</label>
              <input type="text" [(ngModel)]="newItem.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Category</label>
              <input type="text" [(ngModel)]="newItem.category" name="category" required>
            </div>
            <div class="form-group">
              <label>Price (cents)</label>
              <input type="number" [(ngModel)]="newItem.price" name="price" required>
            </div>
            <button type="submit" class="btn-primary" [disabled]="!itemForm.valid">Save Product</button>
          </form>
        </div>

        <div class="glass-panel table-panel">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of items()">
                <td>{{ item.barcode }}</td>
                <td>{{ item.name }}</td>
                <td><span class="badge">{{ item.category }}</span></td>
                <td>{{ (item.price / 100) | currency }}</td>
                <td>
                  <button class="btn-danger" (click)="deleteItem(item.barcode)">Delete</button>
                </td>
              </tr>
              <tr *ngIf="items().length === 0">
                <td colspan="5" class="empty-state">No products found. Add one!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .layout-grid {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 2rem;
      align-items: start;
    }
    .header-actions {
      margin-bottom: 2rem;
    }
    h2, h3 {
      margin-top: 0;
      color: var(--text-primary);
    }
    .badge {
      background: rgba(99, 102, 241, 0.2);
      color: var(--primary-color);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .empty-state {
      text-align: center;
      color: var(--text-muted);
      padding: 3rem !important;
    }
  `]
})
export class AdminCatalogComponent implements OnInit {
  private catalogService = inject(CatalogService);
  
  items = signal<any[]>([]);
  newItem = { barcode: '', name: '', category: '', price: null };

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.catalogService.getItems().subscribe(data => this.items.set(data));
  }

  onSubmit() {
    if (this.newItem.barcode && this.newItem.name) {
      this.catalogService.createItem(this.newItem).subscribe(() => {
        this.loadItems();
        this.newItem = { barcode: '', name: '', category: '', price: null };
      });
    }
  }

  deleteItem(barcode: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.catalogService.deleteItem(barcode).subscribe(() => this.loadItems());
    }
  }
}
