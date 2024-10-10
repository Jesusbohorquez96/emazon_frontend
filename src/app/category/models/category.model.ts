export interface Category {
    id: number;
    name: string;
    description: string;
  }

export interface CategoryResponse {
  name: any;
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
}