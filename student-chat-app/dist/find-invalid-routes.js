"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./server/src/app.module");
const path_to_regexp_1 = __importDefault(require("path-to-regexp")); // <-- כאן
async function findInvalidRoutes() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.init();
    const router = app.getHttpAdapter().getInstance();
    const stack = router._router?.stack || [];
    for (const layer of stack) {
        if (layer.route) {
            const path = layer.route.path;
            const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
            try {
                (0, path_to_regexp_1.default)(path);
                console.log(`Route OK: [${methods}] ${path}`);
            }
            catch (e) {
                console.error(`Invalid route detected: [${methods}] ${path}`);
                console.error(e);
            }
        }
    }
    await app.close();
}
findInvalidRoutes().catch((err) => {
    console.error('Error while finding invalid routes:', err);
    process.exit(1);
});
//# sourceMappingURL=find-invalid-routes.js.map