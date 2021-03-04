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
  });

  it('Should be defined', () => {
    expect(fileService).toBeDefined();
  });
});
