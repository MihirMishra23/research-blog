import { getCollection } from 'astro:content';
import { createLlmMapModel } from '../content/map-model';
import { shouldIncludeTopic } from '../content/visibility';

export async function GET() {
  const topics = (await getCollection('topics')).filter((entry) =>
    shouldIncludeTopic(entry.data),
  );
  const model = createLlmMapModel(topics);

  return new Response(JSON.stringify(model, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
