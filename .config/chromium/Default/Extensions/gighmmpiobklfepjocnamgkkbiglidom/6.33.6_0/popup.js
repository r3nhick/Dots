/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2181:
/***/ ((module) => {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 7795:
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_510__) => {

/* @@package_name - v@@version - @@timestamp */
/* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set sts=2 sw=2 et tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
  throw new Error("This script should only be loaded in a browser extension.");
}

if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
  const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
  const ERROR_TO_IGNORE = `A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received`;

  // Wrapping the bulk of this polyfill in a one-time-use function is a minor
  // optimization for Firefox. Since Spidermonkey does not fully parse the
  // contents of a function until the first time it's called, and since it will
  // never actually need to be called, this allows the polyfill to be included
  // in Firefox nearly for free.
  const wrapAPIs = extensionAPIs => {
    // NOTE: apiMetadata is associated to the content of the api-metadata.json file
    // at build time by replacing the following "include" with the content of the
    // JSON file.
    const apiMetadata = __nested_webpack_require_510__(9438);

    if (Object.keys(apiMetadata).length === 0) {
      throw new Error("api-metadata.json has not been included in browser-polyfill");
    }

    /**
     * A WeakMap subclass which creates and stores a value for any key which does
     * not exist when accessed, but behaves exactly as an ordinary WeakMap
     * otherwise.
     *
     * @param {function} createItem
     *        A function which will be called in order to create the value for any
     *        key which does not exist, the first time it is accessed. The
     *        function receives, as its only argument, the key being created.
     */
    class DefaultWeakMap extends WeakMap {
      constructor(createItem, items = undefined) {
        super(items);
        this.createItem = createItem;
      }

      get(key) {
        if (!this.has(key)) {
          this.set(key, this.createItem(key));
        }

        return super.get(key);
      }
    }

    /**
     * Returns true if the given object is an object with a `then` method, and can
     * therefore be assumed to behave as a Promise.
     *
     * @param {*} value The value to test.
     * @returns {boolean} True if the value is thenable.
     */
    const isThenable = value => {
      return value && typeof value === "object" && typeof value.then === "function";
    };

    /**
     * Creates and returns a function which, when called, will resolve or reject
     * the given promise based on how it is called:
     *
     * - If, when called, `chrome.runtime.lastError` contains a non-null object,
     *   the promise is rejected with that value.
     * - If the function is called with exactly one argument, the promise is
     *   resolved to that value.
     * - Otherwise, the promise is resolved to an array containing all of the
     *   function's arguments.
     *
     * @param {object} promise
     *        An object containing the resolution and rejection functions of a
     *        promise.
     * @param {function} promise.resolve
     *        The promise's resolution function.
     * @param {function} promise.reject
     *        The promise's rejection function.
     * @param {object} metadata
     *        Metadata about the wrapped method which has created the callback.
     * @param {boolean} metadata.singleCallbackArg
     *        Whether or not the promise is resolved with only the first
     *        argument of the callback, alternatively an array of all the
     *        callback arguments is resolved. By default, if the callback
     *        function is invoked with only a single argument, that will be
     *        resolved to the promise, while all arguments will be resolved as
     *        an array if multiple are given.
     *
     * @returns {function}
     *        The generated callback function.
     */
    const makeCallback = (promise, metadata) => {
      // In case we encounter a browser error in the callback function, we don't
      // want to lose the stack trace leading up to this point. For that reason,
      // we need to instantiate the error outside the callback function.
      let error = new Error();
      return (...callbackArgs) => {
        if (extensionAPIs.runtime.lastError) {
          error.message = extensionAPIs.runtime.lastError.message;
          promise.reject(error);
        } else if (metadata.singleCallbackArg ||
                   (callbackArgs.length <= 1 && metadata.singleCallbackArg !== false)) {
          promise.resolve(callbackArgs[0]);
        } else {
          promise.resolve(callbackArgs);
        }
      };
    };

    const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";

    /**
     * Creates a wrapper function for a method with the given name and metadata.
     *
     * @param {string} name
     *        The name of the method which is being wrapped.
     * @param {object} metadata
     *        Metadata about the method being wrapped.
     * @param {integer} metadata.minArgs
     *        The minimum number of arguments which must be passed to the
     *        function. If called with fewer than this number of arguments, the
     *        wrapper will raise an exception.
     * @param {integer} metadata.maxArgs
     *        The maximum number of arguments which may be passed to the
     *        function. If called with more than this number of arguments, the
     *        wrapper will raise an exception.
     * @param {boolean} metadata.singleCallbackArg
     *        Whether or not the promise is resolved with only the first
     *        argument of the callback, alternatively an array of all the
     *        callback arguments is resolved. By default, if the callback
     *        function is invoked with only a single argument, that will be
     *        resolved to the promise, while all arguments will be resolved as
     *        an array if multiple are given.
     *
     * @returns {function(object, ...*)}
     *       The generated wrapper function.
     */
    const wrapAsyncFunction = (name, metadata) => {
      return function asyncFunctionWrapper(target, ...args) {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }

        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }

        return new Promise((resolve, reject) => {
          if (metadata.fallbackToNoCallback) {
            // This API method has currently no callback on Chrome, but it return a promise on Firefox,
            // and so the polyfill will try to call it with a callback first, and it will fallback
            // to not passing the callback if the first call fails.
            try {
              target[name](...args, makeCallback({resolve, reject}, metadata));
            } catch (cbError) {
              console.warn(`${name} API method doesn't seem to support the callback parameter, ` +
                           "falling back to call it without a callback: ", cbError);

              target[name](...args);

              // Update the API method metadata, so that the next API calls will not try to
              // use the unsupported callback anymore.
              metadata.fallbackToNoCallback = false;
              metadata.noCallback = true;

              resolve();
            }
          } else if (metadata.noCallback) {
            target[name](...args);
            resolve();
          } else {
            target[name](...args, makeCallback({resolve, reject}, metadata));
          }
        });
      };
    };

    /**
     * Wraps an existing method of the target object, so that calls to it are
     * intercepted by the given wrapper function. The wrapper function receives,
     * as its first argument, the original `target` object, followed by each of
     * the arguments passed to the original method.
     *
     * @param {object} target
     *        The original target object that the wrapped method belongs to.
     * @param {function} method
     *        The method being wrapped. This is used as the target of the Proxy
     *        object which is created to wrap the method.
     * @param {function} wrapper
     *        The wrapper function which is called in place of a direct invocation
     *        of the wrapped method.
     *
     * @returns {Proxy<function>}
     *        A Proxy object for the given method, which invokes the given wrapper
     *        method in its place.
     */
    const wrapMethod = (target, method, wrapper) => {
      return new Proxy(method, {
        apply(targetMethod, thisObj, args) {
          return wrapper.call(thisObj, target, ...args);
        },
      });
    };

    let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

    /**
     * Wraps an object in a Proxy which intercepts and wraps certain methods
     * based on the given `wrappers` and `metadata` objects.
     *
     * @param {object} target
     *        The target object to wrap.
     *
     * @param {object} [wrappers = {}]
     *        An object tree containing wrapper functions for special cases. Any
     *        function present in this object tree is called in place of the
     *        method in the same location in the `target` object tree. These
     *        wrapper methods are invoked as described in {@see wrapMethod}.
     *
     * @param {object} [metadata = {}]
     *        An object tree containing metadata used to automatically generate
     *        Promise-based wrapper functions for asynchronous. Any function in
     *        the `target` object tree which has a corresponding metadata object
     *        in the same location in the `metadata` tree is replaced with an
     *        automatically-generated wrapper function, as described in
     *        {@see wrapAsyncFunction}
     *
     * @returns {Proxy<object>}
     */
    const wrapObject = (target, wrappers = {}, metadata = {}) => {
      let cache = Object.create(null);
      let handlers = {
        has(proxyTarget, prop) {
          return prop in target || prop in cache;
        },

        get(proxyTarget, prop, receiver) {
          if (prop in cache) {
            return cache[prop];
          }

          if (!(prop in target)) {
            return undefined;
          }

          let value = target[prop];

          if (typeof value === "function") {
            // This is a method on the underlying object. Check if we need to do
            // any wrapping.

            if (typeof wrappers[prop] === "function") {
              // We have a special-case wrapper for this method.
              value = wrapMethod(target, target[prop], wrappers[prop]);
            } else if (hasOwnProperty(metadata, prop)) {
              // This is an async method that we have metadata for. Create a
              // Promise wrapper for it.
              let wrapper = wrapAsyncFunction(prop, metadata[prop]);
              value = wrapMethod(target, target[prop], wrapper);
            } else {
              // This is a method that we don't know or care about. Return the
              // original method, bound to the underlying object.
              value = value.bind(target);
            }
          } else if (typeof value === "object" && value !== null &&
                     (hasOwnProperty(wrappers, prop) ||
                      hasOwnProperty(metadata, prop))) {
            // This is an object that we need to do some wrapping for the children
            // of. Create a sub-object wrapper for it with the appropriate child
            // metadata.
            value = wrapObject(value, wrappers[prop], metadata[prop]);
          } else if (hasOwnProperty(metadata, "*")) {
            // Wrap all properties in * namespace.
            value = wrapObject(value, wrappers[prop], metadata["*"]);
          } else {
            // We don't need to do any wrapping for this property,
            // so just forward all access to the underlying object.
            Object.defineProperty(cache, prop, {
              configurable: true,
              enumerable: true,
              get() {
                return target[prop];
              },
              set(value) {
                target[prop] = value;
              },
            });

            return value;
          }

          cache[prop] = value;
          return value;
        },

        set(proxyTarget, prop, value, receiver) {
          if (prop in cache) {
            cache[prop] = value;
          } else {
            target[prop] = value;
          }
          return true;
        },

        defineProperty(proxyTarget, prop, desc) {
          return Reflect.defineProperty(cache, prop, desc);
        },

        deleteProperty(proxyTarget, prop) {
          return Reflect.deleteProperty(cache, prop);
        },
      };

      // Per contract of the Proxy API, the "get" proxy handler must return the
      // original value of the target if that value is declared read-only and
      // non-configurable. For this reason, we create an object with the
      // prototype set to `target` instead of using `target` directly.
      // Otherwise we cannot return a custom object for APIs that
      // are declared read-only and non-configurable, such as `chrome.devtools`.
      //
      // The proxy handlers themselves will still use the original `target`
      // instead of the `proxyTarget`, so that the methods and properties are
      // dereferenced via the original targets.
      let proxyTarget = Object.create(target);
      return new Proxy(proxyTarget, handlers);
    };

    /**
     * Creates a set of wrapper functions for an event object, which handles
     * wrapping of listener functions that those messages are passed.
     *
     * A single wrapper is created for each listener function, and stored in a
     * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
     * retrieve the original wrapper, so that  attempts to remove a
     * previously-added listener work as expected.
     *
     * @param {DefaultWeakMap<function, function>} wrapperMap
     *        A DefaultWeakMap object which will create the appropriate wrapper
     *        for a given listener function when one does not exist, and retrieve
     *        an existing one when it does.
     *
     * @returns {object}
     */
    const wrapEvent = wrapperMap => ({
      addListener(target, listener, ...args) {
        target.addListener(wrapperMap.get(listener), ...args);
      },

      hasListener(target, listener) {
        return target.hasListener(wrapperMap.get(listener));
      },

      removeListener(target, listener) {
        target.removeListener(wrapperMap.get(listener));
      },
    });

    const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
      if (typeof listener !== "function") {
        return listener;
      }

      /**
       * Wraps an onRequestFinished listener function so that it will return a
       * `getContent()` property which returns a `Promise` rather than using a
       * callback API.
       *
       * @param {object} req
       *        The HAR entry object representing the network request.
       */
      return function onRequestFinished(req) {
        const wrappedReq = wrapObject(req, {} /* wrappers */, {
          getContent: {
            minArgs: 0,
            maxArgs: 0,
          },
        });
        listener(wrappedReq);
      };
    });

    const onMessageWrappers = new DefaultWeakMap(listener => {
      if (typeof listener !== "function") {
        return listener;
      }

      /**
       * Wraps a message listener function so that it may send responses based on
       * its return value, rather than by returning a sentinel value and calling a
       * callback. If the listener function returns a Promise, the response is
       * sent when the promise either resolves or rejects.
       *
       * @param {*} message
       *        The message sent by the other end of the channel.
       * @param {object} sender
       *        Details about the sender of the message.
       * @param {function(*)} sendResponse
       *        A callback which, when called with an arbitrary argument, sends
       *        that value as a response.
       * @returns {boolean}
       *        True if the wrapped listener returned a Promise, which will later
       *        yield a response. False otherwise.
       */
      return function onMessage(message, sender, sendResponse) {
        let didCallSendResponse = false;

        let wrappedSendResponse;
        let sendResponsePromise = new Promise(resolve => {
          wrappedSendResponse = function(response) {
            didCallSendResponse = true;
            resolve(response);
          };
        });

        let result;
        try {
          result = listener(message, sender, wrappedSendResponse);
        } catch (err) {
          result = Promise.reject(err);
        }

        const isResultThenable = result !== true && isThenable(result);

        // If the listener didn't returned true or a Promise, or called
        // wrappedSendResponse synchronously, we can exit earlier
        // because there will be no response sent from this listener.
        if (result !== true && !isResultThenable && !didCallSendResponse) {
          return false;
        }

        // A small helper to send the message if the promise resolves
        // and an error if the promise rejects (a wrapped sendMessage has
        // to translate the message into a resolved promise or a rejected
        // promise).
        const sendPromisedResult = (promise) => {
          promise.then(msg => {
            // send the message value.
            sendResponse(msg);
          }, error => {
            // Send a JSON representation of the error if the rejected value
            // is an instance of error, or the object itself otherwise.
            let message;
            if (error && (error instanceof Error ||
                typeof error.message === "string")) {
              message = error.message;
            } else {
              message = "An unexpected error occurred";
            }

            sendResponse({
              __mozWebExtensionPolyfillReject__: true,
              message,
            });
          }).catch(err => {
            // Print an error on the console if unable to send the response.
            console.error("Failed to send onMessage rejected reply", err);
          });
        };

        // If the listener returned a Promise, send the resolved value as a
        // result, otherwise wait the promise related to the wrappedSendResponse
        // callback to resolve and send it as a response.
        if (isResultThenable) {
          sendPromisedResult(result);
        } else {
          sendPromisedResult(sendResponsePromise);
        }

        // Let Chrome know that the listener is replying.
        return true;
      };
    });

    const wrappedSendMessageCallback = ({reject, resolve}, reply) => {
      if (extensionAPIs.runtime.lastError) {
        // Detect when none of the listeners replied to the sendMessage call and resolve
        // the promise to undefined as in Firefox.
        // See https://github.com/mozilla/webextension-polyfill/issues/130
        if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE || extensionAPIs.runtime.lastError.message.includes(ERROR_TO_IGNORE)) {
          resolve();
        } else {
          reject(new Error(extensionAPIs.runtime.lastError.message));
        }
      } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
        // Convert back the JSON representation of the error into
        // an Error instance.
        reject(new Error(reply.message));
      } else {
        resolve(reply);
      }
    };

    const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
      if (args.length < metadata.minArgs) {
        throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
      }

      if (args.length > metadata.maxArgs) {
        throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
      }

      return new Promise((resolve, reject) => {
        const wrappedCb = wrappedSendMessageCallback.bind(null, {resolve, reject});
        args.push(wrappedCb);
        apiNamespaceObj.sendMessage(...args);
      });
    };

    const staticWrappers = {
      devtools: {
        network: {
          onRequestFinished: wrapEvent(onRequestFinishedWrappers),
        },
      },
      runtime: {
        onMessage: wrapEvent(onMessageWrappers),
        onMessageExternal: wrapEvent(onMessageWrappers),
        sendMessage: wrappedSendMessage.bind(null, "sendMessage", {minArgs: 1, maxArgs: 3}),
      },
      tabs: {
        sendMessage: wrappedSendMessage.bind(null, "sendMessage", {minArgs: 2, maxArgs: 3}),
      },
    };
    const settingMetadata = {
      clear: {minArgs: 1, maxArgs: 1},
      get: {minArgs: 1, maxArgs: 1},
      set: {minArgs: 1, maxArgs: 1},
    };
    apiMetadata.privacy = {
      network: {"*": settingMetadata},
      services: {"*": settingMetadata},
      websites: {"*": settingMetadata},
    };

    return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
  };

  // The build process adds a UMD wrapper around this file, which makes the
  // `module` variable available.
  module.exports = wrapAPIs(chrome);
} else {
  module.exports = globalThis.browser;
}


