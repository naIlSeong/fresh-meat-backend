import { User } from '../user.entity';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<Pick<User, "id" | "createdAt" | "updatedAt" | "username" | "email" | "password" | "sellingProducts" | "biddingProducts" | "hashPassword">>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export {};
