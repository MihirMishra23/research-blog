import { readFile } from 'node:fs/promises';

const CONTENT_PADDING = 64;
const MOBILE_CANVAS_WIDTH = 62 * 16;
const MOBILE_VIEWPORTS = [320, 390, 430];

function rounded(value) {
  return Math.round(value * 10) / 10;
}

function rectFor(node, clearance = 0) {
  return {
    left: node.position.x - node.position.width / 2 - clearance,
    right: node.position.x + node.position.width / 2 + clearance,
    top: node.position.y - node.position.height / 2 - clearance,
    bottom: node.position.y + node.position.height / 2 + clearance,
  };
}

function rectangleDistance(first, second) {
  const dx = Math.max(first.left - second.right, second.left - first.right, 0);
  const dy = Math.max(first.top - second.bottom, second.top - first.bottom, 0);
  return Math.hypot(dx, dy);
}

function stringSeed(value) {
  return [...value].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
}

function boundaryPoint(position, toward) {
  const dx = toward.x - position.x;
  const dy = toward.y - position.y;
  const radiusX = position.width / 2 + 1;
  const radiusY = position.height / 2 + 1;
  const scale =
    1 /
    Math.sqrt(
      (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY),
    );
  return {
    x: position.x + dx * scale,
    y: position.y + dy * scale,
  };
}

function pointsForEdge(edge, nodeById) {
  const source = nodeById.get(edge.source);
  const target = nodeById.get(edge.target);
  const start = boundaryPoint(
    source.position,
    edge.route?.[0] ?? target.position,
  );
  const end = boundaryPoint(
    target.position,
    edge.route?.at(-1) ?? source.position,
  );

  if (edge.route?.length) {
    return [start, ...edge.route, end];
  }

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy) || 1;
  const bend = ((stringSeed(edge.id) % 17) - 8) * 1.7;
  const control = {
    x: (start.x + end.x) / 2 + (-dy / distance) * bend,
    y: (start.y + end.y) / 2 + (dx / distance) * bend,
  };
  const points = [];
  for (let index = 0; index <= 24; index += 1) {
    const time = index / 24;
    const inverse = 1 - time;
    points.push({
      x:
        inverse * inverse * start.x +
        2 * inverse * time * control.x +
        time * time * end.x,
      y:
        inverse * inverse * start.y +
        2 * inverse * time * control.y +
        time * time * end.y,
    });
  }
  return points;
}

function pointInside(point, rectangle) {
  return (
    point.x >= rectangle.left &&
    point.x <= rectangle.right &&
    point.y >= rectangle.top &&
    point.y <= rectangle.bottom
  );
}

function orientation(first, second, third) {
  return (
    (second.x - first.x) * (third.y - first.y) -
    (second.y - first.y) * (third.x - first.x)
  );
}

function segmentsCross(firstStart, firstEnd, secondStart, secondEnd) {
  const firstA = orientation(firstStart, firstEnd, secondStart);
  const firstB = orientation(firstStart, firstEnd, secondEnd);
  const secondA = orientation(secondStart, secondEnd, firstStart);
  const secondB = orientation(secondStart, secondEnd, firstEnd);
  return firstA * firstB < 0 && secondA * secondB < 0;
}

function polylinesCross(first, second) {
  for (let firstIndex = 1; firstIndex < first.length; firstIndex += 1) {
    for (let secondIndex = 1; secondIndex < second.length; secondIndex += 1) {
      if (
        segmentsCross(
          first[firstIndex - 1],
          first[firstIndex],
          second[secondIndex - 1],
          second[secondIndex],
        )
      ) {
        return true;
      }
    }
  }
  return false;
}

function edgeLength(points) {
  return points
    .slice(1)
    .reduce(
      (total, point, index) =>
        total +
        Math.hypot(point.x - points[index].x, point.y - points[index].y),
      0,
    );
}

