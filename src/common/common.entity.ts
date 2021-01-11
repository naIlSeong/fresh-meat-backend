import { IsDateString, IsNumber } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CommonEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @CreateDateColumn()
  @IsDateString()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDateString()
  updatedAt: Date;
}
