export interface Cart {
    articleId: number;
    quantity: number;
}

// export interface CartResponse {
//     id: number;
//     userId: number;
//     articleId: number;
//     quantity: number;
//     creationDate: string;
//     updateDate: string;
//     articleCategories: string[];
//     categoryNames: string[];
//     brandName: string;
// }
export interface CartResponse {
    id: number
    userId: number
    articleId: number
    quantity: number
    creationDate: string
    updateDate: string
    articleName: string
    articleDescription: string
    categoryNames: string
    brandName: string
    articleStock: number
    articlePrice: number
    articleCategories: ArticleCategory[]
    articleBrand: ArticleBrand
    total: number
  }
  
  export interface ArticleCategory {
    categoryId: number
    categoryName: string
  }
  
  export interface ArticleBrand {
    brandId: number
    brandName: string
  }
  
export interface ArticleCategory {
    id: number;
    categoryName: string;
}