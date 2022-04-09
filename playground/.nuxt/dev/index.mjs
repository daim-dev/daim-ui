import 'file:///home/daim/code/daim-ui/node_modules/unenv/runtime/polyfill/fetch.node.mjs';
import { Server } from 'http';
import { tmpdir } from 'os';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { parentPort, threadId } from 'worker_threads';
import { provider, isWindows } from 'file:///home/daim/code/daim-ui/node_modules/std-env/dist/index.mjs';
import { handleCacheHeaders, toEventHandler, createApp, createRouter, lazyEventHandler, eventHandler, useQuery } from 'file:///home/daim/code/daim-ui/node_modules/h3/dist/index.mjs';
import { createFetch as createFetch$1, Headers } from 'file:///home/daim/code/daim-ui/node_modules/ohmyfetch/dist/node.mjs';
import destr from 'file:///home/daim/code/daim-ui/node_modules/destr/dist/index.mjs';
import { createRouter as createRouter$1 } from 'file:///home/daim/code/daim-ui/node_modules/radix3/dist/index.mjs';
import { createCall, createFetch } from 'file:///home/daim/code/daim-ui/node_modules/unenv/runtime/fetch/index.mjs';
import { createHooks } from 'file:///home/daim/code/daim-ui/node_modules/hookable/dist/index.mjs';
import { hash } from 'file:///home/daim/code/daim-ui/node_modules/ohash/dist/index.mjs';
import { createStorage } from 'file:///home/daim/code/daim-ui/node_modules/unstorage/dist/index.mjs';
import _unstorage_drivers_fs from 'file:///home/daim/code/daim-ui/node_modules/unstorage/drivers/fs.mjs';
import { createRenderer } from 'file:///home/daim/code/daim-ui/node_modules/vue-bundle-renderer/dist/index.mjs';
import devalue from 'file:///home/daim/code/daim-ui/node_modules/@nuxt/devalue/dist/devalue.mjs';
import { joinURL } from 'file:///home/daim/code/daim-ui/node_modules/ufo/dist/index.mjs';
import { snakeCase } from 'file:///home/daim/code/daim-ui/node_modules/scule/dist/index.mjs';
import htmlTemplate from '/home/daim/code/daim-ui/playground/.nuxt/views/document.template.mjs';
import { renderToString as renderToString$2 } from 'file:///home/daim/code/daim-ui/node_modules/vue/server-renderer/index.mjs';

const _runtimeConfig = {app:{baseURL:"\u002F",buildAssetsDir:"\u002F_nuxt\u002F",cdnURL:""},nitro:{routes:{},envPrefix:"NUXT_"},public:{app:void 0}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
for (const key in _runtimeConfig) {
  _runtimeConfig[key] = getEnv(key) ?? _runtimeConfig[key];
  if (_runtimeConfig[key] && typeof _runtimeConfig[key] === "object") {
    for (const subkey in _runtimeConfig[key]) {
      _runtimeConfig[key][subkey] = getEnv(`${key}_${subkey}`) ?? _runtimeConfig[key][subkey];
    }
  }
}
const config = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
function timingMiddleware(_req, res, next) {
  const start = globalTiming.start();
  const _end = res.end;
  res.end = (data, encoding, callback) => {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!res.headersSent) {
      res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(res, data, encoding, callback);
  };
  next();
}

const serverAssets = [{"baseName":"server","dir":"/home/daim/code/daim-ui/playground/server/assets"}];

const assets = createStorage();

for (const asset of serverAssets) {
  assets.mount(asset.base, _unstorage_drivers_fs({ base: asset.dir }));
}

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets);

