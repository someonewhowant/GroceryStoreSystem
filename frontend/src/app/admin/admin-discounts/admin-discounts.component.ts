import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiscountService } from '../../services/discount.service';

@Component({
  selector: 'app-admin-discounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-discounts.component.html',
  styleUrl: './admin-discounts.component.scss'
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
