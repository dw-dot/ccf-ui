import { CCFDatabaseOptions, searchHubmap } from 'ccf-database';
import { RequestHandler } from 'express';

import { AutoPruneLRUCache } from '../../../utils/auto-prune-lru-cache';
import { RequestCache } from '../../../utils/request-cache';


async function getLocations(token: string, options: CCFDatabaseOptions): Promise<unknown> {
  const result = await searchHubmap(
    options.hubmapDataUrl,
    options.hubmapDataService,
    options.hubmapQuery || undefined,
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    token || options.hubmapToken || undefined,
    options.hubmapAssetsUrl,
    options.hubmapPortalUrl
  );

  return result;
}


export function ruiLocations(): RequestHandler {
  const cache = new RequestCache<string, unknown>(
    new AutoPruneLRUCache({
      max: 10,
      maxAge: 60 * 60 * 1000
    }),
    getLocations
  );

  return async (req, res, _next) => {
    const options: CCFDatabaseOptions = req.app.get('database-options');
    const rawToken = req.query.token;
    const token = typeof rawToken === 'string' ? rawToken : '';
    const result = await cache.get(token, options);

    if (result) {
      res.json(result);
    } else {
      res.status(500).json([]);
    }
  };
}
