import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteImageDto {
  @Field((type) => Number)
  fileId: number;

  @Field((type) => String)
  fileKey: string;
}