export function measureMapModel(model) {
  const nodeById = new Map(model.nodes.map((node) => [node.id, node]));
  const rectangles = model.nodes.map((node) => ({
    id: node.id,
    rectangle: rectFor(node),
  }));
  const bounds = {
    left: Math.min(...rectangles.map(({ rectangle }) => rectangle.left)),
    right: Math.max(...rectangles.map(({ rectangle }) => rectangle.right)),
    top: Math.min(...rectangles.map(({ rectangle }) => rectangle.top)),
    bottom: Math.max(...rectangles.map(({ rectangle }) => rectangle.bottom)),
  };
  const collisions = [];
  let minimumNodeClearance = Number.POSITIVE_INFINITY;

  for (let firstIndex = 0; firstIndex < rectangles.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < rectangles.length;
      secondIndex += 1
    ) {
      const first = rectangles[firstIndex];
      const second = rectangles[secondIndex];
      const distance = rectangleDistance(first.rectangle, second.rectangle);
      minimumNodeClearance = Math.min(minimumNodeClearance, distance);
      if (distance === 0) collisions.push([first.id, second.id]);
    }
  }

  const edgePoints = new Map(
    model.edges.map((edge) => [edge.id, pointsForEdge(edge, nodeById)]),
  );
  const edgeNodeIntrusions = [];
  for (const edge of model.edges) {
    const points = edgePoints.get(edge.id);
    for (const node of model.nodes) {
      if (node.id === edge.source || node.id === edge.target) continue;
      if (points.some((point) => pointInside(point, rectFor(node, 16)))) {
        edgeNodeIntrusions.push({ edge: edge.id, node: node.id });
      }
    }
  }

  const edgeCrossings = [];
  for (let firstIndex = 0; firstIndex < model.edges.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < model.edges.length;
      secondIndex += 1
    ) {
      const first = model.edges[firstIndex];
      const second = model.edges[secondIndex];
      if (
        [first.source, first.target].some((id) =>
          [second.source, second.target].includes(id),
        )
      ) {
        continue;
      }
      if (polylinesCross(edgePoints.get(first.id), edgePoints.get(second.id))) {
        edgeCrossings.push([first.id, second.id]);
      }
    }
  }

  const edgeLengths = model.edges.map((edge) => ({
    id: edge.id,
    length: rounded(edgeLength(edgePoints.get(edge.id))),
  }));
  const bubbleArea = model.nodes.reduce(
    (total, node) => total + node.position.width * node.position.height,
    0,
  );

  return {
    nodes: model.nodes.length,
    topics: model.nodes.filter((node) => node.kind === 'topic').length,
    areas: model.nodes.filter((node) => node.kind === 'area').length,
    edges: model.edges.length,
    fixedCanvas: { ...model.canvas },
    contentBounds: {
      left: rounded(bounds.left),
      right: rounded(bounds.right),
      top: rounded(bounds.top),
      bottom: rounded(bounds.bottom),
      width: rounded(bounds.right - bounds.left),
      height: rounded(bounds.bottom - bounds.top),
    },
    requiredCanvasWithPadding: {
      width: Math.ceil(bounds.right - bounds.left + CONTENT_PADDING * 2),
      height: Math.ceil(bounds.bottom - bounds.top + CONTENT_PADDING * 2),
      padding: CONTENT_PADDING,
    },
    bubbleAreaDensityPercent: rounded(
      (bubbleArea / (model.canvas.width * model.canvas.height)) * 100,
    ),
    minimumNodeClearance: rounded(minimumNodeClearance),
    nodeCollisions: collisions,
    edgeNodeIntrusions,
    edgeCrossings,
    longestEdges: edgeLengths
      .sort((first, second) => second.length - first.length)
      .slice(0, 5),
  };
}

function withoutTopic(model, topicId) {
  return {
    ...model,
    nodes: model.nodes.filter((node) => node.id !== topicId),
    edges: model.edges.filter(
      (edge) => edge.source !== topicId && edge.target !== topicId,
    ),
  };
}

export async function createLayoutBaseline() {
  const [modelSource, inventorySource] = await Promise.all([
    readFile('dist/map-data.json', 'utf8'),
    readFile('docs/post-v1-canonical-taxonomy.json', 'utf8'),
  ]);
  const model = JSON.parse(modelSource);
  const inventory = JSON.parse(inventorySource);
  const productionTopicIds = new Set(
    model.nodes.filter((node) => node.kind === 'topic').map((node) => node.id),
  );
  const additions = inventory.candidates.filter(
    (candidate) => !productionTopicIds.has(candidate.id),
  );
  const areaCategories = new Set(
    model.nodes
      .filter((node) => node.kind === 'area')
      .map((node) => node.category),
  );

  return {
    generatedAt: 'deterministic-from-current-build',
    production: measureMapModel(model),
    removalScenarios: Object.fromEntries(
      [...productionTopicIds]
        .sort()
        .map((id) => [
          id,
          measureMapModel(withoutTopic(model, id)).requiredCanvasWithPadding,
        ]),
    ),
    approvedExpansion: {
      currentTopics: productionTopicIds.size,
      approvedTopics: inventory.candidates.length,
      additions: additions.length,
      additionsMissingPosition: additions.length,
      additionsMissingAreaLayout: additions.filter(
        (candidate) => !areaCategories.has(candidate.category),
      ).length,
      missingAreaCategories: [
        ...new Set(
          additions
            .filter((candidate) => !areaCategories.has(candidate.category))
            .map((candidate) => candidate.category),
        ),
      ].sort(),
      currentArchitectureCanCalculateExpandedCanvas: false,
    },
    mobile: {
      minimumCanvasCssWidth: MOBILE_CANVAS_WIDTH,
      horizontalOverflowByViewport: Object.fromEntries(
        MOBILE_VIEWPORTS.map((viewport) => [
          viewport,
          MOBILE_CANVAS_WIDTH - viewport,
        ]),
      ),
      panOrZoomControls: false,
      semanticFallback: true,
    },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(await createLayoutBaseline(), null, 2));
}
