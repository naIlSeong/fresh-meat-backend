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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const common_dto_1 = require("../common/common.dto");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcrypt");
const product_entity_1 = require("../product/product.entity");
let UserService = class UserService {
    constructor(userRepo, productRepo) {
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }
    async createUser({ username, email, password, }) {
        try {
            const existUsername = await this.userRepo.findOne({ username });
            if (existUsername) {
                return {
                    error: 'Already exist username',
                };
            }
            const existEmail = await this.userRepo.findOne({ email });
            if (existEmail) {
                return {
                    error: 'Already exist email',
                };
            }
            await this.userRepo.save(this.userRepo.create({ username, email, password }));
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
    async login({ email, password }, session) {
        try {
            const user = await this.userRepo.findOne({
                where: { email },
                select: ['password', 'id', 'username', 'email'],
            });
            if (!user) {
                return {
                    error: 'Email not found',
                };
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return {
                    error: 'Wrong password',
                };
            }
            session.user = user;
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
    async logout(session) {
        try {
            session.destroy((err) => {
                if (err) {
                    throw new Error('Error: Destroy session');
                }
            });
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
    async userDetail({ userId }) {
        try {
            const user = await this.userRepo.findOne({ id: userId });
            if (!user) {
                return {
                    error: 'User not found',
                };
            }
            const waiting = await this.productRepo.find({
                seller: {
                    id: userId,
                },
                progress: product_entity_1.Progress.Waiting,
            });
            const inProgress = await this.productRepo.find({
                seller: {
                    id: userId,
                },
                progress: product_entity_1.Progress.InProgress,
            });
            return {
                ok: true,
                user,
                waiting,
                inProgress,
            };
        }
        catch (error) {
            return {
                error: 'Unexpected error',
            };
        }
    }
    async myProfile(userId) {
        try {
            const uploadedProduct = [];
            const uploaded = await this.productRepo.find({
                seller: {
                    id: userId,
                },
            });
            uploaded.forEach((product) => {
                if (product.progress === product_entity_1.Progress.Paid) {
                    uploadedProduct.push(product);
                }
                if (product.progress === product_entity_1.Progress.Closed) {
                    uploadedProduct.push(product);
                }
                if (product.progress === product_entity_1.Progress.Completed) {
                    uploadedProduct.push(product);
                }
            });
            const biddedProduct = await this.productRepo.find({
                bidder: {
                    id: userId,
                },
            });
            const inProgressProduct = [];
            const closedProduct = [];
            const paidProduct = [];
            const completedProduct = [];
            biddedProduct.forEach((product) => {
                if (product.progress === product_entity_1.Progress.InProgress) {
                    inProgressProduct.push(product);
                }
                if (product.progress === product_entity_1.Progress.Closed) {
                    closedProduct.push(product);
                }
                if (product.progress === product_entity_1.Progress.Paid) {
                    paidProduct.push(product);
                }
                if (product.progress === product_entity_1.Progress.Completed) {
                    completedProduct.push(product);
                }
            });
            return {
                ok: true,
                uploadedProduct,
                inProgressProduct,
                closedProduct,
                paidProduct,
                completedProduct,
            };
        }
        catch (error) {
            return {
                error: 'Unexpected error',
            };
        }
    }
    async updateUser({ username, email, password }, userId) {
        try {
            const user = await this.userRepo.findOne({ id: userId });
            if (username) {
                const exist = await this.userRepo.findOne({ username });
                if (exist && exist.id !== user.id) {
                    return {
                        error: 'Already exist username',
                    };
                }
                user.username = username;
            }
            if (email) {
                const exist = await this.userRepo.findOne({ email });
                if (exist && exist.id !== user.id) {
                    return {
                        error: 'Already exist email',
                    };
                }
                user.email = email;
            }
            if (password) {
                const currentPassword = await this.userRepo.findOne({
                    where: { id: userId },
                    select: ['password'],
                });
                const isSamePassword = await bcrypt.compare(password, currentPassword.password);
                if (isSamePassword) {
                    return {
                        error: 'Same password',
                    };
                }
                user.password = password;
            }
            await this.userRepo.save(user);
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
    async deleteUser({ password }, userId) {
        try {
            const user = await this.userRepo.findOne({
                where: { id: userId },
                select: ['password'],
            });
            if (!user) {
                return {
                    error: 'User not found',
                };
            }
            const isSamePassword = await bcrypt.compare(password, user.password);
            if (!isSamePassword) {
                return {
                    error: 'Check password again',
                };
            }
            await this.userRepo.delete({ id: userId });
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
UserService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(1, typeorm_1.InjectRepository(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map