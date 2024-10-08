export interface Category {
get(arg0: string): unknown;
    id: number;
    name: string;
    description: string;
  }

export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
}