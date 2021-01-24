import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_PRIVATE_KEY,
    region: process.env.AWS_REGION,
  });
  await app.listen(3000);
}
bootstrap();
