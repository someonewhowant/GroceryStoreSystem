import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pos-container">
      <h2>Point of Sale</h2>
      <p>POS Interface Placeholder</p>
    </div>
  `,
  styles: [`
    .pos-container {
      color: var(--text-primary);
    }
  `]
})
export class PosComponent {}
