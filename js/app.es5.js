/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../shared/ts/utils/data.ts":
/*!**********************************!*\
  !*** ../shared/ts/utils/data.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isObject": function() { return /* binding */ isObject; }
/* harmony export */ });
/* unused harmony exports isFunction, isString, isNumber, isArray, isNullOrUndefined */
const isFunction = type => {
  return typeof type === "function";
};
const isString = type => {
  return typeof type === "string";
};
const isNumber = type => {
  return typeof type === "number";
};
const isArray = type => {
  return Array.isArray(type);
};
const isObject = type => {
  return type === Object(type) && !isArray(type);
};
const isNullOrUndefined = type => {
  return type !== null && typeof type !== "undefined";
};

/***/ }),

/***/ "../shared/ts/utils/focus-manager.ts":
/*!*******************************************!*\
  !*** ../shared/ts/utils/focus-manager.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FocusManager; }
/* harmony export */ });
/* harmony import */ var Shared_ts_utils_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Shared/ts/utils/html */ "../shared/ts/utils/html.ts");

class FocusManager {
  /**
   * Represents the internal root WeakMap interface that communicates with the public root accessor.
   */

  /**
   * Uses the FocusManager instance as a key to return the root HTMLElement.
   * @param key FocusManager
   * @returns HTMLElement
   */
  static getRoot(key) {
    return this.root.get(key);
  }

  /**
   * Represents all focusable elements within the root context.
   */

  /**
   * Uses a root element to determine all of the focusable elements that exist within the root context. All focusable elements are returned as a new array and can be accessed. Support includes operations to enable and disable focus trap navigation.
   * @param root HTMLElement
   */
  constructor(root) {
    if (root === void 0) {
      root = document.querySelector("body");
    }
    this.focusElements = [];
    if (!(0,Shared_ts_utils_html__WEBPACK_IMPORTED_MODULE_0__.elementExists)(root)) {
      throw new Error(`FocusManager failed to determine if the passed element exists.`);
    }
    FocusManager.root.set(this, root);
    this.updateElements();
  }

  /**
   * Queries the document to fetch all focusable elements within the root context. The returned NodeList will be converted into an array and be accessible through the "HTMLElements" property.
   */
  updateElements() {
    const root = FocusManager.root.get(this);
    if (root) {
      this.focusElements = this.getElements();
    }
  }
  getElements() {
    const root = FocusManager.root.get(this);
    return root ? Array.from(root.querySelectorAll("button, [href]:not(link):not(base):not(use), input, select, textarea, [tabindex]:not([data-root-boundary])")) : [];
  }

  /**
   * Returns the first focusable element within the root context.
   * @returns Element
   */
  firstElement() {
    return this.focusElements[0];
  }

  /**
   * Returns the last focusable element within the root context.
   * @returns Element
   */
  lastElement() {
    return this.focusElements[this.focusElements.length - 1];
  }

  /**
   * Returns the next element or the first element from the focus element array
   * @param element HTMLElement
   * @returns HTMLElement
   */
  nextElement(element) {
    const index = this.focusElements.indexOf(element) + 1;
    return index <= this.focusElements.length - 1 ? this.focusElements[index] : this.firstElement();
  }

  /**
   * Returns the previous element or the last element from the focus element array
   * @param element HTMLElement
   * @returns HTMLElement
   */
  previousElement(element) {
    const index = this.focusElements.indexOf(element) - 1;
    return index >= 0 ? this.focusElements[index] : this.lastElement();
  }
}
FocusManager.root = new WeakMap();

/***/ }),

/***/ "../shared/ts/utils/focus-trap.ts":
/*!****************************************!*\
  !*** ../shared/ts/utils/focus-trap.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FocusTrap; }
/* harmony export */ });
/* harmony import */ var Shared_ts_utils_focus_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Shared/ts/utils/focus-manager */ "../shared/ts/utils/focus-manager.ts");

class FocusTrap extends Shared_ts_utils_focus_manager__WEBPACK_IMPORTED_MODULE_0__["default"] {
  /**
   * Represents the current FocusTrap interface. It should be noted that one FocusTrap should be accessible where it's properties can be mapped to the active user-interface.
   */

  /**
   * Extends the base functionality of the FocusManager interface by providing support to enable/disable focus trap navigation.
   * @param root HTMLElement
   */
  constructor(root) {
    if (root === void 0) {
      root = document.querySelector("body");
    }
    super(root);
    FocusTrap.setRootBoundaries(this);
  }

  /**
   * Fetches the root boundary element by an id.
   * @param id string
   * @returns HTMLElement
   */
  static getRootBoundaryElement(id, context) {
    const root = this.getRoot(context);
    return root ? root.querySelector(`[data-root-boundary="${id}"]`) : null;
  }

  /**
   * Manages the focus event listeners based on a switch. The switch defaults to true meaning, the first and last focusable elements will add an event listener. Switching to false will remove the event listeners from the first and last focusable elements.
   * @param self FocusTrap
   * @param eventOn boolean
   */
  static manageFocusEvents(context, eventOn) {
    if (eventOn === void 0) {
      eventOn = true;
    }
    this.context = context;
    const first = this.getRootBoundaryElement("first", context);
    const last = this.getRootBoundaryElement("last", context);
    if (first && eventOn) {
      first.addEventListener("focus", this.handleFirstFocusEvent);
    }
    if (last && eventOn) {
      last.addEventListener("focus", this.handleLastFocusEvent);
    }
    if (first && !eventOn) {
      first.removeEventListener("focus", this.handleFirstFocusEvent);
    }
    if (last && !eventOn) {
      last.removeEventListener("focus", this.handleLastFocusEvent);
    }
  }

