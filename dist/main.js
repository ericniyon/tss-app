"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const cookieParser = require("cookie-parser");
require("dotenv/config");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const app_config_1 = require("./shared/config/app.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('port');
    app.use((0, helmet_1.default)());
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    app.enableCors((0, app_config_1.corsConfig)());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    if (configService.get('swaggerEnabled'))
        (0, app_config_1.configureSwagger)(app);
    await app.listen(port || 3000);
    common_1.Logger.log(`Server running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map