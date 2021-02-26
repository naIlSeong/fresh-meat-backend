import { FileUpload } from 'graphql-upload';
import { CommonOutput } from 'src/common/common.dto';
import { FileService } from './file.service';
export declare class FileResolver {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadImage({ createReadStream, filename, mimetype }: FileUpload, productId: number): Promise<CommonOutput>;
}
