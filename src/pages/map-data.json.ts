import { getCollection } from 'astro:content';
import { createLlmMapModel } from '../content/map-model';
import { topicsForCurrentMap } from '../content/visibility';

export async function GET() {
  const topics = topicsForCurrentMap(await getCollection('topics'));
  const model = createLlmMapModel(topics);

  return new Response(JSON.stringify(model, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
