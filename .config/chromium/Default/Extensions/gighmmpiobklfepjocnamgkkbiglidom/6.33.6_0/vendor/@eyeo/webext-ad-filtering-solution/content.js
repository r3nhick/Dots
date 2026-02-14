/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 7159:
/***/ ((__unused_webpack_module, exports) => {

/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */

/** @module */



let textToRegExp =
/**
 * Converts raw text into a regular expression string
 * @param {string} text the string to convert
 * @return {string} regular expression representation of the text
 * @package
 */
exports.textToRegExp = text => text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

const regexpRegexp = /^\/(.*)\/([imu]*)$/;

/**
 * Make a regular expression from a text argument.
 *
 * If it can be parsed as a regular expression, parse it and the flags.
 *
 * @param {string} text the text argument.
 *
 * @return {?RegExp} a RegExp object or null in case of error.
 */
exports.makeRegExpParameter = function makeRegExpParameter(text) {
  let [, source, flags] = regexpRegexp.exec(text) || [null, textToRegExp(text)];

  try {
    return new RegExp(source, flags);
  }
  catch (e) {
    return null;
  }
};

let splitSelector = exports.splitSelector = function splitSelector(selector) {
  if (!selector.includes(",")) {
    return [selector];
  }

  let selectors = [];
  let start = 0;
  let level = 0;
  let sep = "";

  for (let i = 0; i < selector.length; i++) {
    let chr = selector[i];

    // ignore escaped characters
    if (chr == "\\") {
      i++;
    }
    // don't split within quoted text
    else if (chr == sep) {
      sep = "";             // e.g. [attr=","]
    }
    else if (sep == "") {
      if (chr == '"' || chr == "'") {
        sep = chr;
      }
      // don't split between parentheses
      else if (chr == "(") {
        level++;            // e.g. :matches(div,span)
      }
      else if (chr == ")") {
        level = Math.max(0, level - 1);
      }
      else if (chr == "," && level == 0) {
        selectors.push(selector.substring(start, i));
        start = i + 1;
      }
    }
  }

  selectors.push(selector.substring(start));
  return selectors;
};

function findTargetSelectorIndex(selector) {
  let index = 0;
  let whitespace = 0;
  let scope = [];

  // Start from the end of the string and go character by character, where each
  // character is a Unicode code point.
  for (let character of [...selector].reverse()) {
    let currentScope = scope[scope.length - 1];

    if (character == "'" || character == "\"") {
      // If we're already within the same type of quote, close the scope;
      // otherwise open a new scope.
      if (currentScope == character) {
        scope.pop();
      }
      else {
        scope.push(character);
      }
    }
    else if (character == "]" || character == ")") {
      // For closing brackets and parentheses, open a new scope only if we're
      // not within a quote. Within quotes these characters should have no
      // meaning.
      if (currentScope != "'" && currentScope != "\"") {
        scope.push(character);
      }
    }
    else if (character == "[") {
      // If we're already within a bracket, close the scope.
      if (currentScope == "]") {
        scope.pop();
      }
    }
    else if (character == "(") {
      // If we're already within a parenthesis, close the scope.
      if (currentScope == ")") {
        scope.pop();
      }
    }
    else if (!currentScope) {
      // At the top level (not within any scope), count the whitespace if we've
      // encountered it. Otherwise if we've hit one of the combinators,
      // terminate here; otherwise if we've hit a non-colon character,
      // terminate here.
      if (/\s/.test(character)) {
        whitespace++;
      }
      else if ((character == ">" || character == "+" || character == "~") ||
               (whitespace > 0 && character != ":")) {
        break;
      }
    }

    // Zero out the whitespace count if we've entered a scope.
    if (scope.length > 0) {
      whitespace = 0;
    }

    // Increment the index by the size of the character. Note that for Unicode
    // composite characters (like emoji) this will be more than one.
    index += character.length;
  }

  return selector.length - index + whitespace;
}

/**
 * Qualifies a CSS selector with a qualifier, which may be another CSS selector
 * or an empty string. For example, given the selector "div.bar" and the
 * qualifier "#foo", this function returns "div#foo.bar".
 * @param {string} selector The selector to qualify.
 * @param {string} qualifier The qualifier with which to qualify the selector.
 * @returns {string} The qualified selector.
 * @package
 */
exports.qualifySelector = function qualifySelector(selector, qualifier) {
  let qualifiedSelector = "";

  let qualifierTargetSelectorIndex = findTargetSelectorIndex(qualifier);
  let [, qualifierType = ""] =
    /^([a-z][a-z-]*)?/i.exec(qualifier.substring(qualifierTargetSelectorIndex));

  for (let sub of splitSelector(selector)) {
    sub = sub.trim();

    qualifiedSelector += ", ";

    let index = findTargetSelectorIndex(sub);

    // Note that the first group in the regular expression is optional. If it
    // doesn't match (e.g. "#foo::nth-child(1)"), type will be an empty string.
    let [, type = "", rest] =
      /^([a-z][a-z-]*)?\*?(.*)/i.exec(sub.substring(index));

    if (type == qualifierType) {
      type = "";
    }

    // If the qualifier ends in a combinator (e.g. "body #foo>"), we put the
    // type and the rest of the selector after the qualifier
    // (e.g. "body #foo>div.bar"); otherwise (e.g. "body #foo") we merge the
    // type into the qualifier (e.g. "body div#foo.bar").
    if (/[\s>+~]$/.test(qualifier)) {
      qualifiedSelector += sub.substring(0, index) + qualifier + type + rest;
    }
    else {
      qualifiedSelector += sub.substring(0, index) + type + qualifier + rest;
    }
  }

  // Remove the initial comma and space.
  return qualifiedSelector.substring(2);
};


/***/ }),

/***/ 1267:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;
/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */

/** @module */



const {makeRegExpParameter, splitSelector,
       qualifySelector} = __webpack_require__(7159);
const {filterToRegExp} = __webpack_require__(453);

const DEFAULT_MIN_INVOCATION_INTERVAL = 3000;
let minInvocationInterval = DEFAULT_MIN_INVOCATION_INTERVAL;
const DEFAULT_MAX_SYCHRONOUS_PROCESSING_TIME = 50;
let maxSynchronousProcessingTime = DEFAULT_MAX_SYCHRONOUS_PROCESSING_TIME;

const abpSelectorRegexp = /:(-abp-[\w-]+|has|has-text|xpath|not)\(/;

let testInfo = null;

function toCSSStyleDeclaration(value) {
  return Object.assign(document.createElement("test"), {style: value}).style;
}

/**
 * Enables test mode, which tracks additional metadata about the inner
 * workings for test purposes. This also allows overriding internal
 * configuration.
 *
 * @param {object} options
 * @param {number} options.minInvocationInterval Overrides how long
 *   must be waited between filter processing runs
 * @param {number} options.maxSynchronousProcessingTime Overrides how
 *   long the thread may spend processing filters before it must yield
 *   its thread
 */
__webpack_unused_export__ = function setTestMode(options) {
  if (typeof options.minInvocationInterval !== "undefined") {
    minInvocationInterval = options.minInvocationInterval;
  }
  if (typeof options.maxSynchronousProcessingTime !== "undefined") {
    maxSynchronousProcessingTime = options.maxSynchronousProcessingTime;
  }

  testInfo = {
    lastProcessedElements: new Set(),
    failedAssertions: []
  };
};

__webpack_unused_export__ = function getTestInfo() {
  return testInfo;
};

__webpack_unused_export__ = function() {
  minInvocationInterval = DEFAULT_MIN_INVOCATION_INTERVAL;
  maxSynchronousProcessingTime = DEFAULT_MAX_SYCHRONOUS_PROCESSING_TIME;
  testInfo = null;
};

/**
 * Creates a new IdleDeadline.
 *
 * Note: This function is synchronous and does NOT request an idle
 * callback.
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline}.
 * @return {IdleDeadline}
 */
function newIdleDeadline() {
  let startTime = performance.now();
  return {
    didTimeout: false,
    timeRemaining() {
      let elapsed = performance.now() - startTime;
      let remaining = maxSynchronousProcessingTime - elapsed;
      return Math.max(0, remaining);
    }
  };
}

/**
 * Returns a promise that is resolved when the browser is next idle.
 *
 * This is intended to be used for long running tasks on the UI thread
 * to allow other UI events to process.
 *
 * @return {Promise.<IdleDeadline>}
 *    A promise that is fulfilled when you can continue processing
 */
function yieldThread() {
  return new Promise(resolve => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(resolve);
    }
    else {
      setTimeout(() => {
        resolve(newIdleDeadline());
      }, 0);
    }
  });
}


function getCachedPropertyValue(object, name, defaultValueFunc = () => {}) {
  let value = object[name];
  if (typeof value == "undefined") {
    Object.defineProperty(object, name, {value: value = defaultValueFunc()});
  }
  return value;
}

/**
 * Return position of node from parent.
 * @param {Node} node the node to find the position of.
 * @return {number} One-based index like for :nth-child(), or 0 on error.
 */
function positionInParent(node) {
  let index = 0;
  for (let child of node.parentNode.children) {
    if (child == node) {
      return index + 1;
    }

    index++;
  }

  return 0;
}

function makeSelector(node, selector = "") {
  if (node == null) {
    return null;
  }
  if (!node.parentElement) {
    let newSelector = ":root";
    if (selector) {
      newSelector += " > " + selector;
    }
    return newSelector;
  }
  let idx = positionInParent(node);
  if (idx > 0) {
    let newSelector = `${node.tagName}:nth-child(${idx})`;
    if (selector) {
      newSelector += " > " + selector;
    }
    return makeSelector(node.parentElement, newSelector);
  }

  return selector;
}

function parseSelectorContent(content, startIndex) {
  let parens = 1;
  let quote = null;
  let i = startIndex;
  for (; i < content.length; i++) {
    let c = content[i];
    if (c == "\\") {
      // Ignore escaped characters
      i++;
    }
    else if (quote) {
      if (c == quote) {
        quote = null;
      }
    }
    else if (c == "'" || c == '"') {
      quote = c;
    }
    else if (c == "(") {
      parens++;
    }
    else if (c == ")") {
      parens--;
      if (parens == 0) {
        break;
      }
    }
  }

  if (parens > 0) {
    return null;
  }
  return {text: content.substring(startIndex, i), end: i};
}

/**
 * Stringified style objects
 * @typedef {Object} StringifiedStyle
 * @property {string} style CSS style represented by a string.
 * @property {string[]} subSelectors selectors the CSS properties apply to.
 */

/**
 * Produce a string representation of the stylesheet entry.
 * @param {CSSStyleRule} rule the CSS style rule.
 * @return {StringifiedStyle} the stringified style.
 */
function stringifyStyle(rule) {
  let styles = [];
  for (let i = 0; i < rule.style.length; i++) {
    let property = rule.style.item(i);
    let value = rule.style.getPropertyValue(property);
    let priority = rule.style.getPropertyPriority(property);
    styles.push(`${property}: ${value}${priority ? " !" + priority : ""};`);
  }
  styles.sort();
  return {
    style: styles.join(" "),
    subSelectors: splitSelector(rule.selectorText)
  };
}

let scopeSupported = null;

function tryQuerySelector(subtree, selector, all) {
  let elements = null;
  try {
    elements = all ? subtree.querySelectorAll(selector) :
      subtree.querySelector(selector);
    scopeSupported = true;
  }
  catch (e) {
    // Edge doesn't support ":scope"
    scopeSupported = false;
  }
  return elements;
}

/**
 * Query selector.
 *
 * If it is relative, will try :scope.
 *
 * @param {Node} subtree the element to query selector
 * @param {string} selector the selector to query
 * @param {bool} [all=false] true to perform querySelectorAll()
 *
 * @returns {?(Node|NodeList)} result of the query. null in case of error.
 */
function scopedQuerySelector(subtree, selector, all) {
  if (selector[0] == ">") {
    selector = ":scope" + selector;
    if (scopeSupported) {
      return all ? subtree.querySelectorAll(selector) :
        subtree.querySelector(selector);
    }
    if (scopeSupported == null) {
      return tryQuerySelector(subtree, selector, all);
    }
    return null;
  }
  return all ? subtree.querySelectorAll(selector) :
    subtree.querySelector(selector);
}

function scopedQuerySelectorAll(subtree, selector) {
  return scopedQuerySelector(subtree, selector, true);
}

class PlainSelector {
  constructor(selector) {
    this._selector = selector;
    this.maybeDependsOnAttributes = /[#.:]|\[.+\]/.test(selector);
    this.maybeContainsSiblingCombinators = /[~+]/.test(selector);
  }

  /**
   * Generator function returning a pair of selector string and subtree.
   * @param {string} prefix the prefix for the selector.
   * @param {Node} subtree the subtree we work on.
   * @param {Node[]} [targets] the nodes we are interested in.
   */
  *getSelectors(prefix, subtree, targets) {
    yield [prefix + this._selector, subtree];
  }
}

const incompletePrefixRegexp = /[\s>+~]$/;

class NotSelector {
  constructor(selectors) {
    this._innerPattern = new Pattern(selectors);
  }

  get dependsOnStyles() {
    return this._innerPattern.dependsOnStyles;
  }

  get dependsOnCharacterData() {
    return this._innerPattern.dependsOnCharacterData;
  }

  get maybeDependsOnAttributes() {
    return this._innerPattern.maybeDependsOnAttributes;
  }

  *getSelectors(prefix, subtree, targets) {
    for (let element of this.getElements(prefix, subtree, targets)) {
      yield [makeSelector(element), element];
    }
  }

  /**
   * Generator function returning selected elements.
   * @param {string} prefix the prefix for the selector.
   * @param {Node} subtree the subtree we work on.
   * @param {Node[]} [targets] the nodes we are interested in.
   */
  *getElements(prefix, subtree, targets) {
    let actualPrefix = (!prefix || incompletePrefixRegexp.test(prefix)) ?
      prefix + "*" : prefix;
    let elements = scopedQuerySelectorAll(subtree, actualPrefix);
    if (elements) {
      for (let element of elements) {
        // If the element is neither an ancestor nor a descendant of one of the
        // targets, we can skip it.
        if (targets && !targets.some(target => element.contains(target) ||
                                               target.contains(element))) {
          yield null;
          continue;
        }

        if (testInfo) {
          testInfo.lastProcessedElements.add(element);
        }

        if (!this._innerPattern.matches(element, subtree)) {
          yield element;
        }

        yield null;
      }
    }
  }

  setStyles(styles) {
    this._innerPattern.setStyles(styles);
  }
}

class HasSelector {
  constructor(selectors) {
    this._innerPattern = new Pattern(selectors);
  }

  get dependsOnStyles() {
    return this._innerPattern.dependsOnStyles;
  }

  get dependsOnCharacterData() {
    return this._innerPattern.dependsOnCharacterData;
  }

  get maybeDependsOnAttributes() {
    return this._innerPattern.maybeDependsOnAttributes;
  }

  *getSelectors(prefix, subtree, targets) {
    for (let element of this.getElements(prefix, subtree, targets)) {
      yield [makeSelector(element), element];
    }
  }

  /**
   * Generator function returning selected elements.
   * @param {string} prefix the prefix for the selector.
   * @param {Node} subtree the subtree we work on.
   * @param {Node[]} [targets] the nodes we are interested in.
   */
  *getElements(prefix, subtree, targets) {
    let actualPrefix = (!prefix || incompletePrefixRegexp.test(prefix)) ?
      prefix + "*" : prefix;
    let elements = scopedQuerySelectorAll(subtree, actualPrefix);
    if (elements) {
      for (let element of elements) {
        // If the element is neither an ancestor nor a descendant of one of the
        // targets, we can skip it.
        if (targets && !targets.some(target => element.contains(target) ||
                                               target.contains(element))) {
          yield null;
          continue;
        }

        if (testInfo) {
          testInfo.lastProcessedElements.add(element);
        }

        for (let selector of this._innerPattern.evaluate(element, targets)) {
          if (selector == null) {
            yield null;
          }
          else if (scopedQuerySelector(element, selector)) {
            yield element;
          }
        }

        yield null;
      }
    }
  }

  setStyles(styles) {
    this._innerPattern.setStyles(styles);
  }
}

class XPathSelector {
  constructor(textContent) {
    this.dependsOnCharacterData = true;
    this.maybeDependsOnAttributes = true;

    let evaluator = new XPathEvaluator();
    this._expression = evaluator.createExpression(textContent, null);
  }

  *getSelectors(prefix, subtree, targets) {
    for (let element of this.getElements(prefix, subtree, targets)) {
      yield [makeSelector(element), element];
    }
  }

  *getElements(prefix, subtree, targets) {
    let {ORDERED_NODE_SNAPSHOT_TYPE: flag} = XPathResult;
    let elements = prefix ? scopedQuerySelectorAll(subtree, prefix) : [subtree];
    for (let parent of elements) {
      let result = this._expression.evaluate(parent, flag, null);
      for (let i = 0, {snapshotLength} = result; i < snapshotLength; i++) {
        yield result.snapshotItem(i);
      }
    }
  }
}

class ContainsSelector {
  constructor(textContent) {
    this.dependsOnCharacterData = true;

    this._regexp = makeRegExpParameter(textContent);
  }

  *getSelectors(prefix, subtree, targets) {
    for (let element of this.getElements(prefix, subtree, targets)) {
      yield [makeSelector(element), subtree];
    }
  }

  *getElements(prefix, subtree, targets) {
    let actualPrefix = (!prefix || incompletePrefixRegexp.test(prefix)) ?
      prefix + "*" : prefix;

    let elements = scopedQuerySelectorAll(subtree, actualPrefix);

    if (elements) {
      let lastRoot = null;
      for (let element of elements) {
        // For a filter like div:-abp-contains(Hello) and a subtree like
        // <div id="a"><div id="b"><div id="c">Hello</div></div></div>
        // we're only interested in div#a
        if (lastRoot && lastRoot.contains(element)) {
          yield null;
          continue;
        }

        lastRoot = element;

        if (targets && !targets.some(target => element.contains(target) ||
                                               target.contains(element))) {
          yield null;
          continue;
        }

        if (testInfo) {
          testInfo.lastProcessedElements.add(element);
        }

        if (this._regexp && this._regexp.test(element.textContent)) {
          yield element;
        }
        else {
          yield null;
        }
      }
    }
  }
}

class PropsSelector {
  constructor(propertyExpression) {
    this.dependsOnStyles = true;
    this.maybeDependsOnAttributes = true;

    let regexpString;
    if (propertyExpression.length >= 2 && propertyExpression[0] == "/" &&
        propertyExpression[propertyExpression.length - 1] == "/") {
      regexpString = propertyExpression.slice(1, -1);
    }
    else {
      regexpString = filterToRegExp(propertyExpression);
    }

    this._regexp = new RegExp(regexpString, "i");

    this._subSelectors = [];
  }

  *getSelectors(prefix, subtree, targets) {
    for (let subSelector of this._subSelectors) {
      if (subSelector.startsWith("*") &&
          !incompletePrefixRegexp.test(prefix)) {
        subSelector = subSelector.substring(1);
      }

      yield [qualifySelector(subSelector, prefix), subtree];
    }
  }

  setStyles(styles) {
    this._subSelectors = [];
    for (let style of styles) {
      if (this._regexp.test(style.style)) {
        for (let subSelector of style.subSelectors) {
          let idx = subSelector.lastIndexOf("::");
          if (idx != -1) {
            subSelector = subSelector.substring(0, idx);
          }

          this._subSelectors.push(subSelector);
        }
      }
    }
  }
}

class Pattern {
  constructor(selectors, text, remove = false, css = null) {
    this.selectors = selectors;
    this.text = text;
    this.remove = remove;
    this.css = css;
  }

  get dependsOnStyles() {
    return getCachedPropertyValue(
      this, "_dependsOnStyles", () => this.selectors.some(
        selector => selector.dependsOnStyles
      )
    );
  }

  get maybeDependsOnAttributes() {
    // Observe changes to attributes if either there's a plain selector that
    // looks like an ID selector, class selector, or attribute selector in one
    // of the patterns (e.g. "a[href='https://example.com/']")
    // or there's a properties selector nested inside a has selector
    // (e.g. "div:-abp-has(:-abp-properties(color: blue))")
    return getCachedPropertyValue(
      this, "_maybeDependsOnAttributes", () => this.selectors.some(
        selector => selector.maybeDependsOnAttributes ||
                    (selector instanceof HasSelector &&
                     selector.dependsOnStyles)
      )
    );
  }

  get dependsOnCharacterData() {
    // Observe changes to character data only if there's a contains selector in
    // one of the patterns.
    return getCachedPropertyValue(
      this, "_dependsOnCharacterData", () => this.selectors.some(
        selector => selector.dependsOnCharacterData
      )
    );
  }

  get maybeContainsSiblingCombinators() {
    return getCachedPropertyValue(
      this, "_maybeContainsSiblingCombinators", () => this.selectors.some(
        selector => selector.maybeContainsSiblingCombinators
      )
    );
  }

