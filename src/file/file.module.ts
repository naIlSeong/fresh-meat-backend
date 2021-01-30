import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileResolver } from './file.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [FileService, FileResolver],
})
export class FileModule {}
