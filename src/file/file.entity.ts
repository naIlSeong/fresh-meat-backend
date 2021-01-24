import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, IsUrl, IsUUID } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Product } from 'src/product/product.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class File extends CommonEntity {
  @ManyToOne((type) => Product, (product) => product.files)
  @Field((type) => Product)
  product: Product;

  @Column()
  @Field((type) => String)
  @IsUrl()
  url: string;

  @Column()
  @Field((type) => String)
  @IsUUID()
  uuid: string;
}
