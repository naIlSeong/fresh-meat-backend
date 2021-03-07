import { CommonOutput } from 'src/common/common.dto';
import { Product } from 'src/product/product.entity';
import { User } from '../user.entity';
export declare class UserDetailDto {
    userId: number;
}
export declare class UserDetailOutput extends CommonOutput {
    user?: User;
    inProgress?: Product[];
    waiting?: Product[];
}
