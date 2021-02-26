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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadProductOutput = exports.UploadProductDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_dto_1 = require("../../common/common.dto");
const product_entity_1 = require("../product.entity");
let UploadProductDto = class UploadProductDto extends graphql_1.PartialType(graphql_1.PickType(product_entity_1.Product, ['productName', 'description', 'startPrice'])) {
};
UploadProductDto = __decorate([
    graphql_1.InputType()
], UploadProductDto);
exports.UploadProductDto = UploadProductDto;
let UploadProductOutput = class UploadProductOutput extends common_dto_1.CommonOutput {
};
__decorate([
    graphql_1.Field((type) => Number, { nullable: true }),
    __metadata("design:type", Number)
], UploadProductOutput.prototype, "productId", void 0);
UploadProductOutput = __decorate([
    graphql_1.ObjectType()
], UploadProductOutput);
exports.UploadProductOutput = UploadProductOutput;
//# sourceMappingURL=upload-product.dto.js.map