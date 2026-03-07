export type Size = 'small' | 'medium' | 'large'
export type ToppingID = string

export interface Topping {
  id: ToppingID;
  name: string;
  category: string;
  prices: Record<Size, number>;
  mesh: 'sphere' | 'disc' | 'sliver' | 'chunk';
  color: string;
}

export interface Pizza {
  id: string;
  name: string;
  description: string;
  toppings: ToppingID[];
  prices: Record<Size, number>;
}

export interface Extra {
  id: string;
  name: string;
  category: 'starter' | 'dessert';
  price: number;
}
