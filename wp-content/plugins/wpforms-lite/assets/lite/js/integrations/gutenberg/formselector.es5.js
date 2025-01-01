(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],3:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
  var loggedTypeFailures = {};
  var has = require('./lib/has');

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;

}).call(this,require("hmr7eR"))
},{"./lib/ReactPropTypesSecret":7,"./lib/has":8,"hmr7eR":1}],4:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./lib/ReactPropTypesSecret":7}],5:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactIs = require('react-is');
var assign = require('object-assign');

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
var has = require('./lib/has');
var checkPropTypes = require('./checkPropTypes');

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data: {};
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
          {expectedType: expectedType}
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError(
      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
    );
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

}).call(this,require("hmr7eR"))
},{"./checkPropTypes":3,"./lib/ReactPropTypesSecret":7,"./lib/has":8,"hmr7eR":1,"object-assign":2,"react-is":11}],6:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var ReactIs = require('react-is');

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}

}).call(this,require("hmr7eR"))
},{"./factoryWithThrowingShims":4,"./factoryWithTypeCheckers":5,"hmr7eR":1,"react-is":11}],7:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],8:[function(require,module,exports){
module.exports = Function.call.bind(Object.prototype.hasOwnProperty);

},{}],9:[function(require,module,exports){
(function (process){
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';



if (process.env.NODE_ENV !== "production") {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}

}).call(this,require("hmr7eR"))
},{"hmr7eR":1}],10:[function(require,module,exports){
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;
exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;exports.isAsyncMode=function(a){return A(a)||z(a)===l};exports.isConcurrentMode=A;exports.isContextConsumer=function(a){return z(a)===k};exports.isContextProvider=function(a){return z(a)===h};exports.isElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return z(a)===n};exports.isFragment=function(a){return z(a)===e};exports.isLazy=function(a){return z(a)===t};
exports.isMemo=function(a){return z(a)===r};exports.isPortal=function(a){return z(a)===d};exports.isProfiler=function(a){return z(a)===g};exports.isStrictMode=function(a){return z(a)===f};exports.isSuspense=function(a){return z(a)===p};
exports.isValidElementType=function(a){return"string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};exports.typeOf=z;

},{}],11:[function(require,module,exports){
(function (process){
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-is.production.min.js');
} else {
  module.exports = require('./cjs/react-is.development.js');
}

}).call(this,require("hmr7eR"))
},{"./cjs/react-is.development.js":9,"./cjs/react-is.production.min.js":10,"hmr7eR":1}],12:[function(require,module,exports){
"use strict";

var _education = _interopRequireDefault(require("../../../js/integrations/gutenberg/modules/education.js"));
var _common = _interopRequireDefault(require("../../../js/integrations/gutenberg/modules/common.js"));
var _themesPanel = _interopRequireDefault(require("../../../js/integrations/gutenberg/modules/themes-panel.js"));
var _containerStyles = _interopRequireDefault(require("../../../js/integrations/gutenberg/modules/container-styles.js"));
var _backgroundStyles = _interopRequireDefault(require("../../../js/integrations/gutenberg/modules/background-styles.js"));
var _buttonStyles = _interopRequireDefault(require("../../../js/integrations/gutenberg/modules/button-styles.js"));
var _advancedSettings = _interopRequireDefault(require("../../../js/integrations/gutenberg/modules/advanced-settings.js"));
var _fieldStyles = _interopRequireDefault(require("../../../js/integrations/gutenberg/modules/field-styles.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* jshint es3: false, esversion: 6 */
/**
 * Gutenberg editor block for Lite.
 *
 * @since 1.8.8
 */
var WPForms = window.WPForms || {};
WPForms.FormSelector = WPForms.FormSelector || function () {
  /**
   * Public functions and properties.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var app = {
    /**
     * Common module object.
     *
     * @since 1.8.8
     *
     * @type {Object}
     */
    common: {},
    /**
     * Panel modules objects.
     *
     * @since 1.8.8
     *
     * @type {Object}
     */
    panels: {},
    /**
     * Start the engine.
     *
     * @since 1.8.8
     */
    init: function init() {
      app.education = _education.default;
      app.common = _common.default;
      app.panels.themes = _themesPanel.default;
      app.panels.container = _containerStyles.default;
      app.panels.background = _backgroundStyles.default;
      app.panels.button = _buttonStyles.default;
      app.panels.advanced = _advancedSettings.default;
      app.panels.field = _fieldStyles.default;
      var blockOptions = {
        panels: app.panels,
        getThemesPanel: app.panels.themes.getThemesPanel,
        getFieldStyles: app.panels.field.getFieldStyles,
        getContainerStyles: app.panels.container.getContainerStyles,
        getBackgroundStyles: app.panels.background.getBackgroundStyles,
        getButtonStyles: app.panels.button.getButtonStyles,
        getCommonAttributes: app.getCommonAttributes,
        setStylesHandlers: app.getStyleHandlers(),
        education: app.education
      };

      // Initialize Advanced Settings module.
      app.panels.advanced.init(app.common);

      // Initialize block.
      app.common.init(blockOptions);
    },
    /**
     * Get style handlers.
     *
     * @since 1.8.8
     *
     * @return {Object} Style handlers.
     */
    getCommonAttributes: function getCommonAttributes() {
      return _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, app.panels.field.getBlockAttributes()), app.panels.container.getBlockAttributes()), app.panels.background.getBlockAttributes()), app.panels.button.getBlockAttributes());
    },
    /**
     * Get style handlers.
     *
     * @since 1.8.8
     *
     * @return {Object} Style handlers.
     */
    getStyleHandlers: function getStyleHandlers() {
      return {
        'background-image': app.panels.background.setContainerBackgroundImage,
        'background-position': app.panels.background.setContainerBackgroundPosition,
        'background-repeat': app.panels.background.setContainerBackgroundRepeat,
        'background-width': app.panels.background.setContainerBackgroundWidth,
        'background-height': app.panels.background.setContainerBackgroundHeight,
        'background-color': app.panels.background.setBackgroundColor,
        'background-url': app.panels.background.setBackgroundUrl
      };
    }
  };

  // Provide access to public functions/properties.
  return app;
}();

// Initialize.
WPForms.FormSelector.init();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZWR1Y2F0aW9uIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfY29tbW9uIiwiX3RoZW1lc1BhbmVsIiwiX2NvbnRhaW5lclN0eWxlcyIsIl9iYWNrZ3JvdW5kU3R5bGVzIiwiX2J1dHRvblN0eWxlcyIsIl9hZHZhbmNlZFNldHRpbmdzIiwiX2ZpZWxkU3R5bGVzIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfdHlwZW9mIiwibyIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJvd25LZXlzIiwiZSIsInIiLCJ0IiwiT2JqZWN0Iiwia2V5cyIsImdldE93blByb3BlcnR5U3ltYm9scyIsImZpbHRlciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJpIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwidG9QcmltaXRpdmUiLCJjYWxsIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiV1BGb3JtcyIsIndpbmRvdyIsIkZvcm1TZWxlY3RvciIsImFwcCIsImNvbW1vbiIsInBhbmVscyIsImluaXQiLCJlZHVjYXRpb24iLCJ0aGVtZXMiLCJ0aGVtZXNQYW5lbCIsImNvbnRhaW5lciIsImNvbnRhaW5lclN0eWxlcyIsImJhY2tncm91bmQiLCJiYWNrZ3JvdW5kU3R5bGVzIiwiYnV0dG9uIiwiYnV0dG9uU3R5bGVzIiwiYWR2YW5jZWQiLCJhZHZhbmNlZFNldHRpbmdzIiwiZmllbGQiLCJmaWVsZFN0eWxlcyIsImJsb2NrT3B0aW9ucyIsImdldFRoZW1lc1BhbmVsIiwiZ2V0RmllbGRTdHlsZXMiLCJnZXRDb250YWluZXJTdHlsZXMiLCJnZXRCYWNrZ3JvdW5kU3R5bGVzIiwiZ2V0QnV0dG9uU3R5bGVzIiwiZ2V0Q29tbW9uQXR0cmlidXRlcyIsInNldFN0eWxlc0hhbmRsZXJzIiwiZ2V0U3R5bGVIYW5kbGVycyIsImdldEJsb2NrQXR0cmlidXRlcyIsInNldENvbnRhaW5lckJhY2tncm91bmRJbWFnZSIsInNldENvbnRhaW5lckJhY2tncm91bmRQb3NpdGlvbiIsInNldENvbnRhaW5lckJhY2tncm91bmRSZXBlYXQiLCJzZXRDb250YWluZXJCYWNrZ3JvdW5kV2lkdGgiLCJzZXRDb250YWluZXJCYWNrZ3JvdW5kSGVpZ2h0Iiwic2V0QmFja2dyb3VuZENvbG9yIiwic2V0QmFja2dyb3VuZFVybCJdLCJzb3VyY2VzIjpbImZha2VfY2ZiMzZlYTYuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoganNoaW50IGVzMzogZmFsc2UsIGVzdmVyc2lvbjogNiAqL1xuXG5pbXBvcnQgZWR1Y2F0aW9uIGZyb20gJy4uLy4uLy4uL2pzL2ludGVncmF0aW9ucy9ndXRlbmJlcmcvbW9kdWxlcy9lZHVjYXRpb24uanMnO1xuaW1wb3J0IGNvbW1vbiBmcm9tICcuLi8uLi8uLi9qcy9pbnRlZ3JhdGlvbnMvZ3V0ZW5iZXJnL21vZHVsZXMvY29tbW9uLmpzJztcbmltcG9ydCB0aGVtZXNQYW5lbCBmcm9tICcuLi8uLi8uLi9qcy9pbnRlZ3JhdGlvbnMvZ3V0ZW5iZXJnL21vZHVsZXMvdGhlbWVzLXBhbmVsLmpzJztcbmltcG9ydCBjb250YWluZXJTdHlsZXMgZnJvbSAnLi4vLi4vLi4vanMvaW50ZWdyYXRpb25zL2d1dGVuYmVyZy9tb2R1bGVzL2NvbnRhaW5lci1zdHlsZXMuanMnO1xuaW1wb3J0IGJhY2tncm91bmRTdHlsZXMgZnJvbSAnLi4vLi4vLi4vanMvaW50ZWdyYXRpb25zL2d1dGVuYmVyZy9tb2R1bGVzL2JhY2tncm91bmQtc3R5bGVzLmpzJztcbmltcG9ydCBidXR0b25TdHlsZXMgZnJvbSAnLi4vLi4vLi4vanMvaW50ZWdyYXRpb25zL2d1dGVuYmVyZy9tb2R1bGVzL2J1dHRvbi1zdHlsZXMuanMnO1xuaW1wb3J0IGFkdmFuY2VkU2V0dGluZ3MgZnJvbSAnLi4vLi4vLi4vanMvaW50ZWdyYXRpb25zL2d1dGVuYmVyZy9tb2R1bGVzL2FkdmFuY2VkLXNldHRpbmdzLmpzJztcbmltcG9ydCBmaWVsZFN0eWxlcyBmcm9tICcuLi8uLi8uLi9qcy9pbnRlZ3JhdGlvbnMvZ3V0ZW5iZXJnL21vZHVsZXMvZmllbGQtc3R5bGVzLmpzJztcblxuLyoqXG4gKiBHdXRlbmJlcmcgZWRpdG9yIGJsb2NrIGZvciBMaXRlLlxuICpcbiAqIEBzaW5jZSAxLjguOFxuICovXG5jb25zdCBXUEZvcm1zID0gd2luZG93LldQRm9ybXMgfHwge307XG5cbldQRm9ybXMuRm9ybVNlbGVjdG9yID0gV1BGb3Jtcy5Gb3JtU2VsZWN0b3IgfHwgKCBmdW5jdGlvbigpIHtcblx0LyoqXG5cdCAqIFB1YmxpYyBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjguOFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0Y29uc3QgYXBwID0ge1xuXHRcdC8qKlxuXHRcdCAqIENvbW1vbiBtb2R1bGUgb2JqZWN0LlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdGNvbW1vbjoge30sXG5cblx0XHQvKipcblx0XHQgKiBQYW5lbCBtb2R1bGVzIG9iamVjdHMuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0cGFuZWxzOiB7fSxcblxuXHRcdC8qKlxuXHRcdCAqIFN0YXJ0IHRoZSBlbmdpbmUuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKi9cblx0XHRpbml0KCkge1xuXHRcdFx0YXBwLmVkdWNhdGlvbiA9IGVkdWNhdGlvbjtcblx0XHRcdGFwcC5jb21tb24gPSBjb21tb247XG5cdFx0XHRhcHAucGFuZWxzLnRoZW1lcyA9IHRoZW1lc1BhbmVsO1xuXHRcdFx0YXBwLnBhbmVscy5jb250YWluZXIgPSBjb250YWluZXJTdHlsZXM7XG5cdFx0XHRhcHAucGFuZWxzLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kU3R5bGVzO1xuXHRcdFx0YXBwLnBhbmVscy5idXR0b24gPSBidXR0b25TdHlsZXM7XG5cdFx0XHRhcHAucGFuZWxzLmFkdmFuY2VkID0gYWR2YW5jZWRTZXR0aW5ncztcblx0XHRcdGFwcC5wYW5lbHMuZmllbGQgPSBmaWVsZFN0eWxlcztcblxuXHRcdFx0Y29uc3QgYmxvY2tPcHRpb25zID0ge1xuXHRcdFx0XHRwYW5lbHM6IGFwcC5wYW5lbHMsXG5cdFx0XHRcdGdldFRoZW1lc1BhbmVsOiBhcHAucGFuZWxzLnRoZW1lcy5nZXRUaGVtZXNQYW5lbCxcblx0XHRcdFx0Z2V0RmllbGRTdHlsZXM6IGFwcC5wYW5lbHMuZmllbGQuZ2V0RmllbGRTdHlsZXMsXG5cdFx0XHRcdGdldENvbnRhaW5lclN0eWxlczogYXBwLnBhbmVscy5jb250YWluZXIuZ2V0Q29udGFpbmVyU3R5bGVzLFxuXHRcdFx0XHRnZXRCYWNrZ3JvdW5kU3R5bGVzOiBhcHAucGFuZWxzLmJhY2tncm91bmQuZ2V0QmFja2dyb3VuZFN0eWxlcyxcblx0XHRcdFx0Z2V0QnV0dG9uU3R5bGVzOiBhcHAucGFuZWxzLmJ1dHRvbi5nZXRCdXR0b25TdHlsZXMsXG5cdFx0XHRcdGdldENvbW1vbkF0dHJpYnV0ZXM6IGFwcC5nZXRDb21tb25BdHRyaWJ1dGVzLFxuXHRcdFx0XHRzZXRTdHlsZXNIYW5kbGVyczogYXBwLmdldFN0eWxlSGFuZGxlcnMoKSxcblx0XHRcdFx0ZWR1Y2F0aW9uOiBhcHAuZWR1Y2F0aW9uLFxuXHRcdFx0fTtcblxuXHRcdFx0Ly8gSW5pdGlhbGl6ZSBBZHZhbmNlZCBTZXR0aW5ncyBtb2R1bGUuXG5cdFx0XHRhcHAucGFuZWxzLmFkdmFuY2VkLmluaXQoIGFwcC5jb21tb24gKTtcblxuXHRcdFx0Ly8gSW5pdGlhbGl6ZSBibG9jay5cblx0XHRcdGFwcC5jb21tb24uaW5pdCggYmxvY2tPcHRpb25zICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdldCBzdHlsZSBoYW5kbGVycy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fSBTdHlsZSBoYW5kbGVycy5cblx0XHQgKi9cblx0XHRnZXRDb21tb25BdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Li4uYXBwLnBhbmVscy5maWVsZC5nZXRCbG9ja0F0dHJpYnV0ZXMoKSxcblx0XHRcdFx0Li4uYXBwLnBhbmVscy5jb250YWluZXIuZ2V0QmxvY2tBdHRyaWJ1dGVzKCksXG5cdFx0XHRcdC4uLmFwcC5wYW5lbHMuYmFja2dyb3VuZC5nZXRCbG9ja0F0dHJpYnV0ZXMoKSxcblx0XHRcdFx0Li4uYXBwLnBhbmVscy5idXR0b24uZ2V0QmxvY2tBdHRyaWJ1dGVzKCksXG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgc3R5bGUgaGFuZGxlcnMuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge09iamVjdH0gU3R5bGUgaGFuZGxlcnMuXG5cdFx0ICovXG5cdFx0Z2V0U3R5bGVIYW5kbGVycygpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdCdiYWNrZ3JvdW5kLWltYWdlJzogYXBwLnBhbmVscy5iYWNrZ3JvdW5kLnNldENvbnRhaW5lckJhY2tncm91bmRJbWFnZSxcblx0XHRcdFx0J2JhY2tncm91bmQtcG9zaXRpb24nOiBhcHAucGFuZWxzLmJhY2tncm91bmQuc2V0Q29udGFpbmVyQmFja2dyb3VuZFBvc2l0aW9uLFxuXHRcdFx0XHQnYmFja2dyb3VuZC1yZXBlYXQnOiBhcHAucGFuZWxzLmJhY2tncm91bmQuc2V0Q29udGFpbmVyQmFja2dyb3VuZFJlcGVhdCxcblx0XHRcdFx0J2JhY2tncm91bmQtd2lkdGgnOiBhcHAucGFuZWxzLmJhY2tncm91bmQuc2V0Q29udGFpbmVyQmFja2dyb3VuZFdpZHRoLFxuXHRcdFx0XHQnYmFja2dyb3VuZC1oZWlnaHQnOiBhcHAucGFuZWxzLmJhY2tncm91bmQuc2V0Q29udGFpbmVyQmFja2dyb3VuZEhlaWdodCxcblx0XHRcdFx0J2JhY2tncm91bmQtY29sb3InOiBhcHAucGFuZWxzLmJhY2tncm91bmQuc2V0QmFja2dyb3VuZENvbG9yLFxuXHRcdFx0XHQnYmFja2dyb3VuZC11cmwnOiBhcHAucGFuZWxzLmJhY2tncm91bmQuc2V0QmFja2dyb3VuZFVybCxcblx0XHRcdH07XG5cdFx0fSxcblx0fTtcblxuXHQvLyBQcm92aWRlIGFjY2VzcyB0byBwdWJsaWMgZnVuY3Rpb25zL3Byb3BlcnRpZXMuXG5cdHJldHVybiBhcHA7XG59KCkgKTtcblxuLy8gSW5pdGlhbGl6ZS5cbldQRm9ybXMuRm9ybVNlbGVjdG9yLmluaXQoKTtcbiJdLCJtYXBwaW5ncyI6Ijs7QUFFQSxJQUFBQSxVQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxPQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRSxZQUFBLEdBQUFILHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRyxnQkFBQSxHQUFBSixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUksaUJBQUEsR0FBQUwsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFLLGFBQUEsR0FBQU4sc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFNLGlCQUFBLEdBQUFQLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBTyxZQUFBLEdBQUFSLHNCQUFBLENBQUFDLE9BQUE7QUFBcUYsU0FBQUQsdUJBQUFTLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFBQSxTQUFBRyxRQUFBQyxDQUFBLHNDQUFBRCxPQUFBLHdCQUFBRSxNQUFBLHVCQUFBQSxNQUFBLENBQUFDLFFBQUEsYUFBQUYsQ0FBQSxrQkFBQUEsQ0FBQSxnQkFBQUEsQ0FBQSxXQUFBQSxDQUFBLHlCQUFBQyxNQUFBLElBQUFELENBQUEsQ0FBQUcsV0FBQSxLQUFBRixNQUFBLElBQUFELENBQUEsS0FBQUMsTUFBQSxDQUFBRyxTQUFBLHFCQUFBSixDQUFBLEtBQUFELE9BQUEsQ0FBQUMsQ0FBQTtBQUFBLFNBQUFLLFFBQUFDLENBQUEsRUFBQUMsQ0FBQSxRQUFBQyxDQUFBLEdBQUFDLE1BQUEsQ0FBQUMsSUFBQSxDQUFBSixDQUFBLE9BQUFHLE1BQUEsQ0FBQUUscUJBQUEsUUFBQVgsQ0FBQSxHQUFBUyxNQUFBLENBQUFFLHFCQUFBLENBQUFMLENBQUEsR0FBQUMsQ0FBQSxLQUFBUCxDQUFBLEdBQUFBLENBQUEsQ0FBQVksTUFBQSxXQUFBTCxDQUFBLFdBQUFFLE1BQUEsQ0FBQUksd0JBQUEsQ0FBQVAsQ0FBQSxFQUFBQyxDQUFBLEVBQUFPLFVBQUEsT0FBQU4sQ0FBQSxDQUFBTyxJQUFBLENBQUFDLEtBQUEsQ0FBQVIsQ0FBQSxFQUFBUixDQUFBLFlBQUFRLENBQUE7QUFBQSxTQUFBUyxjQUFBWCxDQUFBLGFBQUFDLENBQUEsTUFBQUEsQ0FBQSxHQUFBVyxTQUFBLENBQUFDLE1BQUEsRUFBQVosQ0FBQSxVQUFBQyxDQUFBLFdBQUFVLFNBQUEsQ0FBQVgsQ0FBQSxJQUFBVyxTQUFBLENBQUFYLENBQUEsUUFBQUEsQ0FBQSxPQUFBRixPQUFBLENBQUFJLE1BQUEsQ0FBQUQsQ0FBQSxPQUFBWSxPQUFBLFdBQUFiLENBQUEsSUFBQWMsZUFBQSxDQUFBZixDQUFBLEVBQUFDLENBQUEsRUFBQUMsQ0FBQSxDQUFBRCxDQUFBLFNBQUFFLE1BQUEsQ0FBQWEseUJBQUEsR0FBQWIsTUFBQSxDQUFBYyxnQkFBQSxDQUFBakIsQ0FBQSxFQUFBRyxNQUFBLENBQUFhLHlCQUFBLENBQUFkLENBQUEsS0FBQUgsT0FBQSxDQUFBSSxNQUFBLENBQUFELENBQUEsR0FBQVksT0FBQSxXQUFBYixDQUFBLElBQUFFLE1BQUEsQ0FBQWUsY0FBQSxDQUFBbEIsQ0FBQSxFQUFBQyxDQUFBLEVBQUFFLE1BQUEsQ0FBQUksd0JBQUEsQ0FBQUwsQ0FBQSxFQUFBRCxDQUFBLGlCQUFBRCxDQUFBO0FBQUEsU0FBQWUsZ0JBQUF6QixHQUFBLEVBQUE2QixHQUFBLEVBQUFDLEtBQUEsSUFBQUQsR0FBQSxHQUFBRSxjQUFBLENBQUFGLEdBQUEsT0FBQUEsR0FBQSxJQUFBN0IsR0FBQSxJQUFBYSxNQUFBLENBQUFlLGNBQUEsQ0FBQTVCLEdBQUEsRUFBQTZCLEdBQUEsSUFBQUMsS0FBQSxFQUFBQSxLQUFBLEVBQUFaLFVBQUEsUUFBQWMsWUFBQSxRQUFBQyxRQUFBLG9CQUFBakMsR0FBQSxDQUFBNkIsR0FBQSxJQUFBQyxLQUFBLFdBQUE5QixHQUFBO0FBQUEsU0FBQStCLGVBQUFuQixDQUFBLFFBQUFzQixDQUFBLEdBQUFDLFlBQUEsQ0FBQXZCLENBQUEsZ0NBQUFULE9BQUEsQ0FBQStCLENBQUEsSUFBQUEsQ0FBQSxHQUFBRSxNQUFBLENBQUFGLENBQUE7QUFBQSxTQUFBQyxhQUFBdkIsQ0FBQSxFQUFBRCxDQUFBLG9CQUFBUixPQUFBLENBQUFTLENBQUEsTUFBQUEsQ0FBQSxTQUFBQSxDQUFBLE1BQUFGLENBQUEsR0FBQUUsQ0FBQSxDQUFBUCxNQUFBLENBQUFnQyxXQUFBLGtCQUFBM0IsQ0FBQSxRQUFBd0IsQ0FBQSxHQUFBeEIsQ0FBQSxDQUFBNEIsSUFBQSxDQUFBMUIsQ0FBQSxFQUFBRCxDQUFBLGdDQUFBUixPQUFBLENBQUErQixDQUFBLFVBQUFBLENBQUEsWUFBQUssU0FBQSx5RUFBQTVCLENBQUEsR0FBQXlCLE1BQUEsR0FBQUksTUFBQSxFQUFBNUIsQ0FBQSxLQVRyRjtBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNNkIsT0FBTyxHQUFHQyxNQUFNLENBQUNELE9BQU8sSUFBSSxDQUFDLENBQUM7QUFFcENBLE9BQU8sQ0FBQ0UsWUFBWSxHQUFHRixPQUFPLENBQUNFLFlBQVksSUFBTSxZQUFXO0VBQzNEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0MsSUFBTUMsR0FBRyxHQUFHO0lBQ1g7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDRUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUVWO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ0VDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFFVjtBQUNGO0FBQ0E7QUFDQTtBQUNBO0lBQ0VDLElBQUksV0FBQUEsS0FBQSxFQUFHO01BQ05ILEdBQUcsQ0FBQ0ksU0FBUyxHQUFHQSxrQkFBUztNQUN6QkosR0FBRyxDQUFDQyxNQUFNLEdBQUdBLGVBQU07TUFDbkJELEdBQUcsQ0FBQ0UsTUFBTSxDQUFDRyxNQUFNLEdBQUdDLG9CQUFXO01BQy9CTixHQUFHLENBQUNFLE1BQU0sQ0FBQ0ssU0FBUyxHQUFHQyx3QkFBZTtNQUN0Q1IsR0FBRyxDQUFDRSxNQUFNLENBQUNPLFVBQVUsR0FBR0MseUJBQWdCO01BQ3hDVixHQUFHLENBQUNFLE1BQU0sQ0FBQ1MsTUFBTSxHQUFHQyxxQkFBWTtNQUNoQ1osR0FBRyxDQUFDRSxNQUFNLENBQUNXLFFBQVEsR0FBR0MseUJBQWdCO01BQ3RDZCxHQUFHLENBQUNFLE1BQU0sQ0FBQ2EsS0FBSyxHQUFHQyxvQkFBVztNQUU5QixJQUFNQyxZQUFZLEdBQUc7UUFDcEJmLE1BQU0sRUFBRUYsR0FBRyxDQUFDRSxNQUFNO1FBQ2xCZ0IsY0FBYyxFQUFFbEIsR0FBRyxDQUFDRSxNQUFNLENBQUNHLE1BQU0sQ0FBQ2EsY0FBYztRQUNoREMsY0FBYyxFQUFFbkIsR0FBRyxDQUFDRSxNQUFNLENBQUNhLEtBQUssQ0FBQ0ksY0FBYztRQUMvQ0Msa0JBQWtCLEVBQUVwQixHQUFHLENBQUNFLE1BQU0sQ0FBQ0ssU0FBUyxDQUFDYSxrQkFBa0I7UUFDM0RDLG1CQUFtQixFQUFFckIsR0FBRyxDQUFDRSxNQUFNLENBQUNPLFVBQVUsQ0FBQ1ksbUJBQW1CO1FBQzlEQyxlQUFlLEVBQUV0QixHQUFHLENBQUNFLE1BQU0sQ0FBQ1MsTUFBTSxDQUFDVyxlQUFlO1FBQ2xEQyxtQkFBbUIsRUFBRXZCLEdBQUcsQ0FBQ3VCLG1CQUFtQjtRQUM1Q0MsaUJBQWlCLEVBQUV4QixHQUFHLENBQUN5QixnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3pDckIsU0FBUyxFQUFFSixHQUFHLENBQUNJO01BQ2hCLENBQUM7O01BRUQ7TUFDQUosR0FBRyxDQUFDRSxNQUFNLENBQUNXLFFBQVEsQ0FBQ1YsSUFBSSxDQUFFSCxHQUFHLENBQUNDLE1BQU8sQ0FBQzs7TUFFdEM7TUFDQUQsR0FBRyxDQUFDQyxNQUFNLENBQUNFLElBQUksQ0FBRWMsWUFBYSxDQUFDO0lBQ2hDLENBQUM7SUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNFTSxtQkFBbUIsV0FBQUEsb0JBQUEsRUFBRztNQUNyQixPQUFBOUMsYUFBQSxDQUFBQSxhQUFBLENBQUFBLGFBQUEsQ0FBQUEsYUFBQSxLQUNJdUIsR0FBRyxDQUFDRSxNQUFNLENBQUNhLEtBQUssQ0FBQ1csa0JBQWtCLENBQUMsQ0FBQyxHQUNyQzFCLEdBQUcsQ0FBQ0UsTUFBTSxDQUFDSyxTQUFTLENBQUNtQixrQkFBa0IsQ0FBQyxDQUFDLEdBQ3pDMUIsR0FBRyxDQUFDRSxNQUFNLENBQUNPLFVBQVUsQ0FBQ2lCLGtCQUFrQixDQUFDLENBQUMsR0FDMUMxQixHQUFHLENBQUNFLE1BQU0sQ0FBQ1MsTUFBTSxDQUFDZSxrQkFBa0IsQ0FBQyxDQUFDO0lBRTNDLENBQUM7SUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNFRCxnQkFBZ0IsV0FBQUEsaUJBQUEsRUFBRztNQUNsQixPQUFPO1FBQ04sa0JBQWtCLEVBQUV6QixHQUFHLENBQUNFLE1BQU0sQ0FBQ08sVUFBVSxDQUFDa0IsMkJBQTJCO1FBQ3JFLHFCQUFxQixFQUFFM0IsR0FBRyxDQUFDRSxNQUFNLENBQUNPLFVBQVUsQ0FBQ21CLDhCQUE4QjtRQUMzRSxtQkFBbUIsRUFBRTVCLEdBQUcsQ0FBQ0UsTUFBTSxDQUFDTyxVQUFVLENBQUNvQiw0QkFBNEI7UUFDdkUsa0JBQWtCLEVBQUU3QixHQUFHLENBQUNFLE1BQU0sQ0FBQ08sVUFBVSxDQUFDcUIsMkJBQTJCO1FBQ3JFLG1CQUFtQixFQUFFOUIsR0FBRyxDQUFDRSxNQUFNLENBQUNPLFVBQVUsQ0FBQ3NCLDRCQUE0QjtRQUN2RSxrQkFBa0IsRUFBRS9CLEdBQUcsQ0FBQ0UsTUFBTSxDQUFDTyxVQUFVLENBQUN1QixrQkFBa0I7UUFDNUQsZ0JBQWdCLEVBQUVoQyxHQUFHLENBQUNFLE1BQU0sQ0FBQ08sVUFBVSxDQUFDd0I7TUFDekMsQ0FBQztJQUNGO0VBQ0QsQ0FBQzs7RUFFRDtFQUNBLE9BQU9qQyxHQUFHO0FBQ1gsQ0FBQyxDQUFDLENBQUc7O0FBRUw7QUFDQUgsT0FBTyxDQUFDRSxZQUFZLENBQUNJLElBQUksQ0FBQyxDQUFDIn0=
},{"../../../js/integrations/gutenberg/modules/advanced-settings.js":13,"../../../js/integrations/gutenberg/modules/background-styles.js":15,"../../../js/integrations/gutenberg/modules/button-styles.js":16,"../../../js/integrations/gutenberg/modules/common.js":17,"../../../js/integrations/gutenberg/modules/container-styles.js":18,"../../../js/integrations/gutenberg/modules/education.js":19,"../../../js/integrations/gutenberg/modules/field-styles.js":20,"../../../js/integrations/gutenberg/modules/themes-panel.js":21}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/* global wpforms_gutenberg_form_selector */
/* jshint es3: false, esversion: 6 */
/**
 * @param strings.custom_css
 * @param strings.custom_css_notice
 * @param strings.copy_paste_settings
 * @param strings.copy_paste_notice
 */
/**
 * Gutenberg editor block.
 *
 * Advanced Settings module.
 *
 * @since 1.8.8
 */
var _default = exports.default = function ($) {
  /**
   * WP core components.
   *
   * @since 1.8.8
   */
  var addFilter = wp.hooks.addFilter;
  var createHigherOrderComponent = wp.compose.createHigherOrderComponent;
  var Fragment = wp.element.Fragment;
  var _ref = wp.blockEditor || wp.editor,
    InspectorAdvancedControls = _ref.InspectorAdvancedControls;
  var TextareaControl = wp.components.TextareaControl;

  /**
   * Localized data aliases.
   *
   * @since 1.8.8
   */
  var _wpforms_gutenberg_fo = wpforms_gutenberg_form_selector,
    strings = _wpforms_gutenberg_fo.strings;

  /**
   * Public functions and properties.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var app = {
    /**
     * Initialize module.
     *
     * @since 1.8.8
     *
     * @param {Object} commonModule Common module.
     */
    init: function init(commonModule) {
      app.common = commonModule;
      app.hooks();
      app.events();
    },
    /**
     * Hooks.
     *
     * @since 1.8.8
     */
    hooks: function hooks() {
      addFilter('editor.BlockEdit', 'editorskit/custom-advanced-control', app.withAdvancedControls);
    },
    /**
     * Events.
     *
     * @since 1.8.8
     */
    events: function events() {
      $(document).on('focus click', 'textarea', app.copyPasteFocus);
    },
    /**
     * Copy / Paste Style Settings textarea focus event.
     *
     * @since 1.8.8
     */
    copyPasteFocus: function copyPasteFocus() {
      var $input = $(this);
      if ($input.siblings('label').text() === strings.copy_paste_settings) {
        // Select all text, so it's easier to copy and paste value.
        $input.select();
      }
    },
    /**
     * Get fields.
     *
     * @since 1.8.8
     *
     * @param {Object} props Block properties.
     *
     * @return {Object} Inspector advanced controls JSX code.
     */
    getFields: function getFields(props) {
      // Proceed only for WPForms block.
      if ((props === null || props === void 0 ? void 0 : props.name) !== 'wpforms/form-selector') {
        return null;
      }

      // Common event handlers.
      var handlers = app.common.getSettingsFieldsHandlers(props);
      return /*#__PURE__*/React.createElement(InspectorAdvancedControls, null, /*#__PURE__*/React.createElement("div", {
        className: app.common.getPanelClass(props) + ' advanced'
      }, /*#__PURE__*/React.createElement(TextareaControl, {
        className: "wpforms-gutenberg-form-selector-custom-css",
        label: strings.custom_css,
        rows: "5",
        spellCheck: "false",
        value: props.attributes.customCss,
        onChange: function onChange(value) {
          return handlers.attrChange('customCss', value);
        }
      }), /*#__PURE__*/React.createElement("div", {
        className: "wpforms-gutenberg-form-selector-legend",
        dangerouslySetInnerHTML: {
          __html: strings.custom_css_notice
        }
      }), /*#__PURE__*/React.createElement(TextareaControl, {
        className: "wpforms-gutenberg-form-selector-copy-paste-settings",
        label: strings.copy_paste_settings,
        rows: "4",
        spellCheck: "false",
        value: props.attributes.copyPasteJsonValue,
        onChange: function onChange(value) {
          return handlers.pasteSettings(value);
        }
      }), /*#__PURE__*/React.createElement("div", {
        className: "wpforms-gutenberg-form-selector-legend",
        dangerouslySetInnerHTML: {
          __html: strings.copy_paste_notice
        }
      })));
    },
    /**
     * Add controls on Advanced Settings Panel.
     *
     * @param {Function} BlockEdit Block edit component.
     *
     * @return {Function} BlockEdit Modified block edit component.
     */
    withAdvancedControls: createHigherOrderComponent(function (BlockEdit) {
      return function (props) {
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(BlockEdit, props), app.getFields(props));
      };
    }, 'withAdvancedControls')
  };

  // Provide access to public functions/properties.
  return app;
}(jQuery);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZGVmYXVsdCIsImV4cG9ydHMiLCJkZWZhdWx0IiwiJCIsImFkZEZpbHRlciIsIndwIiwiaG9va3MiLCJjcmVhdGVIaWdoZXJPcmRlckNvbXBvbmVudCIsImNvbXBvc2UiLCJGcmFnbWVudCIsImVsZW1lbnQiLCJfcmVmIiwiYmxvY2tFZGl0b3IiLCJlZGl0b3IiLCJJbnNwZWN0b3JBZHZhbmNlZENvbnRyb2xzIiwiVGV4dGFyZWFDb250cm9sIiwiY29tcG9uZW50cyIsIl93cGZvcm1zX2d1dGVuYmVyZ19mbyIsIndwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IiLCJzdHJpbmdzIiwiYXBwIiwiaW5pdCIsImNvbW1vbk1vZHVsZSIsImNvbW1vbiIsImV2ZW50cyIsIndpdGhBZHZhbmNlZENvbnRyb2xzIiwiZG9jdW1lbnQiLCJvbiIsImNvcHlQYXN0ZUZvY3VzIiwiJGlucHV0Iiwic2libGluZ3MiLCJ0ZXh0IiwiY29weV9wYXN0ZV9zZXR0aW5ncyIsInNlbGVjdCIsImdldEZpZWxkcyIsInByb3BzIiwibmFtZSIsImhhbmRsZXJzIiwiZ2V0U2V0dGluZ3NGaWVsZHNIYW5kbGVycyIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImdldFBhbmVsQ2xhc3MiLCJsYWJlbCIsImN1c3RvbV9jc3MiLCJyb3dzIiwic3BlbGxDaGVjayIsInZhbHVlIiwiYXR0cmlidXRlcyIsImN1c3RvbUNzcyIsIm9uQ2hhbmdlIiwiYXR0ckNoYW5nZSIsImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MIiwiX19odG1sIiwiY3VzdG9tX2Nzc19ub3RpY2UiLCJjb3B5UGFzdGVKc29uVmFsdWUiLCJwYXN0ZVNldHRpbmdzIiwiY29weV9wYXN0ZV9ub3RpY2UiLCJCbG9ja0VkaXQiLCJqUXVlcnkiXSwic291cmNlcyI6WyJhZHZhbmNlZC1zZXR0aW5ncy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvciAqL1xuLyoganNoaW50IGVzMzogZmFsc2UsIGVzdmVyc2lvbjogNiAqL1xuXG4vKipcbiAqIEBwYXJhbSBzdHJpbmdzLmN1c3RvbV9jc3NcbiAqIEBwYXJhbSBzdHJpbmdzLmN1c3RvbV9jc3Nfbm90aWNlXG4gKiBAcGFyYW0gc3RyaW5ncy5jb3B5X3Bhc3RlX3NldHRpbmdzXG4gKiBAcGFyYW0gc3RyaW5ncy5jb3B5X3Bhc3RlX25vdGljZVxuICovXG5cbi8qKlxuICogR3V0ZW5iZXJnIGVkaXRvciBibG9jay5cbiAqXG4gKiBBZHZhbmNlZCBTZXR0aW5ncyBtb2R1bGUuXG4gKlxuICogQHNpbmNlIDEuOC44XG4gKi9cbmV4cG9ydCBkZWZhdWx0ICggZnVuY3Rpb24oICQgKSB7XG5cdC8qKlxuXHQgKiBXUCBjb3JlIGNvbXBvbmVudHMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjguOFxuXHQgKi9cblx0Y29uc3QgeyBhZGRGaWx0ZXIgfSA9IHdwLmhvb2tzO1xuXHRjb25zdCB7IGNyZWF0ZUhpZ2hlck9yZGVyQ29tcG9uZW50IH0gPSB3cC5jb21wb3NlO1xuXHRjb25zdCB7IEZyYWdtZW50IH1cdD0gd3AuZWxlbWVudDtcblx0Y29uc3QgeyBJbnNwZWN0b3JBZHZhbmNlZENvbnRyb2xzIH0gPSB3cC5ibG9ja0VkaXRvciB8fCB3cC5lZGl0b3I7XG5cdGNvbnN0IHsgVGV4dGFyZWFDb250cm9sIH0gPSB3cC5jb21wb25lbnRzO1xuXG5cdC8qKlxuXHQgKiBMb2NhbGl6ZWQgZGF0YSBhbGlhc2VzLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICovXG5cdGNvbnN0IHsgc3RyaW5ncyB9ID0gd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvcjtcblxuXHQvKipcblx0ICogUHVibGljIGZ1bmN0aW9ucyBhbmQgcHJvcGVydGllcy5cblx0ICpcblx0ICogQHNpbmNlIDEuOC44XG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHRjb25zdCBhcHAgPSB7XG5cdFx0LyoqXG5cdFx0ICogSW5pdGlhbGl6ZSBtb2R1bGUuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBjb21tb25Nb2R1bGUgQ29tbW9uIG1vZHVsZS5cblx0XHQgKi9cblx0XHRpbml0KCBjb21tb25Nb2R1bGUgKSB7XG5cdFx0XHRhcHAuY29tbW9uID0gY29tbW9uTW9kdWxlO1xuXG5cdFx0XHRhcHAuaG9va3MoKTtcblx0XHRcdGFwcC5ldmVudHMoKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogSG9va3MuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKi9cblx0XHRob29rcygpIHtcblx0XHRcdGFkZEZpbHRlcihcblx0XHRcdFx0J2VkaXRvci5CbG9ja0VkaXQnLFxuXHRcdFx0XHQnZWRpdG9yc2tpdC9jdXN0b20tYWR2YW5jZWQtY29udHJvbCcsXG5cdFx0XHRcdGFwcC53aXRoQWR2YW5jZWRDb250cm9sc1xuXHRcdFx0KTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogRXZlbnRzLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICovXG5cdFx0ZXZlbnRzKCkge1xuXHRcdFx0JCggZG9jdW1lbnQgKVxuXHRcdFx0XHQub24oICdmb2N1cyBjbGljaycsICd0ZXh0YXJlYScsIGFwcC5jb3B5UGFzdGVGb2N1cyApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBDb3B5IC8gUGFzdGUgU3R5bGUgU2V0dGluZ3MgdGV4dGFyZWEgZm9jdXMgZXZlbnQuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKi9cblx0XHRjb3B5UGFzdGVGb2N1cygpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0aWYgKCAkaW5wdXQuc2libGluZ3MoICdsYWJlbCcgKS50ZXh0KCkgPT09IHN0cmluZ3MuY29weV9wYXN0ZV9zZXR0aW5ncyApIHtcblx0XHRcdFx0Ly8gU2VsZWN0IGFsbCB0ZXh0LCBzbyBpdCdzIGVhc2llciB0byBjb3B5IGFuZCBwYXN0ZSB2YWx1ZS5cblx0XHRcdFx0JGlucHV0LnNlbGVjdCgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgZmllbGRzLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgQmxvY2sgcHJvcGVydGllcy5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge09iamVjdH0gSW5zcGVjdG9yIGFkdmFuY2VkIGNvbnRyb2xzIEpTWCBjb2RlLlxuXHRcdCAqL1xuXHRcdGdldEZpZWxkcyggcHJvcHMgKSB7XG5cdFx0XHQvLyBQcm9jZWVkIG9ubHkgZm9yIFdQRm9ybXMgYmxvY2suXG5cdFx0XHRpZiAoIHByb3BzPy5uYW1lICE9PSAnd3Bmb3Jtcy9mb3JtLXNlbGVjdG9yJyApIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENvbW1vbiBldmVudCBoYW5kbGVycy5cblx0XHRcdGNvbnN0IGhhbmRsZXJzID0gYXBwLmNvbW1vbi5nZXRTZXR0aW5nc0ZpZWxkc0hhbmRsZXJzKCBwcm9wcyApO1xuXG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8SW5zcGVjdG9yQWR2YW5jZWRDb250cm9scz5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT17IGFwcC5jb21tb24uZ2V0UGFuZWxDbGFzcyggcHJvcHMgKSArICcgYWR2YW5jZWQnIH0+XG5cdFx0XHRcdFx0XHQ8VGV4dGFyZWFDb250cm9sXG5cdFx0XHRcdFx0XHRcdGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItY3VzdG9tLWNzc1wiXG5cdFx0XHRcdFx0XHRcdGxhYmVsPXsgc3RyaW5ncy5jdXN0b21fY3NzIH1cblx0XHRcdFx0XHRcdFx0cm93cz1cIjVcIlxuXHRcdFx0XHRcdFx0XHRzcGVsbENoZWNrPVwiZmFsc2VcIlxuXHRcdFx0XHRcdFx0XHR2YWx1ZT17IHByb3BzLmF0dHJpYnV0ZXMuY3VzdG9tQ3NzIH1cblx0XHRcdFx0XHRcdFx0b25DaGFuZ2U9eyAoIHZhbHVlICkgPT4gaGFuZGxlcnMuYXR0ckNoYW5nZSggJ2N1c3RvbUNzcycsIHZhbHVlICkgfVxuXHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1sZWdlbmRcIiBkYW5nZXJvdXNseVNldElubmVySFRNTD17IHsgX19odG1sOiBzdHJpbmdzLmN1c3RvbV9jc3Nfbm90aWNlIH0gfT48L2Rpdj5cblx0XHRcdFx0XHRcdDxUZXh0YXJlYUNvbnRyb2xcblx0XHRcdFx0XHRcdFx0Y2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1jb3B5LXBhc3RlLXNldHRpbmdzXCJcblx0XHRcdFx0XHRcdFx0bGFiZWw9eyBzdHJpbmdzLmNvcHlfcGFzdGVfc2V0dGluZ3MgfVxuXHRcdFx0XHRcdFx0XHRyb3dzPVwiNFwiXG5cdFx0XHRcdFx0XHRcdHNwZWxsQ2hlY2s9XCJmYWxzZVwiXG5cdFx0XHRcdFx0XHRcdHZhbHVlPXsgcHJvcHMuYXR0cmlidXRlcy5jb3B5UGFzdGVKc29uVmFsdWUgfVxuXHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17ICggdmFsdWUgKSA9PiBoYW5kbGVycy5wYXN0ZVNldHRpbmdzKCB2YWx1ZSApIH1cblx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItbGVnZW5kXCIgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9eyB7IF9faHRtbDogc3RyaW5ncy5jb3B5X3Bhc3RlX25vdGljZSB9IH0+PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvSW5zcGVjdG9yQWR2YW5jZWRDb250cm9scz5cblx0XHRcdCk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEFkZCBjb250cm9scyBvbiBBZHZhbmNlZCBTZXR0aW5ncyBQYW5lbC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7RnVuY3Rpb259IEJsb2NrRWRpdCBCbG9jayBlZGl0IGNvbXBvbmVudC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge0Z1bmN0aW9ufSBCbG9ja0VkaXQgTW9kaWZpZWQgYmxvY2sgZWRpdCBjb21wb25lbnQuXG5cdFx0ICovXG5cdFx0d2l0aEFkdmFuY2VkQ29udHJvbHM6IGNyZWF0ZUhpZ2hlck9yZGVyQ29tcG9uZW50KFxuXHRcdFx0KCBCbG9ja0VkaXQgKSA9PiB7XG5cdFx0XHRcdHJldHVybiAoIHByb3BzICkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHQ8RnJhZ21lbnQ+XG5cdFx0XHRcdFx0XHRcdDxCbG9ja0VkaXQgeyAuLi5wcm9wcyB9IC8+XG5cdFx0XHRcdFx0XHRcdHsgYXBwLmdldEZpZWxkcyggcHJvcHMgKSB9XG5cdFx0XHRcdFx0XHQ8L0ZyYWdtZW50PlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH07XG5cdFx0XHR9LFxuXHRcdFx0J3dpdGhBZHZhbmNlZENvbnRyb2xzJ1xuXHRcdCksXG5cdH07XG5cblx0Ly8gUHJvdmlkZSBhY2Nlc3MgdG8gcHVibGljIGZ1bmN0aW9ucy9wcm9wZXJ0aWVzLlxuXHRyZXR1cm4gYXBwO1xufSggalF1ZXJ5ICkgKTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkEsSUFBQUEsUUFBQSxHQUFBQyxPQUFBLENBQUFDLE9BQUEsR0FPaUIsVUFBVUMsQ0FBQyxFQUFHO0VBQzlCO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7RUFDQyxJQUFRQyxTQUFTLEdBQUtDLEVBQUUsQ0FBQ0MsS0FBSyxDQUF0QkYsU0FBUztFQUNqQixJQUFRRywwQkFBMEIsR0FBS0YsRUFBRSxDQUFDRyxPQUFPLENB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
},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* global wpforms_gutenberg_form_selector */
/* jshint es3: false, esversion: 6 */

/**
 * @param strings.remove_image
 */

/**
 * React component for the background preview.
 *
 * @since 1.8.8
 *
 * @param {Object}   props                    Component props.
 * @param {Object}   props.attributes         Block attributes.
 * @param {Function} props.onRemoveBackground Function to remove the background.
 * @param {Function} props.onPreviewClicked   Function to handle the preview click.
 *
 * @return {Object} React component.
 */
var BackgroundPreview = function BackgroundPreview(_ref) {
  var attributes = _ref.attributes,
    onRemoveBackground = _ref.onRemoveBackground,
    onPreviewClicked = _ref.onPreviewClicked;
  var Button = wp.components.Button;
  var _wpforms_gutenberg_fo = wpforms_gutenberg_form_selector,
    strings = _wpforms_gutenberg_fo.strings;
  return /*#__PURE__*/React.createElement("div", {
    className: "wpforms-gutenberg-form-selector-background-preview"
  }, /*#__PURE__*/React.createElement("style", null, "\n\t\t\t\t\t.wpforms-gutenberg-form-selector-background-preview-image {\n\t\t\t\t\t\t--wpforms-background-url: ".concat(attributes.backgroundUrl, ";\n\t\t\t\t\t}\n\t\t\t\t")), /*#__PURE__*/React.createElement("input", {
    className: "wpforms-gutenberg-form-selector-background-preview-image",
    onClick: onPreviewClicked,
    tabIndex: 0,
    type: "button",
    onKeyDown: function onKeyDown(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        onPreviewClicked();
      }
    }
  }), /*#__PURE__*/React.createElement(Button, {
    isSecondary: true,
    className: "is-destructive",
    onClick: onRemoveBackground
  }, strings.remove_image));
};
BackgroundPreview.propTypes = {
  attributes: _propTypes.default.object.isRequired,
  onRemoveBackground: _propTypes.default.func.isRequired,
  onPreviewClicked: _propTypes.default.func.isRequired
};
var _default = exports.default = BackgroundPreview;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcHJvcFR5cGVzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIkJhY2tncm91bmRQcmV2aWV3IiwiX3JlZiIsImF0dHJpYnV0ZXMiLCJvblJlbW92ZUJhY2tncm91bmQiLCJvblByZXZpZXdDbGlja2VkIiwiQnV0dG9uIiwid3AiLCJjb21wb25lbnRzIiwiX3dwZm9ybXNfZ3V0ZW5iZXJnX2ZvIiwid3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvciIsInN0cmluZ3MiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJjb25jYXQiLCJiYWNrZ3JvdW5kVXJsIiwib25DbGljayIsInRhYkluZGV4IiwidHlwZSIsIm9uS2V5RG93biIsImV2ZW50Iiwia2V5IiwiaXNTZWNvbmRhcnkiLCJyZW1vdmVfaW1hZ2UiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZnVuYyIsIl9kZWZhdWx0IiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbImJhY2tncm91bmQtcHJldmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvciAqL1xuLyoganNoaW50IGVzMzogZmFsc2UsIGVzdmVyc2lvbjogNiAqL1xuXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG4vKipcbiAqIEBwYXJhbSBzdHJpbmdzLnJlbW92ZV9pbWFnZVxuICovXG5cbi8qKlxuICogUmVhY3QgY29tcG9uZW50IGZvciB0aGUgYmFja2dyb3VuZCBwcmV2aWV3LlxuICpcbiAqIEBzaW5jZSAxLjguOFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgIHByb3BzICAgICAgICAgICAgICAgICAgICBDb21wb25lbnQgcHJvcHMuXG4gKiBAcGFyYW0ge09iamVjdH0gICBwcm9wcy5hdHRyaWJ1dGVzICAgICAgICAgQmxvY2sgYXR0cmlidXRlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByb3BzLm9uUmVtb3ZlQmFja2dyb3VuZCBGdW5jdGlvbiB0byByZW1vdmUgdGhlIGJhY2tncm91bmQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcm9wcy5vblByZXZpZXdDbGlja2VkICAgRnVuY3Rpb24gdG8gaGFuZGxlIHRoZSBwcmV2aWV3IGNsaWNrLlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gUmVhY3QgY29tcG9uZW50LlxuICovXG5jb25zdCBCYWNrZ3JvdW5kUHJldmlldyA9ICggeyBhdHRyaWJ1dGVzLCBvblJlbW92ZUJhY2tncm91bmQsIG9uUHJldmlld0NsaWNrZWQgfSApID0+IHtcblx0Y29uc3QgeyBCdXR0b24gfSA9IHdwLmNvbXBvbmVudHM7XG5cdGNvbnN0IHsgc3RyaW5ncyB9ID0gd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvcjtcblxuXHRyZXR1cm4gKFxuXHRcdDxkaXYgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1iYWNrZ3JvdW5kLXByZXZpZXdcIj5cblx0XHRcdDxzdHlsZT5cblx0XHRcdFx0eyBgXG5cdFx0XHRcdFx0LndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItYmFja2dyb3VuZC1wcmV2aWV3LWltYWdlIHtcblx0XHRcdFx0XHRcdC0td3Bmb3Jtcy1iYWNrZ3JvdW5kLXVybDogJHsgYXR0cmlidXRlcy5iYWNrZ3JvdW5kVXJsIH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRgIH1cblx0XHRcdDwvc3R5bGU+XG5cdFx0XHQ8aW5wdXRcblx0XHRcdFx0Y2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1iYWNrZ3JvdW5kLXByZXZpZXctaW1hZ2VcIlxuXHRcdFx0XHRvbkNsaWNrPXsgb25QcmV2aWV3Q2xpY2tlZCB9XG5cdFx0XHRcdHRhYkluZGV4PXsgMCB9XG5cdFx0XHRcdHR5cGU9XCJidXR0b25cIlxuXHRcdFx0XHRvbktleURvd249e1xuXHRcdFx0XHRcdCggZXZlbnQgKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoIGV2ZW50LmtleSA9PT0gJ0VudGVyJyB8fCBldmVudC5rZXkgPT09ICcgJyApIHtcblx0XHRcdFx0XHRcdFx0b25QcmV2aWV3Q2xpY2tlZCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0PlxuXHRcdFx0PC9pbnB1dD5cblx0XHRcdDxCdXR0b25cblx0XHRcdFx0aXNTZWNvbmRhcnlcblx0XHRcdFx0Y2xhc3NOYW1lPVwiaXMtZGVzdHJ1Y3RpdmVcIlxuXHRcdFx0XHRvbkNsaWNrPXsgb25SZW1vdmVCYWNrZ3JvdW5kIH1cblx0XHRcdD5cblx0XHRcdFx0eyBzdHJpbmdzLnJlbW92ZV9pbWFnZSB9XG5cdFx0XHQ8L0J1dHRvbj5cblx0XHQ8L2Rpdj5cblx0KTtcbn07XG5cbkJhY2tncm91bmRQcmV2aWV3LnByb3BUeXBlcyA9IHtcblx0YXR0cmlidXRlczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXHRvblJlbW92ZUJhY2tncm91bmQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cdG9uUHJldmlld0NsaWNrZWQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBCYWNrZ3JvdW5kUHJldmlldztcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0EsSUFBQUEsVUFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQW1DLFNBQUFELHVCQUFBRSxHQUFBLFdBQUFBLEdBQUEsSUFBQUEsR0FBQSxDQUFBQyxVQUFBLEdBQUFELEdBQUEsS0FBQUUsT0FBQSxFQUFBRixHQUFBO0FBSG5DO0FBQ0E7O0FBSUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU1HLGlCQUFpQixHQUFHLFNBQXBCQSxpQkFBaUJBLENBQUFDLElBQUEsRUFBK0Q7RUFBQSxJQUF4REMsVUFBVSxHQUFBRCxJQUFBLENBQVZDLFVBQVU7SUFBRUMsa0JBQWtCLEdBQUFGLElBQUEsQ0FBbEJFLGtCQUFrQjtJQUFFQyxnQkFBZ0IsR0FBQUgsSUFBQSxDQUFoQkcsZ0JBQWdCO0VBQzdFLElBQVFDLE1BQU0sR0FBS0MsRUFBRSxDQUFDQyxVQUFVLENBQXhCRixNQUFNO0VBQ2QsSUFBQUcscUJBQUEsR0FBb0JDLCtCQUErQjtJQUEzQ0MsT0FBTyxHQUFBRixxQkFBQSxDQUFQRSxPQUFPO0VBRWYsb0JBQ0NDLEtBQUEsQ0FBQUMsYUFBQTtJQUFLQyxTQUFTLEVBQUM7RUFBb0QsZ0JBQ2xFRixLQUFBLENBQUFDLGFBQUEsa0lBQUFFLE1BQUEsQ0FHZ0NaLFVBQVUsQ0FBQ2EsYUFBYSw2QkFHakQsQ0FBQyxlQUNSSixLQUFBLENBQUFDLGFBQUE7SUFDQ0MsU0FBUyxFQUFDLDBEQUEwRDtJQUNwRUcsT0FBTyxFQUFHWixnQkFBa0I7SUFDNUJhLFFBQVEsRUFBRyxDQUFHO0lBQ2RDLElBQUksRUFBQyxRQUFRO0lBQ2JDLFNBQVMsRUFDUixTQUFBQSxVQUFFQyxLQUFLLEVBQU07TUFDWixJQUFLQSxLQUFLLENBQUNDLEdBQUcsS0FBSyxPQUFPLElBQUlELEtBQUssQ0FBQ0MsR0FBRyxLQUFLLEdBQUcsRUFBRztRQUNqRGpCLGdCQUFnQixDQUFDLENBQUM7TUFDbkI7SUFDRDtFQUNBLENBRUssQ0FBQyxlQUNSTyxLQUFBLENBQUFDLGFBQUEsQ0FBQ1AsTUFBTTtJQUNOaUIsV0FBVztJQUNYVCxTQUFTLEVBQUMsZ0JBQWdCO0lBQzFCRyxPQUFPLEVBQUdiO0VBQW9CLEdBRTVCTyxPQUFPLENBQUNhLFlBQ0gsQ0FDSixDQUFDO0FBRVIsQ0FBQztBQUVEdkIsaUJBQWlCLENBQUN3QixTQUFTLEdBQUc7RUFDN0J0QixVQUFVLEVBQUV1QixrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFDdkN4QixrQkFBa0IsRUFBRXNCLGtCQUFTLENBQUNHLElBQUksQ0FBQ0QsVUFBVTtFQUM3Q3ZCLGdCQUFnQixFQUFFcUIsa0JBQVMsQ0FBQ0csSUFBSSxDQUFDRDtBQUNsQyxDQUFDO0FBQUMsSUFBQUUsUUFBQSxHQUFBQyxPQUFBLENBQUEvQixPQUFBLEdBRWFDLGlCQUFpQiJ9
},{"prop-types":6}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _backgroundPreview = _interopRequireDefault(require("./background-preview.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } /* global wpforms_gutenberg_form_selector */ /* jshint es3: false, esversion: 6 */
/**
 * @param strings.background_styles
 * @param strings.bottom_center
 * @param strings.bottom_left
 * @param strings.bottom_right
 * @param strings.center_center
 * @param strings.center_left
 * @param strings.center_right
 * @param strings.choose_image
 * @param strings.image_url
 * @param strings.media_library
 * @param strings.no_repeat
 * @param strings.repeat_x
 * @param strings.repeat_y
 * @param strings.select_background_image
 * @param strings.select_image
 * @param strings.stock_photo
 * @param strings.tile
 * @param strings.top_center
 * @param strings.top_left
 * @param strings.top_right
 */
/**
 * Gutenberg editor block.
 *
 * Background styles panel module.
 *
 * @since 1.8.8
 */
var _default = exports.default = function () {
  /**
   * WP core components.
   *
   * @since 1.8.8
   */
  var _ref = wp.blockEditor || wp.editor,
    PanelColorSettings = _ref.PanelColorSettings;
  var _wp$components = wp.components,
    SelectControl = _wp$components.SelectControl,
    PanelBody = _wp$components.PanelBody,
    Flex = _wp$components.Flex,
    FlexBlock = _wp$components.FlexBlock,
    __experimentalUnitControl = _wp$components.__experimentalUnitControl,
    TextControl = _wp$components.TextControl,
    Button = _wp$components.Button;
  var _wp$element = wp.element,
    useState = _wp$element.useState,
    useEffect = _wp$element.useEffect;

  /**
   * Localized data aliases.
   *
   * @since 1.8.8
   */
  var _wpforms_gutenberg_fo = wpforms_gutenberg_form_selector,
    strings = _wpforms_gutenberg_fo.strings,
    defaults = _wpforms_gutenberg_fo.defaults,
    isPro = _wpforms_gutenberg_fo.isPro,
    isLicenseActive = _wpforms_gutenberg_fo.isLicenseActive;

  /**
   * Whether the background is selected.
   *
   * @since 1.8.8
   *
   * @type {boolean}
   */
  var backgroundSelected = false;

  /**
   * Public functions and properties.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var app = {
    /**
     * Get block attributes.
     *
     * @since 1.8.8
     *
     * @return {Object} Block attributes.
     */
    getBlockAttributes: function getBlockAttributes() {
      return {
        backgroundImage: {
          type: 'string',
          default: defaults.backgroundImage
        },
        backgroundPosition: {
          type: 'string',
          default: defaults.backgroundPosition
        },
        backgroundRepeat: {
          type: 'string',
          default: defaults.backgroundRepeat
        },
        backgroundSizeMode: {
          type: 'string',
          default: defaults.backgroundSizeMode
        },
        backgroundSize: {
          type: 'string',
          default: defaults.backgroundSize
        },
        backgroundWidth: {
          type: 'string',
          default: defaults.backgroundWidth
        },
        backgroundHeight: {
          type: 'string',
          default: defaults.backgroundHeight
        },
        backgroundColor: {
          type: 'string',
          default: defaults.backgroundColor
        },
        backgroundUrl: {
          type: 'string',
          default: defaults.backgroundUrl
        }
      };
    },
    /**
     * Get Background Styles panel JSX code.
     *
     * @since 1.8.8
     *
     * @param {Object} props              Block properties.
     * @param {Object} handlers           Block handlers.
     * @param {Object} formSelectorCommon Block properties.
     * @param {Object} stockPhotos        Stock Photos module.
     *
     * @return {Object} Field styles JSX code.
     */
    getBackgroundStyles: function getBackgroundStyles(props, handlers, formSelectorCommon, stockPhotos) {
      // eslint-disable-line max-lines-per-function, complexity
      var _useState = useState(app._showBackgroundPreview(props)),
        _useState2 = _slicedToArray(_useState, 2),
        showBackgroundPreview = _useState2[0],
        setShowBackgroundPreview = _useState2[1]; // eslint-disable-line react-hooks/rules-of-hooks
      var _useState3 = useState(''),
        _useState4 = _slicedToArray(_useState3, 2),
        lastBgImage = _useState4[0],
        setLastBgImage = _useState4[1]; // eslint-disable-line react-hooks/rules-of-hooks
      var _useState5 = useState(isPro && isLicenseActive),
        _useState6 = _slicedToArray(_useState5, 2),
        isNotDisabled = _useState6[0],
        _setIsNotDisabled = _useState6[1]; // eslint-disable-line react-hooks/rules-of-hooks, no-unused-vars
      var _useState7 = useState(isPro),
        _useState8 = _slicedToArray(_useState7, 2),
        isProEnabled = _useState8[0],
        _setIsProEnabled = _useState8[1]; // eslint-disable-line react-hooks/rules-of-hooks, no-unused-vars

      var tabIndex = isNotDisabled ? 0 : -1;
      var cssClass = formSelectorCommon.getPanelClass(props) + (isNotDisabled ? '' : ' wpforms-gutenberg-panel-disabled');
      useEffect(function () {
        // eslint-disable-line react-hooks/rules-of-hooks
        setShowBackgroundPreview(props.attributes.backgroundImage !== 'none' && props.attributes.backgroundUrl && props.attributes.backgroundUrl !== 'url()');
      }, [backgroundSelected, props.attributes.backgroundImage, props.attributes.backgroundUrl]); // eslint-disable-line react-hooks/exhaustive-deps

      return /*#__PURE__*/React.createElement(PanelBody, {
        className: cssClass,
        title: strings.background_styles
      }, /*#__PURE__*/React.createElement("div", {
        // eslint-disable-line jsx-a11y/no-static-element-interactions
        className: "wpforms-gutenberg-form-selector-panel-body",
        onClick: function onClick(event) {
          if (isNotDisabled) {
            return;
          }
          event.stopPropagation();
          if (!isProEnabled) {
            return formSelectorCommon.education.showProModal('background', strings.background_styles);
          }
          formSelectorCommon.education.showLicenseModal('background', strings.background_styles, 'background-styles');
        },
        onKeyDown: function onKeyDown(event) {
          if (isNotDisabled) {
            return;
          }
          event.stopPropagation();
          if (!isProEnabled) {
            return formSelectorCommon.education.showProModal('background', strings.background_styles);
          }
          formSelectorCommon.education.showLicenseModal('background', strings.background_styles, 'background-styles');
        }
      }, /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: 'wpforms-gutenberg-form-selector-flex',
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(SelectControl, {
        label: strings.image,
        tabIndex: tabIndex,
        value: props.attributes.backgroundImage,
        options: [{
          label: strings.none,
          value: 'none'
        }, {
          label: strings.media_library,
          value: 'library'
        }, {
          label: strings.stock_photo,
          value: 'stock'
        }],
        onChange: function onChange(value) {
          return app.setContainerBackgroundImageWrapper(props, handlers, value, lastBgImage, setLastBgImage);
        }
      })), /*#__PURE__*/React.createElement(FlexBlock, null, (props.attributes.backgroundImage !== 'none' || !isNotDisabled) && /*#__PURE__*/React.createElement(SelectControl, {
        label: strings.position,
        value: props.attributes.backgroundPosition,
        tabIndex: tabIndex,
        options: [{
          label: strings.top_left,
          value: 'top left'
        }, {
          label: strings.top_center,
          value: 'top center'
        }, {
          label: strings.top_right,
          value: 'top right'
        }, {
          label: strings.center_left,
          value: 'center left'
        }, {
          label: strings.center_center,
          value: 'center center'
        }, {
          label: strings.center_right,
          value: 'center right'
        }, {
          label: strings.bottom_left,
          value: 'bottom left'
        }, {
          label: strings.bottom_center,
          value: 'bottom center'
        }, {
          label: strings.bottom_right,
          value: 'bottom right'
        }],
        disabled: props.attributes.backgroundImage === 'none' && isNotDisabled,
        onChange: function onChange(value) {
          return handlers.styleAttrChange('backgroundPosition', value);
        }
      }))), (props.attributes.backgroundImage !== 'none' || !isNotDisabled) && /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: 'wpforms-gutenberg-form-selector-flex',
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(SelectControl, {
        label: strings.repeat,
        tabIndex: tabIndex,
        value: props.attributes.backgroundRepeat,
        options: [{
          label: strings.no_repeat,
          value: 'no-repeat'
        }, {
          label: strings.tile,
          value: 'repeat'
        }, {
          label: strings.repeat_x,
          value: 'repeat-x'
        }, {
          label: strings.repeat_y,
          value: 'repeat-y'
        }],
        disabled: props.attributes.backgroundImage === 'none' && isNotDisabled,
        onChange: function onChange(value) {
          return handlers.styleAttrChange('backgroundRepeat', value);
        }
      })), /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(SelectControl, {
        label: strings.size,
        tabIndex: tabIndex,
        value: props.attributes.backgroundSizeMode,
        options: [{
          label: strings.dimensions,
          value: 'dimensions'
        }, {
          label: strings.cover,
          value: 'cover'
        }],
        disabled: props.attributes.backgroundImage === 'none' && isNotDisabled,
        onChange: function onChange(value) {
          return app.handleSizeFromDimensions(props, handlers, value);
        }
      }))), (props.attributes.backgroundSizeMode === 'dimensions' && props.attributes.backgroundImage !== 'none' || !isNotDisabled) && /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: 'wpforms-gutenberg-form-selector-flex',
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(__experimentalUnitControl, {
        label: strings.width,
        tabIndex: tabIndex,
        value: props.attributes.backgroundWidth,
        isUnitSelectTabbable: isNotDisabled,
        onChange: function onChange(value) {
          return app.handleSizeFromWidth(props, handlers, value);
        }
      })), /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(__experimentalUnitControl, {
        label: strings.height,
        tabIndex: tabIndex,
        value: props.attributes.backgroundHeight,
        isUnitSelectTabbable: isNotDisabled,
        onChange: function onChange(value) {
          return app.handleSizeFromHeight(props, handlers, value);
        }
      }))), (!showBackgroundPreview || props.attributes.backgroundUrl === 'url()') && (props.attributes.backgroundImage === 'library' && /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: 'wpforms-gutenberg-form-selector-flex',
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(Button, {
        isSecondary: true,
        tabIndex: tabIndex,
        className: 'wpforms-gutenberg-form-selector-media-library-button',
        onClick: app.openMediaLibrary.bind(null, props, handlers, setShowBackgroundPreview)
      }, strings.choose_image))) || props.attributes.backgroundImage === 'stock' && /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: 'wpforms-gutenberg-form-selector-flex',
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(Button, {
        isSecondary: true,
        tabIndex: tabIndex,
        className: 'wpforms-gutenberg-form-selector-media-library-button',
        onClick: stockPhotos === null || stockPhotos === void 0 ? void 0 : stockPhotos.openModal.bind(null, props, handlers, 'bg-styles', setShowBackgroundPreview)
      }, strings.choose_image)))), (showBackgroundPreview && props.attributes.backgroundImage !== 'none' || props.attributes.backgroundUrl !== 'url()') && /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: 'wpforms-gutenberg-form-selector-flex',
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_backgroundPreview.default, {
        attributes: props.attributes,
        onRemoveBackground: function onRemoveBackground() {
          app.onRemoveBackground(setShowBackgroundPreview, handlers, setLastBgImage);
        },
        onPreviewClicked: function onPreviewClicked() {
          if (props.attributes.backgroundImage === 'library') {
            return app.openMediaLibrary(props, handlers, setShowBackgroundPreview);
          }
          return stockPhotos === null || stockPhotos === void 0 ? void 0 : stockPhotos.openModal(props, handlers, 'bg-styles', setShowBackgroundPreview);
        }
      })), /*#__PURE__*/React.createElement(TextControl, {
        label: strings.image_url,
        tabIndex: tabIndex,
        value: props.attributes.backgroundImage !== 'none' && props.attributes.backgroundUrl,
        className: 'wpforms-gutenberg-form-selector-image-url',
        onChange: function onChange(value) {
          return handlers.styleAttrChange('backgroundUrl', value);
        },
        onLoad: function onLoad(value) {
          return props.attributes.backgroundImage !== 'none' && handlers.styleAttrChange('backgroundUrl', value);
        }
      }))), /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: 'wpforms-gutenberg-form-selector-flex',
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-gutenberg-form-selector-control-label"
      }, strings.colors), /*#__PURE__*/React.createElement(PanelColorSettings, {
        __experimentalIsRenderedInSidebar: true,
        enableAlpha: true,
        showTitle: false,
        tabIndex: tabIndex,
        className: "wpforms-gutenberg-form-selector-color-panel",
        colorSettings: [{
          value: props.attributes.backgroundColor,
          onChange: function onChange(value) {
            if (!isNotDisabled) {
              return;
            }
            handlers.styleAttrChange('backgroundColor', value);
          },
          label: strings.background
        }]
      })))));
    },
    /**
     * Open media library modal and handle image selection.
     *
     * @since 1.8.8
     *
     * @param {Object}   props                    Block properties.
     * @param {Object}   handlers                 Block handlers.
     * @param {Function} setShowBackgroundPreview Set show background preview.
     */
    openMediaLibrary: function openMediaLibrary(props, handlers, setShowBackgroundPreview) {
      var frame = wp.media({
        title: strings.select_background_image,
        multiple: false,
        library: {
          type: 'image'
        },
        button: {
          text: strings.select_image
        }
      });
      frame.on('select', function () {
        var attachment = frame.state().get('selection').first().toJSON();
        var setAttr = {};
        var attribute = 'backgroundUrl';
        if (attachment.url) {
          var value = "url(".concat(attachment.url, ")");
          setAttr[attribute] = value;
          props.setAttributes(setAttr);
          handlers.styleAttrChange('backgroundUrl', value);
          setShowBackgroundPreview(true);
        }
      });
      frame.open();
    },
    /**
     * Set container background image.
     *
     * @since 1.8.8
     *
     * @param {HTMLElement} container Container element.
     * @param {string}      value     Value.
     *
     * @return {boolean} True if the value was set, false otherwise.
     */
    setContainerBackgroundImage: function setContainerBackgroundImage(container, value) {
      if (value === 'none') {
        container.style.setProperty("--wpforms-background-url", 'url()');
      }
      return true;
    },
    /**
     * Set container background image.
     *
     * @since 1.8.8
     *
     * @param {Object}   props          Block properties.
     * @param {Object}   handlers       Block event handlers.
     * @param {string}   value          Value.
     * @param {string}   lastBgImage    Last background image.
     * @param {Function} setLastBgImage Set last background image.
     */
    setContainerBackgroundImageWrapper: function setContainerBackgroundImageWrapper(props, handlers, value, lastBgImage, setLastBgImage) {
      if (value === 'none') {
        setLastBgImage(props.attributes.backgroundUrl);
        props.attributes.backgroundUrl = 'url()';
        handlers.styleAttrChange('backgroundUrl', 'url()');
      } else if (lastBgImage) {
        props.attributes.backgroundUrl = lastBgImage;
        handlers.styleAttrChange('backgroundUrl', lastBgImage);
      }
      handlers.styleAttrChange('backgroundImage', value);
    },
    /**
     * Set container background position.
     *
     * @since 1.8.8
     *
     * @param {HTMLElement} container Container element.
     * @param {string}      value     Value.
     *
     * @return {boolean} True if the value was set, false otherwise.
     */
    setContainerBackgroundPosition: function setContainerBackgroundPosition(container, value) {
      container.style.setProperty("--wpforms-background-position", value);
      return true;
    },
    /**
     * Set container background repeat.
     *
     * @since 1.8.8
     *
     * @param {HTMLElement} container Container element.
     * @param {string}      value     Value.
     *
     * @return {boolean} True if the value was set, false otherwise.
     */
    setContainerBackgroundRepeat: function setContainerBackgroundRepeat(container, value) {
      container.style.setProperty("--wpforms-background-repeat", value);
      return true;
    },
    /**
     * Handle real size from dimensions.
     *
     * @since 1.8.8
     *
     * @param {Object} props    Block properties.
     * @param {Object} handlers Block handlers.
     * @param {string} value    Value.
     */
    handleSizeFromDimensions: function handleSizeFromDimensions(props, handlers, value) {
      if (value === 'cover') {
        props.attributes.backgroundSize = 'cover';
        handlers.styleAttrChange('backgroundWidth', props.attributes.backgroundWidth);
        handlers.styleAttrChange('backgroundHeight', props.attributes.backgroundHeight);
        handlers.styleAttrChange('backgroundSizeMode', 'cover');
        handlers.styleAttrChange('backgroundSize', 'cover');
      } else {
        props.attributes.backgroundSize = 'dimensions';
        handlers.styleAttrChange('backgroundSizeMode', 'dimensions');
        handlers.styleAttrChange('backgroundSize', props.attributes.backgroundWidth + ' ' + props.attributes.backgroundHeight);
      }
    },
    /**
     * Handle real size from width.
     *
     * @since 1.8.8
     *
     * @param {Object} props    Block properties.
     * @param {Object} handlers Block handlers.
     * @param {string} value    Value.
     */
    handleSizeFromWidth: function handleSizeFromWidth(props, handlers, value) {
      props.attributes.backgroundSize = value + ' ' + props.attributes.backgroundHeight;
      props.attributes.backgroundWidth = value;
      handlers.styleAttrChange('backgroundSize', value + ' ' + props.attributes.backgroundHeight);
      handlers.styleAttrChange('backgroundWidth', value);
    },
    /**
     * Handle real size from height.
     *
     * @since 1.8.8
     *
     * @param {Object} props    Block properties.
     * @param {Object} handlers Block handlers.
     * @param {string} value    Value.
     */
    handleSizeFromHeight: function handleSizeFromHeight(props, handlers, value) {
      props.attributes.backgroundSize = props.attributes.backgroundWidth + ' ' + value;
      props.attributes.backgroundHeight = value;
      handlers.styleAttrChange('backgroundSize', props.attributes.backgroundWidth + ' ' + value);
      handlers.styleAttrChange('backgroundHeight', value);
    },
    /**
     * Set container background width.
     *
     * @since 1.8.8
     *
     * @param {HTMLElement} container Container element.
     * @param {string}      value     Value.
     *
     * @return {boolean} True if the value was set, false otherwise.
     */
    setContainerBackgroundWidth: function setContainerBackgroundWidth(container, value) {
      container.style.setProperty("--wpforms-background-width", value);
      return true;
    },
    /**
     * Set container background height.
     *
     * @since 1.8.8
     *
     * @param {HTMLElement} container Container element.
     * @param {string}      value     Value.
     *
     * @return {boolean} True if the value was set, false otherwise.
     */
    setContainerBackgroundHeight: function setContainerBackgroundHeight(container, value) {
      container.style.setProperty("--wpforms-background-height", value);
      return true;
    },
    /**
     * Set container background url.
     *
     * @since 1.8.8
     *
     * @param {HTMLElement} container Container element.
     * @param {string}      value     Value.
     *
     * @return {boolean} True if the value was set, false otherwise.
     */
    setBackgroundUrl: function setBackgroundUrl(container, value) {
      container.style.setProperty("--wpforms-background-url", value);
      return true;
    },
    /**
     * Set container background color.
     *
     * @since 1.8.8
     *
     * @param {HTMLElement} container Container element.
     * @param {string}      value     Value.
     *
     * @return {boolean} True if the value was set, false otherwise.
     */
    setBackgroundColor: function setBackgroundColor(container, value) {
      container.style.setProperty("--wpforms-background-color", value);
      return true;
    },
    _showBackgroundPreview: function _showBackgroundPreview(props) {
      return props.attributes.backgroundImage !== 'none' && props.attributes.backgroundUrl && props.attributes.backgroundUrl !== 'url()';
    },
    /**
     * Remove background image.
     *
     * @since 1.8.8
     *
     * @param {Function} setShowBackgroundPreview Set show background preview.
     * @param {Object}   handlers                 Block handlers.
     * @param {Function} setLastBgImage           Set last background image.
     */
    onRemoveBackground: function onRemoveBackground(setShowBackgroundPreview, handlers, setLastBgImage) {
      setShowBackgroundPreview(false);
      handlers.styleAttrChange('backgroundUrl', 'url()');
      setLastBgImage('');
    },
    /**
     * Handle theme change.
     *
     * @since 1.8.8
     *
     * @param {Object} props Block properties.
     */
    onSetTheme: function onSetTheme(props) {
      backgroundSelected = props.attributes.backgroundImage !== 'url()';
    }
  };
  return app;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYmFja2dyb3VuZFByZXZpZXciLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX3NsaWNlZFRvQXJyYXkiLCJhcnIiLCJpIiwiX2FycmF5V2l0aEhvbGVzIiwiX2l0ZXJhYmxlVG9BcnJheUxpbWl0IiwiX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5IiwiX25vbkl0ZXJhYmxlUmVzdCIsIlR5cGVFcnJvciIsIm8iLCJtaW5MZW4iLCJfYXJyYXlMaWtlVG9BcnJheSIsIm4iLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJzbGljZSIsImNvbnN0cnVjdG9yIiwibmFtZSIsIkFycmF5IiwiZnJvbSIsInRlc3QiLCJsZW4iLCJsZW5ndGgiLCJhcnIyIiwiciIsImwiLCJ0IiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJlIiwidSIsImEiLCJmIiwibmV4dCIsImRvbmUiLCJwdXNoIiwidmFsdWUiLCJyZXR1cm4iLCJpc0FycmF5IiwiX2RlZmF1bHQiLCJleHBvcnRzIiwiX3JlZiIsIndwIiwiYmxvY2tFZGl0b3IiLCJlZGl0b3IiLCJQYW5lbENvbG9yU2V0dGluZ3MiLCJfd3AkY29tcG9uZW50cyIsImNvbXBvbmVudHMiLCJTZWxlY3RDb250cm9sIiwiUGFuZWxCb2R5IiwiRmxleCIsIkZsZXhCbG9jayIsIl9fZXhwZXJpbWVudGFsVW5pdENvbnRyb2wiLCJUZXh0Q29udHJvbCIsIkJ1dHRvbiIsIl93cCRlbGVtZW50IiwiZWxlbWVudCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiX3dwZm9ybXNfZ3V0ZW5iZXJnX2ZvIiwid3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvciIsInN0cmluZ3MiLCJkZWZhdWx0cyIsImlzUHJvIiwiaXNMaWNlbnNlQWN0aXZlIiwiYmFja2dyb3VuZFNlbGVjdGVkIiwiYXBwIiwiZ2V0QmxvY2tBdHRyaWJ1dGVzIiwiYmFja2dyb3VuZEltYWdlIiwidHlwZSIsImJhY2tncm91bmRQb3NpdGlvbiIsImJhY2tncm91bmRSZXBlYXQiLCJiYWNrZ3JvdW5kU2l6ZU1vZGUiLCJiYWNrZ3JvdW5kU2l6ZSIsImJhY2tncm91bmRXaWR0aCIsImJhY2tncm91bmRIZWlnaHQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJiYWNrZ3JvdW5kVXJsIiwiZ2V0QmFja2dyb3VuZFN0eWxlcyIsInByb3BzIiwiaGFuZGxlcnMiLCJmb3JtU2VsZWN0b3JDb21tb24iLCJzdG9ja1Bob3RvcyIsIl91c2VTdGF0ZSIsIl9zaG93QmFja2dyb3VuZFByZXZpZXciLCJfdXNlU3RhdGUyIiwic2hvd0JhY2tncm91bmRQcmV2aWV3Iiwic2V0U2hvd0JhY2tncm91bmRQcmV2aWV3IiwiX3VzZVN0YXRlMyIsIl91c2VTdGF0ZTQiLCJsYXN0QmdJbWFnZSIsInNldExhc3RCZ0ltYWdlIiwiX3VzZVN0YXRlNSIsIl91c2VTdGF0ZTYiLCJpc05vdERpc2FibGVkIiwiX3NldElzTm90RGlzYWJsZWQiLCJfdXNlU3RhdGU3IiwiX3VzZVN0YXRlOCIsImlzUHJvRW5hYmxlZCIsIl9zZXRJc1Byb0VuYWJsZWQiLCJ0YWJJbmRleCIsImNzc0NsYXNzIiwiZ2V0UGFuZWxDbGFzcyIsImF0dHJpYnV0ZXMiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJ0aXRsZSIsImJhY2tncm91bmRfc3R5bGVzIiwib25DbGljayIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwiZWR1Y2F0aW9uIiwic2hvd1Byb01vZGFsIiwic2hvd0xpY2Vuc2VNb2RhbCIsIm9uS2V5RG93biIsImdhcCIsImFsaWduIiwianVzdGlmeSIsImxhYmVsIiwiaW1hZ2UiLCJvcHRpb25zIiwibm9uZSIsIm1lZGlhX2xpYnJhcnkiLCJzdG9ja19waG90byIsIm9uQ2hhbmdlIiwic2V0Q29udGFpbmVyQmFja2dyb3VuZEltYWdlV3JhcHBlciIsInBvc2l0aW9uIiwidG9wX2xlZnQiLCJ0b3BfY2VudGVyIiwidG9wX3JpZ2h0IiwiY2VudGVyX2xlZnQiLCJjZW50ZXJfY2VudGVyIiwiY2VudGVyX3JpZ2h0IiwiYm90dG9tX2xlZnQiLCJib3R0b21fY2VudGVyIiwiYm90dG9tX3JpZ2h0IiwiZGlzYWJsZWQiLCJzdHlsZUF0dHJDaGFuZ2UiLCJyZXBlYXQiLCJub19yZXBlYXQiLCJ0aWxlIiwicmVwZWF0X3giLCJyZXBlYXRfeSIsInNpemUiLCJkaW1lbnNpb25zIiwiY292ZXIiLCJoYW5kbGVTaXplRnJvbURpbWVuc2lvbnMiLCJ3aWR0aCIsImlzVW5pdFNlbGVjdFRhYmJhYmxlIiwiaGFuZGxlU2l6ZUZyb21XaWR0aCIsImhlaWdodCIsImhhbmRsZVNpemVGcm9tSGVpZ2h0IiwiaXNTZWNvbmRhcnkiLCJvcGVuTWVkaWFMaWJyYXJ5IiwiYmluZCIsImNob29zZV9pbWFnZSIsIm9wZW5Nb2RhbCIsIm9uUmVtb3ZlQmFja2dyb3VuZCIsIm9uUHJldmlld0NsaWNrZWQiLCJpbWFnZV91cmwiLCJvbkxvYWQiLCJjb2xvcnMiLCJfX2V4cGVyaW1lbnRhbElzUmVuZGVyZWRJblNpZGViYXIiLCJlbmFibGVBbHBoYSIsInNob3dUaXRsZSIsImNvbG9yU2V0dGluZ3MiLCJiYWNrZ3JvdW5kIiwiZnJhbWUiLCJtZWRpYSIsInNlbGVjdF9iYWNrZ3JvdW5kX2ltYWdlIiwibXVsdGlwbGUiLCJsaWJyYXJ5IiwiYnV0dG9uIiwidGV4dCIsInNlbGVjdF9pbWFnZSIsIm9uIiwiYXR0YWNobWVudCIsInN0YXRlIiwiZ2V0IiwiZmlyc3QiLCJ0b0pTT04iLCJzZXRBdHRyIiwiYXR0cmlidXRlIiwidXJsIiwiY29uY2F0Iiwic2V0QXR0cmlidXRlcyIsIm9wZW4iLCJzZXRDb250YWluZXJCYWNrZ3JvdW5kSW1hZ2UiLCJjb250YWluZXIiLCJzdHlsZSIsInNldFByb3BlcnR5Iiwic2V0Q29udGFpbmVyQmFja2dyb3VuZFBvc2l0aW9uIiwic2V0Q29udGFpbmVyQmFja2dyb3VuZFJlcGVhdCIsInNldENvbnRhaW5lckJhY2tncm91bmRXaWR0aCIsInNldENvbnRhaW5lckJhY2tncm91bmRIZWlnaHQiLCJzZXRCYWNrZ3JvdW5kVXJsIiwic2V0QmFja2dyb3VuZENvbG9yIiwib25TZXRUaGVtZSJdLCJzb3VyY2VzIjpbImJhY2tncm91bmQtc3R5bGVzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yICovXG4vKiBqc2hpbnQgZXMzOiBmYWxzZSwgZXN2ZXJzaW9uOiA2ICovXG5cbmltcG9ydCBCYWNrZ3JvdW5kUHJldmlldyBmcm9tICcuL2JhY2tncm91bmQtcHJldmlldy5qcyc7XG5cbi8qKlxuICogQHBhcmFtIHN0cmluZ3MuYmFja2dyb3VuZF9zdHlsZXNcbiAqIEBwYXJhbSBzdHJpbmdzLmJvdHRvbV9jZW50ZXJcbiAqIEBwYXJhbSBzdHJpbmdzLmJvdHRvbV9sZWZ0XG4gKiBAcGFyYW0gc3RyaW5ncy5ib3R0b21fcmlnaHRcbiAqIEBwYXJhbSBzdHJpbmdzLmNlbnRlcl9jZW50ZXJcbiAqIEBwYXJhbSBzdHJpbmdzLmNlbnRlcl9sZWZ0XG4gKiBAcGFyYW0gc3RyaW5ncy5jZW50ZXJfcmlnaHRcbiAqIEBwYXJhbSBzdHJpbmdzLmNob29zZV9pbWFnZVxuICogQHBhcmFtIHN0cmluZ3MuaW1hZ2VfdXJsXG4gKiBAcGFyYW0gc3RyaW5ncy5tZWRpYV9saWJyYXJ5XG4gKiBAcGFyYW0gc3RyaW5ncy5ub19yZXBlYXRcbiAqIEBwYXJhbSBzdHJpbmdzLnJlcGVhdF94XG4gKiBAcGFyYW0gc3RyaW5ncy5yZXBlYXRfeVxuICogQHBhcmFtIHN0cmluZ3Muc2VsZWN0X2JhY2tncm91bmRfaW1hZ2VcbiAqIEBwYXJhbSBzdHJpbmdzLnNlbGVjdF9pbWFnZVxuICogQHBhcmFtIHN0cmluZ3Muc3RvY2tfcGhvdG9cbiAqIEBwYXJhbSBzdHJpbmdzLnRpbGVcbiAqIEBwYXJhbSBzdHJpbmdzLnRvcF9jZW50ZXJcbiAqIEBwYXJhbSBzdHJpbmdzLnRvcF9sZWZ0XG4gKiBAcGFyYW0gc3RyaW5ncy50b3BfcmlnaHRcbiAqL1xuXG4vKipcbiAqIEd1dGVuYmVyZyBlZGl0b3IgYmxvY2suXG4gKlxuICogQmFja2dyb3VuZCBzdHlsZXMgcGFuZWwgbW9kdWxlLlxuICpcbiAqIEBzaW5jZSAxLjguOFxuICovXG5leHBvcnQgZGVmYXVsdCAoIGZ1bmN0aW9uKCkge1xuXHQvKipcblx0ICogV1AgY29yZSBjb21wb25lbnRzLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICovXG5cdGNvbnN0IHsgUGFuZWxDb2xvclNldHRpbmdzIH0gPSB3cC5ibG9ja0VkaXRvciB8fCB3cC5lZGl0b3I7XG5cdGNvbnN0IHsgU2VsZWN0Q29udHJvbCwgUGFuZWxCb2R5LCBGbGV4LCBGbGV4QmxvY2ssIF9fZXhwZXJpbWVudGFsVW5pdENvbnRyb2wsIFRleHRDb250cm9sLCBCdXR0b24gfSA9IHdwLmNvbXBvbmVudHM7XG5cdGNvbnN0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9ID0gd3AuZWxlbWVudDtcblxuXHQvKipcblx0ICogTG9jYWxpemVkIGRhdGEgYWxpYXNlcy5cblx0ICpcblx0ICogQHNpbmNlIDEuOC44XG5cdCAqL1xuXHRjb25zdCB7IHN0cmluZ3MsIGRlZmF1bHRzLCBpc1BybywgaXNMaWNlbnNlQWN0aXZlIH0gPSB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIHRoZSBiYWNrZ3JvdW5kIGlzIHNlbGVjdGVkLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICpcblx0ICogQHR5cGUge2Jvb2xlYW59XG5cdCAqL1xuXHRsZXQgYmFja2dyb3VuZFNlbGVjdGVkID0gZmFsc2U7XG5cblx0LyoqXG5cdCAqIFB1YmxpYyBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjguOFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0Y29uc3QgYXBwID0ge1xuXG5cdFx0LyoqXG5cdFx0ICogR2V0IGJsb2NrIGF0dHJpYnV0ZXMuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge09iamVjdH0gQmxvY2sgYXR0cmlidXRlcy5cblx0XHQgKi9cblx0XHRnZXRCbG9ja0F0dHJpYnV0ZXMoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6IHtcblx0XHRcdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdFx0XHRkZWZhdWx0OiBkZWZhdWx0cy5iYWNrZ3JvdW5kSW1hZ2UsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJhY2tncm91bmRQb3NpdGlvbjoge1xuXHRcdFx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0XHRcdGRlZmF1bHQ6IGRlZmF1bHRzLmJhY2tncm91bmRQb3NpdGlvbixcblx0XHRcdFx0fSxcblx0XHRcdFx0YmFja2dyb3VuZFJlcGVhdDoge1xuXHRcdFx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0XHRcdGRlZmF1bHQ6IGRlZmF1bHRzLmJhY2tncm91bmRSZXBlYXQsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJhY2tncm91bmRTaXplTW9kZToge1xuXHRcdFx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0XHRcdGRlZmF1bHQ6IGRlZmF1bHRzLmJhY2tncm91bmRTaXplTW9kZSxcblx0XHRcdFx0fSxcblx0XHRcdFx0YmFja2dyb3VuZFNpemU6IHtcblx0XHRcdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdFx0XHRkZWZhdWx0OiBkZWZhdWx0cy5iYWNrZ3JvdW5kU2l6ZSxcblx0XHRcdFx0fSxcblx0XHRcdFx0YmFja2dyb3VuZFdpZHRoOiB7XG5cdFx0XHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRcdFx0ZGVmYXVsdDogZGVmYXVsdHMuYmFja2dyb3VuZFdpZHRoLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRiYWNrZ3JvdW5kSGVpZ2h0OiB7XG5cdFx0XHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRcdFx0ZGVmYXVsdDogZGVmYXVsdHMuYmFja2dyb3VuZEhlaWdodCxcblx0XHRcdFx0fSxcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiB7XG5cdFx0XHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRcdFx0ZGVmYXVsdDogZGVmYXVsdHMuYmFja2dyb3VuZENvbG9yLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRiYWNrZ3JvdW5kVXJsOiB7XG5cdFx0XHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRcdFx0ZGVmYXVsdDogZGVmYXVsdHMuYmFja2dyb3VuZFVybCxcblx0XHRcdFx0fSxcblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdldCBCYWNrZ3JvdW5kIFN0eWxlcyBwYW5lbCBKU1ggY29kZS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHByb3BzICAgICAgICAgICAgICBCbG9jayBwcm9wZXJ0aWVzLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVycyAgICAgICAgICAgQmxvY2sgaGFuZGxlcnMuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGZvcm1TZWxlY3RvckNvbW1vbiBCbG9jayBwcm9wZXJ0aWVzLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBzdG9ja1Bob3RvcyAgICAgICAgU3RvY2sgUGhvdG9zIG1vZHVsZS5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge09iamVjdH0gRmllbGQgc3R5bGVzIEpTWCBjb2RlLlxuXHRcdCAqL1xuXHRcdGdldEJhY2tncm91bmRTdHlsZXMoIHByb3BzLCBoYW5kbGVycywgZm9ybVNlbGVjdG9yQ29tbW9uLCBzdG9ja1Bob3RvcyApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBtYXgtbGluZXMtcGVyLWZ1bmN0aW9uLCBjb21wbGV4aXR5XG5cdFx0XHRjb25zdCBbIHNob3dCYWNrZ3JvdW5kUHJldmlldywgc2V0U2hvd0JhY2tncm91bmRQcmV2aWV3IF0gPSB1c2VTdGF0ZSggYXBwLl9zaG93QmFja2dyb3VuZFByZXZpZXcoIHByb3BzICkgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSByZWFjdC1ob29rcy9ydWxlcy1vZi1ob29rc1xuXHRcdFx0Y29uc3QgWyBsYXN0QmdJbWFnZSwgc2V0TGFzdEJnSW1hZ2UgXSA9IHVzZVN0YXRlKCAnJyApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHJlYWN0LWhvb2tzL3J1bGVzLW9mLWhvb2tzXG5cdFx0XHRjb25zdCBbIGlzTm90RGlzYWJsZWQsIF9zZXRJc05vdERpc2FibGVkIF0gPSB1c2VTdGF0ZSggaXNQcm8gJiYgaXNMaWNlbnNlQWN0aXZlICk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcmVhY3QtaG9va3MvcnVsZXMtb2YtaG9va3MsIG5vLXVudXNlZC12YXJzXG5cdFx0XHRjb25zdCBbIGlzUHJvRW5hYmxlZCwgX3NldElzUHJvRW5hYmxlZCBdID0gdXNlU3RhdGUoIGlzUHJvICk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcmVhY3QtaG9va3MvcnVsZXMtb2YtaG9va3MsIG5vLXVudXNlZC12YXJzXG5cblx0XHRcdGNvbnN0IHRhYkluZGV4ID0gaXNOb3REaXNhYmxlZCA/IDAgOiAtMTtcblx0XHRcdGNvbnN0IGNzc0NsYXNzID0gZm9ybVNlbGVjdG9yQ29tbW9uLmdldFBhbmVsQ2xhc3MoIHByb3BzICkgKyAoIGlzTm90RGlzYWJsZWQgPyAnJyA6ICcgd3Bmb3Jtcy1ndXRlbmJlcmctcGFuZWwtZGlzYWJsZWQnICk7XG5cblx0XHRcdHVzZUVmZmVjdCggKCkgPT4geyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHJlYWN0LWhvb2tzL3J1bGVzLW9mLWhvb2tzXG5cdFx0XHRcdHNldFNob3dCYWNrZ3JvdW5kUHJldmlldyhcblx0XHRcdFx0XHRwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRJbWFnZSAhPT0gJ25vbmUnICYmXG5cdFx0XHRcdFx0cHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kVXJsICYmXG5cdFx0XHRcdFx0cHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kVXJsICE9PSAndXJsKCknXG5cdFx0XHRcdCk7XG5cdFx0XHR9LCBbIGJhY2tncm91bmRTZWxlY3RlZCwgcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kSW1hZ2UsIHByb3BzLmF0dHJpYnV0ZXMuYmFja2dyb3VuZFVybCBdICk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG5cblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxQYW5lbEJvZHkgY2xhc3NOYW1lPXsgY3NzQ2xhc3MgfSB0aXRsZT17IHN0cmluZ3MuYmFja2dyb3VuZF9zdHlsZXMgfT5cblx0XHRcdFx0XHQ8ZGl2IC8vIGVzbGludC1kaXNhYmxlLWxpbmUganN4LWExMXkvbm8tc3RhdGljLWVsZW1lbnQtaW50ZXJhY3Rpb25zXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLXBhbmVsLWJvZHlcIlxuXHRcdFx0XHRcdFx0b25DbGljaz17ICggZXZlbnQgKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmICggaXNOb3REaXNhYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoICEgaXNQcm9FbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmb3JtU2VsZWN0b3JDb21tb24uZWR1Y2F0aW9uLnNob3dQcm9Nb2RhbCggJ2JhY2tncm91bmQnLCBzdHJpbmdzLmJhY2tncm91bmRfc3R5bGVzICk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRmb3JtU2VsZWN0b3JDb21tb24uZWR1Y2F0aW9uLnNob3dMaWNlbnNlTW9kYWwoICdiYWNrZ3JvdW5kJywgc3RyaW5ncy5iYWNrZ3JvdW5kX3N0eWxlcywgJ2JhY2tncm91bmQtc3R5bGVzJyApO1xuXHRcdFx0XHRcdFx0fSB9XG5cdFx0XHRcdFx0XHRvbktleURvd249eyAoIGV2ZW50ICkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGlzTm90RGlzYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKCAhIGlzUHJvRW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZm9ybVNlbGVjdG9yQ29tbW9uLmVkdWNhdGlvbi5zaG93UHJvTW9kYWwoICdiYWNrZ3JvdW5kJywgc3RyaW5ncy5iYWNrZ3JvdW5kX3N0eWxlcyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Zm9ybVNlbGVjdG9yQ29tbW9uLmVkdWNhdGlvbi5zaG93TGljZW5zZU1vZGFsKCAnYmFja2dyb3VuZCcsIHN0cmluZ3MuYmFja2dyb3VuZF9zdHlsZXMsICdiYWNrZ3JvdW5kLXN0eWxlcycgKTtcblx0XHRcdFx0XHRcdH0gfVxuXHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdDxGbGV4IGdhcD17IDQgfSBhbGlnbj1cImZsZXgtc3RhcnRcIiBjbGFzc05hbWU9eyAnd3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1mbGV4JyB9IGp1c3RpZnk9XCJzcGFjZS1iZXR3ZWVuXCI+XG5cdFx0XHRcdFx0XHRcdDxGbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHRcdFx0PFNlbGVjdENvbnRyb2xcblx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsPXsgc3RyaW5ncy5pbWFnZSB9XG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJJbmRleD17IHRhYkluZGV4IH1cblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlPXsgcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kSW1hZ2UgfVxuXHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucz17IFtcblx0XHRcdFx0XHRcdFx0XHRcdFx0eyBsYWJlbDogc3RyaW5ncy5ub25lLCB2YWx1ZTogJ25vbmUnIH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3MubWVkaWFfbGlicmFyeSwgdmFsdWU6ICdsaWJyYXJ5JyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzdHJpbmdzLnN0b2NrX3Bob3RvLCB2YWx1ZTogJ3N0b2NrJyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XSB9XG5cdFx0XHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17ICggdmFsdWUgKSA9PiBhcHAuc2V0Q29udGFpbmVyQmFja2dyb3VuZEltYWdlV3JhcHBlciggcHJvcHMsIGhhbmRsZXJzLCB2YWx1ZSwgbGFzdEJnSW1hZ2UsIHNldExhc3RCZ0ltYWdlICkgfVxuXHRcdFx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHRcdDwvRmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHQ8RmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHRcdHsgKCBwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRJbWFnZSAhPT0gJ25vbmUnIHx8ICEgaXNOb3REaXNhYmxlZCApICYmIChcblx0XHRcdFx0XHRcdFx0XHRcdDxTZWxlY3RDb250cm9sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsPXsgc3RyaW5ncy5wb3NpdGlvbiB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlPXsgcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kUG9zaXRpb24gfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJJbmRleD17IHRhYkluZGV4IH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucz17IFtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzdHJpbmdzLnRvcF9sZWZ0LCB2YWx1ZTogJ3RvcCBsZWZ0JyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3MudG9wX2NlbnRlciwgdmFsdWU6ICd0b3AgY2VudGVyJyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3MudG9wX3JpZ2h0LCB2YWx1ZTogJ3RvcCByaWdodCcgfSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzdHJpbmdzLmNlbnRlcl9sZWZ0LCB2YWx1ZTogJ2NlbnRlciBsZWZ0JyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3MuY2VudGVyX2NlbnRlciwgdmFsdWU6ICdjZW50ZXIgY2VudGVyJyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3MuY2VudGVyX3JpZ2h0LCB2YWx1ZTogJ2NlbnRlciByaWdodCcgfSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzdHJpbmdzLmJvdHRvbV9sZWZ0LCB2YWx1ZTogJ2JvdHRvbSBsZWZ0JyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3MuYm90dG9tX2NlbnRlciwgdmFsdWU6ICdib3R0b20gY2VudGVyJyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3MuYm90dG9tX3JpZ2h0LCB2YWx1ZTogJ2JvdHRvbSByaWdodCcgfSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XSB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRpc2FibGVkPXsgKCBwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRJbWFnZSA9PT0gJ25vbmUnICYmIGlzTm90RGlzYWJsZWQgKSB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsgKCB2YWx1ZSApID0+IGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2JhY2tncm91bmRQb3NpdGlvbicsIHZhbHVlICkgfVxuXHRcdFx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdFx0XHQpIH1cblx0XHRcdFx0XHRcdFx0PC9GbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHQ8L0ZsZXg+XG5cdFx0XHRcdFx0XHR7ICggcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kSW1hZ2UgIT09ICdub25lJyB8fCAhIGlzTm90RGlzYWJsZWQgKSAmJiAoXG5cdFx0XHRcdFx0XHRcdDxGbGV4IGdhcD17IDQgfSBhbGlnbj1cImZsZXgtc3RhcnRcIiBjbGFzc05hbWU9eyAnd3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1mbGV4JyB9IGp1c3RpZnk9XCJzcGFjZS1iZXR3ZWVuXCI+XG5cdFx0XHRcdFx0XHRcdFx0PEZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdFx0XHRcdDxTZWxlY3RDb250cm9sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsPXsgc3RyaW5ncy5yZXBlYXQgfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJJbmRleD17IHRhYkluZGV4IH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU9eyBwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRSZXBlYXQgfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zPXsgW1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3Mubm9fcmVwZWF0LCB2YWx1ZTogJ25vLXJlcGVhdCcgfSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzdHJpbmdzLnRpbGUsIHZhbHVlOiAncmVwZWF0JyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3MucmVwZWF0X3gsIHZhbHVlOiAncmVwZWF0LXgnIH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0eyBsYWJlbDogc3RyaW5ncy5yZXBlYXRfeSwgdmFsdWU6ICdyZXBlYXQteScgfSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XSB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRpc2FibGVkPXsgKCBwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRJbWFnZSA9PT0gJ25vbmUnICYmIGlzTm90RGlzYWJsZWQgKSB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsgKCB2YWx1ZSApID0+IGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2JhY2tncm91bmRSZXBlYXQnLCB2YWx1ZSApIH1cblx0XHRcdFx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHRcdFx0PC9GbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHRcdFx0PEZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdFx0XHRcdDxTZWxlY3RDb250cm9sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsPXsgc3RyaW5ncy5zaXplIH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0dGFiSW5kZXg9eyB0YWJJbmRleCB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlPXsgcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kU2l6ZU1vZGUgfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zPXsgW1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3MuZGltZW5zaW9ucywgdmFsdWU6ICdkaW1lbnNpb25zJyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3MuY292ZXIsIHZhbHVlOiAnY292ZXInIH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdF0gfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkaXNhYmxlZD17ICggcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kSW1hZ2UgPT09ICdub25lJyAmJiBpc05vdERpc2FibGVkICkgfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17ICggdmFsdWUgKSA9PiBhcHAuaGFuZGxlU2l6ZUZyb21EaW1lbnNpb25zKCBwcm9wcywgaGFuZGxlcnMsIHZhbHVlICkgfVxuXHRcdFx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdFx0XHQ8L0ZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdFx0PC9GbGV4PlxuXHRcdFx0XHRcdFx0KSB9XG5cdFx0XHRcdFx0XHR7ICggKCBwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRTaXplTW9kZSA9PT0gJ2RpbWVuc2lvbnMnICYmIHByb3BzLmF0dHJpYnV0ZXMuYmFja2dyb3VuZEltYWdlICE9PSAnbm9uZScgKSB8fCAhIGlzTm90RGlzYWJsZWQgKSAmJiAoXG5cdFx0XHRcdFx0XHRcdDxGbGV4IGdhcD17IDQgfSBhbGlnbj1cImZsZXgtc3RhcnRcIiBjbGFzc05hbWU9eyAnd3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1mbGV4JyB9IGp1c3RpZnk9XCJzcGFjZS1iZXR3ZWVuXCI+XG5cdFx0XHRcdFx0XHRcdFx0PEZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdFx0XHRcdDxfX2V4cGVyaW1lbnRhbFVuaXRDb250cm9sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsPXsgc3RyaW5ncy53aWR0aCB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhYkluZGV4PXsgdGFiSW5kZXggfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZT17IHByb3BzLmF0dHJpYnV0ZXMuYmFja2dyb3VuZFdpZHRoIH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbml0U2VsZWN0VGFiYmFibGU9eyBpc05vdERpc2FibGVkIH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0b25DaGFuZ2U9eyAoIHZhbHVlICkgPT4gYXBwLmhhbmRsZVNpemVGcm9tV2lkdGgoIHByb3BzLCBoYW5kbGVycywgdmFsdWUgKSB9XG5cdFx0XHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0XHRcdDwvRmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHRcdDxGbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8X19leHBlcmltZW50YWxVbml0Q29udHJvbFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbD17IHN0cmluZ3MuaGVpZ2h0IH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0dGFiSW5kZXg9eyB0YWJJbmRleCB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlPXsgcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kSGVpZ2h0IH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aXNVbml0U2VsZWN0VGFiYmFibGU9eyBpc05vdERpc2FibGVkIH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0b25DaGFuZ2U9eyAoIHZhbHVlICkgPT4gYXBwLmhhbmRsZVNpemVGcm9tSGVpZ2h0KCBwcm9wcywgaGFuZGxlcnMsIHZhbHVlICkgfVxuXHRcdFx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdFx0XHQ8L0ZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdFx0PC9GbGV4PlxuXHRcdFx0XHRcdFx0KSB9XG5cdFx0XHRcdFx0XHR7ICggISBzaG93QmFja2dyb3VuZFByZXZpZXcgfHwgcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kVXJsID09PSAndXJsKCknICkgJiYgKFxuXHRcdFx0XHRcdFx0XHQoIHByb3BzLmF0dHJpYnV0ZXMuYmFja2dyb3VuZEltYWdlID09PSAnbGlicmFyeScgJiYgKFxuXHRcdFx0XHRcdFx0XHRcdDxGbGV4IGdhcD17IDQgfSBhbGlnbj1cImZsZXgtc3RhcnRcIiBjbGFzc05hbWU9eyAnd3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1mbGV4JyB9IGp1c3RpZnk9XCJzcGFjZS1iZXR3ZWVuXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8RmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8QnV0dG9uXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNTZWNvbmRhcnlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJJbmRleD17IHRhYkluZGV4IH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjbGFzc05hbWU9eyAnd3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1tZWRpYS1saWJyYXJ5LWJ1dHRvbicgfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9uQ2xpY2s9eyBhcHAub3Blbk1lZGlhTGlicmFyeS5iaW5kKCBudWxsLCBwcm9wcywgaGFuZGxlcnMsIHNldFNob3dCYWNrZ3JvdW5kUHJldmlldyApIH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHsgc3RyaW5ncy5jaG9vc2VfaW1hZ2UgfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L0J1dHRvbj5cblx0XHRcdFx0XHRcdFx0XHRcdDwvRmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHRcdDwvRmxleD5cblx0XHRcdFx0XHRcdFx0KSApIHx8ICggcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kSW1hZ2UgPT09ICdzdG9jaycgJiYgKFxuXHRcdFx0XHRcdFx0XHRcdDxGbGV4IGdhcD17IDQgfSBhbGlnbj1cImZsZXgtc3RhcnRcIiBjbGFzc05hbWU9eyAnd3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1mbGV4JyB9IGp1c3RpZnk9XCJzcGFjZS1iZXR3ZWVuXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8RmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8QnV0dG9uXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNTZWNvbmRhcnlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJJbmRleD17IHRhYkluZGV4IH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjbGFzc05hbWU9eyAnd3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1tZWRpYS1saWJyYXJ5LWJ1dHRvbicgfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9uQ2xpY2s9eyBzdG9ja1Bob3Rvcz8ub3Blbk1vZGFsLmJpbmQoIG51bGwsIHByb3BzLCBoYW5kbGVycywgJ2JnLXN0eWxlcycsIHNldFNob3dCYWNrZ3JvdW5kUHJldmlldyApIH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHsgc3RyaW5ncy5jaG9vc2VfaW1hZ2UgfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L0J1dHRvbj5cblx0XHRcdFx0XHRcdFx0XHRcdDwvRmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHRcdDwvRmxleD5cblx0XHRcdFx0XHRcdFx0KSApXG5cdFx0XHRcdFx0XHQpIH1cblx0XHRcdFx0XHRcdHsgKCAoIHNob3dCYWNrZ3JvdW5kUHJldmlldyAmJiBwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRJbWFnZSAhPT0gJ25vbmUnICkgfHwgcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kVXJsICE9PSAndXJsKCknICkgJiYgKFxuXHRcdFx0XHRcdFx0XHQ8RmxleCBnYXA9eyA0IH0gYWxpZ249XCJmbGV4LXN0YXJ0XCIgY2xhc3NOYW1lPXsgJ3dwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItZmxleCcgfSBqdXN0aWZ5PVwic3BhY2UtYmV0d2VlblwiPlxuXHRcdFx0XHRcdFx0XHRcdDxGbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8QmFja2dyb3VuZFByZXZpZXdcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhdHRyaWJ1dGVzPXsgcHJvcHMuYXR0cmlidXRlcyB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25SZW1vdmVCYWNrZ3JvdW5kPXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXBwLm9uUmVtb3ZlQmFja2dyb3VuZCggc2V0U2hvd0JhY2tncm91bmRQcmV2aWV3LCBoYW5kbGVycywgc2V0TGFzdEJnSW1hZ2UgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25QcmV2aWV3Q2xpY2tlZD17ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICggcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kSW1hZ2UgPT09ICdsaWJyYXJ5JyApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGFwcC5vcGVuTWVkaWFMaWJyYXJ5KCBwcm9wcywgaGFuZGxlcnMsIHNldFNob3dCYWNrZ3JvdW5kUHJldmlldyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gc3RvY2tQaG90b3M/Lm9wZW5Nb2RhbCggcHJvcHMsIGhhbmRsZXJzLCAnYmctc3R5bGVzJywgc2V0U2hvd0JhY2tncm91bmRQcmV2aWV3ICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRcdDxUZXh0Q29udHJvbFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbD17IHN0cmluZ3MuaW1hZ2VfdXJsIH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0dGFiSW5kZXg9eyB0YWJJbmRleCB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlPXsgcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kSW1hZ2UgIT09ICdub25lJyAmJiBwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRVcmwgfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjbGFzc05hbWU9eyAnd3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1pbWFnZS11cmwnIH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0b25DaGFuZ2U9eyAoIHZhbHVlICkgPT4gaGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAnYmFja2dyb3VuZFVybCcsIHZhbHVlICkgfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvbkxvYWQ9eyAoIHZhbHVlICkgPT4gcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kSW1hZ2UgIT09ICdub25lJyAmJiBoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdiYWNrZ3JvdW5kVXJsJywgdmFsdWUgKSB9XG5cdFx0XHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0XHRcdDwvRmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHQ8L0ZsZXg+XG5cdFx0XHRcdFx0XHQpIH1cblx0XHRcdFx0XHRcdDxGbGV4IGdhcD17IDQgfSBhbGlnbj1cImZsZXgtc3RhcnRcIiBjbGFzc05hbWU9eyAnd3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1mbGV4JyB9IGp1c3RpZnk9XCJzcGFjZS1iZXR3ZWVuXCI+XG5cdFx0XHRcdFx0XHRcdDxGbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWNvbnRyb2wtbGFiZWxcIj57IHN0cmluZ3MuY29sb3JzIH08L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8UGFuZWxDb2xvclNldHRpbmdzXG5cdFx0XHRcdFx0XHRcdFx0XHRfX2V4cGVyaW1lbnRhbElzUmVuZGVyZWRJblNpZGViYXJcblx0XHRcdFx0XHRcdFx0XHRcdGVuYWJsZUFscGhhXG5cdFx0XHRcdFx0XHRcdFx0XHRzaG93VGl0bGU9eyBmYWxzZSB9XG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJJbmRleD17IHRhYkluZGV4IH1cblx0XHRcdFx0XHRcdFx0XHRcdGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItY29sb3ItcGFuZWxcIlxuXHRcdFx0XHRcdFx0XHRcdFx0Y29sb3JTZXR0aW5ncz17IFtcblx0XHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRDb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvbkNoYW5nZTogKCB2YWx1ZSApID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICggISBpc05vdERpc2FibGVkICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2JhY2tncm91bmRDb2xvcicsIHZhbHVlICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogc3RyaW5ncy5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XSB9XG5cdFx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdFx0PC9GbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHQ8L0ZsZXg+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvUGFuZWxCb2R5PlxuXHRcdFx0KTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogT3BlbiBtZWRpYSBsaWJyYXJ5IG1vZGFsIGFuZCBoYW5kbGUgaW1hZ2Ugc2VsZWN0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gICBwcm9wcyAgICAgICAgICAgICAgICAgICAgQmxvY2sgcHJvcGVydGllcy5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gICBoYW5kbGVycyAgICAgICAgICAgICAgICAgQmxvY2sgaGFuZGxlcnMuXG5cdFx0ICogQHBhcmFtIHtGdW5jdGlvbn0gc2V0U2hvd0JhY2tncm91bmRQcmV2aWV3IFNldCBzaG93IGJhY2tncm91bmQgcHJldmlldy5cblx0XHQgKi9cblx0XHRvcGVuTWVkaWFMaWJyYXJ5KCBwcm9wcywgaGFuZGxlcnMsIHNldFNob3dCYWNrZ3JvdW5kUHJldmlldyApIHtcblx0XHRcdGNvbnN0IGZyYW1lID0gd3AubWVkaWEoIHtcblx0XHRcdFx0dGl0bGU6IHN0cmluZ3Muc2VsZWN0X2JhY2tncm91bmRfaW1hZ2UsXG5cdFx0XHRcdG11bHRpcGxlOiBmYWxzZSxcblx0XHRcdFx0bGlicmFyeToge1xuXHRcdFx0XHRcdHR5cGU6ICdpbWFnZScsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJ1dHRvbjoge1xuXHRcdFx0XHRcdHRleHQ6IHN0cmluZ3Muc2VsZWN0X2ltYWdlLFxuXHRcdFx0XHR9LFxuXHRcdFx0fSApO1xuXG5cdFx0XHRmcmFtZS5vbiggJ3NlbGVjdCcsICgpID0+IHtcblx0XHRcdFx0Y29uc3QgYXR0YWNobWVudCA9IGZyYW1lLnN0YXRlKCkuZ2V0KCAnc2VsZWN0aW9uJyApLmZpcnN0KCkudG9KU09OKCk7XG5cdFx0XHRcdGNvbnN0IHNldEF0dHIgPSB7fTtcblx0XHRcdFx0Y29uc3QgYXR0cmlidXRlID0gJ2JhY2tncm91bmRVcmwnO1xuXG5cdFx0XHRcdGlmICggYXR0YWNobWVudC51cmwgKSB7XG5cdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSBgdXJsKCR7IGF0dGFjaG1lbnQudXJsIH0pYDtcblxuXHRcdFx0XHRcdHNldEF0dHJbIGF0dHJpYnV0ZSBdID0gdmFsdWU7XG5cblx0XHRcdFx0XHRwcm9wcy5zZXRBdHRyaWJ1dGVzKCBzZXRBdHRyICk7XG5cblx0XHRcdFx0XHRoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdiYWNrZ3JvdW5kVXJsJywgdmFsdWUgKTtcblxuXHRcdFx0XHRcdHNldFNob3dCYWNrZ3JvdW5kUHJldmlldyggdHJ1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdGZyYW1lLm9wZW4oKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogU2V0IGNvbnRhaW5lciBiYWNrZ3JvdW5kIGltYWdlLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgQ29udGFpbmVyIGVsZW1lbnQuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9ICAgICAgdmFsdWUgICAgIFZhbHVlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgd2FzIHNldCwgZmFsc2Ugb3RoZXJ3aXNlLlxuXHRcdCAqL1xuXHRcdHNldENvbnRhaW5lckJhY2tncm91bmRJbWFnZSggY29udGFpbmVyLCB2YWx1ZSApIHtcblx0XHRcdGlmICggdmFsdWUgPT09ICdub25lJyApIHtcblx0XHRcdFx0Y29udGFpbmVyLnN0eWxlLnNldFByb3BlcnR5KCBgLS13cGZvcm1zLWJhY2tncm91bmQtdXJsYCwgJ3VybCgpJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogU2V0IGNvbnRhaW5lciBiYWNrZ3JvdW5kIGltYWdlLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gICBwcm9wcyAgICAgICAgICBCbG9jayBwcm9wZXJ0aWVzLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSAgIGhhbmRsZXJzICAgICAgIEJsb2NrIGV2ZW50IGhhbmRsZXJzLlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSAgIHZhbHVlICAgICAgICAgIFZhbHVlLlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSAgIGxhc3RCZ0ltYWdlICAgIExhc3QgYmFja2dyb3VuZCBpbWFnZS5cblx0XHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzZXRMYXN0QmdJbWFnZSBTZXQgbGFzdCBiYWNrZ3JvdW5kIGltYWdlLlxuXHRcdCAqL1xuXHRcdHNldENvbnRhaW5lckJhY2tncm91bmRJbWFnZVdyYXBwZXIoIHByb3BzLCBoYW5kbGVycywgdmFsdWUsIGxhc3RCZ0ltYWdlLCBzZXRMYXN0QmdJbWFnZSApIHtcblx0XHRcdGlmICggdmFsdWUgPT09ICdub25lJyApIHtcblx0XHRcdFx0c2V0TGFzdEJnSW1hZ2UoIHByb3BzLmF0dHJpYnV0ZXMuYmFja2dyb3VuZFVybCApO1xuXHRcdFx0XHRwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRVcmwgPSAndXJsKCknO1xuXG5cdFx0XHRcdGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2JhY2tncm91bmRVcmwnLCAndXJsKCknICk7XG5cdFx0XHR9IGVsc2UgaWYgKCBsYXN0QmdJbWFnZSApIHtcblx0XHRcdFx0cHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kVXJsID0gbGFzdEJnSW1hZ2U7XG5cdFx0XHRcdGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2JhY2tncm91bmRVcmwnLCBsYXN0QmdJbWFnZSApO1xuXHRcdFx0fVxuXG5cdFx0XHRoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdiYWNrZ3JvdW5kSW1hZ2UnLCB2YWx1ZSApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBTZXQgY29udGFpbmVyIGJhY2tncm91bmQgcG9zaXRpb24uXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciBDb250YWluZXIgZWxlbWVudC5cblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gICAgICB2YWx1ZSAgICAgVmFsdWUuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSB3YXMgc2V0LCBmYWxzZSBvdGhlcndpc2UuXG5cdFx0ICovXG5cdFx0c2V0Q29udGFpbmVyQmFja2dyb3VuZFBvc2l0aW9uKCBjb250YWluZXIsIHZhbHVlICkge1xuXHRcdFx0Y29udGFpbmVyLnN0eWxlLnNldFByb3BlcnR5KCBgLS13cGZvcm1zLWJhY2tncm91bmQtcG9zaXRpb25gLCB2YWx1ZSApO1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogU2V0IGNvbnRhaW5lciBiYWNrZ3JvdW5kIHJlcGVhdC5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIENvbnRhaW5lciBlbGVtZW50LlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIHZhbHVlICAgICBWYWx1ZS5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIHdhcyBzZXQsIGZhbHNlIG90aGVyd2lzZS5cblx0XHQgKi9cblx0XHRzZXRDb250YWluZXJCYWNrZ3JvdW5kUmVwZWF0KCBjb250YWluZXIsIHZhbHVlICkge1xuXHRcdFx0Y29udGFpbmVyLnN0eWxlLnNldFByb3BlcnR5KCBgLS13cGZvcm1zLWJhY2tncm91bmQtcmVwZWF0YCwgdmFsdWUgKTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEhhbmRsZSByZWFsIHNpemUgZnJvbSBkaW1lbnNpb25zLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgICAgQmxvY2sgcHJvcGVydGllcy5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gaGFuZGxlcnMgQmxvY2sgaGFuZGxlcnMuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAgIFZhbHVlLlxuXHRcdCAqL1xuXHRcdGhhbmRsZVNpemVGcm9tRGltZW5zaW9ucyggcHJvcHMsIGhhbmRsZXJzLCB2YWx1ZSApIHtcblx0XHRcdGlmICggdmFsdWUgPT09ICdjb3ZlcicgKSB7XG5cdFx0XHRcdHByb3BzLmF0dHJpYnV0ZXMuYmFja2dyb3VuZFNpemUgPSAnY292ZXInO1xuXG5cdFx0XHRcdGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2JhY2tncm91bmRXaWR0aCcsIHByb3BzLmF0dHJpYnV0ZXMuYmFja2dyb3VuZFdpZHRoICk7XG5cdFx0XHRcdGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2JhY2tncm91bmRIZWlnaHQnLCBwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRIZWlnaHQgKTtcblx0XHRcdFx0aGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAnYmFja2dyb3VuZFNpemVNb2RlJywgJ2NvdmVyJyApO1xuXHRcdFx0XHRoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdiYWNrZ3JvdW5kU2l6ZScsICdjb3ZlcicgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByb3BzLmF0dHJpYnV0ZXMuYmFja2dyb3VuZFNpemUgPSAnZGltZW5zaW9ucyc7XG5cblx0XHRcdFx0aGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAnYmFja2dyb3VuZFNpemVNb2RlJywgJ2RpbWVuc2lvbnMnICk7XG5cdFx0XHRcdGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2JhY2tncm91bmRTaXplJywgcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kV2lkdGggKyAnICcgKyBwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRIZWlnaHQgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogSGFuZGxlIHJlYWwgc2l6ZSBmcm9tIHdpZHRoLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgICAgQmxvY2sgcHJvcGVydGllcy5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gaGFuZGxlcnMgQmxvY2sgaGFuZGxlcnMuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAgIFZhbHVlLlxuXHRcdCAqL1xuXHRcdGhhbmRsZVNpemVGcm9tV2lkdGgoIHByb3BzLCBoYW5kbGVycywgdmFsdWUgKSB7XG5cdFx0XHRwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRTaXplID0gdmFsdWUgKyAnICcgKyBwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRIZWlnaHQ7XG5cdFx0XHRwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRXaWR0aCA9IHZhbHVlO1xuXG5cdFx0XHRoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdiYWNrZ3JvdW5kU2l6ZScsIHZhbHVlICsgJyAnICsgcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kSGVpZ2h0ICk7XG5cdFx0XHRoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdiYWNrZ3JvdW5kV2lkdGgnLCB2YWx1ZSApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBIYW5kbGUgcmVhbCBzaXplIGZyb20gaGVpZ2h0LlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgICAgQmxvY2sgcHJvcGVydGllcy5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gaGFuZGxlcnMgQmxvY2sgaGFuZGxlcnMuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAgIFZhbHVlLlxuXHRcdCAqL1xuXHRcdGhhbmRsZVNpemVGcm9tSGVpZ2h0KCBwcm9wcywgaGFuZGxlcnMsIHZhbHVlICkge1xuXHRcdFx0cHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kU2l6ZSA9IHByb3BzLmF0dHJpYnV0ZXMuYmFja2dyb3VuZFdpZHRoICsgJyAnICsgdmFsdWU7XG5cdFx0XHRwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRIZWlnaHQgPSB2YWx1ZTtcblxuXHRcdFx0aGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAnYmFja2dyb3VuZFNpemUnLCBwcm9wcy5hdHRyaWJ1dGVzLmJhY2tncm91bmRXaWR0aCArICcgJyArIHZhbHVlICk7XG5cdFx0XHRoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdiYWNrZ3JvdW5kSGVpZ2h0JywgdmFsdWUgKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogU2V0IGNvbnRhaW5lciBiYWNrZ3JvdW5kIHdpZHRoLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgQ29udGFpbmVyIGVsZW1lbnQuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9ICAgICAgdmFsdWUgICAgIFZhbHVlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgd2FzIHNldCwgZmFsc2Ugb3RoZXJ3aXNlLlxuXHRcdCAqL1xuXHRcdHNldENvbnRhaW5lckJhY2tncm91bmRXaWR0aCggY29udGFpbmVyLCB2YWx1ZSApIHtcblx0XHRcdGNvbnRhaW5lci5zdHlsZS5zZXRQcm9wZXJ0eSggYC0td3Bmb3Jtcy1iYWNrZ3JvdW5kLXdpZHRoYCwgdmFsdWUgKTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFNldCBjb250YWluZXIgYmFja2dyb3VuZCBoZWlnaHQuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciBDb250YWluZXIgZWxlbWVudC5cblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gICAgICB2YWx1ZSAgICAgVmFsdWUuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSB3YXMgc2V0LCBmYWxzZSBvdGhlcndpc2UuXG5cdFx0ICovXG5cdFx0c2V0Q29udGFpbmVyQmFja2dyb3VuZEhlaWdodCggY29udGFpbmVyLCB2YWx1ZSApIHtcblx0XHRcdGNvbnRhaW5lci5zdHlsZS5zZXRQcm9wZXJ0eSggYC0td3Bmb3Jtcy1iYWNrZ3JvdW5kLWhlaWdodGAsIHZhbHVlICk7XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBTZXQgY29udGFpbmVyIGJhY2tncm91bmQgdXJsLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgQ29udGFpbmVyIGVsZW1lbnQuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9ICAgICAgdmFsdWUgICAgIFZhbHVlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgd2FzIHNldCwgZmFsc2Ugb3RoZXJ3aXNlLlxuXHRcdCAqL1xuXHRcdHNldEJhY2tncm91bmRVcmwoIGNvbnRhaW5lciwgdmFsdWUgKSB7XG5cdFx0XHRjb250YWluZXIuc3R5bGUuc2V0UHJvcGVydHkoIGAtLXdwZm9ybXMtYmFja2dyb3VuZC11cmxgLCB2YWx1ZSApO1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogU2V0IGNvbnRhaW5lciBiYWNrZ3JvdW5kIGNvbG9yLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgQ29udGFpbmVyIGVsZW1lbnQuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9ICAgICAgdmFsdWUgICAgIFZhbHVlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgd2FzIHNldCwgZmFsc2Ugb3RoZXJ3aXNlLlxuXHRcdCAqL1xuXHRcdHNldEJhY2tncm91bmRDb2xvciggY29udGFpbmVyLCB2YWx1ZSApIHtcblx0XHRcdGNvbnRhaW5lci5zdHlsZS5zZXRQcm9wZXJ0eSggYC0td3Bmb3Jtcy1iYWNrZ3JvdW5kLWNvbG9yYCwgdmFsdWUgKTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblxuXHRcdF9zaG93QmFja2dyb3VuZFByZXZpZXcoIHByb3BzICkge1xuXHRcdFx0cmV0dXJuIHByb3BzLmF0dHJpYnV0ZXMuYmFja2dyb3VuZEltYWdlICE9PSAnbm9uZScgJiZcblx0XHRcdFx0cHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kVXJsICYmXG5cdFx0XHRcdHByb3BzLmF0dHJpYnV0ZXMuYmFja2dyb3VuZFVybCAhPT0gJ3VybCgpJztcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogUmVtb3ZlIGJhY2tncm91bmQgaW1hZ2UuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7RnVuY3Rpb259IHNldFNob3dCYWNrZ3JvdW5kUHJldmlldyBTZXQgc2hvdyBiYWNrZ3JvdW5kIHByZXZpZXcuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9ICAgaGFuZGxlcnMgICAgICAgICAgICAgICAgIEJsb2NrIGhhbmRsZXJzLlxuXHRcdCAqIEBwYXJhbSB7RnVuY3Rpb259IHNldExhc3RCZ0ltYWdlICAgICAgICAgICBTZXQgbGFzdCBiYWNrZ3JvdW5kIGltYWdlLlxuXHRcdCAqL1xuXHRcdG9uUmVtb3ZlQmFja2dyb3VuZCggc2V0U2hvd0JhY2tncm91bmRQcmV2aWV3LCBoYW5kbGVycywgc2V0TGFzdEJnSW1hZ2UgKSB7XG5cdFx0XHRzZXRTaG93QmFja2dyb3VuZFByZXZpZXcoIGZhbHNlICk7XG5cdFx0XHRoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdiYWNrZ3JvdW5kVXJsJywgJ3VybCgpJyApO1xuXHRcdFx0c2V0TGFzdEJnSW1hZ2UoICcnICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEhhbmRsZSB0aGVtZSBjaGFuZ2UuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBCbG9jayBwcm9wZXJ0aWVzLlxuXHRcdCAqL1xuXHRcdG9uU2V0VGhlbWUoIHByb3BzICkge1xuXHRcdFx0YmFja2dyb3VuZFNlbGVjdGVkID0gcHJvcHMuYXR0cmlidXRlcy5iYWNrZ3JvdW5kSW1hZ2UgIT09ICd1cmwoKSc7XG5cdFx0fSxcblx0fTtcblxuXHRyZXR1cm4gYXBwO1xufSgpICk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLElBQUFBLGtCQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFBd0QsU0FBQUQsdUJBQUFFLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFBQSxTQUFBRyxlQUFBQyxHQUFBLEVBQUFDLENBQUEsV0FBQUMsZUFBQSxDQUFBRixHQUFBLEtBQUFHLHFCQUFBLENBQUFILEdBQUEsRUFBQUMsQ0FBQSxLQUFBRywyQkFBQSxDQUFBSixHQUFBLEVBQUFDLENBQUEsS0FBQUksZ0JBQUE7QUFBQSxTQUFBQSxpQkFBQSxjQUFBQyxTQUFBO0FBQUEsU0FBQUYsNEJBQUFHLENBQUEsRUFBQUMsTUFBQSxTQUFBRCxDQUFBLHFCQUFBQSxDQUFBLHNCQUFBRSxpQkFBQSxD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
},{"./background-preview.js":14}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/* global wpforms_gutenberg_form_selector */
/* jshint es3: false, esversion: 6 */
/**
 * @param strings.border_radius
 * @param strings.border_size
 * @param strings.button_color_notice
 * @param strings.button_styles
 * @param strings.dashed
 * @param strings.solid
 */
/**
 * Gutenberg editor block.
 *
 * Button styles panel module.
 *
 * @since 1.8.8
 */
var _default = exports.default = function () {
  /**
   * WP core components.
   *
   * @since 1.8.8
   */
  var _ref = wp.blockEditor || wp.editor,
    PanelColorSettings = _ref.PanelColorSettings;
  var _wp$components = wp.components,
    SelectControl = _wp$components.SelectControl,
    PanelBody = _wp$components.PanelBody,
    Flex = _wp$components.Flex,
    FlexBlock = _wp$components.FlexBlock,
    __experimentalUnitControl = _wp$components.__experimentalUnitControl;

  /**
   * Localized data aliases.
   *
   * @since 1.8.8
   */
  var _wpforms_gutenberg_fo = wpforms_gutenberg_form_selector,
    strings = _wpforms_gutenberg_fo.strings,
    defaults = _wpforms_gutenberg_fo.defaults;

  // noinspection UnnecessaryLocalVariableJS
  /**
   * Public functions and properties.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var app = {
    /**
     * Get block attributes.
     *
     * @since 1.8.8
     *
     * @return {Object} Block attributes.
     */
    getBlockAttributes: function getBlockAttributes() {
      return {
        buttonSize: {
          type: 'string',
          default: defaults.buttonSize
        },
        buttonBorderStyle: {
          type: 'string',
          default: defaults.buttonBorderStyle
        },
        buttonBorderSize: {
          type: 'string',
          default: defaults.buttonBorderSize
        },
        buttonBorderRadius: {
          type: 'string',
          default: defaults.buttonBorderRadius
        },
        buttonBackgroundColor: {
          type: 'string',
          default: defaults.buttonBackgroundColor
        },
        buttonTextColor: {
          type: 'string',
          default: defaults.buttonTextColor
        },
        buttonBorderColor: {
          type: 'string',
          default: defaults.buttonBorderColor
        }
      };
    },
    /**
     * Get Button styles JSX code.
     *
     * @since 1.8.8
     *
     * @param {Object} props              Block properties.
     * @param {Object} handlers           Block event handlers.
     * @param {Object} sizeOptions        Size selector options.
     * @param {Object} formSelectorCommon Form selector common object.
     *
     * @return {Object}  Button styles JSX code.
     */
    getButtonStyles: function getButtonStyles(props, handlers, sizeOptions, formSelectorCommon) {
      // eslint-disable-line max-lines-per-function
      return /*#__PURE__*/React.createElement(PanelBody, {
        className: formSelectorCommon.getPanelClass(props),
        title: strings.button_styles
      }, /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: 'wpforms-gutenberg-form-selector-flex',
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(SelectControl, {
        label: strings.size,
        value: props.attributes.buttonSize,
        options: sizeOptions,
        onChange: function onChange(value) {
          return handlers.styleAttrChange('buttonSize', value);
        }
      })), /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(SelectControl, {
        label: strings.border,
        value: props.attributes.buttonBorderStyle,
        options: [{
          label: strings.none,
          value: 'none'
        }, {
          label: strings.solid,
          value: 'solid'
        }, {
          label: strings.dashed,
          value: 'dashed'
        }, {
          label: strings.dotted,
          value: 'dotted'
        }],
        onChange: function onChange(value) {
          return handlers.styleAttrChange('buttonBorderStyle', value);
        }
      }))), /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: 'wpforms-gutenberg-form-selector-flex',
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(__experimentalUnitControl, {
        label: strings.border_size,
        value: props.attributes.buttonBorderStyle === 'none' ? '' : props.attributes.buttonBorderSize,
        min: 0,
        disabled: props.attributes.buttonBorderStyle === 'none',
        onChange: function onChange(value) {
          return handlers.styleAttrChange('buttonBorderSize', value);
        },
        isUnitSelectTabbable: true
      })), /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(__experimentalUnitControl, {
        onChange: function onChange(value) {
          return handlers.styleAttrChange('buttonBorderRadius', value);
        },
        label: strings.border_radius,
        min: 0,
        isUnitSelectTabbable: true,
        value: props.attributes.buttonBorderRadius
      }))), /*#__PURE__*/React.createElement("div", {
        className: "wpforms-gutenberg-form-selector-color-picker"
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-gutenberg-form-selector-control-label"
      }, strings.colors), /*#__PURE__*/React.createElement(PanelColorSettings, {
        __experimentalIsRenderedInSidebar: true,
        enableAlpha: true,
        showTitle: false,
        className: formSelectorCommon.getColorPanelClass(props.attributes.buttonBorderStyle),
        colorSettings: [{
          value: props.attributes.buttonBackgroundColor,
          onChange: function onChange(value) {
            return handlers.styleAttrChange('buttonBackgroundColor', value);
          },
          label: strings.background
        }, {
          value: props.attributes.buttonBorderColor,
          onChange: function onChange(value) {
            return handlers.styleAttrChange('buttonBorderColor', value);
          },
          label: strings.border
        }, {
          value: props.attributes.buttonTextColor,
          onChange: function onChange(value) {
            return handlers.styleAttrChange('buttonTextColor', value);
          },
          label: strings.text
        }]
      }), /*#__PURE__*/React.createElement("div", {
        className: "wpforms-gutenberg-form-selector-legend wpforms-button-color-notice"
      }, strings.button_color_notice)));
    }
  };
  return app;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZGVmYXVsdCIsImV4cG9ydHMiLCJkZWZhdWx0IiwiX3JlZiIsIndwIiwiYmxvY2tFZGl0b3IiLCJlZGl0b3IiLCJQYW5lbENvbG9yU2V0dGluZ3MiLCJfd3AkY29tcG9uZW50cyIsImNvbXBvbmVudHMiLCJTZWxlY3RDb250cm9sIiwiUGFuZWxCb2R5IiwiRmxleCIsIkZsZXhCbG9jayIsIl9fZXhwZXJpbWVudGFsVW5pdENvbnRyb2wiLCJfd3Bmb3Jtc19ndXRlbmJlcmdfZm8iLCJ3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yIiwic3RyaW5ncyIsImRlZmF1bHRzIiwiYXBwIiwiZ2V0QmxvY2tBdHRyaWJ1dGVzIiwiYnV0dG9uU2l6ZSIsInR5cGUiLCJidXR0b25Cb3JkZXJTdHlsZSIsImJ1dHRvbkJvcmRlclNpemUiLCJidXR0b25Cb3JkZXJSYWRpdXMiLCJidXR0b25CYWNrZ3JvdW5kQ29sb3IiLCJidXR0b25UZXh0Q29sb3IiLCJidXR0b25Cb3JkZXJDb2xvciIsImdldEJ1dHRvblN0eWxlcyIsInByb3BzIiwiaGFuZGxlcnMiLCJzaXplT3B0aW9ucyIsImZvcm1TZWxlY3RvckNvbW1vbiIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImdldFBhbmVsQ2xhc3MiLCJ0aXRsZSIsImJ1dHRvbl9zdHlsZXMiLCJnYXAiLCJhbGlnbiIsImp1c3RpZnkiLCJsYWJlbCIsInNpemUiLCJ2YWx1ZSIsImF0dHJpYnV0ZXMiLCJvcHRpb25zIiwib25DaGFuZ2UiLCJzdHlsZUF0dHJDaGFuZ2UiLCJib3JkZXIiLCJub25lIiwic29saWQiLCJkYXNoZWQiLCJkb3R0ZWQiLCJib3JkZXJfc2l6ZSIsIm1pbiIsImRpc2FibGVkIiwiaXNVbml0U2VsZWN0VGFiYmFibGUiLCJib3JkZXJfcmFkaXVzIiwiY29sb3JzIiwiX19leHBlcmltZW50YWxJc1JlbmRlcmVkSW5TaWRlYmFyIiwiZW5hYmxlQWxwaGEiLCJzaG93VGl0bGUiLCJnZXRDb2xvclBhbmVsQ2xhc3MiLCJjb2xvclNldHRpbmdzIiwiYmFja2dyb3VuZCIsInRleHQiLCJidXR0b25fY29sb3Jfbm90aWNlIl0sInNvdXJjZXMiOlsiYnV0dG9uLXN0eWxlcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvciAqL1xuLyoganNoaW50IGVzMzogZmFsc2UsIGVzdmVyc2lvbjogNiAqL1xuXG4vKipcbiAqIEBwYXJhbSBzdHJpbmdzLmJvcmRlcl9yYWRpdXNcbiAqIEBwYXJhbSBzdHJpbmdzLmJvcmRlcl9zaXplXG4gKiBAcGFyYW0gc3RyaW5ncy5idXR0b25fY29sb3Jfbm90aWNlXG4gKiBAcGFyYW0gc3RyaW5ncy5idXR0b25fc3R5bGVzXG4gKiBAcGFyYW0gc3RyaW5ncy5kYXNoZWRcbiAqIEBwYXJhbSBzdHJpbmdzLnNvbGlkXG4gKi9cblxuLyoqXG4gKiBHdXRlbmJlcmcgZWRpdG9yIGJsb2NrLlxuICpcbiAqIEJ1dHRvbiBzdHlsZXMgcGFuZWwgbW9kdWxlLlxuICpcbiAqIEBzaW5jZSAxLjguOFxuICovXG5leHBvcnQgZGVmYXVsdCAoICggZnVuY3Rpb24oKSB7XG5cdC8qKlxuXHQgKiBXUCBjb3JlIGNvbXBvbmVudHMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjguOFxuXHQgKi9cblx0Y29uc3QgeyBQYW5lbENvbG9yU2V0dGluZ3MgfSA9IHdwLmJsb2NrRWRpdG9yIHx8IHdwLmVkaXRvcjtcblx0Y29uc3QgeyBTZWxlY3RDb250cm9sLCBQYW5lbEJvZHksIEZsZXgsIEZsZXhCbG9jaywgX19leHBlcmltZW50YWxVbml0Q29udHJvbCB9ID0gd3AuY29tcG9uZW50cztcblxuXHQvKipcblx0ICogTG9jYWxpemVkIGRhdGEgYWxpYXNlcy5cblx0ICpcblx0ICogQHNpbmNlIDEuOC44XG5cdCAqL1xuXHRjb25zdCB7IHN0cmluZ3MsIGRlZmF1bHRzIH0gPSB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yO1xuXG5cdC8vIG5vaW5zcGVjdGlvbiBVbm5lY2Vzc2FyeUxvY2FsVmFyaWFibGVKU1xuXHQvKipcblx0ICogUHVibGljIGZ1bmN0aW9ucyBhbmQgcHJvcGVydGllcy5cblx0ICpcblx0ICogQHNpbmNlIDEuOC44XG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHRjb25zdCBhcHAgPSB7XG5cblx0XHQvKipcblx0XHQgKiBHZXQgYmxvY2sgYXR0cmlidXRlcy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fSBCbG9jayBhdHRyaWJ1dGVzLlxuXHRcdCAqL1xuXHRcdGdldEJsb2NrQXR0cmlidXRlcygpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGJ1dHRvblNpemU6IHtcblx0XHRcdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdFx0XHRkZWZhdWx0OiBkZWZhdWx0cy5idXR0b25TaXplLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRidXR0b25Cb3JkZXJTdHlsZToge1xuXHRcdFx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0XHRcdGRlZmF1bHQ6IGRlZmF1bHRzLmJ1dHRvbkJvcmRlclN0eWxlLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRidXR0b25Cb3JkZXJTaXplOiB7XG5cdFx0XHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRcdFx0ZGVmYXVsdDogZGVmYXVsdHMuYnV0dG9uQm9yZGVyU2l6ZSxcblx0XHRcdFx0fSxcblx0XHRcdFx0YnV0dG9uQm9yZGVyUmFkaXVzOiB7XG5cdFx0XHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRcdFx0ZGVmYXVsdDogZGVmYXVsdHMuYnV0dG9uQm9yZGVyUmFkaXVzLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRidXR0b25CYWNrZ3JvdW5kQ29sb3I6IHtcblx0XHRcdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdFx0XHRkZWZhdWx0OiBkZWZhdWx0cy5idXR0b25CYWNrZ3JvdW5kQ29sb3IsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJ1dHRvblRleHRDb2xvcjoge1xuXHRcdFx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0XHRcdGRlZmF1bHQ6IGRlZmF1bHRzLmJ1dHRvblRleHRDb2xvcixcblx0XHRcdFx0fSxcblx0XHRcdFx0YnV0dG9uQm9yZGVyQ29sb3I6IHtcblx0XHRcdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdFx0XHRkZWZhdWx0OiBkZWZhdWx0cy5idXR0b25Cb3JkZXJDb2xvcixcblx0XHRcdFx0fSxcblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdldCBCdXR0b24gc3R5bGVzIEpTWCBjb2RlLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgICAgICAgICAgICAgIEJsb2NrIHByb3BlcnRpZXMuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGhhbmRsZXJzICAgICAgICAgICBCbG9jayBldmVudCBoYW5kbGVycy5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gc2l6ZU9wdGlvbnMgICAgICAgIFNpemUgc2VsZWN0b3Igb3B0aW9ucy5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gZm9ybVNlbGVjdG9yQ29tbW9uIEZvcm0gc2VsZWN0b3IgY29tbW9uIG9iamVjdC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge09iamVjdH0gIEJ1dHRvbiBzdHlsZXMgSlNYIGNvZGUuXG5cdFx0ICovXG5cdFx0Z2V0QnV0dG9uU3R5bGVzKCBwcm9wcywgaGFuZGxlcnMsIHNpemVPcHRpb25zLCBmb3JtU2VsZWN0b3JDb21tb24gKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxpbmVzLXBlci1mdW5jdGlvblxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0PFBhbmVsQm9keSBjbGFzc05hbWU9eyBmb3JtU2VsZWN0b3JDb21tb24uZ2V0UGFuZWxDbGFzcyggcHJvcHMgKSB9IHRpdGxlPXsgc3RyaW5ncy5idXR0b25fc3R5bGVzIH0+XG5cdFx0XHRcdFx0PEZsZXggZ2FwPXsgNCB9IGFsaWduPVwiZmxleC1zdGFydFwiIGNsYXNzTmFtZT17ICd3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWZsZXgnIH0ganVzdGlmeT1cInNwYWNlLWJldHdlZW5cIj5cblx0XHRcdFx0XHRcdDxGbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHRcdDxTZWxlY3RDb250cm9sXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw9eyBzdHJpbmdzLnNpemUgfVxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlPXsgcHJvcHMuYXR0cmlidXRlcy5idXR0b25TaXplIH1cblx0XHRcdFx0XHRcdFx0XHRvcHRpb25zPXsgc2l6ZU9wdGlvbnMgfVxuXHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsgKCB2YWx1ZSApID0+IGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2J1dHRvblNpemUnLCB2YWx1ZSApIH1cblx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdDwvRmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0PEZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdFx0PFNlbGVjdENvbnRyb2xcblx0XHRcdFx0XHRcdFx0XHRsYWJlbD17IHN0cmluZ3MuYm9yZGVyIH1cblx0XHRcdFx0XHRcdFx0XHR2YWx1ZT17IHByb3BzLmF0dHJpYnV0ZXMuYnV0dG9uQm9yZGVyU3R5bGUgfVxuXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnM9e1xuXHRcdFx0XHRcdFx0XHRcdFx0W1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzdHJpbmdzLm5vbmUsIHZhbHVlOiAnbm9uZScgfSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0eyBsYWJlbDogc3RyaW5ncy5zb2xpZCwgdmFsdWU6ICdzb2xpZCcgfSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0eyBsYWJlbDogc3RyaW5ncy5kYXNoZWQsIHZhbHVlOiAnZGFzaGVkJyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzdHJpbmdzLmRvdHRlZCwgdmFsdWU6ICdkb3R0ZWQnIH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsgKCB2YWx1ZSApID0+IGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2J1dHRvbkJvcmRlclN0eWxlJywgdmFsdWUgKSB9XG5cdFx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHQ8L0ZsZXhCbG9jaz5cblx0XHRcdFx0XHQ8L0ZsZXg+XG5cdFx0XHRcdFx0PEZsZXggZ2FwPXsgNCB9IGFsaWduPVwiZmxleC1zdGFydFwiIGNsYXNzTmFtZT17ICd3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWZsZXgnIH0ganVzdGlmeT1cInNwYWNlLWJldHdlZW5cIj5cblx0XHRcdFx0XHRcdDxGbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHRcdDxfX2V4cGVyaW1lbnRhbFVuaXRDb250cm9sXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw9eyBzdHJpbmdzLmJvcmRlcl9zaXplIH1cblx0XHRcdFx0XHRcdFx0XHR2YWx1ZT17IHByb3BzLmF0dHJpYnV0ZXMuYnV0dG9uQm9yZGVyU3R5bGUgPT09ICdub25lJyA/ICcnIDogcHJvcHMuYXR0cmlidXRlcy5idXR0b25Cb3JkZXJTaXplIH1cblx0XHRcdFx0XHRcdFx0XHRtaW49eyAwIH1cblx0XHRcdFx0XHRcdFx0XHRkaXNhYmxlZD17IHByb3BzLmF0dHJpYnV0ZXMuYnV0dG9uQm9yZGVyU3R5bGUgPT09ICdub25lJyB9XG5cdFx0XHRcdFx0XHRcdFx0b25DaGFuZ2U9eyAoIHZhbHVlICkgPT4gaGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAnYnV0dG9uQm9yZGVyU2l6ZScsIHZhbHVlICkgfVxuXHRcdFx0XHRcdFx0XHRcdGlzVW5pdFNlbGVjdFRhYmJhYmxlXG5cdFx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHQ8L0ZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdDxGbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHRcdDxfX2V4cGVyaW1lbnRhbFVuaXRDb250cm9sXG5cdFx0XHRcdFx0XHRcdFx0b25DaGFuZ2U9eyAoIHZhbHVlICkgPT4gaGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAnYnV0dG9uQm9yZGVyUmFkaXVzJywgdmFsdWUgKSB9XG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw9eyBzdHJpbmdzLmJvcmRlcl9yYWRpdXMgfVxuXHRcdFx0XHRcdFx0XHRcdG1pbj17IDAgfVxuXHRcdFx0XHRcdFx0XHRcdGlzVW5pdFNlbGVjdFRhYmJhYmxlXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU9eyBwcm9wcy5hdHRyaWJ1dGVzLmJ1dHRvbkJvcmRlclJhZGl1cyB9IC8+XG5cdFx0XHRcdFx0XHQ8L0ZsZXhCbG9jaz5cblx0XHRcdFx0XHQ8L0ZsZXg+XG5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItY29sb3ItcGlja2VyXCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItY29udHJvbC1sYWJlbFwiPnsgc3RyaW5ncy5jb2xvcnMgfTwvZGl2PlxuXHRcdFx0XHRcdFx0PFBhbmVsQ29sb3JTZXR0aW5nc1xuXHRcdFx0XHRcdFx0XHRfX2V4cGVyaW1lbnRhbElzUmVuZGVyZWRJblNpZGViYXJcblx0XHRcdFx0XHRcdFx0ZW5hYmxlQWxwaGFcblx0XHRcdFx0XHRcdFx0c2hvd1RpdGxlPXsgZmFsc2UgfVxuXHRcdFx0XHRcdFx0XHRjbGFzc05hbWU9eyBmb3JtU2VsZWN0b3JDb21tb24uZ2V0Q29sb3JQYW5lbENsYXNzKCBwcm9wcy5hdHRyaWJ1dGVzLmJ1dHRvbkJvcmRlclN0eWxlICkgfVxuXHRcdFx0XHRcdFx0XHRjb2xvclNldHRpbmdzPXsgW1xuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBwcm9wcy5hdHRyaWJ1dGVzLmJ1dHRvbkJhY2tncm91bmRDb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlOiAoIHZhbHVlICkgPT4gaGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAnYnV0dG9uQmFja2dyb3VuZENvbG9yJywgdmFsdWUgKSxcblx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBzdHJpbmdzLmJhY2tncm91bmQsXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogcHJvcHMuYXR0cmlidXRlcy5idXR0b25Cb3JkZXJDb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlOiAoIHZhbHVlICkgPT4gaGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAnYnV0dG9uQm9yZGVyQ29sb3InLCB2YWx1ZSApLFxuXHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IHN0cmluZ3MuYm9yZGVyLFxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHByb3BzLmF0dHJpYnV0ZXMuYnV0dG9uVGV4dENvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0b25DaGFuZ2U6ICggdmFsdWUgKSA9PiBoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdidXR0b25UZXh0Q29sb3InLCB2YWx1ZSApLFxuXHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IHN0cmluZ3MudGV4dCxcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRdIH0gLz5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1sZWdlbmQgd3Bmb3Jtcy1idXR0b24tY29sb3Itbm90aWNlXCI+XG5cdFx0XHRcdFx0XHRcdHsgc3RyaW5ncy5idXR0b25fY29sb3Jfbm90aWNlIH1cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L1BhbmVsQm9keT5cblx0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
},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/* global jconfirm, wpforms_gutenberg_form_selector, Choices, JSX, DOM, WPFormsUtils */
/* jshint es3: false, esversion: 6 */
/**
 * @param strings.copy_paste_error
 * @param strings.error_message
 * @param strings.form_edit
 * @param strings.form_entries
 * @param strings.form_keywords
 * @param strings.form_select
 * @param strings.form_selected
 * @param strings.form_settings
 * @param strings.label_styles
 * @param strings.other_styles
 * @param strings.page_break
 * @param strings.panel_notice_head
 * @param strings.panel_notice_link
 * @param strings.panel_notice_link_text
 * @param strings.panel_notice_text
 * @param strings.show_description
 * @param strings.show_title
 * @param strings.sublabel_hints
 * @param strings.form_not_available_message
 * @param urls.entries_url
 * @param urls.form_url
 * @param window.wpforms_choicesjs_config
 * @param wpforms_education.upgrade_bonus
 * @param wpforms_gutenberg_form_selector.block_empty_url
 * @param wpforms_gutenberg_form_selector.block_preview_url
 * @param wpforms_gutenberg_form_selector.get_started_url
 * @param wpforms_gutenberg_form_selector.is_full_styling
 * @param wpforms_gutenberg_form_selector.is_modern_markup
 * @param wpforms_gutenberg_form_selector.logo_url
 * @param wpforms_gutenberg_form_selector.wpforms_guide
 */
/**
 * Gutenberg editor block.
 *
 * Common module.
 *
 * @since 1.8.8
 */
var _default = exports.default = function (document, window, $) {
  /**
   * WP core components.
   *
   * @since 1.8.8
   */
  var _wp = wp,
    _wp$serverSideRender = _wp.serverSideRender,
    ServerSideRender = _wp$serverSideRender === void 0 ? wp.components.ServerSideRender : _wp$serverSideRender;
  var _wp$element = wp.element,
    createElement = _wp$element.createElement,
    Fragment = _wp$element.Fragment,
    createInterpolateElement = _wp$element.createInterpolateElement;
  var registerBlockType = wp.blocks.registerBlockType;
  var _ref = wp.blockEditor || wp.editor,
    InspectorControls = _ref.InspectorControls,
    PanelColorSettings = _ref.PanelColorSettings;
  var _wp$components = wp.components,
    SelectControl = _wp$components.SelectControl,
    ToggleControl = _wp$components.ToggleControl,
    PanelBody = _wp$components.PanelBody,
    Placeholder = _wp$components.Placeholder;
  var __ = wp.i18n.__;

  /**
   * Localized data aliases.
   *
   * @since 1.8.8
   */
  var _wpforms_gutenberg_fo = wpforms_gutenberg_form_selector,
    strings = _wpforms_gutenberg_fo.strings,
    defaults = _wpforms_gutenberg_fo.defaults,
    sizes = _wpforms_gutenberg_fo.sizes,
    urls = _wpforms_gutenberg_fo.urls,
    isPro = _wpforms_gutenberg_fo.isPro,
    isLicenseActive = _wpforms_gutenberg_fo.isLicenseActive,
    isAdmin = _wpforms_gutenberg_fo.isAdmin;
  var defaultStyleSettings = defaults;

  // noinspection JSUnusedLocalSymbols
  /**
   * WPForms Education script.
   *
   * @since 1.8.8
   */
  var WPFormsEducation = window.WPFormsEducation || {}; // eslint-disable-line no-unused-vars

  /**
   * List of forms.
   *
   * The default value is localized in FormSelector.php.
   *
   * @since 1.8.4
   *
   * @type {Object}
   */
  var formList = wpforms_gutenberg_form_selector.forms;

  /**
   * Blocks runtime data.
   *
   * @since 1.8.1
   *
   * @type {Object}
   */
  var blocks = {};

  /**
   * Whether it is needed to trigger server rendering.
   *
   * @since 1.8.1
   *
   * @type {boolean}
   */
  var triggerServerRender = true;

  /**
   * Popup container.
   *
   * @since 1.8.3
   *
   * @type {Object}
   */
  var $popup = {};

  /**
   * Track fetch status.
   *
   * @since 1.8.4
   *
   * @type {boolean}
   */
  var isFetching = false;

  /**
   * Elements holder.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var el = {};

  /**
   * Common block attributes.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var commonAttributes = {
    clientId: {
      type: 'string',
      default: ''
    },
    formId: {
      type: 'string',
      default: defaultStyleSettings.formId
    },
    displayTitle: {
      type: 'boolean',
      default: defaultStyleSettings.displayTitle
    },
    displayDesc: {
      type: 'boolean',
      default: defaultStyleSettings.displayDesc
    },
    preview: {
      type: 'boolean'
    },
    theme: {
      type: 'string',
      default: defaultStyleSettings.theme
    },
    themeName: {
      type: 'string',
      default: defaultStyleSettings.themeName
    },
    labelSize: {
      type: 'string',
      default: defaultStyleSettings.labelSize
    },
    labelColor: {
      type: 'string',
      default: defaultStyleSettings.labelColor
    },
    labelSublabelColor: {
      type: 'string',
      default: defaultStyleSettings.labelSublabelColor
    },
    labelErrorColor: {
      type: 'string',
      default: defaultStyleSettings.labelErrorColor
    },
    pageBreakColor: {
      type: 'string',
      default: defaultStyleSettings.pageBreakColor
    },
    customCss: {
      type: 'string',
      default: defaultStyleSettings.customCss
    },
    copyPasteJsonValue: {
      type: 'string',
      default: defaultStyleSettings.copyPasteJsonValue
    }
  };

  /**
   * Handlers for custom styles settings, defined outside this module.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var customStylesHandlers = {};

  /**
   * Dropdown timeout.
   *
   * @since 1.8.8
   *
   * @type {number}
   */
  var dropdownTimeout;

  /**
   * Whether copy-paste content was generated on edit.
   *
   * @since 1.9.1
   *
   * @type {boolean}
   */
  var isCopyPasteGeneratedOnEdit = false;

  /**
   * Public functions and properties.
   *
   * @since 1.8.1
   *
   * @type {Object}
   */
  var app = {
    /**
     * Panel modules.
     *
     * @since 1.8.8
     *
     * @type {Object}
     */
    panels: {},
    /**
     * Start the engine.
     *
     * @since 1.8.1
     *
     * @param {Object} blockOptions Block options.
     */
    init: function init(blockOptions) {
      el.$window = $(window);
      app.panels = blockOptions.panels;
      app.education = blockOptions.education;
      app.initDefaults(blockOptions);
      app.registerBlock(blockOptions);
      app.initJConfirm();
      $(app.ready);
    },
    /**
     * Document ready.
     *
     * @since 1.8.1
     */
    ready: function ready() {
      app.events();
    },
    /**
     * Events.
     *
     * @since 1.8.1
     */
    events: function events() {
      el.$window.on('wpformsFormSelectorEdit', _.debounce(app.blockEdit, 250)).on('wpformsFormSelectorFormLoaded', app.formLoaded);
    },
    /**
     * Init jConfirm.
     *
     * @since 1.8.8
     */
    initJConfirm: function initJConfirm() {
      // jquery-confirm defaults.
      jconfirm.defaults = {
        closeIcon: false,
        backgroundDismiss: false,
        escapeKey: true,
        animationBounce: 1,
        useBootstrap: false,
        theme: 'modern',
        boxWidth: '400px',
        animateFromElement: false
      };
    },
    /**
     * Get a fresh list of forms via REST-API.
     *
     * @since 1.8.4
     *
     * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-api-fetch/
     */
    getForms: function getForms() {
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!isFetching) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return");
            case 2:
              // Set the flag to true indicating a fetch is in progress.
              isFetching = true;
              _context.prev = 3;
              _context.next = 6;
              return wp.apiFetch({
                path: wpforms_gutenberg_form_selector.route_namespace + 'forms/',
                method: 'GET',
                cache: 'no-cache'
              });
            case 6:
              formList = _context.sent;
              _context.next = 12;
              break;
            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](3);
              // eslint-disable-next-line no-console
              console.error(_context.t0);
            case 12:
              _context.prev = 12;
              isFetching = false;
              return _context.finish(12);
            case 15:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[3, 9, 12, 15]]);
      }))();
    },
    /**
     * Open builder popup.
     *
     * @since 1.6.2
     *
     * @param {string} clientID Block Client ID.
     */
    openBuilderPopup: function openBuilderPopup(clientID) {
      if ($.isEmptyObject($popup)) {
        var _parent = $('#wpwrap');
        var canvasIframe = $('iframe[name="editor-canvas"]');
        var isFseMode = Boolean(canvasIframe.length);
        var tmpl = isFseMode ? canvasIframe.contents().find('#wpforms-gutenberg-popup') : $('#wpforms-gutenberg-popup');
        _parent.after(tmpl);
        $popup = _parent.siblings('#wpforms-gutenberg-popup');
      }
      var url = wpforms_gutenberg_form_selector.get_started_url,
        $iframe = $popup.find('iframe');
      app.builderCloseButtonEvent(clientID);
      $iframe.attr('src', url);
      $popup.fadeIn();
    },
    /**
     * Close button (inside the form builder) click event.
     *
     * @since 1.8.3
     *
     * @param {string} clientID Block Client ID.
     */
    builderCloseButtonEvent: function builderCloseButtonEvent(clientID) {
      $popup.off('wpformsBuilderInPopupClose').on('wpformsBuilderInPopupClose', function (e, action, formId, formTitle) {
        if (action !== 'saved' || !formId) {
          return;
        }

        // Insert a new block when a new form is created from the popup to update the form list and attributes.
        var newBlock = wp.blocks.createBlock('wpforms/form-selector', {
          formId: formId.toString() // Expects string value, make sure we insert string.
        });

        // eslint-disable-next-line camelcase
        formList = [{
          ID: formId,
          post_title: formTitle
        }];

        // Insert a new block.
        wp.data.dispatch('core/block-editor').removeBlock(clientID);
        wp.data.dispatch('core/block-editor').insertBlocks(newBlock);
      });
    },
    /**
     * Register block.
     *
     * @since 1.8.1
     *
     * @param {Object} blockOptions Additional block options.
     */
    // eslint-disable-next-line max-lines-per-function
    registerBlock: function registerBlock(blockOptions) {
      registerBlockType('wpforms/form-selector', {
        title: strings.title,
        description: strings.description,
        icon: app.getIcon(),
        keywords: strings.form_keywords,
        category: 'widgets',
        attributes: app.getBlockAttributes(),
        supports: {
          customClassName: app.hasForms()
        },
        example: {
          attributes: {
            preview: true
          }
        },
        edit: function edit(props) {
          var attributes = props.attributes;
          var formOptions = app.getFormOptions();
          var handlers = app.getSettingsFieldsHandlers(props);

          // Store block clientId in attributes.
          if (!attributes.clientId || !app.isClientIdAttrUnique(props)) {
            // We just want the client ID to update once.
            // The block editor doesn't have a fixed block ID, so we need to get it on the initial load, but only once.
            props.setAttributes({
              clientId: props.clientId
            });
          }

          // Main block settings.
          var jsx = [app.jsxParts.getMainSettings(attributes, handlers, formOptions)];

          // Block preview picture.
          if (!app.hasForms()) {
            jsx.push(app.jsxParts.getEmptyFormsPreview(props));
            return jsx;
          }
          var sizeOptions = app.getSizeOptions();

          // Show placeholder when form is not available (trashed, deleted etc.).
          if (attributes && attributes.formId && app.isFormAvailable(attributes.formId) === false) {
            // Block placeholder (form selector).
            jsx.push(app.jsxParts.getBlockPlaceholder(props.attributes, handlers, formOptions));
            return jsx;
          }

          // Form style settings & block content.
          if (attributes.formId) {
            // Subscribe to block events.
            app.maybeSubscribeToBlockEvents(props, handlers, blockOptions);
            jsx.push(app.jsxParts.getStyleSettings(props, handlers, sizeOptions, blockOptions), app.jsxParts.getBlockFormContent(props));
            if (!isCopyPasteGeneratedOnEdit) {
              handlers.updateCopyPasteContent();
              isCopyPasteGeneratedOnEdit = true;
            }
            el.$window.trigger('wpformsFormSelectorEdit', [props]);
            return jsx;
          }

          // Block preview picture.
          if (attributes.preview) {
            jsx.push(app.jsxParts.getBlockPreview());
            return jsx;
          }

          // Block placeholder (form selector).
          jsx.push(app.jsxParts.getBlockPlaceholder(props.attributes, handlers, formOptions));
          return jsx;
        },
        save: function save() {
          return null;
        }
      });
    },
    /**
     * Init default style settings.
     *
     * @since 1.8.1
     * @since 1.8.8 Added blockOptions parameter.
     *
     * @param {Object} blockOptions Additional block options.
     */
    initDefaults: function initDefaults() {
      var blockOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      commonAttributes = _objectSpread(_objectSpread({}, commonAttributes), blockOptions.getCommonAttributes());
      customStylesHandlers = blockOptions.setStylesHandlers;
      ['formId', 'copyPasteJsonValue'].forEach(function (key) {
        return delete defaultStyleSettings[key];
      });
    },
    /**
     * Check if the site has forms.
     *
     * @since 1.8.3
     *
     * @return {boolean} Whether site has at least one form.
     */
    hasForms: function hasForms() {
      return formList.length > 0;
    },
    /**
     * Check if form is available to be previewed.
     *
     * @since 1.8.9
     *
     * @param {number} formId Form ID.
     *
     * @return {boolean} Whether form is available.
     */
    isFormAvailable: function isFormAvailable(formId) {
      return formList.find(function (_ref2) {
        var ID = _ref2.ID;
        return ID === Number(formId);
      }) !== undefined;
    },
    /**
     * Set triggerServerRender flag.
     *
     * @since 1.8.8
     *
     * @param {boolean} $flag The value of the triggerServerRender flag.
     */
    setTriggerServerRender: function setTriggerServerRender($flag) {
      triggerServerRender = Boolean($flag);
    },
    /**
     * Maybe subscribe to block events.
     *
     * @since 1.8.8
     *
     * @param {Object} subscriberProps        Subscriber block properties.
     * @param {Object} subscriberHandlers     Subscriber block event handlers.
     * @param {Object} subscriberBlockOptions Subscriber block options.
     */
    maybeSubscribeToBlockEvents: function maybeSubscribeToBlockEvents(subscriberProps, subscriberHandlers, subscriberBlockOptions) {
      var id = subscriberProps.clientId;

      // Unsubscribe from block events.
      // This is needed to avoid multiple subscriptions when the block is re-rendered.
      el.$window.off('wpformsFormSelectorDeleteTheme.' + id).off('wpformsFormSelectorUpdateTheme.' + id).off('wpformsFormSelectorSetTheme.' + id);

      // Subscribe to block events.
      el.$window.on('wpformsFormSelectorDeleteTheme.' + id, app.subscriberDeleteTheme(subscriberProps, subscriberBlockOptions)).on('wpformsFormSelectorUpdateTheme.' + id, app.subscriberUpdateTheme(subscriberProps, subscriberBlockOptions)).on('wpformsFormSelectorSetTheme.' + id, app.subscriberSetTheme(subscriberProps, subscriberBlockOptions));
    },
    /**
     * Block event `wpformsFormSelectorDeleteTheme` handler.
     *
     * @since 1.8.8
     *
     * @param {Object} subscriberProps        Subscriber block properties
     * @param {Object} subscriberBlockOptions Subscriber block options.
     *
     * @return {Function} Event handler.
     */
    subscriberDeleteTheme: function subscriberDeleteTheme(subscriberProps, subscriberBlockOptions) {
      return function (e, themeSlug, triggerProps) {
        var _subscriberProps$attr, _subscriberBlockOptio;
        if (subscriberProps.clientId === triggerProps.clientId) {
          return;
        }
        if ((subscriberProps === null || subscriberProps === void 0 || (_subscriberProps$attr = subscriberProps.attributes) === null || _subscriberProps$attr === void 0 ? void 0 : _subscriberProps$attr.theme) !== themeSlug) {
          return;
        }
        if (!(subscriberBlockOptions !== null && subscriberBlockOptions !== void 0 && (_subscriberBlockOptio = subscriberBlockOptions.panels) !== null && _subscriberBlockOptio !== void 0 && _subscriberBlockOptio.themes)) {
          return;
        }

        // Reset theme to default one.
        subscriberBlockOptions.panels.themes.setBlockTheme(subscriberProps, 'default');
      };
    },
    /**
     * Block event `wpformsFormSelectorDeleteTheme` handler.
     *
     * @since 1.8.8
     *
     * @param {Object} subscriberProps        Subscriber block properties
     * @param {Object} subscriberBlockOptions Subscriber block options.
     *
     * @return {Function} Event handler.
     */
    subscriberUpdateTheme: function subscriberUpdateTheme(subscriberProps, subscriberBlockOptions) {
      return function (e, themeSlug, themeData, triggerProps) {
        var _subscriberProps$attr2, _subscriberBlockOptio2;
        if (subscriberProps.clientId === triggerProps.clientId) {
          return;
        }
        if ((subscriberProps === null || subscriberProps === void 0 || (_subscriberProps$attr2 = subscriberProps.attributes) === null || _subscriberProps$attr2 === void 0 ? void 0 : _subscriberProps$attr2.theme) !== themeSlug) {
          return;
        }
        if (!(subscriberBlockOptions !== null && subscriberBlockOptions !== void 0 && (_subscriberBlockOptio2 = subscriberBlockOptions.panels) !== null && _subscriberBlockOptio2 !== void 0 && _subscriberBlockOptio2.themes)) {
          return;
        }

        // Reset theme to default one.
        subscriberBlockOptions.panels.themes.setBlockTheme(subscriberProps, themeSlug);
      };
    },
    /**
     * Block event `wpformsFormSelectorSetTheme` handler.
     *
     * @since 1.8.8
     *
     * @param {Object} subscriberProps        Subscriber block properties
     * @param {Object} subscriberBlockOptions Subscriber block options.
     *
     * @return {Function} Event handler.
     */
    subscriberSetTheme: function subscriberSetTheme(subscriberProps, subscriberBlockOptions) {
      // noinspection JSUnusedLocalSymbols
      return function (e, block, themeSlug, triggerProps) {
        var _subscriberBlockOptio3;
        // eslint-disable-line no-unused-vars
        if (subscriberProps.clientId === triggerProps.clientId) {
          return;
        }
        if (!(subscriberBlockOptions !== null && subscriberBlockOptions !== void 0 && (_subscriberBlockOptio3 = subscriberBlockOptions.panels) !== null && _subscriberBlockOptio3 !== void 0 && _subscriberBlockOptio3.themes)) {
          return;
        }

        // Set theme.
        subscriberBlockOptions.panels.background.onSetTheme(subscriberProps);
      };
    },
    /**
     * Block JSX parts.
     *
     * @since 1.8.1
     *
     * @type {Object}
     */
    jsxParts: {
      /**
       * Get main settings JSX code.
       *
       * @since 1.8.1
       *
       * @param {Object} attributes  Block attributes.
       * @param {Object} handlers    Block event handlers.
       * @param {Object} formOptions Form selector options.
       *
       * @return {JSX.Element} Main setting JSX code.
       */
      getMainSettings: function getMainSettings(attributes, handlers, formOptions) {
        if (!app.hasForms()) {
          return app.jsxParts.printEmptyFormsNotice(attributes.clientId);
        }
        return /*#__PURE__*/React.createElement(InspectorControls, {
          key: "wpforms-gutenberg-form-selector-inspector-main-settings"
        }, /*#__PURE__*/React.createElement(PanelBody, {
          className: "wpforms-gutenberg-panel wpforms-gutenberg-panel-form-settings",
          title: strings.form_settings
        }, /*#__PURE__*/React.createElement(SelectControl, {
          label: strings.form_selected,
          value: attributes.formId,
          options: formOptions,
          onChange: function onChange(value) {
            return handlers.attrChange('formId', value);
          }
        }), attributes.formId ? /*#__PURE__*/React.createElement("p", {
          className: "wpforms-gutenberg-form-selector-actions"
        }, /*#__PURE__*/React.createElement("a", {
          href: urls.form_url.replace('{ID}', attributes.formId),
          rel: "noreferrer",
          target: "_blank"
        }, strings.form_edit), isPro && isLicenseActive && /*#__PURE__*/React.createElement(React.Fragment, null, "\xA0\xA0|\xA0\xA0", /*#__PURE__*/React.createElement("a", {
          href: urls.entries_url.replace('{ID}', attributes.formId),
          rel: "noreferrer",
          target: "_blank"
        }, strings.form_entries))) : null, /*#__PURE__*/React.createElement(ToggleControl, {
          label: strings.show_title,
          checked: attributes.displayTitle,
          onChange: function onChange(value) {
            return handlers.attrChange('displayTitle', value);
          }
        }), /*#__PURE__*/React.createElement(ToggleControl, {
          label: strings.show_description,
          checked: attributes.displayDesc,
          onChange: function onChange(value) {
            return handlers.attrChange('displayDesc', value);
          }
        }), /*#__PURE__*/React.createElement("p", {
          className: "wpforms-gutenberg-panel-notice"
        }, /*#__PURE__*/React.createElement("strong", null, strings.panel_notice_head), strings.panel_notice_text, /*#__PURE__*/React.createElement("a", {
          href: strings.panel_notice_link,
          rel: "noreferrer",
          target: "_blank"
        }, strings.panel_notice_link_text))));
      },
      /**
       * Print empty forms notice.
       *
       * @since 1.8.3
       *
       * @param {string} clientId Block client ID.
       *
       * @return {JSX.Element} Field styles JSX code.
       */
      printEmptyFormsNotice: function printEmptyFormsNotice(clientId) {
        return /*#__PURE__*/React.createElement(InspectorControls, {
          key: "wpforms-gutenberg-form-selector-inspector-main-settings"
        }, /*#__PURE__*/React.createElement(PanelBody, {
          className: "wpforms-gutenberg-panel",
          title: strings.form_settings
        }, /*#__PURE__*/React.createElement("p", {
          className: "wpforms-gutenberg-panel-notice wpforms-warning wpforms-empty-form-notice",
          style: {
            display: 'block'
          }
        }, /*#__PURE__*/React.createElement("strong", null, __('You haven’t created a form, yet!', 'wpforms-lite')), __('What are you waiting for?', 'wpforms-lite')), /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "get-started-button components-button is-secondary",
          onClick: function onClick() {
            app.openBuilderPopup(clientId);
          }
        }, __('Get Started', 'wpforms-lite'))));
      },
      /**
       * Get Label styles JSX code.
       *
       * @since 1.8.1
       *
       * @param {Object} props       Block properties.
       * @param {Object} handlers    Block event handlers.
       * @param {Object} sizeOptions Size selector options.
       *
       * @return {Object} Label styles JSX code.
       */
      getLabelStyles: function getLabelStyles(props, handlers, sizeOptions) {
        return /*#__PURE__*/React.createElement(PanelBody, {
          className: app.getPanelClass(props),
          title: strings.label_styles
        }, /*#__PURE__*/React.createElement(SelectControl, {
          label: strings.size,
          value: props.attributes.labelSize,
          className: "wpforms-gutenberg-form-selector-fix-bottom-margin",
          options: sizeOptions,
          onChange: function onChange(value) {
            return handlers.styleAttrChange('labelSize', value);
          }
        }), /*#__PURE__*/React.createElement("div", {
          className: "wpforms-gutenberg-form-selector-color-picker"
        }, /*#__PURE__*/React.createElement("div", {
          className: "wpforms-gutenberg-form-selector-control-label"
        }, strings.colors), /*#__PURE__*/React.createElement(PanelColorSettings, {
          __experimentalIsRenderedInSidebar: true,
          enableAlpha: true,
          showTitle: false,
          className: "wpforms-gutenberg-form-selector-color-panel",
          colorSettings: [{
            value: props.attributes.labelColor,
            onChange: function onChange(value) {
              return handlers.styleAttrChange('labelColor', value);
            },
            label: strings.label
          }, {
            value: props.attributes.labelSublabelColor,
            onChange: function onChange(value) {
              return handlers.styleAttrChange('labelSublabelColor', value);
            },
            label: strings.sublabel_hints.replace('&amp;', '&')
          }, {
            value: props.attributes.labelErrorColor,
            onChange: function onChange(value) {
              return handlers.styleAttrChange('labelErrorColor', value);
            },
            label: strings.error_message
          }]
        })));
      },
      /**
       * Get Page Indicator styles JSX code.
       *
       * @since 1.8.7
       *
       * @param {Object} props    Block properties.
       * @param {Object} handlers Block event handlers.
       *
       * @return {Object} Page Indicator styles JSX code.
       */
      getPageIndicatorStyles: function getPageIndicatorStyles(props, handlers) {
        // eslint-disable-line complexity
        var hasPageBreak = app.hasPageBreak(formList, props.attributes.formId);
        var hasRating = app.hasRating(formList, props.attributes.formId);
        if (!hasPageBreak && !hasRating) {
          return null;
        }
        var label = '';
        if (hasPageBreak && hasRating) {
          label = "".concat(strings.page_break, " / ").concat(strings.rating);
        } else if (hasPageBreak) {
          label = strings.page_break;
        } else if (hasRating) {
          label = strings.rating;
        }
        return /*#__PURE__*/React.createElement(PanelBody, {
          className: app.getPanelClass(props),
          title: strings.other_styles
        }, /*#__PURE__*/React.createElement("div", {
          className: "wpforms-gutenberg-form-selector-color-picker"
        }, /*#__PURE__*/React.createElement("div", {
          className: "wpforms-gutenberg-form-selector-control-label"
        }, strings.colors), /*#__PURE__*/React.createElement(PanelColorSettings, {
          __experimentalIsRenderedInSidebar: true,
          enableAlpha: true,
          showTitle: false,
          className: "wpforms-gutenberg-form-selector-color-panel",
          colorSettings: [{
            value: props.attributes.pageBreakColor,
            onChange: function onChange(value) {
              return handlers.styleAttrChange('pageBreakColor', value);
            },
            label: label
          }]
        })));
      },
      /**
       * Get style settings JSX code.
       *
       * @since 1.8.1
       *
       * @param {Object} props        Block properties.
       * @param {Object} handlers     Block event handlers.
       * @param {Object} sizeOptions  Size selector options.
       * @param {Object} blockOptions Block options loaded from external modules.
       *
       * @return {Object} Inspector controls JSX code.
       */
      getStyleSettings: function getStyleSettings(props, handlers, sizeOptions, blockOptions) {
        return /*#__PURE__*/React.createElement(InspectorControls, {
          key: "wpforms-gutenberg-form-selector-style-settings"
        }, blockOptions.getThemesPanel(props, app, blockOptions.stockPhotos), blockOptions.getFieldStyles(props, handlers, sizeOptions, app), app.jsxParts.getLabelStyles(props, handlers, sizeOptions), blockOptions.getButtonStyles(props, handlers, sizeOptions, app), blockOptions.getContainerStyles(props, handlers, app), blockOptions.getBackgroundStyles(props, handlers, app, blockOptions.stockPhotos), app.jsxParts.getPageIndicatorStyles(props, handlers));
      },
      /**
       * Get block content JSX code.
       *
       * @since 1.8.1
       *
       * @param {Object} props Block properties.
       *
       * @return {JSX.Element} Block content JSX code.
       */
      getBlockFormContent: function getBlockFormContent(props) {
        if (triggerServerRender) {
          return /*#__PURE__*/React.createElement(ServerSideRender, {
            key: "wpforms-gutenberg-form-selector-server-side-renderer",
            block: "wpforms/form-selector",
            attributes: props.attributes
          });
        }
        var clientId = props.clientId;
        var block = app.getBlockContainer(props);

        // In the case of empty content, use server side renderer.
        // This happens when the block is duplicated or converted to a reusable block.
        if (!(block !== null && block !== void 0 && block.innerHTML)) {
          triggerServerRender = true;
          return app.jsxParts.getBlockFormContent(props);
        }
        blocks[clientId] = blocks[clientId] || {};
        blocks[clientId].blockHTML = block.innerHTML;
        blocks[clientId].loadedFormId = props.attributes.formId;
        return /*#__PURE__*/React.createElement(Fragment, {
          key: "wpforms-gutenberg-form-selector-fragment-form-html"
        }, /*#__PURE__*/React.createElement("div", {
          dangerouslySetInnerHTML: {
            __html: blocks[clientId].blockHTML
          }
        }));
      },
      /**
       * Get block preview JSX code.
       *
       * @since 1.8.1
       *
       * @return {JSX.Element} Block preview JSX code.
       */
      getBlockPreview: function getBlockPreview() {
        return /*#__PURE__*/React.createElement(Fragment, {
          key: "wpforms-gutenberg-form-selector-fragment-block-preview"
        }, /*#__PURE__*/React.createElement("img", {
          src: wpforms_gutenberg_form_selector.block_preview_url,
          style: {
            width: '100%'
          },
          alt: ""
        }));
      },
      /**
       * Get block empty JSX code.
       *
       * @since 1.8.3
       *
       * @param {Object} props Block properties.
       * @return {JSX.Element} Block empty JSX code.
       */
      getEmptyFormsPreview: function getEmptyFormsPreview(props) {
        var clientId = props.clientId;
        return /*#__PURE__*/React.createElement(Fragment, {
          key: "wpforms-gutenberg-form-selector-fragment-block-empty"
        }, /*#__PURE__*/React.createElement("div", {
          className: "wpforms-no-form-preview"
        }, /*#__PURE__*/React.createElement("img", {
          src: wpforms_gutenberg_form_selector.block_empty_url,
          alt: ""
        }), /*#__PURE__*/React.createElement("p", null, createInterpolateElement(__('You can use <b>WPForms</b> to build contact forms, surveys, payment forms, and more with just a few clicks.', 'wpforms-lite'), {
          b: /*#__PURE__*/React.createElement("strong", null)
        })), /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "get-started-button components-button is-primary",
          onClick: function onClick() {
            app.openBuilderPopup(clientId);
          }
        }, __('Get Started', 'wpforms-lite')), /*#__PURE__*/React.createElement("p", {
          className: "empty-desc"
        }, createInterpolateElement(__('Need some help? Check out our <a>comprehensive guide.</a>', 'wpforms-lite'), {
          // eslint-disable-next-line jsx-a11y/anchor-has-content
          a: /*#__PURE__*/React.createElement("a", {
            href: wpforms_gutenberg_form_selector.wpforms_guide,
            target: "_blank",
            rel: "noopener noreferrer"
          })
        })), /*#__PURE__*/React.createElement("div", {
          id: "wpforms-gutenberg-popup",
          className: "wpforms-builder-popup"
        }, /*#__PURE__*/React.createElement("iframe", {
          src: "about:blank",
          width: "100%",
          height: "100%",
          id: "wpforms-builder-iframe",
          title: "WPForms Builder Popup"
        }))));
      },
      /**
       * Get block placeholder (form selector) JSX code.
       *
       * @since 1.8.1
       *
       * @param {Object} attributes  Block attributes.
       * @param {Object} handlers    Block event handlers.
       * @param {Object} formOptions Form selector options.
       *
       * @return {JSX.Element} Block placeholder JSX code.
       */
      getBlockPlaceholder: function getBlockPlaceholder(attributes, handlers, formOptions) {
        var isFormNotAvailable = attributes.formId && !app.isFormAvailable(attributes.formId);
        return /*#__PURE__*/React.createElement(Placeholder, {
          key: "wpforms-gutenberg-form-selector-wrap",
          className: "wpforms-gutenberg-form-selector-wrap"
        }, /*#__PURE__*/React.createElement("img", {
          src: wpforms_gutenberg_form_selector.logo_url,
          alt: ""
        }), isFormNotAvailable && /*#__PURE__*/React.createElement("p", {
          style: {
            textAlign: 'center',
            marginTop: '0'
          }
        }, strings.form_not_available_message), /*#__PURE__*/React.createElement(SelectControl, {
          key: "wpforms-gutenberg-form-selector-select-control",
          value: attributes.formId,
          options: formOptions,
          onChange: function onChange(value) {
            return handlers.attrChange('formId', value);
          }
        }));
      }
    },
    /**
     * Determine if the form has a Page Break field.
     *
     * @since 1.8.7
     *
     * @param {Object}        forms  The forms' data object.
     * @param {number|string} formId Form ID.
     *
     * @return {boolean} True when the form has a Page Break field, false otherwise.
     */
    hasPageBreak: function hasPageBreak(forms, formId) {
      var _JSON$parse;
      var currentForm = forms.find(function (form) {
        return parseInt(form.ID, 10) === parseInt(formId, 10);
      });
      if (!currentForm.post_content) {
        return false;
      }
      var fields = (_JSON$parse = JSON.parse(currentForm.post_content)) === null || _JSON$parse === void 0 ? void 0 : _JSON$parse.fields;
      return Object.values(fields).some(function (field) {
        return field.type === 'pagebreak';
      });
    },
    hasRating: function hasRating(forms, formId) {
      var _JSON$parse2;
      var currentForm = forms.find(function (form) {
        return parseInt(form.ID, 10) === parseInt(formId, 10);
      });
      if (!currentForm.post_content || !isPro || !isLicenseActive) {
        return false;
      }
      var fields = (_JSON$parse2 = JSON.parse(currentForm.post_content)) === null || _JSON$parse2 === void 0 ? void 0 : _JSON$parse2.fields;
      return Object.values(fields).some(function (field) {
        return field.type === 'rating';
      });
    },
    /**
     * Get Style Settings panel class.
     *
     * @since 1.8.1
     *
     * @param {Object} props Block properties.
     * @param {string} panel Panel name.
     *
     * @return {string} Style Settings panel class.
     */
    getPanelClass: function getPanelClass(props) {
      var panel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var cssClass = 'wpforms-gutenberg-panel wpforms-block-settings-' + props.clientId;
      if (!app.isFullStylingEnabled()) {
        cssClass += ' disabled_panel';
      }

      // Restrict styling panel for non-admins.
      if (!(isAdmin || panel === 'themes')) {
        cssClass += ' wpforms-gutenberg-panel-restricted';
      }
      return cssClass;
    },
    /**
     * Get color panel settings CSS class.
     *
     * @since 1.8.8
     *
     * @param {string} borderStyle Border style value.
     *
     * @return {string} Style Settings panel class.
     */
    getColorPanelClass: function getColorPanelClass(borderStyle) {
      var cssClass = 'wpforms-gutenberg-form-selector-color-panel';
      if (borderStyle === 'none') {
        cssClass += ' wpforms-gutenberg-form-selector-border-color-disabled';
      }
      return cssClass;
    },
    /**
     * Determine whether the full styling is enabled.
     *
     * @since 1.8.1
     *
     * @return {boolean} Whether the full styling is enabled.
     */
    isFullStylingEnabled: function isFullStylingEnabled() {
      return wpforms_gutenberg_form_selector.is_modern_markup && wpforms_gutenberg_form_selector.is_full_styling;
    },
    /**
     * Determine whether the block has lead forms enabled.
     *
     * @since 1.9.0
     *
     * @param {Object} block Gutenberg block
     *
     * @return {boolean} Whether the block has lead forms enabled
     */
    isLeadFormsEnabled: function isLeadFormsEnabled(block) {
      if (!block) {
        return false;
      }
      var $form = $(block.querySelector('.wpforms-container'));
      return $form.hasClass('wpforms-lead-forms-container');
    },
    /**
     * Get block container DOM element.
     *
     * @since 1.8.1
     *
     * @param {Object} props Block properties.
     *
     * @return {Element} Block container.
     */
    getBlockContainer: function getBlockContainer(props) {
      var blockSelector = "#block-".concat(props.clientId, " > div");
      var block = document.querySelector(blockSelector);

      // For FSE / Gutenberg plugin, we need to take a look inside the iframe.
      if (!block) {
        var editorCanvas = document.querySelector('iframe[name="editor-canvas"]');
        block = editorCanvas === null || editorCanvas === void 0 ? void 0 : editorCanvas.contentWindow.document.querySelector(blockSelector);
      }
      return block;
    },
    /**
     * Update CSS variable(s) value(s) of the given attribute for given container on the preview.
     *
     * @since 1.8.8
     *
     * @param {string}  attribute Style attribute: field-size, label-size, button-size, etc.
     * @param {string}  value     Property new value.
     * @param {Element} container Form container.
     * @param {Object}  props     Block properties.
     */
    updatePreviewCSSVarValue: function updatePreviewCSSVarValue(attribute, value, container, props) {
      // eslint-disable-line complexity, max-lines-per-function
      if (!container || !attribute) {
        return;
      }
      var property = attribute.replace(/[A-Z]/g, function (letter) {
        return "-".concat(letter.toLowerCase());
      });
      if (typeof customStylesHandlers[property] === 'function') {
        customStylesHandlers[property](container, value);
        return;
      }
      switch (property) {
        case 'field-size':
        case 'label-size':
        case 'button-size':
        case 'container-shadow-size':
          for (var key in sizes[property][value]) {
            container.style.setProperty("--wpforms-".concat(property, "-").concat(key), sizes[property][value][key]);
          }
          break;
        case 'field-border-style':
          if (value === 'none') {
            app.toggleFieldBorderNoneCSSVarValue(container, true);
          } else {
            app.toggleFieldBorderNoneCSSVarValue(container, false);
            container.style.setProperty("--wpforms-".concat(property), value);
          }
          break;
        case 'button-background-color':
          app.maybeUpdateAccentColor(props.attributes.buttonBorderColor, value, container);
          value = app.maybeSetButtonAltBackgroundColor(value, props.attributes.buttonBorderColor, container);
          app.maybeSetButtonAltTextColor(props.attributes.buttonTextColor, value, props.attributes.buttonBorderColor, container);
          container.style.setProperty("--wpforms-".concat(property), value);
          break;
        case 'button-border-color':
          app.maybeUpdateAccentColor(value, props.attributes.buttonBackgroundColor, container);
          app.maybeSetButtonAltTextColor(props.attributes.buttonTextColor, props.attributes.buttonBackgroundColor, value, container);
          container.style.setProperty("--wpforms-".concat(property), value);
          break;
        case 'button-text-color':
          app.maybeSetButtonAltTextColor(value, props.attributes.buttonBackgroundColor, props.attributes.buttonBorderColor, container);
          container.style.setProperty("--wpforms-".concat(property), value);
          break;
        default:
          container.style.setProperty("--wpforms-".concat(property), value);
          container.style.setProperty("--wpforms-".concat(property, "-spare"), value);
      }
    },
    /**
     * Set/unset field border vars in case of border-style is none.
     *
     * @since 1.8.8
     *
     * @param {Object}  container Form container.
     * @param {boolean} set       True when set, false when unset.
     */
    toggleFieldBorderNoneCSSVarValue: function toggleFieldBorderNoneCSSVarValue(container, set) {
      var cont = container.querySelector('form');
      if (set) {
        cont.style.setProperty('--wpforms-field-border-style', 'solid');
        cont.style.setProperty('--wpforms-field-border-size', '1px');
        cont.style.setProperty('--wpforms-field-border-color', 'transparent');
        return;
      }
      cont.style.setProperty('--wpforms-field-border-style', null);
      cont.style.setProperty('--wpforms-field-border-size', null);
      cont.style.setProperty('--wpforms-field-border-color', null);
    },
    /**
     * Maybe set the button's alternative background color.
     *
     * @since 1.8.8
     *
     * @param {string} value             Attribute value.
     * @param {string} buttonBorderColor Button border color.
     * @param {Object} container         Form container.
     *
     * @return {string|*} New background color.
     */
    maybeSetButtonAltBackgroundColor: function maybeSetButtonAltBackgroundColor(value, buttonBorderColor, container) {
      // Setting css property value to child `form` element overrides the parent property value.
      var form = container.querySelector('form');
      form.style.setProperty('--wpforms-button-background-color-alt', value);
      if (WPFormsUtils.cssColorsUtils.isTransparentColor(value)) {
        return WPFormsUtils.cssColorsUtils.isTransparentColor(buttonBorderColor) ? defaultStyleSettings.buttonBackgroundColor : buttonBorderColor;
      }
      return value;
    },
    /**
     * Maybe set the button's alternative text color.
     *
     * @since 1.8.8
     *
     * @param {string} value                 Attribute value.
     * @param {string} buttonBackgroundColor Button background color.
     * @param {string} buttonBorderColor     Button border color.
     * @param {Object} container             Form container.
     */
    maybeSetButtonAltTextColor: function maybeSetButtonAltTextColor(value, buttonBackgroundColor, buttonBorderColor, container) {
      var form = container.querySelector('form');
      var altColor = null;
      value = value.toLowerCase();
      if (WPFormsUtils.cssColorsUtils.isTransparentColor(value) || value === buttonBackgroundColor || WPFormsUtils.cssColorsUtils.isTransparentColor(buttonBackgroundColor) && value === buttonBorderColor) {
        altColor = WPFormsUtils.cssColorsUtils.getContrastColor(buttonBackgroundColor);
      }
      container.style.setProperty("--wpforms-button-text-color-alt", value);
      form.style.setProperty("--wpforms-button-text-color-alt", altColor);
    },
    /**
     * Maybe update accent color.
     *
     * @since 1.8.8
     *
     * @param {string} color                 Color value.
     * @param {string} buttonBackgroundColor Button background color.
     * @param {Object} container             Form container.
     */
    maybeUpdateAccentColor: function maybeUpdateAccentColor(color, buttonBackgroundColor, container) {
      // Setting css property value to child `form` element overrides the parent property value.
      var form = container.querySelector('form');

      // Fallback to default color if the border color is transparent.
      color = WPFormsUtils.cssColorsUtils.isTransparentColor(color) ? defaultStyleSettings.buttonBackgroundColor : color;
      if (WPFormsUtils.cssColorsUtils.isTransparentColor(buttonBackgroundColor)) {
        form.style.setProperty('--wpforms-button-background-color-alt', 'rgba( 0, 0, 0, 0 )');
        form.style.setProperty('--wpforms-button-background-color', color);
      } else {
        container.style.setProperty('--wpforms-button-background-color-alt', buttonBackgroundColor);
        form.style.setProperty('--wpforms-button-background-color-alt', null);
        form.style.setProperty('--wpforms-button-background-color', null);
      }
    },
    /**
     * Get settings fields event handlers.
     *
     * @since 1.8.1
     *
     * @param {Object} props Block properties.
     *
     * @return {Object} Object that contains event handlers for the settings fields.
     */
    getSettingsFieldsHandlers: function getSettingsFieldsHandlers(props) {
      // eslint-disable-line max-lines-per-function
      return {
        /**
         * Field style attribute change event handler.
         *
         * @since 1.8.1
         *
         * @param {string} attribute Attribute name.
         * @param {string} value     New attribute value.
         */
        styleAttrChange: function styleAttrChange(attribute, value) {
          var block = app.getBlockContainer(props),
            container = block.querySelector("#wpforms-".concat(props.attributes.formId)),
            setAttr = {};

          // Unset the color means setting the transparent color.
          if (attribute.includes('Color')) {
            var _value;
            value = (_value = value) !== null && _value !== void 0 ? _value : 'rgba( 0, 0, 0, 0 )';
          }
          app.updatePreviewCSSVarValue(attribute, value, container, props);
          setAttr[attribute] = value;
          app.setBlockRuntimeStateVar(props.clientId, 'prevAttributesState', props.attributes);
          props.setAttributes(setAttr);
          triggerServerRender = false;
          this.updateCopyPasteContent();
          app.panels.themes.updateCustomThemeAttribute(attribute, value, props);
          this.maybeToggleDropdown(props, attribute);

          // Trigger event for developers.
          el.$window.trigger('wpformsFormSelectorStyleAttrChange', [block, props, attribute, value]);
        },
        /**
         * Handles the toggling of the dropdown menu's visibility.
         *
         * @since 1.8.8
         *
         * @param {Object} props     The block properties.
         * @param {string} attribute The name of the attribute being changed.
         */
        maybeToggleDropdown: function maybeToggleDropdown(props, attribute) {
          var _this = this;
          // eslint-disable-line no-shadow
          var formId = props.attributes.formId;
          var menu = document.querySelector("#wpforms-form-".concat(formId, " .choices__list.choices__list--dropdown"));
          var classicMenu = document.querySelector("#wpforms-form-".concat(formId, " .wpforms-field-select-style-classic select"));
          if (attribute === 'fieldMenuColor') {
            if (menu) {
              menu.classList.add('is-active');
              menu.parentElement.classList.add('is-open');
            } else {
              this.showClassicMenu(classicMenu);
            }
            clearTimeout(dropdownTimeout);
            dropdownTimeout = setTimeout(function () {
              var toClose = document.querySelector("#wpforms-form-".concat(formId, " .choices__list.choices__list--dropdown"));
              if (toClose) {
                toClose.classList.remove('is-active');
                toClose.parentElement.classList.remove('is-open');
              } else {
                _this.hideClassicMenu(document.querySelector("#wpforms-form-".concat(formId, " .wpforms-field-select-style-classic select")));
              }
            }, 5000);
          } else if (menu) {
            menu.classList.remove('is-active');
          } else {
            this.hideClassicMenu(classicMenu);
          }
        },
        /**
         * Shows the classic menu.
         *
         * @since 1.8.8
         *
         * @param {Object} classicMenu The classic menu.
         */
        showClassicMenu: function showClassicMenu(classicMenu) {
          if (!classicMenu) {
            return;
          }
          classicMenu.size = 2;
          classicMenu.style.cssText = 'padding-top: 40px; padding-inline-end: 0; padding-inline-start: 0; position: relative;';
          classicMenu.querySelectorAll('option').forEach(function (option) {
            option.style.cssText = 'border-left: 1px solid #8c8f94; border-right: 1px solid #8c8f94; padding: 0 10px; z-index: 999999; position: relative;';
          });
          classicMenu.querySelector('option:last-child').style.cssText = 'border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; padding: 0 10px; border-left: 1px solid #8c8f94; border-right: 1px solid #8c8f94; border-bottom: 1px solid #8c8f94; z-index: 999999; position: relative;';
        },
        /**
         * Hides the classic menu.
         *
         * @since 1.8.8
         *
         * @param {Object} classicMenu The classic menu.
         */
        hideClassicMenu: function hideClassicMenu(classicMenu) {
          if (!classicMenu) {
            return;
          }
          classicMenu.size = 0;
          classicMenu.style.cssText = 'padding-top: 0; padding-inline-end: 24px; padding-inline-start: 12px; position: relative;';
          classicMenu.querySelectorAll('option').forEach(function (option) {
            option.style.cssText = 'border: none;';
          });
        },
        /**
         * Field regular attribute change event handler.
         *
         * @since 1.8.1
         *
         * @param {string} attribute Attribute name.
         * @param {string} value     New attribute value.
         */
        attrChange: function attrChange(attribute, value) {
          var setAttr = {};
          setAttr[attribute] = value;
          app.setBlockRuntimeStateVar(props.clientId, 'prevAttributesState', props.attributes);
          props.setAttributes(setAttr);
          triggerServerRender = true;
          this.updateCopyPasteContent();
        },
        /**
         * Update content of the "Copy/Paste" fields.
         *
         * @since 1.8.1
         */
        updateCopyPasteContent: function updateCopyPasteContent() {
          var content = {};
          var atts = wp.data.select('core/block-editor').getBlockAttributes(props.clientId);
          for (var key in defaultStyleSettings) {
            content[key] = atts[key];
          }
          props.setAttributes({
            copyPasteJsonValue: JSON.stringify(content)
          });
        },
        /**
         * Paste settings handler.
         *
         * @since 1.8.1
         *
         * @param {string} value New attribute value.
         */
        pasteSettings: function pasteSettings(value) {
          value = value.trim();
          var pasteAttributes = app.parseValidateJson(value);
          if (!pasteAttributes) {
            wp.data.dispatch('core/notices').createErrorNotice(strings.copy_paste_error, {
              id: 'wpforms-json-parse-error'
            });
            this.updateCopyPasteContent();
            return;
          }
          pasteAttributes.copyPasteJsonValue = value;
          var themeSlug = app.panels.themes.maybeCreateCustomThemeFromAttributes(pasteAttributes);
          app.setBlockRuntimeStateVar(props.clientId, 'prevAttributesState', props.attributes);
          props.setAttributes(pasteAttributes);
          app.panels.themes.setBlockTheme(props, themeSlug);
          triggerServerRender = false;
        }
      };
    },
    /**
     * Parse and validate JSON string.
     *
     * @since 1.8.1
     *
     * @param {string} value JSON string.
     *
     * @return {boolean|object} Parsed JSON object OR false on error.
     */
    parseValidateJson: function parseValidateJson(value) {
      if (typeof value !== 'string') {
        return false;
      }
      var atts;
      try {
        atts = JSON.parse(value.trim());
      } catch (error) {
        atts = false;
      }
      return atts;
    },
    /**
     * Get WPForms icon DOM element.
     *
     * @since 1.8.1
     *
     * @return {DOM.element} WPForms icon DOM element.
     */
    getIcon: function getIcon() {
      return createElement('svg', {
        width: 20,
        height: 20,
        viewBox: '0 0 612 612',
        className: 'dashicon'
      }, createElement('path', {
        fill: 'currentColor',
        d: 'M544,0H68C30.445,0,0,30.445,0,68v476c0,37.556,30.445,68,68,68h476c37.556,0,68-30.444,68-68V68 C612,30.445,581.556,0,544,0z M464.44,68L387.6,120.02L323.34,68H464.44z M288.66,68l-64.26,52.02L147.56,68H288.66z M544,544H68 V68h22.1l136,92.14l79.9-64.6l79.56,64.6l136-92.14H544V544z M114.24,263.16h95.88v-48.28h-95.88V263.16z M114.24,360.4h95.88 v-48.62h-95.88V360.4z M242.76,360.4h255v-48.62h-255V360.4L242.76,360.4z M242.76,263.16h255v-48.28h-255V263.16L242.76,263.16z M368.22,457.3h129.54V408H368.22V457.3z'
      }));
    },
    /**
     * Get WPForms blocks.
     *
     * @since 1.8.8
     *
     * @return {Array} Blocks array.
     */
    getWPFormsBlocks: function getWPFormsBlocks() {
      var wpformsBlocks = wp.data.select('core/block-editor').getBlocks();
      return wpformsBlocks.filter(function (props) {
        return props.name === 'wpforms/form-selector';
      });
    },
    /**
     * Get WPForms blocks.
     *
     * @since 1.8.8
     *
     * @param {Object} props Block properties.
     *
     * @return {Object} Block attributes.
     */
    isClientIdAttrUnique: function isClientIdAttrUnique(props) {
      var wpformsBlocks = app.getWPFormsBlocks();
      for (var key in wpformsBlocks) {
        // Skip the current block.
        if (wpformsBlocks[key].clientId === props.clientId) {
          continue;
        }
        if (wpformsBlocks[key].attributes.clientId === props.attributes.clientId) {
          return false;
        }
      }
      return true;
    },
    /**
     * Get block attributes.
     *
     * @since 1.8.1
     *
     * @return {Object} Block attributes.
     */
    getBlockAttributes: function getBlockAttributes() {
      return commonAttributes;
    },
    /**
     * Get block runtime state variable.
     *
     * @since 1.8.8
     *
     * @param {string} clientId Block client ID.
     * @param {string} varName  Block runtime variable name.
     *
     * @return {*} Block runtime state variable value.
     */
    getBlockRuntimeStateVar: function getBlockRuntimeStateVar(clientId, varName) {
      var _blocks$clientId;
      return (_blocks$clientId = blocks[clientId]) === null || _blocks$clientId === void 0 ? void 0 : _blocks$clientId[varName];
    },
    /**
     * Set block runtime state variable value.
     *
     * @since 1.8.8
     *
     * @param {string} clientId Block client ID.
     * @param {string} varName  Block runtime state key.
     * @param {*}      value    State variable value.
     *
     * @return {boolean} True on success.
     */
    setBlockRuntimeStateVar: function setBlockRuntimeStateVar(clientId, varName, value) {
      // eslint-disable-line complexity
      if (!clientId || !varName) {
        return false;
      }
      blocks[clientId] = blocks[clientId] || {};
      blocks[clientId][varName] = value;

      // Prevent referencing to object.
      if (_typeof(value) === 'object' && !Array.isArray(value) && value !== null) {
        blocks[clientId][varName] = _objectSpread({}, value);
      }
      return true;
    },
    /**
     * Get form selector options.
     *
     * @since 1.8.1
     *
     * @return {Array} Form options.
     */
    getFormOptions: function getFormOptions() {
      var formOptions = formList.map(function (value) {
        return {
          value: value.ID,
          label: value.post_title
        };
      });
      formOptions.unshift({
        value: '',
        label: strings.form_select
      });
      return formOptions;
    },
    /**
     * Get size selector options.
     *
     * @since 1.8.1
     *
     * @return {Array} Size options.
     */
    getSizeOptions: function getSizeOptions() {
      return [{
        label: strings.small,
        value: 'small'
      }, {
        label: strings.medium,
        value: 'medium'
      }, {
        label: strings.large,
        value: 'large'
      }];
    },
    /**
     * Event `wpformsFormSelectorEdit` handler.
     *
     * @since 1.8.1
     *
     * @param {Object} e     Event object.
     * @param {Object} props Block properties.
     */
    blockEdit: function blockEdit(e, props) {
      var block = app.getBlockContainer(props);
      if (!(block !== null && block !== void 0 && block.dataset)) {
        return;
      }
      app.initLeadFormSettings(block.parentElement);
    },
    /**
     * Init Lead Form Settings panels.
     *
     * @since 1.8.1
     *
     * @param {Element} block         Block element.
     * @param {Object}  block.dataset Block element.
     */
    initLeadFormSettings: function initLeadFormSettings(block) {
      if (!(block !== null && block !== void 0 && block.dataset)) {
        return;
      }
      if (!app.isFullStylingEnabled()) {
        return;
      }
      var clientId = block.dataset.block;
      var $panel = $(".wpforms-block-settings-".concat(clientId));
      if (app.isLeadFormsEnabled(block)) {
        $panel.addClass('disabled_panel').find('.wpforms-gutenberg-panel-notice.wpforms-lead-form-notice').css('display', 'block');
        $panel.find('.wpforms-gutenberg-panel-notice.wpforms-use-modern-notice').css('display', 'none');
        return;
      }
      $panel.removeClass('disabled_panel').find('.wpforms-gutenberg-panel-notice.wpforms-lead-form-notice').css('display', 'none');
      $panel.find('.wpforms-gutenberg-panel-notice.wpforms-use-modern-notice').css('display', null);
    },
    /**
     * Event `wpformsFormSelectorFormLoaded` handler.
     *
     * @since 1.8.1
     *
     * @param {Object} e Event object.
     */
    formLoaded: function formLoaded(e) {
      app.initLeadFormSettings(e.detail.block);
      app.updateAccentColors(e.detail);
      app.loadChoicesJS(e.detail);
      app.initRichTextField(e.detail.formId);
      app.initRepeaterField(e.detail.formId);
      $(e.detail.block).off('click').on('click', app.blockClick);
    },
    /**
     * Click on the block event handler.
     *
     * @since 1.8.1
     *
     * @param {Object} e Event object.
     */
    blockClick: function blockClick(e) {
      app.initLeadFormSettings(e.currentTarget);
    },
    /**
     * Update accent colors of some fields in GB block in Modern Markup mode.
     *
     * @since 1.8.1
     *
     * @param {Object} detail Event details object.
     */
    updateAccentColors: function updateAccentColors(detail) {
      var _window$WPForms;
      if (!wpforms_gutenberg_form_selector.is_modern_markup || !((_window$WPForms = window.WPForms) !== null && _window$WPForms !== void 0 && _window$WPForms.FrontendModern) || !(detail !== null && detail !== void 0 && detail.block)) {
        return;
      }
      var $form = $(detail.block.querySelector("#wpforms-".concat(detail.formId))),
        FrontendModern = window.WPForms.FrontendModern;
      FrontendModern.updateGBBlockPageIndicatorColor($form);
      FrontendModern.updateGBBlockIconChoicesColor($form);
      FrontendModern.updateGBBlockRatingColor($form);
    },
    /**
     * Init Modern style Dropdown fields (<select>).
     *
     * @since 1.8.1
     *
     * @param {Object} detail Event details object.
     */
    loadChoicesJS: function loadChoicesJS(detail) {
      if (typeof window.Choices !== 'function') {
        return;
      }
      var $form = $(detail.block.querySelector("#wpforms-".concat(detail.formId)));
      $form.find('.choicesjs-select').each(function (idx, selectEl) {
        var $el = $(selectEl);
        if ($el.data('choice') === 'active') {
          return;
        }
        var args = window.wpforms_choicesjs_config || {},
          searchEnabled = $el.data('search-enabled'),
          $field = $el.closest('.wpforms-field');
        args.searchEnabled = 'undefined' !== typeof searchEnabled ? searchEnabled : true;
        args.callbackOnInit = function () {
          var self = this,
            $element = $(self.passedElement.element),
            $input = $(self.input.element),
            sizeClass = $element.data('size-class');

          // Add CSS-class for size.
          if (sizeClass) {
            $(self.containerOuter.element).addClass(sizeClass);
          }

          /**
           * If a multiple select has selected choices - hide a placeholder text.
           * In case if select is empty - we return placeholder text.
           */
          if ($element.prop('multiple')) {
            // On init event.
            $input.data('placeholder', $input.attr('placeholder'));
            if (self.getValue(true).length) {
              $input.hide();
            }
          }
          this.disable();
          $field.find('.is-disabled').removeClass('is-disabled');
        };
        try {
          if (!(selectEl instanceof parent.HTMLSelectElement)) {
            Object.setPrototypeOf(selectEl, parent.HTMLSelectElement.prototype);
          }
          $el.data('choicesjs', new parent.Choices(selectEl, args));
        } catch (e) {} // eslint-disable-line no-empty
      });
    },
    /**
     * Initialize RichText field.
     *
     * @since 1.8.1
     *
     * @param {number} formId Form ID.
     */
    initRichTextField: function initRichTextField(formId) {
      // Set default tab to `Visual`.
      $("#wpforms-".concat(formId, " .wp-editor-wrap")).removeClass('html-active').addClass('tmce-active');
    },
    /**
     * Initialize Repeater field.
     *
     * @since 1.8.9
     *
     * @param {number} formId Form ID.
     */
    initRepeaterField: function initRepeaterField(formId) {
      var $rowButtons = $("#wpforms-".concat(formId, " .wpforms-field-repeater > .wpforms-field-repeater-display-rows .wpforms-field-repeater-display-rows-buttons"));

      // Get the label height and set the button position.
      $rowButtons.each(function () {
        var $cont = $(this);
        var $label = $cont.siblings('.wpforms-layout-column').find('.wpforms-field').first().find('.wpforms-field-label');
        var labelStyle = window.getComputedStyle($label.get(0));
        var margin = (labelStyle === null || labelStyle === void 0 ? void 0 : labelStyle.getPropertyValue('--wpforms-field-size-input-spacing')) || 0;
        var height = $label.outerHeight() || 0;
        var top = height + parseInt(margin, 10) + 10;
        $cont.css({
          top: top
        });
      });

      // Init buttons and descriptions for each repeater in each form.
      $(".wpforms-form[data-formid=\"".concat(formId, "\"]")).each(function () {
        var $repeater = $(this).find('.wpforms-field-repeater');
        $repeater.find('.wpforms-field-repeater-display-rows-buttons').addClass('wpforms-init');
        $repeater.find('.wpforms-field-repeater-display-rows:last .wpforms-field-description').addClass('wpforms-init');
      });
    }
  };

  // Provide access to public functions/properties.
  return app;
}(document, window, jQuery);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVnZW5lcmF0b3JSdW50aW1lIiwiZSIsInQiLCJyIiwiT2JqZWN0IiwicHJvdG90eXBlIiwibiIsImhhc093blByb3BlcnR5IiwibyIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJpIiwiU3ltYm9sIiwiYSIsIml0ZXJhdG9yIiwiYyIsImFzeW5jSXRlcmF0b3IiLCJ1IiwidG9TdHJpbmdUYWciLCJkZWZpbmUiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJ3cmFwIiwiR2VuZXJhdG9yIiwiY3JlYXRlIiwiQ29udGV4dCIsIm1ha2VJbnZva2VNZXRob2QiLCJ0cnlDYXRjaCIsInR5cGUiLCJhcmciLCJjYWxsIiwiaCIsImwiLCJmIiwicyIsInkiLCJHZW5lcmF0b3JGdW5jdGlvbiIsIkdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlIiwicCIsImQiLCJnZXRQcm90b3R5cGVPZiIsInYiLCJ2YWx1ZXMiLCJnIiwiZGVmaW5lSXRlcmF0b3JNZXRob2RzIiwiZm9yRWFjaCIsIl9pbnZva2UiLCJBc3luY0l0ZXJhdG9yIiwiaW52b2tlIiwiX3R5cGVvZiIsInJlc29sdmUiLCJfX2F3YWl0IiwidGhlbiIsImNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnIiwiRXJyb3IiLCJkb25lIiwibWV0aG9kIiwiZGVsZWdhdGUiLCJtYXliZUludm9rZURlbGVnYXRlIiwic2VudCIsIl9zZW50IiwiZGlzcGF0Y2hFeGNlcHRpb24iLCJhYnJ1cHQiLCJyZXR1cm4iLCJUeXBlRXJyb3IiLCJyZXN1bHROYW1lIiwibmV4dCIsIm5leHRMb2MiLCJwdXNoVHJ5RW50cnkiLCJ0cnlMb2MiLCJjYXRjaExvYyIsImZpbmFsbHlMb2MiLCJhZnRlckxvYyIsInRyeUVudHJpZXMiLCJwdXNoIiwicmVzZXRUcnlFbnRyeSIsImNvbXBsZXRpb24iLCJyZXNldCIsImlzTmFOIiwibGVuZ3RoIiwiZGlzcGxheU5hbWUiLCJpc0dlbmVyYXRvckZ1bmN0aW9uIiwiY29uc3RydWN0b3IiLCJuYW1lIiwibWFyayIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiYXdyYXAiLCJhc3luYyIsIlByb21pc2UiLCJrZXlzIiwicmV2ZXJzZSIsInBvcCIsInByZXYiLCJjaGFyQXQiLCJzbGljZSIsInN0b3AiLCJydmFsIiwiaGFuZGxlIiwiY29tcGxldGUiLCJmaW5pc2giLCJjYXRjaCIsIl9jYXRjaCIsImRlbGVnYXRlWWllbGQiLCJhc3luY0dlbmVyYXRvclN0ZXAiLCJnZW4iLCJyZWplY3QiLCJfbmV4dCIsIl90aHJvdyIsImtleSIsImluZm8iLCJlcnJvciIsIl9hc3luY1RvR2VuZXJhdG9yIiwiZm4iLCJzZWxmIiwiYXJncyIsImFyZ3VtZW50cyIsImFwcGx5IiwiZXJyIiwidW5kZWZpbmVkIiwiX2RlZmF1bHQiLCJleHBvcnRzIiwiZGVmYXVsdCIsImRvY3VtZW50Iiwid2luZG93IiwiJCIsIl93cCIsIndwIiwiX3dwJHNlcnZlclNpZGVSZW5kZXIiLCJzZXJ2ZXJTaWRlUmVuZGVyIiwiU2VydmVyU2lkZVJlbmRlciIsImNvbXBvbmVudHMiLCJfd3AkZWxlbWVudCIsImVsZW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiRnJhZ21lbnQiLCJjcmVhdGVJbnRlcnBvbGF0ZUVsZW1lbnQiLCJyZWdpc3RlckJsb2NrVHlwZSIsImJsb2NrcyIsIl9yZWYiLCJibG9ja0VkaXRvciIsImVkaXRvciIsIkluc3BlY3RvckNvbnRyb2xzIiwiUGFuZWxDb2xvclNldHRpbmdzIiwiX3dwJGNvbXBvbmVudHMiLCJTZWxlY3RDb250cm9sIiwiVG9nZ2xlQ29udHJvbCIsIlBhbmVsQm9keSIsIlBsYWNlaG9sZGVyIiwiX18iLCJpMThuIiwiX3dwZm9ybXNfZ3V0ZW5iZXJnX2ZvIiwid3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvciIsInN0cmluZ3MiLCJkZWZhdWx0cyIsInNpemVzIiwidXJscyIsImlzUHJvIiwiaXNMaWNlbnNlQWN0aXZlIiwiaXNBZG1pbiIsImRlZmF1bHRTdHlsZVNldHRpbmdzIiwiV1BGb3Jtc0VkdWNhdGlvbiIsImZvcm1MaXN0IiwiZm9ybXMiLCJ0cmlnZ2VyU2VydmVyUmVuZGVyIiwiJHBvcHVwIiwiaXNGZXRjaGluZyIsImVsIiwiY29tbW9uQXR0cmlidXRlcyIsImNsaWVudElkIiwiZm9ybUlkIiwiZGlzcGxheVRpdGxlIiwiZGlzcGxheURlc2MiLCJwcmV2aWV3IiwidGhlbWUiLCJ0aGVtZU5hbWUiLCJsYWJlbFNpemUiLCJsYWJlbENvbG9yIiwibGFiZWxTdWJsYWJlbENvbG9yIiwibGFiZWxFcnJvckNvbG9yIiwicGFnZUJyZWFrQ29sb3IiLCJjdXN0b21Dc3MiLCJjb3B5UGFzdGVKc29uVmFsdWUiLCJjdXN0b21TdHlsZXNIYW5kbGVycyIsImRyb3Bkb3duVGltZW91dCIsImlzQ29weVBhc3RlR2VuZXJhdGVkT25FZGl0IiwiYXBwIiwicGFuZWxzIiwiaW5pdCIsImJsb2NrT3B0aW9ucyIsIiR3aW5kb3ciLCJlZHVjYXRpb24iLCJpbml0RGVmYXVsdHMiLCJyZWdpc3RlckJsb2NrIiwiaW5pdEpDb25maXJtIiwicmVhZHkiLCJldmVudHMiLCJvbiIsIl8iLCJkZWJvdW5jZSIsImJsb2NrRWRpdCIsImZvcm1Mb2FkZWQiLCJqY29uZmlybSIsImNsb3NlSWNvbiIsImJhY2tncm91bmREaXNtaXNzIiwiZXNjYXBlS2V5IiwiYW5pbWF0aW9uQm91bmNlIiwidXNlQm9vdHN0cmFwIiwiYm94V2lkdGgiLCJhbmltYXRlRnJvbUVsZW1lbnQiLCJnZXRGb3JtcyIsIl9jYWxsZWUiLCJfY2FsbGVlJCIsIl9jb250ZXh0IiwiYXBpRmV0Y2giLCJwYXRoIiwicm91dGVfbmFtZXNwYWNlIiwiY2FjaGUiLCJ0MCIsImNvbnNvbGUiLCJvcGVuQnVpbGRlclBvcHVwIiwiY2xpZW50SUQiLCJpc0VtcHR5T2JqZWN0IiwicGFyZW50IiwiY2FudmFzSWZyYW1lIiwiaXNGc2VNb2RlIiwiQm9vbGVhbiIsInRtcGwiLCJjb250ZW50cyIsImZpbmQiLCJhZnRlciIsInNpYmxpbmdzIiwidXJsIiwiZ2V0X3N0YXJ0ZWRfdXJsIiwiJGlmcmFtZSIsImJ1aWxkZXJDbG9zZUJ1dHRvbkV2ZW50IiwiYXR0ciIsImZhZGVJbiIsIm9mZiIsImFjdGlvbiIsImZvcm1UaXRsZSIsIm5ld0Jsb2NrIiwiY3JlYXRlQmxvY2siLCJ0b1N0cmluZyIsIklEIiwicG9zdF90aXRsZSIsImRhdGEiLCJkaXNwYXRjaCIsInJlbW92ZUJsb2NrIiwiaW5zZXJ0QmxvY2tzIiwidGl0bGUiLCJkZXNjcmlwdGlvbiIsImljb24iLCJnZXRJY29uIiwia2V5d29yZHMiLCJmb3JtX2tleXdvcmRzIiwiY2F0ZWdvcnkiLCJhdHRyaWJ1dGVzIiwiZ2V0QmxvY2tBdHRyaWJ1dGVzIiwic3VwcG9ydHMiLCJjdXN0b21DbGFzc05hbWUiLCJoYXNGb3JtcyIsImV4YW1wbGUiLCJlZGl0IiwicHJvcHMiLCJmb3JtT3B0aW9ucyIsImdldEZvcm1PcHRpb25zIiwiaGFuZGxlcnMiLCJnZXRTZXR0aW5nc0ZpZWxkc0hhbmRsZXJzIiwiaXNDbGllbnRJZEF0dHJVbmlxdWUiLCJzZXRBdHRyaWJ1dGVzIiwianN4IiwianN4UGFydHMiLCJnZXRNYWluU2V0dGluZ3MiLCJnZXRFbXB0eUZvcm1zUHJldmlldyIsInNpemVPcHRpb25zIiwiZ2V0U2l6ZU9wdGlvbnMiLCJpc0Zvcm1BdmFpbGFibGUiLCJnZXRCbG9ja1BsYWNlaG9sZGVyIiwibWF5YmVTdWJzY3JpYmVUb0Jsb2NrRXZlbnRzIiwiZ2V0U3R5bGVTZXR0aW5ncyIsImdldEJsb2NrRm9ybUNvbnRlbnQiLCJ1cGRhdGVDb3B5UGFzdGVDb250ZW50IiwidHJpZ2dlciIsImdldEJsb2NrUHJldmlldyIsInNhdmUiLCJfb2JqZWN0U3ByZWFkIiwiZ2V0Q29tbW9uQXR0cmlidXRlcyIsInNldFN0eWxlc0hhbmRsZXJzIiwiX3JlZjIiLCJOdW1iZXIiLCJzZXRUcmlnZ2VyU2VydmVyUmVuZGVyIiwiJGZsYWciLCJzdWJzY3JpYmVyUHJvcHMiLCJzdWJzY3JpYmVySGFuZGxlcnMiLCJzdWJzY3JpYmVyQmxvY2tPcHRpb25zIiwiaWQiLCJzdWJzY3JpYmVyRGVsZXRlVGhlbWUiLCJzdWJzY3JpYmVyVXBkYXRlVGhlbWUiLCJzdWJzY3JpYmVyU2V0VGhlbWUiLCJ0aGVtZVNsdWciLCJ0cmlnZ2VyUHJvcHMiLCJfc3Vic2NyaWJlclByb3BzJGF0dHIiLCJfc3Vic2NyaWJlckJsb2NrT3B0aW8iLCJ0aGVtZXMiLCJzZXRCbG9ja1RoZW1lIiwidGhlbWVEYXRhIiwiX3N1YnNjcmliZXJQcm9wcyRhdHRyMiIsIl9zdWJzY3JpYmVyQmxvY2tPcHRpbzIiLCJibG9jayIsIl9zdWJzY3JpYmVyQmxvY2tPcHRpbzMiLCJiYWNrZ3JvdW5kIiwib25TZXRUaGVtZSIsInByaW50RW1wdHlGb3Jtc05vdGljZSIsIlJlYWN0IiwiY2xhc3NOYW1lIiwiZm9ybV9zZXR0aW5ncyIsImxhYmVsIiwiZm9ybV9zZWxlY3RlZCIsIm9wdGlvbnMiLCJvbkNoYW5nZSIsImF0dHJDaGFuZ2UiLCJocmVmIiwiZm9ybV91cmwiLCJyZXBsYWNlIiwicmVsIiwidGFyZ2V0IiwiZm9ybV9lZGl0IiwiZW50cmllc191cmwiLCJmb3JtX2VudHJpZXMiLCJzaG93X3RpdGxlIiwiY2hlY2tlZCIsInNob3dfZGVzY3JpcHRpb24iLCJwYW5lbF9ub3RpY2VfaGVhZCIsInBhbmVsX25vdGljZV90ZXh0IiwicGFuZWxfbm90aWNlX2xpbmsiLCJwYW5lbF9ub3RpY2VfbGlua190ZXh0Iiwic3R5bGUiLCJkaXNwbGF5Iiwib25DbGljayIsImdldExhYmVsU3R5bGVzIiwiZ2V0UGFuZWxDbGFzcyIsImxhYmVsX3N0eWxlcyIsInNpemUiLCJzdHlsZUF0dHJDaGFuZ2UiLCJjb2xvcnMiLCJfX2V4cGVyaW1lbnRhbElzUmVuZGVyZWRJblNpZGViYXIiLCJlbmFibGVBbHBoYSIsInNob3dUaXRsZSIsImNvbG9yU2V0dGluZ3MiLCJzdWJsYWJlbF9oaW50cyIsImVycm9yX21lc3NhZ2UiLCJnZXRQYWdlSW5kaWNhdG9yU3R5bGVzIiwiaGFzUGFnZUJyZWFrIiwiaGFzUmF0aW5nIiwiY29uY2F0IiwicGFnZV9icmVhayIsInJhdGluZyIsIm90aGVyX3N0eWxlcyIsImdldFRoZW1lc1BhbmVsIiwic3RvY2tQaG90b3MiLCJnZXRGaWVsZFN0eWxlcyIsImdldEJ1dHRvblN0eWxlcyIsImdldENvbnRhaW5lclN0eWxlcyIsImdldEJhY2tncm91bmRTdHlsZXMiLCJnZXRCbG9ja0NvbnRhaW5lciIsImlubmVySFRNTCIsImJsb2NrSFRNTCIsImxvYWRlZEZvcm1JZCIsImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MIiwiX19odG1sIiwic3JjIiwiYmxvY2tfcHJldmlld191cmwiLCJ3aWR0aCIsImFsdCIsImJsb2NrX2VtcHR5X3VybCIsImIiLCJ3cGZvcm1zX2d1aWRlIiwiaGVpZ2h0IiwiaXNGb3JtTm90QXZhaWxhYmxlIiwibG9nb191cmwiLCJ0ZXh0QWxpZ24iLCJtYXJnaW5Ub3AiLCJmb3JtX25vdF9hdmFpbGFibGVfbWVzc2FnZSIsIl9KU09OJHBhcnNlIiwiY3VycmVudEZvcm0iLCJmb3JtIiwicGFyc2VJbnQiLCJwb3N0X2NvbnRlbnQiLCJmaWVsZHMiLCJKU09OIiwicGFyc2UiLCJzb21lIiwiZmllbGQiLCJfSlNPTiRwYXJzZTIiLCJwYW5lbCIsImNzc0NsYXNzIiwiaXNGdWxsU3R5bGluZ0VuYWJsZWQiLCJnZXRDb2xvclBhbmVsQ2xhc3MiLCJib3JkZXJTdHlsZSIsImlzX21vZGVybl9tYXJrdXAiLCJpc19mdWxsX3N0eWxpbmciLCJpc0xlYWRGb3Jtc0VuYWJsZWQiLCIkZm9ybSIsInF1ZXJ5U2VsZWN0b3IiLCJoYXNDbGFzcyIsImJsb2NrU2VsZWN0b3IiLCJlZGl0b3JDYW52YXMiLCJjb250ZW50V2luZG93IiwidXBkYXRlUHJldmlld0NTU1ZhclZhbHVlIiwiYXR0cmlidXRlIiwiY29udGFpbmVyIiwicHJvcGVydHkiLCJsZXR0ZXIiLCJ0b0xvd2VyQ2FzZSIsInNldFByb3BlcnR5IiwidG9nZ2xlRmllbGRCb3JkZXJOb25lQ1NTVmFyVmFsdWUiLCJtYXliZVVwZGF0ZUFjY2VudENvbG9yIiwiYnV0dG9uQm9yZGVyQ29sb3IiLCJtYXliZVNldEJ1dHRvbkFsdEJhY2tncm91bmRDb2xvciIsIm1heWJlU2V0QnV0dG9uQWx0VGV4dENvbG9yIiwiYnV0dG9uVGV4dENvbG9yIiwiYnV0dG9uQmFja2dyb3VuZENvbG9yIiwic2V0IiwiY29udCIsIldQRm9ybXNVdGlscyIsImNzc0NvbG9yc1V0aWxzIiwiaXNUcmFuc3BhcmVudENvbG9yIiwiYWx0Q29sb3IiLCJnZXRDb250cmFzdENvbG9yIiwiY29sb3IiLCJzZXRBdHRyIiwiaW5jbHVkZXMiLCJfdmFsdWUiLCJzZXRCbG9ja1J1bnRpbWVTdGF0ZVZhciIsInVwZGF0ZUN1c3RvbVRoZW1lQXR0cmlidXRlIiwibWF5YmVUb2dnbGVEcm9wZG93biIsIl90aGlzIiwibWVudSIsImNsYXNzaWNNZW51IiwiY2xhc3NMaXN0IiwiYWRkIiwicGFyZW50RWxlbWVudCIsInNob3dDbGFzc2ljTWVudSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJ0b0Nsb3NlIiwicmVtb3ZlIiwiaGlkZUNsYXNzaWNNZW51IiwiY3NzVGV4dCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJvcHRpb24iLCJjb250ZW50IiwiYXR0cyIsInNlbGVjdCIsInN0cmluZ2lmeSIsInBhc3RlU2V0dGluZ3MiLCJ0cmltIiwicGFzdGVBdHRyaWJ1dGVzIiwicGFyc2VWYWxpZGF0ZUpzb24iLCJjcmVhdGVFcnJvck5vdGljZSIsImNvcHlfcGFzdGVfZXJyb3IiLCJtYXliZUNyZWF0ZUN1c3RvbVRoZW1lRnJvbUF0dHJpYnV0ZXMiLCJ2aWV3Qm94IiwiZmlsbCIsImdldFdQRm9ybXNCbG9ja3MiLCJ3cGZvcm1zQmxvY2tzIiwiZ2V0QmxvY2tzIiwiZmlsdGVyIiwiZ2V0QmxvY2tSdW50aW1lU3RhdGVWYXIiLCJ2YXJOYW1lIiwiX2Jsb2NrcyRjbGllbnRJZCIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsInVuc2hpZnQiLCJmb3JtX3NlbGVjdCIsInNtYWxsIiwibWVkaXVtIiwibGFyZ2UiLCJkYXRhc2V0IiwiaW5pdExlYWRGb3JtU2V0dGluZ3MiLCIkcGFuZWwiLCJhZGRDbGFzcyIsImNzcyIsInJlbW92ZUNsYXNzIiwiZGV0YWlsIiwidXBkYXRlQWNjZW50Q29sb3JzIiwibG9hZENob2ljZXNKUyIsImluaXRSaWNoVGV4dEZpZWxkIiwiaW5pdFJlcGVhdGVyRmllbGQiLCJibG9ja0NsaWNrIiwiY3VycmVudFRhcmdldCIsIl93aW5kb3ckV1BGb3JtcyIsIldQRm9ybXMiLCJGcm9udGVuZE1vZGVybiIsInVwZGF0ZUdCQmxvY2tQYWdlSW5kaWNhdG9yQ29sb3IiLCJ1cGRhdGVHQkJsb2NrSWNvbkNob2ljZXNDb2xvciIsInVwZGF0ZUdCQmxvY2tSYXRpbmdDb2xvciIsIkNob2ljZXMiLCJlYWNoIiwiaWR4Iiwic2VsZWN0RWwiLCIkZWwiLCJ3cGZvcm1zX2Nob2ljZXNqc19jb25maWciLCJzZWFyY2hFbmFibGVkIiwiJGZpZWxkIiwiY2xvc2VzdCIsImNhbGxiYWNrT25Jbml0IiwiJGVsZW1lbnQiLCJwYXNzZWRFbGVtZW50IiwiJGlucHV0IiwiaW5wdXQiLCJzaXplQ2xhc3MiLCJjb250YWluZXJPdXRlciIsInByb3AiLCJnZXRWYWx1ZSIsImhpZGUiLCJkaXNhYmxlIiwiSFRNTFNlbGVjdEVsZW1lbnQiLCIkcm93QnV0dG9ucyIsIiRjb250IiwiJGxhYmVsIiwiZmlyc3QiLCJsYWJlbFN0eWxlIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImdldCIsIm1hcmdpbiIsImdldFByb3BlcnR5VmFsdWUiLCJvdXRlckhlaWdodCIsInRvcCIsIiRyZXBlYXRlciIsImpRdWVyeSJdLCJzb3VyY2VzIjpbImNvbW1vbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgamNvbmZpcm0sIHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IsIENob2ljZXMsIEpTWCwgRE9NLCBXUEZvcm1zVXRpbHMgKi9cbi8qIGpzaGludCBlczM6IGZhbHNlLCBlc3ZlcnNpb246IDYgKi9cblxuLyoqXG4gKiBAcGFyYW0gc3RyaW5ncy5jb3B5X3Bhc3RlX2Vycm9yXG4gKiBAcGFyYW0gc3RyaW5ncy5lcnJvcl9tZXNzYWdlXG4gKiBAcGFyYW0gc3RyaW5ncy5mb3JtX2VkaXRcbiAqIEBwYXJhbSBzdHJpbmdzLmZvcm1fZW50cmllc1xuICogQHBhcmFtIHN0cmluZ3MuZm9ybV9rZXl3b3Jkc1xuICogQHBhcmFtIHN0cmluZ3MuZm9ybV9zZWxlY3RcbiAqIEBwYXJhbSBzdHJpbmdzLmZvcm1fc2VsZWN0ZWRcbiAqIEBwYXJhbSBzdHJpbmdzLmZvcm1fc2V0dGluZ3NcbiAqIEBwYXJhbSBzdHJpbmdzLmxhYmVsX3N0eWxlc1xuICogQHBhcmFtIHN0cmluZ3Mub3RoZXJfc3R5bGVzXG4gKiBAcGFyYW0gc3RyaW5ncy5wYWdlX2JyZWFrXG4gKiBAcGFyYW0gc3RyaW5ncy5wYW5lbF9ub3RpY2VfaGVhZFxuICogQHBhcmFtIHN0cmluZ3MucGFuZWxfbm90aWNlX2xpbmtcbiAqIEBwYXJhbSBzdHJpbmdzLnBhbmVsX25vdGljZV9saW5rX3RleHRcbiAqIEBwYXJhbSBzdHJpbmdzLnBhbmVsX25vdGljZV90ZXh0XG4gKiBAcGFyYW0gc3RyaW5ncy5zaG93X2Rlc2NyaXB0aW9uXG4gKiBAcGFyYW0gc3RyaW5ncy5zaG93X3RpdGxlXG4gKiBAcGFyYW0gc3RyaW5ncy5zdWJsYWJlbF9oaW50c1xuICogQHBhcmFtIHN0cmluZ3MuZm9ybV9ub3RfYXZhaWxhYmxlX21lc3NhZ2VcbiAqIEBwYXJhbSB1cmxzLmVudHJpZXNfdXJsXG4gKiBAcGFyYW0gdXJscy5mb3JtX3VybFxuICogQHBhcmFtIHdpbmRvdy53cGZvcm1zX2Nob2ljZXNqc19jb25maWdcbiAqIEBwYXJhbSB3cGZvcm1zX2VkdWNhdGlvbi51cGdyYWRlX2JvbnVzXG4gKiBAcGFyYW0gd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvci5ibG9ja19lbXB0eV91cmxcbiAqIEBwYXJhbSB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLmJsb2NrX3ByZXZpZXdfdXJsXG4gKiBAcGFyYW0gd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvci5nZXRfc3RhcnRlZF91cmxcbiAqIEBwYXJhbSB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLmlzX2Z1bGxfc3R5bGluZ1xuICogQHBhcmFtIHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IuaXNfbW9kZXJuX21hcmt1cFxuICogQHBhcmFtIHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IubG9nb191cmxcbiAqIEBwYXJhbSB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLndwZm9ybXNfZ3VpZGVcbiAqL1xuXG4vKipcbiAqIEd1dGVuYmVyZyBlZGl0b3IgYmxvY2suXG4gKlxuICogQ29tbW9uIG1vZHVsZS5cbiAqXG4gKiBAc2luY2UgMS44LjhcbiAqL1xuZXhwb3J0IGRlZmF1bHQgKCBmdW5jdGlvbiggZG9jdW1lbnQsIHdpbmRvdywgJCApIHtcblx0LyoqXG5cdCAqIFdQIGNvcmUgY29tcG9uZW50cy5cblx0ICpcblx0ICogQHNpbmNlIDEuOC44XG5cdCAqL1xuXHRjb25zdCB7IHNlcnZlclNpZGVSZW5kZXI6IFNlcnZlclNpZGVSZW5kZXIgPSB3cC5jb21wb25lbnRzLlNlcnZlclNpZGVSZW5kZXIgfSA9IHdwO1xuXHRjb25zdCB7IGNyZWF0ZUVsZW1lbnQsIEZyYWdtZW50LCBjcmVhdGVJbnRlcnBvbGF0ZUVsZW1lbnQgfSA9IHdwLmVsZW1lbnQ7XG5cdGNvbnN0IHsgcmVnaXN0ZXJCbG9ja1R5cGUgfSA9IHdwLmJsb2Nrcztcblx0Y29uc3QgeyBJbnNwZWN0b3JDb250cm9scywgUGFuZWxDb2xvclNldHRpbmdzIH0gPSB3cC5ibG9ja0VkaXRvciB8fCB3cC5lZGl0b3I7XG5cdGNvbnN0IHsgU2VsZWN0Q29udHJvbCwgVG9nZ2xlQ29udHJvbCwgUGFuZWxCb2R5LCBQbGFjZWhvbGRlciB9ID0gd3AuY29tcG9uZW50cztcblx0Y29uc3QgeyBfXyB9ID0gd3AuaTE4bjtcblxuXHQvKipcblx0ICogTG9jYWxpemVkIGRhdGEgYWxpYXNlcy5cblx0ICpcblx0ICogQHNpbmNlIDEuOC44XG5cdCAqL1xuXHRjb25zdCB7IHN0cmluZ3MsIGRlZmF1bHRzLCBzaXplcywgdXJscywgaXNQcm8sIGlzTGljZW5zZUFjdGl2ZSwgaXNBZG1pbiB9ID0gd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvcjtcblx0Y29uc3QgZGVmYXVsdFN0eWxlU2V0dGluZ3MgPSBkZWZhdWx0cztcblxuXHQvLyBub2luc3BlY3Rpb24gSlNVbnVzZWRMb2NhbFN5bWJvbHNcblx0LyoqXG5cdCAqIFdQRm9ybXMgRWR1Y2F0aW9uIHNjcmlwdC5cblx0ICpcblx0ICogQHNpbmNlIDEuOC44XG5cdCAqL1xuXHRjb25zdCBXUEZvcm1zRWR1Y2F0aW9uID0gd2luZG93LldQRm9ybXNFZHVjYXRpb24gfHwge307IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcblxuXHQvKipcblx0ICogTGlzdCBvZiBmb3Jtcy5cblx0ICpcblx0ICogVGhlIGRlZmF1bHQgdmFsdWUgaXMgbG9jYWxpemVkIGluIEZvcm1TZWxlY3Rvci5waHAuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjguNFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0bGV0IGZvcm1MaXN0ID0gd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvci5mb3JtcztcblxuXHQvKipcblx0ICogQmxvY2tzIHJ1bnRpbWUgZGF0YS5cblx0ICpcblx0ICogQHNpbmNlIDEuOC4xXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHRjb25zdCBibG9ja3MgPSB7fTtcblxuXHQvKipcblx0ICogV2hldGhlciBpdCBpcyBuZWVkZWQgdG8gdHJpZ2dlciBzZXJ2ZXIgcmVuZGVyaW5nLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44LjFcblx0ICpcblx0ICogQHR5cGUge2Jvb2xlYW59XG5cdCAqL1xuXHRsZXQgdHJpZ2dlclNlcnZlclJlbmRlciA9IHRydWU7XG5cblx0LyoqXG5cdCAqIFBvcHVwIGNvbnRhaW5lci5cblx0ICpcblx0ICogQHNpbmNlIDEuOC4zXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHRsZXQgJHBvcHVwID0ge307XG5cblx0LyoqXG5cdCAqIFRyYWNrIGZldGNoIHN0YXR1cy5cblx0ICpcblx0ICogQHNpbmNlIDEuOC40XG5cdCAqXG5cdCAqIEB0eXBlIHtib29sZWFufVxuXHQgKi9cblx0bGV0IGlzRmV0Y2hpbmcgPSBmYWxzZTtcblxuXHQvKipcblx0ICogRWxlbWVudHMgaG9sZGVyLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdGNvbnN0IGVsID0ge307XG5cblx0LyoqXG5cdCAqIENvbW1vbiBibG9jayBhdHRyaWJ1dGVzLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdGxldCBjb21tb25BdHRyaWJ1dGVzID0ge1xuXHRcdGNsaWVudElkOiB7XG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6ICcnLFxuXHRcdH0sXG5cdFx0Zm9ybUlkOiB7XG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6IGRlZmF1bHRTdHlsZVNldHRpbmdzLmZvcm1JZCxcblx0XHR9LFxuXHRcdGRpc3BsYXlUaXRsZToge1xuXHRcdFx0dHlwZTogJ2Jvb2xlYW4nLFxuXHRcdFx0ZGVmYXVsdDogZGVmYXVsdFN0eWxlU2V0dGluZ3MuZGlzcGxheVRpdGxlLFxuXHRcdH0sXG5cdFx0ZGlzcGxheURlc2M6IHtcblx0XHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHRcdGRlZmF1bHQ6IGRlZmF1bHRTdHlsZVNldHRpbmdzLmRpc3BsYXlEZXNjLFxuXHRcdH0sXG5cdFx0cHJldmlldzoge1xuXHRcdFx0dHlwZTogJ2Jvb2xlYW4nLFxuXHRcdH0sXG5cdFx0dGhlbWU6IHtcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogZGVmYXVsdFN0eWxlU2V0dGluZ3MudGhlbWUsXG5cdFx0fSxcblx0XHR0aGVtZU5hbWU6IHtcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogZGVmYXVsdFN0eWxlU2V0dGluZ3MudGhlbWVOYW1lLFxuXHRcdH0sXG5cdFx0bGFiZWxTaXplOiB7XG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6IGRlZmF1bHRTdHlsZVNldHRpbmdzLmxhYmVsU2l6ZSxcblx0XHR9LFxuXHRcdGxhYmVsQ29sb3I6IHtcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogZGVmYXVsdFN0eWxlU2V0dGluZ3MubGFiZWxDb2xvcixcblx0XHR9LFxuXHRcdGxhYmVsU3VibGFiZWxDb2xvcjoge1xuXHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRkZWZhdWx0OiBkZWZhdWx0U3R5bGVTZXR0aW5ncy5sYWJlbFN1YmxhYmVsQ29sb3IsXG5cdFx0fSxcblx0XHRsYWJlbEVycm9yQ29sb3I6IHtcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogZGVmYXVsdFN0eWxlU2V0dGluZ3MubGFiZWxFcnJvckNvbG9yLFxuXHRcdH0sXG5cdFx0cGFnZUJyZWFrQ29sb3I6IHtcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogZGVmYXVsdFN0eWxlU2V0dGluZ3MucGFnZUJyZWFrQ29sb3IsXG5cdFx0fSxcblx0XHRjdXN0b21Dc3M6IHtcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0ZGVmYXVsdDogZGVmYXVsdFN0eWxlU2V0dGluZ3MuY3VzdG9tQ3NzLFxuXHRcdH0sXG5cdFx0Y29weVBhc3RlSnNvblZhbHVlOiB7XG5cdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdGRlZmF1bHQ6IGRlZmF1bHRTdHlsZVNldHRpbmdzLmNvcHlQYXN0ZUpzb25WYWx1ZSxcblx0XHR9LFxuXHR9O1xuXG5cdC8qKlxuXHQgKiBIYW5kbGVycyBmb3IgY3VzdG9tIHN0eWxlcyBzZXR0aW5ncywgZGVmaW5lZCBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdGxldCBjdXN0b21TdHlsZXNIYW5kbGVycyA9IHt9O1xuXG5cdC8qKlxuXHQgKiBEcm9wZG93biB0aW1lb3V0LlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICpcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGxldCBkcm9wZG93blRpbWVvdXQ7XG5cblx0LyoqXG5cdCAqIFdoZXRoZXIgY29weS1wYXN0ZSBjb250ZW50IHdhcyBnZW5lcmF0ZWQgb24gZWRpdC5cblx0ICpcblx0ICogQHNpbmNlIDEuOS4xXG5cdCAqXG5cdCAqIEB0eXBlIHtib29sZWFufVxuXHQgKi9cblx0bGV0IGlzQ29weVBhc3RlR2VuZXJhdGVkT25FZGl0ID0gZmFsc2U7XG5cblx0LyoqXG5cdCAqIFB1YmxpYyBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjguMVxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0Y29uc3QgYXBwID0ge1xuXG5cdFx0LyoqXG5cdFx0ICogUGFuZWwgbW9kdWxlcy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKi9cblx0XHRwYW5lbHM6IHt9LFxuXG5cdFx0LyoqXG5cdFx0ICogU3RhcnQgdGhlIGVuZ2luZS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGJsb2NrT3B0aW9ucyBCbG9jayBvcHRpb25zLlxuXHRcdCAqL1xuXHRcdGluaXQoIGJsb2NrT3B0aW9ucyApIHtcblx0XHRcdGVsLiR3aW5kb3cgPSAkKCB3aW5kb3cgKTtcblx0XHRcdGFwcC5wYW5lbHMgPSBibG9ja09wdGlvbnMucGFuZWxzO1xuXHRcdFx0YXBwLmVkdWNhdGlvbiA9IGJsb2NrT3B0aW9ucy5lZHVjYXRpb247XG5cblx0XHRcdGFwcC5pbml0RGVmYXVsdHMoIGJsb2NrT3B0aW9ucyApO1xuXHRcdFx0YXBwLnJlZ2lzdGVyQmxvY2soIGJsb2NrT3B0aW9ucyApO1xuXG5cdFx0XHRhcHAuaW5pdEpDb25maXJtKCk7XG5cblx0XHRcdCQoIGFwcC5yZWFkeSApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBEb2N1bWVudCByZWFkeS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqL1xuXHRcdHJlYWR5KCkge1xuXHRcdFx0YXBwLmV2ZW50cygpO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBFdmVudHMuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44LjFcblx0XHQgKi9cblx0XHRldmVudHMoKSB7XG5cdFx0XHRlbC4kd2luZG93XG5cdFx0XHRcdC5vbiggJ3dwZm9ybXNGb3JtU2VsZWN0b3JFZGl0JywgXy5kZWJvdW5jZSggYXBwLmJsb2NrRWRpdCwgMjUwICkgKVxuXHRcdFx0XHQub24oICd3cGZvcm1zRm9ybVNlbGVjdG9yRm9ybUxvYWRlZCcsIGFwcC5mb3JtTG9hZGVkICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEluaXQgakNvbmZpcm0uXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKi9cblx0XHRpbml0SkNvbmZpcm0oKSB7XG5cdFx0XHQvLyBqcXVlcnktY29uZmlybSBkZWZhdWx0cy5cblx0XHRcdGpjb25maXJtLmRlZmF1bHRzID0ge1xuXHRcdFx0XHRjbG9zZUljb246IGZhbHNlLFxuXHRcdFx0XHRiYWNrZ3JvdW5kRGlzbWlzczogZmFsc2UsXG5cdFx0XHRcdGVzY2FwZUtleTogdHJ1ZSxcblx0XHRcdFx0YW5pbWF0aW9uQm91bmNlOiAxLFxuXHRcdFx0XHR1c2VCb290c3RyYXA6IGZhbHNlLFxuXHRcdFx0XHR0aGVtZTogJ21vZGVybicsXG5cdFx0XHRcdGJveFdpZHRoOiAnNDAwcHgnLFxuXHRcdFx0XHRhbmltYXRlRnJvbUVsZW1lbnQ6IGZhbHNlLFxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IGEgZnJlc2ggbGlzdCBvZiBmb3JtcyB2aWEgUkVTVC1BUEkuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44LjRcblx0XHQgKlxuXHRcdCAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIud29yZHByZXNzLm9yZy9ibG9jay1lZGl0b3IvcmVmZXJlbmNlLWd1aWRlcy9wYWNrYWdlcy9wYWNrYWdlcy1hcGktZmV0Y2gvXG5cdFx0ICovXG5cdFx0YXN5bmMgZ2V0Rm9ybXMoKSB7XG5cdFx0XHQvLyBJZiBhIGZldGNoIGlzIGFscmVhZHkgaW4gcHJvZ3Jlc3MsIGV4aXQgdGhlIGZ1bmN0aW9uLlxuXHRcdFx0aWYgKCBpc0ZldGNoaW5nICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNldCB0aGUgZmxhZyB0byB0cnVlIGluZGljYXRpbmcgYSBmZXRjaCBpcyBpbiBwcm9ncmVzcy5cblx0XHRcdGlzRmV0Y2hpbmcgPSB0cnVlO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHQvLyBGZXRjaCBmb3Jtcy5cblx0XHRcdFx0Zm9ybUxpc3QgPSBhd2FpdCB3cC5hcGlGZXRjaCgge1xuXHRcdFx0XHRcdHBhdGg6IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3Iucm91dGVfbmFtZXNwYWNlICsgJ2Zvcm1zLycsXG5cdFx0XHRcdFx0bWV0aG9kOiAnR0VUJyxcblx0XHRcdFx0XHRjYWNoZTogJ25vLWNhY2hlJyxcblx0XHRcdFx0fSApO1xuXHRcdFx0fSBjYXRjaCAoIGVycm9yICkge1xuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKCBlcnJvciApO1xuXHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0aXNGZXRjaGluZyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBPcGVuIGJ1aWxkZXIgcG9wdXAuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS42LjJcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBjbGllbnRJRCBCbG9jayBDbGllbnQgSUQuXG5cdFx0ICovXG5cdFx0b3BlbkJ1aWxkZXJQb3B1cCggY2xpZW50SUQgKSB7XG5cdFx0XHRpZiAoICQuaXNFbXB0eU9iamVjdCggJHBvcHVwICkgKSB7XG5cdFx0XHRcdGNvbnN0IHBhcmVudCA9ICQoICcjd3B3cmFwJyApO1xuXHRcdFx0XHRjb25zdCBjYW52YXNJZnJhbWUgPSAkKCAnaWZyYW1lW25hbWU9XCJlZGl0b3ItY2FudmFzXCJdJyApO1xuXHRcdFx0XHRjb25zdCBpc0ZzZU1vZGUgPSBCb29sZWFuKCBjYW52YXNJZnJhbWUubGVuZ3RoICk7XG5cdFx0XHRcdGNvbnN0IHRtcGwgPSBpc0ZzZU1vZGUgPyBjYW52YXNJZnJhbWUuY29udGVudHMoKS5maW5kKCAnI3dwZm9ybXMtZ3V0ZW5iZXJnLXBvcHVwJyApIDogJCggJyN3cGZvcm1zLWd1dGVuYmVyZy1wb3B1cCcgKTtcblxuXHRcdFx0XHRwYXJlbnQuYWZ0ZXIoIHRtcGwgKTtcblxuXHRcdFx0XHQkcG9wdXAgPSBwYXJlbnQuc2libGluZ3MoICcjd3Bmb3Jtcy1ndXRlbmJlcmctcG9wdXAnICk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHVybCA9IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IuZ2V0X3N0YXJ0ZWRfdXJsLFxuXHRcdFx0XHQkaWZyYW1lID0gJHBvcHVwLmZpbmQoICdpZnJhbWUnICk7XG5cblx0XHRcdGFwcC5idWlsZGVyQ2xvc2VCdXR0b25FdmVudCggY2xpZW50SUQgKTtcblx0XHRcdCRpZnJhbWUuYXR0ciggJ3NyYycsIHVybCApO1xuXHRcdFx0JHBvcHVwLmZhZGVJbigpO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBDbG9zZSBidXR0b24gKGluc2lkZSB0aGUgZm9ybSBidWlsZGVyKSBjbGljayBldmVudC5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguM1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGNsaWVudElEIEJsb2NrIENsaWVudCBJRC5cblx0XHQgKi9cblx0XHRidWlsZGVyQ2xvc2VCdXR0b25FdmVudCggY2xpZW50SUQgKSB7XG5cdFx0XHQkcG9wdXBcblx0XHRcdFx0Lm9mZiggJ3dwZm9ybXNCdWlsZGVySW5Qb3B1cENsb3NlJyApXG5cdFx0XHRcdC5vbiggJ3dwZm9ybXNCdWlsZGVySW5Qb3B1cENsb3NlJywgZnVuY3Rpb24oIGUsIGFjdGlvbiwgZm9ybUlkLCBmb3JtVGl0bGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBhY3Rpb24gIT09ICdzYXZlZCcgfHwgISBmb3JtSWQgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gSW5zZXJ0IGEgbmV3IGJsb2NrIHdoZW4gYSBuZXcgZm9ybSBpcyBjcmVhdGVkIGZyb20gdGhlIHBvcHVwIHRvIHVwZGF0ZSB0aGUgZm9ybSBsaXN0IGFuZCBhdHRyaWJ1dGVzLlxuXHRcdFx0XHRcdGNvbnN0IG5ld0Jsb2NrID0gd3AuYmxvY2tzLmNyZWF0ZUJsb2NrKCAnd3Bmb3Jtcy9mb3JtLXNlbGVjdG9yJywge1xuXHRcdFx0XHRcdFx0Zm9ybUlkOiBmb3JtSWQudG9TdHJpbmcoKSwgLy8gRXhwZWN0cyBzdHJpbmcgdmFsdWUsIG1ha2Ugc3VyZSB3ZSBpbnNlcnQgc3RyaW5nLlxuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRcdFx0XHRmb3JtTGlzdCA9IFsgeyBJRDogZm9ybUlkLCBwb3N0X3RpdGxlOiBmb3JtVGl0bGUgfSBdO1xuXG5cdFx0XHRcdFx0Ly8gSW5zZXJ0IGEgbmV3IGJsb2NrLlxuXHRcdFx0XHRcdHdwLmRhdGEuZGlzcGF0Y2goICdjb3JlL2Jsb2NrLWVkaXRvcicgKS5yZW1vdmVCbG9jayggY2xpZW50SUQgKTtcblx0XHRcdFx0XHR3cC5kYXRhLmRpc3BhdGNoKCAnY29yZS9ibG9jay1lZGl0b3InICkuaW5zZXJ0QmxvY2tzKCBuZXdCbG9jayApO1xuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFJlZ2lzdGVyIGJsb2NrLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC4xXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gYmxvY2tPcHRpb25zIEFkZGl0aW9uYWwgYmxvY2sgb3B0aW9ucy5cblx0XHQgKi9cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxpbmVzLXBlci1mdW5jdGlvblxuXHRcdHJlZ2lzdGVyQmxvY2soIGJsb2NrT3B0aW9ucyApIHtcblx0XHRcdHJlZ2lzdGVyQmxvY2tUeXBlKCAnd3Bmb3Jtcy9mb3JtLXNlbGVjdG9yJywge1xuXHRcdFx0XHR0aXRsZTogc3RyaW5ncy50aXRsZSxcblx0XHRcdFx0ZGVzY3JpcHRpb246IHN0cmluZ3MuZGVzY3JpcHRpb24sXG5cdFx0XHRcdGljb246IGFwcC5nZXRJY29uKCksXG5cdFx0XHRcdGtleXdvcmRzOiBzdHJpbmdzLmZvcm1fa2V5d29yZHMsXG5cdFx0XHRcdGNhdGVnb3J5OiAnd2lkZ2V0cycsXG5cdFx0XHRcdGF0dHJpYnV0ZXM6IGFwcC5nZXRCbG9ja0F0dHJpYnV0ZXMoKSxcblx0XHRcdFx0c3VwcG9ydHM6IHtcblx0XHRcdFx0XHRjdXN0b21DbGFzc05hbWU6IGFwcC5oYXNGb3JtcygpLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRleGFtcGxlOiB7XG5cdFx0XHRcdFx0YXR0cmlidXRlczoge1xuXHRcdFx0XHRcdFx0cHJldmlldzogdHJ1ZSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRlZGl0KCBwcm9wcyApIHtcblx0XHRcdFx0XHRjb25zdCB7IGF0dHJpYnV0ZXMgfSA9IHByb3BzO1xuXHRcdFx0XHRcdGNvbnN0IGZvcm1PcHRpb25zID0gYXBwLmdldEZvcm1PcHRpb25zKCk7XG5cdFx0XHRcdFx0Y29uc3QgaGFuZGxlcnMgPSBhcHAuZ2V0U2V0dGluZ3NGaWVsZHNIYW5kbGVycyggcHJvcHMgKTtcblxuXHRcdFx0XHRcdC8vIFN0b3JlIGJsb2NrIGNsaWVudElkIGluIGF0dHJpYnV0ZXMuXG5cdFx0XHRcdFx0aWYgKCAhIGF0dHJpYnV0ZXMuY2xpZW50SWQgfHwgISBhcHAuaXNDbGllbnRJZEF0dHJVbmlxdWUoIHByb3BzICkgKSB7XG5cdFx0XHRcdFx0XHQvLyBXZSBqdXN0IHdhbnQgdGhlIGNsaWVudCBJRCB0byB1cGRhdGUgb25jZS5cblx0XHRcdFx0XHRcdC8vIFRoZSBibG9jayBlZGl0b3IgZG9lc24ndCBoYXZlIGEgZml4ZWQgYmxvY2sgSUQsIHNvIHdlIG5lZWQgdG8gZ2V0IGl0IG9uIHRoZSBpbml0aWFsIGxvYWQsIGJ1dCBvbmx5IG9uY2UuXG5cdFx0XHRcdFx0XHRwcm9wcy5zZXRBdHRyaWJ1dGVzKCB7IGNsaWVudElkOiBwcm9wcy5jbGllbnRJZCB9ICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTWFpbiBibG9jayBzZXR0aW5ncy5cblx0XHRcdFx0XHRjb25zdCBqc3ggPSBbXG5cdFx0XHRcdFx0XHRhcHAuanN4UGFydHMuZ2V0TWFpblNldHRpbmdzKCBhdHRyaWJ1dGVzLCBoYW5kbGVycywgZm9ybU9wdGlvbnMgKSxcblx0XHRcdFx0XHRdO1xuXG5cdFx0XHRcdFx0Ly8gQmxvY2sgcHJldmlldyBwaWN0dXJlLlxuXHRcdFx0XHRcdGlmICggISBhcHAuaGFzRm9ybXMoKSApIHtcblx0XHRcdFx0XHRcdGpzeC5wdXNoKFxuXHRcdFx0XHRcdFx0XHRhcHAuanN4UGFydHMuZ2V0RW1wdHlGb3Jtc1ByZXZpZXcoIHByb3BzICksXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4ganN4O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNvbnN0IHNpemVPcHRpb25zID0gYXBwLmdldFNpemVPcHRpb25zKCk7XG5cblx0XHRcdFx0XHQvLyBTaG93IHBsYWNlaG9sZGVyIHdoZW4gZm9ybSBpcyBub3QgYXZhaWxhYmxlICh0cmFzaGVkLCBkZWxldGVkIGV0Yy4pLlxuXHRcdFx0XHRcdGlmICggYXR0cmlidXRlcyAmJiBhdHRyaWJ1dGVzLmZvcm1JZCAmJiBhcHAuaXNGb3JtQXZhaWxhYmxlKCBhdHRyaWJ1dGVzLmZvcm1JZCApID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHRcdC8vIEJsb2NrIHBsYWNlaG9sZGVyIChmb3JtIHNlbGVjdG9yKS5cblx0XHRcdFx0XHRcdGpzeC5wdXNoKFxuXHRcdFx0XHRcdFx0XHRhcHAuanN4UGFydHMuZ2V0QmxvY2tQbGFjZWhvbGRlciggcHJvcHMuYXR0cmlidXRlcywgaGFuZGxlcnMsIGZvcm1PcHRpb25zICksXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4ganN4O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcm0gc3R5bGUgc2V0dGluZ3MgJiBibG9jayBjb250ZW50LlxuXHRcdFx0XHRcdGlmICggYXR0cmlidXRlcy5mb3JtSWQgKSB7XG5cdFx0XHRcdFx0XHQvLyBTdWJzY3JpYmUgdG8gYmxvY2sgZXZlbnRzLlxuXHRcdFx0XHRcdFx0YXBwLm1heWJlU3Vic2NyaWJlVG9CbG9ja0V2ZW50cyggcHJvcHMsIGhhbmRsZXJzLCBibG9ja09wdGlvbnMgKTtcblxuXHRcdFx0XHRcdFx0anN4LnB1c2goXG5cdFx0XHRcdFx0XHRcdGFwcC5qc3hQYXJ0cy5nZXRTdHlsZVNldHRpbmdzKCBwcm9wcywgaGFuZGxlcnMsIHNpemVPcHRpb25zLCBibG9ja09wdGlvbnMgKSxcblx0XHRcdFx0XHRcdFx0YXBwLmpzeFBhcnRzLmdldEJsb2NrRm9ybUNvbnRlbnQoIHByb3BzIClcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdGlmICggISBpc0NvcHlQYXN0ZUdlbmVyYXRlZE9uRWRpdCApIHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlcnMudXBkYXRlQ29weVBhc3RlQ29udGVudCgpO1xuXG5cdFx0XHRcdFx0XHRcdGlzQ29weVBhc3RlR2VuZXJhdGVkT25FZGl0ID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0ZWwuJHdpbmRvdy50cmlnZ2VyKCAnd3Bmb3Jtc0Zvcm1TZWxlY3RvckVkaXQnLCBbIHByb3BzIF0gKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGpzeDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBCbG9jayBwcmV2aWV3IHBpY3R1cmUuXG5cdFx0XHRcdFx0aWYgKCBhdHRyaWJ1dGVzLnByZXZpZXcgKSB7XG5cdFx0XHRcdFx0XHRqc3gucHVzaChcblx0XHRcdFx0XHRcdFx0YXBwLmpzeFBhcnRzLmdldEJsb2NrUHJldmlldygpLFxuXHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGpzeDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBCbG9jayBwbGFjZWhvbGRlciAoZm9ybSBzZWxlY3RvcikuXG5cdFx0XHRcdFx0anN4LnB1c2goXG5cdFx0XHRcdFx0XHRhcHAuanN4UGFydHMuZ2V0QmxvY2tQbGFjZWhvbGRlciggcHJvcHMuYXR0cmlidXRlcywgaGFuZGxlcnMsIGZvcm1PcHRpb25zICksXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdHJldHVybiBqc3g7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNhdmU6ICgpID0+IG51bGwsXG5cdFx0XHR9ICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEluaXQgZGVmYXVsdCBzdHlsZSBzZXR0aW5ncy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqIEBzaW5jZSAxLjguOCBBZGRlZCBibG9ja09wdGlvbnMgcGFyYW1ldGVyLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGJsb2NrT3B0aW9ucyBBZGRpdGlvbmFsIGJsb2NrIG9wdGlvbnMuXG5cdFx0ICovXG5cdFx0aW5pdERlZmF1bHRzKCBibG9ja09wdGlvbnMgPSB7fSApIHtcblx0XHRcdGNvbW1vbkF0dHJpYnV0ZXMgPSB7XG5cdFx0XHRcdC4uLmNvbW1vbkF0dHJpYnV0ZXMsXG5cdFx0XHRcdC4uLmJsb2NrT3B0aW9ucy5nZXRDb21tb25BdHRyaWJ1dGVzKCksXG5cdFx0XHR9O1xuXHRcdFx0Y3VzdG9tU3R5bGVzSGFuZGxlcnMgPSBibG9ja09wdGlvbnMuc2V0U3R5bGVzSGFuZGxlcnM7XG5cblx0XHRcdFsgJ2Zvcm1JZCcsICdjb3B5UGFzdGVKc29uVmFsdWUnIF0uZm9yRWFjaCggKCBrZXkgKSA9PiBkZWxldGUgZGVmYXVsdFN0eWxlU2V0dGluZ3NbIGtleSBdICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIENoZWNrIGlmIHRoZSBzaXRlIGhhcyBmb3Jtcy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguM1xuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciBzaXRlIGhhcyBhdCBsZWFzdCBvbmUgZm9ybS5cblx0XHQgKi9cblx0XHRoYXNGb3JtcygpIHtcblx0XHRcdHJldHVybiBmb3JtTGlzdC5sZW5ndGggPiAwO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBDaGVjayBpZiBmb3JtIGlzIGF2YWlsYWJsZSB0byBiZSBwcmV2aWV3ZWQuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljlcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBmb3JtSWQgRm9ybSBJRC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgZm9ybSBpcyBhdmFpbGFibGUuXG5cdFx0ICovXG5cdFx0aXNGb3JtQXZhaWxhYmxlKCBmb3JtSWQgKSB7XG5cdFx0XHRyZXR1cm4gZm9ybUxpc3QuZmluZCggKCB7IElEIH0gKSA9PiBJRCA9PT0gTnVtYmVyKCBmb3JtSWQgKSApICE9PSB1bmRlZmluZWQ7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFNldCB0cmlnZ2VyU2VydmVyUmVuZGVyIGZsYWcuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gJGZsYWcgVGhlIHZhbHVlIG9mIHRoZSB0cmlnZ2VyU2VydmVyUmVuZGVyIGZsYWcuXG5cdFx0ICovXG5cdFx0c2V0VHJpZ2dlclNlcnZlclJlbmRlciggJGZsYWcgKSB7XG5cdFx0XHR0cmlnZ2VyU2VydmVyUmVuZGVyID0gQm9vbGVhbiggJGZsYWcgKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogTWF5YmUgc3Vic2NyaWJlIHRvIGJsb2NrIGV2ZW50cy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHN1YnNjcmliZXJQcm9wcyAgICAgICAgU3Vic2NyaWJlciBibG9jayBwcm9wZXJ0aWVzLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBzdWJzY3JpYmVySGFuZGxlcnMgICAgIFN1YnNjcmliZXIgYmxvY2sgZXZlbnQgaGFuZGxlcnMuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHN1YnNjcmliZXJCbG9ja09wdGlvbnMgU3Vic2NyaWJlciBibG9jayBvcHRpb25zLlxuXHRcdCAqL1xuXHRcdG1heWJlU3Vic2NyaWJlVG9CbG9ja0V2ZW50cyggc3Vic2NyaWJlclByb3BzLCBzdWJzY3JpYmVySGFuZGxlcnMsIHN1YnNjcmliZXJCbG9ja09wdGlvbnMgKSB7XG5cdFx0XHRjb25zdCBpZCA9IHN1YnNjcmliZXJQcm9wcy5jbGllbnRJZDtcblxuXHRcdFx0Ly8gVW5zdWJzY3JpYmUgZnJvbSBibG9jayBldmVudHMuXG5cdFx0XHQvLyBUaGlzIGlzIG5lZWRlZCB0byBhdm9pZCBtdWx0aXBsZSBzdWJzY3JpcHRpb25zIHdoZW4gdGhlIGJsb2NrIGlzIHJlLXJlbmRlcmVkLlxuXHRcdFx0ZWwuJHdpbmRvd1xuXHRcdFx0XHQub2ZmKCAnd3Bmb3Jtc0Zvcm1TZWxlY3RvckRlbGV0ZVRoZW1lLicgKyBpZCApXG5cdFx0XHRcdC5vZmYoICd3cGZvcm1zRm9ybVNlbGVjdG9yVXBkYXRlVGhlbWUuJyArIGlkIClcblx0XHRcdFx0Lm9mZiggJ3dwZm9ybXNGb3JtU2VsZWN0b3JTZXRUaGVtZS4nICsgaWQgKTtcblxuXHRcdFx0Ly8gU3Vic2NyaWJlIHRvIGJsb2NrIGV2ZW50cy5cblx0XHRcdGVsLiR3aW5kb3dcblx0XHRcdFx0Lm9uKCAnd3Bmb3Jtc0Zvcm1TZWxlY3RvckRlbGV0ZVRoZW1lLicgKyBpZCwgYXBwLnN1YnNjcmliZXJEZWxldGVUaGVtZSggc3Vic2NyaWJlclByb3BzLCBzdWJzY3JpYmVyQmxvY2tPcHRpb25zICkgKVxuXHRcdFx0XHQub24oICd3cGZvcm1zRm9ybVNlbGVjdG9yVXBkYXRlVGhlbWUuJyArIGlkLCBhcHAuc3Vic2NyaWJlclVwZGF0ZVRoZW1lKCBzdWJzY3JpYmVyUHJvcHMsIHN1YnNjcmliZXJCbG9ja09wdGlvbnMgKSApXG5cdFx0XHRcdC5vbiggJ3dwZm9ybXNGb3JtU2VsZWN0b3JTZXRUaGVtZS4nICsgaWQsIGFwcC5zdWJzY3JpYmVyU2V0VGhlbWUoIHN1YnNjcmliZXJQcm9wcywgc3Vic2NyaWJlckJsb2NrT3B0aW9ucyApICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEJsb2NrIGV2ZW50IGB3cGZvcm1zRm9ybVNlbGVjdG9yRGVsZXRlVGhlbWVgIGhhbmRsZXIuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBzdWJzY3JpYmVyUHJvcHMgICAgICAgIFN1YnNjcmliZXIgYmxvY2sgcHJvcGVydGllc1xuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBzdWJzY3JpYmVyQmxvY2tPcHRpb25zIFN1YnNjcmliZXIgYmxvY2sgb3B0aW9ucy5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge0Z1bmN0aW9ufSBFdmVudCBoYW5kbGVyLlxuXHRcdCAqL1xuXHRcdHN1YnNjcmliZXJEZWxldGVUaGVtZSggc3Vic2NyaWJlclByb3BzLCBzdWJzY3JpYmVyQmxvY2tPcHRpb25zICkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlLCB0aGVtZVNsdWcsIHRyaWdnZXJQcm9wcyApIHtcblx0XHRcdFx0aWYgKCBzdWJzY3JpYmVyUHJvcHMuY2xpZW50SWQgPT09IHRyaWdnZXJQcm9wcy5jbGllbnRJZCApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHN1YnNjcmliZXJQcm9wcz8uYXR0cmlidXRlcz8udGhlbWUgIT09IHRoZW1lU2x1ZyApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoICEgc3Vic2NyaWJlckJsb2NrT3B0aW9ucz8ucGFuZWxzPy50aGVtZXMgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVzZXQgdGhlbWUgdG8gZGVmYXVsdCBvbmUuXG5cdFx0XHRcdHN1YnNjcmliZXJCbG9ja09wdGlvbnMucGFuZWxzLnRoZW1lcy5zZXRCbG9ja1RoZW1lKCBzdWJzY3JpYmVyUHJvcHMsICdkZWZhdWx0JyApO1xuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogQmxvY2sgZXZlbnQgYHdwZm9ybXNGb3JtU2VsZWN0b3JEZWxldGVUaGVtZWAgaGFuZGxlci5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHN1YnNjcmliZXJQcm9wcyAgICAgICAgU3Vic2NyaWJlciBibG9jayBwcm9wZXJ0aWVzXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHN1YnNjcmliZXJCbG9ja09wdGlvbnMgU3Vic2NyaWJlciBibG9jayBvcHRpb25zLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7RnVuY3Rpb259IEV2ZW50IGhhbmRsZXIuXG5cdFx0ICovXG5cdFx0c3Vic2NyaWJlclVwZGF0ZVRoZW1lKCBzdWJzY3JpYmVyUHJvcHMsIHN1YnNjcmliZXJCbG9ja09wdGlvbnMgKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGUsIHRoZW1lU2x1ZywgdGhlbWVEYXRhLCB0cmlnZ2VyUHJvcHMgKSB7XG5cdFx0XHRcdGlmICggc3Vic2NyaWJlclByb3BzLmNsaWVudElkID09PSB0cmlnZ2VyUHJvcHMuY2xpZW50SWQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBzdWJzY3JpYmVyUHJvcHM/LmF0dHJpYnV0ZXM/LnRoZW1lICE9PSB0aGVtZVNsdWcgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCAhIHN1YnNjcmliZXJCbG9ja09wdGlvbnM/LnBhbmVscz8udGhlbWVzICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJlc2V0IHRoZW1lIHRvIGRlZmF1bHQgb25lLlxuXHRcdFx0XHRzdWJzY3JpYmVyQmxvY2tPcHRpb25zLnBhbmVscy50aGVtZXMuc2V0QmxvY2tUaGVtZSggc3Vic2NyaWJlclByb3BzLCB0aGVtZVNsdWcgKTtcblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEJsb2NrIGV2ZW50IGB3cGZvcm1zRm9ybVNlbGVjdG9yU2V0VGhlbWVgIGhhbmRsZXIuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBzdWJzY3JpYmVyUHJvcHMgICAgICAgIFN1YnNjcmliZXIgYmxvY2sgcHJvcGVydGllc1xuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBzdWJzY3JpYmVyQmxvY2tPcHRpb25zIFN1YnNjcmliZXIgYmxvY2sgb3B0aW9ucy5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge0Z1bmN0aW9ufSBFdmVudCBoYW5kbGVyLlxuXHRcdCAqL1xuXHRcdHN1YnNjcmliZXJTZXRUaGVtZSggc3Vic2NyaWJlclByb3BzLCBzdWJzY3JpYmVyQmxvY2tPcHRpb25zICkge1xuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW51c2VkTG9jYWxTeW1ib2xzXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGUsIGJsb2NrLCB0aGVtZVNsdWcsIHRyaWdnZXJQcm9wcyApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuXHRcdFx0XHRpZiAoIHN1YnNjcmliZXJQcm9wcy5jbGllbnRJZCA9PT0gdHJpZ2dlclByb3BzLmNsaWVudElkICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggISBzdWJzY3JpYmVyQmxvY2tPcHRpb25zPy5wYW5lbHM/LnRoZW1lcyApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTZXQgdGhlbWUuXG5cdFx0XHRcdHN1YnNjcmliZXJCbG9ja09wdGlvbnMucGFuZWxzLmJhY2tncm91bmQub25TZXRUaGVtZSggc3Vic2NyaWJlclByb3BzICk7XG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBCbG9jayBKU1ggcGFydHMuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44LjFcblx0XHQgKlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0anN4UGFydHM6IHtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBHZXQgbWFpbiBzZXR0aW5ncyBKU1ggY29kZS5cblx0XHRcdCAqXG5cdFx0XHQgKiBAc2luY2UgMS44LjFcblx0XHRcdCAqXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gYXR0cmlidXRlcyAgQmxvY2sgYXR0cmlidXRlcy5cblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVycyAgICBCbG9jayBldmVudCBoYW5kbGVycy5cblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBmb3JtT3B0aW9ucyBGb3JtIHNlbGVjdG9yIG9wdGlvbnMuXG5cdFx0XHQgKlxuXHRcdFx0ICogQHJldHVybiB7SlNYLkVsZW1lbnR9IE1haW4gc2V0dGluZyBKU1ggY29kZS5cblx0XHRcdCAqL1xuXHRcdFx0Z2V0TWFpblNldHRpbmdzKCBhdHRyaWJ1dGVzLCBoYW5kbGVycywgZm9ybU9wdGlvbnMgKSB7XG5cdFx0XHRcdGlmICggISBhcHAuaGFzRm9ybXMoKSApIHtcblx0XHRcdFx0XHRyZXR1cm4gYXBwLmpzeFBhcnRzLnByaW50RW1wdHlGb3Jtc05vdGljZSggYXR0cmlidXRlcy5jbGllbnRJZCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQ8SW5zcGVjdG9yQ29udHJvbHMga2V5PVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1pbnNwZWN0b3ItbWFpbi1zZXR0aW5nc1wiPlxuXHRcdFx0XHRcdFx0PFBhbmVsQm9keSBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1wYW5lbCB3cGZvcm1zLWd1dGVuYmVyZy1wYW5lbC1mb3JtLXNldHRpbmdzXCIgdGl0bGU9eyBzdHJpbmdzLmZvcm1fc2V0dGluZ3MgfT5cblx0XHRcdFx0XHRcdFx0PFNlbGVjdENvbnRyb2xcblx0XHRcdFx0XHRcdFx0XHRsYWJlbD17IHN0cmluZ3MuZm9ybV9zZWxlY3RlZCB9XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU9eyBhdHRyaWJ1dGVzLmZvcm1JZCB9XG5cdFx0XHRcdFx0XHRcdFx0b3B0aW9ucz17IGZvcm1PcHRpb25zIH1cblx0XHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17ICggdmFsdWUgKSA9PiBoYW5kbGVycy5hdHRyQ2hhbmdlKCAnZm9ybUlkJywgdmFsdWUgKSB9XG5cdFx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHRcdHsgYXR0cmlidXRlcy5mb3JtSWQgPyAoXG5cdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1hY3Rpb25zXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8YSBocmVmPXsgdXJscy5mb3JtX3VybC5yZXBsYWNlKCAne0lEfScsIGF0dHJpYnV0ZXMuZm9ybUlkICkgfSByZWw9XCJub3JlZmVycmVyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHsgc3RyaW5ncy5mb3JtX2VkaXQgfVxuXHRcdFx0XHRcdFx0XHRcdFx0PC9hPlxuXHRcdFx0XHRcdFx0XHRcdFx0eyBpc1BybyAmJiBpc0xpY2Vuc2VBY3RpdmUgJiYgKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCZuYnNwOyZuYnNwO3wmbmJzcDsmbmJzcDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8YVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aHJlZj17IHVybHMuZW50cmllc191cmwucmVwbGFjZSggJ3tJRH0nLCBhdHRyaWJ1dGVzLmZvcm1JZCApIH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlbD1cIm5vcmVmZXJyZXJcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGFyZ2V0PVwiX2JsYW5rXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ+eyBzdHJpbmdzLmZvcm1fZW50cmllcyB9PC9hPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8Lz5cblx0XHRcdFx0XHRcdFx0XHRcdCkgfVxuXHRcdFx0XHRcdFx0XHRcdDwvcD5cblx0XHRcdFx0XHRcdFx0KSA6IG51bGwgfVxuXHRcdFx0XHRcdFx0XHQ8VG9nZ2xlQ29udHJvbFxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsPXsgc3RyaW5ncy5zaG93X3RpdGxlIH1cblx0XHRcdFx0XHRcdFx0XHRjaGVja2VkPXsgYXR0cmlidXRlcy5kaXNwbGF5VGl0bGUgfVxuXHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsgKCB2YWx1ZSApID0+IGhhbmRsZXJzLmF0dHJDaGFuZ2UoICdkaXNwbGF5VGl0bGUnLCB2YWx1ZSApIH1cblx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdFx0PFRvZ2dsZUNvbnRyb2xcblx0XHRcdFx0XHRcdFx0XHRsYWJlbD17IHN0cmluZ3Muc2hvd19kZXNjcmlwdGlvbiB9XG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tlZD17IGF0dHJpYnV0ZXMuZGlzcGxheURlc2MgfVxuXHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsgKCB2YWx1ZSApID0+IGhhbmRsZXJzLmF0dHJDaGFuZ2UoICdkaXNwbGF5RGVzYycsIHZhbHVlICkgfVxuXHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0XHQ8cCBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1wYW5lbC1ub3RpY2VcIj5cblx0XHRcdFx0XHRcdFx0XHQ8c3Ryb25nPnsgc3RyaW5ncy5wYW5lbF9ub3RpY2VfaGVhZCB9PC9zdHJvbmc+XG5cdFx0XHRcdFx0XHRcdFx0eyBzdHJpbmdzLnBhbmVsX25vdGljZV90ZXh0IH1cblx0XHRcdFx0XHRcdFx0XHQ8YSBocmVmPXsgc3RyaW5ncy5wYW5lbF9ub3RpY2VfbGluayB9IHJlbD1cIm5vcmVmZXJyZXJcIiB0YXJnZXQ9XCJfYmxhbmtcIj57IHN0cmluZ3MucGFuZWxfbm90aWNlX2xpbmtfdGV4dCB9PC9hPlxuXHRcdFx0XHRcdFx0XHQ8L3A+XG5cdFx0XHRcdFx0XHQ8L1BhbmVsQm9keT5cblx0XHRcdFx0XHQ8L0luc3BlY3RvckNvbnRyb2xzPlxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBQcmludCBlbXB0eSBmb3JtcyBub3RpY2UuXG5cdFx0XHQgKlxuXHRcdFx0ICogQHNpbmNlIDEuOC4zXG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmd9IGNsaWVudElkIEJsb2NrIGNsaWVudCBJRC5cblx0XHRcdCAqXG5cdFx0XHQgKiBAcmV0dXJuIHtKU1guRWxlbWVudH0gRmllbGQgc3R5bGVzIEpTWCBjb2RlLlxuXHRcdFx0ICovXG5cdFx0XHRwcmludEVtcHR5Rm9ybXNOb3RpY2UoIGNsaWVudElkICkge1xuXHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdDxJbnNwZWN0b3JDb250cm9scyBrZXk9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWluc3BlY3Rvci1tYWluLXNldHRpbmdzXCI+XG5cdFx0XHRcdFx0XHQ8UGFuZWxCb2R5IGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLXBhbmVsXCIgdGl0bGU9eyBzdHJpbmdzLmZvcm1fc2V0dGluZ3MgfT5cblx0XHRcdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctcGFuZWwtbm90aWNlIHdwZm9ybXMtd2FybmluZyB3cGZvcm1zLWVtcHR5LWZvcm0tbm90aWNlXCIgc3R5bGU9eyB7IGRpc3BsYXk6ICdibG9jaycgfSB9PlxuXHRcdFx0XHRcdFx0XHRcdDxzdHJvbmc+eyBfXyggJ1lvdSBoYXZlbuKAmXQgY3JlYXRlZCBhIGZvcm0sIHlldCEnLCAnd3Bmb3Jtcy1saXRlJyApIH08L3N0cm9uZz5cblx0XHRcdFx0XHRcdFx0XHR7IF9fKCAnV2hhdCBhcmUgeW91IHdhaXRpbmcgZm9yPycsICd3cGZvcm1zLWxpdGUnICkgfVxuXHRcdFx0XHRcdFx0XHQ8L3A+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImdldC1zdGFydGVkLWJ1dHRvbiBjb21wb25lbnRzLWJ1dHRvbiBpcy1zZWNvbmRhcnlcIlxuXHRcdFx0XHRcdFx0XHRcdG9uQ2xpY2s9e1xuXHRcdFx0XHRcdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhcHAub3BlbkJ1aWxkZXJQb3B1cCggY2xpZW50SWQgKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdFx0XHR7IF9fKCAnR2V0IFN0YXJ0ZWQnLCAnd3Bmb3Jtcy1saXRlJyApIH1cblx0XHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8L1BhbmVsQm9keT5cblx0XHRcdFx0XHQ8L0luc3BlY3RvckNvbnRyb2xzPlxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBHZXQgTGFiZWwgc3R5bGVzIEpTWCBjb2RlLlxuXHRcdFx0ICpcblx0XHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyAgICAgICBCbG9jayBwcm9wZXJ0aWVzLlxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGhhbmRsZXJzICAgIEJsb2NrIGV2ZW50IGhhbmRsZXJzLlxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IHNpemVPcHRpb25zIFNpemUgc2VsZWN0b3Igb3B0aW9ucy5cblx0XHRcdCAqXG5cdFx0XHQgKiBAcmV0dXJuIHtPYmplY3R9IExhYmVsIHN0eWxlcyBKU1ggY29kZS5cblx0XHRcdCAqL1xuXHRcdFx0Z2V0TGFiZWxTdHlsZXMoIHByb3BzLCBoYW5kbGVycywgc2l6ZU9wdGlvbnMgKSB7XG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0PFBhbmVsQm9keSBjbGFzc05hbWU9eyBhcHAuZ2V0UGFuZWxDbGFzcyggcHJvcHMgKSB9IHRpdGxlPXsgc3RyaW5ncy5sYWJlbF9zdHlsZXMgfT5cblx0XHRcdFx0XHRcdDxTZWxlY3RDb250cm9sXG5cdFx0XHRcdFx0XHRcdGxhYmVsPXsgc3RyaW5ncy5zaXplIH1cblx0XHRcdFx0XHRcdFx0dmFsdWU9eyBwcm9wcy5hdHRyaWJ1dGVzLmxhYmVsU2l6ZSB9XG5cdFx0XHRcdFx0XHRcdGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItZml4LWJvdHRvbS1tYXJnaW5cIlxuXHRcdFx0XHRcdFx0XHRvcHRpb25zPXsgc2l6ZU9wdGlvbnMgfVxuXHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17ICggdmFsdWUgKSA9PiBoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdsYWJlbFNpemUnLCB2YWx1ZSApIH1cblx0XHRcdFx0XHRcdC8+XG5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1jb2xvci1waWNrZXJcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWNvbnRyb2wtbGFiZWxcIj57IHN0cmluZ3MuY29sb3JzIH08L2Rpdj5cblx0XHRcdFx0XHRcdFx0PFBhbmVsQ29sb3JTZXR0aW5nc1xuXHRcdFx0XHRcdFx0XHRcdF9fZXhwZXJpbWVudGFsSXNSZW5kZXJlZEluU2lkZWJhclxuXHRcdFx0XHRcdFx0XHRcdGVuYWJsZUFscGhhXG5cdFx0XHRcdFx0XHRcdFx0c2hvd1RpdGxlPXsgZmFsc2UgfVxuXHRcdFx0XHRcdFx0XHRcdGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItY29sb3ItcGFuZWxcIlxuXHRcdFx0XHRcdFx0XHRcdGNvbG9yU2V0dGluZ3M9eyBbXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBwcm9wcy5hdHRyaWJ1dGVzLmxhYmVsQ29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlOiAoIHZhbHVlICkgPT4gaGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAnbGFiZWxDb2xvcicsIHZhbHVlICksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBzdHJpbmdzLmxhYmVsLFxuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHByb3BzLmF0dHJpYnV0ZXMubGFiZWxTdWJsYWJlbENvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvbkNoYW5nZTogKCB2YWx1ZSApID0+IGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2xhYmVsU3VibGFiZWxDb2xvcicsIHZhbHVlICksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBzdHJpbmdzLnN1YmxhYmVsX2hpbnRzLnJlcGxhY2UoICcmYW1wOycsICcmJyApLFxuXHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHByb3BzLmF0dHJpYnV0ZXMubGFiZWxFcnJvckNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvbkNoYW5nZTogKCB2YWx1ZSApID0+IGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2xhYmVsRXJyb3JDb2xvcicsIHZhbHVlICksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBzdHJpbmdzLmVycm9yX21lc3NhZ2UsXG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdF0gfVxuXHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9QYW5lbEJvZHk+XG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEdldCBQYWdlIEluZGljYXRvciBzdHlsZXMgSlNYIGNvZGUuXG5cdFx0XHQgKlxuXHRcdFx0ICogQHNpbmNlIDEuOC43XG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IHByb3BzICAgIEJsb2NrIHByb3BlcnRpZXMuXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gaGFuZGxlcnMgQmxvY2sgZXZlbnQgaGFuZGxlcnMuXG5cdFx0XHQgKlxuXHRcdFx0ICogQHJldHVybiB7T2JqZWN0fSBQYWdlIEluZGljYXRvciBzdHlsZXMgSlNYIGNvZGUuXG5cdFx0XHQgKi9cblx0XHRcdGdldFBhZ2VJbmRpY2F0b3JTdHlsZXMoIHByb3BzLCBoYW5kbGVycyApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb21wbGV4aXR5XG5cdFx0XHRcdGNvbnN0IGhhc1BhZ2VCcmVhayA9IGFwcC5oYXNQYWdlQnJlYWsoIGZvcm1MaXN0LCBwcm9wcy5hdHRyaWJ1dGVzLmZvcm1JZCApO1xuXHRcdFx0XHRjb25zdCBoYXNSYXRpbmcgPSBhcHAuaGFzUmF0aW5nKCBmb3JtTGlzdCwgcHJvcHMuYXR0cmlidXRlcy5mb3JtSWQgKTtcblxuXHRcdFx0XHRpZiAoICEgaGFzUGFnZUJyZWFrICYmICEgaGFzUmF0aW5nICkge1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGxhYmVsID0gJyc7XG5cdFx0XHRcdGlmICggaGFzUGFnZUJyZWFrICYmIGhhc1JhdGluZyApIHtcblx0XHRcdFx0XHRsYWJlbCA9IGAkeyBzdHJpbmdzLnBhZ2VfYnJlYWsgfSAvICR7IHN0cmluZ3MucmF0aW5nIH1gO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCBoYXNQYWdlQnJlYWsgKSB7XG5cdFx0XHRcdFx0bGFiZWwgPSBzdHJpbmdzLnBhZ2VfYnJlYWs7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIGhhc1JhdGluZyApIHtcblx0XHRcdFx0XHRsYWJlbCA9IHN0cmluZ3MucmF0aW5nO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQ8UGFuZWxCb2R5IGNsYXNzTmFtZT17IGFwcC5nZXRQYW5lbENsYXNzKCBwcm9wcyApIH0gdGl0bGU9eyBzdHJpbmdzLm90aGVyX3N0eWxlcyB9PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWNvbG9yLXBpY2tlclwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItY29udHJvbC1sYWJlbFwiPnsgc3RyaW5ncy5jb2xvcnMgfTwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8UGFuZWxDb2xvclNldHRpbmdzXG5cdFx0XHRcdFx0XHRcdFx0X19leHBlcmltZW50YWxJc1JlbmRlcmVkSW5TaWRlYmFyXG5cdFx0XHRcdFx0XHRcdFx0ZW5hYmxlQWxwaGFcblx0XHRcdFx0XHRcdFx0XHRzaG93VGl0bGU9eyBmYWxzZSB9XG5cdFx0XHRcdFx0XHRcdFx0Y2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1jb2xvci1wYW5lbFwiXG5cdFx0XHRcdFx0XHRcdFx0Y29sb3JTZXR0aW5ncz17IFtcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHByb3BzLmF0dHJpYnV0ZXMucGFnZUJyZWFrQ29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlOiAoIHZhbHVlICkgPT4gaGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAncGFnZUJyZWFrQ29sb3InLCB2YWx1ZSApLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbCxcblx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XSB9IC8+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L1BhbmVsQm9keT5cblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogR2V0IHN0eWxlIHNldHRpbmdzIEpTWCBjb2RlLlxuXHRcdFx0ICpcblx0XHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyAgICAgICAgQmxvY2sgcHJvcGVydGllcy5cblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVycyAgICAgQmxvY2sgZXZlbnQgaGFuZGxlcnMuXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gc2l6ZU9wdGlvbnMgIFNpemUgc2VsZWN0b3Igb3B0aW9ucy5cblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBibG9ja09wdGlvbnMgQmxvY2sgb3B0aW9ucyBsb2FkZWQgZnJvbSBleHRlcm5hbCBtb2R1bGVzLlxuXHRcdFx0ICpcblx0XHRcdCAqIEByZXR1cm4ge09iamVjdH0gSW5zcGVjdG9yIGNvbnRyb2xzIEpTWCBjb2RlLlxuXHRcdFx0ICovXG5cdFx0XHRnZXRTdHlsZVNldHRpbmdzKCBwcm9wcywgaGFuZGxlcnMsIHNpemVPcHRpb25zLCBibG9ja09wdGlvbnMgKSB7XG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0PEluc3BlY3RvckNvbnRyb2xzIGtleT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3Itc3R5bGUtc2V0dGluZ3NcIj5cblx0XHRcdFx0XHRcdHsgYmxvY2tPcHRpb25zLmdldFRoZW1lc1BhbmVsKCBwcm9wcywgYXBwLCBibG9ja09wdGlvbnMuc3RvY2tQaG90b3MgKSB9XG5cdFx0XHRcdFx0XHR7IGJsb2NrT3B0aW9ucy5nZXRGaWVsZFN0eWxlcyggcHJvcHMsIGhhbmRsZXJzLCBzaXplT3B0aW9ucywgYXBwICkgfVxuXHRcdFx0XHRcdFx0eyBhcHAuanN4UGFydHMuZ2V0TGFiZWxTdHlsZXMoIHByb3BzLCBoYW5kbGVycywgc2l6ZU9wdGlvbnMgKSB9XG5cdFx0XHRcdFx0XHR7IGJsb2NrT3B0aW9ucy5nZXRCdXR0b25TdHlsZXMoIHByb3BzLCBoYW5kbGVycywgc2l6ZU9wdGlvbnMsIGFwcCApIH1cblx0XHRcdFx0XHRcdHsgYmxvY2tPcHRpb25zLmdldENvbnRhaW5lclN0eWxlcyggcHJvcHMsIGhhbmRsZXJzLCBhcHAgKSB9XG5cdFx0XHRcdFx0XHR7IGJsb2NrT3B0aW9ucy5nZXRCYWNrZ3JvdW5kU3R5bGVzKCBwcm9wcywgaGFuZGxlcnMsIGFwcCwgYmxvY2tPcHRpb25zLnN0b2NrUGhvdG9zICkgfVxuXHRcdFx0XHRcdFx0eyBhcHAuanN4UGFydHMuZ2V0UGFnZUluZGljYXRvclN0eWxlcyggcHJvcHMsIGhhbmRsZXJzICkgfVxuXHRcdFx0XHRcdDwvSW5zcGVjdG9yQ29udHJvbHM+XG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEdldCBibG9jayBjb250ZW50IEpTWCBjb2RlLlxuXHRcdFx0ICpcblx0XHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBCbG9jayBwcm9wZXJ0aWVzLlxuXHRcdFx0ICpcblx0XHRcdCAqIEByZXR1cm4ge0pTWC5FbGVtZW50fSBCbG9jayBjb250ZW50IEpTWCBjb2RlLlxuXHRcdFx0ICovXG5cdFx0XHRnZXRCbG9ja0Zvcm1Db250ZW50KCBwcm9wcyApIHtcblx0XHRcdFx0aWYgKCB0cmlnZ2VyU2VydmVyUmVuZGVyICkge1xuXHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHQ8U2VydmVyU2lkZVJlbmRlclxuXHRcdFx0XHRcdFx0XHRrZXk9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLXNlcnZlci1zaWRlLXJlbmRlcmVyXCJcblx0XHRcdFx0XHRcdFx0YmxvY2s9XCJ3cGZvcm1zL2Zvcm0tc2VsZWN0b3JcIlxuXHRcdFx0XHRcdFx0XHRhdHRyaWJ1dGVzPXsgcHJvcHMuYXR0cmlidXRlcyB9XG5cdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBjbGllbnRJZCA9IHByb3BzLmNsaWVudElkO1xuXHRcdFx0XHRjb25zdCBibG9jayA9IGFwcC5nZXRCbG9ja0NvbnRhaW5lciggcHJvcHMgKTtcblxuXHRcdFx0XHQvLyBJbiB0aGUgY2FzZSBvZiBlbXB0eSBjb250ZW50LCB1c2Ugc2VydmVyIHNpZGUgcmVuZGVyZXIuXG5cdFx0XHRcdC8vIFRoaXMgaGFwcGVucyB3aGVuIHRoZSBibG9jayBpcyBkdXBsaWNhdGVkIG9yIGNvbnZlcnRlZCB0byBhIHJldXNhYmxlIGJsb2NrLlxuXHRcdFx0XHRpZiAoICEgYmxvY2s/LmlubmVySFRNTCApIHtcblx0XHRcdFx0XHR0cmlnZ2VyU2VydmVyUmVuZGVyID0gdHJ1ZTtcblxuXHRcdFx0XHRcdHJldHVybiBhcHAuanN4UGFydHMuZ2V0QmxvY2tGb3JtQ29udGVudCggcHJvcHMgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJsb2Nrc1sgY2xpZW50SWQgXSA9IGJsb2Nrc1sgY2xpZW50SWQgXSB8fCB7fTtcblx0XHRcdFx0YmxvY2tzWyBjbGllbnRJZCBdLmJsb2NrSFRNTCA9IGJsb2NrLmlubmVySFRNTDtcblx0XHRcdFx0YmxvY2tzWyBjbGllbnRJZCBdLmxvYWRlZEZvcm1JZCA9IHByb3BzLmF0dHJpYnV0ZXMuZm9ybUlkO1xuXG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0PEZyYWdtZW50IGtleT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItZnJhZ21lbnQtZm9ybS1odG1sXCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXsgeyBfX2h0bWw6IGJsb2Nrc1sgY2xpZW50SWQgXS5ibG9ja0hUTUwgfSB9IC8+XG5cdFx0XHRcdFx0PC9GcmFnbWVudD5cblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogR2V0IGJsb2NrIHByZXZpZXcgSlNYIGNvZGUuXG5cdFx0XHQgKlxuXHRcdFx0ICogQHNpbmNlIDEuOC4xXG5cdFx0XHQgKlxuXHRcdFx0ICogQHJldHVybiB7SlNYLkVsZW1lbnR9IEJsb2NrIHByZXZpZXcgSlNYIGNvZGUuXG5cdFx0XHQgKi9cblx0XHRcdGdldEJsb2NrUHJldmlldygpIHtcblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQ8RnJhZ21lbnRcblx0XHRcdFx0XHRcdGtleT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItZnJhZ21lbnQtYmxvY2stcHJldmlld1wiPlxuXHRcdFx0XHRcdFx0PGltZyBzcmM9eyB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLmJsb2NrX3ByZXZpZXdfdXJsIH0gc3R5bGU9eyB7IHdpZHRoOiAnMTAwJScgfSB9IGFsdD1cIlwiIC8+XG5cdFx0XHRcdFx0PC9GcmFnbWVudD5cblx0XHRcdFx0KTtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogR2V0IGJsb2NrIGVtcHR5IEpTWCBjb2RlLlxuXHRcdFx0ICpcblx0XHRcdCAqIEBzaW5jZSAxLjguM1xuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBCbG9jayBwcm9wZXJ0aWVzLlxuXHRcdFx0ICogQHJldHVybiB7SlNYLkVsZW1lbnR9IEJsb2NrIGVtcHR5IEpTWCBjb2RlLlxuXHRcdFx0ICovXG5cdFx0XHRnZXRFbXB0eUZvcm1zUHJldmlldyggcHJvcHMgKSB7XG5cdFx0XHRcdGNvbnN0IGNsaWVudElkID0gcHJvcHMuY2xpZW50SWQ7XG5cblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQ8RnJhZ21lbnRcblx0XHRcdFx0XHRcdGtleT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItZnJhZ21lbnQtYmxvY2stZW1wdHlcIj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwid3Bmb3Jtcy1uby1mb3JtLXByZXZpZXdcIj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9eyB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLmJsb2NrX2VtcHR5X3VybCB9IGFsdD1cIlwiIC8+XG5cdFx0XHRcdFx0XHRcdDxwPlxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZUludGVycG9sYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdFx0XHRcdFx0X18oXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J1lvdSBjYW4gdXNlIDxiPldQRm9ybXM8L2I+IHRvIGJ1aWxkIGNvbnRhY3QgZm9ybXMsIHN1cnZleXMsIHBheW1lbnQgZm9ybXMsIGFuZCBtb3JlIHdpdGgganVzdCBhIGZldyBjbGlja3MuJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnd3Bmb3Jtcy1saXRlJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YjogPHN0cm9uZyAvPixcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0PC9wPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJnZXQtc3RhcnRlZC1idXR0b24gY29tcG9uZW50cy1idXR0b24gaXMtcHJpbWFyeVwiXG5cdFx0XHRcdFx0XHRcdFx0b25DbGljaz17XG5cdFx0XHRcdFx0XHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFwcC5vcGVuQnVpbGRlclBvcHVwKCBjbGllbnRJZCApO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHRcdHsgX18oICdHZXQgU3RhcnRlZCcsICd3cGZvcm1zLWxpdGUnICkgfVxuXHRcdFx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwiZW1wdHktZGVzY1wiPlxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0ZUludGVycG9sYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdFx0XHRcdFx0X18oXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J05lZWQgc29tZSBoZWxwPyBDaGVjayBvdXQgb3VyIDxhPmNvbXByZWhlbnNpdmUgZ3VpZGUuPC9hPicsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J3dwZm9ybXMtbGl0ZSdcblx0XHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBqc3gtYTExeS9hbmNob3ItaGFzLWNvbnRlbnRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhOiA8YSBocmVmPXsgd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvci53cGZvcm1zX2d1aWRlIH0gdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiIC8+LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQ8L3A+XG5cblx0XHRcdFx0XHRcdFx0eyAvKiBUZW1wbGF0ZSBmb3IgcG9wdXAgd2l0aCBidWlsZGVyIGlmcmFtZSAqLyB9XG5cdFx0XHRcdFx0XHRcdDxkaXYgaWQ9XCJ3cGZvcm1zLWd1dGVuYmVyZy1wb3B1cFwiIGNsYXNzTmFtZT1cIndwZm9ybXMtYnVpbGRlci1wb3B1cFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxpZnJhbWUgc3JjPVwiYWJvdXQ6YmxhbmtcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgaWQ9XCJ3cGZvcm1zLWJ1aWxkZXItaWZyYW1lXCIgdGl0bGU9XCJXUEZvcm1zIEJ1aWxkZXIgUG9wdXBcIj48L2lmcmFtZT5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L0ZyYWdtZW50PlxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBHZXQgYmxvY2sgcGxhY2Vob2xkZXIgKGZvcm0gc2VsZWN0b3IpIEpTWCBjb2RlLlxuXHRcdFx0ICpcblx0XHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzICBCbG9jayBhdHRyaWJ1dGVzLlxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGhhbmRsZXJzICAgIEJsb2NrIGV2ZW50IGhhbmRsZXJzLlxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IGZvcm1PcHRpb25zIEZvcm0gc2VsZWN0b3Igb3B0aW9ucy5cblx0XHRcdCAqXG5cdFx0XHQgKiBAcmV0dXJuIHtKU1guRWxlbWVudH0gQmxvY2sgcGxhY2Vob2xkZXIgSlNYIGNvZGUuXG5cdFx0XHQgKi9cblx0XHRcdGdldEJsb2NrUGxhY2Vob2xkZXIoIGF0dHJpYnV0ZXMsIGhhbmRsZXJzLCBmb3JtT3B0aW9ucyApIHtcblx0XHRcdFx0Y29uc3QgaXNGb3JtTm90QXZhaWxhYmxlID0gYXR0cmlidXRlcy5mb3JtSWQgJiYgISBhcHAuaXNGb3JtQXZhaWxhYmxlKCBhdHRyaWJ1dGVzLmZvcm1JZCApO1xuXG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0PFBsYWNlaG9sZGVyXG5cdFx0XHRcdFx0XHRrZXk9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLXdyYXBcIlxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci13cmFwXCI+XG5cdFx0XHRcdFx0XHQ8aW1nIHNyYz17IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IubG9nb191cmwgfSBhbHQ9XCJcIiAvPlxuXHRcdFx0XHRcdFx0eyBpc0Zvcm1Ob3RBdmFpbGFibGUgJiYgKFxuXHRcdFx0XHRcdFx0XHQ8cCBzdHlsZT17IHsgdGV4dEFsaWduOiAnY2VudGVyJywgbWFyZ2luVG9wOiAnMCcgfSB9PlxuXHRcdFx0XHRcdFx0XHRcdHsgc3RyaW5ncy5mb3JtX25vdF9hdmFpbGFibGVfbWVzc2FnZSB9XG5cdFx0XHRcdFx0XHRcdDwvcD5cblx0XHRcdFx0XHRcdCkgfVxuXHRcdFx0XHRcdFx0PFNlbGVjdENvbnRyb2xcblx0XHRcdFx0XHRcdFx0a2V5PVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1zZWxlY3QtY29udHJvbFwiXG5cdFx0XHRcdFx0XHRcdHZhbHVlPXsgYXR0cmlidXRlcy5mb3JtSWQgfVxuXHRcdFx0XHRcdFx0XHRvcHRpb25zPXsgZm9ybU9wdGlvbnMgfVxuXHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17ICggdmFsdWUgKSA9PiBoYW5kbGVycy5hdHRyQ2hhbmdlKCAnZm9ybUlkJywgdmFsdWUgKSB9XG5cdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdDwvUGxhY2Vob2xkZXI+XG5cdFx0XHRcdCk7XG5cdFx0XHR9LFxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBEZXRlcm1pbmUgaWYgdGhlIGZvcm0gaGFzIGEgUGFnZSBCcmVhayBmaWVsZC5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguN1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9ICAgICAgICBmb3JtcyAgVGhlIGZvcm1zJyBkYXRhIG9iamVjdC5cblx0XHQgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd9IGZvcm1JZCBGb3JtIElELlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSB3aGVuIHRoZSBmb3JtIGhhcyBhIFBhZ2UgQnJlYWsgZmllbGQsIGZhbHNlIG90aGVyd2lzZS5cblx0XHQgKi9cblx0XHRoYXNQYWdlQnJlYWsoIGZvcm1zLCBmb3JtSWQgKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50Rm9ybSA9IGZvcm1zLmZpbmQoICggZm9ybSApID0+IHBhcnNlSW50KCBmb3JtLklELCAxMCApID09PSBwYXJzZUludCggZm9ybUlkLCAxMCApICk7XG5cblx0XHRcdGlmICggISBjdXJyZW50Rm9ybS5wb3N0X2NvbnRlbnQgKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZmllbGRzID0gSlNPTi5wYXJzZSggY3VycmVudEZvcm0ucG9zdF9jb250ZW50ICk/LmZpZWxkcztcblxuXHRcdFx0cmV0dXJuIE9iamVjdC52YWx1ZXMoIGZpZWxkcyApLnNvbWUoICggZmllbGQgKSA9PiBmaWVsZC50eXBlID09PSAncGFnZWJyZWFrJyApO1xuXHRcdH0sXG5cblx0XHRoYXNSYXRpbmcoIGZvcm1zLCBmb3JtSWQgKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50Rm9ybSA9IGZvcm1zLmZpbmQoICggZm9ybSApID0+IHBhcnNlSW50KCBmb3JtLklELCAxMCApID09PSBwYXJzZUludCggZm9ybUlkLCAxMCApICk7XG5cblx0XHRcdGlmICggISBjdXJyZW50Rm9ybS5wb3N0X2NvbnRlbnQgfHwgISBpc1BybyB8fCAhIGlzTGljZW5zZUFjdGl2ZSApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmaWVsZHMgPSBKU09OLnBhcnNlKCBjdXJyZW50Rm9ybS5wb3N0X2NvbnRlbnQgKT8uZmllbGRzO1xuXG5cdFx0XHRyZXR1cm4gT2JqZWN0LnZhbHVlcyggZmllbGRzICkuc29tZSggKCBmaWVsZCApID0+IGZpZWxkLnR5cGUgPT09ICdyYXRpbmcnICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdldCBTdHlsZSBTZXR0aW5ncyBwYW5lbCBjbGFzcy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHByb3BzIEJsb2NrIHByb3BlcnRpZXMuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHBhbmVsIFBhbmVsIG5hbWUuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9IFN0eWxlIFNldHRpbmdzIHBhbmVsIGNsYXNzLlxuXHRcdCAqL1xuXHRcdGdldFBhbmVsQ2xhc3MoIHByb3BzLCBwYW5lbCA9ICcnICkge1xuXHRcdFx0bGV0IGNzc0NsYXNzID0gJ3dwZm9ybXMtZ3V0ZW5iZXJnLXBhbmVsIHdwZm9ybXMtYmxvY2stc2V0dGluZ3MtJyArIHByb3BzLmNsaWVudElkO1xuXG5cdFx0XHRpZiAoICEgYXBwLmlzRnVsbFN0eWxpbmdFbmFibGVkKCkgKSB7XG5cdFx0XHRcdGNzc0NsYXNzICs9ICcgZGlzYWJsZWRfcGFuZWwnO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZXN0cmljdCBzdHlsaW5nIHBhbmVsIGZvciBub24tYWRtaW5zLlxuXHRcdFx0aWYgKCAhICggaXNBZG1pbiB8fCBwYW5lbCA9PT0gJ3RoZW1lcycgKSApIHtcblx0XHRcdFx0Y3NzQ2xhc3MgKz0gJyB3cGZvcm1zLWd1dGVuYmVyZy1wYW5lbC1yZXN0cmljdGVkJztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGNzc0NsYXNzO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgY29sb3IgcGFuZWwgc2V0dGluZ3MgQ1NTIGNsYXNzLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gYm9yZGVyU3R5bGUgQm9yZGVyIHN0eWxlIHZhbHVlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfSBTdHlsZSBTZXR0aW5ncyBwYW5lbCBjbGFzcy5cblx0XHQgKi9cblx0XHRnZXRDb2xvclBhbmVsQ2xhc3MoIGJvcmRlclN0eWxlICkge1xuXHRcdFx0bGV0IGNzc0NsYXNzID0gJ3dwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItY29sb3ItcGFuZWwnO1xuXG5cdFx0XHRpZiAoIGJvcmRlclN0eWxlID09PSAnbm9uZScgKSB7XG5cdFx0XHRcdGNzc0NsYXNzICs9ICcgd3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1ib3JkZXItY29sb3ItZGlzYWJsZWQnO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY3NzQ2xhc3M7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIERldGVybWluZSB3aGV0aGVyIHRoZSBmdWxsIHN0eWxpbmcgaXMgZW5hYmxlZC5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgZnVsbCBzdHlsaW5nIGlzIGVuYWJsZWQuXG5cdFx0ICovXG5cdFx0aXNGdWxsU3R5bGluZ0VuYWJsZWQoKSB7XG5cdFx0XHRyZXR1cm4gd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvci5pc19tb2Rlcm5fbWFya3VwICYmIHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IuaXNfZnVsbF9zdHlsaW5nO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgYmxvY2sgaGFzIGxlYWQgZm9ybXMgZW5hYmxlZC5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjkuMFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGJsb2NrIEd1dGVuYmVyZyBibG9ja1xuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgYmxvY2sgaGFzIGxlYWQgZm9ybXMgZW5hYmxlZFxuXHRcdCAqL1xuXHRcdGlzTGVhZEZvcm1zRW5hYmxlZCggYmxvY2sgKSB7XG5cdFx0XHRpZiAoICEgYmxvY2sgKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJGZvcm0gPSAkKCBibG9jay5xdWVyeVNlbGVjdG9yKCAnLndwZm9ybXMtY29udGFpbmVyJyApICk7XG5cblx0XHRcdHJldHVybiAkZm9ybS5oYXNDbGFzcyggJ3dwZm9ybXMtbGVhZC1mb3Jtcy1jb250YWluZXInICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdldCBibG9jayBjb250YWluZXIgRE9NIGVsZW1lbnQuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44LjFcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBCbG9jayBwcm9wZXJ0aWVzLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7RWxlbWVudH0gQmxvY2sgY29udGFpbmVyLlxuXHRcdCAqL1xuXHRcdGdldEJsb2NrQ29udGFpbmVyKCBwcm9wcyApIHtcblx0XHRcdGNvbnN0IGJsb2NrU2VsZWN0b3IgPSBgI2Jsb2NrLSR7IHByb3BzLmNsaWVudElkIH0gPiBkaXZgO1xuXHRcdFx0bGV0IGJsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggYmxvY2tTZWxlY3RvciApO1xuXG5cdFx0XHQvLyBGb3IgRlNFIC8gR3V0ZW5iZXJnIHBsdWdpbiwgd2UgbmVlZCB0byB0YWtlIGEgbG9vayBpbnNpZGUgdGhlIGlmcmFtZS5cblx0XHRcdGlmICggISBibG9jayApIHtcblx0XHRcdFx0Y29uc3QgZWRpdG9yQ2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ2lmcmFtZVtuYW1lPVwiZWRpdG9yLWNhbnZhc1wiXScgKTtcblxuXHRcdFx0XHRibG9jayA9IGVkaXRvckNhbnZhcz8uY29udGVudFdpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBibG9ja1NlbGVjdG9yICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBibG9jaztcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogVXBkYXRlIENTUyB2YXJpYWJsZShzKSB2YWx1ZShzKSBvZiB0aGUgZ2l2ZW4gYXR0cmlidXRlIGZvciBnaXZlbiBjb250YWluZXIgb24gdGhlIHByZXZpZXcuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSAgYXR0cmlidXRlIFN0eWxlIGF0dHJpYnV0ZTogZmllbGQtc2l6ZSwgbGFiZWwtc2l6ZSwgYnV0dG9uLXNpemUsIGV0Yy5cblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gIHZhbHVlICAgICBQcm9wZXJ0eSBuZXcgdmFsdWUuXG5cdFx0ICogQHBhcmFtIHtFbGVtZW50fSBjb250YWluZXIgRm9ybSBjb250YWluZXIuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9ICBwcm9wcyAgICAgQmxvY2sgcHJvcGVydGllcy5cblx0XHQgKi9cblx0XHR1cGRhdGVQcmV2aWV3Q1NTVmFyVmFsdWUoIGF0dHJpYnV0ZSwgdmFsdWUsIGNvbnRhaW5lciwgcHJvcHMgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29tcGxleGl0eSwgbWF4LWxpbmVzLXBlci1mdW5jdGlvblxuXHRcdFx0aWYgKCAhIGNvbnRhaW5lciB8fCAhIGF0dHJpYnV0ZSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBwcm9wZXJ0eSA9IGF0dHJpYnV0ZS5yZXBsYWNlKFxuXHRcdFx0XHQvW0EtWl0vZyxcblx0XHRcdFx0KCBsZXR0ZXIgKSA9PiBgLSR7IGxldHRlci50b0xvd2VyQ2FzZSgpIH1gXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIHR5cGVvZiBjdXN0b21TdHlsZXNIYW5kbGVyc1sgcHJvcGVydHkgXSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0Y3VzdG9tU3R5bGVzSGFuZGxlcnNbIHByb3BlcnR5IF0oIGNvbnRhaW5lciwgdmFsdWUgKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHN3aXRjaCAoIHByb3BlcnR5ICkge1xuXHRcdFx0XHRjYXNlICdmaWVsZC1zaXplJzpcblx0XHRcdFx0Y2FzZSAnbGFiZWwtc2l6ZSc6XG5cdFx0XHRcdGNhc2UgJ2J1dHRvbi1zaXplJzpcblx0XHRcdFx0Y2FzZSAnY29udGFpbmVyLXNoYWRvdy1zaXplJzpcblx0XHRcdFx0XHRmb3IgKCBjb25zdCBrZXkgaW4gc2l6ZXNbIHByb3BlcnR5IF1bIHZhbHVlIF0gKSB7XG5cdFx0XHRcdFx0XHRjb250YWluZXIuc3R5bGUuc2V0UHJvcGVydHkoXG5cdFx0XHRcdFx0XHRcdGAtLXdwZm9ybXMtJHsgcHJvcGVydHkgfS0keyBrZXkgfWAsXG5cdFx0XHRcdFx0XHRcdHNpemVzWyBwcm9wZXJ0eSBdWyB2YWx1ZSBdWyBrZXkgXSxcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2ZpZWxkLWJvcmRlci1zdHlsZSc6XG5cdFx0XHRcdFx0aWYgKCB2YWx1ZSA9PT0gJ25vbmUnICkge1xuXHRcdFx0XHRcdFx0YXBwLnRvZ2dsZUZpZWxkQm9yZGVyTm9uZUNTU1ZhclZhbHVlKCBjb250YWluZXIsIHRydWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YXBwLnRvZ2dsZUZpZWxkQm9yZGVyTm9uZUNTU1ZhclZhbHVlKCBjb250YWluZXIsIGZhbHNlICk7XG5cdFx0XHRcdFx0XHRjb250YWluZXIuc3R5bGUuc2V0UHJvcGVydHkoIGAtLXdwZm9ybXMtJHsgcHJvcGVydHkgfWAsIHZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2J1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yJzpcblx0XHRcdFx0XHRhcHAubWF5YmVVcGRhdGVBY2NlbnRDb2xvciggcHJvcHMuYXR0cmlidXRlcy5idXR0b25Cb3JkZXJDb2xvciwgdmFsdWUsIGNvbnRhaW5lciApO1xuXHRcdFx0XHRcdHZhbHVlID0gYXBwLm1heWJlU2V0QnV0dG9uQWx0QmFja2dyb3VuZENvbG9yKCB2YWx1ZSwgcHJvcHMuYXR0cmlidXRlcy5idXR0b25Cb3JkZXJDb2xvciwgY29udGFpbmVyICk7XG5cdFx0XHRcdFx0YXBwLm1heWJlU2V0QnV0dG9uQWx0VGV4dENvbG9yKCBwcm9wcy5hdHRyaWJ1dGVzLmJ1dHRvblRleHRDb2xvciwgdmFsdWUsIHByb3BzLmF0dHJpYnV0ZXMuYnV0dG9uQm9yZGVyQ29sb3IsIGNvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnRhaW5lci5zdHlsZS5zZXRQcm9wZXJ0eSggYC0td3Bmb3Jtcy0keyBwcm9wZXJ0eSB9YCwgdmFsdWUgKTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdidXR0b24tYm9yZGVyLWNvbG9yJzpcblx0XHRcdFx0XHRhcHAubWF5YmVVcGRhdGVBY2NlbnRDb2xvciggdmFsdWUsIHByb3BzLmF0dHJpYnV0ZXMuYnV0dG9uQmFja2dyb3VuZENvbG9yLCBjb250YWluZXIgKTtcblx0XHRcdFx0XHRhcHAubWF5YmVTZXRCdXR0b25BbHRUZXh0Q29sb3IoIHByb3BzLmF0dHJpYnV0ZXMuYnV0dG9uVGV4dENvbG9yLCBwcm9wcy5hdHRyaWJ1dGVzLmJ1dHRvbkJhY2tncm91bmRDb2xvciwgdmFsdWUsIGNvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnRhaW5lci5zdHlsZS5zZXRQcm9wZXJ0eSggYC0td3Bmb3Jtcy0keyBwcm9wZXJ0eSB9YCwgdmFsdWUgKTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdidXR0b24tdGV4dC1jb2xvcic6XG5cdFx0XHRcdFx0YXBwLm1heWJlU2V0QnV0dG9uQWx0VGV4dENvbG9yKCB2YWx1ZSwgcHJvcHMuYXR0cmlidXRlcy5idXR0b25CYWNrZ3JvdW5kQ29sb3IsIHByb3BzLmF0dHJpYnV0ZXMuYnV0dG9uQm9yZGVyQ29sb3IsIGNvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnRhaW5lci5zdHlsZS5zZXRQcm9wZXJ0eSggYC0td3Bmb3Jtcy0keyBwcm9wZXJ0eSB9YCwgdmFsdWUgKTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGNvbnRhaW5lci5zdHlsZS5zZXRQcm9wZXJ0eSggYC0td3Bmb3Jtcy0keyBwcm9wZXJ0eSB9YCwgdmFsdWUgKTtcblx0XHRcdFx0XHRjb250YWluZXIuc3R5bGUuc2V0UHJvcGVydHkoIGAtLXdwZm9ybXMtJHsgcHJvcGVydHkgfS1zcGFyZWAsIHZhbHVlICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFNldC91bnNldCBmaWVsZCBib3JkZXIgdmFycyBpbiBjYXNlIG9mIGJvcmRlci1zdHlsZSBpcyBub25lLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gIGNvbnRhaW5lciBGb3JtIGNvbnRhaW5lci5cblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IHNldCAgICAgICBUcnVlIHdoZW4gc2V0LCBmYWxzZSB3aGVuIHVuc2V0LlxuXHRcdCAqL1xuXHRcdHRvZ2dsZUZpZWxkQm9yZGVyTm9uZUNTU1ZhclZhbHVlKCBjb250YWluZXIsIHNldCApIHtcblx0XHRcdGNvbnN0IGNvbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvciggJ2Zvcm0nICk7XG5cblx0XHRcdGlmICggc2V0ICkge1xuXHRcdFx0XHRjb250LnN0eWxlLnNldFByb3BlcnR5KCAnLS13cGZvcm1zLWZpZWxkLWJvcmRlci1zdHlsZScsICdzb2xpZCcgKTtcblx0XHRcdFx0Y29udC5zdHlsZS5zZXRQcm9wZXJ0eSggJy0td3Bmb3Jtcy1maWVsZC1ib3JkZXItc2l6ZScsICcxcHgnICk7XG5cdFx0XHRcdGNvbnQuc3R5bGUuc2V0UHJvcGVydHkoICctLXdwZm9ybXMtZmllbGQtYm9yZGVyLWNvbG9yJywgJ3RyYW5zcGFyZW50JyApO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29udC5zdHlsZS5zZXRQcm9wZXJ0eSggJy0td3Bmb3Jtcy1maWVsZC1ib3JkZXItc3R5bGUnLCBudWxsICk7XG5cdFx0XHRjb250LnN0eWxlLnNldFByb3BlcnR5KCAnLS13cGZvcm1zLWZpZWxkLWJvcmRlci1zaXplJywgbnVsbCApO1xuXHRcdFx0Y29udC5zdHlsZS5zZXRQcm9wZXJ0eSggJy0td3Bmb3Jtcy1maWVsZC1ib3JkZXItY29sb3InLCBudWxsICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIE1heWJlIHNldCB0aGUgYnV0dG9uJ3MgYWx0ZXJuYXRpdmUgYmFja2dyb3VuZCBjb2xvci5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAgICAgICAgICAgIEF0dHJpYnV0ZSB2YWx1ZS5cblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gYnV0dG9uQm9yZGVyQ29sb3IgQnV0dG9uIGJvcmRlciBjb2xvci5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gY29udGFpbmVyICAgICAgICAgRm9ybSBjb250YWluZXIuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd8Kn0gTmV3IGJhY2tncm91bmQgY29sb3IuXG5cdFx0ICovXG5cdFx0bWF5YmVTZXRCdXR0b25BbHRCYWNrZ3JvdW5kQ29sb3IoIHZhbHVlLCBidXR0b25Cb3JkZXJDb2xvciwgY29udGFpbmVyICkge1xuXHRcdFx0Ly8gU2V0dGluZyBjc3MgcHJvcGVydHkgdmFsdWUgdG8gY2hpbGQgYGZvcm1gIGVsZW1lbnQgb3ZlcnJpZGVzIHRoZSBwYXJlbnQgcHJvcGVydHkgdmFsdWUuXG5cdFx0XHRjb25zdCBmb3JtID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoICdmb3JtJyApO1xuXG5cdFx0XHRmb3JtLnN0eWxlLnNldFByb3BlcnR5KCAnLS13cGZvcm1zLWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yLWFsdCcsIHZhbHVlICk7XG5cblx0XHRcdGlmICggV1BGb3Jtc1V0aWxzLmNzc0NvbG9yc1V0aWxzLmlzVHJhbnNwYXJlbnRDb2xvciggdmFsdWUgKSApIHtcblx0XHRcdFx0cmV0dXJuIFdQRm9ybXNVdGlscy5jc3NDb2xvcnNVdGlscy5pc1RyYW5zcGFyZW50Q29sb3IoIGJ1dHRvbkJvcmRlckNvbG9yICkgPyBkZWZhdWx0U3R5bGVTZXR0aW5ncy5idXR0b25CYWNrZ3JvdW5kQ29sb3IgOiBidXR0b25Cb3JkZXJDb2xvcjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBNYXliZSBzZXQgdGhlIGJ1dHRvbidzIGFsdGVybmF0aXZlIHRleHQgY29sb3IuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAgICAgICAgICAgICAgICAgQXR0cmlidXRlIHZhbHVlLlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBidXR0b25CYWNrZ3JvdW5kQ29sb3IgQnV0dG9uIGJhY2tncm91bmQgY29sb3IuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGJ1dHRvbkJvcmRlckNvbG9yICAgICBCdXR0b24gYm9yZGVyIGNvbG9yLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBjb250YWluZXIgICAgICAgICAgICAgRm9ybSBjb250YWluZXIuXG5cdFx0ICovXG5cdFx0bWF5YmVTZXRCdXR0b25BbHRUZXh0Q29sb3IoIHZhbHVlLCBidXR0b25CYWNrZ3JvdW5kQ29sb3IsIGJ1dHRvbkJvcmRlckNvbG9yLCBjb250YWluZXIgKSB7XG5cdFx0XHRjb25zdCBmb3JtID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoICdmb3JtJyApO1xuXG5cdFx0XHRsZXQgYWx0Q29sb3IgPSBudWxsO1xuXG5cdFx0XHR2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdGlmIChcblx0XHRcdFx0V1BGb3Jtc1V0aWxzLmNzc0NvbG9yc1V0aWxzLmlzVHJhbnNwYXJlbnRDb2xvciggdmFsdWUgKSB8fFxuXHRcdFx0XHR2YWx1ZSA9PT0gYnV0dG9uQmFja2dyb3VuZENvbG9yIHx8XG5cdFx0XHRcdChcblx0XHRcdFx0XHRXUEZvcm1zVXRpbHMuY3NzQ29sb3JzVXRpbHMuaXNUcmFuc3BhcmVudENvbG9yKCBidXR0b25CYWNrZ3JvdW5kQ29sb3IgKSAmJlxuXHRcdFx0XHRcdHZhbHVlID09PSBidXR0b25Cb3JkZXJDb2xvclxuXHRcdFx0XHQpXG5cdFx0XHQpIHtcblx0XHRcdFx0YWx0Q29sb3IgPSBXUEZvcm1zVXRpbHMuY3NzQ29sb3JzVXRpbHMuZ2V0Q29udHJhc3RDb2xvciggYnV0dG9uQmFja2dyb3VuZENvbG9yICk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnRhaW5lci5zdHlsZS5zZXRQcm9wZXJ0eSggYC0td3Bmb3Jtcy1idXR0b24tdGV4dC1jb2xvci1hbHRgLCB2YWx1ZSApO1xuXHRcdFx0Zm9ybS5zdHlsZS5zZXRQcm9wZXJ0eSggYC0td3Bmb3Jtcy1idXR0b24tdGV4dC1jb2xvci1hbHRgLCBhbHRDb2xvciApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBNYXliZSB1cGRhdGUgYWNjZW50IGNvbG9yLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgICAgICAgICAgICAgICAgIENvbG9yIHZhbHVlLlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBidXR0b25CYWNrZ3JvdW5kQ29sb3IgQnV0dG9uIGJhY2tncm91bmQgY29sb3IuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGNvbnRhaW5lciAgICAgICAgICAgICBGb3JtIGNvbnRhaW5lci5cblx0XHQgKi9cblx0XHRtYXliZVVwZGF0ZUFjY2VudENvbG9yKCBjb2xvciwgYnV0dG9uQmFja2dyb3VuZENvbG9yLCBjb250YWluZXIgKSB7XG5cdFx0XHQvLyBTZXR0aW5nIGNzcyBwcm9wZXJ0eSB2YWx1ZSB0byBjaGlsZCBgZm9ybWAgZWxlbWVudCBvdmVycmlkZXMgdGhlIHBhcmVudCBwcm9wZXJ0eSB2YWx1ZS5cblx0XHRcdGNvbnN0IGZvcm0gPSBjb250YWluZXIucXVlcnlTZWxlY3RvciggJ2Zvcm0nICk7XG5cblx0XHRcdC8vIEZhbGxiYWNrIHRvIGRlZmF1bHQgY29sb3IgaWYgdGhlIGJvcmRlciBjb2xvciBpcyB0cmFuc3BhcmVudC5cblx0XHRcdGNvbG9yID0gV1BGb3Jtc1V0aWxzLmNzc0NvbG9yc1V0aWxzLmlzVHJhbnNwYXJlbnRDb2xvciggY29sb3IgKSA/IGRlZmF1bHRTdHlsZVNldHRpbmdzLmJ1dHRvbkJhY2tncm91bmRDb2xvciA6IGNvbG9yO1xuXG5cdFx0XHRpZiAoIFdQRm9ybXNVdGlscy5jc3NDb2xvcnNVdGlscy5pc1RyYW5zcGFyZW50Q29sb3IoIGJ1dHRvbkJhY2tncm91bmRDb2xvciApICkge1xuXHRcdFx0XHRmb3JtLnN0eWxlLnNldFByb3BlcnR5KCAnLS13cGZvcm1zLWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yLWFsdCcsICdyZ2JhKCAwLCAwLCAwLCAwICknICk7XG5cdFx0XHRcdGZvcm0uc3R5bGUuc2V0UHJvcGVydHkoICctLXdwZm9ybXMtYnV0dG9uLWJhY2tncm91bmQtY29sb3InLCBjb2xvciApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29udGFpbmVyLnN0eWxlLnNldFByb3BlcnR5KCAnLS13cGZvcm1zLWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yLWFsdCcsIGJ1dHRvbkJhY2tncm91bmRDb2xvciApO1xuXHRcdFx0XHRmb3JtLnN0eWxlLnNldFByb3BlcnR5KCAnLS13cGZvcm1zLWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yLWFsdCcsIG51bGwgKTtcblx0XHRcdFx0Zm9ybS5zdHlsZS5zZXRQcm9wZXJ0eSggJy0td3Bmb3Jtcy1idXR0b24tYmFja2dyb3VuZC1jb2xvcicsIG51bGwgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IHNldHRpbmdzIGZpZWxkcyBldmVudCBoYW5kbGVycy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHByb3BzIEJsb2NrIHByb3BlcnRpZXMuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtPYmplY3R9IE9iamVjdCB0aGF0IGNvbnRhaW5zIGV2ZW50IGhhbmRsZXJzIGZvciB0aGUgc2V0dGluZ3MgZmllbGRzLlxuXHRcdCAqL1xuXHRcdGdldFNldHRpbmdzRmllbGRzSGFuZGxlcnMoIHByb3BzICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1saW5lcy1wZXItZnVuY3Rpb25cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBGaWVsZCBzdHlsZSBhdHRyaWJ1dGUgY2hhbmdlIGV2ZW50IGhhbmRsZXIuXG5cdFx0XHRcdCAqXG5cdFx0XHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdFx0XHQgKlxuXHRcdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlIEF0dHJpYnV0ZSBuYW1lLlxuXHRcdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgICAgIE5ldyBhdHRyaWJ1dGUgdmFsdWUuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRzdHlsZUF0dHJDaGFuZ2UoIGF0dHJpYnV0ZSwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0Y29uc3QgYmxvY2sgPSBhcHAuZ2V0QmxvY2tDb250YWluZXIoIHByb3BzICksXG5cdFx0XHRcdFx0XHRjb250YWluZXIgPSBibG9jay5xdWVyeVNlbGVjdG9yKCBgI3dwZm9ybXMtJHsgcHJvcHMuYXR0cmlidXRlcy5mb3JtSWQgfWAgKSxcblx0XHRcdFx0XHRcdHNldEF0dHIgPSB7fTtcblxuXHRcdFx0XHRcdC8vIFVuc2V0IHRoZSBjb2xvciBtZWFucyBzZXR0aW5nIHRoZSB0cmFuc3BhcmVudCBjb2xvci5cblx0XHRcdFx0XHRpZiAoIGF0dHJpYnV0ZS5pbmNsdWRlcyggJ0NvbG9yJyApICkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZSA/PyAncmdiYSggMCwgMCwgMCwgMCApJztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRhcHAudXBkYXRlUHJldmlld0NTU1ZhclZhbHVlKCBhdHRyaWJ1dGUsIHZhbHVlLCBjb250YWluZXIsIHByb3BzICk7XG5cblx0XHRcdFx0XHRzZXRBdHRyWyBhdHRyaWJ1dGUgXSA9IHZhbHVlO1xuXG5cdFx0XHRcdFx0YXBwLnNldEJsb2NrUnVudGltZVN0YXRlVmFyKCBwcm9wcy5jbGllbnRJZCwgJ3ByZXZBdHRyaWJ1dGVzU3RhdGUnLCBwcm9wcy5hdHRyaWJ1dGVzICk7XG5cdFx0XHRcdFx0cHJvcHMuc2V0QXR0cmlidXRlcyggc2V0QXR0ciApO1xuXG5cdFx0XHRcdFx0dHJpZ2dlclNlcnZlclJlbmRlciA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0dGhpcy51cGRhdGVDb3B5UGFzdGVDb250ZW50KCk7XG5cblx0XHRcdFx0XHRhcHAucGFuZWxzLnRoZW1lcy51cGRhdGVDdXN0b21UaGVtZUF0dHJpYnV0ZSggYXR0cmlidXRlLCB2YWx1ZSwgcHJvcHMgKTtcblxuXHRcdFx0XHRcdHRoaXMubWF5YmVUb2dnbGVEcm9wZG93biggcHJvcHMsIGF0dHJpYnV0ZSApO1xuXG5cdFx0XHRcdFx0Ly8gVHJpZ2dlciBldmVudCBmb3IgZGV2ZWxvcGVycy5cblx0XHRcdFx0XHRlbC4kd2luZG93LnRyaWdnZXIoICd3cGZvcm1zRm9ybVNlbGVjdG9yU3R5bGVBdHRyQ2hhbmdlJywgWyBibG9jaywgcHJvcHMsIGF0dHJpYnV0ZSwgdmFsdWUgXSApO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBIYW5kbGVzIHRoZSB0b2dnbGluZyBvZiB0aGUgZHJvcGRvd24gbWVudSdzIHZpc2liaWxpdHkuXG5cdFx0XHRcdCAqXG5cdFx0XHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdFx0XHQgKlxuXHRcdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgICAgIFRoZSBibG9jayBwcm9wZXJ0aWVzLlxuXHRcdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlIFRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUgYmVpbmcgY2hhbmdlZC5cblx0XHRcdFx0ICovXG5cdFx0XHRcdG1heWJlVG9nZ2xlRHJvcGRvd24oIHByb3BzLCBhdHRyaWJ1dGUgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2hhZG93XG5cdFx0XHRcdFx0Y29uc3QgZm9ybUlkID0gcHJvcHMuYXR0cmlidXRlcy5mb3JtSWQ7XG5cdFx0XHRcdFx0Y29uc3QgbWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIGAjd3Bmb3Jtcy1mb3JtLSR7IGZvcm1JZCB9IC5jaG9pY2VzX19saXN0LmNob2ljZXNfX2xpc3QtLWRyb3Bkb3duYCApO1xuXHRcdFx0XHRcdGNvbnN0IGNsYXNzaWNNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggYCN3cGZvcm1zLWZvcm0tJHsgZm9ybUlkIH0gLndwZm9ybXMtZmllbGQtc2VsZWN0LXN0eWxlLWNsYXNzaWMgc2VsZWN0YCApO1xuXG5cdFx0XHRcdFx0aWYgKCBhdHRyaWJ1dGUgPT09ICdmaWVsZE1lbnVDb2xvcicgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1lbnUgKSB7XG5cdFx0XHRcdFx0XHRcdG1lbnUuY2xhc3NMaXN0LmFkZCggJ2lzLWFjdGl2ZScgKTtcblx0XHRcdFx0XHRcdFx0bWVudS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdpcy1vcGVuJyApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5zaG93Q2xhc3NpY01lbnUoIGNsYXNzaWNNZW51ICk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNsZWFyVGltZW91dCggZHJvcGRvd25UaW1lb3V0ICk7XG5cblx0XHRcdFx0XHRcdGRyb3Bkb3duVGltZW91dCA9IHNldFRpbWVvdXQoICgpID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgdG9DbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIGAjd3Bmb3Jtcy1mb3JtLSR7IGZvcm1JZCB9IC5jaG9pY2VzX19saXN0LmNob2ljZXNfX2xpc3QtLWRyb3Bkb3duYCApO1xuXG5cdFx0XHRcdFx0XHRcdGlmICggdG9DbG9zZSApIHtcblx0XHRcdFx0XHRcdFx0XHR0b0Nsb3NlLmNsYXNzTGlzdC5yZW1vdmUoICdpcy1hY3RpdmUnICk7XG5cdFx0XHRcdFx0XHRcdFx0dG9DbG9zZS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdpcy1vcGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuaGlkZUNsYXNzaWNNZW51KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBgI3dwZm9ybXMtZm9ybS0keyBmb3JtSWQgfSAud3Bmb3Jtcy1maWVsZC1zZWxlY3Qtc3R5bGUtY2xhc3NpYyBzZWxlY3RgICkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSwgNTAwMCApO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIG1lbnUgKSB7XG5cdFx0XHRcdFx0XHRtZW51LmNsYXNzTGlzdC5yZW1vdmUoICdpcy1hY3RpdmUnICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuaGlkZUNsYXNzaWNNZW51KCBjbGFzc2ljTWVudSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogU2hvd3MgdGhlIGNsYXNzaWMgbWVudS5cblx0XHRcdFx0ICpcblx0XHRcdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0XHRcdCAqXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBjbGFzc2ljTWVudSBUaGUgY2xhc3NpYyBtZW51LlxuXHRcdFx0XHQgKi9cblx0XHRcdFx0c2hvd0NsYXNzaWNNZW51KCBjbGFzc2ljTWVudSApIHtcblx0XHRcdFx0XHRpZiAoICEgY2xhc3NpY01lbnUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y2xhc3NpY01lbnUuc2l6ZSA9IDI7XG5cdFx0XHRcdFx0Y2xhc3NpY01lbnUuc3R5bGUuY3NzVGV4dCA9ICdwYWRkaW5nLXRvcDogNDBweDsgcGFkZGluZy1pbmxpbmUtZW5kOiAwOyBwYWRkaW5nLWlubGluZS1zdGFydDogMDsgcG9zaXRpb246IHJlbGF0aXZlOyc7XG5cdFx0XHRcdFx0Y2xhc3NpY01lbnUucXVlcnlTZWxlY3RvckFsbCggJ29wdGlvbicgKS5mb3JFYWNoKCAoIG9wdGlvbiApID0+IHtcblx0XHRcdFx0XHRcdG9wdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2JvcmRlci1sZWZ0OiAxcHggc29saWQgIzhjOGY5NDsgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgIzhjOGY5NDsgcGFkZGluZzogMCAxMHB4OyB6LWluZGV4OiA5OTk5OTk7IHBvc2l0aW9uOiByZWxhdGl2ZTsnO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRjbGFzc2ljTWVudS5xdWVyeVNlbGVjdG9yKCAnb3B0aW9uOmxhc3QtY2hpbGQnICkuc3R5bGUuY3NzVGV4dCA9ICdib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiA0cHg7IGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiA0cHg7IHBhZGRpbmc6IDAgMTBweDsgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjOGM4Zjk0OyBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjOGM4Zjk0OyBib3JkZXItYm90dG9tOiAxcHggc29saWQgIzhjOGY5NDsgei1pbmRleDogOTk5OTk5OyBwb3NpdGlvbjogcmVsYXRpdmU7Jztcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogSGlkZXMgdGhlIGNsYXNzaWMgbWVudS5cblx0XHRcdFx0ICpcblx0XHRcdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0XHRcdCAqXG5cdFx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBjbGFzc2ljTWVudSBUaGUgY2xhc3NpYyBtZW51LlxuXHRcdFx0XHQgKi9cblx0XHRcdFx0aGlkZUNsYXNzaWNNZW51KCBjbGFzc2ljTWVudSApIHtcblx0XHRcdFx0XHRpZiAoICEgY2xhc3NpY01lbnUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y2xhc3NpY01lbnUuc2l6ZSA9IDA7XG5cdFx0XHRcdFx0Y2xhc3NpY01lbnUuc3R5bGUuY3NzVGV4dCA9ICdwYWRkaW5nLXRvcDogMDsgcGFkZGluZy1pbmxpbmUtZW5kOiAyNHB4OyBwYWRkaW5nLWlubGluZS1zdGFydDogMTJweDsgcG9zaXRpb246IHJlbGF0aXZlOyc7XG5cdFx0XHRcdFx0Y2xhc3NpY01lbnUucXVlcnlTZWxlY3RvckFsbCggJ29wdGlvbicgKS5mb3JFYWNoKCAoIG9wdGlvbiApID0+IHtcblx0XHRcdFx0XHRcdG9wdGlvbi5zdHlsZS5jc3NUZXh0ID0gJ2JvcmRlcjogbm9uZTsnO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogRmllbGQgcmVndWxhciBhdHRyaWJ1dGUgY2hhbmdlIGV2ZW50IGhhbmRsZXIuXG5cdFx0XHRcdCAqXG5cdFx0XHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdFx0XHQgKlxuXHRcdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlIEF0dHJpYnV0ZSBuYW1lLlxuXHRcdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgICAgIE5ldyBhdHRyaWJ1dGUgdmFsdWUuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRhdHRyQ2hhbmdlKCBhdHRyaWJ1dGUsIHZhbHVlICkge1xuXHRcdFx0XHRcdGNvbnN0IHNldEF0dHIgPSB7fTtcblxuXHRcdFx0XHRcdHNldEF0dHJbIGF0dHJpYnV0ZSBdID0gdmFsdWU7XG5cblx0XHRcdFx0XHRhcHAuc2V0QmxvY2tSdW50aW1lU3RhdGVWYXIoIHByb3BzLmNsaWVudElkLCAncHJldkF0dHJpYnV0ZXNTdGF0ZScsIHByb3BzLmF0dHJpYnV0ZXMgKTtcblx0XHRcdFx0XHRwcm9wcy5zZXRBdHRyaWJ1dGVzKCBzZXRBdHRyICk7XG5cblx0XHRcdFx0XHR0cmlnZ2VyU2VydmVyUmVuZGVyID0gdHJ1ZTtcblxuXHRcdFx0XHRcdHRoaXMudXBkYXRlQ29weVBhc3RlQ29udGVudCgpO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBVcGRhdGUgY29udGVudCBvZiB0aGUgXCJDb3B5L1Bhc3RlXCIgZmllbGRzLlxuXHRcdFx0XHQgKlxuXHRcdFx0XHQgKiBAc2luY2UgMS44LjFcblx0XHRcdFx0ICovXG5cdFx0XHRcdHVwZGF0ZUNvcHlQYXN0ZUNvbnRlbnQoKSB7XG5cdFx0XHRcdFx0Y29uc3QgY29udGVudCA9IHt9O1xuXHRcdFx0XHRcdGNvbnN0IGF0dHMgPSB3cC5kYXRhLnNlbGVjdCggJ2NvcmUvYmxvY2stZWRpdG9yJyApLmdldEJsb2NrQXR0cmlidXRlcyggcHJvcHMuY2xpZW50SWQgKTtcblxuXHRcdFx0XHRcdGZvciAoIGNvbnN0IGtleSBpbiBkZWZhdWx0U3R5bGVTZXR0aW5ncyApIHtcblx0XHRcdFx0XHRcdGNvbnRlbnRbIGtleSBdID0gYXR0c1sga2V5IF07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cHJvcHMuc2V0QXR0cmlidXRlcyggeyBjb3B5UGFzdGVKc29uVmFsdWU6IEpTT04uc3RyaW5naWZ5KCBjb250ZW50ICkgfSApO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBQYXN0ZSBzZXR0aW5ncyBoYW5kbGVyLlxuXHRcdFx0XHQgKlxuXHRcdFx0XHQgKiBAc2luY2UgMS44LjFcblx0XHRcdFx0ICpcblx0XHRcdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIE5ldyBhdHRyaWJ1dGUgdmFsdWUuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRwYXN0ZVNldHRpbmdzKCB2YWx1ZSApIHtcblx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcblxuXHRcdFx0XHRcdGNvbnN0IHBhc3RlQXR0cmlidXRlcyA9IGFwcC5wYXJzZVZhbGlkYXRlSnNvbiggdmFsdWUgKTtcblxuXHRcdFx0XHRcdGlmICggISBwYXN0ZUF0dHJpYnV0ZXMgKSB7XG5cdFx0XHRcdFx0XHR3cC5kYXRhLmRpc3BhdGNoKCAnY29yZS9ub3RpY2VzJyApLmNyZWF0ZUVycm9yTm90aWNlKFxuXHRcdFx0XHRcdFx0XHRzdHJpbmdzLmNvcHlfcGFzdGVfZXJyb3IsXG5cdFx0XHRcdFx0XHRcdHsgaWQ6ICd3cGZvcm1zLWpzb24tcGFyc2UtZXJyb3InIH1cblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlQ29weVBhc3RlQ29udGVudCgpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cGFzdGVBdHRyaWJ1dGVzLmNvcHlQYXN0ZUpzb25WYWx1ZSA9IHZhbHVlO1xuXG5cdFx0XHRcdFx0Y29uc3QgdGhlbWVTbHVnID0gYXBwLnBhbmVscy50aGVtZXMubWF5YmVDcmVhdGVDdXN0b21UaGVtZUZyb21BdHRyaWJ1dGVzKCBwYXN0ZUF0dHJpYnV0ZXMgKTtcblxuXHRcdFx0XHRcdGFwcC5zZXRCbG9ja1J1bnRpbWVTdGF0ZVZhciggcHJvcHMuY2xpZW50SWQsICdwcmV2QXR0cmlidXRlc1N0YXRlJywgcHJvcHMuYXR0cmlidXRlcyApO1xuXHRcdFx0XHRcdHByb3BzLnNldEF0dHJpYnV0ZXMoIHBhc3RlQXR0cmlidXRlcyApO1xuXHRcdFx0XHRcdGFwcC5wYW5lbHMudGhlbWVzLnNldEJsb2NrVGhlbWUoIHByb3BzLCB0aGVtZVNsdWcgKTtcblxuXHRcdFx0XHRcdHRyaWdnZXJTZXJ2ZXJSZW5kZXIgPSBmYWxzZTtcblx0XHRcdFx0fSxcblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFBhcnNlIGFuZCB2YWxpZGF0ZSBKU09OIHN0cmluZy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIEpTT04gc3RyaW5nLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbnxvYmplY3R9IFBhcnNlZCBKU09OIG9iamVjdCBPUiBmYWxzZSBvbiBlcnJvci5cblx0XHQgKi9cblx0XHRwYXJzZVZhbGlkYXRlSnNvbiggdmFsdWUgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycgKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGF0dHM7XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGF0dHMgPSBKU09OLnBhcnNlKCB2YWx1ZS50cmltKCkgKTtcblx0XHRcdH0gY2F0Y2ggKCBlcnJvciApIHtcblx0XHRcdFx0YXR0cyA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gYXR0cztcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IFdQRm9ybXMgaWNvbiBET00gZWxlbWVudC5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7RE9NLmVsZW1lbnR9IFdQRm9ybXMgaWNvbiBET00gZWxlbWVudC5cblx0XHQgKi9cblx0XHRnZXRJY29uKCkge1xuXHRcdFx0cmV0dXJuIGNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdzdmcnLFxuXHRcdFx0XHR7IHdpZHRoOiAyMCwgaGVpZ2h0OiAyMCwgdmlld0JveDogJzAgMCA2MTIgNjEyJywgY2xhc3NOYW1lOiAnZGFzaGljb24nIH0sXG5cdFx0XHRcdGNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J3BhdGgnLFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGZpbGw6ICdjdXJyZW50Q29sb3InLFxuXHRcdFx0XHRcdFx0ZDogJ001NDQsMEg2OEMzMC40NDUsMCwwLDMwLjQ0NSwwLDY4djQ3NmMwLDM3LjU1NiwzMC40NDUsNjgsNjgsNjhoNDc2YzM3LjU1NiwwLDY4LTMwLjQ0NCw2OC02OFY2OCBDNjEyLDMwLjQ0NSw1ODEuNTU2LDAsNTQ0LDB6IE00NjQuNDQsNjhMMzg3LjYsMTIwLjAyTDMyMy4zNCw2OEg0NjQuNDR6IE0yODguNjYsNjhsLTY0LjI2LDUyLjAyTDE0Ny41Niw2OEgyODguNjZ6IE01NDQsNTQ0SDY4IFY2OGgyMi4xbDEzNiw5Mi4xNGw3OS45LTY0LjZsNzkuNTYsNjQuNmwxMzYtOTIuMTRINTQ0VjU0NHogTTExNC4yNCwyNjMuMTZoOTUuODh2LTQ4LjI4aC05NS44OFYyNjMuMTZ6IE0xMTQuMjQsMzYwLjRoOTUuODggdi00OC42MmgtOTUuODhWMzYwLjR6IE0yNDIuNzYsMzYwLjRoMjU1di00OC42MmgtMjU1VjM2MC40TDI0Mi43NiwzNjAuNHogTTI0Mi43NiwyNjMuMTZoMjU1di00OC4yOGgtMjU1VjI2My4xNkwyNDIuNzYsMjYzLjE2eiBNMzY4LjIyLDQ1Ny4zaDEyOS41NFY0MDhIMzY4LjIyVjQ1Ny4zeicsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0KSxcblx0XHRcdCk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdldCBXUEZvcm1zIGJsb2Nrcy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7QXJyYXl9IEJsb2NrcyBhcnJheS5cblx0XHQgKi9cblx0XHRnZXRXUEZvcm1zQmxvY2tzKCkge1xuXHRcdFx0Y29uc3Qgd3Bmb3Jtc0Jsb2NrcyA9IHdwLmRhdGEuc2VsZWN0KCAnY29yZS9ibG9jay1lZGl0b3InICkuZ2V0QmxvY2tzKCk7XG5cblx0XHRcdHJldHVybiB3cGZvcm1zQmxvY2tzLmZpbHRlciggKCBwcm9wcyApID0+IHtcblx0XHRcdFx0cmV0dXJuIHByb3BzLm5hbWUgPT09ICd3cGZvcm1zL2Zvcm0tc2VsZWN0b3InO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgV1BGb3JtcyBibG9ja3MuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBCbG9jayBwcm9wZXJ0aWVzLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fSBCbG9jayBhdHRyaWJ1dGVzLlxuXHRcdCAqL1xuXHRcdGlzQ2xpZW50SWRBdHRyVW5pcXVlKCBwcm9wcyApIHtcblx0XHRcdGNvbnN0IHdwZm9ybXNCbG9ja3MgPSBhcHAuZ2V0V1BGb3Jtc0Jsb2NrcygpO1xuXG5cdFx0XHRmb3IgKCBjb25zdCBrZXkgaW4gd3Bmb3Jtc0Jsb2NrcyApIHtcblx0XHRcdFx0Ly8gU2tpcCB0aGUgY3VycmVudCBibG9jay5cblx0XHRcdFx0aWYgKCB3cGZvcm1zQmxvY2tzWyBrZXkgXS5jbGllbnRJZCA9PT0gcHJvcHMuY2xpZW50SWQgKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHdwZm9ybXNCbG9ja3NbIGtleSBdLmF0dHJpYnV0ZXMuY2xpZW50SWQgPT09IHByb3BzLmF0dHJpYnV0ZXMuY2xpZW50SWQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgYmxvY2sgYXR0cmlidXRlcy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fSBCbG9jayBhdHRyaWJ1dGVzLlxuXHRcdCAqL1xuXHRcdGdldEJsb2NrQXR0cmlidXRlcygpIHtcblx0XHRcdHJldHVybiBjb21tb25BdHRyaWJ1dGVzO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgYmxvY2sgcnVudGltZSBzdGF0ZSB2YXJpYWJsZS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGNsaWVudElkIEJsb2NrIGNsaWVudCBJRC5cblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdmFyTmFtZSAgQmxvY2sgcnVudGltZSB2YXJpYWJsZSBuYW1lLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Kn0gQmxvY2sgcnVudGltZSBzdGF0ZSB2YXJpYWJsZSB2YWx1ZS5cblx0XHQgKi9cblx0XHRnZXRCbG9ja1J1bnRpbWVTdGF0ZVZhciggY2xpZW50SWQsIHZhck5hbWUgKSB7XG5cdFx0XHRyZXR1cm4gYmxvY2tzWyBjbGllbnRJZCBdPy5bIHZhck5hbWUgXTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogU2V0IGJsb2NrIHJ1bnRpbWUgc3RhdGUgdmFyaWFibGUgdmFsdWUuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBjbGllbnRJZCBCbG9jayBjbGllbnQgSUQuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhck5hbWUgIEJsb2NrIHJ1bnRpbWUgc3RhdGUga2V5LlxuXHRcdCAqIEBwYXJhbSB7Kn0gICAgICB2YWx1ZSAgICBTdGF0ZSB2YXJpYWJsZSB2YWx1ZS5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgb24gc3VjY2Vzcy5cblx0XHQgKi9cblx0XHRzZXRCbG9ja1J1bnRpbWVTdGF0ZVZhciggY2xpZW50SWQsIHZhck5hbWUsIHZhbHVlICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbXBsZXhpdHlcblx0XHRcdGlmICggISBjbGllbnRJZCB8fCAhIHZhck5hbWUgKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0YmxvY2tzWyBjbGllbnRJZCBdID0gYmxvY2tzWyBjbGllbnRJZCBdIHx8IHt9O1xuXHRcdFx0YmxvY2tzWyBjbGllbnRJZCBdWyB2YXJOYW1lIF0gPSB2YWx1ZTtcblxuXHRcdFx0Ly8gUHJldmVudCByZWZlcmVuY2luZyB0byBvYmplY3QuXG5cdFx0XHRpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgISBBcnJheS5pc0FycmF5KCB2YWx1ZSApICYmIHZhbHVlICE9PSBudWxsICkge1xuXHRcdFx0XHRibG9ja3NbIGNsaWVudElkIF1bIHZhck5hbWUgXSA9IHsgLi4udmFsdWUgfTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdldCBmb3JtIHNlbGVjdG9yIG9wdGlvbnMuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44LjFcblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge0FycmF5fSBGb3JtIG9wdGlvbnMuXG5cdFx0ICovXG5cdFx0Z2V0Rm9ybU9wdGlvbnMoKSB7XG5cdFx0XHRjb25zdCBmb3JtT3B0aW9ucyA9IGZvcm1MaXN0Lm1hcCggKCB2YWx1ZSApID0+IChcblx0XHRcdFx0eyB2YWx1ZTogdmFsdWUuSUQsIGxhYmVsOiB2YWx1ZS5wb3N0X3RpdGxlIH1cblx0XHRcdCkgKTtcblxuXHRcdFx0Zm9ybU9wdGlvbnMudW5zaGlmdCggeyB2YWx1ZTogJycsIGxhYmVsOiBzdHJpbmdzLmZvcm1fc2VsZWN0IH0gKTtcblxuXHRcdFx0cmV0dXJuIGZvcm1PcHRpb25zO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgc2l6ZSBzZWxlY3RvciBvcHRpb25zLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC4xXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtBcnJheX0gU2l6ZSBvcHRpb25zLlxuXHRcdCAqL1xuXHRcdGdldFNpemVPcHRpb25zKCkge1xuXHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxhYmVsOiBzdHJpbmdzLnNtYWxsLFxuXHRcdFx0XHRcdHZhbHVlOiAnc21hbGwnLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGFiZWw6IHN0cmluZ3MubWVkaXVtLFxuXHRcdFx0XHRcdHZhbHVlOiAnbWVkaXVtJyxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxhYmVsOiBzdHJpbmdzLmxhcmdlLFxuXHRcdFx0XHRcdHZhbHVlOiAnbGFyZ2UnLFxuXHRcdFx0XHR9LFxuXHRcdFx0XTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogRXZlbnQgYHdwZm9ybXNGb3JtU2VsZWN0b3JFZGl0YCBoYW5kbGVyLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC4xXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gZSAgICAgRXZlbnQgb2JqZWN0LlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBCbG9jayBwcm9wZXJ0aWVzLlxuXHRcdCAqL1xuXHRcdGJsb2NrRWRpdCggZSwgcHJvcHMgKSB7XG5cdFx0XHRjb25zdCBibG9jayA9IGFwcC5nZXRCbG9ja0NvbnRhaW5lciggcHJvcHMgKTtcblxuXHRcdFx0aWYgKCAhIGJsb2NrPy5kYXRhc2V0ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGFwcC5pbml0TGVhZEZvcm1TZXR0aW5ncyggYmxvY2sucGFyZW50RWxlbWVudCApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBJbml0IExlYWQgRm9ybSBTZXR0aW5ncyBwYW5lbHMuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44LjFcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7RWxlbWVudH0gYmxvY2sgICAgICAgICBCbG9jayBlbGVtZW50LlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSAgYmxvY2suZGF0YXNldCBCbG9jayBlbGVtZW50LlxuXHRcdCAqL1xuXHRcdGluaXRMZWFkRm9ybVNldHRpbmdzKCBibG9jayApIHtcblx0XHRcdGlmICggISBibG9jaz8uZGF0YXNldCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgYXBwLmlzRnVsbFN0eWxpbmdFbmFibGVkKCkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY2xpZW50SWQgPSBibG9jay5kYXRhc2V0LmJsb2NrO1xuXHRcdFx0Y29uc3QgJHBhbmVsID0gJCggYC53cGZvcm1zLWJsb2NrLXNldHRpbmdzLSR7IGNsaWVudElkIH1gICk7XG5cblx0XHRcdGlmICggYXBwLmlzTGVhZEZvcm1zRW5hYmxlZCggYmxvY2sgKSApIHtcblx0XHRcdFx0JHBhbmVsXG5cdFx0XHRcdFx0LmFkZENsYXNzKCAnZGlzYWJsZWRfcGFuZWwnIClcblx0XHRcdFx0XHQuZmluZCggJy53cGZvcm1zLWd1dGVuYmVyZy1wYW5lbC1ub3RpY2Uud3Bmb3Jtcy1sZWFkLWZvcm0tbm90aWNlJyApXG5cdFx0XHRcdFx0LmNzcyggJ2Rpc3BsYXknLCAnYmxvY2snICk7XG5cblx0XHRcdFx0JHBhbmVsXG5cdFx0XHRcdFx0LmZpbmQoICcud3Bmb3Jtcy1ndXRlbmJlcmctcGFuZWwtbm90aWNlLndwZm9ybXMtdXNlLW1vZGVybi1ub3RpY2UnIClcblx0XHRcdFx0XHQuY3NzKCAnZGlzcGxheScsICdub25lJyApO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JHBhbmVsXG5cdFx0XHRcdC5yZW1vdmVDbGFzcyggJ2Rpc2FibGVkX3BhbmVsJyApXG5cdFx0XHRcdC5maW5kKCAnLndwZm9ybXMtZ3V0ZW5iZXJnLXBhbmVsLW5vdGljZS53cGZvcm1zLWxlYWQtZm9ybS1ub3RpY2UnIClcblx0XHRcdFx0LmNzcyggJ2Rpc3BsYXknLCAnbm9uZScgKTtcblxuXHRcdFx0JHBhbmVsXG5cdFx0XHRcdC5maW5kKCAnLndwZm9ybXMtZ3V0ZW5iZXJnLXBhbmVsLW5vdGljZS53cGZvcm1zLXVzZS1tb2Rlcm4tbm90aWNlJyApXG5cdFx0XHRcdC5jc3MoICdkaXNwbGF5JywgbnVsbCApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBFdmVudCBgd3Bmb3Jtc0Zvcm1TZWxlY3RvckZvcm1Mb2FkZWRgIGhhbmRsZXIuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44LjFcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBlIEV2ZW50IG9iamVjdC5cblx0XHQgKi9cblx0XHRmb3JtTG9hZGVkKCBlICkge1xuXHRcdFx0YXBwLmluaXRMZWFkRm9ybVNldHRpbmdzKCBlLmRldGFpbC5ibG9jayApO1xuXHRcdFx0YXBwLnVwZGF0ZUFjY2VudENvbG9ycyggZS5kZXRhaWwgKTtcblx0XHRcdGFwcC5sb2FkQ2hvaWNlc0pTKCBlLmRldGFpbCApO1xuXHRcdFx0YXBwLmluaXRSaWNoVGV4dEZpZWxkKCBlLmRldGFpbC5mb3JtSWQgKTtcblx0XHRcdGFwcC5pbml0UmVwZWF0ZXJGaWVsZCggZS5kZXRhaWwuZm9ybUlkICk7XG5cblx0XHRcdCQoIGUuZGV0YWlsLmJsb2NrIClcblx0XHRcdFx0Lm9mZiggJ2NsaWNrJyApXG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgYXBwLmJsb2NrQ2xpY2sgKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogQ2xpY2sgb24gdGhlIGJsb2NrIGV2ZW50IGhhbmRsZXIuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44LjFcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBlIEV2ZW50IG9iamVjdC5cblx0XHQgKi9cblx0XHRibG9ja0NsaWNrKCBlICkge1xuXHRcdFx0YXBwLmluaXRMZWFkRm9ybVNldHRpbmdzKCBlLmN1cnJlbnRUYXJnZXQgKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogVXBkYXRlIGFjY2VudCBjb2xvcnMgb2Ygc29tZSBmaWVsZHMgaW4gR0IgYmxvY2sgaW4gTW9kZXJuIE1hcmt1cCBtb2RlLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC4xXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gZGV0YWlsIEV2ZW50IGRldGFpbHMgb2JqZWN0LlxuXHRcdCAqL1xuXHRcdHVwZGF0ZUFjY2VudENvbG9ycyggZGV0YWlsICkge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHQhIHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IuaXNfbW9kZXJuX21hcmt1cCB8fFxuXHRcdFx0XHQhIHdpbmRvdy5XUEZvcm1zPy5Gcm9udGVuZE1vZGVybiB8fFxuXHRcdFx0XHQhIGRldGFpbD8uYmxvY2tcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0ICRmb3JtID0gJCggZGV0YWlsLmJsb2NrLnF1ZXJ5U2VsZWN0b3IoIGAjd3Bmb3Jtcy0keyBkZXRhaWwuZm9ybUlkIH1gICkgKSxcblx0XHRcdFx0RnJvbnRlbmRNb2Rlcm4gPSB3aW5kb3cuV1BGb3Jtcy5Gcm9udGVuZE1vZGVybjtcblxuXHRcdFx0RnJvbnRlbmRNb2Rlcm4udXBkYXRlR0JCbG9ja1BhZ2VJbmRpY2F0b3JDb2xvciggJGZvcm0gKTtcblx0XHRcdEZyb250ZW5kTW9kZXJuLnVwZGF0ZUdCQmxvY2tJY29uQ2hvaWNlc0NvbG9yKCAkZm9ybSApO1xuXHRcdFx0RnJvbnRlbmRNb2Rlcm4udXBkYXRlR0JCbG9ja1JhdGluZ0NvbG9yKCAkZm9ybSApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBJbml0IE1vZGVybiBzdHlsZSBEcm9wZG93biBmaWVsZHMgKDxzZWxlY3Q+KS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGRldGFpbCBFdmVudCBkZXRhaWxzIG9iamVjdC5cblx0XHQgKi9cblx0XHRsb2FkQ2hvaWNlc0pTKCBkZXRhaWwgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiB3aW5kb3cuQ2hvaWNlcyAhPT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkZm9ybSA9ICQoIGRldGFpbC5ibG9jay5xdWVyeVNlbGVjdG9yKCBgI3dwZm9ybXMtJHsgZGV0YWlsLmZvcm1JZCB9YCApICk7XG5cblx0XHRcdCRmb3JtLmZpbmQoICcuY2hvaWNlc2pzLXNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbiggaWR4LCBzZWxlY3RFbCApIHtcblx0XHRcdFx0Y29uc3QgJGVsID0gJCggc2VsZWN0RWwgKTtcblxuXHRcdFx0XHRpZiAoICRlbC5kYXRhKCAnY2hvaWNlJyApID09PSAnYWN0aXZlJyApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBhcmdzID0gd2luZG93LndwZm9ybXNfY2hvaWNlc2pzX2NvbmZpZyB8fCB7fSxcblx0XHRcdFx0XHRzZWFyY2hFbmFibGVkID0gJGVsLmRhdGEoICdzZWFyY2gtZW5hYmxlZCcgKSxcblx0XHRcdFx0XHQkZmllbGQgPSAkZWwuY2xvc2VzdCggJy53cGZvcm1zLWZpZWxkJyApO1xuXG5cdFx0XHRcdGFyZ3Muc2VhcmNoRW5hYmxlZCA9ICd1bmRlZmluZWQnICE9PSB0eXBlb2Ygc2VhcmNoRW5hYmxlZCA/IHNlYXJjaEVuYWJsZWQgOiB0cnVlO1xuXHRcdFx0XHRhcmdzLmNhbGxiYWNrT25Jbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3Qgc2VsZiA9IHRoaXMsXG5cdFx0XHRcdFx0XHQkZWxlbWVudCA9ICQoIHNlbGYucGFzc2VkRWxlbWVudC5lbGVtZW50ICksXG5cdFx0XHRcdFx0XHQkaW5wdXQgPSAkKCBzZWxmLmlucHV0LmVsZW1lbnQgKSxcblx0XHRcdFx0XHRcdHNpemVDbGFzcyA9ICRlbGVtZW50LmRhdGEoICdzaXplLWNsYXNzJyApO1xuXG5cdFx0XHRcdFx0Ly8gQWRkIENTUy1jbGFzcyBmb3Igc2l6ZS5cblx0XHRcdFx0XHRpZiAoIHNpemVDbGFzcyApIHtcblx0XHRcdFx0XHRcdCQoIHNlbGYuY29udGFpbmVyT3V0ZXIuZWxlbWVudCApLmFkZENsYXNzKCBzaXplQ2xhc3MgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBJZiBhIG11bHRpcGxlIHNlbGVjdCBoYXMgc2VsZWN0ZWQgY2hvaWNlcyAtIGhpZGUgYSBwbGFjZWhvbGRlciB0ZXh0LlxuXHRcdFx0XHRcdCAqIEluIGNhc2UgaWYgc2VsZWN0IGlzIGVtcHR5IC0gd2UgcmV0dXJuIHBsYWNlaG9sZGVyIHRleHQuXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0aWYgKCAkZWxlbWVudC5wcm9wKCAnbXVsdGlwbGUnICkgKSB7XG5cdFx0XHRcdFx0XHQvLyBPbiBpbml0IGV2ZW50LlxuXHRcdFx0XHRcdFx0JGlucHV0LmRhdGEoICdwbGFjZWhvbGRlcicsICRpbnB1dC5hdHRyKCAncGxhY2Vob2xkZXInICkgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzZWxmLmdldFZhbHVlKCB0cnVlICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHQkaW5wdXQuaGlkZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRoaXMuZGlzYWJsZSgpO1xuXHRcdFx0XHRcdCRmaWVsZC5maW5kKCAnLmlzLWRpc2FibGVkJyApLnJlbW92ZUNsYXNzKCAnaXMtZGlzYWJsZWQnICk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRpZiAoICEgKCBzZWxlY3RFbCBpbnN0YW5jZW9mIHBhcmVudC5IVE1MU2VsZWN0RWxlbWVudCApICkge1xuXHRcdFx0XHRcdFx0T2JqZWN0LnNldFByb3RvdHlwZU9mKCBzZWxlY3RFbCwgcGFyZW50LkhUTUxTZWxlY3RFbGVtZW50LnByb3RvdHlwZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCRlbC5kYXRhKCAnY2hvaWNlc2pzJywgbmV3IHBhcmVudC5DaG9pY2VzKCBzZWxlY3RFbCwgYXJncyApICk7XG5cdFx0XHRcdH0gY2F0Y2ggKCBlICkge30gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1lbXB0eVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBJbml0aWFsaXplIFJpY2hUZXh0IGZpZWxkLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC4xXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gZm9ybUlkIEZvcm0gSUQuXG5cdFx0ICovXG5cdFx0aW5pdFJpY2hUZXh0RmllbGQoIGZvcm1JZCApIHtcblx0XHRcdC8vIFNldCBkZWZhdWx0IHRhYiB0byBgVmlzdWFsYC5cblx0XHRcdCQoIGAjd3Bmb3Jtcy0keyBmb3JtSWQgfSAud3AtZWRpdG9yLXdyYXBgICkucmVtb3ZlQ2xhc3MoICdodG1sLWFjdGl2ZScgKS5hZGRDbGFzcyggJ3RtY2UtYWN0aXZlJyApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBJbml0aWFsaXplIFJlcGVhdGVyIGZpZWxkLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC45XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gZm9ybUlkIEZvcm0gSUQuXG5cdFx0ICovXG5cdFx0aW5pdFJlcGVhdGVyRmllbGQoIGZvcm1JZCApIHtcblx0XHRcdGNvbnN0ICRyb3dCdXR0b25zID0gJCggYCN3cGZvcm1zLSR7IGZvcm1JZCB9IC53cGZvcm1zLWZpZWxkLXJlcGVhdGVyID4gLndwZm9ybXMtZmllbGQtcmVwZWF0ZXItZGlzcGxheS1yb3dzIC53cGZvcm1zLWZpZWxkLXJlcGVhdGVyLWRpc3BsYXktcm93cy1idXR0b25zYCApO1xuXG5cdFx0XHQvLyBHZXQgdGhlIGxhYmVsIGhlaWdodCBhbmQgc2V0IHRoZSBidXR0b24gcG9zaXRpb24uXG5cdFx0XHQkcm93QnV0dG9ucy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGNvbnQgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0ICRsYWJlbCA9ICRjb250LnNpYmxpbmdzKCAnLndwZm9ybXMtbGF5b3V0LWNvbHVtbicgKVxuXHRcdFx0XHRcdC5maW5kKCAnLndwZm9ybXMtZmllbGQnICkuZmlyc3QoKVxuXHRcdFx0XHRcdC5maW5kKCAnLndwZm9ybXMtZmllbGQtbGFiZWwnICk7XG5cdFx0XHRcdGNvbnN0IGxhYmVsU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggJGxhYmVsLmdldCggMCApICk7XG5cdFx0XHRcdGNvbnN0IG1hcmdpbiA9IGxhYmVsU3R5bGU/LmdldFByb3BlcnR5VmFsdWUoICctLXdwZm9ybXMtZmllbGQtc2l6ZS1pbnB1dC1zcGFjaW5nJyApIHx8IDA7XG5cdFx0XHRcdGNvbnN0IGhlaWdodCA9ICRsYWJlbC5vdXRlckhlaWdodCgpIHx8IDA7XG5cdFx0XHRcdGNvbnN0IHRvcCA9IGhlaWdodCArIHBhcnNlSW50KCBtYXJnaW4sIDEwICkgKyAxMDtcblxuXHRcdFx0XHQkY29udC5jc3MoIHsgdG9wIH0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gSW5pdCBidXR0b25zIGFuZCBkZXNjcmlwdGlvbnMgZm9yIGVhY2ggcmVwZWF0ZXIgaW4gZWFjaCBmb3JtLlxuXHRcdFx0JCggYC53cGZvcm1zLWZvcm1bZGF0YS1mb3JtaWQ9XCIkeyBmb3JtSWQgfVwiXWAgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHJlcGVhdGVyID0gJCggdGhpcyApLmZpbmQoICcud3Bmb3Jtcy1maWVsZC1yZXBlYXRlcicgKTtcblxuXHRcdFx0XHQkcmVwZWF0ZXIuZmluZCggJy53cGZvcm1zLWZpZWxkLXJlcGVhdGVyLWRpc3BsYXktcm93cy1idXR0b25zJyApLmFkZENsYXNzKCAnd3Bmb3Jtcy1pbml0JyApO1xuXHRcdFx0XHQkcmVwZWF0ZXIuZmluZCggJy53cGZvcm1zLWZpZWxkLXJlcGVhdGVyLWRpc3BsYXktcm93czpsYXN0IC53cGZvcm1zLWZpZWxkLWRlc2NyaXB0aW9uJyApLmFkZENsYXNzKCAnd3Bmb3Jtcy1pbml0JyApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdH07XG5cblx0Ly8gUHJvdmlkZSBhY2Nlc3MgdG8gcHVibGljIGZ1bmN0aW9ucy9wcm9wZXJ0aWVzLlxuXHRyZXR1cm4gYXBwO1xufSggZG9jdW1lbnQsIHdpbmRvdywgalF1ZXJ5ICkgKTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OytDQUNBLHFKQUFBQSxtQkFBQSxZQUFBQSxvQkFBQSxXQUFBQyxDQUFBLFNBQUFDLENBQUEsRUFBQUQsQ0FBQSxPQUFBRSxDQUFBLEdBQUFDLE1BQUEsQ0FBQUMsU0FBQSxFQUFBQyxDQUFBLEdBQUFILENBQUEsQ0FBQUksY0FBQSxFQUFBQyxDQUFBLEdBQUFKLE1BQUEsQ0FBQUssY0FBQSxjQUFBUCxDQUFBLEVBQUFELENBQUEsRUFBQUUsQ0FBQSxJQUFBRCxDQUFBLENBQUFELENBQUEsSUFBQUUsQ0FBQSxDQUFBTyxLQUFBLEtBQUFDLENBQUEsd0JBQUFDLE1BQUEsR0FBQUEsTUFBQSxPQUFBQyxDQUFBLEdBQUFGLENBQUEsQ0FBQUcsUUFBQSxrQkFBQUMsQ0FBQSxHQUFBSixDQUFBLENBQUFLLGFBQUEsdUJBQUFDLENBQUEsR0FBQU4sQ0FBQSxDQUFBTyxXQUFBLDhCQUFBQyxPQUFBakIsQ0FBQSxFQUFBRCxDQUFBLEVBQUFFLENBQUEsV0FBQUMsTUFBQSxDQUFBSyxjQUFBLENBQUFQLENBQUEsRUFBQUQsQ0FBQSxJQUFBUyxLQUFBLEVBQUFQLENBQUEsRUFBQWlCLFVBQUEsTUFBQUMsWUFBQSxNQUFBQyxRQUFBLFNBQUFwQixDQUFBLENBQUFELENBQUEsV0FBQWtCLE1BQUEsbUJBQUFqQixDQUFBLElBQUFpQixNQUFBLFlBQUFBLE9BQUFqQixDQUFBLEVBQUFELENBQUEsRUFBQUUsQ0FBQSxXQUFBRCxDQUFBLENBQUFELENBQUEsSUFBQUUsQ0FBQSxnQkFBQW9CLEtBQUFyQixDQUFBLEVBQUFELENBQUEsRUFBQUUsQ0FBQSxFQUFBRyxDQUFBLFFBQUFLLENBQUEsR0FBQVYsQ0FBQSxJQUFBQSxDQUFBLENBQUFJ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
},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/* global wpforms_gutenberg_form_selector */
/* jshint es3: false, esversion: 6 */
/**
 * @param strings.border_color
 * @param strings.border_style
 * @param strings.border_width
 * @param strings.container_styles
 * @param strings.shadow_size
 */
/**
 * Gutenberg editor block.
 *
 * Container styles panel module.
 *
 * @since 1.8.8
 */
var _default = exports.default = function ($) {
  /**
   * WP core components.
   *
   * @since 1.8.8
   */
  var _ref = wp.blockEditor || wp.editor,
    PanelColorSettings = _ref.PanelColorSettings;
  var _wp$components = wp.components,
    SelectControl = _wp$components.SelectControl,
    PanelBody = _wp$components.PanelBody,
    Flex = _wp$components.Flex,
    FlexBlock = _wp$components.FlexBlock,
    __experimentalUnitControl = _wp$components.__experimentalUnitControl;
  var useState = wp.element.useState;

  /**
   * Localized data aliases.
   *
   * @since 1.8.8
   */
  var _wpforms_gutenberg_fo = wpforms_gutenberg_form_selector,
    strings = _wpforms_gutenberg_fo.strings,
    defaults = _wpforms_gutenberg_fo.defaults,
    isPro = _wpforms_gutenberg_fo.isPro,
    isLicenseActive = _wpforms_gutenberg_fo.isLicenseActive;

  /**
   * Public functions and properties.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var app = {
    /**
     * Start the engine.
     *
     * @since 1.8.8
     */
    init: function init() {
      $(app.ready);
    },
    /**
     * Document ready.
     *
     * @since 1.8.8
     */
    ready: function ready() {
      app.events();
    },
    /**
     * Events.
     *
     * @since 1.8.8
     */
    events: function events() {},
    /**
     * Get block attributes.
     *
     * @since 1.8.8
     *
     * @return {Object} Block attributes.
     */
    getBlockAttributes: function getBlockAttributes() {
      return {
        containerPadding: {
          type: 'string',
          default: defaults.containerPadding
        },
        containerBorderStyle: {
          type: 'string',
          default: defaults.containerBorderStyle
        },
        containerBorderWidth: {
          type: 'string',
          default: defaults.containerBorderWidth
        },
        containerBorderColor: {
          type: 'string',
          default: defaults.containerBorderColor
        },
        containerBorderRadius: {
          type: 'string',
          default: defaults.containerBorderRadius
        },
        containerShadowSize: {
          type: 'string',
          default: defaults.containerShadowSize
        }
      };
    },
    /**
     * Get Container Styles panel JSX code.
     *
     * @since 1.8.8
     *
     * @param {Object} props              Block properties.
     * @param {Object} handlers           Block handlers.
     * @param {Object} formSelectorCommon Common form selector functions.
     *
     * @return {Object} Field styles JSX code.
     */
    getContainerStyles: function getContainerStyles(props, handlers, formSelectorCommon) {
      // eslint-disable-line max-lines-per-function, complexity
      var _useState = useState(isPro && isLicenseActive),
        _useState2 = _slicedToArray(_useState, 2),
        isNotDisabled = _useState2[0],
        _setIsNotDisabled = _useState2[1]; // eslint-disable-line react-hooks/rules-of-hooks, no-unused-vars
      var _useState3 = useState(isPro),
        _useState4 = _slicedToArray(_useState3, 2),
        isProEnabled = _useState4[0],
        _setIsProEnabled = _useState4[1]; // eslint-disable-line react-hooks/rules-of-hooks, no-unused-vars

      var cssClass = formSelectorCommon.getPanelClass(props);
      if (!isNotDisabled) {
        cssClass += ' wpforms-gutenberg-panel-disabled';
      }
      return /*#__PURE__*/React.createElement(PanelBody, {
        className: cssClass,
        title: strings.container_styles
      }, /*#__PURE__*/React.createElement("div", {
        // eslint-disable-line jsx-a11y/no-static-element-interactions
        className: "wpforms-gutenberg-form-selector-panel-body",
        onClick: function onClick(event) {
          if (isNotDisabled) {
            return;
          }
          event.stopPropagation();
          if (!isProEnabled) {
            return formSelectorCommon.education.showProModal('container', strings.container_styles);
          }
          formSelectorCommon.education.showLicenseModal('container', strings.container_styles, 'container-styles');
        },
        onKeyDown: function onKeyDown(event) {
          if (isNotDisabled) {
            return;
          }
          event.stopPropagation();
          if (!isProEnabled) {
            return formSelectorCommon.education.showProModal('container', strings.container_styles);
          }
          formSelectorCommon.education.showLicenseModal('container', strings.container_styles, 'container-styles');
        }
      }, /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: "wpforms-gutenberg-form-selector-flex",
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(__experimentalUnitControl, {
        label: strings.padding,
        tabIndex: isNotDisabled ? 0 : -1,
        value: props.attributes.containerPadding,
        min: 0,
        isUnitSelectTabbable: isNotDisabled,
        onChange: function onChange(value) {
          return handlers.styleAttrChange('containerPadding', value);
        }
      })), /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(SelectControl, {
        label: strings.border_style,
        tabIndex: isNotDisabled ? 0 : -1,
        value: props.attributes.containerBorderStyle,
        options: [{
          label: strings.none,
          value: 'none'
        }, {
          label: strings.solid,
          value: 'solid'
        }, {
          label: strings.dotted,
          value: 'dotted'
        }, {
          label: strings.dashed,
          value: 'dashed'
        }, {
          label: strings.double,
          value: 'double'
        }],
        onChange: function onChange(value) {
          return handlers.styleAttrChange('containerBorderStyle', value);
        }
      }))), /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: "wpforms-gutenberg-form-selector-flex",
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(__experimentalUnitControl, {
        label: strings.border_width,
        tabIndex: isNotDisabled ? 0 : -1,
        value: props.attributes.containerBorderStyle === 'none' ? '' : props.attributes.containerBorderWidth,
        min: 0,
        disabled: props.attributes.containerBorderStyle === 'none',
        isUnitSelectTabbable: isNotDisabled,
        onChange: function onChange(value) {
          return handlers.styleAttrChange('containerBorderWidth', value);
        }
      })), /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(__experimentalUnitControl, {
        label: strings.border_radius,
        tabIndex: isNotDisabled ? 0 : -1,
        value: props.attributes.containerBorderRadius,
        min: 0,
        isUnitSelectTabbable: isNotDisabled,
        onChange: function onChange(value) {
          return handlers.styleAttrChange('containerBorderRadius', value);
        }
      }))), /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: "wpforms-gutenberg-form-selector-flex",
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(SelectControl, {
        label: strings.shadow_size,
        tabIndex: isNotDisabled ? 0 : -1,
        value: props.attributes.containerShadowSize,
        options: [{
          label: strings.none,
          value: 'none'
        }, {
          label: strings.small,
          value: 'small'
        }, {
          label: strings.medium,
          value: 'medium'
        }, {
          label: strings.large,
          value: 'large'
        }],
        onChange: function onChange(value) {
          return handlers.styleAttrChange('containerShadowSize', value);
        }
      }))), /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: "wpforms-gutenberg-form-selector-flex",
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-gutenberg-form-selector-control-label"
      }, strings.colors), /*#__PURE__*/React.createElement(PanelColorSettings, {
        __experimentalIsRenderedInSidebar: true,
        enableAlpha: true,
        showTitle: false,
        tabIndex: isNotDisabled ? 0 : -1,
        className: props.attributes.containerBorderStyle === 'none' ? 'wpforms-gutenberg-form-selector-color-panel wpforms-gutenberg-form-selector-color-panel-disabled' : 'wpforms-gutenberg-form-selector-color-panel',
        colorSettings: [{
          value: props.attributes.containerBorderColor,
          onChange: function onChange(value) {
            if (!isNotDisabled) {
              return;
            }
            handlers.styleAttrChange('containerBorderColor', value);
          },
          label: strings.border_color
        }]
      })))));
    }
  };
  return app;
}(jQuery);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZGVmYXVsdCIsImV4cG9ydHMiLCJkZWZhdWx0IiwiJCIsIl9yZWYiLCJ3cCIsImJsb2NrRWRpdG9yIiwiZWRpdG9yIiwiUGFuZWxDb2xvclNldHRpbmdzIiwiX3dwJGNvbXBvbmVudHMiLCJjb21wb25lbnRzIiwiU2VsZWN0Q29udHJvbCIsIlBhbmVsQm9keSIsIkZsZXgiLCJGbGV4QmxvY2siLCJfX2V4cGVyaW1lbnRhbFVuaXRDb250cm9sIiwidXNlU3RhdGUiLCJlbGVtZW50IiwiX3dwZm9ybXNfZ3V0ZW5iZXJnX2ZvIiwid3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvciIsInN0cmluZ3MiLCJkZWZhdWx0cyIsImlzUHJvIiwiaXNMaWNlbnNlQWN0aXZlIiwiYXBwIiwiaW5pdCIsInJlYWR5IiwiZXZlbnRzIiwiZ2V0QmxvY2tBdHRyaWJ1dGVzIiwiY29udGFpbmVyUGFkZGluZyIsInR5cGUiLCJjb250YWluZXJCb3JkZXJTdHlsZSIsImNvbnRhaW5lckJvcmRlcldpZHRoIiwiY29udGFpbmVyQm9yZGVyQ29sb3IiLCJjb250YWluZXJCb3JkZXJSYWRpdXMiLCJjb250YWluZXJTaGFkb3dTaXplIiwiZ2V0Q29udGFpbmVyU3R5bGVzIiwicHJvcHMiLCJoYW5kbGVycyIsImZvcm1TZWxlY3RvckNvbW1vbiIsIl91c2VTdGF0ZSIsIl91c2VTdGF0ZTIiLCJfc2xpY2VkVG9BcnJheSIsImlzTm90RGlzYWJsZWQiLCJfc2V0SXNOb3REaXNhYmxlZCIsIl91c2VTdGF0ZTMiLCJfdXNlU3RhdGU0IiwiaXNQcm9FbmFibGVkIiwiX3NldElzUHJvRW5hYmxlZCIsImNzc0NsYXNzIiwiZ2V0UGFuZWxDbGFzcyIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInRpdGxlIiwiY29udGFpbmVyX3N0eWxlcyIsIm9uQ2xpY2siLCJldmVudCIsInN0b3BQcm9wYWdhdGlvbiIsImVkdWNhdGlvbiIsInNob3dQcm9Nb2RhbCIsInNob3dMaWNlbnNlTW9kYWwiLCJvbktleURvd24iLCJnYXAiLCJhbGlnbiIsImp1c3RpZnkiLCJsYWJlbCIsInBhZGRpbmciLCJ0YWJJbmRleCIsInZhbHVlIiwiYXR0cmlidXRlcyIsIm1pbiIsImlzVW5pdFNlbGVjdFRhYmJhYmxlIiwib25DaGFuZ2UiLCJzdHlsZUF0dHJDaGFuZ2UiLCJib3JkZXJfc3R5bGUiLCJvcHRpb25zIiwibm9uZSIsInNvbGlkIiwiZG90dGVkIiwiZGFzaGVkIiwiZG91YmxlIiwiYm9yZGVyX3dpZHRoIiwiZGlzYWJsZWQiLCJib3JkZXJfcmFkaXVzIiwic2hhZG93X3NpemUiLCJzbWFsbCIsIm1lZGl1bSIsImxhcmdlIiwiY29sb3JzIiwiX19leHBlcmltZW50YWxJc1JlbmRlcmVkSW5TaWRlYmFyIiwiZW5hYmxlQWxwaGEiLCJzaG93VGl0bGUiLCJjb2xvclNldHRpbmdzIiwiYm9yZGVyX2NvbG9yIiwialF1ZXJ5Il0sInNvdXJjZXMiOlsiY29udGFpbmVyLXN0eWxlcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvciAqL1xuLyoganNoaW50IGVzMzogZmFsc2UsIGVzdmVyc2lvbjogNiAqL1xuXG4vKipcbiAqIEBwYXJhbSBzdHJpbmdzLmJvcmRlcl9jb2xvclxuICogQHBhcmFtIHN0cmluZ3MuYm9yZGVyX3N0eWxlXG4gKiBAcGFyYW0gc3RyaW5ncy5ib3JkZXJfd2lkdGhcbiAqIEBwYXJhbSBzdHJpbmdzLmNvbnRhaW5lcl9zdHlsZXNcbiAqIEBwYXJhbSBzdHJpbmdzLnNoYWRvd19zaXplXG4gKi9cblxuLyoqXG4gKiBHdXRlbmJlcmcgZWRpdG9yIGJsb2NrLlxuICpcbiAqIENvbnRhaW5lciBzdHlsZXMgcGFuZWwgbW9kdWxlLlxuICpcbiAqIEBzaW5jZSAxLjguOFxuICovXG5leHBvcnQgZGVmYXVsdCAoICggJCApID0+IHtcblx0LyoqXG5cdCAqIFdQIGNvcmUgY29tcG9uZW50cy5cblx0ICpcblx0ICogQHNpbmNlIDEuOC44XG5cdCAqL1xuXHRjb25zdCB7IFBhbmVsQ29sb3JTZXR0aW5ncyB9ID0gd3AuYmxvY2tFZGl0b3IgfHwgd3AuZWRpdG9yO1xuXHRjb25zdCB7IFNlbGVjdENvbnRyb2wsIFBhbmVsQm9keSwgRmxleCwgRmxleEJsb2NrLCBfX2V4cGVyaW1lbnRhbFVuaXRDb250cm9sIH0gPSB3cC5jb21wb25lbnRzO1xuXHRjb25zdCB7IHVzZVN0YXRlIH0gPSB3cC5lbGVtZW50O1xuXG5cdC8qKlxuXHQgKiBMb2NhbGl6ZWQgZGF0YSBhbGlhc2VzLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICovXG5cdGNvbnN0IHsgc3RyaW5ncywgZGVmYXVsdHMsIGlzUHJvLCBpc0xpY2Vuc2VBY3RpdmUgfSA9IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3I7XG5cblx0LyoqXG5cdCAqIFB1YmxpYyBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjguOFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0Y29uc3QgYXBwID0ge1xuXHRcdC8qKlxuXHRcdCAqIFN0YXJ0IHRoZSBlbmdpbmUuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKi9cblx0XHRpbml0KCkge1xuXHRcdFx0JCggYXBwLnJlYWR5ICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIERvY3VtZW50IHJlYWR5LlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICovXG5cdFx0cmVhZHkoKSB7XG5cdFx0XHRhcHAuZXZlbnRzKCk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEV2ZW50cy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqL1xuXHRcdGV2ZW50cygpIHtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IGJsb2NrIGF0dHJpYnV0ZXMuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge09iamVjdH0gQmxvY2sgYXR0cmlidXRlcy5cblx0XHQgKi9cblx0XHRnZXRCbG9ja0F0dHJpYnV0ZXMoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjb250YWluZXJQYWRkaW5nOiB7XG5cdFx0XHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRcdFx0ZGVmYXVsdDogZGVmYXVsdHMuY29udGFpbmVyUGFkZGluZyxcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29udGFpbmVyQm9yZGVyU3R5bGU6IHtcblx0XHRcdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdFx0XHRkZWZhdWx0OiBkZWZhdWx0cy5jb250YWluZXJCb3JkZXJTdHlsZSxcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29udGFpbmVyQm9yZGVyV2lkdGg6IHtcblx0XHRcdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdFx0XHRkZWZhdWx0OiBkZWZhdWx0cy5jb250YWluZXJCb3JkZXJXaWR0aCxcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29udGFpbmVyQm9yZGVyQ29sb3I6IHtcblx0XHRcdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdFx0XHRkZWZhdWx0OiBkZWZhdWx0cy5jb250YWluZXJCb3JkZXJDb2xvcixcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29udGFpbmVyQm9yZGVyUmFkaXVzOiB7XG5cdFx0XHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRcdFx0ZGVmYXVsdDogZGVmYXVsdHMuY29udGFpbmVyQm9yZGVyUmFkaXVzLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb250YWluZXJTaGFkb3dTaXplOiB7XG5cdFx0XHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRcdFx0ZGVmYXVsdDogZGVmYXVsdHMuY29udGFpbmVyU2hhZG93U2l6ZSxcblx0XHRcdFx0fSxcblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdldCBDb250YWluZXIgU3R5bGVzIHBhbmVsIEpTWCBjb2RlLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgICAgICAgICAgICAgIEJsb2NrIHByb3BlcnRpZXMuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGhhbmRsZXJzICAgICAgICAgICBCbG9jayBoYW5kbGVycy5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gZm9ybVNlbGVjdG9yQ29tbW9uIENvbW1vbiBmb3JtIHNlbGVjdG9yIGZ1bmN0aW9ucy5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge09iamVjdH0gRmllbGQgc3R5bGVzIEpTWCBjb2RlLlxuXHRcdCAqL1xuXHRcdGdldENvbnRhaW5lclN0eWxlcyggcHJvcHMsIGhhbmRsZXJzLCBmb3JtU2VsZWN0b3JDb21tb24gKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxpbmVzLXBlci1mdW5jdGlvbiwgY29tcGxleGl0eVxuXHRcdFx0Y29uc3QgWyBpc05vdERpc2FibGVkLCBfc2V0SXNOb3REaXNhYmxlZCBdID0gdXNlU3RhdGUoIGlzUHJvICYmIGlzTGljZW5zZUFjdGl2ZSApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHJlYWN0LWhvb2tzL3J1bGVzLW9mLWhvb2tzLCBuby11bnVzZWQtdmFyc1xuXHRcdFx0Y29uc3QgWyBpc1Byb0VuYWJsZWQsIF9zZXRJc1Byb0VuYWJsZWQgXSA9IHVzZVN0YXRlKCBpc1BybyApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHJlYWN0LWhvb2tzL3J1bGVzLW9mLWhvb2tzLCBuby11bnVzZWQtdmFyc1xuXG5cdFx0XHRsZXQgY3NzQ2xhc3MgPSBmb3JtU2VsZWN0b3JDb21tb24uZ2V0UGFuZWxDbGFzcyggcHJvcHMgKTtcblxuXHRcdFx0aWYgKCAhIGlzTm90RGlzYWJsZWQgKSB7XG5cdFx0XHRcdGNzc0NsYXNzICs9ICcgd3Bmb3Jtcy1ndXRlbmJlcmctcGFuZWwtZGlzYWJsZWQnO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8UGFuZWxCb2R5IGNsYXNzTmFtZT17IGNzc0NsYXNzIH0gdGl0bGU9eyBzdHJpbmdzLmNvbnRhaW5lcl9zdHlsZXMgfT5cblx0XHRcdFx0XHQ8ZGl2IC8vIGVzbGludC1kaXNhYmxlLWxpbmUganN4LWExMXkvbm8tc3RhdGljLWVsZW1lbnQtaW50ZXJhY3Rpb25zXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLXBhbmVsLWJvZHlcIlxuXHRcdFx0XHRcdFx0b25DbGljaz17ICggZXZlbnQgKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmICggaXNOb3REaXNhYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoICEgaXNQcm9FbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmb3JtU2VsZWN0b3JDb21tb24uZWR1Y2F0aW9uLnNob3dQcm9Nb2RhbCggJ2NvbnRhaW5lcicsIHN0cmluZ3MuY29udGFpbmVyX3N0eWxlcyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Zm9ybVNlbGVjdG9yQ29tbW9uLmVkdWNhdGlvbi5zaG93TGljZW5zZU1vZGFsKCAnY29udGFpbmVyJywgc3RyaW5ncy5jb250YWluZXJfc3R5bGVzLCAnY29udGFpbmVyLXN0eWxlcycgKTtcblx0XHRcdFx0XHRcdH0gfVxuXHRcdFx0XHRcdFx0b25LZXlEb3duPXsgKCBldmVudCApID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKCBpc05vdERpc2FibGVkICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFx0XHRcdGlmICggISBpc1Byb0VuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZvcm1TZWxlY3RvckNvbW1vbi5lZHVjYXRpb24uc2hvd1Byb01vZGFsKCAnY29udGFpbmVyJywgc3RyaW5ncy5jb250YWluZXJfc3R5bGVzICk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRmb3JtU2VsZWN0b3JDb21tb24uZWR1Y2F0aW9uLnNob3dMaWNlbnNlTW9kYWwoICdjb250YWluZXInLCBzdHJpbmdzLmNvbnRhaW5lcl9zdHlsZXMsICdjb250YWluZXItc3R5bGVzJyApO1xuXHRcdFx0XHRcdFx0fSB9XG5cdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0PEZsZXggZ2FwPXsgNCB9IGFsaWduPVwiZmxleC1zdGFydFwiIGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItZmxleFwiIGp1c3RpZnk9XCJzcGFjZS1iZXR3ZWVuXCI+XG5cdFx0XHRcdFx0XHRcdDxGbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHRcdFx0PF9fZXhwZXJpbWVudGFsVW5pdENvbnRyb2xcblx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsPXsgc3RyaW5ncy5wYWRkaW5nIH1cblx0XHRcdFx0XHRcdFx0XHRcdHRhYkluZGV4PXsgaXNOb3REaXNhYmxlZCA/IDAgOiAtMSB9XG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZT17IHByb3BzLmF0dHJpYnV0ZXMuY29udGFpbmVyUGFkZGluZyB9XG5cdFx0XHRcdFx0XHRcdFx0XHRtaW49eyAwIH1cblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5pdFNlbGVjdFRhYmJhYmxlPXsgaXNOb3REaXNhYmxlZCB9XG5cdFx0XHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17ICggdmFsdWUgKSA9PiBoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdjb250YWluZXJQYWRkaW5nJywgdmFsdWUgKSB9XG5cdFx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdFx0PC9GbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHRcdDxGbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHRcdFx0PFNlbGVjdENvbnRyb2xcblx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsPXsgc3RyaW5ncy5ib3JkZXJfc3R5bGUgfVxuXHRcdFx0XHRcdFx0XHRcdFx0dGFiSW5kZXg9eyBpc05vdERpc2FibGVkID8gMCA6IC0xIH1cblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlPXsgcHJvcHMuYXR0cmlidXRlcy5jb250YWluZXJCb3JkZXJTdHlsZSB9XG5cdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zPXsgW1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzdHJpbmdzLm5vbmUsIHZhbHVlOiAnbm9uZScgfSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0eyBsYWJlbDogc3RyaW5ncy5zb2xpZCwgdmFsdWU6ICdzb2xpZCcgfSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0eyBsYWJlbDogc3RyaW5ncy5kb3R0ZWQsIHZhbHVlOiAnZG90dGVkJyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzdHJpbmdzLmRhc2hlZCwgdmFsdWU6ICdkYXNoZWQnIH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3MuZG91YmxlLCB2YWx1ZTogJ2RvdWJsZScgfSxcblx0XHRcdFx0XHRcdFx0XHRcdF0gfVxuXHRcdFx0XHRcdFx0XHRcdFx0b25DaGFuZ2U9eyAoIHZhbHVlICkgPT4gaGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAnY29udGFpbmVyQm9yZGVyU3R5bGUnLCB2YWx1ZSApIH1cblx0XHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0XHQ8L0ZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdDwvRmxleD5cblx0XHRcdFx0XHRcdDxGbGV4IGdhcD17IDQgfSBhbGlnbj1cImZsZXgtc3RhcnRcIiBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWZsZXhcIiBqdXN0aWZ5PVwic3BhY2UtYmV0d2VlblwiPlxuXHRcdFx0XHRcdFx0XHQ8RmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHRcdDxfX2V4cGVyaW1lbnRhbFVuaXRDb250cm9sXG5cdFx0XHRcdFx0XHRcdFx0XHRsYWJlbD17IHN0cmluZ3MuYm9yZGVyX3dpZHRoIH1cblx0XHRcdFx0XHRcdFx0XHRcdHRhYkluZGV4PXsgaXNOb3REaXNhYmxlZCA/IDAgOiAtMSB9XG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZT17IHByb3BzLmF0dHJpYnV0ZXMuY29udGFpbmVyQm9yZGVyU3R5bGUgPT09ICdub25lJyA/ICcnIDogcHJvcHMuYXR0cmlidXRlcy5jb250YWluZXJCb3JkZXJXaWR0aCB9XG5cdFx0XHRcdFx0XHRcdFx0XHRtaW49eyAwIH1cblx0XHRcdFx0XHRcdFx0XHRcdGRpc2FibGVkPXsgcHJvcHMuYXR0cmlidXRlcy5jb250YWluZXJCb3JkZXJTdHlsZSA9PT0gJ25vbmUnIH1cblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5pdFNlbGVjdFRhYmJhYmxlPXsgaXNOb3REaXNhYmxlZCB9XG5cdFx0XHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17ICggdmFsdWUgKSA9PiBoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdjb250YWluZXJCb3JkZXJXaWR0aCcsIHZhbHVlICkgfVxuXHRcdFx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHRcdDwvRmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHQ8RmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHRcdDxfX2V4cGVyaW1lbnRhbFVuaXRDb250cm9sXG5cdFx0XHRcdFx0XHRcdFx0XHRsYWJlbD17IHN0cmluZ3MuYm9yZGVyX3JhZGl1cyB9XG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJJbmRleD17IGlzTm90RGlzYWJsZWQgPyAwIDogLTEgfVxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU9eyBwcm9wcy5hdHRyaWJ1dGVzLmNvbnRhaW5lckJvcmRlclJhZGl1cyB9XG5cdFx0XHRcdFx0XHRcdFx0XHRtaW49eyAwIH1cblx0XHRcdFx0XHRcdFx0XHRcdGlzVW5pdFNlbGVjdFRhYmJhYmxlPXsgaXNOb3REaXNhYmxlZCB9XG5cdFx0XHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17ICggdmFsdWUgKSA9PiBoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdjb250YWluZXJCb3JkZXJSYWRpdXMnLCB2YWx1ZSApIH1cblx0XHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0XHQ8L0ZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdDwvRmxleD5cblx0XHRcdFx0XHRcdDxGbGV4IGdhcD17IDQgfSBhbGlnbj1cImZsZXgtc3RhcnRcIiBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWZsZXhcIiBqdXN0aWZ5PVwic3BhY2UtYmV0d2VlblwiPlxuXHRcdFx0XHRcdFx0XHQ8RmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHRcdDxTZWxlY3RDb250cm9sXG5cdFx0XHRcdFx0XHRcdFx0XHRsYWJlbD17IHN0cmluZ3Muc2hhZG93X3NpemUgfVxuXHRcdFx0XHRcdFx0XHRcdFx0dGFiSW5kZXg9eyBpc05vdERpc2FibGVkID8gMCA6IC0xIH1cblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlPXsgcHJvcHMuYXR0cmlidXRlcy5jb250YWluZXJTaGFkb3dTaXplIH1cblx0XHRcdFx0XHRcdFx0XHRcdG9wdGlvbnM9eyBbXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3Mubm9uZSwgdmFsdWU6ICdub25lJyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzdHJpbmdzLnNtYWxsLCB2YWx1ZTogJ3NtYWxsJyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzdHJpbmdzLm1lZGl1bSwgdmFsdWU6ICdtZWRpdW0nIH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3MubGFyZ2UsIHZhbHVlOiAnbGFyZ2UnIH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRdIH1cblx0XHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsgKCB2YWx1ZSApID0+IGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2NvbnRhaW5lclNoYWRvd1NpemUnLCB2YWx1ZSApIH1cblx0XHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0XHQ8L0ZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdDwvRmxleD5cblx0XHRcdFx0XHRcdDxGbGV4IGdhcD17IDQgfSBhbGlnbj1cImZsZXgtc3RhcnRcIiBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWZsZXhcIiBqdXN0aWZ5PVwic3BhY2UtYmV0d2VlblwiPlxuXHRcdFx0XHRcdFx0XHQ8RmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1jb250cm9sLWxhYmVsXCI+eyBzdHJpbmdzLmNvbG9ycyB9PC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PFBhbmVsQ29sb3JTZXR0aW5nc1xuXHRcdFx0XHRcdFx0XHRcdFx0X19leHBlcmltZW50YWxJc1JlbmRlcmVkSW5TaWRlYmFyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbmFibGVBbHBoYVxuXHRcdFx0XHRcdFx0XHRcdFx0c2hvd1RpdGxlPXsgZmFsc2UgfVxuXHRcdFx0XHRcdFx0XHRcdFx0dGFiSW5kZXg9eyBpc05vdERpc2FibGVkID8gMCA6IC0xIH1cblx0XHRcdFx0XHRcdFx0XHRcdGNsYXNzTmFtZT17IHByb3BzLmF0dHJpYnV0ZXMuY29udGFpbmVyQm9yZGVyU3R5bGUgPT09ICdub25lJyA/ICd3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWNvbG9yLXBhbmVsIHdwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItY29sb3ItcGFuZWwtZGlzYWJsZWQnIDogJ3dwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItY29sb3ItcGFuZWwnIH1cblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yU2V0dGluZ3M9eyBbXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogcHJvcHMuYXR0cmlidXRlcy5jb250YWluZXJCb3JkZXJDb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvbkNoYW5nZTogKCB2YWx1ZSApID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICggISBpc05vdERpc2FibGVkICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdjb250YWluZXJCb3JkZXJDb2xvcicsIHZhbHVlICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogc3RyaW5ncy5ib3JkZXJfY29sb3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRdIH1cblx0XHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0XHQ8L0ZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdDwvRmxleD5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9QYW5lbEJvZHk+XG5cdFx0XHQpO1xuXHRcdH0sXG5cdH07XG5cblx0cmV0dXJuIGFwcDtcbn0gKSggalF1ZXJ5ICk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkEsSUFBQUEsUUFBQSxHQUFBQyxPQUFBLENBQUFDLE9BQUEsR0FPaUIsVUFBRUMsQ0FBQyxFQUFNO0VBQ3pCO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7RUFDQyxJQUFBQyxJQUFBLEdBQStCQyxFQUFFLENBQUNDLFdBQVcsSUFBSUQsRUFBRSxDQUFDRSxNQUFNO0lBQWxEQyxrQkFBa0IsR0FBQUosSUFBQSxDQUFsQkksa0JBQWtC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
},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/* global wpforms_education, WPFormsEducation */
/**
 * WPForms Education Modal module.
 *
 * @since 1.8.8
 */
var _default = exports.default = function ($) {
  /**
   * Public functions and properties.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var app = {
    /**
     * Open educational popup for users with no Pro license.
     *
     * @since 1.8.8
     *
     * @param {string} panel   Panel slug.
     * @param {string} feature Feature name.
     */
    showProModal: function showProModal(panel, feature) {
      var type = 'pro';
      var message = wpforms_education.upgrade[type].message_plural.replace(/%name%/g, feature);
      var utmContent = {
        container: 'Upgrade to Pro - Container Styles',
        background: 'Upgrade to Pro - Background Styles',
        themes: 'Upgrade to Pro - Themes'
      };
      $.alert({
        backgroundDismiss: true,
        title: feature + ' ' + wpforms_education.upgrade[type].title_plural,
        icon: 'fa fa-lock',
        content: message,
        boxWidth: '550px',
        theme: 'modern,wpforms-education',
        closeIcon: true,
        onOpenBefore: function onOpenBefore() {
          // eslint-disable-line object-shorthand
          this.$btnc.after('<div class="discount-note">' + wpforms_education.upgrade_bonus + '</div>');
          this.$btnc.after(wpforms_education.upgrade[type].doc.replace(/%25name%25/g, 'AP - ' + feature));
          this.$body.find('.jconfirm-content').addClass('lite-upgrade');
        },
        buttons: {
          confirm: {
            text: wpforms_education.upgrade[type].button,
            btnClass: 'btn-confirm',
            keys: ['enter'],
            action: function action() {
              window.open(WPFormsEducation.core.getUpgradeURL(utmContent[panel], type), '_blank');
              WPFormsEducation.core.upgradeModalThankYou(type);
            }
          }
        }
      });
    },
    /**
     * Open license modal.
     *
     * @since 1.8.8
     *
     * @param {string} feature    Feature name.
     * @param {string} fieldName  Field name.
     * @param {string} utmContent UTM content.
     */
    showLicenseModal: function showLicenseModal(feature, fieldName, utmContent) {
      WPFormsEducation.proCore.licenseModal(feature, fieldName, utmContent);
    }
  };
  return app;
}(jQuery);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZGVmYXVsdCIsImV4cG9ydHMiLCJkZWZhdWx0IiwiJCIsImFwcCIsInNob3dQcm9Nb2RhbCIsInBhbmVsIiwiZmVhdHVyZSIsInR5cGUiLCJtZXNzYWdlIiwid3Bmb3Jtc19lZHVjYXRpb24iLCJ1cGdyYWRlIiwibWVzc2FnZV9wbHVyYWwiLCJyZXBsYWNlIiwidXRtQ29udGVudCIsImNvbnRhaW5lciIsImJhY2tncm91bmQiLCJ0aGVtZXMiLCJhbGVydCIsImJhY2tncm91bmREaXNtaXNzIiwidGl0bGUiLCJ0aXRsZV9wbHVyYWwiLCJpY29uIiwiY29udGVudCIsImJveFdpZHRoIiwidGhlbWUiLCJjbG9zZUljb24iLCJvbk9wZW5CZWZvcmUiLCIkYnRuYyIsImFmdGVyIiwidXBncmFkZV9ib251cyIsImRvYyIsIiRib2R5IiwiZmluZCIsImFkZENsYXNzIiwiYnV0dG9ucyIsImNvbmZpcm0iLCJ0ZXh0IiwiYnV0dG9uIiwiYnRuQ2xhc3MiLCJrZXlzIiwiYWN0aW9uIiwid2luZG93Iiwib3BlbiIsIldQRm9ybXNFZHVjYXRpb24iLCJjb3JlIiwiZ2V0VXBncmFkZVVSTCIsInVwZ3JhZGVNb2RhbFRoYW5rWW91Iiwic2hvd0xpY2Vuc2VNb2RhbCIsImZpZWxkTmFtZSIsInByb0NvcmUiLCJsaWNlbnNlTW9kYWwiLCJqUXVlcnkiXSwic291cmNlcyI6WyJlZHVjYXRpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIHdwZm9ybXNfZWR1Y2F0aW9uLCBXUEZvcm1zRWR1Y2F0aW9uICovXG5cbi8qKlxuICogV1BGb3JtcyBFZHVjYXRpb24gTW9kYWwgbW9kdWxlLlxuICpcbiAqIEBzaW5jZSAxLjguOFxuICovXG5leHBvcnQgZGVmYXVsdCAoICggJCApID0+IHtcblx0LyoqXG5cdCAqIFB1YmxpYyBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjguOFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0Y29uc3QgYXBwID0ge1xuXHRcdC8qKlxuXHRcdCAqIE9wZW4gZWR1Y2F0aW9uYWwgcG9wdXAgZm9yIHVzZXJzIHdpdGggbm8gUHJvIGxpY2Vuc2UuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBwYW5lbCAgIFBhbmVsIHNsdWcuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGZlYXR1cmUgRmVhdHVyZSBuYW1lLlxuXHRcdCAqL1xuXHRcdHNob3dQcm9Nb2RhbCggcGFuZWwsIGZlYXR1cmUgKSB7XG5cdFx0XHRjb25zdCB0eXBlID0gJ3Bybyc7XG5cdFx0XHRjb25zdCBtZXNzYWdlID0gd3Bmb3Jtc19lZHVjYXRpb24udXBncmFkZVsgdHlwZSBdLm1lc3NhZ2VfcGx1cmFsLnJlcGxhY2UoIC8lbmFtZSUvZywgZmVhdHVyZSApO1xuXHRcdFx0Y29uc3QgdXRtQ29udGVudCA9IHtcblx0XHRcdFx0Y29udGFpbmVyOiAnVXBncmFkZSB0byBQcm8gLSBDb250YWluZXIgU3R5bGVzJyxcblx0XHRcdFx0YmFja2dyb3VuZDogJ1VwZ3JhZGUgdG8gUHJvIC0gQmFja2dyb3VuZCBTdHlsZXMnLFxuXHRcdFx0XHR0aGVtZXM6ICdVcGdyYWRlIHRvIFBybyAtIFRoZW1lcycsXG5cdFx0XHR9O1xuXG5cdFx0XHQkLmFsZXJ0KCB7XG5cdFx0XHRcdGJhY2tncm91bmREaXNtaXNzOiB0cnVlLFxuXHRcdFx0XHR0aXRsZTogZmVhdHVyZSArICcgJyArIHdwZm9ybXNfZWR1Y2F0aW9uLnVwZ3JhZGVbIHR5cGUgXS50aXRsZV9wbHVyYWwsXG5cdFx0XHRcdGljb246ICdmYSBmYS1sb2NrJyxcblx0XHRcdFx0Y29udGVudDogbWVzc2FnZSxcblx0XHRcdFx0Ym94V2lkdGg6ICc1NTBweCcsXG5cdFx0XHRcdHRoZW1lOiAnbW9kZXJuLHdwZm9ybXMtZWR1Y2F0aW9uJyxcblx0XHRcdFx0Y2xvc2VJY29uOiB0cnVlLFxuXHRcdFx0XHRvbk9wZW5CZWZvcmU6IGZ1bmN0aW9uKCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG9iamVjdC1zaG9ydGhhbmRcblx0XHRcdFx0XHR0aGlzLiRidG5jLmFmdGVyKCAnPGRpdiBjbGFzcz1cImRpc2NvdW50LW5vdGVcIj4nICsgd3Bmb3Jtc19lZHVjYXRpb24udXBncmFkZV9ib251cyArICc8L2Rpdj4nICk7XG5cdFx0XHRcdFx0dGhpcy4kYnRuYy5hZnRlciggd3Bmb3Jtc19lZHVjYXRpb24udXBncmFkZVsgdHlwZSBdLmRvYy5yZXBsYWNlKCAvJTI1bmFtZSUyNS9nLCAnQVAgLSAnICsgZmVhdHVyZSApICk7XG5cdFx0XHRcdFx0dGhpcy4kYm9keS5maW5kKCAnLmpjb25maXJtLWNvbnRlbnQnICkuYWRkQ2xhc3MoICdsaXRlLXVwZ3JhZGUnICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJ1dHRvbnM6IHtcblx0XHRcdFx0XHRjb25maXJtOiB7XG5cdFx0XHRcdFx0XHR0ZXh0OiB3cGZvcm1zX2VkdWNhdGlvbi51cGdyYWRlWyB0eXBlIF0uYnV0dG9uLFxuXHRcdFx0XHRcdFx0YnRuQ2xhc3M6ICdidG4tY29uZmlybScsXG5cdFx0XHRcdFx0XHRrZXlzOiBbICdlbnRlcicgXSxcblx0XHRcdFx0XHRcdGFjdGlvbjogKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHR3aW5kb3cub3BlbiggV1BGb3Jtc0VkdWNhdGlvbi5jb3JlLmdldFVwZ3JhZGVVUkwoIHV0bUNvbnRlbnRbIHBhbmVsIF0sIHR5cGUgKSwgJ19ibGFuaycgKTtcblx0XHRcdFx0XHRcdFx0V1BGb3Jtc0VkdWNhdGlvbi5jb3JlLnVwZ3JhZGVNb2RhbFRoYW5rWW91KCB0eXBlICk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0sXG5cdFx0XHR9ICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIE9wZW4gbGljZW5zZSBtb2RhbC5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGZlYXR1cmUgICAgRmVhdHVyZSBuYW1lLlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBmaWVsZE5hbWUgIEZpZWxkIG5hbWUuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHV0bUNvbnRlbnQgVVRNIGNvbnRlbnQuXG5cdFx0ICovXG5cdFx0c2hvd0xpY2Vuc2VNb2RhbCggZmVhdHVyZSwgZmllbGROYW1lLCB1dG1Db250ZW50ICkge1xuXHRcdFx0V1BGb3Jtc0VkdWNhdGlvbi5wcm9Db3JlLmxpY2Vuc2VNb2RhbCggZmVhdHVyZSwgZmllbGROYW1lLCB1dG1Db250ZW50ICk7XG5cdFx0fSxcblx0fTtcblxuXHRyZXR1cm4gYXBwO1xufSApKCBqUXVlcnkgKTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkEsSUFBQUEsUUFBQSxHQUFBQyxPQUFBLENBQUFDLE9BQUEsR0FLaUIsVUFBRUMsQ0FBQyxFQUFNO0VBQ3pCO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0MsSUFBTUMsR0FBRyxHQUFHO0lBQ1g7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNFQyxZQUFZLFdBQUFBLGFBQUVDLEtBQUssRUFBRUMsT0FBTyxFQUFHO01BQzlCLElBQU1DLElBQUksR0FBRyxLQUFLO01BQ2xCLElBQU1DLE9BQU8sR0FBR0MsaUJBQWlCLENBQUNDLE9BQU8sQ0FBRUgsSUFBSSxDQUFFLENBQUNJLGNBQWMsQ0FBQ0MsT0FBTyxDQUFFLFNBQVMsRUFBRU4sT0FBUSxDQUFDO01BQzlGLElBQU1PLFVBQVUsR0FBRztRQUNsQkMsU0FBUyxFQUFFLG1DQUFtQztRQUM5Q0MsVUFBVSxFQUFFLG9DQUFvQztRQUNoREMsTUFBTSxFQUFFO01BQ1QsQ0FBQztNQUVEZCxDQUFDLENBQUNlLEtBQUssQ0FBRTtRQUNSQyxpQkFBaUIsRUFBRSxJQUFJO1FBQ3ZCQyxLQUFLLEVBQUViLE9BQU8sR0FBRyxHQUFHLEdBQUdHLGlCQUFpQixDQUFDQyxPQUFPLENBQUVILElBQUksQ0FBRSxDQUFDYSxZQUFZO1FBQ3JFQyxJQUFJLEVBQUUsWUFBWTtRQUNsQkMsT0FBTyxFQUFFZCxPQUFPO1FBQ2hCZSxRQUFRLEVBQUUsT0FBTztRQUNqQkMsS0FBSyxFQUFFLDBCQUEwQjtRQUNqQ0MsU0FBUyxFQUFFLElBQUk7UUFDZkMsWUFBWSxFQUFFLFNBQUFBLGFBQUEsRUFBVztVQUFFO1VBQzFCLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxLQUFLLENBQUUsNkJBQTZCLEdBQUduQixpQkFBaUIsQ0FBQ29CLGFBQWEsR0FBRyxRQUFTLENBQUM7VUFDOUYsSUFBSSxDQUFDRixLQUFLLENBQUNDLEtBQUssQ0FBRW5CLGlCQUFpQixDQUFDQyxPQUFPLENBQUVILElBQUksQ0FBRSxDQUFDdUIsR0FBRyxDQUFDbEIsT0FBTyxDQUFFLGFBQWEsRUFBRSxPQUFPLEdBQUdOLE9BQVEsQ0FBRSxDQUFDO1VBQ3JHLElBQUksQ0FBQ3lCLEtBQUssQ0FBQ0MsSUFBSSxDQUFFLG1CQUFvQixDQUFDLENBQUNDLFFBQVEsQ0FBRSxjQUFlLENBQUM7UUFDbEUsQ0FBQztRQUNEQyxPQUFPLEVBQUU7VUFDUkMsT0FBTyxFQUFFO1lBQ1JDLElBQUksRUFBRTNCLGlCQUFpQixDQUFDQyxPQUFPLENBQUVILElBQUksQ0FBRSxDQUFDOEIsTUFBTTtZQUM5Q0MsUUFBUSxFQUFFLGFBQWE7WUFDdkJDLElBQUksRUFBRSxDQUFFLE9BQU8sQ0FBRTtZQUNqQkMsTUFBTSxFQUFFLFNBQUFBLE9BQUEsRUFBTTtjQUNiQyxNQUFNLENBQUNDLElBQUksQ0FBRUMsZ0JBQWdCLENBQUNDLElBQUksQ0FBQ0MsYUFBYSxDQUFFaEMsVUFBVSxDQUFFUixLQUFLLENBQUUsRUFBRUUsSUFBSyxDQUFDLEVBQUUsUUFBUyxDQUFDO2NBQ3pGb0MsZ0JBQWdCLENBQUNDLElBQUksQ0FBQ0Usb0JBQW9CLENBQUV2QyxJQUFLLENBQUM7WUFDbkQ7VUFDRDtRQUNEO01BQ0QsQ0FBRSxDQUFDO0lBQ0osQ0FBQztJQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNFd0MsZ0JBQWdCLFdBQUFBLGlCQUFFekMsT0FBTyxFQUFFMEMsU0FBUyxFQUFFbkMsVUFBVSxFQUFHO01BQ2xEOEIsZ0JBQWdCLENBQUNNLE9BQU8sQ0FBQ0MsWUFBWSxDQUFFNUMsT0FBTyxFQUFFMEMsU0FBUyxFQUFFbkMsVUFBVyxDQUFDO0lBQ3hFO0VBQ0QsQ0FBQztFQUVELE9BQU9WLEdBQUc7QUFDWCxDQUFDLENBQUlnRCxNQUFPLENBQUMifQ==
},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/* global wpforms_gutenberg_form_selector */
/* jshint es3: false, esversion: 6 */
/**
 * @param strings.field_styles
 * @param strings.lead_forms_panel_notice_head
 * @param strings.lead_forms_panel_notice_text
 * @param strings.learn_more
 * @param strings.use_modern_notice_head
 * @param strings.use_modern_notice_link
 * @param strings.use_modern_notice_text
 */
/**
 * Gutenberg editor block.
 *
 * Field styles panel module.
 *
 * @since 1.8.8
 */
var _default = exports.default = function () {
  /**
   * WP core components.
   *
   * @since 1.8.8
   */
  var _ref = wp.blockEditor || wp.editor,
    PanelColorSettings = _ref.PanelColorSettings;
  var _wp$components = wp.components,
    SelectControl = _wp$components.SelectControl,
    PanelBody = _wp$components.PanelBody,
    Flex = _wp$components.Flex,
    FlexBlock = _wp$components.FlexBlock,
    __experimentalUnitControl = _wp$components.__experimentalUnitControl;

  /**
   * Localized data aliases.
   *
   * @since 1.8.8
   */
  var _wpforms_gutenberg_fo = wpforms_gutenberg_form_selector,
    strings = _wpforms_gutenberg_fo.strings,
    defaults = _wpforms_gutenberg_fo.defaults;

  // noinspection UnnecessaryLocalVariableJS
  /**
   * Public functions and properties.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var app = {
    /**
     * Get block attributes.
     *
     * @since 1.8.8
     *
     * @return {Object} Block attributes.
     */
    getBlockAttributes: function getBlockAttributes() {
      return {
        fieldSize: {
          type: 'string',
          default: defaults.fieldSize
        },
        fieldBorderStyle: {
          type: 'string',
          default: defaults.fieldBorderStyle
        },
        fieldBorderSize: {
          type: 'string',
          default: defaults.fieldBorderSize
        },
        fieldBorderRadius: {
          type: 'string',
          default: defaults.fieldBorderRadius
        },
        fieldBackgroundColor: {
          type: 'string',
          default: defaults.fieldBackgroundColor
        },
        fieldBorderColor: {
          type: 'string',
          default: defaults.fieldBorderColor
        },
        fieldTextColor: {
          type: 'string',
          default: defaults.fieldTextColor
        },
        fieldMenuColor: {
          type: 'string',
          default: defaults.fieldMenuColor
        }
      };
    },
    /**
     * Get Field styles JSX code.
     *
     * @since 1.8.8
     *
     * @param {Object} props              Block properties.
     * @param {Object} handlers           Block event handlers.
     * @param {Object} sizeOptions        Size selector options.
     * @param {Object} formSelectorCommon Form selector common object.
     *
     * @return {Object}  Field styles JSX code.
     */
    getFieldStyles: function getFieldStyles(props, handlers, sizeOptions, formSelectorCommon) {
      // eslint-disable-line max-lines-per-function
      return /*#__PURE__*/React.createElement(PanelBody, {
        className: formSelectorCommon.getPanelClass(props),
        title: strings.field_styles
      }, /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: 'wpforms-gutenberg-form-selector-flex',
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(SelectControl, {
        label: strings.size,
        value: props.attributes.fieldSize,
        options: sizeOptions,
        onChange: function onChange(value) {
          return handlers.styleAttrChange('fieldSize', value);
        }
      })), /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(SelectControl, {
        label: strings.border,
        value: props.attributes.fieldBorderStyle,
        options: [{
          label: strings.none,
          value: 'none'
        }, {
          label: strings.solid,
          value: 'solid'
        }, {
          label: strings.dashed,
          value: 'dashed'
        }, {
          label: strings.dotted,
          value: 'dotted'
        }],
        onChange: function onChange(value) {
          return handlers.styleAttrChange('fieldBorderStyle', value);
        }
      }))), /*#__PURE__*/React.createElement(Flex, {
        gap: 4,
        align: "flex-start",
        className: 'wpforms-gutenberg-form-selector-flex',
        justify: "space-between"
      }, /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(__experimentalUnitControl, {
        label: strings.border_size,
        value: props.attributes.fieldBorderStyle === 'none' ? '' : props.attributes.fieldBorderSize,
        min: 0,
        disabled: props.attributes.fieldBorderStyle === 'none',
        onChange: function onChange(value) {
          return handlers.styleAttrChange('fieldBorderSize', value);
        },
        isUnitSelectTabbable: true
      })), /*#__PURE__*/React.createElement(FlexBlock, null, /*#__PURE__*/React.createElement(__experimentalUnitControl, {
        label: strings.border_radius,
        value: props.attributes.fieldBorderRadius,
        min: 0,
        isUnitSelectTabbable: true,
        onChange: function onChange(value) {
          return handlers.styleAttrChange('fieldBorderRadius', value);
        }
      }))), /*#__PURE__*/React.createElement("div", {
        className: "wpforms-gutenberg-form-selector-color-picker"
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-gutenberg-form-selector-control-label"
      }, strings.colors), /*#__PURE__*/React.createElement(PanelColorSettings, {
        __experimentalIsRenderedInSidebar: true,
        enableAlpha: true,
        showTitle: false,
        className: formSelectorCommon.getColorPanelClass(props.attributes.fieldBorderStyle),
        colorSettings: [{
          value: props.attributes.fieldBackgroundColor,
          onChange: function onChange(value) {
            return handlers.styleAttrChange('fieldBackgroundColor', value);
          },
          label: strings.background
        }, {
          value: props.attributes.fieldBorderColor,
          onChange: function onChange(value) {
            return handlers.styleAttrChange('fieldBorderColor', value);
          },
          label: strings.border
        }, {
          value: props.attributes.fieldTextColor,
          onChange: function onChange(value) {
            return handlers.styleAttrChange('fieldTextColor', value);
          },
          label: strings.text
        }, {
          value: props.attributes.fieldMenuColor,
          onChange: function onChange(value) {
            return handlers.styleAttrChange('fieldMenuColor', value);
          },
          label: strings.menu
        }]
      })));
    }
  };
  return app;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZGVmYXVsdCIsImV4cG9ydHMiLCJkZWZhdWx0IiwiX3JlZiIsIndwIiwiYmxvY2tFZGl0b3IiLCJlZGl0b3IiLCJQYW5lbENvbG9yU2V0dGluZ3MiLCJfd3AkY29tcG9uZW50cyIsImNvbXBvbmVudHMiLCJTZWxlY3RDb250cm9sIiwiUGFuZWxCb2R5IiwiRmxleCIsIkZsZXhCbG9jayIsIl9fZXhwZXJpbWVudGFsVW5pdENvbnRyb2wiLCJfd3Bmb3Jtc19ndXRlbmJlcmdfZm8iLCJ3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yIiwic3RyaW5ncyIsImRlZmF1bHRzIiwiYXBwIiwiZ2V0QmxvY2tBdHRyaWJ1dGVzIiwiZmllbGRTaXplIiwidHlwZSIsImZpZWxkQm9yZGVyU3R5bGUiLCJmaWVsZEJvcmRlclNpemUiLCJmaWVsZEJvcmRlclJhZGl1cyIsImZpZWxkQmFja2dyb3VuZENvbG9yIiwiZmllbGRCb3JkZXJDb2xvciIsImZpZWxkVGV4dENvbG9yIiwiZmllbGRNZW51Q29sb3IiLCJnZXRGaWVsZFN0eWxlcyIsInByb3BzIiwiaGFuZGxlcnMiLCJzaXplT3B0aW9ucyIsImZvcm1TZWxlY3RvckNvbW1vbiIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImdldFBhbmVsQ2xhc3MiLCJ0aXRsZSIsImZpZWxkX3N0eWxlcyIsImdhcCIsImFsaWduIiwianVzdGlmeSIsImxhYmVsIiwic2l6ZSIsInZhbHVlIiwiYXR0cmlidXRlcyIsIm9wdGlvbnMiLCJvbkNoYW5nZSIsInN0eWxlQXR0ckNoYW5nZSIsImJvcmRlciIsIm5vbmUiLCJzb2xpZCIsImRhc2hlZCIsImRvdHRlZCIsImJvcmRlcl9zaXplIiwibWluIiwiZGlzYWJsZWQiLCJpc1VuaXRTZWxlY3RUYWJiYWJsZSIsImJvcmRlcl9yYWRpdXMiLCJjb2xvcnMiLCJfX2V4cGVyaW1lbnRhbElzUmVuZGVyZWRJblNpZGViYXIiLCJlbmFibGVBbHBoYSIsInNob3dUaXRsZSIsImdldENvbG9yUGFuZWxDbGFzcyIsImNvbG9yU2V0dGluZ3MiLCJiYWNrZ3JvdW5kIiwidGV4dCIsIm1lbnUiXSwic291cmNlcyI6WyJmaWVsZC1zdHlsZXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IgKi9cbi8qIGpzaGludCBlczM6IGZhbHNlLCBlc3ZlcnNpb246IDYgKi9cblxuLyoqXG4gKiBAcGFyYW0gc3RyaW5ncy5maWVsZF9zdHlsZXNcbiAqIEBwYXJhbSBzdHJpbmdzLmxlYWRfZm9ybXNfcGFuZWxfbm90aWNlX2hlYWRcbiAqIEBwYXJhbSBzdHJpbmdzLmxlYWRfZm9ybXNfcGFuZWxfbm90aWNlX3RleHRcbiAqIEBwYXJhbSBzdHJpbmdzLmxlYXJuX21vcmVcbiAqIEBwYXJhbSBzdHJpbmdzLnVzZV9tb2Rlcm5fbm90aWNlX2hlYWRcbiAqIEBwYXJhbSBzdHJpbmdzLnVzZV9tb2Rlcm5fbm90aWNlX2xpbmtcbiAqIEBwYXJhbSBzdHJpbmdzLnVzZV9tb2Rlcm5fbm90aWNlX3RleHRcbiAqL1xuXG4vKipcbiAqIEd1dGVuYmVyZyBlZGl0b3IgYmxvY2suXG4gKlxuICogRmllbGQgc3R5bGVzIHBhbmVsIG1vZHVsZS5cbiAqXG4gKiBAc2luY2UgMS44LjhcbiAqL1xuZXhwb3J0IGRlZmF1bHQgKCAoIGZ1bmN0aW9uKCkge1xuXHQvKipcblx0ICogV1AgY29yZSBjb21wb25lbnRzLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICovXG5cdGNvbnN0IHsgUGFuZWxDb2xvclNldHRpbmdzIH0gPSB3cC5ibG9ja0VkaXRvciB8fCB3cC5lZGl0b3I7XG5cdGNvbnN0IHsgU2VsZWN0Q29udHJvbCwgUGFuZWxCb2R5LCBGbGV4LCBGbGV4QmxvY2ssIF9fZXhwZXJpbWVudGFsVW5pdENvbnRyb2wgfSA9IHdwLmNvbXBvbmVudHM7XG5cblx0LyoqXG5cdCAqIExvY2FsaXplZCBkYXRhIGFsaWFzZXMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjguOFxuXHQgKi9cblx0Y29uc3QgeyBzdHJpbmdzLCBkZWZhdWx0cyB9ID0gd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvcjtcblxuXHQvLyBub2luc3BlY3Rpb24gVW5uZWNlc3NhcnlMb2NhbFZhcmlhYmxlSlNcblx0LyoqXG5cdCAqIFB1YmxpYyBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjguOFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0Y29uc3QgYXBwID0ge1xuXHRcdC8qKlxuXHRcdCAqIEdldCBibG9jayBhdHRyaWJ1dGVzLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtPYmplY3R9IEJsb2NrIGF0dHJpYnV0ZXMuXG5cdFx0ICovXG5cdFx0Z2V0QmxvY2tBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZmllbGRTaXplOiB7XG5cdFx0XHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRcdFx0ZGVmYXVsdDogZGVmYXVsdHMuZmllbGRTaXplLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmaWVsZEJvcmRlclN0eWxlOiB7XG5cdFx0XHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRcdFx0ZGVmYXVsdDogZGVmYXVsdHMuZmllbGRCb3JkZXJTdHlsZSxcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmllbGRCb3JkZXJTaXplOiB7XG5cdFx0XHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRcdFx0ZGVmYXVsdDogZGVmYXVsdHMuZmllbGRCb3JkZXJTaXplLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmaWVsZEJvcmRlclJhZGl1czoge1xuXHRcdFx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0XHRcdGRlZmF1bHQ6IGRlZmF1bHRzLmZpZWxkQm9yZGVyUmFkaXVzLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmaWVsZEJhY2tncm91bmRDb2xvcjoge1xuXHRcdFx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdFx0XHRcdGRlZmF1bHQ6IGRlZmF1bHRzLmZpZWxkQmFja2dyb3VuZENvbG9yLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmaWVsZEJvcmRlckNvbG9yOiB7XG5cdFx0XHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0XHRcdFx0ZGVmYXVsdDogZGVmYXVsdHMuZmllbGRCb3JkZXJDb2xvcixcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmllbGRUZXh0Q29sb3I6IHtcblx0XHRcdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdFx0XHRkZWZhdWx0OiBkZWZhdWx0cy5maWVsZFRleHRDb2xvcixcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmllbGRNZW51Q29sb3I6IHtcblx0XHRcdFx0XHR0eXBlOiAnc3RyaW5nJyxcblx0XHRcdFx0XHRkZWZhdWx0OiBkZWZhdWx0cy5maWVsZE1lbnVDb2xvcixcblx0XHRcdFx0fSxcblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdldCBGaWVsZCBzdHlsZXMgSlNYIGNvZGUuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyAgICAgICAgICAgICAgQmxvY2sgcHJvcGVydGllcy5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gaGFuZGxlcnMgICAgICAgICAgIEJsb2NrIGV2ZW50IGhhbmRsZXJzLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBzaXplT3B0aW9ucyAgICAgICAgU2l6ZSBzZWxlY3RvciBvcHRpb25zLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBmb3JtU2VsZWN0b3JDb21tb24gRm9ybSBzZWxlY3RvciBjb21tb24gb2JqZWN0LlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fSAgRmllbGQgc3R5bGVzIEpTWCBjb2RlLlxuXHRcdCAqL1xuXHRcdGdldEZpZWxkU3R5bGVzKCBwcm9wcywgaGFuZGxlcnMsIHNpemVPcHRpb25zLCBmb3JtU2VsZWN0b3JDb21tb24gKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxpbmVzLXBlci1mdW5jdGlvblxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0PFBhbmVsQm9keSBjbGFzc05hbWU9eyBmb3JtU2VsZWN0b3JDb21tb24uZ2V0UGFuZWxDbGFzcyggcHJvcHMgKSB9IHRpdGxlPXsgc3RyaW5ncy5maWVsZF9zdHlsZXMgfT5cblx0XHRcdFx0XHQ8RmxleCBnYXA9eyA0IH0gYWxpZ249XCJmbGV4LXN0YXJ0XCIgY2xhc3NOYW1lPXsgJ3dwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItZmxleCcgfSBqdXN0aWZ5PVwic3BhY2UtYmV0d2VlblwiPlxuXHRcdFx0XHRcdFx0PEZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdFx0PFNlbGVjdENvbnRyb2xcblx0XHRcdFx0XHRcdFx0XHRsYWJlbD17IHN0cmluZ3Muc2l6ZSB9XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU9eyBwcm9wcy5hdHRyaWJ1dGVzLmZpZWxkU2l6ZSB9XG5cdFx0XHRcdFx0XHRcdFx0b3B0aW9ucz17IHNpemVPcHRpb25zIH1cblx0XHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17ICggdmFsdWUgKSA9PiBoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdmaWVsZFNpemUnLCB2YWx1ZSApIH1cblx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdDwvRmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0PEZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdFx0PFNlbGVjdENvbnRyb2xcblx0XHRcdFx0XHRcdFx0XHRsYWJlbD17IHN0cmluZ3MuYm9yZGVyIH1cblx0XHRcdFx0XHRcdFx0XHR2YWx1ZT17IHByb3BzLmF0dHJpYnV0ZXMuZmllbGRCb3JkZXJTdHlsZSB9XG5cdFx0XHRcdFx0XHRcdFx0b3B0aW9ucz17XG5cdFx0XHRcdFx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3Mubm9uZSwgdmFsdWU6ICdub25lJyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzdHJpbmdzLnNvbGlkLCB2YWx1ZTogJ3NvbGlkJyB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR7IGxhYmVsOiBzdHJpbmdzLmRhc2hlZCwgdmFsdWU6ICdkYXNoZWQnIH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHsgbGFiZWw6IHN0cmluZ3MuZG90dGVkLCB2YWx1ZTogJ2RvdHRlZCcgfSxcblx0XHRcdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0b25DaGFuZ2U9eyAoIHZhbHVlICkgPT4gaGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAnZmllbGRCb3JkZXJTdHlsZScsIHZhbHVlICkgfVxuXHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0PC9GbGV4QmxvY2s+XG5cdFx0XHRcdFx0PC9GbGV4PlxuXHRcdFx0XHRcdDxGbGV4IGdhcD17IDQgfSBhbGlnbj1cImZsZXgtc3RhcnRcIiBjbGFzc05hbWU9eyAnd3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1mbGV4JyB9IGp1c3RpZnk9XCJzcGFjZS1iZXR3ZWVuXCI+XG5cdFx0XHRcdFx0XHQ8RmxleEJsb2NrPlxuXHRcdFx0XHRcdFx0XHQ8X19leHBlcmltZW50YWxVbml0Q29udHJvbFxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsPXsgc3RyaW5ncy5ib3JkZXJfc2l6ZSB9XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWU9eyBwcm9wcy5hdHRyaWJ1dGVzLmZpZWxkQm9yZGVyU3R5bGUgPT09ICdub25lJyA/ICcnIDogcHJvcHMuYXR0cmlidXRlcy5maWVsZEJvcmRlclNpemUgfVxuXHRcdFx0XHRcdFx0XHRcdG1pbj17IDAgfVxuXHRcdFx0XHRcdFx0XHRcdGRpc2FibGVkPXsgcHJvcHMuYXR0cmlidXRlcy5maWVsZEJvcmRlclN0eWxlID09PSAnbm9uZScgfVxuXHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsgKCB2YWx1ZSApID0+IGhhbmRsZXJzLnN0eWxlQXR0ckNoYW5nZSggJ2ZpZWxkQm9yZGVyU2l6ZScsIHZhbHVlICkgfVxuXHRcdFx0XHRcdFx0XHRcdGlzVW5pdFNlbGVjdFRhYmJhYmxlXG5cdFx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHQ8L0ZsZXhCbG9jaz5cblx0XHRcdFx0XHRcdDxGbGV4QmxvY2s+XG5cdFx0XHRcdFx0XHRcdDxfX2V4cGVyaW1lbnRhbFVuaXRDb250cm9sXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw9eyBzdHJpbmdzLmJvcmRlcl9yYWRpdXMgfVxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlPXsgcHJvcHMuYXR0cmlidXRlcy5maWVsZEJvcmRlclJhZGl1cyB9XG5cdFx0XHRcdFx0XHRcdFx0bWluPXsgMCB9XG5cdFx0XHRcdFx0XHRcdFx0aXNVbml0U2VsZWN0VGFiYmFibGVcblx0XHRcdFx0XHRcdFx0XHRvbkNoYW5nZT17ICggdmFsdWUgKSA9PiBoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdmaWVsZEJvcmRlclJhZGl1cycsIHZhbHVlICkgfVxuXHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0PC9GbGV4QmxvY2s+XG5cdFx0XHRcdFx0PC9GbGV4PlxuXG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWNvbG9yLXBpY2tlclwiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWNvbnRyb2wtbGFiZWxcIj57IHN0cmluZ3MuY29sb3JzIH08L2Rpdj5cblx0XHRcdFx0XHRcdDxQYW5lbENvbG9yU2V0dGluZ3Ncblx0XHRcdFx0XHRcdFx0X19leHBlcmltZW50YWxJc1JlbmRlcmVkSW5TaWRlYmFyXG5cdFx0XHRcdFx0XHRcdGVuYWJsZUFscGhhXG5cdFx0XHRcdFx0XHRcdHNob3dUaXRsZT17IGZhbHNlIH1cblx0XHRcdFx0XHRcdFx0Y2xhc3NOYW1lPXsgZm9ybVNlbGVjdG9yQ29tbW9uLmdldENvbG9yUGFuZWxDbGFzcyggcHJvcHMuYXR0cmlidXRlcy5maWVsZEJvcmRlclN0eWxlICkgfVxuXHRcdFx0XHRcdFx0XHRjb2xvclNldHRpbmdzPXsgW1xuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBwcm9wcy5hdHRyaWJ1dGVzLmZpZWxkQmFja2dyb3VuZENvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0b25DaGFuZ2U6ICggdmFsdWUgKSA9PiBoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdmaWVsZEJhY2tncm91bmRDb2xvcicsIHZhbHVlICksXG5cdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogc3RyaW5ncy5iYWNrZ3JvdW5kLFxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IHByb3BzLmF0dHJpYnV0ZXMuZmllbGRCb3JkZXJDb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlOiAoIHZhbHVlICkgPT4gaGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAnZmllbGRCb3JkZXJDb2xvcicsIHZhbHVlICksXG5cdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogc3RyaW5ncy5ib3JkZXIsXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZTogcHJvcHMuYXR0cmlidXRlcy5maWVsZFRleHRDb2xvcixcblx0XHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlOiAoIHZhbHVlICkgPT4gaGFuZGxlcnMuc3R5bGVBdHRyQ2hhbmdlKCAnZmllbGRUZXh0Q29sb3InLCB2YWx1ZSApLFxuXHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IHN0cmluZ3MudGV4dCxcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlOiBwcm9wcy5hdHRyaWJ1dGVzLmZpZWxkTWVudUNvbG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0b25DaGFuZ2U6ICggdmFsdWUgKSA9PiBoYW5kbGVycy5zdHlsZUF0dHJDaGFuZ2UoICdmaWVsZE1lbnVDb2xvcicsIHZhbHVlICksXG5cdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogc3RyaW5ncy5tZW51LFxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdF0gfVxuXHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PC9QYW5lbEJvZHk+XG5cdFx0XHQpO1xuXHRcdH0sXG5cdH07XG5cblx0cmV0dXJuIGFwcDtcbn0gKSgpICk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BLElBQUFBLFFBQUEsR0FBQUMsT0FBQSxDQUFBQyxPQUFBLEdBT21CLFlBQVc7RUFDN0I7QUFDRDtBQUNBO0FBQ0E7QUFDQTtFQUNDLElBQUFDLElBQUEsR0FBK0JDLEVBQUUsQ0FBQ0MsV0FBVyxJQUFJRCxFQUFFLENBQUNFLE1BQU07SUFBbERDLGtCQUFrQixHQUFBSixJQUFBLENBQWxCSSxrQkFBa0I7RUFDMUIsSUFBQUMsY0FBQSxHQUFpRkosRUFBRSxDQUFDSyxVQUFVO0lBQXRGQyxhQUFhLEdBQUFGLGNBQUEsQ0FBYkUsYUFBYTtJQUFFQyxTQUFTLEdBQUFILGNBQUEsQ0FBVEcsU0FBUztJQUFFQyxJQUFJLEdBQUFKLGNBQUEsQ0FBSkksSUFBSTtJQUFFQyxTQUFTLEdBQUFMLGNBQUEsQ0FBVEssU0FBUztJQUFFQyx5QkFBeUIsR0FBQU4sY0FBQSxDQUF6Qk0seUJBQXlCOztFQUU1RTtBQUNEO0FBQ0E7QUFDQTtBQUNBO0VBQ0MsSUFBQUMscUJBQUEsR0FBOEJDLCtCQUErQjtJQUFyREMsT0FBTyxHQUFBRixxQkFBQSxDQUFQRSxPQUFPO0lBQUVD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
},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* global wpforms_gutenberg_form_selector */
/* jshint es3: false, esversion: 6 */
/**
 * @param wpforms_gutenberg_form_selector.route_namespace
 * @param strings.theme_name
 * @param strings.theme_delete
 * @param strings.theme_delete_title
 * @param strings.theme_delete_confirm
 * @param strings.theme_delete_cant_undone
 * @param strings.theme_delete_yes
 * @param strings.theme_copy
 * @param strings.theme_custom
 * @param strings.theme_noname
 * @param strings.button_background
 * @param strings.button_text
 * @param strings.field_label
 * @param strings.field_sublabel
 * @param strings.field_border
 */
/**
 * Gutenberg editor block.
 *
 * Themes panel module.
 *
 * @since 1.8.8
 */
var _default = exports.default = function (document, window, $) {
  /**
   * WP core components.
   *
   * @since 1.8.8
   */
  var _wp$components = wp.components,
    PanelBody = _wp$components.PanelBody,
    ColorIndicator = _wp$components.ColorIndicator,
    TextControl = _wp$components.TextControl,
    Button = _wp$components.Button;
  var _wp$components2 = wp.components,
    Radio = _wp$components2.__experimentalRadio,
    RadioGroup = _wp$components2.__experimentalRadioGroup;

  /**
   * Localized data aliases.
   *
   * @since 1.8.8
   */
  var _wpforms_gutenberg_fo = wpforms_gutenberg_form_selector,
    isAdmin = _wpforms_gutenberg_fo.isAdmin,
    isPro = _wpforms_gutenberg_fo.isPro,
    isLicenseActive = _wpforms_gutenberg_fo.isLicenseActive,
    strings = _wpforms_gutenberg_fo.strings,
    routeNamespace = _wpforms_gutenberg_fo.route_namespace;

  /**
   * Form selector common module.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var formSelectorCommon = null;

  /**
   * Runtime state.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var state = {};

  /**
   * Themes data.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var themesData = {
    wpforms: null,
    custom: null
  };

  /**
   * Enabled themes.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var enabledThemes = null;

  /**
   * Elements holder.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var el = {};

  /**
   * Public functions and properties.
   *
   * @since 1.8.8
   *
   * @type {Object}
   */
  var app = {
    /**
     * Initialize panel.
     *
     * @since 1.8.8
     */
    init: function init() {
      el.$window = $(window);
      app.fetchThemesData();
      $(app.ready);
    },
    /**
     * Document ready.
     *
     * @since 1.8.8
     */
    ready: function ready() {
      app.events();
    },
    /**
     * Events.
     *
     * @since 1.8.8
     */
    events: function events() {
      wp.data.subscribe(function () {
        var _wp$data$select, _wp$data$select2, _wp$data$select3, _wp$data$select4, _currentPost$type, _currentPost$type2;
        // eslint-disable-line complexity
        if (!isAdmin) {
          return;
        }
        var isSavingPost = (_wp$data$select = wp.data.select('core/editor')) === null || _wp$data$select === void 0 ? void 0 : _wp$data$select.isSavingPost();
        var isAutosavingPost = (_wp$data$select2 = wp.data.select('core/editor')) === null || _wp$data$select2 === void 0 ? void 0 : _wp$data$select2.isAutosavingPost();
        var isSavingWidget = (_wp$data$select3 = wp.data.select('core/edit-widgets')) === null || _wp$data$select3 === void 0 ? void 0 : _wp$data$select3.isSavingWidgetAreas();
        var currentPost = (_wp$data$select4 = wp.data.select('core/editor')) === null || _wp$data$select4 === void 0 ? void 0 : _wp$data$select4.getCurrentPost();
        var isBlockOrTemplate = (currentPost === null || currentPost === void 0 || (_currentPost$type = currentPost.type) === null || _currentPost$type === void 0 ? void 0 : _currentPost$type.includes('wp_template')) || (currentPost === null || currentPost === void 0 || (_currentPost$type2 = currentPost.type) === null || _currentPost$type2 === void 0 ? void 0 : _currentPost$type2.includes('wp_block'));
        if (!isSavingPost && !isSavingWidget && !isBlockOrTemplate || isAutosavingPost) {
          return;
        }
        if (isBlockOrTemplate) {
          // Delay saving if this is FSE for better performance.
          _.debounce(app.saveCustomThemes, 500)();
          return;
        }
        app.saveCustomThemes();
      });
    },
    /**
     * Get all themes data.
     *
     * @since 1.8.8
     *
     * @return {Object} Themes data.
     */
    getAllThemes: function getAllThemes() {
      return _objectSpread(_objectSpread({}, themesData.custom || {}), themesData.wpforms || {});
    },
    /**
     * Get theme data.
     *
     * @since 1.8.8
     *
     * @param {string} slug Theme slug.
     *
     * @return {Object|null} Theme settings.
     */
    getTheme: function getTheme(slug) {
      return app.getAllThemes()[slug] || null;
    },
    /**
     * Get enabled themes data.
     *
     * @since 1.8.8
     *
     * @return {Object} Themes data.
     */
    getEnabledThemes: function getEnabledThemes() {
      if (enabledThemes) {
        return enabledThemes;
      }
      var allThemes = app.getAllThemes();
      if (isPro && isLicenseActive) {
        return allThemes;
      }
      enabledThemes = Object.keys(allThemes).reduce(function (acc, key) {
        var _allThemes$key$settin;
        if ((_allThemes$key$settin = allThemes[key].settings) !== null && _allThemes$key$settin !== void 0 && _allThemes$key$settin.fieldSize && !allThemes[key].disabled) {
          acc[key] = allThemes[key];
        }
        return acc;
      }, {});
      return enabledThemes;
    },
    /**
     * Update enabled themes.
     *
     * @since 1.8.8
     *
     * @param {string} slug  Theme slug.
     * @param {Object} theme Theme settings.
     */
    updateEnabledThemes: function updateEnabledThemes(slug, theme) {
      if (!enabledThemes) {
        return;
      }
      enabledThemes = _objectSpread(_objectSpread({}, enabledThemes), {}, _defineProperty({}, slug, theme));
    },
    /**
     * Whether the theme is disabled.
     *
     * @since 1.8.8
     *
     * @param {string} slug Theme slug.
     *
     * @return {boolean} True if the theme is disabled.
     */
    isDisabledTheme: function isDisabledTheme(slug) {
      var _app$getEnabledThemes;
      return !((_app$getEnabledThemes = app.getEnabledThemes()) !== null && _app$getEnabledThemes !== void 0 && _app$getEnabledThemes[slug]);
    },
    /**
     * Whether the theme is one of the WPForms themes.
     *
     * @since 1.8.8
     *
     * @param {string} slug Theme slug.
     *
     * @return {boolean} True if the theme is one of the WPForms themes.
     */
    isWPFormsTheme: function isWPFormsTheme(slug) {
      var _themesData$wpforms$s;
      return Boolean((_themesData$wpforms$s = themesData.wpforms[slug]) === null || _themesData$wpforms$s === void 0 ? void 0 : _themesData$wpforms$s.settings);
    },
    /**
     * Fetch themes data from API.
     *
     * @since 1.8.8
     */
    fetchThemesData: function fetchThemesData() {
      // If a fetch is already in progress, exit the function.
      if (state.isFetchingThemes || themesData.wpforms) {
        return;
      }

      // Set the flag to true indicating a fetch is in progress.
      state.isFetchingThemes = true;
      try {
        // Fetch themes data.
        wp.apiFetch({
          path: routeNamespace + 'themes/',
          method: 'GET',
          cache: 'no-cache'
        }).then(function (response) {
          themesData.wpforms = response.wpforms || {};
          themesData.custom = response.custom || {};
        }).catch(function (error) {
          // eslint-disable-next-line no-console
          console.error(error === null || error === void 0 ? void 0 : error.message);
        }).finally(function () {
          state.isFetchingThemes = false;
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    /**
     * Save custom themes.
     *
     * @since 1.8.8
     */
    saveCustomThemes: function saveCustomThemes() {
      // Custom themes do not exist.
      if (state.isSavingThemes || !themesData.custom) {
        return;
      }

      // Set the flag to true indicating a saving is in progress.
      state.isSavingThemes = true;
      try {
        // Save themes.
        wp.apiFetch({
          path: routeNamespace + 'themes/custom/',
          method: 'POST',
          data: {
            customThemes: themesData.custom
          }
        }).then(function (response) {
          if (!(response !== null && response !== void 0 && response.result)) {
            // eslint-disable-next-line no-console
            console.log(response === null || response === void 0 ? void 0 : response.error);
          }
        }).catch(function (error) {
          // eslint-disable-next-line no-console
          console.error(error === null || error === void 0 ? void 0 : error.message);
        }).finally(function () {
          state.isSavingThemes = false;
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    /**
     * Get the current style attributes state.
     *
     * @since 1.8.8
     *
     * @param {Object} props Block properties.
     *
     * @return {boolean} Whether the custom theme is created.
     */
    getCurrentStyleAttributes: function getCurrentStyleAttributes(props) {
      var _themesData$wpforms$d;
      var defaultAttributes = Object.keys((_themesData$wpforms$d = themesData.wpforms.default) === null || _themesData$wpforms$d === void 0 ? void 0 : _themesData$wpforms$d.settings);
      var currentStyleAttributes = {};
      for (var key in defaultAttributes) {
        var _props$attributes$att;
        var attr = defaultAttributes[key];
        currentStyleAttributes[attr] = (_props$attributes$att = props.attributes[attr]) !== null && _props$attributes$att !== void 0 ? _props$attributes$att : '';
      }
      return currentStyleAttributes;
    },
    /**
     * Maybe create custom theme.
     *
     * @since 1.8.8
     *
     * @param {Object} props Block properties.
     *
     * @return {boolean} Whether the custom theme is created.
     */
    maybeCreateCustomTheme: function maybeCreateCustomTheme(props) {
      var _themesData$wpforms$p;
      // eslint-disable-line complexity
      var currentStyles = app.getCurrentStyleAttributes(props);
      var isWPFormsTheme = !!themesData.wpforms[props.attributes.theme];
      var isCustomTheme = !!themesData.custom[props.attributes.theme];
      var migrateToCustomTheme = false;

      // It is one of the default themes without any changes.
      if (isWPFormsTheme && JSON.stringify((_themesData$wpforms$p = themesData.wpforms[props.attributes.theme]) === null || _themesData$wpforms$p === void 0 ? void 0 : _themesData$wpforms$p.settings) === JSON.stringify(currentStyles)) {
        return false;
      }
      var prevAttributes = formSelectorCommon.getBlockRuntimeStateVar(props.clientId, 'prevAttributesState');

      // It is a block added in FS 1.0, so it doesn't have a theme.
      // The `prevAttributes` is `undefined` means that we are in the first render of the existing block.
      if (props.attributes.theme === 'default' && props.attributes.themeName === '' && !prevAttributes) {
        migrateToCustomTheme = true;
      }

      // It is a modified default theme OR unknown custom theme.
      if (isWPFormsTheme || !isCustomTheme || migrateToCustomTheme) {
        app.createCustomTheme(props, currentStyles, migrateToCustomTheme);
      }
      return true;
    },
    /**
     * Create custom theme.
     *
     * @since 1.8.8
     *
     * @param {Object}  props                Block properties.
     * @param {Object}  currentStyles        Current style settings.
     * @param {boolean} migrateToCustomTheme Whether it is needed to migrate to custom theme.
     *
     * @return {boolean} Whether the custom theme is created.
     */
    createCustomTheme: function createCustomTheme(props) {
      var currentStyles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var migrateToCustomTheme = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      // eslint-disable-line complexity
      var counter = 0;
      var themeSlug = props.attributes.theme;
      var baseTheme = app.getTheme(props.attributes.theme) || themesData.wpforms.default;
      var themeName = baseTheme.name;
      themesData.custom = themesData.custom || {};
      if (migrateToCustomTheme) {
        themeSlug = 'custom';
        themeName = strings.theme_custom;
      }

      // Determine the theme slug and the number of copies.
      do {
        counter++;
        themeSlug = themeSlug + '-copy-' + counter;
      } while (themesData.custom[themeSlug] && counter < 10000);
      var copyStr = counter < 2 ? strings.theme_copy : strings.theme_copy + ' ' + counter;
      themeName += ' (' + copyStr + ')';

      // The first migrated Custom Theme should be without `(Copy)` suffix.
      themeName = migrateToCustomTheme && counter < 2 ? strings.theme_custom : themeName;

      // Add the new custom theme.
      themesData.custom[themeSlug] = {
        name: themeName,
        settings: currentStyles || app.getCurrentStyleAttributes(props)
      };
      app.updateEnabledThemes(themeSlug, themesData.custom[themeSlug]);

      // Update the block attributes with the new custom theme settings.
      props.setAttributes({
        theme: themeSlug,
        themeName: themeName
      });
      return true;
    },
    /**
     * Maybe create custom theme by given attributes.
     *
     * @since 1.8.8
     *
     * @param {Object} attributes Block properties.
     *
     * @return {string} New theme's slug.
     */
    maybeCreateCustomThemeFromAttributes: function maybeCreateCustomThemeFromAttributes(attributes) {
      var _attributes$themeName;
      // eslint-disable-line complexity
      var newThemeSlug = attributes.theme;
      var existingTheme = app.getTheme(attributes.theme);
      var keys = Object.keys(attributes);
      var isExistingTheme = Boolean(existingTheme === null || existingTheme === void 0 ? void 0 : existingTheme.settings);

      // Check if the theme already exists and has the same settings.
      if (isExistingTheme) {
        for (var i in keys) {
          var key = keys[i];
          if (!existingTheme.settings[key] || existingTheme.settings[key] !== attributes[key]) {
            isExistingTheme = false;
            break;
          }
        }
      }

      // The theme exists and has the same settings.
      if (isExistingTheme) {
        return newThemeSlug;
      }

      // The theme doesn't exist.
      // Normalize the attributes to the default theme settings.
      var defaultAttributes = Object.keys(themesData.wpforms.default.settings);
      var newSettings = {};
      for (var _i in defaultAttributes) {
        var _attributes$attr;
        var attr = defaultAttributes[_i];
        newSettings[attr] = (_attributes$attr = attributes[attr]) !== null && _attributes$attr !== void 0 ? _attributes$attr : '';
      }

      // Create a new custom theme.
      themesData.custom[newThemeSlug] = {
        name: (_attributes$themeName = attributes.themeName) !== null && _attributes$themeName !== void 0 ? _attributes$themeName : strings.theme_custom,
        settings: newSettings
      };
      app.updateEnabledThemes(newThemeSlug, themesData.custom[newThemeSlug]);
      return newThemeSlug;
    },
    /**
     * Update custom theme.
     *
     * @since 1.8.8
     *
     * @param {string} attribute Attribute name.
     * @param {string} value     New attribute value.
     * @param {Object} props     Block properties.
     */
    updateCustomThemeAttribute: function updateCustomThemeAttribute(attribute, value, props) {
      // eslint-disable-line complexity
      var themeSlug = props.attributes.theme;

      // Skip if it is one of the WPForms themes OR the attribute is not in the theme settings.
      if (themesData.wpforms[themeSlug] || attribute !== 'themeName' && !themesData.wpforms.default.settings[attribute]) {
        return;
      }

      // Skip if the custom theme doesn't exist.
      // It should never happen, only in some unique circumstances.
      if (!themesData.custom[themeSlug]) {
        return;
      }

      // Update theme data.
      if (attribute === 'themeName') {
        themesData.custom[themeSlug].name = value;
      } else {
        themesData.custom[themeSlug].settings = themesData.custom[themeSlug].settings || themesData.wpforms.default.settings;
        themesData.custom[themeSlug].settings[attribute] = value;
      }

      // Trigger event for developers.
      el.$window.trigger('wpformsFormSelectorUpdateTheme', [themeSlug, themesData.custom[themeSlug], props]);
    },
    /**
     * Get Themes panel JSX code.
     *
     * @since 1.8.8
     *
     * @param {Object} props                    Block properties.
     * @param {Object} formSelectorCommonModule Common module.
     * @param {Object} stockPhotosModule        StockPhotos module.
     *
     * @return {Object} Themes panel JSX code.
     */
    getThemesPanel: function getThemesPanel(props, formSelectorCommonModule, stockPhotosModule) {
      // Store common module in app.
      formSelectorCommon = formSelectorCommonModule;
      state.stockPhotos = stockPhotosModule;

      // If there are no themes data, it is necessary to fetch it firstly.
      if (!themesData.wpforms) {
        app.fetchThemesData();

        // Return empty JSX code.
        return /*#__PURE__*/React.createElement(React.Fragment, null);
      }

      // Get event handlers.
      var handlers = app.getEventHandlers(props);
      var showCustomThemeOptions = isAdmin && formSelectorCommonModule.isFullStylingEnabled() && app.maybeCreateCustomTheme(props);
      var checked = formSelectorCommonModule.isFullStylingEnabled() ? props.attributes.theme : 'classic';
      var isLeadFormsEnabled = formSelectorCommonModule.isLeadFormsEnabled(formSelectorCommonModule.getBlockContainer(props));
      var displayLeadFormNotice = isLeadFormsEnabled ? 'block' : 'none';
      var modernNoticeStyles = displayLeadFormNotice === 'block' ? {
        display: 'none'
      } : {};
      var classes = formSelectorCommon.getPanelClass(props, 'themes');
      classes += isLeadFormsEnabled ? ' wpforms-lead-forms-enabled' : '';
      classes += app.isMac() ? ' wpforms-is-mac' : '';
      return /*#__PURE__*/React.createElement(PanelBody, {
        className: classes,
        title: strings.themes
      }, /*#__PURE__*/React.createElement("p", {
        className: "wpforms-gutenberg-panel-notice wpforms-warning wpforms-use-modern-notice",
        style: modernNoticeStyles
      }, /*#__PURE__*/React.createElement("strong", null, strings.use_modern_notice_head), strings.use_modern_notice_text, " ", /*#__PURE__*/React.createElement("a", {
        href: strings.use_modern_notice_link,
        rel: "noreferrer",
        target: "_blank"
      }, strings.learn_more)), /*#__PURE__*/React.createElement("p", {
        className: "wpforms-gutenberg-panel-notice wpforms-warning wpforms-lead-form-notice",
        style: {
          display: displayLeadFormNotice
        }
      }, /*#__PURE__*/React.createElement("strong", null, strings.lead_forms_panel_notice_head), strings.lead_forms_panel_notice_text), /*#__PURE__*/React.createElement(RadioGroup, {
        className: "wpforms-gutenberg-form-selector-themes-radio-group",
        label: strings.themes,
        checked: checked,
        defaultChecked: props.attributes.theme,
        onChange: function onChange(value) {
          return handlers.selectTheme(value);
        }
      }, app.getThemesItemsJSX(props)), showCustomThemeOptions && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextControl, {
        className: "wpforms-gutenberg-form-selector-themes-theme-name",
        label: strings.theme_name,
        value: props.attributes.themeName,
        onChange: function onChange(value) {
          return handlers.changeThemeName(value);
        }
      }), /*#__PURE__*/React.createElement(Button, {
        isSecondary: true,
        className: "wpforms-gutenberg-form-selector-themes-delete",
        onClick: handlers.deleteTheme,
        buttonSettings: ""
      }, strings.theme_delete)));
    },
    /**
     * Get the Themes panel items JSX code.
     *
     * @since 1.8.8
     *
     * @param {Object} props Block properties.
     *
     * @return {Array} Themes items JSX code.
     */
    getThemesItemsJSX: function getThemesItemsJSX(props) {
      // eslint-disable-line complexity
      var allThemesData = app.getAllThemes();
      if (!allThemesData) {
        return [];
      }
      var itemsJsx = [];
      var themes = Object.keys(allThemesData);
      var theme, firstThemeSlug;

      // Display the current custom theme on the top of the list.
      if (!app.isWPFormsTheme(props.attributes.theme)) {
        firstThemeSlug = props.attributes.theme;
        itemsJsx.push(app.getThemesItemJSX(props.attributes.theme, app.getTheme(props.attributes.theme)));
      }
      for (var key in themes) {
        var slug = themes[key];

        // Skip the first theme.
        if (firstThemeSlug && firstThemeSlug === slug) {
          continue;
        }

        // Ensure that all the theme settings are present.
        theme = _objectSpread(_objectSpread({}, allThemesData.default), allThemesData[slug] || {});
        theme.settings = _objectSpread(_objectSpread({}, allThemesData.default.settings), theme.settings || {});
        itemsJsx.push(app.getThemesItemJSX(slug, theme));
      }
      return itemsJsx;
    },
    /**
     * Get the Themes panel's single item JSX code.
     *
     * @since 1.8.8
     *
     * @param {string} slug  Theme slug.
     * @param {Object} theme Theme data.
     *
     * @return {Object|null} Themes panel single item JSX code.
     */
    getThemesItemJSX: function getThemesItemJSX(slug, theme) {
      var _theme$name;
      if (!theme) {
        return null;
      }
      var title = ((_theme$name = theme.name) === null || _theme$name === void 0 ? void 0 : _theme$name.length) > 0 ? theme.name : strings.theme_noname;
      return /*#__PURE__*/React.createElement(Radio, {
        value: slug,
        title: title
      }, /*#__PURE__*/React.createElement("div", {
        className: app.isDisabledTheme(slug) ? 'wpforms-gutenberg-form-selector-themes-radio-disabled' : ''
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-gutenberg-form-selector-themes-radio-title"
      }, title)), /*#__PURE__*/React.createElement(ColorIndicator, {
        colorValue: theme.settings.buttonBackgroundColor,
        title: strings.button_background
      }), /*#__PURE__*/React.createElement(ColorIndicator, {
        colorValue: theme.settings.buttonTextColor,
        title: strings.button_text
      }), /*#__PURE__*/React.createElement(ColorIndicator, {
        colorValue: theme.settings.labelColor,
        title: strings.field_label
      }), /*#__PURE__*/React.createElement(ColorIndicator, {
        colorValue: theme.settings.labelSublabelColor,
        title: strings.field_sublabel
      }), /*#__PURE__*/React.createElement(ColorIndicator, {
        colorValue: theme.settings.fieldBorderColor,
        title: strings.field_border
      }));
    },
    /**
     * Set block theme.
     *
     * @since 1.8.8
     *
     * @param {Object} props     Block properties.
     * @param {string} themeSlug The theme slug.
     *
     * @return {boolean} True on success.
     */
    setBlockTheme: function setBlockTheme(props, themeSlug) {
      if (app.maybeDisplayUpgradeModal(themeSlug)) {
        return false;
      }
      var theme = app.getTheme(themeSlug);
      if (!(theme !== null && theme !== void 0 && theme.settings)) {
        return false;
      }
      var attributes = Object.keys(theme.settings);
      var block = formSelectorCommon.getBlockContainer(props);
      var container = block.querySelector("#wpforms-".concat(props.attributes.formId));

      // Overwrite block attributes with the new theme settings.
      // It is needed to rely on the theme settings only.
      var newProps = _objectSpread(_objectSpread({}, props), {}, {
        attributes: _objectSpread(_objectSpread({}, props.attributes), theme.settings)
      });

      // Update the preview with the new theme settings.
      for (var key in attributes) {
        var attr = attributes[key];
        theme.settings[attr] = theme.settings[attr] === '0' ? '0px' : theme.settings[attr];
        formSelectorCommon.updatePreviewCSSVarValue(attr, theme.settings[attr], container, newProps);
      }

      // Prepare the new attributes to be set.
      var setAttributes = _objectSpread({
        theme: themeSlug,
        themeName: theme.name
      }, theme.settings);
      if (props.setAttributes) {
        // Update the block attributes with the new theme settings.
        props.setAttributes(setAttributes);
      }

      // Trigger event for developers.
      el.$window.trigger('wpformsFormSelectorSetTheme', [block, themeSlug, props]);
      return true;
    },
    /**
     * Maybe display upgrades modal in Lite.
     *
     * @since 1.8.8
     *
     * @param {string} themeSlug The theme slug.
     *
     * @return {boolean} True if modal was displayed.
     */
    maybeDisplayUpgradeModal: function maybeDisplayUpgradeModal(themeSlug) {
      if (!app.isDisabledTheme(themeSlug)) {
        return false;
      }
      if (!isPro) {
        formSelectorCommon.education.showProModal('themes', strings.themes);
        return true;
      }
      if (!isLicenseActive) {
        formSelectorCommon.education.showLicenseModal('themes', strings.themes, 'select-theme');
        return true;
      }
      return false;
    },
    /**
     * Get themes panel event handlers.
     *
     * @since 1.8.8
     *
     * @param {Object} props Block properties.
     *
     * @type {Object}
     */
    getEventHandlers: function getEventHandlers(props) {
      // eslint-disable-line max-lines-per-function
      var commonHandlers = formSelectorCommon.getSettingsFieldsHandlers(props);
      var handlers = {
        /**
         * Select theme event handler.
         *
         * @since 1.8.8
         *
         * @param {string} value New attribute value.
         */
        selectTheme: function selectTheme(value) {
          var _state$stockPhotos;
          if (!app.setBlockTheme(props, value)) {
            return;
          }

          // Maybe open Stock Photo installation window.
          state === null || state === void 0 || (_state$stockPhotos = state.stockPhotos) === null || _state$stockPhotos === void 0 || _state$stockPhotos.onSelectTheme(value, props, app, commonHandlers);
          var block = formSelectorCommon.getBlockContainer(props);
          formSelectorCommon.setTriggerServerRender(false);
          commonHandlers.updateCopyPasteContent();

          // Trigger event for developers.
          el.$window.trigger('wpformsFormSelectorSelectTheme', [block, props, value]);
        },
        /**
         * Change theme name event handler.
         *
         * @since 1.8.8
         *
         * @param {string} value New attribute value.
         */
        changeThemeName: function changeThemeName(value) {
          formSelectorCommon.setTriggerServerRender(false);
          props.setAttributes({
            themeName: value
          });
          app.updateCustomThemeAttribute('themeName', value, props);
        },
        /**
         * Delete theme event handler.
         *
         * @since 1.8.8
         */
        deleteTheme: function deleteTheme() {
          var deleteThemeSlug = props.attributes.theme;

          // Remove theme from the theme storage.
          delete themesData.custom[deleteThemeSlug];

          // Open the confirmation modal window.
          app.deleteThemeModal(props, deleteThemeSlug, handlers);
        }
      };
      return handlers;
    },
    /**
     * Open the theme delete confirmation modal window.
     *
     * @since 1.8.8
     *
     * @param {Object} props           Block properties.
     * @param {string} deleteThemeSlug Theme slug.
     * @param {Object} handlers        Block event handlers.
     */
    deleteThemeModal: function deleteThemeModal(props, deleteThemeSlug, handlers) {
      var confirm = strings.theme_delete_confirm.replace('%1$s', "<b>".concat(props.attributes.themeName, "</b>"));
      var content = "<p class=\"wpforms-theme-delete-text\">".concat(confirm, " ").concat(strings.theme_delete_cant_undone, "</p>");
      $.confirm({
        title: strings.theme_delete_title,
        content: content,
        icon: 'wpforms-exclamation-circle',
        type: 'red',
        buttons: {
          confirm: {
            text: strings.theme_delete_yes,
            btnClass: 'btn-confirm',
            keys: ['enter'],
            action: function action() {
              // Switch to the default theme.
              handlers.selectTheme('default');

              // Trigger event for developers.
              el.$window.trigger('wpformsFormSelectorDeleteTheme', [deleteThemeSlug, props]);
            }
          },
          cancel: {
            text: strings.cancel,
            keys: ['esc']
          }
        }
      });
    },
    /**
     * Determine if the user is on a Mac.
     *
     * @return {boolean} True if the user is on a Mac.
     */
    isMac: function isMac() {
      return navigator.userAgent.includes('Macintosh');
    }
  };
  app.init();

  // Provide access to public functions/properties.
  return app;
}(document, window, jQuery);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZGVmYXVsdCIsImV4cG9ydHMiLCJkZWZhdWx0IiwiZG9jdW1lbnQiLCJ3aW5kb3ciLCIkIiwiX3dwJGNvbXBvbmVudHMiLCJ3cCIsImNvbXBvbmVudHMiLCJQYW5lbEJvZHkiLCJDb2xvckluZGljYXRvciIsIlRleHRDb250cm9sIiwiQnV0dG9uIiwiX3dwJGNvbXBvbmVudHMyIiwiUmFkaW8iLCJfX2V4cGVyaW1lbnRhbFJhZGlvIiwiUmFkaW9Hcm91cCIsIl9fZXhwZXJpbWVudGFsUmFkaW9Hcm91cCIsIl93cGZvcm1zX2d1dGVuYmVyZ19mbyIsIndwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IiLCJpc0FkbWluIiwiaXNQcm8iLCJpc0xpY2Vuc2VBY3RpdmUiLCJzdHJpbmdzIiwicm91dGVOYW1lc3BhY2UiLCJyb3V0ZV9uYW1lc3BhY2UiLCJmb3JtU2VsZWN0b3JDb21tb24iLCJzdGF0ZSIsInRoZW1lc0RhdGEiLCJ3cGZvcm1zIiwiY3VzdG9tIiwiZW5hYmxlZFRoZW1lcyIsImVsIiwiYXBwIiwiaW5pdCIsIiR3aW5kb3ciLCJmZXRjaFRoZW1lc0RhdGEiLCJyZWFkeSIsImV2ZW50cyIsImRhdGEiLCJzdWJzY3JpYmUiLCJfd3AkZGF0YSRzZWxlY3QiLCJfd3AkZGF0YSRzZWxlY3QyIiwiX3dwJGRhdGEkc2VsZWN0MyIsIl93cCRkYXRhJHNlbGVjdDQiLCJfY3VycmVudFBvc3QkdHlwZSIsIl9jdXJyZW50UG9zdCR0eXBlMiIsImlzU2F2aW5nUG9zdCIsInNlbGVjdCIsImlzQXV0b3NhdmluZ1Bvc3QiLCJpc1NhdmluZ1dpZGdldCIsImlzU2F2aW5nV2lkZ2V0QXJlYXMiLCJjdXJyZW50UG9zdCIsImdldEN1cnJlbnRQb3N0IiwiaXNCbG9ja09yVGVtcGxhdGUiLCJ0eXBlIiwiaW5jbHVkZXMiLCJfIiwiZGVib3VuY2UiLCJzYXZlQ3VzdG9tVGhlbWVzIiwiZ2V0QWxsVGhlbWVzIiwiX29iamVjdFNwcmVhZCIsImdldFRoZW1lIiwic2x1ZyIsImdldEVuYWJsZWRUaGVtZXMiLCJhbGxUaGVtZXMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwiYWNjIiwia2V5IiwiX2FsbFRoZW1lcyRrZXkkc2V0dGluIiwic2V0dGluZ3MiLCJmaWVsZFNpemUiLCJkaXNhYmxlZCIsInVwZGF0ZUVuYWJsZWRUaGVtZXMiLCJ0aGVtZSIsIl9kZWZpbmVQcm9wZXJ0eSIsImlzRGlzYWJsZWRUaGVtZSIsIl9hcHAkZ2V0RW5hYmxlZFRoZW1lcyIsImlzV1BGb3Jtc1RoZW1lIiwiX3RoZW1lc0RhdGEkd3Bmb3JtcyRzIiwiQm9vbGVhbiIsImlzRmV0Y2hpbmdUaGVtZXMiLCJhcGlGZXRjaCIsInBhdGgiLCJtZXRob2QiLCJjYWNoZSIsInRoZW4iLCJyZXNwb25zZSIsImNhdGNoIiwiZXJyb3IiLCJjb25zb2xlIiwibWVzc2FnZSIsImZpbmFsbHkiLCJpc1NhdmluZ1RoZW1lcyIsImN1c3RvbVRoZW1lcyIsInJlc3VsdCIsImxvZyIsImdldEN1cnJlbnRTdHlsZUF0dHJpYnV0ZXMiLCJwcm9wcyIsIl90aGVtZXNEYXRhJHdwZm9ybXMkZCIsImRlZmF1bHRBdHRyaWJ1dGVzIiwiY3VycmVudFN0eWxlQXR0cmlidXRlcyIsIl9wcm9wcyRhdHRyaWJ1dGVzJGF0dCIsImF0dHIiLCJhdHRyaWJ1dGVzIiwibWF5YmVDcmVhdGVDdXN0b21UaGVtZSIsIl90aGVtZXNEYXRhJHdwZm9ybXMkcCIsImN1cnJlbnRTdHlsZXMiLCJpc0N1c3RvbVRoZW1lIiwibWlncmF0ZVRvQ3VzdG9tVGhlbWUiLCJKU09OIiwic3RyaW5naWZ5IiwicHJldkF0dHJpYnV0ZXMiLCJnZXRCbG9ja1J1bnRpbWVTdGF0ZVZhciIsImNsaWVudElkIiwidGhlbWVOYW1lIiwiY3JlYXRlQ3VzdG9tVGhlbWUiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJjb3VudGVyIiwidGhlbWVTbHVnIiwiYmFzZVRoZW1lIiwibmFtZSIsInRoZW1lX2N1c3RvbSIsImNvcHlTdHIiLCJ0aGVtZV9jb3B5Iiwic2V0QXR0cmlidXRlcyIsIm1heWJlQ3JlYXRlQ3VzdG9tVGhlbWVGcm9tQXR0cmlidXRlcyIsIl9hdHRyaWJ1dGVzJHRoZW1lTmFtZSIsIm5ld1RoZW1lU2x1ZyIsImV4aXN0aW5nVGhlbWUiLCJpc0V4aXN0aW5nVGhlbWUiLCJpIiwibmV3U2V0dGluZ3MiLCJfYXR0cmlidXRlcyRhdHRyIiwidXBkYXRlQ3VzdG9tVGhlbWVBdHRyaWJ1dGUiLCJhdHRyaWJ1dGUiLCJ2YWx1ZSIsInRyaWdnZXIiLCJnZXRUaGVtZXNQYW5lbCIsImZvcm1TZWxlY3RvckNvbW1vbk1vZHVsZSIsInN0b2NrUGhvdG9zTW9kdWxlIiwic3RvY2tQaG90b3MiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJGcmFnbWVudCIsImhhbmRsZXJzIiwiZ2V0RXZlbnRIYW5kbGVycyIsInNob3dDdXN0b21UaGVtZU9wdGlvbnMiLCJpc0Z1bGxTdHlsaW5nRW5hYmxlZCIsImNoZWNrZWQiLCJpc0xlYWRGb3Jtc0VuYWJsZWQiLCJnZXRCbG9ja0NvbnRhaW5lciIsImRpc3BsYXlMZWFkRm9ybU5vdGljZSIsIm1vZGVybk5vdGljZVN0eWxlcyIsImRpc3BsYXkiLCJjbGFzc2VzIiwiZ2V0UGFuZWxDbGFzcyIsImlzTWFjIiwiY2xhc3NOYW1lIiwidGl0bGUiLCJ0aGVtZXMiLCJzdHlsZSIsInVzZV9tb2Rlcm5fbm90aWNlX2hlYWQiLCJ1c2VfbW9kZXJuX25vdGljZV90ZXh0IiwiaHJlZiIsInVzZV9tb2Rlcm5fbm90aWNlX2xpbmsiLCJyZWwiLCJ0YXJnZXQiLCJsZWFybl9tb3JlIiwibGVhZF9mb3Jtc19wYW5lbF9ub3RpY2VfaGVhZCIsImxlYWRfZm9ybXNfcGFuZWxfbm90aWNlX3RleHQiLCJsYWJlbCIsImRlZmF1bHRDaGVja2VkIiwib25DaGFuZ2UiLCJzZWxlY3RUaGVtZSIsImdldFRoZW1lc0l0ZW1zSlNYIiwidGhlbWVfbmFtZSIsImNoYW5nZVRoZW1lTmFtZSIsImlzU2Vjb25kYXJ5Iiwib25DbGljayIsImRlbGV0ZVRoZW1lIiwiYnV0dG9uU2V0dGluZ3MiLCJ0aGVtZV9kZWxldGUiLCJhbGxUaGVtZXNEYXRhIiwiaXRlbXNKc3giLCJmaXJzdFRoZW1lU2x1ZyIsInB1c2giLCJnZXRUaGVtZXNJdGVtSlNYIiwiX3RoZW1lJG5hbWUiLCJ0aGVtZV9ub25hbWUiLCJjb2xvclZhbHVlIiwiYnV0dG9uQmFja2dyb3VuZENvbG9yIiwiYnV0dG9uX2JhY2tncm91bmQiLCJidXR0b25UZXh0Q29sb3IiLCJidXR0b25fdGV4dCIsImxhYmVsQ29sb3IiLCJmaWVsZF9sYWJlbCIsImxhYmVsU3VibGFiZWxDb2xvciIsImZpZWxkX3N1YmxhYmVsIiwiZmllbGRCb3JkZXJDb2xvciIsImZpZWxkX2JvcmRlciIsInNldEJsb2NrVGhlbWUiLCJtYXliZURpc3BsYXlVcGdyYWRlTW9kYWwiLCJibG9jayIsImNvbnRhaW5lciIsInF1ZXJ5U2VsZWN0b3IiLCJjb25jYXQiLCJmb3JtSWQiLCJuZXdQcm9wcyIsInVwZGF0ZVByZXZpZXdDU1NWYXJWYWx1ZSIsImVkdWNhdGlvbiIsInNob3dQcm9Nb2RhbCIsInNob3dMaWNlbnNlTW9kYWwiLCJjb21tb25IYW5kbGVycyIsImdldFNldHRpbmdzRmllbGRzSGFuZGxlcnMiLCJfc3RhdGUkc3RvY2tQaG90b3MiLCJvblNlbGVjdFRoZW1lIiwic2V0VHJpZ2dlclNlcnZlclJlbmRlciIsInVwZGF0ZUNvcHlQYXN0ZUNvbnRlbnQiLCJkZWxldGVUaGVtZVNsdWciLCJkZWxldGVUaGVtZU1vZGFsIiwiY29uZmlybSIsInRoZW1lX2RlbGV0ZV9jb25maXJtIiwicmVwbGFjZSIsImNvbnRlbnQiLCJ0aGVtZV9kZWxldGVfY2FudF91bmRvbmUiLCJ0aGVtZV9kZWxldGVfdGl0bGUiLCJpY29uIiwiYnV0dG9ucyIsInRleHQiLCJ0aGVtZV9kZWxldGVfeWVzIiwiYnRuQ2xhc3MiLCJhY3Rpb24iLCJjYW5jZWwiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJqUXVlcnkiXSwic291cmNlcyI6WyJ0aGVtZXMtcGFuZWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IgKi9cbi8qIGpzaGludCBlczM6IGZhbHNlLCBlc3ZlcnNpb246IDYgKi9cblxuLyoqXG4gKiBAcGFyYW0gd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvci5yb3V0ZV9uYW1lc3BhY2VcbiAqIEBwYXJhbSBzdHJpbmdzLnRoZW1lX25hbWVcbiAqIEBwYXJhbSBzdHJpbmdzLnRoZW1lX2RlbGV0ZVxuICogQHBhcmFtIHN0cmluZ3MudGhlbWVfZGVsZXRlX3RpdGxlXG4gKiBAcGFyYW0gc3RyaW5ncy50aGVtZV9kZWxldGVfY29uZmlybVxuICogQHBhcmFtIHN0cmluZ3MudGhlbWVfZGVsZXRlX2NhbnRfdW5kb25lXG4gKiBAcGFyYW0gc3RyaW5ncy50aGVtZV9kZWxldGVfeWVzXG4gKiBAcGFyYW0gc3RyaW5ncy50aGVtZV9jb3B5XG4gKiBAcGFyYW0gc3RyaW5ncy50aGVtZV9jdXN0b21cbiAqIEBwYXJhbSBzdHJpbmdzLnRoZW1lX25vbmFtZVxuICogQHBhcmFtIHN0cmluZ3MuYnV0dG9uX2JhY2tncm91bmRcbiAqIEBwYXJhbSBzdHJpbmdzLmJ1dHRvbl90ZXh0XG4gKiBAcGFyYW0gc3RyaW5ncy5maWVsZF9sYWJlbFxuICogQHBhcmFtIHN0cmluZ3MuZmllbGRfc3VibGFiZWxcbiAqIEBwYXJhbSBzdHJpbmdzLmZpZWxkX2JvcmRlclxuICovXG5cbi8qKlxuICogR3V0ZW5iZXJnIGVkaXRvciBibG9jay5cbiAqXG4gKiBUaGVtZXMgcGFuZWwgbW9kdWxlLlxuICpcbiAqIEBzaW5jZSAxLjguOFxuICovXG5leHBvcnQgZGVmYXVsdCAoIGZ1bmN0aW9uKCBkb2N1bWVudCwgd2luZG93LCAkICkge1xuXHQvKipcblx0ICogV1AgY29yZSBjb21wb25lbnRzLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICovXG5cdGNvbnN0IHsgUGFuZWxCb2R5LCBDb2xvckluZGljYXRvciwgVGV4dENvbnRyb2wsIEJ1dHRvbiB9ID0gd3AuY29tcG9uZW50cztcblx0Y29uc3QgeyBfX2V4cGVyaW1lbnRhbFJhZGlvOiBSYWRpbywgX19leHBlcmltZW50YWxSYWRpb0dyb3VwOiBSYWRpb0dyb3VwIH0gPSB3cC5jb21wb25lbnRzO1xuXG5cdC8qKlxuXHQgKiBMb2NhbGl6ZWQgZGF0YSBhbGlhc2VzLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICovXG5cdGNvbnN0IHsgaXNBZG1pbiwgaXNQcm8sIGlzTGljZW5zZUFjdGl2ZSwgc3RyaW5ncywgcm91dGVfbmFtZXNwYWNlOiByb3V0ZU5hbWVzcGFjZSB9ID0gd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvcjtcblxuXHQvKipcblx0ICogRm9ybSBzZWxlY3RvciBjb21tb24gbW9kdWxlLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdGxldCBmb3JtU2VsZWN0b3JDb21tb24gPSBudWxsO1xuXG5cdC8qKlxuXHQgKiBSdW50aW1lIHN0YXRlLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdGNvbnN0IHN0YXRlID0ge307XG5cblx0LyoqXG5cdCAqIFRoZW1lcyBkYXRhLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdGNvbnN0IHRoZW1lc0RhdGEgPSB7XG5cdFx0d3Bmb3JtczogbnVsbCxcblx0XHRjdXN0b206IG51bGwsXG5cdH07XG5cblx0LyoqXG5cdCAqIEVuYWJsZWQgdGhlbWVzLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdGxldCBlbmFibGVkVGhlbWVzID0gbnVsbDtcblxuXHQvKipcblx0ICogRWxlbWVudHMgaG9sZGVyLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljhcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdGNvbnN0IGVsID0ge307XG5cblx0LyoqXG5cdCAqIFB1YmxpYyBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjguOFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0Y29uc3QgYXBwID0ge1xuXHRcdC8qKlxuXHRcdCAqIEluaXRpYWxpemUgcGFuZWwuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKi9cblx0XHRpbml0KCkge1xuXHRcdFx0ZWwuJHdpbmRvdyA9ICQoIHdpbmRvdyApO1xuXG5cdFx0XHRhcHAuZmV0Y2hUaGVtZXNEYXRhKCk7XG5cblx0XHRcdCQoIGFwcC5yZWFkeSApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBEb2N1bWVudCByZWFkeS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqL1xuXHRcdHJlYWR5KCkge1xuXHRcdFx0YXBwLmV2ZW50cygpO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBFdmVudHMuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKi9cblx0XHRldmVudHMoKSB7XG5cdFx0XHR3cC5kYXRhLnN1YnNjcmliZSggZnVuY3Rpb24oKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29tcGxleGl0eVxuXHRcdFx0XHRpZiAoICEgaXNBZG1pbiApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBpc1NhdmluZ1Bvc3QgPSB3cC5kYXRhLnNlbGVjdCggJ2NvcmUvZWRpdG9yJyApPy5pc1NhdmluZ1Bvc3QoKTtcblx0XHRcdFx0Y29uc3QgaXNBdXRvc2F2aW5nUG9zdCA9IHdwLmRhdGEuc2VsZWN0KCAnY29yZS9lZGl0b3InICk/LmlzQXV0b3NhdmluZ1Bvc3QoKTtcblx0XHRcdFx0Y29uc3QgaXNTYXZpbmdXaWRnZXQgPSB3cC5kYXRhLnNlbGVjdCggJ2NvcmUvZWRpdC13aWRnZXRzJyApPy5pc1NhdmluZ1dpZGdldEFyZWFzKCk7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRQb3N0ID0gd3AuZGF0YS5zZWxlY3QoICdjb3JlL2VkaXRvcicgKT8uZ2V0Q3VycmVudFBvc3QoKTtcblx0XHRcdFx0Y29uc3QgaXNCbG9ja09yVGVtcGxhdGUgPSBjdXJyZW50UG9zdD8udHlwZT8uaW5jbHVkZXMoICd3cF90ZW1wbGF0ZScgKSB8fCBjdXJyZW50UG9zdD8udHlwZT8uaW5jbHVkZXMoICd3cF9ibG9jaycgKTtcblxuXHRcdFx0XHRpZiAoICggISBpc1NhdmluZ1Bvc3QgJiYgISBpc1NhdmluZ1dpZGdldCAmJiAhIGlzQmxvY2tPclRlbXBsYXRlICkgfHwgaXNBdXRvc2F2aW5nUG9zdCApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGlzQmxvY2tPclRlbXBsYXRlICkge1xuXHRcdFx0XHRcdC8vIERlbGF5IHNhdmluZyBpZiB0aGlzIGlzIEZTRSBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlLlxuXHRcdFx0XHRcdF8uZGVib3VuY2UoIGFwcC5zYXZlQ3VzdG9tVGhlbWVzLCA1MDAgKSgpO1xuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YXBwLnNhdmVDdXN0b21UaGVtZXMoKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IGFsbCB0aGVtZXMgZGF0YS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fSBUaGVtZXMgZGF0YS5cblx0XHQgKi9cblx0XHRnZXRBbGxUaGVtZXMoKSB7XG5cdFx0XHRyZXR1cm4geyAuLi4oIHRoZW1lc0RhdGEuY3VzdG9tIHx8IHt9ICksIC4uLiggdGhlbWVzRGF0YS53cGZvcm1zIHx8IHt9ICkgfTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IHRoZW1lIGRhdGEuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBzbHVnIFRoZW1lIHNsdWcuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtPYmplY3R8bnVsbH0gVGhlbWUgc2V0dGluZ3MuXG5cdFx0ICovXG5cdFx0Z2V0VGhlbWUoIHNsdWcgKSB7XG5cdFx0XHRyZXR1cm4gYXBwLmdldEFsbFRoZW1lcygpWyBzbHVnIF0gfHwgbnVsbDtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IGVuYWJsZWQgdGhlbWVzIGRhdGEuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge09iamVjdH0gVGhlbWVzIGRhdGEuXG5cdFx0ICovXG5cdFx0Z2V0RW5hYmxlZFRoZW1lcygpIHtcblx0XHRcdGlmICggZW5hYmxlZFRoZW1lcyApIHtcblx0XHRcdFx0cmV0dXJuIGVuYWJsZWRUaGVtZXM7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGFsbFRoZW1lcyA9IGFwcC5nZXRBbGxUaGVtZXMoKTtcblxuXHRcdFx0aWYgKCBpc1BybyAmJiBpc0xpY2Vuc2VBY3RpdmUgKSB7XG5cdFx0XHRcdHJldHVybiBhbGxUaGVtZXM7XG5cdFx0XHR9XG5cblx0XHRcdGVuYWJsZWRUaGVtZXMgPSBPYmplY3Qua2V5cyggYWxsVGhlbWVzICkucmVkdWNlKCAoIGFjYywga2V5ICkgPT4ge1xuXHRcdFx0XHRpZiAoIGFsbFRoZW1lc1sga2V5IF0uc2V0dGluZ3M/LmZpZWxkU2l6ZSAmJiAhIGFsbFRoZW1lc1sga2V5IF0uZGlzYWJsZWQgKSB7XG5cdFx0XHRcdFx0YWNjWyBrZXkgXSA9IGFsbFRoZW1lc1sga2V5IF07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGFjYztcblx0XHRcdH0sIHt9ICk7XG5cblx0XHRcdHJldHVybiBlbmFibGVkVGhlbWVzO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBVcGRhdGUgZW5hYmxlZCB0aGVtZXMuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBzbHVnICBUaGVtZSBzbHVnLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSB0aGVtZSBUaGVtZSBzZXR0aW5ncy5cblx0XHQgKi9cblx0XHR1cGRhdGVFbmFibGVkVGhlbWVzKCBzbHVnLCB0aGVtZSApIHtcblx0XHRcdGlmICggISBlbmFibGVkVGhlbWVzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGVuYWJsZWRUaGVtZXMgPSB7XG5cdFx0XHRcdC4uLmVuYWJsZWRUaGVtZXMsXG5cdFx0XHRcdFsgc2x1ZyBdOiB0aGVtZSxcblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFdoZXRoZXIgdGhlIHRoZW1lIGlzIGRpc2FibGVkLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gc2x1ZyBUaGVtZSBzbHVnLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdGhlbWUgaXMgZGlzYWJsZWQuXG5cdFx0ICovXG5cdFx0aXNEaXNhYmxlZFRoZW1lKCBzbHVnICkge1xuXHRcdFx0cmV0dXJuICEgYXBwLmdldEVuYWJsZWRUaGVtZXMoKT8uWyBzbHVnIF07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFdoZXRoZXIgdGhlIHRoZW1lIGlzIG9uZSBvZiB0aGUgV1BGb3JtcyB0aGVtZXMuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBzbHVnIFRoZW1lIHNsdWcuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSB0aGVtZSBpcyBvbmUgb2YgdGhlIFdQRm9ybXMgdGhlbWVzLlxuXHRcdCAqL1xuXHRcdGlzV1BGb3Jtc1RoZW1lKCBzbHVnICkge1xuXHRcdFx0cmV0dXJuIEJvb2xlYW4oIHRoZW1lc0RhdGEud3Bmb3Jtc1sgc2x1ZyBdPy5zZXR0aW5ncyApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBGZXRjaCB0aGVtZXMgZGF0YSBmcm9tIEFQSS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqL1xuXHRcdGZldGNoVGhlbWVzRGF0YSgpIHtcblx0XHRcdC8vIElmIGEgZmV0Y2ggaXMgYWxyZWFkeSBpbiBwcm9ncmVzcywgZXhpdCB0aGUgZnVuY3Rpb24uXG5cdFx0XHRpZiAoIHN0YXRlLmlzRmV0Y2hpbmdUaGVtZXMgfHwgdGhlbWVzRGF0YS53cGZvcm1zICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNldCB0aGUgZmxhZyB0byB0cnVlIGluZGljYXRpbmcgYSBmZXRjaCBpcyBpbiBwcm9ncmVzcy5cblx0XHRcdHN0YXRlLmlzRmV0Y2hpbmdUaGVtZXMgPSB0cnVlO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHQvLyBGZXRjaCB0aGVtZXMgZGF0YS5cblx0XHRcdFx0d3AuYXBpRmV0Y2goIHtcblx0XHRcdFx0XHRwYXRoOiByb3V0ZU5hbWVzcGFjZSArICd0aGVtZXMvJyxcblx0XHRcdFx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdFx0XHRcdGNhY2hlOiAnbm8tY2FjaGUnLFxuXHRcdFx0XHR9IClcblx0XHRcdFx0XHQudGhlbiggKCByZXNwb25zZSApID0+IHtcblx0XHRcdFx0XHRcdHRoZW1lc0RhdGEud3Bmb3JtcyA9IHJlc3BvbnNlLndwZm9ybXMgfHwge307XG5cdFx0XHRcdFx0XHR0aGVtZXNEYXRhLmN1c3RvbSA9IHJlc3BvbnNlLmN1c3RvbSB8fCB7fTtcblx0XHRcdFx0XHR9IClcblx0XHRcdFx0XHQuY2F0Y2goICggZXJyb3IgKSA9PiB7XG5cdFx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciggZXJyb3I/Lm1lc3NhZ2UgKTtcblx0XHRcdFx0XHR9IClcblx0XHRcdFx0XHQuZmluYWxseSggKCkgPT4ge1xuXHRcdFx0XHRcdFx0c3RhdGUuaXNGZXRjaGluZ1RoZW1lcyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdH0gY2F0Y2ggKCBlcnJvciApIHtcblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcblx0XHRcdFx0Y29uc29sZS5lcnJvciggZXJyb3IgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogU2F2ZSBjdXN0b20gdGhlbWVzLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICovXG5cdFx0c2F2ZUN1c3RvbVRoZW1lcygpIHtcblx0XHRcdC8vIEN1c3RvbSB0aGVtZXMgZG8gbm90IGV4aXN0LlxuXHRcdFx0aWYgKCBzdGF0ZS5pc1NhdmluZ1RoZW1lcyB8fCAhIHRoZW1lc0RhdGEuY3VzdG9tICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNldCB0aGUgZmxhZyB0byB0cnVlIGluZGljYXRpbmcgYSBzYXZpbmcgaXMgaW4gcHJvZ3Jlc3MuXG5cdFx0XHRzdGF0ZS5pc1NhdmluZ1RoZW1lcyA9IHRydWU7XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdC8vIFNhdmUgdGhlbWVzLlxuXHRcdFx0XHR3cC5hcGlGZXRjaCgge1xuXHRcdFx0XHRcdHBhdGg6IHJvdXRlTmFtZXNwYWNlICsgJ3RoZW1lcy9jdXN0b20vJyxcblx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0XHRkYXRhOiB7IGN1c3RvbVRoZW1lczogdGhlbWVzRGF0YS5jdXN0b20gfSxcblx0XHRcdFx0fSApXG5cdFx0XHRcdFx0LnRoZW4oICggcmVzcG9uc2UgKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoICEgcmVzcG9uc2U/LnJlc3VsdCApIHtcblx0XHRcdFx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coIHJlc3BvbnNlPy5lcnJvciApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKVxuXHRcdFx0XHRcdC5jYXRjaCggKCBlcnJvciApID0+IHtcblx0XHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCBlcnJvcj8ubWVzc2FnZSApO1xuXHRcdFx0XHRcdH0gKVxuXHRcdFx0XHRcdC5maW5hbGx5KCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRzdGF0ZS5pc1NhdmluZ1RoZW1lcyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdH0gY2F0Y2ggKCBlcnJvciApIHtcblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcblx0XHRcdFx0Y29uc29sZS5lcnJvciggZXJyb3IgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IHRoZSBjdXJyZW50IHN0eWxlIGF0dHJpYnV0ZXMgc3RhdGUuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBCbG9jayBwcm9wZXJ0aWVzLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgY3VzdG9tIHRoZW1lIGlzIGNyZWF0ZWQuXG5cdFx0ICovXG5cdFx0Z2V0Q3VycmVudFN0eWxlQXR0cmlidXRlcyggcHJvcHMgKSB7XG5cdFx0XHRjb25zdCBkZWZhdWx0QXR0cmlidXRlcyA9IE9iamVjdC5rZXlzKCB0aGVtZXNEYXRhLndwZm9ybXMuZGVmYXVsdD8uc2V0dGluZ3MgKTtcblx0XHRcdGNvbnN0IGN1cnJlbnRTdHlsZUF0dHJpYnV0ZXMgPSB7fTtcblxuXHRcdFx0Zm9yICggY29uc3Qga2V5IGluIGRlZmF1bHRBdHRyaWJ1dGVzICkge1xuXHRcdFx0XHRjb25zdCBhdHRyID0gZGVmYXVsdEF0dHJpYnV0ZXNbIGtleSBdO1xuXG5cdFx0XHRcdGN1cnJlbnRTdHlsZUF0dHJpYnV0ZXNbIGF0dHIgXSA9IHByb3BzLmF0dHJpYnV0ZXNbIGF0dHIgXSA/PyAnJztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGN1cnJlbnRTdHlsZUF0dHJpYnV0ZXM7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIE1heWJlIGNyZWF0ZSBjdXN0b20gdGhlbWUuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBCbG9jayBwcm9wZXJ0aWVzLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgY3VzdG9tIHRoZW1lIGlzIGNyZWF0ZWQuXG5cdFx0ICovXG5cdFx0bWF5YmVDcmVhdGVDdXN0b21UaGVtZSggcHJvcHMgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29tcGxleGl0eVxuXHRcdFx0Y29uc3QgY3VycmVudFN0eWxlcyA9IGFwcC5nZXRDdXJyZW50U3R5bGVBdHRyaWJ1dGVzKCBwcm9wcyApO1xuXHRcdFx0Y29uc3QgaXNXUEZvcm1zVGhlbWUgPSAhISB0aGVtZXNEYXRhLndwZm9ybXNbIHByb3BzLmF0dHJpYnV0ZXMudGhlbWUgXTtcblx0XHRcdGNvbnN0IGlzQ3VzdG9tVGhlbWUgPSAhISB0aGVtZXNEYXRhLmN1c3RvbVsgcHJvcHMuYXR0cmlidXRlcy50aGVtZSBdO1xuXG5cdFx0XHRsZXQgbWlncmF0ZVRvQ3VzdG9tVGhlbWUgPSBmYWxzZTtcblxuXHRcdFx0Ly8gSXQgaXMgb25lIG9mIHRoZSBkZWZhdWx0IHRoZW1lcyB3aXRob3V0IGFueSBjaGFuZ2VzLlxuXHRcdFx0aWYgKFxuXHRcdFx0XHRpc1dQRm9ybXNUaGVtZSAmJlxuXHRcdFx0XHRKU09OLnN0cmluZ2lmeSggdGhlbWVzRGF0YS53cGZvcm1zWyBwcm9wcy5hdHRyaWJ1dGVzLnRoZW1lIF0/LnNldHRpbmdzICkgPT09IEpTT04uc3RyaW5naWZ5KCBjdXJyZW50U3R5bGVzIClcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHByZXZBdHRyaWJ1dGVzID0gZm9ybVNlbGVjdG9yQ29tbW9uLmdldEJsb2NrUnVudGltZVN0YXRlVmFyKCBwcm9wcy5jbGllbnRJZCwgJ3ByZXZBdHRyaWJ1dGVzU3RhdGUnICk7XG5cblx0XHRcdC8vIEl0IGlzIGEgYmxvY2sgYWRkZWQgaW4gRlMgMS4wLCBzbyBpdCBkb2Vzbid0IGhhdmUgYSB0aGVtZS5cblx0XHRcdC8vIFRoZSBgcHJldkF0dHJpYnV0ZXNgIGlzIGB1bmRlZmluZWRgIG1lYW5zIHRoYXQgd2UgYXJlIGluIHRoZSBmaXJzdCByZW5kZXIgb2YgdGhlIGV4aXN0aW5nIGJsb2NrLlxuXHRcdFx0aWYgKCBwcm9wcy5hdHRyaWJ1dGVzLnRoZW1lID09PSAnZGVmYXVsdCcgJiYgcHJvcHMuYXR0cmlidXRlcy50aGVtZU5hbWUgPT09ICcnICYmICEgcHJldkF0dHJpYnV0ZXMgKSB7XG5cdFx0XHRcdG1pZ3JhdGVUb0N1c3RvbVRoZW1lID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSXQgaXMgYSBtb2RpZmllZCBkZWZhdWx0IHRoZW1lIE9SIHVua25vd24gY3VzdG9tIHRoZW1lLlxuXHRcdFx0aWYgKCBpc1dQRm9ybXNUaGVtZSB8fCAhIGlzQ3VzdG9tVGhlbWUgfHwgbWlncmF0ZVRvQ3VzdG9tVGhlbWUgKSB7XG5cdFx0XHRcdGFwcC5jcmVhdGVDdXN0b21UaGVtZSggcHJvcHMsIGN1cnJlbnRTdHlsZXMsIG1pZ3JhdGVUb0N1c3RvbVRoZW1lICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBDcmVhdGUgY3VzdG9tIHRoZW1lLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gIHByb3BzICAgICAgICAgICAgICAgIEJsb2NrIHByb3BlcnRpZXMuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9ICBjdXJyZW50U3R5bGVzICAgICAgICBDdXJyZW50IHN0eWxlIHNldHRpbmdzLlxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gbWlncmF0ZVRvQ3VzdG9tVGhlbWUgV2hldGhlciBpdCBpcyBuZWVkZWQgdG8gbWlncmF0ZSB0byBjdXN0b20gdGhlbWUuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIHRoZSBjdXN0b20gdGhlbWUgaXMgY3JlYXRlZC5cblx0XHQgKi9cblx0XHRjcmVhdGVDdXN0b21UaGVtZSggcHJvcHMsIGN1cnJlbnRTdHlsZXMgPSBudWxsLCBtaWdyYXRlVG9DdXN0b21UaGVtZSA9IGZhbHNlICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbXBsZXhpdHlcblx0XHRcdGxldCBjb3VudGVyID0gMDtcblx0XHRcdGxldCB0aGVtZVNsdWcgPSBwcm9wcy5hdHRyaWJ1dGVzLnRoZW1lO1xuXG5cdFx0XHRjb25zdCBiYXNlVGhlbWUgPSBhcHAuZ2V0VGhlbWUoIHByb3BzLmF0dHJpYnV0ZXMudGhlbWUgKSB8fCB0aGVtZXNEYXRhLndwZm9ybXMuZGVmYXVsdDtcblx0XHRcdGxldCB0aGVtZU5hbWUgPSBiYXNlVGhlbWUubmFtZTtcblxuXHRcdFx0dGhlbWVzRGF0YS5jdXN0b20gPSB0aGVtZXNEYXRhLmN1c3RvbSB8fCB7fTtcblxuXHRcdFx0aWYgKCBtaWdyYXRlVG9DdXN0b21UaGVtZSApIHtcblx0XHRcdFx0dGhlbWVTbHVnID0gJ2N1c3RvbSc7XG5cdFx0XHRcdHRoZW1lTmFtZSA9IHN0cmluZ3MudGhlbWVfY3VzdG9tO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBEZXRlcm1pbmUgdGhlIHRoZW1lIHNsdWcgYW5kIHRoZSBudW1iZXIgb2YgY29waWVzLlxuXHRcdFx0ZG8ge1xuXHRcdFx0XHRjb3VudGVyKys7XG5cdFx0XHRcdHRoZW1lU2x1ZyA9IHRoZW1lU2x1ZyArICctY29weS0nICsgY291bnRlcjtcblx0XHRcdH0gd2hpbGUgKCB0aGVtZXNEYXRhLmN1c3RvbVsgdGhlbWVTbHVnIF0gJiYgY291bnRlciA8IDEwMDAwICk7XG5cblx0XHRcdGNvbnN0IGNvcHlTdHIgPSBjb3VudGVyIDwgMiA/IHN0cmluZ3MudGhlbWVfY29weSA6IHN0cmluZ3MudGhlbWVfY29weSArICcgJyArIGNvdW50ZXI7XG5cblx0XHRcdHRoZW1lTmFtZSArPSAnICgnICsgY29weVN0ciArICcpJztcblxuXHRcdFx0Ly8gVGhlIGZpcnN0IG1pZ3JhdGVkIEN1c3RvbSBUaGVtZSBzaG91bGQgYmUgd2l0aG91dCBgKENvcHkpYCBzdWZmaXguXG5cdFx0XHR0aGVtZU5hbWUgPSBtaWdyYXRlVG9DdXN0b21UaGVtZSAmJiBjb3VudGVyIDwgMiA/IHN0cmluZ3MudGhlbWVfY3VzdG9tIDogdGhlbWVOYW1lO1xuXG5cdFx0XHQvLyBBZGQgdGhlIG5ldyBjdXN0b20gdGhlbWUuXG5cdFx0XHR0aGVtZXNEYXRhLmN1c3RvbVsgdGhlbWVTbHVnIF0gPSB7XG5cdFx0XHRcdG5hbWU6IHRoZW1lTmFtZSxcblx0XHRcdFx0c2V0dGluZ3M6IGN1cnJlbnRTdHlsZXMgfHwgYXBwLmdldEN1cnJlbnRTdHlsZUF0dHJpYnV0ZXMoIHByb3BzICksXG5cdFx0XHR9O1xuXG5cdFx0XHRhcHAudXBkYXRlRW5hYmxlZFRoZW1lcyggdGhlbWVTbHVnLCB0aGVtZXNEYXRhLmN1c3RvbVsgdGhlbWVTbHVnIF0gKTtcblxuXHRcdFx0Ly8gVXBkYXRlIHRoZSBibG9jayBhdHRyaWJ1dGVzIHdpdGggdGhlIG5ldyBjdXN0b20gdGhlbWUgc2V0dGluZ3MuXG5cdFx0XHRwcm9wcy5zZXRBdHRyaWJ1dGVzKCB7XG5cdFx0XHRcdHRoZW1lOiB0aGVtZVNsdWcsXG5cdFx0XHRcdHRoZW1lTmFtZSxcblx0XHRcdH0gKTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIE1heWJlIGNyZWF0ZSBjdXN0b20gdGhlbWUgYnkgZ2l2ZW4gYXR0cmlidXRlcy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgQmxvY2sgcHJvcGVydGllcy5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ30gTmV3IHRoZW1lJ3Mgc2x1Zy5cblx0XHQgKi9cblx0XHRtYXliZUNyZWF0ZUN1c3RvbVRoZW1lRnJvbUF0dHJpYnV0ZXMoIGF0dHJpYnV0ZXMgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29tcGxleGl0eVxuXHRcdFx0Y29uc3QgbmV3VGhlbWVTbHVnID0gYXR0cmlidXRlcy50aGVtZTtcblx0XHRcdGNvbnN0IGV4aXN0aW5nVGhlbWUgPSBhcHAuZ2V0VGhlbWUoIGF0dHJpYnV0ZXMudGhlbWUgKTtcblx0XHRcdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyggYXR0cmlidXRlcyApO1xuXG5cdFx0XHRsZXQgaXNFeGlzdGluZ1RoZW1lID0gQm9vbGVhbiggZXhpc3RpbmdUaGVtZT8uc2V0dGluZ3MgKTtcblxuXHRcdFx0Ly8gQ2hlY2sgaWYgdGhlIHRoZW1lIGFscmVhZHkgZXhpc3RzIGFuZCBoYXMgdGhlIHNhbWUgc2V0dGluZ3MuXG5cdFx0XHRpZiAoIGlzRXhpc3RpbmdUaGVtZSApIHtcblx0XHRcdFx0Zm9yICggY29uc3QgaSBpbiBrZXlzICkge1xuXHRcdFx0XHRcdGNvbnN0IGtleSA9IGtleXNbIGkgXTtcblxuXHRcdFx0XHRcdGlmICggISBleGlzdGluZ1RoZW1lLnNldHRpbmdzWyBrZXkgXSB8fCBleGlzdGluZ1RoZW1lLnNldHRpbmdzWyBrZXkgXSAhPT0gYXR0cmlidXRlc1sga2V5IF0gKSB7XG5cdFx0XHRcdFx0XHRpc0V4aXN0aW5nVGhlbWUgPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRoZSB0aGVtZSBleGlzdHMgYW5kIGhhcyB0aGUgc2FtZSBzZXR0aW5ncy5cblx0XHRcdGlmICggaXNFeGlzdGluZ1RoZW1lICkge1xuXHRcdFx0XHRyZXR1cm4gbmV3VGhlbWVTbHVnO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUaGUgdGhlbWUgZG9lc24ndCBleGlzdC5cblx0XHRcdC8vIE5vcm1hbGl6ZSB0aGUgYXR0cmlidXRlcyB0byB0aGUgZGVmYXVsdCB0aGVtZSBzZXR0aW5ncy5cblx0XHRcdGNvbnN0IGRlZmF1bHRBdHRyaWJ1dGVzID0gT2JqZWN0LmtleXMoIHRoZW1lc0RhdGEud3Bmb3Jtcy5kZWZhdWx0LnNldHRpbmdzICk7XG5cdFx0XHRjb25zdCBuZXdTZXR0aW5ncyA9IHt9O1xuXG5cdFx0XHRmb3IgKCBjb25zdCBpIGluIGRlZmF1bHRBdHRyaWJ1dGVzICkge1xuXHRcdFx0XHRjb25zdCBhdHRyID0gZGVmYXVsdEF0dHJpYnV0ZXNbIGkgXTtcblxuXHRcdFx0XHRuZXdTZXR0aW5nc1sgYXR0ciBdID0gYXR0cmlidXRlc1sgYXR0ciBdID8/ICcnO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDcmVhdGUgYSBuZXcgY3VzdG9tIHRoZW1lLlxuXHRcdFx0dGhlbWVzRGF0YS5jdXN0b21bIG5ld1RoZW1lU2x1ZyBdID0ge1xuXHRcdFx0XHRuYW1lOiBhdHRyaWJ1dGVzLnRoZW1lTmFtZSA/PyBzdHJpbmdzLnRoZW1lX2N1c3RvbSxcblx0XHRcdFx0c2V0dGluZ3M6IG5ld1NldHRpbmdzLFxuXHRcdFx0fTtcblxuXHRcdFx0YXBwLnVwZGF0ZUVuYWJsZWRUaGVtZXMoIG5ld1RoZW1lU2x1ZywgdGhlbWVzRGF0YS5jdXN0b21bIG5ld1RoZW1lU2x1ZyBdICk7XG5cblx0XHRcdHJldHVybiBuZXdUaGVtZVNsdWc7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFVwZGF0ZSBjdXN0b20gdGhlbWUuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGUgQXR0cmlidXRlIG5hbWUuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAgICBOZXcgYXR0cmlidXRlIHZhbHVlLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyAgICAgQmxvY2sgcHJvcGVydGllcy5cblx0XHQgKi9cblx0XHR1cGRhdGVDdXN0b21UaGVtZUF0dHJpYnV0ZSggYXR0cmlidXRlLCB2YWx1ZSwgcHJvcHMgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29tcGxleGl0eVxuXHRcdFx0Y29uc3QgdGhlbWVTbHVnID0gcHJvcHMuYXR0cmlidXRlcy50aGVtZTtcblxuXHRcdFx0Ly8gU2tpcCBpZiBpdCBpcyBvbmUgb2YgdGhlIFdQRm9ybXMgdGhlbWVzIE9SIHRoZSBhdHRyaWJ1dGUgaXMgbm90IGluIHRoZSB0aGVtZSBzZXR0aW5ncy5cblx0XHRcdGlmIChcblx0XHRcdFx0dGhlbWVzRGF0YS53cGZvcm1zWyB0aGVtZVNsdWcgXSB8fFxuXHRcdFx0XHQoXG5cdFx0XHRcdFx0YXR0cmlidXRlICE9PSAndGhlbWVOYW1lJyAmJlxuXHRcdFx0XHRcdCEgdGhlbWVzRGF0YS53cGZvcm1zLmRlZmF1bHQuc2V0dGluZ3NbIGF0dHJpYnV0ZSBdXG5cdFx0XHRcdClcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNraXAgaWYgdGhlIGN1c3RvbSB0aGVtZSBkb2Vzbid0IGV4aXN0LlxuXHRcdFx0Ly8gSXQgc2hvdWxkIG5ldmVyIGhhcHBlbiwgb25seSBpbiBzb21lIHVuaXF1ZSBjaXJjdW1zdGFuY2VzLlxuXHRcdFx0aWYgKCAhIHRoZW1lc0RhdGEuY3VzdG9tWyB0aGVtZVNsdWcgXSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBVcGRhdGUgdGhlbWUgZGF0YS5cblx0XHRcdGlmICggYXR0cmlidXRlID09PSAndGhlbWVOYW1lJyApIHtcblx0XHRcdFx0dGhlbWVzRGF0YS5jdXN0b21bIHRoZW1lU2x1ZyBdLm5hbWUgPSB2YWx1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoZW1lc0RhdGEuY3VzdG9tWyB0aGVtZVNsdWcgXS5zZXR0aW5ncyA9IHRoZW1lc0RhdGEuY3VzdG9tWyB0aGVtZVNsdWcgXS5zZXR0aW5ncyB8fCB0aGVtZXNEYXRhLndwZm9ybXMuZGVmYXVsdC5zZXR0aW5ncztcblx0XHRcdFx0dGhlbWVzRGF0YS5jdXN0b21bIHRoZW1lU2x1ZyBdLnNldHRpbmdzWyBhdHRyaWJ1dGUgXSA9IHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUcmlnZ2VyIGV2ZW50IGZvciBkZXZlbG9wZXJzLlxuXHRcdFx0ZWwuJHdpbmRvdy50cmlnZ2VyKCAnd3Bmb3Jtc0Zvcm1TZWxlY3RvclVwZGF0ZVRoZW1lJywgWyB0aGVtZVNsdWcsIHRoZW1lc0RhdGEuY3VzdG9tWyB0aGVtZVNsdWcgXSwgcHJvcHMgXSApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgVGhlbWVzIHBhbmVsIEpTWCBjb2RlLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgICAgICAgICAgICAgICAgICAgIEJsb2NrIHByb3BlcnRpZXMuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGZvcm1TZWxlY3RvckNvbW1vbk1vZHVsZSBDb21tb24gbW9kdWxlLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBzdG9ja1Bob3Rvc01vZHVsZSAgICAgICAgU3RvY2tQaG90b3MgbW9kdWxlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fSBUaGVtZXMgcGFuZWwgSlNYIGNvZGUuXG5cdFx0ICovXG5cdFx0Z2V0VGhlbWVzUGFuZWwoIHByb3BzLCBmb3JtU2VsZWN0b3JDb21tb25Nb2R1bGUsIHN0b2NrUGhvdG9zTW9kdWxlICkge1xuXHRcdFx0Ly8gU3RvcmUgY29tbW9uIG1vZHVsZSBpbiBhcHAuXG5cdFx0XHRmb3JtU2VsZWN0b3JDb21tb24gPSBmb3JtU2VsZWN0b3JDb21tb25Nb2R1bGU7XG5cdFx0XHRzdGF0ZS5zdG9ja1Bob3RvcyA9IHN0b2NrUGhvdG9zTW9kdWxlO1xuXG5cdFx0XHQvLyBJZiB0aGVyZSBhcmUgbm8gdGhlbWVzIGRhdGEsIGl0IGlzIG5lY2Vzc2FyeSB0byBmZXRjaCBpdCBmaXJzdGx5LlxuXHRcdFx0aWYgKCAhIHRoZW1lc0RhdGEud3Bmb3JtcyApIHtcblx0XHRcdFx0YXBwLmZldGNoVGhlbWVzRGF0YSgpO1xuXG5cdFx0XHRcdC8vIFJldHVybiBlbXB0eSBKU1ggY29kZS5cblx0XHRcdFx0cmV0dXJuICggPD48Lz4gKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gR2V0IGV2ZW50IGhhbmRsZXJzLlxuXHRcdFx0Y29uc3QgaGFuZGxlcnMgPSBhcHAuZ2V0RXZlbnRIYW5kbGVycyggcHJvcHMgKTtcblx0XHRcdGNvbnN0IHNob3dDdXN0b21UaGVtZU9wdGlvbnMgPSBpc0FkbWluICYmIGZvcm1TZWxlY3RvckNvbW1vbk1vZHVsZS5pc0Z1bGxTdHlsaW5nRW5hYmxlZCgpICYmIGFwcC5tYXliZUNyZWF0ZUN1c3RvbVRoZW1lKCBwcm9wcyApO1xuXHRcdFx0Y29uc3QgY2hlY2tlZCA9IGZvcm1TZWxlY3RvckNvbW1vbk1vZHVsZS5pc0Z1bGxTdHlsaW5nRW5hYmxlZCgpID8gcHJvcHMuYXR0cmlidXRlcy50aGVtZSA6ICdjbGFzc2ljJztcblx0XHRcdGNvbnN0IGlzTGVhZEZvcm1zRW5hYmxlZCA9IGZvcm1TZWxlY3RvckNvbW1vbk1vZHVsZS5pc0xlYWRGb3Jtc0VuYWJsZWQoIGZvcm1TZWxlY3RvckNvbW1vbk1vZHVsZS5nZXRCbG9ja0NvbnRhaW5lciggcHJvcHMgKSApO1xuXHRcdFx0Y29uc3QgZGlzcGxheUxlYWRGb3JtTm90aWNlID0gaXNMZWFkRm9ybXNFbmFibGVkID8gJ2Jsb2NrJyA6ICdub25lJztcblx0XHRcdGNvbnN0IG1vZGVybk5vdGljZVN0eWxlcyA9IGRpc3BsYXlMZWFkRm9ybU5vdGljZSA9PT0gJ2Jsb2NrJyA/IHsgZGlzcGxheTogJ25vbmUnIH0gOiB7fTtcblxuXHRcdFx0bGV0IGNsYXNzZXMgPSBmb3JtU2VsZWN0b3JDb21tb24uZ2V0UGFuZWxDbGFzcyggcHJvcHMsICd0aGVtZXMnICk7XG5cblx0XHRcdGNsYXNzZXMgKz0gaXNMZWFkRm9ybXNFbmFibGVkID8gJyB3cGZvcm1zLWxlYWQtZm9ybXMtZW5hYmxlZCcgOiAnJztcblx0XHRcdGNsYXNzZXMgKz0gYXBwLmlzTWFjKCkgPyAnIHdwZm9ybXMtaXMtbWFjJyA6ICcnO1xuXG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8UGFuZWxCb2R5IGNsYXNzTmFtZT17IGNsYXNzZXMgfSB0aXRsZT17IHN0cmluZ3MudGhlbWVzIH0+XG5cdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctcGFuZWwtbm90aWNlIHdwZm9ybXMtd2FybmluZyB3cGZvcm1zLXVzZS1tb2Rlcm4tbm90aWNlXCIgc3R5bGU9eyBtb2Rlcm5Ob3RpY2VTdHlsZXMgfT5cblx0XHRcdFx0XHRcdDxzdHJvbmc+eyBzdHJpbmdzLnVzZV9tb2Rlcm5fbm90aWNlX2hlYWQgfTwvc3Ryb25nPlxuXHRcdFx0XHRcdFx0eyBzdHJpbmdzLnVzZV9tb2Rlcm5fbm90aWNlX3RleHQgfSA8YSBocmVmPXsgc3RyaW5ncy51c2VfbW9kZXJuX25vdGljZV9saW5rIH0gcmVsPVwibm9yZWZlcnJlclwiIHRhcmdldD1cIl9ibGFua1wiPnsgc3RyaW5ncy5sZWFybl9tb3JlIH08L2E+XG5cdFx0XHRcdFx0PC9wPlxuXG5cdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctcGFuZWwtbm90aWNlIHdwZm9ybXMtd2FybmluZyB3cGZvcm1zLWxlYWQtZm9ybS1ub3RpY2VcIiBzdHlsZT17IHsgZGlzcGxheTogZGlzcGxheUxlYWRGb3JtTm90aWNlIH0gfT5cblx0XHRcdFx0XHRcdDxzdHJvbmc+eyBzdHJpbmdzLmxlYWRfZm9ybXNfcGFuZWxfbm90aWNlX2hlYWQgfTwvc3Ryb25nPlxuXHRcdFx0XHRcdFx0eyBzdHJpbmdzLmxlYWRfZm9ybXNfcGFuZWxfbm90aWNlX3RleHQgfVxuXHRcdFx0XHRcdDwvcD5cblxuXHRcdFx0XHRcdDxSYWRpb0dyb3VwXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLXRoZW1lcy1yYWRpby1ncm91cFwiXG5cdFx0XHRcdFx0XHRsYWJlbD17IHN0cmluZ3MudGhlbWVzIH1cblx0XHRcdFx0XHRcdGNoZWNrZWQ9eyBjaGVja2VkIH1cblx0XHRcdFx0XHRcdGRlZmF1bHRDaGVja2VkPXsgcHJvcHMuYXR0cmlidXRlcy50aGVtZSB9XG5cdFx0XHRcdFx0XHRvbkNoYW5nZT17ICggdmFsdWUgKSA9PiBoYW5kbGVycy5zZWxlY3RUaGVtZSggdmFsdWUgKSB9XG5cdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0eyBhcHAuZ2V0VGhlbWVzSXRlbXNKU1goIHByb3BzICkgfVxuXHRcdFx0XHRcdDwvUmFkaW9Hcm91cD5cblx0XHRcdFx0XHR7IHNob3dDdXN0b21UaGVtZU9wdGlvbnMgJiYgKFxuXHRcdFx0XHRcdFx0PD5cblx0XHRcdFx0XHRcdFx0PFRleHRDb250cm9sXG5cdFx0XHRcdFx0XHRcdFx0Y2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci10aGVtZXMtdGhlbWUtbmFtZVwiXG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw9eyBzdHJpbmdzLnRoZW1lX25hbWUgfVxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlPXsgcHJvcHMuYXR0cmlidXRlcy50aGVtZU5hbWUgfVxuXHRcdFx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsgKCB2YWx1ZSApID0+IGhhbmRsZXJzLmNoYW5nZVRoZW1lTmFtZSggdmFsdWUgKSB9XG5cdFx0XHRcdFx0XHRcdC8+XG5cblx0XHRcdFx0XHRcdFx0PEJ1dHRvbiBpc1NlY29uZGFyeVxuXHRcdFx0XHRcdFx0XHRcdGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItdGhlbWVzLWRlbGV0ZVwiXG5cdFx0XHRcdFx0XHRcdFx0b25DbGljaz17IGhhbmRsZXJzLmRlbGV0ZVRoZW1lIH1cblx0XHRcdFx0XHRcdFx0XHRidXR0b25TZXR0aW5ncz1cIlwiXG5cdFx0XHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdFx0XHR7IHN0cmluZ3MudGhlbWVfZGVsZXRlIH1cblx0XHRcdFx0XHRcdFx0PC9CdXR0b24+XG5cdFx0XHRcdFx0XHQ8Lz5cblx0XHRcdFx0XHQpIH1cblx0XHRcdFx0PC9QYW5lbEJvZHk+XG5cdFx0XHQpO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgdGhlIFRoZW1lcyBwYW5lbCBpdGVtcyBKU1ggY29kZS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHByb3BzIEJsb2NrIHByb3BlcnRpZXMuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtBcnJheX0gVGhlbWVzIGl0ZW1zIEpTWCBjb2RlLlxuXHRcdCAqL1xuXHRcdGdldFRoZW1lc0l0ZW1zSlNYKCBwcm9wcyApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb21wbGV4aXR5XG5cdFx0XHRjb25zdCBhbGxUaGVtZXNEYXRhID0gYXBwLmdldEFsbFRoZW1lcygpO1xuXG5cdFx0XHRpZiAoICEgYWxsVGhlbWVzRGF0YSApIHtcblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBpdGVtc0pzeCA9IFtdO1xuXHRcdFx0Y29uc3QgdGhlbWVzID0gT2JqZWN0LmtleXMoIGFsbFRoZW1lc0RhdGEgKTtcblx0XHRcdGxldCB0aGVtZSwgZmlyc3RUaGVtZVNsdWc7XG5cblx0XHRcdC8vIERpc3BsYXkgdGhlIGN1cnJlbnQgY3VzdG9tIHRoZW1lIG9uIHRoZSB0b3Agb2YgdGhlIGxpc3QuXG5cdFx0XHRpZiAoICEgYXBwLmlzV1BGb3Jtc1RoZW1lKCBwcm9wcy5hdHRyaWJ1dGVzLnRoZW1lICkgKSB7XG5cdFx0XHRcdGZpcnN0VGhlbWVTbHVnID0gcHJvcHMuYXR0cmlidXRlcy50aGVtZTtcblxuXHRcdFx0XHRpdGVtc0pzeC5wdXNoKFxuXHRcdFx0XHRcdGFwcC5nZXRUaGVtZXNJdGVtSlNYKFxuXHRcdFx0XHRcdFx0cHJvcHMuYXR0cmlidXRlcy50aGVtZSxcblx0XHRcdFx0XHRcdGFwcC5nZXRUaGVtZSggcHJvcHMuYXR0cmlidXRlcy50aGVtZSApXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKCBjb25zdCBrZXkgaW4gdGhlbWVzICkge1xuXHRcdFx0XHRjb25zdCBzbHVnID0gdGhlbWVzWyBrZXkgXTtcblxuXHRcdFx0XHQvLyBTa2lwIHRoZSBmaXJzdCB0aGVtZS5cblx0XHRcdFx0aWYgKCBmaXJzdFRoZW1lU2x1ZyAmJiBmaXJzdFRoZW1lU2x1ZyA9PT0gc2x1ZyApIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVuc3VyZSB0aGF0IGFsbCB0aGUgdGhlbWUgc2V0dGluZ3MgYXJlIHByZXNlbnQuXG5cdFx0XHRcdHRoZW1lID0geyAuLi5hbGxUaGVtZXNEYXRhLmRlZmF1bHQsIC4uLiggYWxsVGhlbWVzRGF0YVsgc2x1ZyBdIHx8IHt9ICkgfTtcblx0XHRcdFx0dGhlbWUuc2V0dGluZ3MgPSB7IC4uLmFsbFRoZW1lc0RhdGEuZGVmYXVsdC5zZXR0aW5ncywgLi4uKCB0aGVtZS5zZXR0aW5ncyB8fCB7fSApIH07XG5cblx0XHRcdFx0aXRlbXNKc3gucHVzaCggYXBwLmdldFRoZW1lc0l0ZW1KU1goIHNsdWcsIHRoZW1lICkgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGl0ZW1zSnN4O1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgdGhlIFRoZW1lcyBwYW5lbCdzIHNpbmdsZSBpdGVtIEpTWCBjb2RlLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gc2x1ZyAgVGhlbWUgc2x1Zy5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gdGhlbWUgVGhlbWUgZGF0YS5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge09iamVjdHxudWxsfSBUaGVtZXMgcGFuZWwgc2luZ2xlIGl0ZW0gSlNYIGNvZGUuXG5cdFx0ICovXG5cdFx0Z2V0VGhlbWVzSXRlbUpTWCggc2x1ZywgdGhlbWUgKSB7XG5cdFx0XHRpZiAoICEgdGhlbWUgKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0aXRsZSA9IHRoZW1lLm5hbWU/Lmxlbmd0aCA+IDAgPyB0aGVtZS5uYW1lIDogc3RyaW5ncy50aGVtZV9ub25hbWU7XG5cblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxSYWRpb1xuXHRcdFx0XHRcdHZhbHVlPXsgc2x1ZyB9XG5cdFx0XHRcdFx0dGl0bGU9eyB0aXRsZSB9XG5cdFx0XHRcdD5cblx0XHRcdFx0XHQ8ZGl2XG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9eyBhcHAuaXNEaXNhYmxlZFRoZW1lKCBzbHVnICkgPyAnd3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci10aGVtZXMtcmFkaW8tZGlzYWJsZWQnIDogJycgfVxuXHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci10aGVtZXMtcmFkaW8tdGl0bGVcIj57IHRpdGxlIH08L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8Q29sb3JJbmRpY2F0b3IgY29sb3JWYWx1ZT17IHRoZW1lLnNldHRpbmdzLmJ1dHRvbkJhY2tncm91bmRDb2xvciB9IHRpdGxlPXsgc3RyaW5ncy5idXR0b25fYmFja2dyb3VuZCB9IC8+XG5cdFx0XHRcdFx0PENvbG9ySW5kaWNhdG9yIGNvbG9yVmFsdWU9eyB0aGVtZS5zZXR0aW5ncy5idXR0b25UZXh0Q29sb3IgfSB0aXRsZT17IHN0cmluZ3MuYnV0dG9uX3RleHQgfSAvPlxuXHRcdFx0XHRcdDxDb2xvckluZGljYXRvciBjb2xvclZhbHVlPXsgdGhlbWUuc2V0dGluZ3MubGFiZWxDb2xvciB9IHRpdGxlPXsgc3RyaW5ncy5maWVsZF9sYWJlbCB9IC8+XG5cdFx0XHRcdFx0PENvbG9ySW5kaWNhdG9yIGNvbG9yVmFsdWU9eyB0aGVtZS5zZXR0aW5ncy5sYWJlbFN1YmxhYmVsQ29sb3IgfSB0aXRsZT17IHN0cmluZ3MuZmllbGRfc3VibGFiZWwgfSAvPlxuXHRcdFx0XHRcdDxDb2xvckluZGljYXRvciBjb2xvclZhbHVlPXsgdGhlbWUuc2V0dGluZ3MuZmllbGRCb3JkZXJDb2xvciB9IHRpdGxlPXsgc3RyaW5ncy5maWVsZF9ib3JkZXIgfSAvPlxuXHRcdFx0XHQ8L1JhZGlvPlxuXHRcdFx0KTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogU2V0IGJsb2NrIHRoZW1lLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgICAgIEJsb2NrIHByb3BlcnRpZXMuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lU2x1ZyBUaGUgdGhlbWUgc2x1Zy5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgb24gc3VjY2Vzcy5cblx0XHQgKi9cblx0XHRzZXRCbG9ja1RoZW1lKCBwcm9wcywgdGhlbWVTbHVnICkge1xuXHRcdFx0aWYgKCBhcHAubWF5YmVEaXNwbGF5VXBncmFkZU1vZGFsKCB0aGVtZVNsdWcgKSApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0aGVtZSA9IGFwcC5nZXRUaGVtZSggdGhlbWVTbHVnICk7XG5cblx0XHRcdGlmICggISB0aGVtZT8uc2V0dGluZ3MgKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5rZXlzKCB0aGVtZS5zZXR0aW5ncyApO1xuXHRcdFx0Y29uc3QgYmxvY2sgPSBmb3JtU2VsZWN0b3JDb21tb24uZ2V0QmxvY2tDb250YWluZXIoIHByb3BzICk7XG5cdFx0XHRjb25zdCBjb250YWluZXIgPSBibG9jay5xdWVyeVNlbGVjdG9yKCBgI3dwZm9ybXMtJHsgcHJvcHMuYXR0cmlidXRlcy5mb3JtSWQgfWAgKTtcblxuXHRcdFx0Ly8gT3ZlcndyaXRlIGJsb2NrIGF0dHJpYnV0ZXMgd2l0aCB0aGUgbmV3IHRoZW1lIHNldHRpbmdzLlxuXHRcdFx0Ly8gSXQgaXMgbmVlZGVkIHRvIHJlbHkgb24gdGhlIHRoZW1lIHNldHRpbmdzIG9ubHkuXG5cdFx0XHRjb25zdCBuZXdQcm9wcyA9IHsgLi4ucHJvcHMsIGF0dHJpYnV0ZXM6IHsgLi4ucHJvcHMuYXR0cmlidXRlcywgLi4udGhlbWUuc2V0dGluZ3MgfSB9O1xuXG5cdFx0XHQvLyBVcGRhdGUgdGhlIHByZXZpZXcgd2l0aCB0aGUgbmV3IHRoZW1lIHNldHRpbmdzLlxuXHRcdFx0Zm9yICggY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMgKSB7XG5cdFx0XHRcdGNvbnN0IGF0dHIgPSBhdHRyaWJ1dGVzWyBrZXkgXTtcblxuXHRcdFx0XHR0aGVtZS5zZXR0aW5nc1sgYXR0ciBdID0gdGhlbWUuc2V0dGluZ3NbIGF0dHIgXSA9PT0gJzAnID8gJzBweCcgOiB0aGVtZS5zZXR0aW5nc1sgYXR0ciBdO1xuXG5cdFx0XHRcdGZvcm1TZWxlY3RvckNvbW1vbi51cGRhdGVQcmV2aWV3Q1NTVmFyVmFsdWUoXG5cdFx0XHRcdFx0YXR0cixcblx0XHRcdFx0XHR0aGVtZS5zZXR0aW5nc1sgYXR0ciBdLFxuXHRcdFx0XHRcdGNvbnRhaW5lcixcblx0XHRcdFx0XHRuZXdQcm9wc1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBQcmVwYXJlIHRoZSBuZXcgYXR0cmlidXRlcyB0byBiZSBzZXQuXG5cdFx0XHRjb25zdCBzZXRBdHRyaWJ1dGVzID0ge1xuXHRcdFx0XHR0aGVtZTogdGhlbWVTbHVnLFxuXHRcdFx0XHR0aGVtZU5hbWU6IHRoZW1lLm5hbWUsXG5cdFx0XHRcdC4uLnRoZW1lLnNldHRpbmdzLFxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCBwcm9wcy5zZXRBdHRyaWJ1dGVzICkge1xuXHRcdFx0XHQvLyBVcGRhdGUgdGhlIGJsb2NrIGF0dHJpYnV0ZXMgd2l0aCB0aGUgbmV3IHRoZW1lIHNldHRpbmdzLlxuXHRcdFx0XHRwcm9wcy5zZXRBdHRyaWJ1dGVzKCBzZXRBdHRyaWJ1dGVzICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRyaWdnZXIgZXZlbnQgZm9yIGRldmVsb3BlcnMuXG5cdFx0XHRlbC4kd2luZG93LnRyaWdnZXIoICd3cGZvcm1zRm9ybVNlbGVjdG9yU2V0VGhlbWUnLCBbIGJsb2NrLCB0aGVtZVNsdWcsIHByb3BzIF0gKTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIE1heWJlIGRpc3BsYXkgdXBncmFkZXMgbW9kYWwgaW4gTGl0ZS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lU2x1ZyBUaGUgdGhlbWUgc2x1Zy5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgbW9kYWwgd2FzIGRpc3BsYXllZC5cblx0XHQgKi9cblx0XHRtYXliZURpc3BsYXlVcGdyYWRlTW9kYWwoIHRoZW1lU2x1ZyApIHtcblx0XHRcdGlmICggISBhcHAuaXNEaXNhYmxlZFRoZW1lKCB0aGVtZVNsdWcgKSApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgaXNQcm8gKSB7XG5cdFx0XHRcdGZvcm1TZWxlY3RvckNvbW1vbi5lZHVjYXRpb24uc2hvd1Byb01vZGFsKCAndGhlbWVzJywgc3RyaW5ncy50aGVtZXMgKTtcblxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIGlzTGljZW5zZUFjdGl2ZSApIHtcblx0XHRcdFx0Zm9ybVNlbGVjdG9yQ29tbW9uLmVkdWNhdGlvbi5zaG93TGljZW5zZU1vZGFsKCAndGhlbWVzJywgc3RyaW5ncy50aGVtZXMsICdzZWxlY3QtdGhlbWUnICk7XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IHRoZW1lcyBwYW5lbCBldmVudCBoYW5kbGVycy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHByb3BzIEJsb2NrIHByb3BlcnRpZXMuXG5cdFx0ICpcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdGdldEV2ZW50SGFuZGxlcnMoIHByb3BzICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1saW5lcy1wZXItZnVuY3Rpb25cblx0XHRcdGNvbnN0IGNvbW1vbkhhbmRsZXJzID0gZm9ybVNlbGVjdG9yQ29tbW9uLmdldFNldHRpbmdzRmllbGRzSGFuZGxlcnMoIHByb3BzICk7XG5cblx0XHRcdGNvbnN0IGhhbmRsZXJzID0ge1xuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogU2VsZWN0IHRoZW1lIGV2ZW50IGhhbmRsZXIuXG5cdFx0XHRcdCAqXG5cdFx0XHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdFx0XHQgKlxuXHRcdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgTmV3IGF0dHJpYnV0ZSB2YWx1ZS5cblx0XHRcdFx0ICovXG5cdFx0XHRcdHNlbGVjdFRoZW1lKCB2YWx1ZSApIHtcblx0XHRcdFx0XHRpZiAoICEgYXBwLnNldEJsb2NrVGhlbWUoIHByb3BzLCB2YWx1ZSApICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIE1heWJlIG9wZW4gU3RvY2sgUGhvdG8gaW5zdGFsbGF0aW9uIHdpbmRvdy5cblx0XHRcdFx0XHRzdGF0ZT8uc3RvY2tQaG90b3M/Lm9uU2VsZWN0VGhlbWUoIHZhbHVlLCBwcm9wcywgYXBwLCBjb21tb25IYW5kbGVycyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgYmxvY2sgPSBmb3JtU2VsZWN0b3JDb21tb24uZ2V0QmxvY2tDb250YWluZXIoIHByb3BzICk7XG5cblx0XHRcdFx0XHRmb3JtU2VsZWN0b3JDb21tb24uc2V0VHJpZ2dlclNlcnZlclJlbmRlciggZmFsc2UgKTtcblx0XHRcdFx0XHRjb21tb25IYW5kbGVycy51cGRhdGVDb3B5UGFzdGVDb250ZW50KCk7XG5cblx0XHRcdFx0XHQvLyBUcmlnZ2VyIGV2ZW50IGZvciBkZXZlbG9wZXJzLlxuXHRcdFx0XHRcdGVsLiR3aW5kb3cudHJpZ2dlciggJ3dwZm9ybXNGb3JtU2VsZWN0b3JTZWxlY3RUaGVtZScsIFsgYmxvY2ssIHByb3BzLCB2YWx1ZSBdICk7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIENoYW5nZSB0aGVtZSBuYW1lIGV2ZW50IGhhbmRsZXIuXG5cdFx0XHRcdCAqXG5cdFx0XHRcdCAqIEBzaW5jZSAxLjguOFxuXHRcdFx0XHQgKlxuXHRcdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgTmV3IGF0dHJpYnV0ZSB2YWx1ZS5cblx0XHRcdFx0ICovXG5cdFx0XHRcdGNoYW5nZVRoZW1lTmFtZSggdmFsdWUgKSB7XG5cdFx0XHRcdFx0Zm9ybVNlbGVjdG9yQ29tbW9uLnNldFRyaWdnZXJTZXJ2ZXJSZW5kZXIoIGZhbHNlICk7XG5cdFx0XHRcdFx0cHJvcHMuc2V0QXR0cmlidXRlcyggeyB0aGVtZU5hbWU6IHZhbHVlIH0gKTtcblxuXHRcdFx0XHRcdGFwcC51cGRhdGVDdXN0b21UaGVtZUF0dHJpYnV0ZSggJ3RoZW1lTmFtZScsIHZhbHVlLCBwcm9wcyApO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBEZWxldGUgdGhlbWUgZXZlbnQgaGFuZGxlci5cblx0XHRcdFx0ICpcblx0XHRcdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRkZWxldGVUaGVtZSgpIHtcblx0XHRcdFx0XHRjb25zdCBkZWxldGVUaGVtZVNsdWcgPSBwcm9wcy5hdHRyaWJ1dGVzLnRoZW1lO1xuXG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIHRoZW1lIGZyb20gdGhlIHRoZW1lIHN0b3JhZ2UuXG5cdFx0XHRcdFx0ZGVsZXRlIHRoZW1lc0RhdGEuY3VzdG9tWyBkZWxldGVUaGVtZVNsdWcgXTtcblxuXHRcdFx0XHRcdC8vIE9wZW4gdGhlIGNvbmZpcm1hdGlvbiBtb2RhbCB3aW5kb3cuXG5cdFx0XHRcdFx0YXBwLmRlbGV0ZVRoZW1lTW9kYWwoIHByb3BzLCBkZWxldGVUaGVtZVNsdWcsIGhhbmRsZXJzICk7XG5cdFx0XHRcdH0sXG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gaGFuZGxlcnM7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIE9wZW4gdGhlIHRoZW1lIGRlbGV0ZSBjb25maXJtYXRpb24gbW9kYWwgd2luZG93LlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgICAgICAgICAgIEJsb2NrIHByb3BlcnRpZXMuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGRlbGV0ZVRoZW1lU2x1ZyBUaGVtZSBzbHVnLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVycyAgICAgICAgQmxvY2sgZXZlbnQgaGFuZGxlcnMuXG5cdFx0ICovXG5cdFx0ZGVsZXRlVGhlbWVNb2RhbCggcHJvcHMsIGRlbGV0ZVRoZW1lU2x1ZywgaGFuZGxlcnMgKSB7XG5cdFx0XHRjb25zdCBjb25maXJtID0gc3RyaW5ncy50aGVtZV9kZWxldGVfY29uZmlybS5yZXBsYWNlKCAnJTEkcycsIGA8Yj4keyBwcm9wcy5hdHRyaWJ1dGVzLnRoZW1lTmFtZSB9PC9iPmAgKTtcblx0XHRcdGNvbnN0IGNvbnRlbnQgPSBgPHAgY2xhc3M9XCJ3cGZvcm1zLXRoZW1lLWRlbGV0ZS10ZXh0XCI+JHsgY29uZmlybSB9ICR7IHN0cmluZ3MudGhlbWVfZGVsZXRlX2NhbnRfdW5kb25lIH08L3A+YDtcblxuXHRcdFx0JC5jb25maXJtKCB7XG5cdFx0XHRcdHRpdGxlOiBzdHJpbmdzLnRoZW1lX2RlbGV0ZV90aXRsZSxcblx0XHRcdFx0Y29udGVudCxcblx0XHRcdFx0aWNvbjogJ3dwZm9ybXMtZXhjbGFtYXRpb24tY2lyY2xlJyxcblx0XHRcdFx0dHlwZTogJ3JlZCcsXG5cdFx0XHRcdGJ1dHRvbnM6IHtcblx0XHRcdFx0XHRjb25maXJtOiB7XG5cdFx0XHRcdFx0XHR0ZXh0OiBzdHJpbmdzLnRoZW1lX2RlbGV0ZV95ZXMsXG5cdFx0XHRcdFx0XHRidG5DbGFzczogJ2J0bi1jb25maXJtJyxcblx0XHRcdFx0XHRcdGtleXM6IFsgJ2VudGVyJyBdLFxuXHRcdFx0XHRcdFx0YWN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHQvLyBTd2l0Y2ggdG8gdGhlIGRlZmF1bHQgdGhlbWUuXG5cdFx0XHRcdFx0XHRcdGhhbmRsZXJzLnNlbGVjdFRoZW1lKCAnZGVmYXVsdCcgKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBUcmlnZ2VyIGV2ZW50IGZvciBkZXZlbG9wZXJzLlxuXHRcdFx0XHRcdFx0XHRlbC4kd2luZG93LnRyaWdnZXIoICd3cGZvcm1zRm9ybVNlbGVjdG9yRGVsZXRlVGhlbWUnLCBbIGRlbGV0ZVRoZW1lU2x1ZywgcHJvcHMgXSApO1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNhbmNlbDoge1xuXHRcdFx0XHRcdFx0dGV4dDogc3RyaW5ncy5jYW5jZWwsXG5cdFx0XHRcdFx0XHRrZXlzOiBbICdlc2MnIF0sXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSxcblx0XHRcdH0gKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIGlmIHRoZSB1c2VyIGlzIG9uIGEgTWFjLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdXNlciBpcyBvbiBhIE1hYy5cblx0XHQgKi9cblx0XHRpc01hYygpIHtcblx0XHRcdHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzKCAnTWFjaW50b3NoJyApO1xuXHRcdH0sXG5cdH07XG5cblx0YXBwLmluaXQoKTtcblxuXHQvLyBQcm92aWRlIGFjY2VzcyB0byBwdWJsaWMgZnVuY3Rpb25zL3Byb3BlcnRpZXMuXG5cdHJldHVybiBhcHA7XG59KCBkb2N1bWVudCwgd2luZG93LCBqUXVlcnkgKSApO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkEsSUFBQUEsUUFBQSxHQUFBQyxPQUFBLENBQUFDLE9BQUEsR0FPaUIsVUFBVUMsUUFBUSxFQUFFQyxNQUFNLEVBQUVDLENBQUMsRUFBRztFQUNoRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0VBQ0MsSUFBQUMsY0FBQSxHQUEyREMsRUFBRSxDQUFDQyxVQUFVO0lBQWhFQyxTQUFTLEdBQUFILGNBQUEsQ0FBVEcsU0FBUztJQUFFQyxjQUFjLEdBQUFKLGNBQUEsQ0FBZEksY0FBYztJQUFFQyxXQUFXLEdBQUFMLGNBQUEsQ0FBWEssV0FBVztJQUFFQyxNQUFNLEdBQUFOLGNBQUEsQ0FBTk0sTUFBTTtFQUN0RCxJQUFBQyxlQUFBLEdBQTZFTixFQUFFLENBQUNDLFVBQVU7SUFBN0RNLEtBQUssR0FBQUQsZUFBQSxDQUExQkUsbUJBQW1CO0lBQW1DQyxVQUFVLEdBQUFILGVBQUEsQ0FBcENJLHdCQUF3Qjs7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
},{}]},{},[12])