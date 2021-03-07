import { CommonEntity } from 'src/common/common.entity';
import { Product } from 'src/product/product.entity';
export declare class User extends CommonEntity {
    username: string;
    email: string;
    password: string;
    sellingProducts?: Product[];
    biddingProducts?: Product[];
    hashPassword(): Promise<void>;
}
