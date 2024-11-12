export interface Cart {
    articleId: number;
    quantity: number;
}

export interface CartResponse {
    articleId: number;
    quantity: number;
    creationDate: Date
    updateDate: Date;
}

export interface ArticleCategory {
    id: number;
    categoryName: string;
}