  matchesMutationTypes(mutationTypes) {
    let mutationTypeMatchMap = getCachedPropertyValue(
      this, "_mutationTypeMatchMap", () => new Map([
        // All types of DOM-dependent patterns are affected by mutations of
        // type "childList".
        ["childList", true],
        ["attributes", this.maybeDependsOnAttributes],
        ["characterData", this.dependsOnCharacterData]
      ])
    );

    for (let mutationType of mutationTypes) {
      if (mutationTypeMatchMap.get(mutationType)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Generator function returning CSS selectors for all elements that
   * match the pattern.
   *
   * This allows transforming from selectors that may contain custom
   * :-abp- selectors to pure CSS selectors that can be used to select
   * elements.
   *
   * The selectors returned from this function may be invalidated by DOM
   * mutations.
   *
   * @param {Node} subtree the subtree we work on
   * @param {Node[]} [targets] the nodes we are interested in. May be
   * used to optimize search.
   */
  *evaluate(subtree, targets) {
    let selectors = this.selectors;
    function* evaluateInner(index, prefix, currentSubtree) {
      if (index >= selectors.length) {
        yield prefix;
        return;
      }
      for (let [selector, element] of selectors[index].getSelectors(
        prefix, currentSubtree, targets
      )) {
        if (selector == null) {
          yield null;
        }
        else {
          yield* evaluateInner(index + 1, selector, element);
        }
      }
      // Just in case the getSelectors() generator above had to run some heavy
      // document.querySelectorAll() call which didn't produce any results, make
      // sure there is at least one point where execution can pause.
      yield null;
    }
    yield* evaluateInner(0, "", subtree);
  }

  /**
   * Checks if a pattern matches a specific element
   * @param {Node} [target] the element we're interested in checking for
   * matches on.
   * @param {Node} subtree the subtree we work on
   * @return {bool}
   */
  matches(target, subtree) {
    let targetFilter = [target];
    if (this.maybeContainsSiblingCombinators) {
      targetFilter = null;
    }

    let selectorGenerator = this.evaluate(subtree, targetFilter);
    for (let selector of selectorGenerator) {
      if (selector && target.matches(selector)) {
        return true;
      }
    }
    return false;
  }

  setStyles(styles) {
    for (let selector of this.selectors) {
      if (selector.dependsOnStyles) {
        selector.setStyles(styles);
      }
    }
  }
}

function extractMutationTypes(mutations) {
  let types = new Set();

  for (let mutation of mutations) {
    types.add(mutation.type);

    // There are only 3 types of mutations: "attributes", "characterData", and
    // "childList".
    if (types.size == 3) {
      break;
    }
  }

  return types;
}

function extractMutationTargets(mutations) {
  if (!mutations) {
    return null;
  }

  let targets = new Set();

  for (let mutation of mutations) {
    if (mutation.type == "childList") {
      // When new nodes are added, we're interested in the added nodes rather
      // than the parent.
      for (let node of mutation.addedNodes) {
        targets.add(node);
      }
      if (mutation.removedNodes.length > 0) {
        targets.add(mutation.target);
      }
    }
    else {
      targets.add(mutation.target);
    }
  }

  return [...targets];
}

function filterPatterns(patterns, {stylesheets, mutations}) {
  if (!stylesheets && !mutations) {
    return patterns.slice();
  }

  let mutationTypes = mutations ? extractMutationTypes(mutations) : null;

  return patterns.filter(
    pattern => (stylesheets && pattern.dependsOnStyles) ||
               (mutations && pattern.matchesMutationTypes(mutationTypes))
  );
}

function shouldObserveAttributes(patterns) {
  return patterns.some(pattern => pattern.maybeDependsOnAttributes);
}

function shouldObserveCharacterData(patterns) {
  return patterns.some(pattern => pattern.dependsOnCharacterData);
}

function shouldObserveStyles(patterns) {
  return patterns.some(pattern => pattern.dependsOnStyles);
}

/**
 * @callback hideElemsFunc
 * @param {Node[]} elements Elements on the page that should be hidden
 * @param {string[]} elementFilters
 *   The filter text that caused the elements to be hidden
 */

/**
 * @callback unhideElemsFunc
 * @param {Node[]} elements Elements on the page that should be hidden
 */

/**
 * @callback removeElemsFunc
 * @param {Node[]} elements Elements on the page that should be removed
 * @param {string[]} elementFilters
 *   The filter text that caused the elements to be removed
 * removed from the DOM
 */

/**
 * @callback cssElemsFunc
 * @param {Node[]} elements Elements on the page that should
 * apply inline CSS rules
 * @param {string[]} cssPatterns The CSS patterns to be applied
 */


/**
 * Manages the front-end processing of element hiding emulation filters.
 */
exports.WX = class ElemHideEmulation {
  /**
   * @param {module:content/elemHideEmulation~hideElemsFunc} hideElemsFunc
   *   A callback that should be provided to do the actual element hiding.
   * @param {module:content/elemHideEmulation~unhideElemsFunc} unhideElemsFunc
   *   A callback that should be provided to unhide previously hidden elements.
   * @param {module:content/elemHideEmulation~removeElemsFunc} removeElemsFunc
   *   A callback that should be provided to remove elements from the DOM.
   * @param {module:content/elemHideEmulation~cssElemsFunc} cssElemsFunc
   *   A callback that should be provided to apply inline CSS rules to elements
  */
  constructor(
    hideElemsFunc = () => {},
    unhideElemsFunc = () => {},
    removeElemsFunc = () => {},
    cssElemsFunc = () => {}
  ) {
    this._filteringInProgress = false;
    this._nextFilteringScheduled = false;
    this._lastInvocation = -minInvocationInterval;
    this._scheduledProcessing = null;

    this.document = document;
    this.hideElemsFunc = hideElemsFunc;
    this.unhideElemsFunc = unhideElemsFunc;
    this.removeElemsFunc = removeElemsFunc;
    this.cssElemsFunc = cssElemsFunc;
    this.observer = new MutationObserver(this.observe.bind(this));
    this.hiddenElements = new Map();
  }

  isSameOrigin(stylesheet) {
    try {
      return new URL(stylesheet.href).origin == this.document.location.origin;
    }
    catch (e) {
      // Invalid URL, assume that it is first-party.
      return true;
    }
  }

  /**
   * Parse the selector
   * @param {string} selector the selector to parse
   * @return {Array} selectors is an array of objects,
   * or null in case of errors.
   */
  parseSelector(selector) {
    if (selector.length == 0) {
      return [];
    }

    let match = abpSelectorRegexp.exec(selector);
    if (!match) {
      return [new PlainSelector(selector)];
    }

    let selectors = [];
    if (match.index > 0) {
      selectors.push(new PlainSelector(selector.substring(0, match.index)));
    }

    let startIndex = match.index + match[0].length;
    let content = parseSelectorContent(selector, startIndex);
    if (!content) {
      console.warn(new SyntaxError("Failed to parse Adblock Plus " +
                                   `selector ${selector} ` +
                                   "due to unmatched parentheses."));
      return null;
    }

    if (match[1] == "-abp-properties") {
      selectors.push(new PropsSelector(content.text));
    }
    else if (match[1] == "-abp-has" || match[1] == "has") {
      let hasSelectors = this.parseSelector(content.text);
      if (hasSelectors == null) {
        return null;
      }
      selectors.push(new HasSelector(hasSelectors));
    }
    else if (match[1] == "-abp-contains" || match[1] == "has-text") {
      selectors.push(new ContainsSelector(content.text));
    }
    else if (match[1] === "xpath") {
      try {
        selectors.push(new XPathSelector(content.text));
      }
      catch ({message}) {
        console.warn(
          new SyntaxError(
            "Failed to parse Adblock Plus " +
            `selector ${selector}, invalid ` +
            `xpath: ${content.text} ` +
            `error: ${message}.`
          )
        );

        return null;
      }
    }
    else if (match[1] == "not") {
      let notSelectors = this.parseSelector(content.text);
      if (notSelectors == null) {
        return null;
      }

      // if all of the inner selectors are PlainSelectors, then we
      // don't actually need to use our selector at all. We're better
      // off delegating to the browser :not implementation.
      if (notSelectors.every(s => s instanceof PlainSelector)) {
        selectors.push(new PlainSelector(`:not(${content.text})`));
      }
      else {
        selectors.push(new NotSelector(notSelectors));
      }
    }
    else {
      // this is an error, can't parse selector.
      console.warn(new SyntaxError("Failed to parse Adblock Plus " +
                                   `selector ${selector}, invalid ` +
                                   `pseudo-class :${match[1]}().`));
      return null;
    }

    let suffix = this.parseSelector(selector.substring(content.end + 1));
    if (suffix == null) {
      return null;
    }

    selectors.push(...suffix);

    if (selectors.length == 1 && selectors[0] instanceof ContainsSelector) {
      console.warn(new SyntaxError("Failed to parse Adblock Plus " +
                                   `selector ${selector}, can't ` +
                                   "have a lonely :-abp-contains()."));
      return null;
    }
    return selectors;
  }

  /**
   * Reads the rules out of CSS stylesheets
   * @param {CSSStyleSheet[]} [stylesheets] The list of stylesheets to
   * read.
   * @return {CSSStyleRule[]}
   */
  _readCssRules(stylesheets) {
    let cssStyles = [];

    for (let stylesheet of stylesheets || []) {
      // Explicitly ignore third-party stylesheets to ensure consistent behavior
      // between Firefox and Chrome.
      if (!this.isSameOrigin(stylesheet)) {
        continue;
      }

      let rules;
      try {
        rules = stylesheet.cssRules;
      }
      catch (e) {
        // On Firefox, there is a chance that an InvalidAccessError
        // get thrown when accessing cssRules. Just skip the stylesheet
        // in that case.
        // See https://searchfox.org/mozilla-central/rev/f65d7528e34ef1a7665b4a1a7b7cdb1388fcd3aa/layout/style/StyleSheet.cpp#699
        continue;
      }

      if (!rules) {
        continue;
      }

      for (let rule of rules) {
        if (rule.type != rule.STYLE_RULE) {
          continue;
        }

        cssStyles.push(stringifyStyle(rule));
      }
    }
    return cssStyles;
  }

  /**
   * Processes the current document and applies all rules to it.
   * @param {CSSStyleSheet[]} [stylesheets]
   *    The list of new stylesheets that have been added to the document and
   *    made reprocessing necessary. This parameter shouldn't be passed in for
   *    the initial processing, all of document's stylesheets will be considered
   *    then and all rules, including the ones not dependent on styles.
   * @param {MutationRecord[]} [mutations]
   *    The list of DOM mutations that have been applied to the document and
   *    made reprocessing necessary. This parameter shouldn't be passed in for
   *    the initial processing, the entire document will be considered
   *    then and all rules, including the ones not dependent on the DOM.
   * @return {Promise}
   *    A promise that is fulfilled once all filtering is completed
   */
  async _addSelectors(stylesheets, mutations) {
    if (testInfo) {
      testInfo.lastProcessedElements.clear();
    }

    let deadline = newIdleDeadline();

    if (shouldObserveStyles(this.patterns)) {
      this._refreshPatternStyles();
    }

    let patternsToCheck = filterPatterns(
      this.patterns, {stylesheets, mutations}
    );

    let targets = extractMutationTargets(mutations);

    const elementsToHide = [];
    const elementsToHideFilters = [];
    const elementsToRemoveFilters = [];
    const elementsToRemove = [];
    const elementsToApplyCSS = [];
    const cssPatterns = [];
    let elementsToUnhide = new Set(this.hiddenElements.keys());
    for (let pattern of patternsToCheck) {
      let evaluationTargets = targets;

      // If the pattern appears to contain any sibling combinators, we can't
      // easily optimize based on the mutation targets. Since this is a
      // special case, skip the optimization. By setting it to null here we
      // make sure we process the entire DOM.
      if (pattern.maybeContainsSiblingCombinators) {
        evaluationTargets = null;
      }

      let generator = pattern.evaluate(this.document, evaluationTargets);
      for (let selector of generator) {
        if (selector != null) {
          for (let element of this.document.querySelectorAll(selector)) {
            if (pattern.remove) {
              elementsToRemove.push(element);
              elementsToRemoveFilters.push(pattern.text);
              elementsToUnhide.delete(element);
            }
            else if (pattern.css) {
              elementsToApplyCSS.push(element);
              cssPatterns.push(pattern);
            }
            else if (!this.hiddenElements.has(element)) {
              elementsToHide.push(element);
              elementsToHideFilters.push(pattern.text);
            }
            else {
              elementsToUnhide.delete(element);
            }
          }
        }

        if (deadline.timeRemaining() <= 0) {
          deadline = await yieldThread();
        }
      }
    }
    this._removeElems(elementsToRemove, elementsToRemoveFilters);
    this._applyCSSToElems(elementsToApplyCSS, cssPatterns);
    this._hideElems(elementsToHide, elementsToHideFilters);

    // The search for elements to hide it optimized to find new things
    // to hide quickly, by not checking all patterns and not checking
    // the full DOM. That's why we need to do a more thorough check
    // for each remaining element that might need to be unhidden,
    // checking all patterns.
    for (let elem of elementsToUnhide) {
      if (!elem.isConnected) {
        // elements that are no longer in the DOM should be unhidden
        // in case they're ever readded, and then forgotten about so
        // we don't cause a memory leak.
        continue;
      }
      let matchesAny = this.patterns.some(pattern => pattern.matches(
        elem, this.document
      ));
      if (matchesAny) {
        elementsToUnhide.delete(elem);
      }

      if (deadline.timeRemaining() <= 0) {
        deadline = await yieldThread();
      }
    }
    this._unhideElems(Array.from(elementsToUnhide));
  }

  _removeElems(elementsToRemove, elementFilters) {
    if (elementsToRemove.length > 0) {
      this.removeElemsFunc(elementsToRemove, elementFilters);
      for (let elem of elementsToRemove) {
        // they're not hidden anymore (if they ever were), they're
        // removed. There's no unhiding these ones!
        this.hiddenElements.delete(elem);
      }
    }
  }

  _applyCSSToElems(elements, cssPatterns) {
    if (elements.length > 0) {
      this.cssElemsFunc(elements, cssPatterns);
    }
  }

  _hideElems(elementsToHide, elementFilters) {
    if (elementsToHide.length > 0) {
      this.hideElemsFunc(elementsToHide, elementFilters);
      for (let i = 0; i < elementsToHide.length; i++) {
        this.hiddenElements.set(elementsToHide[i], elementFilters[i]);
      }
    }
  }

  _unhideElems(elementsToUnhide) {
    if (elementsToUnhide.length > 0) {
      this.unhideElemsFunc(elementsToUnhide);
      for (let elem of elementsToUnhide) {
        this.hiddenElements.delete(elem);
      }
    }
  }

  /**
   * Performed any scheduled processing.
   *
   * This function is asyncronous, and should not be run multiple
   * times in parallel. The flag `_filteringInProgress` is set and
   * unset so you can check if it's already running.
   * @return {Promise}
   *  A promise that is fulfilled once all filtering is completed
   */
  async _processFiltering() {
    if (this._filteringInProgress) {
      console.warn("ElemHideEmulation scheduling error: " +
                   "Tried to process filtering in parallel.");
      if (testInfo) {
        testInfo.failedAssertions.push(
          "Tried to process filtering in parallel"
        );
      }

      return;
    }

    let params = this._scheduledProcessing || {};
    this._scheduledProcessing = null;
    this._filteringInProgress = true;
    this._nextFilteringScheduled = false;
    await this._addSelectors(
      params.stylesheets,
      params.mutations
    );
    this._lastInvocation = performance.now();
    this._filteringInProgress = false;
    if (this._scheduledProcessing) {
      this._scheduleNextFiltering();
    }
  }

  /**
   * Appends new changes to the list of filters for the next time
   * filtering is run.
   * @param {CSSStyleSheet[]} [stylesheets]
   *    new stylesheets to be processed. This parameter should be omitted
   *    for full reprocessing.
   * @param {MutationRecord[]} [mutations]
   *    new DOM mutations to be processed. This parameter should be omitted
   *    for full reprocessing.
   */
  _appendScheduledProcessing(stylesheets, mutations) {
    if (!this._scheduledProcessing) {
      // There isn't anything scheduled yet. Make the schedule.
      this._scheduledProcessing = {stylesheets, mutations};
    }
    else if (!stylesheets && !mutations) {
      // The new request was to reprocess everything, and so any
      // previous filters are irrelevant.
      this._scheduledProcessing = {};
    }
    else if (this._scheduledProcessing.stylesheets ||
             this._scheduledProcessing.mutations) {
      // The previous filters are not to filter everything, so the new
      // parameters matter. Push them onto the appropriate lists.
      if (stylesheets) {
        if (!this._scheduledProcessing.stylesheets) {
          this._scheduledProcessing.stylesheets = [];
        }
        this._scheduledProcessing.stylesheets.push(...stylesheets);
      }
      if (mutations) {
        if (!this._scheduledProcessing.mutations) {
          this._scheduledProcessing.mutations = [];
        }
        this._scheduledProcessing.mutations.push(...mutations);
      }
    }
    else {
      // this._scheduledProcessing is already going to recheck
      // everything, so no need to do anything here.
    }
  }

  /**
   * Schedule filtering to be processed in the future, or start
   * processing immediately.
   *
   * If processing is already scheduled, this does nothing.
   */
  _scheduleNextFiltering() {
    if (this._nextFilteringScheduled || this._filteringInProgress) {
      // The next one has already been scheduled. Our new events are
      // on the queue, so nothing more to do.
      return;
    }

    if (this.document.readyState === "loading") {
      // Document isn't fully loaded yet, so schedule our first
      // filtering as soon as that's done.
      this.document.addEventListener(
        "DOMContentLoaded",
        () => this._processFiltering(),
        {once: true}
      );
      this._nextFilteringScheduled = true;
    }
    else if (performance.now() - this._lastInvocation <
             minInvocationInterval) {
      // It hasn't been long enough since our last filter. Set the
      // timeout for when it's time for that.
      setTimeout(
        () => this._processFiltering(),
        minInvocationInterval - (performance.now() - this._lastInvocation)
      );
      this._nextFilteringScheduled = true;
    }
    else {
      // We can actually just start filtering immediately!
      this._processFiltering();
    }
  }

  /**
   * Re-run filtering either immediately or queued.
   * @param {CSSStyleSheet[]} [stylesheets]
   *    new stylesheets to be processed. This parameter should be omitted
   *    for full reprocessing.
   * @param {MutationRecord[]} [mutations]
   *    new DOM mutations to be processed. This parameter should be omitted
   *    for full reprocessing.
   */
  queueFiltering(stylesheets, mutations) {
    this._appendScheduledProcessing(stylesheets, mutations);
    this._scheduleNextFiltering();
  }

  _refreshPatternStyles(stylesheet) {
    let allCssRules = this._readCssRules(this.document.styleSheets);
    for (let pattern of this.patterns) {
      pattern.setStyles(allCssRules);
    }
  }

  onLoad(event) {
    let stylesheet = event.target.sheet;
    if (stylesheet) {
      this.queueFiltering([stylesheet]);
    }
  }

  observe(mutations) {
    if (testInfo) {
      // In test mode, filter out any mutations likely done by us
      // (i.e. style="display: none !important"). This makes it easier to
      // observe how the code responds to DOM mutations.
      mutations = mutations.filter(
        ({type, attributeName, target: {style: newValue}, oldValue}) =>
          !(type == "attributes" && attributeName == "style" &&
            newValue.display == "none" &&
            toCSSStyleDeclaration(oldValue).display != "none")
      );

      if (mutations.length == 0) {
        return;
      }
    }

    this.queueFiltering(null, mutations);
  }

  apply(patterns) {
    if (this.patterns) {
      let removedPatterns = [];
      for (let oldPattern of this.patterns) {
        if (!patterns.find(newPattern => newPattern.text == oldPattern.text)) {
          removedPatterns.push(oldPattern);
        }
      }
      let elementsToUnhide = [];
      for (let pattern of removedPatterns) {
        for (let [element, filter] of this.hiddenElements) {
          if (filter == pattern.text) {
            elementsToUnhide.push(element);
          }
        }
      }
      if (elementsToUnhide.length > 0) {
        this._unhideElems(elementsToUnhide);
      }
    }

    this.patterns = [];
    for (let pattern of patterns) {
      let selectors = this.parseSelector(pattern.selector);
      if (selectors != null && selectors.length > 0) {
        this.patterns.push(
          new Pattern(selectors, pattern.text, pattern.remove, pattern.css)
        );
      }
    }

    if (this.patterns.length > 0) {
      this.queueFiltering();

      let attributes = shouldObserveAttributes(this.patterns);
      this.observer.observe(
        this.document,
        {
          childList: true,
          attributes,
          attributeOldValue: attributes && !!testInfo,
          characterData: shouldObserveCharacterData(this.patterns),
          subtree: true
        }
      );
      if (shouldObserveStyles(this.patterns)) {
        let onLoad = this.onLoad.bind(this);
        if (this.document.readyState === "loading") {
          this.document.addEventListener("DOMContentLoaded", onLoad, true);
        }
        this.document.addEventListener("load", onLoad, true);
      }
    }
  }

  disconnect() {
    this.observer.disconnect();
    this._unhideElems(Array.from(this.hiddenElements.keys()));
  }
};


/***/ }),

/***/ 453:
/***/ ((__unused_webpack_module, exports) => {

/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */

/** @module */



/**
 * The maximum number of patterns that
 * `{@link module:patterns.compilePatterns compilePatterns()}` will compile
 * into regular expressions.
 * @type {number}
 */
const COMPILE_PATTERNS_MAX = 100;

/**
 * Regular expression used to match the `^` suffix in an otherwise literal
 * pattern.
 * @type {RegExp}
 */
let separatorRegExp = /[\x00-\x24\x26-\x2C\x2F\x3A-\x40\x5B-\x5E\x60\x7B-\x7F]/;

let filterToRegExp =
/**
 * Converts filter text into regular expression string
 * @param {string} text as in Filter()
 * @return {string} regular expression representation of filter text
 * @package
 */
exports.filterToRegExp = function filterToRegExp(text) {
  // remove multiple wildcards
  text = text.replace(/\*+/g, "*");

  // remove leading wildcard
  if (text[0] == "*") {
    text = text.substring(1);
  }

  // remove trailing wildcard
  if (text[text.length - 1] == "*") {
    text = text.substring(0, text.length - 1);
  }

  return text
    // remove anchors following separator placeholder
    .replace(/\^\|$/, "^")
    // escape special symbols
    .replace(/\W/g, "\\$&")
    // replace wildcards by .*
    .replace(/\\\*/g, ".*")
    // process separator placeholders (all ANSI characters but alphanumeric
    // characters and _%.-)
    .replace(/\\\^/g, `(?:${separatorRegExp.source}|$)`)
    // process extended anchor at expression start
    .replace(/^\\\|\\\|/, "^[\\w\\-]+:\\/+(?:[^\\/]+\\.)?")
    // process anchor at expression start
    .replace(/^\\\|/, "^")
    // process anchor at expression end
    .replace(/\\\|$/, "$");
};

/**
 * Regular expression used to match the `||` prefix in an otherwise literal
 * pattern.
 * @type {RegExp}
 */
let extendedAnchorRegExp = new RegExp(filterToRegExp("||") + "$");

/**
 * Regular expression for matching a keyword in a filter.
 * @type {RegExp}
 */
let keywordRegExp = /[^a-z0-9%*][a-z0-9%]{2,}(?=[^a-z0-9%*])/;

/**
 * Regular expression for matching all keywords in a filter.
 * @type {RegExp}
 */
let allKeywordsRegExp = new RegExp(keywordRegExp, "g");

/**
 * A `CompiledPatterns` object represents the compiled version of multiple URL
 * request patterns. It is returned by
 * `{@link module:patterns.compilePatterns compilePatterns()}`.
 */
class CompiledPatterns {
  /**
   * Creates an object with the given regular expressions for case-sensitive
   * and case-insensitive matching respectively.
   * @param {?RegExp} [caseSensitive]
   * @param {?RegExp} [caseInsensitive]
   * @private
   */
  constructor(caseSensitive, caseInsensitive) {
    this._caseSensitive = caseSensitive;
    this._caseInsensitive = caseInsensitive;
  }

  /**
   * Tests whether the given URL request matches the patterns used to create
   * this object.
   * @param {module:url.URLRequest} request
   * @returns {boolean}
   */
  test(request) {
    return ((this._caseSensitive &&
             this._caseSensitive.test(request.href)) ||
            (this._caseInsensitive &&
             this._caseInsensitive.test(request.lowerCaseHref)));
  }
}

/**
 * Compiles patterns from the given filters into a single
 * `{@link module:patterns~CompiledPatterns CompiledPatterns}` object.
 *
 * @param {module:filterClasses.URLFilter|
 *         Set.<module:filterClasses.URLFilter>} filters
 *   The filters. If the number of filters exceeds
 *   `{@link module:patterns~COMPILE_PATTERNS_MAX COMPILE_PATTERNS_MAX}`, the
 *   function returns `null`.
 *
 * @returns {?module:patterns~CompiledPatterns}
 *
 * @package
 */
exports.compilePatterns = function compilePatterns(filters) {
  let list = Array.isArray(filters) ? filters : [filters];

  // If the number of filters is too large, it may choke especially on low-end
  // platforms. As a precaution, we refuse to compile. Ideally we would check
  // the length of the regular expression source rather than the number of
  // filters, but this is far more straightforward and practical.
  if (list.length > COMPILE_PATTERNS_MAX) {
    return null;
  }

  let caseSensitive = "";
  let caseInsensitive = "";

  for (let filter of filters) {
    let source = filter.urlPattern.regexpSource;

    if (filter.matchCase) {
      caseSensitive += source + "|";
    }
    else {
      caseInsensitive += source + "|";
    }
  }

  let caseSensitiveRegExp = null;
  let caseInsensitiveRegExp = null;

  try {
    if (caseSensitive) {
      caseSensitiveRegExp = new RegExp(caseSensitive.slice(0, -1));
    }

    if (caseInsensitive) {
      caseInsensitiveRegExp = new RegExp(caseInsensitive.slice(0, -1));
    }
  }
  catch (error) {
    // It is possible in theory for the regular expression to be too large
    // despite COMPILE_PATTERNS_MAX
    return null;
  }

  return new CompiledPatterns(caseSensitiveRegExp, caseInsensitiveRegExp);
};

/**
 * Patterns for matching against URLs.
 *
 * Internally, this may be a RegExp or match directly against the
 * pattern for simple literal patterns.
 */
exports.Pattern = class Pattern {
  /**
   * @param {string} pattern pattern that requests URLs should be
   * matched against in filter text notation
   * @param {bool} matchCase `true` if comparisons must be case
   * sensitive
   */
  constructor(pattern, matchCase) {
    this.matchCase = matchCase || false;

    if (pattern.length >= 2 &&
        pattern[0] == "/" &&
        pattern[pattern.length - 1] == "/") {
      // The filter is a regular expression - convert it immediately to
      // catch syntax errors
      pattern = pattern.substring(1, pattern.length - 1);
      this._regexp = new RegExp(pattern, this.matchCase ? "" : "i");
    }
    else {
      if (!this.matchCase) {
        pattern = pattern.toLowerCase();
      }

      // Patterns like /foo/bar/* exist so that they are not treated as regular
      // expressions. We drop any superfluous wildcards here so our
      // optimizations can kick in.
      pattern = pattern.replace(/^\*+/, "").replace(/\*+$/, "");

      // No need to convert this filter to regular expression yet, do it on
      // demand
      this.pattern = pattern;
    }
  }

  /**
   * Checks whether the pattern is a string of literal characters with
   * no wildcards or any other special characters.
   *
   * If the pattern is prefixed with a `||` or suffixed with a `^` but otherwise
   * contains no special characters, it is still considered to be a literal
   * pattern.
   *
   * @returns {boolean}
   */
  isLiteralPattern() {
    return typeof this.pattern !== "undefined" &&
      !/[*^|]/.test(this.pattern.replace(/^\|{1,2}/, "").replace(/[|^]$/, ""));
  }

  /**
   * Regular expression to be used when testing against this pattern.
   *
   * null if the pattern is matched without using regular expressions.
   * @type {RegExp}
   */
  get regexp() {
    if (typeof this._regexp == "undefined") {
      this._regexp = this.isLiteralPattern() ?
        null : new RegExp(filterToRegExp(this.pattern));
    }
    return this._regexp;
  }

  /**
   * Pattern in regular expression notation. This will have a value
   * even if `regexp` returns null.
   * @type {string}
   */
  get regexpSource() {
    return this._regexp ? this._regexp.source : filterToRegExp(this.pattern);
  }

  /**
   * Checks whether the given URL request matches this filter's pattern.
   * @param {module:url.URLRequest} request The URL request to check.
   * @returns {boolean} `true` if the URL request matches.
   */
  matchesLocation(request) {
    let location = this.matchCase ? request.href : request.lowerCaseHref;
    let regexp = this.regexp;
    if (regexp) {
      return regexp.test(location);
    }

    let pattern = this.pattern;
    let startsWithAnchor = pattern[0] == "|";
    let startsWithExtendedAnchor = startsWithAnchor && pattern[1] == "|";
    let endsWithSeparator = pattern[pattern.length - 1] == "^";
    let endsWithAnchor = !endsWithSeparator &&
        pattern[pattern.length - 1] == "|";

    if (startsWithExtendedAnchor) {
      pattern = pattern.substr(2);
    }
    else if (startsWithAnchor) {
      pattern = pattern.substr(1);
    }

    if (endsWithSeparator || endsWithAnchor) {
      pattern = pattern.slice(0, -1);
    }

    let index = location.indexOf(pattern);

    while (index != -1) {
      // The "||" prefix requires that the text that follows does not start
      // with a forward slash.
      if ((startsWithExtendedAnchor ?
           location[index] != "/" &&
           extendedAnchorRegExp.test(location.substring(0, index)) :
           startsWithAnchor ?
           index == 0 :
           true) &&
          (endsWithSeparator ?
           !location[index + pattern.length] ||
           separatorRegExp.test(location[index + pattern.length]) :
           endsWithAnchor ?
           index == location.length - pattern.length :
           true)) {
        return true;
      }

      if (pattern == "") {
        return true;
      }

      index = location.indexOf(pattern, index + 1);
    }

    return false;
  }

  /**
   * Checks whether the pattern has keywords
   * @returns {boolean}
   */
  hasKeywords() {
    return this.pattern && keywordRegExp.test(this.pattern);
  }

  /**
   * Finds all keywords that could be associated with this pattern
   * @returns {string[]}
   */
  keywordCandidates() {
    if (!this.pattern) {
      return null;
    }
    return this.pattern.toLowerCase().match(allKeywordsRegExp);
  }
};


/***/ }),

/***/ 7795:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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
    const apiMetadata = __webpack_require__(9438);

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
var __webpack_exports__ = {};

// EXTERNAL MODULE: ../../vendor/webextension-polyfill/src/browser-polyfill.js
var browser_polyfill = __webpack_require__(7795);
// EXTERNAL MODULE: ./adblockpluscore/lib/content/elemHideEmulation.js
var elemHideEmulation = __webpack_require__(1267);
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

;// ./src/content/element-collapsing.js
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




let collapsedSelectors = new Set();
let observers = new WeakMap();

function getURLFromElement(element) {
  if (element.localName == "object") {
    if (element.data) {
      return element.data;
    }

    for (let child of element.children) {
      if (child.localName == "param" && child.name == "movie" && child.value) {
        return new URL(child.value, document.baseURI).href;
      }
    }

    return null;
  }

  return element.currentSrc || element.src;
}

function getSelectorForBlockedElement(element) {
  // Setting the "display" CSS property to "none" doesn't have any effect on
  // <frame> elements (in framesets). So we have to hide it inline through
  // the "visibility" CSS property.
  if (element.localName == "frame") {
    return null;
  }

  // If the <video> or <audio> element contains any <source> children,
  // we cannot address it in CSS by the source URL; in that case we
  // don't "collapse" it using a CSS selector but rather hide it directly by
  // setting the style="..." attribute.
  if (element.localName == "video" || element.localName == "audio") {
    for (let child of element.children) {
      if (child.localName == "source") {
        return null;
      }
    }
  }

  let selector = "";
  for (let attr of ["src", "srcset"]) {
    let value = element.getAttribute(attr);
    if (value && attr in element) {
      selector += "[" + attr + "=" + CSS.escape(value) + "]";
    }
  }

  return selector ? element.localName + selector : null;
}

function hideElement(element, properties) {
  let {style} = element;

  if (!properties) {
    if (element.localName == "frame") {
      properties = [["visibility", "hidden"]];
    }
    else {
      properties = [["display", "none"]];
    }
  }

  for (let [key, value] of properties) {
    style.setProperty(key, value, "important");
  }

  if (observers.has(element)) {
    observers.get(element).disconnect();
  }

  let observer = new MutationObserver(() => {
    for (let [key, value] of properties) {
      if (style.getPropertyValue(key) != value ||
          style.getPropertyPriority(key) != "important") {
        style.setProperty(key, value, "important");
      }
    }
  });
  observer.observe(
    element, {
      attributes: true,
      attributeFilter: ["style"]
    }
  );
  observers.set(element, observer);
}

function unhideElement(element) {
  let observer = observers.get(element);
  if (observer) {
    observer.disconnect();
    observers.delete(element);
  }

  let property = element.localName == "frame" ? "visibility" : "display";
  element.style.removeProperty(property);
}

function collapseElement(element) {
  let selector = getSelectorForBlockedElement(element);
  if (!selector) {
    hideElement(element);
    return;
  }

  if (!collapsedSelectors.has(selector)) {
    ignoreNoConnectionError(
      browser_polyfill.runtime.sendMessage({
        type: "ewe:inject-css",
        selector
      })
    );
    collapsedSelectors.add(selector);
  }
}

function hideInAboutBlankFrames(selector, urls) {
  // Resources (e.g. images) loaded into about:blank frames
  // are (sometimes) loaded with the frameId of the main_frame.
  for (let frame of document.querySelectorAll("iframe[src='about:blank']")) {
    if (!frame.contentDocument) {
      continue;
    }

    for (let element of frame.contentDocument.querySelectorAll(selector)) {
      // Use hideElement, because we don't have the correct frameId
      // for the "ewe:inject-css" message.
      if (urls.has(getURLFromElement(element))) {
        hideElement(element);
      }
    }
  }
}

function startElementCollapsing() {
  let deferred = null;

  browser_polyfill.runtime.onMessage.addListener((message, sender) => {
    if (!message || message.type != "ewe:collapse") {
      return;
    }

    if (document.readyState == "loading") {
      if (!deferred) {
        deferred = new Map();
        document.addEventListener("DOMContentLoaded", () => {
          // Under some conditions a hostile script could try to trigger
          // the event again. Since we set deferred to `null`, then
          // we assume that we should just return instead of throwing
          // a TypeError.
          if (!deferred) {
            return;
          }

          for (let [selector, urls] of deferred) {
            for (let element of document.querySelectorAll(selector)) {
              if (urls.has(getURLFromElement(element))) {
                collapseElement(element);
              }
            }

            hideInAboutBlankFrames(selector, urls);
          }

          deferred = null;
        });
      }

      let urls = deferred.get(message.selector) || new Set();
      deferred.set(message.selector, urls);
      urls.add(message.url);
    }
    else {
      for (let element of document.querySelectorAll(message.selector)) {
        if (getURLFromElement(element) == message.url) {
          collapseElement(element);
        }
      }

      hideInAboutBlankFrames(message.selector, new Set([message.url]));
    }
    return false;
  });
}

;// ./src/content/allowlisting.js
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




const MAX_ERROR_THRESHOLD = 30;
const MAX_QUEUED_EVENTS = 20;
const EVENT_INTERVAL_MS = 100;

let errorCount = 0;
let eventProcessingInterval = null;
let eventProcessingInProgress = false;
let eventQueue = [];

function isEventTrusted(event) {
  return Object.getPrototypeOf(event) === CustomEvent.prototype &&
    !Object.hasOwnProperty.call(event, "detail");
}

async function allowlistDomain(event) {
  if (!isEventTrusted(event)) {
    return false;
  }

  return ignoreNoConnectionError(
    browser_polyfill.runtime.sendMessage({
      type: "ewe:allowlist-page",
      timestamp: event.detail.timestamp,
      signature: event.detail.signature,
      options: event.detail.options
    })
  );
}

async function processNextEvent() {
  if (eventProcessingInProgress) {
    return;
  }

  try {
    eventProcessingInProgress = true;
    let event = eventQueue.shift();
    if (event) {
      try {
        let allowlistingResult = await allowlistDomain(event);
        if (allowlistingResult === true) {
          document.dispatchEvent(new Event("domain_allowlisting_success"));
          stopOneClickAllowlisting();
        }
        else {
          throw new Error("Domain allowlisting rejected");
        }
      }
      catch (e) {
        errorCount++;
        if (errorCount >= MAX_ERROR_THRESHOLD) {
          stopOneClickAllowlisting();
        }
      }
    }

    if (!eventQueue.length) {
      stopProcessingInterval();
    }
  }
  finally {
    eventProcessingInProgress = false;
  }
}

function onDomainAllowlistingRequest(event) {
  if (eventQueue.length >= MAX_QUEUED_EVENTS) {
    return;
  }

  eventQueue.push(event);
  startProcessingInterval();
}

function startProcessingInterval() {
  if (!eventProcessingInterval) {
    processNextEvent();
    eventProcessingInterval = setInterval(processNextEvent, EVENT_INTERVAL_MS);
  }
}

function stopProcessingInterval() {
  clearInterval(eventProcessingInterval);
  eventProcessingInterval = null;
}

function stopOneClickAllowlisting() {
  document.removeEventListener("domain_allowlisting_request",
                               onDomainAllowlistingRequest, true);
  eventQueue = [];
  stopProcessingInterval();
}

function startOneClickAllowlisting() {
  document.addEventListener("domain_allowlisting_request",
                            onDomainAllowlistingRequest, true);
}

;// ./src/content/element-hiding-tracer.js
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




class ElementHidingTracer {
  constructor(selectors) {
    this.selectors = new Map(selectors);

    this.observer = new MutationObserver(() => {
      this.observer.disconnect();
      setTimeout(() => this.trace(), 1000);
    });

    if (document.readyState == "loading") {
      document.addEventListener("DOMContentLoaded", () => this.trace());
    }
    else {
      this.trace();
    }
  }

  log(filters, selectors = []) {
    ignoreNoConnectionError(browser_polyfill.runtime.sendMessage(
      {type: "ewe:trace-elem-hide", filters, selectors}
    ));
  }

  trace() {
    let filters = [];
    let selectors = [];

    for (let [selector, filter] of this.selectors) {
      try {
        if (document.querySelector(selector)) {
          this.selectors.delete(selector);
          if (filter) {
            filters.push(filter);
          }
          else {
            selectors.push(selector);
          }
        }
      }
      catch (e) {
        console.error(e.toString());
      }
    }

    if (filters.length > 0 || selectors.length > 0) {
      this.log(filters, selectors);
    }

    this.observer.observe(document, {childList: true,
                                     attributes: true,
                                     subtree: true});
  }

