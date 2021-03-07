import { CommonOutput } from 'src/common/common.dto';
import { User } from '../user.entity';
declare const LoginDto_base: import("@nestjs/common").Type<Pick<User, "email" | "password">>;
export declare class LoginDto extends LoginDto_base {
}
export declare class LoginOutput extends CommonOutput {
}
export {};
