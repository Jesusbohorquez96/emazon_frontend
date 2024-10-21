export interface Article {
    id: number;
    name: string;
    description: string;
    stock: number;
    price: number;
    categories: number[];  
    brand: number;  
}

export interface ArticleResponse {
    articleId: number;
    articleName: string;
    articleDescription: string;
    articleStock: number;
    articlePrice: number;
    articleCategories: ArticleCategoryResponse[]; 
    categoryNames?: string;
    articleBrand: ArticleBrandResponse;
    brandNames?: string;
  }
  
  export interface ArticleCategoryResponse {
    categoryId: number;
    categoryName: string;
  }
  
  export interface ArticleBrandResponse {
    brandId: number;
    brandName: string;
  }

  export interface Page<T> {
    content: T[];        
    totalPages: number;   
    totalElements: number;
    size: number;          
    number: number;       
  }