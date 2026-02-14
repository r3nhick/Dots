/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ../../node_modules/uuid/dist/esm-browser/native.js
const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
/* harmony default export */ const esm_browser_native = ({
  randomUUID
});
;// ../../node_modules/uuid/dist/esm-browser/rng.js
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}
;// ../../node_modules/uuid/dist/esm-browser/stringify.js

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

function stringify(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const esm_browser_stringify = ((/* unused pure expression or super */ null && (stringify)));
;// ../../node_modules/uuid/dist/esm-browser/v4.js




function v4(options, buf, offset) {
  if (esm_browser_native.randomUUID && !buf && !options) {
    return esm_browser_native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return unsafeStringify(rnds);
}

/* harmony default export */ const esm_browser_v4 = (v4);
;// ../../node_modules/@eyeo/snippets/webext/main.mjs
/*!
 * This file is part of eyeo's Anti-Circumvention Snippets module (@eyeo/snippets),
 * Copyright (C) 2006-present eyeo GmbH
 * 
 * @eyeo/snippets is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 * 
 * @eyeo/snippets is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with @eyeo/snippets.  If not, see <http://www.gnu.org/licenses/>.
 */

let currentEnvironment = {initial: true};
const callback = (environment, ...filters) => {
const e=Proxy,{apply:t,bind:n,call:r}=Function,o=r.bind(t),s=r.bind(n),i=r.bind(r),a={get:(e,t)=>s(r,e[t])},c=t=>new e(t,a),l=(t,n)=>new e(t,{apply:(e,t,r)=>o(n,t,r)}),u={get:(e,t)=>s(e[t],e)},f=t=>new e(t,u),{assign:p,defineProperties:d,freeze:h,getOwnPropertyDescriptor:g,getOwnPropertyDescriptors:y,getPrototypeOf:w}=f(Object),{hasOwnProperty:m}=c({}),{species:v}=Symbol,b={get(e,t){const n=e[t];class r extends n{}const o=y(n.prototype);delete o.constructor,h(d(r.prototype,o));const s=y(n);return delete s.length,delete s.prototype,s[v]={value:r},h(d(r,s))}},E=t=>new e(t,b);"undefined"!=typeof currentEnvironment&&currentEnvironment.initial&&"undefined"!=typeof environment&&(currentEnvironment=environment);const $=()=>"undefined"!=typeof currentEnvironment?currentEnvironment:"undefined"!=typeof environment?environment:{};"undefined"==typeof globalThis&&(window.globalThis=window);const{apply:S,ownKeys:T}=f(Reflect),x=$(),j="world"in x,k=j&&"ISOLATED"===x.world,M=j&&"MAIN"===x.world,R="object"==typeof chrome&&!!chrome.runtime,L="object"==typeof browser&&!!browser.runtime,P=!M&&(k||R||L),A=e=>P?e:O(e,F(e)),{create:O,defineProperties:N,defineProperty:C,freeze:I,getOwnPropertyDescriptor:W,getOwnPropertyDescriptors:F}=f(Object),D=f(globalThis),H=P?globalThis:E(globalThis),{Map:z,RegExp:B,Set:U,WeakMap:q,WeakSet:V}=H,J=(e,t,n=null)=>{const r=T(t);for(const o of T(e)){if(r.includes(o))continue;const s=W(e,o);if(n&&"value"in s){const{value:e}=s;"function"==typeof e&&(s.value=n(e))}C(t,o,s)}},G=e=>{const t=H[e];class n extends t{}const{toString:r,valueOf:o}=t.prototype;N(n.prototype,{toString:{value:r},valueOf:{value:o}});const s=e.toLowerCase(),i=e=>function(){const t=S(e,this,arguments);return typeof t===s?new n(t):t};return J(t,n,i),J(t.prototype,n.prototype,i),n},X=I({frozen:new q,hidden:new V,iframePropertiesToAbort:{read:new U,write:new U},abortedIframes:new q}),_=new B("^[A-Z]"),K=P&&(R&&chrome||L&&browser)||void 0;var Y=new Proxy(new z([["chrome",K],["browser",K],["isExtensionContext",P],["variables",X],["console",A(console)],["document",globalThis.document],["JSON",A(JSON)],["Map",z],["Math",A(Math)],["Number",P?Number:G("Number")],["RegExp",B],["Set",U],["String",P?String:G("String")],["WeakMap",q],["WeakSet",V],["MouseEvent",MouseEvent]]),{get(e,t){if(e.has(t))return e.get(t);let n=globalThis[t];return"function"==typeof n&&(n=(_.test(t)?H:D)[t]),e.set(t,n),n},has:(e,t)=>e.has(t)});const Z={WeakSet:WeakSet,WeakMap:WeakMap,WeakValue:class{has(){return!1}set(){}}},{apply:Q}=Reflect;const{Map:ee,WeakMap:te,WeakSet:ne,setTimeout:re}=Y;let oe=!0,se=e=>{e.clear(),oe=!oe};var ie=function(e){const{WeakSet:t,WeakMap:n,WeakValue:r}=this||Z,o=new t,s=new n,i=new r;return function(t){if(o.has(t))return t;if(s.has(t))return s.get(t);if(i.has(t))return i.get(t);const n=Q(e,this,arguments);return o.add(n),n!==t&&("object"==typeof t&&t?s:i).set(t,n),n}}.bind({WeakMap:te,WeakSet:ne,WeakValue:class extends ee{set(e,t){return oe&&(oe=!oe,re(se,0,this)),super.set(e,t)}}});const{concat:ae,includes:ce,join:le,reduce:ue,unshift:fe}=c([]),{Map:pe,WeakMap:de}=E(globalThis),he=new pe,ge=e=>{const t=(e=>{const t=[];let n=e;for(;n;){if(he.has(n))fe(t,he.get(n));else{const e=y(n);he.set(n,e),fe(t,e)}n=w(n)}return fe(t,{}),o(p,null,t)})("function"==typeof e?e.prototype:e),n={get(e,n){if(n in t){const{value:r,get:o}=t[n];if(o)return i(o,e);if("function"==typeof r)return s(r,e)}return e[n]},set(e,n,r){if(n in t){const{set:o}=t[n];if(o)return i(o,e,r),!0}return e[n]=r,!0}};return e=>new Proxy(e,n)},{isExtensionContext:ye,Array:we,Number:me,String:ve,Object:be}=Y,{isArray:Ee}=we,{getOwnPropertyDescriptor:$e,setPrototypeOf:Se}=be,{toString:Te}=be.prototype,{slice:xe}=ve.prototype,{get:je}=$e(Node.prototype,"nodeType"),ke=ye?{}:{Attr:ge(Attr),CanvasRenderingContext2D:ge(CanvasRenderingContext2D),CSSStyleDeclaration:ge(CSSStyleDeclaration),Document:ge(Document),Element:ge(Element),HTMLCanvasElement:ge(HTMLCanvasElement),HTMLElement:ge(HTMLElement),HTMLImageElement:ge(HTMLImageElement),HTMLScriptElement:ge(HTMLScriptElement),MutationRecord:ge(MutationRecord),Node:ge(Node),ShadowRoot:ge(ShadowRoot),get CSS2Properties(){return ke.CSSStyleDeclaration}},Me=(e,t)=>{if("Element"!==t&&t in ke)return ke[t](e);if(Ee(e))return Se(e,we.prototype);const n=(e=>i(xe,i(Te,e),8,-1))(e);if(n in ke)return ke[n](e);if(n in Y)return Se(e,Y[n].prototype);if("nodeType"in e)switch(i(je,e)){case 1:if(!(t in ke))throw new Error("unknown hint "+t);return ke[t](e);case 2:return ke.Attr(e);case 3:return ke.Node(e);case 9:return ke.Document(e)}throw new Error("unknown brand "+n)};var Re=ye?e=>e===window||e===globalThis?Y:e:ie(((e,t="Element")=>{if(e===window||e===globalThis)return Y;switch(typeof e){case"object":return e&&Me(e,t);case"string":return new ve(e);case"number":return new me(e);default:throw new Error("unsupported value")}}));const Le={get(e,t){const n=e;for(;!m(e,t);)e=w(e);const{get:r,set:s}=g(e,t);return function(){return arguments.length?o(s,n,arguments):i(r,n)}}},Pe=t=>new e(t,Le);let{Math:Ae,setInterval:Oe,performance:Ne}=Re(window);const Ce={mark(){},end(){},toString:()=>"{mark(){},end(){}}"};let Ie=!0;function We(e,t=10){if(Ie)return Ce;function n(){let e=Re([]);for(let{name:t,duration:n}of Ne.getEntriesByType("measure"))e.push({name:t,duration:n});e.length&&Ne.clearMeasures()}return We[e]||(We[e]=Oe(n,Ae.round(6e4/Ae.min(60,t)))),{mark(){Ne.mark(e)},end(t=!1){Ne.measure(e,e);const r=Ne.getEntriesByName(e,"measure"),o=r.length>0?r[r.length-1]:null;console.log("PROFILER:",o),Ne.clearMarks(e),t&&(clearInterval(We[e]),delete We[e],n())}}}let Fe=!1;function De(){return Fe}const{console:He}=Re(window),ze=()=>{};function Be(...e){let{mark:t,end:n}=We("log");if(De()){const t=["%c DEBUG","font-weight: bold;"],n=e.indexOf("error"),r=e.indexOf("warn"),o=e.indexOf("success"),s=e.indexOf("info");-1!==n?(t[0]+=" - ERROR",t[1]+="color: red; border:2px solid red",Re(e).splice(n,1)):-1!==r?(t[0]+=" - WARNING",t[1]+="color: orange; border:2px solid orange ",Re(e).splice(r,1)):-1!==o?(t[0]+=" - SUCCESS",t[1]+="color: green; border:2px solid green",Re(e).splice(o,1)):-1!==s&&(t[1]+="color: black;",Re(e).splice(s,1)),Re(e).unshift(...t)}t(),He.log(...e),n()}function Ue(e){return s(De()?Be:ze,null,e)}let{Array:qe,Math:Ve,RegExp:Je}=Re(window);function Ge(e){let{length:t}=e;if(t>1&&"/"===e[0]){let n="/"===e[t-1];if(n||t>2&&Re(e).endsWith("/i")){let t=[Re(e).slice(1,n?-1:-2)];return n||t.push("i"),new Je(...t)}}return new Je(Re(e).replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&"))}function Xe(){return Re(Ve.floor(2116316160*Ve.random()+60466176)).toString(36)}function _e(e){return Re(qe.from(e)).map((e=>`'${e}'`)).join(" ")}let{parseFloat:Ke,variables:Ye,clearTimeout:Ze,fetch:Qe,setTimeout:et,Array:tt,Error:nt,Map:rt,Object:ot,ReferenceError:st,Set:it,WeakMap:at}=Re(window),{onerror:ct}=Pe(window),lt=Node.prototype,ut=Element.prototype,ft=null;function pt(e,t,n,r=!0){let o=Re(t),s=o.indexOf(".");if(-1==s){let o=ot.getOwnPropertyDescriptor(e,t);if(o&&!o.configurable)return;let s=ot.assign({},n,{configurable:r});if(!o&&!s.get&&s.set){let n=e[t];s.get=()=>n}return void ot.defineProperty(e,t,s)}let i=o.slice(0,s).toString();t=o.slice(s+1).toString();let a=e[i];!a||"object"!=typeof a&&"function"!=typeof a||pt(a,t,n);let c=ot.getOwnPropertyDescriptor(e,i);if(c&&!c.configurable)return;ft||(ft=new at),ft.has(e)||ft.set(e,new rt);let l=ft.get(e);if(l.has(i))return void l.get(i).set(t,n);let u=new rt([[t,n]]);l.set(i,u),ot.defineProperty(e,i,{get:()=>a,set(e){if(a=e,a&&("object"==typeof a||"function"==typeof a))for(let[e,t]of u)pt(a,e,t)},configurable:r})}function dt(e){let t=ct();ct(((...n)=>{let r=n.length&&n[0];return!("string"!=typeof r||!Re(r).includes(e))||("function"==typeof t?o(t,this,n):void 0)}))}function ht(e,t,n,r="",o=!0){let s=Ue(e);if(!n)return void s("error","no property to abort on read");let i=Xe();s("info",`aborting on ${n} access`),pt(t,n,{get:function(){throw s("success",`${n} access aborted`,`\nFILTER: ${e} ${r}`),new st(i)},set(){}},o),dt(i)}function gt(e,t,n,r="",o=!0){let s=Ue(e);if(!n)return void s("error","no property to abort on write");let i=Xe();s("info",`aborting when setting ${n}`),pt(t,n,{set:function(){throw s("success",`setting ${n} aborted`,`\nFILTER: ${e} ${r}`),new st(i)}},o),dt(i)}function yt(e,t=!1,n=!1){let r=Ye.abortedIframes,s=Ye.iframePropertiesToAbort;const a=_e(e);for(let o of tt.from(window.frames))if(r.has(o))for(let s of e)t&&r.get(o).read.add({property:s,formattedProperties:a}),n&&r.get(o).write.add({property:s,formattedProperties:a});for(let r of e)t&&s.read.add({property:r,formattedProperties:a}),n&&s.write.add({property:r,formattedProperties:a});function c(){for(let e of tt.from(window.frames)){r.has(e)||r.set(e,{read:new it(s.read),write:new it(s.write)});let t=r.get(e).read;if(t.size>0){let n=tt.from(t);t.clear();for(let{property:t,formattedProperties:r}of n)ht("abort-on-iframe-property-read",e,t,r)}let n=r.get(e).write;if(n.size>0){let t=tt.from(n);n.clear();for(let{property:n,formattedProperties:r}of t)gt("abort-on-iframe-property-write",e,n,r)}}}c(),r.has(document)||(r.set(document,!0),function(e){let t;function n(e,t){for(let n of t){pt(e,n,r(e,n))}}function r(t,n){let r=t[n];return{get:()=>function(...t){let n;return n=o(r,this,t),e&&e(),n}}}function s(t,n){let r=ot.getOwnPropertyDescriptor(t,n),{set:o}=r||{};return{set(t){let n;return n=i(o,this,t),e&&e(),n}}}n(lt,["appendChild","insertBefore","replaceChild"]),n(ut,["append","prepend","replaceWith","after","before","insertAdjacentElement","insertAdjacentHTML"]),t=s(ut,"innerHTML"),pt(ut,"innerHTML",t),t=s(ut,"outerHTML"),pt(ut,"outerHTML",t)}(c))}let{Object:wt}=window;function mt(e,t){if(!(e instanceof wt))return;let n=e,r=Re(t).split(".");if(0===r.length)return;for(let e=0;e<r.length-1;e++){let t=r[e];if(!m(n,t))return;if(n=n[t],!(n instanceof wt))return}let o=r[r.length-1];return m(n,o)?[n,o]:void 0}const vt=Re(/^\d+$/);function bt(e){switch(e){case"false":return!1;case"true":return!0;case"falseStr":return"false";case"trueStr":return"true";case"null":return null;case"noopFunc":return()=>{};case"trueFunc":return()=>!0;case"falseFunc":return()=>!1;case"emptyArray":return[];case"emptyObj":return{};case"undefined":return;case"":return e;default:return vt.test(e)?Ke(e):e}}function Et(e,t){if(!e||!e.length)return!0;const n=Xe(),r=new nt(n),o=new URL(self.location.href);o.hash="";const s=/(.*?@)?(\S+)(:\d+):\d+\)?$/,i=[];for(let e of r.stack.split(/[\n\r]+/)){if(Re(e).includes(n))continue;e=Re(e).trim();const t=Re(s).exec(e);if(null===t)continue;let r=t[2];Re(r).startsWith("(")&&(r=Re(r).slice(1)),r===o.href?r="inlineScript":Re(r).startsWith("<anonymous>")&&(r="injectedScript");let a=t[1]?Re(t[1]).slice(0,-1):Re(e).slice(0,Re(t).index).trim();Re(a).startsWith("at")&&(a=Re(a).slice(2).trim());let c=t[3];Re(i).push(" "+`${a} ${r}${c}:1`.trim())}i[0]="stackDepth:"+(i.length-1);const a=Re(i).join("\n");for(let n of e){if(Ge(n).test(a))return t("info",`Found needle in stack trace: ${n}`),!0}return t("info",`Stack trace does not match any needle. Stack trace: ${a}`),!1}new rt;let{HTMLScriptElement:$t,Object:St,ReferenceError:Tt}=Re(window),xt=St.getPrototypeOf($t);const{Error:jt,Object:kt,Array:Mt,Map:Rt}=Re(window);let Lt=null;function Pt(e,t,n){let r=e;for(const e of n){if(!r||!m(r,e))return!1;r=r[e]}if("string"==typeof r||"number"==typeof r){const e=r.toString();return t.test(e)}return!1}const{Array:At,Blob:Ot,Error:Nt,Object:Ct,Reflect:It}=Re(window),Wt=[];let{Error:Ft,URL:Dt}=Re(window),{cookie:Ht}=Pe(document);const{Map:zt,Object:Bt,Reflect:Ut,WeakMap:qt}=Re(window),Vt=window.EventTarget.prototype.addEventListener,Jt=window.EventTarget.prototype.removeEventListener,Gt=new qt;let Xt=[];let{console:_t,document:Kt,getComputedStyle:Yt,isExtensionContext:Zt,variables:Qt,Array:en,MutationObserver:tn,Object:nn,DOMMatrix:rn,XPathEvaluator:on,XPathExpression:sn,XPathResult:an}=Re(window);const{querySelectorAll:cn}=Kt,ln=cn&&s(cn,Kt);function un(e,t=!1){return dn(e,ln.bind(Kt),Kt,t)}function fn(e,t,n,r){const o=t.getAttribute("xlink:href")||t.getAttribute("href");if(o){const i=ln(o)[0];if(!i&&De())return _t.log("No elements found matching",o),!1;if(!(s=e)||0===s.length||s.every((e=>""===e.trim()))){const e=r.length>0?r:[];return n.push({element:i,rootParents:[...e,t]}),!1}const a=i.querySelectorAll.bind(i);return{nextBoundElement:i,nestedSelectorsString:e.join("^^"),next$$:a}}var s}function pn(e,t){const n=function(e,t=!1){try{const n=navigator.userAgent.includes("Firefox")?e.openOrClosedShadowRoot:browser.dom.openOrClosedShadowRoot(e);return null===n&&De()&&!t&&_t.log("Shadow root not found or not added in element yet",e),n}catch(n){return De()&&!t&&_t.log("Error while accessing shadow root",e,n),null}}(t);if(n){const{querySelectorAll:r}=n,o=r&&s(r,n).bind(n);return{nextBoundElement:t,nestedSelectorsString:":host "+e.join("^^"),next$$:o}}return!1}function dn(e,t,n,r,o=[]){if(e.includes("^^")){const[s,i,...a]=e.split("^^");let c,l;switch(i){case"svg":l=fn;break;case"sh":l=pn;break;default:return De()&&_t.log(i," is not supported. Supported commands are: \n^^sh^^\n^^svg^^"),[]}c=""===s.trim()?[n]:t(s);const u=[];for(const e of c){const t=l(a,e,u,o);if(!t)continue;const{next$$:n,nestedSelectorsString:s,nextBoundElement:i}=t,c=dn(s,n,i,r,[...o,e]);c&&u.push(...c)}return u}const s=t(e);return r?[...s].map((e=>({element:e,rootParents:o.length>0?o:[]}))):s}const{assign:hn,setPrototypeOf:gn}=nn;class yn extends sn{evaluate(...e){return gn(o(super.evaluate,this,e),an.prototype)}}class wn extends on{createExpression(...e){return gn(o(super.createExpression,this,e),yn.prototype)}}function mn(e){if(Qt.hidden.has(e))return!1;!function(e){Zt&&"function"==typeof checkElement&&checkElement(e)}(e),Qt.hidden.add(e);let{style:t}=Re(e),n=Re(t,"CSSStyleDeclaration"),r=Re([]);const o=$();let{debugCSSProperties:s}=o;for(let[e,t]of s||[["display","none"]])n.setProperty(e,t,"important"),r.push([e,n.getPropertyValue(e)]);return new tn((()=>{for(let[e,t]of r){let r=n.getPropertyValue(e),o=n.getPropertyPriority(e);r==t&&"important"==o||n.setProperty(e,t,"important")}})).observe(e,{attributes:!0,attributeFilter:["style"]}),!0}function vn(e){let t=e;if(t.startsWith("xpath(")&&t.endsWith(")")){let t=function(e){let t=e;if(t.startsWith("xpath(")&&t.endsWith(")")){let e=t.slice(6,-1),n=(new wn).createExpression(e,null),r=an.ORDERED_NODE_SNAPSHOT_TYPE;return e=>{if(!e)return;let t=n.evaluate(Kt,r,null),{snapshotLength:o}=t;for(let n=0;n<o;n++)e(t.snapshotItem(n))}}return t=>un(e).forEach(t)}(e);return()=>{let e=Re([]);return t((t=>e.push(t))),e}}return()=>en.from(un(e))}let{ELEMENT_NODE:bn,TEXT_NODE:En,prototype:$n}=Node,{prototype:Sn}=Element,{prototype:Tn}=HTMLElement,{console:xn,variables:jn,DOMParser:kn,Error:Mn,MutationObserver:Rn,Object:Ln,ReferenceError:Pn}=Re(window),{getOwnPropertyDescriptor:An}=Ln;const{CanvasRenderingContext2D:On,document:Nn,Map:Cn,MutationObserver:In,Object:Wn,Set:Fn,WeakSet:Dn}=Re(window);let Hn,zn=new Fn,Bn=new Dn;function Un(e,t,n,r){zn.add({canvasElement:e,rule:t,functionName:n,text:r})}Re(window);const{Map:qn,MutationObserver:Vn,Object:Jn,Set:Gn,WeakSet:Xn}=Re(window);let _n=Element.prototype,{attachShadow:Kn}=_n,Yn=new Xn,Zn=new qn,Qn=null;const{Array:er,Error:tr,JSON:nr,Map:rr,Object:or,Response:sr}=Re(window);let ir=null;let{Array:ar,Error:cr,JSON:lr,Map:ur,Object:fr,Response:pr}=Re(window),dr=null;const{Error:hr,Object:gr,Map:yr}=Re(window);let wr=null;function mr(e,t,n){if(!n.length){if("string"==typeof e||"number"==typeof e){const n=e.toString();return t.test(n)}return!1}let r=e;for(const e of n){if(!r||!m(r,e))return!1;r=r[e]}if("string"==typeof r||"number"==typeof r){const e=r.toString();return t.test(e)}return!1}let{Error:vr}=Re(window);let{Error:br,Map:Er,Object:$r,console:Sr}=Re(window),{toString:Tr}=Function.prototype,xr=EventTarget.prototype,{addEventListener:jr}=xr,kr=null;let{fetch:Mr}=Re(window),Rr=!1;const Lr=[],Pr=[],Ar=()=>{Rr||(window.fetch=l(Mr,((...e)=>{let[t]=e;if(Lr.length>0&&"string"==typeof t){let n;try{n=new URL(t)}catch(e){if(!(e instanceof TypeError))throw e;n=new URL(t,Re(document).location)}Lr.forEach((e=>e(n))),e[0]=n.href}return o(Mr,self,e).then((e=>{let t=e;return Pr.forEach((e=>{t=e(t)})),t}))})),Rr=!0)};let Or,{Map:Nr,Object:Cr,RegExp:Ir,Response:Wr}=Re(window);const{Error:Fr,Object:Dr,atob:Hr,btoa:zr,RegExp:Br}=Re(window);let Ur,qr,{RegExp:Vr,XMLHttpRequest:Jr,WeakMap:Gr}=Re(window);let Xr,{delete:_r,has:Kr}=c(URLSearchParams.prototype);const Yr={"abort-current-inline-script":function(e,t=null){const n=_e(arguments),r=Ue("abort-current-inline-script"),{mark:o,end:s}=We("abort-current-inline-script"),a=t?Ge(t):null,c=Xe(),l=Re(document).currentScript;let u=window;const f=Re(e).split("."),p=Re(f).pop();for(let e of Re(f))if(u=u[e],!u||"object"!=typeof u&&"function"!=typeof u)return void r("warn",f," is not found");const{get:d,set:h}=St.getOwnPropertyDescriptor(u,p)||{};let g=u[p];void 0===g&&r("warn","The property",p,"doesn't exist yet. Check typos.");const y=()=>{const e=Re(document).currentScript;if(e instanceof xt&&""==Re(e,"HTMLScriptElement").src&&e!=l&&(!a||a.test(Re(e).textContent)))throw r("success",f," is aborted \n",e,"\nFILTER: abort-current-inline-script",n),new Tt(c)},w={get(){return y(),d?i(d,this):g},set(e){y(),h?i(h,this,e):g=e}};o(),pt(u,p,w),s(),dt(c)},"abort-on-iframe-property-read":function(...e){const{mark:t,end:n}=We("abort-on-iframe-property-read");t(),yt(e,!0,!1),n()},"abort-on-iframe-property-write":function(...e){const{mark:t,end:n}=We("abort-on-iframe-property-write");t(),yt(e,!1,!0),n()},"abort-on-property-read":function(e,t){const n=!("false"===t),r=_e(arguments),{mark:o,end:s}=We("abort-on-property-read");o(),ht("abort-on-property-read",window,e,r,n),s()},"abort-on-property-write":function(e,t){const n=_e(arguments),{mark:r,end:o}=We("abort-on-property-write"),s=!("false"===t);r(),gt("abort-on-property-write",window,e,n,s),o()},"array-override":function(e,t,n="false",r,s){if(!e)throw new jt("[array-override snippet]: Missing method to override.");if(!t)throw new jt("[array-override snippet]: Missing needle.");Lt||(Lt=new Rt);let i=Ue("array-override");const{mark:a,end:c}=We("array-override"),u=_e(arguments);if("push"!==e||Lt.has("push"))if("includes"!==e||Lt.has("includes")){if("forEach"===e&&!Lt.has("forEach")){a();const{forEach:e}=Mt.prototype;Lt.set("forEach",Re([])),kt.defineProperty(window.Array.prototype,"forEach",{value:l(e,(function(t,n){const r=Lt.get("forEach");return o(e,this,[function(e,s,a){for(const{needleRegex:t,pathSegments:n,stackNeedles:o}of r)if(n.length||"string"!=typeof e&&"number"!=typeof e){if(n.length&&"object"==typeof e&&null!==e&&Pt(e,t,n)&&Et(o,i))return void i("success",`Array.forEach skipped callback for object containing needle: ${t}\nFILTER: array-override ${u}`)}else{const n=e.toString();if(n.match&&n.match(t)&&Et(o,i))return void i("success",`Array.forEach skipped callback for item matching needle: ${t}\nFILTER: array-override ${u}`)}return o(t,n||this,[e,s,a])},n])}))}),i("info","Wrapped Array.prototype.forEach"),c()}}else{a();const{includes:e}=Mt.prototype;Lt.set("includes",Re([])),kt.defineProperty(window.Array.prototype,"includes",{value:l(e,(function(t){const n=Lt.get("includes");for(const{needleRegex:e,retVal:r,pathSegments:o,stackNeedles:s}of n)if(o.length||"string"!=typeof t&&"number"!=typeof t){if(o.length&&"object"==typeof t&&null!==t&&Pt(t,e,o)&&Et(s,i))return i("success",`Array.includes returned ${r} for object containing ${e}\nFILTER: array-override ${u}`),r}else if(t.toString().match&&t.toString().match(e)&&Et(s,i))return i("success",`Array.includes returned ${r} for ${e}\nFILTER: array-override ${u}`),r;return o(e,this,arguments)}))}),i("info","Wrapped Array.prototype.includes"),c()}else{a();const{push:e}=Mt.prototype;Lt.set("push",Re([])),kt.defineProperty(window.Array.prototype,"push",{value:l(e,(function(t){const n=Lt.get("push");for(const{needleRegex:e,pathSegments:r,stackNeedles:o}of n)if(r.length||"string"!=typeof t&&"number"!=typeof t){if(r.length&&"object"==typeof t&&null!==t&&Pt(t,e,r)&&Et(o,i))return void i("success",`Array.push is ignored for object containing needle: ${e}\nFILTER: array-override ${u}`)}else{const n=t.toString();if(n.match&&n.match(e)&&Et(o,i))return void i("success",`Array.push is ignored for needle: ${e}\nFILTER: array-override ${u}`)}return o(e,this,arguments)}))}),i("info","Wrapped Array.prototype.push"),c()}const f=Ge(t);let p=[];r&&(p=r.split("."));let d=[];s&&(d=s.split(",").map((e=>e.trim())));const h=Lt.get(e),g="true"===n;h.push({needleRegex:f,retVal:g,pathSegments:p,stackNeedles:d}),Lt.set(e,h)},"blob-override":function(e,t="",n=null){if(!e)throw new Nt("[blob-override snippet]: Missing parameter search.");const r=Ue("blob-override"),o=_e(arguments),{mark:s,end:i}=We("blob-override");if(s(),Wt.push({match:Ge(e),replaceWith:t,needle:n?Ge(n):null,formattedArgs:o}),Wt.length>1)return;const a=Ot;function c(e,t={}){if(At.isArray(e)){let t=Re(e).join("");for(const e of Re(Wt))e.needle&&!e.needle.test(t)||!e.match.test(t)||(t=t.replace(e.match,e.replaceWith),r("success",`Replaced: ${e.match} → ${e.replaceWith},\nFILTER: blob-override ${e.formattedArgs}`));e=[t]}const n=It.construct(a,[e,t]);return Ct.setPrototypeOf(n,c.prototype),n}c.prototype=a.prototype,Ct.setPrototypeOf(c,a),window.Blob=c,r("info","Wrapped Blob constructor in context "),i()},"cookie-remover":function(e,t=!1){if(!e)throw new Ft("[cookie-remover snippet]: No cookie to remove.");const n=_e(arguments);let r=Ue("cookie-remover");const{mark:o,end:s}=We("cookie-remover");let i=Ge(e);if(!Re(/^http|^about/).test(location.protocol))return void r("warn","Snippet only works for http or https and about.");function a(){return Re(Ht()).split(";").filter((e=>i.test(Re(e).split("=")[0])))}const c=()=>{r("info","Parsing cookies for matches"),o();for(const e of Re(a())){let t=Re(location.hostname);!t&&Re(location.ancestorOrigins)&&Re(location.ancestorOrigins[0])&&(t=new Dt(Re(location.ancestorOrigins[0])).hostname);const o=Re(e).split("=")[0],s="expires=Thu, 01 Jan 1970 00:00:00 GMT",i="path=/",a=t.split(".");for(let e=a.length;e>0;e--){const t=a.slice(a.length-e).join(".");Ht(`${Re(o).trim()}=;${s};${i};domain=${t}`),Ht(`${Re(o).trim()}=;${s};${i};domain=.${t}`),r("success",`Set expiration date on ${o}`,"\nFILTER: cookie-remover",n)}}s()};if(c(),t){let e=a();setInterval((()=>{let t=a();if(t!==e)try{c()}finally{e=t}}),1e3)}},profile:function(){Ie=!1},debug:function(){Fe=!0},"event-override":function(e,t,n=null){const r=_e(arguments),s={eventType:e,mode:t,needle:n?Ge(n):null,formattedArgs:r};if(Xt.includes(s)||Xt.push(s),Xt.length>1)return;let a=Ue("[event-override]");const{mark:c,end:u}=We("event-override"),f=Bt.getOwnPropertyDescriptor(window.EventTarget.prototype,"addEventListener");f.configurable&&Bt.defineProperty(window.EventTarget.prototype,"addEventListener",{...f,value:l(Vt,(function(e,t,n){c();const r=Xt.filter((t=>t.eventType===e));if(!r.length||e!==r[0].eventType)return u(),o(Vt,this,arguments);const s=r.find((e=>"disable"===e.mode&&(!e.needle||e.needle.test(t.toString()))));if(s)return a("success",`Disabling ${s.eventType} event, \nFILTER: event-override ${s.formattedArgs}`),void u();const l=r.filter((e=>"trusted"===e.mode&&(!e.needle||e.needle.test(t.toString()))));if("function"!=typeof t&&(!t||"function"!=typeof t.handleEvent)||!l.length||e!==l[0].eventType)return u(),o(Vt,this,arguments);const f=function(e){const n=new Proxy(e,{get(t,n){if("isTrusted"===n)return a("success",`Providing trusted value for ${e.type} event`),!0;const r=Ut.get(t,n);return"function"==typeof r?function(...e){return o(r,t,e)}:r}});return"function"==typeof t?i(t,this,n):i(t.handleEvent,t,n)};return f.originalListener=t,Gt.has(t)||Gt.set(t,new zt),Gt.get(t).set(e,f),a("info",`\nWrapping event listener for ${e}`),u(),o(Vt,this,[e,f,n])}))});const p=Bt.getOwnPropertyDescriptor(window.EventTarget.prototype,"removeEventListener");p.configurable&&Bt.defineProperty(window.EventTarget.prototype,"removeEventListener",{...p,value:l(Jt,(function(e,t,n){if(t&&Gt.has(t)&&Gt.get(t).has(e)){const r=Gt.get(t).get(e);return Gt.get(t).delete(e),o(Jt,this,[e,r,n])}return o(Jt,this,arguments)}))}),a("info","Initialized event-override snippet")},"freeze-element":function(e,t="",...n){let r,s,a=!1,c=!1,l=Re(n).filter((e=>!h(e))),u=Re(n).filter((e=>h(e))).map(Ge),f=Xe(),p=vn(e);!function(){let n=Re(t).split("+");1===n.length&&""===n[0]&&(n=[]);for(let t of n)switch(t){case"subtree":a=!0;break;case"abort":c=!0;break;default:throw new Mn("[freeze] Unknown option passed to the snippet. [selector]: "+e+" [option]: "+t)}}();let d={selector:e,shouldAbort:c,rid:f,exceptionSelectors:l,regexExceptions:u,changeId:0};function h(e){return e.length>=2&&"/"==e[0]&&"/"==e[e.length-1]}function g(){s=p(),y(s,!1)}function y(e,t=!0){for(let n of e)jn.frozen.has(n)||(jn.frozen.set(n,d),!t&&a&&new Rn((e=>{for(let t of Re(e))y(Re(t,"MutationRecord").addedNodes)})).observe(n,{childList:!0,subtree:!0}),a&&Re(n).nodeType===bn&&y(Re(n).childNodes))}function w(e,...t){Be(`[freeze][${e}] `,...t)}function m(e,t,n,r){let o=r.selector,s=r.changeId,i="string"==typeof e,a=r.shouldAbort?"aborting":"watching";switch(xn.groupCollapsed(`[freeze][${s}] ${a}: ${o}`),n){case"appendChild":case"append":case"prepend":case"insertBefore":case"replaceChild":case"insertAdjacentElement":case"insertAdjacentHTML":case"insertAdjacentText":case"innerHTML":case"outerHTML":w(s,i?"text: ":"node: ",e),w(s,"added to node: ",t);break;case"replaceWith":case"after":case"before":w(s,i?"text: ":"node: ",e),w(s,"added to node: ",Re(t).parentNode);break;case"textContent":case"innerText":case"nodeValue":w(s,"content of node: ",t),w(s,"changed to: ",e)}w(s,`using the function "${n}"`),xn.groupEnd(),r.changeId++}function v(e,t){if(t)for(let n of t)if(n.test(e))return!0;return!1}function b(e){throw new Pn(e)}function E(e,t,n,r){let o=new kn,{body:s}=Re(o.parseFromString(e,"text/html")),i=$(Re(s).childNodes,t,n,r);return Re(i).map((e=>{switch(Re(e).nodeType){case bn:return Re(e).outerHTML;case En:return Re(e).textContent;default:return""}})).join("")}function $(e,t,n,r){let o=Re([]);for(let s of e)S(s,t,n,r)&&o.push(s);return o}function S(e,t,n,r){let o=r.shouldAbort,s=r.regexExceptions,i=r.exceptionSelectors,a=r.rid;if("string"==typeof e){let i=e;return!!v(i,s)||(De()&&m(i,t,n,r),o&&b(a),De())}let c=e;switch(Re(c).nodeType){case bn:return!!function(e,t){if(t){let n=Re(e);for(let e of t)if(n.matches(e))return!0}return!1}(c,i)||(o&&(De()&&m(c,t,n,r),b(a)),!!De()&&(mn(c),m(c,t,n,r),!0));case En:return!!v(Re(c).textContent,s)||(De()&&m(c,t,n,r),o&&b(a),!1);default:return!0}}function T(e,t,n,r){let s=An(e,t)||{},a=s.get&&i(s.get,e)||s.value;if(a)return{get:()=>function(...e){if(n(this)){let n=r(this);if(n){let r=e[0];if(!S(r,this,t,n))return r}}return o(a,this,e)}}}function x(e,t,n,r){let s=An(e,t)||{},a=s.get&&i(s.get,e)||s.value;if(a)return{get:()=>function(...e){if(!n(this))return o(a,this,e);let s=r(this);if(!s)return o(a,this,e);let i=$(e,this,t,s);return i.length>0?o(a,this,i):void 0}}}function j(e,t,n,r){let s=An(e,t)||{},a=s.get&&i(s.get,e)||s.value;if(a)return{get:()=>function(...e){let[s,c]=e,l="afterbegin"===s||"beforeend"===s;if(n(this,l)){let e=r(this,l);if(e){let n,r=l?this:Re(this).parentNode;switch(t){case"insertAdjacentElement":if(!S(c,r,t,e))return c;break;case"insertAdjacentHTML":return n=E(c,r,t,e),n?i(a,this,s,n):void 0;case"insertAdjacentText":if(!S(c,r,t,e))return}}}return o(a,this,e)}}}function k(e,t,n,r){let o=An(e,t)||{},{set:s}=o;if(s)return{set(e){if(!n(this))return i(s,this,e);let o=r(this);if(!o)return i(s,this,e);let a=E(e,this,t,o);return a?i(s,this,a):void 0}}}function M(e,t,n,r){let o=An(e,t)||{},{set:s}=o;if(s)return{set(e){if(!n(this))return i(s,this,e);let o=r(this);return o?S(e,this,t,o)?i(s,this,e):void 0:i(s,this,e)}}}jn.frozen.has(document)||(jn.frozen.set(document,!0),function(){let e;function t(e){return e&&jn.frozen.has(e)}function n(e){try{return e&&(jn.frozen.has(e)||jn.frozen.has(Re(e).parentNode))}catch(e){return!1}}function r(e,t){try{return e&&(jn.frozen.has(e)&&t||jn.frozen.has(Re(e).parentNode)&&!t)}catch(e){return!1}}function o(e){return jn.frozen.get(e)}function s(e){try{if(jn.frozen.has(e))return jn.frozen.get(e);let t=Re(e).parentNode;return jn.frozen.get(t)}catch(e){}}function i(e,t){try{if(jn.frozen.has(e)&&t)return jn.frozen.get(e);let n=Re(e).parentNode;return jn.frozen.get(n)}catch(e){}}e=T($n,"appendChild",t,o),pt($n,"appendChild",e),e=T($n,"insertBefore",t,o),pt($n,"insertBefore",e),e=T($n,"replaceChild",t,o),pt($n,"replaceChild",e),e=x(Sn,"append",t,o),pt(Sn,"append",e),e=x(Sn,"prepend",t,o),pt(Sn,"prepend",e),e=x(Sn,"replaceWith",n,s),pt(Sn,"replaceWith",e),e=x(Sn,"after",n,s),pt(Sn,"after",e),e=x(Sn,"before",n,s),pt(Sn,"before",e),e=j(Sn,"insertAdjacentElement",r,i),pt(Sn,"insertAdjacentElement",e),e=j(Sn,"insertAdjacentHTML",r,i),pt(Sn,"insertAdjacentHTML",e),e=j(Sn,"insertAdjacentText",r,i),pt(Sn,"insertAdjacentText",e),e=k(Sn,"innerHTML",t,o),pt(Sn,"innerHTML",e),e=k(Sn,"outerHTML",n,s),pt(Sn,"outerHTML",e),e=M($n,"textContent",t,o),pt($n,"textContent",e),e=M(Tn,"innerText",t,o),pt(Tn,"innerText",e),e=M($n,"nodeValue",t,o),pt($n,"nodeValue",e)}()),r=new Rn(g),r.observe(document,{childList:!0,subtree:!0}),g()},"hide-if-canvas-contains":function(e,t="canvas"){const n=Ue("hide-if-canvas-contains"),r=_e(arguments),{mark:s,end:i}=We("hide-if-canvas-contains");if(!e)return void n("error","The parameter 'search' is required");if(!Hn){s();const c=On.prototype;function u(e){const t=c[e];Wn.defineProperty(window.CanvasRenderingContext2D.prototype,e,{value:l(t,(function(r,...s){for(const[t,o]of Hn)if(t.test(r)){const t=this.canvas;let s=Re(t).closest(o.selector);s&&!Bn.has(s)?(mn(s),Bn.add(s),n("success","Matched: ",s,`\nFILTER: hide-if-canvas-contains ${o.formattedArguments}`)):Un(t,o,e,r)}return o(t,this,[r,...s])}))})}n("info","CanvasRenderingContext2D proxied"),u("fillText"),u("strokeText"),Hn=new Cn;new In((e=>{for(let t of Re(e))"childList"===t.type&&zn.forEach((({canvasElement:e,rule:t,functionName:n,text:r})=>{let o=Re(e).closest(t.selector);o&&!Bn.has(o)&&(mn(o),Bn.add(o),zn.delete({canvasElement:e,rule:t,functionName:n,text:r}),Ue("hide-if-canvas-contains")("success","Matched: ",o,`\nFILTER: hide-if-canvas-contains ${t.formattedArguments}`))}))})).observe(Nn,{childList:!0,subtree:!0}),i()}const a=Ge(e);Hn.set(a,{selector:t,formattedArguments:r})},"hide-if-shadow-contains":function(e,t="*"){const n=_e(arguments);let r=`${e}\\${t}`;Zn.has(r)||Zn.set(r,[Ge(e),t,ze],n);const s=Ue("hide-if-shadow-contains"),{mark:i,end:a}=We("hide-if-shadow-contains");Qn||(Qn=new Vn((e=>{i();let t=new Gn;for(let{target:r}of Re(e)){let e=Re(r).parentNode;for(;e;)[r,e]=[e,Re(r).parentNode];if(!Yn.has(r)&&!t.has(r)){t.add(r);for(let[e,t,o]of Zn.values())if(e.test(Re(r).textContent)){let e=Re(r.host).closest(t);e&&(o(),Re(r).appendChild(document.createElement("style")).textContent=":host {display: none !important}",mn(e),Yn.add(r),s("success","Hiding: ",e,`\nFILTER: hide-if-shadow-contains ${n}`)),a()}}}})),Jn.defineProperty(_n,"attachShadow",{value:l(Kn,(function(){let e=o(Kn,this,arguments);return s("info","attachShadow is called for: ",e),Qn.observe(e,{childList:!0,characterData:!0,subtree:!0}),e}))}))},"json-override":function(e,t,n="",r=""){if(!e)throw new tr("[json-override snippet]: Missing paths to override.");if(void 0===t)throw new tr("[json-override snippet]: No value to override with.");if(!ir){let i=Ue("json-override");const{mark:a,end:c}=We("json-override");function u(e,t){for(let{formattedArgs:n,prune:r,needle:o,filter:s,value:i}of ir.values())if(!s||s.test(t)){if(Re(o).some((t=>!mt(e,t))))return e;for(let t of r)t.includes("{}")||t.includes("[]")?f(e,t,i,n):p(e,t,i,n)}return e}function f(e,t,n,r){let o=Re(t).split("."),s=e;for(let e=0;e<o.length;e++){let a=o[e];if("[]"===a)return void(er.isArray(s)&&(i("info",`Iterating over array at: ${a}`),Re(s).forEach((t=>{null!=t&&f(t,o.slice(e+1).join("."),n,r)}))));if("{}"===a)return void(s&&"object"==typeof s&&(i("info",`Iterating over object at: ${a}`),or.keys(s).forEach((t=>{let i=s[t];null!=i&&f(i,o.slice(e+1).join("."),n,r)}))));if(!s||"object"!=typeof s||!m(s,a))return;e===o.length-1?(i("success",`Found ${t}, replaced it with ${n}`,`\nFILTER: json-override ${r}`),s[a]=bt(n)):s=s[a]}}function p(e,t,n,r){let o=mt(e,t);void 0!==o&&(i("success",`Found ${t}, replaced it with ${n}`,`\nFILTER: json-override ${r}`),o[0][o[1]]=bt(n))}a();let{parse:d}=nr;ir=new rr,or.defineProperty(window.JSON,"parse",{value:l(d,(function(e){return u(o(d,this,arguments),e)}))}),i("info","Wrapped JSON.parse for override");let{json:h}=sr.prototype;or.defineProperty(window.Response.prototype,"json",{value:l(h,(function(e){return o(h,this,arguments).then((t=>u(t,e)))}))}),i("info","Wrapped Response.json for override"),c()}const s=_e(arguments);ir.set(e,{formattedArgs:s,prune:Re(e).split(/ +/),needle:n.length?Re(n).split(/ +/):[],filter:r?Ge(r):null,value:t})},"json-prune":function(e,t="",n=""){if(!e)throw new cr("Missing paths to prune");if(!dr){let s=Ue("json-prune");const{mark:i,end:a}=We("json-prune");function c(e){for(let{prune:t,needle:n,stackNeedle:r,formattedArgs:o}of dr.values()){if(Re(n).length>0&&Re(n).some((t=>!mt(e,t))))return e;if(Re(r)&&Re(r).length>0&&!Et(r,s))return e;for(let n of t)n.includes("{}")||n.includes("[]")||n.includes("{-}")||n.includes("[-]")?u(e,n,o):p(e,n,o)}return e}function u(e,t,n){let r=Re(t).split("."),o=e;for(let e=0;e<r.length;e++){let i=r[e];if("[]"===i)return void(ar.isArray(o)&&(s("info",`Iterating over array at: ${i}`),Re(o).forEach((t=>u(t,r.slice(e+1).join("."),n)))));if("[-]"===i){if(ar.isArray(o)){s("info",`Iterating over array with element removal at: ${i}`);let t=r.slice(e+1).join("."),a=[];Re(o).forEach(((e,n)=>{f(e,t)&&a.push(n)}));for(let e=a.length-1;e>=0;e--)s("success",`Found element at index ${a[e]} matching ${t} and removed entire element, \nFILTER: json-prune ${n}`),o.splice(a[e],1)}return}if("{}"===i)return void("object"==typeof o&&null!==o&&(s("info",`Iterating over object at: ${i}`),fr.keys(o).forEach((t=>u(o[t],r.slice(e+1).join("."),n)))));if("{-}"===i){if("object"==typeof o&&null!==o){s("info",`Iterating over object with element removal at: ${i}`);let t=r.slice(e+1).join("."),a=[];fr.keys(o).forEach((e=>{f(o[e],t)&&a.push(e)})),a.forEach((e=>{s("success",`Found object key ${e} matching ${t} and removed entire element, \nFILTER: json-prune ${n}`),delete o[e]}))}return}if(!o||"object"!=typeof o||!m(o,i))return;e===r.length-1?(s("success",`Found ${t} and deleted, \nFILTER: json-prune ${n}`),delete o[i]):o=o[i]}}function f(e,t){if(!t||""===t)return!0;let n=Re(t).split("."),r=e;for(let e=0;e<n.length;e++){let t=n[e];if("[]"===t)return!!ar.isArray(r)&&Re(r).some((t=>f(t,n.slice(e+1).join("."))));if("{}"===t)return"object"==typeof r&&null!==r&&fr.keys(r).some((t=>f(r[t],n.slice(e+1).join("."))));if(!r||"object"!=typeof r||!m(r,t))return!1;if(e===n.length-1)return!0;r=r[t]}return!1}function p(e,t,n){let r=mt(e,t);void 0!==r&&(s("success",`Found ${t} and deleted`,`\nFILTER: json-prune ${n}`),delete r[0][r[1]])}i();let{parse:d}=lr;dr=new ur,fr.defineProperty(window.JSON,"parse",{value:l(d,(function(){return c(o(d,this,arguments))}))}),s("info","Wrapped JSON.parse for prune");let{json:h}=pr.prototype;fr.defineProperty(window.Response.prototype,"json",{value:l(h,(function(){return o(h,this,arguments).then((e=>c(e)))}))}),s("info","Wrapped Response.json for prune"),a()}const r=_e(arguments);dr.set(e,{formattedArgs:r,prune:Re(e).split(/ +/),needle:t.length?Re(t).split(/ +/):[],stackNeedle:n.length?Re(n).split(/ +/):[]})},"map-override":function(e,t,n="",r,s){if(!e)throw new hr("[map-override snippet]: Missing method to override.");if(!t)throw new hr("[map-override snippet]: Missing needle.");wr||(wr=new yr);let a=Ue("map-override");const{mark:c,end:u}=We("map-override"),{set:f,get:p,has:d}=yr.prototype,h=_e(arguments);"set"!==e||wr.has("set")?"get"!==e||wr.has("get")?"has"!==e||wr.has("has")||(c(),i(f,wr,"has",Re([])),gr.defineProperty(window.Map.prototype,"has",{value:l(d,(function(e){const t=i(p,wr,"has");for(const{needleRegex:n,retVal:r,stackNeedles:o}of t)if("string"==typeof e||"number"==typeof e){const t=e.toString();if(n.test(t)&&Et(o,a))return a("success",`Map.has returned ${r} for key: ${t}\nFILTER: map-override ${h}`),r}return o(d,this,arguments)}))}),a("info","Wrapped Map.prototype.has"),u()):(c(),i(f,wr,"get",Re([])),gr.defineProperty(window.Map.prototype,"get",{value:l(p,(function(e){const t=i(p,wr,"get");for(const{needleRegex:n,retVal:r,stackNeedles:o}of t)if("string"==typeof e||"number"==typeof e){const t=e.toString();if(n.test(t)&&Et(o,a))return a("success",`Map.get returned ${r} for key: ${t}\nFILTER: map-override ${h}`),r}return o(p,this,arguments)}))}),a("info","Wrapped Map.prototype.get"),u()):(c(),i(f,wr,"set",Re([])),gr.defineProperty(window.Map.prototype,"set",{value:l(f,(function(e,t){const n=i(p,wr,"set");for(const{needleRegex:e,pathSegments:r,stackNeedles:o}of n)if(mr(t,e,r)&&Et(o,a))return a("success",`Map.set is ignored for value matching needle: ${e}\nFILTER: map-override ${h}`),this;return o(f,this,arguments)}))}),a("info","Wrapped Map.prototype.set"),u());const g=Ge(t);let y=[];r&&(y=r.split("."));let w=[];s&&(w=s.split(",").map((e=>e.trim())));const m=i(p,wr,e);let v;"get"===e?v=""===n?void 0:n:"has"===e&&(v="true"===n),m.push({needleRegex:g,retVal:v,pathSegments:y,stackNeedles:w}),i(f,wr,e,m)},"override-property-read":function(e,t,n){if(!e)throw new vr("[override-property-read snippet]: No property to override.");if(void 0===t)throw new vr("[override-property-read snippet]: No value to override with.");const r=_e(arguments);let o=Ue("override-property-read");const{mark:s,end:i}=We("override-property-read");let a=bt(t);o("info",`Overriding ${e}.`);const c=!("false"===n);s(),pt(window,e,{get:()=>(o("success",`${e} override done.`,"\nFILTER: override-property-read",r),a),set(){}},c),i()},"prevent-listener":function(e,t,n){if(!e)throw new br("[prevent-listener snippet]: No event type.");if(!kr){kr=new Er;let e=Ue("[prevent]");const{mark:t,end:n}=We("prevent-listener");$r.defineProperty(xr,"addEventListener",{value:l(jr,(function(r,s){t();for(let{evt:t,handlers:n,selectors:o}of kr.values()){if(!t.test(r))continue;let a=this instanceof Element;for(let l=0;l<n.length;l++){const u=n[l],f=o[l];if(!f||a&&Re(this).matches(f)){if(u){const t=function(){try{const e=String("function"==typeof s?s:s.handleEvent);return u.test(e)}catch(t){return e("error","Error while trying to stringify listener: ",t),!1}};if(!function(){try{const e=i(Tr,"function"==typeof s?s:s.handleEvent);return u.test(e)}catch(t){return e("error","Error while trying to stringify listener: ",t),!1}}()&&!t())continue}return void(De()&&(Sr.groupCollapsed("DEBUG [prevent] was successful",`\nFILTER: prevent-listener ${c}`),e("success",`type: ${r} matching ${t}`),e("success","handler:",s),u&&e("success",`matching ${u}`),f&&e("success","on element: ",this,` matching ${f}`),e("success","was prevented from being added"),Sr.groupEnd()))}}}return n(),o(jr,this,arguments)}))}),e("info","Wrapped addEventListener")}const r=_e(arguments);kr.has(e)||kr.set(e,{evt:Ge(e),handlers:[],selectors:[],formattedArgs:r});let{handlers:s,selectors:a,formattedArgs:c}=kr.get(e);s.push(t?Ge(t):null),a.push(n)},"replace-fetch-response":function(e,t="",n=null){const r=_e(arguments),o=Ue("replace-fetch-response"),{mark:s,end:i}=We("replace-fetch-response");if(!e)return void o("error","The parameter 'search' is required");if(!Or){const e=e=>{s();return Re(e).clone().text().then((t=>{let n=Re(t);for(const[e,{replacement:r,needle:s,formattedArgs:i}]of Or){if(s){if(!Ge(s).test(n)){De()&&(console.groupCollapsed(`DEBUG [replace-fetch-response] warn: '${s}' not found in fetch response`),o("warn",`${n}`),console.groupEnd());continue}De()&&(console.groupCollapsed(`DEBUG [replace-fetch-response] success: '${s}' found in fetch response`),o("info",`${n}`),console.groupEnd())}n=n.replace(e,r),De()&&n.toString()!==t.toString()&&(console.groupCollapsed(`DEBUG [replace-fetch-response] success: '${e}' replaced with '${r}' in fetch response`,`\nFILTER: replace-fetch-response ${i}`),o("success",`${n}`),console.groupEnd())}if(n.toString()===t.toString())return e;const r=new Wr(n.toString(),{status:e.status,statusText:e.statusText,headers:e.headers});return Cr.defineProperties(r,{ok:{value:e.ok},redirected:{value:e.redirected},type:{value:e.type},url:{value:e.url}}),i(),r}))};Or=new Nr,o("info","Network API proxied"),a=e,Pr.push(a),Ar()}var a;const c=Ge(e),l=new Ir(c,"g");Or.set(l,{replacement:t,needle:n,formattedArgs:r})},"replace-outbound-value":function(e,t="",n="",r="",s="",i=""){if(!e)throw new Fr("[replace-outbound-value snippet]: Missing method path.");let a=Ue("replace-outbound-value");const{mark:c,end:u}=We("replace-outbound-value");function f(e,t,n,r){if("base64"===r)try{if(function(e){try{if(""===e)return!1;const t=Hr(e),n=zr(t),r=Re(e).replace(/=+$/,"").toString();return Re(n).replace(/=+$/,"").toString()===r}catch(e){return!1}}(e)){const r=Hr(e);a("info",`Decoded base64 content: ${r}`);const o=t?Re(r).replace(t,n).toString():r;a("info",o!==r?`Modified decoded content: ${o}`:"Decoded content was not modified");const s=zr(o);return a("info",`Re-encoded to base64: ${s}`),s}a("info",`Content is plain text: ${e}`);const r=t?Re(e).replace(t,n).toString():e;a("info",r!==e?`Modified plain text content: ${r}`:"Plain text content was not modified");const o=zr(r);return a("info",`Encoded to base64: ${o}`),o}catch(t){return a("info",`Error processing base64 content: ${t.message}`),e}return t?Re(e).replace(t,n).toString():e}function p(e,t,n,r,o,s){const i=n?new Br(Ge(n),"g"):null;if(t.length&&"object"==typeof e&&null!==e){const c=n?function(e,t,n,r,o){if(!t.length)return e;let s=e;for(let n=0;n<t.length-1;n++){if(!s||"object"!=typeof s)return a("info",`Cannot navigate to path: property '${t[n]}' not found`),e;s=s[t[n]]}const i=t[t.length-1];if(!s||"object"!=typeof s||!(i in s))return a("info",`Target property '${i}' not found at path`),e;const c=s[i];if("string"!=typeof c)return a("info","Property at path is not a string: "+typeof c),e;const l=f(c,n,r,o);if(l!==c){const n=JSON.parse(JSON.stringify(e));let r=n;for(let e=0;e<t.length-1;e++)r=r[t[e]];return r[i]=l,a("info",`Replaced value at path '${t.join(".")}': '${c}' -> '${l}'`),n}return e}(e,t,i,r,o):e;return c!==e&&a("success",`Replaced outbound value\nFILTER: replace-outbound-value ${s}`),c}if("string"==typeof e){n||a("info",`Original text content: ${e}`);const t=n?f(e,i,r,o):e;return t!==e&&a("success",`Replaced outbound value: ${t} \nFILTER: replace-outbound-value ${s}`),t}return e}_e(arguments),c();const d=function(e,t){let n=e,r=Re(t).split(".");for(let e=0;e<r.length-1;e++){let t=r[e];if(!n||"object"!=typeof n&&"function"!=typeof n)return{base:n,prop:t,remainingPath:r.slice(e).join("."),success:!1};n=n[t]}return{base:n,prop:r[r.length-1],success:!0}}(window,e);if(!d.success)return a("error",`Could not reach the end of the prop chain: ${e}. Remaining path: ${d.remainingPath}`),void u();const{base:h,prop:g}=d,y=h[g];if(!y||"function"!=typeof y)return a("error",`Could not retrieve the method: ${e}`),void u();let w=[];s&&(w=Re(s).split("."));let m=[];i&&(m=Re(i).split(",").map((e=>e.trim())));let v=!1;Dr.defineProperty(h,g,{value:l(y,(function(){if(v)return o(y,this,arguments);v=!0;const e=o(y,this,arguments);if(m.length&&!Et(m,a))return v=!1,e;if(e&&"function"==typeof e.then)return a("info","Method returned a Promise, modifying resolved value"),v=!1,e.then((e=>{const o="object"==typeof e?JSON.stringify(e):e;return a("info",`Promise resolved with value: ${o}`),p(e,w,t,n,r,s)})).catch((e=>{throw a("info",`Promise rejected: ${e.message}`),e}));const i=p(e,w,t,n,r,s);return v=!1,i}))}),a("info",`Wrapped ${e}`),u()},"replace-xhr-response":function(e,t="",n=null){const r=_e(arguments),o=Ue("replace-xhr-response"),{mark:s,end:i}=We("replace-xhr-response");if(!e)return void o("error","The parameter 'pattern' is required");Ur||(Ur=new Gr,qr=new Map,o("info","XMLHttpRequest proxied"),window.XMLHttpRequest=class extends Jr{open(e,t,...n){const r={method:e,url:t};return Ur.set(this,r),super.open(e,t,...n)}send(...e){return super.send(...e)}get response(){const e=super.response,t=Ur.get(this);if(void 0===t)return e;s();const n="string"==typeof e?e.length:void 0;if(t.lastResponseLength!==n&&(t.response=void 0,t.lastResponseLength=n),void 0!==t.response)return t.response;if("string"!=typeof e)return t.response=e;let r=e;for(const[t,{replacement:n,needle:s,formattedArgs:i}]of qr){if(s){if(!Ge(s).test(r)){De()&&(console.groupCollapsed(`DEBUG [replace-xhr-response] warn: '${s}' not found in XHR response`),o("warn",r),console.groupEnd());continue}De()&&(console.groupCollapsed(`DEBUG [replace-xhr-response] success: '${s}' found in XHR response`),o("info",r),console.groupEnd())}r=Re(r).replace(t,n).toString(),De()&&e.toString()!==r.toString()&&(console.groupCollapsed(`DEBUG [replace-xhr-response] success: '${t}' replaced with '${n}' in XHR response`,`\nFILTER: replace-xhr-response ${i}`),o("success",r),console.groupEnd())}return i(),t.response=r.toString()}get responseText(){const e=this.response;return"string"!=typeof e?super.responseText:e}});const a=Ge(e),c=new Vr(a,"g");qr.set(c,{replacement:t,needle:n,formattedArgs:r})},"strip-fetch-query-parameter":function(e,t=null){const n=_e(arguments),r=Ue("strip-fetch-query-parameter"),{mark:o,end:s}=We("strip-fetch-query-parameter"),i=e=>{o();for(let[t,n]of Xr.entries()){const{reg:o,args:s}=n;o&&!o.test(e)||Kr(e.searchParams,t)&&(r("success",`${t} has been stripped from url ${e}`,`\nFILTER: strip-fetch-query-parameter ${s}`),_r(e.searchParams,t))}s()};var a;Xr||(Xr=new Map,a=i,Lr.push(a),Ar()),Xr.set(e,{reg:t&&Ge(t),args:n})},trace:function(...e){o(Be,null,e)}};
const snippets=Yr;
let context;
for (const [name, ...args] of filters) {
if (snippets.hasOwnProperty(name)) {
try { context = snippets[name].apply(context, args); }
catch (error) { console.error(error); }
}
}
context = void 0;
};
const graph = new Map([["abort-current-inline-script",null],["abort-on-iframe-property-read",null],["abort-on-iframe-property-write",null],["abort-on-property-read",null],["abort-on-property-write",null],["array-override",null],["blob-override",null],["cookie-remover",null],["profile",null],["debug",null],["event-override",null],["freeze-element",null],["hide-if-canvas-contains",null],["hide-if-shadow-contains",null],["json-override",null],["json-prune",null],["map-override",null],["override-property-read",null],["prevent-listener",null],["replace-fetch-response",null],["replace-outbound-value",null],["replace-xhr-response",null],["strip-fetch-query-parameter",null],["trace",null]]);
callback.get = snippet => graph.get(snippet);
callback.has = snippet => graph.has(snippet);
callback.getGraph = () => graph;
callback.setEnvironment = env => {
  if (typeof currentEnvironment !== "undefined")
    currentEnvironment = env;
};
callback.setDebugStyle = styles => {
  if (typeof currentEnvironment !== "undefined")
  {
    delete currentEnvironment.initial;
    currentEnvironment.debugCSSProperties = styles;
  }
    
};
callback.getEnvironment = () => currentEnvironment;
/* harmony default export */ const main = (callback);
;// ./src/content/shared/constants.js
/*
 * This file is part of eyeo's Web Extension Ad Blocking Toolkit (EWE),
 * Copyright (C) 2006-present eyeo GmbH
 *
 * EWE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * EWE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EWE.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Event used to communicate between content script contexts
 * @type {string}
 */
const HANDSHAKE_EVENT_NAME = "handshake";

/**
 * Storage key used to caching the filters config in content scripts
 * @type {string}
 */
const CACHED_FILTERS_CONFIG_KEY = "ewe-filters-config";

/**
 * CSS properties applied to elements hidden in debug mode
 * @type {string[][]}
 */
const DEBUG_CSS_PROPERTIES = [
  ["background", "repeating-linear-gradient(to bottom, #e67370 0, #e67370 9px, white 9px, white 10px)"],
  ["outline", "solid red"]
];

;// ./src/content/main/shims/storage.js
/*
 * This file is part of eyeo's Web Extension Ad Blocking Toolkit (EWE),
 * Copyright (C) 2006-present eyeo GmbH
 *
 * EWE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * EWE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EWE.  If not, see <http://www.gnu.org/licenses/>.
 */

function shimLocalStorage(CACHED_FILTERS_CONFIG_KEY) {
  // =================== Secured copies of native functions ====================
  // These are captured before page scripts run.
  // Used inside Proxy apply handlers which run after page scripts.
  const {parse: $JSONparse, stringify: $JSONstringify} = JSON;
  const {keys: $ObjectKeys} = Object;
  const {
    apply: $ReflectApply,
    ownKeys: $ReflectOwnKeys,
    get: $ReflectGet,
    set: $ReflectSet,
    has: $ReflectHas,
    getOwnPropertyDescriptor: $ReflectGetOwnPropertyDescriptor,
    defineProperty: $ReflectDefineProperty,
    deleteProperty: $ReflectDeleteProperty
  } = Reflect;
  const {filter: $ArrayFilter} = Array.prototype;
  const {get: $MapGet, set: $MapSet, has: $MapHas} = Map.prototype;
  const $String = String;

  // Helpers using secured copies
  const filter = (arr, fn) => $ReflectApply($ArrayFilter, arr, [fn]);
  const mapGet = (map, key) => $ReflectApply($MapGet, map, [key]);
  const mapSet = (map, key, val) => $ReflectApply($MapSet, map, [key, val]);
  const mapHas = (map, key) => $ReflectApply($MapHas, map, [key]);

  const originalToStrings = new Map();

  const storageGetItemDesc = Object.getOwnPropertyDescriptor(
    Storage.prototype, "getItem"
  );
  const originalStorageGetItem = storageGetItemDesc.value;

  // =================== Conditional application of the shim ===================
  function shouldShimLocalStorage() {
    const config = getConfig(window.localStorage);
    return Boolean(config);
  }

  if (!shouldShimLocalStorage()) {
    return;
  }

  // ===================== Storage.prototype.getItem ======================
  // @docs https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
  function getConfig(storage) {
    try {
      const configSerialized = $ReflectApply(
        originalStorageGetItem, storage, [CACHED_FILTERS_CONFIG_KEY]
      );
      if (configSerialized) {
        return $JSONparse(configSerialized);
      }
    }
    catch (e) {
      // If we can't parse, return null
    }
    return null;
  }

  function websiteHasValue(config) {
    return config && typeof config.websiteValue === "string";
  }
  const storageGetItemProxy = new Proxy(originalStorageGetItem, {
    apply(target, thisArg, argumentsList) {
      const key = argumentsList[0];
      if (key === CACHED_FILTERS_CONFIG_KEY) {
        const config = getConfig(thisArg);
        if (websiteHasValue(config)) {
          return config.websiteValue;
        }
        return null;
      }
      return $ReflectApply(target, thisArg, argumentsList);
    }
  });
  Object.defineProperty(Storage.prototype, "getItem", {
    ...storageGetItemDesc,
    value: storageGetItemProxy
  });
  mapSet(
    originalToStrings,
    storageGetItemProxy,
    originalStorageGetItem.toString.bind(originalStorageGetItem)
  );

  // ===================== Storage.prototype.setItem ===========================
  // @docs https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
  const storageSetItemDesc = Object.getOwnPropertyDescriptor(
    Storage.prototype, "setItem"
  );
  const originalStorageSetItem = storageSetItemDesc.value;
  const storageSetItemProxy = new Proxy(originalStorageSetItem, {
    apply(target, thisArg, argumentsList) {
      const key = argumentsList[0];
      if (key === CACHED_FILTERS_CONFIG_KEY) {
        const config = getConfig(thisArg) || {};
        config.websiteValue = $String(argumentsList[1]);
        $ReflectApply(
          target,
          thisArg,
          [CACHED_FILTERS_CONFIG_KEY, $JSONstringify(config)]
        );
        return void 0;
      }
      return $ReflectApply(target, thisArg, argumentsList);
    }
  });
  Object.defineProperty(Storage.prototype, "setItem", {
    ...storageSetItemDesc,
    value: storageSetItemProxy
  });
  mapSet(
    originalToStrings,
    storageSetItemProxy,
    originalStorageSetItem.toString.bind(originalStorageSetItem)
  );

  // ================== Storage.prototype.removeItem ==========================
  // @docs https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem
  const storageRemoveItemDesc = Object.getOwnPropertyDescriptor(
    Storage.prototype, "removeItem"
  );
  const originalStorageRemoveItem = storageRemoveItemDesc.value;
  const storageRemoveItemProxy = new Proxy(originalStorageRemoveItem, {
    apply(target, thisArg, argumentsList) {
      const key = argumentsList[0];
      if (key === CACHED_FILTERS_CONFIG_KEY) {
        const config = getConfig(thisArg);
        if (websiteHasValue(config)) {
          delete config.websiteValue;
          $ReflectApply(
            originalStorageSetItem,
            thisArg, [CACHED_FILTERS_CONFIG_KEY, $JSONstringify(config)]
          );
        }
        return void 0;
      }
      return $ReflectApply(target, thisArg, argumentsList);
    }
  });
  Object.defineProperty(Storage.prototype, "removeItem", {
    ...storageRemoveItemDesc,
    value: storageRemoveItemProxy
  });
  mapSet(
    originalToStrings,
    storageRemoveItemProxy,
    originalStorageRemoveItem.toString.bind(originalStorageRemoveItem)
  );

  // ==================== Storage.prototype.clear ============================
  // @docs https://developer.mozilla.org/en-US/docs/Web/API/Storage/clear
  const storageClearDesc = Object.getOwnPropertyDescriptor(
    Storage.prototype, "clear"
  );
  const originalStorageClear = storageClearDesc.value;
  const storageClearProxy = new Proxy(originalStorageClear, {
    apply(target, thisArg, argumentsList) {
      const config = getConfig(thisArg);
      if (config) {
        delete config.websiteValue;
      }

      $ReflectApply(target, thisArg, argumentsList);

      // Restore our config (without websiteValue)
      if (config && $ObjectKeys(config).length > 0) {
        $ReflectApply(
          originalStorageSetItem,
          thisArg, [CACHED_FILTERS_CONFIG_KEY, $JSONstringify(config)]
        );
      }
      return void 0;
    }
  });
  Object.defineProperty(Storage.prototype, "clear", {
    ...storageClearDesc,
    value: storageClearProxy
  });
  mapSet(
    originalToStrings,
    storageClearProxy,
    originalStorageClear.toString.bind(originalStorageClear)
  );

  // ===================== Storage.prototype.key ===============================
  // @docs https://developer.mozilla.org/en-US/docs/Web/API/Storage/key
  const storageKeyDesc = Object.getOwnPropertyDescriptor(
    Storage.prototype, "key"
  );
  const originalStorageKey = storageKeyDesc.value;
  const storageKeyProxy = new Proxy(originalStorageKey, {
    apply(target, thisArg, argumentsList) {
      const config = getConfig(thisArg);
      if (!config || websiteHasValue(config)) {
        return $ReflectApply(target, thisArg, argumentsList);
      }

      const requestedIndex = argumentsList[0];
      for (let i = 0; i <= requestedIndex; i++) {
        const key = $ReflectApply(target, thisArg, [i]);
        if (key === CACHED_FILTERS_CONFIG_KEY) {
          return $ReflectApply(target, thisArg, [requestedIndex + 1]);
        }
      }
      return $ReflectApply(target, thisArg, argumentsList);
    }
  });
  Object.defineProperty(Storage.prototype, "key", {
    ...storageKeyDesc,
    value: storageKeyProxy
  });
  mapSet(
    originalToStrings,
    storageKeyProxy,
    originalStorageKey.toString.bind(originalStorageKey)
  );

  // =================== Storage.prototype.length ============================
  // @docs https://developer.mozilla.org/en-US/docs/Web/API/Storage/length
  const storageLengthDesc = Object.getOwnPropertyDescriptor(
    Storage.prototype, "length"
  );
  const originalStorageLengthGetter = storageLengthDesc.get;
  Object.defineProperty(Storage.prototype, "length", {
    ...storageLengthDesc,
    get() {
      const originalLength =
        $ReflectApply(originalStorageLengthGetter, this, []);
      const config = getConfig(this);
      if (config && !websiteHasValue(config)) {
        return originalLength - 1;
      }
      return originalLength;
    }
  });

  // ================== Proxy wrapper for localStorage ===========
  // Handles: {...localStorage}, Object.keys(), Object.values(), for...in, etc.
  const methodProxyCache = new Map();

  function getMethodProxy(storage, method) {
    if (mapHas(methodProxyCache, method)) {
      return mapGet(methodProxyCache, method);
    }
    const methodProxy = new Proxy(method, {
      apply(fn, _, args) {
        return $ReflectApply(fn, storage, args);
      }
    });
    mapSet(methodProxyCache, method, methodProxy);
    // Register toString for the wrapper to preserve function name
    const originalMethod = mapGet(originalToStrings, method);
    if (originalMethod) {
      mapSet(originalToStrings, methodProxy, originalMethod);
    }
    return methodProxy;
  }

  const storageInstanceProxyConfig = {
    ownKeys(target) {
      const keys = $ReflectOwnKeys(target);
      const config = getConfig(target);
      if (config && !websiteHasValue(config)) {
        return filter(keys, key => key !== CACHED_FILTERS_CONFIG_KEY);
      }
      return keys;
    },

    // Required for spread operator
    getOwnPropertyDescriptor(target, prop) {
      if (prop === CACHED_FILTERS_CONFIG_KEY) {
        const config = getConfig(target);
        if (config && !websiteHasValue(config)) {
          return void 0; // Hide the property entirely
        }
        // When website has set a value, return a proper enumerable descriptor
        // with the website's value (not our internal config)
        if (websiteHasValue(config)) {
          return {
            value: config.websiteValue,
            writable: true,
            enumerable: true,
            configurable: true
          };
        }
      }
      return $ReflectGetOwnPropertyDescriptor(target, prop);
    },

    // Needed for 'in' operator
    has(target, prop) {
      if (prop === CACHED_FILTERS_CONFIG_KEY) {
        const config = getConfig(target);
        if (config && !websiteHasValue(config)) {
          return false;
        }
      }
      return $ReflectHas(target, prop);
    },

    // Forward get/set using original target so native methods work correctly
    get(target, prop) {
      if (prop === CACHED_FILTERS_CONFIG_KEY) {
        return target.getItem(CACHED_FILTERS_CONFIG_KEY);
      }
      // Return correct toStringTag so Object.prototype.toString returns
      // [object Storage] instead of [object Object] (for older Firefox)
      if (prop === Symbol.toStringTag) {
        return "Storage";
      }
      const value = $ReflectGet(target, prop, target);
      // For methods, wrap in a proxy to bind `this` to original target
      // while preserving toString behavior
      if (typeof value === "function") {
        return getMethodProxy(target, value);
      }
      return value;
    },

    set(target, prop, value) {
      if (prop === CACHED_FILTERS_CONFIG_KEY) {
        target.setItem(CACHED_FILTERS_CONFIG_KEY, value);
        return true;
      }
      return $ReflectSet(target, prop, value, target);
    },

    defineProperty(target, prop, descriptor) {
      if (prop === CACHED_FILTERS_CONFIG_KEY) {
        if ("value" in descriptor) {
          target.setItem(CACHED_FILTERS_CONFIG_KEY, descriptor.value);
        }
        return true;
      }
      return $ReflectDefineProperty(target, prop, descriptor);
    },

    deleteProperty(target, prop) {
      if (prop === CACHED_FILTERS_CONFIG_KEY) {
        target.removeItem(CACHED_FILTERS_CONFIG_KEY);
        return true;
      }
      return $ReflectDeleteProperty(target, prop);
    }
  };

  const localStorageProxy = new Proxy(
    window.localStorage,
    storageInstanceProxyConfig
  );

  Object.defineProperty(window, "localStorage", {
    value: localStorageProxy,
    writable: false,
    configurable: true,
    enumerable: true
  });

  const sessionStorageProxy = new Proxy(
    window.sessionStorage,
    storageInstanceProxyConfig
  );

  Object.defineProperty(window, "sessionStorage", {
    value: sessionStorageProxy,
    writable: false,
    configurable: true,
    enumerable: true
  });

  // ===================== Function.prototype.toString =========================
  // @docs https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toString
  const functionToStringDesc = Object.getOwnPropertyDescriptor(
    Function.prototype, "toString"
  );
  const originalFunctionToString = functionToStringDesc.value;
  const functionToStringProxy = new Proxy(originalFunctionToString, {
    apply(target, thisArg, argumentsList) {
      // Call "super" first, just in case the function was overwritten and had
      // checks if it was called
      const r = $ReflectApply(target, thisArg, argumentsList);

      const restoredToString = mapGet(originalToStrings, thisArg);
      if (restoredToString) {
        return $ReflectApply(restoredToString, thisArg, argumentsList);
      }

      return r;
    }
  });
  Object.defineProperty(Function.prototype, "toString", {
    ...functionToStringDesc,
    value: functionToStringProxy
  });
  mapSet(
    originalToStrings,
    functionToStringProxy,
    originalFunctionToString.toString.bind(originalFunctionToString)
  );
}

;// ./src/content/shared/helpers.js
/*
 * This file is part of eyeo's Web Extension Ad Blocking Toolkit (EWE),
 * Copyright (C) 2006-present eyeo GmbH
 *
 * EWE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * EWE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EWE.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Claims a communication channel name from the document's dataset.
 *
 * If a channel name already exists in the dataset, it is consumed (removed
 * from the dataset and returned). If no channel name exists, the fallback
 * channel is stored in the dataset and returned.
 *
 * This mechanism ensures that only one content script can claim the
 * channel name at a time, preventing conflicts when the main world
 * and isolated world scripts execution order is not consistent.
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/139#changes_for_add-on_developers
 * @see https://bugzil.la/1792685
 *
 * @param {string} fallbackChannel - The channel name to use and store if
 *   none is present.
 * @returns {string} The claimed channel name (either the existing one
 *   or the fallback).
 */
function claimCommsChannel(fallbackChannel) {
  let channelName = document.documentElement.dataset.eweFiltersChannel;

  if (!channelName) {
    channelName = fallbackChannel;
    document.documentElement.dataset.eweFiltersChannel = channelName;
  }
  else {
    delete document.documentElement.dataset.eweFiltersChannel;
  }

  return channelName;
}

;// ./src/all/errors.js
/*
 * This file is part of eyeo's Web Extension Ad Blocking Toolkit (EWE),
 * Copyright (C) 2006-present eyeo GmbH
 *
 * EWE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * EWE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EWE.  If not, see <http://www.gnu.org/licenses/>.
 */

const ERROR_NO_CONNECTION = (/* unused pure expression or super */ null && ("Could not establish connection. " +
      "Receiving end does not exist."));
const ERROR_CLOSED_CONNECTION = (/* unused pure expression or super */ null && ("A listener indicated an asynchronous " +
      "response by returning true, but the message channel closed before a " +
      "response was received"));
// https://bugzilla.mozilla.org/show_bug.cgi?id=1578697
const ERROR_MANAGER_DISCONNECTED = "Message manager disconnected";

/**
 * Reconstructs an error from a serializable error object
 *
 * @param {Object} errorData - Error object
 *
 * @returns {Error} error
 */
function fromSerializableError(errorData) {
  const error = new Error(errorData.message);
  error.cause = errorData.cause;
  error.name = errorData.name;
  error.stack = errorData.stack;

  return error;
}

/**
 * Filters out `browser.runtime.sendMessage` errors to do with the receiving end
 * no longer existing.
 *
 * @param {Promise} promise The promise that should have "no connection" errors
 *   ignored. Generally this would be the promise returned by
 *   `browser.runtime.sendMessage`.
 * @return {Promise} The same promise, but will resolve with `undefined` instead
 *   of rejecting if the receiving end no longer exists.
 */
function ignoreNoConnectionError(promise) {
  return promise.catch(error => {
    if (typeof error == "object" &&
        (error.message == ERROR_NO_CONNECTION ||
         error.message == ERROR_CLOSED_CONNECTION ||
         error.message == ERROR_MANAGER_DISCONNECTED)) {
      return;
    }

    throw error;
  });
}

/**
 * Creates serializable error object from given error
 *
 * @param {Error} error - Error
 *
 * @returns {Object} serializable error object
 */
function toSerializableError(error) {
  return {
    cause: error.cause instanceof Error ?
      toSerializableError(error.cause) :
      error.cause,
    message: error.message,
    name: error.name,
    stack: error.stack
  };
}

;// ./src/content/main/snippets.entry.js
/*
 * This file is part of eyeo's Web Extension Ad Blocking Toolkit (EWE),
 * Copyright (C) 2006-present eyeo GmbH
 *
 * EWE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * EWE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EWE.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global chrome browser */








// Use chrome.storage to detect if we're in an isolated world.
// Note: chrome.runtime is unreliable since other extensions may expose it
// in the main world.
const isMainWorld = !(
  (typeof chrome === "object" && !!chrome.storage) ||
  (typeof browser === "object" && !!browser.storage)
);

// Get or create a unique channel name for communicating with the isolated world
const commsChannelName = claimCommsChannel(esm_browser_v4());

const runStorageShim = (shimFn, configKey) => {
  try {
    if (typeof shimFn === "function" && configKey) {
      shimFn(configKey);
    }
  }
  catch (err) {
    // It would be good to report this error to Sentry, but we don't currently
    // have a way to do that from the main world.
  }
};

const runSnippets = snippetsConfig => {
  const {callback, filters, env, commsChannel, serializeError} = snippetsConfig;

  if (filters.length) {
    try {
      callback(env, ...filters);
    }
    catch (e) {
      // It would be good to report this error to Sentry, but we don't currently
      // have a way to do that from the main world.
      const errorEvent = new CustomEvent(commsChannel, {
        detail: {
          type: "ewe:main-error",
          error: serializeError(e)
        }
      });
      document.dispatchEvent(errorEvent);
    }
  }
};

const createTrustedScriptPolicy = () => {
  const isTrustedTypesSupported = typeof trustedTypes !== "undefined";
  let policy = null;

  try {
    if (isTrustedTypesSupported) {
      policy = trustedTypes.createPolicy(esm_browser_v4(), {
        createScript: code => code,
        createScriptURL: url => url
      });
    }
  }
  catch (_) {
  }
  return policy;
};

const injectScript = (executable, policy) => {
  const script = document.createElement("script");
  script.type = "application/javascript";
  script.async = false;

  if (policy) {
    script.textContent = policy.createScript(executable);
  }
  else {
    script.textContent = executable;
  }

  try {
    document.documentElement.appendChild(script);
  }
  catch (_) {}
  document.documentElement.removeChild(script);
};

const appendSnippets = snippetsConfig => {
  const policy = createTrustedScriptPolicy();
  const {
    callback,
    filters,
    env,
    shimFn,
    shimConfigKey,
    commsChannel,
    serializeError
  } = snippetsConfig;

  const snippetsCode = filters.length ? `
    const callback = (${callback});
    const runSnippets = (${runSnippets});
    const serializeError = (${serializeError});
    const snippetsConfig = {
      callback,
      env: ${JSON.stringify(env)},
      filters: ${JSON.stringify(filters)},
      commsChannel: "${commsChannel}",
      serializeError
    };
    runSnippets(snippetsConfig);
  ` : "";

  const code = `(function () {
    const shimFn = (${shimFn});
    const shimConfigKey = "${shimConfigKey}";
    const runStorageShim = (${runStorageShim});
    runStorageShim(shimFn, shimConfigKey);
    ${snippetsCode}
  })();`;

  injectScript(code, policy);
};

const onFiltersReceived = event => {
  if (!event || !event.detail) {
    return;
  }

  const {type, filters, debug} = event.detail;

  // ignore other events that are not related to filters config
  if (type !== "ewe:filters-config") {
    return;
  }

  // Check which snippets need to be executed in the main world.
  const mainSnippets = [];
  for (const filter of filters) {
    for (const [name, ...args] of filter) {
      if (main.has(name)) {
        mainSnippets.push([name, ...args]);
      }
    }
  }

  const snippetsConfig = {
    callback: main,
    env: {debugCSSProperties: debug ? DEBUG_CSS_PROPERTIES : null},
    filters: mainSnippets,
    shimFn: shimLocalStorage,
    shimConfigKey: CACHED_FILTERS_CONFIG_KEY,
    commsChannel: commsChannelName,
    serializeError: toSerializableError
  };

  // If this script is injected into the main world we can execute directly.
  // If we are on isolated world (MV2), we need to create an inline script to
  // inject the snippets into page context.
  if (isMainWorld) {
    runStorageShim(shimLocalStorage, CACHED_FILTERS_CONFIG_KEY);
    runSnippets(snippetsConfig);
  }
  else {
    appendSnippets(snippetsConfig);
  }
};

document.addEventListener(commsChannelName, onFiltersReceived);
document.dispatchEvent(new CustomEvent(HANDSHAKE_EVENT_NAME));

/******/ })()
;