/***/ }),

/***/ 9438:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"alarms":{"clear":{"minArgs":0,"maxArgs":1},"clearAll":{"minArgs":0,"maxArgs":0},"get":{"minArgs":0,"maxArgs":1},"getAll":{"minArgs":0,"maxArgs":0}},"bookmarks":{"create":{"minArgs":1,"maxArgs":1},"get":{"minArgs":1,"maxArgs":1},"getChildren":{"minArgs":1,"maxArgs":1},"getRecent":{"minArgs":1,"maxArgs":1},"getSubTree":{"minArgs":1,"maxArgs":1},"getTree":{"minArgs":0,"maxArgs":0},"move":{"minArgs":2,"maxArgs":2},"remove":{"minArgs":1,"maxArgs":1},"removeTree":{"minArgs":1,"maxArgs":1},"search":{"minArgs":1,"maxArgs":1},"update":{"minArgs":2,"maxArgs":2}},"browserAction":{"disable":{"minArgs":0,"maxArgs":1,"fallbackToNoCallback":true},"enable":{"minArgs":0,"maxArgs":1,"fallbackToNoCallback":true},"getBadgeBackgroundColor":{"minArgs":1,"maxArgs":1},"getBadgeText":{"minArgs":1,"maxArgs":1},"getPopup":{"minArgs":1,"maxArgs":1},"getTitle":{"minArgs":1,"maxArgs":1},"openPopup":{"minArgs":0,"maxArgs":0},"setBadgeBackgroundColor":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"setBadgeText":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"setIcon":{"minArgs":1,"maxArgs":1},"setPopup":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"setTitle":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true}},"browsingData":{"remove":{"minArgs":2,"maxArgs":2},"removeCache":{"minArgs":1,"maxArgs":1},"removeCookies":{"minArgs":1,"maxArgs":1},"removeDownloads":{"minArgs":1,"maxArgs":1},"removeFormData":{"minArgs":1,"maxArgs":1},"removeHistory":{"minArgs":1,"maxArgs":1},"removeLocalStorage":{"minArgs":1,"maxArgs":1},"removePasswords":{"minArgs":1,"maxArgs":1},"removePluginData":{"minArgs":1,"maxArgs":1},"settings":{"minArgs":0,"maxArgs":0}},"commands":{"getAll":{"minArgs":0,"maxArgs":0}},"contextMenus":{"remove":{"minArgs":1,"maxArgs":1},"removeAll":{"minArgs":0,"maxArgs":0},"update":{"minArgs":2,"maxArgs":2}},"cookies":{"get":{"minArgs":1,"maxArgs":1},"getAll":{"minArgs":1,"maxArgs":1},"getAllCookieStores":{"minArgs":0,"maxArgs":0},"remove":{"minArgs":1,"maxArgs":1},"set":{"minArgs":1,"maxArgs":1}},"devtools":{"inspectedWindow":{"eval":{"minArgs":1,"maxArgs":2,"singleCallbackArg":false}},"panels":{"create":{"minArgs":3,"maxArgs":3,"singleCallbackArg":true},"elements":{"createSidebarPane":{"minArgs":1,"maxArgs":1}}}},"downloads":{"cancel":{"minArgs":1,"maxArgs":1},"download":{"minArgs":1,"maxArgs":1},"erase":{"minArgs":1,"maxArgs":1},"getFileIcon":{"minArgs":1,"maxArgs":2},"open":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"pause":{"minArgs":1,"maxArgs":1},"removeFile":{"minArgs":1,"maxArgs":1},"resume":{"minArgs":1,"maxArgs":1},"search":{"minArgs":1,"maxArgs":1},"show":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true}},"extension":{"isAllowedFileSchemeAccess":{"minArgs":0,"maxArgs":0},"isAllowedIncognitoAccess":{"minArgs":0,"maxArgs":0}},"history":{"addUrl":{"minArgs":1,"maxArgs":1},"deleteAll":{"minArgs":0,"maxArgs":0},"deleteRange":{"minArgs":1,"maxArgs":1},"deleteUrl":{"minArgs":1,"maxArgs":1},"getVisits":{"minArgs":1,"maxArgs":1},"search":{"minArgs":1,"maxArgs":1}},"i18n":{"detectLanguage":{"minArgs":1,"maxArgs":1},"getAcceptLanguages":{"minArgs":0,"maxArgs":0}},"identity":{"launchWebAuthFlow":{"minArgs":1,"maxArgs":1}},"idle":{"queryState":{"minArgs":1,"maxArgs":1}},"management":{"get":{"minArgs":1,"maxArgs":1},"getAll":{"minArgs":0,"maxArgs":0},"getSelf":{"minArgs":0,"maxArgs":0},"setEnabled":{"minArgs":2,"maxArgs":2},"uninstallSelf":{"minArgs":0,"maxArgs":1}},"notifications":{"clear":{"minArgs":1,"maxArgs":1},"create":{"minArgs":1,"maxArgs":2},"getAll":{"minArgs":0,"maxArgs":0},"getPermissionLevel":{"minArgs":0,"maxArgs":0},"update":{"minArgs":2,"maxArgs":2}},"pageAction":{"getPopup":{"minArgs":1,"maxArgs":1},"getTitle":{"minArgs":1,"maxArgs":1},"hide":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"setIcon":{"minArgs":1,"maxArgs":1},"setPopup":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"setTitle":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true},"show":{"minArgs":1,"maxArgs":1,"fallbackToNoCallback":true}},"permissions":{"contains":{"minArgs":1,"maxArgs":1},"getAll":{"minArgs":0,"maxArgs":0},"remove":{"minArgs":1,"maxArgs":1},"request":{"minArgs":1,"maxArgs":1}},"runtime":{"getBackgroundPage":{"minArgs":0,"maxArgs":0},"getPlatformInfo":{"minArgs":0,"maxArgs":0},"openOptionsPage":{"minArgs":0,"maxArgs":0},"requestUpdateCheck":{"minArgs":0,"maxArgs":0},"sendMessage":{"minArgs":1,"maxArgs":3},"sendNativeMessage":{"minArgs":2,"maxArgs":2},"setUninstallURL":{"minArgs":1,"maxArgs":1}},"sessions":{"getDevices":{"minArgs":0,"maxArgs":1},"getRecentlyClosed":{"minArgs":0,"maxArgs":1},"restore":{"minArgs":0,"maxArgs":1}},"storage":{"local":{"clear":{"minArgs":0,"maxArgs":0},"get":{"minArgs":0,"maxArgs":1},"getBytesInUse":{"minArgs":0,"maxArgs":1},"remove":{"minArgs":1,"maxArgs":1},"set":{"minArgs":1,"maxArgs":1}},"managed":{"get":{"minArgs":0,"maxArgs":1},"getBytesInUse":{"minArgs":0,"maxArgs":1}},"sync":{"clear":{"minArgs":0,"maxArgs":0},"get":{"minArgs":0,"maxArgs":1},"getBytesInUse":{"minArgs":0,"maxArgs":1},"remove":{"minArgs":1,"maxArgs":1},"set":{"minArgs":1,"maxArgs":1}}},"tabs":{"captureVisibleTab":{"minArgs":0,"maxArgs":2},"create":{"minArgs":1,"maxArgs":1},"detectLanguage":{"minArgs":0,"maxArgs":1},"discard":{"minArgs":0,"maxArgs":1},"duplicate":{"minArgs":1,"maxArgs":1},"executeScript":{"minArgs":1,"maxArgs":2},"get":{"minArgs":1,"maxArgs":1},"getCurrent":{"minArgs":0,"maxArgs":0},"getZoom":{"minArgs":0,"maxArgs":1},"getZoomSettings":{"minArgs":0,"maxArgs":1},"goBack":{"minArgs":0,"maxArgs":1},"goForward":{"minArgs":0,"maxArgs":1},"highlight":{"minArgs":1,"maxArgs":1},"insertCSS":{"minArgs":1,"maxArgs":2},"move":{"minArgs":2,"maxArgs":2},"query":{"minArgs":1,"maxArgs":1},"reload":{"minArgs":0,"maxArgs":2},"remove":{"minArgs":1,"maxArgs":1},"removeCSS":{"minArgs":1,"maxArgs":2},"sendMessage":{"minArgs":2,"maxArgs":3},"setZoom":{"minArgs":1,"maxArgs":2},"setZoomSettings":{"minArgs":1,"maxArgs":2},"update":{"minArgs":1,"maxArgs":2}},"topSites":{"get":{"minArgs":0,"maxArgs":0}},"webNavigation":{"getAllFrames":{"minArgs":1,"maxArgs":1},"getFrame":{"minArgs":1,"maxArgs":1}},"webRequest":{"handlerBehaviorChanged":{"minArgs":0,"maxArgs":0}},"windows":{"create":{"minArgs":0,"maxArgs":1},"get":{"minArgs":1,"maxArgs":2},"getAll":{"minArgs":0,"maxArgs":1},"getCurrent":{"minArgs":0,"maxArgs":1},"getLastFocused":{"minArgs":0,"maxArgs":1},"remove":{"minArgs":1,"maxArgs":1},"update":{"minArgs":2,"maxArgs":2}}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_29608__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_29608__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_29608__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_29608__.o(definition, key) && !__nested_webpack_require_29608__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nested_webpack_require_29608__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_29608__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __nested_webpack_exports__ = {};
// ESM COMPAT FLAG
__nested_webpack_require_29608__.r(__nested_webpack_exports__);

