// A sequence diagram drawn as inline SVG, themed with the docs tokens so it
// follows light and dark. Data in, picture out: no diagram library.
type Actor = { name: string; sub?: string }
type Step =
  | { from: number; to: number; label: string; dashed?: boolean; n?: number }
  | { note: string; at: number; span?: number }

const COL = 250
const TOP = 64
const ROW = 58

export function Sequence({ actors, steps }: { actors: Actor[]; steps: Step[] }) {
  const x = (i: number) => 110 + i * COL
  const width = 220 + (actors.length - 1) * COL
  let y = TOP + 28
  const rows = steps.map((s, k) => {
    const yy = y
    y += "note" in s ? 70 : ROW
    return { s, y: yy, k }
  })
  const height = y + 10
  let count = 0
  return (
    <figure className="not-prose my-6 overflow-x-auto rounded-xl border border-fd-border bg-fd-card p-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: width * 0.8 }}
        className="mx-auto block h-auto w-full max-w-[760px] text-fd-foreground"
        role="img"
        aria-label={actors.map((a) => a.name).join(", ") + " sequence"}
      >
        <defs>
          <marker id="seq-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-fd-primary" />
          </marker>
        </defs>
        {actors.map((a, i) => (
          <g key={a.name}>
            <rect x={x(i) - 84} y={8} width={168} height={a.sub ? 44 : 34} rx={10} className="fill-fd-muted stroke-fd-border" />
            <text x={x(i)} y={a.sub ? 27 : 30} textAnchor="middle" className="fill-current text-[13px] font-semibold">
              {a.name}
            </text>
            {a.sub && (
              <text x={x(i)} y={44} textAnchor="middle" className="fill-fd-muted-foreground text-[10.5px]">
                {a.sub}
              </text>
            )}
            <line x1={x(i)} x2={x(i)} y1={a.sub ? 52 : 42} y2={height} strokeDasharray="4 5" className="stroke-fd-border" />
          </g>
        ))}
        {rows.map(({ s, y: yy, k }) => {
          if ("note" in s) {
            const span = s.span ?? 1
            const nx = x(s.at) - 90
            const w = 180 + (span - 1) * COL
            return (
              <g key={k}>
                <rect x={nx} y={yy - 18} width={w} height={46} rx={8} className="fill-fd-accent stroke-fd-primary/40" />
                {s.note.split("\n").map((t, j, all) => (
                  <text key={j} x={nx + w / 2} y={yy + 8 + (j - (all.length - 1) / 2) * 14} textAnchor="middle" className="fill-current text-[11px]">
                    {t}
                  </text>
                ))}
              </g>
            )
          }
          const a = x(s.from)
          const b = x(s.to)
          const n = s.n ?? ++count
          const mid = (a + b) / 2
          return (
            <g key={k}>
              <line x1={a} x2={b} y1={yy} y2={yy} markerEnd="url(#seq-arrow)" strokeDasharray={s.dashed ? "5 4" : undefined} strokeWidth={1.6} className="stroke-fd-primary" />
              <text x={mid} y={yy - 9} textAnchor="middle" className="fill-current text-[11.5px]">
                <tspan className="fill-fd-primary font-bold">{n}. </tspan>
                {s.label}
              </text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