storage.mount('root', _unstorage_drivers_fs({"driver":"fs","base":"/home/daim/code/daim-ui/playground"}));
storage.mount('src', _unstorage_drivers_fs({"driver":"fs","base":"/home/daim/code/daim-ui/playground/server"}));
storage.mount('build', _unstorage_drivers_fs({"driver":"fs","base":"/home/daim/code/daim-ui/playground/.nuxt"}));
storage.mount('cache', _unstorage_drivers_fs({"driver":"fs","base":"/home/daim/code/daim-ui/playground/.nuxt/cache"}));

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  magAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key].filter(Boolean).join(":");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.magAge ?? opts.magAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl;
    const _resolve = async () => {
      if (!pending[key]) {
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (req) => req.originalUrl || req.url,
    group: opts.group || "nitro/handlers",
    integrity: [
      opts.integrity,
      handler
    ],
    transform(entry, event) {
      if (event.res.headersSent) {
        return;
      }
      if (handleCacheHeaders(event, {
        modifiedTime: new Date(entry.mtime),
        etag: `W/"${hash(entry.value)}"`,
        maxAge: opts.magAge
      })) {
        return;
      }
      for (const header in entry.value.headers) {
        event.res.setHeader(header, entry.value.headers[header]);
      }
      const cacheControl = [];
      if (opts.swr) {
        if (opts.magAge) {
          cacheControl.push(`s-maxage=${opts.magAge / 1e3}`);
        }
        cacheControl.push("stale-while-revalidate");
      } else if (opts.magAge) {
        cacheControl.push(`max-age=${opts.magAge / 1e3}`);
      }
      if (cacheControl.length) {
        event.res.setHeader("Cache-Control", cacheControl.join(", "));
      }
      if (entry.value.code) {
        event.res.statusCode = entry.value.code;
      }
      return entry.value.body;
    }
  };
  const _handler = toEventHandler(handler);
  return cachedFunction(async (event) => {
    const body = await _handler(event);
    const headers = event.res.getHeaders();
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
}
const cachedEventHandler = defineCachedEventHandler;

const plugins = [
  
];

function hasReqHeader(req, header, includes) {
  const value = req.headers[header];
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event.req, "accept", "application/json") || hasReqHeader(event.req, "user-agent", "curl/") || hasReqHeader(event.req, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Route Not Found" : "Internal Server Error");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const isDev = "development" === "development";
function handleError(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const showDetails = isDev && statusCode !== 404;
  const errorObject = {
    url: event.req.url || "",
    statusCode,
    statusMessage,
    message,
    stack: showDetails ? stack.map((i) => i.text) : void 0
  };
  if (statusCode !== 404) {
    console.error("[nitro] [request error]", error.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  event.res.statusCode = statusCode;
  event.res.statusMessage = statusMessage;
  if (isJsonRequest(event)) {
    event.res.setHeader("Content-Type", "application/json");
    event.res.end(JSON.stringify(errorObject));
  } else {
    event.res.setHeader("Content-Type", "text/html");
    event.res.end(renderHTMLError(errorObject));
  }
}
function renderHTMLError(error) {
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "server";
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${statusCode} ${statusMessage}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico/css/pico.min.css">
  </head>
  <body>
    <main class="container">
      <dialog open>
        <article>
          <header>
            <h2>${statusCode} ${statusMessage}</h2>
          </header>
          <code>
            ${error.message}<br><br>
            ${"\n" + (error.stack || []).map((i) => `&nbsp;&nbsp;${i}`).join("<br>")}
          </code>
          <footer>
            <a href="/" onclick="event.preventDefault();history.back();">Go Back</a>
          </footer>
        </article>
      </dialog>
    </main>
  </body>
</html>
`;
}

const _07e3f1 = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '/__nuxt_error', handler: _07e3f1, lazy: true, method: undefined },
  { route: '/**', handler: _07e3f1, lazy: true, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(true),
    onError: handleError
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter();
  const routerOptions = createRouter$1({ routes: config.nitro.routes });
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    const referenceRoute = h.route.replace(/:\w+|\*\*/g, "_");
    const routeOptions = routerOptions.lookup(referenceRoute) || {};
    if (routeOptions.swr) {
      handler = cachedEventHandler(handler, {
        group: "nitro/routes"
      });
    }
    if (h.route === "") {
      h3App.use(config.app.baseURL, handler);
    } else {
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(h3App.nodeHandler);
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();

const server = new Server(nitroApp.h3App.nodeHandler);
function getAddress() {
  if (provider === "stackblitz" || process.env.NITRO_NO_UNIX_SOCKET) {
    return "0";
  }
  const socketName = `worker-${process.pid}-${threadId}.sock`;
  if (isWindows) {
    return join("\\\\.\\pipe\\nitro", socketName);
  } else {
    const socketDir = join(tmpdir(), "nitro");
    mkdirSync(socketDir, { recursive: true });
    return join(socketDir, socketName);
  }
}
const listenAddress = getAddress();
server.listen(listenAddress, () => {
  const _address = server.address();
  parentPort.postMessage({
    event: "listen",
    address: typeof _address === "string" ? { socketPath: _address } : { host: "localhost", port: _address.port }
  });
});
process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));

function buildAssetsURL(...path) {
  return joinURL(publicAssetsURL(), useRuntimeConfig().app.buildAssetsDir, ...path);
}
function publicAssetsURL(...path) {
  const publicBase = useRuntimeConfig().app.cdnURL || useRuntimeConfig().app.baseURL;
  return path.length ? joinURL(publicBase, ...path) : publicBase;
}

const STATIC_ASSETS_BASE = process.env.NUXT_STATIC_BASE + "/" + process.env.NUXT_STATIC_VERSION;
const NUXT_NO_SSR = process.env.NUXT_NO_SSR;
const PAYLOAD_JS = "/payload.js";
const getClientManifest = cachedImport(() => import('/home/daim/code/daim-ui/playground/.nuxt/dist/server/client.manifest.mjs'));
const getSSRApp = !process.env.NUXT_NO_SSR && cachedImport(() => import('/home/daim/code/daim-ui/playground/.nuxt/dist/server/server.mjs'));
const getSSRRenderer = cachedResult(async () => {
  const clientManifest = await getClientManifest();
  if (!clientManifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getSSRApp();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const { renderToString: renderToString2 } = await Promise.resolve().then(function () { return vue3; });
  return createRenderer(createSSRApp, { clientManifest, renderToString: renderToString2, publicPath: buildAssetsURL() }).renderToString;
});
const getSPARenderer = cachedResult(async () => {
  const clientManifest = await getClientManifest();
  return (ssrContext) => {
    const config = useRuntimeConfig();
    ssrContext.nuxt = {
      serverRendered: false,
      config: {
        ...config.public,
        app: config.app
      }
    };
    let entryFiles = Object.values(clientManifest).filter((fileValue) => fileValue.isEntry);
    if ("all" in clientManifest && "initial" in clientManifest) {
      entryFiles = clientManifest.initial.map((file) => ({ file }));
    }
    return {
      html: '<div id="__nuxt"></div>',
      renderResourceHints: () => "",
      renderStyles: () => entryFiles.flatMap(({ css }) => css).filter((css) => css != null).map((file) => `<link rel="stylesheet" href="${buildAssetsURL(file)}">`).join(""),
      renderScripts: () => entryFiles.map(({ file }) => {
        const isMJS = !file.endsWith(".js");
        return `<script ${isMJS ? 'type="module"' : ""} src="${buildAssetsURL(file)}"><\/script>`;
      }).join("")
    };
  };
});
function renderToString$1(ssrContext) {
  const getRenderer = NUXT_NO_SSR || ssrContext.noSSR ? getSPARenderer : getSSRRenderer;
  return getRenderer().then((renderToString2) => renderToString2(ssrContext));
}
const renderer = eventHandler(async (event) => {
  const ssrError = event.req.url?.startsWith("/__nuxt_error") ? useQuery(event) : null;
  let url = ssrError?.url || event.req.url;
  let isPayloadReq = false;
  if (url.startsWith(STATIC_ASSETS_BASE) && url.endsWith(PAYLOAD_JS)) {
    isPayloadReq = true;
    url = url.slice(STATIC_ASSETS_BASE.length, url.length - PAYLOAD_JS.length) || "/";
  }
  const config = useRuntimeConfig();
  const ssrContext = {
    url,
    event,
    req: event.req,
    res: event.res,
    runtimeConfig: { private: config, public: { ...config.public, app: config.app } },
    noSSR: event.req.headers["x-nuxt-no-ssr"],
    error: ssrError,
    redirected: void 0,
    nuxt: void 0,
    payload: void 0
  };
  const rendered = await renderToString$1(ssrContext).catch((e) => {
    if (!ssrError) {
      throw e;
    }
  });
  if (!rendered) {
    return;
  }
  if (ssrContext.redirected || event.res.writableEnded) {
    return;
  }
  const error = ssrContext.error || ssrContext.nuxt?.error;
  if (error && !ssrError) {
    throw error;
  }
  if (ssrContext.nuxt?.hooks) {
    await ssrContext.nuxt.hooks.callHook("app:rendered");
  }
  const payload = ssrContext.payload || ssrContext.nuxt;
  if (process.env.NUXT_FULL_STATIC) {
    payload.staticAssetsBase = STATIC_ASSETS_BASE;
  }
  let data;
  if (isPayloadReq) {
    data = renderPayload(payload, url);
    event.res.setHeader("Content-Type", "text/javascript;charset=UTF-8");
  } else {
    data = await renderHTML(payload, rendered, ssrContext);
    event.res.setHeader("Content-Type", "text/html;charset=UTF-8");
  }
  event.res.end(data, "utf-8");
});
async function renderHTML(payload, rendered, ssrContext) {
  const state = `<script>window.__NUXT__=${devalue(payload)}<\/script>`;
  const html = rendered.html;
  if ("renderMeta" in ssrContext) {
    rendered.meta = await ssrContext.renderMeta();
  }
  const {
    htmlAttrs = "",
    bodyAttrs = "",
    headAttrs = "",
    headTags = "",
    bodyScriptsPrepend = "",
    bodyScripts = ""
  } = rendered.meta || {};
  return htmlTemplate({
    HTML_ATTRS: htmlAttrs,
    HEAD_ATTRS: headAttrs,
    HEAD: headTags + rendered.renderResourceHints() + rendered.renderStyles() + (ssrContext.styles || ""),
    BODY_ATTRS: bodyAttrs,
    BODY_PREPEND: ssrContext.teleports?.body || "",
    APP: bodyScriptsPrepend + html + state + rendered.renderScripts() + bodyScripts
  });
}
function renderPayload(payload, url) {
  return `__NUXT_JSONP__("${url}", ${devalue(payload)})`;
}
function _interopDefault(e) {
  return e && typeof e === "object" && "default" in e ? e.default : e;
}
function cachedImport(importer) {
  return cachedResult(() => importer().then(_interopDefault));
}
function cachedResult(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}

const renderer$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': renderer
});

const renderToString = (...args) => {
  return renderToString$2(...args).then((result) => `<div id="__nuxt">${result}</div>`);
};

const vue3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  renderToString: renderToString
});
//# sourceMappingURL=index.mjs.map
