"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const Joi = require("@hapi/joi");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user/user.entity");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const product_module_1 = require("./product/product.module");
const product_entity_1 = require("./product/product.entity");
const schedule_1 = require("@nestjs/schedule");
const file_module_1 = require("./file/file.module");
const file_entity_1 = require("./file/file.entity");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            graphql_1.GraphQLModule.forRoot({
                autoSchemaFile: true,
                context: ({ req, res }) => ({ req, res }),
                cors: {
                    credentials: true,
                    origin: true,
                },
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [
                    process.env.NODE_ENV === 'development'
                        ? '.development.env'
                        : '.test.env',
                ],
                ignoreEnvFile: process.env.NODE_ENV === 'production',
                validationSchema: Joi.object({
                    NODE_ENV: Joi.string()
                        .valid('development', 'production', 'test')
                        .required(),
                    DB_HOST: Joi.string().required(),
                    DB_PORT: Joi.string().required(),
                    DB_USERNAME: Joi.string().required(),
                    DB_DATABASE: Joi.string().required(),
                    ROUNDS: Joi.string().default(10),
                    AWS_ACCESS_ID: Joi.string().required(),
                    AWS_PRIVATE_KEY: Joi.string().required(),
                    AWS_REGION: Joi.string().required(),
                    AWS_BUCKET_NAME: Joi.string().required(),
                    SESSION_SECRET: Joi.string().required(),
                    SSL: Joi.bool().required(),
                    SSL_CERT_PATH: Joi.string(),
                    SSL_KEY_PATH: Joi.string(),
                    PORT: Joi.string(),
                }),
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: +process.env.DB_PORT,
                username: process.env.DB_USERNAME,
                database: process.env.DB_DATABASE,
                synchronize: true,
                logging: process.env.NODE_ENV !== 'production',
                entities: [user_entity_1.User, product_entity_1.Product, file_entity_1.File],
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            product_module_1.ProductModule,
            schedule_1.ScheduleModule.forRoot(),
            file_module_1.FileModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map