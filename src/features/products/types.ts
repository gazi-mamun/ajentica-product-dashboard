export type Category =
  | 'Electronics'
  | 'Fashion'
  | 'Home'
  | 'Sports'
  | 'Beauty'
  | 'Books';

export const CATEGORIES: readonly Category[] = [
  'Electronics',
  'Fashion',
  'Home',
  'Sports',
  'Beauty',
  'Books',
];

export interface Product {
  id: string;
  title: string;
  price: number;
  category: Category;
  image: string;
}
