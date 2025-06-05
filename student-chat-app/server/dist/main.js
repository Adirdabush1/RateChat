"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path = require("path");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = [
        'http://localhost:5173',
        'https://ratechat2.onrender.com',
    ];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    });
    const expressApp = app.getHttpAdapter().getInstance();
    const reactBuildPath = path.join(__dirname, '..', 'client', 'dist');
    expressApp.use(express.static(reactBuildPath));
    expressApp.get('*', (req, res) => {
        res.sendFile(path.join(reactBuildPath, 'index.html'));
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map