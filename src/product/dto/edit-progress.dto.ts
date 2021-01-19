import { Field, InputType } from '@nestjs/graphql';
import { Progress } from '../product.entity';

@InputType()
export class EditProgressDto {
  @Field((type) => Number)
  productId: number;

  @Field((type) => Progress)
  progress: Progress;
}
