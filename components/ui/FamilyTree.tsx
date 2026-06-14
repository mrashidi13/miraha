'use client';

import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  Position,
  Handle,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from '@dagrejs/dagre';
import Image from 'next/image';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PersonData {
  id: string;
  nameEn: string;
  nameFa: string;
  roleEn?: string | null;
  roleFa?: string | null;
  locationEn?: string | null;
  locationFa?: string | null;
  photoUrl?: string | null;
  birthYear?: number | null;
  deathYear?: number | null;
  fatherId?: string | null;
  motherId?: string | null;
}

interface Props {
  people: PersonData[];
  locale: string;
}

// ── Layout ────────────────────────────────────────────────────────────────────

const NODE_W = 180;
const NODE_H = 80;

function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 70, marginx: 30, marginy: 30 });

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  const layoutedNodes = nodes.map((n) => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 } };
  });

  return { nodes: layoutedNodes, edges };
}

// ── PersonNode ─────────────────────────────────────────────────────────────

type PersonNodeData = { person: PersonData; locale: string; selected: boolean };

function PersonNode({ data }: { data: PersonNodeData }) {
  const { person: p, locale, selected } = data;
  const isFa = locale === 'fa';
  const name = isFa ? p.nameFa : p.nameEn;
  const role = isFa ? p.roleFa : p.roleEn;
  const initials = name.slice(0, 2);

  return (
    <>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border-primary !bg-primary-light" />
      <div
        className={`w-[180px] rounded-2xl border bg-bg shadow-sm transition-all cursor-pointer select-none
          ${selected ? 'border-accent shadow-accent/20 shadow-md' : 'border-primary/30 hover:border-primary/60 hover:shadow'}`}
      >
        <div className="flex items-center gap-3 px-3 py-2.5">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {p.photoUrl ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20">
                <Image src={p.photoUrl} alt={name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-light ring-2 ring-primary/20 flex items-center justify-center">
                <span className="font-heading text-sm font-bold text-primary">{initials}</span>
              </div>
            )}
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0" dir={isFa ? 'rtl' : 'ltr'}>
            <p className="font-heading font-semibold text-primary text-xs leading-tight truncate">{name}</p>
            {role && (
              <p className="font-body text-text-muted text-[10px] leading-tight truncate mt-0.5">{role}</p>
            )}
            {(p.birthYear || p.deathYear) && (
              <p className="font-body text-text-muted text-[10px] leading-tight mt-0.5">
                {p.birthYear ?? '?'}{p.deathYear ? ` – ${p.deathYear}` : ''}
              </p>
            )}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !border-primary !bg-primary-light" />
    </>
  );
}

const nodeTypes = { person: PersonNode as React.ComponentType<{ data: PersonNodeData }> };

// ── Detail panel ──────────────────────────────────────────────────────────────

