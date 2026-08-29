import type { LlmMapModel } from './map-model';

export interface MapSelection {
  selectedNodeId: string;
  connectedNodeIds: string[];
  connectedEdgeIds: string[];
}

/** Resolve the immediate, one-edge neighborhood used by map highlighting. */
export function resolveMapSelection(
  model: Pick<LlmMapModel, 'nodes' | 'edges'>,
  selectedNodeId: string,
): MapSelection | null {
  if (!model.nodes.some((node) => node.id === selectedNodeId)) return null;

  const connectedNodeIds = new Set([selectedNodeId]);
  const connectedEdgeIds: string[] = [];

  for (const edge of model.edges) {
    if (edge.source === selectedNodeId || edge.target === selectedNodeId) {
      connectedEdgeIds.push(edge.id);
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    }
  }

  return {
    selectedNodeId,
    connectedNodeIds: [...connectedNodeIds],
    connectedEdgeIds,
  };
}
