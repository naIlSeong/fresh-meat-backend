import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';

const mockRepo = () => ({
  create: jest.fn(),
});

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ProductService', () => {
  let productService: ProductService;
  let productRepo: MockRepo<Product>;
  let mockUser: User;
  let mockProduct: Product;

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

    mockUser = new User();
    mockUser.id = 3;

    mockProduct = new Product();
    mockProduct.id = 7;
    mockProduct.seller = mockUser;
    mockProduct.productName = 'mockProductName';
    mockProduct.startPrice = 1000;
  });

  describe('uploadProduct', () => {
    it('Error : Unexpected error', async () => {
      productRepo.create.mockRejectedValue(new Error());

      const result = await productService.uploadProduct({
        productName: mockProduct.productName,
        startPrice: mockProduct.startPrice,
      });
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Upload new product', async () => {
      const result = await productService.uploadProduct({
        productName: mockProduct.productName,
        startPrice: mockProduct.startPrice,
      });
      expect(result).toEqual({
        ok: true,
      });
      expect(productRepo.create).toBeCalled();
      expect(productRepo.save).toBeCalled();
    });
  });
});
