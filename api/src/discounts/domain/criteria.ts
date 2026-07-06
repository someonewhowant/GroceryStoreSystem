export interface DiscountItem {
  barcode: string;
  category: string;
  price: number;
}

export interface DiscountCriteria {
  isSatisfiedBy(item: DiscountItem): boolean;
}

export class CategoryCriteria implements DiscountCriteria {
  constructor(private category: string) {}
  isSatisfiedBy(item: DiscountItem): boolean {
    return item.category === this.category;
  }
}

export class ProductCriteria implements DiscountCriteria {
  constructor(private barcode: string) {}
  isSatisfiedBy(item: DiscountItem): boolean {
    return item.barcode === this.barcode;
  }
}

export class CompositeCriteria implements DiscountCriteria {
  constructor(private type: 'AND' | 'OR', private criteria: DiscountCriteria[]) {}
  isSatisfiedBy(item: DiscountItem): boolean {
    if (this.type === 'AND') {
      return this.criteria.every(c => c.isSatisfiedBy(item));
    }
    return this.criteria.some(c => c.isSatisfiedBy(item));
  }
}
