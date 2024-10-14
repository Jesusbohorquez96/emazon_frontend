export interface Article {
    name: string;
    description: string;
    stock: number;
    price: number;
    categories: number[];  
    brand: number;  
}

export interface ArticleResponse {
    articleId: number;  
    name: string;
    description: string;
    stock: number;
    price: number;
    categories: number[];  
    brandId: number; 
}