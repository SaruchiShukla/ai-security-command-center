import { useEffect, useMemo, useState } from 'react'
import {
  edges,
  nodeById,
  nodes,
  productById,
  products,
  threats,
  threatsForNode,
  threatsForProduct,
  type NodeId,
  type ProductId,
  type Threat,
} from './data/catalog'
import './App.css'

type Selection =
  | { kind: 'product'; id: ProductId }
  | { kind: 'node'; id: NodeId }
  | { kind: 'threat'; id: string }

type Packet = {
  id: number
  threat: Threat
  from: NodeId
  to: NodeId
  t: number
  blocked: boolean
}

const NODE_W = 176
const NODE_H = 64

function nodePoint(id: NodeId) {
  const n = nodeById[id]
  return { x: n.x, y: n.y }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function severityColor(s: Threat['severity']) {
  if (s === 'critical') return '#ff5d73'
  if (s === 'high') return '#ff8a4c'
  return '#f5c15c'
}

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 32 32" aria-hidden>
      <path
        d="M16 5L26 9.5V16.5C26 22 21.8 26.2 16 27.5C10.2 26.2 6 22 6 16.5V9.5L16 5Z"
        fill="none"
        stroke="#FF5A1F"
        strokeWidth="1.6"
      />
      <circle cx="16" cy="16" r="3.2" fill="#FF5A1F" />
    </svg>
  )
}

