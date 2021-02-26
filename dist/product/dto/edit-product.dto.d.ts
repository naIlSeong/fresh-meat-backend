import { Product } from '../product.entity';
declare const EditProductDto_base: import("@nestjs/common").Type<Partial<Pick<Product, "description" | "id" | "createdAt" | "updatedAt" | "productName" | "picture" | "seller" | "sellerId" | "bidder" | "bidderId" | "startPrice" | "bidPrice" | "remainingTime" | "progress">>>;
export declare class EditProductDto extends EditProductDto_base {
    productId: number;
    deleteImage?: boolean;
}
export {};
