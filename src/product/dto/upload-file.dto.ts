import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UploadFileDto {
  @Field((type) => Number)
  productId: number;

  @Field((type) => Buffer)
  imageBuffer: Buffer;
}
