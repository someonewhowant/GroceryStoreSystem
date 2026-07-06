import { DiscountCriteria, CategoryCriteria, ProductCriteria, CompositeCriteria } from './criteria';
import { DiscountStrategy, PercentageStrategy, AmountStrategy } from './strategy';

export class DiscountFactory {
  static createCriteria(config: any): DiscountCriteria {
    switch (config.type) {
      case 'category':
        return new CategoryCriteria(config.value);
      case 'product':
        return new ProductCriteria(config.value);
      case 'composite':
        return new CompositeCriteria(
          config.operator,
          config.criteria.map((c: any) => this.createCriteria(c))
        );
      default:
        throw new Error(`Unknown criteria type: ${config.type}`);
    }
  }

  static createStrategy(config: any): DiscountStrategy {
    switch (config.type) {
      case 'percentage':
        return new PercentageStrategy(config.value);
      case 'amount':
        return new AmountStrategy(config.value);
      default:
        throw new Error(`Unknown strategy type: ${config.type}`);
    }
  }
}