  /**
   * Signature event listener callback function that handles the first focusable element. This will set focus back to the last focusable element.
   * @param event FocusEvent
   */
  static handleFirstFocusEvent(event) {
    const focusElement = FocusTrap.context.lastElement();
    focusElement.focus();
  }

  /**
   * Signature event listener callback function that handles the last focusable element. This will set focus back to the first focusable element.
   * @param event FocusEvent
   */
  static handleLastFocusEvent(event) {
    const focusElement = FocusTrap.context.firstElement();
    focusElement.focus();
  }

  /**
   * Creates a tabindex boundary within the modal to manage focus trap.
   * @param root HTMLElement
   */
  static setRootBoundaries(context) {
    const root = FocusTrap.root.get(context);
    if (root) {
      root.insertAdjacentElement("afterbegin", this.createBoundaryElement("first"));
      root.insertAdjacentElement("beforeend", this.createBoundaryElement("last"));
    }
  }

  /**
   * Creates a new focusable element that can be provided to Modal.setRootBoundaries.
   * @returns HTMLElement
   */
  static createBoundaryElement(id) {
    if (id === void 0) {
      id = "";
    }
    const element = document.createElement("div");
    element.setAttribute("data-root-boundary", id);
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("tabindex", "0");
    return element;
  }

  /**
   * Enables support for focus trap navigation between the first and last focusable elements.
   */
  on() {
    FocusTrap.manageFocusEvents(this, true);
  }

  /**
   * Disables support for focus trap navigation between the first and last focusable elements.
   */
  off() {
    FocusTrap.manageFocusEvents(this, false);
  }
}
FocusTrap.context = void 0;

/***/ }),

/***/ "../shared/ts/utils/html.ts":
/*!**********************************!*\
  !*** ../shared/ts/utils/html.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "elementExists": function() { return /* binding */ elementExists; }
/* harmony export */ });
/* unused harmony exports createElement, setElementAttributes, renderTemplate, convertFragmentToHTMLElement, appendElement, enumerateElements, getJSONByElementAttribute */
/* harmony import */ var Shared_ts_utils_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Shared/ts/utils/data */ "../shared/ts/utils/data.ts");

const div = document.createElement("div");

/**
 * createElement takes a string tag name along with an optional object of attributes and returns a new HTMLElement.
 * @param tag string
 * @param attributes object
 * @return HTMLElement
 */
const createElement = (tag, attributes) => {
  const element = document.createElement(tag);
  return setElementAttributes(element, attributes);
};

/**
 * Takes an object representing an attribute key-value pair and assigns it to an HTMLElement. The HTMLElement will be returned.
 * @param element HTMLElement
 * @param attributes T
 * @returns HTMLElement
 */
const setElementAttributes = (element, attributes) => {
  if (attributes && Shared_ts_utils_data__WEBPACK_IMPORTED_MODULE_0__.isObject(attributes)) {
    Object.keys(attributes).forEach(attribute => {
      element.setAttribute(attribute, attributes[attribute]);
    });
  }
  return element;
};

/**
 * Takes a string representing an HTML template and converts it into a document fragment. The document fragment is returned.
 * @param template string
 * @returns DocumentFragment
 */
const renderTemplate = template => {
  const range = document.createRange();
  return range.createContextualFragment(template);
};

/**
 * Takes a document fragment and converts it into an HTML element. The Element is returned.
 * @param fragment DocumentFragment
 * @returns Element | null
 */
const convertFragmentToHTMLElement = fragment => {
  div.appendChild(fragment);
  return div.lastElementChild;
};

/**
 * appendElement takes an HTMLElement and appends it to the document body. The same element is then returned.
 * @param element HTMLElement
 * @return HTMLElement
 */
const appendElement = element => {
  document.body.appendChild(element);
  return element;
};

/**
 * elementExists takes an HTMLItem and will return true if the item exists either in the document body or in the document head.
 * @param element HTMLItem
 * @return boolean
 */
const elementExists = element => {
  return document.body.contains(element) || document.head.contains(element);
};

/**
 * enumerateElements takes an HTMLList and returns an element array.
 * @param elements HTMLList
 * @return Element[]
 */
const enumerateElements = elements => {
  let ar = [].slice.call(elements);
  return ar;
};

/**
 * Attempts to convert a JSON string value of an HTML attribute into JSON format.
 * @param element Element | null
 * @param attribute string
 * @returns JSON object
 */
const getJSONByElementAttribute = (element, attribute) => {
  let json = {};
  if (!element || !attribute) return json;
  try {
    const value = element.getAttribute(attribute);
    json = value !== null ? JSON.parse(value) : json;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.debug(message);
  }
  return json;
};

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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!*******************!*\
  !*** ./js/app.ts ***!
  \*******************/
/* harmony import */ var Shared_ts_utils_focus_trap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Shared/ts/utils/focus-trap */ "../shared/ts/utils/focus-trap.ts");

var ft = new Shared_ts_utils_focus_trap__WEBPACK_IMPORTED_MODULE_0__["default"]();
console.log(ft);

}();
/******/ })()
;
//# sourceMappingURL=app.es5.js.map