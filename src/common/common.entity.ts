import { Field, ObjectType } from '@nestjs/graphql';
import { IsDateString, IsNumber } from 'class-validator';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CommonEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  @IsNumber()
  id: number;

  @CreateDateColumn()
  @Field((type) => Date)
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn()
  @Field((type) => Date)
  @IsDateString()
  updatedAt: Date;
}