// EXPORTS
__nested_webpack_require_29608__.d(__nested_webpack_exports__, {
  account: () => (/* reexport */ account),
  experiments: () => (/* reexport */ experiments),
  sentry: () => (/* reexport */ sentry),
  telemetry: () => (/* reexport */ telemetry)
});

// EXTERNAL MODULE: ../../vendor/webextension-polyfill/src/browser-polyfill.js
var browser_polyfill = __nested_webpack_require_29608__(7795);
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

const ERROR_NO_CONNECTION = "Could not establish connection. " +
      "Receiving end does not exist.";
const ERROR_CLOSED_CONNECTION = "A listener indicated an asynchronous " +
      "response by returning true, but the message channel closed before a " +
      "response was received";
// https://bugzilla.mozilla.org/show_bug.cgi?id=1578697
const ERROR_MANAGER_DISCONNECTED = "Message manager disconnected";

/**
 * Reconstructs an error from a serializable error object
 *
 * @param {string} errorData - Error object
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
 * @returns {string} serializable error object
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

;// ./src/ui/sentry.js
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





async function forwardError(error) {
  ignoreNoConnectionError(
    browser_polyfill.runtime.sendMessage({
      type: "ewe:sentry-error",
      error: toSerializableError(error)
    })
  );
}

/**
 * API to interact with the sentry module
 * @namespace sentry
 */
