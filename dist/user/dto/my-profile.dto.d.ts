import { CommonOutput } from 'src/common/common.dto';
import { Product } from 'src/product/product.entity';
export declare class MyProfileOutput extends CommonOutput {
    uploadedProduct?: Product[];
    inProgressProduct?: Product[];
    closedProduct?: Product[];
    paidProduct?: Product[];
    completedProduct?: Product[];
}
