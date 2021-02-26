"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const auth_decorator_1 = require("../auth/auth.decorator");
const common_constant_1 = require("../common/common.constant");
const common_dto_1 = require("../common/common.dto");
const user_entity_1 = require("../user/user.entity");
const create_bidding_dto_1 = require("./dto/create-bidding.dto");
const delete_product_dto_1 = require("./dto/delete-product.dto");
const edit_product_dto_1 = require("./dto/edit-product.dto");
const edit_progress_dto_1 = require("./dto/edit-progress.dto");
const get_all_products_dto_1 = require("./dto/get-all-products.dto");
const product_detail_dto_1 = require("./dto/product-detail.dto");
const update_bidding_dto_1 = require("./dto/update-bidding.dto");
const upload_product_dto_1 = require("./dto/upload-product.dto");
const product_entity_1 = require("./product.entity");
const product_service_1 = require("./product.service");
let ProductResolver = class ProductResolver {
    constructor(productService) {
        this.productService = productService;
    }
    uploadProduct(uploadProductDto, user) {
        return this.productService.uploadProduct(uploadProductDto, user);
    }
    deleteProduct(deleteProductDto, user) {
        return this.productService.deleteProduct(deleteProductDto, user);
    }
    editProduct(editProductDto, user) {
        return this.productService.editProduct(editProductDto, user);
    }
    productDetail(productDetailDto) {
        return this.productService.productDetail(productDetailDto);
    }
    editProgress(editProgressDto, user) {
        return this.productService.editProgress(editProgressDto, user);
    }
    createBidding(createBiddingDto, user) {
        return this.productService.createBidding(createBiddingDto, user);
    }
    updateBidding(updateBiddingDto, user) {
        return this.productService.updateBidding(updateBiddingDto, user);
    }
    getWaitingProducts(getAllProductsDto) {
        return this.productService.getWaitingProducts(getAllProductsDto);
    }
    getInProgressProducts(getAllProductsDto) {
        return this.productService.getInProgressProducts(getAllProductsDto);
    }
};
__decorate([
    graphql_1.Mutation((returns) => upload_product_dto_1.UploadProductOutput),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_product_dto_1.UploadProductDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "uploadProduct", null);
__decorate([
    graphql_1.Mutation((returns) => common_dto_1.CommonOutput),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_product_dto_1.DeleteProductDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "deleteProduct", null);
__decorate([
    graphql_1.Mutation((returns) => common_dto_1.CommonOutput),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [edit_product_dto_1.EditProductDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "editProduct", null);
__decorate([
    common_constant_1.Public(),
    graphql_1.Query((returns) => product_detail_dto_1.ProductDetailOutput),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_detail_dto_1.ProductDetailDto]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "productDetail", null);
__decorate([
    graphql_1.Mutation((returns) => common_dto_1.CommonOutput),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [edit_progress_dto_1.EditProgressDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "editProgress", null);
__decorate([
    graphql_1.Mutation((returns) => common_dto_1.CommonOutput),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bidding_dto_1.CreateBiddingDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "createBidding", null);
__decorate([
    graphql_1.Mutation((returns) => common_dto_1.CommonOutput),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_bidding_dto_1.UpdateBiddingDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "updateBidding", null);
__decorate([
    common_constant_1.Public(),
    graphql_1.Query((returns) => get_all_products_dto_1.GetAllProductsOutput),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_products_dto_1.GetAllProductsDto]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getWaitingProducts", null);
__decorate([
    common_constant_1.Public(),
    graphql_1.Query((returns) => get_all_products_dto_1.GetAllProductsOutput),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_products_dto_1.GetAllProductsDto]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getInProgressProducts", null);
ProductResolver = __decorate([
    graphql_1.Resolver((of) => product_entity_1.Product),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductResolver);
exports.ProductResolver = ProductResolver;
//# sourceMappingURL=product.resolver.js.map