/* harmony default export */ const sentry = ({
  /**
   * Report error to Sentry
   *
   * @param {Error} error - Error to send to Sentry.
   */
  async reportError(error) {
    return await forwardError(error);
  },

  /**
   * Initialize and start Sentry
   */
  start() {
    self.addEventListener("error", event => {
      const {error} = event;
      if (!(error instanceof Error)) {
        return;
      }

      forwardError(error);
    });

    self.addEventListener("unhandledrejection", event => {
      const {reason} = event;
      if (!(reason instanceof Error)) {
        return;
      }

      forwardError(reason);
    });
  }
});

;// ./src/front/account.js
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
 * Sends a message to the service worker to call the user account API.
 * @param {string} methodName the method to call on the account API
 * @param {any[]} params the parameters to pass to the method
 * @returns {Promise<*>} the result of the API call.
 */
async function callAPI(methodName, ...params) {
  return await ignoreNoConnectionError(
    browser_polyfill.runtime.sendMessage({
      type: "ewe:api-call",
      apiName: "account",
      methodName,
      params
    })
  );
}

/**
 * API to interact with the user account module
 * @namespace account
 */
/* harmony default export */ const account = ({
  /**
   * Retrieves the user's profile information.
   * @ignore
   * @returns {Promise<UserProfile|null>}
   */
  async getProfile() {
    return await callAPI("getProfile");
  },

  /**
   * Checks if the user has an active premium subscription.
   *
   * @returns {Promise<boolean>} - True if the user has a premium subscription,
   *   false otherwise.
   */
  async hasPremium() {
    return await callAPI("hasPremium");
  }
});

;// ./src/front/experiments.js
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
 * Sends a message to the service worker to call the experiments API.
 * @param {string} methodName the method to call on the experiments API
 * @param {any[]} params the parameters to pass to the method
 * @returns {Promise<*>} the result of the API call.
 */
async function experiments_callAPI(methodName, ...params) {
  return await ignoreNoConnectionError(
    browser_polyfill.runtime.sendMessage({
      type: "ewe:api-call",
      apiName: "experiments",
      methodName,
      params
    })
  );
}

/**
 * API to interact with the experiments module
 * @namespace experiments
 */
/* harmony default export */ const experiments = ({
  /**
   * Retrieves the value of a feature flag
   * @ignore
   * @param {string} flagId - Identifier of the feature flag
   * @returns {Promise<*|null>} Value of the feature flag or null if not found
   */
  async getFlag(flagId) {
    return await experiments_callAPI("getFlag", flagId);
  },

  /**
   * Retrieves all the available experiment flags
   * @ignore
   * @returns {Promise<*|null>} Value of the feature flag or null if not found
   */
  async getFlags() {
    return await experiments_callAPI("getFlags");
  },

  /**
   * Retrieves all the experiment assignments
   * @ignore
   * @returns {Promise<Object.<string, string>>} Object specifying the assigned
   *   variant ID for each active assigned experiment ID
   */
  async getAssignments() {
    return await experiments_callAPI("getAssignments");
  }
});

