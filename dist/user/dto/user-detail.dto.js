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
exports.UserDetailOutput = exports.UserDetailDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_dto_1 = require("../../common/common.dto");
const product_entity_1 = require("../../product/product.entity");
const user_entity_1 = require("../user.entity");
let UserDetailDto = class UserDetailDto {
};
__decorate([
    graphql_1.Field((type) => Number),
    __metadata("design:type", Number)
], UserDetailDto.prototype, "userId", void 0);
UserDetailDto = __decorate([
    graphql_1.InputType()
], UserDetailDto);
exports.UserDetailDto = UserDetailDto;
let UserDetailOutput = class UserDetailOutput extends common_dto_1.CommonOutput {
};
__decorate([
    graphql_1.Field((type) => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], UserDetailOutput.prototype, "user", void 0);
__decorate([
    graphql_1.Field((type) => [product_entity_1.Product], { nullable: true }),
    __metadata("design:type", Array)
], UserDetailOutput.prototype, "inProgress", void 0);
__decorate([
    graphql_1.Field((type) => [product_entity_1.Product], { nullable: true }),
    __metadata("design:type", Array)
], UserDetailOutput.prototype, "waiting", void 0);
UserDetailOutput = __decorate([
    graphql_1.ObjectType()
], UserDetailOutput);
exports.UserDetailOutput = UserDetailOutput;
//# sourceMappingURL=user-detail.dto.js.map