import type { ConceptMaturity, TopicCategory, TopicData } from './schemas';

export interface MapPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  labelOffsetX: number;
  labelOffsetY: number;
}

export interface MapRootNode {
  kind: 'root';
  id: 'llms';
  label: string;
  description: string;
  position: MapPosition;
}

export interface MapAreaNode {
  kind: 'area';
  id: string;
  label: string;
  category: TopicCategory;
  description: string;
  position: MapPosition;
}

export interface MapTopicNode {
  kind: 'topic';
  id: string;
  slug: string;
  href: string;
  label: string;
  category: TopicCategory;
  description: string;
  maturity: ConceptMaturity;
  prerequisites: string[];
  relationships: {
    cameBefore: string[];
    leadsTo: string[];
    related: string[];
  };
  position: MapPosition;
}

export type MapNode = MapRootNode | MapAreaNode | MapTopicNode;
export type MapEdgeKind =
  'contains' | 'progression' | 'prerequisite' | 'related';

export interface MapEdge {
  id: string;
  source: string;
  target: string;
  kind: MapEdgeKind;
  directed: boolean;
}

export interface LlmMapModel {
  version: 'v1';
  canvas: {
    width: number;
    height: number;
  };
  nodes: MapNode[];
  edges: MapEdge[];
  /** Reserved for later learning paths, frontier mode, paper overlays, and taxonomy layers. */
  extensions: Record<string, unknown>;
}

type MapTopicData = Pick<
  TopicData,
  | 'name'
  | 'summary'
  | 'category'
  | 'status'
  | 'mapLabel'
  | 'prerequisites'
  | 'cameBefore'
  | 'leadsTo'
  | 'related'
  | 'map'
>;

export interface MapTopicRecord {
  id: string;
  data: MapTopicData;
}

export const MAP_CANVAS = {
  width: 1536,
  height: 994,
} as const;

export const MAP_ROOT: MapRootNode = {
  kind: 'root',
  id: 'llms',
  label: 'LLMs',
  description: 'The central index for concepts across modern language models.',
  position: {
    x: 720,
    y: 525,
    width: 170,
    height: 104,
    labelOffsetX: 0,
    labelOffsetY: 0,
  },
};

export const MAP_AREAS: readonly MapAreaNode[] = [
  {
    kind: 'area',
    id: 'area-post-training',
    label: 'Post-training',
    category: 'post-training',
    description: 'Methods that adapt model behavior after pretraining.',
    position: {
      x: 470,
      y: 360,
      width: 230,
      height: 104,
      labelOffsetX: -3,
      labelOffsetY: 2,
    },
  },
  {
    kind: 'area',
    id: 'area-inference-systems',
    label: 'Inference systems',
    category: 'inference-systems',
    description: 'Algorithms and systems that make model execution practical.',
    position: {
      x: 970,
      y: 365,
      width: 300,
      height: 104,
      labelOffsetX: 3,
      labelOffsetY: -1,
    },
  },
  {
    kind: 'area',
    id: 'area-multimodal',
    label: 'Multimodal',
    category: 'multimodal',
    description: 'Models that connect language with perceptual modalities.',
    position: {
      x: 925,
      y: 660,
      width: 220,
      height: 100,
      labelOffsetX: -2,
      labelOffsetY: 2,
    },
  },
];

function topicPosition(topic: MapTopicRecord): MapPosition | undefined {
  const position = topic.data.map;
  if (!position) return undefined;

  return {
    x: position.x,
    y: position.y,
    width: position.width ?? 160,
    height: position.height ?? 48,
    labelOffsetX: position.labelOffsetX,
    labelOffsetY: position.labelOffsetY,
  };
}

