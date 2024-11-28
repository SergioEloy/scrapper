export interface CustomAttributes {
  allergens: string;
  sku: string;
  vegan: boolean;
  kosher: boolean;
  organic: boolean;
  vegetarian: boolean;
  gluten_free: boolean;
  lactose_free: boolean;
  package_quantity: number;
  unit_size: string;
  net_weight: string;
  language: string;
}

export interface Allergen {
  code: string;
  name: string;
}

export interface Allergens {
  value: Allergen[];
  name: string;
  type: string;
}
