import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-inventory.component.html',
  styleUrl: './admin-inventory.component.scss'
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
