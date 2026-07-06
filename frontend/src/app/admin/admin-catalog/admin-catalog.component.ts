import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-admin-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-catalog.component.html',
  styleUrl: './admin-catalog.component.scss'
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
