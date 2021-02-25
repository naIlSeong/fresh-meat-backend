import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { File } from 'src/file/file.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';

export enum Progress {
  Waiting = 'Waiting',
  InProgress = 'InProgress',
  Closed = 'Closed',
  Paid = 'Paid',
  Completed = 'Completed',
}

registerEnumType(Progress, { name: 'Progress' });

@InputType('ProductInputType', { isAbstract: true })
@ObjectType('ProductObjectType')
@Entity()
export class Product extends CommonEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  productName: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  description?: string;

  @OneToMany((type) => File, (file) => file.product, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @Field((type) => [File])
  pictures?: File[];

  @ManyToOne((type) => User, (user) => user.sellingProducts)
  @Field((type) => User)
  seller: User;

  @RelationId((product: Product) => product.seller)
  sellerId: number;

  @ManyToOne((type) => User, (user) => user.biddingProducts, { nullable: true })
  @Field((type) => User, { nullable: true })
  bidder?: User;

  @RelationId((product: Product) => product.bidder)
  bidderId: number;

  @Column()
  @Field((type) => Number)
  @IsNumber()
  startPrice: number;

  @Column({ nullable: true })
  @Field((type) => Number, { nullable: true })
  @IsNumber()
  bidPrice?: number;

  @Column({ nullable: true })
  @Field((type) => Date, { nullable: true })
  @IsDateString()
  remainingTime?: Date;

  @Column({ type: 'enum', enum: Progress, default: Progress.Waiting })
  @Field((type) => Progress)
  @IsEnum(Progress)
  progress: Progress;
}
