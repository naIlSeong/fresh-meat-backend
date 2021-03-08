"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
const redis = require("redis");
const connectRedis = require("connect-redis");
const aws_sdk_1 = require("aws-sdk");
const config_1 = require("@nestjs/config");
const altair_express_middleware_1 = require("altair-express-middleware");
const fs = require("fs");
const path = require("path");
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
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { httpsOptions });
    app.enableCors({
        origin: process.env.MAIN_DOMAIN_WITH_PROTOCOL,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        maxAge: 3600,
    });
    const configService = app.get(config_1.ConfigService);
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
    app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: configService.get('SESSION_SECRET'),
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
            httpOnly: false,
            maxAge: 1000 * 60 * 60,
            sameSite: 'none',
            domain: process.env.NODE_ENV === 'production'
                ? process.env.MAIN_DOMAIN
                : null,
        },
    }));
    app.useGlobalPipes(new common_1.ValidationPipe());
    aws_sdk_1.config.update({
        accessKeyId: configService.get('AWS_ACCESS_ID'),
        secretAccessKey: configService.get('AWS_PRIVATE_KEY'),
    });
    app.use('/altair', altair_express_middleware_1.altairExpress({
        endpointURL: '/graphql',
    }));
    await app.listen(PORT);
    console.log(`🔥 Server running on 👉 https://localhost:${PORT}/graphql`);
}
bootstrap();
//# sourceMappingURL=main.js.map