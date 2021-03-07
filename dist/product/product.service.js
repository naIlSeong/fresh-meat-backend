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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const common_dto_1 = require("../common/common.dto");
const file_service_1 = require("../file/file.service");
const user_entity_1 = require("../user/user.entity");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductService = class ProductService {
    constructor(productRepo, schedulerRegistry, fileService) {
        this.productRepo = productRepo;
        this.schedulerRegistry = schedulerRegistry;
        this.fileService = fileService;
    }
    async uploadProduct(uploadProductDto, user) {
        try {
            if (!uploadProductDto.productName) {
                return {
                    error: 'Product name is required',
                };
            }
            if (!uploadProductDto.startPrice) {
                return {
                    error: 'Start price is required',
                };
            }
            const product = this.productRepo.create(Object.assign(Object.assign({}, uploadProductDto), { seller: user }));
            await this.productRepo.save(product);
            return {
                ok: true,
                productId: product.id,
            };
        }
        catch (error) {
            return {
                error: 'Unexpected error',
            };
        }
    }
    async deleteProduct({ productId }, user) {
        try {
            const product = await this.productRepo.findOne({ id: productId });
            if (!product) {
                return {
                    error: 'Product not found',
                };
            }
            if (product.sellerId !== user.id) {
                return {
                    error: 'Not your product',
                };
            }
            if (product.progress !== product_entity_1.Progress.Waiting &&
                product.progress !== product_entity_1.Progress.Completed) {
                return {
                    error: "Can't delete product",
                };
            }
            if (product.picture) {
                const { error } = await this.fileService.deleteImage({
                    fileId: product.picture.id,
                    fileKey: product.picture.key,
                });
                if (error) {
                    return {
                        error,
                    };
                }
            }
            await this.productRepo.delete({ id: productId });
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
    async editProduct({ productId, productName, description, startPrice, deleteImage, }, user) {
        try {
            const product = await this.productRepo.findOne({
                where: { id: productId },
                relations: ['seller', 'bidder'],
            });
            if (!product) {
                return {
                    error: 'Product not found',
                };
            }
            if (product.sellerId !== user.id) {
                return {
                    error: 'Not your product',
                };
            }
            if (product.progress !== product_entity_1.Progress.Waiting) {
                return {
                    error: "Can't edit product",
                };
            }
            if (deleteImage) {
                if (product.picture) {
                    const { error } = await this.fileService.deleteImage({
                        fileId: product.picture.id,
                        fileKey: product.picture.key,
                    });
                    if (error) {
                        return {
                            error: 'Unexpected error',
                        };
                    }
                }
            }
            product.productName =
                productName === '' ? product.productName : productName;
            product.startPrice = !startPrice ? product.startPrice : startPrice;
            product.description = description === '' ? null : description;
            await this.productRepo.save(product);
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
    async productDetail({ productId, }) {
        try {
            const product = await this.productRepo.findOne({
                where: { id: productId },
                relations: ['seller', 'bidder'],
            });
            if (!product) {
                return {
                    error: 'Product not found',
                };
            }
            return {
                ok: true,
                product,
            };
        }
        catch (error) {
            return {
                error: 'Unexpected error',
            };
        }
    }
    async editProgress({ productId }, user) {
        try {
            const product = await this.productRepo.findOne({ id: productId });
            if (!product) {
                return {
                    error: 'Product not found',
                };
            }
            if (product.progress === product_entity_1.Progress.Closed) {
                if (product.bidderId !== user.id) {
                    return {
                        error: "Can't edit progress",
                    };
                }
            }
            if (product.progress === product_entity_1.Progress.Paid) {
                if (product.sellerId !== user.id) {
                    return {
                        error: "Can't edit progress",
                    };
                }
            }
            product.progress =
                product.progress === product_entity_1.Progress.Closed
                    ? product_entity_1.Progress.Paid
                    : product_entity_1.Progress.Completed;
            await this.productRepo.save(product);
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
    async createBidding({ productId, startPrice }, user) {
        try {
            const product = await this.productRepo.findOne({ id: productId });
            if (!product) {
                return {
                    error: 'Product not found',
                };
            }
            if (product.sellerId === user.id) {
                return {
                    error: "Can't bid on your product",
                };
            }
            if (product.progress !== product_entity_1.Progress.Waiting) {
                return {
                    error: 'The auction has already started',
                };
            }
            if (product.startPrice !== startPrice) {
                return {
                    error: 'Check the starting price again',
                };
            }
            product.bidder = user;
            product.bidPrice = product.startPrice;
            product.remainingTime = new Date(new Date().valueOf() + 600000);
            product.progress = product_entity_1.Progress.InProgress;
            await this.productRepo.save(product);
            this.createTimer(product);
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
    async updateBidding({ productId, bidPrice }, user) {
        try {
            const product = await this.productRepo.findOne({ id: productId });
            if (!product) {
                return {
                    error: 'Product not found',
                };
            }
            if (product.sellerId === user.id) {
                return {
                    error: "Can't bid on your product",
                };
            }
            if (product.progress !== product_entity_1.Progress.InProgress) {
                return {
                    error: 'The auction has already closed',
                };
            }
            if (product.bidderId === user.id) {
                return {
                    error: 'Already bid on product',
                };
            }
            if (product.bidPrice >= bidPrice) {
                return {
                    error: `Bid price must be more than ${product.bidPrice}`,
                };
            }
            product.bidder = user;
            product.bidPrice = bidPrice;
            product.remainingTime = new Date(new Date().valueOf() + 600000);
            await this.productRepo.save(product);
            this.createTimer(product);
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
    createTimer(product) {
        const timers = this.schedulerRegistry.getTimeouts();
        if (timers.length !== 0) {
            timers.forEach((key) => {
                if (key === `createdTimerId:${product.id}`) {
                    this.schedulerRegistry.deleteTimeout(`${key}`);
                }
            });
        }
        this.schedulerRegistry.addTimeout(`createdTimerId:${product.id}`, setTimeout(async () => {
            product.progress = product_entity_1.Progress.Closed;
            await this.productRepo.save(product);
        }, 600000));
    }
    async getWaitingProducts({ page, }) {
        try {
            const [products, productQuantity] = await this.productRepo.findAndCount({
                where: { progress: product_entity_1.Progress.Waiting },
                take: 9,
                skip: (page - 1) * 9,
                order: {
                    createdAt: 'DESC',
                },
            });
            return {
                ok: true,
                products,
                maxPage: Math.ceil(productQuantity / 9),
            };
        }
        catch (error) {
            return {
                error: 'Unexpected error',
            };
        }
    }
    async getInProgressProducts({ page, }) {
        try {
            const [products, productQuantity] = await this.productRepo.findAndCount({
                where: { progress: product_entity_1.Progress.InProgress },
                take: 9,
                skip: (page - 1) * 9,
                order: {
                    updatedAt: 'ASC',
                },
            });
            return {
                ok: true,
                products,
                maxPage: Math.ceil(productQuantity / 9),
            };
        }
        catch (error) {
            return {
                error: 'Unexpected error',
            };
        }
    }
};
ProductService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        schedule_1.SchedulerRegistry,
        file_service_1.FileService])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map