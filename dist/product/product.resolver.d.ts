import { CommonOutput } from 'src/common/common.dto';
import { User } from 'src/user/user.entity';
import { CreateBiddingDto } from './dto/create-bidding.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { EditProductDto } from './dto/edit-product.dto';
import { EditProgressDto } from './dto/edit-progress.dto';
import { GetAllProductsDto, GetAllProductsOutput } from './dto/get-all-products.dto';
import { ProductDetailDto, ProductDetailOutput } from './dto/product-detail.dto';
import { UpdateBiddingDto } from './dto/update-bidding.dto';
import { UploadProductDto, UploadProductOutput } from './dto/upload-product.dto';
import { ProductService } from './product.service';
export declare class ProductResolver {
    private readonly productService;
    constructor(productService: ProductService);
    uploadProduct(uploadProductDto: UploadProductDto, user: User): Promise<UploadProductOutput>;
    deleteProduct(deleteProductDto: DeleteProductDto, user: User): Promise<CommonOutput>;
    editProduct(editProductDto: EditProductDto, user: User): Promise<CommonOutput>;
    productDetail(productDetailDto: ProductDetailDto): Promise<ProductDetailOutput>;
    editProgress(editProgressDto: EditProgressDto, user: User): Promise<CommonOutput>;
    createBidding(createBiddingDto: CreateBiddingDto, user: User): Promise<CommonOutput>;
    updateBidding(updateBiddingDto: UpdateBiddingDto, user: User): Promise<CommonOutput>;
    getWaitingProducts(getAllProductsDto: GetAllProductsDto): Promise<GetAllProductsOutput>;
    getInProgressProducts(getAllProductsDto: GetAllProductsDto): Promise<GetAllProductsOutput>;
}
