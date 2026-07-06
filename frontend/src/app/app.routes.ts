import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PosComponent } from './pos/pos.component';
import { AdminCatalogComponent } from './admin/admin-catalog/admin-catalog.component';
import { AdminInventoryComponent } from './admin/admin-inventory/admin-inventory.component';
import { AdminDiscountsComponent } from './admin/admin-discounts/admin-discounts.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'pos', component: PosComponent },
      { path: 'admin/catalog', component: AdminCatalogComponent },
      { path: 'admin/inventory', component: AdminInventoryComponent },
      { path: 'admin/discounts', component: AdminDiscountsComponent },
      { path: '', redirectTo: 'pos', pathMatch: 'full' }
    ]
  }
];
