import { CommonEntity } from 'src/common/common.entity';
import { Product } from 'src/product/product.entity';
export declare class File extends CommonEntity {
    product: Product;
    url: string;
    key: string;
    fileName: string;
}
