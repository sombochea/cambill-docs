import { Callout } from 'fumadocs-ui/components/callout';

// What a page's `status` frontmatter means for a developer.
export function StatusBanner({ status }: { status?: string }) {
  if (status === 'experimental')
    return (
      <Callout type="warn" title="Experimental">
        This feature is behind a feature flag. If the API answers <code>403 Feature Not Enabled</code>, it is not
        turned on for your business yet; ask us to enable it. Fields and behaviour can still change, so pin your
        SDK version and watch the changelog.
      </Callout>
    );
  if (status === 'beta')
    return (
      <Callout type="info" title="Beta">
        Ready to try and used in production by early adopters, but its API may still change. Tell us what you
        need before you depend on the details.
      </Callout>
    );
  return null;
}
