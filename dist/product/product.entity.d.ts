import { CommonEntity } from 'src/common/common.entity';
import { File } from 'src/file/file.entity';
import { User } from 'src/user/user.entity';
export declare enum Progress {
    Waiting = "Waiting",
    InProgress = "InProgress",
    Closed = "Closed",
    Paid = "Paid",
    Completed = "Completed"
}
export declare class Product extends CommonEntity {
    productName: string;
    description?: string;
    picture?: File;
    seller: User;
    sellerId: number;
    bidder?: User;
    bidderId: number;
    startPrice: number;
    bidPrice?: number;
    remainingTime?: Date;
    progress: Progress;
}
