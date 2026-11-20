import { llms, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { statusBadgesPlugin } from 'fumadocs-core/source/status-badges';
import { createElement } from 'react';
import { z } from 'zod';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({ status: z.enum(['beta', 'experimental']).optional() }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [
    lucideIconsPlugin(),
    statusBadgesPlugin({
      renderBadge: (status) =>
        createElement(
          'span',
          {
            title: status,
            className:
              'ms-2 shrink-0 whitespace-nowrap rounded-full border border-fd-primary/40 bg-fd-primary/10 px-1.5 py-px align-middle text-[10px] font-medium uppercase tracking-wide text-fd-primary',
          },
          status === 'experimental' ? 'exp' : status,
        ),
    }),
  ],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
