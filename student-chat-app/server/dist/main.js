"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = ['https://ratechat-f72a4557d4ab.herokuapp.com'];
    app.enableCors({
        origin: 'https://ratechat-front-d89b15939b57.herokuapp.com',
        credentials: true,
    });
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`✅ Application is running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map