import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="header-actions">
        <h2>Inventory Management</h2>
      </div>

      <div class="glass-panel">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Product Name</th>
              <th>Current Stock</th>
              <th>Quick Update</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of inventoryItems()">
              <td>{{ item.barcode }}</td>
              <td>{{ item.name }}</td>
              <td>
                <span class="stock-badge" [class.low-stock]="item.stockCount < 10">
                  {{ item.stockCount }}
                </span>
              </td>
              <td>
                <div class="stock-actions">
                  <input type="number" [(ngModel)]="item.adjustAmount" class="small-input" placeholder="Qty">
                  <button class="btn-primary" (click)="updateStock(item)">Add</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="inventoryItems().length === 0">
              <td colspan="4" class="empty-state">No items found in catalog.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .header-actions { margin-bottom: 2rem; }
    h2 { margin-top: 0; color: var(--text-primary); }
    .stock-badge {
      background: rgba(16, 185, 129, 0.2);
      color: var(--success);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-weight: 600;
    }
    .stock-badge.low-stock {
      background: rgba(239, 68, 68, 0.2);
      color: var(--danger);
    }
    .stock-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .small-input {
      width: 80px;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 0.4rem;
      color: white;
    }
    .empty-state {
      text-align: center;
      color: var(--text-muted);
      padding: 3rem !important;
    }
  `]
})
export class AdminInventoryComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private catalogService = inject(CatalogService);

  inventoryItems = signal<any[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.catalogService.getItems().subscribe(catalog => {
      const items = catalog.map(c => ({
        barcode: c.barcode,
        name: c.name,
        stockCount: 0,
        adjustAmount: null
      }));
      
      this.inventoryItems.set(items);
      
      // Load actual stock for each item
      items.forEach((item, index) => {
        this.inventoryService.getStock(item.barcode).subscribe(res => {
          this.inventoryItems.update(current => {
            const updated = [...current];
            updated[index].stockCount = res.stockCount || 0;
            return updated;
          });
        });
      });
    });
  }

  updateStock(item: any) {
    if (item.adjustAmount) {
      this.inventoryService.updateStock(item.barcode, item.adjustAmount).subscribe(res => {
        item.stockCount = res.stockCount;
        item.adjustAmount = null;
      });
    }
  }
}
