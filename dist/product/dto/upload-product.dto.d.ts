import { CommonOutput } from 'src/common/common.dto';
import { Product } from '../product.entity';
declare const UploadProductDto_base: import("@nestjs/common").Type<Partial<Pick<Product, "description" | "id" | "createdAt" | "updatedAt" | "productName" | "picture" | "seller" | "sellerId" | "bidder" | "bidderId" | "startPrice" | "bidPrice" | "remainingTime" | "progress">>>;
export declare class UploadProductDto extends UploadProductDto_base {
}
export declare class UploadProductOutput extends CommonOutput {
    productId?: number;
}
export {};
