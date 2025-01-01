(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/* global wpforms_settings */

(function () {
  /**
   * Predefine hint text to display.
   *
   * @since 1.5.6
   * @since 1.6.4 Added a new macros - {remaining}.
   *
   * @param {string} hintText Hint text.
   * @param {number} count    Current count.
   * @param {number} limit    Limit to.
   *
   * @return {string} Predefined hint text.
   */
  function renderHint(hintText, count, limit) {
    return hintText.replace('{count}', count).replace('{limit}', limit).replace('{remaining}', limit - count);
  }

  /**
   * Create HTMLElement hint element with text.
   *
   * @since 1.5.6
   *
   * @param {number|string} formId  Form id.
   * @param {number|string} fieldId Form field id.
   * @param {string}        text    Hint text.
   *
   * @return {Object} HTMLElement hint element with text.
   */
  function createHint(formId, fieldId, text) {
    var hint = document.createElement('div');
    formId = _typeof(formId) === 'object' ? '' : formId;
    fieldId = _typeof(fieldId) === 'object' ? '' : fieldId;
    hint.classList.add('wpforms-field-limit-text');
    hint.id = 'wpforms-field-limit-text-' + formId + '-' + fieldId;
    hint.setAttribute('aria-live', 'polite');
    hint.textContent = text;
    return hint;
  }

  /**
   * Keyup/Keydown event higher order function for characters limit.
   *
   * @since 1.5.6
   *
   * @param {Object} hint  HTMLElement hint element.
   * @param {number} limit Max allowed number of characters.
   *
   * @return {Function} Handler function.
   */
  function checkCharacters(hint, limit) {
    // noinspection JSUnusedLocalSymbols
    return function (e) {
      // eslint-disable-line no-unused-vars
      hint.textContent = renderHint(window.wpforms_settings.val_limit_characters, this.value.length, limit);
    };
  }

  /**
   * Count words in the string.
   *
   * @since 1.6.2
   *
   * @param {string} string String value.
   *
   * @return {number} Words count.
   */
  function countWords(string) {
    if (typeof string !== 'string') {
      return 0;
    }
    if (!string.length) {
      return 0;
    }
    [/([A-Z]+),([A-Z]+)/gi, /([0-9]+),([A-Z]+)/gi, /([A-Z]+),([0-9]+)/gi].forEach(function (pattern) {
      string = string.replace(pattern, '$1, $2');
    });
    return string.split(/\s+/).length;
  }

  /**
   * Keyup/Keydown event higher order function for words limit.
   *
   * @since 1.5.6
   *
   * @param {Object} hint  HTMLElement hint element.
   * @param {number} limit Max allowed number of characters.
   *
   * @return {Function} Handler function.
   */
  function checkWords(hint, limit) {
    return function (e) {
      var value = this.value.trim(),
        words = countWords(value);
      hint.textContent = renderHint(window.wpforms_settings.val_limit_words, words, limit);

      // We should prevent the keys: Enter, Space, Comma.
      if ([13, 32, 188].indexOf(e.keyCode) > -1 && words >= limit) {
        e.preventDefault();
      }
    };
  }

  /**
   * Get passed text from the clipboard.
   *
   * @since 1.5.6
   *
   * @param {ClipboardEvent} e Clipboard event.
   *
   * @return {string} Text from clipboard.
   */
  function getPastedText(e) {
    if (window.clipboardData && window.clipboardData.getData) {
      // IE
      return window.clipboardData.getData('Text');
    } else if (e.clipboardData && e.clipboardData.getData) {
      return e.clipboardData.getData('text/plain');
    }
    return '';
  }

  /**
   * Paste event higher order function for character limit.
   *
   * @since 1.6.7.1
   *
   * @param {number} limit Max allowed number of characters.
   *
   * @return {Function} Event handler.
   */
  function pasteText(limit) {
    return function (e) {
      e.preventDefault();
      var pastedText = getPastedText(e),
        newPosition = this.selectionStart + pastedText.length,
        newText = this.value.substring(0, this.selectionStart) + pastedText + this.value.substring(this.selectionStart);
      this.value = newText.substring(0, limit);
      this.setSelectionRange(newPosition, newPosition);
    };
  }

  /**
   * Limit string length to a certain number of words, preserving line breaks.
   *
   * @since 1.6.8
   *
   * @param {string} text  Text.
   * @param {number} limit Max allowed number of words.
   *
   * @return {string} Text with the limited number of words.
   */
  function limitWords(text, limit) {
    var result = '';

    // Regular expression pattern: match any space character.
    var regEx = /\s+/g;

    // Store separators for further join.
    var separators = text.trim().match(regEx) || [];

    // Split the new text by regular expression.
    var newTextArray = text.split(regEx);

    // Limit the number of words.
    newTextArray.splice(limit, newTextArray.length);

    // Join the words together using stored separators.
    for (var i = 0; i < newTextArray.length; i++) {
      result += newTextArray[i] + (separators[i] || '');
    }
    return result.trim();
  }

  /**
   * Paste event higher order function for words limit.
   *
   * @since 1.5.6
   *
   * @param {number} limit Max allowed number of words.
   *
   * @return {Function} Event handler.
   */
  function pasteWords(limit) {
    return function (e) {
      e.preventDefault();
      var pastedText = getPastedText(e),
        newPosition = this.selectionStart + pastedText.length,
        newText = this.value.substring(0, this.selectionStart) + pastedText + this.value.substring(this.selectionStart);
      this.value = limitWords(newText, limit);
      this.setSelectionRange(newPosition, newPosition);
    };
  }

  /**
   * Array.from polyfill.
   *
   * @since 1.5.6
   *
   * @param {Object} el Iterator.
   *
   * @return {Object} Array.
   */
  function arrFrom(el) {
    return [].slice.call(el);
  }

  /**
   * Public functions and properties.
   *
   * @since 1.8.9
   *
   * @type {Object}
   */
  var app = {
    /**
     * Init text limit hint.
     *
     * @since 1.8.9
     *
     * @param {string} context Context selector.
     */
    initHint: function initHint(context) {
      arrFrom(document.querySelectorAll(context + ' .wpforms-limit-characters-enabled')).map(function (e) {
        // eslint-disable-line array-callback-return
        var limit = parseInt(e.dataset.textLimit, 10) || 0;
        e.value = e.value.slice(0, limit);
        var hint = createHint(e.dataset.formId, e.dataset.fieldId, renderHint(wpforms_settings.val_limit_characters, e.value.length, limit));
        var fn = checkCharacters(hint, limit);
        e.parentNode.appendChild(hint);
        e.addEventListener('keydown', fn);
        e.addEventListener('keyup', fn);
        e.addEventListener('paste', pasteText(limit));
      });
      arrFrom(document.querySelectorAll(context + ' .wpforms-limit-words-enabled')).map(function (e) {
        // eslint-disable-line array-callback-return
        var limit = parseInt(e.dataset.textLimit, 10) || 0;
        e.value = limitWords(e.value, limit);
        var hint = createHint(e.dataset.formId, e.dataset.fieldId, renderHint(wpforms_settings.val_limit_words, countWords(e.value.trim()), limit));
        var fn = checkWords(hint, limit);
        e.parentNode.appendChild(hint);
        e.addEventListener('keydown', fn);
        e.addEventListener('keyup', fn);
        e.addEventListener('paste', pasteWords(limit));
      });
    }
  };

  /**
   * DOMContentLoaded handler.
   *
   * @since 1.5.6
   */
  function ready() {
    // Expose to the world.
    window.WPFormsTextLimit = app;
    app.initHint('body');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJyZW5kZXJIaW50IiwiaGludFRleHQiLCJjb3VudCIsImxpbWl0IiwicmVwbGFjZSIsImNyZWF0ZUhpbnQiLCJmb3JtSWQiLCJmaWVsZElkIiwidGV4dCIsImhpbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJfdHlwZW9mIiwiY2xhc3NMaXN0IiwiYWRkIiwiaWQiLCJzZXRBdHRyaWJ1dGUiLCJ0ZXh0Q29udGVudCIsImNoZWNrQ2hhcmFjdGVycyIsImUiLCJ3aW5kb3ciLCJ3cGZvcm1zX3NldHRpbmdzIiwidmFsX2xpbWl0X2NoYXJhY3RlcnMiLCJ2YWx1ZSIsImxlbmd0aCIsImNvdW50V29yZHMiLCJzdHJpbmciLCJmb3JFYWNoIiwicGF0dGVybiIsInNwbGl0IiwiY2hlY2tXb3JkcyIsInRyaW0iLCJ3b3JkcyIsInZhbF9saW1pdF93b3JkcyIsImluZGV4T2YiLCJrZXlDb2RlIiwicHJldmVudERlZmF1bHQiLCJnZXRQYXN0ZWRUZXh0IiwiY2xpcGJvYXJkRGF0YSIsImdldERhdGEiLCJwYXN0ZVRleHQiLCJwYXN0ZWRUZXh0IiwibmV3UG9zaXRpb24iLCJzZWxlY3Rpb25TdGFydCIsIm5ld1RleHQiLCJzdWJzdHJpbmciLCJzZXRTZWxlY3Rpb25SYW5nZSIsImxpbWl0V29yZHMiLCJyZXN1bHQiLCJyZWdFeCIsInNlcGFyYXRvcnMiLCJtYXRjaCIsIm5ld1RleHRBcnJheSIsInNwbGljZSIsImkiLCJwYXN0ZVdvcmRzIiwiYXJyRnJvbSIsImVsIiwic2xpY2UiLCJjYWxsIiwiYXBwIiwiaW5pdEhpbnQiLCJjb250ZXh0IiwicXVlcnlTZWxlY3RvckFsbCIsIm1hcCIsInBhcnNlSW50IiwiZGF0YXNldCIsInRleHRMaW1pdCIsImZuIiwicGFyZW50Tm9kZSIsImFwcGVuZENoaWxkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlYWR5IiwiV1BGb3Jtc1RleHRMaW1pdCIsInJlYWR5U3RhdGUiXSwic291cmNlcyI6WyJmYWtlXzIwNzkzNjhhLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCB3cGZvcm1zX3NldHRpbmdzICovXG5cbiggZnVuY3Rpb24oKSB7XG5cdC8qKlxuXHQgKiBQcmVkZWZpbmUgaGludCB0ZXh0IHRvIGRpc3BsYXkuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjUuNlxuXHQgKiBAc2luY2UgMS42LjQgQWRkZWQgYSBuZXcgbWFjcm9zIC0ge3JlbWFpbmluZ30uXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBoaW50VGV4dCBIaW50IHRleHQuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCAgICBDdXJyZW50IGNvdW50LlxuXHQgKiBAcGFyYW0ge251bWJlcn0gbGltaXQgICAgTGltaXQgdG8uXG5cdCAqXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gUHJlZGVmaW5lZCBoaW50IHRleHQuXG5cdCAqL1xuXHRmdW5jdGlvbiByZW5kZXJIaW50KCBoaW50VGV4dCwgY291bnQsIGxpbWl0ICkge1xuXHRcdHJldHVybiBoaW50VGV4dC5yZXBsYWNlKCAne2NvdW50fScsIGNvdW50ICkucmVwbGFjZSggJ3tsaW1pdH0nLCBsaW1pdCApLnJlcGxhY2UoICd7cmVtYWluaW5nfScsIGxpbWl0IC0gY291bnQgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgSFRNTEVsZW1lbnQgaGludCBlbGVtZW50IHdpdGggdGV4dC5cblx0ICpcblx0ICogQHNpbmNlIDEuNS42XG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ30gZm9ybUlkICBGb3JtIGlkLlxuXHQgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd9IGZpZWxkSWQgRm9ybSBmaWVsZCBpZC5cblx0ICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICB0ZXh0ICAgIEhpbnQgdGV4dC5cblx0ICpcblx0ICogQHJldHVybiB7T2JqZWN0fSBIVE1MRWxlbWVudCBoaW50IGVsZW1lbnQgd2l0aCB0ZXh0LlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlSGludCggZm9ybUlkLCBmaWVsZElkLCB0ZXh0ICkge1xuXHRcdGNvbnN0IGhpbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXG5cdFx0Zm9ybUlkID0gdHlwZW9mIGZvcm1JZCA9PT0gJ29iamVjdCcgPyAnJyA6IGZvcm1JZDtcblx0XHRmaWVsZElkID0gdHlwZW9mIGZpZWxkSWQgPT09ICdvYmplY3QnID8gJycgOiBmaWVsZElkO1xuXG5cdFx0aGludC5jbGFzc0xpc3QuYWRkKCAnd3Bmb3Jtcy1maWVsZC1saW1pdC10ZXh0JyApO1xuXHRcdGhpbnQuaWQgPSAnd3Bmb3Jtcy1maWVsZC1saW1pdC10ZXh0LScgKyBmb3JtSWQgKyAnLScgKyBmaWVsZElkO1xuXHRcdGhpbnQuc2V0QXR0cmlidXRlKCAnYXJpYS1saXZlJywgJ3BvbGl0ZScgKTtcblx0XHRoaW50LnRleHRDb250ZW50ID0gdGV4dDtcblxuXHRcdHJldHVybiBoaW50O1xuXHR9XG5cblx0LyoqXG5cdCAqIEtleXVwL0tleWRvd24gZXZlbnQgaGlnaGVyIG9yZGVyIGZ1bmN0aW9uIGZvciBjaGFyYWN0ZXJzIGxpbWl0LlxuXHQgKlxuXHQgKiBAc2luY2UgMS41LjZcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGhpbnQgIEhUTUxFbGVtZW50IGhpbnQgZWxlbWVudC5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGxpbWl0IE1heCBhbGxvd2VkIG51bWJlciBvZiBjaGFyYWN0ZXJzLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtGdW5jdGlvbn0gSGFuZGxlciBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrQ2hhcmFjdGVycyggaGludCwgbGltaXQgKSB7XG5cdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW51c2VkTG9jYWxTeW1ib2xzXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBlICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG5cdFx0XHRoaW50LnRleHRDb250ZW50ID0gcmVuZGVySGludChcblx0XHRcdFx0d2luZG93LndwZm9ybXNfc2V0dGluZ3MudmFsX2xpbWl0X2NoYXJhY3RlcnMsXG5cdFx0XHRcdHRoaXMudmFsdWUubGVuZ3RoLFxuXHRcdFx0XHRsaW1pdFxuXHRcdFx0KTtcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIENvdW50IHdvcmRzIGluIHRoZSBzdHJpbmcuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjYuMlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFN0cmluZyB2YWx1ZS5cblx0ICpcblx0ICogQHJldHVybiB7bnVtYmVyfSBXb3JkcyBjb3VudC5cblx0ICovXG5cdGZ1bmN0aW9uIGNvdW50V29yZHMoIHN0cmluZyApIHtcblx0XHRpZiAoIHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnICkge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0aWYgKCAhIHN0cmluZy5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cblx0XHRbXG5cdFx0XHQvKFtBLVpdKyksKFtBLVpdKykvZ2ksXG5cdFx0XHQvKFswLTldKyksKFtBLVpdKykvZ2ksXG5cdFx0XHQvKFtBLVpdKyksKFswLTldKykvZ2ksXG5cdFx0XS5mb3JFYWNoKCBmdW5jdGlvbiggcGF0dGVybiApIHtcblx0XHRcdHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKCBwYXR0ZXJuLCAnJDEsICQyJyApO1xuXHRcdH0gKTtcblxuXHRcdHJldHVybiBzdHJpbmcuc3BsaXQoIC9cXHMrLyApLmxlbmd0aDtcblx0fVxuXG5cdC8qKlxuXHQgKiBLZXl1cC9LZXlkb3duIGV2ZW50IGhpZ2hlciBvcmRlciBmdW5jdGlvbiBmb3Igd29yZHMgbGltaXQuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjUuNlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gaGludCAgSFRNTEVsZW1lbnQgaGludCBlbGVtZW50LlxuXHQgKiBAcGFyYW0ge251bWJlcn0gbGltaXQgTWF4IGFsbG93ZWQgbnVtYmVyIG9mIGNoYXJhY3RlcnMuXG5cdCAqXG5cdCAqIEByZXR1cm4ge0Z1bmN0aW9ufSBIYW5kbGVyIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tXb3JkcyggaGludCwgbGltaXQgKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlLnRyaW0oKSxcblx0XHRcdFx0d29yZHMgPSBjb3VudFdvcmRzKCB2YWx1ZSApO1xuXG5cdFx0XHRoaW50LnRleHRDb250ZW50ID0gcmVuZGVySGludChcblx0XHRcdFx0d2luZG93LndwZm9ybXNfc2V0dGluZ3MudmFsX2xpbWl0X3dvcmRzLFxuXHRcdFx0XHR3b3Jkcyxcblx0XHRcdFx0bGltaXRcblx0XHRcdCk7XG5cblx0XHRcdC8vIFdlIHNob3VsZCBwcmV2ZW50IHRoZSBrZXlzOiBFbnRlciwgU3BhY2UsIENvbW1hLlxuXHRcdFx0aWYgKCBbIDEzLCAzMiwgMTg4IF0uaW5kZXhPZiggZS5rZXlDb2RlICkgPiAtMSAmJiB3b3JkcyA+PSBsaW1pdCApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHBhc3NlZCB0ZXh0IGZyb20gdGhlIGNsaXBib2FyZC5cblx0ICpcblx0ICogQHNpbmNlIDEuNS42XG5cdCAqXG5cdCAqIEBwYXJhbSB7Q2xpcGJvYXJkRXZlbnR9IGUgQ2xpcGJvYXJkIGV2ZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9IFRleHQgZnJvbSBjbGlwYm9hcmQuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRQYXN0ZWRUZXh0KCBlICkge1xuXHRcdGlmICggd2luZG93LmNsaXBib2FyZERhdGEgJiYgd2luZG93LmNsaXBib2FyZERhdGEuZ2V0RGF0YSApIHsgLy8gSUVcblx0XHRcdHJldHVybiB3aW5kb3cuY2xpcGJvYXJkRGF0YS5nZXREYXRhKCAnVGV4dCcgKTtcblx0XHR9IGVsc2UgaWYgKCBlLmNsaXBib2FyZERhdGEgJiYgZS5jbGlwYm9hcmREYXRhLmdldERhdGEgKSB7XG5cdFx0XHRyZXR1cm4gZS5jbGlwYm9hcmREYXRhLmdldERhdGEoICd0ZXh0L3BsYWluJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiAnJztcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXN0ZSBldmVudCBoaWdoZXIgb3JkZXIgZnVuY3Rpb24gZm9yIGNoYXJhY3RlciBsaW1pdC5cblx0ICpcblx0ICogQHNpbmNlIDEuNi43LjFcblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IGxpbWl0IE1heCBhbGxvd2VkIG51bWJlciBvZiBjaGFyYWN0ZXJzLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtGdW5jdGlvbn0gRXZlbnQgaGFuZGxlci5cblx0ICovXG5cdGZ1bmN0aW9uIHBhc3RlVGV4dCggbGltaXQgKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCBwYXN0ZWRUZXh0ID0gZ2V0UGFzdGVkVGV4dCggZSApLFxuXHRcdFx0XHRuZXdQb3NpdGlvbiA9IHRoaXMuc2VsZWN0aW9uU3RhcnQgKyBwYXN0ZWRUZXh0Lmxlbmd0aCxcblx0XHRcdFx0bmV3VGV4dCA9IHRoaXMudmFsdWUuc3Vic3RyaW5nKCAwLCB0aGlzLnNlbGVjdGlvblN0YXJ0ICkgKyBwYXN0ZWRUZXh0ICsgdGhpcy52YWx1ZS5zdWJzdHJpbmcoIHRoaXMuc2VsZWN0aW9uU3RhcnQgKTtcblxuXHRcdFx0dGhpcy52YWx1ZSA9IG5ld1RleHQuc3Vic3RyaW5nKCAwLCBsaW1pdCApO1xuXHRcdFx0dGhpcy5zZXRTZWxlY3Rpb25SYW5nZSggbmV3UG9zaXRpb24sIG5ld1Bvc2l0aW9uICk7XG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBMaW1pdCBzdHJpbmcgbGVuZ3RoIHRvIGEgY2VydGFpbiBudW1iZXIgb2Ygd29yZHMsIHByZXNlcnZpbmcgbGluZSBicmVha3MuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjYuOFxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAgVGV4dC5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGxpbWl0IE1heCBhbGxvd2VkIG51bWJlciBvZiB3b3Jkcy5cblx0ICpcblx0ICogQHJldHVybiB7c3RyaW5nfSBUZXh0IHdpdGggdGhlIGxpbWl0ZWQgbnVtYmVyIG9mIHdvcmRzLlxuXHQgKi9cblx0ZnVuY3Rpb24gbGltaXRXb3JkcyggdGV4dCwgbGltaXQgKSB7XG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXG5cdFx0Ly8gUmVndWxhciBleHByZXNzaW9uIHBhdHRlcm46IG1hdGNoIGFueSBzcGFjZSBjaGFyYWN0ZXIuXG5cdFx0Y29uc3QgcmVnRXggPSAvXFxzKy9nO1xuXG5cdFx0Ly8gU3RvcmUgc2VwYXJhdG9ycyBmb3IgZnVydGhlciBqb2luLlxuXHRcdGNvbnN0IHNlcGFyYXRvcnMgPSB0ZXh0LnRyaW0oKS5tYXRjaCggcmVnRXggKSB8fCBbXTtcblxuXHRcdC8vIFNwbGl0IHRoZSBuZXcgdGV4dCBieSByZWd1bGFyIGV4cHJlc3Npb24uXG5cdFx0Y29uc3QgbmV3VGV4dEFycmF5ID0gdGV4dC5zcGxpdCggcmVnRXggKTtcblxuXHRcdC8vIExpbWl0IHRoZSBudW1iZXIgb2Ygd29yZHMuXG5cdFx0bmV3VGV4dEFycmF5LnNwbGljZSggbGltaXQsIG5ld1RleHRBcnJheS5sZW5ndGggKTtcblxuXHRcdC8vIEpvaW4gdGhlIHdvcmRzIHRvZ2V0aGVyIHVzaW5nIHN0b3JlZCBzZXBhcmF0b3JzLlxuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IG5ld1RleHRBcnJheS5sZW5ndGg7IGkrKyApIHtcblx0XHRcdHJlc3VsdCArPSBuZXdUZXh0QXJyYXlbIGkgXSArICggc2VwYXJhdG9yc1sgaSBdIHx8ICcnICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdC50cmltKCk7XG5cdH1cblxuXHQvKipcblx0ICogUGFzdGUgZXZlbnQgaGlnaGVyIG9yZGVyIGZ1bmN0aW9uIGZvciB3b3JkcyBsaW1pdC5cblx0ICpcblx0ICogQHNpbmNlIDEuNS42XG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdCBNYXggYWxsb3dlZCBudW1iZXIgb2Ygd29yZHMuXG5cdCAqXG5cdCAqIEByZXR1cm4ge0Z1bmN0aW9ufSBFdmVudCBoYW5kbGVyLlxuXHQgKi9cblx0ZnVuY3Rpb24gcGFzdGVXb3JkcyggbGltaXQgKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCBwYXN0ZWRUZXh0ID0gZ2V0UGFzdGVkVGV4dCggZSApLFxuXHRcdFx0XHRuZXdQb3NpdGlvbiA9IHRoaXMuc2VsZWN0aW9uU3RhcnQgKyBwYXN0ZWRUZXh0Lmxlbmd0aCxcblx0XHRcdFx0bmV3VGV4dCA9IHRoaXMudmFsdWUuc3Vic3RyaW5nKCAwLCB0aGlzLnNlbGVjdGlvblN0YXJ0ICkgKyBwYXN0ZWRUZXh0ICsgdGhpcy52YWx1ZS5zdWJzdHJpbmcoIHRoaXMuc2VsZWN0aW9uU3RhcnQgKTtcblxuXHRcdFx0dGhpcy52YWx1ZSA9IGxpbWl0V29yZHMoIG5ld1RleHQsIGxpbWl0ICk7XG5cdFx0XHR0aGlzLnNldFNlbGVjdGlvblJhbmdlKCBuZXdQb3NpdGlvbiwgbmV3UG9zaXRpb24gKTtcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEFycmF5LmZyb20gcG9seWZpbGwuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjUuNlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gZWwgSXRlcmF0b3IuXG5cdCAqXG5cdCAqIEByZXR1cm4ge09iamVjdH0gQXJyYXkuXG5cdCAqL1xuXHRmdW5jdGlvbiBhcnJGcm9tKCBlbCApIHtcblx0XHRyZXR1cm4gW10uc2xpY2UuY2FsbCggZWwgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQdWJsaWMgZnVuY3Rpb25zIGFuZCBwcm9wZXJ0aWVzLlxuXHQgKlxuXHQgKiBAc2luY2UgMS44Ljlcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdGNvbnN0IGFwcCA9IHtcblx0XHQvKipcblx0XHQgKiBJbml0IHRleHQgbGltaXQgaGludC5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguOVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGNvbnRleHQgQ29udGV4dCBzZWxlY3Rvci5cblx0XHQgKi9cblx0XHRpbml0SGludCggY29udGV4dCApIHtcblx0XHRcdGFyckZyb20oIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIGNvbnRleHQgKyAnIC53cGZvcm1zLWxpbWl0LWNoYXJhY3RlcnMtZW5hYmxlZCcgKSApXG5cdFx0XHRcdC5tYXAoXG5cdFx0XHRcdFx0ZnVuY3Rpb24oIGUgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgYXJyYXktY2FsbGJhY2stcmV0dXJuXG5cdFx0XHRcdFx0XHRjb25zdCBsaW1pdCA9IHBhcnNlSW50KCBlLmRhdGFzZXQudGV4dExpbWl0LCAxMCApIHx8IDA7XG5cblx0XHRcdFx0XHRcdGUudmFsdWUgPSBlLnZhbHVlLnNsaWNlKCAwLCBsaW1pdCApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBoaW50ID0gY3JlYXRlSGludChcblx0XHRcdFx0XHRcdFx0ZS5kYXRhc2V0LmZvcm1JZCxcblx0XHRcdFx0XHRcdFx0ZS5kYXRhc2V0LmZpZWxkSWQsXG5cdFx0XHRcdFx0XHRcdHJlbmRlckhpbnQoXG5cdFx0XHRcdFx0XHRcdFx0d3Bmb3Jtc19zZXR0aW5ncy52YWxfbGltaXRfY2hhcmFjdGVycyxcblx0XHRcdFx0XHRcdFx0XHRlLnZhbHVlLmxlbmd0aCxcblx0XHRcdFx0XHRcdFx0XHRsaW1pdFxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBmbiA9IGNoZWNrQ2hhcmFjdGVycyggaGludCwgbGltaXQgKTtcblxuXHRcdFx0XHRcdFx0ZS5wYXJlbnROb2RlLmFwcGVuZENoaWxkKCBoaW50ICk7XG5cdFx0XHRcdFx0XHRlLmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywgZm4gKTtcblx0XHRcdFx0XHRcdGUuYWRkRXZlbnRMaXN0ZW5lciggJ2tleXVwJywgZm4gKTtcblx0XHRcdFx0XHRcdGUuYWRkRXZlbnRMaXN0ZW5lciggJ3Bhc3RlJywgcGFzdGVUZXh0KCBsaW1pdCApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXG5cdFx0XHRhcnJGcm9tKCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBjb250ZXh0ICsgJyAud3Bmb3Jtcy1saW1pdC13b3Jkcy1lbmFibGVkJyApIClcblx0XHRcdFx0Lm1hcChcblx0XHRcdFx0XHRmdW5jdGlvbiggZSApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBhcnJheS1jYWxsYmFjay1yZXR1cm5cblx0XHRcdFx0XHRcdGNvbnN0IGxpbWl0ID0gcGFyc2VJbnQoIGUuZGF0YXNldC50ZXh0TGltaXQsIDEwICkgfHwgMDtcblxuXHRcdFx0XHRcdFx0ZS52YWx1ZSA9IGxpbWl0V29yZHMoIGUudmFsdWUsIGxpbWl0ICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IGhpbnQgPSBjcmVhdGVIaW50KFxuXHRcdFx0XHRcdFx0XHRlLmRhdGFzZXQuZm9ybUlkLFxuXHRcdFx0XHRcdFx0XHRlLmRhdGFzZXQuZmllbGRJZCxcblx0XHRcdFx0XHRcdFx0cmVuZGVySGludChcblx0XHRcdFx0XHRcdFx0XHR3cGZvcm1zX3NldHRpbmdzLnZhbF9saW1pdF93b3Jkcyxcblx0XHRcdFx0XHRcdFx0XHRjb3VudFdvcmRzKCBlLnZhbHVlLnRyaW0oKSApLFxuXHRcdFx0XHRcdFx0XHRcdGxpbWl0XG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IGZuID0gY2hlY2tXb3JkcyggaGludCwgbGltaXQgKTtcblxuXHRcdFx0XHRcdFx0ZS5wYXJlbnROb2RlLmFwcGVuZENoaWxkKCBoaW50ICk7XG5cblx0XHRcdFx0XHRcdGUuYWRkRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBmbiApO1xuXHRcdFx0XHRcdFx0ZS5hZGRFdmVudExpc3RlbmVyKCAna2V5dXAnLCBmbiApO1xuXHRcdFx0XHRcdFx0ZS5hZGRFdmVudExpc3RlbmVyKCAncGFzdGUnLCBwYXN0ZVdvcmRzKCBsaW1pdCApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdH0sXG5cdH07XG5cblx0LyoqXG5cdCAqIERPTUNvbnRlbnRMb2FkZWQgaGFuZGxlci5cblx0ICpcblx0ICogQHNpbmNlIDEuNS42XG5cdCAqL1xuXHRmdW5jdGlvbiByZWFkeSgpIHtcblx0XHQvLyBFeHBvc2UgdG8gdGhlIHdvcmxkLlxuXHRcdHdpbmRvdy5XUEZvcm1zVGV4dExpbWl0ID0gYXBwO1xuXG5cdFx0YXBwLmluaXRIaW50KCAnYm9keScgKTtcblx0fVxuXG5cdGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRpbmcnICkge1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgcmVhZHkgKTtcblx0fSBlbHNlIHtcblx0XHRyZWFkeSgpO1xuXHR9XG59KCkgKTtcbiJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0FBRUUsYUFBVztFQUNaO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNDLFNBQVNBLFVBQVVBLENBQUVDLFFBQVEsRUFBRUMsS0FBSyxFQUFFQyxLQUFLLEVBQUc7SUFDN0MsT0FBT0YsUUFBUSxDQUFDRyxPQUFPLENBQUUsU0FBUyxFQUFFRixLQUFNLENBQUMsQ0FBQ0UsT0FBTyxDQUFFLFNBQVMsRUFBRUQsS0FBTSxDQUFDLENBQUNDLE9BQU8sQ0FBRSxhQUFhLEVBQUVELEtBQUssR0FBR0QsS0FBTSxDQUFDO0VBQ2hIOztFQUVBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDQyxTQUFTRyxVQUFVQSxDQUFFQyxNQUFNLEVBQUVDLE9BQU8s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
},{}]},{},[1])