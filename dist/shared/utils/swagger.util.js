"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenericErrorResponseSchema = exports.getGenericResponseSchema = exports.getArraySchema = exports.getPaginatedSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
const getPaginatedSchema = (model) => {
    return {
        schema: {
            allOf: [
                {
                    properties: {
                        message: { type: 'string' },
                        results: {
                            properties: {
                                items: {
                                    type: 'array',
                                    items: { $ref: (0, swagger_1.getSchemaPath)(model) },
                                },
                                totalItems: { type: 'number' },
                                itemCount: { type: 'number' },
                                itemsPerPage: { type: 'number' },
                                totalPages: { type: 'number' },
                                currentPage: { type: 'number' },
                            },
                        },
                    },
                },
            ],
        },
    };
};
exports.getPaginatedSchema = getPaginatedSchema;
const getArraySchema = (model) => {
    return {
        schema: {
            allOf: [
                {
                    properties: {
                        message: { type: 'string' },
                        results: {
                            properties: {
                                data: {
                                    type: 'array',
                                    items: { $ref: (0, swagger_1.getSchemaPath)(model) },
                                },
                            },
                        },
                    },
                },
            ],
        },
    };
};
exports.getArraySchema = getArraySchema;
const getGenericResponseSchema = (model) => {
    return {
        schema: {
            allOf: [
                {
                    properties: {
                        message: { type: 'string' },
                        results: model
                            ? { $ref: (0, swagger_1.getSchemaPath)(model) }
                            : { type: 'string' },
                    },
                },
            ],
        },
    };
};
exports.getGenericResponseSchema = getGenericResponseSchema;
const getGenericErrorResponseSchema = () => {
    return {
        schema: {
            allOf: [
                {
                    properties: {
                        statusCode: { type: 'number' },
                        message: {
                            type: 'array',
                            items: { type: 'string' },
                        },
                        error: { type: 'string' },
                        timestamp: { type: 'string' },
                    },
                },
            ],
        },
    };
};
exports.getGenericErrorResponseSchema = getGenericErrorResponseSchema;
//# sourceMappingURL=swagger.util.js.map