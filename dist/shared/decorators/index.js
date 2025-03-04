"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalProperty = exports.NotFoundResponse = exports.ConflictResponse = exports.BadRequestResponse = exports.ForbiddenResponse = exports.UnauthorizedResponse = exports.ErrorResponses = exports.CreatedArrayResponse = exports.OkArrayResponse = exports.PageResponse = exports.CreatedResponse = exports.OkResponse = exports.Response = exports.Operation = exports.QueryParam = exports.Paginated = exports.PaginationParams = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_util_1 = require("../utils/swagger.util");
exports.PaginationParams = (0, common_1.createParamDecorator)((_data, ctx) => {
    var _a, _b;
    const req = ctx.switchToHttp().getRequest();
    return {
        page: +((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.page) || 1,
        limit: +((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.limit) || 10,
    };
});
function Paginated() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({ name: 'page', required: false }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false }));
}
exports.Paginated = Paginated;
function QueryParam(name, required = true, enumType) {
    return (0, swagger_1.ApiQuery)({ name, required, enum: enumType });
}
exports.QueryParam = QueryParam;
function Operation(summary) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary,
    }));
}
exports.Operation = Operation;
function Response(status, model) {
    if (status < 300)
        return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)(Object.assign({ status }, (0, swagger_util_1.getGenericResponseSchema)(model))));
    else
        throw new TypeError('Status passed to decorator not a success status');
}
exports.Response = Response;
function OkResponse(model) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)(Object.assign({ status: common_1.HttpStatus.OK }, (0, swagger_util_1.getGenericResponseSchema)(model))));
}
exports.OkResponse = OkResponse;
function CreatedResponse(model) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiCreatedResponse)(Object.assign({}, (0, swagger_util_1.getGenericResponseSchema)(model))));
}
exports.CreatedResponse = CreatedResponse;
function PageResponse(model) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOkResponse)(Object.assign({}, (0, swagger_util_1.getPaginatedSchema)(model))));
}
exports.PageResponse = PageResponse;
function OkArrayResponse(model) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)(Object.assign({ status: common_1.HttpStatus.OK }, (0, swagger_util_1.getArraySchema)(model))));
}
exports.OkArrayResponse = OkArrayResponse;
function CreatedArrayResponse(model) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)(Object.assign({ status: common_1.HttpStatus.CREATED }, (0, swagger_util_1.getArraySchema)(model))));
}
exports.CreatedArrayResponse = CreatedArrayResponse;
function ErrorResponses(...errorResponses) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)(Object.assign({ description: 'Error response schema.' }, (0, swagger_util_1.getGenericErrorResponseSchema)())), ...errorResponses.map((e) => e()));
}
exports.ErrorResponses = ErrorResponses;
function UnauthorizedResponse() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Unauthorized',
    }));
}
exports.UnauthorizedResponse = UnauthorizedResponse;
function ForbiddenResponse() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiForbiddenResponse)({
        description: 'Forbidden resource',
    }));
}
exports.ForbiddenResponse = ForbiddenResponse;
function BadRequestResponse() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid request',
    }));
}
exports.BadRequestResponse = BadRequestResponse;
function ConflictResponse() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiConflictResponse)({
        description: 'Conflict',
    }));
}
exports.ConflictResponse = ConflictResponse;
function NotFoundResponse() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiNotFoundResponse)({
        description: 'Resource Not found',
    }));
}
exports.NotFoundResponse = NotFoundResponse;
function OptionalProperty(options) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiPropertyOptional)(options), (0, class_validator_1.IsOptional)());
}
exports.OptionalProperty = OptionalProperty;
//# sourceMappingURL=index.js.map