  disconnect() {
    this.observer.disconnect();
  }
}

;// ./src/content/subscribe-links.js
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




const ALLOWED_DOMAINS = new Set([
  "abpchina.org",
  "abpindo.blogspot.com",
  "abpvn.com",
  "adblock.ee",
  "adblock.gardar.net",
  "adblockplus.me",
  "adblockplus.org",
  "abptestpages.org",
  "commentcamarche.net",
  "droit-finances.commentcamarche.com",
  "easylist.to",
  "eyeo.com",
  "fanboy.co.nz",
  "filterlists.com",
  "forums.lanik.us",
  "gitee.com",
  "gitee.io",
  "github.com",
  "github.io",
  "gitlab.com",
  "gitlab.io",
  "gurud.ee",
  "hugolescargot.com",
  "i-dont-care-about-cookies.eu",
  "journaldesfemmes.fr",
  "journaldunet.com",
  "linternaute.com",
  "spam404.com",
  "stanev.org",
  "void.gr",
  "xfiles.noads.it",
  "zoso.ro"
]);

function isDomainAllowed(domain) {
  if (domain.endsWith(".")) {
    domain = domain.substring(0, domain.length - 1);
  }

  while (true) {
    if (ALLOWED_DOMAINS.has(domain)) {
      return true;
    }
    let index = domain.indexOf(".");
    if (index == -1) {
      return false;
    }
    domain = domain.substr(index + 1);
  }
}

function subscribeLinksEnabled(url) {
  let {protocol, hostname} = new URL(url);
  return hostname == "localhost" ||
    protocol == "https:" && isDomainAllowed(hostname);
}

function handleSubscribeLinks() {
  document.addEventListener("click", event => {
    if (event.button == 2 || !event.isTrusted) {
      return;
    }

    let link = event.target;
    while (!(link instanceof HTMLAnchorElement)) {
      link = link.parentNode;

      if (!link) {
        return;
      }
    }

    let queryString = null;
    if (link.protocol == "http:" || link.protocol == "https:") {
      if (link.host == "subscribe.adblockplus.org" && link.pathname == "/") {
        queryString = link.search.substr(1);
      }
    }
    else {
      // Firefox doesn't seem to populate the "search" property for
      // links with non-standard URL schemes so we need to extract the query
      // string manually.
      let match = /^abp:\/*subscribe\/*\?(.*)/i.exec(link.href);
      if (match) {
        queryString = match[1];
      }
    }

    if (!queryString) {
      return;
    }

    let title = null;
    let url = null;
    for (let param of queryString.split("&")) {
      let parts = param.split("=", 2);
      if (parts.length != 2 || !/\S/.test(parts[1])) {
        continue;
      }
      switch (parts[0]) {
        case "title":
          title = decodeURIComponent(parts[1]);
          break;
        case "location":
          url = decodeURIComponent(parts[1]);
          break;
      }
    }
    if (!url) {
      return;
    }

    if (!title) {
      title = url;
    }

    title = title.trim();
    url = url.trim();
    if (!/^(https?|ftp):/.test(url)) {
      return;
    }

    ignoreNoConnectionError(
      browser_polyfill.runtime.sendMessage({type: "ewe:subscribe-link-clicked",
                                   title, url})
    );

    event.preventDefault();
    event.stopPropagation();
  }, true);
}

;// ./src/content/cdp-session.js
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




let isActive = false;

function notifyActive() {
  if (isActive) {
    ignoreNoConnectionError(
      browser_polyfill.runtime.sendMessage({
        type: "ewe:cdp-session-active"
      })
    );
    isActive = false;
  }
  scheduleCheckActive();
}

function scheduleCheckActive() {
  setTimeout(notifyActive, 1000);
}

function markActive() {
  isActive = true;
}

function startNotifyActive() {
  scheduleCheckActive();

  document.addEventListener("scroll", markActive, true);
  document.addEventListener("click", markActive);
  document.addEventListener("keypress", markActive, true);
}

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
;// ./src/content/blockthrough-tag.js
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






let sessionId = null;

function onBTAADetectionEvent(event) {
  if (!sessionId) {
    sessionId = esm_browser_v4();
  }

  ignoreNoConnectionError(
    browser_polyfill.runtime.sendMessage({
      type: "ewe:blockthrough-acceptable-ads-detection-event",
      details: {
        ab: event.detail.ab,
        acceptable: event.detail.acceptable,
        sessionId
      }
    })
  );
}

function startWatchingBlockthroughTag() {
  window.addEventListener("BTAADetection", onBTAADetectionEvent);
}

;// ./src/content/safari-history.js
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




function startSafariHistory() {
// It receives a message from injected in Safari `history.pushState()`
// and forwards it to web extension background script.
  window.addEventListener(
    "message",
    event => {
      if (!event.isTrusted) {
        return;
      }

      if (event && event.data &&
        event.data.type === "ewe:safari-onhistorystateupdated-content") {
        return ignoreNoConnectionError(
          browser_polyfill.runtime.sendMessage({
            type: "ewe:safari-onhistorystateupdated",
            event: event.data.event
          })
        );
      }
    },
    false
  );
}

;// ./src/content/index.js
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














let tracer;
let content_elemHideEmulation;

async function initContentFeatures() {
  if (subscribeLinksEnabled(window.location.href)) {
    handleSubscribeLinks();
  }

  let response = await ignoreNoConnectionError(
    browser_polyfill.runtime.sendMessage({type: "ewe:content-hello"})
  );

  if (response) {
    await applyContentFeatures(response);
  }
}

async function removeContentFeatures() {
  if (tracer) {
    tracer.disconnect();
  }
}

async function applyContentFeatures(response) {
  if (response.tracedSelectors) {
    tracer = new ElementHidingTracer(response.tracedSelectors);
  }

  const hideElements = (elements, filters) => {
    for (let element of elements) {
      hideElement(element, response.cssProperties);
    }

    if (tracer) {
      tracer.log(filters);
    }
  };

  const unhideElements = elements => {
    for (let element of elements) {
      unhideElement(element);
    }
  };

  const removeElements = (elements, filters) => {
    for (const element of elements) {
      element.remove();
    }

    if (tracer) {
      tracer.log(filters);
    }
  };

  const applyInlineCSS = (elements, cssPatterns) => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const pattern = cssPatterns[i];

      for (const [key, value] of Object.entries(pattern.css)) {
        element.style.setProperty(key, value, "important");
      }
    }

    if (tracer) {
      const filterTexts = cssPatterns.map(pattern => pattern.text);
      tracer.log(filterTexts);
    }
  };

  if (response.emulatedPatterns.length > 0) {
    if (!content_elemHideEmulation) {
      content_elemHideEmulation = new elemHideEmulation/* ElemHideEmulation */.WX(hideElements, unhideElements,
                                                removeElements, applyInlineCSS);
    }
    content_elemHideEmulation.apply(response.emulatedPatterns);
  }
  else if (content_elemHideEmulation) {
    content_elemHideEmulation.apply(response.emulatedPatterns);
  }

  if (response.notifyActive) {
    startNotifyActive();
  }
}

function onMessage(message) {
  if (typeof message == "object" && message != null &&
    message.type && message.type == "ewe:apply-content-features") {
    removeContentFeatures();
    applyContentFeatures(message);
  }
}
browser_polyfill.runtime.onMessage.addListener(onMessage);

startSafariHistory();
startElementCollapsing();
startOneClickAllowlisting();
initContentFeatures();
startWatchingBlockthroughTag();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXdlLWNvbnRlbnQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0Esb0JBQW9CLDRDQUE0Qzs7QUFFaEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBLFlBQVksU0FBUztBQUNyQjtBQUNBLDJCQUEyQjtBQUMzQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IscUJBQXFCO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0IscUJBQXFCO0FBQ3ZDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBLHVCQUF1QjtBQUN2Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDaE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRWE7O0FBRWIsT0FBTztBQUNQLHdCQUF3QixFQUFFLG1CQUFPLENBQUMsSUFBVztBQUM3QyxPQUFPLGdCQUFnQixFQUFFLG1CQUFPLENBQUMsR0FBYTs7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQSx3REFBd0QsYUFBYTtBQUNyRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQjtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQSx5QkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseUJBQW1CO0FBQ25CO0FBQ0E7O0FBRUEseUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsb0VBQW9FO0FBQzVFLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRztBQUNIOzs7QUFHQSx5RUFBeUU7QUFDekU7QUFDQTtBQUNBLHlDQUF5QyxrQ0FBa0M7QUFDM0U7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixhQUFhLGFBQWEsSUFBSTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGNBQWMsUUFBUTtBQUN0QixjQUFjLFVBQVU7QUFDeEI7O0FBRUE7QUFDQTtBQUNBLFdBQVcsY0FBYztBQUN6QixZQUFZLGtCQUFrQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsdUJBQXVCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixTQUFTLElBQUksTUFBTSxFQUFFLGlDQUFpQztBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsUUFBUTtBQUNuQixXQUFXLE1BQU07QUFDakI7QUFDQSxhQUFhLGtCQUFrQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxNQUFNO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLE1BQU07QUFDbkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxNQUFNO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUyxrQ0FBa0M7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGdCQUFnQixVQUFVLG9CQUFvQjtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFF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QjtBQUM5QjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsaUJBQWlCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxrQkFBa0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQjtBQUN0Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDJCQUEyQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFNEM7QUFDYTs7QUFFekQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVPO0FBQ1AsT0FBTyxPQUFPOztBQUVkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSx1QkFBdUI7QUFDM0IsTUFBTSx3QkFBZTtBQUNyQjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQOztBQUVBLEVBQUUsd0JBQWU7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7O0FB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ekM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUyx5QkFBaUI7QUFDMUIsTUFBTSx5QkFBaUIsT0FBTywyQ0FBaUI7QUFDL0M7QUFDQTtBQUNBLElBQUkseUJBQWlCO0FBQ3JCO0FBQ0EsV0FBVyx5QkFBaUI7QUFDNUIsSUFBSSx5QkFBaUI7QUFDckI7O0FBRUE7QUFDQSxJQUFJLGlCQUFpQjtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQWU7O0FBRWYsa0JBQWtCO0FBQ2xCLHNCQUFzQjtBQUN0Qix5QkFBeUI7QUFDekI7QUFDQSw0QkFBNEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZXllby93ZWJleHQtYWQtZmlsdGVyaW5nLXNvbHV0aW9uLy4vYWRibG9ja3BsdXNjb3JlL2xpYi9jb21tb24uanMiLCJ3ZWJwYWNrOi8vQGV5ZW8vd2ViZXh0LWFkLWZpbHRlcmluZy1zb2x1dGlvbi8uL2FkYmxvY2twbHVzY29yZS9saWIvY29udGVudC9lbGVtSGlkZUVtdWxhdGlvbi5qcyIsIndlYnBhY2s6Ly9AZXllby93ZWJleHQtYWQtZmlsdGVyaW5nLXNvbHV0aW9uLy4vYWRibG9ja3BsdXNjb3JlL2xpYi9wYXR0ZXJucy5qcyIsIndlYnBhY2s6Ly9AZXllby93ZWJleHQtYWQtZmlsdGVyaW5nLXNvbHV0aW9uLy4uLy4uL3ZlbmRvci93ZWJleHRlbnNpb24tcG9seWZpbGwvc3JjL2Jyb3dzZXItcG9seWZpbGwuanMiLCJ3ZWJwYWNrOi8vQGV5ZW8vd2ViZXh0LWFkLWZpbHRlcmluZy1zb2x1dGlvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AZXllby93ZWJleHQtYWQtZmlsdGVyaW5nLXNvbHV0aW9uLy4vc3JjL2FsbC9lcnJvcnMuanMiLCJ3ZWJwYWNrOi8vQGV5ZW8vd2ViZXh0LWFkLWZpbHRlcmluZy1zb2x1dGlvbi8uL3NyYy9jb250ZW50L2VsZW1lbnQtY29sbGFwc2luZy5qcyIsIndlYnBhY2s6Ly9AZXllby93ZWJleHQtYWQtZmlsdGVyaW5nLXNvbHV0aW9uLy4vc3JjL2NvbnRlbnQvYWxsb3dsaXN0aW5nLmpzIiwid2VicGFjazovL0BleWVvL3dlYmV4dC1hZC1maWx0ZXJpbmctc29sdXRpb24vLi9zcmMvY29udGVudC9lbGVtZW50LWhpZGluZy10cmFjZXIuanMiLCJ3ZWJwYWNrOi8vQGV5ZW8vd2ViZXh0LWFkLWZpbHRlcmluZy1zb2x1dGlvbi8uL3NyYy9jb250ZW50L3N1YnNjcmliZS1saW5rcy5qcyIsIndlYnBhY2s6Ly9AZXllby93ZWJleHQtYWQtZmlsdGVyaW5nLXNvbHV0aW9uLy4vc3JjL2NvbnRlbnQvY2RwLXNlc3Npb24uanMiLCJ3ZWJwYWNrOi8vQGV5ZW8vd2ViZXh0LWFkLWZpbHRlcmluZy1zb2x1dGlvbi8uLi8uLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL25hdGl2ZS5qcyIsIndlYnBhY2s6Ly9AZXllby93ZWJleHQtYWQtZmlsdGVyaW5nLXNvbHV0aW9uLy4uLy4uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcm5nLmpzIiwid2VicGFjazovL0BleWVvL3dlYmV4dC1hZC1maWx0ZXJpbmctc29sdXRpb24vLi4vLi4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vQGV5ZW8vd2ViZXh0LWFkLWZpbHRlcmluZy1zb2x1dGlvbi8uLi8uLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3Y0LmpzIiwid2VicGFjazovL0BleWVvL3dlYmV4dC1hZC1maWx0ZXJpbmctc29sdXRpb24vLi9zcmMvY29udGVudC9ibG9ja3Rocm91Z2gtdGFnLmpzIiwid2VicGFjazovL0BleWVvL3dlYmV4dC1hZC1maWx0ZXJpbmctc29sdXRpb24vLi9zcmMvY29udGVudC9zYWZhcmktaGlzdG9yeS5qcyIsIndlYnBhY2s6Ly9AZXllby93ZWJleHQtYWQtZmlsdGVyaW5nLXNvbHV0aW9uLy4vc3JjL2NvbnRlbnQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEFkYmxvY2sgUGx1cyA8aHR0cHM6Ly9hZGJsb2NrcGx1cy5vcmcvPixcbiAqIENvcHlyaWdodCAoQykgMjAwNi1wcmVzZW50IGV5ZW8gR21iSFxuICpcbiAqIEFkYmxvY2sgUGx1cyBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhc1xuICogcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogQWRibG9jayBQbHVzIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBZGJsb2NrIFBsdXMuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuLyoqIEBtb2R1bGUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCB0ZXh0VG9SZWdFeHAgPVxuLyoqXG4gKiBDb252ZXJ0cyByYXcgdGV4dCBpbnRvIGEgcmVndWxhciBleHByZXNzaW9uIHN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgdGhlIHN0cmluZyB0byBjb252ZXJ0XG4gKiBAcmV0dXJuIHtzdHJpbmd9IHJlZ3VsYXIgZXhwcmVzc2lvbiByZXByZXNlbnRhdGlvbiBvZiB0aGUgdGV4dFxuICogQHBhY2thZ2VcbiAqL1xuZXhwb3J0cy50ZXh0VG9SZWdFeHAgPSB0ZXh0ID0+IHRleHQucmVwbGFjZSgvWy0vXFxcXF4kKis/LigpfFtcXF17fV0vZywgXCJcXFxcJCZcIik7XG5cbmNvbnN0IHJlZ2V4cFJlZ2V4cCA9IC9eXFwvKC4qKVxcLyhbaW11XSopJC87XG5cbi8qKlxuICogTWFrZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBmcm9tIGEgdGV4dCBhcmd1bWVudC5cbiAqXG4gKiBJZiBpdCBjYW4gYmUgcGFyc2VkIGFzIGEgcmVndWxhciBleHByZXNzaW9uLCBwYXJzZSBpdCBhbmQgdGhlIGZsYWdzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IHRoZSB0ZXh0IGFyZ3VtZW50LlxuICpcbiAqIEByZXR1cm4gez9SZWdFeHB9IGEgUmVnRXhwIG9iamVjdCBvciBudWxsIGluIGNhc2Ugb2YgZXJyb3IuXG4gKi9cbmV4cG9ydHMubWFrZVJlZ0V4cFBhcmFtZXRlciA9IGZ1bmN0aW9uIG1ha2VSZWdFeHBQYXJhbWV0ZXIodGV4dCkge1xuICBsZXQgWywgc291cmNlLCBmbGFnc10gPSByZWdleHBSZWdleHAuZXhlYyh0ZXh0KSB8fCBbbnVsbCwgdGV4dFRvUmVnRXhwKHRleHQpXTtcblxuICB0cnkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKHNvdXJjZSwgZmxhZ3MpO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbmxldCBzcGxpdFNlbGVjdG9yID0gZXhwb3J0cy5zcGxpdFNlbGVjdG9yID0gZnVuY3Rpb24gc3BsaXRTZWxlY3RvcihzZWxlY3Rvcikge1xuICBpZiAoIXNlbGVjdG9yLmluY2x1ZGVzKFwiLFwiKSkge1xuICAgIHJldHVybiBbc2VsZWN0b3JdO1xuICB9XG5cbiAgbGV0IHNlbGVjdG9ycyA9IFtdO1xuICBsZXQgc3RhcnQgPSAwO1xuICBsZXQgbGV2ZWwgPSAwO1xuICBsZXQgc2VwID0gXCJcIjtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdG9yLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGNociA9IHNlbGVjdG9yW2ldO1xuXG4gICAgLy8gaWdub3JlIGVzY2FwZWQgY2hhcmFjdGVyc1xuICAgIGlmIChjaHIgPT0gXCJcXFxcXCIpIHtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgLy8gZG9uJ3Qgc3BsaXQgd2l0aGluIHF1b3RlZCB0ZXh0XG4gICAgZWxzZSBpZiAoY2hyID09IHNlcCkge1xuICAgICAgc2VwID0gXCJcIjsgICAgICAgICAgICAgLy8gZS5nLiBbYXR0cj1cIixcIl1cbiAgICB9XG4gICAgZWxzZSBpZiAoc2VwID09IFwiXCIpIHtcbiAgICAgIGlmIChjaHIgPT0gJ1wiJyB8fCBjaHIgPT0gXCInXCIpIHtcbiAgICAgICAgc2VwID0gY2hyO1xuICAgICAgfVxuICAgICAgLy8gZG9uJ3Qgc3BsaXQgYmV0d2VlbiBwYXJlbnRoZXNlc1xuICAgICAgZWxzZSBpZiAoY2hyID09IFwiKFwiKSB7XG4gICAgICAgIGxldmVsKys7ICAgICAgICAgICAgLy8gZS5nLiA6bWF0Y2hlcyhkaXYsc3BhbilcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGNociA9PSBcIilcIikge1xuICAgICAgICBsZXZlbCA9IE1hdGgubWF4KDAsIGxldmVsIC0gMSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChjaHIgPT0gXCIsXCIgJiYgbGV2ZWwgPT0gMCkge1xuICAgICAgICBzZWxlY3RvcnMucHVzaChzZWxlY3Rvci5zdWJzdHJpbmcoc3RhcnQsIGkpKTtcbiAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZWxlY3RvcnMucHVzaChzZWxlY3Rvci5zdWJzdHJpbmcoc3RhcnQpKTtcbiAgcmV0dXJuIHNlbGVjdG9ycztcbn07XG5cbmZ1bmN0aW9uIGZpbmRUYXJnZXRTZWxlY3RvckluZGV4KHNlbGVjdG9yKSB7XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCB3aGl0ZXNwYWNlID0gMDtcbiAgbGV0IHNjb3BlID0gW107XG5cbiAgLy8gU3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBzdHJpbmcgYW5kIGdvIGNoYXJhY3RlciBieSBjaGFyYWN0ZXIsIHdoZXJlIGVhY2hcbiAgLy8gY2hhcmFjdGVyIGlzIGEgVW5pY29kZSBjb2RlIHBvaW50LlxuICBmb3IgKGxldCBjaGFyYWN0ZXIgb2YgWy4uLnNlbGVjdG9yXS5yZXZlcnNlKCkpIHtcbiAgICBsZXQgY3VycmVudFNjb3BlID0gc2NvcGVbc2NvcGUubGVuZ3RoIC0gMV07XG5cbiAgICBpZiAoY2hhcmFjdGVyID09IFwiJ1wiIHx8IGNoYXJhY3RlciA9PSBcIlxcXCJcIikge1xuICAgICAgLy8gSWYgd2UncmUgYWxyZWFkeSB3aXRoaW4gdGhlIHNhbWUgdHlwZSBvZiBxdW90ZSwgY2xvc2UgdGhlIHNjb3BlO1xuICAgICAgLy8gb3RoZXJ3aXNlIG9wZW4gYSBuZXcgc2NvcGUuXG4gICAgICBpZiAoY3VycmVudFNjb3BlID09IGNoYXJhY3Rlcikge1xuICAgICAgICBzY29wZS5wb3AoKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBzY29wZS5wdXNoKGNoYXJhY3Rlcik7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGNoYXJhY3RlciA9PSBcIl1cIiB8fCBjaGFyYWN0ZXIgPT0gXCIpXCIpIHtcbiAgICAgIC8vIEZvciBjbG9zaW5nIGJyYWNrZXRzIGFuZCBwYXJlbnRoZXNlcywgb3BlbiBhIG5ldyBzY29wZSBvbmx5IGlmIHdlJ3JlXG4gICAgICAvLyBub3Qgd2l0aGluIGEgcXVvdGUuIFdpdGhpbiBxdW90ZXMgdGhlc2UgY2hhcmFjdGVycyBzaG91bGQgaGF2ZSBub1xuICAgICAgLy8gbWVhbmluZy5cbiAgICAgIGlmIChjdXJyZW50U2NvcGUgIT0gXCInXCIgJiYgY3VycmVudFNjb3BlICE9IFwiXFxcIlwiKSB7XG4gICAgICAgIHNjb3BlLnB1c2goY2hhcmFjdGVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoY2hhcmFjdGVyID09IFwiW1wiKSB7XG4gICAgICAvLyBJZiB3ZSdyZSBhbHJlYWR5IHdpdGhpbiBhIGJyYWNrZXQsIGNsb3NlIHRoZSBzY29wZS5cbiAgICAgIGlmIChjdXJyZW50U2NvcGUgPT0gXCJdXCIpIHtcbiAgICAgICAgc2NvcGUucG9wKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGNoYXJhY3RlciA9PSBcIihcIikge1xuICAgICAgLy8gSWYgd2UncmUgYWxyZWFkeSB3aXRoaW4gYSBwYXJlbnRoZXNpcywgY2xvc2UgdGhlIHNjb3BlLlxuICAgICAgaWYgKGN1cnJlbnRTY29wZSA9PSBcIilcIikge1xuICAgICAgICBzY29wZS5wb3AoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoIWN1cnJlbnRTY29wZSkge1xuICAgICAgLy8gQXQgdGhlIHRvcCBsZXZlbCAobm90IHdpdGhpbiBhbnkgc2NvcGUpLCBjb3VudCB0aGUgd2hpdGVzcGFjZSBpZiB3ZSd2ZVxuICAgICAgLy8gZW5jb3VudGVyZWQgaXQuIE90aGVyd2lzZSBpZiB3ZSd2ZSBoaXQgb25lIG9mIHRoZSBjb21iaW5hdG9ycyxcbiAgICAgIC8vIHRlcm1pbmF0ZSBoZXJlOyBvdGhlcndpc2UgaWYgd2UndmUgaGl0IGEgbm9uLWNvbG9uIGNoYXJhY3RlcixcbiAgICAgIC8vIHRlcm1pbmF0ZSBoZXJlLlxuICAgICAgaWYgKC9cXHMvLnRlc3QoY2hhcmFjdGVyKSkge1xuICAgICAgICB3aGl0ZXNwYWNlKys7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICgoY2hhcmFjdGVyID09IFwiPlwiIHx8IGNoYXJhY3RlciA9PSBcIitcIiB8fCBjaGFyYWN0ZXIgPT0gXCJ+XCIpIHx8XG4gICAgICAgICAgICAgICAod2hpdGVzcGFjZSA+IDAgJiYgY2hhcmFjdGVyICE9IFwiOlwiKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBaZXJvIG91dCB0aGUgd2hpdGVzcGFjZSBjb3VudCBpZiB3ZSd2ZSBlbnRlcmVkIGEgc2NvcGUuXG4gICAgaWYgKHNjb3BlLmxlbmd0aCA+IDApIHtcbiAgICAgIHdoaXRlc3BhY2UgPSAwO1xuICAgIH1cblxuICAgIC8vIEluY3JlbWVudCB0aGUgaW5kZXggYnkgdGhlIHNpemUgb2YgdGhlIGNoYXJhY3Rlci4gTm90ZSB0aGF0IGZvciBVbmljb2RlXG4gICAgLy8gY29tcG9zaXRlIGNoYXJhY3RlcnMgKGxpa2UgZW1vamkpIHRoaXMgd2lsbCBiZSBtb3JlIHRoYW4gb25lLlxuICAgIGluZGV4ICs9IGNoYXJhY3Rlci5sZW5ndGg7XG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3IubGVuZ3RoIC0gaW5kZXggKyB3aGl0ZXNwYWNlO1xufVxuXG4vKipcbiAqIFF1YWxpZmllcyBhIENTUyBzZWxlY3RvciB3aXRoIGEgcXVhbGlmaWVyLCB3aGljaCBtYXkgYmUgYW5vdGhlciBDU1Mgc2VsZWN0b3JcbiAqIG9yIGFuIGVtcHR5IHN0cmluZy4gRm9yIGV4YW1wbGUsIGdpdmVuIHRoZSBzZWxlY3RvciBcImRpdi5iYXJcIiBhbmQgdGhlXG4gKiBxdWFsaWZpZXIgXCIjZm9vXCIsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBcImRpdiNmb28uYmFyXCIuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgVGhlIHNlbGVjdG9yIHRvIHF1YWxpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30gcXVhbGlmaWVyIFRoZSBxdWFsaWZpZXIgd2l0aCB3aGljaCB0byBxdWFsaWZ5IHRoZSBzZWxlY3Rvci5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBxdWFsaWZpZWQgc2VsZWN0b3IuXG4gKiBAcGFja2FnZVxuICovXG5leHBvcnRzLnF1YWxpZnlTZWxlY3RvciA9IGZ1bmN0aW9uIHF1YWxpZnlTZWxlY3RvcihzZWxlY3RvciwgcXVhbGlmaWVyKSB7XG4gIGxldCBxdWFsaWZpZWRTZWxlY3RvciA9IFwiXCI7XG5cbiAgbGV0IHF1YWxpZmllclRhcmdldFNlbGVjdG9ySW5kZXggPSBmaW5kVGFyZ2V0U2VsZWN0b3JJbmRleChxdWFsaWZpZXIpO1xuICBsZXQgWywgcXVhbGlmaWVyVHlwZSA9IFwiXCJdID1cbiAgICAvXihbYS16XVthLXotXSopPy9pLmV4ZWMocXVhbGlmaWVyLnN1YnN0cmluZyhxdWFsaWZpZXJUYXJnZXRTZWxlY3RvckluZGV4KSk7XG5cbiAgZm9yIChsZXQgc3ViIG9mIHNwbGl0U2VsZWN0b3Ioc2VsZWN0b3IpKSB7XG4gICAgc3ViID0gc3ViLnRyaW0oKTtcblxuICAgIHF1YWxpZmllZFNlbGVjdG9yICs9IFwiLCBcIjtcblxuICAgIGxldCBpbmRleCA9IGZpbmRUYXJnZXRTZWxlY3RvckluZGV4KHN1Yik7XG5cbiAgICAvLyBOb3RlIHRoYXQgdGhlIGZpcnN0IGdyb3VwIGluIHRoZSByZWd1bGFyIGV4cHJlc3Npb24gaXMgb3B0aW9uYWwuIElmIGl0XG4gICAgLy8gZG9lc24ndCBtYXRjaCAoZS5nLiBcIiNmb286Om50aC1jaGlsZCgxKVwiKSwgdHlwZSB3aWxsIGJlIGFuIGVtcHR5IHN0cmluZy5cbiAgICBsZXQgWywgdHlwZSA9IFwiXCIsIHJlc3RdID1cbiAgICAgIC9eKFthLXpdW2Etei1dKik/XFwqPyguKikvaS5leGVjKHN1Yi5zdWJzdHJpbmcoaW5kZXgpKTtcblxuICAgIGlmICh0eXBlID09IHF1YWxpZmllclR5cGUpIHtcbiAgICAgIHR5cGUgPSBcIlwiO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBxdWFsaWZpZXIgZW5kcyBpbiBhIGNvbWJpbmF0b3IgKGUuZy4gXCJib2R5ICNmb28+XCIpLCB3ZSBwdXQgdGhlXG4gICAgLy8gdHlwZSBhbmQgdGhlIHJlc3Qgb2YgdGhlIHNlbGVjdG9yIGFmdGVyIHRoZSBxdWFsaWZpZXJcbiAgICAvLyAoZS5nLiBcImJvZHkgI2Zvbz5kaXYuYmFyXCIpOyBvdGhlcndpc2UgKGUuZy4gXCJib2R5ICNmb29cIikgd2UgbWVyZ2UgdGhlXG4gICAgLy8gdHlwZSBpbnRvIHRoZSBxdWFsaWZpZXIgKGUuZy4gXCJib2R5IGRpdiNmb28uYmFyXCIpLlxuICAgIGlmICgvW1xccz4rfl0kLy50ZXN0KHF1YWxpZmllcikpIHtcbiAgICAgIHF1YWxpZmllZFNlbGVjdG9yICs9IHN1Yi5zdWJzdHJpbmcoMCwgaW5kZXgpICsgcXVhbGlmaWVyICsgdHlwZSArIHJlc3Q7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcXVhbGlmaWVkU2VsZWN0b3IgKz0gc3ViLnN1YnN0cmluZygwLCBpbmRleCkgKyB0eXBlICsgcXVhbGlmaWVyICsgcmVzdDtcbiAgICB9XG4gIH1cblxuICAvLyBSZW1vdmUgdGhlIGluaXRpYWwgY29tbWEgYW5kIHNwYWNlLlxuICByZXR1cm4gcXVhbGlmaWVkU2VsZWN0b3Iuc3Vic3RyaW5nKDIpO1xufTtcbiIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBBZGJsb2NrIFBsdXMgPGh0dHBzOi8vYWRibG9ja3BsdXMub3JnLz4sXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDYtcHJlc2VudCBleWVvIEdtYkhcbiAqXG4gKiBBZGJsb2NrIFBsdXMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXNcbiAqIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIEFkYmxvY2sgUGx1cyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWRibG9jayBQbHVzLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbi8qKiBAbW9kdWxlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5jb25zdCB7bWFrZVJlZ0V4cFBhcmFtZXRlciwgc3BsaXRTZWxlY3RvcixcbiAgICAgICBxdWFsaWZ5U2VsZWN0b3J9ID0gcmVxdWlyZShcIi4uL2NvbW1vblwiKTtcbmNvbnN0IHtmaWx0ZXJUb1JlZ0V4cH0gPSByZXF1aXJlKFwiLi4vcGF0dGVybnNcIik7XG5cbmNvbnN0IERFRkFVTFRfTUlOX0lOVk9DQVRJT05fSU5URVJWQUwgPSAzMDAwO1xubGV0IG1pbkludm9jYXRpb25JbnRlcnZhbCA9IERFRkFVTFRfTUlOX0lOVk9DQVRJT05fSU5URVJWQUw7XG5jb25zdCBERUZBVUxUX01BWF9TWUNIUk9OT1VTX1BST0NFU1NJTkdfVElNRSA9IDUwO1xubGV0IG1heFN5bmNocm9ub3VzUHJvY2Vzc2luZ1RpbWUgPSBERUZBVUxUX01BWF9TWUNIUk9OT1VTX1BST0NFU1NJTkdfVElNRTtcblxuY29uc3QgYWJwU2VsZWN0b3JSZWdleHAgPSAvOigtYWJwLVtcXHctXSt8aGFzfGhhcy10ZXh0fHhwYXRofG5vdClcXCgvO1xuXG5sZXQgdGVzdEluZm8gPSBudWxsO1xuXG5mdW5jdGlvbiB0b0NTU1N0eWxlRGVjbGFyYXRpb24odmFsdWUpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlc3RcIiksIHtzdHlsZTogdmFsdWV9KS5zdHlsZTtcbn1cblxuLyoqXG4gKiBFbmFibGVzIHRlc3QgbW9kZSwgd2hpY2ggdHJhY2tzIGFkZGl0aW9uYWwgbWV0YWRhdGEgYWJvdXQgdGhlIGlubmVyXG4gKiB3b3JraW5ncyBmb3IgdGVzdCBwdXJwb3Nlcy4gVGhpcyBhbHNvIGFsbG93cyBvdmVycmlkaW5nIGludGVybmFsXG4gKiBjb25maWd1cmF0aW9uLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy5taW5JbnZvY2F0aW9uSW50ZXJ2YWwgT3ZlcnJpZGVzIGhvdyBsb25nXG4gKiAgIG11c3QgYmUgd2FpdGVkIGJldHdlZW4gZmlsdGVyIHByb2Nlc3NpbmcgcnVuc1xuICogQHBhcmFtIHtudW1iZXJ9IG9wdGlvbnMubWF4U3luY2hyb25vdXNQcm9jZXNzaW5nVGltZSBPdmVycmlkZXMgaG93XG4gKiAgIGxvbmcgdGhlIHRocmVhZCBtYXkgc3BlbmQgcHJvY2Vzc2luZyBmaWx0ZXJzIGJlZm9yZSBpdCBtdXN0IHlpZWxkXG4gKiAgIGl0cyB0aHJlYWRcbiAqL1xuZXhwb3J0cy5zZXRUZXN0TW9kZSA9IGZ1bmN0aW9uIHNldFRlc3RNb2RlKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zLm1pbkludm9jYXRpb25JbnRlcnZhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1pbkludm9jYXRpb25JbnRlcnZhbCA9IG9wdGlvbnMubWluSW52b2NhdGlvbkludGVydmFsO1xuICB9XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5tYXhTeW5jaHJvbm91c1Byb2Nlc3NpbmdUaW1lICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbWF4U3luY2hyb25vdXNQcm9jZXNzaW5nVGltZSA9IG9wdGlvbnMubWF4U3luY2hyb25vdXNQcm9jZXNzaW5nVGltZTtcbiAgfVxuXG4gIHRlc3RJbmZvID0ge1xuICAgIGxhc3RQcm9jZXNzZWRFbGVtZW50czogbmV3IFNldCgpLFxuICAgIGZhaWxlZEFzc2VydGlvbnM6IFtdXG4gIH07XG59O1xuXG5leHBvcnRzLmdldFRlc3RJbmZvID0gZnVuY3Rpb24gZ2V0VGVzdEluZm8oKSB7XG4gIHJldHVybiB0ZXN0SW5mbztcbn07XG5cbmV4cG9ydHMuY2xlYXJUZXN0TW9kZSA9IGZ1bmN0aW9uKCkge1xuICBtaW5JbnZvY2F0aW9uSW50ZXJ2YWwgPSBERUZBVUxUX01JTl9JTlZPQ0FUSU9OX0lOVEVSVkFMO1xuICBtYXhTeW5jaHJvbm91c1Byb2Nlc3NpbmdUaW1lID0gREVGQVVMVF9NQVhfU1lDSFJPTk9VU19QUk9DRVNTSU5HX1RJTUU7XG4gIHRlc3RJbmZvID0gbnVsbDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBJZGxlRGVhZGxpbmUuXG4gKlxuICogTm90ZTogVGhpcyBmdW5jdGlvbiBpcyBzeW5jaHJvbm91cyBhbmQgZG9lcyBOT1QgcmVxdWVzdCBhbiBpZGxlXG4gKiBjYWxsYmFjay5cbiAqXG4gKiBTZWUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9JZGxlRGVhZGxpbmV9LlxuICogQHJldHVybiB7SWRsZURlYWRsaW5lfVxuICovXG5mdW5jdGlvbiBuZXdJZGxlRGVhZGxpbmUoKSB7XG4gIGxldCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgcmV0dXJuIHtcbiAgICBkaWRUaW1lb3V0OiBmYWxzZSxcbiAgICB0aW1lUmVtYWluaW5nKCkge1xuICAgICAgbGV0IGVsYXBzZWQgPSBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0VGltZTtcbiAgICAgIGxldCByZW1haW5pbmcgPSBtYXhTeW5jaHJvbm91c1Byb2Nlc3NpbmdUaW1lIC0gZWxhcHNlZDtcbiAgICAgIHJldHVybiBNYXRoLm1heCgwLCByZW1haW5pbmcpO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gdGhlIGJyb3dzZXIgaXMgbmV4dCBpZGxlLlxuICpcbiAqIFRoaXMgaXMgaW50ZW5kZWQgdG8gYmUgdXNlZCBmb3IgbG9uZyBydW5uaW5nIHRhc2tzIG9uIHRoZSBVSSB0aHJlYWRcbiAqIHRvIGFsbG93IG90aGVyIFVJIGV2ZW50cyB0byBwcm9jZXNzLlxuICpcbiAqIEByZXR1cm4ge1Byb21pc2UuPElkbGVEZWFkbGluZT59XG4gKiAgICBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiB5b3UgY2FuIGNvbnRpbnVlIHByb2Nlc3NpbmdcbiAqL1xuZnVuY3Rpb24geWllbGRUaHJlYWQoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICBpZiAodHlwZW9mIHJlcXVlc3RJZGxlQ2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmVxdWVzdElkbGVDYWxsYmFjayhyZXNvbHZlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcmVzb2x2ZShuZXdJZGxlRGVhZGxpbmUoKSk7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbmZ1bmN0aW9uIGdldENhY2hlZFByb3BlcnR5VmFsdWUob2JqZWN0LCBuYW1lLCBkZWZhdWx0VmFsdWVGdW5jID0gKCkgPT4ge30pIHtcbiAgbGV0IHZhbHVlID0gb2JqZWN0W25hbWVdO1xuICBpZiAodHlwZW9mIHZhbHVlID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7dmFsdWU6IHZhbHVlID0gZGVmYXVsdFZhbHVlRnVuYygpfSk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIFJldHVybiBwb3NpdGlvbiBvZiBub2RlIGZyb20gcGFyZW50LlxuICogQHBhcmFtIHtOb2RlfSBub2RlIHRoZSBub2RlIHRvIGZpbmQgdGhlIHBvc2l0aW9uIG9mLlxuICogQHJldHVybiB7bnVtYmVyfSBPbmUtYmFzZWQgaW5kZXggbGlrZSBmb3IgOm50aC1jaGlsZCgpLCBvciAwIG9uIGVycm9yLlxuICovXG5mdW5jdGlvbiBwb3NpdGlvbkluUGFyZW50KG5vZGUpIHtcbiAgbGV0IGluZGV4ID0gMDtcbiAgZm9yIChsZXQgY2hpbGQgb2Ygbm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuKSB7XG4gICAgaWYgKGNoaWxkID09IG5vZGUpIHtcbiAgICAgIHJldHVybiBpbmRleCArIDE7XG4gICAgfVxuXG4gICAgaW5kZXgrKztcbiAgfVxuXG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBtYWtlU2VsZWN0b3Iobm9kZSwgc2VsZWN0b3IgPSBcIlwiKSB7XG4gIGlmIChub2RlID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoIW5vZGUucGFyZW50RWxlbWVudCkge1xuICAgIGxldCBuZXdTZWxlY3RvciA9IFwiOnJvb3RcIjtcbiAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgIG5ld1NlbGVjdG9yICs9IFwiID4gXCIgKyBzZWxlY3RvcjtcbiAgICB9XG4gICAgcmV0dXJuIG5ld1NlbGVjdG9yO1xuICB9XG4gIGxldCBpZHggPSBwb3NpdGlvbkluUGFyZW50KG5vZGUpO1xuICBpZiAoaWR4ID4gMCkge1xuICAgIGxldCBuZXdTZWxlY3RvciA9IGAke25vZGUudGFnTmFtZX06bnRoLWNoaWxkKCR7aWR4fSlgO1xuICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgbmV3U2VsZWN0b3IgKz0gXCIgPiBcIiArIHNlbGVjdG9yO1xuICAgIH1cbiAgICByZXR1cm4gbWFrZVNlbGVjdG9yKG5vZGUucGFyZW50RWxlbWVudCwgbmV3U2VsZWN0b3IpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGVjdG9yO1xufVxuXG5mdW5jdGlvbiBwYXJzZVNlbGVjdG9yQ29udGVudChjb250ZW50LCBzdGFydEluZGV4KSB7XG4gIGxldCBwYXJlbnMgPSAxO1xuICBsZXQgcXVvdGUgPSBudWxsO1xuICBsZXQgaSA9IHN0YXJ0SW5kZXg7XG4gIGZvciAoOyBpIDwgY29udGVudC5sZW5ndGg7IGkrKykge1xuICAgIGxldCBjID0gY29udGVudFtpXTtcbiAgICBpZiAoYyA9PSBcIlxcXFxcIikge1xuICAgICAgLy8gSWdub3JlIGVzY2FwZWQgY2hhcmFjdGVyc1xuICAgICAgaSsrO1xuICAgIH1cbiAgICBlbHNlIGlmIChxdW90ZSkge1xuICAgICAgaWYgKGMgPT0gcXVvdGUpIHtcbiAgICAgICAgcXVvdGUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChjID09IFwiJ1wiIHx8IGMgPT0gJ1wiJykge1xuICAgICAgcXVvdGUgPSBjO1xuICAgIH1cbiAgICBlbHNlIGlmIChjID09IFwiKFwiKSB7XG4gICAgICBwYXJlbnMrKztcbiAgICB9XG4gICAgZWxzZSBpZiAoYyA9PSBcIilcIikge1xuICAgICAgcGFyZW5zLS07XG4gICAgICBpZiAocGFyZW5zID09IDApIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHBhcmVucyA+IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4ge3RleHQ6IGNvbnRlbnQuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIGkpLCBlbmQ6IGl9O1xufVxuXG4vKipcbiAqIFN0cmluZ2lmaWVkIHN0eWxlIG9iamVjdHNcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFN0cmluZ2lmaWVkU3R5bGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzdHlsZSBDU1Mgc3R5bGUgcmVwcmVzZW50ZWQgYnkgYSBzdHJpbmcuXG4gKiBAcHJvcGVydHkge3N0cmluZ1tdfSBzdWJTZWxlY3RvcnMgc2VsZWN0b3JzIHRoZSBDU1MgcHJvcGVydGllcyBhcHBseSB0by5cbiAqL1xuXG4vKipcbiAqIFByb2R1Y2UgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHN0eWxlc2hlZXQgZW50cnkuXG4gKiBAcGFyYW0ge0NTU1N0eWxlUnVsZX0gcnVsZSB0aGUgQ1NTIHN0eWxlIHJ1bGUuXG4gKiBAcmV0dXJuIHtTdHJpbmdpZmllZFN0eWxlfSB0aGUgc3RyaW5naWZpZWQgc3R5bGUuXG4gKi9cbmZ1bmN0aW9uIHN0cmluZ2lmeVN0eWxlKHJ1bGUpIHtcbiAgbGV0IHN0eWxlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHJ1bGUuc3R5bGUubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgcHJvcGVydHkgPSBydWxlLnN0eWxlLml0ZW0oaSk7XG4gICAgbGV0IHZhbHVlID0gcnVsZS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KTtcbiAgICBsZXQgcHJpb3JpdHkgPSBydWxlLnN0eWxlLmdldFByb3BlcnR5UHJpb3JpdHkocHJvcGVydHkpO1xuICAgIHN0eWxlcy5wdXNoKGAke3Byb3BlcnR5fTogJHt2YWx1ZX0ke3ByaW9yaXR5ID8gXCIgIVwiICsgcHJpb3JpdHkgOiBcIlwifTtgKTtcbiAgfVxuICBzdHlsZXMuc29ydCgpO1xuICByZXR1cm4ge1xuICAgIHN0eWxlOiBzdHlsZXMuam9pbihcIiBcIiksXG4gICAgc3ViU2VsZWN0b3JzOiBzcGxpdFNlbGVjdG9yKHJ1bGUuc2VsZWN0b3JUZXh0KVxuICB9O1xufVxuXG5sZXQgc2NvcGVTdXBwb3J0ZWQgPSBudWxsO1xuXG5mdW5jdGlvbiB0cnlRdWVyeVNlbGVjdG9yKHN1YnRyZWUsIHNlbGVjdG9yLCBhbGwpIHtcbiAgbGV0IGVsZW1lbnRzID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBlbGVtZW50cyA9IGFsbCA/IHN1YnRyZWUucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikgOlxuICAgICAgc3VidHJlZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICBzY29wZVN1cHBvcnRlZCA9IHRydWU7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICAvLyBFZGdlIGRvZXNuJ3Qgc3VwcG9ydCBcIjpzY29wZVwiXG4gICAgc2NvcGVTdXBwb3J0ZWQgPSBmYWxzZTtcbiAgfVxuICByZXR1cm4gZWxlbWVudHM7XG59XG5cbi8qKlxuICogUXVlcnkgc2VsZWN0b3IuXG4gKlxuICogSWYgaXQgaXMgcmVsYXRpdmUsIHdpbGwgdHJ5IDpzY29wZS5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IHN1YnRyZWUgdGhlIGVsZW1lbnQgdG8gcXVlcnkgc2VsZWN0b3JcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciB0aGUgc2VsZWN0b3IgdG8gcXVlcnlcbiAqIEBwYXJhbSB7Ym9vbH0gW2FsbD1mYWxzZV0gdHJ1ZSB0byBwZXJmb3JtIHF1ZXJ5U2VsZWN0b3JBbGwoKVxuICpcbiAqIEByZXR1cm5zIHs/KE5vZGV8Tm9kZUxpc3QpfSByZXN1bHQgb2YgdGhlIHF1ZXJ5LiBudWxsIGluIGNhc2Ugb2YgZXJyb3IuXG4gKi9cbmZ1bmN0aW9uIHNjb3BlZFF1ZXJ5U2VsZWN0b3Ioc3VidHJlZSwgc2VsZWN0b3IsIGFsbCkge1xuICBpZiAoc2VsZWN0b3JbMF0gPT0gXCI+XCIpIHtcbiAgICBzZWxlY3RvciA9IFwiOnNjb3BlXCIgKyBzZWxlY3RvcjtcbiAgICBpZiAoc2NvcGVTdXBwb3J0ZWQpIHtcbiAgICAgIHJldHVybiBhbGwgPyBzdWJ0cmVlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpIDpcbiAgICAgICAgc3VidHJlZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICB9XG4gICAgaWYgKHNjb3BlU3VwcG9ydGVkID09IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnlRdWVyeVNlbGVjdG9yKHN1YnRyZWUsIHNlbGVjdG9yLCBhbGwpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gYWxsID8gc3VidHJlZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSA6XG4gICAgc3VidHJlZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbn1cblxuZnVuY3Rpb24gc2NvcGVkUXVlcnlTZWxlY3RvckFsbChzdWJ0cmVlLCBzZWxlY3Rvcikge1xuICByZXR1cm4gc2NvcGVkUXVlcnlTZWxlY3RvcihzdWJ0cmVlLCBzZWxlY3RvciwgdHJ1ZSk7XG59XG5cbmNsYXNzIFBsYWluU2VsZWN0b3Ige1xuICBjb25zdHJ1Y3RvcihzZWxlY3Rvcikge1xuICAgIHRoaXMuX3NlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgdGhpcy5tYXliZURlcGVuZHNPbkF0dHJpYnV0ZXMgPSAvWyMuOl18XFxbLitcXF0vLnRlc3Qoc2VsZWN0b3IpO1xuICAgIHRoaXMubWF5YmVDb250YWluc1NpYmxpbmdDb21iaW5hdG9ycyA9IC9bfitdLy50ZXN0KHNlbGVjdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0b3IgZnVuY3Rpb24gcmV0dXJuaW5nIGEgcGFpciBvZiBzZWxlY3RvciBzdHJpbmcgYW5kIHN1YnRyZWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcmVmaXggdGhlIHByZWZpeCBmb3IgdGhlIHNlbGVjdG9yLlxuICAgKiBAcGFyYW0ge05vZGV9IHN1YnRyZWUgdGhlIHN1YnRyZWUgd2Ugd29yayBvbi5cbiAgICogQHBhcmFtIHtOb2RlW119IFt0YXJnZXRzXSB0aGUgbm9kZXMgd2UgYXJlIGludGVyZXN0ZWQgaW4uXG4gICAqL1xuICAqZ2V0U2VsZWN0b3JzKHByZWZpeCwgc3VidHJlZSwgdGFyZ2V0cykge1xuICAgIHlpZWxkIFtwcmVmaXggKyB0aGlzLl9zZWxlY3Rvciwgc3VidHJlZV07XG4gIH1cbn1cblxuY29uc3QgaW5jb21wbGV0ZVByZWZpeFJlZ2V4cCA9IC9bXFxzPit+XSQvO1xuXG5jbGFzcyBOb3RTZWxlY3RvciB7XG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9ycykge1xuICAgIHRoaXMuX2lubmVyUGF0dGVybiA9IG5ldyBQYXR0ZXJuKHNlbGVjdG9ycyk7XG4gIH1cblxuICBnZXQgZGVwZW5kc09uU3R5bGVzKCkge1xuICAgIHJldHVybiB0aGlzLl9pbm5lclBhdHRlcm4uZGVwZW5kc09uU3R5bGVzO1xuICB9XG5cbiAgZ2V0IGRlcGVuZHNPbkNoYXJhY3RlckRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lubmVyUGF0dGVybi5kZXBlbmRzT25DaGFyYWN0ZXJEYXRhO1xuICB9XG5cbiAgZ2V0IG1heWJlRGVwZW5kc09uQXR0cmlidXRlcygpIHtcbiAgICByZXR1cm4gdGhpcy5faW5uZXJQYXR0ZXJuLm1heWJlRGVwZW5kc09uQXR0cmlidXRlcztcbiAgfVxuXG4gICpnZXRTZWxlY3RvcnMocHJlZml4LCBzdWJ0cmVlLCB0YXJnZXRzKSB7XG4gICAgZm9yIChsZXQgZWxlbWVudCBvZiB0aGlzLmdldEVsZW1lbnRzKHByZWZpeCwgc3VidHJlZSwgdGFyZ2V0cykpIHtcbiAgICAgIHlpZWxkIFttYWtlU2VsZWN0b3IoZWxlbWVudCksIGVsZW1lbnRdO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0b3IgZnVuY3Rpb24gcmV0dXJuaW5nIHNlbGVjdGVkIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJlZml4IHRoZSBwcmVmaXggZm9yIHRoZSBzZWxlY3Rvci5cbiAgICogQHBhcmFtIHtOb2RlfSBzdWJ0cmVlIHRoZSBzdWJ0cmVlIHdlIHdvcmsgb24uXG4gICAqIEBwYXJhbSB7Tm9kZVtdfSBbdGFyZ2V0c10gdGhlIG5vZGVzIHdlIGFyZSBpbnRlcmVzdGVkIGluLlxuICAgKi9cbiAgKmdldEVsZW1lbnRzKHByZWZpeCwgc3VidHJlZSwgdGFyZ2V0cykge1xuICAgIGxldCBhY3R1YWxQcmVmaXggPSAoIXByZWZpeCB8fCBpbmNvbXBsZXRlUHJlZml4UmVnZXhwLnRlc3QocHJlZml4KSkgP1xuICAgICAgcHJlZml4ICsgXCIqXCIgOiBwcmVmaXg7XG4gICAgbGV0IGVsZW1lbnRzID0gc2NvcGVkUXVlcnlTZWxlY3RvckFsbChzdWJ0cmVlLCBhY3R1YWxQcmVmaXgpO1xuICAgIGlmIChlbGVtZW50cykge1xuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgICAgICAvLyBJZiB0aGUgZWxlbWVudCBpcyBuZWl0aGVyIGFuIGFuY2VzdG9yIG5vciBhIGRlc2NlbmRhbnQgb2Ygb25lIG9mIHRoZVxuICAgICAgICAvLyB0YXJnZXRzLCB3ZSBjYW4gc2tpcCBpdC5cbiAgICAgICAgaWYgKHRhcmdldHMgJiYgIXRhcmdldHMuc29tZSh0YXJnZXQgPT4gZWxlbWVudC5jb250YWlucyh0YXJnZXQpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5jb250YWlucyhlbGVtZW50KSkpIHtcbiAgICAgICAgICB5aWVsZCBudWxsO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRlc3RJbmZvKSB7XG4gICAgICAgICAgdGVzdEluZm8ubGFzdFByb2Nlc3NlZEVsZW1lbnRzLmFkZChlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5faW5uZXJQYXR0ZXJuLm1hdGNoZXMoZWxlbWVudCwgc3VidHJlZSkpIHtcbiAgICAgICAgICB5aWVsZCBlbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgeWllbGQgbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRTdHlsZXMoc3R5bGVzKSB7XG4gICAgdGhpcy5faW5uZXJQYXR0ZXJuLnNldFN0eWxlcyhzdHlsZXMpO1xuICB9XG59XG5cbmNsYXNzIEhhc1NlbGVjdG9yIHtcbiAgY29uc3RydWN0b3Ioc2VsZWN0b3JzKSB7XG4gICAgdGhpcy5faW5uZXJQYXR0ZXJuID0gbmV3IFBhdHRlcm4oc2VsZWN0b3JzKTtcbiAgfVxuXG4gIGdldCBkZXBlbmRzT25TdHlsZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lubmVyUGF0dGVybi5kZXBlbmRzT25TdHlsZXM7XG4gIH1cblxuICBnZXQgZGVwZW5kc09uQ2hhcmFjdGVyRGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5faW5uZXJQYXR0ZXJuLmRlcGVuZHNPbkNoYXJhY3RlckRhdGE7XG4gIH1cblxuICBnZXQgbWF5YmVEZXBlbmRzT25BdHRyaWJ1dGVzKCkge1xuICAgIHJldHVybiB0aGlzLl9pbm5lclBhdHRlcm4ubWF5YmVEZXBlbmRzT25BdHRyaWJ1dGVzO1xuICB9XG5cbiAgKmdldFNlbGVjdG9ycyhwcmVmaXgsIHN1YnRyZWUsIHRhcmdldHMpIHtcbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIHRoaXMuZ2V0RWxlbWVudHMocHJlZml4LCBzdWJ0cmVlLCB0YXJnZXRzKSkge1xuICAgICAgeWllbGQgW21ha2VTZWxlY3RvcihlbGVtZW50KSwgZWxlbWVudF07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRvciBmdW5jdGlvbiByZXR1cm5pbmcgc2VsZWN0ZWQgZWxlbWVudHMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcmVmaXggdGhlIHByZWZpeCBmb3IgdGhlIHNlbGVjdG9yLlxuICAgKiBAcGFyYW0ge05vZGV9IHN1YnRyZWUgdGhlIHN1YnRyZWUgd2Ugd29yayBvbi5cbiAgICogQHBhcmFtIHtOb2RlW119IFt0YXJnZXRzXSB0aGUgbm9kZXMgd2UgYXJlIGludGVyZXN0ZWQgaW4uXG4gICAqL1xuICAqZ2V0RWxlbWVudHMocHJlZml4LCBzdWJ0cmVlLCB0YXJnZXRzKSB7XG4gICAgbGV0IGFjdHVhbFByZWZpeCA9ICghcHJlZml4IHx8IGluY29tcGxldGVQcmVmaXhSZWdleHAudGVzdChwcmVmaXgpKSA/XG4gICAgICBwcmVmaXggKyBcIipcIiA6IHByZWZpeDtcbiAgICBsZXQgZWxlbWVudHMgPSBzY29wZWRRdWVyeVNlbGVjdG9yQWxsKHN1YnRyZWUsIGFjdHVhbFByZWZpeCk7XG4gICAgaWYgKGVsZW1lbnRzKSB7XG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIG5laXRoZXIgYW4gYW5jZXN0b3Igbm9yIGEgZGVzY2VuZGFudCBvZiBvbmUgb2YgdGhlXG4gICAgICAgIC8vIHRhcmdldHMsIHdlIGNhbiBza2lwIGl0LlxuICAgICAgICBpZiAodGFyZ2V0cyAmJiAhdGFyZ2V0cy5zb21lKHRhcmdldCA9PiBlbGVtZW50LmNvbnRhaW5zKHRhcmdldCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNvbnRhaW5zKGVsZW1lbnQpKSkge1xuICAgICAgICAgIHlpZWxkIG51bGw7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGVzdEluZm8pIHtcbiAgICAgICAgICB0ZXN0SW5mby5sYXN0UHJvY2Vzc2VkRWxlbWVudHMuYWRkKGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgc2VsZWN0b3Igb2YgdGhpcy5faW5uZXJQYXR0ZXJuLmV2YWx1YXRlKGVsZW1lbnQsIHRhcmdldHMpKSB7XG4gICAgICAgICAgaWYgKHNlbGVjdG9yID09IG51bGwpIHtcbiAgICAgICAgICAgIHlpZWxkIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKHNjb3BlZFF1ZXJ5U2VsZWN0b3IoZWxlbWVudCwgc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICB5aWVsZCBlbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHlpZWxkIG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0U3R5bGVzKHN0eWxlcykge1xuICAgIHRoaXMuX2lubmVyUGF0dGVybi5zZXRTdHlsZXMoc3R5bGVzKTtcbiAgfVxufVxuXG5jbGFzcyBYUGF0aFNlbGVjdG9yIHtcbiAgY29uc3RydWN0b3IodGV4dENvbnRlbnQpIHtcbiAgICB0aGlzLmRlcGVuZHNPbkNoYXJhY3RlckRhdGEgPSB0cnVlO1xuICAgIHRoaXMubWF5YmVEZXBlbmRzT25BdHRyaWJ1dGVzID0gdHJ1ZTtcblxuICAgIGxldCBldmFsdWF0b3IgPSBuZXcgWFBhdGhFdmFsdWF0b3IoKTtcbiAgICB0aGlzLl9leHByZXNzaW9uID0gZXZhbHVhdG9yLmNyZWF0ZUV4cHJlc3Npb24odGV4dENvbnRlbnQsIG51bGwpO1xuICB9XG5cbiAgKmdldFNlbGVjdG9ycyhwcmVmaXgsIHN1YnRyZWUsIHRhcmdldHMpIHtcbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIHRoaXMuZ2V0RWxlbWVudHMocHJlZml4LCBzdWJ0cmVlLCB0YXJnZXRzKSkge1xuICAgICAgeWllbGQgW21ha2VTZWxlY3RvcihlbGVtZW50KSwgZWxlbWVudF07XG4gICAgfVxuICB9XG5cbiAgKmdldEVsZW1lbnRzKHByZWZpeCwgc3VidHJlZSwgdGFyZ2V0cykge1xuICAgIGxldCB7T1JERVJFRF9OT0RFX1NOQVBTSE9UX1RZUEU6IGZsYWd9ID0gWFBhdGhSZXN1bHQ7XG4gICAgbGV0IGVsZW1lbnRzID0gcHJlZml4ID8gc2NvcGVkUXVlcnlTZWxlY3RvckFsbChzdWJ0cmVlLCBwcmVmaXgpIDogW3N1YnRyZWVdO1xuICAgIGZvciAobGV0IHBhcmVudCBvZiBlbGVtZW50cykge1xuICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuX2V4cHJlc3Npb24uZXZhbHVhdGUocGFyZW50LCBmbGFnLCBudWxsKTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCB7c25hcHNob3RMZW5ndGh9ID0gcmVzdWx0OyBpIDwgc25hcHNob3RMZW5ndGg7IGkrKykge1xuICAgICAgICB5aWVsZCByZXN1bHQuc25hcHNob3RJdGVtKGkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBDb250YWluc1NlbGVjdG9yIHtcbiAgY29uc3RydWN0b3IodGV4dENvbnRlbnQpIHtcbiAgICB0aGlzLmRlcGVuZHNPbkNoYXJhY3RlckRhdGEgPSB0cnVlO1xuXG4gICAgdGhpcy5fcmVnZXhwID0gbWFrZVJlZ0V4cFBhcmFtZXRlcih0ZXh0Q29udGVudCk7XG4gIH1cblxuICAqZ2V0U2VsZWN0b3JzKHByZWZpeCwgc3VidHJlZSwgdGFyZ2V0cykge1xuICAgIGZvciAobGV0IGVsZW1lbnQgb2YgdGhpcy5nZXRFbGVtZW50cyhwcmVmaXgsIHN1YnRyZWUsIHRhcmdldHMpKSB7XG4gICAgICB5aWVsZCBbbWFrZVNlbGVjdG9yKGVsZW1lbnQpLCBzdWJ0cmVlXTtcbiAgICB9XG4gIH1cblxuICAqZ2V0RWxlbWVudHMocHJlZml4LCBzdWJ0cmVlLCB0YXJnZXRzKSB7XG4gICAgbGV0IGFjdHVhbFByZWZpeCA9ICghcHJlZml4IHx8IGluY29tcGxldGVQcmVmaXhSZWdleHAudGVzdChwcmVmaXgpKSA/XG4gICAgICBwcmVmaXggKyBcIipcIiA6IHByZWZpeDtcblxuICAgIGxldCBlbGVtZW50cyA9IHNjb3BlZFF1ZXJ5U2VsZWN0b3JBbGwoc3VidHJlZSwgYWN0dWFsUHJlZml4KTtcblxuICAgIGlmIChlbGVtZW50cykge1xuICAgICAgbGV0IGxhc3RSb290ID0gbnVsbDtcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAgICAgLy8gRm9yIGEgZmlsdGVyIGxpa2UgZGl2Oi1hYnAtY29udGFpbnMoSGVsbG8pIGFuZCBhIHN1YnRyZWUgbGlrZVxuICAgICAgICAvLyA8ZGl2IGlkPVwiYVwiPjxkaXYgaWQ9XCJiXCI+PGRpdiBpZD1cImNcIj5IZWxsbzwvZGl2PjwvZGl2PjwvZGl2PlxuICAgICAgICAvLyB3ZSdyZSBvbmx5IGludGVyZXN0ZWQgaW4gZGl2I2FcbiAgICAgICAgaWYgKGxhc3RSb290ICYmIGxhc3RSb290LmNvbnRhaW5zKGVsZW1lbnQpKSB7XG4gICAgICAgICAgeWllbGQgbnVsbDtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxhc3RSb290ID0gZWxlbWVudDtcblxuICAgICAgICBpZiAodGFyZ2V0cyAmJiAhdGFyZ2V0cy5zb21lKHRhcmdldCA9PiBlbGVtZW50LmNvbnRhaW5zKHRhcmdldCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNvbnRhaW5zKGVsZW1lbnQpKSkge1xuICAgICAgICAgIHlpZWxkIG51bGw7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGVzdEluZm8pIHtcbiAgICAgICAgICB0ZXN0SW5mby5sYXN0UHJvY2Vzc2VkRWxlbWVudHMuYWRkKGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3JlZ2V4cCAmJiB0aGlzLl9yZWdleHAudGVzdChlbGVtZW50LnRleHRDb250ZW50KSkge1xuICAgICAgICAgIHlpZWxkIGVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgeWllbGQgbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBQcm9wc1NlbGVjdG9yIHtcbiAgY29uc3RydWN0b3IocHJvcGVydHlFeHByZXNzaW9uKSB7XG4gICAgdGhpcy5kZXBlbmRzT25TdHlsZXMgPSB0cnVlO1xuICAgIHRoaXMubWF5YmVEZXBlbmRzT25BdHRyaWJ1dGVzID0gdHJ1ZTtcblxuICAgIGxldCByZWdleHBTdHJpbmc7XG4gICAgaWYgKHByb3BlcnR5RXhwcmVzc2lvbi5sZW5ndGggPj0gMiAmJiBwcm9wZXJ0eUV4cHJlc3Npb25bMF0gPT0gXCIvXCIgJiZcbiAgICAgICAgcHJvcGVydHlFeHByZXNzaW9uW3Byb3BlcnR5RXhwcmVzc2lvbi5sZW5ndGggLSAxXSA9PSBcIi9cIikge1xuICAgICAgcmVnZXhwU3RyaW5nID0gcHJvcGVydHlFeHByZXNzaW9uLnNsaWNlKDEsIC0xKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZWdleHBTdHJpbmcgPSBmaWx0ZXJUb1JlZ0V4cChwcm9wZXJ0eUV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIHRoaXMuX3JlZ2V4cCA9IG5ldyBSZWdFeHAocmVnZXhwU3RyaW5nLCBcImlcIik7XG5cbiAgICB0aGlzLl9zdWJTZWxlY3RvcnMgPSBbXTtcbiAgfVxuXG4gICpnZXRTZWxlY3RvcnMocHJlZml4LCBzdWJ0cmVlLCB0YXJnZXRzKSB7XG4gICAgZm9yIChsZXQgc3ViU2VsZWN0b3Igb2YgdGhpcy5fc3ViU2VsZWN0b3JzKSB7XG4gICAgICBpZiAoc3ViU2VsZWN0b3Iuc3RhcnRzV2l0aChcIipcIikgJiZcbiAgICAgICAgICAhaW5jb21wbGV0ZVByZWZpeFJlZ2V4cC50ZXN0KHByZWZpeCkpIHtcbiAgICAgICAgc3ViU2VsZWN0b3IgPSBzdWJTZWxlY3Rvci5zdWJzdHJpbmcoMSk7XG4gICAgICB9XG5cbiAgICAgIHlpZWxkIFtxdWFsaWZ5U2VsZWN0b3Ioc3ViU2VsZWN0b3IsIHByZWZpeCksIHN1YnRyZWVdO1xuICAgIH1cbiAgfVxuXG4gIHNldFN0eWxlcyhzdHlsZXMpIHtcbiAgICB0aGlzLl9zdWJTZWxlY3RvcnMgPSBbXTtcbiAgICBmb3IgKGxldCBzdHlsZSBvZiBzdHlsZXMpIHtcbiAgICAgIGlmICh0aGlzLl9yZWdleHAudGVzdChzdHlsZS5zdHlsZSkpIHtcbiAgICAgICAgZm9yIChsZXQgc3ViU2VsZWN0b3Igb2Ygc3R5bGUuc3ViU2VsZWN0b3JzKSB7XG4gICAgICAgICAgbGV0IGlkeCA9IHN1YlNlbGVjdG9yLmxhc3RJbmRleE9mKFwiOjpcIik7XG4gICAgICAgICAgaWYgKGlkeCAhPSAtMSkge1xuICAgICAgICAgICAgc3ViU2VsZWN0b3IgPSBzdWJTZWxlY3Rvci5zdWJzdHJpbmcoMCwgaWR4KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9zdWJTZWxlY3RvcnMucHVzaChzdWJTZWxlY3Rvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgUGF0dGVybiB7XG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9ycywgdGV4dCwgcmVtb3ZlID0gZmFsc2UsIGNzcyA9IG51bGwpIHtcbiAgICB0aGlzLnNlbGVjdG9ycyA9IHNlbGVjdG9ycztcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIHRoaXMucmVtb3ZlID0gcmVtb3ZlO1xuICAgIHRoaXMuY3NzID0gY3NzO1xuICB9XG5cbiAgZ2V0IGRlcGVuZHNPblN0eWxlcygpIHtcbiAgICByZXR1cm4gZ2V0Q2FjaGVkUHJvcGVydHlWYWx1ZShcbiAgICAgIHRoaXMsIFwiX2RlcGVuZHNPblN0eWxlc1wiLCAoKSA9PiB0aGlzLnNlbGVjdG9ycy5zb21lKFxuICAgICAgICBzZWxlY3RvciA9PiBzZWxlY3Rvci5kZXBlbmRzT25TdHlsZXNcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgZ2V0IG1heWJlRGVwZW5kc09uQXR0cmlidXRlcygpIHtcbiAgICAvLyBPYnNlcnZlIGNoYW5nZXMgdG8gYXR0cmlidXRlcyBpZiBlaXRoZXIgdGhlcmUncyBhIHBsYWluIHNlbGVjdG9yIHRoYXRcbiAgICAvLyBsb29rcyBsaWtlIGFuIElEIHNlbGVjdG9yLCBjbGFzcyBzZWxlY3Rvciwgb3IgYXR0cmlidXRlIHNlbGVjdG9yIGluIG9uZVxuICAgIC8vIG9mIHRoZSBwYXR0ZXJucyAoZS5nLiBcImFbaHJlZj0naHR0cHM6Ly9leGFtcGxlLmNvbS8nXVwiKVxuICAgIC8vIG9yIHRoZXJlJ3MgYSBwcm9wZXJ0aWVzIHNlbGVjdG9yIG5lc3RlZCBpbnNpZGUgYSBoYXMgc2VsZWN0b3JcbiAgICAvLyAoZS5nLiBcImRpdjotYWJwLWhhcyg6LWFicC1wcm9wZXJ0aWVzKGNvbG9yOiBibHVlKSlcIilcbiAgICByZXR1cm4gZ2V0Q2FjaGVkUHJvcGVydHlWYWx1ZShcbiAgICAgIHRoaXMsIFwiX21heWJlRGVwZW5kc09uQXR0cmlidXRlc1wiLCAoKSA9PiB0aGlzLnNlbGVjdG9ycy5zb21lKFxuICAgICAgICBzZWxlY3RvciA9PiBzZWxlY3Rvci5tYXliZURlcGVuZHNPbkF0dHJpYnV0ZXMgfHxcbiAgICAgICAgICAgICAgICAgICAgKHNlbGVjdG9yIGluc3RhbmNlb2YgSGFzU2VsZWN0b3IgJiZcbiAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yLmRlcGVuZHNPblN0eWxlcylcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgZ2V0IGRlcGVuZHNPbkNoYXJhY3RlckRhdGEoKSB7XG4gICAgLy8gT2JzZXJ2ZSBjaGFuZ2VzIHRvIGNoYXJhY3RlciBkYXRhIG9ubHkgaWYgdGhlcmUncyBhIGNvbnRhaW5zIHNlbGVjdG9yIGluXG4gICAgLy8gb25lIG9mIHRoZSBwYXR0ZXJucy5cbiAgICByZXR1cm4gZ2V0Q2FjaGVkUHJvcGVydHlWYWx1ZShcbiAgICAgIHRoaXMsIFwiX2RlcGVuZHNPbkNoYXJhY3RlckRhdGFcIiwgKCkgPT4gdGhpcy5zZWxlY3RvcnMuc29tZShcbiAgICAgICAgc2VsZWN0b3IgPT4gc2VsZWN0b3IuZGVwZW5kc09uQ2hhcmFjdGVyRGF0YVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBnZXQgbWF5YmVDb250YWluc1NpYmxpbmdDb21iaW5hdG9ycygpIHtcbiAgICByZXR1cm4gZ2V0Q2FjaGVkUHJvcGVydHlWYWx1ZShcbiAgICAgIHRoaXMsIFwiX21heWJlQ29udGFpbnNTaWJsaW5nQ29tYmluYXRvcnNcIiwgKCkgPT4gdGhpcy5zZWxlY3RvcnMuc29tZShcbiAgICAgICAgc2VsZWN0b3IgPT4gc2VsZWN0b3IubWF5YmVDb250YWluc1NpYmxpbmdDb21iaW5hdG9yc1xuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBtYXRjaGVzTXV0YXRpb25UeXBlcyhtdXRhdGlvblR5cGVzKSB7XG4gICAgbGV0IG11dGF0aW9uVHlwZU1hdGNoTWFwID0gZ2V0Q2FjaGVkUHJvcGVydHlWYWx1ZShcbiAgICAgIHRoaXMsIFwiX211dGF0aW9uVHlwZU1hdGNoTWFwXCIsICgpID0+IG5ldyBNYXAoW1xuICAgICAgICAvLyBBbGwgdHlwZXMgb2YgRE9NLWRlcGVuZGVudCBwYXR0ZXJucyBhcmUgYWZmZWN0ZWQgYnkgbXV0YXRpb25zIG9mXG4gICAgICAgIC8vIHR5cGUgXCJjaGlsZExpc3RcIi5cbiAgICAgICAgW1wiY2hpbGRMaXN0XCIsIHRydWVdLFxuICAgICAgICBbXCJhdHRyaWJ1dGVzXCIsIHRoaXMubWF5YmVEZXBlbmRzT25BdHRyaWJ1dGVzXSxcbiAgICAgICAgW1wiY2hhcmFjdGVyRGF0YVwiLCB0aGlzLmRlcGVuZHNPbkNoYXJhY3RlckRhdGFdXG4gICAgICBdKVxuICAgICk7XG5cbiAgICBmb3IgKGxldCBtdXRhdGlvblR5cGUgb2YgbXV0YXRpb25UeXBlcykge1xuICAgICAgaWYgKG11dGF0aW9uVHlwZU1hdGNoTWFwLmdldChtdXRhdGlvblR5cGUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0b3IgZnVuY3Rpb24gcmV0dXJuaW5nIENTUyBzZWxlY3RvcnMgZm9yIGFsbCBlbGVtZW50cyB0aGF0XG4gICAqIG1hdGNoIHRoZSBwYXR0ZXJuLlxuICAgKlxuICAgKiBUaGlzIGFsbG93cyB0cmFuc2Zvcm1pbmcgZnJvbSBzZWxlY3RvcnMgdGhhdCBtYXkgY29udGFpbiBjdXN0b21cbiAgICogOi1hYnAtIHNlbGVjdG9ycyB0byBwdXJlIENTUyBzZWxlY3RvcnMgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWxlY3RcbiAgICogZWxlbWVudHMuXG4gICAqXG4gICAqIFRoZSBzZWxlY3RvcnMgcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIG1heSBiZSBpbnZhbGlkYXRlZCBieSBET01cbiAgICogbXV0YXRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge05vZGV9IHN1YnRyZWUgdGhlIHN1YnRyZWUgd2Ugd29yayBvblxuICAgKiBAcGFyYW0ge05vZGVbXX0gW3RhcmdldHNdIHRoZSBub2RlcyB3ZSBhcmUgaW50ZXJlc3RlZCBpbi4gTWF5IGJlXG4gICAqIHVzZWQgdG8gb3B0aW1pemUgc2VhcmNoLlxuICAgKi9cbiAgKmV2YWx1YXRlKHN1YnRyZWUsIHRhcmdldHMpIHtcbiAgICBsZXQgc2VsZWN0b3JzID0gdGhpcy5zZWxlY3RvcnM7XG4gICAgZnVuY3Rpb24qIGV2YWx1YXRlSW5uZXIoaW5kZXgsIHByZWZpeCwgY3VycmVudFN1YnRyZWUpIHtcbiAgICAgIGlmIChpbmRleCA+PSBzZWxlY3RvcnMubGVuZ3RoKSB7XG4gICAgICAgIHlpZWxkIHByZWZpeDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgW3NlbGVjdG9yLCBlbGVtZW50XSBvZiBzZWxlY3RvcnNbaW5kZXhdLmdldFNlbGVjdG9ycyhcbiAgICAgICAgcHJlZml4LCBjdXJyZW50U3VidHJlZSwgdGFyZ2V0c1xuICAgICAgKSkge1xuICAgICAgICBpZiAoc2VsZWN0b3IgPT0gbnVsbCkge1xuICAgICAgICAgIHlpZWxkIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgeWllbGQqIGV2YWx1YXRlSW5uZXIoaW5kZXggKyAxLCBzZWxlY3RvciwgZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIEp1c3QgaW4gY2FzZSB0aGUgZ2V0U2VsZWN0b3JzKCkgZ2VuZXJhdG9yIGFib3ZlIGhhZCB0byBydW4gc29tZSBoZWF2eVxuICAgICAgLy8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgpIGNhbGwgd2hpY2ggZGlkbid0IHByb2R1Y2UgYW55IHJlc3VsdHMsIG1ha2VcbiAgICAgIC8vIHN1cmUgdGhlcmUgaXMgYXQgbGVhc3Qgb25lIHBvaW50IHdoZXJlIGV4ZWN1dGlvbiBjYW4gcGF1c2UuXG4gICAgICB5aWVsZCBudWxsO1xuICAgIH1cbiAgICB5aWVsZCogZXZhbHVhdGVJbm5lcigwLCBcIlwiLCBzdWJ0cmVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBwYXR0ZXJuIG1hdGNoZXMgYSBzcGVjaWZpYyBlbGVtZW50XG4gICAqIEBwYXJhbSB7Tm9kZX0gW3RhcmdldF0gdGhlIGVsZW1lbnQgd2UncmUgaW50ZXJlc3RlZCBpbiBjaGVja2luZyBmb3JcbiAgICogbWF0Y2hlcyBvbi5cbiAgICogQHBhcmFtIHtOb2RlfSBzdWJ0cmVlIHRoZSBzdWJ0cmVlIHdlIHdvcmsgb25cbiAgICogQHJldHVybiB7Ym9vbH1cbiAgICovXG4gIG1hdGNoZXModGFyZ2V0LCBzdWJ0cmVlKSB7XG4gICAgbGV0IHRhcmdldEZpbHRlciA9IFt0YXJnZXRdO1xuICAgIGlmICh0aGlzLm1heWJlQ29udGFpbnNTaWJsaW5nQ29tYmluYXRvcnMpIHtcbiAgICAgIHRhcmdldEZpbHRlciA9IG51bGw7XG4gICAgfVxuXG4gICAgbGV0IHNlbGVjdG9yR2VuZXJhdG9yID0gdGhpcy5ldmFsdWF0ZShzdWJ0cmVlLCB0YXJnZXRGaWx0ZXIpO1xuICAgIGZvciAobGV0IHNlbGVjdG9yIG9mIHNlbGVjdG9yR2VuZXJhdG9yKSB7XG4gICAgICBpZiAoc2VsZWN0b3IgJiYgdGFyZ2V0Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzZXRTdHlsZXMoc3R5bGVzKSB7XG4gICAgZm9yIChsZXQgc2VsZWN0b3Igb2YgdGhpcy5zZWxlY3RvcnMpIHtcbiAgICAgIGlmIChzZWxlY3Rvci5kZXBlbmRzT25TdHlsZXMpIHtcbiAgICAgICAgc2VsZWN0b3Iuc2V0U3R5bGVzKHN0eWxlcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RNdXRhdGlvblR5cGVzKG11dGF0aW9ucykge1xuICBsZXQgdHlwZXMgPSBuZXcgU2V0KCk7XG5cbiAgZm9yIChsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zKSB7XG4gICAgdHlwZXMuYWRkKG11dGF0aW9uLnR5cGUpO1xuXG4gICAgLy8gVGhlcmUgYXJlIG9ubHkgMyB0eXBlcyBvZiBtdXRhdGlvbnM6IFwiYXR0cmlidXRlc1wiLCBcImNoYXJhY3RlckRhdGFcIiwgYW5kXG4gICAgLy8gXCJjaGlsZExpc3RcIi5cbiAgICBpZiAodHlwZXMuc2l6ZSA9PSAzKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHlwZXM7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RNdXRhdGlvblRhcmdldHMobXV0YXRpb25zKSB7XG4gIGlmICghbXV0YXRpb25zKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgdGFyZ2V0cyA9IG5ldyBTZXQoKTtcblxuICBmb3IgKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpIHtcbiAgICBpZiAobXV0YXRpb24udHlwZSA9PSBcImNoaWxkTGlzdFwiKSB7XG4gICAgICAvLyBXaGVuIG5ldyBub2RlcyBhcmUgYWRkZWQsIHdlJ3JlIGludGVyZXN0ZWQgaW4gdGhlIGFkZGVkIG5vZGVzIHJhdGhlclxuICAgICAgLy8gdGhhbiB0aGUgcGFyZW50LlxuICAgICAgZm9yIChsZXQgbm9kZSBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKSB7XG4gICAgICAgIHRhcmdldHMuYWRkKG5vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKG11dGF0aW9uLnJlbW92ZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRhcmdldHMuYWRkKG11dGF0aW9uLnRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGFyZ2V0cy5hZGQobXV0YXRpb24udGFyZ2V0KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gWy4uLnRhcmdldHNdO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJQYXR0ZXJucyhwYXR0ZXJucywge3N0eWxlc2hlZXRzLCBtdXRhdGlvbnN9KSB7XG4gIGlmICghc3R5bGVzaGVldHMgJiYgIW11dGF0aW9ucykge1xuICAgIHJldHVybiBwYXR0ZXJucy5zbGljZSgpO1xuICB9XG5cbiAgbGV0IG11dGF0aW9uVHlwZXMgPSBtdXRhdGlvbnMgPyBleHRyYWN0TXV0YXRpb25UeXBlcyhtdXRhdGlvbnMpIDogbnVsbDtcblxuICByZXR1cm4gcGF0dGVybnMuZmlsdGVyKFxuICAgIHBhdHRlcm4gPT4gKHN0eWxlc2hlZXRzICYmIHBhdHRlcm4uZGVwZW5kc09uU3R5bGVzKSB8fFxuICAgICAgICAgICAgICAgKG11dGF0aW9ucyAmJiBwYXR0ZXJuLm1hdGNoZXNNdXRhdGlvblR5cGVzKG11dGF0aW9uVHlwZXMpKVxuICApO1xufVxuXG5mdW5jdGlvbiBzaG91bGRPYnNlcnZlQXR0cmlidXRlcyhwYXR0ZXJucykge1xuICByZXR1cm4gcGF0dGVybnMuc29tZShwYXR0ZXJuID0+IHBhdHRlcm4ubWF5YmVEZXBlbmRzT25BdHRyaWJ1dGVzKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkT2JzZXJ2ZUNoYXJhY3RlckRhdGEocGF0dGVybnMpIHtcbiAgcmV0dXJuIHBhdHRlcm5zLnNvbWUocGF0dGVybiA9PiBwYXR0ZXJuLmRlcGVuZHNPbkNoYXJhY3RlckRhdGEpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRPYnNlcnZlU3R5bGVzKHBhdHRlcm5zKSB7XG4gIHJldHVybiBwYXR0ZXJucy5zb21lKHBhdHRlcm4gPT4gcGF0dGVybi5kZXBlbmRzT25TdHlsZXMpO1xufVxuXG4vKipcbiAqIEBjYWxsYmFjayBoaWRlRWxlbXNGdW5jXG4gKiBAcGFyYW0ge05vZGVbXX0gZWxlbWVudHMgRWxlbWVudHMgb24gdGhlIHBhZ2UgdGhhdCBzaG91bGQgYmUgaGlkZGVuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBlbGVtZW50RmlsdGVyc1xuICogICBUaGUgZmlsdGVyIHRleHQgdGhhdCBjYXVzZWQgdGhlIGVsZW1lbnRzIHRvIGJlIGhpZGRlblxuICovXG5cbi8qKlxuICogQGNhbGxiYWNrIHVuaGlkZUVsZW1zRnVuY1xuICogQHBhcmFtIHtOb2RlW119IGVsZW1lbnRzIEVsZW1lbnRzIG9uIHRoZSBwYWdlIHRoYXQgc2hvdWxkIGJlIGhpZGRlblxuICovXG5cbi8qKlxuICogQGNhbGxiYWNrIHJlbW92ZUVsZW1zRnVuY1xuICogQHBhcmFtIHtOb2RlW119IGVsZW1lbnRzIEVsZW1lbnRzIG9uIHRoZSBwYWdlIHRoYXQgc2hvdWxkIGJlIHJlbW92ZWRcbiAqIEBwYXJhbSB7c3RyaW5nW119IGVsZW1lbnRGaWx0ZXJzXG4gKiAgIFRoZSBmaWx0ZXIgdGV4dCB0aGF0IGNhdXNlZCB0aGUgZWxlbWVudHMgdG8gYmUgcmVtb3ZlZFxuICogcmVtb3ZlZCBmcm9tIHRoZSBET01cbiAqL1xuXG4vKipcbiAqIEBjYWxsYmFjayBjc3NFbGVtc0Z1bmNcbiAqIEBwYXJhbSB7Tm9kZVtdfSBlbGVtZW50cyBFbGVtZW50cyBvbiB0aGUgcGFnZSB0aGF0IHNob3VsZFxuICogYXBwbHkgaW5saW5lIENTUyBydWxlc1xuICogQHBhcmFtIHtzdHJpbmdbXX0gY3NzUGF0dGVybnMgVGhlIENTUyBwYXR0ZXJucyB0byBiZSBhcHBsaWVkXG4gKi9cblxuXG4vKipcbiAqIE1hbmFnZXMgdGhlIGZyb250LWVuZCBwcm9jZXNzaW5nIG9mIGVsZW1lbnQgaGlkaW5nIGVtdWxhdGlvbiBmaWx0ZXJzLlxuICovXG5leHBvcnRzLkVsZW1IaWRlRW11bGF0aW9uID0gY2xhc3MgRWxlbUhpZGVFbXVsYXRpb24ge1xuICAvKipcbiAgICogQHBhcmFtIHttb2R1bGU6Y29udGVudC9lbGVtSGlkZUVtdWxhdGlvbn5oaWRlRWxlbXNGdW5jfSBoaWRlRWxlbXNGdW5jXG4gICAqICAgQSBjYWxsYmFjayB0aGF0IHNob3VsZCBiZSBwcm92aWRlZCB0byBkbyB0aGUgYWN0dWFsIGVsZW1lbnQgaGlkaW5nLlxuICAgKiBAcGFyYW0ge21vZHVsZTpjb250ZW50L2VsZW1IaWRlRW11bGF0aW9ufnVuaGlkZUVsZW1zRnVuY30gdW5oaWRlRWxlbXNGdW5jXG4gICAqICAgQSBjYWxsYmFjayB0aGF0IHNob3VsZCBiZSBwcm92aWRlZCB0byB1bmhpZGUgcHJldmlvdXNseSBoaWRkZW4gZWxlbWVudHMuXG4gICAqIEBwYXJhbSB7bW9kdWxlOmNvbnRlbnQvZWxlbUhpZGVFbXVsYXRpb25+cmVtb3ZlRWxlbXNGdW5jfSByZW1vdmVFbGVtc0Z1bmNcbiAgICogICBBIGNhbGxiYWNrIHRoYXQgc2hvdWxkIGJlIHByb3ZpZGVkIHRvIHJlbW92ZSBlbGVtZW50cyBmcm9tIHRoZSBET00uXG4gICAqIEBwYXJhbSB7bW9kdWxlOmNvbnRlbnQvZWxlbUhpZGVFbXVsYXRpb25+Y3NzRWxlbXNGdW5jfSBjc3NFbGVtc0Z1bmNcbiAgICogICBBIGNhbGxiYWNrIHRoYXQgc2hvdWxkIGJlIHByb3ZpZGVkIHRvIGFwcGx5IGlubGluZSBDU1MgcnVsZXMgdG8gZWxlbWVudHNcbiAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgaGlkZUVsZW1zRnVuYyA9ICgpID0+IHt9LFxuICAgIHVuaGlkZUVsZW1zRnVuYyA9ICgpID0+IHt9LFxuICAgIHJlbW92ZUVsZW1zRnVuYyA9ICgpID0+IHt9LFxuICAgIGNzc0VsZW1zRnVuYyA9ICgpID0+IHt9XG4gICkge1xuICAgIHRoaXMuX2ZpbHRlcmluZ0luUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB0aGlzLl9uZXh0RmlsdGVyaW5nU2NoZWR1bGVkID0gZmFsc2U7XG4gICAgdGhpcy5fbGFzdEludm9jYXRpb24gPSAtbWluSW52b2NhdGlvbkludGVydmFsO1xuICAgIHRoaXMuX3NjaGVkdWxlZFByb2Nlc3NpbmcgPSBudWxsO1xuXG4gICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50O1xuICAgIHRoaXMuaGlkZUVsZW1zRnVuYyA9IGhpZGVFbGVtc0Z1bmM7XG4gICAgdGhpcy51bmhpZGVFbGVtc0Z1bmMgPSB1bmhpZGVFbGVtc0Z1bmM7XG4gICAgdGhpcy5yZW1vdmVFbGVtc0Z1bmMgPSByZW1vdmVFbGVtc0Z1bmM7XG4gICAgdGhpcy5jc3NFbGVtc0Z1bmMgPSBjc3NFbGVtc0Z1bmM7XG4gICAgdGhpcy5vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMub2JzZXJ2ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmhpZGRlbkVsZW1lbnRzID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgaXNTYW1lT3JpZ2luKHN0eWxlc2hlZXQpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIG5ldyBVUkwoc3R5bGVzaGVldC5ocmVmKS5vcmlnaW4gPT0gdGhpcy5kb2N1bWVudC5sb2NhdGlvbi5vcmlnaW47XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAvLyBJbnZhbGlkIFVSTCwgYXNzdW1lIHRoYXQgaXQgaXMgZmlyc3QtcGFydHkuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgdGhlIHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciB0aGUgc2VsZWN0b3IgdG8gcGFyc2VcbiAgICogQHJldHVybiB7QXJyYXl9IHNlbGVjdG9ycyBpcyBhbiBhcnJheSBvZiBvYmplY3RzLFxuICAgKiBvciBudWxsIGluIGNhc2Ugb2YgZXJyb3JzLlxuICAgKi9cbiAgcGFyc2VTZWxlY3RvcihzZWxlY3Rvcikge1xuICAgIGlmIChzZWxlY3Rvci5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGxldCBtYXRjaCA9IGFicFNlbGVjdG9yUmVnZXhwLmV4ZWMoc2VsZWN0b3IpO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHJldHVybiBbbmV3IFBsYWluU2VsZWN0b3Ioc2VsZWN0b3IpXTtcbiAgICB9XG5cbiAgICBsZXQgc2VsZWN0b3JzID0gW107XG4gICAgaWYgKG1hdGNoLmluZGV4ID4gMCkge1xuICAgICAgc2VsZWN0b3JzLnB1c2gobmV3IFBsYWluU2VsZWN0b3Ioc2VsZWN0b3Iuc3Vic3RyaW5nKDAsIG1hdGNoLmluZGV4KSkpO1xuICAgIH1cblxuICAgIGxldCBzdGFydEluZGV4ID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XG4gICAgbGV0IGNvbnRlbnQgPSBwYXJzZVNlbGVjdG9yQ29udGVudChzZWxlY3Rvciwgc3RhcnRJbmRleCk7XG4gICAgaWYgKCFjb250ZW50KSB7XG4gICAgICBjb25zb2xlLndhcm4obmV3IFN5bnRheEVycm9yKFwiRmFpbGVkIHRvIHBhcnNlIEFkYmxvY2sgUGx1cyBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBzZWxlY3RvciAke3NlbGVjdG9yfSBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkdWUgdG8gdW5tYXRjaGVkIHBhcmVudGhlc2VzLlwiKSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAobWF0Y2hbMV0gPT0gXCItYWJwLXByb3BlcnRpZXNcIikge1xuICAgICAgc2VsZWN0b3JzLnB1c2gobmV3IFByb3BzU2VsZWN0b3IoY29udGVudC50ZXh0KSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG1hdGNoWzFdID09IFwiLWFicC1oYXNcIiB8fCBtYXRjaFsxXSA9PSBcImhhc1wiKSB7XG4gICAgICBsZXQgaGFzU2VsZWN0b3JzID0gdGhpcy5wYXJzZVNlbGVjdG9yKGNvbnRlbnQudGV4dCk7XG4gICAgICBpZiAoaGFzU2VsZWN0b3JzID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBzZWxlY3RvcnMucHVzaChuZXcgSGFzU2VsZWN0b3IoaGFzU2VsZWN0b3JzKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG1hdGNoWzFdID09IFwiLWFicC1jb250YWluc1wiIHx8IG1hdGNoWzFdID09IFwiaGFzLXRleHRcIikge1xuICAgICAgc2VsZWN0b3JzLnB1c2gobmV3IENvbnRhaW5zU2VsZWN0b3IoY29udGVudC50ZXh0KSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG1hdGNoWzFdID09PSBcInhwYXRoXCIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNlbGVjdG9ycy5wdXNoKG5ldyBYUGF0aFNlbGVjdG9yKGNvbnRlbnQudGV4dCkpO1xuICAgICAgfVxuICAgICAgY2F0Y2ggKHttZXNzYWdlfSkge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgbmV3IFN5bnRheEVycm9yKFxuICAgICAgICAgICAgXCJGYWlsZWQgdG8gcGFyc2UgQWRibG9jayBQbHVzIFwiICtcbiAgICAgICAgICAgIGBzZWxlY3RvciAke3NlbGVjdG9yfSwgaW52YWxpZCBgICtcbiAgICAgICAgICAgIGB4cGF0aDogJHtjb250ZW50LnRleHR9IGAgK1xuICAgICAgICAgICAgYGVycm9yOiAke21lc3NhZ2V9LmBcbiAgICAgICAgICApXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKG1hdGNoWzFdID09IFwibm90XCIpIHtcbiAgICAgIGxldCBub3RTZWxlY3RvcnMgPSB0aGlzLnBhcnNlU2VsZWN0b3IoY29udGVudC50ZXh0KTtcbiAgICAgIGlmIChub3RTZWxlY3RvcnMgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgYWxsIG9mIHRoZSBpbm5lciBzZWxlY3RvcnMgYXJlIFBsYWluU2VsZWN0b3JzLCB0aGVuIHdlXG4gICAgICAvLyBkb24ndCBhY3R1YWxseSBuZWVkIHRvIHVzZSBvdXIgc2VsZWN0b3IgYXQgYWxsLiBXZSdyZSBiZXR0ZXJcbiAgICAgIC8vIG9mZiBkZWxlZ2F0aW5nIHRvIHRoZSBicm93c2VyIDpub3QgaW1wbGVtZW50YXRpb24uXG4gICAgICBpZiAobm90U2VsZWN0b3JzLmV2ZXJ5KHMgPT4gcyBpbnN0YW5jZW9mIFBsYWluU2VsZWN0b3IpKSB7XG4gICAgICAgIHNlbGVjdG9ycy5wdXNoKG5ldyBQbGFpblNlbGVjdG9yKGA6bm90KCR7Y29udGVudC50ZXh0fSlgKSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc2VsZWN0b3JzLnB1c2gobmV3IE5vdFNlbGVjdG9yKG5vdFNlbGVjdG9ycykpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIHRoaXMgaXMgYW4gZXJyb3IsIGNhbid0IHBhcnNlIHNlbGVjdG9yLlxuICAgICAgY29uc29sZS53YXJuKG5ldyBTeW50YXhFcnJvcihcIkZhaWxlZCB0byBwYXJzZSBBZGJsb2NrIFBsdXMgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgc2VsZWN0b3IgJHtzZWxlY3Rvcn0sIGludmFsaWQgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBwc2V1ZG8tY2xhc3MgOiR7bWF0Y2hbMV19KCkuYCkpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IHN1ZmZpeCA9IHRoaXMucGFyc2VTZWxlY3RvcihzZWxlY3Rvci5zdWJzdHJpbmcoY29udGVudC5lbmQgKyAxKSk7XG4gICAgaWYgKHN1ZmZpeCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzZWxlY3RvcnMucHVzaCguLi5zdWZmaXgpO1xuXG4gICAgaWYgKHNlbGVjdG9ycy5sZW5ndGggPT0gMSAmJiBzZWxlY3RvcnNbMF0gaW5zdGFuY2VvZiBDb250YWluc1NlbGVjdG9yKSB7XG4gICAgICBjb25zb2xlLndhcm4obmV3IFN5bnRheEVycm9yKFwiRmFpbGVkIHRvIHBhcnNlIEFkYmxvY2sgUGx1cyBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBzZWxlY3RvciAke3NlbGVjdG9yfSwgY2FuJ3QgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGF2ZSBhIGxvbmVseSA6LWFicC1jb250YWlucygpLlwiKSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdG9ycztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkcyB0aGUgcnVsZXMgb3V0IG9mIENTUyBzdHlsZXNoZWV0c1xuICAgKiBAcGFyYW0ge0NTU1N0eWxlU2hlZXRbXX0gW3N0eWxlc2hlZXRzXSBUaGUgbGlzdCBvZiBzdHlsZXNoZWV0cyB0b1xuICAgKiByZWFkLlxuICAgKiBAcmV0dXJuIHtDU1NTdHlsZVJ1bGVbXX1cbiAgICovXG4gIF9yZWFkQ3NzUnVsZXMoc3R5bGVzaGVldHMpIHtcbiAgICBsZXQgY3NzU3R5bGVzID0gW107XG5cbiAgICBmb3IgKGxldCBzdHlsZXNoZWV0IG9mIHN0eWxlc2hlZXRzIHx8IFtdKSB7XG4gICAgICAvLyBFeHBsaWNpdGx5IGlnbm9yZSB0aGlyZC1wYXJ0eSBzdHlsZXNoZWV0cyB0byBlbnN1cmUgY29uc2lzdGVudCBiZWhhdmlvclxuICAgICAgLy8gYmV0d2VlbiBGaXJlZm94IGFuZCBDaHJvbWUuXG4gICAgICBpZiAoIXRoaXMuaXNTYW1lT3JpZ2luKHN0eWxlc2hlZXQpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgcnVsZXM7XG4gICAgICB0cnkge1xuICAgICAgICBydWxlcyA9IHN0eWxlc2hlZXQuY3NzUnVsZXM7XG4gICAgICB9XG4gICAgICBjYXRjaCAoZSkge1xuICAgICAgICAvLyBPbiBGaXJlZm94LCB0aGVyZSBpcyBhIGNoYW5jZSB0aGF0IGFuIEludmFsaWRBY2Nlc3NFcnJvclxuICAgICAgICAvLyBnZXQgdGhyb3duIHdoZW4gYWNjZXNzaW5nIGNzc1J1bGVzLiBKdXN0IHNraXAgdGhlIHN0eWxlc2hlZXRcbiAgICAgICAgLy8gaW4gdGhhdCBjYXNlLlxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9zZWFyY2hmb3gub3JnL21vemlsbGEtY2VudHJhbC9yZXYvZjY1ZDc1MjhlMzRlZjFhNzY2NWI0YTFhN2I3Y2RiMTM4OGZjZDNhYS9sYXlvdXQvc3R5bGUvU3R5bGVTaGVldC5jcHAjNjk5XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJ1bGVzKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBydWxlIG9mIHJ1bGVzKSB7XG4gICAgICAgIGlmIChydWxlLnR5cGUgIT0gcnVsZS5TVFlMRV9SVUxFKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjc3NTdHlsZXMucHVzaChzdHJpbmdpZnlTdHlsZShydWxlKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjc3NTdHlsZXM7XG4gIH1cblxuICAvKipcbiAgICogUHJvY2Vzc2VzIHRoZSBjdXJyZW50IGRvY3VtZW50IGFuZCBhcHBsaWVzIGFsbCBydWxlcyB0byBpdC5cbiAgICogQHBhcmFtIHtDU1NTdHlsZVNoZWV0W119IFtzdHlsZXNoZWV0c11cbiAgICogICAgVGhlIGxpc3Qgb2YgbmV3IHN0eWxlc2hlZXRzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBkb2N1bWVudCBhbmRcbiAgICogICAgbWFkZSByZXByb2Nlc3NpbmcgbmVjZXNzYXJ5LiBUaGlzIHBhcmFtZXRlciBzaG91bGRuJ3QgYmUgcGFzc2VkIGluIGZvclxuICAgKiAgICB0aGUgaW5pdGlhbCBwcm9jZXNzaW5nLCBhbGwgb2YgZG9jdW1lbnQncyBzdHlsZXNoZWV0cyB3aWxsIGJlIGNvbnNpZGVyZWRcbiAgICogICAgdGhlbiBhbmQgYWxsIHJ1bGVzLCBpbmNsdWRpbmcgdGhlIG9uZXMgbm90IGRlcGVuZGVudCBvbiBzdHlsZXMuXG4gICAqIEBwYXJhbSB7TXV0YXRpb25SZWNvcmRbXX0gW211dGF0aW9uc11cbiAgICogICAgVGhlIGxpc3Qgb2YgRE9NIG11dGF0aW9ucyB0aGF0IGhhdmUgYmVlbiBhcHBsaWVkIHRvIHRoZSBkb2N1bWVudCBhbmRcbiAgICogICAgbWFkZSByZXByb2Nlc3NpbmcgbmVjZXNzYXJ5LiBUaGlzIHBhcmFtZXRlciBzaG91bGRuJ3QgYmUgcGFzc2VkIGluIGZvclxuICAgKiAgICB0aGUgaW5pdGlhbCBwcm9jZXNzaW5nLCB0aGUgZW50aXJlIGRvY3VtZW50IHdpbGwgYmUgY29uc2lkZXJlZFxuICAgKiAgICB0aGVuIGFuZCBhbGwgcnVsZXMsIGluY2x1ZGluZyB0aGUgb25lcyBub3QgZGVwZW5kZW50IG9uIHRoZSBET00uXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqICAgIEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCBvbmNlIGFsbCBmaWx0ZXJpbmcgaXMgY29tcGxldGVkXG4gICAqL1xuICBhc3luYyBfYWRkU2VsZWN0b3JzKHN0eWxlc2hlZXRzLCBtdXRhdGlvbnMpIHtcbiAgICBpZiAodGVzdEluZm8pIHtcbiAgICAgIHRlc3RJbmZvLmxhc3RQcm9jZXNzZWRFbGVtZW50cy5jbGVhcigpO1xuICAgIH1cblxuICAgIGxldCBkZWFkbGluZSA9IG5ld0lkbGVEZWFkbGluZSgpO1xuXG4gICAgaWYgKHNob3VsZE9ic2VydmVTdHlsZXModGhpcy5wYXR0ZXJucykpIHtcbiAgICAgIHRoaXMuX3JlZnJlc2hQYXR0ZXJuU3R5bGVzKCk7XG4gICAgfVxuXG4gICAgbGV0IHBhdHRlcm5zVG9DaGVjayA9IGZpbHRlclBhdHRlcm5zKFxuICAgICAgdGhpcy5wYXR0ZXJucywge3N0eWxlc2hlZXRzLCBtdXRhdGlvbnN9XG4gICAgKTtcblxuICAgIGxldCB0YXJnZXRzID0gZXh0cmFjdE11dGF0aW9uVGFyZ2V0cyhtdXRhdGlvbnMpO1xuXG4gICAgY29uc3QgZWxlbWVudHNUb0hpZGUgPSBbXTtcbiAgICBjb25zdCBlbGVtZW50c1RvSGlkZUZpbHRlcnMgPSBbXTtcbiAgICBjb25zdCBlbGVtZW50c1RvUmVtb3ZlRmlsdGVycyA9IFtdO1xuICAgIGNvbnN0IGVsZW1lbnRzVG9SZW1vdmUgPSBbXTtcbiAgICBjb25zdCBlbGVtZW50c1RvQXBwbHlDU1MgPSBbXTtcbiAgICBjb25zdCBjc3NQYXR0ZXJucyA9IFtdO1xuICAgIGxldCBlbGVtZW50c1RvVW5oaWRlID0gbmV3IFNldCh0aGlzLmhpZGRlbkVsZW1lbnRzLmtleXMoKSk7XG4gICAgZm9yIChsZXQgcGF0dGVybiBvZiBwYXR0ZXJuc1RvQ2hlY2spIHtcbiAgICAgIGxldCBldmFsdWF0aW9uVGFyZ2V0cyA9IHRhcmdldHM7XG5cbiAgICAgIC8vIElmIHRoZSBwYXR0ZXJuIGFwcGVhcnMgdG8gY29udGFpbiBhbnkgc2libGluZyBjb21iaW5hdG9ycywgd2UgY2FuJ3RcbiAgICAgIC8vIGVhc2lseSBvcHRpbWl6ZSBiYXNlZCBvbiB0aGUgbXV0YXRpb24gdGFyZ2V0cy4gU2luY2UgdGhpcyBpcyBhXG4gICAgICAvLyBzcGVjaWFsIGNhc2UsIHNraXAgdGhlIG9wdGltaXphdGlvbi4gQnkgc2V0dGluZyBpdCB0byBudWxsIGhlcmUgd2VcbiAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBwcm9jZXNzIHRoZSBlbnRpcmUgRE9NLlxuICAgICAgaWYgKHBhdHRlcm4ubWF5YmVDb250YWluc1NpYmxpbmdDb21iaW5hdG9ycykge1xuICAgICAgICBldmFsdWF0aW9uVGFyZ2V0cyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGxldCBnZW5lcmF0b3IgPSBwYXR0ZXJuLmV2YWx1YXRlKHRoaXMuZG9jdW1lbnQsIGV2YWx1YXRpb25UYXJnZXRzKTtcbiAgICAgIGZvciAobGV0IHNlbGVjdG9yIG9mIGdlbmVyYXRvcikge1xuICAgICAgICBpZiAoc2VsZWN0b3IgIT0gbnVsbCkge1xuICAgICAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgdGhpcy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgaWYgKHBhdHRlcm4ucmVtb3ZlKSB7XG4gICAgICAgICAgICAgIGVsZW1lbnRzVG9SZW1vdmUucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgICAgZWxlbWVudHNUb1JlbW92ZUZpbHRlcnMucHVzaChwYXR0ZXJuLnRleHQpO1xuICAgICAgICAgICAgICBlbGVtZW50c1RvVW5oaWRlLmRlbGV0ZShlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHBhdHRlcm4uY3NzKSB7XG4gICAgICAgICAgICAgIGVsZW1lbnRzVG9BcHBseUNTUy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgICBjc3NQYXR0ZXJucy5wdXNoKHBhdHRlcm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIXRoaXMuaGlkZGVuRWxlbWVudHMuaGFzKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgIGVsZW1lbnRzVG9IaWRlLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICAgIGVsZW1lbnRzVG9IaWRlRmlsdGVycy5wdXNoKHBhdHRlcm4udGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgZWxlbWVudHNUb1VuaGlkZS5kZWxldGUoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlYWRsaW5lLnRpbWVSZW1haW5pbmcoKSA8PSAwKSB7XG4gICAgICAgICAgZGVhZGxpbmUgPSBhd2FpdCB5aWVsZFRocmVhZCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3JlbW92ZUVsZW1zKGVsZW1lbnRzVG9SZW1vdmUsIGVsZW1lbnRzVG9SZW1vdmVGaWx0ZXJzKTtcbiAgICB0aGlzLl9hcHBseUNTU1RvRWxlbXMoZWxlbWVudHNUb0FwcGx5Q1NTLCBjc3NQYXR0ZXJucyk7XG4gICAgdGhpcy5faGlkZUVsZW1zKGVsZW1lbnRzVG9IaWRlLCBlbGVtZW50c1RvSGlkZUZpbHRlcnMpO1xuXG4gICAgLy8gVGhlIHNlYXJjaCBmb3IgZWxlbWVudHMgdG8gaGlkZSBpdCBvcHRpbWl6ZWQgdG8gZmluZCBuZXcgdGhpbmdzXG4gICAgLy8gdG8gaGlkZSBxdWlja2x5LCBieSBub3QgY2hlY2tpbmcgYWxsIHBhdHRlcm5zIGFuZCBub3QgY2hlY2tpbmdcbiAgICAvLyB0aGUgZnVsbCBET00uIFRoYXQncyB3aHkgd2UgbmVlZCB0byBkbyBhIG1vcmUgdGhvcm91Z2ggY2hlY2tcbiAgICAvLyBmb3IgZWFjaCByZW1haW5pbmcgZWxlbWVudCB0aGF0IG1pZ2h0IG5lZWQgdG8gYmUgdW5oaWRkZW4sXG4gICAgLy8gY2hlY2tpbmcgYWxsIHBhdHRlcm5zLlxuICAgIGZvciAobGV0IGVsZW0gb2YgZWxlbWVudHNUb1VuaGlkZSkge1xuICAgICAgaWYgKCFlbGVtLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgIC8vIGVsZW1lbnRzIHRoYXQgYXJlIG5vIGxvbmdlciBpbiB0aGUgRE9NIHNob3VsZCBiZSB1bmhpZGRlblxuICAgICAgICAvLyBpbiBjYXNlIHRoZXkncmUgZXZlciByZWFkZGVkLCBhbmQgdGhlbiBmb3Jnb3R0ZW4gYWJvdXQgc29cbiAgICAgICAgLy8gd2UgZG9uJ3QgY2F1c2UgYSBtZW1vcnkgbGVhay5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBsZXQgbWF0Y2hlc0FueSA9IHRoaXMucGF0dGVybnMuc29tZShwYXR0ZXJuID0+IHBhdHRlcm4ubWF0Y2hlcyhcbiAgICAgICAgZWxlbSwgdGhpcy5kb2N1bWVudFxuICAgICAgKSk7XG4gICAgICBpZiAobWF0Y2hlc0FueSkge1xuICAgICAgICBlbGVtZW50c1RvVW5oaWRlLmRlbGV0ZShlbGVtKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRlYWRsaW5lLnRpbWVSZW1haW5pbmcoKSA8PSAwKSB7XG4gICAgICAgIGRlYWRsaW5lID0gYXdhaXQgeWllbGRUaHJlYWQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fdW5oaWRlRWxlbXMoQXJyYXkuZnJvbShlbGVtZW50c1RvVW5oaWRlKSk7XG4gIH1cblxuICBfcmVtb3ZlRWxlbXMoZWxlbWVudHNUb1JlbW92ZSwgZWxlbWVudEZpbHRlcnMpIHtcbiAgICBpZiAoZWxlbWVudHNUb1JlbW92ZS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnJlbW92ZUVsZW1zRnVuYyhlbGVtZW50c1RvUmVtb3ZlLCBlbGVtZW50RmlsdGVycyk7XG4gICAgICBmb3IgKGxldCBlbGVtIG9mIGVsZW1lbnRzVG9SZW1vdmUpIHtcbiAgICAgICAgLy8gdGhleSdyZSBub3QgaGlkZGVuIGFueW1vcmUgKGlmIHRoZXkgZXZlciB3ZXJlKSwgdGhleSdyZVxuICAgICAgICAvLyByZW1vdmVkLiBUaGVyZSdzIG5vIHVuaGlkaW5nIHRoZXNlIG9uZXMhXG4gICAgICAgIHRoaXMuaGlkZGVuRWxlbWVudHMuZGVsZXRlKGVsZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9hcHBseUNTU1RvRWxlbXMoZWxlbWVudHMsIGNzc1BhdHRlcm5zKSB7XG4gICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuY3NzRWxlbXNGdW5jKGVsZW1lbnRzLCBjc3NQYXR0ZXJucyk7XG4gICAgfVxuICB9XG5cbiAgX2hpZGVFbGVtcyhlbGVtZW50c1RvSGlkZSwgZWxlbWVudEZpbHRlcnMpIHtcbiAgICBpZiAoZWxlbWVudHNUb0hpZGUubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5oaWRlRWxlbXNGdW5jKGVsZW1lbnRzVG9IaWRlLCBlbGVtZW50RmlsdGVycyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnRzVG9IaWRlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuaGlkZGVuRWxlbWVudHMuc2V0KGVsZW1lbnRzVG9IaWRlW2ldLCBlbGVtZW50RmlsdGVyc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3VuaGlkZUVsZW1zKGVsZW1lbnRzVG9VbmhpZGUpIHtcbiAgICBpZiAoZWxlbWVudHNUb1VuaGlkZS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnVuaGlkZUVsZW1zRnVuYyhlbGVtZW50c1RvVW5oaWRlKTtcbiAgICAgIGZvciAobGV0IGVsZW0gb2YgZWxlbWVudHNUb1VuaGlkZSkge1xuICAgICAgICB0aGlzLmhpZGRlbkVsZW1lbnRzLmRlbGV0ZShlbGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybWVkIGFueSBzY2hlZHVsZWQgcHJvY2Vzc2luZy5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBhc3luY3Jvbm91cywgYW5kIHNob3VsZCBub3QgYmUgcnVuIG11bHRpcGxlXG4gICAqIHRpbWVzIGluIHBhcmFsbGVsLiBUaGUgZmxhZyBgX2ZpbHRlcmluZ0luUHJvZ3Jlc3NgIGlzIHNldCBhbmRcbiAgICogdW5zZXQgc28geW91IGNhbiBjaGVjayBpZiBpdCdzIGFscmVhZHkgcnVubmluZy5cbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICogIEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCBvbmNlIGFsbCBmaWx0ZXJpbmcgaXMgY29tcGxldGVkXG4gICAqL1xuICBhc3luYyBfcHJvY2Vzc0ZpbHRlcmluZygpIHtcbiAgICBpZiAodGhpcy5fZmlsdGVyaW5nSW5Qcm9ncmVzcykge1xuICAgICAgY29uc29sZS53YXJuKFwiRWxlbUhpZGVFbXVsYXRpb24gc2NoZWR1bGluZyBlcnJvcjogXCIgK1xuICAgICAgICAgICAgICAgICAgIFwiVHJpZWQgdG8gcHJvY2VzcyBmaWx0ZXJpbmcgaW4gcGFyYWxsZWwuXCIpO1xuICAgICAgaWYgKHRlc3RJbmZvKSB7XG4gICAgICAgIHRlc3RJbmZvLmZhaWxlZEFzc2VydGlvbnMucHVzaChcbiAgICAgICAgICBcIlRyaWVkIHRvIHByb2Nlc3MgZmlsdGVyaW5nIGluIHBhcmFsbGVsXCJcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwYXJhbXMgPSB0aGlzLl9zY2hlZHVsZWRQcm9jZXNzaW5nIHx8IHt9O1xuICAgIHRoaXMuX3NjaGVkdWxlZFByb2Nlc3NpbmcgPSBudWxsO1xuICAgIHRoaXMuX2ZpbHRlcmluZ0luUHJvZ3Jlc3MgPSB0cnVlO1xuICAgIHRoaXMuX25leHRGaWx0ZXJpbmdTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICBhd2FpdCB0aGlzLl9hZGRTZWxlY3RvcnMoXG4gICAgICBwYXJhbXMuc3R5bGVzaGVldHMsXG4gICAgICBwYXJhbXMubXV0YXRpb25zXG4gICAgKTtcbiAgICB0aGlzLl9sYXN0SW52b2NhdGlvbiA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuX2ZpbHRlcmluZ0luUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5fc2NoZWR1bGVkUHJvY2Vzc2luZykge1xuICAgICAgdGhpcy5fc2NoZWR1bGVOZXh0RmlsdGVyaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgbmV3IGNoYW5nZXMgdG8gdGhlIGxpc3Qgb2YgZmlsdGVycyBmb3IgdGhlIG5leHQgdGltZVxuICAgKiBmaWx0ZXJpbmcgaXMgcnVuLlxuICAgKiBAcGFyYW0ge0NTU1N0eWxlU2hlZXRbXX0gW3N0eWxlc2hlZXRzXVxuICAgKiAgICBuZXcgc3R5bGVzaGVldHMgdG8gYmUgcHJvY2Vzc2VkLiBUaGlzIHBhcmFtZXRlciBzaG91bGQgYmUgb21pdHRlZFxuICAgKiAgICBmb3IgZnVsbCByZXByb2Nlc3NpbmcuXG4gICAqIEBwYXJhbSB7TXV0YXRpb25SZWNvcmRbXX0gW211dGF0aW9uc11cbiAgICogICAgbmV3IERPTSBtdXRhdGlvbnMgdG8gYmUgcHJvY2Vzc2VkLiBUaGlzIHBhcmFtZXRlciBzaG91bGQgYmUgb21pdHRlZFxuICAgKiAgICBmb3IgZnVsbCByZXByb2Nlc3NpbmcuXG4gICAqL1xuICBfYXBwZW5kU2NoZWR1bGVkUHJvY2Vzc2luZyhzdHlsZXNoZWV0cywgbXV0YXRpb25zKSB7XG4gICAgaWYgKCF0aGlzLl9zY2hlZHVsZWRQcm9jZXNzaW5nKSB7XG4gICAgICAvLyBUaGVyZSBpc24ndCBhbnl0aGluZyBzY2hlZHVsZWQgeWV0LiBNYWtlIHRoZSBzY2hlZHVsZS5cbiAgICAgIHRoaXMuX3NjaGVkdWxlZFByb2Nlc3NpbmcgPSB7c3R5bGVzaGVldHMsIG11dGF0aW9uc307XG4gICAgfVxuICAgIGVsc2UgaWYgKCFzdHlsZXNoZWV0cyAmJiAhbXV0YXRpb25zKSB7XG4gICAgICAvLyBUaGUgbmV3IHJlcXVlc3Qgd2FzIHRvIHJlcHJvY2VzcyBldmVyeXRoaW5nLCBhbmQgc28gYW55XG4gICAgICAvLyBwcmV2aW91cyBmaWx0ZXJzIGFyZSBpcnJlbGV2YW50LlxuICAgICAgdGhpcy5fc2NoZWR1bGVkUHJvY2Vzc2luZyA9IHt9O1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLl9zY2hlZHVsZWRQcm9jZXNzaW5nLnN0eWxlc2hlZXRzIHx8XG4gICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVkUHJvY2Vzc2luZy5tdXRhdGlvbnMpIHtcbiAgICAgIC8vIFRoZSBwcmV2aW91cyBmaWx0ZXJzIGFyZSBub3QgdG8gZmlsdGVyIGV2ZXJ5dGhpbmcsIHNvIHRoZSBuZXdcbiAgICAgIC8vIHBhcmFtZXRlcnMgbWF0dGVyLiBQdXNoIHRoZW0gb250byB0aGUgYXBwcm9wcmlhdGUgbGlzdHMuXG4gICAgICBpZiAoc3R5bGVzaGVldHMpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zY2hlZHVsZWRQcm9jZXNzaW5nLnN0eWxlc2hlZXRzKSB7XG4gICAgICAgICAgdGhpcy5fc2NoZWR1bGVkUHJvY2Vzc2luZy5zdHlsZXNoZWV0cyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NjaGVkdWxlZFByb2Nlc3Npbmcuc3R5bGVzaGVldHMucHVzaCguLi5zdHlsZXNoZWV0cyk7XG4gICAgICB9XG4gICAgICBpZiAobXV0YXRpb25zKSB7XG4gICAgICAgIGlmICghdGhpcy5fc2NoZWR1bGVkUHJvY2Vzc2luZy5tdXRhdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLl9zY2hlZHVsZWRQcm9jZXNzaW5nLm11dGF0aW9ucyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NjaGVkdWxlZFByb2Nlc3NpbmcubXV0YXRpb25zLnB1c2goLi4ubXV0YXRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyB0aGlzLl9zY2hlZHVsZWRQcm9jZXNzaW5nIGlzIGFscmVhZHkgZ29pbmcgdG8gcmVjaGVja1xuICAgICAgLy8gZXZlcnl0aGluZywgc28gbm8gbmVlZCB0byBkbyBhbnl0aGluZyBoZXJlLlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTY2hlZHVsZSBmaWx0ZXJpbmcgdG8gYmUgcHJvY2Vzc2VkIGluIHRoZSBmdXR1cmUsIG9yIHN0YXJ0XG4gICAqIHByb2Nlc3NpbmcgaW1tZWRpYXRlbHkuXG4gICAqXG4gICAqIElmIHByb2Nlc3NpbmcgaXMgYWxyZWFkeSBzY2hlZHVsZWQsIHRoaXMgZG9lcyBub3RoaW5nLlxuICAgKi9cbiAgX3NjaGVkdWxlTmV4dEZpbHRlcmluZygpIHtcbiAgICBpZiAodGhpcy5fbmV4dEZpbHRlcmluZ1NjaGVkdWxlZCB8fCB0aGlzLl9maWx0ZXJpbmdJblByb2dyZXNzKSB7XG4gICAgICAvLyBUaGUgbmV4dCBvbmUgaGFzIGFscmVhZHkgYmVlbiBzY2hlZHVsZWQuIE91ciBuZXcgZXZlbnRzIGFyZVxuICAgICAgLy8gb24gdGhlIHF1ZXVlLCBzbyBub3RoaW5nIG1vcmUgdG8gZG8uXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJsb2FkaW5nXCIpIHtcbiAgICAgIC8vIERvY3VtZW50IGlzbid0IGZ1bGx5IGxvYWRlZCB5ZXQsIHNvIHNjaGVkdWxlIG91ciBmaXJzdFxuICAgICAgLy8gZmlsdGVyaW5nIGFzIHNvb24gYXMgdGhhdCdzIGRvbmUuXG4gICAgICB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwiRE9NQ29udGVudExvYWRlZFwiLFxuICAgICAgICAoKSA9PiB0aGlzLl9wcm9jZXNzRmlsdGVyaW5nKCksXG4gICAgICAgIHtvbmNlOiB0cnVlfVxuICAgICAgKTtcbiAgICAgIHRoaXMuX25leHRGaWx0ZXJpbmdTY2hlZHVsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChwZXJmb3JtYW5jZS5ub3coKSAtIHRoaXMuX2xhc3RJbnZvY2F0aW9uIDxcbiAgICAgICAgICAgICBtaW5JbnZvY2F0aW9uSW50ZXJ2YWwpIHtcbiAgICAgIC8vIEl0IGhhc24ndCBiZWVuIGxvbmcgZW5vdWdoIHNpbmNlIG91ciBsYXN0IGZpbHRlci4gU2V0IHRoZVxuICAgICAgLy8gdGltZW91dCBmb3Igd2hlbiBpdCdzIHRpbWUgZm9yIHRoYXQuXG4gICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAoKSA9PiB0aGlzLl9wcm9jZXNzRmlsdGVyaW5nKCksXG4gICAgICAgIG1pbkludm9jYXRpb25JbnRlcnZhbCAtIChwZXJmb3JtYW5jZS5ub3coKSAtIHRoaXMuX2xhc3RJbnZvY2F0aW9uKVxuICAgICAgKTtcbiAgICAgIHRoaXMuX25leHRGaWx0ZXJpbmdTY2hlZHVsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIFdlIGNhbiBhY3R1YWxseSBqdXN0IHN0YXJ0IGZpbHRlcmluZyBpbW1lZGlhdGVseSFcbiAgICAgIHRoaXMuX3Byb2Nlc3NGaWx0ZXJpbmcoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmUtcnVuIGZpbHRlcmluZyBlaXRoZXIgaW1tZWRpYXRlbHkgb3IgcXVldWVkLlxuICAgKiBAcGFyYW0ge0NTU1N0eWxlU2hlZXRbXX0gW3N0eWxlc2hlZXRzXVxuICAgKiAgICBuZXcgc3R5bGVzaGVldHMgdG8gYmUgcHJvY2Vzc2VkLiBUaGlzIHBhcmFtZXRlciBzaG91bGQgYmUgb21pdHRlZFxuICAgKiAgICBmb3IgZnVsbCByZXByb2Nlc3NpbmcuXG4gICAqIEBwYXJhbSB7TXV0YXRpb25SZWNvcmRbXX0gW211dGF0aW9uc11cbiAgICogICAgbmV3IERPTSBtdXRhdGlvbnMgdG8gYmUgcHJvY2Vzc2VkLiBUaGlzIHBhcmFtZXRlciBzaG91bGQgYmUgb21pdHRlZFxuICAgKiAgICBmb3IgZnVsbCByZXByb2Nlc3NpbmcuXG4gICAqL1xuICBxdWV1ZUZpbHRlcmluZyhzdHlsZXNoZWV0cywgbXV0YXRpb25zKSB7XG4gICAgdGhpcy5fYXBwZW5kU2NoZWR1bGVkUHJvY2Vzc2luZyhzdHlsZXNoZWV0cywgbXV0YXRpb25zKTtcbiAgICB0aGlzLl9zY2hlZHVsZU5leHRGaWx0ZXJpbmcoKTtcbiAgfVxuXG4gIF9yZWZyZXNoUGF0dGVyblN0eWxlcyhzdHlsZXNoZWV0KSB7XG4gICAgbGV0IGFsbENzc1J1bGVzID0gdGhpcy5fcmVhZENzc1J1bGVzKHRoaXMuZG9jdW1lbnQuc3R5bGVTaGVldHMpO1xuICAgIGZvciAobGV0IHBhdHRlcm4gb2YgdGhpcy5wYXR0ZXJucykge1xuICAgICAgcGF0dGVybi5zZXRTdHlsZXMoYWxsQ3NzUnVsZXMpO1xuICAgIH1cbiAgfVxuXG4gIG9uTG9hZChldmVudCkge1xuICAgIGxldCBzdHlsZXNoZWV0ID0gZXZlbnQudGFyZ2V0LnNoZWV0O1xuICAgIGlmIChzdHlsZXNoZWV0KSB7XG4gICAgICB0aGlzLnF1ZXVlRmlsdGVyaW5nKFtzdHlsZXNoZWV0XSk7XG4gICAgfVxuICB9XG5cbiAgb2JzZXJ2ZShtdXRhdGlvbnMpIHtcbiAgICBpZiAodGVzdEluZm8pIHtcbiAgICAgIC8vIEluIHRlc3QgbW9kZSwgZmlsdGVyIG91dCBhbnkgbXV0YXRpb25zIGxpa2VseSBkb25lIGJ5IHVzXG4gICAgICAvLyAoaS5lLiBzdHlsZT1cImRpc3BsYXk6IG5vbmUgIWltcG9ydGFudFwiKS4gVGhpcyBtYWtlcyBpdCBlYXNpZXIgdG9cbiAgICAgIC8vIG9ic2VydmUgaG93IHRoZSBjb2RlIHJlc3BvbmRzIHRvIERPTSBtdXRhdGlvbnMuXG4gICAgICBtdXRhdGlvbnMgPSBtdXRhdGlvbnMuZmlsdGVyKFxuICAgICAgICAoe3R5cGUsIGF0dHJpYnV0ZU5hbWUsIHRhcmdldDoge3N0eWxlOiBuZXdWYWx1ZX0sIG9sZFZhbHVlfSkgPT5cbiAgICAgICAgICAhKHR5cGUgPT0gXCJhdHRyaWJ1dGVzXCIgJiYgYXR0cmlidXRlTmFtZSA9PSBcInN0eWxlXCIgJiZcbiAgICAgICAgICAgIG5ld1ZhbHVlLmRpc3BsYXkgPT0gXCJub25lXCIgJiZcbiAgICAgICAgICAgIHRvQ1NTU3R5bGVEZWNsYXJhdGlvbihvbGRWYWx1ZSkuZGlzcGxheSAhPSBcIm5vbmVcIilcbiAgICAgICk7XG5cbiAgICAgIGlmIChtdXRhdGlvbnMubGVuZ3RoID09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucXVldWVGaWx0ZXJpbmcobnVsbCwgbXV0YXRpb25zKTtcbiAgfVxuXG4gIGFwcGx5KHBhdHRlcm5zKSB7XG4gICAgaWYgKHRoaXMucGF0dGVybnMpIHtcbiAgICAgIGxldCByZW1vdmVkUGF0dGVybnMgPSBbXTtcbiAgICAgIGZvciAobGV0IG9sZFBhdHRlcm4gb2YgdGhpcy5wYXR0ZXJucykge1xuICAgICAgICBpZiAoIXBhdHRlcm5zLmZpbmQobmV3UGF0dGVybiA9PiBuZXdQYXR0ZXJuLnRleHQgPT0gb2xkUGF0dGVybi50ZXh0KSkge1xuICAgICAgICAgIHJlbW92ZWRQYXR0ZXJucy5wdXNoKG9sZFBhdHRlcm4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgZWxlbWVudHNUb1VuaGlkZSA9IFtdO1xuICAgICAgZm9yIChsZXQgcGF0dGVybiBvZiByZW1vdmVkUGF0dGVybnMpIHtcbiAgICAgICAgZm9yIChsZXQgW2VsZW1lbnQsIGZpbHRlcl0gb2YgdGhpcy5oaWRkZW5FbGVtZW50cykge1xuICAgICAgICAgIGlmIChmaWx0ZXIgPT0gcGF0dGVybi50ZXh0KSB7XG4gICAgICAgICAgICBlbGVtZW50c1RvVW5oaWRlLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZWxlbWVudHNUb1VuaGlkZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuX3VuaGlkZUVsZW1zKGVsZW1lbnRzVG9VbmhpZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucGF0dGVybnMgPSBbXTtcbiAgICBmb3IgKGxldCBwYXR0ZXJuIG9mIHBhdHRlcm5zKSB7XG4gICAgICBsZXQgc2VsZWN0b3JzID0gdGhpcy5wYXJzZVNlbGVjdG9yKHBhdHRlcm4uc2VsZWN0b3IpO1xuICAgICAgaWYgKHNlbGVjdG9ycyAhPSBudWxsICYmIHNlbGVjdG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMucGF0dGVybnMucHVzaChcbiAgICAgICAgICBuZXcgUGF0dGVybihzZWxlY3RvcnMsIHBhdHRlcm4udGV4dCwgcGF0dGVybi5yZW1vdmUsIHBhdHRlcm4uY3NzKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnBhdHRlcm5zLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucXVldWVGaWx0ZXJpbmcoKTtcblxuICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBzaG91bGRPYnNlcnZlQXR0cmlidXRlcyh0aGlzLnBhdHRlcm5zKTtcbiAgICAgIHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZShcbiAgICAgICAgdGhpcy5kb2N1bWVudCxcbiAgICAgICAge1xuICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICBhdHRyaWJ1dGVzLFxuICAgICAgICAgIGF0dHJpYnV0ZU9sZFZhbHVlOiBhdHRyaWJ1dGVzICYmICEhdGVzdEluZm8sXG4gICAgICAgICAgY2hhcmFjdGVyRGF0YTogc2hvdWxkT2JzZXJ2ZUNoYXJhY3RlckRhdGEodGhpcy5wYXR0ZXJucyksXG4gICAgICAgICAgc3VidHJlZTogdHJ1ZVxuICAgICAgICB9XG4gICAgICApO1xuICAgICAgaWYgKHNob3VsZE9ic2VydmVTdHlsZXModGhpcy5wYXR0ZXJucykpIHtcbiAgICAgICAgbGV0IG9uTG9hZCA9IHRoaXMub25Mb2FkLmJpbmQodGhpcyk7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwibG9hZGluZ1wiKSB7XG4gICAgICAgICAgdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBvbkxvYWQsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgb25Mb2FkLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMub2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIHRoaXMuX3VuaGlkZUVsZW1zKEFycmF5LmZyb20odGhpcy5oaWRkZW5FbGVtZW50cy5rZXlzKCkpKTtcbiAgfVxufTtcbiIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBBZGJsb2NrIFBsdXMgPGh0dHBzOi8vYWRibG9ja3BsdXMub3JnLz4sXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDYtcHJlc2VudCBleWVvIEdtYkhcbiAqXG4gKiBBZGJsb2NrIFBsdXMgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXNcbiAqIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIEFkYmxvY2sgUGx1cyBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWRibG9jayBQbHVzLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbi8qKiBAbW9kdWxlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiBwYXR0ZXJucyB0aGF0XG4gKiBge0BsaW5rIG1vZHVsZTpwYXR0ZXJucy5jb21waWxlUGF0dGVybnMgY29tcGlsZVBhdHRlcm5zKCl9YCB3aWxsIGNvbXBpbGVcbiAqIGludG8gcmVndWxhciBleHByZXNzaW9ucy5cbiAqIEB0eXBlIHtudW1iZXJ9XG4gKi9cbmNvbnN0IENPTVBJTEVfUEFUVEVSTlNfTUFYID0gMTAwO1xuXG4vKipcbiAqIFJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkIHRvIG1hdGNoIHRoZSBgXmAgc3VmZml4IGluIGFuIG90aGVyd2lzZSBsaXRlcmFsXG4gKiBwYXR0ZXJuLlxuICogQHR5cGUge1JlZ0V4cH1cbiAqL1xubGV0IHNlcGFyYXRvclJlZ0V4cCA9IC9bXFx4MDAtXFx4MjRcXHgyNi1cXHgyQ1xceDJGXFx4M0EtXFx4NDBcXHg1Qi1cXHg1RVxceDYwXFx4N0ItXFx4N0ZdLztcblxubGV0IGZpbHRlclRvUmVnRXhwID1cbi8qKlxuICogQ29udmVydHMgZmlsdGVyIHRleHQgaW50byByZWd1bGFyIGV4cHJlc3Npb24gc3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBhcyBpbiBGaWx0ZXIoKVxuICogQHJldHVybiB7c3RyaW5nfSByZWd1bGFyIGV4cHJlc3Npb24gcmVwcmVzZW50YXRpb24gb2YgZmlsdGVyIHRleHRcbiAqIEBwYWNrYWdlXG4gKi9cbmV4cG9ydHMuZmlsdGVyVG9SZWdFeHAgPSBmdW5jdGlvbiBmaWx0ZXJUb1JlZ0V4cCh0ZXh0KSB7XG4gIC8vIHJlbW92ZSBtdWx0aXBsZSB3aWxkY2FyZHNcbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFwqKy9nLCBcIipcIik7XG5cbiAgLy8gcmVtb3ZlIGxlYWRpbmcgd2lsZGNhcmRcbiAgaWYgKHRleHRbMF0gPT0gXCIqXCIpIHtcbiAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMSk7XG4gIH1cblxuICAvLyByZW1vdmUgdHJhaWxpbmcgd2lsZGNhcmRcbiAgaWYgKHRleHRbdGV4dC5sZW5ndGggLSAxXSA9PSBcIipcIikge1xuICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCB0ZXh0Lmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHRleHRcbiAgICAvLyByZW1vdmUgYW5jaG9ycyBmb2xsb3dpbmcgc2VwYXJhdG9yIHBsYWNlaG9sZGVyXG4gICAgLnJlcGxhY2UoL1xcXlxcfCQvLCBcIl5cIilcbiAgICAvLyBlc2NhcGUgc3BlY2lhbCBzeW1ib2xzXG4gICAgLnJlcGxhY2UoL1xcVy9nLCBcIlxcXFwkJlwiKVxuICAgIC8vIHJlcGxhY2Ugd2lsZGNhcmRzIGJ5IC4qXG4gICAgLnJlcGxhY2UoL1xcXFxcXCovZywgXCIuKlwiKVxuICAgIC8vIHByb2Nlc3Mgc2VwYXJhdG9yIHBsYWNlaG9sZGVycyAoYWxsIEFOU0kgY2hhcmFjdGVycyBidXQgYWxwaGFudW1lcmljXG4gICAgLy8gY2hhcmFjdGVycyBhbmQgXyUuLSlcbiAgICAucmVwbGFjZSgvXFxcXFxcXi9nLCBgKD86JHtzZXBhcmF0b3JSZWdFeHAuc291cmNlfXwkKWApXG4gICAgLy8gcHJvY2VzcyBleHRlbmRlZCBhbmNob3IgYXQgZXhwcmVzc2lvbiBzdGFydFxuICAgIC5yZXBsYWNlKC9eXFxcXFxcfFxcXFxcXHwvLCBcIl5bXFxcXHdcXFxcLV0rOlxcXFwvKyg/OlteXFxcXC9dK1xcXFwuKT9cIilcbiAgICAvLyBwcm9jZXNzIGFuY2hvciBhdCBleHByZXNzaW9uIHN0YXJ0XG4gICAgLnJlcGxhY2UoL15cXFxcXFx8LywgXCJeXCIpXG4gICAgLy8gcHJvY2VzcyBhbmNob3IgYXQgZXhwcmVzc2lvbiBlbmRcbiAgICAucmVwbGFjZSgvXFxcXFxcfCQvLCBcIiRcIik7XG59O1xuXG4vKipcbiAqIFJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkIHRvIG1hdGNoIHRoZSBgfHxgIHByZWZpeCBpbiBhbiBvdGhlcndpc2UgbGl0ZXJhbFxuICogcGF0dGVybi5cbiAqIEB0eXBlIHtSZWdFeHB9XG4gKi9cbmxldCBleHRlbmRlZEFuY2hvclJlZ0V4cCA9IG5ldyBSZWdFeHAoZmlsdGVyVG9SZWdFeHAoXCJ8fFwiKSArIFwiJFwiKTtcblxuLyoqXG4gKiBSZWd1bGFyIGV4cHJlc3Npb24gZm9yIG1hdGNoaW5nIGEga2V5d29yZCBpbiBhIGZpbHRlci5cbiAqIEB0eXBlIHtSZWdFeHB9XG4gKi9cbmxldCBrZXl3b3JkUmVnRXhwID0gL1teYS16MC05JSpdW2EtejAtOSVdezIsfSg/PVteYS16MC05JSpdKS87XG5cbi8qKlxuICogUmVndWxhciBleHByZXNzaW9uIGZvciBtYXRjaGluZyBhbGwga2V5d29yZHMgaW4gYSBmaWx0ZXIuXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG5sZXQgYWxsS2V5d29yZHNSZWdFeHAgPSBuZXcgUmVnRXhwKGtleXdvcmRSZWdFeHAsIFwiZ1wiKTtcblxuLyoqXG4gKiBBIGBDb21waWxlZFBhdHRlcm5zYCBvYmplY3QgcmVwcmVzZW50cyB0aGUgY29tcGlsZWQgdmVyc2lvbiBvZiBtdWx0aXBsZSBVUkxcbiAqIHJlcXVlc3QgcGF0dGVybnMuIEl0IGlzIHJldHVybmVkIGJ5XG4gKiBge0BsaW5rIG1vZHVsZTpwYXR0ZXJucy5jb21waWxlUGF0dGVybnMgY29tcGlsZVBhdHRlcm5zKCl9YC5cbiAqL1xuY2xhc3MgQ29tcGlsZWRQYXR0ZXJucyB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIG9iamVjdCB3aXRoIHRoZSBnaXZlbiByZWd1bGFyIGV4cHJlc3Npb25zIGZvciBjYXNlLXNlbnNpdGl2ZVxuICAgKiBhbmQgY2FzZS1pbnNlbnNpdGl2ZSBtYXRjaGluZyByZXNwZWN0aXZlbHkuXG4gICAqIEBwYXJhbSB7P1JlZ0V4cH0gW2Nhc2VTZW5zaXRpdmVdXG4gICAqIEBwYXJhbSB7P1JlZ0V4cH0gW2Nhc2VJbnNlbnNpdGl2ZV1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNhc2VTZW5zaXRpdmUsIGNhc2VJbnNlbnNpdGl2ZSkge1xuICAgIHRoaXMuX2Nhc2VTZW5zaXRpdmUgPSBjYXNlU2Vuc2l0aXZlO1xuICAgIHRoaXMuX2Nhc2VJbnNlbnNpdGl2ZSA9IGNhc2VJbnNlbnNpdGl2ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXN0cyB3aGV0aGVyIHRoZSBnaXZlbiBVUkwgcmVxdWVzdCBtYXRjaGVzIHRoZSBwYXR0ZXJucyB1c2VkIHRvIGNyZWF0ZVxuICAgKiB0aGlzIG9iamVjdC5cbiAgICogQHBhcmFtIHttb2R1bGU6dXJsLlVSTFJlcXVlc3R9IHJlcXVlc3RcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICB0ZXN0KHJlcXVlc3QpIHtcbiAgICByZXR1cm4gKCh0aGlzLl9jYXNlU2Vuc2l0aXZlICYmXG4gICAgICAgICAgICAgdGhpcy5fY2FzZVNlbnNpdGl2ZS50ZXN0KHJlcXVlc3QuaHJlZikpIHx8XG4gICAgICAgICAgICAodGhpcy5fY2FzZUluc2Vuc2l0aXZlICYmXG4gICAgICAgICAgICAgdGhpcy5fY2FzZUluc2Vuc2l0aXZlLnRlc3QocmVxdWVzdC5sb3dlckNhc2VIcmVmKSkpO1xuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZXMgcGF0dGVybnMgZnJvbSB0aGUgZ2l2ZW4gZmlsdGVycyBpbnRvIGEgc2luZ2xlXG4gKiBge0BsaW5rIG1vZHVsZTpwYXR0ZXJuc35Db21waWxlZFBhdHRlcm5zIENvbXBpbGVkUGF0dGVybnN9YCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHttb2R1bGU6ZmlsdGVyQ2xhc3Nlcy5VUkxGaWx0ZXJ8XG4gKiAgICAgICAgIFNldC48bW9kdWxlOmZpbHRlckNsYXNzZXMuVVJMRmlsdGVyPn0gZmlsdGVyc1xuICogICBUaGUgZmlsdGVycy4gSWYgdGhlIG51bWJlciBvZiBmaWx0ZXJzIGV4Y2VlZHNcbiAqICAgYHtAbGluayBtb2R1bGU6cGF0dGVybnN+Q09NUElMRV9QQVRURVJOU19NQVggQ09NUElMRV9QQVRURVJOU19NQVh9YCwgdGhlXG4gKiAgIGZ1bmN0aW9uIHJldHVybnMgYG51bGxgLlxuICpcbiAqIEByZXR1cm5zIHs/bW9kdWxlOnBhdHRlcm5zfkNvbXBpbGVkUGF0dGVybnN9XG4gKlxuICogQHBhY2thZ2VcbiAqL1xuZXhwb3J0cy5jb21waWxlUGF0dGVybnMgPSBmdW5jdGlvbiBjb21waWxlUGF0dGVybnMoZmlsdGVycykge1xuICBsZXQgbGlzdCA9IEFycmF5LmlzQXJyYXkoZmlsdGVycykgPyBmaWx0ZXJzIDogW2ZpbHRlcnNdO1xuXG4gIC8vIElmIHRoZSBudW1iZXIgb2YgZmlsdGVycyBpcyB0b28gbGFyZ2UsIGl0IG1heSBjaG9rZSBlc3BlY2lhbGx5IG9uIGxvdy1lbmRcbiAgLy8gcGxhdGZvcm1zLiBBcyBhIHByZWNhdXRpb24sIHdlIHJlZnVzZSB0byBjb21waWxlLiBJZGVhbGx5IHdlIHdvdWxkIGNoZWNrXG4gIC8vIHRoZSBsZW5ndGggb2YgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBzb3VyY2UgcmF0aGVyIHRoYW4gdGhlIG51bWJlciBvZlxuICAvLyBmaWx0ZXJzLCBidXQgdGhpcyBpcyBmYXIgbW9yZSBzdHJhaWdodGZvcndhcmQgYW5kIHByYWN0aWNhbC5cbiAgaWYgKGxpc3QubGVuZ3RoID4gQ09NUElMRV9QQVRURVJOU19NQVgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCBjYXNlU2Vuc2l0aXZlID0gXCJcIjtcbiAgbGV0IGNhc2VJbnNlbnNpdGl2ZSA9IFwiXCI7XG5cbiAgZm9yIChsZXQgZmlsdGVyIG9mIGZpbHRlcnMpIHtcbiAgICBsZXQgc291cmNlID0gZmlsdGVyLnVybFBhdHRlcm4ucmVnZXhwU291cmNlO1xuXG4gICAgaWYgKGZpbHRlci5tYXRjaENhc2UpIHtcbiAgICAgIGNhc2VTZW5zaXRpdmUgKz0gc291cmNlICsgXCJ8XCI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY2FzZUluc2Vuc2l0aXZlICs9IHNvdXJjZSArIFwifFwiO1xuICAgIH1cbiAgfVxuXG4gIGxldCBjYXNlU2Vuc2l0aXZlUmVnRXhwID0gbnVsbDtcbiAgbGV0IGNhc2VJbnNlbnNpdGl2ZVJlZ0V4cCA9IG51bGw7XG5cbiAgdHJ5IHtcbiAgICBpZiAoY2FzZVNlbnNpdGl2ZSkge1xuICAgICAgY2FzZVNlbnNpdGl2ZVJlZ0V4cCA9IG5ldyBSZWdFeHAoY2FzZVNlbnNpdGl2ZS5zbGljZSgwLCAtMSkpO1xuICAgIH1cblxuICAgIGlmIChjYXNlSW5zZW5zaXRpdmUpIHtcbiAgICAgIGNhc2VJbnNlbnNpdGl2ZVJlZ0V4cCA9IG5ldyBSZWdFeHAoY2FzZUluc2Vuc2l0aXZlLnNsaWNlKDAsIC0xKSk7XG4gICAgfVxuICB9XG4gIGNhdGNoIChlcnJvcikge1xuICAgIC8vIEl0IGlzIHBvc3NpYmxlIGluIHRoZW9yeSBmb3IgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBiZSB0b28gbGFyZ2VcbiAgICAvLyBkZXNwaXRlIENPTVBJTEVfUEFUVEVSTlNfTUFYXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gbmV3IENvbXBpbGVkUGF0dGVybnMoY2FzZVNlbnNpdGl2ZVJlZ0V4cCwgY2FzZUluc2Vuc2l0aXZlUmVnRXhwKTtcbn07XG5cbi8qKlxuICogUGF0dGVybnMgZm9yIG1hdGNoaW5nIGFnYWluc3QgVVJMcy5cbiAqXG4gKiBJbnRlcm5hbGx5LCB0aGlzIG1heSBiZSBhIFJlZ0V4cCBvciBtYXRjaCBkaXJlY3RseSBhZ2FpbnN0IHRoZVxuICogcGF0dGVybiBmb3Igc2ltcGxlIGxpdGVyYWwgcGF0dGVybnMuXG4gKi9cbmV4cG9ydHMuUGF0dGVybiA9IGNsYXNzIFBhdHRlcm4ge1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm4gcGF0dGVybiB0aGF0IHJlcXVlc3RzIFVSTHMgc2hvdWxkIGJlXG4gICAqIG1hdGNoZWQgYWdhaW5zdCBpbiBmaWx0ZXIgdGV4dCBub3RhdGlvblxuICAgKiBAcGFyYW0ge2Jvb2x9IG1hdGNoQ2FzZSBgdHJ1ZWAgaWYgY29tcGFyaXNvbnMgbXVzdCBiZSBjYXNlXG4gICAqIHNlbnNpdGl2ZVxuICAgKi9cbiAgY29uc3RydWN0b3IocGF0dGVybiwgbWF0Y2hDYXNlKSB7XG4gICAgdGhpcy5tYXRjaENhc2UgPSBtYXRjaENhc2UgfHwgZmFsc2U7XG5cbiAgICBpZiAocGF0dGVybi5sZW5ndGggPj0gMiAmJlxuICAgICAgICBwYXR0ZXJuWzBdID09IFwiL1wiICYmXG4gICAgICAgIHBhdHRlcm5bcGF0dGVybi5sZW5ndGggLSAxXSA9PSBcIi9cIikge1xuICAgICAgLy8gVGhlIGZpbHRlciBpcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiAtIGNvbnZlcnQgaXQgaW1tZWRpYXRlbHkgdG9cbiAgICAgIC8vIGNhdGNoIHN5bnRheCBlcnJvcnNcbiAgICAgIHBhdHRlcm4gPSBwYXR0ZXJuLnN1YnN0cmluZygxLCBwYXR0ZXJuLmxlbmd0aCAtIDEpO1xuICAgICAgdGhpcy5fcmVnZXhwID0gbmV3IFJlZ0V4cChwYXR0ZXJuLCB0aGlzLm1hdGNoQ2FzZSA/IFwiXCIgOiBcImlcIik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLm1hdGNoQ2FzZSkge1xuICAgICAgICBwYXR0ZXJuID0gcGF0dGVybi50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBQYXR0ZXJucyBsaWtlIC9mb28vYmFyLyogZXhpc3Qgc28gdGhhdCB0aGV5IGFyZSBub3QgdHJlYXRlZCBhcyByZWd1bGFyXG4gICAgICAvLyBleHByZXNzaW9ucy4gV2UgZHJvcCBhbnkgc3VwZXJmbHVvdXMgd2lsZGNhcmRzIGhlcmUgc28gb3VyXG4gICAgICAvLyBvcHRpbWl6YXRpb25zIGNhbiBraWNrIGluLlxuICAgICAgcGF0dGVybiA9IHBhdHRlcm4ucmVwbGFjZSgvXlxcKisvLCBcIlwiKS5yZXBsYWNlKC9cXCorJC8sIFwiXCIpO1xuXG4gICAgICAvLyBObyBuZWVkIHRvIGNvbnZlcnQgdGhpcyBmaWx0ZXIgdG8gcmVndWxhciBleHByZXNzaW9uIHlldCwgZG8gaXQgb25cbiAgICAgIC8vIGRlbWFuZFxuICAgICAgdGhpcy5wYXR0ZXJuID0gcGF0dGVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHBhdHRlcm4gaXMgYSBzdHJpbmcgb2YgbGl0ZXJhbCBjaGFyYWN0ZXJzIHdpdGhcbiAgICogbm8gd2lsZGNhcmRzIG9yIGFueSBvdGhlciBzcGVjaWFsIGNoYXJhY3RlcnMuXG4gICAqXG4gICAqIElmIHRoZSBwYXR0ZXJuIGlzIHByZWZpeGVkIHdpdGggYSBgfHxgIG9yIHN1ZmZpeGVkIHdpdGggYSBgXmAgYnV0IG90aGVyd2lzZVxuICAgKiBjb250YWlucyBubyBzcGVjaWFsIGNoYXJhY3RlcnMsIGl0IGlzIHN0aWxsIGNvbnNpZGVyZWQgdG8gYmUgYSBsaXRlcmFsXG4gICAqIHBhdHRlcm4uXG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNMaXRlcmFsUGF0dGVybigpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMucGF0dGVybiAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgIS9bKl58XS8udGVzdCh0aGlzLnBhdHRlcm4ucmVwbGFjZSgvXlxcfHsxLDJ9LywgXCJcIikucmVwbGFjZSgvW3xeXSQvLCBcIlwiKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVndWxhciBleHByZXNzaW9uIHRvIGJlIHVzZWQgd2hlbiB0ZXN0aW5nIGFnYWluc3QgdGhpcyBwYXR0ZXJuLlxuICAgKlxuICAgKiBudWxsIGlmIHRoZSBwYXR0ZXJuIGlzIG1hdGNoZWQgd2l0aG91dCB1c2luZyByZWd1bGFyIGV4cHJlc3Npb25zLlxuICAgKiBAdHlwZSB7UmVnRXhwfVxuICAgKi9cbiAgZ2V0IHJlZ2V4cCgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX3JlZ2V4cCA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLl9yZWdleHAgPSB0aGlzLmlzTGl0ZXJhbFBhdHRlcm4oKSA/XG4gICAgICAgIG51bGwgOiBuZXcgUmVnRXhwKGZpbHRlclRvUmVnRXhwKHRoaXMucGF0dGVybikpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcmVnZXhwO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdHRlcm4gaW4gcmVndWxhciBleHByZXNzaW9uIG5vdGF0aW9uLiBUaGlzIHdpbGwgaGF2ZSBhIHZhbHVlXG4gICAqIGV2ZW4gaWYgYHJlZ2V4cGAgcmV0dXJucyBudWxsLlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHJlZ2V4cFNvdXJjZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVnZXhwID8gdGhpcy5fcmVnZXhwLnNvdXJjZSA6IGZpbHRlclRvUmVnRXhwKHRoaXMucGF0dGVybik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIFVSTCByZXF1ZXN0IG1hdGNoZXMgdGhpcyBmaWx0ZXIncyBwYXR0ZXJuLlxuICAgKiBAcGFyYW0ge21vZHVsZTp1cmwuVVJMUmVxdWVzdH0gcmVxdWVzdCBUaGUgVVJMIHJlcXVlc3QgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgdGhlIFVSTCByZXF1ZXN0IG1hdGNoZXMuXG4gICAqL1xuICBtYXRjaGVzTG9jYXRpb24ocmVxdWVzdCkge1xuICAgIGxldCBsb2NhdGlvbiA9IHRoaXMubWF0Y2hDYXNlID8gcmVxdWVzdC5ocmVmIDogcmVxdWVzdC5sb3dlckNhc2VIcmVmO1xuICAgIGxldCByZWdleHAgPSB0aGlzLnJlZ2V4cDtcbiAgICBpZiAocmVnZXhwKSB7XG4gICAgICByZXR1cm4gcmVnZXhwLnRlc3QobG9jYXRpb24pO1xuICAgIH1cblxuICAgIGxldCBwYXR0ZXJuID0gdGhpcy5wYXR0ZXJuO1xuICAgIGxldCBzdGFydHNXaXRoQW5jaG9yID0gcGF0dGVyblswXSA9PSBcInxcIjtcbiAgICBsZXQgc3RhcnRzV2l0aEV4dGVuZGVkQW5jaG9yID0gc3RhcnRzV2l0aEFuY2hvciAmJiBwYXR0ZXJuWzFdID09IFwifFwiO1xuICAgIGxldCBlbmRzV2l0aFNlcGFyYXRvciA9IHBhdHRlcm5bcGF0dGVybi5sZW5ndGggLSAxXSA9PSBcIl5cIjtcbiAgICBsZXQgZW5kc1dpdGhBbmNob3IgPSAhZW5kc1dpdGhTZXBhcmF0b3IgJiZcbiAgICAgICAgcGF0dGVybltwYXR0ZXJuLmxlbmd0aCAtIDFdID09IFwifFwiO1xuXG4gICAgaWYgKHN0YXJ0c1dpdGhFeHRlbmRlZEFuY2hvcikge1xuICAgICAgcGF0dGVybiA9IHBhdHRlcm4uc3Vic3RyKDIpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzdGFydHNXaXRoQW5jaG9yKSB7XG4gICAgICBwYXR0ZXJuID0gcGF0dGVybi5zdWJzdHIoMSk7XG4gICAgfVxuXG4gICAgaWYgKGVuZHNXaXRoU2VwYXJhdG9yIHx8IGVuZHNXaXRoQW5jaG9yKSB7XG4gICAgICBwYXR0ZXJuID0gcGF0dGVybi5zbGljZSgwLCAtMSk7XG4gICAgfVxuXG4gICAgbGV0IGluZGV4ID0gbG9jYXRpb24uaW5kZXhPZihwYXR0ZXJuKTtcblxuICAgIHdoaWxlIChpbmRleCAhPSAtMSkge1xuICAgICAgLy8gVGhlIFwifHxcIiBwcmVmaXggcmVxdWlyZXMgdGhhdCB0aGUgdGV4dCB0aGF0IGZvbGxvd3MgZG9lcyBub3Qgc3RhcnRcbiAgICAgIC8vIHdpdGggYSBmb3J3YXJkIHNsYXNoLlxuICAgICAgaWYgKChzdGFydHNXaXRoRXh0ZW5kZWRBbmNob3IgP1xuICAgICAgICAgICBsb2NhdGlvbltpbmRleF0gIT0gXCIvXCIgJiZcbiAgICAgICAgICAgZXh0ZW5kZWRBbmNob3JSZWdFeHAudGVzdChsb2NhdGlvbi5zdWJzdHJpbmcoMCwgaW5kZXgpKSA6XG4gICAgICAgICAgIHN0YXJ0c1dpdGhBbmNob3IgP1xuICAgICAgICAgICBpbmRleCA9PSAwIDpcbiAgICAgICAgICAgdHJ1ZSkgJiZcbiAgICAgICAgICAoZW5kc1dpdGhTZXBhcmF0b3IgP1xuICAgICAgICAgICAhbG9jYXRpb25baW5kZXggKyBwYXR0ZXJuLmxlbmd0aF0gfHxcbiAgICAgICAgICAgc2VwYXJhdG9yUmVnRXhwLnRlc3QobG9jYXRpb25baW5kZXggKyBwYXR0ZXJuLmxlbmd0aF0pIDpcbiAgICAgICAgICAgZW5kc1dpdGhBbmNob3IgP1xuICAgICAgICAgICBpbmRleCA9PSBsb2NhdGlvbi5sZW5ndGggLSBwYXR0ZXJuLmxlbmd0aCA6XG4gICAgICAgICAgIHRydWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocGF0dGVybiA9PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpbmRleCA9IGxvY2F0aW9uLmluZGV4T2YocGF0dGVybiwgaW5kZXggKyAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHBhdHRlcm4gaGFzIGtleXdvcmRzXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaGFzS2V5d29yZHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0dGVybiAmJiBrZXl3b3JkUmVnRXhwLnRlc3QodGhpcy5wYXR0ZXJuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbGwga2V5d29yZHMgdGhhdCBjb3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBwYXR0ZXJuXG4gICAqIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAgICovXG4gIGtleXdvcmRDYW5kaWRhdGVzKCkge1xuICAgIGlmICghdGhpcy5wYXR0ZXJuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGF0dGVybi50b0xvd2VyQ2FzZSgpLm1hdGNoKGFsbEtleXdvcmRzUmVnRXhwKTtcbiAgfVxufTtcbiIsIi8qIEBAcGFja2FnZV9uYW1lIC0gdkBAdmVyc2lvbiAtIEBAdGltZXN0YW1wICovXG4vKiAtKi0gTW9kZTogaW5kZW50LXRhYnMtbW9kZTogbmlsOyBqcy1pbmRlbnQtbGV2ZWw6IDIgLSotICovXG4vKiB2aW06IHNldCBzdHM9MiBzdz0yIGV0IHR3PTgwOiAqL1xuLyogVGhpcyBTb3VyY2UgQ29kZSBGb3JtIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIG9mIHRoZSBNb3ppbGxhIFB1YmxpY1xuICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICogZmlsZSwgWW91IGNhbiBvYnRhaW4gb25lIGF0IGh0dHA6Ly9tb3ppbGxhLm9yZy9NUEwvMi4wLy4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5pZiAoIShnbG9iYWxUaGlzLmNocm9tZSAmJiBnbG9iYWxUaGlzLmNocm9tZS5ydW50aW1lICYmIGdsb2JhbFRoaXMuY2hyb21lLnJ1bnRpbWUuaWQpKSB7XG4gIHRocm93IG5ldyBFcnJvcihcIlRoaXMgc2NyaXB0IHNob3VsZCBvbmx5IGJlIGxvYWRlZCBpbiBhIGJyb3dzZXIgZXh0ZW5zaW9uLlwiKTtcbn1cblxuaWYgKCEoZ2xvYmFsVGhpcy5icm93c2VyICYmIGdsb2JhbFRoaXMuYnJvd3Nlci5ydW50aW1lICYmIGdsb2JhbFRoaXMuYnJvd3Nlci5ydW50aW1lLmlkKSkge1xuICBjb25zdCBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UgPSBcIlRoZSBtZXNzYWdlIHBvcnQgY2xvc2VkIGJlZm9yZSBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZC5cIjtcbiAgY29uc3QgRVJST1JfVE9fSUdOT1JFID0gYEEgbGlzdGVuZXIgaW5kaWNhdGVkIGFuIGFzeW5jaHJvbm91cyByZXNwb25zZSBieSByZXR1cm5pbmcgdHJ1ZSwgYnV0IHRoZSBtZXNzYWdlIGNoYW5uZWwgY2xvc2VkIGJlZm9yZSBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZGA7XG5cbiAgLy8gV3JhcHBpbmcgdGhlIGJ1bGsgb2YgdGhpcyBwb2x5ZmlsbCBpbiBhIG9uZS10aW1lLXVzZSBmdW5jdGlvbiBpcyBhIG1pbm9yXG4gIC8vIG9wdGltaXphdGlvbiBmb3IgRmlyZWZveC4gU2luY2UgU3BpZGVybW9ua2V5IGRvZXMgbm90IGZ1bGx5IHBhcnNlIHRoZVxuICAvLyBjb250ZW50cyBvZiBhIGZ1bmN0aW9uIHVudGlsIHRoZSBmaXJzdCB0aW1lIGl0J3MgY2FsbGVkLCBhbmQgc2luY2UgaXQgd2lsbFxuICAvLyBuZXZlciBhY3R1YWxseSBuZWVkIHRvIGJlIGNhbGxlZCwgdGhpcyBhbGxvd3MgdGhlIHBvbHlmaWxsIHRvIGJlIGluY2x1ZGVkXG4gIC8vIGluIEZpcmVmb3ggbmVhcmx5IGZvciBmcmVlLlxuICBjb25zdCB3cmFwQVBJcyA9IGV4dGVuc2lvbkFQSXMgPT4ge1xuICAgIC8vIE5PVEU6IGFwaU1ldGFkYXRhIGlzIGFzc29jaWF0ZWQgdG8gdGhlIGNvbnRlbnQgb2YgdGhlIGFwaS1tZXRhZGF0YS5qc29uIGZpbGVcbiAgICAvLyBhdCBidWlsZCB0aW1lIGJ5IHJlcGxhY2luZyB0aGUgZm9sbG93aW5nIFwiaW5jbHVkZVwiIHdpdGggdGhlIGNvbnRlbnQgb2YgdGhlXG4gICAgLy8gSlNPTiBmaWxlLlxuICAgIGNvbnN0IGFwaU1ldGFkYXRhID0gcmVxdWlyZShcIi4uL2FwaS1tZXRhZGF0YS5qc29uXCIpO1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKGFwaU1ldGFkYXRhKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImFwaS1tZXRhZGF0YS5qc29uIGhhcyBub3QgYmVlbiBpbmNsdWRlZCBpbiBicm93c2VyLXBvbHlmaWxsXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgV2Vha01hcCBzdWJjbGFzcyB3aGljaCBjcmVhdGVzIGFuZCBzdG9yZXMgYSB2YWx1ZSBmb3IgYW55IGtleSB3aGljaCBkb2VzXG4gICAgICogbm90IGV4aXN0IHdoZW4gYWNjZXNzZWQsIGJ1dCBiZWhhdmVzIGV4YWN0bHkgYXMgYW4gb3JkaW5hcnkgV2Vha01hcFxuICAgICAqIG90aGVyd2lzZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNyZWF0ZUl0ZW1cbiAgICAgKiAgICAgICAgQSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIGNhbGxlZCBpbiBvcmRlciB0byBjcmVhdGUgdGhlIHZhbHVlIGZvciBhbnlcbiAgICAgKiAgICAgICAga2V5IHdoaWNoIGRvZXMgbm90IGV4aXN0LCB0aGUgZmlyc3QgdGltZSBpdCBpcyBhY2Nlc3NlZC4gVGhlXG4gICAgICogICAgICAgIGZ1bmN0aW9uIHJlY2VpdmVzLCBhcyBpdHMgb25seSBhcmd1bWVudCwgdGhlIGtleSBiZWluZyBjcmVhdGVkLlxuICAgICAqL1xuICAgIGNsYXNzIERlZmF1bHRXZWFrTWFwIGV4dGVuZHMgV2Vha01hcCB7XG4gICAgICBjb25zdHJ1Y3RvcihjcmVhdGVJdGVtLCBpdGVtcyA9IHVuZGVmaW5lZCkge1xuICAgICAgICBzdXBlcihpdGVtcyk7XG4gICAgICAgIHRoaXMuY3JlYXRlSXRlbSA9IGNyZWF0ZUl0ZW07XG4gICAgICB9XG5cbiAgICAgIGdldChrZXkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgdGhpcy5zZXQoa2V5LCB0aGlzLmNyZWF0ZUl0ZW0oa2V5KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3VwZXIuZ2V0KGtleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBvYmplY3QgaXMgYW4gb2JqZWN0IHdpdGggYSBgdGhlbmAgbWV0aG9kLCBhbmQgY2FuXG4gICAgICogdGhlcmVmb3JlIGJlIGFzc3VtZWQgdG8gYmVoYXZlIGFzIGEgUHJvbWlzZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3QuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHRoZW5hYmxlLlxuICAgICAqL1xuICAgIGNvbnN0IGlzVGhlbmFibGUgPSB2YWx1ZSA9PiB7XG4gICAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSBcImZ1bmN0aW9uXCI7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB3aGljaCwgd2hlbiBjYWxsZWQsIHdpbGwgcmVzb2x2ZSBvciByZWplY3RcbiAgICAgKiB0aGUgZ2l2ZW4gcHJvbWlzZSBiYXNlZCBvbiBob3cgaXQgaXMgY2FsbGVkOlxuICAgICAqXG4gICAgICogLSBJZiwgd2hlbiBjYWxsZWQsIGBjaHJvbWUucnVudGltZS5sYXN0RXJyb3JgIGNvbnRhaW5zIGEgbm9uLW51bGwgb2JqZWN0LFxuICAgICAqICAgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQgd2l0aCB0aGF0IHZhbHVlLlxuICAgICAqIC0gSWYgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGV4YWN0bHkgb25lIGFyZ3VtZW50LCB0aGUgcHJvbWlzZSBpc1xuICAgICAqICAgcmVzb2x2ZWQgdG8gdGhhdCB2YWx1ZS5cbiAgICAgKiAtIE90aGVyd2lzZSwgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgdG8gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlXG4gICAgICogICBmdW5jdGlvbidzIGFyZ3VtZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9taXNlXG4gICAgICogICAgICAgIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSByZXNvbHV0aW9uIGFuZCByZWplY3Rpb24gZnVuY3Rpb25zIG9mIGFcbiAgICAgKiAgICAgICAgcHJvbWlzZS5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcm9taXNlLnJlc29sdmVcbiAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZXNvbHV0aW9uIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVqZWN0XG4gICAgICogICAgICAgIFRoZSBwcm9taXNlJ3MgcmVqZWN0aW9uIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBtZXRhZGF0YVxuICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgd3JhcHBlZCBtZXRob2Qgd2hpY2ggaGFzIGNyZWF0ZWQgdGhlIGNhbGxiYWNrLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgKiAgICAgICAgV2hldGhlciBvciBub3QgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCBvbmx5IHRoZSBmaXJzdFxuICAgICAqICAgICAgICBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2ssIGFsdGVybmF0aXZlbHkgYW4gYXJyYXkgb2YgYWxsIHRoZVxuICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAqICAgICAgICBmdW5jdGlvbiBpcyBpbnZva2VkIHdpdGggb25seSBhIHNpbmdsZSBhcmd1bWVudCwgdGhhdCB3aWxsIGJlXG4gICAgICogICAgICAgIHJlc29sdmVkIHRvIHRoZSBwcm9taXNlLCB3aGlsZSBhbGwgYXJndW1lbnRzIHdpbGwgYmUgcmVzb2x2ZWQgYXNcbiAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAqXG4gICAgICogQHJldHVybnMge2Z1bmN0aW9ufVxuICAgICAqICAgICAgICBUaGUgZ2VuZXJhdGVkIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGNvbnN0IG1ha2VDYWxsYmFjayA9IChwcm9taXNlLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgLy8gSW4gY2FzZSB3ZSBlbmNvdW50ZXIgYSBicm93c2VyIGVycm9yIGluIHRoZSBjYWxsYmFjayBmdW5jdGlvbiwgd2UgZG9uJ3RcbiAgICAgIC8vIHdhbnQgdG8gbG9zZSB0aGUgc3RhY2sgdHJhY2UgbGVhZGluZyB1cCB0byB0aGlzIHBvaW50LiBGb3IgdGhhdCByZWFzb24sXG4gICAgICAvLyB3ZSBuZWVkIHRvIGluc3RhbnRpYXRlIHRoZSBlcnJvciBvdXRzaWRlIHRoZSBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcigpO1xuICAgICAgcmV0dXJuICguLi5jYWxsYmFja0FyZ3MpID0+IHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICBlcnJvci5tZXNzYWdlID0gZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlO1xuICAgICAgICAgIHByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyB8fFxuICAgICAgICAgICAgICAgICAgIChjYWxsYmFja0FyZ3MubGVuZ3RoIDw9IDEgJiYgbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgIT09IGZhbHNlKSkge1xuICAgICAgICAgIHByb21pc2UucmVzb2x2ZShjYWxsYmFja0FyZ3NbMF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb21pc2UucmVzb2x2ZShjYWxsYmFja0FyZ3MpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBjb25zdCBwbHVyYWxpemVBcmd1bWVudHMgPSAobnVtQXJncykgPT4gbnVtQXJncyA9PSAxID8gXCJhcmd1bWVudFwiIDogXCJhcmd1bWVudHNcIjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSB3cmFwcGVyIGZ1bmN0aW9uIGZvciBhIG1ldGhvZCB3aXRoIHRoZSBnaXZlbiBuYW1lIGFuZCBtZXRhZGF0YS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICogICAgICAgIFRoZSBuYW1lIG9mIHRoZSBtZXRob2Qgd2hpY2ggaXMgYmVpbmcgd3JhcHBlZC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgKiAgICAgICAgTWV0YWRhdGEgYWJvdXQgdGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLlxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWluQXJnc1xuICAgICAqICAgICAgICBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG11c3QgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggZmV3ZXIgdGhhbiB0aGlzIG51bWJlciBvZiBhcmd1bWVudHMsIHRoZVxuICAgICAqICAgICAgICB3cmFwcGVyIHdpbGwgcmFpc2UgYW4gZXhjZXB0aW9uLlxuICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWF4QXJnc1xuICAgICAqICAgICAgICBUaGUgbWF4aW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG1heSBiZSBwYXNzZWQgdG8gdGhlXG4gICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBtb3JlIHRoYW4gdGhpcyBudW1iZXIgb2YgYXJndW1lbnRzLCB0aGVcbiAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnXG4gICAgICogICAgICAgIFdoZXRoZXIgb3Igbm90IHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggb25seSB0aGUgZmlyc3RcbiAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgKiAgICAgICAgY2FsbGJhY2sgYXJndW1lbnRzIGlzIHJlc29sdmVkLiBCeSBkZWZhdWx0LCBpZiB0aGUgY2FsbGJhY2tcbiAgICAgKiAgICAgICAgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIG9ubHkgYSBzaW5nbGUgYXJndW1lbnQsIHRoYXQgd2lsbCBiZVxuICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICogICAgICAgIGFuIGFycmF5IGlmIG11bHRpcGxlIGFyZSBnaXZlbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbihvYmplY3QsIC4uLiopfVxuICAgICAqICAgICAgIFRoZSBnZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBjb25zdCB3cmFwQXN5bmNGdW5jdGlvbiA9IChuYW1lLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFzeW5jRnVuY3Rpb25XcmFwcGVyKHRhcmdldCwgLi4uYXJncykge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPCBtZXRhZGF0YS5taW5BcmdzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IG1ldGFkYXRhLm1heEFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHttZXRhZGF0YS5tYXhBcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5tYXhBcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGlmIChtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjaykge1xuICAgICAgICAgICAgLy8gVGhpcyBBUEkgbWV0aG9kIGhhcyBjdXJyZW50bHkgbm8gY2FsbGJhY2sgb24gQ2hyb21lLCBidXQgaXQgcmV0dXJuIGEgcHJvbWlzZSBvbiBGaXJlZm94LFxuICAgICAgICAgICAgLy8gYW5kIHNvIHRoZSBwb2x5ZmlsbCB3aWxsIHRyeSB0byBjYWxsIGl0IHdpdGggYSBjYWxsYmFjayBmaXJzdCwgYW5kIGl0IHdpbGwgZmFsbGJhY2tcbiAgICAgICAgICAgIC8vIHRvIG5vdCBwYXNzaW5nIHRoZSBjYWxsYmFjayBpZiB0aGUgZmlyc3QgY2FsbCBmYWlscy5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe3Jlc29sdmUsIHJlamVjdH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgICB9IGNhdGNoIChjYkVycm9yKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHtuYW1lfSBBUEkgbWV0aG9kIGRvZXNuJ3Qgc2VlbSB0byBzdXBwb3J0IHRoZSBjYWxsYmFjayBwYXJhbWV0ZXIsIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmYWxsaW5nIGJhY2sgdG8gY2FsbCBpdCB3aXRob3V0IGEgY2FsbGJhY2s6IFwiLCBjYkVycm9yKTtcblxuICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG5cbiAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBBUEkgbWV0aG9kIG1ldGFkYXRhLCBzbyB0aGF0IHRoZSBuZXh0IEFQSSBjYWxscyB3aWxsIG5vdCB0cnkgdG9cbiAgICAgICAgICAgICAgLy8gdXNlIHRoZSB1bnN1cHBvcnRlZCBjYWxsYmFjayBhbnltb3JlLlxuICAgICAgICAgICAgICBtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgICBtZXRhZGF0YS5ub0NhbGxiYWNrID0gdHJ1ZTtcblxuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5ub0NhbGxiYWNrKSB7XG4gICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe3Jlc29sdmUsIHJlamVjdH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFdyYXBzIGFuIGV4aXN0aW5nIG1ldGhvZCBvZiB0aGUgdGFyZ2V0IG9iamVjdCwgc28gdGhhdCBjYWxscyB0byBpdCBhcmVcbiAgICAgKiBpbnRlcmNlcHRlZCBieSB0aGUgZ2l2ZW4gd3JhcHBlciBmdW5jdGlvbi4gVGhlIHdyYXBwZXIgZnVuY3Rpb24gcmVjZWl2ZXMsXG4gICAgICogYXMgaXRzIGZpcnN0IGFyZ3VtZW50LCB0aGUgb3JpZ2luYWwgYHRhcmdldGAgb2JqZWN0LCBmb2xsb3dlZCBieSBlYWNoIG9mXG4gICAgICogdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgKiAgICAgICAgVGhlIG9yaWdpbmFsIHRhcmdldCBvYmplY3QgdGhhdCB0aGUgd3JhcHBlZCBtZXRob2QgYmVsb25ncyB0by5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBtZXRob2RcbiAgICAgKiAgICAgICAgVGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLiBUaGlzIGlzIHVzZWQgYXMgdGhlIHRhcmdldCBvZiB0aGUgUHJveHlcbiAgICAgKiAgICAgICAgb2JqZWN0IHdoaWNoIGlzIGNyZWF0ZWQgdG8gd3JhcCB0aGUgbWV0aG9kLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHdyYXBwZXJcbiAgICAgKiAgICAgICAgVGhlIHdyYXBwZXIgZnVuY3Rpb24gd2hpY2ggaXMgY2FsbGVkIGluIHBsYWNlIG9mIGEgZGlyZWN0IGludm9jYXRpb25cbiAgICAgKiAgICAgICAgb2YgdGhlIHdyYXBwZWQgbWV0aG9kLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb3h5PGZ1bmN0aW9uPn1cbiAgICAgKiAgICAgICAgQSBQcm94eSBvYmplY3QgZm9yIHRoZSBnaXZlbiBtZXRob2QsIHdoaWNoIGludm9rZXMgdGhlIGdpdmVuIHdyYXBwZXJcbiAgICAgKiAgICAgICAgbWV0aG9kIGluIGl0cyBwbGFjZS5cbiAgICAgKi9cbiAgICBjb25zdCB3cmFwTWV0aG9kID0gKHRhcmdldCwgbWV0aG9kLCB3cmFwcGVyKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb3h5KG1ldGhvZCwge1xuICAgICAgICBhcHBseSh0YXJnZXRNZXRob2QsIHRoaXNPYmosIGFyZ3MpIHtcbiAgICAgICAgICByZXR1cm4gd3JhcHBlci5jYWxsKHRoaXNPYmosIHRhcmdldCwgLi4uYXJncyk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgbGV0IGhhc093blByb3BlcnR5ID0gRnVuY3Rpb24uY2FsbC5iaW5kKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuXG4gICAgLyoqXG4gICAgICogV3JhcHMgYW4gb2JqZWN0IGluIGEgUHJveHkgd2hpY2ggaW50ZXJjZXB0cyBhbmQgd3JhcHMgY2VydGFpbiBtZXRob2RzXG4gICAgICogYmFzZWQgb24gdGhlIGdpdmVuIGB3cmFwcGVyc2AgYW5kIGBtZXRhZGF0YWAgb2JqZWN0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgKiAgICAgICAgVGhlIHRhcmdldCBvYmplY3QgdG8gd3JhcC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbd3JhcHBlcnMgPSB7fV1cbiAgICAgKiAgICAgICAgQW4gb2JqZWN0IHRyZWUgY29udGFpbmluZyB3cmFwcGVyIGZ1bmN0aW9ucyBmb3Igc3BlY2lhbCBjYXNlcy4gQW55XG4gICAgICogICAgICAgIGZ1bmN0aW9uIHByZXNlbnQgaW4gdGhpcyBvYmplY3QgdHJlZSBpcyBjYWxsZWQgaW4gcGxhY2Ugb2YgdGhlXG4gICAgICogICAgICAgIG1ldGhvZCBpbiB0aGUgc2FtZSBsb2NhdGlvbiBpbiB0aGUgYHRhcmdldGAgb2JqZWN0IHRyZWUuIFRoZXNlXG4gICAgICogICAgICAgIHdyYXBwZXIgbWV0aG9kcyBhcmUgaW52b2tlZCBhcyBkZXNjcmliZWQgaW4ge0BzZWUgd3JhcE1ldGhvZH0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW21ldGFkYXRhID0ge31dXG4gICAgICogICAgICAgIEFuIG9iamVjdCB0cmVlIGNvbnRhaW5pbmcgbWV0YWRhdGEgdXNlZCB0byBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlXG4gICAgICogICAgICAgIFByb21pc2UtYmFzZWQgd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFzeW5jaHJvbm91cy4gQW55IGZ1bmN0aW9uIGluXG4gICAgICogICAgICAgIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZSB3aGljaCBoYXMgYSBjb3JyZXNwb25kaW5nIG1ldGFkYXRhIG9iamVjdFxuICAgICAqICAgICAgICBpbiB0aGUgc2FtZSBsb2NhdGlvbiBpbiB0aGUgYG1ldGFkYXRhYCB0cmVlIGlzIHJlcGxhY2VkIHdpdGggYW5cbiAgICAgKiAgICAgICAgYXV0b21hdGljYWxseS1nZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbiwgYXMgZGVzY3JpYmVkIGluXG4gICAgICogICAgICAgIHtAc2VlIHdyYXBBc3luY0Z1bmN0aW9ufVxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb3h5PG9iamVjdD59XG4gICAgICovXG4gICAgY29uc3Qgd3JhcE9iamVjdCA9ICh0YXJnZXQsIHdyYXBwZXJzID0ge30sIG1ldGFkYXRhID0ge30pID0+IHtcbiAgICAgIGxldCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICBsZXQgaGFuZGxlcnMgPSB7XG4gICAgICAgIGhhcyhwcm94eVRhcmdldCwgcHJvcCkge1xuICAgICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldCB8fCBwcm9wIGluIGNhY2hlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldChwcm94eVRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICBpZiAocHJvcCBpbiBjYWNoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3Byb3BdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghKHByb3AgaW4gdGFyZ2V0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcF07XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBtZXRob2Qgb24gdGhlIHVuZGVybHlpbmcgb2JqZWN0LiBDaGVjayBpZiB3ZSBuZWVkIHRvIGRvXG4gICAgICAgICAgICAvLyBhbnkgd3JhcHBpbmcuXG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JhcHBlcnNbcHJvcF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAvLyBXZSBoYXZlIGEgc3BlY2lhbC1jYXNlIHdyYXBwZXIgZm9yIHRoaXMgbWV0aG9kLlxuICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBNZXRob2QodGFyZ2V0LCB0YXJnZXRbcHJvcF0sIHdyYXBwZXJzW3Byb3BdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gYXN5bmMgbWV0aG9kIHRoYXQgd2UgaGF2ZSBtZXRhZGF0YSBmb3IuIENyZWF0ZSBhXG4gICAgICAgICAgICAgIC8vIFByb21pc2Ugd3JhcHBlciBmb3IgaXQuXG4gICAgICAgICAgICAgIGxldCB3cmFwcGVyID0gd3JhcEFzeW5jRnVuY3Rpb24ocHJvcCwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBNZXRob2QodGFyZ2V0LCB0YXJnZXRbcHJvcF0sIHdyYXBwZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCB0aGF0IHdlIGRvbid0IGtub3cgb3IgY2FyZSBhYm91dC4gUmV0dXJuIHRoZVxuICAgICAgICAgICAgICAvLyBvcmlnaW5hbCBtZXRob2QsIGJvdW5kIHRvIHRoZSB1bmRlcmx5aW5nIG9iamVjdC5cbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5iaW5kKHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICAgICAgIChoYXNPd25Qcm9wZXJ0eSh3cmFwcGVycywgcHJvcCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICBoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgcHJvcCkpKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGFuIG9iamVjdCB0aGF0IHdlIG5lZWQgdG8gZG8gc29tZSB3cmFwcGluZyBmb3IgdGhlIGNoaWxkcmVuXG4gICAgICAgICAgICAvLyBvZi4gQ3JlYXRlIGEgc3ViLW9iamVjdCB3cmFwcGVyIGZvciBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBjaGlsZFxuICAgICAgICAgICAgLy8gbWV0YWRhdGEuXG4gICAgICAgICAgICB2YWx1ZSA9IHdyYXBPYmplY3QodmFsdWUsIHdyYXBwZXJzW3Byb3BdLCBtZXRhZGF0YVtwcm9wXSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgXCIqXCIpKSB7XG4gICAgICAgICAgICAvLyBXcmFwIGFsbCBwcm9wZXJ0aWVzIGluICogbmFtZXNwYWNlLlxuICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbXCIqXCJdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2UgZG9uJ3QgbmVlZCB0byBkbyBhbnkgd3JhcHBpbmcgZm9yIHRoaXMgcHJvcGVydHksXG4gICAgICAgICAgICAvLyBzbyBqdXN0IGZvcndhcmQgYWxsIGFjY2VzcyB0byB0aGUgdW5kZXJseWluZyBvYmplY3QuXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldChwcm94eVRhcmdldCwgcHJvcCwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgaWYgKHByb3AgaW4gY2FjaGUpIHtcbiAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZWZpbmVQcm9wZXJ0eShwcm94eVRhcmdldCwgcHJvcCwgZGVzYykge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGNhY2hlLCBwcm9wLCBkZXNjKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZWxldGVQcm9wZXJ0eShwcm94eVRhcmdldCwgcHJvcCkge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KGNhY2hlLCBwcm9wKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIC8vIFBlciBjb250cmFjdCBvZiB0aGUgUHJveHkgQVBJLCB0aGUgXCJnZXRcIiBwcm94eSBoYW5kbGVyIG11c3QgcmV0dXJuIHRoZVxuICAgICAgLy8gb3JpZ2luYWwgdmFsdWUgb2YgdGhlIHRhcmdldCBpZiB0aGF0IHZhbHVlIGlzIGRlY2xhcmVkIHJlYWQtb25seSBhbmRcbiAgICAgIC8vIG5vbi1jb25maWd1cmFibGUuIEZvciB0aGlzIHJlYXNvbiwgd2UgY3JlYXRlIGFuIG9iamVjdCB3aXRoIHRoZVxuICAgICAgLy8gcHJvdG90eXBlIHNldCB0byBgdGFyZ2V0YCBpbnN0ZWFkIG9mIHVzaW5nIGB0YXJnZXRgIGRpcmVjdGx5LlxuICAgICAgLy8gT3RoZXJ3aXNlIHdlIGNhbm5vdCByZXR1cm4gYSBjdXN0b20gb2JqZWN0IGZvciBBUElzIHRoYXRcbiAgICAgIC8vIGFyZSBkZWNsYXJlZCByZWFkLW9ubHkgYW5kIG5vbi1jb25maWd1cmFibGUsIHN1Y2ggYXMgYGNocm9tZS5kZXZ0b29sc2AuXG4gICAgICAvL1xuICAgICAgLy8gVGhlIHByb3h5IGhhbmRsZXJzIHRoZW1zZWx2ZXMgd2lsbCBzdGlsbCB1c2UgdGhlIG9yaWdpbmFsIGB0YXJnZXRgXG4gICAgICAvLyBpbnN0ZWFkIG9mIHRoZSBgcHJveHlUYXJnZXRgLCBzbyB0aGF0IHRoZSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGFyZVxuICAgICAgLy8gZGVyZWZlcmVuY2VkIHZpYSB0aGUgb3JpZ2luYWwgdGFyZ2V0cy5cbiAgICAgIGxldCBwcm94eVRhcmdldCA9IE9iamVjdC5jcmVhdGUodGFyZ2V0KTtcbiAgICAgIHJldHVybiBuZXcgUHJveHkocHJveHlUYXJnZXQsIGhhbmRsZXJzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHNldCBvZiB3cmFwcGVyIGZ1bmN0aW9ucyBmb3IgYW4gZXZlbnQgb2JqZWN0LCB3aGljaCBoYW5kbGVzXG4gICAgICogd3JhcHBpbmcgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRoYXQgdGhvc2UgbWVzc2FnZXMgYXJlIHBhc3NlZC5cbiAgICAgKlxuICAgICAqIEEgc2luZ2xlIHdyYXBwZXIgaXMgY3JlYXRlZCBmb3IgZWFjaCBsaXN0ZW5lciBmdW5jdGlvbiwgYW5kIHN0b3JlZCBpbiBhXG4gICAgICogbWFwLiBTdWJzZXF1ZW50IGNhbGxzIHRvIGBhZGRMaXN0ZW5lcmAsIGBoYXNMaXN0ZW5lcmAsIG9yIGByZW1vdmVMaXN0ZW5lcmBcbiAgICAgKiByZXRyaWV2ZSB0aGUgb3JpZ2luYWwgd3JhcHBlciwgc28gdGhhdCAgYXR0ZW1wdHMgdG8gcmVtb3ZlIGFcbiAgICAgKiBwcmV2aW91c2x5LWFkZGVkIGxpc3RlbmVyIHdvcmsgYXMgZXhwZWN0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0RlZmF1bHRXZWFrTWFwPGZ1bmN0aW9uLCBmdW5jdGlvbj59IHdyYXBwZXJNYXBcbiAgICAgKiAgICAgICAgQSBEZWZhdWx0V2Vha01hcCBvYmplY3Qgd2hpY2ggd2lsbCBjcmVhdGUgdGhlIGFwcHJvcHJpYXRlIHdyYXBwZXJcbiAgICAgKiAgICAgICAgZm9yIGEgZ2l2ZW4gbGlzdGVuZXIgZnVuY3Rpb24gd2hlbiBvbmUgZG9lcyBub3QgZXhpc3QsIGFuZCByZXRyaWV2ZVxuICAgICAqICAgICAgICBhbiBleGlzdGluZyBvbmUgd2hlbiBpdCBkb2VzLlxuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCB3cmFwRXZlbnQgPSB3cmFwcGVyTWFwID0+ICh7XG4gICAgICBhZGRMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyLCAuLi5hcmdzKSB7XG4gICAgICAgIHRhcmdldC5hZGRMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lciksIC4uLmFyZ3MpO1xuICAgICAgfSxcblxuICAgICAgaGFzTGlzdGVuZXIodGFyZ2V0LCBsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gdGFyZ2V0Lmhhc0xpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSk7XG4gICAgICB9LFxuXG4gICAgICByZW1vdmVMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHRhcmdldC5yZW1vdmVMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lcikpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG9uUmVxdWVzdEZpbmlzaGVkV3JhcHBlcnMgPSBuZXcgRGVmYXVsdFdlYWtNYXAobGlzdGVuZXIgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyBhbiBvblJlcXVlc3RGaW5pc2hlZCBsaXN0ZW5lciBmdW5jdGlvbiBzbyB0aGF0IGl0IHdpbGwgcmV0dXJuIGFcbiAgICAgICAqIGBnZXRDb250ZW50KClgIHByb3BlcnR5IHdoaWNoIHJldHVybnMgYSBgUHJvbWlzZWAgcmF0aGVyIHRoYW4gdXNpbmcgYVxuICAgICAgICogY2FsbGJhY2sgQVBJLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXFcbiAgICAgICAqICAgICAgICBUaGUgSEFSIGVudHJ5IG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5ldHdvcmsgcmVxdWVzdC5cbiAgICAgICAqL1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9uUmVxdWVzdEZpbmlzaGVkKHJlcSkge1xuICAgICAgICBjb25zdCB3cmFwcGVkUmVxID0gd3JhcE9iamVjdChyZXEsIHt9IC8qIHdyYXBwZXJzICovLCB7XG4gICAgICAgICAgZ2V0Q29udGVudDoge1xuICAgICAgICAgICAgbWluQXJnczogMCxcbiAgICAgICAgICAgIG1heEFyZ3M6IDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxpc3RlbmVyKHdyYXBwZWRSZXEpO1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGNvbnN0IG9uTWVzc2FnZVdyYXBwZXJzID0gbmV3IERlZmF1bHRXZWFrTWFwKGxpc3RlbmVyID0+IHtcbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYSBtZXNzYWdlIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgbWF5IHNlbmQgcmVzcG9uc2VzIGJhc2VkIG9uXG4gICAgICAgKiBpdHMgcmV0dXJuIHZhbHVlLCByYXRoZXIgdGhhbiBieSByZXR1cm5pbmcgYSBzZW50aW5lbCB2YWx1ZSBhbmQgY2FsbGluZyBhXG4gICAgICAgKiBjYWxsYmFjay4gSWYgdGhlIGxpc3RlbmVyIGZ1bmN0aW9uIHJldHVybnMgYSBQcm9taXNlLCB0aGUgcmVzcG9uc2UgaXNcbiAgICAgICAqIHNlbnQgd2hlbiB0aGUgcHJvbWlzZSBlaXRoZXIgcmVzb2x2ZXMgb3IgcmVqZWN0cy5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0geyp9IG1lc3NhZ2VcbiAgICAgICAqICAgICAgICBUaGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBvdGhlciBlbmQgb2YgdGhlIGNoYW5uZWwuXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gc2VuZGVyXG4gICAgICAgKiAgICAgICAgRGV0YWlscyBhYm91dCB0aGUgc2VuZGVyIG9mIHRoZSBtZXNzYWdlLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbigqKX0gc2VuZFJlc3BvbnNlXG4gICAgICAgKiAgICAgICAgQSBjYWxsYmFjayB3aGljaCwgd2hlbiBjYWxsZWQgd2l0aCBhbiBhcmJpdHJhcnkgYXJndW1lbnQsIHNlbmRzXG4gICAgICAgKiAgICAgICAgdGhhdCB2YWx1ZSBhcyBhIHJlc3BvbnNlLlxuICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgKiAgICAgICAgVHJ1ZSBpZiB0aGUgd3JhcHBlZCBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHdoaWNoIHdpbGwgbGF0ZXJcbiAgICAgICAqICAgICAgICB5aWVsZCBhIHJlc3BvbnNlLiBGYWxzZSBvdGhlcndpc2UuXG4gICAgICAgKi9cbiAgICAgIHJldHVybiBmdW5jdGlvbiBvbk1lc3NhZ2UobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICAgICAgbGV0IGRpZENhbGxTZW5kUmVzcG9uc2UgPSBmYWxzZTtcblxuICAgICAgICBsZXQgd3JhcHBlZFNlbmRSZXNwb25zZTtcbiAgICAgICAgbGV0IHNlbmRSZXNwb25zZVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICB3cmFwcGVkU2VuZFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGRpZENhbGxTZW5kUmVzcG9uc2UgPSB0cnVlO1xuICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXN1bHQgPSBsaXN0ZW5lcihtZXNzYWdlLCBzZW5kZXIsIHdyYXBwZWRTZW5kUmVzcG9uc2UpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICByZXN1bHQgPSBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNSZXN1bHRUaGVuYWJsZSA9IHJlc3VsdCAhPT0gdHJ1ZSAmJiBpc1RoZW5hYmxlKHJlc3VsdCk7XG5cbiAgICAgICAgLy8gSWYgdGhlIGxpc3RlbmVyIGRpZG4ndCByZXR1cm5lZCB0cnVlIG9yIGEgUHJvbWlzZSwgb3IgY2FsbGVkXG4gICAgICAgIC8vIHdyYXBwZWRTZW5kUmVzcG9uc2Ugc3luY2hyb25vdXNseSwgd2UgY2FuIGV4aXQgZWFybGllclxuICAgICAgICAvLyBiZWNhdXNlIHRoZXJlIHdpbGwgYmUgbm8gcmVzcG9uc2Ugc2VudCBmcm9tIHRoaXMgbGlzdGVuZXIuXG4gICAgICAgIGlmIChyZXN1bHQgIT09IHRydWUgJiYgIWlzUmVzdWx0VGhlbmFibGUgJiYgIWRpZENhbGxTZW5kUmVzcG9uc2UpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBIHNtYWxsIGhlbHBlciB0byBzZW5kIHRoZSBtZXNzYWdlIGlmIHRoZSBwcm9taXNlIHJlc29sdmVzXG4gICAgICAgIC8vIGFuZCBhbiBlcnJvciBpZiB0aGUgcHJvbWlzZSByZWplY3RzIChhIHdyYXBwZWQgc2VuZE1lc3NhZ2UgaGFzXG4gICAgICAgIC8vIHRvIHRyYW5zbGF0ZSB0aGUgbWVzc2FnZSBpbnRvIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhIHJlamVjdGVkXG4gICAgICAgIC8vIHByb21pc2UpLlxuICAgICAgICBjb25zdCBzZW5kUHJvbWlzZWRSZXN1bHQgPSAocHJvbWlzZSkgPT4ge1xuICAgICAgICAgIHByb21pc2UudGhlbihtc2cgPT4ge1xuICAgICAgICAgICAgLy8gc2VuZCB0aGUgbWVzc2FnZSB2YWx1ZS5cbiAgICAgICAgICAgIHNlbmRSZXNwb25zZShtc2cpO1xuICAgICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgIC8vIFNlbmQgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpZiB0aGUgcmVqZWN0ZWQgdmFsdWVcbiAgICAgICAgICAgIC8vIGlzIGFuIGluc3RhbmNlIG9mIGVycm9yLCBvciB0aGUgb2JqZWN0IGl0c2VsZiBvdGhlcndpc2UuXG4gICAgICAgICAgICBsZXQgbWVzc2FnZTtcbiAgICAgICAgICAgIGlmIChlcnJvciAmJiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciB8fFxuICAgICAgICAgICAgICAgIHR5cGVvZiBlcnJvci5tZXNzYWdlID09PSBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkFuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgX19tb3pXZWJFeHRlbnNpb25Qb2x5ZmlsbFJlamVjdF9fOiB0cnVlLFxuICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIC8vIFByaW50IGFuIGVycm9yIG9uIHRoZSBjb25zb2xlIGlmIHVuYWJsZSB0byBzZW5kIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2VuZCBvbk1lc3NhZ2UgcmVqZWN0ZWQgcmVwbHlcIiwgZXJyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgcmV0dXJuZWQgYSBQcm9taXNlLCBzZW5kIHRoZSByZXNvbHZlZCB2YWx1ZSBhcyBhXG4gICAgICAgIC8vIHJlc3VsdCwgb3RoZXJ3aXNlIHdhaXQgdGhlIHByb21pc2UgcmVsYXRlZCB0byB0aGUgd3JhcHBlZFNlbmRSZXNwb25zZVxuICAgICAgICAvLyBjYWxsYmFjayB0byByZXNvbHZlIGFuZCBzZW5kIGl0IGFzIGEgcmVzcG9uc2UuXG4gICAgICAgIGlmIChpc1Jlc3VsdFRoZW5hYmxlKSB7XG4gICAgICAgICAgc2VuZFByb21pc2VkUmVzdWx0KHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VuZFByb21pc2VkUmVzdWx0KHNlbmRSZXNwb25zZVByb21pc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTGV0IENocm9tZSBrbm93IHRoYXQgdGhlIGxpc3RlbmVyIGlzIHJlcGx5aW5nLlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjayA9ICh7cmVqZWN0LCByZXNvbHZlfSwgcmVwbHkpID0+IHtcbiAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgIC8vIERldGVjdCB3aGVuIG5vbmUgb2YgdGhlIGxpc3RlbmVycyByZXBsaWVkIHRvIHRoZSBzZW5kTWVzc2FnZSBjYWxsIGFuZCByZXNvbHZlXG4gICAgICAgIC8vIHRoZSBwcm9taXNlIHRvIHVuZGVmaW5lZCBhcyBpbiBGaXJlZm94LlxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvd2ViZXh0ZW5zaW9uLXBvbHlmaWxsL2lzc3Vlcy8xMzBcbiAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSA9PT0gQ0hST01FX1NFTkRfTUVTU0FHRV9DQUxMQkFDS19OT19SRVNQT05TRV9NRVNTQUdFIHx8IGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZS5pbmNsdWRlcyhFUlJPUl9UT19JR05PUkUpKSB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocmVwbHkgJiYgcmVwbHkuX19tb3pXZWJFeHRlbnNpb25Qb2x5ZmlsbFJlamVjdF9fKSB7XG4gICAgICAgIC8vIENvbnZlcnQgYmFjayB0aGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgZXJyb3IgaW50b1xuICAgICAgICAvLyBhbiBFcnJvciBpbnN0YW5jZS5cbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihyZXBseS5tZXNzYWdlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgd3JhcHBlZFNlbmRNZXNzYWdlID0gKG5hbWUsIG1ldGFkYXRhLCBhcGlOYW1lc3BhY2VPYmosIC4uLmFyZ3MpID0+IHtcbiAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gbWV0YWRhdGEubWF4QXJncykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHttZXRhZGF0YS5tYXhBcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5tYXhBcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHdyYXBwZWRDYiA9IHdyYXBwZWRTZW5kTWVzc2FnZUNhbGxiYWNrLmJpbmQobnVsbCwge3Jlc29sdmUsIHJlamVjdH0pO1xuICAgICAgICBhcmdzLnB1c2god3JhcHBlZENiKTtcbiAgICAgICAgYXBpTmFtZXNwYWNlT2JqLnNlbmRNZXNzYWdlKC4uLmFyZ3MpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHN0YXRpY1dyYXBwZXJzID0ge1xuICAgICAgZGV2dG9vbHM6IHtcbiAgICAgICAgbmV0d29yazoge1xuICAgICAgICAgIG9uUmVxdWVzdEZpbmlzaGVkOiB3cmFwRXZlbnQob25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycyksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcnVudGltZToge1xuICAgICAgICBvbk1lc3NhZ2U6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgIG9uTWVzc2FnZUV4dGVybmFsOiB3cmFwRXZlbnQob25NZXNzYWdlV3JhcHBlcnMpLFxuICAgICAgICBzZW5kTWVzc2FnZTogd3JhcHBlZFNlbmRNZXNzYWdlLmJpbmQobnVsbCwgXCJzZW5kTWVzc2FnZVwiLCB7bWluQXJnczogMSwgbWF4QXJnczogM30pLFxuICAgICAgfSxcbiAgICAgIHRhYnM6IHtcbiAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge21pbkFyZ3M6IDIsIG1heEFyZ3M6IDN9KSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICBjb25zdCBzZXR0aW5nTWV0YWRhdGEgPSB7XG4gICAgICBjbGVhcjoge21pbkFyZ3M6IDEsIG1heEFyZ3M6IDF9LFxuICAgICAgZ2V0OiB7bWluQXJnczogMSwgbWF4QXJnczogMX0sXG4gICAgICBzZXQ6IHttaW5BcmdzOiAxLCBtYXhBcmdzOiAxfSxcbiAgICB9O1xuICAgIGFwaU1ldGFkYXRhLnByaXZhY3kgPSB7XG4gICAgICBuZXR3b3JrOiB7XCIqXCI6IHNldHRpbmdNZXRhZGF0YX0sXG4gICAgICBzZXJ2aWNlczoge1wiKlwiOiBzZXR0aW5nTWV0YWRhdGF9LFxuICAgICAgd2Vic2l0ZXM6IHtcIipcIjogc2V0dGluZ01ldGFkYXRhfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHdyYXBPYmplY3QoZXh0ZW5zaW9uQVBJcywgc3RhdGljV3JhcHBlcnMsIGFwaU1ldGFkYXRhKTtcbiAgfTtcblxuICAvLyBUaGUgYnVpbGQgcHJvY2VzcyBhZGRzIGEgVU1EIHdyYXBwZXIgYXJvdW5kIHRoaXMgZmlsZSwgd2hpY2ggbWFrZXMgdGhlXG4gIC8vIGBtb2R1bGVgIHZhcmlhYmxlIGF2YWlsYWJsZS5cbiAgbW9kdWxlLmV4cG9ydHMgPSB3cmFwQVBJcyhjaHJvbWUpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBnbG9iYWxUaGlzLmJyb3dzZXI7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV5ZW8ncyBXZWIgRXh0ZW5zaW9uIEFkIEJsb2NraW5nIFRvb2xraXQgKEVXRSksXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDYtcHJlc2VudCBleWVvIEdtYkhcbiAqXG4gKiBFV0UgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXNcbiAqIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIEVXRSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRVdFLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmNvbnN0IEVSUk9SX05PX0NPTk5FQ1RJT04gPSBcIkNvdWxkIG5vdCBlc3RhYmxpc2ggY29ubmVjdGlvbi4gXCIgK1xuICAgICAgXCJSZWNlaXZpbmcgZW5kIGRvZXMgbm90IGV4aXN0LlwiO1xuY29uc3QgRVJST1JfQ0xPU0VEX0NPTk5FQ1RJT04gPSBcIkEgbGlzdGVuZXIgaW5kaWNhdGVkIGFuIGFzeW5jaHJvbm91cyBcIiArXG4gICAgICBcInJlc3BvbnNlIGJ5IHJldHVybmluZyB0cnVlLCBidXQgdGhlIG1lc3NhZ2UgY2hhbm5lbCBjbG9zZWQgYmVmb3JlIGEgXCIgK1xuICAgICAgXCJyZXNwb25zZSB3YXMgcmVjZWl2ZWRcIjtcbi8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTE1Nzg2OTdcbmNvbnN0IEVSUk9SX01BTkFHRVJfRElTQ09OTkVDVEVEID0gXCJNZXNzYWdlIG1hbmFnZXIgZGlzY29ubmVjdGVkXCI7XG5cbi8qKlxuICogUmVjb25zdHJ1Y3RzIGFuIGVycm9yIGZyb20gYSBzZXJpYWxpemFibGUgZXJyb3Igb2JqZWN0XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVycm9yRGF0YSAtIEVycm9yIG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHtFcnJvcn0gZXJyb3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21TZXJpYWxpemFibGVFcnJvcihlcnJvckRhdGEpIHtcbiAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoZXJyb3JEYXRhLm1lc3NhZ2UpO1xuICBlcnJvci5jYXVzZSA9IGVycm9yRGF0YS5jYXVzZTtcbiAgZXJyb3IubmFtZSA9IGVycm9yRGF0YS5uYW1lO1xuICBlcnJvci5zdGFjayA9IGVycm9yRGF0YS5zdGFjaztcblxuICByZXR1cm4gZXJyb3I7XG59XG5cbi8qKlxuICogRmlsdGVycyBvdXQgYGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZWAgZXJyb3JzIHRvIGRvIHdpdGggdGhlIHJlY2VpdmluZyBlbmRcbiAqIG5vIGxvbmdlciBleGlzdGluZy5cbiAqXG4gKiBAcGFyYW0ge1Byb21pc2V9IHByb21pc2UgVGhlIHByb21pc2UgdGhhdCBzaG91bGQgaGF2ZSBcIm5vIGNvbm5lY3Rpb25cIiBlcnJvcnNcbiAqICAgaWdub3JlZC4gR2VuZXJhbGx5IHRoaXMgd291bGQgYmUgdGhlIHByb21pc2UgcmV0dXJuZWQgYnlcbiAqICAgYGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZWAuXG4gKiBAcmV0dXJuIHtQcm9taXNlfSBUaGUgc2FtZSBwcm9taXNlLCBidXQgd2lsbCByZXNvbHZlIHdpdGggYHVuZGVmaW5lZGAgaW5zdGVhZFxuICogICBvZiByZWplY3RpbmcgaWYgdGhlIHJlY2VpdmluZyBlbmQgbm8gbG9uZ2VyIGV4aXN0cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlnbm9yZU5vQ29ubmVjdGlvbkVycm9yKHByb21pc2UpIHtcbiAgcmV0dXJuIHByb21pc2UuY2F0Y2goZXJyb3IgPT4ge1xuICAgIGlmICh0eXBlb2YgZXJyb3IgPT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAoZXJyb3IubWVzc2FnZSA9PSBFUlJPUl9OT19DT05ORUNUSU9OIHx8XG4gICAgICAgICBlcnJvci5tZXNzYWdlID09IEVSUk9SX0NMT1NFRF9DT05ORUNUSU9OIHx8XG4gICAgICAgICBlcnJvci5tZXNzYWdlID09IEVSUk9SX01BTkFHRVJfRElTQ09OTkVDVEVEKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRocm93IGVycm9yO1xuICB9KTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIHNlcmlhbGl6YWJsZSBlcnJvciBvYmplY3QgZnJvbSBnaXZlbiBlcnJvclxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIC0gRXJyb3JcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBzZXJpYWxpemFibGUgZXJyb3Igb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1NlcmlhbGl6YWJsZUVycm9yKGVycm9yKSB7XG4gIHJldHVybiB7XG4gICAgY2F1c2U6IGVycm9yLmNhdXNlIGluc3RhbmNlb2YgRXJyb3IgP1xuICAgICAgdG9TZXJpYWxpemFibGVFcnJvcihlcnJvci5jYXVzZSkgOlxuICAgICAgZXJyb3IuY2F1c2UsXG4gICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICBuYW1lOiBlcnJvci5uYW1lLFxuICAgIHN0YWNrOiBlcnJvci5zdGFja1xuICB9O1xufVxuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV5ZW8ncyBXZWIgRXh0ZW5zaW9uIEFkIEJsb2NraW5nIFRvb2xraXQgKEVXRSksXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDYtcHJlc2VudCBleWVvIEdtYkhcbiAqXG4gKiBFV0UgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXNcbiAqIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIEVXRSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRVdFLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCBicm93c2VyIGZyb20gXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIjtcbmltcG9ydCB7aWdub3JlTm9Db25uZWN0aW9uRXJyb3J9IGZyb20gXCIuLi9hbGwvZXJyb3JzLmpzXCI7XG5cbmxldCBjb2xsYXBzZWRTZWxlY3RvcnMgPSBuZXcgU2V0KCk7XG5sZXQgb2JzZXJ2ZXJzID0gbmV3IFdlYWtNYXAoKTtcblxuZnVuY3Rpb24gZ2V0VVJMRnJvbUVsZW1lbnQoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gXCJvYmplY3RcIikge1xuICAgIGlmIChlbGVtZW50LmRhdGEpIHtcbiAgICAgIHJldHVybiBlbGVtZW50LmRhdGE7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgY2hpbGQgb2YgZWxlbWVudC5jaGlsZHJlbikge1xuICAgICAgaWYgKGNoaWxkLmxvY2FsTmFtZSA9PSBcInBhcmFtXCIgJiYgY2hpbGQubmFtZSA9PSBcIm1vdmllXCIgJiYgY2hpbGQudmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVUkwoY2hpbGQudmFsdWUsIGRvY3VtZW50LmJhc2VVUkkpLmhyZWY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudC5jdXJyZW50U3JjIHx8IGVsZW1lbnQuc3JjO1xufVxuXG5mdW5jdGlvbiBnZXRTZWxlY3RvckZvckJsb2NrZWRFbGVtZW50KGVsZW1lbnQpIHtcbiAgLy8gU2V0dGluZyB0aGUgXCJkaXNwbGF5XCIgQ1NTIHByb3BlcnR5IHRvIFwibm9uZVwiIGRvZXNuJ3QgaGF2ZSBhbnkgZWZmZWN0IG9uXG4gIC8vIDxmcmFtZT4gZWxlbWVudHMgKGluIGZyYW1lc2V0cykuIFNvIHdlIGhhdmUgdG8gaGlkZSBpdCBpbmxpbmUgdGhyb3VnaFxuICAvLyB0aGUgXCJ2aXNpYmlsaXR5XCIgQ1NTIHByb3BlcnR5LlxuICBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gXCJmcmFtZVwiKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBJZiB0aGUgPHZpZGVvPiBvciA8YXVkaW8+IGVsZW1lbnQgY29udGFpbnMgYW55IDxzb3VyY2U+IGNoaWxkcmVuLFxuICAvLyB3ZSBjYW5ub3QgYWRkcmVzcyBpdCBpbiBDU1MgYnkgdGhlIHNvdXJjZSBVUkw7IGluIHRoYXQgY2FzZSB3ZVxuICAvLyBkb24ndCBcImNvbGxhcHNlXCIgaXQgdXNpbmcgYSBDU1Mgc2VsZWN0b3IgYnV0IHJhdGhlciBoaWRlIGl0IGRpcmVjdGx5IGJ5XG4gIC8vIHNldHRpbmcgdGhlIHN0eWxlPVwiLi4uXCIgYXR0cmlidXRlLlxuICBpZiAoZWxlbWVudC5sb2NhbE5hbWUgPT0gXCJ2aWRlb1wiIHx8IGVsZW1lbnQubG9jYWxOYW1lID09IFwiYXVkaW9cIikge1xuICAgIGZvciAobGV0IGNoaWxkIG9mIGVsZW1lbnQuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjaGlsZC5sb2NhbE5hbWUgPT0gXCJzb3VyY2VcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsZXQgc2VsZWN0b3IgPSBcIlwiO1xuICBmb3IgKGxldCBhdHRyIG9mIFtcInNyY1wiLCBcInNyY3NldFwiXSkge1xuICAgIGxldCB2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICAgIGlmICh2YWx1ZSAmJiBhdHRyIGluIGVsZW1lbnQpIHtcbiAgICAgIHNlbGVjdG9yICs9IFwiW1wiICsgYXR0ciArIFwiPVwiICsgQ1NTLmVzY2FwZSh2YWx1ZSkgKyBcIl1cIjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3IgPyBlbGVtZW50LmxvY2FsTmFtZSArIHNlbGVjdG9yIDogbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVFbGVtZW50KGVsZW1lbnQsIHByb3BlcnRpZXMpIHtcbiAgbGV0IHtzdHlsZX0gPSBlbGVtZW50O1xuXG4gIGlmICghcHJvcGVydGllcykge1xuICAgIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PSBcImZyYW1lXCIpIHtcbiAgICAgIHByb3BlcnRpZXMgPSBbW1widmlzaWJpbGl0eVwiLCBcImhpZGRlblwiXV07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcHJvcGVydGllcyA9IFtbXCJkaXNwbGF5XCIsIFwibm9uZVwiXV07XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHByb3BlcnRpZXMpIHtcbiAgICBzdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlLCBcImltcG9ydGFudFwiKTtcbiAgfVxuXG4gIGlmIChvYnNlcnZlcnMuaGFzKGVsZW1lbnQpKSB7XG4gICAgb2JzZXJ2ZXJzLmdldChlbGVtZW50KS5kaXNjb25uZWN0KCk7XG4gIH1cblxuICBsZXQgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHByb3BlcnRpZXMpIHtcbiAgICAgIGlmIChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKGtleSkgIT0gdmFsdWUgfHxcbiAgICAgICAgICBzdHlsZS5nZXRQcm9wZXJ0eVByaW9yaXR5KGtleSkgIT0gXCJpbXBvcnRhbnRcIikge1xuICAgICAgICBzdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlLCBcImltcG9ydGFudFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBvYnNlcnZlci5vYnNlcnZlKFxuICAgIGVsZW1lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFtcInN0eWxlXCJdXG4gICAgfVxuICApO1xuICBvYnNlcnZlcnMuc2V0KGVsZW1lbnQsIG9ic2VydmVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuaGlkZUVsZW1lbnQoZWxlbWVudCkge1xuICBsZXQgb2JzZXJ2ZXIgPSBvYnNlcnZlcnMuZ2V0KGVsZW1lbnQpO1xuICBpZiAob2JzZXJ2ZXIpIHtcbiAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgb2JzZXJ2ZXJzLmRlbGV0ZShlbGVtZW50KTtcbiAgfVxuXG4gIGxldCBwcm9wZXJ0eSA9IGVsZW1lbnQubG9jYWxOYW1lID09IFwiZnJhbWVcIiA/IFwidmlzaWJpbGl0eVwiIDogXCJkaXNwbGF5XCI7XG4gIGVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkocHJvcGVydHkpO1xufVxuXG5mdW5jdGlvbiBjb2xsYXBzZUVsZW1lbnQoZWxlbWVudCkge1xuICBsZXQgc2VsZWN0b3IgPSBnZXRTZWxlY3RvckZvckJsb2NrZWRFbGVtZW50KGVsZW1lbnQpO1xuICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgaGlkZUVsZW1lbnQoZWxlbWVudCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFjb2xsYXBzZWRTZWxlY3RvcnMuaGFzKHNlbGVjdG9yKSkge1xuICAgIGlnbm9yZU5vQ29ubmVjdGlvbkVycm9yKFxuICAgICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogXCJld2U6aW5qZWN0LWNzc1wiLFxuICAgICAgICBzZWxlY3RvclxuICAgICAgfSlcbiAgICApO1xuICAgIGNvbGxhcHNlZFNlbGVjdG9ycy5hZGQoc2VsZWN0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhpZGVJbkFib3V0QmxhbmtGcmFtZXMoc2VsZWN0b3IsIHVybHMpIHtcbiAgLy8gUmVzb3VyY2VzIChlLmcuIGltYWdlcykgbG9hZGVkIGludG8gYWJvdXQ6YmxhbmsgZnJhbWVzXG4gIC8vIGFyZSAoc29tZXRpbWVzKSBsb2FkZWQgd2l0aCB0aGUgZnJhbWVJZCBvZiB0aGUgbWFpbl9mcmFtZS5cbiAgZm9yIChsZXQgZnJhbWUgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlmcmFtZVtzcmM9J2Fib3V0OmJsYW5rJ11cIikpIHtcbiAgICBpZiAoIWZyYW1lLmNvbnRlbnREb2N1bWVudCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgZWxlbWVudCBvZiBmcmFtZS5jb250ZW50RG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpIHtcbiAgICAgIC8vIFVzZSBoaWRlRWxlbWVudCwgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIHRoZSBjb3JyZWN0IGZyYW1lSWRcbiAgICAgIC8vIGZvciB0aGUgXCJld2U6aW5qZWN0LWNzc1wiIG1lc3NhZ2UuXG4gICAgICBpZiAodXJscy5oYXMoZ2V0VVJMRnJvbUVsZW1lbnQoZWxlbWVudCkpKSB7XG4gICAgICAgIGhpZGVFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRFbGVtZW50Q29sbGFwc2luZygpIHtcbiAgbGV0IGRlZmVycmVkID0gbnVsbDtcblxuICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlLCBzZW5kZXIpID0+IHtcbiAgICBpZiAoIW1lc3NhZ2UgfHwgbWVzc2FnZS50eXBlICE9IFwiZXdlOmNvbGxhcHNlXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PSBcImxvYWRpbmdcIikge1xuICAgICAgaWYgKCFkZWZlcnJlZCkge1xuICAgICAgICBkZWZlcnJlZCA9IG5ldyBNYXAoKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgICAgICAgIC8vIFVuZGVyIHNvbWUgY29uZGl0aW9ucyBhIGhvc3RpbGUgc2NyaXB0IGNvdWxkIHRyeSB0byB0cmlnZ2VyXG4gICAgICAgICAgLy8gdGhlIGV2ZW50IGFnYWluLiBTaW5jZSB3ZSBzZXQgZGVmZXJyZWQgdG8gYG51bGxgLCB0aGVuXG4gICAgICAgICAgLy8gd2UgYXNzdW1lIHRoYXQgd2Ugc2hvdWxkIGp1c3QgcmV0dXJuIGluc3RlYWQgb2YgdGhyb3dpbmdcbiAgICAgICAgICAvLyBhIFR5cGVFcnJvci5cbiAgICAgICAgICBpZiAoIWRlZmVycmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChsZXQgW3NlbGVjdG9yLCB1cmxzXSBvZiBkZWZlcnJlZCkge1xuICAgICAgICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICBpZiAodXJscy5oYXMoZ2V0VVJMRnJvbUVsZW1lbnQoZWxlbWVudCkpKSB7XG4gICAgICAgICAgICAgICAgY29sbGFwc2VFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhpZGVJbkFib3V0QmxhbmtGcmFtZXMoc2VsZWN0b3IsIHVybHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRlZmVycmVkID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGxldCB1cmxzID0gZGVmZXJyZWQuZ2V0KG1lc3NhZ2Uuc2VsZWN0b3IpIHx8IG5ldyBTZXQoKTtcbiAgICAgIGRlZmVycmVkLnNldChtZXNzYWdlLnNlbGVjdG9yLCB1cmxzKTtcbiAgICAgIHVybHMuYWRkKG1lc3NhZ2UudXJsKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwobWVzc2FnZS5zZWxlY3RvcikpIHtcbiAgICAgICAgaWYgKGdldFVSTEZyb21FbGVtZW50KGVsZW1lbnQpID09IG1lc3NhZ2UudXJsKSB7XG4gICAgICAgICAgY29sbGFwc2VFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGhpZGVJbkFib3V0QmxhbmtGcmFtZXMobWVzc2FnZS5zZWxlY3RvciwgbmV3IFNldChbbWVzc2FnZS51cmxdKSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG59XG4iLCIvKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXllbydzIFdlYiBFeHRlbnNpb24gQWQgQmxvY2tpbmcgVG9vbGtpdCAoRVdFKSxcbiAqIENvcHlyaWdodCAoQykgMjAwNi1wcmVzZW50IGV5ZW8gR21iSFxuICpcbiAqIEVXRSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhc1xuICogcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogRVdFIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBFV0UuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IGJyb3dzZXIgZnJvbSBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiO1xuaW1wb3J0IHtpZ25vcmVOb0Nvbm5lY3Rpb25FcnJvcn0gZnJvbSBcIi4uL2FsbC9lcnJvcnMuanNcIjtcblxuY29uc3QgTUFYX0VSUk9SX1RIUkVTSE9MRCA9IDMwO1xuY29uc3QgTUFYX1FVRVVFRF9FVkVOVFMgPSAyMDtcbmNvbnN0IEVWRU5UX0lOVEVSVkFMX01TID0gMTAwO1xuXG5sZXQgZXJyb3JDb3VudCA9IDA7XG5sZXQgZXZlbnRQcm9jZXNzaW5nSW50ZXJ2YWwgPSBudWxsO1xubGV0IGV2ZW50UHJvY2Vzc2luZ0luUHJvZ3Jlc3MgPSBmYWxzZTtcbmxldCBldmVudFF1ZXVlID0gW107XG5cbmZ1bmN0aW9uIGlzRXZlbnRUcnVzdGVkKGV2ZW50KSB7XG4gIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZXZlbnQpID09PSBDdXN0b21FdmVudC5wcm90b3R5cGUgJiZcbiAgICAhT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwoZXZlbnQsIFwiZGV0YWlsXCIpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBhbGxvd2xpc3REb21haW4oZXZlbnQpIHtcbiAgaWYgKCFpc0V2ZW50VHJ1c3RlZChldmVudCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gaWdub3JlTm9Db25uZWN0aW9uRXJyb3IoXG4gICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgIHR5cGU6IFwiZXdlOmFsbG93bGlzdC1wYWdlXCIsXG4gICAgICB0aW1lc3RhbXA6IGV2ZW50LmRldGFpbC50aW1lc3RhbXAsXG4gICAgICBzaWduYXR1cmU6IGV2ZW50LmRldGFpbC5zaWduYXR1cmUsXG4gICAgICBvcHRpb25zOiBldmVudC5kZXRhaWwub3B0aW9uc1xuICAgIH0pXG4gICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NOZXh0RXZlbnQoKSB7XG4gIGlmIChldmVudFByb2Nlc3NpbmdJblByb2dyZXNzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBldmVudFByb2Nlc3NpbmdJblByb2dyZXNzID0gdHJ1ZTtcbiAgICBsZXQgZXZlbnQgPSBldmVudFF1ZXVlLnNoaWZ0KCk7XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgYWxsb3dsaXN0aW5nUmVzdWx0ID0gYXdhaXQgYWxsb3dsaXN0RG9tYWluKGV2ZW50KTtcbiAgICAgICAgaWYgKGFsbG93bGlzdGluZ1Jlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiZG9tYWluX2FsbG93bGlzdGluZ19zdWNjZXNzXCIpKTtcbiAgICAgICAgICBzdG9wT25lQ2xpY2tBbGxvd2xpc3RpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEb21haW4gYWxsb3dsaXN0aW5nIHJlamVjdGVkXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvckNvdW50Kys7XG4gICAgICAgIGlmIChlcnJvckNvdW50ID49IE1BWF9FUlJPUl9USFJFU0hPTEQpIHtcbiAgICAgICAgICBzdG9wT25lQ2xpY2tBbGxvd2xpc3RpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZXZlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgIHN0b3BQcm9jZXNzaW5nSW50ZXJ2YWwoKTtcbiAgICB9XG4gIH1cbiAgZmluYWxseSB7XG4gICAgZXZlbnRQcm9jZXNzaW5nSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIG9uRG9tYWluQWxsb3dsaXN0aW5nUmVxdWVzdChldmVudCkge1xuICBpZiAoZXZlbnRRdWV1ZS5sZW5ndGggPj0gTUFYX1FVRVVFRF9FVkVOVFMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBldmVudFF1ZXVlLnB1c2goZXZlbnQpO1xuICBzdGFydFByb2Nlc3NpbmdJbnRlcnZhbCgpO1xufVxuXG5mdW5jdGlvbiBzdGFydFByb2Nlc3NpbmdJbnRlcnZhbCgpIHtcbiAgaWYgKCFldmVudFByb2Nlc3NpbmdJbnRlcnZhbCkge1xuICAgIHByb2Nlc3NOZXh0RXZlbnQoKTtcbiAgICBldmVudFByb2Nlc3NpbmdJbnRlcnZhbCA9IHNldEludGVydmFsKHByb2Nlc3NOZXh0RXZlbnQsIEVWRU5UX0lOVEVSVkFMX01TKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzdG9wUHJvY2Vzc2luZ0ludGVydmFsKCkge1xuICBjbGVhckludGVydmFsKGV2ZW50UHJvY2Vzc2luZ0ludGVydmFsKTtcbiAgZXZlbnRQcm9jZXNzaW5nSW50ZXJ2YWwgPSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RvcE9uZUNsaWNrQWxsb3dsaXN0aW5nKCkge1xuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZG9tYWluX2FsbG93bGlzdGluZ19yZXF1ZXN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Eb21haW5BbGxvd2xpc3RpbmdSZXF1ZXN0LCB0cnVlKTtcbiAgZXZlbnRRdWV1ZSA9IFtdO1xuICBzdG9wUHJvY2Vzc2luZ0ludGVydmFsKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydE9uZUNsaWNrQWxsb3dsaXN0aW5nKCkge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZG9tYWluX2FsbG93bGlzdGluZ19yZXF1ZXN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Eb21haW5BbGxvd2xpc3RpbmdSZXF1ZXN0LCB0cnVlKTtcbn1cbiIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBleWVvJ3MgV2ViIEV4dGVuc2lvbiBBZCBCbG9ja2luZyBUb29sa2l0IChFV0UpLFxuICogQ29weXJpZ2h0IChDKSAyMDA2LXByZXNlbnQgZXllbyBHbWJIXG4gKlxuICogRVdFIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzXG4gKiBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBFV0UgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEVXRS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgYnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5pbXBvcnQge2lnbm9yZU5vQ29ubmVjdGlvbkVycm9yfSBmcm9tIFwiLi4vYWxsL2Vycm9ycy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRWxlbWVudEhpZGluZ1RyYWNlciB7XG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9ycykge1xuICAgIHRoaXMuc2VsZWN0b3JzID0gbmV3IE1hcChzZWxlY3RvcnMpO1xuXG4gICAgdGhpcy5vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgIHRoaXMub2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnRyYWNlKCksIDEwMDApO1xuICAgIH0pO1xuXG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT0gXCJsb2FkaW5nXCIpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHRoaXMudHJhY2UoKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy50cmFjZSgpO1xuICAgIH1cbiAgfVxuXG4gIGxvZyhmaWx0ZXJzLCBzZWxlY3RvcnMgPSBbXSkge1xuICAgIGlnbm9yZU5vQ29ubmVjdGlvbkVycm9yKGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZShcbiAgICAgIHt0eXBlOiBcImV3ZTp0cmFjZS1lbGVtLWhpZGVcIiwgZmlsdGVycywgc2VsZWN0b3JzfVxuICAgICkpO1xuICB9XG5cbiAgdHJhY2UoKSB7XG4gICAgbGV0IGZpbHRlcnMgPSBbXTtcbiAgICBsZXQgc2VsZWN0b3JzID0gW107XG5cbiAgICBmb3IgKGxldCBbc2VsZWN0b3IsIGZpbHRlcl0gb2YgdGhpcy5zZWxlY3RvcnMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0b3JzLmRlbGV0ZShzZWxlY3Rvcik7XG4gICAgICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICAgICAgZmlsdGVycy5wdXNoKGZpbHRlcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2VsZWN0b3JzLnB1c2goc2VsZWN0b3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmaWx0ZXJzLmxlbmd0aCA+IDAgfHwgc2VsZWN0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMubG9nKGZpbHRlcnMsIHNlbGVjdG9ycyk7XG4gICAgfVxuXG4gICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7Y2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZX0pO1xuICB9XG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLm9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgfVxufVxuIiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV5ZW8ncyBXZWIgRXh0ZW5zaW9uIEFkIEJsb2NraW5nIFRvb2xraXQgKEVXRSksXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDYtcHJlc2VudCBleWVvIEdtYkhcbiAqXG4gKiBFV0UgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXNcbiAqIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIEVXRSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRVdFLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCBicm93c2VyIGZyb20gXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIjtcbmltcG9ydCB7aWdub3JlTm9Db25uZWN0aW9uRXJyb3J9IGZyb20gXCIuLi9hbGwvZXJyb3JzLmpzXCI7XG5cbmNvbnN0IEFMTE9XRURfRE9NQUlOUyA9IG5ldyBTZXQoW1xuICBcImFicGNoaW5hLm9yZ1wiLFxuICBcImFicGluZG8uYmxvZ3Nwb3QuY29tXCIsXG4gIFwiYWJwdm4uY29tXCIsXG4gIFwiYWRibG9jay5lZVwiLFxuICBcImFkYmxvY2suZ2FyZGFyLm5ldFwiLFxuICBcImFkYmxvY2twbHVzLm1lXCIsXG4gIFwiYWRibG9ja3BsdXMub3JnXCIsXG4gIFwiYWJwdGVzdHBhZ2VzLm9yZ1wiLFxuICBcImNvbW1lbnRjYW1hcmNoZS5uZXRcIixcbiAgXCJkcm9pdC1maW5hbmNlcy5jb21tZW50Y2FtYXJjaGUuY29tXCIsXG4gIFwiZWFzeWxpc3QudG9cIixcbiAgXCJleWVvLmNvbVwiLFxuICBcImZhbmJveS5jby5uelwiLFxuICBcImZpbHRlcmxpc3RzLmNvbVwiLFxuICBcImZvcnVtcy5sYW5pay51c1wiLFxuICBcImdpdGVlLmNvbVwiLFxuICBcImdpdGVlLmlvXCIsXG4gIFwiZ2l0aHViLmNvbVwiLFxuICBcImdpdGh1Yi5pb1wiLFxuICBcImdpdGxhYi5jb21cIixcbiAgXCJnaXRsYWIuaW9cIixcbiAgXCJndXJ1ZC5lZVwiLFxuICBcImh1Z29sZXNjYXJnb3QuY29tXCIsXG4gIFwiaS1kb250LWNhcmUtYWJvdXQtY29va2llcy5ldVwiLFxuICBcImpvdXJuYWxkZXNmZW1tZXMuZnJcIixcbiAgXCJqb3VybmFsZHVuZXQuY29tXCIsXG4gIFwibGludGVybmF1dGUuY29tXCIsXG4gIFwic3BhbTQwNC5jb21cIixcbiAgXCJzdGFuZXYub3JnXCIsXG4gIFwidm9pZC5nclwiLFxuICBcInhmaWxlcy5ub2Fkcy5pdFwiLFxuICBcInpvc28ucm9cIlxuXSk7XG5cbmZ1bmN0aW9uIGlzRG9tYWluQWxsb3dlZChkb21haW4pIHtcbiAgaWYgKGRvbWFpbi5lbmRzV2l0aChcIi5cIikpIHtcbiAgICBkb21haW4gPSBkb21haW4uc3Vic3RyaW5nKDAsIGRvbWFpbi5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgaWYgKEFMTE9XRURfRE9NQUlOUy5oYXMoZG9tYWluKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGxldCBpbmRleCA9IGRvbWFpbi5pbmRleE9mKFwiLlwiKTtcbiAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZG9tYWluID0gZG9tYWluLnN1YnN0cihpbmRleCArIDEpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWJzY3JpYmVMaW5rc0VuYWJsZWQodXJsKSB7XG4gIGxldCB7cHJvdG9jb2wsIGhvc3RuYW1lfSA9IG5ldyBVUkwodXJsKTtcbiAgcmV0dXJuIGhvc3RuYW1lID09IFwibG9jYWxob3N0XCIgfHxcbiAgICBwcm90b2NvbCA9PSBcImh0dHBzOlwiICYmIGlzRG9tYWluQWxsb3dlZChob3N0bmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVTdWJzY3JpYmVMaW5rcygpIHtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50ID0+IHtcbiAgICBpZiAoZXZlbnQuYnV0dG9uID09IDIgfHwgIWV2ZW50LmlzVHJ1c3RlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBsaW5rID0gZXZlbnQudGFyZ2V0O1xuICAgIHdoaWxlICghKGxpbmsgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCkpIHtcbiAgICAgIGxpbmsgPSBsaW5rLnBhcmVudE5vZGU7XG5cbiAgICAgIGlmICghbGluaykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHF1ZXJ5U3RyaW5nID0gbnVsbDtcbiAgICBpZiAobGluay5wcm90b2NvbCA9PSBcImh0dHA6XCIgfHwgbGluay5wcm90b2NvbCA9PSBcImh0dHBzOlwiKSB7XG4gICAgICBpZiAobGluay5ob3N0ID09IFwic3Vic2NyaWJlLmFkYmxvY2twbHVzLm9yZ1wiICYmIGxpbmsucGF0aG5hbWUgPT0gXCIvXCIpIHtcbiAgICAgICAgcXVlcnlTdHJpbmcgPSBsaW5rLnNlYXJjaC5zdWJzdHIoMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gRmlyZWZveCBkb2Vzbid0IHNlZW0gdG8gcG9wdWxhdGUgdGhlIFwic2VhcmNoXCIgcHJvcGVydHkgZm9yXG4gICAgICAvLyBsaW5rcyB3aXRoIG5vbi1zdGFuZGFyZCBVUkwgc2NoZW1lcyBzbyB3ZSBuZWVkIHRvIGV4dHJhY3QgdGhlIHF1ZXJ5XG4gICAgICAvLyBzdHJpbmcgbWFudWFsbHkuXG4gICAgICBsZXQgbWF0Y2ggPSAvXmFicDpcXC8qc3Vic2NyaWJlXFwvKlxcPyguKikvaS5leGVjKGxpbmsuaHJlZik7XG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgcXVlcnlTdHJpbmcgPSBtYXRjaFsxXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXF1ZXJ5U3RyaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHRpdGxlID0gbnVsbDtcbiAgICBsZXQgdXJsID0gbnVsbDtcbiAgICBmb3IgKGxldCBwYXJhbSBvZiBxdWVyeVN0cmluZy5zcGxpdChcIiZcIikpIHtcbiAgICAgIGxldCBwYXJ0cyA9IHBhcmFtLnNwbGl0KFwiPVwiLCAyKTtcbiAgICAgIGlmIChwYXJ0cy5sZW5ndGggIT0gMiB8fCAhL1xcUy8udGVzdChwYXJ0c1sxXSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBzd2l0Y2ggKHBhcnRzWzBdKSB7XG4gICAgICAgIGNhc2UgXCJ0aXRsZVwiOlxuICAgICAgICAgIHRpdGxlID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImxvY2F0aW9uXCI6XG4gICAgICAgICAgdXJsID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF1cmwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRpdGxlKSB7XG4gICAgICB0aXRsZSA9IHVybDtcbiAgICB9XG5cbiAgICB0aXRsZSA9IHRpdGxlLnRyaW0oKTtcbiAgICB1cmwgPSB1cmwudHJpbSgpO1xuICAgIGlmICghL14oaHR0cHM/fGZ0cCk6Ly50ZXN0KHVybCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZ25vcmVOb0Nvbm5lY3Rpb25FcnJvcihcbiAgICAgIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7dHlwZTogXCJld2U6c3Vic2NyaWJlLWxpbmstY2xpY2tlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSwgdXJsfSlcbiAgICApO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfSwgdHJ1ZSk7XG59XG4iLCIvKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXllbydzIFdlYiBFeHRlbnNpb24gQWQgQmxvY2tpbmcgVG9vbGtpdCAoRVdFKSxcbiAqIENvcHlyaWdodCAoQykgMjAwNi1wcmVzZW50IGV5ZW8gR21iSFxuICpcbiAqIEVXRSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhc1xuICogcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogRVdFIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBFV0UuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IGJyb3dzZXIgZnJvbSBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiO1xuaW1wb3J0IHtpZ25vcmVOb0Nvbm5lY3Rpb25FcnJvcn0gZnJvbSBcIi4uL2FsbC9lcnJvcnMuanNcIjtcblxubGV0IGlzQWN0aXZlID0gZmFsc2U7XG5cbmZ1bmN0aW9uIG5vdGlmeUFjdGl2ZSgpIHtcbiAgaWYgKGlzQWN0aXZlKSB7XG4gICAgaWdub3JlTm9Db25uZWN0aW9uRXJyb3IoXG4gICAgICBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiBcImV3ZTpjZHAtc2Vzc2lvbi1hY3RpdmVcIlxuICAgICAgfSlcbiAgICApO1xuICAgIGlzQWN0aXZlID0gZmFsc2U7XG4gIH1cbiAgc2NoZWR1bGVDaGVja0FjdGl2ZSgpO1xufVxuXG5mdW5jdGlvbiBzY2hlZHVsZUNoZWNrQWN0aXZlKCkge1xuICBzZXRUaW1lb3V0KG5vdGlmeUFjdGl2ZSwgMTAwMCk7XG59XG5cbmZ1bmN0aW9uIG1hcmtBY3RpdmUoKSB7XG4gIGlzQWN0aXZlID0gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0Tm90aWZ5QWN0aXZlKCkge1xuICBzY2hlZHVsZUNoZWNrQWN0aXZlKCk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBtYXJrQWN0aXZlLCB0cnVlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG1hcmtBY3RpdmUpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgbWFya0FjdGl2ZSwgdHJ1ZSk7XG59XG4iLCJjb25zdCByYW5kb21VVUlEID0gdHlwZW9mIGNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLnJhbmRvbVVVSUQgJiYgY3J5cHRvLnJhbmRvbVVVSUQuYmluZChjcnlwdG8pO1xuZXhwb3J0IGRlZmF1bHQge1xuICByYW5kb21VVUlEXG59OyIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuIEluIHRoZSBicm93c2VyIHdlIHRoZXJlZm9yZVxuLy8gcmVxdWlyZSB0aGUgY3J5cHRvIEFQSSBhbmQgZG8gbm90IHN1cHBvcnQgYnVpbHQtaW4gZmFsbGJhY2sgdG8gbG93ZXIgcXVhbGl0eSByYW5kb20gbnVtYmVyXG4vLyBnZW5lcmF0b3JzIChsaWtlIE1hdGgucmFuZG9tKCkpLlxubGV0IGdldFJhbmRvbVZhbHVlcztcbmNvbnN0IHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm5nKCkge1xuICAvLyBsYXp5IGxvYWQgc28gdGhhdCBlbnZpcm9ubWVudHMgdGhhdCBuZWVkIHRvIHBvbHlmaWxsIGhhdmUgYSBjaGFuY2UgdG8gZG8gc29cbiAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG8gaW1wbGVtZW50YXRpb24uXG4gICAgZ2V0UmFuZG9tVmFsdWVzID0gdHlwZW9mIGNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKTtcblxuICAgIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoKSBub3Qgc3VwcG9ydGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkI2dldHJhbmRvbXZhbHVlcy1ub3Qtc3VwcG9ydGVkJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG59IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG5cbmNvbnN0IGJ5dGVUb0hleCA9IFtdO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleC5wdXNoKChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zbGljZSgxKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnNhZmVTdHJpbmdpZnkoYXJyLCBvZmZzZXQgPSAwKSB7XG4gIC8vIE5vdGU6IEJlIGNhcmVmdWwgZWRpdGluZyB0aGlzIGNvZGUhICBJdCdzIGJlZW4gdHVuZWQgZm9yIHBlcmZvcm1hbmNlXG4gIC8vIGFuZCB3b3JrcyBpbiB3YXlzIHlvdSBtYXkgbm90IGV4cGVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZC9wdWxsLzQzNFxuICByZXR1cm4gYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAzXV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA2XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDddXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA5XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDExXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEzXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE1XV07XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShhcnIsIG9mZnNldCA9IDApIHtcbiAgY29uc3QgdXVpZCA9IHVuc2FmZVN0cmluZ2lmeShhcnIsIG9mZnNldCk7IC8vIENvbnNpc3RlbmN5IGNoZWNrIGZvciB2YWxpZCBVVUlELiAgSWYgdGhpcyB0aHJvd3MsIGl0J3MgbGlrZWx5IGR1ZSB0byBvbmVcbiAgLy8gb2YgdGhlIGZvbGxvd2luZzpcbiAgLy8gLSBPbmUgb3IgbW9yZSBpbnB1dCBhcnJheSB2YWx1ZXMgZG9uJ3QgbWFwIHRvIGEgaGV4IG9jdGV0IChsZWFkaW5nIHRvXG4gIC8vIFwidW5kZWZpbmVkXCIgaW4gdGhlIHV1aWQpXG4gIC8vIC0gSW52YWxpZCBpbnB1dCB2YWx1ZXMgZm9yIHRoZSBSRkMgYHZlcnNpb25gIG9yIGB2YXJpYW50YCBmaWVsZHNcblxuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmdpZmllZCBVVUlEIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHJldHVybiB1dWlkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdHJpbmdpZnk7IiwiaW1wb3J0IG5hdGl2ZSBmcm9tICcuL25hdGl2ZS5qcyc7XG5pbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCB7IHVuc2FmZVN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcblxuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgaWYgKG5hdGl2ZS5yYW5kb21VVUlEICYmICFidWYgJiYgIW9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmF0aXZlLnJhbmRvbVVVSUQoKTtcbiAgfVxuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTsgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuXG4gIHJuZHNbNl0gPSBybmRzWzZdICYgMHgwZiB8IDB4NDA7XG4gIHJuZHNbOF0gPSBybmRzWzhdICYgMHgzZiB8IDB4ODA7IC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuXG4gIGlmIChidWYpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgYnVmW29mZnNldCArIGldID0gcm5kc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcmV0dXJuIHVuc2FmZVN0cmluZ2lmeShybmRzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjQ7IiwiLypcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIGV5ZW8ncyBXZWIgRXh0ZW5zaW9uIEFkIEJsb2NraW5nIFRvb2xraXQgKEVXRSksXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDYtcHJlc2VudCBleWVvIEdtYkhcbiAqXG4gKiBFV0UgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXNcbiAqIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIEVXRSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggRVdFLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCBicm93c2VyIGZyb20gXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIjtcbmltcG9ydCB7djQgYXMgdXVpZHY0fSBmcm9tIFwidXVpZFwiO1xuXG5pbXBvcnQge2lnbm9yZU5vQ29ubmVjdGlvbkVycm9yfSBmcm9tIFwiLi4vYWxsL2Vycm9ycy5qc1wiO1xuXG5sZXQgc2Vzc2lvbklkID0gbnVsbDtcblxuZnVuY3Rpb24gb25CVEFBRGV0ZWN0aW9uRXZlbnQoZXZlbnQpIHtcbiAgaWYgKCFzZXNzaW9uSWQpIHtcbiAgICBzZXNzaW9uSWQgPSB1dWlkdjQoKTtcbiAgfVxuXG4gIGlnbm9yZU5vQ29ubmVjdGlvbkVycm9yKFxuICAgIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICB0eXBlOiBcImV3ZTpibG9ja3Rocm91Z2gtYWNjZXB0YWJsZS1hZHMtZGV0ZWN0aW9uLWV2ZW50XCIsXG4gICAgICBkZXRhaWxzOiB7XG4gICAgICAgIGFiOiBldmVudC5kZXRhaWwuYWIsXG4gICAgICAgIGFjY2VwdGFibGU6IGV2ZW50LmRldGFpbC5hY2NlcHRhYmxlLFxuICAgICAgICBzZXNzaW9uSWRcbiAgICAgIH1cbiAgICB9KVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRXYXRjaGluZ0Jsb2NrdGhyb3VnaFRhZygpIHtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJCVEFBRGV0ZWN0aW9uXCIsIG9uQlRBQURldGVjdGlvbkV2ZW50KTtcbn1cbiIsIi8qXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBleWVvJ3MgV2ViIEV4dGVuc2lvbiBBZCBCbG9ja2luZyBUb29sa2l0IChFV0UpLFxuICogQ29weXJpZ2h0IChDKSAyMDA2LXByZXNlbnQgZXllbyBHbWJIXG4gKlxuICogRVdFIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzXG4gKiBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBFV0UgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEVXRS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQgYnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5pbXBvcnQge2lnbm9yZU5vQ29ubmVjdGlvbkVycm9yfSBmcm9tIFwiLi4vYWxsL2Vycm9ycy5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRTYWZhcmlIaXN0b3J5KCkge1xuLy8gSXQgcmVjZWl2ZXMgYSBtZXNzYWdlIGZyb20gaW5qZWN0ZWQgaW4gU2FmYXJpIGBoaXN0b3J5LnB1c2hTdGF0ZSgpYFxuLy8gYW5kIGZvcndhcmRzIGl0IHRvIHdlYiBleHRlbnNpb24gYmFja2dyb3VuZCBzY3JpcHQuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgIFwibWVzc2FnZVwiLFxuICAgIGV2ZW50ID0+IHtcbiAgICAgIGlmICghZXZlbnQuaXNUcnVzdGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LmRhdGEgJiZcbiAgICAgICAgZXZlbnQuZGF0YS50eXBlID09PSBcImV3ZTpzYWZhcmktb25oaXN0b3J5c3RhdGV1cGRhdGVkLWNvbnRlbnRcIikge1xuICAgICAgICByZXR1cm4gaWdub3JlTm9Db25uZWN0aW9uRXJyb3IoXG4gICAgICAgICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6IFwiZXdlOnNhZmFyaS1vbmhpc3RvcnlzdGF0ZXVwZGF0ZWRcIixcbiAgICAgICAgICAgIGV2ZW50OiBldmVudC5kYXRhLmV2ZW50XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGZhbHNlXG4gICk7XG59XG4iLCIvKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgZXllbydzIFdlYiBFeHRlbnNpb24gQWQgQmxvY2tpbmcgVG9vbGtpdCAoRVdFKSxcbiAqIENvcHlyaWdodCAoQykgMjAwNi1wcmVzZW50IGV5ZW8gR21iSFxuICpcbiAqIEVXRSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhc1xuICogcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogRVdFIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBFV0UuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IGJyb3dzZXIgZnJvbSBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiO1xuXG5pbXBvcnQge0VsZW1IaWRlRW11bGF0aW9ufVxuICBmcm9tIFwiI2FkYmxvY2twbHVzY29yZS9saWIvY29udGVudC9lbGVtSGlkZUVtdWxhdGlvbi5qc1wiO1xuXG5pbXBvcnQge2lnbm9yZU5vQ29ubmVjdGlvbkVycm9yfSBmcm9tIFwiLi4vYWxsL2Vycm9ycy5qc1wiO1xuaW1wb3J0IHtzdGFydEVsZW1lbnRDb2xsYXBzaW5nLCBoaWRlRWxlbWVudCwgdW5oaWRlRWxlbWVudH1cbiAgZnJvbSBcIi4vZWxlbWVudC1jb2xsYXBzaW5nLmpzXCI7XG5pbXBvcnQge3N0YXJ0T25lQ2xpY2tBbGxvd2xpc3Rpbmd9IGZyb20gXCIuL2FsbG93bGlzdGluZy5qc1wiO1xuaW1wb3J0IHtFbGVtZW50SGlkaW5nVHJhY2VyfSBmcm9tIFwiLi9lbGVtZW50LWhpZGluZy10cmFjZXIuanNcIjtcbmltcG9ydCB7c3Vic2NyaWJlTGlua3NFbmFibGVkLCBoYW5kbGVTdWJzY3JpYmVMaW5rc30gZnJvbSBcIi4vc3Vic2NyaWJlLWxpbmtzLmpzXCI7XG5pbXBvcnQge3N0YXJ0Tm90aWZ5QWN0aXZlfSBmcm9tIFwiLi9jZHAtc2Vzc2lvbi5qc1wiO1xuaW1wb3J0IHtzdGFydFdhdGNoaW5nQmxvY2t0aHJvdWdoVGFnfSBmcm9tIFwiLi9ibG9ja3Rocm91Z2gtdGFnLmpzXCI7XG5pbXBvcnQge3N0YXJ0U2FmYXJpSGlzdG9yeX0gZnJvbSBcIi4vc2FmYXJpLWhpc3RvcnkuanNcIjtcblxubGV0IHRyYWNlcjtcbmxldCBlbGVtSGlkZUVtdWxhdGlvbjtcblxuYXN5bmMgZnVuY3Rpb24gaW5pdENvbnRlbnRGZWF0dXJlcygpIHtcbiAgaWYgKHN1YnNjcmliZUxpbmtzRW5hYmxlZCh3aW5kb3cubG9jYXRpb24uaHJlZikpIHtcbiAgICBoYW5kbGVTdWJzY3JpYmVMaW5rcygpO1xuICB9XG5cbiAgbGV0IHJlc3BvbnNlID0gYXdhaXQgaWdub3JlTm9Db25uZWN0aW9uRXJyb3IoXG4gICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHt0eXBlOiBcImV3ZTpjb250ZW50LWhlbGxvXCJ9KVxuICApO1xuXG4gIGlmIChyZXNwb25zZSkge1xuICAgIGF3YWl0IGFwcGx5Q29udGVudEZlYXR1cmVzKHJlc3BvbnNlKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiByZW1vdmVDb250ZW50RmVhdHVyZXMoKSB7XG4gIGlmICh0cmFjZXIpIHtcbiAgICB0cmFjZXIuZGlzY29ubmVjdCgpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGFwcGx5Q29udGVudEZlYXR1cmVzKHJlc3BvbnNlKSB7XG4gIGlmIChyZXNwb25zZS50cmFjZWRTZWxlY3RvcnMpIHtcbiAgICB0cmFjZXIgPSBuZXcgRWxlbWVudEhpZGluZ1RyYWNlcihyZXNwb25zZS50cmFjZWRTZWxlY3RvcnMpO1xuICB9XG5cbiAgY29uc3QgaGlkZUVsZW1lbnRzID0gKGVsZW1lbnRzLCBmaWx0ZXJzKSA9PiB7XG4gICAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgICAgaGlkZUVsZW1lbnQoZWxlbWVudCwgcmVzcG9uc2UuY3NzUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgaWYgKHRyYWNlcikge1xuICAgICAgdHJhY2VyLmxvZyhmaWx0ZXJzKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdW5oaWRlRWxlbWVudHMgPSBlbGVtZW50cyA9PiB7XG4gICAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgICAgdW5oaWRlRWxlbWVudChlbGVtZW50KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlRWxlbWVudHMgPSAoZWxlbWVudHMsIGZpbHRlcnMpID0+IHtcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRyYWNlcikge1xuICAgICAgdHJhY2VyLmxvZyhmaWx0ZXJzKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXBwbHlJbmxpbmVDU1MgPSAoZWxlbWVudHMsIGNzc1BhdHRlcm5zKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuICAgICAgY29uc3QgcGF0dGVybiA9IGNzc1BhdHRlcm5zW2ldO1xuXG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwYXR0ZXJuLmNzcykpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlLCBcImltcG9ydGFudFwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHJhY2VyKSB7XG4gICAgICBjb25zdCBmaWx0ZXJUZXh0cyA9IGNzc1BhdHRlcm5zLm1hcChwYXR0ZXJuID0+IHBhdHRlcm4udGV4dCk7XG4gICAgICB0cmFjZXIubG9nKGZpbHRlclRleHRzKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHJlc3BvbnNlLmVtdWxhdGVkUGF0dGVybnMubGVuZ3RoID4gMCkge1xuICAgIGlmICghZWxlbUhpZGVFbXVsYXRpb24pIHtcbiAgICAgIGVsZW1IaWRlRW11bGF0aW9uID0gbmV3IEVsZW1IaWRlRW11bGF0aW9uKGhpZGVFbGVtZW50cywgdW5oaWRlRWxlbWVudHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVFbGVtZW50cywgYXBwbHlJbmxpbmVDU1MpO1xuICAgIH1cbiAgICBlbGVtSGlkZUVtdWxhdGlvbi5hcHBseShyZXNwb25zZS5lbXVsYXRlZFBhdHRlcm5zKTtcbiAgfVxuICBlbHNlIGlmIChlbGVtSGlkZUVtdWxhdGlvbikge1xuICAgIGVsZW1IaWRlRW11bGF0aW9uLmFwcGx5KHJlc3BvbnNlLmVtdWxhdGVkUGF0dGVybnMpO1xuICB9XG5cbiAgaWYgKHJlc3BvbnNlLm5vdGlmeUFjdGl2ZSkge1xuICAgIHN0YXJ0Tm90aWZ5QWN0aXZlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gb25NZXNzYWdlKG1lc3NhZ2UpIHtcbiAgaWYgKHR5cGVvZiBtZXNzYWdlID09IFwib2JqZWN0XCIgJiYgbWVzc2FnZSAhPSBudWxsICYmXG4gICAgbWVzc2FnZS50eXBlICYmIG1lc3NhZ2UudHlwZSA9PSBcImV3ZTphcHBseS1jb250ZW50LWZlYXR1cmVzXCIpIHtcbiAgICByZW1vdmVDb250ZW50RmVhdHVyZXMoKTtcbiAgICBhcHBseUNvbnRlbnRGZWF0dXJlcyhtZXNzYWdlKTtcbiAgfVxufVxuYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihvbk1lc3NhZ2UpO1xuXG5zdGFydFNhZmFyaUhpc3RvcnkoKTtcbnN0YXJ0RWxlbWVudENvbGxhcHNpbmcoKTtcbnN0YXJ0T25lQ2xpY2tBbGxvd2xpc3RpbmcoKTtcbmluaXRDb250ZW50RmVhdHVyZXMoKTtcbnN0YXJ0V2F0Y2hpbmdCbG9ja3Rocm91Z2hUYWcoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==