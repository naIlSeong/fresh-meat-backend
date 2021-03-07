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
exports.EditProductDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const product_entity_1 = require("../product.entity");
let EditProductDto = class EditProductDto extends graphql_1.PartialType(graphql_1.PickType(product_entity_1.Product, ['productName', 'startPrice', 'description'])) {
};
__decorate([
    graphql_1.Field((type) => Number),
    __metadata("design:type", Number)
], EditProductDto.prototype, "productId", void 0);
__decorate([
    graphql_1.Field((type) => Boolean, { nullable: true, defaultValue: false }),
    __metadata("design:type", Boolean)
], EditProductDto.prototype, "deleteImage", void 0);
EditProductDto = __decorate([
    graphql_1.InputType()
], EditProductDto);
exports.EditProductDto = EditProductDto;
//# sourceMappingURL=edit-product.dto.js.map