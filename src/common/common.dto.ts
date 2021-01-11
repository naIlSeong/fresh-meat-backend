import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommonOutput {
  @Field((type) => Boolean, { nullable: true, defaultValue: false })
  ok?: boolean;

  @Field((type) => String, { nullable: true })
  error?: string;
}
