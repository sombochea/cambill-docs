# cambill-docs

The public CamBill documentation: Next.js 16 + [Fumadocs](https://fumadocs.dev).

```bash
bun install
bun run dev          # http://localhost:3000
bun run build        # must pass before merging a docs change
```

Pages are MDX in `content/docs/`; order and sections live in `meta.json`. In MDX:
`Cards`/`Card`, `Callout`, `Steps`/`Step`, `Tabs`/`Tab`, and code blocks
(```` ```npm ```` renders npm/pnpm/yarn/bun tabs).

Writing rules: short pages, one task each, real copy-paste examples (SDK first,
curl second), secrets on the server in every example. When the API changes,
change `backend/openapi/openapi.yaml`, the SDK (`packages/cambill-sdk-node`) and
the matching page in the same change. `scripts/quickstart-check.ts` runs the
quickstart's calls against a real stack, so the quickstart cannot rot.
