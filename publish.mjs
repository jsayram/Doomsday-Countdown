import { createHash } from 'node:crypto';
import { readFile, stat, writeFile, rename, chmod } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const projectRoot = new URL('.', import.meta.url);
const indexUrl = new URL('index.html', projectRoot);
const envUrl = new URL('.env', projectRoot);
const stateUrl = new URL('.herenow-publish.json', projectRoot);

async function readOptional(path) {
  try { return await readFile(path, 'utf8'); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

function envValue(source, name) {
  if (!source) return '';
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const equals = line.indexOf('=');
    if (equals < 0 || line.slice(0, equals).trim() !== name) continue;
    return line.slice(equals + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return '';
}

async function apiKey() {
  if (process.env.HERENOW_API_KEY?.trim()) return process.env.HERENOW_API_KEY.trim();

  const localEnv = await readOptional(envUrl);
  if (localEnv !== null) {
    const mode = (await stat(envUrl)).mode & 0o777;
    if (mode & 0o077) {
      await chmod(envUrl, 0o600);
      console.warn('Restricted .env permissions to the current user.');
    }
    const key = envValue(localEnv, 'HERENOW_API_KEY');
    if (key) return key;
  }

  const credential = await readOptional(join(homedir(), '.herenow', 'credentials'));
  if (credential?.trim()) return credential.trim();
  throw new Error('No here.now API key found. Add HERENOW_API_KEY to the project .env or ~/.herenow/credentials.');
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body;
  try { body = text ? JSON.parse(text) : {}; }
  catch { body = { message: text.slice(0, 300) }; }
  if (!response.ok) throw new Error(`here.now request failed (${response.status}): ${body.message || body.error || 'Unknown error'}`);
  return body;
}

const key = await apiKey();
const indexBytes = await readFile(indexUrl);
const hash = createHash('sha256').update(indexBytes).digest('hex');
const savedStateText = await readOptional(stateUrl);
const savedState = savedStateText ? JSON.parse(savedStateText) : null;
const manifest = [{ path: 'index.html', size: indexBytes.length, contentType: 'text/html; charset=utf-8', hash }];
const payload = {
  files: manifest,
  ttlSeconds: null,
  displayName: 'Doomsday Countdown',
  displayDescription: 'A distraction-resistant cleaning and packing sprint timer.'
};
const apiBase = 'https://here.now/api/v1/publish';
const createUrl = savedState?.slug ? `${apiBase}/${encodeURIComponent(savedState.slug)}` : apiBase;
const headers = {
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  'X-HereNow-Client': 'codex/publish-mjs'
};

const created = await requestJson(createUrl, {
  method: savedState?.slug ? 'PUT' : 'POST',
  headers,
  body: JSON.stringify(payload)
});

for (const upload of created.upload.uploads) {
  if (upload.path !== 'index.html') throw new Error(`Refusing unexpected upload path: ${upload.path}`);
  const response = await fetch(upload.url, {
    method: upload.method || 'PUT',
    headers: upload.headers || { 'Content-Type': 'text/html; charset=utf-8' },
    body: indexBytes
  });
  if (!response.ok) throw new Error(`Upload failed (${response.status}).`);
}

const finalized = await requestJson(created.upload.finalizeUrl, {
  method: 'POST',
  headers,
  body: JSON.stringify({ versionId: created.upload.versionId })
});
const siteUrl = finalized.siteUrl || created.siteUrl;
const liveResponse = await fetch(siteUrl, { headers: { 'User-Agent': 'Doomsday-Countdown-Publisher/1.0' } });
if (!liveResponse.ok) throw new Error(`Published site verification failed (${liveResponse.status}).`);
const liveHash = createHash('sha256').update(Buffer.from(await liveResponse.arrayBuffer())).digest('hex');
if (liveHash !== hash) throw new Error('Published index.html did not match the local file.');

const nextState = JSON.stringify({ slug: finalized.slug || created.slug, siteUrl, currentVersionId: finalized.currentVersionId, publishedAt: new Date().toISOString() }, null, 2) + '\n';
const tempStateUrl = new URL('.herenow-publish.json.tmp', projectRoot);
await writeFile(tempStateUrl, nextState, { mode: 0o600 });
await rename(tempStateUrl, stateUrl);
console.log(`Published and verified: ${siteUrl}`);
