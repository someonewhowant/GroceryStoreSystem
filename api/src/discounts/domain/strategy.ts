export interface DiscountStrategy {
  calculateDiscount(price: number): number;
}

export class PercentageStrategy implements DiscountStrategy {
  constructor(private percentage: number) {}
  calculateDiscount(price: number): number {
    return Math.floor(price * (this.percentage / 100));
  }
}

export class AmountStrategy implements DiscountStrategy {
  constructor(private amount: number) {}
  calculateDiscount(price: number): number {
    return Math.min(price, this.amount);
  }
}
