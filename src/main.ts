import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
  });

  redisClient.on('error', function (err) {
    console.log('🔥 Could not establish a connection with redis. ' + err);
  });
  redisClient.on('connect', function (err) {
    console.log('🔥 Connected to redis successfully');
  });

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: 'secret$%^134',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
        maxAge: 1000 * 60 * 10, // session max age in miliseconds
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_ID'),
    secretAccessKey: configService.get('AWS_PRIVATE_KEY'),
  });

  await app.listen(4000);
}
bootstrap();
