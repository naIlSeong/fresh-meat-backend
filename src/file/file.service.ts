import { Injectable } from '@nestjs/common';
import { CommonOutput } from 'src/common/common.dto';

@Injectable()
export class FileService {
  async uploadImage(
    stream,
    filename: string,
    mimetype: string,
  ): Promise<CommonOutput> {
    try {
      return {
        ok: true,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }
}
