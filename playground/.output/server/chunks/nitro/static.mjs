import { eventHandler, createError } from 'h3';
import { withLeadingSlash, withoutTrailingSlash, parseURL } from 'ufo';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';

const assets = {
  "/_nuxt/entry-ab54a701.mjs": {
    "type": "application/javascript",
    "etag": "\"161d4-T1THxZf9ehDbEK2jnhsvcxWAx4Y\"",
    "mtime": "2022-04-09T23:40:10.010Z",
    "path": "../public/_nuxt/entry-ab54a701.mjs"
  },
  "/_nuxt/entry.ddfbded1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"457e-DDtuGlTglPtlaG0CuiNQrvKlmXs\"",
    "mtime": "2022-04-09T23:40:10.010Z",
    "path": "../public/_nuxt/entry.ddfbded1.css"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"d3-EEFfJSPKH8mQGMGUWUlKBHVT9ec\"",
    "mtime": "2022-04-09T23:40:10.010Z",
    "path": "../public/_nuxt/manifest.json"
  }
};

const mainDir = dirname(fileURLToPath(globalThis.entryURL));
function readAsset (id) {
  return promises.readFile(resolve(mainDir, assets[id].path)).catch(() => {})
}

const publicAssetBases = ["/_nuxt"];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const _static = eventHandler(async (event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  for (const _id of [id, id + "/index.html"]) {
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
      break;
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end("Not Modified (etag)");
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end("Not Modified (mtime)");
      return;
    }
  }
  if (asset.type) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  const contents = await readAsset(id);
  event.res.end(contents);
});

export { _static as default };
