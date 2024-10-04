export interface Category {
    id: number;
    name: string;
    description: string;
  }

export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
}