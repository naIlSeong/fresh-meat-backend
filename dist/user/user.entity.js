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
exports.User = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const common_entity_1 = require("../common/common.entity");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const product_entity_1 = require("../product/product.entity");
let User = class User extends common_entity_1.CommonEntity {
    async hashPassword() {
        try {
            if (this.password) {
                this.password = await bcrypt.hash(this.password, +process.env.ROUNDS);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};
__decorate([
    typeorm_1.Column(),
    graphql_1.Field((type) => String),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column(),
    graphql_1.Field((type) => String),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ select: false }),
    graphql_1.Field((type) => String),
    class_validator_1.IsString(),
    class_validator_1.Length(8),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.OneToMany((type) => product_entity_1.Product, (product) => product.seller, {
        nullable: true,
        onDelete: 'CASCADE',
    }),
    graphql_1.Field((type) => [product_entity_1.Product], { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "sellingProducts", void 0);
__decorate([
    typeorm_1.OneToMany((type) => product_entity_1.Product, (product) => product.bidder, { nullable: true }),
    graphql_1.Field((type) => [product_entity_1.Product], { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "biddingProducts", void 0);
__decorate([
    typeorm_1.BeforeUpdate(),
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
User = __decorate([
    graphql_1.InputType('UserInputType', { isAbstract: true }),
    graphql_1.ObjectType('UserObjectType'),
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map