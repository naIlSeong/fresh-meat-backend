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
exports.Product = exports.Progress = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const common_entity_1 = require("../common/common.entity");
const file_entity_1 = require("../file/file.entity");
const user_entity_1 = require("../user/user.entity");
const typeorm_1 = require("typeorm");
var Progress;
(function (Progress) {
    Progress["Waiting"] = "Waiting";
    Progress["InProgress"] = "InProgress";
    Progress["Closed"] = "Closed";
    Progress["Paid"] = "Paid";
    Progress["Completed"] = "Completed";
})(Progress = exports.Progress || (exports.Progress = {}));
graphql_1.registerEnumType(Progress, { name: 'Progress' });
let Product = class Product extends common_entity_1.CommonEntity {
};
__decorate([
    typeorm_1.Column(),
    graphql_1.Field((type) => String),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Product.prototype, "productName", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    graphql_1.Field((type) => String, { nullable: true }),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    typeorm_1.OneToOne((type) => file_entity_1.File, (file) => file.product, {
        onDelete: 'CASCADE',
        nullable: true,
        eager: true,
    }),
    graphql_1.Field((type) => file_entity_1.File, { nullable: true }),
    __metadata("design:type", file_entity_1.File)
], Product.prototype, "picture", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => user_entity_1.User, (user) => user.sellingProducts),
    graphql_1.Field((type) => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Product.prototype, "seller", void 0);
__decorate([
    typeorm_1.RelationId((product) => product.seller),
    __metadata("design:type", Number)
], Product.prototype, "sellerId", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => user_entity_1.User, (user) => user.biddingProducts, { nullable: true }),
    graphql_1.Field((type) => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Product.prototype, "bidder", void 0);
__decorate([
    typeorm_1.RelationId((product) => product.bidder),
    __metadata("design:type", Number)
], Product.prototype, "bidderId", void 0);
__decorate([
    typeorm_1.Column(),
    graphql_1.Field((type) => Number),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], Product.prototype, "startPrice", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    graphql_1.Field((type) => Number, { nullable: true }),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], Product.prototype, "bidPrice", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    graphql_1.Field((type) => Date, { nullable: true }),
    class_validator_1.IsDateString(),
    __metadata("design:type", Date)
], Product.prototype, "remainingTime", void 0);
__decorate([
    typeorm_1.Column({ type: 'enum', enum: Progress, default: Progress.Waiting }),
    graphql_1.Field((type) => Progress),
    class_validator_1.IsEnum(Progress),
    __metadata("design:type", String)
], Product.prototype, "progress", void 0);
Product = __decorate([
    graphql_1.InputType('ProductInputType', { isAbstract: true }),
    graphql_1.ObjectType('ProductObjectType'),
    typeorm_1.Entity()
], Product);
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map