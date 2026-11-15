import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { setTimeout as delay } from 'node:timers/promises';
import { dev } from 'astro';

const require = createRequire(import.meta.url);
let site;
let stopping = false;
const proxy = spawn(
  process.execPath,
  [require.resolve('decap-server/dist/index.js')],
  {
    stdio: 'inherit',
    env: { ...process.env, BIND_HOST: '127.0.0.1', PORT: '8081', MODE: 'fs' },
  },
);

async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  proxy.kill('SIGTERM');
  const forceStop = setTimeout(() => proxy.kill('SIGKILL'), 3000);
  forceStop.unref();
  await site?.stop();
}

process.once('SIGINT', () => void stop());
process.once('SIGTERM', () => void stop());
proxy.once('error', (error) => {
  console.error(`Cannot start the editor: ${error.message}`);
  void stop(1);
});
proxy.once('exit', (code) => {
  if (!stopping) {
    console.error(`Editor server exited (${code ?? 'signal'}).`);
    void stop(1);
  }
});

try {
  let ready = false;
  for (let attempt = 0; attempt < 40 && !stopping; attempt++) {
    try {
      const response = await fetch('http://127.0.0.1:8081/api/v1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'info' }),
        signal: AbortSignal.timeout(500),
      });
      ready = response.ok && (await response.json()).type === 'local_fs';
      if (ready) break;
    } catch {
      // The editor may still be starting.
    }
    await delay(250);
  }

  if (!stopping) {
    if (!ready) throw new Error('The local editor did not become ready.');
    site = await dev({ server: { host: '127.0.0.1' } });
    if (stopping) {
      await site.stop();
    } else {
      console.log(
        `\nWriting desk: http://localhost:${site.address.port}/research-blog/admin/\nBoth servers are running. Press Ctrl+C to stop them.\n`,
      );
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  await stop(1);
}