export default function App() {
  const [selection, setSelection] = useState<Selection>({ kind: 'product', id: 'airs' })
  const [enabled, setEnabled] = useState<Record<ProductId, boolean>>({
    airs: true,
    'ai-access': true,
    'prisma-browser': true,
    xdr: true,
    aspm: true,
    'ai-spm': true,
  })
  const [packets, setPackets] = useState<Packet[]>([])
  const [feed, setFeed] = useState<
    { id: number; threat: Threat; blocked: boolean; at: string }[]
  >([])

  const selectedProduct = selection.kind === 'product' ? productById[selection.id] : null
  const selectedNode = selection.kind === 'node' ? nodeById[selection.id] : null
  const selectedThreat =
    selection.kind === 'threat' ? threats.find((t) => t.id === selection.id) ?? null : null

  const highlightedNodes = useMemo(() => {
    if (selection.kind === 'product') return new Set(productById[selection.id].covers)
    if (selection.kind === 'node') return new Set([selection.id])
    return new Set(selectedThreat?.nodeIds ?? [])
  }, [selection, selectedThreat])

  const highlightedProducts = useMemo(() => {
    if (selection.kind === 'product') return new Set([selection.id])
    if (selection.kind === 'node') {
      return new Set(threatsForNode(selection.id).flatMap((t) => t.productIds))
    }
    return new Set(selectedThreat?.productIds ?? [])
  }, [selection, selectedThreat])

  useEffect(() => {
    let id = 0
    const spawn = window.setInterval(() => {
      const threat = threats[Math.floor(Math.random() * threats.length)]
      const from = threat.nodeIds[0]
      const to = threat.nodeIds[1] ?? threat.nodeIds[0]
      const blocked = threat.productIds.some((p) => enabled[p])
      const at = new Date().toLocaleTimeString([], { hour12: false })
      id += 1
      setPackets((prev) => [...prev.slice(-18), { id, threat, from, to, t: 0, blocked }])
      setFeed((prev) => [{ id, threat, blocked, at }, ...prev].slice(0, 8))
    }, 1300)
    return () => window.clearInterval(spawn)
  }, [enabled])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1400
      last = now
      setPackets((prev) =>
        prev
          .map((p) => ({ ...p, t: p.t + dt }))
          .filter((p) => p.t < (p.blocked ? 0.62 : 1.05)),
      )
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const inspectorThreats = selectedProduct
    ? threatsForProduct(selectedProduct.id)
    : selectedNode
      ? threatsForNode(selectedNode.id)
      : selectedThreat
        ? [selectedThreat]
        : []

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Mark />
          <div>
            <h1>AI Security Command Center</h1>
            <p>Palo Alto Networks portfolio · build-side and access-side AI threats</p>
          </div>
        </div>
        <div className="legend">
          <span>
            <i className="swatch" style={{ background: 'var(--build)' }} /> Build / posture
          </span>
          <span>
            <i className="swatch" style={{ background: 'var(--access)' }} /> Access / runtime
          </span>
          <span className="live mono">
            <i className="dot" /> Live mock
          </span>
          <a className="credit" href="https://amardeepshukla.ai" target="_blank" rel="noreferrer">
            amardeepshukla.ai
          </a>
        </div>
      </header>

      <div className="grid">
        <aside className="panel">
          <header>
            <h2>Portfolio</h2>
            <p>Click a control to light up the surface it covers. Toggle to watch blocks vs. misses.</p>
          </header>
          <div className="product-list">
            {products.map((p) => (
              <article
                key={p.id}
                className={`product ${selection.kind === 'product' && selection.id === p.id ? 'active' : ''}`}
                onClick={() => setSelection({ kind: 'product', id: p.id })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelection({ kind: 'product', id: p.id })
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="row">
                  <span className="chip">{p.family}</span>
                  <label className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>
                    <input
                      type="checkbox"
                      checked={enabled[p.id]}
                      onChange={(e) => setEnabled((s) => ({ ...s, [p.id]: e.target.checked }))}
                      onClick={(e) => e.stopPropagation()}
                    />{' '}
                    {enabled[p.id] ? 'ON' : 'OFF'}
                  </label>
                </div>
                <h3>{p.short}</h3>
                <p>{p.summary}</p>
              </article>
            ))}
          </div>
        </aside>

        <section className="panel viz-wrap">
          <svg className="viz" viewBox="0 0 1000 640">
            <rect className="stage" x="24" y="28" width="300" height="584" rx="18" />
            <rect className="stage" x="350" y="28" width="300" height="584" rx="18" />
            <rect className="stage" x="676" y="28" width="300" height="584" rx="18" />
            <text className="stage-title" x="174" y="54" textAnchor="middle">
              Build side
            </text>
            <text className="stage-title" x="500" y="54" textAnchor="middle">
              AI in motion
            </text>
            <text className="stage-title" x="826" y="54" textAnchor="middle">
              Access side
            </text>

            {edges.map(([a, b]) => {
              const pa = nodePoint(a)
              const pb = nodePoint(b)
              const hot = highlightedNodes.has(a) || highlightedNodes.has(b)
              return (
                <path
                  key={`${a}-${b}`}
                  className={`edge ${hot ? 'hot' : ''}`}
                  d={`M ${pa.x} ${pa.y} C ${(pa.x + pb.x) / 2} ${pa.y}, ${(pa.x + pb.x) / 2} ${pb.y}, ${pb.x} ${pb.y}`}
                />
              )
            })}

            {packets.map((p) => {
              const pa = nodePoint(p.from)
              const pb = nodePoint(p.from === p.to ? (edges.find((e) => e[0] === p.from)?.[1] ?? p.to) : p.to)
              const tt = Math.min(p.t, 1)
              const x = lerp(pa.x, pb.x, tt)
              const y = lerp(pa.y, pb.y, tt)
              return (
                <circle
                  key={p.id}
                  className="packet"
                  cx={x}
                  cy={y}
                  fill={p.blocked ? '#3ee0c5' : severityColor(p.threat.severity)}
                  opacity={p.blocked && p.t > 0.45 ? 0.25 : 0.95}
                />
              )
            })}

            {nodes.map((n) => {
              const active =
                (selection.kind === 'node' && selection.id === n.id) || highlightedNodes.has(n.id)
              const dim = highlightedNodes.size > 0 && !highlightedNodes.has(n.id)
              const covered = selectedProduct ? selectedProduct.covers.includes(n.id) : false
              const count = threatsForNode(n.id).length
              return (
                <g
                  key={n.id}
                  className={`node ${active ? 'active' : ''} ${dim ? 'dim' : ''} ${covered ? 'covered' : ''}`}
                  transform={`translate(${n.x - NODE_W / 2}, ${n.y - NODE_H / 2})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${n.label}, ${count} threats`}
                  onClick={() => setSelection({ kind: 'node', id: n.id })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelection({ kind: 'node', id: n.id })
                    }
                  }}
                >
                  <rect width={NODE_W} height={NODE_H} rx="12" />
                  <text className="kicker" x="14" y="20">
                    {n.kicker}
                  </text>
                  <text className="label" x="14" y="40">
                    {n.label}
                  </text>
                  <text className="count" x="14" y="54">
                    {count} threats
                  </text>
                </g>
              )
            })}
          </svg>
        </section>

        <aside className="panel">
          <header>
            <h2>Inspector</h2>
            <p>Every surface, threat, and control is clickable.</p>
          </header>
          <div className="inspector">
            {selectedProduct && (
              <>
                <div>
                  <span className="chip">{selectedProduct.family}</span>
                  <h3>{selectedProduct.name}</h3>
                  <p className="meta">{selectedProduct.summary}</p>
                </div>
                <div className="block">
                  <h4>How it mitigates</h4>
                  <ul>
                    {selectedProduct.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
                <a className="source" href={selectedProduct.source.href} target="_blank" rel="noreferrer">
                  {selectedProduct.source.label} ↗
                </a>
              </>
            )}

            {selectedNode && (
              <>
                <div>
                  <span className="chip">{selectedNode.kicker}</span>
                  <h3>{selectedNode.label}</h3>
                  <p className="meta">
                    Threats introduced on this surface, and the portfolio controls that close them.
                  </p>
                </div>
              </>
            )}

            {selectedThreat && (
              <>
                <div>
                  <span className={`sev ${selectedThreat.severity}`}>{selectedThreat.severity}</span>
                  <h3>{selectedThreat.name}</h3>
                  <p className="meta">{selectedThreat.side === 'build' ? 'Build-side' : 'Access-side'} AI threat</p>
                </div>
                <div className="block">
                  <h4>What happens</h4>
                  <p>{selectedThreat.description}</p>
                </div>
                <div className="block">
                  <h4>Portfolio response</h4>
                  <p>{selectedThreat.mitigation}</p>
                </div>
              </>
            )}

            <div className="block">
              <h4>{selectedThreat ? 'Also covers' : 'Threats on this selection'}</h4>
              <div className="stack">
                {inspectorThreats.map((t) => (
                  <button
                    key={t.id}
                    className={`pill ${selectedThreat?.id === t.id ? 'active' : ''}`}
                    onClick={() => setSelection({ kind: 'threat', id: t.id })}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="block">
              <h4>Controls in play</h4>
              <div className="stack">
                {[...highlightedProducts].map((id) => (
                  <button
                    key={id}
                    className={`pill ${selection.kind === 'product' && selection.id === id ? 'active' : ''}`}
                    onClick={() => setSelection({ kind: 'product', id })}
                  >
                    {productById[id].short}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="panel" style={{ minHeight: 0 }}>
        <header>
          <h2>Realtime threat stream</h2>
          <p>
            Orange/red packets are unmitigated. Teal packets are blocked because at least one covering
            product is ON.
          </p>
        </header>
        <div className="ticker">
          {feed.map((e) => (
            <button
              key={e.id}
              className={`event ${e.blocked ? 'blocked' : 'open'}`}
              onClick={() => setSelection({ kind: 'threat', id: e.threat.id })}
            >
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="mono when">{e.at}</span>
                <span className={`sev ${e.threat.severity}`}>{e.blocked ? 'blocked' : 'open'}</span>
              </div>
              <strong>{e.threat.name}</strong>
              <p className="hint">
                {e.threat.side === 'build' ? 'Build' : 'Access'} ·{' '}
                {e.threat.productIds.map((id) => productById[id].short).join(' · ')}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
