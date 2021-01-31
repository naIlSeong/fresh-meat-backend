import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload';
import { CommonOutput } from 'src/common/common.dto';
import { FileService } from './file.service';
import { GraphQLUpload } from 'apollo-server-express';
import { CurrentUser } from 'src/auth/auth.decorator';
import { User } from 'src/user/user.entity';

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation((returns) => CommonOutput)
  async uploadImage(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename, mimetype }: FileUpload,
    @Args('productId') productId: number,
    @CurrentUser() user: User,
  ): Promise<CommonOutput> {
    const stream = createReadStream();
    return this.fileService.uploadImage(
      stream,
      filename,
      mimetype,
      productId,
      user,
    );
  }
}
