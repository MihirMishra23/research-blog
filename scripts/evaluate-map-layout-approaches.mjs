import { readFile } from 'node:fs/promises';
import dagre from '@dagrejs/dagre';

import { measureMapModel } from './measure-map-layout.mjs';

const PADDING = 64;
const AREA_RADIUS = 390;
const TOPIC_RADIUS = 760;
const AREA_ORDER = [
  'models',
  'inference',
  'agents',
  'memory',
  'multimodal',
  'interpretability',
  'post-training',
];

const EXTRA_TOPIC = {
  id: 'layout-stability-probe',
  name: 'Layout Stability Probe',
  mapLabel: 'Layout Stability Probe',
  category: 'multimodal',
  status: 'active',
  prerequisites: [],
  cameBefore: [],
  leadsTo: [],
  related: [],
};

function rounded(value) {
  return Math.round(value * 10) / 10;
}

function estimateTextWidth(label, fontSize) {
  return [...label].reduce((width, character) => {
    if ('MW@#%'.includes(character)) return width + fontSize * 0.86;
    if ('ilI1|.,'.includes(character)) return width + fontSize * 0.3;
    if (character === ' ') return width + fontSize * 0.34;
    if (/[A-Z0-9]/.test(character)) return width + fontSize * 0.64;
    return width + fontSize * 0.54;
  }, 0);
}

function nodeDimensions(kind, label) {
  const fontSize = kind === 'root' ? 34 : kind === 'area' ? 24 : 18;
  const horizontalPadding = kind === 'topic' ? 20 : 40;
  return {
    width: Math.max(
      kind === 'root' ? 170 : kind === 'area' ? 150 : 100,
      Math.ceil(estimateTextWidth(label, fontSize) + horizontalPadding),
    ),
    height: kind === 'root' ? 104 : kind === 'area' ? 96 : 60,
  };
}

function createNodes(inventory) {
  const root = {
    kind: 'root',
    id: 'llms',
    label: 'LLMs',
    position: { ...nodeDimensions('root', 'LLMs'), x: 0, y: 0 },
  };
  const areas = inventory.areas.map((area) => ({
    kind: 'area',
    id: `area-${area.id}`,
    category: area.id,
    label: area.mapLabel,
    position: { ...nodeDimensions('area', area.mapLabel), x: 0, y: 0 },
  }));
  const topics = inventory.candidates.map((topic) => ({
    kind: 'topic',
    id: topic.id,
    category: topic.category,
    label: topic.mapLabel,
    position: { ...nodeDimensions('topic', topic.mapLabel), x: 0, y: 0 },
  }));
  return [root, ...areas, ...topics];
}

function createEdges(inventory) {
  const edges = [];
  const ids = new Set();
  const add = (edge) => {
    if (!ids.has(edge.id)) {
      ids.add(edge.id);
      edges.push(edge);
    }
  };

  for (const area of inventory.areas) {
    add({
      id: `contains:llms:area-${area.id}`,
      source: 'llms',
      target: `area-${area.id}`,
      kind: 'contains',
      directed: false,
    });
  }
  for (const topic of inventory.candidates) {
    add({
      id: `contains:area-${topic.category}:${topic.id}`,
      source: `area-${topic.category}`,
      target: topic.id,
      kind: 'contains',
      directed: false,
    });
    for (const target of topic.leadsTo) {
      add({
        id: `progression:${topic.id}:${target}`,
        source: topic.id,
        target,
        kind: 'progression',
        directed: true,
      });
    }
  }
  for (const topic of inventory.candidates) {
    for (const prerequisite of topic.prerequisites) {
      const progressionId = `progression:${prerequisite}:${topic.id}`;
      if (!ids.has(progressionId)) {
        add({
          id: `prerequisite:${prerequisite}:${topic.id}`,
          source: prerequisite,
          target: topic.id,
          kind: 'prerequisite',
          directed: true,
        });
      }
    }
    for (const target of topic.related) {
      const pair = [topic.id, target].sort();
      add({
        id: `related:${pair[0]}:${pair[1]}`,
        source: pair[0],
        target: pair[1],
        kind: 'related',
        directed: false,
      });
    }
  }
  return edges;
}

function fitCanvas(nodes) {
  const left = Math.min(
    ...nodes.map((node) => node.position.x - node.position.width / 2),
  );
  const top = Math.min(
    ...nodes.map((node) => node.position.y - node.position.height / 2),
  );
  const shiftX = PADDING - left;
  const shiftY = PADDING - top;
  for (const node of nodes) {
    node.position.x += shiftX;
    node.position.y += shiftY;
  }
  const right = Math.max(
    ...nodes.map((node) => node.position.x + node.position.width / 2),
  );
  const bottom = Math.max(
    ...nodes.map((node) => node.position.y + node.position.height / 2),
  );
  return {
    width: Math.ceil(right + PADDING),
    height: Math.ceil(bottom + PADDING),
  };
}

