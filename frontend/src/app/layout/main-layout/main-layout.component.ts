import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <div class="logo">Grocery Store</div>
      <nav>
        <a routerLink="/pos" routerLinkActive="active">POS</a>
        <a routerLink="/admin/catalog" routerLinkActive="active">Catalog</a>
        <a routerLink="/admin/inventory" routerLinkActive="active">Inventory</a>
        <a routerLink="/admin/discounts" routerLinkActive="active">Discounts</a>
      </nav>
    </header>
    <main class="app-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-color);
    }
    .logo {
      font-weight: bold;
      font-size: 1.25rem;
      color: var(--text-primary);
    }
    nav a {
      margin-left: 1rem;
      text-decoration: none;
      color: var(--text-secondary);
    }
    nav a.active {
      color: var(--primary-color);
    }
    .app-content {
      padding: 2rem;
    }
  `]
})
export class MainLayoutComponent {}
