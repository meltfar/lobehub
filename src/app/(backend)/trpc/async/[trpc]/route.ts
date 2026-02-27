import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import debug from 'debug';
import { type NextRequest } from 'next/server';

import { createAsyncRouteContext } from '@/libs/trpc/async/context';
import { prepareRequestForTRPC } from '@/libs/trpc/utils/request-adapter';
import { createResponseMeta } from '@/libs/trpc/utils/responseMeta';
import { asyncRouter } from '@/server/routers/async';

const log = debug('lobe-chat:trpc:async');

const handler = (req: NextRequest) => {
  // Clone the request to avoid "Response body object should not be disturbed or locked" error
  // in Next.js 16 when the body stream has been consumed by Next.js internal mechanisms
  const preparedReq = prepareRequestForTRPC(req);

  return fetchRequestHandler({
    // Avoid interference between requests
    // https://github.com/lobehub/lobe-chat/discussions/7442#discussioncomment-13658563
    allowBatching: false,

    /**
     * @link https://trpc.io/docs/v11/context
     */
    createContext: () => createAsyncRouteContext(req),

    endpoint: '/trpc/async',

    onError: ({ error, path, type }) => {
      log('Error in tRPC handler on path: %s, type: %s', path, type);
      log('Error: %O', error);
    },

    req: preparedReq,
    responseMeta: createResponseMeta,
    router: asyncRouter,
  });
};

export { handler as GET, handler as POST };
