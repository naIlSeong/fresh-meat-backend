import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

@InputType({ isAbstract: true })
@ObjectType()
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

  @Column()
  @Field((type) => String)
  @IsString()
  @Length(8)
  password: string;

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