;// ./events.js
/* harmony default export */ const events = ({
  adblock_ui: {
    options_clicked: {
      description: "User clicked the gear icon"
    },
    support_icon_clicked: {
      description: "User clicked the support icon on the header of the Adblock popup"
    },
    opt_out_acceptable_ads_clicked: {
      description: "The user clicked the opt-out link to disable Acceptable Ads on the getadblock.com installed page"
    },
    cm_pause_on_site: {
      description: "User right clicked on the page to open the context menu and selected 'Pause on this site' from the AdBlock section."
    },
    cm_pause_on_all_sites: {
      description: "User right clicked on the page to open the context menu and selected 'Pause on all sites' from the AdBlock section."
    },
    cm_resume_adblock: {
      description: "User right clicked on the page to open the context menu and selected 'Resume blocking ads' from the AdBlock section."
    },
    pause_on_site: {
      description: "User clicked 'Pause on this site' on the Adblock popup"
    },
    resume_adblock: {
      description: "User clicked 'Resume Ad blocking' on the Adblock popup"
    },
    popup_opened: {
      description: "User clicked the AdBlock toolbar icon to open the popup menu",
      data: {
        description: "Data about the popup opened event",
        type: "object",
        properties: {
          isBadgeTextNew: {
            description: "The 'new' badge is shown on the popup icon",
            type: "boolean"
          },
          reason: {
            description: "The reason why the 'new' badge was shown",
            type: "string"
          }
        }
      }
    },
    hide_on_this_page_clicked: {
      description: "User clicked on the three dots in the popup menu, then clicked the 'Hide something on this page' link"
    },
    titletext_clicked: {
      description: "User clicked the AdBlock logo in the popup menu header"
    },
    more_pause_options_clicked: {
      description: "User clicked on the three dots in the popup menu, then clicked 'More pause options' link"
    },
    help_flow_results: {
      description: "Emitted when a user completes the help flow in the popup. The flow presents different options based on the user's issue (e.g., ads not blocked, site broken, etc.), and the emitted event includes the path representing the sequence of choices the user made",
      data: {
        description: "Data about the help flow results",
        type: "object",
        properties: {
          helpFlowPath: {
            description: "The path of the help flow (e.g. 'start,seeAd,seeAdEverywhere,link')",
            type: "string"
          }
        }
      }
    },
    premium_options_clicked: {
      description: "Triggered when a premium user clicks the 'Premium' label in the popup header which is shown next to the Adblock logo. The label is only visible to premium users and opens the Premium tab in the settings page"
    },
    popup_sub_clicked_cookies_premium: {
      description: "Triggered when a premium user clicks the toggle to enable the Premium Cookie Blocking filter list in the popup. The list is not enabled automatically when upgrading to premium"
    },
    popup_sub_clicked_distraction_control: {
      description: "Triggered when a premium user clicks the toggle to enable the Premium Block Distractions filter list in the popup. The list is not enabled automatically when upgrading to premium"
    },
    skip_cookie_walls_learn_more_clicked: {
      description: "A free user clicked the Learn More button on the 'Skip Cookie Walls' section in the AdBlock popup"
    },
    block_distractions_learn_more_clicked: {
      description: "A free user clicked the Learn More button on the 'Block Distractions' section in the AdBlock popup"
    },
    options_page_tab_premium_cta: {
      description: "User interacted with a premium CTA on a premium tab in the options page",
      data: {
        description: "Data about which tab the user was viewing",
        type: "object",
        properties: {
          tab: {
            description: "The name of the tab being viewed when the CTA was clicked",
            type: "string",
            enum: ["premium", "themes", "image_swap", "premium_filters"]
          },
          action: {
            description: "Type of interaction with the Premium CTA",
            type: "string",
            enum: ["clicked"]
          }
        }
      }
    },
    options_page_tab: {
      description: "User clicked or opened a tab on the options page side bar",
      data: {
        description: "Data about the user interaction with the options page tab",
        type: "object",
        properties: {
          tab: {
            description: "The tab that the user interacted with",
            type: "string",
            enum: ["stats", "general", "filter_lists", "customize", "support", "premium", "themes", "image_swap", "premium_filters"]
          },
          action: {
            description: "Type of interaction with the options page tab",
            type: "string",
            enum: ["opened", "clicked"]
          }
        }
      }
    },
    vpn_cta: {
      description: "User interacted with AdBlock VPN promotional banner in the popup menu. This CTA promotes the VPN with 'Introducing AdBlock VPN' message",
      data: {
        description: "Data about the user interaction with the AdBlock VPN promotional banner",
        type: "object",
        properties: {
          action: {
            description: "Type of interaction with the AdBlock VPN promotional banner",
            type: "string",
            enum: ["seen", "clicked", "closed"]
          }
        }
      }
    },
    premium_themes_cta: {
      description: "User interacted with themes customization CTA in the popup menu, opening the themes section in options page",
      data: {
        description: "Information about the theme that was being promoted when clicked",
        type: "object",
        properties: {
          theme: {
            description: "The name of the theme being showcased when the user clicked",
            type: "string",
            enum: ["solarized", "solarized_light", "watermelon", "sunshine", "ocean"]
          },
          action: {
            description: "Type of interaction with the themes customization CTA",
            type: "string",
            enum: ["seen", "clicked", "closed"]
          }
        }
      }
    },
    free_dc_cta: {
      description: "User interacted with Distraction Control promotional banner in the popup menu. This CTA promotes the premium Distraction Control feature with 'Block Floating Videos' message",
      data: {
        description: "Data about the user interaction with the Distraction Control promotional banner",
        type: "object",
        properties: {
          action: {
            description: "Type of interaction with the Distraction Control promotional banner",
            type: "string",
            enum: ["seen", "clicked", "closed"]
          }
        }
      }
    },
    premium_dc_cta: {
      description: "Premium user interacted with the enhanced Distraction Control CTA in the popup menu. This CTA highlights 'New Premium feature available!' to promote advanced distraction blocking options",
      data: {
        description: "Data about the user interaction with the Distraction Control CTA",
        type: "object",
        properties: {
          action: {
            description: "Type of interaction with the Distraction Control CTA",
            type: "string",
            enum: ["seen", "clicked", "closed"]
          }
        }
      }
    },
    premium_upsell_cta: {
      description: "User interacted with Premium upsell upgrade banner in the popup menu. This CTA displays 'Upgrade your AdBlock' message to encourage premium subscription",
      data: {
        description: "Data about the user interaction with the Premium upsell upgrade banner",
        type: "object",
        properties: {
          action: {
            description: "Type of interaction with the Premium upsell upgrade banner",
            type: "string",
            enum: ["seen", "clicked", "closed"]
          }
        }
      }
    },
    premium_filter_list_cta: {
      description: "User interacted with Premium filter list banner in the popup menu. This CTA displays 'Upgrade your AdBlock' message to encourage premium subscription",
      data: {
        description: "Data about the user interaction with the premium filter list CTA",
        type: "object",
        properties: {
          action: {
            description: "Type of interaction with the premium filter list CTA",
            type: "string",
            enum: ["seen", "clicked"]
          }
        }
      }
    },
    data_collection_opt_out: {
      description: "User opted out of data collection in the options page"
    }
  },
  smart_allowlisting: {
    allowlisting_expired: {
      description: "An allowlisting filter expired automatically",
      data: {
        description: "Details about the filter at the time of expiration.",
        type: "object",
        properties: {
          allowlistExtendDuration: {
            description: "The number of milliseconds to extend the allowlisting filter's expiry when the user navigated to a URL that matches the filter.",
            type: "number"
          }
        }
      }
    },
    allowlisting_renewed: {
      description: "An allowlisting filter was renewed automatically",
      data: {
        description: "Details about the filter at the time of renewal.",
        type: "object",
        properties: {
          allowlistExtendDuration: {
            description: "The number of milliseconds to extend the allowlisting filter's expiry when the user navigated to a URL that matches the filter.",
            type: "number"
          }
        }
      }
    }
  },
  getadblock: {
    opt_out_acceptable_ads_clicked: {
      description: "The user clicked the opt-out link to disable Acceptable Ads on the getadblock.com installed page"
    }
  },
  cdp: {
    built_cdp_payload: {
      description: "A payload has been built with the intention of sending it to CDP. This is debug information, and will temporarily include the eventStats until the CDP server is ready to ingest them.",
      data: {
        description: "Data about the built payload",
        type: "object",
        properties: {
          eventStats: {
            description: "Counts of behavior event logs since the last payload.",
            type: "any"
          },
          uncompressedPayloadSize: {
            description: "Size in bytes of the uncompressed and unencrypted payload.",
            type: "integer"
          }
        }
      }
    }
  },
  youtube: {
    yt_site_navigation: {
      description: "Recorded 5 seconds after a user navigates to a YouTube page. This event is sent only once per session. Refreshing or opening a new tab will start a new session. Navigating through videos without refreshing (aka SPA navigation) will not trigger another event.",
      data: {
        description: "Data about the YouTube navigation event",
        type: "object",
        properties: {
          userLoggedIn: {
            description: "Indicates whether the user is logged in to a YouTube account. '1' for logged in, '0' for not logged in.",
            type: "string",
            enum: ["1", "0"]
          }
        }
      }
    },
    yt_site_ad_shown: {
      description: "Recorded when a video ad on YouTube stops playing, either because it was skipped, the user navigated away, or it finished playing",
      data: {
        description: "Data for the YouTube ad shown event",
        type: "object",
        properties: {
          isAllowListed: {
            description: "Indicates whether the page is allowlisted. '1' for allowlisted, '0' for not allowlisted.",
            type: "string",
            enum: ["1", "0"]
          },
          isPremium: {
            description: "Specifies whether the user has a Premium subscription. Used to be called 'p' in getadblock.logs_unified.logs_fact",
            type: "boolean"
          },
          adFormat: {
            description: "Format ID of the displayed ad. Used to be called 'category' in getadblock.logs_unified.logs_fact",
            type: "string"
          },
          totalAdDurationMs: {
            description: "Total duration of the ad, in milliseconds. Used to be called 'bc' in getadblock.logs_unified.logs_fact",
            type: "number"
          },
          adShownDurationMs: {
            description: "Actual playback duration of the ad, in milliseconds. Used to be called 'amount' in getadblock.logs_unified.logs_fact",
            type: "number"
          }
        }
      }
    },
    yt_site_ad_wall_detected: {
      description: "Recorded when the YouTube ad wall is detected and the page is not yet allowlisted.",
      data: {
        description: "Data for YouTube ad wall detection when the page is not yet allowlisted",
        type: "object",
        properties: {
          adwallCategory: {
            description: "The ad wall type: 'soft' (dismiss button) or 'hard' (no dismiss button).",
            type: "string",
            enum: ["soft", "hard"]
          },
          userLoggedIn: {
            description: "String flag indicating whether the user is logged in to a YouTube account ('1' if logged in, otherwise '0').",
            type: "string",
            enum: ["1", "0"]
          },
          isAllowListed: {
            description: "String flag indicating whether the page is allowlisted ('1' if allowlisted, otherwise '0'). Should always be '0' for this event.",
            type: "string",
            enum: ["1", "0"]
          },
          allowlistScope: {
            description: "Scope of the applied allowlist rule: 'video' (single video url) or 'tab' (all videos until the tab is closed).",
            type: "string",
            enum: ["video", "tab"]
          }
        }
      }
    },
    yt_site_already_allowlisted: {
      description: "Recorded when the YouTube ad wall is detected, but the page was already allowlisted.",
      data: {
        description: "Data for YouTube ad wall detection when the page is already allowlisted",
        type: "object",
        properties: {
          adwallCategory: {
            description: "The ad wall type: 'soft' (dismiss button) or 'hard' (no dismiss button).",
            type: "string",
            enum: ["soft", "hard"]
          },
          userLoggedIn: {
            description: "String flag indicating whether the user is logged in to a YouTube account ('1' if logged in, otherwise '0').",
            type: "string",
            enum: ["1", "0"]
          },
          isAllowListed: {
            description: "String flag indicating whether the page is allowlisted ('1' if allowlisted, otherwise '0'). Should always be '1' for this event.",
            type: "string",
            enum: ["1", "0"]
          },
          allowlistScope: {
            description: "Scope of the applied allowlist rule: 'video' (single video url) or 'tab' (all videos until the tab is closed).",
            type: "string",
            enum: ["video", "tab"]
          }
        }
      }
    },
    yt_auto_allowlisted: {
      description: "Recorded immediately after the extension automatically allowlists a YouTube page in response to an ad wall.",
      data: {
        description: "Data for the YouTube auto allowlisted event",
        type: "object",
        properties: {
          allowlistScope: {
            description: "Scope of the applied allowlist rule: 'video' (single video url) or 'tab' (all videos until the tab is closed).",
            type: "string",
            enum: ["video", "tab"]
          }
        }
      }
    },
    yt_site_toast_shown: {
      description: "Recorded when the YouTube 'ad blocker' toast notification appears in the DOM. This is an experiment ran by YouTube that only appears for certain adblocking users, warning them that their adblocker might be causing interruptions.",
      data: {
        description: "Data for the YouTube toast shown event",
        type: "object",
        properties: {
          isAllowListed: {
            description: "String flag indicating whether the page is allowlisted ('1' if allowlisted, otherwise '0').",
            type: "string",
            enum: ["1", "0"]
          },
          isPremium: {
            description: "Specifies whether the user has a Premium subscription",
            type: "boolean"
          }
        }
      }
    },
    yt_site_context_tampering: {
      description: "Recorded when the YouTube error_204 beacon indicates a possible script conflict that could interfere with the extension.",
      data: {
        description: "Data for the YouTube context tampering event",
        type: "object",
        properties: {
          isAllowListed: {
            description: "String flag indicating whether the page is allowlisted ('1' if allowlisted, otherwise '0').",
            type: "string",
            enum: ["1", "0"]
          },
          isPremium: {
            description: "Specifies whether the user has a Premium subscription",
            type: "boolean"
          },
          applicationVersion: {
            description: "YouTube client version from the client.version query param on the error_204 request.",
            type: "string"
          }
        }
      }
    },
    yt_site_yt_error: {
      description: "This event is triggered in the event of an error on YouTube. There could be multiple types of errors happening on the page, so we try to differentiate them via the category parameter.",
      data: {
        description: "Data for the YouTube error event",
        type: "object",
        properties: {
          category: {
            description: "Indicates the error type as defined in our extension code. It can be one of the following: 'uncaught_exception', 'player_error' or 'sww_error'.",
            type: "string",
            enum: ["uncaught_exception", "player_error", "sww_error"]
          },
          applicationVersion: {
            description: "The client version of the YouTube application (e.g., '2.20251020.01.00').",
            type: "string"
          },
          error: {
            description: "Indicates the exception type of JavaScript error, captured by the YouTube error handler (e.g., 'TypeError').",
            type: "string"
          },
          errorMsg: {
            description: "Either the stack trace of the error or an empty string.",
            type: "string"
          },
          isAllowListed: {
            description: "String flag indicating whether the site is allowlisted ('1' if allowlisted, otherwise '0').",
            type: "string",
            enum: ["1", "0"]
          },
          isPremium: {
            description: "Specifies whether the user has a Premium subscription.",
            type: "boolean"
          }
        }
      }
    }
  },
  conflict_detection: {
    bt_loader_blocked: {
      description: "Recorded on every website when the script from Blockthrough fails to load. BTLoader initiates ad recovery for users who allow Acceptable Ads, enabling monetization. This event indicates the script was blocked, which can happen when the user has disabled Acceptable Ads, installed another ad blocker that blocks BTLoader, or allowlisted the page. When BTLoader is blocked, ad recovery cannot occur and monetization is lost.",
      data: {
        description: "Data about why BTLoader was blocked",
        type: "object",
        properties: {
          isPageAllowlisted: {
            description: "Whether the page is allowlisted",
            type: "boolean"
          },
          aaListsStatus: {
            description: "The status of the Acceptable Ads lists. 0: none, 1: AA, 2: AA Privacy, 3: both",
            type: "number"
          },
          errorMsg: {
            description: "Browser string indicating the error that occurred",
            type: "string"
          }
        }
      }
    },
    bt_loader_success: {
      description: "Recorded on every website when the script from Blockthrough successfully loads. BTLoader initiates ad recovery for users who allow Acceptable Ads, enabling monetization. This event confirms that ad recovery can proceed normally on this page.",
      data: {
        description: "Data about the BTLoader success event",
        type: "object",
        properties: {
          isPageAllowlisted: {
            description: "Whether the page is allowlisted",
            type: "boolean"
          },
          aaListsStatus: {
            description: "The status of the Acceptable Ads lists. 0: none, 1: AA, 2: AA Privacy, 3: both",
            type: "number"
          }
        }
      }
    },
    aa_bait1_blocked: {
      description: "Acceptable Ads bait 1 was blocked",
      data: {
        description: "Data about why Acceptable Ads bait 1 was blocked",
        type: "object",
        properties: {
          isPageAllowlisted: {
            description: "Whether the page is allowlisted",
            type: "boolean"
          },
          aaListsStatus: {
            description: "The status of the Acceptable Ads lists. 0: none, 1: AA, 2: AA Privacy, 3: both",
            type: "number"
          },
          errorMsg: {
            description: "Browser string indicating the error that occurred",
            type: "string"
          }
        }
      }
    },
    aa_bait1_success: {
      description: "Acceptable Ads bait 1 was successfully loaded",
      data: {
        description: "Data about the Acceptable Ads bait 1 success event",
        type: "object",
        properties: {
          isPageAllowlisted: {
            description: "Whether the page is allowlisted",
            type: "boolean"
          },
          aaListsStatus: {
            description: "The status of the Acceptable Ads lists. 0: none, 1: AA, 2: AA Privacy, 3: both",
            type: "number"
          }
        }
      }
    },
    aa_bait2_blocked: {
      description: "Acceptable Ads bait 2 was blocked",
      data: {
        description: "Data about why Acceptable Ads bait 2 was blocked",
        type: "object",
        properties: {
          isPageAllowlisted: {
            description: "Whether the page is allowlisted",
            type: "boolean"
          },
          aaListsStatus: {
            description: "The status of the Acceptable Ads lists. 0: none, 1: AA, 2: AA Privacy, 3: both",
            type: "number"
          },
          errorMsg: {
            description: "Browser string indicating the error that occurred",
            type: "string"
          }
        }
      }
    },
    aa_bait2_success: {
      description: "Acceptable Ads bait 2 was successfully loaded",
      data: {
        description: "Data about the Acceptable Ads bait 2 success event",
        type: "object",
        properties: {
          isPageAllowlisted: {
            description: "Whether the page is allowlisted",
            type: "boolean"
          },
          aaListsStatus: {
            description: "The status of the Acceptable Ads lists. 0: none, 1: AA, 2: AA Privacy, 3: both",
            type: "number"
          }
        }
      }
    },
    aa_other_blocked: {
      description: "Acceptable Ads filters on Amazon, Yahoo, LinkedIn, Outlook were blocked",
      data: {
        description: "Data about why Acceptable Ads filters were blocked",
        type: "object",
        properties: {
          isPageAllowlisted: {
            description: "Whether the page is allowlisted",
            type: "boolean"
          },
          aaListsStatus: {
            description: "The status of the Acceptable Ads lists. 0: none, 1: AA, 2: AA Privacy, 3: both",
            type: "number"
          },
          errorMsg: {
            description: "Browser string indicating the error that occurred",
            type: "string"
          }
        }
      }
    },
    aa_other_success: {
      description: "Acceptable Ads filters on Amazon, Yahoo, LinkedIn, Outlook were successfully loaded",
      data: {
        description: "Data about the Acceptable Ads filters success event",
        type: "object",
        properties: {
          isPageAllowlisted: {
            description: "Whether the page is allowlisted",
            type: "boolean"
          },
          aaListsStatus: {
            description: "The status of the Acceptable Ads lists. 0: none, 1: AA, 2: AA Privacy, 3: both",
            type: "number"
          }
        }
      }
    }
  },
  cohorts: {
    facts_snapshot: {
      description: "Cohorts facts snapshot used for cohort estimation",
      data: {
        description: "The updated facts",
        type: "object",
        properties: {
          extName: {
            description: "The name of the extension",
            type: "string"
          },
          extVersion: {
            description: "The version of the extension",
            type: "string"
          },
          browserName: {
            description: "The name of the browser",
            type: "string"
          },
          browserLanguage: {
            description: "The language of the browser",
            type: "string"
          },
          countryCode: {
            description: "The 2-letter country code of the user",
            type: "string"
          },
          aaEnabled: {
            description: "Whether Acceptable Ads is enabled",
            type: "boolean"
          },
          installType: {
            description: "The installation type of the extension",
            type: "string"
          },
          hasPremium: {
            description: "Whether the user has a premium subscription",
            type: "boolean"
          },
          installDate: {
            description: "The timestamp when the extension was installed",
            type: "number"
          },
          blockedCount: {
            description: "The number of blocked requests",
            type: "number"
          }
        }
      }
    }
  },
  dnr_filters: {
    recreated_dnr_rules: {
      description: "On extension upgrade, our DNR filter management module will compare the dynamic DNR rules that the browser has with the filters that we know about. If these do not match, we recreate the DNR rules and log this report.",
      data: {
        description: "Report on the before and after state of the recreation",
        type: "object",
        properties: {
          recreateStats: {
            description: "Stats on how many DNR rules were recreated",
            type: "object",
            properties: {
              recreatedRulesCount: {
                description: "How many DNR rules were recreated",
                type: "integer"
              },
              removedRulesCount: {
                description: "How many existing DNR rules were removed",
                type: "integer"
              }
            }
          },
          checkResultBefore: {
            description: "Results of the data integrity check done before recreating the DNR rules.",
            type: "object",
            properties: {
              valid: {
                description: "True if the data integrity check passed. We only do the recreation if it failed, so this would be expected to always be false.",
                type: "boolean"
              },
              extraRulesInDNRCount: {
                description: "Count of the number of active dynamic DNR rules which we do not expect to see",
                type: "integer"
              },
              missingRulesInDNRCount: {
                description: "Count of the number of rules that our filters expected to exist but didn't",
                type: "integer"
              }
            }
          },
          checkResultAfter: {
            description: "Results of the data integrity check done after recreating the DNR rules.",
            type: "object",
            properties: {
              valid: {
                description: "True if the data integrity check passed. We expect this to be true after the rule recreation has run.",
                type: "boolean"
              },
              extraRulesInDNRCount: {
                description: "Count of the number of active dynamic DNR rules which we do not expect to see. We expect this to be 0 after the rule recreation has run.",
                type: "integer"
              },
              missingRulesInDNRCount: {
                description: "Count of the number of rules that our filters expected to exist but didn't. We expect this to be 0 after the rule recreation has run.",
                type: "integer"
              }
            }
          }
        }
      }
    },
    exceeded_static_rule_count_limit: {
      description: "Debug log when someone runs into the 'set of enabled rulesets exceeds the rule count limit' error when enabling static rulesets",
      data: {
        description: "Data on the current state of static rules and the rulesets being enabled or disabled. Rule counts refer to static DNR rules, bundled in the extension at build time in rulesets.",
        type: "object",
        properties: {
          enableRulesetIds: {
            description: "Ruleset IDs that were to be enabled",
            type: "array",
            items: {
              type: "string"
            }
          },
          enableRuleCount: {
            description: "Static rules that we are trying to enable",
            type: "integer"
          },
          disableRulesetIds: {
            description: "Ruleset IDs that were to be disabled",
            type: "array",
            items: {
              type: "string"
            }
          },
          disableRuleCount: {
            description: "Static rules that we are trying to disable",
            type: "integer"
          },
          currentEnabledRulesetIdsBefore: {
            description: "Currently enabled ruleset IDs, gathered before calling updateEnabledRulesets",
            type: "array",
            items: {
              type: "string"
            }
          },
          currentEnabledRulesetIdsAfter: {
            description: "Currently enabled ruleset IDs, gathered after calling updateEnabledRulesets",
            type: "array",
            items: {
              type: "string"
            }
          },
          currentEnabledRuleCountBefore: {
            description: "Used static rules, gathered before calling updateEnabledRulesets",
            type: "integer"
          },
          currentEnabledRuleCountAfter: {
            description: "Used static rules, gathered after calling updateEnabledRulesets",
            type: "integer"
          },
          availableRuleCountBefore: {
            description: "Available static rules, gathered before calling updateEnabledRulesets",
            type: "integer"
          },
          availableRuleCountAfter: {
            description: "Available static rules, gathered after calling updateEnabledRulesets",
            type: "integer"
          }
        }
      }
    }
  },
  in_product_messaging: {
    command_received: {
      description: "Extension received a valid IPM command from the remote config",
      data: {
        description: "IPM command ID",
        type: "string"
      }
    }
  },
  initialization: {
    initialization_complete: {
      description: "The extension has finished initializing without any errors",
      data: {
        description: "Data about the initialized system",
        type: "object",
        properties: {
          subscriptionsCount: {
            description: "The number of subscriptions the user has active",
            type: "number"
          },
          availableStaticRuleCount: {
            description: "The number of DNR static rules that the user has available, or null for MV2 extensions",
            type: ["number", "null"]
          },
          timings: {
            description: "Profiling information about startup performance",
            type: "object",
            properties: {
              marks: {
                type: "array",
                description: "Specific points in time when something happened",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      description: "Name of the initialization step",
                      type: "string"
                    },
                    startTime: {
                      description: "Milliseconds elapsed since the service worker started",
                      type: "number"
                    }
                  }
                }
              },
              measures: {
                type: "array",
                description: "Measurements of how long steps took",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      description: "Name of the initialization step",
                      type: "string"
                    },
                    startTime: {
                      description: "When the measure started, in milliseconds elapsed since the service worker started",
                      type: "number"
                    },
                    duration: {
                      description: "Duration that the step took in milliseconds",
                      type: "number"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    initialization_error: {
      description: "Errors recorded during the initialization of the extension",
      data: {
        description: "Data about the initializion error",
        type: "object",
        properties: {
          errorMsg: {
            description: "The error message that was recorded",
            type: "string"
          },
          hasInternalError: {
            description: "Whether or not the error string matched 'internal error' which indicates that it is a browser error",
            type: "boolean"
          },
          timings: {
            description: "Profiling information about startup performance",
            type: "object",
            properties: {
              marks: {
                type: "array",
                description: "Specific points in time when something happened",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      description: "Name of the initialization step",
                      type: "string"
                    },
                    startTime: {
                      description: "Milliseconds elapsed since the service worker started",
                      type: "number"
                    }
                  }
                }
              },
              measures: {
                type: "array",
                description: "Measurements of how long steps took",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      description: "Name of the initialization step",
                      type: "string"
                    },
                    startTime: {
                      description: "When the measure started, in milliseconds elapsed since the service worker started",
                      type: "number"
                    },
                    duration: {
                      description: "Duration that the step took in milliseconds",
                      type: "number"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    zero_subs_reset: {
      description: "Event logged when subscriptions are reset to defaults due to zero enabled subscriptions",
      data: {
        description: "Debug metadata about the subscription reset",
        type: "object",
        properties: {
          subs: {
            description: "The total number of subscriptions after reset",
            type: "number"
          },
          enabledSubs: {
            description: "The number of enabled subscriptions after reset",
            type: "number"
          },
          enabledRulesets: {
            description: "The number of enabled DNR rulesets after reset",
            type: "number"
          },
          totalUserFilters: {
            description: "The total number of user filters after reset",
            type: "number"
          },
          dynamicRules: {
            description: "The number of dynamic DNR rules after reset",
            type: "number"
          },
          dataCorrupted: {
            description: "Whether the data is corrupted. True if the extension has detected that storage has thrown an error.",
            type: "boolean"
          },
          firstRun: {
            description: "Whether this is the first run of the extension based on the number of subscriptions and user filters.",
            type: "boolean"
          },
          reinitialized: {
            description: "Whether the extension was reinitialized before reset.",
            type: "boolean"
          },
          errorMsg: {
            description: "An error that occurred when readding subscriptions, if any",
            type: ["string", "null"]
          },
          lastErrorMsg: {
            description: "The last error in the browser runtime, if any",
            type: ["string", "null"]
          }
        }
      }
    }
  },
  customer_lifecycle: {
    new_install_normal: {
      description: "The extension was installed from the browser's official web store (Chrome Web Store, Firefox Add-ons, Microsoft Edge Add-ons)"
    },
    new_install_development: {
      description: "The extension was installed manually in development mode, either as an unpacked directory or from a local .zip/.crx/.xpi package"
    },
    new_install_admin: {
      description: "The extension was installed and managed by an administrator through a policy setting"
    },
    new_install_sideload: {
      description: "The extension was installed by other software on the user's computer"
    },
    new_install_other: {
      description: "The extension was installed through an unrecognized method not covered by other install types(normal/development/admin/sideload)"
    },
    new_install_unknown: {
      description: "The extension was installed but the installation type could not be determined"
    },
    trial_license_expired: {
      description: "The premium trial license has expired"
    }
  },
  new_tab: {
    command_ready: {
      description: "'create_tab' IPM command has passed all checks and new tab is going to be created at the next possible opportunity",
      data: {
        description: "IPM command ID",
        type: "string"
      }
    },
    tab_created: {
      description: "A tab has been created for the IPM command",
      data: {
        description: "IPM command ID",
        type: "string"
      }
    },
    tab_loaded: {
      description: "The contents of the tab for the IPM command have been loaded",
      data: {
        description: "IPM command ID",
        type: "string"
      }
    }
  },
  onpage_dialog: {
    command_ready: {
      description: "'create_on_page_dialog' IPM command has passed all checks and on-page dialog is going to be created at the next possible opportunity",
      data: {
        description: "IPM command ID",
        type: "string"
      }
    },
    dialog_button_clicked: {
      description: "The user clicked on the button presented on the dialog",
      data: {
        description: "IPM command ID",
        type: "string"
      }
    },
    dialog_closed: {
      description: "The user closed the dialog by clicking the close icon in the dialog header",
      data: {
        description: "IPM command ID",
        type: "string"
      }
    },
    dialog_ignored: {
      description: "The user did not interact with the dialog while being injected into the page, and the dialog no longer can be interacted with",
      data: {
        description: "IPM command ID",
        type: "string"
      }
    },
    dialog_injected: {
      description: "The extension injected the dialog into the page and rendered it. This doesn't mean that the dialog is visible to the user, or that it looks as expected",
      data: {
        description: "IPM command ID",
        type: "string"
      }
    }
  },
  test_ewe_background: {
    test_event: {
      description: "TEST: A logging test event for various types of data",
      data: {
        description: "Arbitrary test data",
        type: "any"
      }
    },
    test_event_no_data: {
      description: "TEST: A logging test event that has no associated data"
    }
  },
  test_ewe_content_api: {
    test_got_experiment_flag: {
      description: "TEST: In the content test script, an experiment was loaded",
      data: {
        description: "Information about the loaded experiment",
        type: "object",
        properties: {
          flagName: {
            description: "The flag name that was loaded",
            type: "string"
          },
          flag: {
            description: "The loaded value",
            type: "any"
          }
        }
      }
    }
  },
  test_ewe_ui_api: {
    test_message_received: {
      description:
        "TEST: A logger test event indicating the UI page received a request to log",
      data: {
        description: "The data sent to the test listener",
        type: "any"
      }
    },
    test_event: {
      description: "TEST: A logging test event for various types of data",
      data: {
        description: "Arbitrary test data",
        type: "any"
      }
    },
    test_event_no_data: {
      description: "TEST: A logging test event that has no associated data"
    }
  }
});

;// ./src/all/telemetry.js
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



const DEBUG = 1;
const INFO = 2;
const BEHAVIOR = 3;
const WARN = 4;
const OFF = 5;

/**
 * Map of log names (eg 'debug') to their internal numeric representation. The
 * numbers represent a verbosity level, where 1 is the most verbose and 5 is the
 * least.
 */
const logLevelNamesToNumbers = {
  debug: DEBUG,
  info: INFO,
  behavior: BEHAVIOR,
  warn: WARN,
  off: OFF
};

/**
 * Map of log numeric representation back to their name. This can be used to
 * format log messages.
 */
const logLevelNumbersToNames = Object.fromEntries(
  Object.entries(logLevelNamesToNumbers).map(([key, value]) => [value, key])
);

function isPlainObject(obj) {
  if (obj === null || typeof obj !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(obj);
  return proto === Object.prototype || proto === null;
}

function isSerializableToJson(data, seen = new WeakSet()) {
  let type = typeof data;
  if (data === null || type == "undefined" || type == "string" || type == "boolean") {
    return true;
  }

  if (type == "number") {
    return Number.isFinite(data);
  }

  if (isPlainObject(data)) {
    if (seen.has(data)) {
      return false;
    }
    seen.add(data);
    return Object.values(data).every(x => isSerializableToJson(x, seen));
  }

  if (Array.isArray(data)) {
    if (seen.has(data)) {
      return false;
    }
    seen.add(data);
    return data.every(x => isSerializableToJson(x, seen));
  }

  return false;
}

function matchesEventSchema(data, dataSchema) {
  let dataType = typeof data;
  if (dataType === "undefined" || !dataSchema) {
    // if either is undefined (or null), then they must both be undefined.
    return (dataType === "undefined" || data === null) && !dataSchema;
  }

  let types = dataSchema.type;
  if (typeof types === "string") {
    types = [types];
  }

  let typeMatches = types.some(type => {
    switch (type) {
      case "any":
        return true;

      case "boolean":
      case "number":
      case "string":
        return dataType === type;

      case "null":
        return data === null;

      case "integer":
        return Number.isInteger(data);

      case "object":
        return isPlainObject(data) &&
          Object.keys(dataSchema.properties).every(key =>
            matchesEventSchema(data[key], dataSchema.properties[key])
          );

      case "array":
        return Array.isArray(data) && data.every(item =>
          matchesEventSchema(item, dataSchema.items)
        );
    }
    return false;
  });

  if (!typeMatches) {
    return false;
  }

  // After type validation passes, check enum constraint if defined
  if (typeof dataSchema.enum !== "undefined") {
    if (!dataSchema.enum.includes(data)) {
      return false;
    }
  }

  return true;
}

/**
 * Represents a logger. This will provide the API for the logger, and will
 * validate the logged events are as they appear in core/sdk/events.js, but will
 * not itself do any of the actual logging.
 *
 * This is not expected to be instantiated directly, but
 * should rather be extended. Child classes should implement the _validatedLog
 * function.
 *
 * @param {string} module The module that this logger is for.
 */
class AbstractLogger {
  constructor(module, defaultEvents = events) {
    this._module = module;
    this._events = defaultEvents;

    if (!this._events[this._module]) {
      console.error(`Unknown module: ${module}. ` +
                    "Did you remember to add it to core/sdk/events.js?");
    }
  }

  _log(level, event, data, ipmId) {
    if (!this._events[this._module]) {
      return;
    }

    if (!this._events[this._module][event]) {
      console.error(`Unknown event: ${event} in module: ${this._module}. ` +
        "Did you remember to add it to core/sdk/events.js?");
      return;
    }

    if (!isSerializableToJson(data)) {
      console.error(`Data for event: ${event} in module: ${this._module} cannot be serialized to JSON.`);
      return;
    }

    const dataSchema = this._events[this._module][event].data;
    if (!matchesEventSchema(data, dataSchema)) {
      console.error(`Data for event: ${event} in module: ${this._module} does not match the schema ` +
        "provided in core/sdk/events.js. ", {data, dataSchema});
      return;
    }

    const logTime = new Date().toISOString();
    this._validatedLog(logTime, level, event, data, ipmId);
  }

  _validatedLog(logTime, level, event, data, ipmId) {
  }

  /**
   * Creates a debug log.
   *
   * @param {string} event The name of the event to log. This should be unique.
   * @param {string|number|object|array|boolean|null} [data]
   *    The dynamic data relevant to the event.
   */
  debug(event, data) {
    this._log(DEBUG, event, data);
  }

  /**
   * Creates an info log.
   *
   * @param {string} event The name of the event to log. This should be unique.
   * @param {string|number|object|array|boolean|null} [data]
   *    The dynamic data relevant to the event.
   */
  info(event, data) {
    this._log(INFO, event, data);
  }

  /**
   * Creates a behaviour log.
   *
   * @param {string} event The name of the event to log. This should be unique.
   * @param {string|number|object|array|boolean|null} [data]
   *    The dynamic data relevant to the event.
   * @param {string} [ipmId] Optional IPM ID to associate with this event.
   */
  behavior(event, data, ipmId) {
    this._log(BEHAVIOR, event, data, ipmId);
  }

  /**
   * Creates a warn log.
   *
   * @param {string} event The name of the event to log. This should be unique.
   * @param {string|number|object|array|boolean|null} [data]
   *    The dynamic data relevant to the event.
   */
  warn(event, data) {
    this._log(WARN, event, data);
  }
}

;// ./src/front/telemetry.js
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
 * Represents a server logger. This is used to send data to a our telemetry
 * server. The exact URL will be configured by the telemetry module in the
 * background script. Console logging is also provided for convenience.
 *
 * @param {string} module The module that this logger is for.
 */
class ServerLogger extends AbstractLogger {
  constructor(module) {
    super(module);
  }

  _validatedLog(logTime, level, event, data) {
    void ignoreNoConnectionError(
      browser_polyfill.runtime.sendMessage({
        type: "ewe:telemetry-log",
        logTime,
        module: this._module,
        level,
        event,
        data
      })
    );
  }
}

/**
 * API to interact with the telemetry module
 * @namespace telemetry
 */
/* harmony default export */ const telemetry = ({
  ServerLogger
});

;// ./src/ui/index.js
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






/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/* harmony import */ var _eyeo_webext_ad_filtering_solution_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2181);
/* harmony import */ var _eyeo_webext_ad_filtering_solution_ui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_eyeo_webext_ad_filtering_solution_ui__WEBPACK_IMPORTED_MODULE_0__);

async function bootstrap() {
    _eyeo_webext_ad_filtering_solution_ui__WEBPACK_IMPORTED_MODULE_0__.sentry.start();
}
void bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=popup.js.map