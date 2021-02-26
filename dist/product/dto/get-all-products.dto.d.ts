import { CommonOutput } from 'src/common/common.dto';
import { Product } from '../product.entity';
export declare class GetAllProductsDto {
    page?: number;
}
export declare class GetAllProductsOutput extends CommonOutput {
    products?: Product[];
    maxPage?: number;
}