function DetailPanel({
  person,
  locale,
  onClose,
}: {
  person: PersonData;
  locale: string;
  onClose: () => void;
}) {
  const isFa = locale === 'fa';
  const name = isFa ? person.nameFa : person.nameEn;
  const role = isFa ? person.roleFa : person.roleEn;
  const location = isFa ? person.locationFa : person.locationEn;

  return (
    <div
      className="fixed top-0 end-0 h-full w-72 bg-bg border-s border-primary/20 shadow-xl z-50 flex flex-col"
      dir={isFa ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
        <span className="font-heading font-semibold text-primary text-sm">
          {isFa ? 'جزئیات' : 'Details'}
        </span>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Photo */}
        {person.photoUrl ? (
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
            <Image src={person.photoUrl} alt={name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-full aspect-square rounded-2xl bg-primary-light flex items-center justify-center">
            <span className="font-heading text-5xl font-bold text-primary/40">{name.slice(0, 2)}</span>
          </div>
        )}

        {/* Names */}
        <div>
          <p className="font-heading text-xl font-bold text-primary">{person.nameEn}</p>
          <p className="font-heading text-lg text-primary/70" dir="rtl">{person.nameFa}</p>
        </div>

        {/* Role */}
        {(person.roleEn || person.roleFa) && (
          <Row label={isFa ? 'نقش' : 'Role'} value={(isFa ? person.roleFa : person.roleEn) ?? ''} />
        )}

        {/* Location */}
        {(person.locationEn || person.locationFa) && (
          <Row label={isFa ? 'مکان' : 'Location'} value={(isFa ? person.locationFa : person.locationEn) ?? ''} />
        )}

        {/* Years */}
        {(person.birthYear || person.deathYear) && (
          <Row
            label={isFa ? 'سال‌ها' : 'Years'}
            value={`${person.birthYear ?? '?'}${person.deathYear ? ` – ${person.deathYear}` : ''}`}
          />
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted font-body uppercase tracking-wider mb-0.5">{label}</p>
      <p className="font-body text-sm text-text">{value}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function FamilyTree({ people, locale }: Props) {
  const isFa = locale === 'fa';
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const rawNodes: Node[] = people.map((p) => ({
      id: p.id,
      type: 'person',
      position: { x: 0, y: 0 },
      data: { person: p, locale, selected: p.id === selectedId },
    }));

    const rawEdges: Edge[] = [];
    const seen = new Set<string>();
    for (const p of people) {
      if (p.fatherId) {
        const eid = `f-${p.id}`;
        if (!seen.has(eid)) { seen.add(eid); rawEdges.push({ id: eid, source: p.fatherId, target: p.id, type: 'smoothstep', style: { stroke: 'var(--color-primary)', strokeWidth: 1.5, opacity: 0.5 } }); }
      }
      if (p.motherId) {
        const eid = `m-${p.id}`;
        if (!seen.has(eid)) { seen.add(eid); rawEdges.push({ id: eid, source: p.motherId, target: p.id, type: 'smoothstep', style: { stroke: 'var(--color-accent)', strokeWidth: 1.5, opacity: 0.5 } }); }
      }
    }

    const { nodes: ln, edges: le } = getLayoutedElements(rawNodes, rawEdges);
    setNodes(ln);
    setEdges(le);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people, locale, selectedId]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedId((prev) => (prev === node.id ? null : node.id));
  }, []);

  const onPaneClick = useCallback(() => setSelectedId(null), []);

  const selectedPerson = selectedId ? people.find((p) => p.id === selectedId) ?? null : null;

  if (people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-muted font-body text-sm gap-2">
        <span className="text-4xl">👥</span>
        <p>{isFa ? 'هنوز کسی در درخت خانوادگی نیست.' : 'No people in the family tree yet.'}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes as never}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--color-primary)" gap={24} size={1} style={{ opacity: 0.06 }} />
        <Controls
          className="!shadow-sm !border-primary/20"
          style={{ button: { background: 'var(--color-bg)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' } } as React.CSSProperties}
        />
        <MiniMap
          nodeColor="var(--color-primary-light)"
          nodeStrokeColor="var(--color-primary)"
          maskColor="rgba(0,0,0,0.04)"
          className="!border-primary/20 !shadow-sm !rounded-xl !overflow-hidden"
          style={{ background: 'var(--color-bg)' }}
        />
        <Panel position="top-left" className="m-3">
          <div className="flex gap-3 items-center bg-bg/90 backdrop-blur-sm border border-primary/20 rounded-xl px-3 py-2 shadow-sm text-[10px] font-body text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-0.5 bg-primary/60 rounded inline-block" />
              {isFa ? 'پدر' : 'Father'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-0.5 bg-accent/60 rounded inline-block" />
              {isFa ? 'مادر' : 'Mother'}
            </span>
          </div>
        </Panel>
      </ReactFlow>

      {selectedPerson && (
        <DetailPanel person={selectedPerson} locale={locale} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
