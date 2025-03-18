"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = exports.configureSwagger = exports.testingConfig = exports.runtimeConfig = exports.commonConfig = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const test_typeorm_config_1 = require("./test.typeorm.config");
const typeorm_config_1 = require("./typeorm.config");
const commonConfig = () => ({
    port: parseInt(process.env.PORT),
    env: process.env.NODE_ENV,
    url: process.env.API_URL,
    defaultPassword: process.env.DEFAULT_PASSWORD,
    cron_expression: process.env.CRON_EXPRESSION,
    swaggerEnabled: process.env.SWAGGER_ENABLED === 'true',
    jwt: {
        privateKey: process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n'),
        publicKey: process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n'),
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
    web: {
        clientUrl: process.env.CLIENT_APP_URL,
        adminUrl: process.env.ADMIN_APP_URL,
    },
    pindo: {
        apiKey: process.env.NODE_ENV === 'test'
            ? 'eytesting'
            : process.env.PINDO_API_KEY,
        apiUrl: process.env.PINDO_API_URL,
    },
    sendgrid: {
        apiKey: process.env.NODE_ENV === 'test'
            ? 'SG.testing'
            : process.env.SENDGRID_API_KEY,
        fromEmail: process.env.SENT_EMAIL_FROM,
    },
});
exports.commonConfig = commonConfig;
const runtimeConfig = () => (Object.assign({ allowedOrigins: process.env.ALLOWED_ORIGINS.split(','), database: process.env.NODE_ENV === 'test' ? test_typeorm_config_1.default : typeorm_config_1.default }, (0, exports.commonConfig)()));
exports.runtimeConfig = runtimeConfig;
const testingConfig = () => (Object.assign({}, (0, exports.commonConfig)()));
exports.testingConfig = testingConfig;
function configureSwagger(app) {
    const API_TITLE = 'Trust seal system API';
    const API_DESCRIPTION = 'API Doc. for Trust seal system API';
    const API_VERSION = '1.0';
    const SWAGGER_URL = 'docs/swagger-ui';
    const options = new swagger_1.DocumentBuilder()
        .setTitle(API_TITLE)
        .setDescription(API_DESCRIPTION)
        .setVersion(API_VERSION)
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup(SWAGGER_URL, app, document, {
        customSiteTitle: 'Trust Seal System API',
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
            docExpansion: 'none',
            persistAuthorization: true,
            apisSorter: 'alpha',
            operationsSorter: 'method',
            tagsSorter: 'alpha',
        },
    });
}
exports.configureSwagger = configureSwagger;
function corsConfig() {
    return {
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Set-Cookie, Cookies',
        credentials: true,
        origin: (origin, callback) => {
            const appConfigs = (0, exports.runtimeConfig)();
            const whitelist = appConfigs.allowedOrigins || [];
            const canAllowUndefinedOrigin = origin === undefined &&
                (appConfigs.env !== 'production' || appConfigs.swaggerEnabled);
            if (whitelist.indexOf(origin) !== -1 || canAllowUndefinedOrigin) {
                callback(null, true);
            }
            else {
                callback(new common_1.UnauthorizedException(`Not allowed by CORS for origin:${origin} on ${appConfigs.env}`));
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    };
}
exports.corsConfig = corsConfig;
//# sourceMappingURL=app.config.js.map