function createCustomRadialModel(inventory) {
  const nodes = createNodes(inventory);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const sectorSize = (Math.PI * 2) / AREA_ORDER.length;

  AREA_ORDER.forEach((category, areaIndex) => {
    const angle = -Math.PI / 2 + areaIndex * sectorSize;
    const area = nodeById.get(`area-${category}`);
    area.position.x = Math.cos(angle) * AREA_RADIUS;
    area.position.y = Math.sin(angle) * AREA_RADIUS;

    const topics = nodes
      .filter((node) => node.kind === 'topic' && node.category === category)
      .sort((first, second) => first.id.localeCompare(second.id));
    const tangentDemand = topics.reduce(
      (total, topic) => total + topic.position.width + 56,
      0,
    );
    const fanSpan = Math.min(sectorSize * 0.78, tangentDemand / TOPIC_RADIUS);
    topics.forEach((topic, topicIndex) => {
      const offset =
        topics.length === 1
          ? 0
          : -fanSpan / 2 + (fanSpan * topicIndex) / (topics.length - 1);
      const topicAngle = angle + offset;
      topic.position.x = Math.cos(topicAngle) * TOPIC_RADIUS;
      topic.position.y = Math.sin(topicAngle) * TOPIC_RADIUS;
    });
  });

  const canvas = fitCanvas(nodes);
  return { version: 'prototype', canvas, nodes, edges: createEdges(inventory) };
}

function createDagreModel(inventory) {
  const nodes = createNodes(inventory);
  const edges = createEdges(inventory);
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({
    rankdir: 'LR',
    nodesep: 56,
    edgesep: 24,
    ranksep: 112,
    marginx: PADDING,
    marginy: PADDING,
    ranker: 'network-simplex',
  });
  graph.setDefaultEdgeLabel(() => ({}));
  for (const node of nodes) {
    graph.setNode(node.id, {
      width: node.position.width,
      height: node.position.height,
    });
  }
  for (const edge of edges.filter((edge) => edge.kind === 'contains')) {
    graph.setEdge(edge.source, edge.target, { id: edge.id });
  }
  dagre.layout(graph);
  for (const node of nodes) {
    const placed = graph.node(node.id);
    node.position.x = placed.x;
    node.position.y = placed.y;
  }
  for (const edge of edges.filter((edge) => edge.kind === 'contains')) {
    const placed = graph.edge(edge.source, edge.target);
    if (placed?.points?.length > 2) {
      edge.route = placed.points.slice(1, -1);
    }
  }
  const canvas = fitCanvas(nodes);
  return { version: 'prototype', canvas, nodes, edges };
}

function geometrySignature(model) {
  return JSON.stringify({
    canvas: model.canvas,
    nodes: model.nodes.map((node) => [node.id, node.position]),
    edges: model.edges.map((edge) => [edge.id, edge.route ?? []]),
  });
}

function relativePositions(model) {
  const root = model.nodes.find((node) => node.id === 'llms').position;
  return new Map(
    model.nodes.map((node) => [
      node.id,
      { x: node.position.x - root.x, y: node.position.y - root.y },
    ]),
  );
}

function stability(baseModel, changedModel) {
  const base = relativePositions(baseModel);
  const changed = relativePositions(changedModel);
  const distances = [...base]
    .filter(([id]) => changed.has(id))
    .map(([id, point]) => {
      const next = changed.get(id);
      return { id, distance: Math.hypot(next.x - point.x, next.y - point.y) };
    });
  const moved = distances.filter(({ distance }) => distance > 0.01);
  return {
    unchangedNodesCompared: distances.length,
    movedNodes: moved.length,
    meanDisplacement: rounded(
      distances.reduce((total, item) => total + item.distance, 0) /
        distances.length,
    ),
    maximumDisplacement: rounded(
      Math.max(...distances.map(({ distance }) => distance)),
    ),
    movedNodeIds: moved.map(({ id }) => id),
  };
}

function withoutTopic(inventory, topicId) {
  return {
    ...inventory,
    candidates: inventory.candidates
      .filter((topic) => topic.id !== topicId)
      .map((topic) => ({
        ...topic,
        prerequisites: topic.prerequisites.filter((id) => id !== topicId),
        cameBefore: topic.cameBefore.filter((id) => id !== topicId),
        leadsTo: topic.leadsTo.filter((id) => id !== topicId),
        related: topic.related.filter((id) => id !== topicId),
      })),
  };
}

function withProbe(inventory) {
  return { ...inventory, candidates: [...inventory.candidates, EXTRA_TOPIC] };
}

function summarize(name, createModel, inventory) {
  const base = createModel(inventory);
  const secondRun = createModel(inventory);
  return {
    name,
    layoutRunsAtBuildTime: true,
    staticSerializableGeometry: true,
    labelDimensionsProvidedToLayout: true,
    deterministic: geometrySignature(base) === geometrySignature(secondRun),
    currentTaxonomy: measureMapModel(base),
    removeClip: stability(base, createModel(withoutTopic(inventory, 'clip'))),
    addMultimodalProbe: stability(base, createModel(withProbe(inventory))),
  };
}

export async function evaluateLayoutApproaches() {
  const inventory = JSON.parse(
    await readFile('docs/post-v1-canonical-taxonomy.json', 'utf8'),
  );
  return {
    generatedAt: 'deterministic-from-canonical-taxonomy',
    inventory: {
      topics: inventory.candidates.length,
      areas: inventory.areas.length,
    },
    approaches: {
      customRadial: summarize(
        'Small custom radial pass',
        createCustomRadialModel,
        inventory,
      ),
      dagreHierarchical: summarize(
        'Dagre hierarchical pass',
        createDagreModel,
        inventory,
      ),
    },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(await evaluateLayoutApproaches(), null, 2));
}
