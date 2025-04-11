import { existsSync, readdirSync } from 'fs';
import { Application } from 'express';
import path from 'path';

const routes = async (app: Application) => {
  const domainPath = path.join(__dirname, '..', 'domain');

  if (existsSync(domainPath)) {
    for (const domain of readdirSync(domainPath)) {
      const routerPath = path.join(domainPath, domain, 'router');
      if (existsSync(routerPath)) {
        for (const file of readdirSync(routerPath)) {
          if (file.endsWith('.router.ts')) {
            const { default: router } = await import(path.join(routerPath, file));
            app.use(`/api/v1/${domain}`, router);
          }
        }
      }
    }
  }
};

export default routes;
