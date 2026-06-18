'use client';

import { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  Position,
  Handle,
  Panel,
  useReactFlow,
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

type BaseNode = { id: string; position: { x: number; y: number }; data: { person: PersonData; locale: string } };

function computeLayout(people: PersonData[], locale: string): { nodes: BaseNode[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 70, marginx: 30, marginy: 30 });

  people.forEach((p) => g.setNode(p.id, { width: NODE_W, height: NODE_H }));

  const rawEdges: Edge[] = [];
  const seen = new Set<string>();
  for (const p of people) {
    if (p.fatherId && people.find((x) => x.id === p.fatherId)) {
      const eid = `f-${p.id}`;
      if (!seen.has(eid)) {
        seen.add(eid);
        g.setEdge(p.fatherId, p.id);
        rawEdges.push({
          id: eid, source: p.fatherId, target: p.id, type: 'smoothstep',
          style: { stroke: 'var(--color-primary)', strokeWidth: 1.5, opacity: 0.5 },
        });
      }
    }
    if (p.motherId && people.find((x) => x.id === p.motherId)) {
      const eid = `m-${p.id}`;
      if (!seen.has(eid)) {
        seen.add(eid);
        g.setEdge(p.motherId, p.id);
        rawEdges.push({
          id: eid, source: p.motherId, target: p.id, type: 'smoothstep',
          style: { stroke: '#f87171', strokeWidth: 1.5, opacity: 0.6 },
        });
      }
    }
  }

  dagre.layout(g);

  const nodes: BaseNode[] = people.map((p) => {
    const pos = g.node(p.id);
    return { id: p.id, position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 }, data: { person: p, locale } };
  });

  return { nodes, edges: rawEdges };
}

// ── Search helper ─────────────────────────────────────────────────────────────

function matchesSearch(p: PersonData, q: string): boolean {
  const ql = q.toLowerCase();
  return (
    p.nameEn.toLowerCase().includes(ql) ||
    p.nameFa.includes(q) ||
    (p.roleEn?.toLowerCase().includes(ql) ?? false) ||
    (p.roleFa?.includes(q) ?? false)
  );
}

// ── PersonNode ─────────────────────────────────────────────────────────────

type PersonNodeData = {
  person: PersonData;
  locale: string;
  selected: boolean;
  /** null = no search active, true = matches, false = dimmed */
  isMatch: boolean | null;
};

