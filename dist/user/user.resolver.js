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
exports.UserResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_constant_1 = require("../common/common.constant");
const common_dto_1 = require("../common/common.dto");
const common_interface_1 = require("../common/common.interface");
const auth_decorator_1 = require("../auth/auth.decorator");
const create_user_dto_1 = require("./dto/create-user.dto");
const delete_user_dto_1 = require("./dto/delete-user.dto");
const login_dto_1 = require("./dto/login-dto");
const my_profile_dto_1 = require("./dto/my-profile.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_detail_dto_1 = require("./dto/user-detail.dto");
const user_entity_1 = require("./user.entity");
const user_service_1 = require("./user.service");
let UserResolver = class UserResolver {
    constructor(userService) {
        this.userService = userService;
    }
    me(user) {
        return user;
    }
    createUser(createUserDto) {
        return this.userService.createUser(createUserDto);
    }
    login(loginDto, context) {
        return this.userService.login(loginDto, context.req.session);
    }
    logout(context) {
        return this.userService.logout(context.req.session);
    }
    userDetail(userDetailDto) {
        return this.userService.userDetail(userDetailDto);
    }
    myProfile(user) {
        return this.userService.myProfile(user.id);
    }
    updateUser(updateUserDto, user) {
        return this.userService.updateUser(updateUserDto, user.id);
    }
    deleteUser(deleteUserDto, user) {
        return this.userService.deleteUser(deleteUserDto, user.id);
    }
};
__decorate([
    graphql_1.Query((returns) => user_entity_1.User),
    __param(0, auth_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
__decorate([
    common_constant_1.Public(),
    graphql_1.Mutation((returns) => common_dto_1.CommonOutput),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    common_constant_1.Public(),
    graphql_1.Mutation((returns) => login_dto_1.LoginOutput),
    __param(0, graphql_1.Args('input')),
    __param(1, graphql_1.Context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    common_constant_1.Public(),
    graphql_1.Mutation((returns) => common_dto_1.CommonOutput),
    __param(0, graphql_1.Context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    common_constant_1.Public(),
    graphql_1.Query((returns) => user_detail_dto_1.UserDetailOutput),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_detail_dto_1.UserDetailDto]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userDetail", null);
__decorate([
    graphql_1.Query((returns) => my_profile_dto_1.MyProfileOutput),
    __param(0, auth_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "myProfile", null);
__decorate([
    graphql_1.Mutation((returns) => common_dto_1.CommonOutput),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "updateUser", null);
__decorate([
    graphql_1.Mutation((returns) => common_dto_1.CommonOutput),
    __param(0, graphql_1.Args('input')),
    __param(1, auth_decorator_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_user_dto_1.DeleteUserDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "deleteUser", null);
UserResolver = __decorate([
    graphql_1.Resolver(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map