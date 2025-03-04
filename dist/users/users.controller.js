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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const decorators_1 = require("../shared/decorators");
const roles_enum_1 = require("../shared/enums/roles.enum");
const create_user_account_dto_1 = require("./dto/create-user-account.dto");
const update_user_account_dto_1 = require("./dto/update-user-account.dto");
const user_entity_1 = require("./entities/user.entity");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(createUserAccountDto) {
        const results = await this.usersService.create(createUserAccountDto);
        return { message: 'User created successfully', results };
    }
    async getUsers(options) {
        const results = await this.usersService.findAll(options);
        return { message: 'Users retrieved successfully', results };
    }
    async getExperts() {
        const results = await this.usersService.findAllExperts();
        return { message: 'Experts retrieved successfully', results };
    }
    async activate(id, user) {
        await this.usersService.activate(+id, user);
        return { message: 'User activated successfully', results: null };
    }
    async update(id, updateUserAccountDto) {
        await this.usersService.update(+id, updateUserAccountDto);
        return { message: 'User updated successfully', results: null };
    }
    async remove(id, user) {
        await this.usersService.remove(+id, user);
        return { message: 'User deleted successfully', results: null };
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.CreatedResponse)(user_entity_1.User),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_account_dto_1.CreateUserAccountDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.PageResponse)(user_entity_1.User),
    (0, decorators_1.Paginated)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorators_1.PaginationParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('experts'),
    (0, decorators_1.OkArrayResponse)(user_entity_1.User),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getExperts", null);
__decorate([
    (0, common_1.Patch)('/activate/:id'),
    (0, decorators_1.OkResponse)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "activate", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.OkResponse)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_account_dto_1.UpdateUserAccountDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.OkResponse)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, auth_decorator_1.Auth)(roles_enum_1.Roles.DBI_ADMIN),
    (0, swagger_1.ApiTags)('User'),
    (0, swagger_1.ApiExtraModels)(user_entity_1.User),
    (0, decorators_1.ErrorResponses)(decorators_1.ForbiddenResponse, decorators_1.UnauthorizedResponse),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map