/** Return actionable failures before map data reaches a renderer. */
export function findMapModelErrors(topics: MapTopicRecord[]): string[] {
  const errors: string[] = [];
  const topicIds = new Set<string>();
  const areaCategories = new Set(MAP_AREAS.map((area) => area.category));

  for (const topic of topics) {
    if (topicIds.has(topic.id)) {
      errors.push(`Duplicate map topic ID "${topic.id}".`);
    }
    topicIds.add(topic.id);
  }

  for (const topic of topics) {
    if (!topic.data.map) {
      errors.push(`Map topic "${topic.id}" is missing a V1 position.`);
    } else if (
      topic.data.map.x < 0 ||
      topic.data.map.x > MAP_CANVAS.width ||
      topic.data.map.y < 0 ||
      topic.data.map.y > MAP_CANVAS.height
    ) {
      errors.push(`Map topic "${topic.id}" is outside the V1 canvas.`);
    }

    if (!areaCategories.has(topic.data.category)) {
      errors.push(
        `Map topic "${topic.id}" has no area layout for category "${topic.data.category}".`,
      );
    }

    const references = [
      ...topic.data.prerequisites,
      ...topic.data.cameBefore,
      ...topic.data.leadsTo,
      ...topic.data.related,
    ];
    for (const target of references) {
      if (!topicIds.has(target)) {
        errors.push(
          `Map topic "${topic.id}" references missing topic target "${target}".`,
        );
      }
    }
  }

  return errors;
}

function addEdge(edges: MapEdge[], edge: MapEdge): void {
  if (!edges.some((candidate) => candidate.id === edge.id)) {
    edges.push(edge);
  }
}

/** Compose canonical topic metadata and editable geometry into renderer-neutral V1 data. */
export function createLlmMapModel(topics: MapTopicRecord[]): LlmMapModel {
  const errors = findMapModelErrors(topics);
  if (errors.length > 0) {
    throw new Error(`Invalid LLM map model:\n- ${errors.join('\n- ')}`);
  }

  const topicNodes: MapTopicNode[] = topics.map((topic) => ({
    kind: 'topic',
    id: topic.id,
    slug: topic.id,
    href: `/topics/${topic.id}/`,
    label: topic.data.mapLabel ?? topic.data.name,
    category: topic.data.category,
    description: topic.data.summary,
    maturity: topic.data.status,
    prerequisites: [...topic.data.prerequisites],
    relationships: {
      cameBefore: [...topic.data.cameBefore],
      leadsTo: [...topic.data.leadsTo],
      related: [...topic.data.related],
    },
    position: topicPosition(topic)!,
  }));
  const edges: MapEdge[] = [];

  for (const area of MAP_AREAS) {
    addEdge(edges, {
      id: `contains:${MAP_ROOT.id}:${area.id}`,
      source: MAP_ROOT.id,
      target: area.id,
      kind: 'contains',
      directed: false,
    });
  }

  for (const topic of topics) {
    for (const target of topic.data.leadsTo) {
      addEdge(edges, {
        id: `progression:${topic.id}:${target}`,
        source: topic.id,
        target,
        kind: 'progression',
        directed: true,
      });
    }
  }

  for (const topic of topics) {
    const area = MAP_AREAS.find(
      (candidate) => candidate.category === topic.data.category,
    )!;
    addEdge(edges, {
      id: `contains:${area.id}:${topic.id}`,
      source: area.id,
      target: topic.id,
      kind: 'contains',
      directed: false,
    });

    for (const prerequisite of topic.data.prerequisites) {
      const progressionId = `progression:${prerequisite}:${topic.id}`;
      if (!edges.some((edge) => edge.id === progressionId)) {
        addEdge(edges, {
          id: `prerequisite:${prerequisite}:${topic.id}`,
          source: prerequisite,
          target: topic.id,
          kind: 'prerequisite',
          directed: true,
        });
      }
    }

    for (const target of topic.data.related) {
      const pair = [topic.id, target].sort();
      addEdge(edges, {
        id: `related:${pair[0]}:${pair[1]}`,
        source: pair[0],
        target: pair[1],
        kind: 'related',
        directed: false,
      });
    }
  }

  return {
    version: 'v1',
    canvas: { ...MAP_CANVAS },
    nodes: [MAP_ROOT, ...MAP_AREAS, ...topicNodes],
    edges,
    extensions: {},
  };
}
