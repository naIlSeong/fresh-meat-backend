import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Product, Progress } from './product.entity';
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
  let otherUser: User;
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

    otherUser = new User();
    otherUser.id = 8;

    mockProduct = new Product();
    mockProduct.id = 7;
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
    it('Error : Product not found', async () => {
      productRepo.findOne.mockResolvedValue(null);

      const result = await productService.deleteProduct(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        error: 'Product not found',
      });
    });

    it('Error : Not your product', async () => {
      productRepo.findOne.mockResolvedValue({
        ...mockProduct,
        seller: otherUser,
        sellerId: otherUser.id,
      });

      const result = await productService.deleteProduct(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        error: 'Not your product',
      });
    });

    it("Error : Can't delete product", async () => {
      productRepo.findOne.mockResolvedValue({
        ...mockProduct,
        seller: mockUser,
        sellerId: mockUser.id,
        progress: Progress.Closed,
      });

      const result = await productService.deleteProduct(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        error: "Can't delete product",
      });
    });

    it('Error : Unexpected error', async () => {
      productRepo.findOne.mockRejectedValue(new Error());

      const result = await productService.deleteProduct(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Delete product ID : 9', async () => {
      productRepo.findOne.mockResolvedValue({
        ...mockProduct,
        seller: mockUser,
        sellerId: mockUser.id,
        progress: Progress.Waiting,
      });

      const result = await productService.deleteProduct(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        ok: true,
      });
      expect(productRepo.delete).toBeCalled();
    });
  });

  describe('editProduct', () => {
    const editProductArgs = {
      productId: 7,
      productName: 'newProductName',
      description: 'newDescription',
      startPrice: 77777,
    };

    it('Error : Product not found', async () => {
      productRepo.findOne.mockResolvedValue(null);

      const result = await productService.editProduct(
        editProductArgs,
        mockUser,
      );
      expect(result).toEqual({
        error: 'Product not found',
      });
    });

    it('Error : Not your product', async () => {
      productRepo.findOne.mockResolvedValue({
        ...mockProduct,
        seller: otherUser,
        sellerId: otherUser.id,
      });

      const result = await productService.editProduct(
        editProductArgs,
        mockUser,
      );
      expect(result).toEqual({
        error: 'Not your product',
      });
    });

    it("Error : Can't edit product", async () => {
      productRepo.findOne.mockResolvedValue({
        ...mockProduct,
        seller: mockUser,
        sellerId: mockUser.id,
        progress: Progress.InProgress,
      });

      const result = await productService.editProduct(
        editProductArgs,
        mockUser,
      );
      expect(result).toEqual({
        error: "Can't edit product",
      });
    });

    it('Error : Unexpected error', async () => {
      productRepo.findOne.mockRejectedValue(new Error());

      const result = await productService.editProduct(
        editProductArgs,
        mockUser,
      );
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Edit product', async () => {
      productRepo.findOne.mockResolvedValue({
        ...mockProduct,
        seller: mockUser,
        sellerId: mockUser.id,
        progress: Progress.Waiting,
      });

      const result = await productService.editProduct(
        editProductArgs,
        mockUser,
      );
      expect(result).toEqual({
        ok: true,
      });
    });
  });

  describe('productDetail', () => {
    it('Error : Product not found', async () => {
      productRepo.findOne.mockResolvedValue(null);

      const result = await productService.productDetail({
        productId: mockProduct.id,
      });
      expect(result).toEqual({
        error: 'Product not found',
      });
    });

    it('Error : Unexpected Error', async () => {
      productRepo.findOne.mockRejectedValue(new Error());

      const result = await productService.productDetail({
        productId: mockProduct.id,
      });
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Return product detail ID : 7', async () => {
      productRepo.findOne.mockResolvedValue({ id: mockProduct.id });

      const result = await productService.productDetail({
        productId: mockProduct.id,
      });
      expect(result).toEqual({
        ok: true,
        product: { id: mockProduct.id },
      });
    });
  });
});
