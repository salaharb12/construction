(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/* global wpforms_edit_post_education */

// noinspection ES6ConvertVarToLetConst
/**
 * WPForms Edit Post Education function.
 *
 * @since 1.8.1
 */

// eslint-disable-next-line no-var, no-unused-vars
var WPFormsEditPostEducation = window.WPFormsEditPostEducation || function (document, window, $) {
  /**
   * Public functions and properties.
   *
   * @since 1.8.1
   *
   * @type {Object}
   */
  var app = {
    /**
     * Determine if the notice was shown before.
     *
     * @since 1.8.1
     */
    isNoticeVisible: false,
    /**
     * Start the engine.
     *
     * @since 1.8.1
     */
    init: function init() {
      $(window).on('load', function () {
        // In the case of jQuery 3.+, we need to wait for a ready event first.
        if (typeof $.ready.then === 'function') {
          $.ready.then(app.load);
        } else {
          app.load();
        }
      });
    },
    /**
     * Page load.
     *
     * @since 1.8.1
     */
    load: function load() {
      if (!app.isGutenbergEditor()) {
        app.maybeShowClassicNotice();
        app.bindClassicEvents();
        return;
      }
      var blockLoadedInterval = setInterval(function () {
        if (!document.querySelector('.editor-post-title__input, iframe[name="editor-canvas"]')) {
          return;
        }
        clearInterval(blockLoadedInterval);
        if (!app.isFse()) {
          app.maybeShowGutenbergNotice();
          app.bindGutenbergEvents();
          return;
        }
        var iframe = document.querySelector('iframe[name="editor-canvas"]');
        var observer = new MutationObserver(function () {
          var iframeDocument = iframe.contentDocument || iframe.contentWindow.document || {};
          if (iframeDocument.readyState === 'complete' && iframeDocument.querySelector('.editor-post-title__input')) {
            app.maybeShowGutenbergNotice();
            app.bindFseEvents();
            observer.disconnect();
          }
        });
        observer.observe(document.body, {
          subtree: true,
          childList: true
        });
      }, 200);
    },
    /**
     * Bind events for Classic Editor.
     *
     * @since 1.8.1
     */
    bindClassicEvents: function bindClassicEvents() {
      var $document = $(document);
      if (!app.isNoticeVisible) {
        $document.on('input', '#title', _.debounce(app.maybeShowClassicNotice, 1000));
      }
      $document.on('click', '.wpforms-edit-post-education-notice-close', app.closeNotice);
    },
    /**
     * Bind events for Gutenberg Editor.
     *
     * @since 1.8.1
     */
    bindGutenbergEvents: function bindGutenbergEvents() {
      var $document = $(document);
      $document.on('DOMSubtreeModified', '.edit-post-layout', app.distractionFreeModeToggle);
      if (app.isNoticeVisible) {
        return;
      }
      $document.on('input', '.editor-post-title__input', _.debounce(app.maybeShowGutenbergNotice, 1000)).on('DOMSubtreeModified', '.editor-post-title__input', _.debounce(app.maybeShowGutenbergNotice, 1000));
    },
    /**
     * Bind events for Gutenberg Editor in FSE mode.
     *
     * @since 1.8.1
     */
    bindFseEvents: function bindFseEvents() {
      var $iframe = $('iframe[name="editor-canvas"]');
      $(document).on('DOMSubtreeModified', '.edit-post-layout', app.distractionFreeModeToggle);
      $iframe.contents().on('DOMSubtreeModified', '.editor-post-title__input', _.debounce(app.maybeShowGutenbergNotice, 1000));
    },
    /**
     * Determine if the editor is Gutenberg.
     *
     * @since 1.8.1
     *
     * @return {boolean} True if the editor is Gutenberg.
     */
    isGutenbergEditor: function isGutenbergEditor() {
      return typeof wp !== 'undefined' && typeof wp.blocks !== 'undefined';
    },
    /**
     * Determine if the editor is Gutenberg in FSE mode.
     *
     * @since 1.8.1
     *
     * @return {boolean} True if the Gutenberg editor in FSE mode.
     */
    isFse: function isFse() {
      return Boolean($('iframe[name="editor-canvas"]').length);
    },
    /**
     * Create a notice for Gutenberg.
     *
     * @since 1.8.1
     */
    showGutenbergNotice: function showGutenbergNotice() {
      wp.data.dispatch('core/notices').createInfoNotice(wpforms_edit_post_education.gutenberg_notice.template, app.getGutenbergNoticeSettings());

      // The notice component doesn't have a way to add HTML id or class to the notice.
      // Also, the notice became visible with a delay on old Gutenberg versions.
      var hasNotice = setInterval(function () {
        var noticeBody = $('.wpforms-edit-post-education-notice-body');
        if (!noticeBody.length) {
          return;
        }
        var $notice = noticeBody.closest('.components-notice');
        $notice.addClass('wpforms-edit-post-education-notice');
        $notice.find('.is-secondary, .is-link').removeClass('is-secondary').removeClass('is-link').addClass('is-primary');

        // We can't use onDismiss callback as it was introduced in WordPress 6.0 only.
        var dismissButton = $notice.find('.components-notice__dismiss');
        if (dismissButton) {
          dismissButton.on('click', function () {
            app.updateUserMeta();
          });
        }
        clearInterval(hasNotice);
      }, 100);
    },
    /**
     * Get settings for the Gutenberg notice.
     *
     * @since 1.8.1
     *
     * @return {Object} Notice settings.
     */
    getGutenbergNoticeSettings: function getGutenbergNoticeSettings() {
      var pluginName = 'wpforms-edit-post-product-education-guide';
      var noticeSettings = {
        id: pluginName,
        isDismissible: true,
        HTML: true,
        __unstableHTML: true,
        actions: [{
          className: 'wpforms-edit-post-education-notice-guide-button',
          variant: 'primary',
          label: wpforms_edit_post_education.gutenberg_notice.button
        }]
      };
      if (!wpforms_edit_post_education.gutenberg_guide) {
        noticeSettings.actions[0].url = wpforms_edit_post_education.gutenberg_notice.url;
        return noticeSettings;
      }
      var Guide = wp.components.Guide;
      var useState = wp.element.useState;
      var registerPlugin = wp.plugins.registerPlugin;
      var unregisterPlugin = wp.plugins.unregisterPlugin;
      var GutenbergTutorial = function GutenbergTutorial() {
        var _useState = useState(true),
          _useState2 = _slicedToArray(_useState, 2),
          isOpen = _useState2[0],
          setIsOpen = _useState2[1];
        if (!isOpen) {
          return null;
        }
        return (
          /*#__PURE__*/
          // eslint-disable-next-line react/react-in-jsx-scope
          React.createElement(Guide, {
            className: "edit-post-welcome-guide",
            onFinish: function onFinish() {
              unregisterPlugin(pluginName);
              setIsOpen(false);
            },
            pages: app.getGuidePages()
          })
        );
      };
      noticeSettings.actions[0].onClick = function () {
        return registerPlugin(pluginName, {
          render: GutenbergTutorial
        });
      };
      return noticeSettings;
    },
    /**
     * Get Guide pages in proper format.
     *
     * @since 1.8.1
     *
     * @return {Array} Guide Pages.
     */
    getGuidePages: function getGuidePages() {
      var pages = [];
      wpforms_edit_post_education.gutenberg_guide.forEach(function (page) {
        pages.push({
          /* eslint-disable react/react-in-jsx-scope */
          content: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
            className: "edit-post-welcome-guide__heading"
          }, page.title), /*#__PURE__*/React.createElement("p", {
            className: "edit-post-welcome-guide__text"
          }, page.content)),
          image: /*#__PURE__*/React.createElement("img", {
            className: "edit-post-welcome-guide__image",
            src: page.image,
            alt: page.title
          })
          /* eslint-enable react/react-in-jsx-scope */
        });
      });
      return pages;
    },
    /**
     * Show notice if the page title matches some keywords for Classic Editor.
     *
     * @since 1.8.1
     */
    maybeShowClassicNotice: function maybeShowClassicNotice() {
      if (app.isNoticeVisible) {
        return;
      }
      if (app.isTitleMatchKeywords($('#title').val())) {
        app.isNoticeVisible = true;
        $('.wpforms-edit-post-education-notice').removeClass('wpforms-hidden');
      }
    },
    /**
     * Show notice if the page title matches some keywords for Gutenberg Editor.
     *
     * @since 1.8.1
     */
    maybeShowGutenbergNotice: function maybeShowGutenbergNotice() {
      if (app.isNoticeVisible) {
        return;
      }
      var $postTitle = app.isFse() ? $('iframe[name="editor-canvas"]').contents().find('.editor-post-title__input') : $('.editor-post-title__input');
      var tagName = $postTitle.prop('tagName');
      var title = tagName === 'TEXTAREA' ? $postTitle.val() : $postTitle.text();
      if (app.isTitleMatchKeywords(title)) {
        app.isNoticeVisible = true;
        app.showGutenbergNotice();
      }
    },
    /**
     * Add notice class when the distraction mode is enabled.
     *
     * @since 1.8.1.2
     */
    distractionFreeModeToggle: function distractionFreeModeToggle() {
      if (!app.isNoticeVisible) {
        return;
      }
      var $document = $(document);
      var isDistractionFreeMode = Boolean($document.find('.is-distraction-free').length);
      if (!isDistractionFreeMode) {
        return;
      }
      var isNoticeHasClass = Boolean($('.wpforms-edit-post-education-notice').length);
      if (isNoticeHasClass) {
        return;
      }
      var $noticeBody = $document.find('.wpforms-edit-post-education-notice-body');
      var $notice = $noticeBody.closest('.components-notice');
      $notice.addClass('wpforms-edit-post-education-notice');
    },
    /**
     * Determine if the title matches keywords.
     *
     * @since 1.8.1
     *
     * @param {string} titleValue Page title value.
     *
     * @return {boolean} True if the title matches some keywords.
     */
    isTitleMatchKeywords: function isTitleMatchKeywords(titleValue) {
      var expectedTitleRegex = new RegExp(/\b(contact|form)\b/i);
      return expectedTitleRegex.test(titleValue);
    },
    /**
     * Close a notice.
     *
     * @since 1.8.1
     */
    closeNotice: function closeNotice() {
      $(this).closest('.wpforms-edit-post-education-notice').remove();
      app.updateUserMeta();
    },
    /**
     * Update user meta and don't show the notice next time.
     *
     * @since 1.8.1
     */
    updateUserMeta: function updateUserMeta() {
      $.post(wpforms_edit_post_education.ajax_url, {
        action: 'wpforms_education_dismiss',
        nonce: wpforms_edit_post_education.education_nonce,
        section: 'edit-post-notice'
      });
    }
  };
  return app;
}(document, window, jQuery);
WPFormsEditPostEducation.init();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJXUEZvcm1zRWRpdFBvc3RFZHVjYXRpb24iLCJ3aW5kb3ciLCJkb2N1bWVudCIsIiQiLCJhcHAiLCJpc05vdGljZVZpc2libGUiLCJpbml0Iiwib24iLCJyZWFkeSIsInRoZW4iLCJsb2FkIiwiaXNHdXRlbmJlcmdFZGl0b3IiLCJtYXliZVNob3dDbGFzc2ljTm90aWNlIiwiYmluZENsYXNzaWNFdmVudHMiLCJibG9ja0xvYWRlZEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJxdWVyeVNlbGVjdG9yIiwiY2xlYXJJbnRlcnZhbCIsImlzRnNlIiwibWF5YmVTaG93R3V0ZW5iZXJnTm90aWNlIiwiYmluZEd1dGVuYmVyZ0V2ZW50cyIsImlmcmFtZSIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImlmcmFtZURvY3VtZW50IiwiY29udGVudERvY3VtZW50IiwiY29udGVudFdpbmRvdyIsInJlYWR5U3RhdGUiLCJiaW5kRnNlRXZlbnRzIiwiZGlzY29ubmVjdCIsIm9ic2VydmUiLCJib2R5Iiwic3VidHJlZSIsImNoaWxkTGlzdCIsIiRkb2N1bWVudCIsIl8iLCJkZWJvdW5jZSIsImNsb3NlTm90aWNlIiwiZGlzdHJhY3Rpb25GcmVlTW9kZVRvZ2dsZSIsIiRpZnJhbWUiLCJjb250ZW50cyIsIndwIiwiYmxvY2tzIiwiQm9vbGVhbiIsImxlbmd0aCIsInNob3dHdXRlbmJlcmdOb3RpY2UiLCJkYXRhIiwiZGlzcGF0Y2giLCJjcmVhdGVJbmZvTm90aWNlIiwid3Bmb3Jtc19lZGl0X3Bvc3RfZWR1Y2F0aW9uIiwiZ3V0ZW5iZXJnX25vdGljZSIsInRlbXBsYXRlIiwiZ2V0R3V0ZW5iZXJnTm90aWNlU2V0dGluZ3MiLCJoYXNOb3RpY2UiLCJub3RpY2VCb2R5IiwiJG5vdGljZSIsImNsb3Nlc3QiLCJhZGRDbGFzcyIsImZpbmQiLCJyZW1vdmVDbGFzcyIsImRpc21pc3NCdXR0b24iLCJ1cGRhdGVVc2VyTWV0YSIsInBsdWdpbk5hbWUiLCJub3RpY2VTZXR0aW5ncyIsImlkIiwiaXNEaXNtaXNzaWJsZSIsIkhUTUwiLCJfX3Vuc3RhYmxlSFRNTCIsImFjdGlvbnMiLCJjbGFzc05hbWUiLCJ2YXJpYW50IiwibGFiZWwiLCJidXR0b24iLCJndXRlbmJlcmdfZ3VpZGUiLCJ1cmwiLCJHdWlkZSIsImNvbXBvbmVudHMiLCJ1c2VTdGF0ZSIsImVsZW1lbnQiLCJyZWdpc3RlclBsdWdpbiIsInBsdWdpbnMiLCJ1bnJlZ2lzdGVyUGx1Z2luIiwiR3V0ZW5iZXJnVHV0b3JpYWwiLCJfdXNlU3RhdGUiLCJfdXNlU3RhdGUyIiwiX3NsaWNlZFRvQXJyYXkiLCJpc09wZW4iLCJzZXRJc09wZW4iLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJvbkZpbmlzaCIsInBhZ2VzIiwiZ2V0R3VpZGVQYWdlcyIsIm9uQ2xpY2siLCJyZW5kZXIiLCJmb3JFYWNoIiwicGFnZSIsInB1c2giLCJjb250ZW50IiwiRnJhZ21lbnQiLCJ0aXRsZSIsImltYWdlIiwic3JjIiwiYWx0IiwiaXNUaXRsZU1hdGNoS2V5d29yZHMiLCJ2YWwiLCIkcG9zdFRpdGxlIiwidGFnTmFtZSIsInByb3AiLCJ0ZXh0IiwiaXNEaXN0cmFjdGlvbkZyZWVNb2RlIiwiaXNOb3RpY2VIYXNDbGFzcyIsIiRub3RpY2VCb2R5IiwidGl0bGVWYWx1ZSIsImV4cGVjdGVkVGl0bGVSZWdleCIsIlJlZ0V4cCIsInRlc3QiLCJyZW1vdmUiLCJwb3N0IiwiYWpheF91cmwiLCJhY3Rpb24iLCJub25jZSIsImVkdWNhdGlvbl9ub25jZSIsInNlY3Rpb24iLCJqUXVlcnkiXSwic291cmNlcyI6WyJmYWtlXzVkMzM4YTc2LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCB3cGZvcm1zX2VkaXRfcG9zdF9lZHVjYXRpb24gKi9cblxuLy8gbm9pbnNwZWN0aW9uIEVTNkNvbnZlcnRWYXJUb0xldENvbnN0XG4vKipcbiAqIFdQRm9ybXMgRWRpdCBQb3N0IEVkdWNhdGlvbiBmdW5jdGlvbi5cbiAqXG4gKiBAc2luY2UgMS44LjFcbiAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdmFyLCBuby11bnVzZWQtdmFyc1xudmFyIFdQRm9ybXNFZGl0UG9zdEVkdWNhdGlvbiA9IHdpbmRvdy5XUEZvcm1zRWRpdFBvc3RFZHVjYXRpb24gfHwgKCBmdW5jdGlvbiggZG9jdW1lbnQsIHdpbmRvdywgJCApIHtcblx0LyoqXG5cdCAqIFB1YmxpYyBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMuXG5cdCAqXG5cdCAqIEBzaW5jZSAxLjguMVxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0Y29uc3QgYXBwID0ge1xuXG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIGlmIHRoZSBub3RpY2Ugd2FzIHNob3duIGJlZm9yZS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqL1xuXHRcdGlzTm90aWNlVmlzaWJsZTogZmFsc2UsXG5cblx0XHQvKipcblx0XHQgKiBTdGFydCB0aGUgZW5naW5lLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC4xXG5cdFx0ICovXG5cdFx0aW5pdCgpIHtcblx0XHRcdCQoIHdpbmRvdyApLm9uKCAnbG9hZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBJbiB0aGUgY2FzZSBvZiBqUXVlcnkgMy4rLCB3ZSBuZWVkIHRvIHdhaXQgZm9yIGEgcmVhZHkgZXZlbnQgZmlyc3QuXG5cdFx0XHRcdGlmICggdHlwZW9mICQucmVhZHkudGhlbiA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHQkLnJlYWR5LnRoZW4oIGFwcC5sb2FkICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YXBwLmxvYWQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBQYWdlIGxvYWQuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44LjFcblx0XHQgKi9cblx0XHRsb2FkKCkge1xuXHRcdFx0aWYgKCAhIGFwcC5pc0d1dGVuYmVyZ0VkaXRvcigpICkge1xuXHRcdFx0XHRhcHAubWF5YmVTaG93Q2xhc3NpY05vdGljZSgpO1xuXHRcdFx0XHRhcHAuYmluZENsYXNzaWNFdmVudHMoKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGJsb2NrTG9hZGVkSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggISBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmVkaXRvci1wb3N0LXRpdGxlX19pbnB1dCwgaWZyYW1lW25hbWU9XCJlZGl0b3ItY2FudmFzXCJdJyApICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoIGJsb2NrTG9hZGVkSW50ZXJ2YWwgKTtcblxuXHRcdFx0XHRpZiAoICEgYXBwLmlzRnNlKCkgKSB7XG5cdFx0XHRcdFx0YXBwLm1heWJlU2hvd0d1dGVuYmVyZ05vdGljZSgpO1xuXHRcdFx0XHRcdGFwcC5iaW5kR3V0ZW5iZXJnRXZlbnRzKCk7XG5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBpZnJhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnaWZyYW1lW25hbWU9XCJlZGl0b3ItY2FudmFzXCJdJyApO1xuXHRcdFx0XHRjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50RG9jdW1lbnQgfHwgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQgfHwge307XG5cblx0XHRcdFx0XHRpZiAoIGlmcmFtZURvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScgJiYgaWZyYW1lRG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5lZGl0b3ItcG9zdC10aXRsZV9faW5wdXQnICkgKSB7XG5cdFx0XHRcdFx0XHRhcHAubWF5YmVTaG93R3V0ZW5iZXJnTm90aWNlKCk7XG5cdFx0XHRcdFx0XHRhcHAuYmluZEZzZUV2ZW50cygpO1xuXG5cdFx0XHRcdFx0XHRvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdG9ic2VydmVyLm9ic2VydmUoIGRvY3VtZW50LmJvZHksIHsgc3VidHJlZTogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlIH0gKTtcblx0XHRcdH0sIDIwMCApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBCaW5kIGV2ZW50cyBmb3IgQ2xhc3NpYyBFZGl0b3IuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44LjFcblx0XHQgKi9cblx0XHRiaW5kQ2xhc3NpY0V2ZW50cygpIHtcblx0XHRcdGNvbnN0ICRkb2N1bWVudCA9ICQoIGRvY3VtZW50ICk7XG5cblx0XHRcdGlmICggISBhcHAuaXNOb3RpY2VWaXNpYmxlICkge1xuXHRcdFx0XHQkZG9jdW1lbnQub24oICdpbnB1dCcsICcjdGl0bGUnLCBfLmRlYm91bmNlKCBhcHAubWF5YmVTaG93Q2xhc3NpY05vdGljZSwgMTAwMCApICk7XG5cdFx0XHR9XG5cblx0XHRcdCRkb2N1bWVudC5vbiggJ2NsaWNrJywgJy53cGZvcm1zLWVkaXQtcG9zdC1lZHVjYXRpb24tbm90aWNlLWNsb3NlJywgYXBwLmNsb3NlTm90aWNlICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEJpbmQgZXZlbnRzIGZvciBHdXRlbmJlcmcgRWRpdG9yLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC4xXG5cdFx0ICovXG5cdFx0YmluZEd1dGVuYmVyZ0V2ZW50cygpIHtcblx0XHRcdGNvbnN0ICRkb2N1bWVudCA9ICQoIGRvY3VtZW50ICk7XG5cblx0XHRcdCRkb2N1bWVudFxuXHRcdFx0XHQub24oICdET01TdWJ0cmVlTW9kaWZpZWQnLCAnLmVkaXQtcG9zdC1sYXlvdXQnLCBhcHAuZGlzdHJhY3Rpb25GcmVlTW9kZVRvZ2dsZSApO1xuXG5cdFx0XHRpZiAoIGFwcC5pc05vdGljZVZpc2libGUgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JGRvY3VtZW50XG5cdFx0XHRcdC5vbiggJ2lucHV0JywgJy5lZGl0b3ItcG9zdC10aXRsZV9faW5wdXQnLCBfLmRlYm91bmNlKCBhcHAubWF5YmVTaG93R3V0ZW5iZXJnTm90aWNlLCAxMDAwICkgKVxuXHRcdFx0XHQub24oICdET01TdWJ0cmVlTW9kaWZpZWQnLCAnLmVkaXRvci1wb3N0LXRpdGxlX19pbnB1dCcsIF8uZGVib3VuY2UoIGFwcC5tYXliZVNob3dHdXRlbmJlcmdOb3RpY2UsIDEwMDAgKSApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBCaW5kIGV2ZW50cyBmb3IgR3V0ZW5iZXJnIEVkaXRvciBpbiBGU0UgbW9kZS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqL1xuXHRcdGJpbmRGc2VFdmVudHMoKSB7XG5cdFx0XHRjb25zdCAkaWZyYW1lID0gJCggJ2lmcmFtZVtuYW1lPVwiZWRpdG9yLWNhbnZhc1wiXScgKTtcblxuXHRcdFx0JCggZG9jdW1lbnQgKVxuXHRcdFx0XHQub24oICdET01TdWJ0cmVlTW9kaWZpZWQnLCAnLmVkaXQtcG9zdC1sYXlvdXQnLCBhcHAuZGlzdHJhY3Rpb25GcmVlTW9kZVRvZ2dsZSApO1xuXG5cdFx0XHQkaWZyYW1lLmNvbnRlbnRzKClcblx0XHRcdFx0Lm9uKCAnRE9NU3VidHJlZU1vZGlmaWVkJywgJy5lZGl0b3ItcG9zdC10aXRsZV9faW5wdXQnLCBfLmRlYm91bmNlKCBhcHAubWF5YmVTaG93R3V0ZW5iZXJnTm90aWNlLCAxMDAwICkgKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIGlmIHRoZSBlZGl0b3IgaXMgR3V0ZW5iZXJnLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC4xXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBlZGl0b3IgaXMgR3V0ZW5iZXJnLlxuXHRcdCAqL1xuXHRcdGlzR3V0ZW5iZXJnRWRpdG9yKCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiB3cCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdwLmJsb2NrcyAhPT0gJ3VuZGVmaW5lZCc7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIERldGVybWluZSBpZiB0aGUgZWRpdG9yIGlzIEd1dGVuYmVyZyBpbiBGU0UgbW9kZS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgR3V0ZW5iZXJnIGVkaXRvciBpbiBGU0UgbW9kZS5cblx0XHQgKi9cblx0XHRpc0ZzZSgpIHtcblx0XHRcdHJldHVybiBCb29sZWFuKCAkKCAnaWZyYW1lW25hbWU9XCJlZGl0b3ItY2FudmFzXCJdJyApLmxlbmd0aCApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBDcmVhdGUgYSBub3RpY2UgZm9yIEd1dGVuYmVyZy5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqL1xuXHRcdHNob3dHdXRlbmJlcmdOb3RpY2UoKSB7XG5cdFx0XHR3cC5kYXRhLmRpc3BhdGNoKCAnY29yZS9ub3RpY2VzJyApLmNyZWF0ZUluZm9Ob3RpY2UoXG5cdFx0XHRcdHdwZm9ybXNfZWRpdF9wb3N0X2VkdWNhdGlvbi5ndXRlbmJlcmdfbm90aWNlLnRlbXBsYXRlLFxuXHRcdFx0XHRhcHAuZ2V0R3V0ZW5iZXJnTm90aWNlU2V0dGluZ3MoKVxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gVGhlIG5vdGljZSBjb21wb25lbnQgZG9lc24ndCBoYXZlIGEgd2F5IHRvIGFkZCBIVE1MIGlkIG9yIGNsYXNzIHRvIHRoZSBub3RpY2UuXG5cdFx0XHQvLyBBbHNvLCB0aGUgbm90aWNlIGJlY2FtZSB2aXNpYmxlIHdpdGggYSBkZWxheSBvbiBvbGQgR3V0ZW5iZXJnIHZlcnNpb25zLlxuXHRcdFx0Y29uc3QgaGFzTm90aWNlID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBub3RpY2VCb2R5ID0gJCggJy53cGZvcm1zLWVkaXQtcG9zdC1lZHVjYXRpb24tbm90aWNlLWJvZHknICk7XG5cdFx0XHRcdGlmICggISBub3RpY2VCb2R5Lmxlbmd0aCApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCAkbm90aWNlID0gbm90aWNlQm9keS5jbG9zZXN0KCAnLmNvbXBvbmVudHMtbm90aWNlJyApO1xuXHRcdFx0XHQkbm90aWNlLmFkZENsYXNzKCAnd3Bmb3Jtcy1lZGl0LXBvc3QtZWR1Y2F0aW9uLW5vdGljZScgKTtcblx0XHRcdFx0JG5vdGljZS5maW5kKCAnLmlzLXNlY29uZGFyeSwgLmlzLWxpbmsnICkucmVtb3ZlQ2xhc3MoICdpcy1zZWNvbmRhcnknICkucmVtb3ZlQ2xhc3MoICdpcy1saW5rJyApLmFkZENsYXNzKCAnaXMtcHJpbWFyeScgKTtcblxuXHRcdFx0XHQvLyBXZSBjYW4ndCB1c2Ugb25EaXNtaXNzIGNhbGxiYWNrIGFzIGl0IHdhcyBpbnRyb2R1Y2VkIGluIFdvcmRQcmVzcyA2LjAgb25seS5cblx0XHRcdFx0Y29uc3QgZGlzbWlzc0J1dHRvbiA9ICRub3RpY2UuZmluZCggJy5jb21wb25lbnRzLW5vdGljZV9fZGlzbWlzcycgKTtcblx0XHRcdFx0aWYgKCBkaXNtaXNzQnV0dG9uICkge1xuXHRcdFx0XHRcdGRpc21pc3NCdXR0b24ub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0YXBwLnVwZGF0ZVVzZXJNZXRhKCk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y2xlYXJJbnRlcnZhbCggaGFzTm90aWNlICk7XG5cdFx0XHR9LCAxMDAgKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IHNldHRpbmdzIGZvciB0aGUgR3V0ZW5iZXJnIG5vdGljZS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fSBOb3RpY2Ugc2V0dGluZ3MuXG5cdFx0ICovXG5cdFx0Z2V0R3V0ZW5iZXJnTm90aWNlU2V0dGluZ3MoKSB7XG5cdFx0XHRjb25zdCBwbHVnaW5OYW1lID0gJ3dwZm9ybXMtZWRpdC1wb3N0LXByb2R1Y3QtZWR1Y2F0aW9uLWd1aWRlJztcblx0XHRcdGNvbnN0IG5vdGljZVNldHRpbmdzID0ge1xuXHRcdFx0XHRpZDogcGx1Z2luTmFtZSxcblx0XHRcdFx0aXNEaXNtaXNzaWJsZTogdHJ1ZSxcblx0XHRcdFx0SFRNTDogdHJ1ZSxcblx0XHRcdFx0X191bnN0YWJsZUhUTUw6IHRydWUsXG5cdFx0XHRcdGFjdGlvbnM6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjbGFzc05hbWU6ICd3cGZvcm1zLWVkaXQtcG9zdC1lZHVjYXRpb24tbm90aWNlLWd1aWRlLWJ1dHRvbicsXG5cdFx0XHRcdFx0XHR2YXJpYW50OiAncHJpbWFyeScsXG5cdFx0XHRcdFx0XHRsYWJlbDogd3Bmb3Jtc19lZGl0X3Bvc3RfZWR1Y2F0aW9uLmd1dGVuYmVyZ19ub3RpY2UuYnV0dG9uLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdF0sXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoICEgd3Bmb3Jtc19lZGl0X3Bvc3RfZWR1Y2F0aW9uLmd1dGVuYmVyZ19ndWlkZSApIHtcblx0XHRcdFx0bm90aWNlU2V0dGluZ3MuYWN0aW9uc1sgMCBdLnVybCA9IHdwZm9ybXNfZWRpdF9wb3N0X2VkdWNhdGlvbi5ndXRlbmJlcmdfbm90aWNlLnVybDtcblxuXHRcdFx0XHRyZXR1cm4gbm90aWNlU2V0dGluZ3M7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IEd1aWRlID0gd3AuY29tcG9uZW50cy5HdWlkZTtcblx0XHRcdGNvbnN0IHVzZVN0YXRlID0gd3AuZWxlbWVudC51c2VTdGF0ZTtcblx0XHRcdGNvbnN0IHJlZ2lzdGVyUGx1Z2luID0gd3AucGx1Z2lucy5yZWdpc3RlclBsdWdpbjtcblx0XHRcdGNvbnN0IHVucmVnaXN0ZXJQbHVnaW4gPSB3cC5wbHVnaW5zLnVucmVnaXN0ZXJQbHVnaW47XG5cdFx0XHRjb25zdCBHdXRlbmJlcmdUdXRvcmlhbCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBbIGlzT3Blbiwgc2V0SXNPcGVuIF0gPSB1c2VTdGF0ZSggdHJ1ZSApO1xuXG5cdFx0XHRcdGlmICggISBpc09wZW4gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9yZWFjdC1pbi1qc3gtc2NvcGVcblx0XHRcdFx0XHQ8R3VpZGVcblx0XHRcdFx0XHRcdGNsYXNzTmFtZT1cImVkaXQtcG9zdC13ZWxjb21lLWd1aWRlXCJcblx0XHRcdFx0XHRcdG9uRmluaXNoPXsgKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHR1bnJlZ2lzdGVyUGx1Z2luKCBwbHVnaW5OYW1lICk7XG5cdFx0XHRcdFx0XHRcdHNldElzT3BlbiggZmFsc2UgKTtcblx0XHRcdFx0XHRcdH0gfVxuXHRcdFx0XHRcdFx0cGFnZXM9eyBhcHAuZ2V0R3VpZGVQYWdlcygpIH1cblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQpO1xuXHRcdFx0fTtcblxuXHRcdFx0bm90aWNlU2V0dGluZ3MuYWN0aW9uc1sgMCBdLm9uQ2xpY2sgPSAoKSA9PiByZWdpc3RlclBsdWdpbiggcGx1Z2luTmFtZSwgeyByZW5kZXI6IEd1dGVuYmVyZ1R1dG9yaWFsIH0gKTtcblxuXHRcdFx0cmV0dXJuIG5vdGljZVNldHRpbmdzO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgR3VpZGUgcGFnZXMgaW4gcHJvcGVyIGZvcm1hdC5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7QXJyYXl9IEd1aWRlIFBhZ2VzLlxuXHRcdCAqL1xuXHRcdGdldEd1aWRlUGFnZXMoKSB7XG5cdFx0XHRjb25zdCBwYWdlcyA9IFtdO1xuXG5cdFx0XHR3cGZvcm1zX2VkaXRfcG9zdF9lZHVjYXRpb24uZ3V0ZW5iZXJnX2d1aWRlLmZvckVhY2goIGZ1bmN0aW9uKCBwYWdlICkge1xuXHRcdFx0XHRwYWdlcy5wdXNoKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdC8qIGVzbGludC1kaXNhYmxlIHJlYWN0L3JlYWN0LWluLWpzeC1zY29wZSAqL1xuXHRcdFx0XHRcdFx0Y29udGVudDogKFxuXHRcdFx0XHRcdFx0XHQ8PlxuXHRcdFx0XHRcdFx0XHRcdDxoMSBjbGFzc05hbWU9XCJlZGl0LXBvc3Qtd2VsY29tZS1ndWlkZV9faGVhZGluZ1wiPnsgcGFnZS50aXRsZSB9PC9oMT5cblx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzc05hbWU9XCJlZGl0LXBvc3Qtd2VsY29tZS1ndWlkZV9fdGV4dFwiPnsgcGFnZS5jb250ZW50IH08L3A+XG5cdFx0XHRcdFx0XHRcdDwvPlxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdGltYWdlOiA8aW1nIGNsYXNzTmFtZT1cImVkaXQtcG9zdC13ZWxjb21lLWd1aWRlX19pbWFnZVwiIHNyYz17IHBhZ2UuaW1hZ2UgfSBhbHQ9eyBwYWdlLnRpdGxlIH0gLz4sXG5cdFx0XHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIHJlYWN0L3JlYWN0LWluLWpzeC1zY29wZSAqL1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH0gKTtcblxuXHRcdFx0cmV0dXJuIHBhZ2VzO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBTaG93IG5vdGljZSBpZiB0aGUgcGFnZSB0aXRsZSBtYXRjaGVzIHNvbWUga2V5d29yZHMgZm9yIENsYXNzaWMgRWRpdG9yLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC4xXG5cdFx0ICovXG5cdFx0bWF5YmVTaG93Q2xhc3NpY05vdGljZSgpIHtcblx0XHRcdGlmICggYXBwLmlzTm90aWNlVmlzaWJsZSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGFwcC5pc1RpdGxlTWF0Y2hLZXl3b3JkcyggJCggJyN0aXRsZScgKS52YWwoKSApICkge1xuXHRcdFx0XHRhcHAuaXNOb3RpY2VWaXNpYmxlID0gdHJ1ZTtcblxuXHRcdFx0XHQkKCAnLndwZm9ybXMtZWRpdC1wb3N0LWVkdWNhdGlvbi1ub3RpY2UnICkucmVtb3ZlQ2xhc3MoICd3cGZvcm1zLWhpZGRlbicgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogU2hvdyBub3RpY2UgaWYgdGhlIHBhZ2UgdGl0bGUgbWF0Y2hlcyBzb21lIGtleXdvcmRzIGZvciBHdXRlbmJlcmcgRWRpdG9yLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC4xXG5cdFx0ICovXG5cdFx0bWF5YmVTaG93R3V0ZW5iZXJnTm90aWNlKCkge1xuXHRcdFx0aWYgKCBhcHAuaXNOb3RpY2VWaXNpYmxlICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0ICRwb3N0VGl0bGUgPSBhcHAuaXNGc2UoKVxuXHRcdFx0XHQ/ICQoICdpZnJhbWVbbmFtZT1cImVkaXRvci1jYW52YXNcIl0nICkuY29udGVudHMoKS5maW5kKCAnLmVkaXRvci1wb3N0LXRpdGxlX19pbnB1dCcgKVxuXHRcdFx0XHQ6ICQoICcuZWRpdG9yLXBvc3QtdGl0bGVfX2lucHV0JyApO1xuXHRcdFx0Y29uc3QgdGFnTmFtZSA9ICRwb3N0VGl0bGUucHJvcCggJ3RhZ05hbWUnICk7XG5cdFx0XHRjb25zdCB0aXRsZSA9IHRhZ05hbWUgPT09ICdURVhUQVJFQScgPyAkcG9zdFRpdGxlLnZhbCgpIDogJHBvc3RUaXRsZS50ZXh0KCk7XG5cblx0XHRcdGlmICggYXBwLmlzVGl0bGVNYXRjaEtleXdvcmRzKCB0aXRsZSApICkge1xuXHRcdFx0XHRhcHAuaXNOb3RpY2VWaXNpYmxlID0gdHJ1ZTtcblxuXHRcdFx0XHRhcHAuc2hvd0d1dGVuYmVyZ05vdGljZSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBBZGQgbm90aWNlIGNsYXNzIHdoZW4gdGhlIGRpc3RyYWN0aW9uIG1vZGUgaXMgZW5hYmxlZC5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMS4yXG5cdFx0ICovXG5cdFx0ZGlzdHJhY3Rpb25GcmVlTW9kZVRvZ2dsZSgpIHtcblx0XHRcdGlmICggISBhcHAuaXNOb3RpY2VWaXNpYmxlICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0ICRkb2N1bWVudCA9ICQoIGRvY3VtZW50ICk7XG5cdFx0XHRjb25zdCBpc0Rpc3RyYWN0aW9uRnJlZU1vZGUgPSBCb29sZWFuKCAkZG9jdW1lbnQuZmluZCggJy5pcy1kaXN0cmFjdGlvbi1mcmVlJyApLmxlbmd0aCApO1xuXG5cdFx0XHRpZiAoICEgaXNEaXN0cmFjdGlvbkZyZWVNb2RlICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGlzTm90aWNlSGFzQ2xhc3MgPSBCb29sZWFuKCAkKCAnLndwZm9ybXMtZWRpdC1wb3N0LWVkdWNhdGlvbi1ub3RpY2UnICkubGVuZ3RoICk7XG5cblx0XHRcdGlmICggaXNOb3RpY2VIYXNDbGFzcyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkbm90aWNlQm9keSA9ICRkb2N1bWVudC5maW5kKCAnLndwZm9ybXMtZWRpdC1wb3N0LWVkdWNhdGlvbi1ub3RpY2UtYm9keScgKTtcblx0XHRcdGNvbnN0ICRub3RpY2UgPSAkbm90aWNlQm9keS5jbG9zZXN0KCAnLmNvbXBvbmVudHMtbm90aWNlJyApO1xuXG5cdFx0XHQkbm90aWNlLmFkZENsYXNzKCAnd3Bmb3Jtcy1lZGl0LXBvc3QtZWR1Y2F0aW9uLW5vdGljZScgKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lIGlmIHRoZSB0aXRsZSBtYXRjaGVzIGtleXdvcmRzLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC4xXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGVWYWx1ZSBQYWdlIHRpdGxlIHZhbHVlLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdGl0bGUgbWF0Y2hlcyBzb21lIGtleXdvcmRzLlxuXHRcdCAqL1xuXHRcdGlzVGl0bGVNYXRjaEtleXdvcmRzKCB0aXRsZVZhbHVlICkge1xuXHRcdFx0Y29uc3QgZXhwZWN0ZWRUaXRsZVJlZ2V4ID0gbmV3IFJlZ0V4cCggL1xcYihjb250YWN0fGZvcm0pXFxiL2kgKTtcblxuXHRcdFx0cmV0dXJuIGV4cGVjdGVkVGl0bGVSZWdleC50ZXN0KCB0aXRsZVZhbHVlICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIENsb3NlIGEgbm90aWNlLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC4xXG5cdFx0ICovXG5cdFx0Y2xvc2VOb3RpY2UoKSB7XG5cdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53cGZvcm1zLWVkaXQtcG9zdC1lZHVjYXRpb24tbm90aWNlJyApLnJlbW92ZSgpO1xuXG5cdFx0XHRhcHAudXBkYXRlVXNlck1ldGEoKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogVXBkYXRlIHVzZXIgbWV0YSBhbmQgZG9uJ3Qgc2hvdyB0aGUgbm90aWNlIG5leHQgdGltZS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguMVxuXHRcdCAqL1xuXHRcdHVwZGF0ZVVzZXJNZXRhKCkge1xuXHRcdFx0JC5wb3N0KFxuXHRcdFx0XHR3cGZvcm1zX2VkaXRfcG9zdF9lZHVjYXRpb24uYWpheF91cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246ICd3cGZvcm1zX2VkdWNhdGlvbl9kaXNtaXNzJyxcblx0XHRcdFx0XHRub25jZTogd3Bmb3Jtc19lZGl0X3Bvc3RfZWR1Y2F0aW9uLmVkdWNhdGlvbl9ub25jZSxcblx0XHRcdFx0XHRzZWN0aW9uOiAnZWRpdC1wb3N0LW5vdGljZScsXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fSxcblx0fTtcblxuXHRyZXR1cm4gYXBwO1xufSggZG9jdW1lbnQsIHdpbmRvdywgalF1ZXJ5ICkgKTtcblxuV1BGb3Jtc0VkaXRQb3N0RWR1Y2F0aW9uLmluaXQoKTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJQSx3QkFBd0IsR0FBR0MsTUFBTSxDQUFDRCx3QkFBd0IsSUFBTSxVQUFVRSxRQUFRLEVBQUVELE1BQU0sRUFBRUUsQ0FBQyxFQUFHO0VBQ25HO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0MsSUFBTUMsR0FBRyxHQUFHO0lBRVg7QUFDRjtBQUNBO0FBQ0E7QUFDQTtJQUNFQyxlQUFlLEVBQUUsS0FBSztJQUV0QjtBQUNGO0FBQ0E7QUFDQTtBQUNBO0lBQ0VDLElBQUksV0FBQUEsS0FBQSxFQUFHO01BQ05ILENBQUMsQ0FBRUYsTUFBTyxDQUFDLENBQUNNLEVBQUUsQ0FBRSxNQUFNLEVBQUUsWUFBVztRQUNsQztRQUNBLElBQUssT0FBT0osQ0FBQyxDQUFDSyxLQUFLLENBQUNDLElBQUksS0FBSyxVQUFVLEVBQUc7VUFDekNOLENBQUMsQ0FBQ0ssS0FBSyxDQUFDQyxJQUFJLENBQUVMLEdBQUcsQ0FBQ00sSUFBSyxDQUFDO1FBQ3pCLENBQUMsTUFBTTtVQUNOTixHQUFHLENBQUNNLElBQUksQ0FBQyxDQUFDO1FBQ1g7TUFDRCxDQUFFLENBQUM7SUFDSixDQUFDO0lBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtJQUNFQSxJQUFJLFdBQUFBLEtBQUEsRUFBRztNQUNOLElBQUssQ0FBRU4sR0FBRyxDQUFDTyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUc7UUFDaENQLEdBQUcsQ0FBQ1Esc0JBQXNCLENBQUMsQ0FBQztRQUM1QlIsR0FBRyxDQUFDUyxpQkFBaUIsQ0FBQyxDQUFDO1FBRXZCO01BQ0Q7TUFFQSxJQUFNQyxtQkFBbUIs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
},{}]},{},[1])