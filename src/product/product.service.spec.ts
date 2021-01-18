import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';

const mockRepo = () => ({
  findOne: jest.fn(),
});

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ProductService', () => {
  let productService: ProductService;
  let productRepo: MockRepo<Product>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepo(),
        },
      ],
    }).compile();

    productService = moduleRef.get<ProductService>(ProductService);
    productRepo = moduleRef.get(getRepositoryToken(Product));
  });

  it('works?', () => {
    expect(productService).toBeDefined();
  });
});
