import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // The product's name, so the docs read as the same product.
      title: (
        <span className="flex items-center gap-2">
          <span className="font-semibold tracking-tight">CamBill</span>
          <span className="rounded-md border px-1.5 py-px text-[11px] font-medium text-fd-muted-foreground">
            Docs
          </span>
        </span>
      ),
    },
    links: [
      { text: 'Docs', url: '/docs', active: 'nested-url' },
      { text: 'Dashboard', url: 'https://cambill.cubis.tech/dashboard', external: true },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
