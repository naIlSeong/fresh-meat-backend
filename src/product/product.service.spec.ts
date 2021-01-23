import { SchedulerRegistry } from '@nestjs/schedule';
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

const mockSchedulerRegistry = () => ({
  addTimeout: jest.fn(),
  getTimeouts: jest.fn(),
  deleteTimeout: jest.fn(),
});

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

type MockScheduler<T = any> = Record<keyof T, jest.Mock>;

describe('ProductService', () => {
  let productService: ProductService;
  let productRepo: MockRepo<Product>;
  let mockUser: User;
  let otherUser: User;
  let mockProduct: Product;

  let schedulerRegistry: MockScheduler<SchedulerRegistry>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepo(),
        },
        {
          provide: SchedulerRegistry,
          useValue: mockSchedulerRegistry(),
        },
      ],
    }).compile();

    productService = moduleRef.get<ProductService>(ProductService);
    productRepo = moduleRef.get(getRepositoryToken(Product));
    schedulerRegistry = moduleRef.get(SchedulerRegistry);

    mockUser = new User();
    mockUser.id = 3;

    otherUser = new User();
    otherUser.id = 8;

    mockProduct = new Product();
    mockProduct.id = 7;
    mockProduct.productName = 'mockProductName';
    mockProduct.startPrice = 1000;

    jest.useFakeTimers();
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

  describe('editProgress', () => {
    it('Error : Product not found', async () => {
      productRepo.findOne.mockResolvedValue(null);

      const result = await productService.editProgress(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        error: 'Product not found',
      });
    });

    it("Error : Can't edit progress (Paid)", async () => {
      productRepo.findOne.mockResolvedValue({
        ...mockProduct,
        seller: mockUser,
        sellerId: mockUser.id,
        bidderId: otherUser,
        progress: Progress.Closed,
      });

      const result = await productService.editProgress(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        error: "Can't edit progress",
      });
    });

    it("Error : Can't edit progress (Completed)", async () => {
      productRepo.findOne.mockResolvedValue({
        ...mockProduct,
        seller: mockUser,
        sellerId: mockUser.id,
        bidderId: otherUser,
        progress: Progress.Paid,
      });

      const result = await productService.editProgress(
        { productId: mockProduct.id },
        otherUser,
      );
      expect(result).toEqual({
        error: "Can't edit progress",
      });
    });

    it('Error : Unexpected error', async () => {
      productRepo.findOne.mockRejectedValue(new Error());

      const result = await productService.editProgress(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Edit progress : Closed -> Paid', async () => {
      productRepo.findOne.mockResolvedValue({
        ...mockProduct,
        seller: mockUser,
        sellerId: mockUser.id,
        bidderId: otherUser.id,
        progress: Progress.Closed,
      });

      const result = await productService.editProgress(
        { productId: mockProduct.id },
        otherUser,
      );
      expect(result).toEqual({
        ok: true,
      });
    });

    it('Edit progress : Paid -> Completed', async () => {
      productRepo.findOne.mockResolvedValue({
        ...mockProduct,
        seller: mockUser,
        sellerId: mockUser.id,
        bidderId: otherUser.id,
        progress: Progress.Paid,
      });

      const result = await productService.editProgress(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        ok: true,
      });
    });
  });

  describe('createBidding', () => {
    it('Error : Product not found', async () => {
      productRepo.findOne.mockResolvedValue(null);

      const result = await productService.createBidding(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        error: 'Product not found',
      });
    });

    it("Error : Can't bid on your product", async () => {
      productRepo.findOne.mockResolvedValue({
        id: mockProduct.id,
        sellerId: mockUser.id,
      });

      const result = await productService.createBidding(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        error: "Can't bid on your product",
      });
    });

    it("Error : Can't create bidding", async () => {
      productRepo.findOne.mockResolvedValue({
        id: mockProduct.id,
        sellerId: otherUser.id,
        progress: Progress.Closed,
      });

      const result = await productService.createBidding(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        error: 'The auction has already closed',
      });
    });

    it('Error : Already bid on product', async () => {
      productRepo.findOne.mockResolvedValue({
        id: mockProduct.id,
        startPrice: 777,
        sellerId: otherUser.id,
        bidPrice: 12345,
        bidderId: mockUser.id,
        progress: Progress.InProgress,
      });

      const result = await productService.createBidding(
        { productId: mockProduct.id, bidPrice: 23456 },
        mockUser,
      );
      expect(result).toEqual({
        error: 'Already bid on product',
      });
    });

    it('Error : Bid price must be more than 12345', async () => {
      productRepo.findOne.mockResolvedValue({
        id: mockProduct.id,
        startPrice: 777,
        sellerId: otherUser.id,
        bidPrice: 12345,
        bidderId: 11,
        progress: Progress.InProgress,
      });

      const result = await productService.createBidding(
        { productId: mockProduct.id, bidPrice: 1234 },
        mockUser,
      );
      expect(result).toEqual({
        error: 'Bid price must be more than 12345',
      });
    });

    it('Error : Unexpected error', async () => {
      productRepo.findOne.mockRejectedValue(new Error());

      const result = await productService.createBidding(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Create bidding & remain time', async () => {
      productRepo.findOne.mockResolvedValue({
        id: mockProduct.id,
        startPrice: 777,
        sellerId: otherUser.id,
        progress: Progress.Waiting,
      });

      schedulerRegistry.getTimeouts.mockReturnValue(['createdTimer']);

      const result = await productService.createBidding(
        { productId: mockProduct.id },
        mockUser,
      );
      expect(result).toEqual({
        ok: true,
      });
    });

    it('Update bidding & remain time', async () => {
      productRepo.findOne.mockResolvedValue({
        id: mockProduct.id,
        startPrice: 777,
        sellerId: otherUser.id,
        bidPrice: 12345,
        bidderId: 11,
        progress: Progress.InProgress,
      });

      schedulerRegistry.getTimeouts.mockReturnValue(['createdTimer']);

      const result = await productService.createBidding(
        { productId: mockProduct.id, bidPrice: 23456 },
        mockUser,
      );
      expect(result).toEqual({
        ok: true,
      });
    });
  });
});
