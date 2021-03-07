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
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const aws_sdk_1 = require("aws-sdk");
const common_dto_1 = require("../common/common.dto");
const product_entity_1 = require("../product/product.entity");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const file_entity_1 = require("./file.entity");
let FileService = class FileService {
    constructor(configService, productRepo, fileRepo) {
        this.configService = configService;
        this.productRepo = productRepo;
        this.fileRepo = fileRepo;
    }
    async uploadImage(stream, filename, mimetype, productId) {
        try {
            const product = await this.productRepo.findOne({ id: productId });
            const s3 = new aws_sdk_1.S3();
            const { Location, Key } = await s3
                .upload({
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Body: stream,
                Key: `${uuid_1.v4()}-${filename}`,
                ContentType: mimetype,
            })
                .promise();
            const picture = this.fileRepo.create({
                product,
                url: Location,
                key: Key,
                fileName: filename,
            });
            await this.fileRepo.save(picture);
            await this.productRepo.save(Object.assign(Object.assign({}, product), { picture }));
            return {
                ok: true,
            };
        }
        catch (error) {
            return {
                error: 'Unexpected error',
            };
        }
    }
    async deleteImage({ fileId, fileKey, }) {
        try {
            const s3 = new aws_sdk_1.S3();
            s3.deleteObject({
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Key: fileKey,
            }, (err, data) => {
                if (err) {
                    throw err;
                }
                console.log('S3 deleteObject Error: ', data);
            });
            await this.fileRepo.delete({ id: fileId });
            return {
                ok: true,
            };
        }
        catch (error) {
            return {
                error: 'Unexpected error',
            };
        }
    }
};
FileService = __decorate([
    common_1.Injectable(),
    __param(1, typeorm_1.InjectRepository(product_entity_1.Product)),
    __param(2, typeorm_1.InjectRepository(file_entity_1.File)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FileService);
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map