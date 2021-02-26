import { User } from '../user.entity';
declare const CreateUserDto_base: import("@nestjs/common").Type<Pick<User, "username" | "email" | "password">>;
export declare class CreateUserDto extends CreateUserDto_base {
}
export {};
