import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteUserDto {
  @Field((type) => String)
  password: string;
}
