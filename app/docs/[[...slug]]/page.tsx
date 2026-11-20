import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { StatusBanner } from '@/components/status-banner';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageImageUrl, getPageMarkdownUrl, gitConfig } from '@/lib/shared';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <DocsTitle>
            {page.data.title}
            {(page.data as { status?: string }).status && (
              <span className="ms-3 rounded-full border border-fd-primary/40 bg-fd-primary/10 px-2 py-0.5 align-middle text-xs font-medium uppercase tracking-wide text-fd-primary">
                {(page.data as { status?: string }).status}
              </span>
            )}
          </DocsTitle>
          <DocsDescription className="mt-2 mb-0">{page.data.description}</DocsDescription>
        </div>
        <div className="flex shrink-0 flex-row items-center gap-2 sm:pt-1">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/${gitConfig.dir}/content/docs/${page.path}`}
          />
        </div>
      </div>
      <DocsBody>
        <StatusBanner status={(page.data as { status?: string }).status} />
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
