import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiscountService } from '../../services/discount.service';

@Component({
  selector: 'app-admin-discounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="header-actions">
        <h2>Discount Campaigns</h2>
      </div>

      <div class="layout-grid">
        <div class="glass-panel form-panel">
          <h3>Create Campaign</h3>
          <form (ngSubmit)="onSubmit()" #campaignForm="ngForm">
            <div class="form-group">
              <label>Campaign Name</label>
              <input type="text" [(ngModel)]="newCampaign.name" name="name" required>
            </div>
            
            <h4>Criteria Configuration</h4>
            <div class="form-group">
              <label>Target Type</label>
              <select [(ngModel)]="newCampaign.criteriaType" name="criteriaType">
                <option value="category">Category</option>
                <option value="product">Specific Product</option>
              </select>
            </div>
            <div class="form-group">
              <label>Target Value (Category Name or Barcode)</label>
              <input type="text" [(ngModel)]="newCampaign.criteriaValue" name="criteriaValue" required>
            </div>

            <h4>Strategy Configuration</h4>
            <div class="form-group">
              <label>Discount Type</label>
              <select [(ngModel)]="newCampaign.strategyType" name="strategyType">
                <option value="percentage">Percentage (%)</option>
                <option value="amount">Fixed Amount (Cents)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Discount Value</label>
              <input type="number" [(ngModel)]="newCampaign.strategyValue" name="strategyValue" required>
            </div>
            
            <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;" [disabled]="!campaignForm.valid">Create Campaign</button>
          </form>
        </div>

        <div class="glass-panel table-panel">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Criteria</th>
                <th>Strategy</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let camp of campaigns()">
                <td><strong>{{ camp.name }}</strong></td>
                <td>
                  <span class="badge criteria-badge">{{ camp.criteria.type | uppercase }}: {{ camp.criteria.value }}</span>
                </td>
                <td>
                  <span class="badge strategy-badge">{{ camp.strategy.type | uppercase }}: {{ camp.strategy.value }}</span>
                </td>
              </tr>
              <tr *ngIf="campaigns().length === 0">
                <td colspan="3" class="empty-state">No active campaigns.</td>
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
      grid-template-columns: 400px 1fr;
      gap: 2rem;
      align-items: start;
    }
    .header-actions { margin-bottom: 2rem; }
    h2, h3, h4 { color: var(--text-primary); margin-top: 0; }
    h4 { color: var(--text-secondary); margin-bottom: 0.5rem; padding-bottom: 0.25rem; border-bottom: 1px solid var(--border-color); }
    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
    }
    .criteria-badge { background: rgba(236, 72, 153, 0.2); color: var(--accent-color); }
    .strategy-badge { background: rgba(99, 102, 241, 0.2); color: var(--primary-color); }
    .empty-state { text-align: center; color: var(--text-muted); padding: 3rem !important; }
  `]
})
export class AdminDiscountsComponent implements OnInit {
  private discountService = inject(DiscountService);
  
  campaigns = signal<any[]>([]);
  
  newCampaign = {
    name: '',
    criteriaType: 'category',
    criteriaValue: '',
    strategyType: 'percentage',
    strategyValue: null
  };

  ngOnInit() {
    this.loadCampaigns();
  }

  loadCampaigns() {
    this.discountService.getCampaigns().subscribe(data => this.campaigns.set(data));
  }

  onSubmit() {
    const payload = {
      name: this.newCampaign.name,
      criteria: {
        type: this.newCampaign.criteriaType,
        value: this.newCampaign.criteriaValue
      },
      strategy: {
        type: this.newCampaign.strategyType,
        value: this.newCampaign.strategyValue
      }
    };

    this.discountService.createCampaign(payload).subscribe(() => {
      this.loadCampaigns();
      this.newCampaign = {
        name: '',
        criteriaType: 'category',
        criteriaValue: '',
        strategyType: 'percentage',
        strategyValue: null
      };
    });
  }
}
