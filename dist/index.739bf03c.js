// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"cVgJb":[function(require,module,exports) {
"use strict";
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "ba60c367739bf03c";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, globalThis, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/"); // Web extension context
    var extCtx = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome; // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    } // $FlowFixMe
    ws.onmessage = async function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        acceptedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH); // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear(); // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] ✨ Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>📝 <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", link.getAttribute("href").split("?")[0] + "?" + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension bugfix for Chromium
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=1255412#c12
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3) {
                        if (typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                            extCtx.runtime.reload();
                            return;
                        }
                        asset.url = extCtx.runtime.getURL("/__parcel_hmr_proxy__?url=" + encodeURIComponent(asset.url + "?t=" + Date.now()));
                        return hmrDownload(asset);
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
             // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id]; // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) return true;
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"ebWYT":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _mainScss = require("../sass/main.scss");
var _configJs = require("./config.js");
var _geojson = require("./geojson");
var _markerSvg = require("url:../svg/marker.svg");
var _markerSvgDefault = parcelHelpers.interopDefault(_markerSvg);
var _handlers = require("./handlers");
var _handlers1 = require("../js/handlers");
// Import all event listeners and handlers from handlers
(0, _handlers.myFeatureFunction)("click");
(0, _handlers.myFeatureFunction)("mouseover");
(0, _handlers.myFeatureFunction)("mouseout");
(0, _handlers1.myMapFunction)("click");
(0, _handlers1.myMapFunction)("mouseover");
(0, _handlers1.myMapFunction)("mouseout");
(0, _handlers1.mySpeakerFunction)("click");
(0, _handlers1.mySpeakerFunction)("mouseover");
(0, _handlers1.mySpeakerFunction)("mouseout");
// Put the map together and add the markers
const showMapMarkers = function() {
    // Put map on page from position (HARD CODED for now)
    if (navigator.geolocation) {
        const map = L.map("map", {
            closePopupOnClick: false,
            scrollWheelZoom: false
        }).setView((0, _configJs.COORDS), 12);
        // Define the tiling
        const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        // Innitialise the map
        osm.addTo(map);
        const geoJsonAdded = L.geoJSON((0, _geojson.geojson), {
            pointToLayer: function(feature = {}, latlng) {
                const { properties ={}  } = feature; // define properties as object from feature
                const { busName  } = properties;
                // create a marker style / we innitialise it
                const logoMarkerStyle = L.Icon.extend({
                    options: {
                        iconSize: [
                            38,
                            38
                        ],
                        iconAnchor: [
                            16,
                            38
                        ],
                        popupAnchor: [
                            4,
                            -34
                        ]
                    }
                });
                var logoMarker = new logoMarkerStyle({
                    iconUrl: (0, _markerSvgDefault.default)
                });
                var popup2 = L.popup({
                    maxWidth: 400,
                    className: "business-popup",
                    closeButton: false
                }).setLatLng(latlng).setContent(`${busName}`).openPopup();
                // We return for each the larker on map and add the mouseover for mobile
                return L.marker(latlng, {
                    icon: logoMarker
                })// {popup: myPopup})
                // .on('click', markerOnClick)
                .on("mouseover", function() {
                    this.bindPopup(popup2).openPopup();
                });
            },
            // Using on each: we go through each of the features and add an addEventListener
            // in leaflets way to if clicked run the function "markerOnClick"
            onEachFeature: (feature = {}, layer)=>{
                L.featureGroup([
                    layer
                ]).on("click", markerOnClick);
            }
        });
        // EasyPopup
        var helloPopup = L.popup().setContent("CLICK MARKER TO SEE MORE").openPopup();
        L.easyButton("fa-info", function(btn, map) {
            helloPopup.setLatLng(map.getCenter()).openPopup().openOn(map);
        }).addTo(map);
        geoJsonAdded.addTo(map);
        // Determine the bounds and extent the map covers when opening based on markers
        map.fitBounds(geoJsonAdded.getBounds(), {
            padding: [
                60,
                80
            ]
        });
    }
};
// Main function after reading geojson and runs all others
function markerOnClick(e) {
    // console.log(e.target);
    //console.log("Hi");
    const obj = e.propagatedFrom.feature.properties;
    console.log(obj);
    const sellerClickedName = obj.busName;
    console.log(sellerClickedName);
    // const sellerClickedLc = sellerClickedName.toLowerCase();
    const sellerClickedContact = obj.contact;
    const sellerClickedNumber = obj.number;
    const sellerClickedAddress = obj.address;
    const sellerClickedEmail = obj.email;
    const sellerClickedWww = obj.www;
    const sellerClickedB1 = obj.blurb1;
    const sellerClickedB2 = obj.blurb2;
    const picName = sellerClickedName.toLowerCase().split(" ").join("");
    const popup = document.querySelector(".popup-wrapper");
    const close = document.querySelector(".popup-close");
    const popArea = document.querySelector(".popup-wrapper");
    popArea.innerHTML = " ";
    const htm = `

        <div class="popup">
            <div class="popup-close">X</div>
            <div class="popup-content">
                <h2 class="heading-secondary">${sellerClickedName} - ${sellerClickedContact}</h2>
                <h4 class="heading-secondary__sub">${sellerClickedAddress} - ${sellerClickedNumber} - ${sellerClickedEmail}</h4>
                <img class="popup-img" src="https://zenergy.site/storage/adlocal/${picName}.jpg"  alt="${sellerClickedName}" />
                <p class="paragraph"> ${sellerClickedB1} - ${sellerClickedB2}</p>


                ${sellerClickedWww ? `<a class="popup-link" href="${sellerClickedWww}" target="_blank">Visit our website</a></div></div>` : "</div></div>"}

                `;
    // ${sellerClickedWww ? <a class="popup-link" href="${sellerClickedWww}
    // '" target="_blank">View company</a></div></div>'` : `</div></div>'}`
    popArea.innerHTML = htm;
    // on click set the display from none to block
    popup.style.display = "block";
    close.addEventListener("click", ()=>{
        // on click set the display from none to block
        popup.style.display = "none";
    });
    // Also make the popup close if we click anywhere on the page
    popup.addEventListener("click", ()=>{
        // on click set the display from none to block
        popup.style.display = "none";
    });
}
const showFeatured = (dta)=>{
    const featuredArea = document.querySelector(".feature");
    featuredArea.innerHTML = "";
    const { features: companies = []  } = dta;
    const companiesRegistered = companies.length;
    // let companySelectedTwo
    // Get a random number between 1 and companyRegistered
    const companySelectedOne = Math.trunc(Math.random() * companiesRegistered) + 1;
    let companySelectedTwo = Math.trunc(Math.random() * companiesRegistered) + 1;
    while(companySelectedOne === companySelectedTwo)companySelectedTwo = Math.trunc(Math.random() * companiesRegistered) + 1;
    const nOne = companySelectedOne - 1;
    const nTwo = companySelectedTwo - 1;
    const compOne = companies[nOne].properties;
    const compTwo = companies[nTwo].properties;
    // console.log(compOne.busName);
    // console.log(compTwo.busName);
    const picNameOne = compOne.busName.toLowerCase().split(" ").join("");
    const picNameTwo = compTwo.busName.toLowerCase().split(" ").join("");
    // console.log(picNameOne);
    // console.log(picNameTwo);
    let html = `

        <div class="feature__box"><div class="feature__box--splash">Featured</div>
            <h2 class="feature__box--cardheader">${compOne.busName}</h2>
            <img class="feature__box--cardimg" src="https://zenergy.site/storage/adlocal/${picNameOne}.jpg" alt="${compOne.busName}" />
            <p class="feature__box--cardtext">${compOne.blurb2}</p>
        </div>

        <div class="feature__box"><div class="feature__box--splash">Featured</div>
            <h2 class="feature__box--cardheader">${compTwo.busName}</h2>
            <img class="feature__box--cardimg" src="https://zenergy.site/storage/adlocal/${picNameTwo}.jpg" alt="${compTwo.busName}" />
            <p class="feature__box--cardtext">${compTwo.blurb2}</p>
        </div>
        
    `;
    featuredArea.innerHTML = html;
};
const listingArea = document.querySelector(".listing");
const showListing = (dta)=>{
    const { features: companies = []  } = dta;
    const companiesRegistered = companies.length;
    // const { properties: list } = companies;
    listingArea.innerHTML = "";
    companies.forEach((company)=>{
        const dta = company.properties;
        const picName = dta.busName.toLowerCase().split(" ").join("");
        // console.log(picName);
        let html = `
            <div class="box">
                <img src="https://zenergy.site/storage/adlocal/${picName}-logo.png" alt="${dta.busName}" class="box__right--img">
                <div class="box__ad">
                    <h3 class="box__left--company">${dta.busName} - ${dta.contact}</h3>
                    <p class="box__left--location">${dta.address} - ${dta.number}</p>
                    <p class="box__left--text">${dta.blurb1} - ${dta.blurb2}</p>
                </div>  
            </div>
        `;
        listingArea.insertAdjacentHTML("afterbegin", html);
    });
};
// console.log(property.properties.busName));
showMapMarkers();
showListing((0, _geojson.geojson));
showFeatured((0, _geojson.geojson)); // showActiveSellerThumbs();
 // eventHandler();

},{"../sass/main.scss":"dFl68","./config.js":"k5Hzs","./geojson":"eQNew","url:../svg/marker.svg":"gYJvx","./handlers":"jlk9X","../js/handlers":"jlk9X","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"dFl68":[function() {},{}],"k5Hzs":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "COORDS", ()=>COORDS);
// The position of the website for now, this will change based on uptae: how we can think about then---
const lat = -26.161536;
const lng = 28.046542;
const COORDS = [
    lat,
    lng
];

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"eQNew":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "geojson", ()=>geojson);
const geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": 1,
                "busName": "Dirty Doggie",
                "address": "25 Thornton road",
                "contact": "Tanya",
                "number": "0824526470",
                "email": "tanyac1976@gmail.com",
                "www": "https://www.facebook.com/DirtyDoggie",
                "blurb1": "Dog Parlour",
                "blurb2": "Dirty Doggie takes care of your pet as if it was our own. The greatest of care is taken to ensure your dog is well groomed and looked after",
                "logo": "dirtydoggie-logo.jpg"
            },
            "geometry": {
                "coordinates": [
                    27.98753153791114,
                    -26.1787062144584
                ],
                "type": "Point"
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 2,
                "busName": "SKK Installations",
                "address": "26 Thornton road",
                "contact": "Richenda Holland",
                "number": "0114700078",
                "email": " info@skkinstallations.co.za",
                "www": " http://skkinstallations.co.za",
                "blurb1": "DRIVEN BY PASSION",
                "blurb2": "Tailored construction solution focused in interior finishing, space planning, project management and acoustic installation.",
                "logo": "skkinstallations-logo.jpg"
            },
            "geometry": {
                "coordinates": [
                    27.98775160864099,
                    -26.178814837428156
                ],
                "type": "Point"
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 3,
                "busName": "Hairshades",
                "address": "50 Thornton road",
                "contact": "Sharon",
                "number": "0718224890",
                "email": "",
                "www": "",
                "blurb1": "Hair sallon",
                "blurb2": "We do male, female and childrens cuts",
                "logo": "hairshades-logo.jpg"
            },
            "geometry": {
                "coordinates": [
                    27.98638722597221,
                    -26.178063924097927
                ],
                "type": "Point"
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 4,
                "busName": "Kijans laundry and tailoring",
                "address": "51 Thornton road",
                "contact": "Beatrice and Justine",
                "number": "0780475988",
                "email": "",
                "www": "",
                "blurb1": "Laundry and tailoring service",
                "blurb2": "For custom tailoring and expert laundry services",
                "logo": "kijanslaundryandtailoring-logo.jpg"
            },
            "geometry": {
                "coordinates": [
                    27.986244261517072,
                    -26.177981871607585
                ],
                "type": "Point"
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 5,
                "busName": "BG Tactical Store",
                "address": "19 Thornton road",
                "contact": "Shannon",
                "number": "0621820177",
                "email": "sales@bgtacticalstore.com",
                "www": "https://bgtacticalstore.com",
                "blurb1": "Self Defence Products",
                "blurb2": "Blank handguns and rifles, pepper sprays, BP Jackets etc.",
                "logo": "bgtacticalstore-logo.jpg"
            },
            "geometry": {
                "coordinates": [
                    27.98655301450775,
                    -26.177820616707816
                ],
                "type": "Point"
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 6,
                "busName": "Nhantsike",
                "address": "47 3rd Avenue",
                "contact": "Nozuko",
                "number": "0833472344",
                "email": "",
                "www": "",
                "blurb1": "Clothing Alterations",
                "blurb2": "Resizing & hemming of shirts, jackets, trousers, curtains, dresses and linen",
                "logo": "nhantsike-logo.jpg"
            },
            "geometry": {
                "coordinates": [
                    27.985408787878,
                    -26.1772527878787
                ],
                "type": "Point"
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 7,
                "busName": "GPS Driving School",
                "address": "26 Thornton Road",
                "contact": "Ezra",
                "number": "0789419072",
                "email": "gpsdrivingschoool@gmail.com",
                "www": "https://gpsdrivingschool.co.za/",
                "blurb1": "Learn your way.",
                "blurb2": "Our vision as a driving school is to ensure all our learner drivers can learn at an affordable price while receiving the best quality service.",
                "logo": "gpsdrivingschool-logo.jpg"
            },
            "geometry": {
                "coordinates": [
                    27.987594458997567,
                    -26.178649057133587, 
                ],
                "type": "Point"
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 8,
                "busName": "The Corners Cafe",
                "address": "19 Thornton Road",
                "contact": "Blaze",
                "number": "",
                "email": "sales@bussiness",
                "www": "",
                "blurb1": "Affordable family food",
                "blurb2": "Enjoy the easyoing atmosphere and vibe at Corners. Catering for locals.",
                "logo": "thecornerscafe-logo.jpg"
            },
            "geometry": {
                "coordinates": [
                    27.986571386090716,
                    -26.177925005706424
                ],
                "type": "Point"
            }
        }
    ]
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gYJvx":[function(require,module,exports) {
module.exports = require("./helpers/bundle-url").getBundleURL("g05j8") + "marker.2bc89214.svg" + "?" + Date.now();

},{"./helpers/bundle-url":"lgJ39"}],"lgJ39":[function(require,module,exports) {
"use strict";
var bundleURL = {};
function getBundleURLCached(id) {
    var value = bundleURL[id];
    if (!value) {
        value = getBundleURL();
        bundleURL[id] = value;
    }
    return value;
}
function getBundleURL() {
    try {
        throw new Error();
    } catch (err) {
        var matches = ("" + err.stack).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g);
        if (matches) // The first two stack frames will be this function and getBundleURLCached.
        // Use the 3rd one, which will be a runtime in the original bundle.
        return getBaseURL(matches[2]);
    }
    return "/";
}
function getBaseURL(url) {
    return ("" + url).replace(/^((?:https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/.+)\/[^/]+$/, "$1") + "/";
} // TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.
function getOrigin(url) {
    var matches = ("" + url).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^/]+/);
    if (!matches) throw new Error("Origin not found");
    return matches[0];
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;

},{}],"jlk9X":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "myFeatureFunction", ()=>myFeatureFunction);
parcelHelpers.export(exports, "myMapFunction", ()=>myMapFunction);
parcelHelpers.export(exports, "mySpeakerFunction", ()=>mySpeakerFunction);
var _mapOnSvg = require("url:../svg/map-on.svg");
var _mapOnSvgDefault = parcelHelpers.interopDefault(_mapOnSvg);
var _mapOffSvg = require("url:../svg/map-off.svg");
var _mapOffSvgDefault = parcelHelpers.interopDefault(_mapOffSvg);
var _starFullSvg = require("url:../svg/star-full.svg");
var _starFullSvgDefault = parcelHelpers.interopDefault(_starFullSvg);
var _starEmptySvg = require("url:../svg/star-empty.svg");
var _starEmptySvgDefault = parcelHelpers.interopDefault(_starEmptySvg);
// Tooltips
const featuredBtn = document.querySelector(".banner__f");
const feature = document.querySelector(".feature");
const mapBtn = document.querySelector(".banner__m");
const speakerBtn = document.querySelector(".banner__sp");
const map = document.querySelector(".map");
// Feature and map switching with svg
let fhtml;
let mhtml;
const myFeatureFunction = function(event) {
    featuredBtn.addEventListener(event, function(e) {
        if (event === "mouseover") {
            console.log("You moused over");
            const featureTooltip = document.querySelector(".tip_f");
            featureTooltip.classList.add("showtip");
        }
        if (event === "mouseout") {
            console.log("You moused out");
            const featureTooltip1 = document.querySelector(".tip_f");
            featureTooltip1.classList.remove("showtip");
        }
        if (event === "click") {
            console.log("You clicked");
            e.preventDefault();
            if (featuredBtn.classList.contains("active")) {
                fhtml = `<img class="banner__marker" src="${0, _starEmptySvgDefault.default}"alt="Turn Off">`;
                featuredBtn.innerHTML = "";
                featuredBtn.innerHTML = fhtml;
                featuredBtn.classList.remove("active");
                feature.classList.add("feature-hide");
            } else {
                fhtml = `<img class="banner__marker active" src="${0, _starFullSvgDefault.default}" alt="Turn On">`;
                featuredBtn.innerHTML = "";
                featuredBtn.innerHTML = fhtml;
                featuredBtn.classList.add("active");
                feature.classList.remove("feature-hide");
            }
        }
    });
};
const myMapFunction = function(event) {
    mapBtn.addEventListener(event, function(e) {
        if (event === "mouseover") {
            console.log("You moused over");
            const featureTooltip = document.querySelector(".tip_m");
            featureTooltip.classList.add("showtip");
        }
        if (event === "mouseout") {
            console.log("You moused out");
            const featureTooltip1 = document.querySelector(".tip_m");
            featureTooltip1.classList.remove("showtip");
        }
        if (event === "click") {
            console.log("You clicked");
            e.preventDefault();
            if (mapBtn.classList.contains("active")) {
                mhtml = `<img class="banner__marker" src="${0, _mapOffSvgDefault.default}"alt="Turn Off">`;
                mapBtn.innerHTML = "";
                mapBtn.innerHTML = mhtml;
                mapBtn.classList.remove("active");
                map.classList.add("map-hide");
            } else {
                mhtml = `<img class="banner__marker active" src="${0, _mapOnSvgDefault.default}" alt="Turn On">`;
                mapBtn.innerHTML = "";
                mapBtn.innerHTML = mhtml;
                mapBtn.classList.add("active");
                map.classList.remove("map-hide");
            }
        }
    });
};
const mySpeakerFunction = function(event) {
    speakerBtn.addEventListener(event, function(e) {
        if (event === "mouseover") {
            console.log("You moused over");
            const speakerTooltip = document.querySelector(".tip_sp");
            speakerTooltip.classList.add("showtip");
        }
        if (event === "mouseout") {
            console.log("You moused out");
            const speakerTooltip1 = document.querySelector(".tip_sp");
            speakerTooltip1.classList.remove("showtip");
        }
        if (event === "click") {
            console.log("To do");
            e.preventDefault();
            const notice = document.querySelector(".notice-wrapper");
            const closeNotice = document.querySelector(".notice-close");
            // on click set the display from none to block
            notice.style.display = "block";
            closeNotice.addEventListener("click", ()=>{
                // on click set the display from none to block
                notice.style.display = "none";
            });
            // Also make the notice close if we click anywhere on the page
            notice.addEventListener("click", ()=>{
                // on click set the display from none to block
                notice.style.display = "none";
            });
        }
    });
};

},{"url:../svg/map-on.svg":"duX0R","url:../svg/map-off.svg":"bZruU","url:../svg/star-full.svg":"c4Ptk","url:../svg/star-empty.svg":"3Drml","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"duX0R":[function(require,module,exports) {
module.exports = require("./helpers/bundle-url").getBundleURL("g05j8") + "map-on.b177d291.svg" + "?" + Date.now();

},{"./helpers/bundle-url":"lgJ39"}],"bZruU":[function(require,module,exports) {
module.exports = require("./helpers/bundle-url").getBundleURL("g05j8") + "map-off.dffb98db.svg" + "?" + Date.now();

},{"./helpers/bundle-url":"lgJ39"}],"c4Ptk":[function(require,module,exports) {
module.exports = require("./helpers/bundle-url").getBundleURL("g05j8") + "star-full.a0f15959.svg" + "?" + Date.now();

},{"./helpers/bundle-url":"lgJ39"}],"3Drml":[function(require,module,exports) {
module.exports = require("./helpers/bundle-url").getBundleURL("g05j8") + "star-empty.9ee31610.svg" + "?" + Date.now();

},{"./helpers/bundle-url":"lgJ39"}]},["cVgJb","ebWYT"], "ebWYT", "parcelRequire1c86")

//# sourceMappingURL=index.739bf03c.js.map
