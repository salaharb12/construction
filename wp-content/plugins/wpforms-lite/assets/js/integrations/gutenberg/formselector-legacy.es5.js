(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global wpforms_gutenberg_form_selector, JSX */
/* jshint es3: false, esversion: 6 */

/**
 * @param strings.update_wp_notice_head
 * @param strings.update_wp_notice_text
 * @param strings.update_wp_notice_link
 * @param strings.wpforms_empty_help
 * @param strings.wpforms_empty_info
 */

var _wp = wp,
  _wp$serverSideRender = _wp.serverSideRender,
  ServerSideRender = _wp$serverSideRender === void 0 ? wp.components.ServerSideRender : _wp$serverSideRender;
var _wp$element = wp.element,
  createElement = _wp$element.createElement,
  Fragment = _wp$element.Fragment;
var registerBlockType = wp.blocks.registerBlockType;
var _ref = wp.blockEditor || wp.editor,
  InspectorControls = _ref.InspectorControls;
var _wp$components = wp.components,
  SelectControl = _wp$components.SelectControl,
  ToggleControl = _wp$components.ToggleControl,
  PanelBody = _wp$components.PanelBody,
  Placeholder = _wp$components.Placeholder;
var __ = wp.i18n.__;
var wpformsIcon = createElement('svg', {
  width: 20,
  height: 20,
  viewBox: '0 0 612 612',
  className: 'dashicon'
}, createElement('path', {
  fill: 'currentColor',
  d: 'M544,0H68C30.445,0,0,30.445,0,68v476c0,37.556,30.445,68,68,68h476c37.556,0,68-30.444,68-68V68 C612,30.445,581.556,0,544,0z M464.44,68L387.6,120.02L323.34,68H464.44z M288.66,68l-64.26,52.02L147.56,68H288.66z M544,544H68 V68h22.1l136,92.14l79.9-64.6l79.56,64.6l136-92.14H544V544z M114.24,263.16h95.88v-48.28h-95.88V263.16z M114.24,360.4h95.88 v-48.62h-95.88V360.4z M242.76,360.4h255v-48.62h-255V360.4L242.76,360.4z M242.76,263.16h255v-48.28h-255V263.16L242.76,263.16z M368.22,457.3h129.54V408H368.22V457.3z'
}));

/**
 * Popup container.
 *
 * @since 1.8.3
 *
 * @type {Object}
 */
var $popup = {};

/**
 * Close button (inside the form builder) click event.
 *
 * @since 1.8.3
 *
 * @param {string} clientID Block Client ID.
 */
var builderCloseButtonEvent = function builderCloseButtonEvent(clientID) {
  $popup.off('wpformsBuilderInPopupClose').on('wpformsBuilderInPopupClose', function (e, action, formId, formTitle) {
    if (action !== 'saved' || !formId) {
      return;
    }

    // Insert a new block when a new form is created from the popup to update the form list and attributes.
    var newBlock = wp.blocks.createBlock('wpforms/form-selector', {
      formId: formId.toString() // Expects string value, make sure we insert string.
    });

    // eslint-disable-next-line camelcase
    wpforms_gutenberg_form_selector.forms = [{
      ID: formId,
      post_title: formTitle
    }];

    // Insert a new block.
    wp.data.dispatch('core/block-editor').removeBlock(clientID);
    wp.data.dispatch('core/block-editor').insertBlocks(newBlock);
  });
};

/**
 * Init Modern style Dropdown fields (<select>) with choiceJS.
 *
 * @since 1.9.0
 *
 * @param {Object} e Block Details.
 */
var loadChoiceJS = function loadChoiceJS(e) {
  if (typeof window.Choices !== 'function') {
    return;
  }
  var $form = jQuery(e.detail.block.querySelector("#wpforms-".concat(e.detail.formId)));
  var config = window.wpforms_choicesjs_config || {};
  $form.find('.choicesjs-select').each(function (index, element) {
    if (!(element instanceof HTMLSelectElement)) {
      return;
    }
    var $el = jQuery(element);
    if ($el.data('choicesjs')) {
      return;
    }
    var $field = $el.closest('.wpforms-field');
    config.callbackOnInit = function () {
      var self = this,
        $element = jQuery(self.passedElement.element),
        $input = jQuery(self.input.element),
        sizeClass = $element.data('size-class');

      // Add CSS-class for size.
      if (sizeClass) {
        jQuery(self.containerOuter.element).addClass(sizeClass);
      }

      /**
       * If a multiple select has selected choices - hide a placeholder text.
       * In case if select is empty - we return placeholder text.
       */
      if ($element.prop('multiple')) {
        // On init event.
        $input.data('placeholder', $input.attr('placeholder'));
        if (self.getValue(true).length) {
          $input.removeAttr('placeholder');
        }
      }
      this.disable();
      $field.find('.is-disabled').removeClass('is-disabled');
    };
    $el.data('choicesjs', new window.Choices(element, config));

    // Placeholder fix on iframes.
    if ($el.val()) {
      $el.parent().find('.choices__input').attr('style', 'display: none !important');
    }
  });
};

// on document ready
jQuery(function () {
  jQuery(window).on('wpformsFormSelectorFormLoaded', loadChoiceJS);
});
/**
 * Open builder popup.
 *
 * @since 1.6.2
 *
 * @param {string} clientID Block Client ID.
 */
var openBuilderPopup = function openBuilderPopup(clientID) {
  if (jQuery.isEmptyObject($popup)) {
    var tmpl = jQuery('#wpforms-gutenberg-popup');
    var parent = jQuery('#wpwrap');
    parent.after(tmpl);
    $popup = parent.siblings('#wpforms-gutenberg-popup');
  }
  var url = wpforms_gutenberg_form_selector.get_started_url,
    $iframe = $popup.find('iframe');
  builderCloseButtonEvent(clientID);
  $iframe.attr('src', url);
  $popup.fadeIn();
};
var hasForms = function hasForms() {
  return wpforms_gutenberg_form_selector.forms.length > 0;
};
registerBlockType('wpforms/form-selector', {
  title: wpforms_gutenberg_form_selector.strings.title,
  description: wpforms_gutenberg_form_selector.strings.description,
  icon: wpformsIcon,
  keywords: wpforms_gutenberg_form_selector.strings.form_keywords,
  category: 'widgets',
  attributes: {
    formId: {
      type: 'string'
    },
    displayTitle: {
      type: 'boolean'
    },
    displayDesc: {
      type: 'boolean'
    },
    preview: {
      type: 'boolean'
    }
  },
  example: {
    attributes: {
      preview: true
    }
  },
  supports: {
    customClassName: hasForms()
  },
  edit: function edit(props) {
    // eslint-disable-line max-lines-per-function
    var _props$attributes = props.attributes,
      _props$attributes$for = _props$attributes.formId,
      formId = _props$attributes$for === void 0 ? '' : _props$attributes$for,
      _props$attributes$dis = _props$attributes.displayTitle,
      displayTitle = _props$attributes$dis === void 0 ? false : _props$attributes$dis,
      _props$attributes$dis2 = _props$attributes.displayDesc,
      displayDesc = _props$attributes$dis2 === void 0 ? false : _props$attributes$dis2,
      _props$attributes$pre = _props$attributes.preview,
      preview = _props$attributes$pre === void 0 ? false : _props$attributes$pre,
      setAttributes = props.setAttributes;
    var formOptions = wpforms_gutenberg_form_selector.forms.map(function (value) {
      return {
        value: value.ID,
        label: value.post_title
      };
    });
    var strings = wpforms_gutenberg_form_selector.strings;
    var jsx;
    formOptions.unshift({
      value: '',
      label: wpforms_gutenberg_form_selector.strings.form_select
    });
    function selectForm(value) {
      // eslint-disable-line jsdoc/require-jsdoc
      setAttributes({
        formId: value
      });
    }
    function toggleDisplayTitle(value) {
      // eslint-disable-line jsdoc/require-jsdoc
      setAttributes({
        displayTitle: value
      });
    }
    function toggleDisplayDesc(value) {
      // eslint-disable-line jsdoc/require-jsdoc
      setAttributes({
        displayDesc: value
      });
    }

    /**
     * Get block empty JSX code.
     *
     * @since 1.8.3
     *
     * @param {Object} blockProps Block properties.
     *
     * @return {JSX.Element} Block empty JSX code.
     */
    function getEmptyFormsPreview(blockProps) {
      var clientId = blockProps.clientId;
      return /*#__PURE__*/React.createElement(Fragment, {
        key: "wpforms-gutenberg-form-selector-fragment-block-empty"
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-no-form-preview"
      }, /*#__PURE__*/React.createElement("img", {
        src: wpforms_gutenberg_form_selector.block_empty_url,
        alt: ""
      }), /*#__PURE__*/React.createElement("p", {
        dangerouslySetInnerHTML: {
          __html: strings.wpforms_empty_info
        }
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "get-started-button components-button is-button is-primary",
        onClick: function onClick() {
          openBuilderPopup(clientId);
        }
      }, __('Get Started', 'wpforms-lite')), /*#__PURE__*/React.createElement("p", {
        className: "empty-desc",
        dangerouslySetInnerHTML: {
          __html: strings.wpforms_empty_help
        }
      }), /*#__PURE__*/React.createElement("div", {
        id: "wpforms-gutenberg-popup",
        className: "wpforms-builder-popup"
      }, /*#__PURE__*/React.createElement("iframe", {
        src: "about:blank",
        width: "100%",
        height: "100%",
        id: "wpforms-builder-iframe",
        title: "wpforms-gutenberg-popup"
      }))));
    }

    /**
     * Print empty forms notice.
     *
     * @since 1.8.3
     *
     * @param {string} clientId Block client ID.
     *
     * @return {JSX.Element} Field styles JSX code.
     */
    function printEmptyFormsNotice(clientId) {
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
        className: "get-started-button components-button is-button is-secondary",
        onClick: function onClick() {
          openBuilderPopup(clientId);
        }
      }, __('Get Started', 'wpforms-lite'))));
    }

    /**
     * Get styling panels preview.
     *
     * @since 1.8.8
     *
     * @return {JSX.Element} JSX code.
     */
    function getStylingPanelsPreview() {
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(PanelBody, {
        className: "wpforms-gutenberg-panel disabled_panel",
        title: strings.themes
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-panel-preview wpforms-panel-preview-themes"
      })), /*#__PURE__*/React.createElement(PanelBody, {
        className: "wpforms-gutenberg-panel disabled_panel",
        title: strings.field_styles
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-panel-preview wpforms-panel-preview-field"
      })), /*#__PURE__*/React.createElement(PanelBody, {
        className: "wpforms-gutenberg-panel disabled_panel",
        title: strings.label_styles
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-panel-preview wpforms-panel-preview-label"
      })), /*#__PURE__*/React.createElement(PanelBody, {
        className: "wpforms-gutenberg-panel disabled_panel",
        title: strings.button_styles
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-panel-preview wpforms-panel-preview-button"
      })), /*#__PURE__*/React.createElement(PanelBody, {
        className: "wpforms-gutenberg-panel disabled_panel",
        title: strings.container_styles
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-panel-preview wpforms-panel-preview-container"
      })), /*#__PURE__*/React.createElement(PanelBody, {
        className: "wpforms-gutenberg-panel disabled_panel",
        title: strings.background_styles
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-panel-preview wpforms-panel-preview-background"
      })));
    }
    if (!hasForms()) {
      jsx = [printEmptyFormsNotice(props.clientId)];
      jsx.push(getEmptyFormsPreview(props));
      return jsx;
    }
    jsx = [/*#__PURE__*/React.createElement(InspectorControls, {
      key: "wpforms-gutenberg-form-selector-inspector-controls"
    }, /*#__PURE__*/React.createElement(PanelBody, {
      title: wpforms_gutenberg_form_selector.strings.form_settings
    }, /*#__PURE__*/React.createElement(SelectControl, {
      label: wpforms_gutenberg_form_selector.strings.form_selected,
      value: formId,
      options: formOptions,
      onChange: selectForm
    }), /*#__PURE__*/React.createElement(ToggleControl, {
      label: wpforms_gutenberg_form_selector.strings.show_title,
      checked: displayTitle,
      onChange: toggleDisplayTitle
    }), /*#__PURE__*/React.createElement(ToggleControl, {
      label: wpforms_gutenberg_form_selector.strings.show_description,
      checked: displayDesc,
      onChange: toggleDisplayDesc
    }), /*#__PURE__*/React.createElement("p", {
      className: "wpforms-gutenberg-panel-notice wpforms-warning"
    }, /*#__PURE__*/React.createElement("strong", null, strings.update_wp_notice_head), strings.update_wp_notice_text, " ", /*#__PURE__*/React.createElement("a", {
      href: strings.update_wp_notice_link,
      rel: "noreferrer",
      target: "_blank"
    }, strings.learn_more))), getStylingPanelsPreview())];
    if (formId) {
      jsx.push( /*#__PURE__*/React.createElement(ServerSideRender, {
        key: "wpforms-gutenberg-form-selector-server-side-renderer",
        block: "wpforms/form-selector",
        attributes: props.attributes
      }));
    } else if (preview) {
      jsx.push( /*#__PURE__*/React.createElement(Fragment, {
        key: "wpforms-gutenberg-form-selector-fragment-block-preview"
      }, /*#__PURE__*/React.createElement("img", {
        src: wpforms_gutenberg_form_selector.block_preview_url,
        style: {
          width: '100%'
        },
        alt: ""
      })));
    } else {
      jsx.push( /*#__PURE__*/React.createElement(Placeholder, {
        key: "wpforms-gutenberg-form-selector-wrap",
        className: "wpforms-gutenberg-form-selector-wrap"
      }, /*#__PURE__*/React.createElement("img", {
        src: wpforms_gutenberg_form_selector.logo_url,
        alt: ""
      }), /*#__PURE__*/React.createElement(SelectControl, {
        key: "wpforms-gutenberg-form-selector-select-control",
        value: formId,
        options: formOptions,
        onChange: selectForm
      })));
    }
    return jsx;
  },
  save: function save() {
    return null;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfd3AiLCJ3cCIsIl93cCRzZXJ2ZXJTaWRlUmVuZGVyIiwic2VydmVyU2lkZVJlbmRlciIsIlNlcnZlclNpZGVSZW5kZXIiLCJjb21wb25lbnRzIiwiX3dwJGVsZW1lbnQiLCJlbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsIkZyYWdtZW50IiwicmVnaXN0ZXJCbG9ja1R5cGUiLCJibG9ja3MiLCJfcmVmIiwiYmxvY2tFZGl0b3IiLCJlZGl0b3IiLCJJbnNwZWN0b3JDb250cm9scyIsIl93cCRjb21wb25lbnRzIiwiU2VsZWN0Q29udHJvbCIsIlRvZ2dsZUNvbnRyb2wiLCJQYW5lbEJvZHkiLCJQbGFjZWhvbGRlciIsIl9fIiwiaTE4biIsIndwZm9ybXNJY29uIiwid2lkdGgiLCJoZWlnaHQiLCJ2aWV3Qm94IiwiY2xhc3NOYW1lIiwiZmlsbCIsImQiLCIkcG9wdXAiLCJidWlsZGVyQ2xvc2VCdXR0b25FdmVudCIsImNsaWVudElEIiwib2ZmIiwib24iLCJlIiwiYWN0aW9uIiwiZm9ybUlkIiwiZm9ybVRpdGxlIiwibmV3QmxvY2siLCJjcmVhdGVCbG9jayIsInRvU3RyaW5nIiwid3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvciIsImZvcm1zIiwiSUQiLCJwb3N0X3RpdGxlIiwiZGF0YSIsImRpc3BhdGNoIiwicmVtb3ZlQmxvY2siLCJpbnNlcnRCbG9ja3MiLCJsb2FkQ2hvaWNlSlMiLCJ3aW5kb3ciLCJDaG9pY2VzIiwiJGZvcm0iLCJqUXVlcnkiLCJkZXRhaWwiLCJibG9jayIsInF1ZXJ5U2VsZWN0b3IiLCJjb25jYXQiLCJjb25maWciLCJ3cGZvcm1zX2Nob2ljZXNqc19jb25maWciLCJmaW5kIiwiZWFjaCIsImluZGV4IiwiSFRNTFNlbGVjdEVsZW1lbnQiLCIkZWwiLCIkZmllbGQiLCJjbG9zZXN0IiwiY2FsbGJhY2tPbkluaXQiLCJzZWxmIiwiJGVsZW1lbnQiLCJwYXNzZWRFbGVtZW50IiwiJGlucHV0IiwiaW5wdXQiLCJzaXplQ2xhc3MiLCJjb250YWluZXJPdXRlciIsImFkZENsYXNzIiwicHJvcCIsImF0dHIiLCJnZXRWYWx1ZSIsImxlbmd0aCIsInJlbW92ZUF0dHIiLCJkaXNhYmxlIiwicmVtb3ZlQ2xhc3MiLCJ2YWwiLCJwYXJlbnQiLCJvcGVuQnVpbGRlclBvcHVwIiwiaXNFbXB0eU9iamVjdCIsInRtcGwiLCJhZnRlciIsInNpYmxpbmdzIiwidXJsIiwiZ2V0X3N0YXJ0ZWRfdXJsIiwiJGlmcmFtZSIsImZhZGVJbiIsImhhc0Zvcm1zIiwidGl0bGUiLCJzdHJpbmdzIiwiZGVzY3JpcHRpb24iLCJpY29uIiwia2V5d29yZHMiLCJmb3JtX2tleXdvcmRzIiwiY2F0ZWdvcnkiLCJhdHRyaWJ1dGVzIiwidHlwZSIsImRpc3BsYXlUaXRsZSIsImRpc3BsYXlEZXNjIiwicHJldmlldyIsImV4YW1wbGUiLCJzdXBwb3J0cyIsImN1c3RvbUNsYXNzTmFtZSIsImVkaXQiLCJwcm9wcyIsIl9wcm9wcyRhdHRyaWJ1dGVzIiwiX3Byb3BzJGF0dHJpYnV0ZXMkZm9yIiwiX3Byb3BzJGF0dHJpYnV0ZXMkZGlzIiwiX3Byb3BzJGF0dHJpYnV0ZXMkZGlzMiIsIl9wcm9wcyRhdHRyaWJ1dGVzJHByZSIsInNldEF0dHJpYnV0ZXMiLCJmb3JtT3B0aW9ucyIsIm1hcCIsInZhbHVlIiwibGFiZWwiLCJqc3giLCJ1bnNoaWZ0IiwiZm9ybV9zZWxlY3QiLCJzZWxlY3RGb3JtIiwidG9nZ2xlRGlzcGxheVRpdGxlIiwidG9nZ2xlRGlzcGxheURlc2MiLCJnZXRFbXB0eUZvcm1zUHJldmlldyIsImJsb2NrUHJvcHMiLCJjbGllbnRJZCIsIlJlYWN0Iiwia2V5Iiwic3JjIiwiYmxvY2tfZW1wdHlfdXJsIiwiYWx0IiwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwiLCJfX2h0bWwiLCJ3cGZvcm1zX2VtcHR5X2luZm8iLCJvbkNsaWNrIiwid3Bmb3Jtc19lbXB0eV9oZWxwIiwiaWQiLCJwcmludEVtcHR5Rm9ybXNOb3RpY2UiLCJmb3JtX3NldHRpbmdzIiwic3R5bGUiLCJkaXNwbGF5IiwiZ2V0U3R5bGluZ1BhbmVsc1ByZXZpZXciLCJ0aGVtZXMiLCJmaWVsZF9zdHlsZXMiLCJsYWJlbF9zdHlsZXMiLCJidXR0b25fc3R5bGVzIiwiY29udGFpbmVyX3N0eWxlcyIsImJhY2tncm91bmRfc3R5bGVzIiwicHVzaCIsImZvcm1fc2VsZWN0ZWQiLCJvcHRpb25zIiwib25DaGFuZ2UiLCJzaG93X3RpdGxlIiwiY2hlY2tlZCIsInNob3dfZGVzY3JpcHRpb24iLCJ1cGRhdGVfd3Bfbm90aWNlX2hlYWQiLCJ1cGRhdGVfd3Bfbm90aWNlX3RleHQiLCJocmVmIiwidXBkYXRlX3dwX25vdGljZV9saW5rIiwicmVsIiwidGFyZ2V0IiwibGVhcm5fbW9yZSIsImJsb2NrX3ByZXZpZXdfdXJsIiwibG9nb191cmwiLCJzYXZlIl0sInNvdXJjZXMiOlsiZmFrZV8yMzcxNjJhZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvciwgSlNYICovXG4vKiBqc2hpbnQgZXMzOiBmYWxzZSwgZXN2ZXJzaW9uOiA2ICovXG5cbi8qKlxuICogQHBhcmFtIHN0cmluZ3MudXBkYXRlX3dwX25vdGljZV9oZWFkXG4gKiBAcGFyYW0gc3RyaW5ncy51cGRhdGVfd3Bfbm90aWNlX3RleHRcbiAqIEBwYXJhbSBzdHJpbmdzLnVwZGF0ZV93cF9ub3RpY2VfbGlua1xuICogQHBhcmFtIHN0cmluZ3Mud3Bmb3Jtc19lbXB0eV9oZWxwXG4gKiBAcGFyYW0gc3RyaW5ncy53cGZvcm1zX2VtcHR5X2luZm9cbiAqL1xuXG5jb25zdCB7IHNlcnZlclNpZGVSZW5kZXI6IFNlcnZlclNpZGVSZW5kZXIgPSB3cC5jb21wb25lbnRzLlNlcnZlclNpZGVSZW5kZXIgfSA9IHdwO1xuY29uc3QgeyBjcmVhdGVFbGVtZW50LCBGcmFnbWVudCB9ID0gd3AuZWxlbWVudDtcbmNvbnN0IHsgcmVnaXN0ZXJCbG9ja1R5cGUgfSA9IHdwLmJsb2NrcztcbmNvbnN0IHsgSW5zcGVjdG9yQ29udHJvbHMgfSA9IHdwLmJsb2NrRWRpdG9yIHx8IHdwLmVkaXRvcjtcbmNvbnN0IHsgU2VsZWN0Q29udHJvbCwgVG9nZ2xlQ29udHJvbCwgUGFuZWxCb2R5LCBQbGFjZWhvbGRlciB9ID0gd3AuY29tcG9uZW50cztcbmNvbnN0IHsgX18gfSA9IHdwLmkxOG47XG5cbmNvbnN0IHdwZm9ybXNJY29uID0gY3JlYXRlRWxlbWVudCggJ3N2ZycsIHsgd2lkdGg6IDIwLCBoZWlnaHQ6IDIwLCB2aWV3Qm94OiAnMCAwIDYxMiA2MTInLCBjbGFzc05hbWU6ICdkYXNoaWNvbicgfSxcblx0Y3JlYXRlRWxlbWVudCggJ3BhdGgnLCB7XG5cdFx0ZmlsbDogJ2N1cnJlbnRDb2xvcicsXG5cdFx0ZDogJ001NDQsMEg2OEMzMC40NDUsMCwwLDMwLjQ0NSwwLDY4djQ3NmMwLDM3LjU1NiwzMC40NDUsNjgsNjgsNjhoNDc2YzM3LjU1NiwwLDY4LTMwLjQ0NCw2OC02OFY2OCBDNjEyLDMwLjQ0NSw1ODEuNTU2LDAsNTQ0LDB6IE00NjQuNDQsNjhMMzg3LjYsMTIwLjAyTDMyMy4zNCw2OEg0NjQuNDR6IE0yODguNjYsNjhsLTY0LjI2LDUyLjAyTDE0Ny41Niw2OEgyODguNjZ6IE01NDQsNTQ0SDY4IFY2OGgyMi4xbDEzNiw5Mi4xNGw3OS45LTY0LjZsNzkuNTYsNjQuNmwxMzYtOTIuMTRINTQ0VjU0NHogTTExNC4yNCwyNjMuMTZoOTUuODh2LTQ4LjI4aC05NS44OFYyNjMuMTZ6IE0xMTQuMjQsMzYwLjRoOTUuODggdi00OC42MmgtOTUuODhWMzYwLjR6IE0yNDIuNzYsMzYwLjRoMjU1di00OC42MmgtMjU1VjM2MC40TDI0Mi43NiwzNjAuNHogTTI0Mi43NiwyNjMuMTZoMjU1di00OC4yOGgtMjU1VjI2My4xNkwyNDIuNzYsMjYzLjE2eiBNMzY4LjIyLDQ1Ny4zaDEyOS41NFY0MDhIMzY4LjIyVjQ1Ny4zeicsXG5cdH0gKVxuKTtcblxuLyoqXG4gKiBQb3B1cCBjb250YWluZXIuXG4gKlxuICogQHNpbmNlIDEuOC4zXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xubGV0ICRwb3B1cCA9IHt9O1xuXG4vKipcbiAqIENsb3NlIGJ1dHRvbiAoaW5zaWRlIHRoZSBmb3JtIGJ1aWxkZXIpIGNsaWNrIGV2ZW50LlxuICpcbiAqIEBzaW5jZSAxLjguM1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbGllbnRJRCBCbG9jayBDbGllbnQgSUQuXG4gKi9cbmNvbnN0IGJ1aWxkZXJDbG9zZUJ1dHRvbkV2ZW50ID0gZnVuY3Rpb24oIGNsaWVudElEICkge1xuXHQkcG9wdXBcblx0XHQub2ZmKCAnd3Bmb3Jtc0J1aWxkZXJJblBvcHVwQ2xvc2UnIClcblx0XHQub24oICd3cGZvcm1zQnVpbGRlckluUG9wdXBDbG9zZScsIGZ1bmN0aW9uKCBlLCBhY3Rpb24sIGZvcm1JZCwgZm9ybVRpdGxlICkge1xuXHRcdFx0aWYgKCBhY3Rpb24gIT09ICdzYXZlZCcgfHwgISBmb3JtSWQgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSW5zZXJ0IGEgbmV3IGJsb2NrIHdoZW4gYSBuZXcgZm9ybSBpcyBjcmVhdGVkIGZyb20gdGhlIHBvcHVwIHRvIHVwZGF0ZSB0aGUgZm9ybSBsaXN0IGFuZCBhdHRyaWJ1dGVzLlxuXHRcdFx0Y29uc3QgbmV3QmxvY2sgPSB3cC5ibG9ja3MuY3JlYXRlQmxvY2soICd3cGZvcm1zL2Zvcm0tc2VsZWN0b3InLCB7XG5cdFx0XHRcdGZvcm1JZDogZm9ybUlkLnRvU3RyaW5nKCksIC8vIEV4cGVjdHMgc3RyaW5nIHZhbHVlLCBtYWtlIHN1cmUgd2UgaW5zZXJ0IHN0cmluZy5cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuXHRcdFx0d3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvci5mb3JtcyA9IFsgeyBJRDogZm9ybUlkLCBwb3N0X3RpdGxlOiBmb3JtVGl0bGUgfSBdO1xuXG5cdFx0XHQvLyBJbnNlcnQgYSBuZXcgYmxvY2suXG5cdFx0XHR3cC5kYXRhLmRpc3BhdGNoKCAnY29yZS9ibG9jay1lZGl0b3InICkucmVtb3ZlQmxvY2soIGNsaWVudElEICk7XG5cdFx0XHR3cC5kYXRhLmRpc3BhdGNoKCAnY29yZS9ibG9jay1lZGl0b3InICkuaW5zZXJ0QmxvY2tzKCBuZXdCbG9jayApO1xuXHRcdH0gKTtcbn07XG5cbi8qKlxuICogSW5pdCBNb2Rlcm4gc3R5bGUgRHJvcGRvd24gZmllbGRzICg8c2VsZWN0Pikgd2l0aCBjaG9pY2VKUy5cbiAqXG4gKiBAc2luY2UgMS45LjBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZSBCbG9jayBEZXRhaWxzLlxuICovXG5jb25zdCBsb2FkQ2hvaWNlSlMgPSBmdW5jdGlvbiggZSApIHtcblx0aWYgKCB0eXBlb2Ygd2luZG93LkNob2ljZXMgIT09ICdmdW5jdGlvbicgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgJGZvcm0gPSBqUXVlcnkoIGUuZGV0YWlsLmJsb2NrLnF1ZXJ5U2VsZWN0b3IoIGAjd3Bmb3Jtcy0keyBlLmRldGFpbC5mb3JtSWQgfWAgKSApO1xuXHRjb25zdCBjb25maWcgPSB3aW5kb3cud3Bmb3Jtc19jaG9pY2VzanNfY29uZmlnIHx8IHt9O1xuXG5cdCRmb3JtLmZpbmQoICcuY2hvaWNlc2pzLXNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbiggaW5kZXgsIGVsZW1lbnQgKSB7XG5cdFx0aWYgKCAhICggZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50ICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGVsID0galF1ZXJ5KCBlbGVtZW50ICk7XG5cblx0XHRpZiAoICRlbC5kYXRhKCAnY2hvaWNlc2pzJyApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICRlbC5jbG9zZXN0KCAnLndwZm9ybXMtZmllbGQnICk7XG5cblx0XHRjb25maWcuY2FsbGJhY2tPbkluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHNlbGYgPSB0aGlzLFxuXHRcdFx0XHQkZWxlbWVudCA9IGpRdWVyeSggc2VsZi5wYXNzZWRFbGVtZW50LmVsZW1lbnQgKSxcblx0XHRcdFx0JGlucHV0ID0galF1ZXJ5KCBzZWxmLmlucHV0LmVsZW1lbnQgKSxcblx0XHRcdFx0c2l6ZUNsYXNzID0gJGVsZW1lbnQuZGF0YSggJ3NpemUtY2xhc3MnICk7XG5cblx0XHRcdC8vIEFkZCBDU1MtY2xhc3MgZm9yIHNpemUuXG5cdFx0XHRpZiAoIHNpemVDbGFzcyApIHtcblx0XHRcdFx0alF1ZXJ5KCBzZWxmLmNvbnRhaW5lck91dGVyLmVsZW1lbnQgKS5hZGRDbGFzcyggc2l6ZUNsYXNzICk7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSWYgYSBtdWx0aXBsZSBzZWxlY3QgaGFzIHNlbGVjdGVkIGNob2ljZXMgLSBoaWRlIGEgcGxhY2Vob2xkZXIgdGV4dC5cblx0XHRcdCAqIEluIGNhc2UgaWYgc2VsZWN0IGlzIGVtcHR5IC0gd2UgcmV0dXJuIHBsYWNlaG9sZGVyIHRleHQuXG5cdFx0XHQgKi9cblx0XHRcdGlmICggJGVsZW1lbnQucHJvcCggJ211bHRpcGxlJyApICkge1xuXHRcdFx0XHQvLyBPbiBpbml0IGV2ZW50LlxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3BsYWNlaG9sZGVyJywgJGlucHV0LmF0dHIoICdwbGFjZWhvbGRlcicgKSApO1xuXG5cdFx0XHRcdGlmICggc2VsZi5nZXRWYWx1ZSggdHJ1ZSApLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlQXR0ciggJ3BsYWNlaG9sZGVyJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZGlzYWJsZSgpO1xuXHRcdFx0JGZpZWxkLmZpbmQoICcuaXMtZGlzYWJsZWQnICkucmVtb3ZlQ2xhc3MoICdpcy1kaXNhYmxlZCcgKTtcblx0XHR9O1xuXG5cdFx0JGVsLmRhdGEoICdjaG9pY2VzanMnLCBuZXcgd2luZG93LkNob2ljZXMoIGVsZW1lbnQsIGNvbmZpZyApICk7XG5cblx0XHQvLyBQbGFjZWhvbGRlciBmaXggb24gaWZyYW1lcy5cblx0XHRpZiAoICRlbC52YWwoKSApIHtcblx0XHRcdCRlbC5wYXJlbnQoKS5maW5kKCAnLmNob2ljZXNfX2lucHV0JyApLmF0dHIoICdzdHlsZScsICdkaXNwbGF5OiBub25lICFpbXBvcnRhbnQnICk7XG5cdFx0fVxuXHR9ICk7XG59O1xuXG4vLyBvbiBkb2N1bWVudCByZWFkeVxualF1ZXJ5KCBmdW5jdGlvbigpIHtcblx0alF1ZXJ5KCB3aW5kb3cgKS5vbiggJ3dwZm9ybXNGb3JtU2VsZWN0b3JGb3JtTG9hZGVkJywgbG9hZENob2ljZUpTICk7XG59ICk7XG4vKipcbiAqIE9wZW4gYnVpbGRlciBwb3B1cC5cbiAqXG4gKiBAc2luY2UgMS42LjJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xpZW50SUQgQmxvY2sgQ2xpZW50IElELlxuICovXG5jb25zdCBvcGVuQnVpbGRlclBvcHVwID0gZnVuY3Rpb24oIGNsaWVudElEICkge1xuXHRpZiAoIGpRdWVyeS5pc0VtcHR5T2JqZWN0KCAkcG9wdXAgKSApIHtcblx0XHRjb25zdCB0bXBsID0galF1ZXJ5KCAnI3dwZm9ybXMtZ3V0ZW5iZXJnLXBvcHVwJyApO1xuXHRcdGNvbnN0IHBhcmVudCA9IGpRdWVyeSggJyN3cHdyYXAnICk7XG5cblx0XHRwYXJlbnQuYWZ0ZXIoIHRtcGwgKTtcblxuXHRcdCRwb3B1cCA9IHBhcmVudC5zaWJsaW5ncyggJyN3cGZvcm1zLWd1dGVuYmVyZy1wb3B1cCcgKTtcblx0fVxuXG5cdGNvbnN0IHVybCA9IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IuZ2V0X3N0YXJ0ZWRfdXJsLFxuXHRcdCRpZnJhbWUgPSAkcG9wdXAuZmluZCggJ2lmcmFtZScgKTtcblxuXHRidWlsZGVyQ2xvc2VCdXR0b25FdmVudCggY2xpZW50SUQgKTtcblx0JGlmcmFtZS5hdHRyKCAnc3JjJywgdXJsICk7XG5cdCRwb3B1cC5mYWRlSW4oKTtcbn07XG5cbmNvbnN0IGhhc0Zvcm1zID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLmZvcm1zLmxlbmd0aCA+IDA7XG59O1xuXG5yZWdpc3RlckJsb2NrVHlwZSggJ3dwZm9ybXMvZm9ybS1zZWxlY3RvcicsIHtcblx0dGl0bGU6IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3Iuc3RyaW5ncy50aXRsZSxcblx0ZGVzY3JpcHRpb246IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3Iuc3RyaW5ncy5kZXNjcmlwdGlvbixcblx0aWNvbjogd3Bmb3Jtc0ljb24sXG5cdGtleXdvcmRzOiB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLnN0cmluZ3MuZm9ybV9rZXl3b3Jkcyxcblx0Y2F0ZWdvcnk6ICd3aWRnZXRzJyxcblx0YXR0cmlidXRlczoge1xuXHRcdGZvcm1JZDoge1xuXHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0fSxcblx0XHRkaXNwbGF5VGl0bGU6IHtcblx0XHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHR9LFxuXHRcdGRpc3BsYXlEZXNjOiB7XG5cdFx0XHR0eXBlOiAnYm9vbGVhbicsXG5cdFx0fSxcblx0XHRwcmV2aWV3OiB7XG5cdFx0XHR0eXBlOiAnYm9vbGVhbicsXG5cdFx0fSxcblx0fSxcblx0ZXhhbXBsZToge1xuXHRcdGF0dHJpYnV0ZXM6IHtcblx0XHRcdHByZXZpZXc6IHRydWUsXG5cdFx0fSxcblx0fSxcblx0c3VwcG9ydHM6IHtcblx0XHRjdXN0b21DbGFzc05hbWU6IGhhc0Zvcm1zKCksXG5cdH0sXG5cdGVkaXQoIHByb3BzICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1saW5lcy1wZXItZnVuY3Rpb25cblx0XHRjb25zdCB7IGF0dHJpYnV0ZXM6IHsgZm9ybUlkID0gJycsIGRpc3BsYXlUaXRsZSA9IGZhbHNlLCBkaXNwbGF5RGVzYyA9IGZhbHNlLCBwcmV2aWV3ID0gZmFsc2UgfSwgc2V0QXR0cmlidXRlcyB9ID0gcHJvcHM7XG5cdFx0Y29uc3QgZm9ybU9wdGlvbnMgPSB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLmZvcm1zLm1hcCggKCB2YWx1ZSApID0+IChcblx0XHRcdHsgdmFsdWU6IHZhbHVlLklELCBsYWJlbDogdmFsdWUucG9zdF90aXRsZSB9XG5cdFx0KSApO1xuXG5cdFx0Y29uc3Qgc3RyaW5ncyA9IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3Iuc3RyaW5ncztcblx0XHRsZXQganN4O1xuXG5cdFx0Zm9ybU9wdGlvbnMudW5zaGlmdCggeyB2YWx1ZTogJycsIGxhYmVsOiB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLnN0cmluZ3MuZm9ybV9zZWxlY3QgfSApO1xuXG5cdFx0ZnVuY3Rpb24gc2VsZWN0Rm9ybSggdmFsdWUgKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUganNkb2MvcmVxdWlyZS1qc2RvY1xuXHRcdFx0c2V0QXR0cmlidXRlcyggeyBmb3JtSWQ6IHZhbHVlIH0gKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVEaXNwbGF5VGl0bGUoIHZhbHVlICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGpzZG9jL3JlcXVpcmUtanNkb2Ncblx0XHRcdHNldEF0dHJpYnV0ZXMoIHsgZGlzcGxheVRpdGxlOiB2YWx1ZSB9ICk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlRGlzcGxheURlc2MoIHZhbHVlICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGpzZG9jL3JlcXVpcmUtanNkb2Ncblx0XHRcdHNldEF0dHJpYnV0ZXMoIHsgZGlzcGxheURlc2M6IHZhbHVlIH0gKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBHZXQgYmxvY2sgZW1wdHkgSlNYIGNvZGUuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44LjNcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBibG9ja1Byb3BzIEJsb2NrIHByb3BlcnRpZXMuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtKU1guRWxlbWVudH0gQmxvY2sgZW1wdHkgSlNYIGNvZGUuXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gZ2V0RW1wdHlGb3Jtc1ByZXZpZXcoIGJsb2NrUHJvcHMgKSB7XG5cdFx0XHRjb25zdCBjbGllbnRJZCA9IGJsb2NrUHJvcHMuY2xpZW50SWQ7XG5cblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxGcmFnbWVudFxuXHRcdFx0XHRcdGtleT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItZnJhZ21lbnQtYmxvY2stZW1wdHlcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIndwZm9ybXMtbm8tZm9ybS1wcmV2aWV3XCI+XG5cdFx0XHRcdFx0XHQ8aW1nIHNyYz17IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IuYmxvY2tfZW1wdHlfdXJsIH0gYWx0PVwiXCIgLz5cblx0XHRcdFx0XHRcdDxwIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXsgeyBfX2h0bWw6IHN0cmluZ3Mud3Bmb3Jtc19lbXB0eV9pbmZvIH0gfT48L3A+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJnZXQtc3RhcnRlZC1idXR0b24gY29tcG9uZW50cy1idXR0b24gaXMtYnV0dG9uIGlzLXByaW1hcnlcIlxuXHRcdFx0XHRcdFx0XHRvbkNsaWNrPXtcblx0XHRcdFx0XHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvcGVuQnVpbGRlclBvcHVwKCBjbGllbnRJZCApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHR7IF9fKCAnR2V0IFN0YXJ0ZWQnLCAnd3Bmb3Jtcy1saXRlJyApIH1cblx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwiZW1wdHktZGVzY1wiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXsgeyBfX2h0bWw6IHN0cmluZ3Mud3Bmb3Jtc19lbXB0eV9oZWxwIH0gfT48L3A+XG5cblx0XHRcdFx0XHRcdHsgLyogVGVtcGxhdGUgZm9yIHBvcHVwIHdpdGggYnVpbGRlciBpZnJhbWUgKi8gfVxuXHRcdFx0XHRcdFx0PGRpdiBpZD1cIndwZm9ybXMtZ3V0ZW5iZXJnLXBvcHVwXCIgY2xhc3NOYW1lPVwid3Bmb3Jtcy1idWlsZGVyLXBvcHVwXCI+XG5cdFx0XHRcdFx0XHRcdDxpZnJhbWUgc3JjPVwiYWJvdXQ6YmxhbmtcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgaWQ9XCJ3cGZvcm1zLWJ1aWxkZXItaWZyYW1lXCIgdGl0bGU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1wb3B1cFwiPjwvaWZyYW1lPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDwvRnJhZ21lbnQ+XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFByaW50IGVtcHR5IGZvcm1zIG5vdGljZS5cblx0XHQgKlxuXHRcdCAqIEBzaW5jZSAxLjguM1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGNsaWVudElkIEJsb2NrIGNsaWVudCBJRC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge0pTWC5FbGVtZW50fSBGaWVsZCBzdHlsZXMgSlNYIGNvZGUuXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gcHJpbnRFbXB0eUZvcm1zTm90aWNlKCBjbGllbnRJZCApIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxJbnNwZWN0b3JDb250cm9scyBrZXk9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWluc3BlY3Rvci1tYWluLXNldHRpbmdzXCI+XG5cdFx0XHRcdFx0PFBhbmVsQm9keSBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1wYW5lbFwiIHRpdGxlPXsgc3RyaW5ncy5mb3JtX3NldHRpbmdzIH0+XG5cdFx0XHRcdFx0XHQ8cCBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1wYW5lbC1ub3RpY2Ugd3Bmb3Jtcy13YXJuaW5nIHdwZm9ybXMtZW1wdHktZm9ybS1ub3RpY2VcIiBzdHlsZT17IHsgZGlzcGxheTogJ2Jsb2NrJyB9IH0+XG5cdFx0XHRcdFx0XHRcdDxzdHJvbmc+eyBfXyggJ1lvdSBoYXZlbuKAmXQgY3JlYXRlZCBhIGZvcm0sIHlldCEnLCAnd3Bmb3Jtcy1saXRlJyApIH08L3N0cm9uZz5cblx0XHRcdFx0XHRcdFx0eyBfXyggJ1doYXQgYXJlIHlvdSB3YWl0aW5nIGZvcj8nLCAnd3Bmb3Jtcy1saXRlJyApIH1cblx0XHRcdFx0XHRcdDwvcD5cblx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImdldC1zdGFydGVkLWJ1dHRvbiBjb21wb25lbnRzLWJ1dHRvbiBpcy1idXR0b24gaXMtc2Vjb25kYXJ5XCJcblx0XHRcdFx0XHRcdFx0b25DbGljaz17XG5cdFx0XHRcdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0b3BlbkJ1aWxkZXJQb3B1cCggY2xpZW50SWQgKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdFx0eyBfXyggJ0dldCBTdGFydGVkJywgJ3dwZm9ybXMtbGl0ZScgKSB9XG5cdFx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8L1BhbmVsQm9keT5cblx0XHRcdFx0PC9JbnNwZWN0b3JDb250cm9scz5cblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IHN0eWxpbmcgcGFuZWxzIHByZXZpZXcuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44Ljhcblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge0pTWC5FbGVtZW50fSBKU1ggY29kZS5cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBnZXRTdHlsaW5nUGFuZWxzUHJldmlldygpIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxGcmFnbWVudD5cblx0XHRcdFx0XHQ8UGFuZWxCb2R5IGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLXBhbmVsIGRpc2FibGVkX3BhbmVsXCIgdGl0bGU9eyBzdHJpbmdzLnRoZW1lcyB9PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ3cGZvcm1zLXBhbmVsLXByZXZpZXcgd3Bmb3Jtcy1wYW5lbC1wcmV2aWV3LXRoZW1lc1wiPjwvZGl2PlxuXHRcdFx0XHRcdDwvUGFuZWxCb2R5PlxuXHRcdFx0XHRcdDxQYW5lbEJvZHkgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctcGFuZWwgZGlzYWJsZWRfcGFuZWxcIiB0aXRsZT17IHN0cmluZ3MuZmllbGRfc3R5bGVzIH0+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIndwZm9ybXMtcGFuZWwtcHJldmlldyB3cGZvcm1zLXBhbmVsLXByZXZpZXctZmllbGRcIj48L2Rpdj5cblx0XHRcdFx0XHQ8L1BhbmVsQm9keT5cblx0XHRcdFx0XHQ8UGFuZWxCb2R5IGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLXBhbmVsIGRpc2FibGVkX3BhbmVsXCIgdGl0bGU9eyBzdHJpbmdzLmxhYmVsX3N0eWxlcyB9PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ3cGZvcm1zLXBhbmVsLXByZXZpZXcgd3Bmb3Jtcy1wYW5lbC1wcmV2aWV3LWxhYmVsXCI+PC9kaXY+XG5cdFx0XHRcdFx0PC9QYW5lbEJvZHk+XG5cdFx0XHRcdFx0PFBhbmVsQm9keSBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1wYW5lbCBkaXNhYmxlZF9wYW5lbFwiIHRpdGxlPXsgc3RyaW5ncy5idXR0b25fc3R5bGVzIH0+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIndwZm9ybXMtcGFuZWwtcHJldmlldyB3cGZvcm1zLXBhbmVsLXByZXZpZXctYnV0dG9uXCI+PC9kaXY+XG5cdFx0XHRcdFx0PC9QYW5lbEJvZHk+XG5cdFx0XHRcdFx0PFBhbmVsQm9keSBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1wYW5lbCBkaXNhYmxlZF9wYW5lbFwiIHRpdGxlPXsgc3RyaW5ncy5jb250YWluZXJfc3R5bGVzIH0+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIndwZm9ybXMtcGFuZWwtcHJldmlldyB3cGZvcm1zLXBhbmVsLXByZXZpZXctY29udGFpbmVyXCI+PC9kaXY+XG5cdFx0XHRcdFx0PC9QYW5lbEJvZHk+XG5cdFx0XHRcdFx0PFBhbmVsQm9keSBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1wYW5lbCBkaXNhYmxlZF9wYW5lbFwiIHRpdGxlPXsgc3RyaW5ncy5iYWNrZ3JvdW5kX3N0eWxlcyB9PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ3cGZvcm1zLXBhbmVsLXByZXZpZXcgd3Bmb3Jtcy1wYW5lbC1wcmV2aWV3LWJhY2tncm91bmRcIj48L2Rpdj5cblx0XHRcdFx0XHQ8L1BhbmVsQm9keT5cblx0XHRcdFx0PC9GcmFnbWVudD5cblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0aWYgKCAhIGhhc0Zvcm1zKCkgKSB7XG5cdFx0XHRqc3ggPSBbIHByaW50RW1wdHlGb3Jtc05vdGljZSggcHJvcHMuY2xpZW50SWQgKSBdO1xuXG5cdFx0XHRqc3gucHVzaCggZ2V0RW1wdHlGb3Jtc1ByZXZpZXcoIHByb3BzICkgKTtcblx0XHRcdHJldHVybiBqc3g7XG5cdFx0fVxuXG5cdFx0anN4ID0gW1xuXHRcdFx0PEluc3BlY3RvckNvbnRyb2xzIGtleT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItaW5zcGVjdG9yLWNvbnRyb2xzXCI+XG5cdFx0XHRcdDxQYW5lbEJvZHkgdGl0bGU9eyB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLnN0cmluZ3MuZm9ybV9zZXR0aW5ncyB9PlxuXHRcdFx0XHRcdDxTZWxlY3RDb250cm9sXG5cdFx0XHRcdFx0XHRsYWJlbD17IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3Iuc3RyaW5ncy5mb3JtX3NlbGVjdGVkIH1cblx0XHRcdFx0XHRcdHZhbHVlPXsgZm9ybUlkIH1cblx0XHRcdFx0XHRcdG9wdGlvbnM9eyBmb3JtT3B0aW9ucyB9XG5cdFx0XHRcdFx0XHRvbkNoYW5nZT17IHNlbGVjdEZvcm0gfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0PFRvZ2dsZUNvbnRyb2xcblx0XHRcdFx0XHRcdGxhYmVsPXsgd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvci5zdHJpbmdzLnNob3dfdGl0bGUgfVxuXHRcdFx0XHRcdFx0Y2hlY2tlZD17IGRpc3BsYXlUaXRsZSB9XG5cdFx0XHRcdFx0XHRvbkNoYW5nZT17IHRvZ2dsZURpc3BsYXlUaXRsZSB9XG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHQ8VG9nZ2xlQ29udHJvbFxuXHRcdFx0XHRcdFx0bGFiZWw9eyB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLnN0cmluZ3Muc2hvd19kZXNjcmlwdGlvbiB9XG5cdFx0XHRcdFx0XHRjaGVja2VkPXsgZGlzcGxheURlc2MgfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9eyB0b2dnbGVEaXNwbGF5RGVzYyB9XG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHQ8cCBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1wYW5lbC1ub3RpY2Ugd3Bmb3Jtcy13YXJuaW5nXCI+XG5cdFx0XHRcdFx0XHQ8c3Ryb25nPnsgc3RyaW5ncy51cGRhdGVfd3Bfbm90aWNlX2hlYWQgfTwvc3Ryb25nPlxuXHRcdFx0XHRcdFx0eyBzdHJpbmdzLnVwZGF0ZV93cF9ub3RpY2VfdGV4dCB9IDxhIGhyZWY9eyBzdHJpbmdzLnVwZGF0ZV93cF9ub3RpY2VfbGluayB9IHJlbD1cIm5vcmVmZXJyZXJcIiB0YXJnZXQ9XCJfYmxhbmtcIj57IHN0cmluZ3MubGVhcm5fbW9yZSB9PC9hPlxuXHRcdFx0XHRcdDwvcD5cblx0XHRcdFx0PC9QYW5lbEJvZHk+XG5cdFx0XHRcdHsgZ2V0U3R5bGluZ1BhbmVsc1ByZXZpZXcoKSB9XG5cdFx0XHQ8L0luc3BlY3RvckNvbnRyb2xzPixcblx0XHRdO1xuXG5cdFx0aWYgKCBmb3JtSWQgKSB7XG5cdFx0XHRqc3gucHVzaChcblx0XHRcdFx0PFNlcnZlclNpZGVSZW5kZXJcblx0XHRcdFx0XHRrZXk9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLXNlcnZlci1zaWRlLXJlbmRlcmVyXCJcblx0XHRcdFx0XHRibG9jaz1cIndwZm9ybXMvZm9ybS1zZWxlY3RvclwiXG5cdFx0XHRcdFx0YXR0cmlidXRlcz17IHByb3BzLmF0dHJpYnV0ZXMgfVxuXHRcdFx0XHQvPlxuXHRcdFx0KTtcblx0XHR9IGVsc2UgaWYgKCBwcmV2aWV3ICkge1xuXHRcdFx0anN4LnB1c2goXG5cdFx0XHRcdDxGcmFnbWVudFxuXHRcdFx0XHRcdGtleT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3ItZnJhZ21lbnQtYmxvY2stcHJldmlld1wiPlxuXHRcdFx0XHRcdDxpbWcgc3JjPXsgd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvci5ibG9ja19wcmV2aWV3X3VybCB9IHN0eWxlPXsgeyB3aWR0aDogJzEwMCUnIH0gfSBhbHQ9XCJcIiAvPlxuXHRcdFx0XHQ8L0ZyYWdtZW50PlxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0anN4LnB1c2goXG5cdFx0XHRcdDxQbGFjZWhvbGRlclxuXHRcdFx0XHRcdGtleT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3Itd3JhcFwiXG5cdFx0XHRcdFx0Y2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci13cmFwXCI+XG5cdFx0XHRcdFx0PGltZyBzcmM9eyB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLmxvZ29fdXJsIH0gYWx0PVwiXCIgLz5cblx0XHRcdFx0XHQ8U2VsZWN0Q29udHJvbFxuXHRcdFx0XHRcdFx0a2V5PVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1zZWxlY3QtY29udHJvbFwiXG5cdFx0XHRcdFx0XHR2YWx1ZT17IGZvcm1JZCB9XG5cdFx0XHRcdFx0XHRvcHRpb25zPXsgZm9ybU9wdGlvbnMgfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9eyBzZWxlY3RGb3JtIH1cblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8L1BsYWNlaG9sZGVyPlxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4ganN4O1xuXHR9LFxuXHRzYXZlKCkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9LFxufSApO1xuIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBQUEsR0FBQSxHQUFnRkMsRUFBRTtFQUFBQyxvQkFBQSxHQUFBRixHQUFBLENBQTFFRyxnQkFBZ0I7RUFBRUMsZ0JBQWdCLEdBQUFGLG9CQUFBLGNBQUdELEVBQUUsQ0FBQ0ksVUFBVSxDQUFDRCxnQkFBZ0IsR0FBQUYsb0JBQUE7QUFDM0UsSUFBQUksV0FBQSxHQUFvQ0wsRUFBRSxDQUFDTSxPQUFPO0VBQXRDQyxhQUFhLEdBQUFGLFdBQUEsQ0FBYkUsYUFBYTtFQUFFQyxRQUFRLEdBQUFILFdBQUEsQ0FBUkcsUUFBUTtBQUMvQixJQUFRQyxpQkFBaUIsR0FBS1QsRUFBRSxDQUFDVSxNQUFNLENBQS9CRCxpQkFBaUI7QUFDekIsSUFBQUUsSUFBQSxHQUE4QlgsRUFBRSxDQUFDWSxXQUFXLElBQUlaLEVBQUUsQ0FBQ2EsTUFBTTtFQUFqREMsaUJBQWlCLEdBQUFILElBQUEsQ0FBakJHLGlCQUFpQjtBQUN6QixJQUFBQyxjQUFBLEdBQWlFZixFQUFFLENBQUNJLFVBQVU7RUFBdEVZLGFBQWEsR0FBQUQsY0FBQSxDQUFiQyxhQUFhO0VBQUVDLGFBQWEsR0FBQUYsY0FBQSxDQUFiRSxhQUFhO0VBQUVDLFNBQVMsR0FBQUgsY0FB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
},{}]},{},[1])