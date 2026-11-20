// Writes content/docs/api-reference.mdx from the published OpenAPI description, so the
// reference is the same file the server is tested against (TestOpenAPIMatchesTheRouter).
//   bun scripts/gen-reference.ts
// The docs are hosted on their own (Vercel), where the repository's backend/ folder is
// not available, so the spec is fetched from the endpoint. OPENAPI_URL overrides it; the
// repo's own builds (make packages, CI) point it at the working tree with a file:// URL
// so a change to the spec shows up in the reference before it is deployed.
type Json = Record<string, any>
const SPEC_URL = process.env.OPENAPI_URL || "https://cambill.cubis.tech/v1/openapi.yaml"
const PUBLIC_SPEC = "https://cambill.cubis.tech/v1/openapi.yaml"

async function load(url: string): Promise<string> {
  let last: unknown
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15_000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.text()
    } catch (e) {
      last = e
      if (attempt < 3) await Bun.sleep(attempt * 1000)
    }
  }
  throw new Error(`Could not load the OpenAPI description from ${url}: ${last}. Set OPENAPI_URL to another address (or a file:// URL).`)
}
const spec = Bun.YAML.parse(await load(SPEC_URL)) as Json

const ref = (o: Json | undefined): Json | undefined => {
  if (!o?.$ref) return o
  const [, , group, name] = (o.$ref as string).split("/")
  return spec.components[group!][name!]
}
const typeOf = (s: Json | undefined): string => {
  const r = ref(s) ?? {}
  if (r.enum) return (r.enum as string[]).map((v) => `\`${v}\``).join(" \\| ")
  if (Array.isArray(r.type)) return r.type.join(" or ")
  if (r.type === "array") return `${typeOf(r.items)}[]`
  return r.type ?? (r.oneOf ? "object or null" : "object")
}
const cell = (s: unknown) => String(s ?? "").replace(/\n+/g, " ").replace(/\|/g, "\\|").trim()

function fields(schema: Json | undefined): string {
  const r = ref(schema)
  const props = r?.properties as Json | undefined
  if (!props) return ""
  const required = new Set<string>(r?.required ?? [])
  const rows = Object.entries(props).map(([name, p]) => {
    const d = ref(p as Json) ?? {}
    return `| \`${name}\` | ${typeOf(p as Json)} | ${required.has(name) ? "yes" : ""} | ${cell((p as Json).description ?? d.description)} |`
  })
  return `| Field | Type | Required | |\n| --- | --- | --- | --- |\n${rows.join("\n")}\n`
}

const out: string[] = [
  `---\ntitle: "API reference"\ndescription: "Every endpoint, generated from openapi.yaml."\n---\n`,
  `Base URL \`https://cambill.cubis.tech\`. Send your key in \`X-API-Key\`. The machine-readable description is [openapi.yaml](${PUBLIC_SPEC}). Amounts are integers in the minor unit. Errors are [problem+json](/docs/errors).\n`,
]
for (const tag of spec.tags as { name: string }[]) {
  out.push(`## ${tag.name}\n`)
  for (const [path, item] of Object.entries(spec.paths as Json)) {
    for (const [method, op] of Object.entries(item as Json)) {
      if (!op.tags?.includes(tag.name)) continue
      out.push(`### ${op.summary}\n`, `\`${method.toUpperCase()} ${path}\`\n`)
      if (op.description) out.push(`${String(op.description).trim()}\n`)
      const params = ((op.parameters as Json[]) ?? []).map((p) => ref(p)!).filter((p) => p.in !== "header")
      if (params.length) {
        out.push("| Parameter | In | Type | |\n| --- | --- | --- | --- |")
        for (const p of params) out.push(`| \`${p.name}\` | ${p.in} | ${typeOf(p.schema)} | ${cell(p.description)} |`)
        out.push("")
      }
      const body = op.requestBody?.content?.["application/json"]?.schema
      if (body) out.push(fields(body))
      const ok = Object.entries(op.responses as Json).filter(([s]) => s.startsWith("2"))
      const bad = Object.keys(op.responses as Json).filter((s) => !s.startsWith("2"))
      out.push(`Returns ${ok.map(([s, r]) => `\`${s}\` ${String((r as Json).description).toLowerCase()}`).join(", ")}.${bad.length ? ` Errors: ${bad.map((s) => `\`${s}\``).join(", ")}.` : ""}\n`)
    }
  }
}
out.push(`## Objects\n`)
for (const [name, schema] of Object.entries(spec.components.schemas as Json)) {
  if (/Input$|Update$|^Problem$|^Metadata$/.test(name)) continue
  out.push(`### ${name}\n`, fields(schema as Json))
}
await Bun.write(new URL("../content/docs/api-reference.mdx", import.meta.url), out.join("\n"))
console.log("api-reference.mdx written")