function PersonNode({ data }: { data: PersonNodeData }) {
  const { person: p, locale, selected, isMatch } = data;
  const isFa = locale === 'fa';
  const name = isFa ? p.nameFa : p.nameEn;
  const role = isFa ? p.roleFa : p.roleEn;
  const initials = name.slice(0, 2);

  const highlighted = isMatch === true;

  return (
    <>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border-primary !bg-primary-light" />
      <div
        style={{ transition: 'box-shadow 0.2s' }}
        className={[
          'w-[180px] rounded-2xl border bg-bg shadow-sm cursor-pointer select-none transition-all',
          highlighted
            ? 'border-[#f59e0b] ring-2 ring-[#f59e0b]/40 bg-amber-50 shadow-amber-100 shadow-md'
            : selected
              ? 'border-accent ring-2 ring-accent/30 shadow-accent/20 shadow-md'
              : 'border-primary/30 hover:border-primary/60 hover:shadow',
        ].join(' ')}
      >
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="flex-shrink-0">
            {p.photoUrl ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20">
                <Image src={p.photoUrl} alt={name} fill className="object-cover" />
              </div>
            ) : (
              <div className={`w-10 h-10 rounded-full ring-2 flex items-center justify-center ${highlighted ? 'bg-amber-100 ring-amber-300' : 'bg-primary-light ring-primary/20'}`}>
                <span className={`font-heading text-sm font-bold ${highlighted ? 'text-amber-700' : 'text-primary'}`}>{initials}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0" dir={isFa ? 'rtl' : 'ltr'}>
            <p className={`font-heading font-semibold text-xs leading-tight truncate ${highlighted ? 'text-amber-800' : 'text-primary'}`}>{name}</p>
            {role && (
              <p className={`font-body text-[10px] leading-tight truncate mt-0.5 ${highlighted ? 'text-amber-600' : 'text-text-muted'}`}>{role}</p>
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

function DetailPanel({ person, locale, onClose }: { person: PersonData; locale: string; onClose: () => void }) {
  const isFa = locale === 'fa';
  const name = isFa ? person.nameFa : person.nameEn;

  return (
    <div
      className="fixed top-0 end-0 h-full w-72 bg-bg border-s border-primary/20 shadow-xl z-50 flex flex-col"
      dir={isFa ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
        <span className="font-heading font-semibold text-primary text-sm">{isFa ? 'جزئیات' : 'Details'}</span>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary-light transition-colors">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {person.photoUrl ? (
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
            <Image src={person.photoUrl} alt={name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-full aspect-square rounded-2xl bg-primary-light flex items-center justify-center">
            <span className="font-heading text-5xl font-bold text-primary/40">{name.slice(0, 2)}</span>
          </div>
        )}
        <div>
          <p className="font-heading text-xl font-bold text-primary">{person.nameEn}</p>
          <p className="font-heading text-lg text-primary/70" dir="rtl">{person.nameFa}</p>
        </div>
        {(person.roleEn || person.roleFa) && <DetailRow label={isFa ? 'نقش' : 'Role'} value={(isFa ? person.roleFa : person.roleEn) ?? ''} />}
        {(person.locationEn || person.locationFa) && <DetailRow label={isFa ? 'مکان' : 'Location'} value={(isFa ? person.locationFa : person.locationEn) ?? ''} />}
        {(person.birthYear || person.deathYear) && (
          <DetailRow label={isFa ? 'سال‌ها' : 'Years'} value={`${person.birthYear ?? '?'}${person.deathYear ? ` – ${person.deathYear}` : ''}`} />
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted font-body uppercase tracking-wider mb-0.5">{label}</p>
      <p className="font-body text-sm text-text">{value}</p>
    </div>
  );
}

// ── Canvas inner (needs ReactFlow context for useReactFlow) ───────────────────

function FamilyTreeCanvas({ people, locale }: Props) {
  const isFa = locale === 'fa';
  const { fitView } = useReactFlow();

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [baseNodes, setBaseNodes] = useState<BaseNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Run layout only when people or locale changes
  useEffect(() => {
    const { nodes, edges: e } = computeLayout(people, locale);
    setBaseNodes(nodes);
    setEdges(e);
  }, [people, locale]);

  // Derive display nodes: merge base positions with search highlight + selection
  const searchTerm = search.trim();
  const displayNodes = useMemo((): Node[] => {
    const hasSearch = searchTerm.length > 0;
    return baseNodes.map((n) => ({
      ...n,
      type: 'person',
      data: {
        ...n.data,
        locale,
        selected: n.id === selectedId,
        isMatch: hasSearch ? matchesSearch(n.data.person, searchTerm) : null,
      },
    }));
  }, [baseNodes, searchTerm, selectedId, locale]);

  // fitView to matched nodes whenever search changes
  useEffect(() => {
    if (!searchTerm) return;
    const matchedIds = people.filter((p) => matchesSearch(p, searchTerm)).map((p) => p.id);
    if (matchedIds.length === 0) return;
    const t = setTimeout(() => {
      fitView({ nodes: matchedIds.map((id) => ({ id })), duration: 500, padding: 0.4, maxZoom: 1.5 });
    }, 80);
    return () => clearTimeout(t);
  }, [searchTerm, people, fitView]);

  const matchCount = searchTerm ? people.filter((p) => matchesSearch(p, searchTerm)).length : 0;

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedId((prev) => (prev === node.id ? null : node.id));
  }, []);

  const onPaneClick = useCallback(() => setSelectedId(null), []);

  const selectedPerson = selectedId ? people.find((p) => p.id === selectedId) ?? null : null;

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={displayNodes}
        edges={edges}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes as never}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.15}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--color-primary)" gap={24} size={1} style={{ opacity: 0.06 }} />
        <Controls
          className="!shadow-sm !border-primary/20"
          style={{ '--xy-controls-button-background-color': 'var(--color-bg)', '--xy-controls-button-border-color': 'var(--color-primary)', '--xy-controls-button-color': 'var(--color-primary)' } as React.CSSProperties}
        />
        <MiniMap
          nodeColor="var(--color-primary-light)"
          nodeStrokeColor="var(--color-primary)"
          maskColor="rgba(0,0,0,0.04)"
          className="!border-primary/20 !shadow-sm !rounded-xl !overflow-hidden"
          style={{ background: 'var(--color-bg)' }}
        />

        {/* Search panel — top-center */}
        <Panel position="top-center" className="mt-3 w-72">
          <div className="relative">
            <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              dir="auto"
              placeholder={isFa ? 'جستجوی نام، نقش…' : 'Search name, role…'}
              className="w-full ps-9 pe-8 py-2 rounded-xl border border-primary/30 bg-bg/95 backdrop-blur-sm shadow-sm font-body text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); searchInputRef.current?.focus(); }}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary-light transition-colors text-xs"
              >
                ✕
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-center text-[10px] font-body mt-1.5 text-text-muted">
              {matchCount === 0
                ? (isFa ? 'نتیجه‌ای یافت نشد' : 'No results found')
                : isFa
                  ? `${matchCount} نفر یافت شد`
                  : `${matchCount} result${matchCount !== 1 ? 's' : ''}`}
            </p>
          )}
        </Panel>

        {/* Legend — top-left */}
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
            {searchTerm && matchCount > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />
                {isFa ? 'یافت شده' : 'Match'}
              </span>
            )}
          </div>
        </Panel>
      </ReactFlow>

      {selectedPerson && (
        <DetailPanel person={selectedPerson} locale={locale} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────

export function FamilyTree({ people, locale }: Props) {
  const isFa = locale === 'fa';

  if (people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-muted font-body text-sm gap-2">
        <span className="text-4xl">👥</span>
        <p>{isFa ? 'هنوز کسی در درخت خانوادگی نیست.' : 'No people in the family tree yet.'}</p>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <FamilyTreeCanvas people={people} locale={locale} />
    </ReactFlowProvider>
  );
}
