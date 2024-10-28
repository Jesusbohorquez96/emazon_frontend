export interface SupplyRequest {
    name: string;
    quantity: number;
    status: string;
    articleId: number;
}

export interface SupplyResponse  {
    supplyId: number;
    supplyName: string;
    supplyQuantity: number;
    supplyDate: Date;
    supplyStatus: string;
    stock: number;
}
