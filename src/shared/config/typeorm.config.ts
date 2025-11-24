import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { isRunningInDevelopment } from '../utils/env.util';

const migrations = isRunningInDevelopment()
    ? ['src/db/migrations/*{.ts,.js}']
    : ['dist/src/db/migrations/*{.ts,.js}', 'dist/db/migrations/*{.ts,.js}'];

const typeOrmConfig: TypeOrmModuleOptions = {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    type: 'postgres',
    synchronize: isRunningInDevelopment(),
    // synchronize: false,
    // dropSchema: isRunningInDevelopment(),
    keepConnectionAlive: true,
    logging: isRunningInDevelopment(),
    entities: ['dist/**/*.entity.js'],
    autoLoadEntities: true,
    migrationsTableName: 'migrations',
    migrations,
    cli: { migrationsDir: 'src/db/migrations' },
    migrationsRun: !isRunningInDevelopment(),
    // extra: {
    //     ssl: {
    //         rejectUnauthorized: false,
    //     },
    // },
};

export default typeOrmConfig;
