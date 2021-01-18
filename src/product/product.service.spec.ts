import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
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
    it('Error : Product name is required', async () => {
      const result = await productService.uploadProduct(
        { startPrice: mockProduct.startPrice },
        mockUser,
      );
      expect(result).toEqual({
        error: 'Product name is required',
      });
    });

    it('Error : Start price is required', async () => {
      const result = await productService.uploadProduct(
        { productName: mockProduct.productName },
        mockUser,
      );
      expect(result).toEqual({
        error: 'Start price is required',
      });
    });

    it('Error : Unexpected error', async () => {
      productRepo.save.mockRejectedValue(new Error());

      const result = await productService.uploadProduct(
        {
          productName: mockProduct.productName,
          startPrice: mockProduct.startPrice,
        },
        mockUser,
      );
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Upload new product', async () => {
      const result = await productService.uploadProduct(
        {
          productName: mockProduct.productName,
          startPrice: mockProduct.startPrice,
        },
        mockUser,
      );
      expect(result).toEqual({
        ok: true,
      });
      expect(productRepo.create).toBeCalled();
      expect(productRepo.save).toBeCalled();
    });
  });

  describe('deleteProduct', () => {
    let USER: User;
    USER = new User();
    USER.id = 8;

    let PRODUCT: Product;
    PRODUCT = new Product();
    PRODUCT.id = 9;
    PRODUCT.seller = mockUser;

    it.todo('Error : Product not found', async () => {
      productRepo.findOne.mockResolvedValue(null);

      const result = await productService({ productId: PRODUCT.id }, mockUser);
      expect(result).toEqual({
        error: 'Product not found',
      });
    });

    it.todo('Error : Not your product', async () => {
      productRepo.findOne.mockResolvedValue(PRODUCT);

      const result = await productService({ productId: PRODUCT.id }, USER);
      expect(result).toEqual({
        error: 'Not your product',
      });
    });

    it.todo('Error : Unexpected error', async () => {
      productRepo.findOne.mockRejectedValue(new Error());

      const result = await productService({ productId: PRODUCT.id }, mockUser);
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it.todo('Delete product ID : 9', async () => {
      productRepo.findOne.mockResolvedValue(PRODUCT);

      const result = await productService({ productId: PRODUCT.id }, mockUser);
      expect(result).toEqual({
        ok: true,
      });
      expect(productRepo.delete).toBeCalled();
    });
  });
});
