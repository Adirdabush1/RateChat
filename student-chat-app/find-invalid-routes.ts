import { NestFactory } from '@nestjs/core';
import { AppModule } from './server/src/app.module';
import pathToRegexp from 'path-to-regexp';  // <-- כאן

async function findInvalidRoutes() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const router = app.getHttpAdapter().getInstance();

  const stack = router._router?.stack || [];

  for (const layer of stack) {
    if (layer.route) {
      const path = layer.route.path;
      const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();

      try {
        pathToRegexp(path);
        console.log(`Route OK: [${methods}] ${path}`);
      } catch (e) {
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
