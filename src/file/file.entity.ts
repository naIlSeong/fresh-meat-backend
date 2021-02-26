import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Product } from 'src/product/product.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@InputType('FileInputType', { isAbstract: true })
@ObjectType('FileObjectType')
@Entity()
export class File extends CommonEntity {
  @OneToOne((type) => Product, (product) => product.picture)
  @Field((type) => Product)
  product: Product;

  @Column()
  @Field((type) => String)
  @IsString()
  url: string;

  @Column()
  @Field((type) => String)
  @IsString()
  key: string;

  @Column()
  @Field((type) => String)
  @IsString()
  fileName: string;
}
