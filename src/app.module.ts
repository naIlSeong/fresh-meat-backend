import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { Product } from './product/product.entity';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({ sessionId: req.headers['sessionid'] }),
    }),
    ConfigModule.forRoot({
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
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging: process.env.NODE_ENV !== 'production',
      entities: [User, Product],
    }),
    UserModule,
    AuthModule,
    ProductModule,
  ],
})
export class AppModule {}
