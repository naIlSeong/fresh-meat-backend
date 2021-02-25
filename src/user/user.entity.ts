import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Product } from 'src/product/product.entity';

@InputType('UserInputType', { isAbstract: true })
@ObjectType('UserObjectType')
@Entity()
export class User extends CommonEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  username: string;

  @Column()
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field((type) => String)
  @IsString()
  @Length(8)
  password: string;

  @OneToMany((type) => Product, (product) => product.seller, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field((type) => [Product], { nullable: true })
  sellingProducts?: Product[];

  @OneToMany((type) => Product, (product) => product.bidder, { nullable: true })
  @Field((type) => [Product], { nullable: true })
  biddingProducts?: Product[];

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      if (this.password) {
        this.password = await bcrypt.hash(this.password, +process.env.ROUNDS);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
