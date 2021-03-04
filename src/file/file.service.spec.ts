import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Product } from 'src/product/product.entity';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { FileService } from './file.service';

const mockRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn(),
});

const mockS3 = () => ({
  upload: jest.fn(),
  promise: jest.fn(),
  deleteObject: jest.fn(),
});

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => mockS3()),
  };
});

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockService<T = any> = Partial<Record<keyof T, jest.Mock>>;

describe('FileService', () => {
  let fileService: FileService;
  let configService: MockService<ConfigService>;
  let fileRepo: MockRepo<File>;
  let productRepo: MockRepo<Product>;
  let mockFile: File;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: ConfigService,
          useValue: mockConfigService(),
        },
        {
          provide: getRepositoryToken(File),
          useValue: mockRepo(),
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepo(),
        },
      ],
    }).compile();

    fileService = moduleRef.get<FileService>(FileService);
    configService = moduleRef.get(ConfigService);
    fileRepo = moduleRef.get(getRepositoryToken(File));
    productRepo = moduleRef.get(getRepositoryToken(Product));

    mockFile = new File();
    mockFile.id = 3;
    mockFile.key = 'MockKey';
  });

  it('Should be defined', () => {
    expect(fileService).toBeDefined();
  });

  describe('deleteImage', () => {
    it('Error : Unexpected error', async () => {
      fileRepo.delete.mockRejectedValue(new Error());

      const result = await fileService.deleteImage({
        fileId: mockFile.id,
        fileKey: mockFile.key,
      });
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Delete object in S3', async () => {
      const result = await fileService.deleteImage({
        fileId: mockFile.id,
        fileKey: mockFile.key,
      });
      expect(result).toEqual({
        ok: true,
      });
      expect(fileRepo.delete).toBeCalledTimes(1);
      expect(fileRepo.delete).toBeCalledWith({ id: mockFile.id });
    });
  });
});
