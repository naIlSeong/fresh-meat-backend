import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { altairExpress } from 'altair-express-middleware';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const ssl = process.env.SSL === 'true' ? true : false;
  const PORT = +process.env.PORT || 3000;

  let httpsOptions = null;
  if (ssl) {
    const keyPath = process.env.SSL_KEY_PATH || '';
    const certPath = process.env.SSL_CERT_PATH || '';
    httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, keyPath)),
      cert: fs.readFileSync(path.join(__dirname, certPath)),
    };
  }

  const app = await NestFactory.create(AppModule, { httpsOptions });

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
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
        maxAge: 1000 * 60 * 60, // session max age in miliseconds
        sameSite: 'none',
        domain:
          process.env.NODE_ENV === 'production' ? process.env.DOMAIN : null,
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_ID'),
    secretAccessKey: configService.get('AWS_PRIVATE_KEY'),
  });

  app.use(
    '/altair',
    altairExpress({
      endpointURL: '/graphql',
    }),
  );

  await app.listen(PORT);
  console.log(`🔥 Server running on 👉 https://localhost:${PORT}/graphql`);
}
bootstrap();
