import { CommonOutput } from 'src/common/common.dto';
import { Product } from '../product.entity';
export declare class ProductDetailDto {
    productId: number;
}
export declare class ProductDetailOutput extends CommonOutput {
    product?: Product;
}
