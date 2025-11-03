"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const env_util_1 = require("../utils/env.util");
const typeOrmConfig = {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    type: 'postgres',
    synchronize: (0, env_util_1.isRunningInDevelopment)(),
    keepConnectionAlive: true,
    logging: (0, env_util_1.isRunningInDevelopment)(),
    entities: ['dist/**/*.entity.js'],
    autoLoadEntities: true,
    migrationsTableName: 'migrations',
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    cli: { migrationsDir: 'src/db/migrations' },
    migrationsRun: !(0, env_util_1.isRunningInDevelopment)(),
};
exports.default = typeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map