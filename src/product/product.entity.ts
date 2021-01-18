import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDateString, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
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

  @ManyToOne((type) => User, (user) => user.sellingProducts)
  @Field((type) => User)
  seller: User;

  @ManyToOne((type) => User, (user) => user.biddingProducts, { nullable: true })
  @Field((type) => User)
  bidder?: User;

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
}
