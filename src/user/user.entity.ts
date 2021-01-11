import { Field } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity } from 'typeorm';

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
}
