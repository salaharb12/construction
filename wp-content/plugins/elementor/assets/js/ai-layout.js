/*! elementor - v3.26.0 - 22-12-2024 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../assets/dev/js/utils/react.js":
/*!***************************************!*\
  !*** ../assets/dev/js/utils/react.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var React = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var ReactDOM = _interopRequireWildcard(__webpack_require__(/*! react-dom */ "react-dom"));
var _client = __webpack_require__(/*! react-dom/client */ "../node_modules/react-dom/client.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Support conditional rendering of a React App to the DOM, based on the React version.
 * We use `createRoot` when available, but fallback to `ReactDOM.render` for older versions.
 *
 * @param { React.ReactElement } app        The app to render.
 * @param { HTMLElement }        domElement The DOM element to render the app into.
 *
 * @return {{ unmount: () => void }} The unmount function.
 */
function render(app, domElement) {
  var unmountFunction;
  try {
    var root = (0, _client.createRoot)(domElement);
    root.render(app);
    unmountFunction = function unmountFunction() {
      root.unmount();
    };
  } catch (e) {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(app, domElement);
    unmountFunction = function unmountFunction() {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.unmountComponentAtNode(domElement);
    };
  }
  return {
    unmount: unmountFunction
  };
}
var _default = exports["default"] = {
  render: render
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/ai-layout-behavior.js":
/*!************************************************************!*\
  !*** ../modules/ai/assets/js/editor/ai-layout-behavior.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "../node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "../node_modules/@babel/runtime/helpers/createClass.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "../node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "../node_modules/@babel/runtime/helpers/inherits.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _editorIntegration = __webpack_require__(/*! ./utils/editor-integration */ "../modules/ai/assets/js/editor/utils/editor-integration.js");
var _config = __webpack_require__(/*! ./pages/form-layout/context/config */ "../modules/ai/assets/js/editor/pages/form-layout/context/config.js");
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2.default)(o), (0, _possibleConstructorReturn2.default)(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2.default)(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var AiLayoutBehavior = exports["default"] = /*#__PURE__*/function (_Marionette$Behavior) {
  function AiLayoutBehavior() {
    var _this;
    (0, _classCallCheck2.default)(this, AiLayoutBehavior);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, AiLayoutBehavior, [].concat(args));
    (0, _defineProperty2.default)(_this, "previewContainer", null);
    return _this;
  }
  (0, _inherits2.default)(AiLayoutBehavior, _Marionette$Behavior);
  return (0, _createClass2.default)(AiLayoutBehavior, [{
    key: "ui",
    value: function ui() {
      return {
        aiButton: '.e-ai-layout-button',
        addTemplateButton: '.elementor-add-template-button'
      };
    }
  }, {
    key: "events",
    value: function events() {
      return {
        'click @ui.aiButton': 'onAiButtonClick'
      };
    }
  }, {
    key: "onAiButtonClick",
    value: function onAiButtonClick(e) {
      e.stopPropagation();
      window.elementorAiCurrentContext = this.getOption('context');
      (0, _editorIntegration.renderLayoutApp)({
        parentContainer: elementor.getPreviewContainer(),
        mode: _config.MODE_LAYOUT,
        at: this.view.getOption('at'),
        onInsert: this.onInsert.bind(this),
        onRenderApp: function onRenderApp(args) {
          args.previewContainer.init();
        },
        onGenerate: function onGenerate(args) {
          args.previewContainer.reset();
        }
      });
    }
  }, {
    key: "hideDropArea",
    value: function hideDropArea() {
      this.view.onCloseButtonClick();
    }
  }, {
    key: "onInsert",
    value: function onInsert(template) {
      this.hideDropArea();
      (0, _editorIntegration.importToEditor)({
        parentContainer: elementor.getPreviewContainer(),
        at: this.view.getOption('at'),
        template: template,
        historyTitle: (0, _i18n.__)('AI Layout', 'elementor')
      });
    }
  }, {
    key: "onRender",
    value: function onRender() {
      var $button = jQuery('<button>', {
        type: 'button',
        class: 'e-ai-layout-button elementor-add-section-area-button e-button-primary',
        title: (0, _i18n.__)('Build with AI', 'elementor'),
        'aria-label': (0, _i18n.__)('Build with AI', 'elementor')
      });
      $button.html("\n\t\t\t<div class=\"e-ai-layout-button--sparkle\"></div>\n\t\t\t<div class=\"e-ai-layout-button--sparkle\"></div>\n\t\t\t<div class=\"e-ai-layout-button--sparkle\"></div>\n\t\t\t<div class=\"e-ai-layout-button--sparkle\"></div>\n\t\t\t<div class=\"e-ai-layout-button--sparkle\"></div>\n\t\t\t<div class=\"e-ai-layout-button--sparkle\"></div>\n\t\t\t<div class=\"e-ai-layout-button--sparkle\"></div>\n\t\t\t<i class=\"eicon-ai\" aria-hidden=\"true\"></i>\n\t\t");
      this.ui.addTemplateButton.after($button);
    }
  }]);
}(Marionette.Behavior);

/***/ }),

/***/ "../modules/ai/assets/js/editor/api/index.js":
/*!***************************************************!*\
  !*** ../modules/ai/assets/js/editor/api/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.uploadImage = exports.toggleFavoriteHistoryItem = exports.setStatusFeedback = exports.setGetStarted = exports.getUserInformation = exports.getTextToImageGeneration = exports.getRemoteFrontendConfig = exports.getRemoteConfig = exports.getProductImageUnification = exports.getLayoutPromptEnhanced = exports.getImageToImageUpscale = exports.getImageToImageReplaceBackground = exports.getImageToImageRemoveText = exports.getImageToImageRemoveBackground = exports.getImageToImageOutPainting = exports.getImageToImageMaskGeneration = exports.getImageToImageMaskCleanup = exports.getImageToImageGeneration = exports.getImagePromptEnhanced = exports.getHistory = exports.getFeaturedImage = exports.getExcerpt = exports.getEditText = exports.getCustomCode = exports.getCustomCSS = exports.getCompletionText = exports.generateLayout = exports.deleteHistoryItem = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var request = function request(endpoint) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var immediately = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var signal = arguments.length > 3 ? arguments[3] : undefined;
  if (Object.keys(data).length) {
    if (window.elementorAiCurrentContext) {
      data.context = window.elementorAiCurrentContext;
    } else {
      data.context = window.elementorWpAiCurrentContext;
    }
  }
  return new Promise(function (resolve, reject) {
    var ajaxData = elementorCommon.ajax.addRequest(endpoint, {
      success: resolve,
      error: reject,
      data: data,
      unique_id: data.unique_id
    }, immediately);
    if (signal && ajaxData.jqXhr) {
      signal.addEventListener('abort', ajaxData.jqXhr.abort);
    }
  });
};
var getUserInformation = exports.getUserInformation = function getUserInformation(immediately) {
  return request('ai_get_user_information', undefined, immediately);
};
var getRemoteConfig = exports.getRemoteConfig = function getRemoteConfig() {
  return request('ai_get_remote_config');
};
var getRemoteFrontendConfig = exports.getRemoteFrontendConfig = function getRemoteFrontendConfig(payload, immediately) {
  return request('ai_get_remote_frontend_config', {
    payload: payload
  }, immediately);
};
var getCompletionText = exports.getCompletionText = function getCompletionText(payload) {
  return request('ai_get_completion_text', {
    payload: payload
  });
};
var getExcerpt = exports.getExcerpt = function getExcerpt(payload) {
  return request('ai_get_excerpt', {
    payload: payload
  });
};
var getFeaturedImage = exports.getFeaturedImage = function getFeaturedImage(payload) {
  return request('ai_get_featured_image', {
    payload: payload
  });
};
var getEditText = exports.getEditText = function getEditText(payload) {
  return request('ai_get_edit_text', {
    payload: payload
  });
};
var getCustomCode = exports.getCustomCode = function getCustomCode(payload) {
  return request('ai_get_custom_code', {
    payload: payload
  });
};
var getCustomCSS = exports.getCustomCSS = function getCustomCSS(payload) {
  return request('ai_get_custom_css', {
    payload: payload
  });
};
var setGetStarted = exports.setGetStarted = function setGetStarted() {
  return request('ai_set_get_started');
};
var setStatusFeedback = exports.setStatusFeedback = function setStatusFeedback(responseId) {
  return request('ai_set_status_feedback', {
    response_id: responseId
  });
};
var getTextToImageGeneration = exports.getTextToImageGeneration = function getTextToImageGeneration(payload) {
  return request('ai_get_text_to_image', {
    payload: payload
  });
};
var getImageToImageGeneration = exports.getImageToImageGeneration = function getImageToImageGeneration(payload) {
  return request('ai_get_image_to_image', {
    payload: payload
  });
};
var getImageToImageMaskCleanup = exports.getImageToImageMaskCleanup = function getImageToImageMaskCleanup(payload) {
  return request('ai_get_image_to_image_mask_cleanup', {
    payload: payload
  });
};
var getImageToImageMaskGeneration = exports.getImageToImageMaskGeneration = function getImageToImageMaskGeneration(payload) {
  return request('ai_get_image_to_image_mask', {
    payload: payload
  });
};
var getImageToImageOutPainting = exports.getImageToImageOutPainting = function getImageToImageOutPainting(payload) {
  return request('ai_get_image_to_image_outpainting', {
    payload: payload
  });
};
var getImageToImageUpscale = exports.getImageToImageUpscale = function getImageToImageUpscale(payload) {
  return request('ai_get_image_to_image_upscale', {
    payload: payload
  });
};
var getImageToImageRemoveBackground = exports.getImageToImageRemoveBackground = function getImageToImageRemoveBackground(payload) {
  return request('ai_get_image_to_image_remove_background', {
    payload: payload
  });
};
var getImageToImageReplaceBackground = exports.getImageToImageReplaceBackground = function getImageToImageReplaceBackground(payload) {
  return request('ai_get_image_to_image_replace_background', {
    payload: payload
  });
};
var getImageToImageRemoveText = exports.getImageToImageRemoveText = function getImageToImageRemoveText(image) {
  return request('ai_get_image_to_image_remove_text', {
    image: image
  });
};
var getImagePromptEnhanced = exports.getImagePromptEnhanced = function getImagePromptEnhanced(prompt) {
  return request('ai_get_image_prompt_enhancer', {
    prompt: prompt
  });
};
var getProductImageUnification = exports.getProductImageUnification = function getProductImageUnification(payload, immediately) {
  return request('ai_get_product_image_unification', {
    payload: payload
  }, immediately);
};
var uploadImage = exports.uploadImage = function uploadImage(image) {
  return request('ai_upload_image', _objectSpread(_objectSpread({}, image), {}, {
    editor_post_id: image.image.editor_post_id,
    unique_id: image.image.unique_id
  }));
};

/**
 * @typedef {Object} AttachmentPropType - See ./types/attachment.js
 * @typedef {Object} requestBody
 * @property {string}               prompt             - Prompt to generate the layout from.
 * @property {0|1|2}                [variationType]    - Type of the layout to generate (actually it's a position).
 * @property {string[]}             [prevGeneratedIds] - Previously generated ids for exclusion on regeneration.
 * @property {AttachmentPropType[]} [attachments]      - Attachments to use for the generation. currently only `json` type is supported - a container JSON to generate variations from.
 */

/**
 * @param {requestBody} requestBody
 * @param {AbortSignal} [signal]
 */
var generateLayout = exports.generateLayout = function generateLayout(requestBody, signal) {
  return request('ai_generate_layout', requestBody, true, signal);
};
var getLayoutPromptEnhanced = exports.getLayoutPromptEnhanced = function getLayoutPromptEnhanced(prompt, enhanceType) {
  return request('ai_get_layout_prompt_enhancer', {
    prompt: prompt,
    enhance_type: enhanceType
  });
};
var getHistory = exports.getHistory = function getHistory(type, page, limit) {
  return request('ai_get_history', {
    type: type,
    page: page,
    limit: limit
  });
};
var deleteHistoryItem = exports.deleteHistoryItem = function deleteHistoryItem(id) {
  return request('ai_delete_history_item', {
    id: id
  });
};
var toggleFavoriteHistoryItem = exports.toggleFavoriteHistoryItem = function toggleFavoriteHistoryItem(id) {
  return request('ai_toggle_favorite_history_item', {
    id: id
  });
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/components/alert-dialog.js":
/*!*****************************************************************!*\
  !*** ../modules/ai/assets/js/editor/components/alert-dialog.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AlertDialog = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var AlertDialog = exports.AlertDialog = function AlertDialog(props) {
  var _useState = (0, _react.useState)(true),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    isShown = _useState2[0],
    setIsShown = _useState2[1];
  if (!isShown) {
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(_ui.Dialog, {
    open: true,
    maxWidth: "lg"
  }, /*#__PURE__*/_react.default.createElement(_ui.DialogContent, {
    sx: {
      padding: 0
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    sx: {
      textAlign: 'center',
      padding: 3
    }
  }, props.message), /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    alignItems: "center",
    spacing: 2,
    marginBottom: 2
  }, /*#__PURE__*/_react.default.createElement(_ui.Button, {
    variant: "contained",
    type: "button",
    color: "primary",
    onClick: function onClick() {
      var _props$onClose;
      setIsShown(false);
      (_props$onClose = props.onClose) === null || _props$onClose === void 0 || _props$onClose.call(props);
    }
  }, (0, _i18n.__)('Close', 'elementor')))));
};
AlertDialog.propTypes = {
  message: _propTypes.default.string.isRequired,
  onClose: _propTypes.default.func
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/components/dialog-header.js":
/*!******************************************************************!*\
  !*** ../modules/ai/assets/js/editor/components/dialog-header.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _icons = __webpack_require__(/*! @elementor/icons */ "@elementor/icons");
var ElementorLogo = function ElementorLogo(props) {
  return /*#__PURE__*/_react.default.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 32 32"
  }, props), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2.69648 24.8891C0.938383 22.2579 0 19.1645 0 16C0 11.7566 1.68571 7.68687 4.68629 4.68629C7.68687 1.68571 11.7566 0 16 0C19.1645 0 22.2579 0.938383 24.8891 2.69648C27.5203 4.45459 29.5711 6.95344 30.7821 9.87706C31.9931 12.8007 32.3099 16.0177 31.6926 19.1214C31.0752 22.2251 29.5514 25.0761 27.3137 27.3137C25.0761 29.5514 22.2251 31.0752 19.1214 31.6926C16.0177 32.3099 12.8007 31.9931 9.87706 30.7821C6.95344 29.5711 4.45459 27.5203 2.69648 24.8891ZM12.0006 9.33281H9.33437V22.6665H12.0006V9.33281ZM22.6657 9.33281H14.6669V11.9991H22.6657V9.33281ZM22.6657 14.6654H14.6669V17.3316H22.6657V14.6654ZM22.6657 20.0003H14.6669V22.6665H22.6657V20.0003Z"
  }));
};
var StyledElementorLogo = (0, _ui.styled)(ElementorLogo)(function (_ref) {
  var theme = _ref.theme;
  return {
    width: theme.spacing(3),
    height: theme.spacing(3),
    '& path': {
      fill: theme.palette.text.primary
    }
  };
});
var DialogHeader = function DialogHeader(props) {
  return /*#__PURE__*/_react.default.createElement(_ui.AppBar, {
    sx: {
      fontWeight: 'normal'
    },
    color: "transparent",
    position: "relative"
  }, /*#__PURE__*/_react.default.createElement(_ui.Toolbar, {
    variant: "dense"
  }, /*#__PURE__*/_react.default.createElement(StyledElementorLogo, {
    sx: {
      mr: 1
    }
  }), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    component: "span",
    variant: "subtitle2",
    sx: {
      fontWeight: 'bold',
      textTransform: 'uppercase'
    }
  }, (0, _i18n.__)('AI', 'elementor')), /*#__PURE__*/_react.default.createElement(_ui.Chip, {
    label: (0, _i18n.__)('Beta', 'elementor'),
    color: "default",
    size: "small",
    sx: {
      ml: 1
    }
  }), /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    direction: "row",
    spacing: 1,
    alignItems: "center",
    sx: {
      ml: 'auto'
    }
  }, props.children, /*#__PURE__*/_react.default.createElement(_ui.IconButton, {
    size: "small",
    "aria-label": "close",
    onClick: props.onClose,
    sx: {
      '&.MuiButtonBase-root': {
        mr: -1
      }
    }
  }, /*#__PURE__*/_react.default.createElement(_icons.XIcon, null)))));
};
DialogHeader.propTypes = {
  onClose: _propTypes.default.func.isRequired,
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.node), _propTypes.default.node])
};
var _default = exports["default"] = DialogHeader;

/***/ }),

/***/ "../modules/ai/assets/js/editor/components/loader.js":
/*!***********************************************************!*\
  !*** ../modules/ai/assets/js/editor/components/loader.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "../node_modules/@babel/runtime/helpers/objectWithoutProperties.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _excluded = ["sx", "BoxProps"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Loader = function Loader(_ref) {
  var _ref$sx = _ref.sx,
    sx = _ref$sx === void 0 ? {} : _ref$sx,
    _ref$BoxProps = _ref.BoxProps,
    BoxProps = _ref$BoxProps === void 0 ? {} : _ref$BoxProps,
    props = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  return /*#__PURE__*/_react.default.createElement(_ui.Box, (0, _extends2.default)({
    width: "100%",
    display: "flex",
    alignItems: "center"
  }, BoxProps, {
    sx: _objectSpread({
      px: 1.5,
      minHeight: function minHeight(theme) {
        return theme.spacing(5);
      }
    }, BoxProps.sx || {})
  }), /*#__PURE__*/_react.default.createElement(_ui.LinearProgress, (0, _extends2.default)({
    color: "secondary"
  }, props, {
    sx: _objectSpread({
      width: '100%'
    }, sx)
  })));
};
Loader.propTypes = {
  sx: _propTypes.default.object,
  BoxProps: _propTypes.default.object
};
var _default = exports["default"] = Loader;

/***/ }),

/***/ "../modules/ai/assets/js/editor/components/prompt-dialog.js":
/*!******************************************************************!*\
  !*** ../modules/ai/assets/js/editor/components/prompt-dialog.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _reactDraggable = _interopRequireDefault(__webpack_require__(/*! react-draggable */ "../node_modules/react-draggable/build/cjs/cjs.js"));
var _dialogHeader = _interopRequireDefault(__webpack_require__(/*! ./dialog-header */ "../modules/ai/assets/js/editor/components/dialog-header.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var DraggablePaper = function DraggablePaper(props) {
  var _useState = (0, _react.useState)({
      x: 0,
      y: 0
    }),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    position = _useState2[0],
    setPosition = _useState2[1];
  var paperRef = (0, _react.useRef)(null);
  var timeout = (0, _react.useRef)(null);
  var onDrag = function onDrag(_e, _ref) {
    var x = _ref.x,
      y = _ref.y;
    return setPosition({
      x: x,
      y: y
    });
  };
  var handlePositionBoundaries = function handlePositionBoundaries() {
    clearTimeout(timeout.current);

    // Ensuring the dialog header, which is used as the dialog dragging handle, does not exceed the screen.
    timeout.current = setTimeout(function () {
      var _paperRef$current;
      var dialogTop = (_paperRef$current = paperRef.current) === null || _paperRef$current === void 0 ? void 0 : _paperRef$current.getBoundingClientRect().top;
      if (dialogTop < 0) {
        setPosition(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, {
            y: prev.y - dialogTop
          });
        });
      }
    }, 50);
  };
  (0, _react.useEffect)(function () {
    var resizeObserver = new ResizeObserver(handlePositionBoundaries);
    resizeObserver.observe(paperRef.current);
    return function () {
      resizeObserver.disconnect();
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement(_reactDraggable.default, {
    position: position,
    onDrag: onDrag,
    handle: ".MuiAppBar-root",
    cancel: '[class*="MuiDialogContent-root"]',
    bounds: "parent"
  }, /*#__PURE__*/_react.default.createElement(_ui.Paper, (0, _extends2.default)({}, props, {
    ref: paperRef
  })));
};
var PromptDialog = function PromptDialog(props) {
  return /*#__PURE__*/_react.default.createElement(_ui.Dialog, (0, _extends2.default)({
    scroll: "paper",
    open: true,
    fullWidth: true,
    hideBackdrop: true,
    PaperComponent: DraggablePaper,
    disableScrollLock: true,
    sx: {
      '& .MuiDialog-container': {
        alignItems: 'flex-start',
        mt: '18vh'
      }
    },
    PaperProps: {
      sx: {
        m: 0,
        maxHeight: '76vh'
      }
    }
  }, props), props.children);
};
PromptDialog.propTypes = {
  onClose: _propTypes.default.func.isRequired,
  children: _propTypes.default.node,
  maxWidth: _propTypes.default.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false])
};
PromptDialog.Header = _dialogHeader.default;
PromptDialog.Content = _ui.DialogContent;
var _default = exports["default"] = PromptDialog;

/***/ }),

/***/ "../modules/ai/assets/js/editor/components/prompt-error-message.js":
/*!*************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/components/prompt-error-message.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var sprintf = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n")["sprintf"];


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "../node_modules/@babel/runtime/helpers/objectWithoutProperties.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _excluded = ["error", "onRetry", "actionPosition"];
var PromptErrorMessage = function PromptErrorMessage(_ref) {
  var error = _ref.error,
    _ref$onRetry = _ref.onRetry,
    onRetry = _ref$onRetry === void 0 ? function () {} : _ref$onRetry,
    _ref$actionPosition = _ref.actionPosition,
    actionPosition = _ref$actionPosition === void 0 ? 'default' : _ref$actionPosition,
    props = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  function getQuotaReachedTrailMessage(featureName) {
    if (!featureName) {
      return {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('It\'s time to upgrade.', 'elementor')),
        description: (0, _i18n.__)('Enjoy the free trial? Upgrade now for unlimited access to built-in image, text and custom code generators.', 'elementor'),
        buttonText: (0, _i18n.__)('Upgrade', 'elementor'),
        buttonAction: function buttonAction() {
          return window.open('https://go.elementor.com/ai-popup-purchase-limit-reached/', '_blank');
        }
      };
    }
    return {
      // Translators: %s is the feature name.
      text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, sprintf((0, _i18n.__)('You\'ve used all AI credits for %s.', 'elementor'), featureName.toLowerCase())),
      description: (0, _i18n.__)('Upgrade now to keep using this feature. You still have credits for other AI features (Text, Code, Images, Containers, etc.)', 'elementor'),
      buttonText: (0, _i18n.__)('Upgrade now', 'elementor'),
      buttonAction: function buttonAction() {
        return window.open('https://go.elementor.com/ai-popup-purchase-limit-reached/', '_blank');
      }
    };
  }
  function getErrorMessage() {
    var _error$extra_data;
    var errMsg = error.message || error;
    var featureName = (_error$extra_data = error.extra_data) === null || _error$extra_data === void 0 ? void 0 : _error$extra_data.featureName;
    var messages = {
      default: {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('There was a glitch.', 'elementor')),
        description: (0, _i18n.__)('Wait a moment and give it another go, or try tweaking the prompt.', 'elementor'),
        buttonText: (0, _i18n.__)('Try again', 'elementor'),
        buttonAction: onRetry
      },
      service_outage_internal: {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('There was a glitch.', 'elementor')),
        description: (0, _i18n.__)('Wait a moment and give it another go.', 'elementor'),
        buttonText: (0, _i18n.__)('Try again', 'elementor'),
        buttonAction: onRetry
      },
      invalid_connect_data: {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('There was a glitch.', 'elementor')),
        description: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, (0, _i18n.__)('Try exiting Elementor and sign in again.', 'elementor'), ' ', /*#__PURE__*/_react.default.createElement("a", {
          href: "https://elementor.com/help/disconnecting-reconnecting-your-elementor-account/",
          target: "_blank",
          rel: "noreferrer"
        }, (0, _i18n.__)('Show me how', 'elementor'))),
        buttonText: (0, _i18n.__)('Reconnect', 'elementor'),
        buttonAction: function buttonAction() {
          return window.open(window.ElementorAiConfig.connect_url);
        }
      },
      not_connected: {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('You aren\'t connected to Elementor AI.', 'elementor')),
        description: (0, _i18n.__)('Elementor AI is just a few clicks away. Connect your account to instantly create texts and custom code.', 'elementor'),
        buttonText: (0, _i18n.__)('Connect', 'elementor'),
        buttonAction: function buttonAction() {
          return window.open(window.ElementorAiConfig.connect_url);
        }
      },
      quota_reached_trail: getQuotaReachedTrailMessage(featureName),
      quota_reached_subscription: {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('Looks like you\'re out of credits.', 'elementor')),
        description: (0, _i18n.__)('Ready to take it to the next level?', 'elementor'),
        buttonText: (0, _i18n.__)('Upgrade now', 'elementor'),
        buttonAction: function buttonAction() {
          return window.open('https://go.elementor.com/ai-popup-purchase-limit-reached/', '_blank');
        }
      },
      rate_limit_network: {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('Whoa! Slow down there.', 'elementor')),
        description: (0, _i18n.__)('We can’t process that many requests so fast. Try again in 15 minutes.', 'elementor')
      },
      invalid_prompts: {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('We were unable to generate that prompt.', 'elementor')),
        description: (0, _i18n.__)('Seems like the prompt contains words that could generate harmful content. Write a different prompt to continue.', 'elementor')
      },
      service_unavailable: {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('There was a glitch.', 'elementor')),
        description: (0, _i18n.__)('Wait a moment and give it another go, or try tweaking the prompt.', 'elementor'),
        buttonText: (0, _i18n.__)('Try again', 'elementor'),
        buttonAction: onRetry
      },
      request_timeout_error: {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('There was a glitch.', 'elementor')),
        description: (0, _i18n.__)('Wait a moment and give it another go, or try tweaking the prompt.', 'elementor'),
        buttonText: (0, _i18n.__)('Try again', 'elementor'),
        buttonAction: onRetry
      },
      invalid_token: {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('Try again', 'elementor')),
        description: (0, _i18n.__)('Try exiting Elementor and sign in again.', 'elementor'),
        buttonText: (0, _i18n.__)('Reconnect', 'elementor'),
        buttonAction: onRetry
      },
      file_too_large: {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('The file is too large.', 'elementor')),
        description: (0, _i18n.__)('Please upload a file that is less than 4MB.', 'elementor')
      },
      image_resolution_maximum_exceeded: {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('The image resolution exceeds the maximum allowed size.', 'elementor')),
        description: (0, _i18n.__)('Please upload a file with dimensions less than 2048x2048 pixels.', 'elementor')
      },
      external_service_unavailable: {
        text: /*#__PURE__*/_react.default.createElement(_ui.AlertTitle, null, (0, _i18n.__)('Temporary external service issue', 'elementor')),
        description: (0, _i18n.__)('It seems that one of our partner services is temporarily unavailable. Please try again in a few minutes.', 'elementor'),
        buttonText: (0, _i18n.__)('Try Again', 'elementor'),
        buttonAction: onRetry
      }
    };
    return messages[errMsg] || messages.default;
  }
  var message = getErrorMessage();
  var action = (message === null || message === void 0 ? void 0 : message.buttonText) && /*#__PURE__*/_react.default.createElement(_ui.Button, {
    color: "inherit",
    size: "small",
    variant: "outlined",
    onClick: message.buttonAction
  }, message.buttonText);
  return /*#__PURE__*/_react.default.createElement(_ui.Alert, (0, _extends2.default)({
    severity: message.severity || 'error',
    action: 'default' === actionPosition && action
  }, props), message.text, message.description, 'bottom' === actionPosition && /*#__PURE__*/_react.default.createElement(_ui.Box, {
    sx: {
      mt: 1
    }
  }, action));
};
PromptErrorMessage.propTypes = {
  error: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string]),
  onRetry: _propTypes.default.func,
  actionPosition: _propTypes.default.oneOf(['default', 'bottom'])
};
var _default = exports["default"] = PromptErrorMessage;

/***/ }),

/***/ "../modules/ai/assets/js/editor/components/prompt-library-link.js":
/*!************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/components/prompt-library-link.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var PromptLibraryLink = function PromptLibraryLink(props) {
  return /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, (0, _i18n.__)('For more suggestions, explore our'), ' ', /*#__PURE__*/_react.default.createElement(_ui.Link, {
    href: props.libraryLink,
    className: "elementor-clickable",
    target: "_blank"
  }, (0, _i18n.__)('prompt library')));
};
PromptLibraryLink.propTypes = {
  libraryLink: _propTypes.default.string
};
var _default = exports["default"] = PromptLibraryLink;

/***/ }),

/***/ "../modules/ai/assets/js/editor/components/upgrade-chip.js":
/*!*****************************************************************!*\
  !*** ../modules/ai/assets/js/editor/components/upgrade-chip.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _icons = __webpack_require__(/*! @elementor/icons */ "@elementor/icons");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var popoverId = 'e-ai-upgrade-popover';
var StyledContent = (0, _ui.styled)(_ui.Paper)(function (_ref) {
  var theme = _ref.theme;
  return {
    position: 'relative',
    '[data-popper-placement="top"] &': {
      marginBottom: theme.spacing(2.5)
    },
    '[data-popper-placement="bottom"] &': {
      marginTop: theme.spacing(2.5)
    },
    padding: theme.spacing(3),
    boxShadow: theme.shadows[4],
    zIndex: '9999'
  };
});
var StyledArrow = (0, _ui.styled)(_ui.Box)(function (_ref2) {
  var theme = _ref2.theme;
  return {
    width: theme.spacing(5),
    height: theme.spacing(2.5),
    position: 'absolute',
    overflow: 'hidden',
    // Override Popper inline styles.
    left: '50% !important',
    transform: 'translateX(-50%) rotate(var(--rotate, 0deg)) !important',
    '[data-popper-placement="top"] &': {
      top: '100%'
    },
    '[data-popper-placement="bottom"] &': {
      '--rotate': '180deg',
      top: "calc(".concat(theme.spacing(2.5), " * -1)")
    },
    '&::after': {
      backgroundColor: theme.palette.background.paper,
      content: '""',
      display: 'block',
      position: 'absolute',
      width: theme.spacing(2.5),
      height: theme.spacing(2.5),
      top: 0,
      left: '50%',
      transform: 'translateX(-50%) translateY(-50%) rotate(45deg)',
      boxShadow: '1px 1px 5px 0px rgba(0, 0, 0, 0.2)',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
    }
  };
});
var upgradeBullets = [(0, _i18n.__)('Get spot-on suggestions from AI Copilot and AI Context with appropriate designs, layouts, and content for your business.', 'elementor'), (0, _i18n.__)('Generate professional texts about any topic, in any tone.', 'elementor'), (0, _i18n.__)('Effortlessly create or enhance stunning images and bring your ideas to life.', 'elementor'), (0, _i18n.__)('Unleash infinite possibilities with the custom code generator.', 'elementor'), (0, _i18n.__)('Access 30-days of AI History with the AI Starter plan and 90-days with the Power plan.', 'elementor')];
var Chip = (0, _ui.styled)(_ui.Chip)(function () {
  return {
    '& .MuiChip-label': {
      lineHeight: 1.5
    },
    '& .MuiSvgIcon-root.MuiChip-icon': {
      fontSize: '1.25rem'
    }
  };
});
var UpgradeChip = function UpgradeChip(_ref3) {
  var _ref3$hasSubscription = _ref3.hasSubscription,
    hasSubscription = _ref3$hasSubscription === void 0 ? false : _ref3$hasSubscription,
    _ref3$usagePercentage = _ref3.usagePercentage,
    usagePercentage = _ref3$usagePercentage === void 0 ? 0 : _ref3$usagePercentage;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    isPopoverOpen = _useState2[0],
    setIsPopoverOpen = _useState2[1];
  var anchorEl = (0, _react.useRef)(null);
  var arrowEl = (0, _react.useRef)(null);
  var showPopover = function showPopover() {
    return setIsPopoverOpen(true);
  };
  var hidePopover = function hidePopover() {
    return setIsPopoverOpen(false);
  };
  var actionUrl = 'https://go.elementor.com/ai-popup-purchase-dropdown/';
  if (hasSubscription) {
    actionUrl = usagePercentage >= 100 ? 'https://go.elementor.com/ai-popup-upgrade-limit-reached/' : 'https://go.elementor.com/ai-popup-upgrade-limit-reached-80-percent/';
  }
  var actionLabel = hasSubscription ? (0, _i18n.__)('Upgrade Elementor AI', 'elementor') : (0, _i18n.__)('Get Elementor AI', 'elementor');
  return /*#__PURE__*/_react.default.createElement(_ui.Box, {
    component: "span",
    "aria-owns": isPopoverOpen ? popoverId : undefined,
    "aria-haspopup": "true",
    onMouseEnter: showPopover,
    onMouseLeave: hidePopover,
    ref: anchorEl,
    display: "flex",
    alignItems: "center"
  }, /*#__PURE__*/_react.default.createElement(Chip, {
    color: "promotion",
    label: (0, _i18n.__)('Upgrade', 'elementor'),
    icon: /*#__PURE__*/_react.default.createElement(_icons.AIIcon, null),
    size: "small"
  }), /*#__PURE__*/_react.default.createElement(_ui.Popper, {
    open: isPopoverOpen,
    anchorEl: anchorEl.current,
    sx: {
      zIndex: '170001',
      maxWidth: 300
    },
    modifiers: [{
      name: 'arrow',
      enabled: true,
      options: {
        element: arrowEl.current
      }
    }]
  }, /*#__PURE__*/_react.default.createElement(StyledContent, null, /*#__PURE__*/_react.default.createElement(StyledArrow, {
    ref: arrowEl
  }), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "h5",
    color: "text.primary"
  }, (0, _i18n.__)('Unlimited access to Elementor AI', 'elementor')), /*#__PURE__*/_react.default.createElement(_ui.List, {
    sx: {
      mb: 1
    }
  }, upgradeBullets.map(function (bullet, index) {
    return /*#__PURE__*/_react.default.createElement(_ui.ListItem, {
      key: index,
      disableGutters: true,
      sx: {
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/_react.default.createElement(_ui.ListItemIcon, null, /*#__PURE__*/_react.default.createElement(_icons.CheckedCircleIcon, null)), /*#__PURE__*/_react.default.createElement(_ui.ListItemText, {
      sx: {
        m: 0
      }
    }, /*#__PURE__*/_react.default.createElement(_ui.Typography, {
      variant: "body2"
    }, bullet)));
  })), /*#__PURE__*/_react.default.createElement(_ui.Button, {
    variant: "contained",
    color: "promotion",
    size: "small",
    href: actionUrl,
    target: "_blank",
    startIcon: /*#__PURE__*/_react.default.createElement(_icons.AIIcon, null),
    sx: {
      '&:hover': {
        color: 'promotion.contrastText'
      }
    }
  }, actionLabel))));
};
var _default = exports["default"] = UpgradeChip;
UpgradeChip.propTypes = {
  hasSubscription: _propTypes.default.bool,
  usagePercentage: _propTypes.default.number
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/components/voice-promotion-alert.js":
/*!**************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/components/voice-promotion-alert.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.VoicePromotionAlert = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _bulbIcon = _interopRequireDefault(__webpack_require__(/*! ../icons/bulb-icon */ "../modules/ai/assets/js/editor/icons/bulb-icon.js"));
var _useIntroduction2 = _interopRequireDefault(__webpack_require__(/*! ../hooks/use-introduction */ "../modules/ai/assets/js/editor/hooks/use-introduction.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var VoicePromotionAlert = exports.VoicePromotionAlert = function VoicePromotionAlert(props) {
  var _useIntroduction = (0, _useIntroduction2.default)(props.introductionKey),
    isViewed = _useIntroduction.isViewed,
    markAsViewed = _useIntroduction.markAsViewed;
  if (isViewed) {
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(_ui.Box, {
    sx: _objectSpread({
      mt: 2
    }, props.sx),
    alignItems: "top"
  }, /*#__PURE__*/_react.default.createElement(_ui.Alert, {
    severity: "info",
    variant: "standard",
    icon: /*#__PURE__*/_react.default.createElement(_bulbIcon.default, {
      sx: {
        alignSelf: 'flex-start'
      }
    }),
    onClose: markAsViewed
  }, (0, _i18n.__)('Get improved results from AI by adding personal context.', 'elementor'), /*#__PURE__*/_react.default.createElement(_ui.Link, {
    onClick: function onClick() {
      return $e.route('panel/global/menu');
    },
    className: "elementor-clickable",
    style: {
      textDecoration: 'none'
    },
    color: "info.main",
    href: "#"
  }, (0, _i18n.__)('Let’s do it', 'elementor'))));
};
VoicePromotionAlert.propTypes = {
  sx: _propTypes.default.object,
  introductionKey: _propTypes.default.string
};
var _default = exports["default"] = VoicePromotionAlert;

/***/ }),

/***/ "../modules/ai/assets/js/editor/components/wizard-dialog.js":
/*!******************************************************************!*\
  !*** ../modules/ai/assets/js/editor/components/wizard-dialog.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "../node_modules/@babel/runtime/helpers/objectWithoutProperties.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _dialogHeader = _interopRequireDefault(__webpack_require__(/*! ./dialog-header */ "../modules/ai/assets/js/editor/components/dialog-header.js"));
var _excluded = ["sx"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var WizardDialog = function WizardDialog(props) {
  return /*#__PURE__*/_react.default.createElement(_ui.Dialog, {
    open: true,
    onClose: props.onClose,
    fullWidth: true,
    hideBackdrop: true,
    maxWidth: "lg",
    PaperProps: {
      sx: {
        height: '88vh'
      }
    },
    sx: {
      zIndex: 9999
    }
  }, props.children);
};
WizardDialog.propTypes = {
  onClose: _propTypes.default.func.isRequired,
  children: _propTypes.default.node.isRequired
};
var WizardDialogContent = function WizardDialogContent(_ref) {
  var _ref$sx = _ref.sx,
    sx = _ref$sx === void 0 ? {} : _ref$sx,
    props = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  return /*#__PURE__*/_react.default.createElement(_ui.DialogContent, (0, _extends2.default)({}, props, {
    sx: _objectSpread({
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }, sx)
  }));
};
WizardDialogContent.propTypes = {
  sx: _propTypes.default.object
};
WizardDialog.Header = _dialogHeader.default;
WizardDialog.Content = WizardDialogContent;
var _default = exports["default"] = WizardDialog;

/***/ }),

/***/ "../modules/ai/assets/js/editor/context/requests-ids.js":
/*!**************************************************************!*\
  !*** ../modules/ai/assets/js/editor/context/requests-ids.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.RequestIdsProvider = void 0;
exports.generateIds = generateIds;
exports.useRequestIds = exports.getUniqueId = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var Context = (0, _react.createContext)({});
var useRequestIds = exports.useRequestIds = function useRequestIds() {
  var context = (0, _react.useContext)(Context);
  if (!context) {
    throw new Error('useRequestIds must be used within a RequestIdsProvider');
  }
  return context;
};
var getUniqueId = exports.getUniqueId = function getUniqueId(prefix) {
  return prefix + '-' + Math.random().toString(16).substr(2, 7);
};
window.EDITOR_SESSION_ID = window.EDITOR_SESSION_ID || getUniqueId('editor-session');
function generateIds(template) {
  var _template$elements;
  template.id = getUniqueId().toString();
  if ((_template$elements = template.elements) !== null && _template$elements !== void 0 && _template$elements.length) {
    template.elements.map(function (child) {
      return generateIds(child);
    });
  }
  return template;
}
var RequestIdsProvider = exports.RequestIdsProvider = function RequestIdsProvider(props) {
  var editorSessionId = (0, _react.useRef)(window.EDITOR_SESSION_ID);
  var sessionId = (0, _react.useRef)('');
  var generateId = (0, _react.useRef)('');
  var batchId = (0, _react.useRef)('');
  var requestId = (0, _react.useRef)('');
  sessionId.current = getUniqueId('session');
  var setGenerate = function setGenerate() {
    generateId.current = getUniqueId('generate');
    return generateId;
  };
  var setBatch = function setBatch() {
    batchId.current = getUniqueId('batch');
    return batchId;
  };
  var setRequest = function setRequest() {
    requestId.current = getUniqueId('request');
    return requestId;
  };
  var _useState = (0, _react.useState)(0),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    usagePercentage = _useState2[0],
    setUsagePercentage = _useState2[1];
  var updateUsagePercentage = function updateUsagePercentage(newPercentage) {
    setUsagePercentage(newPercentage);
  };
  return /*#__PURE__*/_react.default.createElement(Context.Provider, {
    value: {
      editorSessionId: editorSessionId,
      sessionId: sessionId,
      generateId: generateId,
      batchId: batchId,
      requestId: requestId,
      setGenerate: setGenerate,
      setBatch: setBatch,
      setRequest: setRequest,
      usagePercentage: usagePercentage,
      updateUsagePercentage: updateUsagePercentage
    }
  }, props.children);
};
RequestIdsProvider.propTypes = {
  children: _propTypes.default.node.isRequired
};
var _default = exports["default"] = Context;

/***/ }),

/***/ "../modules/ai/assets/js/editor/hooks/use-introduction.js":
/*!****************************************************************!*\
  !*** ../modules/ai/assets/js/editor/hooks/use-introduction.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = useIntroduction;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _react = __webpack_require__(/*! react */ "react");
function useIntroduction(key) {
  var _window$elementor$con, _window$elementorAdmi, _globalConfig$introdu;
  var globalConfig = window.elementor ? (_window$elementor$con = window.elementor.config) === null || _window$elementor$con === void 0 ? void 0 : _window$elementor$con.user : (_window$elementorAdmi = window.elementorAdmin) === null || _window$elementorAdmi === void 0 || (_window$elementorAdmi = _window$elementorAdmi.config) === null || _window$elementorAdmi === void 0 ? void 0 : _window$elementorAdmi.user;
  var _useState = (0, _react.useState)(!!(globalConfig !== null && globalConfig !== void 0 && (_globalConfig$introdu = globalConfig.introduction) !== null && _globalConfig$introdu !== void 0 && _globalConfig$introdu[key])),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    isViewed = _useState2[0],
    setIsViewed = _useState2[1];
  function markAsViewed() {
    if (!key) {
      return Promise.reject();
    }
    return new Promise(function (resolve, reject) {
      if (isViewed) {
        reject();
      }
      setIsViewed(true);
      elementorCommon.ajax.addRequest('introduction_viewed', {
        data: {
          introductionKey: key
        },
        error: function error() {
          setIsViewed(false);
          reject();
        },
        success: function success() {
          setIsViewed(true);
          if (globalConfig !== null && globalConfig !== void 0 && globalConfig.introduction) {
            globalConfig.introduction[key] = true;
          }
          resolve();
        }
      });
    });
  }
  return {
    isViewed: isViewed,
    markAsViewed: markAsViewed
  };
}

/***/ }),

/***/ "../modules/ai/assets/js/editor/hooks/use-prompt-enhancer.js":
/*!*******************************************************************!*\
  !*** ../modules/ai/assets/js/editor/hooks/use-prompt-enhancer.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _api = __webpack_require__(/*! ../api */ "../modules/ai/assets/js/editor/api/index.js");
var _usePrompt2 = _interopRequireDefault(__webpack_require__(/*! ./use-prompt */ "../modules/ai/assets/js/editor/hooks/use-prompt.js"));
var _config = __webpack_require__(/*! ../pages/form-layout/context/config */ "../modules/ai/assets/js/editor/pages/form-layout/context/config.js");
var enhancePromptMap = new Map([['media', _api.getImagePromptEnhanced], ['layout', _api.getLayoutPromptEnhanced]]);
var getResult = function getResult(prompt, type, enhanceType) {
  if (!enhancePromptMap.has(type)) {
    throw new Error("Invalid prompt type: ".concat(type));
  }
  return enhancePromptMap.get(type)(prompt, enhanceType);
};

/**
 * Hook to enhance a prompt.
 *
 * @param {string}             prompt
 * @param {'media' | 'layout'} type
 * @return {{enhancedPrompt: string | undefined, isEnhancing: boolean, enhance: (function(...[*]): Promise)}}
 */
var usePromptEnhancer = function usePromptEnhancer(prompt, type) {
  var _useConfig = (0, _config.useConfig)(),
    mode = _useConfig.mode;
  var _usePrompt = (0, _usePrompt2.default)(function () {
      return getResult(prompt, type, mode);
    }, prompt),
    enhancedData = _usePrompt.data,
    isEnhancing = _usePrompt.isLoading,
    enhance = _usePrompt.send;
  return {
    enhance: enhance,
    isEnhancing: isEnhancing,
    enhancedPrompt: enhancedData === null || enhancedData === void 0 ? void 0 : enhancedData.result
  };
};
var _default = exports["default"] = usePromptEnhancer;

/***/ }),

/***/ "../modules/ai/assets/js/editor/hooks/use-prompt.js":
/*!**********************************************************!*\
  !*** ../modules/ai/assets/js/editor/hooks/use-prompt.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../node_modules/@babel/runtime/regenerator/index.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "../node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "../node_modules/@babel/runtime/helpers/objectWithoutProperties.js"));
var _react = __webpack_require__(/*! react */ "react");
var _api = __webpack_require__(/*! ../api */ "../modules/ai/assets/js/editor/api/index.js");
var _requestsIds = __webpack_require__(/*! ../context/requests-ids */ "../modules/ai/assets/js/editor/context/requests-ids.js");
var _excluded = ["text", "response_id", "usage", "images"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var normalizeResponse = function normalizeResponse(_ref) {
  var text = _ref.text,
    responseId = _ref.response_id,
    usage = _ref.usage,
    images = _ref.images,
    optional = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  var creditsData = usage ? usage.quota - usage.usedQuota : 0;
  var credits = Math.max(creditsData, 0);
  var result = text || images;
  var normalized = {
    result: result,
    responseId: responseId,
    credits: credits,
    usagePercentage: usage === null || usage === void 0 ? void 0 : usage.usagePercentage
  };
  if (optional.base_template_id) {
    normalized.baseTemplateId = optional.base_template_id;
  }
  normalized.type = optional.template_type;
  return normalized;
};
var usePrompt = function usePrompt(fetchData, initialState) {
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    isLoading = _useState2[0],
    setIsLoading = _useState2[1];
  var _useState3 = (0, _react.useState)(''),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    error = _useState4[0],
    setError = _useState4[1];
  var _useState5 = (0, _react.useState)(initialState),
    _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
    data = _useState6[0],
    setData = _useState6[1];
  var _useRequestIds = (0, _requestsIds.useRequestIds)(),
    updateUsagePercentage = _useRequestIds.updateUsagePercentage,
    usagePercentage = _useRequestIds.usagePercentage;
  var send = (0, _react.useRef)(/*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee(payload) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", payload);
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
  (0, _react.useEffect)(function () {
    var newUsageValue = data === null || data === void 0 ? void 0 : data.usagePercentage;
    if (newUsageValue && newUsageValue !== usagePercentage) {
      updateUsagePercentage(newUsageValue);
    }
  }, [data, usagePercentage, updateUsagePercentage]);
  var _useRequestIds2 = (0, _requestsIds.useRequestIds)(),
    setRequest = _useRequestIds2.setRequest,
    editorSessionId = _useRequestIds2.editorSessionId,
    sessionId = _useRequestIds2.sessionId,
    generateId = _useRequestIds2.generateId,
    batchId = _useRequestIds2.batchId;
  send.current = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee2(payload) {
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              setError('');
              setIsLoading(true);
              var requestId = setRequest();
              var requestIds = {
                editorSessionId: editorSessionId.current,
                sessionId: sessionId.current,
                generateId: generateId.current,
                batchId: batchId.current,
                requestId: requestId.current
              };
              payload = _objectSpread(_objectSpread({}, payload), {}, {
                requestIds: requestIds
              });
              fetchData(payload).then(function (result) {
                var normalizedData = normalizeResponse(result);
                setData(normalizedData);
                resolve(normalizedData);
              }).catch(function (err) {
                var finalError = (err === null || err === void 0 ? void 0 : err.responseText) || err;
                setError(finalError);
                reject(finalError);
              }).finally(function () {
                return setIsLoading(false);
              });
            }));
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }(), [batchId, editorSessionId, fetchData, generateId, sessionId, setRequest]);
  var sendUsageData = function sendUsageData() {
    var usageData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : data;
    return usageData.responseId && (0, _api.setStatusFeedback)(usageData.responseId);
  };
  var reset = function reset() {
    setData(function (_ref4) {
      var credits = _ref4.credits;
      return {
        credits: credits,
        result: '',
        responseId: ''
      };
    });
    setError('');
    setIsLoading(false);
  };
  var setResult = function setResult(result) {
    var responseId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var updatedResult = _objectSpread({}, data);
    updatedResult.result = result;
    if (responseId) {
      updatedResult.responseId = responseId;
    }
    setData(updatedResult);
  };
  return {
    isLoading: isLoading,
    error: error,
    data: data,
    setResult: setResult,
    reset: reset,
    send: send.current,
    sendUsageData: sendUsageData
  };
};
var _default = exports["default"] = usePrompt;

/***/ }),

/***/ "../modules/ai/assets/js/editor/hooks/use-timeout.js":
/*!***********************************************************!*\
  !*** ../modules/ai/assets/js/editor/hooks/use-timeout.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useTimeout = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _react = __webpack_require__(/*! react */ "react");
var useTimeout = exports.useTimeout = function useTimeout(delay) {
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    isTimeout = _useState2[0],
    setIsTimeout = _useState2[1];
  var timeoutIdRef = (0, _react.useRef)(null);
  var turnOffTimeout = function turnOffTimeout() {
    clearTimeout(timeoutIdRef.current);
    setIsTimeout(false);
  };
  (0, _react.useEffect)(function () {
    timeoutIdRef.current = setTimeout(function () {
      setIsTimeout(true);
    }, delay);
    return function () {
      clearTimeout(timeoutIdRef.current);
    };
  }, [delay]);
  return [isTimeout, turnOffTimeout];
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/hooks/use-user-info.js":
/*!*************************************************************!*\
  !*** ../modules/ai/assets/js/editor/hooks/use-user-info.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../node_modules/@babel/runtime/regenerator/index.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "../node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _react = __webpack_require__(/*! react */ "react");
var _api = __webpack_require__(/*! ../api */ "../modules/ai/assets/js/editor/api/index.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var useUserInfo = function useUserInfo() {
  var immediately = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    isLoaded = _useState2[0],
    setIsLoaded = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    isLoading = _useState4[0],
    setIsLoading = _useState4[1];
  var _useState5 = (0, _react.useState)({
      is_connected: false,
      is_get_started: false,
      connect_url: '',
      usage: {
        hasAiSubscription: false,
        quota: 0,
        usedQuota: 0
      }
    }),
    _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
    userInfo = _useState6[0],
    setUserInfo = _useState6[1];
  var credits = userInfo.usage.quota - userInfo.usage.usedQuota;
  var usagePercentage = userInfo.usage.quota ? userInfo.usage.usedQuota / userInfo.usage.quota * 100 : 0;
  var fetchData = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee() {
      var userInfoResult;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            setIsLoading(true);
            _context.next = 3;
            return (0, _api.getUserInformation)(immediately);
          case 3:
            userInfoResult = _context.sent;
            setUserInfo(function (prevState) {
              return _objectSpread(_objectSpread({}, prevState), userInfoResult);
            });
            setIsLoaded(true);
            setIsLoading(false);
          case 7:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function fetchData() {
      return _ref.apply(this, arguments);
    };
  }();
  if (!isLoaded && !isLoading) {
    fetchData();
  }
  return {
    isLoading: isLoading,
    isLoaded: isLoaded,
    isConnected: userInfo.is_connected,
    isGetStarted: userInfo.is_get_started,
    connectUrl: userInfo.connect_url,
    builderUrl: userInfo.usage.builderUrl,
    hasSubscription: userInfo.usage.hasAiSubscription,
    credits: credits < 0 ? 0 : credits,
    usagePercentage: Math.round(usagePercentage),
    fetchData: fetchData
  };
};
useUserInfo.propTypes = {
  immediately: _propTypes.default.bool
};
var _default = exports["default"] = useUserInfo;

/***/ }),

/***/ "../modules/ai/assets/js/editor/icons/arrow-left-icon.js":
/*!***************************************************************!*\
  !*** ../modules/ai/assets/js/editor/icons/arrow-left-icon.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var ArrowLeftIcon = _react.default.forwardRef(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M9.53033 7.46967C9.82322 7.76256 9.82322 8.23744 9.53033 8.53033L6.81066 11.25H19C19.4142 11.25 19.75 11.5858 19.75 12C19.75 12.4142 19.4142 12.75 19 12.75H6.81066L9.53033 15.4697C9.82322 15.7626 9.82322 16.2374 9.53033 16.5303C9.23744 16.8232 8.76256 16.8232 8.46967 16.5303L4.46967 12.5303C4.17678 12.2374 4.17678 11.7626 4.46967 11.4697L8.46967 7.46967C8.76256 7.17678 9.23744 7.17678 9.53033 7.46967Z"
  }));
});
var _default = exports["default"] = ArrowLeftIcon;

/***/ }),

/***/ "../modules/ai/assets/js/editor/icons/bulb-icon.js":
/*!*********************************************************!*\
  !*** ../modules/ai/assets/js/editor/icons/bulb-icon.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var BulbIcon = _react.default.forwardRef(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_ui.SvgIcon, (0, _extends2.default)({}, props, {
    ref: ref
  }), /*#__PURE__*/_react.default.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react.default.createElement("g", {
    clipPath: "url(#clip0_10743_8902)"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M2.75 10.0833H3.66667M11 2.75V3.66667M18.3333 10.0833H19.25M5.13333 5.13333L5.775 5.775M16.8667 5.13333L16.225 5.775",
    stroke: "#2563EB",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M9.16675 16.041C8.70841 15.1243 6.91205 13.2842 6.62523 12.366C6.3384 11.4477 6.34775 10.4626 6.65195 9.54997C6.95615 8.63738 7.53978 7.84362 8.32016 7.28116C9.10054 6.71869 10.0381 6.41602 11.0001 6.41602C11.962 6.41602 12.8996 6.71869 13.68 7.28116C14.4604 7.84362 15.044 8.63738 15.3482 9.54997C15.6524 10.4626 15.6618 11.4477 15.3749 12.366C15.0881 13.2842 13.2917 15.1243 12.8334 16.041C12.8334 16.041 12.7597 17.3762 12.8334 17.8743C12.8334 18.3606 12.6403 18.8269 12.2964 19.1707C11.9526 19.5145 11.4863 19.7077 11.0001 19.7077C10.5139 19.7077 10.0475 19.5145 9.70372 19.1707C9.3599 18.8269 9.16675 18.3606 9.16675 17.8743C9.2405 17.3762 9.16675 16.041 9.16675 16.041Z",
    stroke: "#2563EB",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M10.0833 16.5H11.9166",
    stroke: "#2563EB",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement("clipPath", {
    id: "clip0_10743_8902"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    width: "22",
    height: "22",
    fill: "white"
  })))));
});
var _default = exports["default"] = BulbIcon;

/***/ }),

/***/ "../modules/ai/assets/js/editor/icons/copy-page-icon.js":
/*!**************************************************************!*\
  !*** ../modules/ai/assets/js/editor/icons/copy-page-icon.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var CopyPageIcon = _react.default.forwardRef(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M16.6667 0.208496C17.0534 0.208496 17.4244 0.362142 17.6979 0.635632C17.9714 0.909123 18.125 1.28006 18.125 1.66683V11.6668C18.125 12.0536 17.9714 12.4245 17.6979 12.698C17.4244 12.9715 17.0534 13.1252 16.6667 13.1252H14.7917V16.6668C14.7917 17.0536 14.638 17.4245 14.3645 17.698C14.091 17.9715 13.7201 18.1252 13.3333 18.1252H3.33333C2.94656 18.1252 2.57563 17.9715 2.30214 17.698C2.02865 17.4245 1.875 17.0536 1.875 16.6668V6.66683C1.875 6.28005 2.02865 5.90912 2.30214 5.63563C2.57563 5.36214 2.94656 5.2085 3.33333 5.2085H5.20833V1.66683C5.20833 1.28005 5.36198 0.909122 5.63547 0.635632C5.90896 0.362142 6.27989 0.208496 6.66667 0.208496H16.6667ZM6.66667 1.4585C6.61141 1.4585 6.55842 1.48045 6.51935 1.51952C6.48028 1.55859 6.45833 1.61158 6.45833 1.66683V3.54183H8.54167V1.4585H6.66667ZM3.125 9.79183V16.6668C3.125 16.7221 3.14695 16.7751 3.18602 16.8141C3.22509 16.8532 3.27808 16.8752 3.33333 16.8752H13.3333C13.3886 16.8752 13.4416 16.8532 13.4806 16.8141C13.5197 16.7751 13.5417 16.7221 13.5417 16.6668V13.1252H6.66667C6.27989 13.1252 5.90896 12.9715 5.63547 12.698C5.36198 12.4245 5.20833 12.0536 5.20833 11.6668V9.79183H3.125ZM5.20833 8.54183H3.125V6.66683C3.125 6.61158 3.14695 6.55859 3.18602 6.51952C3.22509 6.48045 3.27808 6.4585 3.33333 6.4585H5.20833V8.54183ZM6.45833 11.6668C6.45833 11.7221 6.48028 11.7751 6.51935 11.8141C6.55842 11.8532 6.61141 11.8752 6.66667 11.8752H16.6667C16.7219 11.8752 16.7749 11.8532 16.814 11.8141C16.853 11.7751 16.875 11.7221 16.875 11.6668V4.79183H6.45833V11.6668ZM9.79167 1.4585V3.54183H16.875V1.66683C16.875 1.61157 16.853 1.55858 16.814 1.51952C16.7749 1.48045 16.7219 1.4585 16.6667 1.4585H9.79167Z"
  }));
});
var _default = exports["default"] = CopyPageIcon;

/***/ }),

/***/ "../modules/ai/assets/js/editor/icons/edit-icon.js":
/*!*********************************************************!*\
  !*** ../modules/ai/assets/js/editor/icons/edit-icon.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var EditIcon = _react.default.forwardRef(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M13.9697 4.96967C14.6408 4.29858 15.5509 3.92157 16.5 3.92157C17.4491 3.92157 18.3592 4.29858 19.0303 4.96967C19.7014 5.64075 20.0784 6.55094 20.0784 7.5C20.0784 8.44905 19.7014 9.35924 19.0303 10.0303L8.53033 20.5303C8.38968 20.671 8.19891 20.75 8 20.75H4C3.58579 20.75 3.25 20.4142 3.25 20V16C3.25 15.8011 3.32902 15.6103 3.46967 15.4697L13.9697 4.96967ZM16.5 5.42157C15.9488 5.42157 15.4201 5.64055 15.0303 6.03033L4.75 16.3107V19.25H7.68934L17.9697 8.96967C18.3595 8.57989 18.5784 8.05123 18.5784 7.5C18.5784 6.94876 18.3595 6.42011 17.9697 6.03033C17.5799 5.64055 17.0512 5.42157 16.5 5.42157Z"
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12.9697 5.96967C13.2626 5.67677 13.7374 5.67677 14.0303 5.96967L18.0303 9.96967C18.3232 10.2626 18.3232 10.7374 18.0303 11.0303C17.7374 11.3232 17.2626 11.3232 16.9697 11.0303L12.9697 7.03033C12.6768 6.73743 12.6768 6.26256 12.9697 5.96967Z"
  }));
});
var _default = exports["default"] = EditIcon;

/***/ }),

/***/ "../modules/ai/assets/js/editor/icons/expand-diagonal-icon.js":
/*!********************************************************************!*\
  !*** ../modules/ai/assets/js/editor/icons/expand-diagonal-icon.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var ExpandDiagonalIcon = _react.default.forwardRef(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M4 3.25H8C8.41421 3.25 8.75 3.58579 8.75 4C8.75 4.41421 8.41421 4.75 8 4.75H5.81066L10.5303 9.46967C10.8232 9.76256 10.8232 10.2374 10.5303 10.5303C10.2374 10.8232 9.76256 10.8232 9.46967 10.5303L4.75 5.81066V8C4.75 8.41421 4.41421 8.75 4 8.75C3.58579 8.75 3.25 8.41421 3.25 8V4C3.25 3.58579 3.58579 3.25 4 3.25ZM13.4697 13.4697C13.7626 13.1768 14.2374 13.1768 14.5303 13.4697L19.25 18.1893V16C19.25 15.5858 19.5858 15.25 20 15.25C20.4142 15.25 20.75 15.5858 20.75 16V20C20.75 20.4142 20.4142 20.75 20 20.75H16C15.5858 20.75 15.25 20.4142 15.25 20C15.25 19.5858 15.5858 19.25 16 19.25H18.1893L13.4697 14.5303C13.1768 14.2374 13.1768 13.7626 13.4697 13.4697Z"
  }));
});
var _default = exports["default"] = ExpandDiagonalIcon;

/***/ }),

/***/ "../modules/ai/assets/js/editor/icons/lock-icon.js":
/*!*********************************************************!*\
  !*** ../modules/ai/assets/js/editor/icons/lock-icon.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var LockIcon = _react.default.forwardRef(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M7.8125 11.9996C7.29473 11.9996 6.875 12.4473 6.875 12.9996V18.9996C6.875 19.5519 7.29473 19.9996 7.8125 19.9996H17.1875C17.7053 19.9996 18.125 19.5519 18.125 18.9996V12.9996C18.125 12.4473 17.7053 11.9996 17.1875 11.9996H7.8125ZM5 12.9996C5 11.3428 6.2592 9.99963 7.8125 9.99963H17.1875C18.7408 9.99963 20 11.3428 20 12.9996V18.9996C20 20.6565 18.7408 21.9996 17.1875 21.9996H7.8125C6.2592 21.9996 5 20.6565 5 18.9996V12.9996Z"
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12.5 3.90527C11.7044 3.90527 10.9413 4.22134 10.3787 4.78395C9.81607 5.34656 9.5 6.10962 9.5 6.90527V10.9053C9.5 11.4576 9.05228 11.9053 8.5 11.9053C7.94772 11.9053 7.5 11.4576 7.5 10.9053V6.90527C7.5 5.57919 8.02678 4.30742 8.96447 3.36974C9.90215 2.43206 11.1739 1.90527 12.5 1.90527C13.8261 1.90527 15.0979 2.43206 16.0355 3.36974C16.9732 4.30742 17.5 5.57919 17.5 6.90527V10.9053C17.5 11.4576 17.0523 11.9053 16.5 11.9053C15.9477 11.9053 15.5 11.4576 15.5 10.9053V6.90527C15.5 6.10962 15.1839 5.34656 14.6213 4.78395C14.0587 4.22134 13.2956 3.90527 12.5 3.90527Z"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M6 12H19V20H6V12Z"
  }));
});
var _default = exports["default"] = LockIcon;

/***/ }),

/***/ "../modules/ai/assets/js/editor/icons/minimize-diagonal-icon.js":
/*!**********************************************************************!*\
  !*** ../modules/ai/assets/js/editor/icons/minimize-diagonal-icon.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var MinimizeDiagonalIcon = _react.default.forwardRef(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M3.46967 3.46967C3.76256 3.17678 4.23744 3.17678 4.53033 3.46967L9.25 8.18934V6C9.25 5.58579 9.58579 5.25 10 5.25C10.4142 5.25 10.75 5.58579 10.75 6V10C10.75 10.4142 10.4142 10.75 10 10.75H6C5.58579 10.75 5.25 10.4142 5.25 10C5.25 9.58579 5.58579 9.25 6 9.25H8.18934L3.46967 4.53033C3.17678 4.23744 3.17678 3.76256 3.46967 3.46967ZM14 13.25H18C18.4142 13.25 18.75 13.5858 18.75 14C18.75 14.4142 18.4142 14.75 18 14.75H15.8107L20.5303 19.4697C20.8232 19.7626 20.8232 20.2374 20.5303 20.5303C20.2374 20.8232 19.7626 20.8232 19.4697 20.5303L14.75 15.8107V18C14.75 18.4142 14.4142 18.75 14 18.75C13.5858 18.75 13.25 18.4142 13.25 18V14C13.25 13.5858 13.5858 13.25 14 13.25Z"
  }));
});
var _default = exports["default"] = MinimizeDiagonalIcon;

/***/ }),

/***/ "../modules/ai/assets/js/editor/icons/plus-circle-icon.js":
/*!****************************************************************!*\
  !*** ../modules/ai/assets/js/editor/icons/plus-circle-icon.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var PlusCircleIcon = _react.default.forwardRef(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M12 2.69231C6.8595 2.69231 2.69231 6.8595 2.69231 12C2.69231 17.1405 6.8595 21.3077 12 21.3077C17.1405 21.3077 21.3077 17.1405 21.3077 12C21.3077 6.8595 17.1405 2.69231 12 2.69231ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 7.76923C12.4673 7.76923 12.8462 8.14807 12.8462 8.61538V11.1538H15.3846C15.8519 11.1538 16.2308 11.5327 16.2308 12C16.2308 12.4673 15.8519 12.8462 15.3846 12.8462H12.8462V15.3846C12.8462 15.8519 12.4673 16.2308 12 16.2308C11.5327 16.2308 11.1538 15.8519 11.1538 15.3846V12.8462H8.61538C8.14807 12.8462 7.76923 12.4673 7.76923 12C7.76923 11.5327 8.14807 11.1538 8.61538 11.1538H11.1538V8.61538C11.1538 8.14807 11.5327 7.76923 12 7.76923Z"
  }));
});
var _default = exports["default"] = PlusCircleIcon;

/***/ }),

/***/ "../modules/ai/assets/js/editor/icons/refresh-icon.js":
/*!************************************************************!*\
  !*** ../modules/ai/assets/js/editor/icons/refresh-icon.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var RefreshIcon = _react.default.forwardRef(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M7.55012 4.45178C9.23098 3.48072 11.1845 3.08925 13.1097 3.33767C15.035 3.58609 16.8251 4.46061 18.2045 5.82653C19.5838 7.19245 20.4757 8.97399 20.743 10.8967C20.8 11.307 20.5136 11.6858 20.1033 11.7428C19.6931 11.7998 19.3142 11.5135 19.2572 11.1032C19.0353 9.50635 18.2945 8.02677 17.149 6.89236C16.0035 5.75795 14.5167 5.03165 12.9178 4.82534C11.3189 4.61902 9.69644 4.94414 8.30047 5.75061C7.24361 6.36117 6.36093 7.22198 5.72541 8.24995H8.00009C8.41431 8.24995 8.75009 8.58574 8.75009 8.99995C8.75009 9.41417 8.41431 9.74995 8.00009 9.74995H4.51686C4.5055 9.75021 4.49412 9.75021 4.48272 9.74995H4.00009C3.58588 9.74995 3.25009 9.41417 3.25009 8.99995V4.99995C3.25009 4.58574 3.58588 4.24995 4.00009 4.24995C4.41431 4.24995 4.75009 4.58574 4.75009 4.99995V7.00691C5.48358 5.96916 6.43655 5.0951 7.55012 4.45178Z"
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M3.89686 12.2571C4.30713 12.2001 4.68594 12.4864 4.74295 12.8967C4.96487 14.4936 5.70565 15.9731 6.85119 17.1075C7.99673 18.242 9.48347 18.9683 11.0824 19.1746C12.6813 19.3809 14.3037 19.0558 15.6997 18.2493C16.7566 17.6387 17.6393 16.7779 18.2748 15.75H16.0001C15.5859 15.75 15.2501 15.4142 15.2501 15C15.2501 14.5857 15.5859 14.25 16.0001 14.25H19.4833C19.4947 14.2497 19.5061 14.2497 19.5175 14.25H20.0001C20.4143 14.25 20.7501 14.5857 20.7501 15V19C20.7501 19.4142 20.4143 19.75 20.0001 19.75C19.5859 19.75 19.2501 19.4142 19.2501 19V16.993C18.5166 18.0307 17.5636 18.9048 16.4501 19.5481C14.7692 20.5192 12.8157 20.9107 10.8904 20.6622C8.9652 20.4138 7.17504 19.5393 5.79572 18.1734C4.4164 16.8074 3.52443 15.0259 3.25723 13.1032C3.20022 12.6929 3.48658 12.3141 3.89686 12.2571Z"
  }));
});
var _default = exports["default"] = RefreshIcon;

/***/ }),

/***/ "../modules/ai/assets/js/editor/icons/wand-icon.js":
/*!*********************************************************!*\
  !*** ../modules/ai/assets/js/editor/icons/wand-icon.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var WandIcon = _react.default.forwardRef(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M9 2.25C9.41421 2.25 9.75 2.58579 9.75 3C9.75 3.33152 9.8817 3.64946 10.1161 3.88388C10.3505 4.1183 10.6685 4.25 11 4.25C11.4142 4.25 11.75 4.58579 11.75 5C11.75 5.41421 11.4142 5.75 11 5.75C10.6685 5.75 10.3505 5.8817 10.1161 6.11612C9.8817 6.35054 9.75 6.66848 9.75 7C9.75 7.41421 9.41421 7.75 9 7.75C8.58579 7.75 8.25 7.41421 8.25 7C8.25 6.66848 8.1183 6.35054 7.88388 6.11612C7.64946 5.8817 7.33152 5.75 7 5.75C6.58579 5.75 6.25 5.41421 6.25 5C6.25 4.58579 6.58579 4.25 7 4.25C7.33152 4.25 7.64946 4.1183 7.88388 3.88388C8.1183 3.64946 8.25 3.33152 8.25 3C8.25 2.58579 8.58579 2.25 9 2.25ZM9 4.88746C8.98182 4.90673 8.96333 4.92576 8.94454 4.94454C8.92576 4.96333 8.90673 4.98182 8.88746 5C8.90673 5.01818 8.92576 5.03667 8.94454 5.05546C8.96333 5.07424 8.98182 5.09327 9 5.11254C9.01818 5.09327 9.03667 5.07424 9.05546 5.05546C9.07424 5.03667 9.09327 5.01818 9.11254 5C9.09327 4.98182 9.07424 4.96333 9.05546 4.94454C9.03667 4.92576 9.01818 4.90673 9 4.88746Z"
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M18.5303 2.46967C18.2374 2.17678 17.7626 2.17678 17.4697 2.46967L2.46967 17.4697C2.17678 17.7626 2.17678 18.2374 2.46967 18.5303L5.46967 21.5303C5.76256 21.8232 6.23744 21.8232 6.53033 21.5303L21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L18.5303 2.46967ZM18 7.93934L19.9393 6L18 4.06066L16.0607 6L18 7.93934ZM15 7.06066L16.9393 9L6 19.9393L4.06066 18L15 7.06066Z"
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M19.75 13C19.75 12.5858 19.4142 12.25 19 12.25C18.5858 12.25 18.25 12.5858 18.25 13C18.25 13.3315 18.1183 13.6495 17.8839 13.8839C17.6495 14.1183 17.3315 14.25 17 14.25C16.5858 14.25 16.25 14.5858 16.25 15C16.25 15.4142 16.5858 15.75 17 15.75C17.3315 15.75 17.6495 15.8817 17.8839 16.1161C18.1183 16.3505 18.25 16.6685 18.25 17C18.25 17.4142 18.5858 17.75 19 17.75C19.4142 17.75 19.75 17.4142 19.75 17C19.75 16.6685 19.8817 16.3505 20.1161 16.1161C20.3505 15.8817 20.6685 15.75 21 15.75C21.4142 15.75 21.75 15.4142 21.75 15C21.75 14.5858 21.4142 14.25 21 14.25C20.6685 14.25 20.3505 14.1183 20.1161 13.8839C19.8817 13.6495 19.75 13.3315 19.75 13ZM18.9445 14.9445C18.9633 14.9258 18.9818 14.9067 19 14.8875C19.0182 14.9067 19.0367 14.9258 19.0555 14.9445C19.0742 14.9633 19.0933 14.9818 19.1125 15C19.0933 15.0182 19.0742 15.0367 19.0555 15.0555C19.0367 15.0742 19.0182 15.0933 19 15.1125C18.9818 15.0933 18.9633 15.0742 18.9445 15.0555C18.9258 15.0367 18.9067 15.0182 18.8875 15C18.9067 14.9818 18.9258 14.9633 18.9445 14.9445Z"
  }));
});
var _default = exports["default"] = WandIcon;

/***/ }),

/***/ "../modules/ai/assets/js/editor/icons/website-icon.js":
/*!************************************************************!*\
  !*** ../modules/ai/assets/js/editor/icons/website-icon.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var WebsiteIcon = _react.default.forwardRef(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M4.16707 3.95837C4.11182 3.95837 4.05883 3.98032 4.01976 4.01939C3.98069 4.05846 3.95874 4.11145 3.95874 4.16671V6.04171H6.04207V3.95837H4.16707ZM4.16707 2.70837C3.7803 2.70837 3.40937 2.86202 3.13588 3.13551C2.86239 3.409 2.70874 3.77993 2.70874 4.16671V15.8334C2.70874 16.2201 2.86239 16.5911 3.13588 16.8646C3.40937 17.1381 3.7803 17.2917 4.16707 17.2917H15.8337C16.2205 17.2917 16.5914 17.1381 16.8649 16.8646C17.1384 16.5911 17.2921 16.2201 17.2921 15.8334V4.16671C17.2921 3.77993 17.1384 3.409 16.8649 3.13551C16.5914 2.86202 16.2205 2.70837 15.8337 2.70837H4.16707ZM7.29207 3.95837V6.04171H16.0421V4.16671C16.0421 4.11145 16.0201 4.05846 15.9811 4.01939C15.942 3.98032 15.889 3.95837 15.8337 3.95837H7.29207ZM16.0421 7.29171H3.95874V15.8334C3.95874 15.8886 3.98069 15.9416 4.01976 15.9807C4.05883 16.0198 4.11182 16.0417 4.16707 16.0417H15.8337C15.889 16.0417 15.942 16.0198 15.9811 15.9807C16.0201 15.9416 16.0421 15.8886 16.0421 15.8334V7.29171Z"
  }));
});
var _default = exports["default"] = WebsiteIcon;

/***/ }),

/***/ "../modules/ai/assets/js/editor/icons/x-circle-icon.js":
/*!*************************************************************!*\
  !*** ../modules/ai/assets/js/editor/icons/x-circle-icon.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var XCircleIcon = _react.default.forwardRef(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 24 24"
  }, props, {
    ref: ref
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M12 2.69231C6.8595 2.69231 2.69231 6.8595 2.69231 12C2.69231 17.1405 6.8595 21.3077 12 21.3077C17.1405 21.3077 21.3077 17.1405 21.3077 12C21.3077 6.8595 17.1405 2.69231 12 2.69231ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM9.14527 9.14527C9.47571 8.81483 10.0115 8.81483 10.3419 9.14527L12 10.8034L13.6581 9.14527C13.9885 8.81483 14.5243 8.81483 14.8547 9.14527C15.1852 9.47571 15.1852 10.0115 14.8547 10.3419L13.1966 12L14.8547 13.6581C15.1852 13.9885 15.1852 14.5243 14.8547 14.8547C14.5243 15.1852 13.9885 15.1852 13.6581 14.8547L12 13.1966L10.3419 14.8547C10.0115 15.1852 9.47571 15.1852 9.14527 14.8547C8.81483 14.5243 8.81483 13.9885 9.14527 13.6581L10.8034 12L9.14527 10.3419C8.81483 10.0115 8.81483 9.47571 9.14527 9.14527Z"
  }));
});
var _default = exports["default"] = XCircleIcon;

/***/ }),

/***/ "../modules/ai/assets/js/editor/integration/library/apply-template-for-ai-behavior.js":
/*!********************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/integration/library/apply-template-for-ai-behavior.js ***!
  \********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _require = __webpack_require__(/*! ../../utils/editor-integration */ "../modules/ai/assets/js/editor/utils/editor-integration.js"),
  renderLayoutApp = _require.renderLayoutApp,
  importToEditor = _require.importToEditor;
var _require2 = __webpack_require__(/*! ../../pages/form-layout/context/config */ "../modules/ai/assets/js/editor/pages/form-layout/context/config.js"),
  MODE_VARIATION = _require2.MODE_VARIATION;
var _require3 = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n"),
  __ = _require3.__;
var _require4 = __webpack_require__(/*! ../../pages/form-layout/components/attachments */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments.js"),
  ATTACHMENT_TYPE_JSON = _require4.ATTACHMENT_TYPE_JSON,
  ELEMENTOR_LIBRARY_SOURCE = _require4.ELEMENTOR_LIBRARY_SOURCE;
var ApplyTemplateForAiBehavior;
ApplyTemplateForAiBehavior = Marionette.Behavior.extend({
  ui: {
    applyButton: '.elementor-template-library-template-apply-ai',
    generateVariation: '.elementor-template-library-template-generate-variation'
  },
  events: {
    'click @ui.applyButton': 'onApplyButtonClick',
    'click @ui.generateVariation': 'onGenerateVariationClick'
  },
  onGenerateVariationClick: function onGenerateVariationClick() {
    var _libraryComponent$man;
    var args = {
      model: this.view.model
    };
    var libraryComponent = $e.components.get('library');
    var at = (_libraryComponent$man = libraryComponent.manager.modalConfig) === null || _libraryComponent$man === void 0 || (_libraryComponent$man = _libraryComponent$man.importOptions) === null || _libraryComponent$man === void 0 ? void 0 : _libraryComponent$man.at;
    libraryComponent.downloadTemplate(args, function (data) {
      var model = args.model;
      var attachment = {
        type: ATTACHMENT_TYPE_JSON,
        previewHTML: "<img src=\"".concat(model.get('thumbnail'), "\" />"),
        content: data.content[0],
        label: "".concat(model.get('template_id'), " - ").concat(model.get('title')),
        source: ELEMENTOR_LIBRARY_SOURCE
      };
      renderLayoutApp({
        parentContainer: elementor.getPreviewContainer(),
        mode: MODE_VARIATION,
        at: at,
        attachments: [attachment],
        onInsert: function onInsert(template) {
          importToEditor({
            parentContainer: elementor.getPreviewContainer(),
            at: at,
            template: template,
            historyTitle: __('AI Variation from library', 'elementor')
          });
        }
      });
      $e.run('library/close');
    });
  },
  onApplyButtonClick: function onApplyButtonClick() {
    var args = {
      model: this.view.model
    };
    this.ui.applyButton.addClass('elementor-disabled');
    if ('remote' === args.model.get('source') && !elementor.config.library_connect.is_connected) {
      $e.route('library/connect', args);
      return;
    }
    $e.run('library/generate-ai-variation', args);
  }
});
module.exports = ApplyTemplateForAiBehavior;

/***/ }),

/***/ "../modules/ai/assets/js/editor/layout-app-wrapper.js":
/*!************************************************************!*\
  !*** ../modules/ai/assets/js/editor/layout-app-wrapper.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var LayoutAppWrapper = function LayoutAppWrapper(props) {
  return /*#__PURE__*/_react.default.createElement(_ui.DirectionProvider, {
    rtl: props.isRTL
  }, /*#__PURE__*/_react.default.createElement(_ui.ThemeProvider, {
    colorScheme: props.colorScheme
  }, props.children));
};
LayoutAppWrapper.propTypes = {
  children: _propTypes.default.node,
  isRTL: _propTypes.default.bool,
  colorScheme: _propTypes.default.oneOf(['auto', 'light', 'dark'])
};
var _default = exports["default"] = LayoutAppWrapper;

/***/ }),

/***/ "../modules/ai/assets/js/editor/layout-app.js":
/*!****************************************************!*\
  !*** ../modules/ai/assets/js/editor/layout-app.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _layoutContent = _interopRequireDefault(__webpack_require__(/*! ./layout-content */ "../modules/ai/assets/js/editor/layout-content.js"));
var _attachment = __webpack_require__(/*! ./types/attachment */ "../modules/ai/assets/js/editor/types/attachment.js");
var _config = __webpack_require__(/*! ./pages/form-layout/context/config */ "../modules/ai/assets/js/editor/pages/form-layout/context/config.js");
var _remoteConfig = __webpack_require__(/*! ./pages/form-layout/context/remote-config */ "../modules/ai/assets/js/editor/pages/form-layout/context/remote-config.js");
var _requestsIds = __webpack_require__(/*! ./context/requests-ids */ "../modules/ai/assets/js/editor/context/requests-ids.js");
var LayoutApp = function LayoutApp(props) {
  return /*#__PURE__*/_react.default.createElement(_remoteConfig.RemoteConfigProvider, {
    onError: props.onClose
  }, /*#__PURE__*/_react.default.createElement(_requestsIds.RequestIdsProvider, null, /*#__PURE__*/_react.default.createElement(_config.ConfigProvider, {
    mode: props.mode,
    attachmentsTypes: props.attachmentsTypes,
    onClose: props.onClose,
    onConnect: props.onConnect,
    onData: props.onData,
    onInsert: props.onInsert,
    onSelect: props.onSelect,
    onGenerate: props.onGenerate,
    currentContext: props.currentContext,
    hasPro: props.hasPro
  }, /*#__PURE__*/_react.default.createElement(_layoutContent.default, {
    attachments: props.attachments
  }))));
};
LayoutApp.propTypes = {
  mode: _propTypes.default.oneOf(_config.LAYOUT_APP_MODES).isRequired,
  attachmentsTypes: _attachment.AttachmentsTypesPropType,
  attachments: _propTypes.default.arrayOf(_attachment.AttachmentPropType),
  onClose: _propTypes.default.func.isRequired,
  onConnect: _propTypes.default.func.isRequired,
  onData: _propTypes.default.func.isRequired,
  onInsert: _propTypes.default.func.isRequired,
  onSelect: _propTypes.default.func.isRequired,
  onGenerate: _propTypes.default.func.isRequired,
  currentContext: _propTypes.default.object,
  hasPro: _propTypes.default.bool
};
var _default = exports["default"] = LayoutApp;

/***/ }),

/***/ "../modules/ai/assets/js/editor/layout-content.js":
/*!********************************************************!*\
  !*** ../modules/ai/assets/js/editor/layout-content.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _connect = _interopRequireDefault(__webpack_require__(/*! ./pages/connect */ "../modules/ai/assets/js/editor/pages/connect/index.js"));
var _formLayout = _interopRequireDefault(__webpack_require__(/*! ./pages/form-layout */ "../modules/ai/assets/js/editor/pages/form-layout/index.js"));
var _getStarted = _interopRequireDefault(__webpack_require__(/*! ./pages/get-started */ "../modules/ai/assets/js/editor/pages/get-started/index.js"));
var _loader = _interopRequireDefault(__webpack_require__(/*! ./components/loader */ "../modules/ai/assets/js/editor/components/loader.js"));
var _upgradeChip = _interopRequireDefault(__webpack_require__(/*! ./components/upgrade-chip */ "../modules/ai/assets/js/editor/components/upgrade-chip.js"));
var _useUserInfo2 = _interopRequireDefault(__webpack_require__(/*! ./hooks/use-user-info */ "../modules/ai/assets/js/editor/hooks/use-user-info.js"));
var _wizardDialog = _interopRequireDefault(__webpack_require__(/*! ./components/wizard-dialog */ "../modules/ai/assets/js/editor/components/wizard-dialog.js"));
var _layoutDialog = _interopRequireDefault(__webpack_require__(/*! ./pages/form-layout/components/layout-dialog */ "../modules/ai/assets/js/editor/pages/form-layout/components/layout-dialog.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _attachment = __webpack_require__(/*! ./types/attachment */ "../modules/ai/assets/js/editor/types/attachment.js");
var _config = __webpack_require__(/*! ./pages/form-layout/context/config */ "../modules/ai/assets/js/editor/pages/form-layout/context/config.js");
var _requestsIds = __webpack_require__(/*! ./context/requests-ids */ "../modules/ai/assets/js/editor/context/requests-ids.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var LayoutContent = function LayoutContent(props) {
  var _useUserInfo = (0, _useUserInfo2.default)(),
    isLoading = _useUserInfo.isLoading,
    isConnected = _useUserInfo.isConnected,
    isGetStarted = _useUserInfo.isGetStarted,
    connectUrl = _useUserInfo.connectUrl,
    fetchData = _useUserInfo.fetchData,
    hasSubscription = _useUserInfo.hasSubscription,
    initialUsagePercentage = _useUserInfo.usagePercentage;
  var _useConfig = (0, _config.useConfig)(),
    onClose = _useConfig.onClose,
    onConnect = _useConfig.onConnect;
  var _useRequestIds = (0, _requestsIds.useRequestIds)(),
    updateUsagePercentage = _useRequestIds.updateUsagePercentage,
    usagePercentage = _useRequestIds.usagePercentage;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    isInitUsageDone = _useState2[0],
    setIsInitUsageDone = _useState2[1];
  (0, _react.useEffect)(function () {
    if (!isInitUsageDone && !isLoading && (initialUsagePercentage || 0 === initialUsagePercentage)) {
      updateUsagePercentage(initialUsagePercentage);
      setIsInitUsageDone(true);
    }
  }, [isLoading, initialUsagePercentage, isInitUsageDone, updateUsagePercentage]);
  if (isLoading || !isInitUsageDone) {
    return /*#__PURE__*/_react.default.createElement(_layoutDialog.default, {
      onClose: onClose
    }, /*#__PURE__*/_react.default.createElement(_layoutDialog.default.Header, {
      onClose: onClose
    }), /*#__PURE__*/_react.default.createElement(_layoutDialog.default.Content, {
      dividers: true
    }, /*#__PURE__*/_react.default.createElement(_loader.default, {
      BoxProps: {
        sx: {
          px: 3
        }
      }
    })));
  }
  if (!isConnected) {
    return /*#__PURE__*/_react.default.createElement(_wizardDialog.default, {
      onClose: onClose
    }, /*#__PURE__*/_react.default.createElement(_layoutDialog.default, {
      onClose: onClose
    }), /*#__PURE__*/_react.default.createElement(_wizardDialog.default.Content, {
      dividers: true
    }, /*#__PURE__*/_react.default.createElement(_connect.default, {
      connectUrl: connectUrl,
      onSuccess: function onSuccess(data) {
        onConnect(data);
        fetchData();
      }
    })));
  }
  if (!isGetStarted) {
    return /*#__PURE__*/_react.default.createElement(_wizardDialog.default, {
      onClose: onClose
    }, /*#__PURE__*/_react.default.createElement(_layoutDialog.default, {
      onClose: onClose
    }), /*#__PURE__*/_react.default.createElement(_wizardDialog.default.Content, {
      dividers: true
    }, /*#__PURE__*/_react.default.createElement(_getStarted.default, {
      onSuccess: fetchData
    })));
  }
  var showUpgradeChip = !hasSubscription || 80 <= usagePercentage;
  return /*#__PURE__*/_react.default.createElement(_formLayout.default, {
    attachments: props.attachments,
    DialogHeaderProps: {
      children: showUpgradeChip && /*#__PURE__*/_react.default.createElement(_upgradeChip.default, {
        hasSubscription: hasSubscription,
        usagePercentage: usagePercentage
      })
    }
  });
};
LayoutContent.propTypes = {
  attachments: _propTypes.default.arrayOf(_attachment.AttachmentPropType)
};
var _default = exports["default"] = LayoutContent;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/connect/index.js":
/*!*************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/connect/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _icons = __webpack_require__(/*! @elementor/icons */ "@elementor/icons");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var Connect = function Connect(_ref) {
  var connectUrl = _ref.connectUrl,
    onSuccess = _ref.onSuccess;
  var approveButtonRef = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    // On local dev (as a standalone app), the connect lib is not loaded.
    if (!jQuery.fn.elementorConnect) {
      return;
    }
    jQuery(approveButtonRef.current).elementorConnect({
      success: function success(_, data) {
        return onSuccess(data);
      },
      error: function error() {
        throw new Error('Elementor AI: Failed to connect.');
      }
    });
  }, []);
  return /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    alignItems: "center",
    gap: 2
  }, /*#__PURE__*/_react.default.createElement(_icons.AIIcon, {
    sx: {
      color: 'text.primary',
      fontSize: '60px',
      mb: 1
    }
  }), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "h4",
    sx: {
      color: 'text.primary'
    }
  }, (0, _i18n.__)('Step into the future with Elementor AI', 'elementor')), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "body2"
  }, (0, _i18n.__)('Create smarter with AI text and code generators built right into the editor.', 'elementor')), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "caption",
    sx: {
      maxWidth: 520,
      textAlign: 'center'
    }
  }, (0, _i18n.__)('By clicking "Connect", I approve the ', 'elementor'), /*#__PURE__*/_react.default.createElement(_ui.Link, {
    href: "https://go.elementor.com/ai-terms/",
    target: "_blank",
    color: "info.main"
  }, (0, _i18n.__)('Terms of Service', 'elementor')), ' & ', /*#__PURE__*/_react.default.createElement(_ui.Link, {
    href: "https://go.elementor.com/ai-privacy-policy/",
    target: "_blank",
    color: "info.main"
  }, (0, _i18n.__)('Privacy Policy', 'elementor')), (0, _i18n.__)(' of the Elementor AI service.', 'elementor')), /*#__PURE__*/_react.default.createElement(_ui.Button, {
    ref: approveButtonRef,
    href: connectUrl,
    variant: "contained",
    sx: {
      mt: 1,
      '&:hover': {
        color: 'primary.contrastText'
      }
    }
  }, (0, _i18n.__)('Connect', 'elementor')));
};
Connect.propTypes = {
  connectUrl: _propTypes.default.string.isRequired,
  onSuccess: _propTypes.default.func.isRequired
};
var _default = exports["default"] = Connect;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments.js":
/*!**********************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/attachments.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.USER_VARIATION_SOURCE = exports.USER_URL_SOURCE = exports.MENU_TYPE_LIBRARY = exports.ELEMENTOR_LIBRARY_SOURCE = exports.ATTACHMENT_TYPE_URL = exports.ATTACHMENT_TYPE_JSON = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _menu = __webpack_require__(/*! ./attachments/menu */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/menu.js");
var _thumbnailJson = _interopRequireDefault(__webpack_require__(/*! ./attachments/thumbnail-json */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/thumbnail-json.js"));
var _thumbnailUrl = _interopRequireDefault(__webpack_require__(/*! ./attachments/thumbnail-url */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/thumbnail-url.js"));
var _websiteIcon = _interopRequireDefault(__webpack_require__(/*! ../../../icons/website-icon */ "../modules/ai/assets/js/editor/icons/website-icon.js"));
var _copyPageIcon = _interopRequireDefault(__webpack_require__(/*! ../../../icons/copy-page-icon */ "../modules/ai/assets/js/editor/icons/copy-page-icon.js"));
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _attachment = __webpack_require__(/*! ../../../types/attachment */ "../modules/ai/assets/js/editor/types/attachment.js");
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var ATTACHMENT_TYPE_JSON = exports.ATTACHMENT_TYPE_JSON = 'json';
var ATTACHMENT_TYPE_URL = exports.ATTACHMENT_TYPE_URL = 'url';
var MENU_TYPE_LIBRARY = exports.MENU_TYPE_LIBRARY = 'library';
var USER_VARIATION_SOURCE = exports.USER_VARIATION_SOURCE = 'user-variation';
var ELEMENTOR_LIBRARY_SOURCE = exports.ELEMENTOR_LIBRARY_SOURCE = 'elementor-library';
var USER_URL_SOURCE = exports.USER_URL_SOURCE = 'user-url';
var Attachments = function Attachments(props) {
  if (!props.attachments.length) {
    return /*#__PURE__*/_react.default.createElement(_menu.Menu, {
      disabled: props.disabled,
      onAttach: props.onAttach,
      items: [{
        title: (0, _i18n.__)('Reference a website', 'elementor'),
        icon: _websiteIcon.default,
        type: ATTACHMENT_TYPE_URL
      }, {
        title: (0, _i18n.__)('Create variations from Template Library', 'elementor'),
        icon: _copyPageIcon.default,
        type: MENU_TYPE_LIBRARY
      }]
    });
  }
  return /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    direction: "row",
    spacing: 1
  }, props.attachments.map(function (attachment, index) {
    switch (attachment.type) {
      case ATTACHMENT_TYPE_JSON:
        return /*#__PURE__*/_react.default.createElement(_thumbnailJson.default, (0, _extends2.default)({
          key: index
        }, props));
      case ATTACHMENT_TYPE_URL:
        return /*#__PURE__*/_react.default.createElement(_thumbnailUrl.default, (0, _extends2.default)({
          key: index
        }, props));
      default:
        return null;
    }
  }));
};
Attachments.propTypes = {
  attachments: _propTypes.default.arrayOf(_attachment.AttachmentPropType).isRequired,
  onAttach: _propTypes.default.func.isRequired,
  onDetach: _propTypes.default.func,
  disabled: _propTypes.default.bool
};
var _default = exports["default"] = Attachments;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/attach-dialog.js":
/*!************************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/attachments/attach-dialog.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.AttachDialog = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _urlDialog = __webpack_require__(/*! ./url-dialog */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/url-dialog.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _libraryDialog = __webpack_require__(/*! ./library-dialog */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/library-dialog.js");
var _attachments = __webpack_require__(/*! ../attachments */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments.js");
var AttachDialog = exports.AttachDialog = function AttachDialog(props) {
  var type = props.type;
  var url = props.url;
  switch (type) {
    case _attachments.ATTACHMENT_TYPE_URL:
      return /*#__PURE__*/_react.default.createElement(_urlDialog.UrlDialog, {
        url: url,
        onAttach: props.onAttach,
        onClose: props.onClose
      });
    case _attachments.MENU_TYPE_LIBRARY:
      return /*#__PURE__*/_react.default.createElement(_libraryDialog.LibraryDialog, {
        onAttach: props.onAttach,
        onClose: props.onClose
      });
  }
  return null;
};
AttachDialog.propTypes = {
  type: _propTypes.default.string,
  onAttach: _propTypes.default.func,
  onClose: _propTypes.default.func,
  url: _propTypes.default.string
};
var _default = exports["default"] = AttachDialog;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/library-dialog.js":
/*!*************************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/attachments/library-dialog.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.LibraryDialog = void 0;
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _react = __webpack_require__(/*! react */ "react");
var _attachments = __webpack_require__(/*! ../attachments */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments.js");
var LibraryDialog = exports.LibraryDialog = function LibraryDialog(props) {
  var isApplyingTemplate = (0, _react.useRef)(false);
  (0, _react.useEffect)(function () {
    var onLibraryHide = function onLibraryHide() {
      if (isApplyingTemplate.current) {
        return;
      }
      props.onClose();
    };
    $e.components.get('library').layout.getModal().on('hide', onLibraryHide);
    return function () {
      $e.components.get('library').layout.getModal().off('hide', onLibraryHide);
    };
  }, [props]);
  (0, _react.useEffect)(function () {
    var onMessage = function onMessage(event) {
      var _event$data = event.data,
        type = _event$data.type,
        json = _event$data.json,
        html = _event$data.html,
        label = _event$data.label,
        source = _event$data.source;
      switch (type) {
        case 'library/attach:start':
          isApplyingTemplate.current = true;
          break;
        case 'library/attach':
          props.onAttach([{
            type: _attachments.ATTACHMENT_TYPE_JSON,
            previewHTML: html,
            content: json,
            label: label,
            source: source
          }]);
          isApplyingTemplate.current = false;
          props.onClose();
          break;
      }
    };
    window.addEventListener('message', onMessage);
    return function () {
      window.removeEventListener('message', onMessage);
    };
  });
  $e.run('library/open', {
    toDefault: true,
    mode: 'ai-attachment'
  });
  isApplyingTemplate.current = false;
  return null;
};
LibraryDialog.propTypes = {
  onAttach: _propTypes.default.func.isRequired,
  onClose: _propTypes.default.func.isRequired
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/menu.js":
/*!***************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/attachments/menu.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Menu = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _xCircleIcon = _interopRequireDefault(__webpack_require__(/*! ../../../../icons/x-circle-icon */ "../modules/ai/assets/js/editor/icons/x-circle-icon.js"));
var _plusCircleIcon = _interopRequireDefault(__webpack_require__(/*! ../../../../icons/plus-circle-icon */ "../modules/ai/assets/js/editor/icons/plus-circle-icon.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _attachDialog = __webpack_require__(/*! ./attach-dialog */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/attach-dialog.js");
var _useIntroduction2 = _interopRequireDefault(__webpack_require__(/*! ../../../../hooks/use-introduction */ "../modules/ai/assets/js/editor/hooks/use-introduction.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var Menu = exports.Menu = function Menu(props) {
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    selectedType = _useState4[0],
    setSelectedType = _useState4[1];
  var _useTheme = (0, _ui.useTheme)(),
    direction = _useTheme.direction;
  var anchorRef = (0, _react.useRef)(null);
  var _useIntroduction = (0, _useIntroduction2.default)('e-ai-attachment-badge'),
    isViewed = _useIntroduction.isViewed,
    markAsViewed = _useIntroduction.markAsViewed;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ui.IconButton, {
    size: "small",
    ref: anchorRef,
    disabled: props.disabled,
    onClick: function onClick() {
      setIsOpen(true);
      if (!isViewed) {
        markAsViewed();
      }
    },
    color: "secondary"
  }, function () {
    if (isOpen) {
      return /*#__PURE__*/_react.default.createElement(_xCircleIcon.default, {
        fontSize: "small"
      });
    } else if (isViewed) {
      return /*#__PURE__*/_react.default.createElement(_plusCircleIcon.default, {
        fontSize: "small"
      });
    }
    return /*#__PURE__*/_react.default.createElement(_ui.Badge, {
      color: "primary",
      badgeContent: " ",
      variant: "dot"
    }, /*#__PURE__*/_react.default.createElement(_plusCircleIcon.default, {
      fontSize: "small"
    }));
  }()), /*#__PURE__*/_react.default.createElement(_ui.Popover, {
    open: isOpen,
    anchorEl: anchorRef.current,
    onClose: function onClose() {
      return setIsOpen(false);
    },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'rtl' === direction ? 'right' : 'left'
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'rtl' === direction ? 'right' : 'left'
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    sx: {
      width: 440
    }
  }, props.items.map(function (item) {
    var IconComponent = item.icon;
    return /*#__PURE__*/_react.default.createElement(_ui.MenuItem, {
      key: item.type,
      onClick: function onClick() {
        setSelectedType(item.type);
        setIsOpen(false);
      }
    }, /*#__PURE__*/_react.default.createElement(_ui.ListItemIcon, null, /*#__PURE__*/_react.default.createElement(IconComponent, null)), item.title);
  }))), /*#__PURE__*/_react.default.createElement(_attachDialog.AttachDialog, {
    type: selectedType,
    onAttach: props.onAttach,
    onClose: function onClose() {
      setIsOpen(false);
      setSelectedType(null);
    }
  }));
};
Menu.propTypes = {
  items: _propTypes.default.arrayOf(_propTypes.default.shape({
    title: _propTypes.default.string.isRequired,
    type: _propTypes.default.string.isRequired,
    icon: _propTypes.default.elementType
  })).isRequired,
  onAttach: _propTypes.default.func.isRequired,
  disabled: _propTypes.default.bool
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/prompt-power-notice.js":
/*!******************************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/attachments/prompt-power-notice.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PromptPowerNotice = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _useIntroduction2 = _interopRequireDefault(__webpack_require__(/*! ../../../../hooks/use-introduction */ "../modules/ai/assets/js/editor/hooks/use-introduction.js"));
var PromptPowerNotice = exports.PromptPowerNotice = function PromptPowerNotice() {
  var _useIntroduction = (0, _useIntroduction2.default)('e-ai-builder-attachments-power'),
    isViewed = _useIntroduction.isViewed,
    markAsViewed = _useIntroduction.markAsViewed;
  if (isViewed) {
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(_ui.Box, {
    sx: {
      pt: 2,
      px: 2,
      pb: 0
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.Alert, {
    severity: "info",
    onClose: function onClose() {
      return markAsViewed();
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "body2",
    display: "inline-block",
    sx: {
      paddingInlineEnd: 1
    }
  }, (0, _i18n.__)('You’ve got the power.', 'elementor')), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "body2",
    display: "inline-block"
  }, (0, _i18n.__)('Craft your prompt to affect content, images and/or colors - whichever you decide.', 'elementor'))));
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/thumbnail-json.js":
/*!*************************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/attachments/thumbnail-json.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.ThumbnailJson = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _thumbnail = __webpack_require__(/*! ./thumbnail */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/thumbnail.js");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _attachment = __webpack_require__(/*! ../../../../types/attachment */ "../modules/ai/assets/js/editor/types/attachment.js");
var ThumbnailJson = exports.ThumbnailJson = function ThumbnailJson(props) {
  var _props$attachments;
  var attachment = (_props$attachments = props.attachments) === null || _props$attachments === void 0 ? void 0 : _props$attachments.find(function (item) {
    return 'json' === item.type;
  });
  if (!attachment) {
    return null;
  }
  if (!attachment.previewHTML) {
    return /*#__PURE__*/_react.default.createElement(_ui.Skeleton, {
      animation: "wave",
      variant: "rounded",
      width: 60,
      height: 60
    });
  }
  return /*#__PURE__*/_react.default.createElement(_thumbnail.Thumbnail, {
    html: attachment.previewHTML,
    disabled: props.disabled
  });
};
ThumbnailJson.propTypes = {
  attachments: _propTypes.default.arrayOf(_attachment.AttachmentPropType).isRequired,
  disabled: _propTypes.default.bool
};
var _default = exports["default"] = ThumbnailJson;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/thumbnail-url.js":
/*!************************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/attachments/thumbnail-url.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.ThumbnailUrl = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _thumbnail = __webpack_require__(/*! ./thumbnail */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/thumbnail.js");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _icons = __webpack_require__(/*! @elementor/icons */ "@elementor/icons");
var _attachment = __webpack_require__(/*! ../../../../types/attachment */ "../modules/ai/assets/js/editor/types/attachment.js");
var ThumbnailUrl = exports.ThumbnailUrl = function ThumbnailUrl(props) {
  var _props$attachments;
  var attachment = (_props$attachments = props.attachments) === null || _props$attachments === void 0 ? void 0 : _props$attachments.find(function (item) {
    return 'url' === item.type;
  });
  if (!attachment) {
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(_ui.Box, {
    sx: {
      position: 'relative',
      '&:hover::before': {
        content: '""',
        position: 'absolute',
        userSelect: 'none',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 1,
        zIndex: 1
      },
      '&:hover .remove-attachment': {
        display: 'flex'
      }
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.IconButton, {
    className: "remove-attachment",
    size: "small",
    "aria-label": (0, _i18n.__)('Remove', 'elementor'),
    disabled: props.disabled,
    onClick: function onClick(event) {
      event.stopPropagation();
      props.onDetach();
    },
    sx: {
      display: 'none',
      position: 'absolute',
      insetInlineEnd: 4,
      insetBlockStart: 4,
      backgroundColor: 'secondary.main',
      zIndex: 1,
      borderRadius: 1,
      p: '3px',
      '&:hover': {
        backgroundColor: 'secondary.dark'
      }
    }
  }, /*#__PURE__*/_react.default.createElement(_icons.TrashIcon, {
    sx: {
      fontSize: '1.125rem',
      color: 'common.white'
    }
  })), /*#__PURE__*/_react.default.createElement(_thumbnail.Thumbnail, {
    disabled: props.disabled,
    html: attachment.previewHTML
  }));
};
ThumbnailUrl.propTypes = {
  attachments: _propTypes.default.arrayOf(_attachment.AttachmentPropType).isRequired,
  disabled: _propTypes.default.bool,
  onDetach: _propTypes.default.func
};
var _default = exports["default"] = ThumbnailUrl;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/thumbnail.js":
/*!********************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/attachments/thumbnail.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Thumbnail = exports.THUMBNAIL_SIZE = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _taggedTemplateLiteral2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "../node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _styledComponents = _interopRequireDefault(__webpack_require__(/*! styled-components */ "../node_modules/styled-components/dist/styled-components.browser.esm.js"));
var _templateObject;
var THUMBNAIL_SIZE = exports.THUMBNAIL_SIZE = 64;
var StyledBody = _styledComponents.default.body(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n\thtml, body {\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t\toverflow: hidden;\n\t}\n\n\tbody > * {\n\t\twidth: 100% !important;\n\t}\n\n\tbody > img {\n\t\theight: 100%;\n\t\tobject-fit: cover;\n\t}\n\n\tbody:has(> img) {\n\t\theight: ", "px\n\t}\n"])), THUMBNAIL_SIZE);
var Thumbnail = exports.Thumbnail = function Thumbnail(props) {
  var _props$html$match, _props$html$match2;
  var dataWidth = (_props$html$match = props.html.match('data-width="(?<width>\\d+)"')) === null || _props$html$match === void 0 || (_props$html$match = _props$html$match.groups) === null || _props$html$match === void 0 ? void 0 : _props$html$match.width;
  var dataHeight = (_props$html$match2 = props.html.match('data-height="(?<height>\\d+)"')) === null || _props$html$match2 === void 0 || (_props$html$match2 = _props$html$match2.groups) === null || _props$html$match2 === void 0 ? void 0 : _props$html$match2.height;
  var width = dataWidth ? parseInt(dataWidth) : THUMBNAIL_SIZE;
  var height = dataHeight ? parseInt(dataHeight) : THUMBNAIL_SIZE;
  var scaleFactor = Math.min(height, width);
  var scale = THUMBNAIL_SIZE / scaleFactor;

  // Center the preview
  var top = height > width ? (THUMBNAIL_SIZE - THUMBNAIL_SIZE * (height / width)) / 2 : 0;
  var left = width > height ? (THUMBNAIL_SIZE - THUMBNAIL_SIZE * (width / height)) / 2 : 0;
  return /*#__PURE__*/_react.default.createElement(_ui.Box, {
    dir: "ltr",
    sx: {
      position: 'relative',
      cursor: 'default',
      overflow: 'hidden',
      border: '1px solid',
      borderColor: 'grey.300',
      borderRadius: 1,
      boxSizing: 'border-box',
      width: THUMBNAIL_SIZE,
      height: THUMBNAIL_SIZE,
      opacity: props.disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/_react.default.createElement("iframe", {
    title: (0, _i18n.__)('Preview', 'elementor'),
    sandbox: "",
    srcDoc: "<style>" + StyledBody.componentStyle.rules.join('') + "</style>" + props.html,
    style: {
      border: 'none',
      overflow: 'hidden',
      width: width,
      height: height,
      transform: "scale(".concat(scale, ")"),
      transformOrigin: "".concat(left, "px ").concat(top, "px")
    }
  }));
};
Thumbnail.propTypes = {
  html: _propTypes.default.string.isRequired,
  disabled: _propTypes.default.bool
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/url-dialog.js":
/*!*********************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/attachments/url-dialog.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.UrlDialog = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _alertDialog = __webpack_require__(/*! ../../../../components/alert-dialog */ "../modules/ai/assets/js/editor/components/alert-dialog.js");
var _useTimeout3 = __webpack_require__(/*! ../../../../hooks/use-timeout */ "../modules/ai/assets/js/editor/hooks/use-timeout.js");
var _attachments = __webpack_require__(/*! ../attachments */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments.js");
var _remoteConfig = __webpack_require__(/*! ../../context/remote-config */ "../modules/ai/assets/js/editor/pages/form-layout/context/remote-config.js");
var _useUserInfo2 = _interopRequireDefault(__webpack_require__(/*! ../../../../hooks/use-user-info */ "../modules/ai/assets/js/editor/hooks/use-user-info.js"));
var _requestsIds = __webpack_require__(/*! ../../../../context/requests-ids */ "../modules/ai/assets/js/editor/context/requests-ids.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var UrlDialog = exports.UrlDialog = function UrlDialog(props) {
  var _useTimeout = (0, _useTimeout3.useTimeout)(10000),
    _useTimeout2 = (0, _slicedToArray2.default)(_useTimeout, 2),
    isTimeout = _useTimeout2[0],
    turnOffTimeout = _useTimeout2[1];
  var _useUserInfo = (0, _useUserInfo2.default)(),
    isLoading = _useUserInfo.isLoading,
    initialUsagePercentage = _useUserInfo.usagePercentage;
  var _useRequestIds = (0, _requestsIds.useRequestIds)(),
    updateUsagePercentage = _useRequestIds.updateUsagePercentage;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    isInitUsageDone = _useState2[0],
    setIsInitUsageDone = _useState2[1];
  var _useRemoteConfig = (0, _remoteConfig.useRemoteConfig)(),
    remoteConfig = _useRemoteConfig.remoteConfig;
  var builderUrl = remoteConfig[_remoteConfig.CONFIG_KEYS.WEB_BASED_BUILDER_URL];
  var urlObject = builderUrl ? new URL(builderUrl) : {};
  var iframeOrigin = urlObject.origin;
  var isOpen = (0, _react.useRef)(false);
  (0, _react.useEffect)(function () {
    if (!isInitUsageDone && !isLoading && (initialUsagePercentage || 0 === initialUsagePercentage)) {
      updateUsagePercentage(initialUsagePercentage);
      setIsInitUsageDone(true);
    }
  }, [isLoading, initialUsagePercentage, isInitUsageDone, updateUsagePercentage]);
  (0, _react.useEffect)(function () {
    if (!isOpen.current) {
      try {
        window.$e.run('ai-integration/open-choose-element', {
          url: props.url
        });
        isOpen.current = true;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }, [isOpen.current]);
  (0, _react.useEffect)(function () {
    var onMessage = function onMessage(event) {
      if (event.origin !== iframeOrigin) {
        return;
      }
      var _event$data = event.data,
        type = _event$data.type,
        html = _event$data.html,
        url = _event$data.url;
      switch (type) {
        case 'element-selector/close':
          isOpen.current = false;
          props.onClose();
          break;
        case 'element-selector/loaded':
          turnOffTimeout();
          isOpen.current = true;
          break;
        case 'element-selector/attach':
          props.onAttach([{
            type: 'url',
            previewHTML: html,
            content: html,
            label: url ? new URL(url).href : '',
            source: _attachments.USER_URL_SOURCE
          }]);
          break;
      }
    };
    window.addEventListener('message', onMessage);
    return function () {
      window.removeEventListener('message', onMessage);
    };
  }, [iframeOrigin, props, turnOffTimeout]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !isOpen.current && !isTimeout && /*#__PURE__*/_react.default.createElement(_ui.Dialog, {
    open: true,
    maxWidth: "lg"
  }, /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    sx: {
      textAlign: 'center',
      padding: 3
    }
  }, (0, _i18n.__)('Loading...', 'elementor'))), isTimeout && /*#__PURE__*/_react.default.createElement(_alertDialog.AlertDialog, {
    message: (0, _i18n.__)('The app is not responding. Please try again later. (#408)', 'elementor'),
    onClose: props.onClose
  }));
};
UrlDialog.propTypes = {
  onAttach: _propTypes.default.func.isRequired,
  onClose: _propTypes.default.func.isRequired,
  url: _propTypes.default.string
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/layout-dialog.js":
/*!************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/layout-dialog.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "../node_modules/@babel/runtime/helpers/objectWithoutProperties.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _promptDialog = _interopRequireDefault(__webpack_require__(/*! ../../../components/prompt-dialog */ "../modules/ai/assets/js/editor/components/prompt-dialog.js"));
var _icons = __webpack_require__(/*! @elementor/icons */ "@elementor/icons");
var _excluded = ["sx", "PaperProps"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var StyledDialog = (0, _ui.styled)(_promptDialog.default)(function () {
  return {
    '& .MuiDialog-container': {
      marginTop: 0,
      alignItems: 'flex-end',
      paddingBottom: '16vh'
    },
    '& .MuiPaper-root': {
      margin: 0,
      maxHeight: '80vh'
    }
  };
});
var DialogHeader = function DialogHeader(_ref) {
  var onClose = _ref.onClose,
    children = _ref.children;
  return /*#__PURE__*/_react.default.createElement(_ui.AppBar, {
    sx: {
      fontWeight: 'normal'
    },
    color: "transparent",
    position: "relative"
  }, /*#__PURE__*/_react.default.createElement(_ui.Toolbar, {
    variant: "dense"
  }, /*#__PURE__*/_react.default.createElement(_icons.AIIcon, {
    sx: {
      mr: 1
    }
  }), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    component: "span",
    variant: "subtitle2",
    sx: {
      fontWeight: 'bold',
      textTransform: 'uppercase'
    }
  }, (0, _i18n.__)('AI', 'elementor')), /*#__PURE__*/_react.default.createElement(_ui.Chip, {
    label: (0, _i18n.__)('Beta', 'elementor'),
    color: "default",
    size: "small",
    sx: {
      ml: 1
    }
  }), /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    direction: "row",
    spacing: 1,
    alignItems: "center",
    sx: {
      ml: 'auto'
    }
  }, children, /*#__PURE__*/_react.default.createElement(_ui.IconButton, {
    size: "small",
    "aria-label": "close",
    onClick: onClose,
    sx: {
      '&.MuiButtonBase-root': {
        mr: -1
      }
    }
  }, /*#__PURE__*/_react.default.createElement(_icons.XIcon, null)))));
};
DialogHeader.propTypes = {
  children: _propTypes.default.node,
  onClose: _propTypes.default.func.isRequired
};
var StyledDialogContent = (0, _ui.styled)(_promptDialog.default.Content)(function () {
  return {
    '&.MuiDialogContent-root': {
      padding: 0
    }
  };
});
var LayoutDialog = function LayoutDialog(_ref2) {
  var _ref2$sx = _ref2.sx,
    sx = _ref2$sx === void 0 ? {} : _ref2$sx,
    _ref2$PaperProps = _ref2.PaperProps,
    PaperProps = _ref2$PaperProps === void 0 ? {} : _ref2$PaperProps,
    props = (0, _objectWithoutProperties2.default)(_ref2, _excluded);
  var _useState = (0, _react.useState)({
      pointerEvents: 'none'
    }),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    sxStyle = _useState2[0],
    setSxStyle = _useState2[1];
  var timeoutRef = (0, _react.useRef)(null);

  /**
   * The PromptDialog is using disableScrollLock in order to allow scrolling the page when the Dialog is opened.
   * When using the react-draggable library inside the editor, the background page scroll is not working smoothly.
   * Therefore, we need to delay the pointerEvents: none, which allowing to scroll the page content.
   */
  return /*#__PURE__*/_react.default.createElement(StyledDialog, (0, _extends2.default)({
    maxWidth: "md",
    PaperProps: _objectSpread({
      sx: {
        pointerEvents: 'auto'
      },
      onMouseEnter: function onMouseEnter() {
        clearTimeout(timeoutRef.current);
        setSxStyle({
          pointerEvents: 'all'
        });
      },
      onMouseLeave: function onMouseLeave() {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(function () {
          setSxStyle({
            pointerEvents: 'none'
          });
        }, 200);
      }
    }, PaperProps)
  }, props, {
    sx: _objectSpread(_objectSpread({}, sxStyle), sx)
  }));
};
LayoutDialog.propTypes = {
  sx: _propTypes.default.object,
  PaperProps: _propTypes.default.object
};
LayoutDialog.Header = DialogHeader;
LayoutDialog.Content = StyledDialogContent;
var _default = exports["default"] = LayoutDialog;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/pro-template-indicator.js":
/*!*********************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/pro-template-indicator.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ProTemplateIndicator = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _lockIcon = _interopRequireDefault(__webpack_require__(/*! ../../../icons/lock-icon */ "../modules/ai/assets/js/editor/icons/lock-icon.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var popoverId = 'e-pro-upgrade-popover';
var StyledContent = (0, _ui.styled)(_ui.Paper)(function (_ref) {
  var theme = _ref.theme;
  return {
    position: 'relative',
    padding: theme.spacing(3),
    boxShadow: theme.shadows[4],
    zIndex: '9999'
  };
});
var StyledArrow = (0, _ui.styled)(_ui.Box)(function (_ref2) {
  var theme = _ref2.theme;
  return {
    position: 'absolute',
    width: theme.spacing(5),
    height: theme.spacing(5),
    overflow: 'hidden',
    // Override Popper inline styles.
    left: '100% !important',
    transform: 'translateX(-50%) translateY(-50%) rotate(var(--rotate, 0deg)) !important',
    '&::after': {
      backgroundColor: theme.palette.background.paper,
      content: '""',
      display: 'block',
      position: 'absolute',
      width: theme.spacing(2.5),
      height: theme.spacing(2.5),
      top: '50%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-50%) rotate(45deg)',
      boxShadow: '5px -5px 5px 0px rgba(0, 0, 0, 0.2)',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
    }
  };
});
var ProTemplateIndicator = exports.ProTemplateIndicator = function ProTemplateIndicator() {
  var actionUrl = 'https://go.elementor.com/go-pro-ai/';
  var actionLabel = (0, _i18n.__)('Go Pro', 'elementor');
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    isPopoverOpen = _useState2[0],
    setIsPopoverOpen = _useState2[1];
  var anchorEl = (0, _react.useRef)(null);
  var arrowEl = (0, _react.useRef)(null);
  var showPopover = function showPopover() {
    return setIsPopoverOpen(true);
  };
  var hidePopover = function hidePopover() {
    return setIsPopoverOpen(false);
  };
  return /*#__PURE__*/_react.default.createElement(_ui.Box, {
    flexDirection: "row-reverse",
    component: "span",
    display: "flex",
    onMouseLeave: hidePopover,
    alignItems: "center"
  }, /*#__PURE__*/_react.default.createElement(_ui.IconButton, {
    ref: anchorEl,
    onMouseEnter: showPopover,
    onClick: function onClick(e) {
      return e.stopPropagation();
    } /* Do nothing */,
    "aria-owns": isPopoverOpen ? popoverId : undefined,
    "aria-haspopup": "true",
    sx: {
      m: 1,
      '&:hover': {
        backgroundColor: 'action.selected'
      }
    }
  }, /*#__PURE__*/_react.default.createElement(_lockIcon.default, {
    sx: {
      color: 'text.primary'
    }
  })), /*#__PURE__*/_react.default.createElement(_ui.Popper, {
    open: isPopoverOpen,
    popperOptions: {
      placement: 'left-start',
      modifiers: [{
        name: 'arrow',
        enabled: true,
        options: {
          element: arrowEl.current,
          padding: 5
        }
      }, {
        name: 'offset',
        options: {
          offset: [0, 10]
        }
      }]
    },
    anchorEl: anchorEl.current,
    sx: {
      zIndex: '9999',
      maxWidth: 300
    }
  }, /*#__PURE__*/_react.default.createElement(StyledContent, null, /*#__PURE__*/_react.default.createElement(StyledArrow, {
    ref: arrowEl
  }), /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    alignItems: "start",
    spacing: 2
  }, /*#__PURE__*/_react.default.createElement(_ui.Chip, {
    color: "promotion",
    variant: "outlined",
    size: "small",
    label: (0, _i18n.__)('Pro', 'elementor'),
    icon: /*#__PURE__*/_react.default.createElement(_lockIcon.default, null)
  }), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "body2"
  }, (0, _i18n.__)("This result includes an Elementor Pro widget that's not available with your current plan. Upgrade to use all the widgets in this result.", 'elementor')), /*#__PURE__*/_react.default.createElement(_ui.Button, {
    variant: "contained",
    color: "promotion",
    size: "small",
    href: actionUrl,
    target: "_blank",
    sx: {
      alignSelf: 'flex-end'
    }
  }, actionLabel)))));
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/prompt-autocomplete.js":
/*!******************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/prompt-autocomplete.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "../node_modules/@babel/runtime/helpers/objectWithoutProperties.js"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _promptLibraryLink = _interopRequireDefault(__webpack_require__(/*! ../../../components/prompt-library-link */ "../modules/ai/assets/js/editor/components/prompt-library-link.js"));
var _config = __webpack_require__(/*! ../context/config */ "../modules/ai/assets/js/editor/pages/form-layout/context/config.js");
var _excluded = ["onSubmit"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var TextInput = (0, _react.forwardRef)(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_ui.TextField
  // eslint-disable-next-line jsx-a11y/no-autofocus
  , (0, _extends2.default)({
    autoFocus: true,
    multiline: true,
    size: "small",
    maxRows: 3,
    color: "secondary",
    variant: "standard"
  }, props, {
    inputRef: ref,
    InputProps: _objectSpread(_objectSpread({}, props.InputProps), {}, {
      type: 'search',
      sx: {
        pt: 0
      }
    })
  }));
});
TextInput.propTypes = {
  InputProps: _propTypes.default.object
};
var PaperComponent = function PaperComponent(props) {
  var _useConfig = (0, _config.useConfig)(),
    mode = _useConfig.mode;
  var libraryLink = _config.MODE_VARIATION === mode ? 'https://go.elementor.com/ai-prompt-library-variations/' : 'https://go.elementor.com/ai-prompt-library-containers/';
  return /*#__PURE__*/_react.default.createElement(_ui.Paper, (0, _extends2.default)({}, props, {
    elevation: 8,
    sx: {
      borderRadius: 2
    }
  }), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    component: _ui.Box,
    color: function color(theme) {
      return theme.palette.text.tertiary;
    },
    variant: "caption",
    paddingX: 2,
    paddingY: 1
  }, (0, _i18n.__)('Suggested Prompts', 'elementor')), /*#__PURE__*/_react.default.createElement(_ui.Divider, null), props.children, /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    sx: {
      m: 2
    }
  }, /*#__PURE__*/_react.default.createElement(_promptLibraryLink.default, {
    libraryLink: libraryLink
  })));
};
PaperComponent.propTypes = {
  children: _propTypes.default.node
};
var PromptAutocomplete = function PromptAutocomplete(_ref) {
  var onSubmit = _ref.onSubmit,
    props = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    showSuggestions = _useState2[0],
    setShowSuggestions = _useState2[1];
  var theme = (0, _ui.useTheme)();
  var itemHeight = parseInt(theme.spacing(4));
  var maxItems = 5;
  return /*#__PURE__*/_react.default.createElement(_ui.Autocomplete, (0, _extends2.default)({
    PaperComponent: PaperComponent,
    ListboxProps: {
      sx: {
        maxHeight: maxItems * itemHeight
      }
    },
    renderOption: function renderOption(optionProps, option) {
      return /*#__PURE__*/_react.default.createElement(_ui.Typography, (0, _extends2.default)({}, optionProps, {
        title: option.text,
        noWrap: true,
        variant: "body2",
        component: _ui.Box,
        sx: {
          '&.MuiAutocomplete-option': {
            display: 'block',
            minHeight: itemHeight
          }
        }
      }), option.text);
    },
    freeSolo: true,
    fullWidth: true,
    disableClearable: true,
    open: showSuggestions,
    onClose: function onClose(e) {
      var _e$relatedTarget;
      return setShowSuggestions('A' === ((_e$relatedTarget = e.relatedTarget) === null || _e$relatedTarget === void 0 ? void 0 : _e$relatedTarget.tagName));
    },
    onKeyDown: function onKeyDown(e) {
      if ('Enter' === e.key && !e.shiftKey && !showSuggestions) {
        onSubmit(e);
      } else if ('/' === e.key && '' === e.target.value) {
        e.preventDefault();
        setShowSuggestions(true);
      }
    }
  }, props));
};
PromptAutocomplete.propTypes = {
  onSubmit: _propTypes.default.func.isRequired
};
PromptAutocomplete.TextInput = TextInput;
var _default = exports["default"] = PromptAutocomplete;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/prompt-form.js":
/*!**********************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/prompt-form.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "../node_modules/@babel/runtime/helpers/objectWithoutProperties.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _promptAutocomplete = _interopRequireDefault(__webpack_require__(/*! ./prompt-autocomplete */ "../modules/ai/assets/js/editor/pages/form-layout/components/prompt-autocomplete.js"));
var _enhanceButton = _interopRequireDefault(__webpack_require__(/*! ../../form-media/components/enhance-button */ "../modules/ai/assets/js/editor/pages/form-media/components/enhance-button.js"));
var _generateSubmit = _interopRequireDefault(__webpack_require__(/*! ../../form-media/components/generate-submit */ "../modules/ai/assets/js/editor/pages/form-media/components/generate-submit.js"));
var _arrowLeftIcon = _interopRequireDefault(__webpack_require__(/*! ../../../icons/arrow-left-icon */ "../modules/ai/assets/js/editor/icons/arrow-left-icon.js"));
var _editIcon = _interopRequireDefault(__webpack_require__(/*! ../../../icons/edit-icon */ "../modules/ai/assets/js/editor/icons/edit-icon.js"));
var _usePromptEnhancer2 = _interopRequireDefault(__webpack_require__(/*! ../../../hooks/use-prompt-enhancer */ "../modules/ai/assets/js/editor/hooks/use-prompt-enhancer.js"));
var _attachments = _interopRequireDefault(__webpack_require__(/*! ./attachments */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments.js"));
var _config = __webpack_require__(/*! ../context/config */ "../modules/ai/assets/js/editor/pages/form-layout/context/config.js");
var _attachment = __webpack_require__(/*! ../../../types/attachment */ "../modules/ai/assets/js/editor/types/attachment.js");
var _excluded = ["tooltip"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var PROMPT_SUGGESTIONS = Object.freeze([{
  text: (0, _i18n.__)('Hero section on [topic] with heading, text, buttons on the right, and an image on the left', 'elementor.com')
}, {
  text: (0, _i18n.__)('About Us section on [topic] with heading, text, and big image below', 'elementor.com')
}, {
  text: (0, _i18n.__)('Team section with four image boxes showcasing team members', 'elementor.com')
}, {
  text: (0, _i18n.__)('FAQ section with a toggle widget showcasing FAQs about [topic]', 'elementor.com')
}, {
  text: (0, _i18n.__)('Gallery section with a carousel displaying three images at once', 'elementor.com')
}, {
  text: (0, _i18n.__)('Contact section with a form for [topic]', 'elementor.com')
}, {
  text: (0, _i18n.__)('Client section featuring companies\' logos', 'elementor.com')
}, {
  text: (0, _i18n.__)('Testimonial section with testimonials, each featuring a star rating and an image', 'elementor.com')
}, {
  text: (0, _i18n.__)('Service section about [topic], showcasing four services with buttons', 'elementor.com')
}, {
  text: (0, _i18n.__)('Stats section with counters displaying data about [topic]', 'elementor.com')
}, {
  text: (0, _i18n.__)('Quote section with colored background, featuring a centered quote', 'elementor.com')
}, {
  text: (0, _i18n.__)('Pricing section for [topic] with a pricing list', 'elementor.com')
}, {
  text: (0, _i18n.__)('Subscribe section featuring a simple email form, inviting users to stay informed on [topic]', 'elementor.com')
}]);
var IconButtonWithTooltip = function IconButtonWithTooltip(_ref) {
  var tooltip = _ref.tooltip,
    props = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  return /*#__PURE__*/_react.default.createElement(_ui.Tooltip, {
    title: tooltip
  }, /*#__PURE__*/_react.default.createElement(_ui.Box, {
    component: "span",
    sx: {
      cursor: props.disabled ? 'default' : 'pointer'
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.IconButton, props)));
};
IconButtonWithTooltip.propTypes = {
  tooltip: _propTypes.default.string,
  disabled: _propTypes.default.bool
};
var BackButton = function BackButton(props) {
  return /*#__PURE__*/_react.default.createElement(IconButtonWithTooltip, (0, _extends2.default)({
    size: "small",
    color: "secondary",
    tooltip: (0, _i18n.__)('Back to results', 'elementor')
  }, props), /*#__PURE__*/_react.default.createElement(_arrowLeftIcon.default, null));
};
var EditButton = function EditButton(props) {
  return /*#__PURE__*/_react.default.createElement(IconButtonWithTooltip, (0, _extends2.default)({
    size: "small",
    color: "primary",
    tooltip: (0, _i18n.__)('Edit prompt', 'elementor')
  }, props), /*#__PURE__*/_react.default.createElement(_editIcon.default, null));
};
var GenerateButton = function GenerateButton(props) {
  return /*#__PURE__*/_react.default.createElement(_generateSubmit.default, (0, _extends2.default)({
    size: "small",
    fullWidth: false
  }, props), (0, _i18n.__)('Generate', 'elementor'));
};
var PromptForm = (0, _react.forwardRef)(function (_ref2, ref) {
  var _attachments$;
  var attachments = _ref2.attachments,
    isActive = _ref2.isActive,
    isLoading = _ref2.isLoading,
    _ref2$showActions = _ref2.showActions,
    showActions = _ref2$showActions === void 0 ? false : _ref2$showActions,
    onAttach = _ref2.onAttach,
    onDetach = _ref2.onDetach,
    _onSubmit = _ref2.onSubmit,
    onBack = _ref2.onBack,
    onEdit = _ref2.onEdit,
    _ref2$shouldResetProm = _ref2.shouldResetPrompt,
    shouldResetPrompt = _ref2$shouldResetProm === void 0 ? false : _ref2$shouldResetProm;
  var _useState = (0, _react.useState)(''),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    prompt = _useState2[0],
    setPrompt = _useState2[1];
  (0, _react.useEffect)(function () {
    if (shouldResetPrompt) {
      setPrompt('');
    }
  }, [shouldResetPrompt]);
  var _usePromptEnhancer = (0, _usePromptEnhancer2.default)(prompt, 'layout'),
    isEnhancing = _usePromptEnhancer.isEnhancing,
    enhance = _usePromptEnhancer.enhance;
  var previousPrompt = (0, _react.useRef)('');
  var _useConfig = (0, _config.useConfig)(),
    attachmentsTypes = _useConfig.attachmentsTypes;
  var isInputDisabled = isLoading || isEnhancing || !isActive;
  var isInputEmpty = '' === prompt && !attachments.length;
  var isGenerateDisabled = isInputDisabled || isInputEmpty;
  var attachmentsType = ((_attachments$ = attachments[0]) === null || _attachments$ === void 0 ? void 0 : _attachments$.type) || '';
  var attachmentsConfig = attachmentsTypes[attachmentsType];
  var promptSuggestions = (attachmentsConfig === null || attachmentsConfig === void 0 ? void 0 : attachmentsConfig.promptSuggestions) || PROMPT_SUGGESTIONS;
  var promptPlaceholder = (attachmentsConfig === null || attachmentsConfig === void 0 ? void 0 : attachmentsConfig.promptPlaceholder) || (0, _i18n.__)("Press '/' for suggested prompts or describe the layout you want to create", 'elementor');
  var handleBack = function handleBack() {
    setPrompt(previousPrompt.current);
    onBack();
  };
  var handleEdit = function handleEdit() {
    previousPrompt.current = prompt;
    onEdit();
  };
  return /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    component: "form",
    onSubmit: function onSubmit(e) {
      return _onSubmit(e, prompt);
    },
    direction: "row",
    sx: {
      p: 3
    },
    alignItems: "start",
    gap: 1
  }, /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    direction: "row",
    alignItems: "start",
    flexGrow: 1,
    spacing: 2
  }, showActions && (isActive ? /*#__PURE__*/_react.default.createElement(BackButton, {
    disabled: isLoading || isEnhancing,
    onClick: handleBack
  }) : /*#__PURE__*/_react.default.createElement(EditButton, {
    disabled: isLoading,
    onClick: handleEdit
  })), /*#__PURE__*/_react.default.createElement(_attachments.default, {
    attachments: attachments,
    onAttach: onAttach,
    onDetach: onDetach,
    disabled: isInputDisabled
  }), /*#__PURE__*/_react.default.createElement(_promptAutocomplete.default, {
    value: prompt,
    disabled: isInputDisabled,
    onSubmit: function onSubmit(e) {
      return _onSubmit(e, prompt);
    },
    options: promptSuggestions,
    onChange: function onChange(_, selectedValue) {
      return setPrompt(selectedValue.text + ' ');
    },
    renderInput: function renderInput(params) {
      return /*#__PURE__*/_react.default.createElement(_promptAutocomplete.default.TextInput, (0, _extends2.default)({}, params, {
        ref: ref,
        onChange: function onChange(e) {
          return setPrompt(e.target.value);
        },
        placeholder: promptPlaceholder
      }));
    }
  })), /*#__PURE__*/_react.default.createElement(_enhanceButton.default, {
    size: "small",
    disabled: isGenerateDisabled || '' === prompt,
    isLoading: isEnhancing,
    onClick: function onClick() {
      return enhance().then(function (_ref3) {
        var result = _ref3.result;
        return setPrompt(result);
      });
    }
  }), /*#__PURE__*/_react.default.createElement(GenerateButton, {
    disabled: isGenerateDisabled
  }));
});
PromptForm.propTypes = {
  isActive: _propTypes.default.bool,
  onAttach: _propTypes.default.func,
  onDetach: _propTypes.default.func,
  isLoading: _propTypes.default.bool,
  showActions: _propTypes.default.bool,
  onSubmit: _propTypes.default.func.isRequired,
  onBack: _propTypes.default.func.isRequired,
  onEdit: _propTypes.default.func.isRequired,
  attachments: _propTypes.default.arrayOf(_attachment.AttachmentPropType),
  shouldResetPrompt: _propTypes.default.bool
};
var _default = exports["default"] = PromptForm;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/screenshot-container.js":
/*!*******************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/screenshot-container.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var ScreenshotContainer = (0, _ui.styled)(_ui.Box, {
  shouldForwardProp: function shouldForwardProp(prop) {
    return prop !== 'outlineOffset';
  }
})(function (_ref) {
  var theme = _ref.theme,
    selected = _ref.selected,
    height = _ref.height,
    disabled = _ref.disabled,
    _ref$outlineOffset = _ref.outlineOffset,
    outlineOffset = _ref$outlineOffset === void 0 ? '0px' : _ref$outlineOffset;
  var outlineColor = selected ? theme.palette.text.primary : theme.palette.text.disabled;
  var outline = "2px solid ".concat(outlineColor);
  return {
    height: height,
    cursor: disabled ? 'default' : 'pointer',
    overflow: 'hidden',
    boxSizing: 'border-box',
    backgroundPosition: 'top center',
    backgroundSize: '100% auto',
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius * 0.5,
    outlineOffset: outlineOffset,
    outline: outline,
    opacity: disabled ? '0.4' : '1',
    transition: "all 50ms linear",
    '&:hover': disabled ? {} : {
      outlineColor: theme.palette.text.primary
    }
  };
});
var _default = exports["default"] = ScreenshotContainer;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/screenshot-unavailable.js":
/*!*********************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/screenshot-unavailable.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = ScreenshotUnavailable;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _screenshotContainer = _interopRequireDefault(__webpack_require__(/*! ./screenshot-container */ "../modules/ai/assets/js/editor/pages/form-layout/components/screenshot-container.js"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function ScreenshotUnavailable(props) {
  return /*#__PURE__*/_react.default.createElement(_screenshotContainer.default, (0, _extends2.default)({}, props, {
    sx: _objectSpread(_objectSpread({}, props.sx || {}), {}, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'background.paper',
      color: 'text.tertiary',
      fontStyle: 'italic',
      fontSize: '12px',
      paddingInline: 12,
      textAlign: 'center',
      lineHeight: 1.5
    })
  }), (0, _i18n.__)('Preview unavailable', 'elementor'));
}
ScreenshotUnavailable.propTypes = {
  sx: _propTypes.default.object
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/screenshot.js":
/*!*********************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/screenshot.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _screenshotContainer = _interopRequireDefault(__webpack_require__(/*! ./screenshot-container */ "../modules/ai/assets/js/editor/pages/form-layout/components/screenshot-container.js"));
var _screenshotUnavailable = _interopRequireDefault(__webpack_require__(/*! ./screenshot-unavailable */ "../modules/ai/assets/js/editor/pages/form-layout/components/screenshot-unavailable.js"));
var _templateBadge = _interopRequireDefault(__webpack_require__(/*! ./template-badge */ "../modules/ai/assets/js/editor/pages/form-layout/components/template-badge.js"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var SCREENSHOT_HEIGHT = '138px';
var Screenshot = function Screenshot(_ref) {
  var url = _ref.url,
    type = _ref.type,
    _ref$isLoading = _ref.isLoading,
    isLoading = _ref$isLoading === void 0 ? false : _ref$isLoading,
    _ref$isSelected = _ref.isSelected,
    isSelected = _ref$isSelected === void 0 ? false : _ref$isSelected,
    isPlaceholder = _ref.isPlaceholder,
    disabled = _ref.disabled,
    onClick = _ref.onClick,
    _ref$sx = _ref.sx,
    sx = _ref$sx === void 0 ? {} : _ref$sx,
    outlineOffset = _ref.outlineOffset;
  if (isPlaceholder) {
    return /*#__PURE__*/_react.default.createElement(_ui.Box, {
      sx: _objectSpread({
        height: SCREENSHOT_HEIGHT
      }, sx)
    });
  }
  if (isLoading) {
    return /*#__PURE__*/_react.default.createElement(_ui.Skeleton, {
      width: "100%",
      animation: "wave",
      variant: "rounded",
      height: SCREENSHOT_HEIGHT,
      sx: sx
    });
  }
  if (!url) {
    return /*#__PURE__*/_react.default.createElement(_screenshotUnavailable.default, {
      selected: isSelected,
      disabled: disabled,
      sx: sx,
      onClick: onClick,
      height: SCREENSHOT_HEIGHT,
      outlineOffset: outlineOffset
    });
  }
  return /*#__PURE__*/_react.default.createElement(_screenshotContainer.default, {
    selected: isSelected,
    disabled: disabled,
    sx: _objectSpread({
      backgroundImage: "url('".concat(url, "')")
    }, sx),
    onClick: onClick,
    height: SCREENSHOT_HEIGHT,
    outlineOffset: outlineOffset
  }, /*#__PURE__*/_react.default.createElement(_templateBadge.default, {
    type: type
  }));
};
Screenshot.propTypes = {
  isSelected: _propTypes.default.bool,
  isLoading: _propTypes.default.bool,
  isPlaceholder: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  onClick: _propTypes.default.func.isRequired,
  url: _propTypes.default.string,
  type: _propTypes.default.string,
  sx: _propTypes.default.object,
  outlineOffset: _propTypes.default.string
};
var _default = exports["default"] = Screenshot;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/template-badge.js":
/*!*************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/template-badge.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _config = __webpack_require__(/*! ../context/config */ "../modules/ai/assets/js/editor/pages/form-layout/context/config.js");
var _proTemplateIndicator = __webpack_require__(/*! ./pro-template-indicator */ "../modules/ai/assets/js/editor/pages/form-layout/components/pro-template-indicator.js");
var TemplateBadge = function TemplateBadge(props) {
  var _useConfig = (0, _config.useConfig)(),
    hasPro = _useConfig.hasPro;
  if ('Pro' === props.type && !hasPro) {
    return /*#__PURE__*/_react.default.createElement(_proTemplateIndicator.ProTemplateIndicator, null);
  }
  return null;
};
var _default = exports["default"] = TemplateBadge;
TemplateBadge.propTypes = {
  type: _propTypes.default.string
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/components/unsaved-changes-alert.js":
/*!********************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/components/unsaved-changes-alert.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "../node_modules/@babel/runtime/helpers/objectWithoutProperties.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _excluded = ["onClose", "onCancel", "title", "text"];
var UnsavedChangesAlert = function UnsavedChangesAlert(_ref) {
  var onClose = _ref.onClose,
    onCancel = _ref.onCancel,
    title = _ref.title,
    text = _ref.text,
    props = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  return /*#__PURE__*/_react.default.createElement(_ui.Dialog, (0, _extends2.default)({
    "aria-labelledby": "unsaved-changes-alert-title",
    "aria-describedby": "unsaved-changes-alert-description"
  }, props), /*#__PURE__*/_react.default.createElement(_ui.DialogTitle, {
    id: "unsaved-changes-alert-title"
  }, title), /*#__PURE__*/_react.default.createElement(_ui.DialogContent, null, /*#__PURE__*/_react.default.createElement(_ui.DialogContentText, {
    id: "unsaved-changes-alert-description"
  }, text)), /*#__PURE__*/_react.default.createElement(_ui.DialogActions, null, /*#__PURE__*/_react.default.createElement(_ui.Button, {
    onClick: onCancel,
    color: "secondary"
  }, (0, _i18n.__)('Cancel', 'elementor')), /*#__PURE__*/_react.default.createElement(_ui.Button, {
    onClick: onClose,
    color: "error",
    variant: "contained"
  }, (0, _i18n.__)('Yes, leave', 'elementor'))));
};
UnsavedChangesAlert.propTypes = {
  title: _propTypes.default.string,
  text: _propTypes.default.string,
  onCancel: _propTypes.default.func,
  onClose: _propTypes.default.func
};
var _default = exports["default"] = UnsavedChangesAlert;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/context/config.js":
/*!**************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/context/config.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useConfig = exports["default"] = exports.MODE_VARIATION = exports.MODE_LAYOUT = exports.LAYOUT_APP_MODES = exports.ConfigProvider = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var MODE_LAYOUT = exports.MODE_LAYOUT = 'layout';
var MODE_VARIATION = exports.MODE_VARIATION = 'variation';
var LAYOUT_APP_MODES = exports.LAYOUT_APP_MODES = [MODE_LAYOUT, MODE_VARIATION];
var ConfigContext = _react.default.createContext({});
var useConfig = exports.useConfig = function useConfig() {
  return _react.default.useContext(ConfigContext);
};
var ConfigProvider = exports.ConfigProvider = function ConfigProvider(props) {
  return /*#__PURE__*/_react.default.createElement(ConfigContext.Provider, {
    value: {
      mode: props.mode,
      attachmentsTypes: props.attachmentsTypes,
      onClose: props.onClose,
      onConnect: props.onConnect,
      onData: props.onData,
      onInsert: props.onInsert,
      onSelect: props.onSelect,
      onGenerate: props.onGenerate,
      currentContext: props.currentContext,
      hasPro: props.hasPro
    }
  }, props.children);
};
ConfigProvider.propTypes = {
  mode: _propTypes.default.oneOf(LAYOUT_APP_MODES).isRequired,
  children: _propTypes.default.node.isRequired,
  attachmentsTypes: _propTypes.default.object.isRequired,
  onClose: _propTypes.default.func.isRequired,
  onConnect: _propTypes.default.func.isRequired,
  onData: _propTypes.default.func.isRequired,
  onInsert: _propTypes.default.func.isRequired,
  onSelect: _propTypes.default.func.isRequired,
  onGenerate: _propTypes.default.func.isRequired,
  currentContext: _propTypes.default.object,
  hasPro: _propTypes.default.bool
};
var _default = exports["default"] = ConfigContext;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/context/remote-config.js":
/*!*********************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/context/remote-config.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useRemoteConfig = exports.RemoteConfigProvider = exports.CONFIG_KEYS = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../node_modules/@babel/runtime/regenerator/index.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "../node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _api = __webpack_require__(/*! ../../../api */ "../modules/ai/assets/js/editor/api/index.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var RemoteConfigContext = _react.default.createContext({});
var useRemoteConfig = exports.useRemoteConfig = function useRemoteConfig() {
  return _react.default.useContext(RemoteConfigContext);
};
var CONFIG_KEYS = exports.CONFIG_KEYS = {
  WEB_BASED_BUILDER_URL: 'webBasedBuilderUrl',
  AUTH_TOKEN: 'jwt'
};
var RemoteConfigProvider = exports.RemoteConfigProvider = function RemoteConfigProvider(props) {
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    isLoading = _useState2[0],
    setIsLoading = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    isLoaded = _useState4[0],
    setIsLoaded = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
    isError = _useState6[0],
    setIsError = _useState6[1];
  var _useState7 = (0, _react.useState)({}),
    _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
    remoteConfig = _useState8[0],
    setRemoteConfig = _useState8[1];
  var fetchData = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee() {
      var result;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            setIsLoading(true);
            setIsError(false);
            _context.prev = 2;
            _context.next = 5;
            return (0, _api.getRemoteConfig)().finally(function () {
              setIsLoaded(true);
              setIsLoading(false);
            });
          case 5:
            result = _context.sent;
            if (result.config) {
              _context.next = 8;
              break;
            }
            throw new Error('Invalid remote config');
          case 8:
            setRemoteConfig(result.config);
            _context.next = 16;
            break;
          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](2);
            setIsError(true);
            setIsLoaded(true);
            setIsLoading(false);
          case 16:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[2, 11]]);
    }));
    return function fetchData() {
      return _ref.apply(this, arguments);
    };
  }();
  (0, _react.useEffect)(function () {
    window.addEventListener('elementor/connect/success', fetchData);
    return function () {
      window.removeEventListener('elementor/connect/success', fetchData);
    };
  }, []);
  if (!isLoaded && !isLoading) {
    fetchData();
  }
  return /*#__PURE__*/_react.default.createElement(RemoteConfigContext.Provider, {
    value: {
      isLoading: isLoading,
      isLoaded: isLoaded,
      isError: isError,
      remoteConfig: remoteConfig
    }
  }, props.children);
};
RemoteConfigProvider.propTypes = {
  children: _propTypes.default.node.isRequired,
  onError: _propTypes.default.func.isRequired
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/hooks/use-layout-prompt.js":
/*!***********************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/hooks/use-layout-prompt.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _api = __webpack_require__(/*! ../../../api */ "../modules/ai/assets/js/editor/api/index.js");
var _usePrompt = _interopRequireDefault(__webpack_require__(/*! ../../../hooks/use-prompt */ "../modules/ai/assets/js/editor/hooks/use-prompt.js"));
var useLayoutPrompt = function useLayoutPrompt(type, initialValue) {
  return (0, _usePrompt.default)(function (requestBody, signal) {
    requestBody.variationType = type;
    return (0, _api.generateLayout)(requestBody, signal);
  }, initialValue);
};
var _default = exports["default"] = useLayoutPrompt;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/hooks/use-screenshot.js":
/*!********************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/hooks/use-screenshot.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../node_modules/@babel/runtime/regenerator/index.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "../node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _react = __webpack_require__(/*! react */ "react");
var _useLayoutPrompt = _interopRequireDefault(__webpack_require__(/*! ./use-layout-prompt */ "../modules/ai/assets/js/editor/pages/form-layout/hooks/use-layout-prompt.js"));
var ERROR_INITIAL_VALUE = '';
var useScreenshot = function useScreenshot(type, onData) {
  var _useState = (0, _react.useState)(ERROR_INITIAL_VALUE),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    error = _useState2[0],
    setError = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    isLoading = _useState4[0],
    setIsLoading = _useState4[1];
  var layoutData = (0, _useLayoutPrompt.default)(type, null);
  var generate = function generate(requestBody, signal) {
    setIsLoading(true);
    setError(ERROR_INITIAL_VALUE);
    return layoutData.send(requestBody, signal).then(/*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee(data) {
        var createdScreenshot;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return onData(data.result);
            case 2:
              createdScreenshot = _context.sent;
              createdScreenshot.sendUsageData = function () {
                return layoutData.sendUsageData(data);
              };
              createdScreenshot.baseTemplateId = data.baseTemplateId;
              createdScreenshot.type = data.type;
              return _context.abrupt("return", createdScreenshot);
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()).catch(function (err) {
      setError(err.extra_data ? err : err.message || err);
      throw err;
    }).finally(function () {
      return setIsLoading(false);
    });
  };
  return {
    generate: generate,
    error: error,
    isLoading: isLoading
  };
};
var _default = exports["default"] = useScreenshot;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/hooks/use-screenshots.js":
/*!*********************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/hooks/use-screenshots.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../node_modules/@babel/runtime/regenerator/index.js"));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "../node_modules/@babel/runtime/helpers/toConsumableArray.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "../node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _react = __webpack_require__(/*! react */ "react");
var _useScreenshot = _interopRequireDefault(__webpack_require__(/*! ./use-screenshot */ "../modules/ai/assets/js/editor/pages/form-layout/hooks/use-screenshot.js"));
var _config = __webpack_require__(/*! ../context/config */ "../modules/ai/assets/js/editor/pages/form-layout/context/config.js");
var _requestsIds = __webpack_require__(/*! ../../../context/requests-ids */ "../modules/ai/assets/js/editor/context/requests-ids.js");
var PENDING_VALUE = {
  isPending: true
};
var useScreenshots = function useScreenshots(_ref) {
  var onData = _ref.onData;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    screenshots = _useState2[0],
    setScreenshots = _useState2[1];

  /**
   * The ids for each request are:
   * - editorSessionId: a unique id for each editor opening
   * - sessionId: a unique id for each session. (open the AI builder)
   * - generateId: a unique id for each generate request. (prompt change)
   * - batchId: a unique id for each batch of generate requests. (generate, regenerate)
   * - requestId: a unique id for each generate request.
   */

  var _useConfig = (0, _config.useConfig)(),
    currentContext = _useConfig.currentContext;
  var _useRequestIds = (0, _requestsIds.useRequestIds)(),
    editorSessionId = _useRequestIds.editorSessionId,
    sessionId = _useRequestIds.sessionId,
    setRequest = _useRequestIds.setRequest,
    setBatch = _useRequestIds.setBatch,
    setGenerate = _useRequestIds.setGenerate;
  var generateIdRef = (0, _react.useRef)('');
  var batchId = setBatch();
  var screenshotsData = [(0, _useScreenshot.default)(0, onData), (0, _useScreenshot.default)(1, onData), (0, _useScreenshot.default)(2, onData)];
  var screenshotsGroupCount = screenshotsData.length;
  var error = screenshotsData.every(function (s) {
    return s === null || s === void 0 ? void 0 : s.error;
  }) ? screenshotsData[0].error : '';
  var isLoading = screenshotsData.some(function (s) {
    return s === null || s === void 0 ? void 0 : s.isLoading;
  });
  var abortController = (0, _react.useRef)(null);
  var abort = function abort() {
    var _abortController$curr;
    return (_abortController$curr = abortController.current) === null || _abortController$curr === void 0 ? void 0 : _abortController$curr.abort();
  };
  var createScreenshots = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee(prompt, attachments) {
      var onGenerate, onError, promises, results, isAllFailed;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            abortController.current = new AbortController();
            onGenerate = function onGenerate(screenshot) {
              setScreenshots(function (prev) {
                var updatedData = (0, _toConsumableArray2.default)(prev);
                var pendingIndex = updatedData.indexOf(PENDING_VALUE);
                updatedData[pendingIndex] = screenshot;
                return updatedData;
              });
              return true;
            };
            onError = function onError() {
              setScreenshots(function (prev) {
                var updatedData = (0, _toConsumableArray2.default)(prev);
                var pendingIndex = updatedData.lastIndexOf(PENDING_VALUE);
                updatedData[pendingIndex] = {
                  isError: true
                };
                return updatedData;
              });
              return false;
            };
            promises = screenshotsData.map(function (_ref3) {
              var generate = _ref3.generate;
              var prevGeneratedIds = screenshots.map(function (screenshot) {
                return screenshot.baseTemplateId || '';
              });
              var requestBody = {
                prompt: prompt,
                prevGeneratedIds: prevGeneratedIds,
                currentContext: currentContext,
                ids: {
                  editorSessionId: editorSessionId.current,
                  sessionId: sessionId.current,
                  generateId: generateIdRef.current,
                  batchId: batchId.current,
                  requestId: setRequest().current
                },
                attachments: attachments.map(function (_ref4) {
                  var type = _ref4.type,
                    content = _ref4.content,
                    label = _ref4.label,
                    source = _ref4.source;
                  // Send only the data that is needed for the generation.
                  return {
                    type: type,
                    content: content,
                    label: label,
                    source: source
                  };
                })
              };
              return generate(requestBody, abortController.current.signal).then(onGenerate).catch(onError);
            });
            _context.next = 6;
            return Promise.all(promises);
          case 6:
            results = _context.sent;
            isAllFailed = results.every(function (value) {
              return false === value;
            });
            if (isAllFailed) {
              setScreenshots(function (prev) {
                var updatedData = (0, _toConsumableArray2.default)(prev);
                updatedData.splice(screenshotsGroupCount * -1);
                return updatedData;
              });
            }
          case 9:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function createScreenshots(_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();
  var generate = function generate(prompt, attachments) {
    var placeholders = Array(screenshotsGroupCount).fill(PENDING_VALUE);
    generateIdRef.current = setGenerate().current;
    setScreenshots(placeholders);
    createScreenshots(prompt, attachments);
  };
  var regenerate = function regenerate(prompt, attachments) {
    var placeholders = Array(screenshotsGroupCount).fill(PENDING_VALUE);
    setScreenshots(function (prev) {
      return [].concat((0, _toConsumableArray2.default)(prev), (0, _toConsumableArray2.default)(placeholders));
    });
    createScreenshots(prompt, attachments);
  };
  return {
    generate: generate,
    regenerate: regenerate,
    screenshots: screenshots,
    isLoading: isLoading,
    error: error,
    abort: abort
  };
};
var _default = exports["default"] = useScreenshots;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/hooks/use-slider.js":
/*!****************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/hooks/use-slider.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.SCREENSHOTS_PER_PAGE = exports.MAX_PAGES = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _react = __webpack_require__(/*! react */ "react");
var SCREENSHOTS_PER_PAGE = exports.SCREENSHOTS_PER_PAGE = 3;
var MAX_PAGES = exports.MAX_PAGES = 5;
var useSlider = function useSlider() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$slidesCount = _ref.slidesCount,
    slidesCount = _ref$slidesCount === void 0 ? 0 : _ref$slidesCount,
    _ref$slidesPerPage = _ref.slidesPerPage,
    slidesPerPage = _ref$slidesPerPage === void 0 ? SCREENSHOTS_PER_PAGE : _ref$slidesPerPage,
    _ref$gapPercentage = _ref.gapPercentage,
    gapPercentage = _ref$gapPercentage === void 0 ? 2 : _ref$gapPercentage;
  var _useState = (0, _react.useState)(1),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    currentPage = _useState2[0],
    setCurrentPage = _useState2[1];
  var gapsCount = slidesPerPage - 1;
  var slideWidthPercentage = (100 - gapPercentage * gapsCount) / slidesPerPage;
  var offsetXPercentage = (slideWidthPercentage + gapPercentage) * slidesPerPage * (currentPage - 1) * -1;
  var pagesCount = Math.ceil(slidesCount / slidesPerPage);
  (0, _react.useEffect)(function () {
    // In cases when the slidesCount value was reduced, we need to navigate to the last page.
    if (currentPage > 1 && currentPage > pagesCount) {
      setCurrentPage(pagesCount);
    }
  }, [pagesCount]);
  return {
    currentPage: currentPage,
    setCurrentPage: setCurrentPage,
    pagesCount: pagesCount,
    slidesPerPage: slidesPerPage,
    gapPercentage: gapPercentage,
    offsetXPercentage: offsetXPercentage,
    slideWidthPercentage: slideWidthPercentage
  };
};
var _default = exports["default"] = useSlider;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-layout/index.js":
/*!*****************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-layout/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "../node_modules/@babel/runtime/helpers/toConsumableArray.js"));
var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "../node_modules/@babel/runtime/helpers/objectWithoutProperties.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _promptErrorMessage = _interopRequireDefault(__webpack_require__(/*! ../../components/prompt-error-message */ "../modules/ai/assets/js/editor/components/prompt-error-message.js"));
var _unsavedChangesAlert = _interopRequireDefault(__webpack_require__(/*! ./components/unsaved-changes-alert */ "../modules/ai/assets/js/editor/pages/form-layout/components/unsaved-changes-alert.js"));
var _layoutDialog = _interopRequireDefault(__webpack_require__(/*! ./components/layout-dialog */ "../modules/ai/assets/js/editor/pages/form-layout/components/layout-dialog.js"));
var _promptForm = _interopRequireDefault(__webpack_require__(/*! ./components/prompt-form */ "../modules/ai/assets/js/editor/pages/form-layout/components/prompt-form.js"));
var _refreshIcon = _interopRequireDefault(__webpack_require__(/*! ../../icons/refresh-icon */ "../modules/ai/assets/js/editor/icons/refresh-icon.js"));
var _screenshot = _interopRequireDefault(__webpack_require__(/*! ./components/screenshot */ "../modules/ai/assets/js/editor/pages/form-layout/components/screenshot.js"));
var _useScreenshots2 = _interopRequireDefault(__webpack_require__(/*! ./hooks/use-screenshots */ "../modules/ai/assets/js/editor/pages/form-layout/hooks/use-screenshots.js"));
var _useSlider2 = _interopRequireWildcard(__webpack_require__(/*! ./hooks/use-slider */ "../modules/ai/assets/js/editor/pages/form-layout/hooks/use-slider.js"));
var _minimizeDiagonalIcon = _interopRequireDefault(__webpack_require__(/*! ../../icons/minimize-diagonal-icon */ "../modules/ai/assets/js/editor/icons/minimize-diagonal-icon.js"));
var _expandDiagonalIcon = _interopRequireDefault(__webpack_require__(/*! ../../icons/expand-diagonal-icon */ "../modules/ai/assets/js/editor/icons/expand-diagonal-icon.js"));
var _config = __webpack_require__(/*! ./context/config */ "../modules/ai/assets/js/editor/pages/form-layout/context/config.js");
var _attachment = __webpack_require__(/*! ../../types/attachment */ "../modules/ai/assets/js/editor/types/attachment.js");
var _promptPowerNotice = __webpack_require__(/*! ./components/attachments/prompt-power-notice */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/prompt-power-notice.js");
var _attachments = __webpack_require__(/*! ./components/attachments */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments.js");
var _attachDialog = _interopRequireDefault(__webpack_require__(/*! ./components/attachments/attach-dialog */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments/attach-dialog.js"));
var _isURL = _interopRequireDefault(__webpack_require__(/*! validator/lib/isURL */ "../node_modules/validator/lib/isURL.js"));
var _voicePromotionAlert = __webpack_require__(/*! ../../components/voice-promotion-alert */ "../modules/ai/assets/js/editor/components/voice-promotion-alert.js");
var _excluded = ["children"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var DirectionalMinimizeDiagonalIcon = (0, _ui.withDirection)(_minimizeDiagonalIcon.default);
var DirectionalExpandDiagonalIcon = (0, _ui.withDirection)(_expandDiagonalIcon.default);

/**
 * @typedef {Object} Attachment
 * @property {('json')} type        - The type of the attachment, currently only `json` is supported.
 * @property {string}   previewHTML - HTML content as a string, representing a preview.
 * @property {string}   content     - Actual content of the attachment as a string.
 * @property {string}   label       - Label for the attachment.
 */

var RegenerateButton = function RegenerateButton(props) {
  return /*#__PURE__*/_react.default.createElement(_ui.Button, (0, _extends2.default)({
    size: "small",
    color: "secondary",
    startIcon: /*#__PURE__*/_react.default.createElement(_refreshIcon.default, null)
  }, props), (0, _i18n.__)('Regenerate', 'elementor'));
};
var UseLayoutButton = function UseLayoutButton(props) {
  return /*#__PURE__*/_react.default.createElement(_ui.Button, (0, _extends2.default)({
    size: "small",
    variant: "contained"
  }, props), (0, _i18n.__)('Use Layout', 'elementor'));
};
UseLayoutButton.propTypes = {
  sx: _propTypes.default.object
};
var isRegenerateButtonDisabled = function isRegenerateButtonDisabled(screenshots, isLoading, isPromptFormActive) {
  if (isLoading || isPromptFormActive) {
    return true;
  }
  return screenshots.length >= _useSlider2.SCREENSHOTS_PER_PAGE * _useSlider2.MAX_PAGES;
};
var FormLayout = function FormLayout(_ref) {
  var _screenshots$selected, _screenshots$2;
  var _ref$DialogHeaderProp = _ref.DialogHeaderProps,
    DialogHeaderProps = _ref$DialogHeaderProp === void 0 ? {} : _ref$DialogHeaderProp,
    _ref$DialogContentPro = _ref.DialogContentProps,
    DialogContentProps = _ref$DialogContentPro === void 0 ? {} : _ref$DialogContentPro,
    initialAttachments = _ref.attachments;
  var _useConfig = (0, _config.useConfig)(),
    attachmentsTypes = _useConfig.attachmentsTypes,
    onData = _useConfig.onData,
    onInsert = _useConfig.onInsert,
    onSelect = _useConfig.onSelect,
    onClose = _useConfig.onClose,
    onGenerate = _useConfig.onGenerate;
  var _useScreenshots = (0, _useScreenshots2.default)({
      onData: onData
    }),
    screenshots = _useScreenshots.screenshots,
    generate = _useScreenshots.generate,
    regenerate = _useScreenshots.regenerate,
    isLoading = _useScreenshots.isLoading,
    error = _useScreenshots.error,
    abort = _useScreenshots.abort;
  var screenshotOutlineOffset = '2px';
  var _useSlider = (0, _useSlider2.default)({
      slidesCount: screenshots.length
    }),
    currentPage = _useSlider.currentPage,
    setCurrentPage = _useSlider.setCurrentPage,
    pagesCount = _useSlider.pagesCount,
    gapPercentage = _useSlider.gapPercentage,
    slidesPerPage = _useSlider.slidesPerPage,
    offsetXPercentage = _useSlider.offsetXPercentage,
    slideWidthPercentage = _useSlider.slideWidthPercentage;
  var _useState = (0, _react.useState)(-1),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    selectedScreenshotIndex = _useState2[0],
    setSelectedScreenshotIndex = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    showUnsavedChangesAlert = _useState4[0],
    setShowUnsavedChangesAlert = _useState4[1];
  var _useState5 = (0, _react.useState)(true),
    _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
    isPromptEditable = _useState6[0],
    setIsPromptEditable = _useState6[1];
  var _useState7 = (0, _react.useState)([]),
    _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
    attachments = _useState8[0],
    setAttachments = _useState8[1];
  var _useState9 = (0, _react.useState)(false),
    _useState10 = (0, _slicedToArray2.default)(_useState9, 2),
    shouldRenderWebApp = _useState10[0],
    setShouldRenderWebApp = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = (0, _slicedToArray2.default)(_useState11, 2),
    isMinimized = _useState12[0],
    setIsMinimized = _useState12[1];
  var lastRun = (0, _react.useRef)(function () {});
  var promptInputRef = (0, _react.useRef)(null);
  var selectedTemplate = (_screenshots$selected = screenshots[selectedScreenshotIndex]) === null || _screenshots$selected === void 0 ? void 0 : _screenshots$selected.template;
  var dialogContentChildren = DialogContentProps.children,
    dialogContentProps = (0, _objectWithoutProperties2.default)(DialogContentProps, _excluded);

  // When there are no screenshots the prompt field should be editable.
  var shouldFallbackToEditPrompt = !!(error && 0 === screenshots.length);
  var isPromptFormActive = isPromptEditable || shouldFallbackToEditPrompt;
  var abortAndClose = function abortAndClose() {
    abort();
    onClose();
  };
  var onCloseIntent = function onCloseIntent() {
    var hasUnsavedChanges = promptInputRef.current.value.trim() !== '' || screenshots.length > 0;
    if (hasUnsavedChanges) {
      return setShowUnsavedChangesAlert(true);
    }
    abortAndClose();
  };
  var handleGenerate = function handleGenerate(event, prompt) {
    event.preventDefault();
    if ('' === prompt.trim() && 0 === attachments.length) {
      return;
    }
    if ((0, _isURL.default)(prompt)) {
      setShouldRenderWebApp(true);
      return;
    }
    onGenerate();
    lastRun.current = function () {
      setSelectedScreenshotIndex(-1);
      generate(prompt, attachments);
    };
    lastRun.current();
    setIsPromptEditable(false);
    setCurrentPage(1);
  };
  var handleRegenerate = function handleRegenerate() {
    lastRun.current = function () {
      regenerate(promptInputRef.current.value, attachments);
      // Changing the current page to the next page number.
      setCurrentPage(pagesCount + 1);
    };
    lastRun.current();
  };
  var applyTemplate = function applyTemplate() {
    onInsert(selectedTemplate);
    screenshots[selectedScreenshotIndex].sendUsageData();
    abortAndClose();
  };
  var handleScreenshotClick = function handleScreenshotClick(index, template) {
    return function () {
      if (isPromptFormActive) {
        return;
      }
      setSelectedScreenshotIndex(index);
      onSelect(template);
    };
  };

  /**
   * @param {Attachment[]} items
   */
  var onAttach = function onAttach(items) {
    items.forEach(function (item) {
      if (!attachmentsTypes[item.type]) {
        throw new Error("Invalid attachment type: ".concat(item.type));
      }
      var typeConfig = attachmentsTypes[item.type];
      if (!item.previewHTML && typeConfig.previewGenerator) {
        typeConfig.previewGenerator(item.content).then(function (html) {
          item.previewHTML = html;
          setAttachments(function (prev) {
            // Replace the attachment with the updated one.
            return prev.map(function (attachment) {
              if (attachment.content === item.content) {
                return item;
              }
              return attachment;
            });
          });
        });
      }
    });
    setAttachments(items);
    setShouldRenderWebApp(false);
    setIsPromptEditable(true);
  };
  (0, _react.useEffect)(function () {
    var _screenshots$;
    var isFirstTemplateExist = (_screenshots$ = screenshots[0]) === null || _screenshots$ === void 0 ? void 0 : _screenshots$.template;
    if (isFirstTemplateExist) {
      onSelect(screenshots[0].template);
      setSelectedScreenshotIndex(0);
    }
  }, [(_screenshots$2 = screenshots[0]) === null || _screenshots$2 === void 0 ? void 0 : _screenshots$2.template]);
  (0, _react.useEffect)(function () {
    if (initialAttachments !== null && initialAttachments !== void 0 && initialAttachments.length) {
      onAttach(initialAttachments);
    }
  }, []);
  return /*#__PURE__*/_react.default.createElement(_layoutDialog.default, {
    onClose: onCloseIntent
  }, /*#__PURE__*/_react.default.createElement(_layoutDialog.default.Header, (0, _extends2.default)({
    onClose: onCloseIntent
  }, DialogHeaderProps), DialogHeaderProps.children, /*#__PURE__*/_react.default.createElement(_ui.Tooltip, {
    title: isMinimized ? (0, _i18n.__)('Expand', 'elementor') : (0, _i18n.__)('Minimize', 'elementor')
  }, /*#__PURE__*/_react.default.createElement(_ui.IconButton, {
    size: "small",
    "aria-label": "minimize",
    onClick: function onClick() {
      return setIsMinimized(function (prev) {
        return !prev;
      });
    }
  }, isMinimized ? /*#__PURE__*/_react.default.createElement(DirectionalExpandDiagonalIcon, null) : /*#__PURE__*/_react.default.createElement(DirectionalMinimizeDiagonalIcon, null)))), /*#__PURE__*/_react.default.createElement(_layoutDialog.default.Content, (0, _extends2.default)({
    dividers: true
  }, dialogContentProps), /*#__PURE__*/_react.default.createElement(_ui.Collapse, {
    in: !isMinimized
  }, dialogContentChildren && /*#__PURE__*/_react.default.createElement(_ui.Box, {
    sx: {
      pt: 2,
      px: 2,
      pb: 0
    }
  }, dialogContentChildren), attachments.length > 0 && /*#__PURE__*/_react.default.createElement(_promptPowerNotice.PromptPowerNotice, null), error && /*#__PURE__*/_react.default.createElement(_ui.Box, {
    sx: {
      pt: 2,
      px: 2,
      pb: 0
    }
  }, /*#__PURE__*/_react.default.createElement(_promptErrorMessage.default, {
    error: error,
    onRetry: lastRun.current
  })), showUnsavedChangesAlert && /*#__PURE__*/_react.default.createElement(_unsavedChangesAlert.default, {
    open: showUnsavedChangesAlert,
    title: (0, _i18n.__)('Leave Elementor AI?', 'elementor'),
    text: (0, _i18n.__)("Your progress will be deleted, and can't be recovered.", 'elementor'),
    onClose: abortAndClose,
    onCancel: function onCancel() {
      return setShowUnsavedChangesAlert(false);
    }
  }), shouldRenderWebApp && /*#__PURE__*/_react.default.createElement(_attachDialog.default, {
    type: _attachments.ATTACHMENT_TYPE_URL,
    url: promptInputRef.current.value,
    onAttach: onAttach,
    onClose: function onClose() {
      setShouldRenderWebApp(false);
    }
  }), /*#__PURE__*/_react.default.createElement(_promptForm.default, {
    shouldResetPrompt: shouldRenderWebApp,
    ref: promptInputRef,
    isActive: isPromptFormActive,
    isLoading: isLoading,
    showActions: screenshots.length > 0 || isLoading,
    attachmentsTypes: attachmentsTypes,
    attachments: attachments,
    onAttach: onAttach,
    onDetach: function onDetach(index) {
      setAttachments(function (prev) {
        var newAttachments = (0, _toConsumableArray2.default)(prev);
        newAttachments.splice(index, 1);
        return newAttachments;
      });
      setIsPromptEditable(true);
    },
    onSubmit: handleGenerate,
    onBack: function onBack() {
      return setIsPromptEditable(false);
    },
    onEdit: function onEdit() {
      return setIsPromptEditable(true);
    }
  }), (screenshots.length > 0 || isLoading) && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_ui.Divider, null), /*#__PURE__*/_react.default.createElement(_ui.Box, {
    sx: {
      p: 1.5
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.Box, {
    sx: {
      overflow: 'hidden',
      p: 0.5
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.Box, {
    sx: {
      display: 'flex',
      transition: 'all 0.4s ease',
      gap: "".concat(gapPercentage, "%"),
      transform: "translateX(".concat(offsetXPercentage, "%)")
    }
  }, screenshots.map(function (_ref2, index) {
    var screenshot = _ref2.screenshot,
      type = _ref2.type,
      template = _ref2.template,
      isError = _ref2.isError,
      isPending = _ref2.isPending;
    return /*#__PURE__*/_react.default.createElement(_screenshot.default, {
      key: index,
      url: screenshot,
      type: type,
      disabled: isPromptFormActive,
      isPlaceholder: isError,
      isLoading: isPending,
      isSelected: selectedScreenshotIndex === index,
      onClick: handleScreenshotClick(index, template),
      outlineOffset: screenshotOutlineOffset,
      sx: {
        flex: "0 0 ".concat(slideWidthPercentage, "%")
      }
    });
  }))), /*#__PURE__*/_react.default.createElement(_voicePromotionAlert.VoicePromotionAlert, {
    introductionKey: "ai-context-layout-promotion"
  })), screenshots.length > 0 && /*#__PURE__*/_react.default.createElement(_ui.Box, {
    sx: {
      pt: 0,
      px: 2,
      pb: 2
    },
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    justifyItems: "center"
  }, /*#__PURE__*/_react.default.createElement(RegenerateButton, {
    onClick: handleRegenerate,
    disabled: isRegenerateButtonDisabled(screenshots, isLoading, isPromptFormActive),
    sx: {
      justifySelf: 'start'
    }
  }), screenshots.length > slidesPerPage && /*#__PURE__*/_react.default.createElement(_ui.Pagination, {
    page: currentPage,
    count: pagesCount,
    disabled: isPromptFormActive,
    onChange: function onChange(_, page) {
      return setCurrentPage(page);
    }
  }), /*#__PURE__*/_react.default.createElement(UseLayoutButton, {
    onClick: applyTemplate,
    disabled: isPromptFormActive || -1 === selectedScreenshotIndex,
    sx: {
      justifySelf: 'end',
      gridColumn: 3
    }
  }))))));
};
FormLayout.propTypes = {
  DialogHeaderProps: _propTypes.default.object,
  DialogContentProps: _propTypes.default.object,
  attachments: _propTypes.default.arrayOf(_attachment.AttachmentPropType)
};
var _default = exports["default"] = FormLayout;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-media/components/enhance-button.js":
/*!************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-media/components/enhance-button.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "../node_modules/@babel/runtime/helpers/objectWithoutProperties.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _wandIcon = _interopRequireDefault(__webpack_require__(/*! ../../../icons/wand-icon */ "../modules/ai/assets/js/editor/icons/wand-icon.js"));
var _excluded = ["isLoading"];
var StyledWandIcon = (0, _ui.withDirection)(_wandIcon.default);
var EnhanceButton = function EnhanceButton(_ref) {
  var isLoading = _ref.isLoading,
    props = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  return /*#__PURE__*/_react.default.createElement(_ui.Tooltip, {
    title: (0, _i18n.__)('Enhance prompt', 'elementor')
  }, /*#__PURE__*/_react.default.createElement(_ui.Box, {
    component: "span",
    sx: {
      cursor: props.disabled ? 'default' : 'pointer'
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.IconButton, (0, _extends2.default)({
    size: "small",
    color: "secondary"
  }, props), isLoading ? /*#__PURE__*/_react.default.createElement(_ui.CircularProgress, {
    color: "secondary",
    size: 20
  }) : /*#__PURE__*/_react.default.createElement(StyledWandIcon, {
    fontSize: "small"
  }))));
};
EnhanceButton.propTypes = {
  disabled: _propTypes.default.bool,
  isLoading: _propTypes.default.bool
};
var _default = exports["default"] = EnhanceButton;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/form-media/components/generate-submit.js":
/*!*************************************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/form-media/components/generate-submit.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var GenerateSubmit = function GenerateSubmit(props) {
  return /*#__PURE__*/_react.default.createElement(_ui.Button, (0, _extends2.default)({
    fullWidth: true,
    size: "medium",
    type: "submit",
    variant: "contained"
  }, props), props.children || (0, _i18n.__)('Generate', 'elementor'));
};
GenerateSubmit.propTypes = {
  children: _propTypes.default.node
};
var _default = exports["default"] = GenerateSubmit;

/***/ }),

/***/ "../modules/ai/assets/js/editor/pages/get-started/index.js":
/*!*****************************************************************!*\
  !*** ../modules/ai/assets/js/editor/pages/get-started/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../node_modules/@babel/runtime/regenerator/index.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "../node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var _api = __webpack_require__(/*! ../../api */ "../modules/ai/assets/js/editor/api/index.js");
var _icons = __webpack_require__(/*! @elementor/icons */ "@elementor/icons");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var GetStarted = function GetStarted(_ref) {
  var onSuccess = _ref.onSuccess;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    isTermsChecked = _useState2[0],
    setIsTermsChecked = _useState2[1];
  var onGetStartedClick = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee() {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _api.setGetStarted)();
          case 2:
            onSuccess();
          case 3:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function onGetStartedClick() {
      return _ref2.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    alignItems: "center",
    gap: 1.5
  }, /*#__PURE__*/_react.default.createElement(_icons.AIIcon, {
    sx: {
      color: 'text.primary',
      fontSize: '60px',
      mb: 1
    }
  }), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "h4",
    sx: {
      color: 'text.primary'
    }
  }, (0, _i18n.__)('Step into the future with Elementor AI', 'elementor')), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "body2"
  }, (0, _i18n.__)('Create smarter with AI text and code generators built right into the editor.', 'elementor')), /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    direction: "row",
    gap: 1.5,
    alignItems: "flex-start"
  }, /*#__PURE__*/_react.default.createElement(_ui.Checkbox, {
    id: "e-ai-terms-approval",
    color: "secondary",
    checked: isTermsChecked,
    onClick: function onClick() {
      return setIsTermsChecked(function (prevState) {
        return !prevState;
      });
    }
  }), /*#__PURE__*/_react.default.createElement(_ui.Stack, null, /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "caption",
    sx: {
      maxWidth: 520
    },
    component: "label",
    htmlFor: "e-ai-terms-approval"
  }, (0, _i18n.__)('I approve the ', 'elementor'), /*#__PURE__*/_react.default.createElement(_ui.Link, {
    href: "https://go.elementor.com/ai-terms/",
    target: "_blank",
    color: "info.main"
  }, (0, _i18n.__)('Terms of Service', 'elementor')), ' & ', /*#__PURE__*/_react.default.createElement(_ui.Link, {
    href: "https://go.elementor.com/ai-privacy-policy/",
    target: "_blank",
    color: "info.main"
  }, (0, _i18n.__)('Privacy Policy', 'elementor')), (0, _i18n.__)(' of the Elementor AI service.', 'elementor'), /*#__PURE__*/_react.default.createElement("br", null), (0, _i18n.__)('This includes consenting to the collection and use of data to improve user experience.', 'elementor')))), /*#__PURE__*/_react.default.createElement(_ui.Button, {
    disabled: !isTermsChecked,
    variant: "contained",
    onClick: onGetStartedClick,
    sx: {
      mt: 1,
      '&:hover': {
        color: 'primary.contrastText'
      }
    }
  }, (0, _i18n.__)('Get Started', 'elementor')));
};
GetStarted.propTypes = {
  onSuccess: _propTypes.default.func.isRequired
};
var _default = exports["default"] = GetStarted;

/***/ }),

/***/ "../modules/ai/assets/js/editor/types/attachment.js":
/*!**********************************************************!*\
  !*** ../modules/ai/assets/js/editor/types/attachment.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AttachmentsTypesPropType = exports.AttachmentPropType = void 0;
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));
var AttachmentPropType = exports.AttachmentPropType = _propTypes.default.shape({
  type: _propTypes.default.string,
  previewHTML: _propTypes.default.string,
  content: _propTypes.default.string,
  label: _propTypes.default.string,
  source: _propTypes.default.string
});
var AttachmentsTypesPropType = exports.AttachmentsTypesPropType = _propTypes.default.shape({
  type: _propTypes.default.shape({
    promptPlaceholder: _propTypes.default.string,
    promptSuggestions: _propTypes.default.arrayOf(_propTypes.default.shape({
      text: _propTypes.default.string.isRequired
    })),
    previewGenerator: _propTypes.default.func
  })
});

/***/ }),

/***/ "../modules/ai/assets/js/editor/utils/editor-integration.js":
/*!******************************************************************!*\
  !*** ../modules/ai/assets/js/editor/utils/editor-integration.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.renderLayoutApp = exports.openPanel = exports.onConnect = exports.importToEditor = exports.getUiConfig = exports.closePanel = exports.WEB_BASED_PROMPTS = exports.VARIATIONS_PROMPTS = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../node_modules/@babel/runtime/regenerator/index.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "../node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _react2 = _interopRequireDefault(__webpack_require__(/*! elementor-utils/react */ "../assets/dev/js/utils/react.js"));
var _previewContainer = __webpack_require__(/*! ./preview-container */ "../modules/ai/assets/js/editor/utils/preview-container.js");
var _layoutApp = _interopRequireDefault(__webpack_require__(/*! ../layout-app */ "../modules/ai/assets/js/editor/layout-app.js"));
var _screenshot = __webpack_require__(/*! ./screenshot */ "../modules/ai/assets/js/editor/utils/screenshot.js");
var _history = __webpack_require__(/*! ./history */ "../modules/ai/assets/js/editor/utils/history.js");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _layoutAppWrapper = _interopRequireDefault(__webpack_require__(/*! ../layout-app-wrapper */ "../modules/ai/assets/js/editor/layout-app-wrapper.js"));
var _requestsIds = __webpack_require__(/*! ../context/requests-ids */ "../modules/ai/assets/js/editor/context/requests-ids.js");
var closePanel = exports.closePanel = function closePanel() {
  $e.run('panel/close');
  $e.components.get('panel').blockUserInteractions();
};
var openPanel = exports.openPanel = function openPanel() {
  $e.run('panel/open');
  $e.components.get('panel').unblockUserInteractions();
};
var onConnect = exports.onConnect = function onConnect(data) {
  elementorCommon.config.library_connect.is_connected = true;
  elementorCommon.config.library_connect.current_access_level = data.kits_access_level || data.access_level || 0;
  elementorCommon.config.library_connect.current_access_tier = data.access_tier;
};
var getUiConfig = exports.getUiConfig = function getUiConfig() {
  var _elementor, _elementor$getPrefere;
  var colorScheme = ((_elementor = elementor) === null || _elementor === void 0 || (_elementor$getPrefere = _elementor.getPreferences) === null || _elementor$getPrefere === void 0 ? void 0 : _elementor$getPrefere.call(_elementor, 'ui_theme')) || 'auto';
  var isRTL = elementorCommon.config.isRTL;
  return {
    colorScheme: colorScheme,
    isRTL: isRTL
  };
};
var VARIATIONS_PROMPTS = exports.VARIATIONS_PROMPTS = [{
  text: (0, _i18n.__)('Minimalist design with bold typography about', 'elementor')
}, {
  text: (0, _i18n.__)('Elegant style with serif fonts discussing', 'elementor')
}, {
  text: (0, _i18n.__)('Retro vibe with muted colors and classic fonts about', 'elementor')
}, {
  text: (0, _i18n.__)('Futuristic design with neon accents about', 'elementor')
}, {
  text: (0, _i18n.__)('Professional look with clean lines for', 'elementor')
}, {
  text: (0, _i18n.__)('Earthy tones and organic shapes featuring', 'elementor')
}, {
  text: (0, _i18n.__)('Luxurious theme with rich colors discussing', 'elementor')
}, {
  text: (0, _i18n.__)('Tech-inspired style with modern fonts about', 'elementor')
}, {
  text: (0, _i18n.__)('Warm hues with comforting visuals about', 'elementor')
}];
var WEB_BASED_PROMPTS = exports.WEB_BASED_PROMPTS = [{
  text: (0, _i18n.__)('Change the content to be about [topic]', 'elementor')
}, {
  text: (0, _i18n.__)('Generate lorem ipsum placeholder text for all paragraphs', 'elementor')
}, {
  text: (0, _i18n.__)('Revise the content to focus on [topic] and then translate it into Spanish', 'elementor')
}, {
  text: (0, _i18n.__)('Shift the focus of the content to [topic] in order to showcase our company\'s mission and values', 'elementor')
}, {
  text: (0, _i18n.__)('Alter the content to provide helpful tips related to [topic]', 'elementor')
}, {
  text: (0, _i18n.__)('Adjust the content to include FAQs and answers for common inquiries about [topic]', 'elementor')
}];
var PROMPT_PLACEHOLDER = (0, _i18n.__)("Press '/' for suggestions or describe the changes you want to apply (optional)...", 'elementor');
var renderLayoutApp = exports.renderLayoutApp = function renderLayoutApp() {
  var _options$onRenderApp;
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    parentContainer: null,
    mode: '',
    at: null,
    onClose: null,
    onGenerate: null,
    onInsert: null,
    onRenderApp: null,
    onSelect: null,
    attachments: []
  };
  closePanel();
  var previewContainer = (0, _previewContainer.createPreviewContainer)(options.parentContainer, {
    // Create the container at the "drag widget here" area position.
    at: options.at
  });
  var _getUiConfig = getUiConfig(),
    colorScheme = _getUiConfig.colorScheme,
    isRTL = _getUiConfig.isRTL;
  var rootElement = document.createElement('div');
  document.body.append(rootElement);
  var bodyStyle = window.elementorFrontend.elements.$window[0].getComputedStyle(window.elementorFrontend.elements.$body[0]);
  var _ReactUtils$render = _react2.default.render(/*#__PURE__*/_react.default.createElement(_layoutAppWrapper.default, {
      isRTL: isRTL,
      colorScheme: colorScheme
    }, /*#__PURE__*/_react.default.createElement(_layoutApp.default, {
      mode: options.mode,
      currentContext: {
        body: {
          backgroundColor: bodyStyle.backgroundColor,
          backgroundImage: bodyStyle.backgroundImage
        }
      },
      attachmentsTypes: {
        json: {
          promptSuggestions: VARIATIONS_PROMPTS,
          promptPlaceholder: PROMPT_PLACEHOLDER,
          previewGenerator: function () {
            var _previewGenerator = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee(json) {
              var screenshot;
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _screenshot.takeScreenshot)(json);
                  case 2:
                    screenshot = _context.sent;
                    return _context.abrupt("return", "<img src=\"".concat(screenshot, "\" />"));
                  case 4:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            function previewGenerator(_x) {
              return _previewGenerator.apply(this, arguments);
            }
            return previewGenerator;
          }()
        },
        url: {
          promptPlaceholder: PROMPT_PLACEHOLDER,
          promptSuggestions: WEB_BASED_PROMPTS
        }
      },
      attachments: options.attachments || [],
      onClose: function onClose() {
        var _options$onClose;
        previewContainer.destroy();
        (_options$onClose = options.onClose) === null || _options$onClose === void 0 || _options$onClose.call(options);
        unmount();
        rootElement.remove();
        openPanel();
      },
      onConnect: onConnect,
      onGenerate: function onGenerate() {
        var _options$onGenerate;
        (_options$onGenerate = options.onGenerate) === null || _options$onGenerate === void 0 || _options$onGenerate.call(options, {
          previewContainer: previewContainer
        });
      },
      onData: (/*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee2(template) {
          var screenshot;
          return _regenerator.default.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _screenshot.takeScreenshot)(template);
              case 2:
                screenshot = _context2.sent;
                return _context2.abrupt("return", {
                  screenshot: screenshot,
                  template: template
                });
              case 4:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }));
        return function (_x2) {
          return _ref.apply(this, arguments);
        };
      }()),
      onSelect: function onSelect(template) {
        var _options$onSelect;
        (_options$onSelect = options.onSelect) === null || _options$onSelect === void 0 || _options$onSelect.call(options);
        previewContainer.setContent(template);
      },
      onInsert: options.onInsert,
      hasPro: elementor.helpers.hasPro()
    })), rootElement),
    unmount = _ReactUtils$render.unmount;
  (_options$onRenderApp = options.onRenderApp) === null || _options$onRenderApp === void 0 || _options$onRenderApp.call(options, {
    previewContainer: previewContainer
  });
};
var importToEditor = exports.importToEditor = function importToEditor(_ref2) {
  var parentContainer = _ref2.parentContainer,
    at = _ref2.at,
    template = _ref2.template,
    historyTitle = _ref2.historyTitle,
    _ref2$replace = _ref2.replace,
    replace = _ref2$replace === void 0 ? false : _ref2$replace;
  var endHistoryLog = (0, _history.startHistoryLog)({
    type: 'import',
    title: historyTitle
  });
  if (replace) {
    $e.run('document/elements/delete', {
      container: parentContainer.children.at(at)
    });
  }
  $e.run('document/elements/create', {
    container: parentContainer,
    model: (0, _requestsIds.generateIds)(template),
    options: {
      at: at,
      edit: true
    }
  });
  endHistoryLog();
};

/***/ }),

/***/ "../modules/ai/assets/js/editor/utils/history.js":
/*!*******************************************************!*\
  !*** ../modules/ai/assets/js/editor/utils/history.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.startHistoryLog = startHistoryLog;
exports.toggleHistory = toggleHistory;
function toggleHistory(isActive) {
  elementor.documents.getCurrent().history.setActive(isActive);
}

/**
 * @param {Object}                                                                                                                                                           options
 * @param { 'add' | 'change' | 'disable' | 'duplicate' | 'enable' | 'import' | 'move' | 'paste' | 'paste_style' | 'remove' | 'reset_settings' | 'reset_style' | 'selected' } options.type
 * @param { string }                                                                                                                                                         options.title
 *
 * @return {*}
 */
function startHistoryLog(_ref) {
  var type = _ref.type,
    title = _ref.title;
  var id = $e.internal('document/history/start-log', {
    type: type,
    title: title
  });
  return function () {
    return $e.internal('document/history/end-log', {
      id: id
    });
  };
}

/***/ }),

/***/ "../modules/ai/assets/js/editor/utils/preview-container.js":
/*!*****************************************************************!*\
  !*** ../modules/ai/assets/js/editor/utils/preview-container.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.createPreviewContainer = createPreviewContainer;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "../node_modules/@babel/runtime/helpers/toConsumableArray.js"));
var _history = __webpack_require__(/*! ./history */ "../modules/ai/assets/js/editor/utils/history.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * @typedef {import('elementor/assets/dev/js/editor/container/container')} Container
 */

var PREFIX = 'e-ai-preview-container';
var CLASS_HIDDEN = PREFIX + '--hidden';
var CLASS_IDLE = PREFIX + '--idle';

/**
 * @param {Container} parentContainer
 * @param {{}}        containerOptions
 * @return {{init, setContent, reset, destroy}}
 */

function createPreviewContainer(parentContainer) {
  var containerOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var createdContainers = new Map();
  var idleContainer = createIdleContainer(parentContainer, containerOptions);
  function init() {
    showContainer(idleContainer);
  }
  function getAllContainers() {
    return [].concat((0, _toConsumableArray2.default)(createdContainers.values()), [idleContainer]);
  }
  function reset() {
    deleteContainers((0, _toConsumableArray2.default)(createdContainers.values()));
    createdContainers.clear();
    showContainer(idleContainer);
  }
  function setContent(template) {
    if (!template) {
      return;
    }
    hideContainers(getAllContainers());
    if (!createdContainers.has(template)) {
      var newContainer = createContainer(parentContainer, template, containerOptions);
      createdContainers.set(template, newContainer);
    }
    showContainer(createdContainers.get(template));
  }
  function destroy() {
    deleteContainers(getAllContainers());
    createdContainers.clear();
  }
  return {
    init: init,
    reset: reset,
    setContent: setContent,
    destroy: destroy
  };
}

/**
 * @param {Container} parentContainer
 * @param {{}}        model
 * @param {{}}        options
 * @return {*}
 */
function createContainer(parentContainer, model) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  (0, _history.toggleHistory)(false);
  var container = $e.run('document/elements/create', {
    container: parentContainer,
    model: _objectSpread(_objectSpread({}, model), {}, {
      id: "".concat(PREFIX, "-").concat(elementorCommon.helpers.getUniqueId().toString())
    }),
    options: _objectSpread(_objectSpread({}, options), {}, {
      edit: false
    })
  });
  (0, _history.toggleHistory)(true);
  container.view.$el.addClass(CLASS_HIDDEN);
  return container;
}

/**
 * @param {Container} parentContainer
 * @param {{}}        containerOptions
 * @return {*}
 */
function createIdleContainer(parentContainer) {
  var containerOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // Create an empty container that'll be used of UI purposes.
  var container = createContainer(parentContainer, {
    elType: 'container'
  }, containerOptions);
  container.view.$el.addClass(CLASS_IDLE);
  return container;
}
function hideContainers(containers) {
  containers.forEach(function (container) {
    container.view.$el.addClass(CLASS_HIDDEN);
  });
}
function showContainer(container) {
  container.view.$el.removeClass(CLASS_HIDDEN);

  // Delay the scroll to avoid UI jumps when toggling between containers.
  setTimeout(function () {
    container.view.$el[0].scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
}
function deleteContainers(containers) {
  (0, _history.toggleHistory)(false);
  $e.run('document/elements/delete', {
    containers: containers
  });
  (0, _history.toggleHistory)(true);
}

/***/ }),

/***/ "../modules/ai/assets/js/editor/utils/screenshot.js":
/*!**********************************************************!*\
  !*** ../modules/ai/assets/js/editor/utils/screenshot.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.takeScreenshot = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../node_modules/@babel/runtime/regenerator/index.js"));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "../node_modules/@babel/runtime/helpers/toConsumableArray.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "../node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _htmlToImage = __webpack_require__(/*! html-to-image */ "../node_modules/html-to-image/es/index.js");
var _history = __webpack_require__(/*! ./history */ "../modules/ai/assets/js/editor/utils/history.js");
var _requestsIds = __webpack_require__(/*! ../context/requests-ids */ "../modules/ai/assets/js/editor/context/requests-ids.js");
var takeScreenshot = exports.takeScreenshot = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee(template) {
    var hiddenWrapper, container, screenshot;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (template) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return", '');
        case 2:
          // Disable history so the Editor won't show our hidden container as a user action.
          (0, _history.toggleHistory)(false);
          hiddenWrapper = createHiddenWrapper();
          container = createContainer(template);
          wrapContainer(container, hiddenWrapper);
          elementor.getPreviewView().$childViewContainer[0].appendChild(hiddenWrapper);

          // Wait for the container to render.
          _context.next = 9;
          return waitForContainer(container.id);
        case 9:
          if (!template.elements.length) {
            _context.next = 12;
            break;
          }
          _context.next = 12;
          return Promise.all(template.elements.map(function (child) {
            return waitForContainer(child.id);
          }));
        case 12:
          _context.prev = 12;
          _context.next = 15;
          return screenshotNode(container.view.$el[0]);
        case 15:
          screenshot = _context.sent;
          _context.next = 21;
          break;
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](12);
          // Return an empty image url if the screenshot failed.
          screenshot = '';
        case 21:
          deleteContainer(container);
          hiddenWrapper.remove();
          (0, _history.toggleHistory)(true);
          return _context.abrupt("return", screenshot);
        case 25:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[12, 18]]);
  }));
  return function takeScreenshot(_x) {
    return _ref.apply(this, arguments);
  };
}();
function screenshotNode(node) {
  return toWebp(node, {
    quality: 0.01,
    // Transparent 1x1 pixel.
    imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  });
}
function toWebp(_x2) {
  return _toWebp.apply(this, arguments);
}
function _toWebp() {
  _toWebp = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee3(node) {
    var _options$quality;
    var options,
      canvas,
      _args3 = arguments;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
          _context3.next = 3;
          return (0, _htmlToImage.toCanvas)(node, options);
        case 3:
          canvas = _context3.sent;
          return _context3.abrupt("return", canvas.toDataURL('image/webp', (_options$quality = options.quality) !== null && _options$quality !== void 0 ? _options$quality : 1));
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _toWebp.apply(this, arguments);
}
function createHiddenWrapper() {
  var wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.opacity = '0';
  wrapper.style.inset = '0';
  return wrapper;
}
function createContainer(template) {
  var model = (0, _requestsIds.generateIds)(template);

  // Set a custom ID, so it can be used later on in the backend.
  model.id = "e-ai-screenshot-container-".concat(model.id);
  return $e.run('document/elements/create', {
    container: elementor.getPreviewContainer(),
    model: model,
    options: {
      edit: false
    }
  });
}
function deleteContainer(container) {
  return $e.run('document/elements/delete', {
    container: container
  });
}
function waitForContainer(id) {
  var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;
  var timeoutPromise = sleep(timeout);
  var waitPromise = new Promise(function (resolve) {
    elementorFrontend.hooks.addAction('frontend/element_ready/global', /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee2($element) {
        var images;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!($element.data('id') === id)) {
                _context2.next = 5;
                break;
              }
              images = (0, _toConsumableArray2.default)($element[0].querySelectorAll('img')); // Wait for all images to load.
              _context2.next = 4;
              return Promise.all(images.map(waitForImage));
            case 4:
              resolve();
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
  return Promise.any([timeoutPromise, waitPromise]);
}
function waitForImage(image) {
  if (image.complete) {
    return Promise.resolve();
  }
  return new Promise(function (resolve) {
    image.addEventListener('load', resolve);
    image.addEventListener('error', function () {
      // Remove the image to make sure it won't break the screenshot.
      image.remove();
      resolve();
    });
  });
}
function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
function wrapContainer(container, wrapper) {
  var el = container.view.$el[0];
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

/***/ }),

/***/ "../node_modules/clsx/dist/clsx.m.js":
/*!*******************************************!*\
  !*** ../node_modules/clsx/dist/clsx.m.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clsx: () => (/* binding */ clsx),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);else for(t in e)e[t]&&(n&&(n+=" "),n+=t);return n}function clsx(){for(var e,t,f=0,n="";f<arguments.length;)(e=arguments[f++])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (clsx);

/***/ }),

/***/ "../node_modules/html-to-image/es/apply-style.js":
/*!*******************************************************!*\
  !*** ../node_modules/html-to-image/es/apply-style.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyle: () => (/* binding */ applyStyle)
/* harmony export */ });
function applyStyle(node, options) {
    const { style } = node;
    if (options.backgroundColor) {
        style.backgroundColor = options.backgroundColor;
    }
    if (options.width) {
        style.width = `${options.width}px`;
    }
    if (options.height) {
        style.height = `${options.height}px`;
    }
    const manual = options.style;
    if (manual != null) {
        Object.keys(manual).forEach((key) => {
            style[key] = manual[key];
        });
    }
    return node;
}
//# sourceMappingURL=apply-style.js.map

/***/ }),

/***/ "../node_modules/html-to-image/es/clone-node.js":
/*!******************************************************!*\
  !*** ../node_modules/html-to-image/es/clone-node.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cloneNode: () => (/* binding */ cloneNode)
/* harmony export */ });
/* harmony import */ var _clone_pseudos__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clone-pseudos */ "../node_modules/html-to-image/es/clone-pseudos.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "../node_modules/html-to-image/es/util.js");
/* harmony import */ var _mimes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mimes */ "../node_modules/html-to-image/es/mimes.js");
/* harmony import */ var _dataurl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dataurl */ "../node_modules/html-to-image/es/dataurl.js");




async function cloneCanvasElement(canvas) {
    const dataURL = canvas.toDataURL();
    if (dataURL === 'data:,') {
        return canvas.cloneNode(false);
    }
    return (0,_util__WEBPACK_IMPORTED_MODULE_1__.createImage)(dataURL);
}
async function cloneVideoElement(video, options) {
    if (video.currentSrc) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL();
        return (0,_util__WEBPACK_IMPORTED_MODULE_1__.createImage)(dataURL);
    }
    const poster = video.poster;
    const contentType = (0,_mimes__WEBPACK_IMPORTED_MODULE_2__.getMimeType)(poster);
    const dataURL = await (0,_dataurl__WEBPACK_IMPORTED_MODULE_3__.resourceToDataURL)(poster, contentType, options);
    return (0,_util__WEBPACK_IMPORTED_MODULE_1__.createImage)(dataURL);
}
async function cloneIFrameElement(iframe) {
    var _a;
    try {
        if ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.body) {
            return (await cloneNode(iframe.contentDocument.body, {}, true));
        }
    }
    catch (_b) {
        // Failed to clone iframe
    }
    return iframe.cloneNode(false);
}
async function cloneSingleNode(node, options) {
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(node, HTMLCanvasElement)) {
        return cloneCanvasElement(node);
    }
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(node, HTMLVideoElement)) {
        return cloneVideoElement(node, options);
    }
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(node, HTMLIFrameElement)) {
        return cloneIFrameElement(node);
    }
    return node.cloneNode(false);
}
const isSlotElement = (node) => node.tagName != null && node.tagName.toUpperCase() === 'SLOT';
async function cloneChildren(nativeNode, clonedNode, options) {
    var _a, _b;
    let children = [];
    if (isSlotElement(nativeNode) && nativeNode.assignedNodes) {
        children = (0,_util__WEBPACK_IMPORTED_MODULE_1__.toArray)(nativeNode.assignedNodes());
    }
    else if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(nativeNode, HTMLIFrameElement) &&
        ((_a = nativeNode.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) {
        children = (0,_util__WEBPACK_IMPORTED_MODULE_1__.toArray)(nativeNode.contentDocument.body.childNodes);
    }
    else {
        children = (0,_util__WEBPACK_IMPORTED_MODULE_1__.toArray)(((_b = nativeNode.shadowRoot) !== null && _b !== void 0 ? _b : nativeNode).childNodes);
    }
    if (children.length === 0 ||
        (0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(nativeNode, HTMLVideoElement)) {
        return clonedNode;
    }
    await children.reduce((deferred, child) => deferred
        .then(() => cloneNode(child, options))
        .then((clonedChild) => {
        if (clonedChild) {
            clonedNode.appendChild(clonedChild);
        }
    }), Promise.resolve());
    return clonedNode;
}
function cloneCSSStyle(nativeNode, clonedNode) {
    const targetStyle = clonedNode.style;
    if (!targetStyle) {
        return;
    }
    const sourceStyle = window.getComputedStyle(nativeNode);
    if (sourceStyle.cssText) {
        targetStyle.cssText = sourceStyle.cssText;
        targetStyle.transformOrigin = sourceStyle.transformOrigin;
    }
    else {
        (0,_util__WEBPACK_IMPORTED_MODULE_1__.toArray)(sourceStyle).forEach((name) => {
            let value = sourceStyle.getPropertyValue(name);
            if (name === 'font-size' && value.endsWith('px')) {
                const reducedFont = Math.floor(parseFloat(value.substring(0, value.length - 2))) - 0.1;
                value = `${reducedFont}px`;
            }
            if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(nativeNode, HTMLIFrameElement) &&
                name === 'display' &&
                value === 'inline') {
                value = 'block';
            }
            if (name === 'd' && clonedNode.getAttribute('d')) {
                value = `path(${clonedNode.getAttribute('d')})`;
            }
            targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
        });
    }
}
function cloneInputValue(nativeNode, clonedNode) {
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(nativeNode, HTMLTextAreaElement)) {
        clonedNode.innerHTML = nativeNode.value;
    }
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(nativeNode, HTMLInputElement)) {
        clonedNode.setAttribute('value', nativeNode.value);
    }
}
function cloneSelectValue(nativeNode, clonedNode) {
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(nativeNode, HTMLSelectElement)) {
        const clonedSelect = clonedNode;
        const selectedOption = Array.from(clonedSelect.children).find((child) => nativeNode.value === child.getAttribute('value'));
        if (selectedOption) {
            selectedOption.setAttribute('selected', '');
        }
    }
}
function decorate(nativeNode, clonedNode) {
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(clonedNode, Element)) {
        cloneCSSStyle(nativeNode, clonedNode);
        (0,_clone_pseudos__WEBPACK_IMPORTED_MODULE_0__.clonePseudoElements)(nativeNode, clonedNode);
        cloneInputValue(nativeNode, clonedNode);
        cloneSelectValue(nativeNode, clonedNode);
    }
    return clonedNode;
}
async function ensureSVGSymbols(clone, options) {
    const uses = clone.querySelectorAll ? clone.querySelectorAll('use') : [];
    if (uses.length === 0) {
        return clone;
    }
    const processedDefs = {};
    for (let i = 0; i < uses.length; i++) {
        const use = uses[i];
        const id = use.getAttribute('xlink:href');
        if (id) {
            const exist = clone.querySelector(id);
            const definition = document.querySelector(id);
            if (!exist && definition && !processedDefs[id]) {
                // eslint-disable-next-line no-await-in-loop
                processedDefs[id] = (await cloneNode(definition, options, true));
            }
        }
    }
    const nodes = Object.values(processedDefs);
    if (nodes.length) {
        const ns = 'http://www.w3.org/1999/xhtml';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('xmlns', ns);
        svg.style.position = 'absolute';
        svg.style.width = '0';
        svg.style.height = '0';
        svg.style.overflow = 'hidden';
        svg.style.display = 'none';
        const defs = document.createElementNS(ns, 'defs');
        svg.appendChild(defs);
        for (let i = 0; i < nodes.length; i++) {
            defs.appendChild(nodes[i]);
        }
        clone.appendChild(svg);
    }
    return clone;
}
async function cloneNode(node, options, isRoot) {
    if (!isRoot && options.filter && !options.filter(node)) {
        return null;
    }
    return Promise.resolve(node)
        .then((clonedNode) => cloneSingleNode(clonedNode, options))
        .then((clonedNode) => cloneChildren(node, clonedNode, options))
        .then((clonedNode) => decorate(node, clonedNode))
        .then((clonedNode) => ensureSVGSymbols(clonedNode, options));
}
//# sourceMappingURL=clone-node.js.map

/***/ }),

/***/ "../node_modules/html-to-image/es/clone-pseudos.js":
/*!*********************************************************!*\
  !*** ../node_modules/html-to-image/es/clone-pseudos.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clonePseudoElements: () => (/* binding */ clonePseudoElements)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "../node_modules/html-to-image/es/util.js");

function formatCSSText(style) {
    const content = style.getPropertyValue('content');
    return `${style.cssText} content: '${content.replace(/'|"/g, '')}';`;
}
function formatCSSProperties(style) {
    return (0,_util__WEBPACK_IMPORTED_MODULE_0__.toArray)(style)
        .map((name) => {
        const value = style.getPropertyValue(name);
        const priority = style.getPropertyPriority(name);
        return `${name}: ${value}${priority ? ' !important' : ''};`;
    })
        .join(' ');
}
function getPseudoElementStyle(className, pseudo, style) {
    const selector = `.${className}:${pseudo}`;
    const cssText = style.cssText
        ? formatCSSText(style)
        : formatCSSProperties(style);
    return document.createTextNode(`${selector}{${cssText}}`);
}
function clonePseudoElement(nativeNode, clonedNode, pseudo) {
    const style = window.getComputedStyle(nativeNode, pseudo);
    const content = style.getPropertyValue('content');
    if (content === '' || content === 'none') {
        return;
    }
    const className = (0,_util__WEBPACK_IMPORTED_MODULE_0__.uuid)();
    try {
        clonedNode.className = `${clonedNode.className} ${className}`;
    }
    catch (err) {
        return;
    }
    const styleElement = document.createElement('style');
    styleElement.appendChild(getPseudoElementStyle(className, pseudo, style));
    clonedNode.appendChild(styleElement);
}
function clonePseudoElements(nativeNode, clonedNode) {
    clonePseudoElement(nativeNode, clonedNode, ':before');
    clonePseudoElement(nativeNode, clonedNode, ':after');
}
//# sourceMappingURL=clone-pseudos.js.map

/***/ }),

/***/ "../node_modules/html-to-image/es/dataurl.js":
/*!***************************************************!*\
  !*** ../node_modules/html-to-image/es/dataurl.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchAsDataURL: () => (/* binding */ fetchAsDataURL),
/* harmony export */   isDataUrl: () => (/* binding */ isDataUrl),
/* harmony export */   makeDataUrl: () => (/* binding */ makeDataUrl),
/* harmony export */   resourceToDataURL: () => (/* binding */ resourceToDataURL)
/* harmony export */ });
function getContentFromDataUrl(dataURL) {
    return dataURL.split(/,/)[1];
}
function isDataUrl(url) {
    return url.search(/^(data:)/) !== -1;
}
function makeDataUrl(content, mimeType) {
    return `data:${mimeType};base64,${content}`;
}
async function fetchAsDataURL(url, init, process) {
    const res = await fetch(url, init);
    if (res.status === 404) {
        throw new Error(`Resource "${res.url}" not found`);
    }
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onloadend = () => {
            try {
                resolve(process({ res, result: reader.result }));
            }
            catch (error) {
                reject(error);
            }
        };
        reader.readAsDataURL(blob);
    });
}
const cache = {};
function getCacheKey(url, contentType, includeQueryParams) {
    let key = url.replace(/\?.*/, '');
    if (includeQueryParams) {
        key = url;
    }
    // font resource
    if (/ttf|otf|eot|woff2?/i.test(key)) {
        key = key.replace(/.*\//, '');
    }
    return contentType ? `[${contentType}]${key}` : key;
}
async function resourceToDataURL(resourceUrl, contentType, options) {
    const cacheKey = getCacheKey(resourceUrl, contentType, options.includeQueryParams);
    if (cache[cacheKey] != null) {
        return cache[cacheKey];
    }
    // ref: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
    if (options.cacheBust) {
        // eslint-disable-next-line no-param-reassign
        resourceUrl += (/\?/.test(resourceUrl) ? '&' : '?') + new Date().getTime();
    }
    let dataURL;
    try {
        const content = await fetchAsDataURL(resourceUrl, options.fetchRequestInit, ({ res, result }) => {
            if (!contentType) {
                // eslint-disable-next-line no-param-reassign
                contentType = res.headers.get('Content-Type') || '';
            }
            return getContentFromDataUrl(result);
        });
        dataURL = makeDataUrl(content, contentType);
    }
    catch (error) {
        dataURL = options.imagePlaceholder || '';
        let msg = `Failed to fetch resource: ${resourceUrl}`;
        if (error) {
            msg = typeof error === 'string' ? error : error.message;
        }
        if (msg) {
            console.warn(msg);
        }
    }
    cache[cacheKey] = dataURL;
    return dataURL;
}
//# sourceMappingURL=dataurl.js.map

/***/ }),

/***/ "../node_modules/html-to-image/es/embed-images.js":
/*!********************************************************!*\
  !*** ../node_modules/html-to-image/es/embed-images.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   embedImages: () => (/* binding */ embedImages)
/* harmony export */ });
/* harmony import */ var _embed_resources__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./embed-resources */ "../node_modules/html-to-image/es/embed-resources.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "../node_modules/html-to-image/es/util.js");
/* harmony import */ var _dataurl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dataurl */ "../node_modules/html-to-image/es/dataurl.js");
/* harmony import */ var _mimes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mimes */ "../node_modules/html-to-image/es/mimes.js");




async function embedProp(propName, node, options) {
    var _a;
    const propValue = (_a = node.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(propName);
    if (propValue) {
        const cssString = await (0,_embed_resources__WEBPACK_IMPORTED_MODULE_0__.embedResources)(propValue, null, options);
        node.style.setProperty(propName, cssString, node.style.getPropertyPriority(propName));
        return true;
    }
    return false;
}
async function embedBackground(clonedNode, options) {
    if (!(await embedProp('background', clonedNode, options))) {
        await embedProp('background-image', clonedNode, options);
    }
    if (!(await embedProp('mask', clonedNode, options))) {
        await embedProp('mask-image', clonedNode, options);
    }
}
async function embedImageNode(clonedNode, options) {
    const isImageElement = (0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(clonedNode, HTMLImageElement);
    if (!(isImageElement && !(0,_dataurl__WEBPACK_IMPORTED_MODULE_2__.isDataUrl)(clonedNode.src)) &&
        !((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(clonedNode, SVGImageElement) &&
            !(0,_dataurl__WEBPACK_IMPORTED_MODULE_2__.isDataUrl)(clonedNode.href.baseVal))) {
        return;
    }
    const url = isImageElement ? clonedNode.src : clonedNode.href.baseVal;
    const dataURL = await (0,_dataurl__WEBPACK_IMPORTED_MODULE_2__.resourceToDataURL)(url, (0,_mimes__WEBPACK_IMPORTED_MODULE_3__.getMimeType)(url), options);
    await new Promise((resolve, reject) => {
        clonedNode.onload = resolve;
        clonedNode.onerror = reject;
        const image = clonedNode;
        if (image.decode) {
            image.decode = resolve;
        }
        if (image.loading === 'lazy') {
            image.loading = 'eager';
        }
        if (isImageElement) {
            clonedNode.srcset = '';
            clonedNode.src = dataURL;
        }
        else {
            clonedNode.href.baseVal = dataURL;
        }
    });
}
async function embedChildren(clonedNode, options) {
    const children = (0,_util__WEBPACK_IMPORTED_MODULE_1__.toArray)(clonedNode.childNodes);
    const deferreds = children.map((child) => embedImages(child, options));
    await Promise.all(deferreds).then(() => clonedNode);
}
async function embedImages(clonedNode, options) {
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(clonedNode, Element)) {
        await embedBackground(clonedNode, options);
        await embedImageNode(clonedNode, options);
        await embedChildren(clonedNode, options);
    }
}
//# sourceMappingURL=embed-images.js.map

/***/ }),

/***/ "../node_modules/html-to-image/es/embed-resources.js":
/*!***********************************************************!*\
  !*** ../node_modules/html-to-image/es/embed-resources.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   embed: () => (/* binding */ embed),
/* harmony export */   embedResources: () => (/* binding */ embedResources),
/* harmony export */   parseURLs: () => (/* binding */ parseURLs),
/* harmony export */   shouldEmbed: () => (/* binding */ shouldEmbed)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "../node_modules/html-to-image/es/util.js");
/* harmony import */ var _mimes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mimes */ "../node_modules/html-to-image/es/mimes.js");
/* harmony import */ var _dataurl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dataurl */ "../node_modules/html-to-image/es/dataurl.js");



const URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
const URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
const FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function toRegex(url) {
    // eslint-disable-next-line no-useless-escape
    const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp(`(url\\(['"]?)(${escaped})(['"]?\\))`, 'g');
}
function parseURLs(cssText) {
    const urls = [];
    cssText.replace(URL_REGEX, (raw, quotation, url) => {
        urls.push(url);
        return raw;
    });
    return urls.filter((url) => !(0,_dataurl__WEBPACK_IMPORTED_MODULE_2__.isDataUrl)(url));
}
async function embed(cssText, resourceURL, baseURL, options, getContentFromUrl) {
    try {
        const resolvedURL = baseURL ? (0,_util__WEBPACK_IMPORTED_MODULE_0__.resolveUrl)(resourceURL, baseURL) : resourceURL;
        const contentType = (0,_mimes__WEBPACK_IMPORTED_MODULE_1__.getMimeType)(resourceURL);
        let dataURL;
        if (getContentFromUrl) {
            const content = await getContentFromUrl(resolvedURL);
            dataURL = (0,_dataurl__WEBPACK_IMPORTED_MODULE_2__.makeDataUrl)(content, contentType);
        }
        else {
            dataURL = await (0,_dataurl__WEBPACK_IMPORTED_MODULE_2__.resourceToDataURL)(resolvedURL, contentType, options);
        }
        return cssText.replace(toRegex(resourceURL), `$1${dataURL}$3`);
    }
    catch (error) {
        // pass
    }
    return cssText;
}
function filterPreferredFontFormat(str, { preferredFontFormat }) {
    return !preferredFontFormat
        ? str
        : str.replace(FONT_SRC_REGEX, (match) => {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const [src, , format] = URL_WITH_FORMAT_REGEX.exec(match) || [];
                if (!format) {
                    return '';
                }
                if (format === preferredFontFormat) {
                    return `src: ${src};`;
                }
            }
        });
}
function shouldEmbed(url) {
    return url.search(URL_REGEX) !== -1;
}
async function embedResources(cssText, baseUrl, options) {
    if (!shouldEmbed(cssText)) {
        return cssText;
    }
    const filteredCSSText = filterPreferredFontFormat(cssText, options);
    const urls = parseURLs(filteredCSSText);
    return urls.reduce((deferred, url) => deferred.then((css) => embed(css, url, baseUrl, options)), Promise.resolve(filteredCSSText));
}
//# sourceMappingURL=embed-resources.js.map

/***/ }),

/***/ "../node_modules/html-to-image/es/embed-webfonts.js":
/*!**********************************************************!*\
  !*** ../node_modules/html-to-image/es/embed-webfonts.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   embedWebFonts: () => (/* binding */ embedWebFonts),
/* harmony export */   getWebFontCSS: () => (/* binding */ getWebFontCSS)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "../node_modules/html-to-image/es/util.js");
/* harmony import */ var _dataurl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dataurl */ "../node_modules/html-to-image/es/dataurl.js");
/* harmony import */ var _embed_resources__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./embed-resources */ "../node_modules/html-to-image/es/embed-resources.js");



const cssFetchCache = {};
async function fetchCSS(url) {
    let cache = cssFetchCache[url];
    if (cache != null) {
        return cache;
    }
    const res = await fetch(url);
    const cssText = await res.text();
    cache = { url, cssText };
    cssFetchCache[url] = cache;
    return cache;
}
async function embedFonts(data, options) {
    let cssText = data.cssText;
    const regexUrl = /url\(["']?([^"')]+)["']?\)/g;
    const fontLocs = cssText.match(/url\([^)]+\)/g) || [];
    const loadFonts = fontLocs.map(async (loc) => {
        let url = loc.replace(regexUrl, '$1');
        if (!url.startsWith('https://')) {
            url = new URL(url, data.url).href;
        }
        return (0,_dataurl__WEBPACK_IMPORTED_MODULE_1__.fetchAsDataURL)(url, options.fetchRequestInit, ({ result }) => {
            cssText = cssText.replace(loc, `url(${result})`);
            return [loc, result];
        });
    });
    return Promise.all(loadFonts).then(() => cssText);
}
function parseCSS(source) {
    if (source == null) {
        return [];
    }
    const result = [];
    const commentsRegex = /(\/\*[\s\S]*?\*\/)/gi;
    // strip out comments
    let cssText = source.replace(commentsRegex, '');
    // eslint-disable-next-line prefer-regex-literals
    const keyframesRegex = new RegExp('((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const matches = keyframesRegex.exec(cssText);
        if (matches === null) {
            break;
        }
        result.push(matches[0]);
    }
    cssText = cssText.replace(keyframesRegex, '');
    const importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
    // to match css & media queries together
    const combinedCSSRegex = '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]' +
        '*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})';
    // unified regex
    const unifiedRegex = new RegExp(combinedCSSRegex, 'gi');
    // eslint-disable-next-line no-constant-condition
    while (true) {
        let matches = importRegex.exec(cssText);
        if (matches === null) {
            matches = unifiedRegex.exec(cssText);
            if (matches === null) {
                break;
            }
            else {
                importRegex.lastIndex = unifiedRegex.lastIndex;
            }
        }
        else {
            unifiedRegex.lastIndex = importRegex.lastIndex;
        }
        result.push(matches[0]);
    }
    return result;
}
async function getCSSRules(styleSheets, options) {
    const ret = [];
    const deferreds = [];
    // First loop inlines imports
    styleSheets.forEach((sheet) => {
        if ('cssRules' in sheet) {
            try {
                (0,_util__WEBPACK_IMPORTED_MODULE_0__.toArray)(sheet.cssRules || []).forEach((item, index) => {
                    if (item.type === CSSRule.IMPORT_RULE) {
                        let importIndex = index + 1;
                        const url = item.href;
                        const deferred = fetchCSS(url)
                            .then((metadata) => embedFonts(metadata, options))
                            .then((cssText) => parseCSS(cssText).forEach((rule) => {
                            try {
                                sheet.insertRule(rule, rule.startsWith('@import')
                                    ? (importIndex += 1)
                                    : sheet.cssRules.length);
                            }
                            catch (error) {
                                console.error('Error inserting rule from remote css', {
                                    rule,
                                    error,
                                });
                            }
                        }))
                            .catch((e) => {
                            console.error('Error loading remote css', e.toString());
                        });
                        deferreds.push(deferred);
                    }
                });
            }
            catch (e) {
                const inline = styleSheets.find((a) => a.href == null) || document.styleSheets[0];
                if (sheet.href != null) {
                    deferreds.push(fetchCSS(sheet.href)
                        .then((metadata) => embedFonts(metadata, options))
                        .then((cssText) => parseCSS(cssText).forEach((rule) => {
                        inline.insertRule(rule, sheet.cssRules.length);
                    }))
                        .catch((err) => {
                        console.error('Error loading remote stylesheet', err);
                    }));
                }
                console.error('Error inlining remote css file', e);
            }
        }
    });
    return Promise.all(deferreds).then(() => {
        // Second loop parses rules
        styleSheets.forEach((sheet) => {
            if ('cssRules' in sheet) {
                try {
                    (0,_util__WEBPACK_IMPORTED_MODULE_0__.toArray)(sheet.cssRules || []).forEach((item) => {
                        ret.push(item);
                    });
                }
                catch (e) {
                    console.error(`Error while reading CSS rules from ${sheet.href}`, e);
                }
            }
        });
        return ret;
    });
}
function getWebFontRules(cssRules) {
    return cssRules
        .filter((rule) => rule.type === CSSRule.FONT_FACE_RULE)
        .filter((rule) => (0,_embed_resources__WEBPACK_IMPORTED_MODULE_2__.shouldEmbed)(rule.style.getPropertyValue('src')));
}
async function parseWebFontRules(node, options) {
    if (node.ownerDocument == null) {
        throw new Error('Provided element is not within a Document');
    }
    const styleSheets = (0,_util__WEBPACK_IMPORTED_MODULE_0__.toArray)(node.ownerDocument.styleSheets);
    const cssRules = await getCSSRules(styleSheets, options);
    return getWebFontRules(cssRules);
}
async function getWebFontCSS(node, options) {
    const rules = await parseWebFontRules(node, options);
    const cssTexts = await Promise.all(rules.map((rule) => {
        const baseUrl = rule.parentStyleSheet ? rule.parentStyleSheet.href : null;
        return (0,_embed_resources__WEBPACK_IMPORTED_MODULE_2__.embedResources)(rule.cssText, baseUrl, options);
    }));
    return cssTexts.join('\n');
}
async function embedWebFonts(clonedNode, options) {
    const cssText = options.fontEmbedCSS != null
        ? options.fontEmbedCSS
        : options.skipFonts
            ? null
            : await getWebFontCSS(clonedNode, options);
    if (cssText) {
        const styleNode = document.createElement('style');
        const sytleContent = document.createTextNode(cssText);
        styleNode.appendChild(sytleContent);
        if (clonedNode.firstChild) {
            clonedNode.insertBefore(styleNode, clonedNode.firstChild);
        }
        else {
            clonedNode.appendChild(styleNode);
        }
    }
}
//# sourceMappingURL=embed-webfonts.js.map

/***/ }),

/***/ "../node_modules/html-to-image/es/index.js":
/*!*************************************************!*\
  !*** ../node_modules/html-to-image/es/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFontEmbedCSS: () => (/* binding */ getFontEmbedCSS),
/* harmony export */   toBlob: () => (/* binding */ toBlob),
/* harmony export */   toCanvas: () => (/* binding */ toCanvas),
/* harmony export */   toJpeg: () => (/* binding */ toJpeg),
/* harmony export */   toPixelData: () => (/* binding */ toPixelData),
/* harmony export */   toPng: () => (/* binding */ toPng),
/* harmony export */   toSvg: () => (/* binding */ toSvg)
/* harmony export */ });
/* harmony import */ var _clone_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clone-node */ "../node_modules/html-to-image/es/clone-node.js");
/* harmony import */ var _embed_images__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./embed-images */ "../node_modules/html-to-image/es/embed-images.js");
/* harmony import */ var _apply_style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./apply-style */ "../node_modules/html-to-image/es/apply-style.js");
/* harmony import */ var _embed_webfonts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./embed-webfonts */ "../node_modules/html-to-image/es/embed-webfonts.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util */ "../node_modules/html-to-image/es/util.js");





async function toSvg(node, options = {}) {
    const { width, height } = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getImageSize)(node, options);
    const clonedNode = (await (0,_clone_node__WEBPACK_IMPORTED_MODULE_0__.cloneNode)(node, options, true));
    await (0,_embed_webfonts__WEBPACK_IMPORTED_MODULE_3__.embedWebFonts)(clonedNode, options);
    await (0,_embed_images__WEBPACK_IMPORTED_MODULE_1__.embedImages)(clonedNode, options);
    (0,_apply_style__WEBPACK_IMPORTED_MODULE_2__.applyStyle)(clonedNode, options);
    const datauri = await (0,_util__WEBPACK_IMPORTED_MODULE_4__.nodeToDataURL)(clonedNode, width, height);
    return datauri;
}
async function toCanvas(node, options = {}) {
    const { width, height } = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getImageSize)(node, options);
    const svg = await toSvg(node, options);
    const img = await (0,_util__WEBPACK_IMPORTED_MODULE_4__.createImage)(svg);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const ratio = options.pixelRatio || (0,_util__WEBPACK_IMPORTED_MODULE_4__.getPixelRatio)();
    const canvasWidth = options.canvasWidth || width;
    const canvasHeight = options.canvasHeight || height;
    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;
    if (!options.skipAutoScale) {
        (0,_util__WEBPACK_IMPORTED_MODULE_4__.checkCanvasDimensions)(canvas);
    }
    canvas.style.width = `${canvasWidth}`;
    canvas.style.height = `${canvasHeight}`;
    if (options.backgroundColor) {
        context.fillStyle = options.backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
}
async function toPixelData(node, options = {}) {
    const { width, height } = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getImageSize)(node, options);
    const canvas = await toCanvas(node, options);
    const ctx = canvas.getContext('2d');
    return ctx.getImageData(0, 0, width, height).data;
}
async function toPng(node, options = {}) {
    const canvas = await toCanvas(node, options);
    return canvas.toDataURL();
}
async function toJpeg(node, options = {}) {
    const canvas = await toCanvas(node, options);
    return canvas.toDataURL('image/jpeg', options.quality || 1);
}
async function toBlob(node, options = {}) {
    const canvas = await toCanvas(node, options);
    const blob = await (0,_util__WEBPACK_IMPORTED_MODULE_4__.canvasToBlob)(canvas);
    return blob;
}
async function getFontEmbedCSS(node, options = {}) {
    return (0,_embed_webfonts__WEBPACK_IMPORTED_MODULE_3__.getWebFontCSS)(node, options);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../node_modules/html-to-image/es/mimes.js":
/*!*************************************************!*\
  !*** ../node_modules/html-to-image/es/mimes.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getMimeType: () => (/* binding */ getMimeType)
/* harmony export */ });
const WOFF = 'application/font-woff';
const JPEG = 'image/jpeg';
const mimes = {
    woff: WOFF,
    woff2: WOFF,
    ttf: 'application/font-truetype',
    eot: 'application/vnd.ms-fontobject',
    png: 'image/png',
    jpg: JPEG,
    jpeg: JPEG,
    gif: 'image/gif',
    tiff: 'image/tiff',
    svg: 'image/svg+xml',
    webp: 'image/webp',
};
function getExtension(url) {
    const match = /\.([^./]*?)$/g.exec(url);
    return match ? match[1] : '';
}
function getMimeType(url) {
    const extension = getExtension(url).toLowerCase();
    return mimes[extension] || '';
}
//# sourceMappingURL=mimes.js.map

/***/ }),

/***/ "../node_modules/html-to-image/es/util.js":
/*!************************************************!*\
  !*** ../node_modules/html-to-image/es/util.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canvasToBlob: () => (/* binding */ canvasToBlob),
/* harmony export */   checkCanvasDimensions: () => (/* binding */ checkCanvasDimensions),
/* harmony export */   createImage: () => (/* binding */ createImage),
/* harmony export */   delay: () => (/* binding */ delay),
/* harmony export */   getImageSize: () => (/* binding */ getImageSize),
/* harmony export */   getPixelRatio: () => (/* binding */ getPixelRatio),
/* harmony export */   isInstanceOfElement: () => (/* binding */ isInstanceOfElement),
/* harmony export */   nodeToDataURL: () => (/* binding */ nodeToDataURL),
/* harmony export */   resolveUrl: () => (/* binding */ resolveUrl),
/* harmony export */   svgToDataURL: () => (/* binding */ svgToDataURL),
/* harmony export */   toArray: () => (/* binding */ toArray),
/* harmony export */   uuid: () => (/* binding */ uuid)
/* harmony export */ });
function resolveUrl(url, baseUrl) {
    // url is absolute already
    if (url.match(/^[a-z]+:\/\//i)) {
        return url;
    }
    // url is absolute already, without protocol
    if (url.match(/^\/\//)) {
        return window.location.protocol + url;
    }
    // dataURI, mailto:, tel:, etc.
    if (url.match(/^[a-z]+:/i)) {
        return url;
    }
    const doc = document.implementation.createHTMLDocument();
    const base = doc.createElement('base');
    const a = doc.createElement('a');
    doc.head.appendChild(base);
    doc.body.appendChild(a);
    if (baseUrl) {
        base.href = baseUrl;
    }
    a.href = url;
    return a.href;
}
const uuid = (() => {
    // generate uuid for className of pseudo elements.
    // We should not use GUIDs, otherwise pseudo elements sometimes cannot be captured.
    let counter = 0;
    // ref: http://stackoverflow.com/a/6248722/2519373
    const random = () => 
    // eslint-disable-next-line no-bitwise
    `0000${((Math.random() * 36 ** 4) << 0).toString(36)}`.slice(-4);
    return () => {
        counter += 1;
        return `u${random()}${counter}`;
    };
})();
function delay(ms) {
    return (args) => new Promise((resolve) => {
        setTimeout(() => resolve(args), ms);
    });
}
function toArray(arrayLike) {
    const arr = [];
    for (let i = 0, l = arrayLike.length; i < l; i++) {
        arr.push(arrayLike[i]);
    }
    return arr;
}
function px(node, styleProperty) {
    const win = node.ownerDocument.defaultView || window;
    const val = win.getComputedStyle(node).getPropertyValue(styleProperty);
    return val ? parseFloat(val.replace('px', '')) : 0;
}
function getNodeWidth(node) {
    const leftBorder = px(node, 'border-left-width');
    const rightBorder = px(node, 'border-right-width');
    return node.clientWidth + leftBorder + rightBorder;
}
function getNodeHeight(node) {
    const topBorder = px(node, 'border-top-width');
    const bottomBorder = px(node, 'border-bottom-width');
    return node.clientHeight + topBorder + bottomBorder;
}
function getImageSize(targetNode, options = {}) {
    const width = options.width || getNodeWidth(targetNode);
    const height = options.height || getNodeHeight(targetNode);
    return { width, height };
}
function getPixelRatio() {
    let ratio;
    let FINAL_PROCESS;
    try {
        FINAL_PROCESS = process;
    }
    catch (e) {
        // pass
    }
    const val = FINAL_PROCESS && FINAL_PROCESS.env
        ? FINAL_PROCESS.env.devicePixelRatio
        : null;
    if (val) {
        ratio = parseInt(val, 10);
        if (Number.isNaN(ratio)) {
            ratio = 1;
        }
    }
    return ratio || window.devicePixelRatio || 1;
}
// @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
const canvasDimensionLimit = 16384;
function checkCanvasDimensions(canvas) {
    if (canvas.width > canvasDimensionLimit ||
        canvas.height > canvasDimensionLimit) {
        if (canvas.width > canvasDimensionLimit &&
            canvas.height > canvasDimensionLimit) {
            if (canvas.width > canvas.height) {
                canvas.height *= canvasDimensionLimit / canvas.width;
                canvas.width = canvasDimensionLimit;
            }
            else {
                canvas.width *= canvasDimensionLimit / canvas.height;
                canvas.height = canvasDimensionLimit;
            }
        }
        else if (canvas.width > canvasDimensionLimit) {
            canvas.height *= canvasDimensionLimit / canvas.width;
            canvas.width = canvasDimensionLimit;
        }
        else {
            canvas.width *= canvasDimensionLimit / canvas.height;
            canvas.height = canvasDimensionLimit;
        }
    }
}
function canvasToBlob(canvas, options = {}) {
    if (canvas.toBlob) {
        return new Promise((resolve) => {
            canvas.toBlob(resolve, options.type ? options.type : 'image/png', options.quality ? options.quality : 1);
        });
    }
    return new Promise((resolve) => {
        const binaryString = window.atob(canvas
            .toDataURL(options.type ? options.type : undefined, options.quality ? options.quality : undefined)
            .split(',')[1]);
        const len = binaryString.length;
        const binaryArray = new Uint8Array(len);
        for (let i = 0; i < len; i += 1) {
            binaryArray[i] = binaryString.charCodeAt(i);
        }
        resolve(new Blob([binaryArray], {
            type: options.type ? options.type : 'image/png',
        }));
    });
}
function createImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.decode = () => resolve(img);
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        img.src = url;
    });
}
async function svgToDataURL(svg) {
    return Promise.resolve()
        .then(() => new XMLSerializer().serializeToString(svg))
        .then(encodeURIComponent)
        .then((html) => `data:image/svg+xml;charset=utf-8,${html}`);
}
async function nodeToDataURL(node, width, height) {
    const xmlns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(xmlns, 'svg');
    const foreignObject = document.createElementNS(xmlns, 'foreignObject');
    svg.setAttribute('width', `${width}`);
    svg.setAttribute('height', `${height}`);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');
    foreignObject.setAttribute('x', '0');
    foreignObject.setAttribute('y', '0');
    foreignObject.setAttribute('externalResourcesRequired', 'true');
    svg.appendChild(foreignObject);
    foreignObject.appendChild(node);
    return svgToDataURL(svg);
}
const isInstanceOfElement = (node, instance) => {
    if (node instanceof instance)
        return true;
    const nodePrototype = Object.getPrototypeOf(node);
    if (nodePrototype === null)
        return false;
    return (nodePrototype.constructor.name === instance.name ||
        isInstanceOfElement(nodePrototype, instance));
};
//# sourceMappingURL=util.js.map

/***/ }),

/***/ "../node_modules/object-assign/index.js":
/*!**********************************************!*\
  !*** ../node_modules/object-assign/index.js ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


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


/***/ }),

/***/ "../node_modules/prop-types/checkPropTypes.js":
/*!****************************************************!*\
  !*** ../node_modules/prop-types/checkPropTypes.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "../node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "../node_modules/prop-types/lib/has.js");

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
  if (true) {
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
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "../node_modules/prop-types/factoryWithTypeCheckers.js":
/*!*************************************************************!*\
  !*** ../node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "../node_modules/prop-types/node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "../node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "../node_modules/prop-types/lib/ReactPropTypesSecret.js");
var has = __webpack_require__(/*! ./lib/has */ "../node_modules/prop-types/lib/has.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "../node_modules/prop-types/checkPropTypes.js");

var printWarning = function() {};

if (true) {
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
    if (true) {
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
        } else if ( true && typeof console !== 'undefined') {
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
      if (true) {
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
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : 0;
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


/***/ }),

/***/ "../node_modules/prop-types/index.js":
/*!*******************************************!*\
  !*** ../node_modules/prop-types/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "../node_modules/prop-types/node_modules/react-is/index.js");

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "../node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "../node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!**************************************************************!*\
  !*** ../node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "../node_modules/prop-types/lib/has.js":
/*!*********************************************!*\
  !*** ../node_modules/prop-types/lib/has.js ***!
  \*********************************************/
/***/ ((module) => {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),

/***/ "../node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js":
/*!************************************************************************************!*\
  !*** ../node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
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


/***/ }),

/***/ "../node_modules/prop-types/node_modules/react-is/index.js":
/*!*****************************************************************!*\
  !*** ../node_modules/prop-types/node_modules/react-is/index.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "../node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "../node_modules/react-dom/client.js":
/*!*******************************************!*\
  !*** ../node_modules/react-dom/client.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) {} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "../node_modules/react-draggable/build/cjs/Draggable.js":
/*!**************************************************************!*\
  !*** ../node_modules/react-draggable/build/cjs/Draggable.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "DraggableCore", ({
  enumerable: true,
  get: function get() {
    return _DraggableCore.default;
  }
}));
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _reactDom = _interopRequireDefault(__webpack_require__(/*! react-dom */ "react-dom"));

var _clsx2 = _interopRequireDefault(__webpack_require__(/*! clsx */ "../node_modules/clsx/dist/clsx.m.js"));

var _domFns = __webpack_require__(/*! ./utils/domFns */ "../node_modules/react-draggable/build/cjs/utils/domFns.js");

var _positionFns = __webpack_require__(/*! ./utils/positionFns */ "../node_modules/react-draggable/build/cjs/utils/positionFns.js");

var _shims = __webpack_require__(/*! ./utils/shims */ "../node_modules/react-draggable/build/cjs/utils/shims.js");

var _DraggableCore = _interopRequireDefault(__webpack_require__(/*! ./DraggableCore */ "../node_modules/react-draggable/build/cjs/DraggableCore.js"));

var _log = _interopRequireDefault(__webpack_require__(/*! ./utils/log */ "../node_modules/react-draggable/build/cjs/utils/log.js"));

var _excluded = ["axis", "bounds", "children", "defaultPosition", "defaultClassName", "defaultClassNameDragging", "defaultClassNameDragged", "position", "positionOffset", "scale"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
// Define <Draggable>
//
var Draggable = /*#__PURE__*/function (_React$Component) {
  _inherits(Draggable, _React$Component);

  var _super = _createSuper(Draggable);

  function Draggable(props
  /*: DraggableProps*/
  ) {
    var _this;

    _classCallCheck(this, Draggable);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "onDragStart", function (e, coreData) {
      (0, _log.default)('Draggable: onDragStart: %j', coreData); // Short-circuit if user's callback killed it.

      var shouldStart = _this.props.onStart(e, (0, _positionFns.createDraggableData)(_assertThisInitialized(_this), coreData)); // Kills start event on core as well, so move handlers are never bound.


      if (shouldStart === false) return false;

      _this.setState({
        dragging: true,
        dragged: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onDrag", function (e, coreData) {
      if (!_this.state.dragging) return false;
      (0, _log.default)('Draggable: onDrag: %j', coreData);
      var uiData = (0, _positionFns.createDraggableData)(_assertThisInitialized(_this), coreData);
      var newState
      /*: $Shape<DraggableState>*/
      = {
        x: uiData.x,
        y: uiData.y
      }; // Keep within bounds.

      if (_this.props.bounds) {
        // Save original x and y.
        var x = newState.x,
            y = newState.y; // Add slack to the values used to calculate bound position. This will ensure that if
        // we start removing slack, the element won't react to it right away until it's been
        // completely removed.

        newState.x += _this.state.slackX;
        newState.y += _this.state.slackY; // Get bound position. This will ceil/floor the x and y within the boundaries.

        var _getBoundPosition = (0, _positionFns.getBoundPosition)(_assertThisInitialized(_this), newState.x, newState.y),
            _getBoundPosition2 = _slicedToArray(_getBoundPosition, 2),
            newStateX = _getBoundPosition2[0],
            newStateY = _getBoundPosition2[1];

        newState.x = newStateX;
        newState.y = newStateY; // Recalculate slack by noting how much was shaved by the boundPosition handler.

        newState.slackX = _this.state.slackX + (x - newState.x);
        newState.slackY = _this.state.slackY + (y - newState.y); // Update the event we fire to reflect what really happened after bounds took effect.

        uiData.x = newState.x;
        uiData.y = newState.y;
        uiData.deltaX = newState.x - _this.state.x;
        uiData.deltaY = newState.y - _this.state.y;
      } // Short-circuit if user's callback killed it.


      var shouldUpdate = _this.props.onDrag(e, uiData);

      if (shouldUpdate === false) return false;

      _this.setState(newState);
    });

    _defineProperty(_assertThisInitialized(_this), "onDragStop", function (e, coreData) {
      if (!_this.state.dragging) return false; // Short-circuit if user's callback killed it.

      var shouldContinue = _this.props.onStop(e, (0, _positionFns.createDraggableData)(_assertThisInitialized(_this), coreData));

      if (shouldContinue === false) return false;
      (0, _log.default)('Draggable: onDragStop: %j', coreData);
      var newState
      /*: $Shape<DraggableState>*/
      = {
        dragging: false,
        slackX: 0,
        slackY: 0
      }; // If this is a controlled component, the result of this operation will be to
      // revert back to the old position. We expect a handler on `onDragStop`, at the least.

      var controlled = Boolean(_this.props.position);

      if (controlled) {
        var _this$props$position = _this.props.position,
            x = _this$props$position.x,
            y = _this$props$position.y;
        newState.x = x;
        newState.y = y;
      }

      _this.setState(newState);
    });

    _this.state = {
      // Whether or not we are currently dragging.
      dragging: false,
      // Whether or not we have been dragged before.
      dragged: false,
      // Current transform x and y.
      x: props.position ? props.position.x : props.defaultPosition.x,
      y: props.position ? props.position.y : props.defaultPosition.y,
      prevPropsPosition: _objectSpread({}, props.position),
      // Used for compensating for out-of-bounds drags
      slackX: 0,
      slackY: 0,
      // Can only determine if SVG after mounting
      isElementSVG: false
    };

    if (props.position && !(props.onDrag || props.onStop)) {
      // eslint-disable-next-line no-console
      console.warn('A `position` was applied to this <Draggable>, without drag handlers. This will make this ' + 'component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the ' + '`position` of this element.');
    }

    return _this;
  }

  _createClass(Draggable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Check to see if the element passed is an instanceof SVGElement
      if (typeof window.SVGElement !== 'undefined' && this.findDOMNode() instanceof window.SVGElement) {
        this.setState({
          isElementSVG: true
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setState({
        dragging: false
      }); // prevents invariant if unmounted while dragging
    } // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
    // the underlying DOM node ourselves. See the README for more information.

  }, {
    key: "findDOMNode",
    value: function findDOMNode()
    /*: ?HTMLElement*/
    {
      var _this$props$nodeRef$c, _this$props, _this$props$nodeRef;

      return (_this$props$nodeRef$c = (_this$props = this.props) === null || _this$props === void 0 ? void 0 : (_this$props$nodeRef = _this$props.nodeRef) === null || _this$props$nodeRef === void 0 ? void 0 : _this$props$nodeRef.current) !== null && _this$props$nodeRef$c !== void 0 ? _this$props$nodeRef$c : _reactDom.default.findDOMNode(this);
    }
  }, {
    key: "render",
    value: function render()
    /*: ReactElement<any>*/
    {
      var _clsx;

      var _this$props2 = this.props,
          axis = _this$props2.axis,
          bounds = _this$props2.bounds,
          children = _this$props2.children,
          defaultPosition = _this$props2.defaultPosition,
          defaultClassName = _this$props2.defaultClassName,
          defaultClassNameDragging = _this$props2.defaultClassNameDragging,
          defaultClassNameDragged = _this$props2.defaultClassNameDragged,
          position = _this$props2.position,
          positionOffset = _this$props2.positionOffset,
          scale = _this$props2.scale,
          draggableCoreProps = _objectWithoutProperties(_this$props2, _excluded);

      var style = {};
      var svgTransform = null; // If this is controlled, we don't want to move it - unless it's dragging.

      var controlled = Boolean(position);
      var draggable = !controlled || this.state.dragging;
      var validPosition = position || defaultPosition;
      var transformOpts = {
        // Set left if horizontal drag is enabled
        x: (0, _positionFns.canDragX)(this) && draggable ? this.state.x : validPosition.x,
        // Set top if vertical drag is enabled
        y: (0, _positionFns.canDragY)(this) && draggable ? this.state.y : validPosition.y
      }; // If this element was SVG, we use the `transform` attribute.

      if (this.state.isElementSVG) {
        svgTransform = (0, _domFns.createSVGTransform)(transformOpts, positionOffset);
      } else {
        // Add a CSS transform to move the element around. This allows us to move the element around
        // without worrying about whether or not it is relatively or absolutely positioned.
        // If the item you are dragging already has a transform set, wrap it in a <span> so <Draggable>
        // has a clean slate.
        style = (0, _domFns.createCSSTransform)(transformOpts, positionOffset);
      } // Mark with class while dragging


      var className = (0, _clsx2.default)(children.props.className || '', defaultClassName, (_clsx = {}, _defineProperty(_clsx, defaultClassNameDragging, this.state.dragging), _defineProperty(_clsx, defaultClassNameDragged, this.state.dragged), _clsx)); // Reuse the child provided
      // This makes it flexible to use whatever element is wanted (div, ul, etc)

      return /*#__PURE__*/React.createElement(_DraggableCore.default, _extends({}, draggableCoreProps, {
        onStart: this.onDragStart,
        onDrag: this.onDrag,
        onStop: this.onDragStop
      }), /*#__PURE__*/React.cloneElement(React.Children.only(children), {
        className: className,
        style: _objectSpread(_objectSpread({}, children.props.style), style),
        transform: svgTransform
      }));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: // React 16.3+
    // Arity (props, state)
    function getDerivedStateFromProps(_ref, _ref2)
    /*: ?$Shape<DraggableState>*/
    {
      var position = _ref.position;
      var prevPropsPosition = _ref2.prevPropsPosition;

      // Set x/y if a new position is provided in props that is different than the previous.
      if (position && (!prevPropsPosition || position.x !== prevPropsPosition.x || position.y !== prevPropsPosition.y)) {
        (0, _log.default)('Draggable: getDerivedStateFromProps %j', {
          position: position,
          prevPropsPosition: prevPropsPosition
        });
        return {
          x: position.x,
          y: position.y,
          prevPropsPosition: _objectSpread({}, position)
        };
      }

      return null;
    }
  }]);

  return Draggable;
}(React.Component);

exports["default"] = Draggable;

_defineProperty(Draggable, "displayName", 'Draggable');

_defineProperty(Draggable, "propTypes", _objectSpread(_objectSpread({}, _DraggableCore.default.propTypes), {}, {
  /**
   * `axis` determines which axis the draggable can move.
   *
   *  Note that all callbacks will still return data as normal. This only
   *  controls flushing to the DOM.
   *
   * 'both' allows movement horizontally and vertically.
   * 'x' limits movement to horizontal axis.
   * 'y' limits movement to vertical axis.
   * 'none' limits all movement.
   *
   * Defaults to 'both'.
   */
  axis: _propTypes.default.oneOf(['both', 'x', 'y', 'none']),

  /**
   * `bounds` determines the range of movement available to the element.
   * Available values are:
   *
   * 'parent' restricts movement within the Draggable's parent node.
   *
   * Alternatively, pass an object with the following properties, all of which are optional:
   *
   * {left: LEFT_BOUND, right: RIGHT_BOUND, bottom: BOTTOM_BOUND, top: TOP_BOUND}
   *
   * All values are in px.
   *
   * Example:
   *
   * ```jsx
   *   let App = React.createClass({
   *       render: function () {
   *         return (
   *            <Draggable bounds={{right: 300, bottom: 300}}>
   *              <div>Content</div>
   *           </Draggable>
   *         );
   *       }
   *   });
   * ```
   */
  bounds: _propTypes.default.oneOfType([_propTypes.default.shape({
    left: _propTypes.default.number,
    right: _propTypes.default.number,
    top: _propTypes.default.number,
    bottom: _propTypes.default.number
  }), _propTypes.default.string, _propTypes.default.oneOf([false])]),
  defaultClassName: _propTypes.default.string,
  defaultClassNameDragging: _propTypes.default.string,
  defaultClassNameDragged: _propTypes.default.string,

  /**
   * `defaultPosition` specifies the x and y that the dragged item should start at
   *
   * Example:
   *
   * ```jsx
   *      let App = React.createClass({
   *          render: function () {
   *              return (
   *                  <Draggable defaultPosition={{x: 25, y: 25}}>
   *                      <div>I start with transformX: 25px and transformY: 25px;</div>
   *                  </Draggable>
   *              );
   *          }
   *      });
   * ```
   */
  defaultPosition: _propTypes.default.shape({
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }),
  positionOffset: _propTypes.default.shape({
    x: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    y: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
  }),

  /**
   * `position`, if present, defines the current position of the element.
   *
   *  This is similar to how form elements in React work - if no `position` is supplied, the component
   *  is uncontrolled.
   *
   * Example:
   *
   * ```jsx
   *      let App = React.createClass({
   *          render: function () {
   *              return (
   *                  <Draggable position={{x: 25, y: 25}}>
   *                      <div>I start with transformX: 25px and transformY: 25px;</div>
   *                  </Draggable>
   *              );
   *          }
   *      });
   * ```
   */
  position: _propTypes.default.shape({
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }),

  /**
   * These properties should be defined on the child, not here.
   */
  className: _shims.dontSetMe,
  style: _shims.dontSetMe,
  transform: _shims.dontSetMe
}));

_defineProperty(Draggable, "defaultProps", _objectSpread(_objectSpread({}, _DraggableCore.default.defaultProps), {}, {
  axis: 'both',
  bounds: false,
  defaultClassName: 'react-draggable',
  defaultClassNameDragging: 'react-draggable-dragging',
  defaultClassNameDragged: 'react-draggable-dragged',
  defaultPosition: {
    x: 0,
    y: 0
  },
  scale: 1
}));

/***/ }),

/***/ "../node_modules/react-draggable/build/cjs/DraggableCore.js":
/*!******************************************************************!*\
  !*** ../node_modules/react-draggable/build/cjs/DraggableCore.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _reactDom = _interopRequireDefault(__webpack_require__(/*! react-dom */ "react-dom"));

var _domFns = __webpack_require__(/*! ./utils/domFns */ "../node_modules/react-draggable/build/cjs/utils/domFns.js");

var _positionFns = __webpack_require__(/*! ./utils/positionFns */ "../node_modules/react-draggable/build/cjs/utils/positionFns.js");

var _shims = __webpack_require__(/*! ./utils/shims */ "../node_modules/react-draggable/build/cjs/utils/shims.js");

var _log = _interopRequireDefault(__webpack_require__(/*! ./utils/log */ "../node_modules/react-draggable/build/cjs/utils/log.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Simple abstraction for dragging events names.
var eventsFor = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend'
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup'
  }
}; // Default to mouse events.

var dragEventFor = eventsFor.mouse;
/*:: type DraggableCoreState = {
  dragging: boolean,
  lastX: number,
  lastY: number,
  touchIdentifier: ?number
};*/

/*:: export type DraggableData = {
  node: HTMLElement,
  x: number, y: number,
  deltaX: number, deltaY: number,
  lastX: number, lastY: number,
};*/

/*:: export type DraggableEventHandler = (e: MouseEvent, data: DraggableData) => void | false;*/

/*:: export type ControlPosition = {x: number, y: number};*/

/*:: export type PositionOffsetControlPosition = {x: number|string, y: number|string};*/

/*:: export type DraggableCoreDefaultProps = {
  allowAnyClick: boolean,
  disabled: boolean,
  enableUserSelectHack: boolean,
  onStart: DraggableEventHandler,
  onDrag: DraggableEventHandler,
  onStop: DraggableEventHandler,
  onMouseDown: (e: MouseEvent) => void,
  scale: number,
};*/

/*:: export type DraggableCoreProps = {
  ...DraggableCoreDefaultProps,
  cancel: string,
  children: ReactElement<any>,
  offsetParent: HTMLElement,
  grid: [number, number],
  handle: string,
  nodeRef?: ?React.ElementRef<any>,
};*/

//
// Define <DraggableCore>.
//
// <DraggableCore> is for advanced usage of <Draggable>. It maintains minimal internal state so it can
// work well with libraries that require more control over the element.
//
var DraggableCore = /*#__PURE__*/function (_React$Component) {
  _inherits(DraggableCore, _React$Component);

  var _super = _createSuper(DraggableCore);

  function DraggableCore() {
    var _this;

    _classCallCheck(this, DraggableCore);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      dragging: false,
      // Used while dragging to determine deltas.
      lastX: NaN,
      lastY: NaN,
      touchIdentifier: null
    });

    _defineProperty(_assertThisInitialized(_this), "mounted", false);

    _defineProperty(_assertThisInitialized(_this), "handleDragStart", function (e) {
      // Make it possible to attach event handlers on top of this one.
      _this.props.onMouseDown(e); // Only accept left-clicks.


      if (!_this.props.allowAnyClick && typeof e.button === 'number' && e.button !== 0) return false; // Get nodes. Be sure to grab relative document (could be iframed)

      var thisNode = _this.findDOMNode();

      if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
        throw new Error('<DraggableCore> not mounted on DragStart!');
      }

      var ownerDocument = thisNode.ownerDocument; // Short circuit if handle or cancel prop was provided and selector doesn't match.

      if (_this.props.disabled || !(e.target instanceof ownerDocument.defaultView.Node) || _this.props.handle && !(0, _domFns.matchesSelectorAndParentsTo)(e.target, _this.props.handle, thisNode) || _this.props.cancel && (0, _domFns.matchesSelectorAndParentsTo)(e.target, _this.props.cancel, thisNode)) {
        return;
      } // Prevent scrolling on mobile devices, like ipad/iphone.
      // Important that this is after handle/cancel.


      if (e.type === 'touchstart') e.preventDefault(); // Set touch identifier in component state if this is a touch event. This allows us to
      // distinguish between individual touches on multitouch screens by identifying which
      // touchpoint was set to this element.

      var touchIdentifier = (0, _domFns.getTouchIdentifier)(e);

      _this.setState({
        touchIdentifier: touchIdentifier
      }); // Get the current drag point from the event. This is used as the offset.


      var position = (0, _positionFns.getControlPosition)(e, touchIdentifier, _assertThisInitialized(_this));
      if (position == null) return; // not possible but satisfies flow

      var x = position.x,
          y = position.y; // Create an event object with all the data parents need to make a decision here.

      var coreEvent = (0, _positionFns.createCoreData)(_assertThisInitialized(_this), x, y);
      (0, _log.default)('DraggableCore: handleDragStart: %j', coreEvent); // Call event handler. If it returns explicit false, cancel.

      (0, _log.default)('calling', _this.props.onStart);

      var shouldUpdate = _this.props.onStart(e, coreEvent);

      if (shouldUpdate === false || _this.mounted === false) return; // Add a style to the body to disable user-select. This prevents text from
      // being selected all over the page.

      if (_this.props.enableUserSelectHack) (0, _domFns.addUserSelectStyles)(ownerDocument); // Initiate dragging. Set the current x and y as offsets
      // so we know how much we've moved during the drag. This allows us
      // to drag elements around even if they have been moved, without issue.

      _this.setState({
        dragging: true,
        lastX: x,
        lastY: y
      }); // Add events to the document directly so we catch when the user's mouse/touch moves outside of
      // this element. We use different events depending on whether or not we have detected that this
      // is a touch-capable device.


      (0, _domFns.addEvent)(ownerDocument, dragEventFor.move, _this.handleDrag);
      (0, _domFns.addEvent)(ownerDocument, dragEventFor.stop, _this.handleDragStop);
    });

    _defineProperty(_assertThisInitialized(_this), "handleDrag", function (e) {
      // Get the current drag point from the event. This is used as the offset.
      var position = (0, _positionFns.getControlPosition)(e, _this.state.touchIdentifier, _assertThisInitialized(_this));
      if (position == null) return;
      var x = position.x,
          y = position.y; // Snap to grid if prop has been provided

      if (Array.isArray(_this.props.grid)) {
        var deltaX = x - _this.state.lastX,
            deltaY = y - _this.state.lastY;

        var _snapToGrid = (0, _positionFns.snapToGrid)(_this.props.grid, deltaX, deltaY);

        var _snapToGrid2 = _slicedToArray(_snapToGrid, 2);

        deltaX = _snapToGrid2[0];
        deltaY = _snapToGrid2[1];
        if (!deltaX && !deltaY) return; // skip useless drag

        x = _this.state.lastX + deltaX, y = _this.state.lastY + deltaY;
      }

      var coreEvent = (0, _positionFns.createCoreData)(_assertThisInitialized(_this), x, y);
      (0, _log.default)('DraggableCore: handleDrag: %j', coreEvent); // Call event handler. If it returns explicit false, trigger end.

      var shouldUpdate = _this.props.onDrag(e, coreEvent);

      if (shouldUpdate === false || _this.mounted === false) {
        try {
          // $FlowIgnore
          _this.handleDragStop(new MouseEvent('mouseup'));
        } catch (err) {
          // Old browsers
          var event = ((document.createEvent('MouseEvents')
          /*: any*/
          )
          /*: MouseTouchEvent*/
          ); // I see why this insanity was deprecated
          // $FlowIgnore

          event.initMouseEvent('mouseup', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

          _this.handleDragStop(event);
        }

        return;
      }

      _this.setState({
        lastX: x,
        lastY: y
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleDragStop", function (e) {
      if (!_this.state.dragging) return;
      var position = (0, _positionFns.getControlPosition)(e, _this.state.touchIdentifier, _assertThisInitialized(_this));
      if (position == null) return;
      var x = position.x,
          y = position.y; // Snap to grid if prop has been provided

      if (Array.isArray(_this.props.grid)) {
        var deltaX = x - _this.state.lastX || 0;
        var deltaY = y - _this.state.lastY || 0;

        var _snapToGrid3 = (0, _positionFns.snapToGrid)(_this.props.grid, deltaX, deltaY);

        var _snapToGrid4 = _slicedToArray(_snapToGrid3, 2);

        deltaX = _snapToGrid4[0];
        deltaY = _snapToGrid4[1];
        x = _this.state.lastX + deltaX, y = _this.state.lastY + deltaY;
      }

      var coreEvent = (0, _positionFns.createCoreData)(_assertThisInitialized(_this), x, y); // Call event handler

      var shouldContinue = _this.props.onStop(e, coreEvent);

      if (shouldContinue === false || _this.mounted === false) return false;

      var thisNode = _this.findDOMNode();

      if (thisNode) {
        // Remove user-select hack
        if (_this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(thisNode.ownerDocument);
      }

      (0, _log.default)('DraggableCore: handleDragStop: %j', coreEvent); // Reset the el.

      _this.setState({
        dragging: false,
        lastX: NaN,
        lastY: NaN
      });

      if (thisNode) {
        // Remove event handlers
        (0, _log.default)('DraggableCore: Removing handlers');
        (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.move, _this.handleDrag);
        (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.stop, _this.handleDragStop);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseDown", function (e) {
      dragEventFor = eventsFor.mouse; // on touchscreen laptops we could switch back to mouse

      return _this.handleDragStart(e);
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseUp", function (e) {
      dragEventFor = eventsFor.mouse;
      return _this.handleDragStop(e);
    });

    _defineProperty(_assertThisInitialized(_this), "onTouchStart", function (e) {
      // We're on a touch device now, so change the event handlers
      dragEventFor = eventsFor.touch;
      return _this.handleDragStart(e);
    });

    _defineProperty(_assertThisInitialized(_this), "onTouchEnd", function (e) {
      // We're on a touch device now, so change the event handlers
      dragEventFor = eventsFor.touch;
      return _this.handleDragStop(e);
    });

    return _this;
  }

  _createClass(DraggableCore, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mounted = true; // Touch handlers must be added with {passive: false} to be cancelable.
      // https://developers.google.com/web/updates/2017/01/scrolling-intervention

      var thisNode = this.findDOMNode();

      if (thisNode) {
        (0, _domFns.addEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
          passive: false
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false; // Remove any leftover event handlers. Remove both touch and mouse handlers in case
      // some browser quirk caused a touch event to fire during a mouse move, or vice versa.

      var thisNode = this.findDOMNode();

      if (thisNode) {
        var ownerDocument = thisNode.ownerDocument;
        (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.move, this.handleDrag);
        (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.move, this.handleDrag);
        (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
        (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
        (0, _domFns.removeEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
          passive: false
        });
        if (this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(ownerDocument);
      }
    } // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
    // the underlying DOM node ourselves. See the README for more information.

  }, {
    key: "findDOMNode",
    value: function findDOMNode()
    /*: ?HTMLElement*/
    {
      var _this$props, _this$props2, _this$props2$nodeRef;

      return (_this$props = this.props) !== null && _this$props !== void 0 && _this$props.nodeRef ? (_this$props2 = this.props) === null || _this$props2 === void 0 ? void 0 : (_this$props2$nodeRef = _this$props2.nodeRef) === null || _this$props2$nodeRef === void 0 ? void 0 : _this$props2$nodeRef.current : _reactDom.default.findDOMNode(this);
    }
  }, {
    key: "render",
    value: function render()
    /*: React.Element<any>*/
    {
      // Reuse the child provided
      // This makes it flexible to use whatever element is wanted (div, ul, etc)
      return /*#__PURE__*/React.cloneElement(React.Children.only(this.props.children), {
        // Note: mouseMove handler is attached to document so it will still function
        // when the user drags quickly and leaves the bounds of the element.
        onMouseDown: this.onMouseDown,
        onMouseUp: this.onMouseUp,
        // onTouchStart is added on `componentDidMount` so they can be added with
        // {passive: false}, which allows it to cancel. See
        // https://developers.google.com/web/updates/2017/01/scrolling-intervention
        onTouchEnd: this.onTouchEnd
      });
    }
  }]);

  return DraggableCore;
}(React.Component);

exports["default"] = DraggableCore;

_defineProperty(DraggableCore, "displayName", 'DraggableCore');

_defineProperty(DraggableCore, "propTypes", {
  /**
   * `allowAnyClick` allows dragging using any mouse button.
   * By default, we only accept the left button.
   *
   * Defaults to `false`.
   */
  allowAnyClick: _propTypes.default.bool,

  /**
   * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
   * with the exception of `onMouseDown`, will not fire.
   */
  disabled: _propTypes.default.bool,

  /**
   * By default, we add 'user-select:none' attributes to the document body
   * to prevent ugly text selection during drag. If this is causing problems
   * for your app, set this to `false`.
   */
  enableUserSelectHack: _propTypes.default.bool,

  /**
   * `offsetParent`, if set, uses the passed DOM node to compute drag offsets
   * instead of using the parent node.
   */
  offsetParent: function offsetParent(props
  /*: DraggableCoreProps*/
  , propName
  /*: $Keys<DraggableCoreProps>*/
  ) {
    if (props[propName] && props[propName].nodeType !== 1) {
      throw new Error('Draggable\'s offsetParent must be a DOM Node.');
    }
  },

  /**
   * `grid` specifies the x and y that dragging should snap to.
   */
  grid: _propTypes.default.arrayOf(_propTypes.default.number),

  /**
   * `handle` specifies a selector to be used as the handle that initiates drag.
   *
   * Example:
   *
   * ```jsx
   *   let App = React.createClass({
   *       render: function () {
   *         return (
   *            <Draggable handle=".handle">
   *              <div>
   *                  <div className="handle">Click me to drag</div>
   *                  <div>This is some other content</div>
   *              </div>
   *           </Draggable>
   *         );
   *       }
   *   });
   * ```
   */
  handle: _propTypes.default.string,

  /**
   * `cancel` specifies a selector to be used to prevent drag initialization.
   *
   * Example:
   *
   * ```jsx
   *   let App = React.createClass({
   *       render: function () {
   *           return(
   *               <Draggable cancel=".cancel">
   *                   <div>
   *                     <div className="cancel">You can't drag from here</div>
   *                     <div>Dragging here works fine</div>
   *                   </div>
   *               </Draggable>
   *           );
   *       }
   *   });
   * ```
   */
  cancel: _propTypes.default.string,

  /* If running in React Strict mode, ReactDOM.findDOMNode() is deprecated.
   * Unfortunately, in order for <Draggable> to work properly, we need raw access
   * to the underlying DOM node. If you want to avoid the warning, pass a `nodeRef`
   * as in this example:
   *
   * function MyComponent() {
   *   const nodeRef = React.useRef(null);
   *   return (
   *     <Draggable nodeRef={nodeRef}>
   *       <div ref={nodeRef}>Example Target</div>
   *     </Draggable>
   *   );
   * }
   *
   * This can be used for arbitrarily nested components, so long as the ref ends up
   * pointing to the actual child DOM node and not a custom component.
   */
  nodeRef: _propTypes.default.object,

  /**
   * Called when dragging starts.
   * If this function returns the boolean false, dragging will be canceled.
   */
  onStart: _propTypes.default.func,

  /**
   * Called while dragging.
   * If this function returns the boolean false, dragging will be canceled.
   */
  onDrag: _propTypes.default.func,

  /**
   * Called when dragging stops.
   * If this function returns the boolean false, the drag will remain active.
   */
  onStop: _propTypes.default.func,

  /**
   * A workaround option which can be passed if onMouseDown needs to be accessed,
   * since it'll always be blocked (as there is internal use of onMouseDown)
   */
  onMouseDown: _propTypes.default.func,

  /**
   * `scale`, if set, applies scaling while dragging an element
   */
  scale: _propTypes.default.number,

  /**
   * These properties should be defined on the child, not here.
   */
  className: _shims.dontSetMe,
  style: _shims.dontSetMe,
  transform: _shims.dontSetMe
});

_defineProperty(DraggableCore, "defaultProps", {
  allowAnyClick: false,
  // by default only accept left click
  disabled: false,
  enableUserSelectHack: true,
  onStart: function onStart() {},
  onDrag: function onDrag() {},
  onStop: function onStop() {},
  onMouseDown: function onMouseDown() {},
  scale: 1
});

/***/ }),

/***/ "../node_modules/react-draggable/build/cjs/cjs.js":
/*!********************************************************!*\
  !*** ../node_modules/react-draggable/build/cjs/cjs.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _require = __webpack_require__(/*! ./Draggable */ "../node_modules/react-draggable/build/cjs/Draggable.js"),
    Draggable = _require.default,
    DraggableCore = _require.DraggableCore; // Previous versions of this lib exported <Draggable> as the root export. As to no-// them, or TypeScript, we export *both* as the root and as 'default'.
// See https://github.com/mzabriskie/react-draggable/pull/254
// and https://github.com/mzabriskie/react-draggable/issues/266


module.exports = Draggable;
module.exports["default"] = Draggable;
module.exports.DraggableCore = DraggableCore;

/***/ }),

/***/ "../node_modules/react-draggable/build/cjs/utils/domFns.js":
/*!*****************************************************************!*\
  !*** ../node_modules/react-draggable/build/cjs/utils/domFns.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.addClassName = addClassName;
exports.addEvent = addEvent;
exports.addUserSelectStyles = addUserSelectStyles;
exports.createCSSTransform = createCSSTransform;
exports.createSVGTransform = createSVGTransform;
exports.getTouch = getTouch;
exports.getTouchIdentifier = getTouchIdentifier;
exports.getTranslation = getTranslation;
exports.innerHeight = innerHeight;
exports.innerWidth = innerWidth;
exports.matchesSelector = matchesSelector;
exports.matchesSelectorAndParentsTo = matchesSelectorAndParentsTo;
exports.offsetXYFromParent = offsetXYFromParent;
exports.outerHeight = outerHeight;
exports.outerWidth = outerWidth;
exports.removeClassName = removeClassName;
exports.removeEvent = removeEvent;
exports.removeUserSelectStyles = removeUserSelectStyles;

var _shims = __webpack_require__(/*! ./shims */ "../node_modules/react-draggable/build/cjs/utils/shims.js");

var _getPrefix = _interopRequireWildcard(__webpack_require__(/*! ./getPrefix */ "../node_modules/react-draggable/build/cjs/utils/getPrefix.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var matchesSelectorFunc = '';

function matchesSelector(el
/*: Node*/
, selector
/*: string*/
)
/*: boolean*/
{
  if (!matchesSelectorFunc) {
    matchesSelectorFunc = (0, _shims.findInArray)(['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'], function (method) {
      // $FlowIgnore: Doesn't think elements are indexable
      return (0, _shims.isFunction)(el[method]);
    });
  } // Might not be found entirely (not an Element?) - in that case, bail
  // $FlowIgnore: Doesn't think elements are indexable


  if (!(0, _shims.isFunction)(el[matchesSelectorFunc])) return false; // $FlowIgnore: Doesn't think elements are indexable

  return el[matchesSelectorFunc](selector);
} // Works up the tree to the draggable itself attempting to match selector.


function matchesSelectorAndParentsTo(el
/*: Node*/
, selector
/*: string*/
, baseNode
/*: Node*/
)
/*: boolean*/
{
  var node = el;

  do {
    if (matchesSelector(node, selector)) return true;
    if (node === baseNode) return false;
    node = node.parentNode;
  } while (node);

  return false;
}

function addEvent(el
/*: ?Node*/
, event
/*: string*/
, handler
/*: Function*/
, inputOptions
/*: Object*/
)
/*: void*/
{
  if (!el) return;

  var options = _objectSpread({
    capture: true
  }, inputOptions); // $FlowIgnore[method-unbinding]


  if (el.addEventListener) {
    el.addEventListener(event, handler, options);
  } else if (el.attachEvent) {
    el.attachEvent('on' + event, handler);
  } else {
    // $FlowIgnore: Doesn't think elements are indexable
    el['on' + event] = handler;
  }
}

function removeEvent(el
/*: ?Node*/
, event
/*: string*/
, handler
/*: Function*/
, inputOptions
/*: Object*/
)
/*: void*/
{
  if (!el) return;

  var options = _objectSpread({
    capture: true
  }, inputOptions); // $FlowIgnore[method-unbinding]


  if (el.removeEventListener) {
    el.removeEventListener(event, handler, options);
  } else if (el.detachEvent) {
    el.detachEvent('on' + event, handler);
  } else {
    // $FlowIgnore: Doesn't think elements are indexable
    el['on' + event] = null;
  }
}

function outerHeight(node
/*: HTMLElement*/
)
/*: number*/
{
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetTop which is including margin. See getBoundPosition
  var height = node.clientHeight;
  var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  height += (0, _shims.int)(computedStyle.borderTopWidth);
  height += (0, _shims.int)(computedStyle.borderBottomWidth);
  return height;
}

function outerWidth(node
/*: HTMLElement*/
)
/*: number*/
{
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetLeft which is including margin. See getBoundPosition
  var width = node.clientWidth;
  var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  width += (0, _shims.int)(computedStyle.borderLeftWidth);
  width += (0, _shims.int)(computedStyle.borderRightWidth);
  return width;
}

function innerHeight(node
/*: HTMLElement*/
)
/*: number*/
{
  var height = node.clientHeight;
  var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  height -= (0, _shims.int)(computedStyle.paddingTop);
  height -= (0, _shims.int)(computedStyle.paddingBottom);
  return height;
}

function innerWidth(node
/*: HTMLElement*/
)
/*: number*/
{
  var width = node.clientWidth;
  var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  width -= (0, _shims.int)(computedStyle.paddingLeft);
  width -= (0, _shims.int)(computedStyle.paddingRight);
  return width;
}
/*:: interface EventWithOffset {
  clientX: number, clientY: number
}*/


// Get from offsetParent
function offsetXYFromParent(evt
/*: EventWithOffset*/
, offsetParent
/*: HTMLElement*/
, scale
/*: number*/
)
/*: ControlPosition*/
{
  var isBody = offsetParent === offsetParent.ownerDocument.body;
  var offsetParentRect = isBody ? {
    left: 0,
    top: 0
  } : offsetParent.getBoundingClientRect();
  var x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
  var y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;
  return {
    x: x,
    y: y
  };
}

function createCSSTransform(controlPos
/*: ControlPosition*/
, positionOffset
/*: PositionOffsetControlPosition*/
)
/*: Object*/
{
  var translation = getTranslation(controlPos, positionOffset, 'px');
  return _defineProperty({}, (0, _getPrefix.browserPrefixToKey)('transform', _getPrefix.default), translation);
}

function createSVGTransform(controlPos
/*: ControlPosition*/
, positionOffset
/*: PositionOffsetControlPosition*/
)
/*: string*/
{
  var translation = getTranslation(controlPos, positionOffset, '');
  return translation;
}

function getTranslation(_ref2, positionOffset
/*: PositionOffsetControlPosition*/
, unitSuffix
/*: string*/
)
/*: string*/
{
  var x = _ref2.x,
      y = _ref2.y;
  var translation = "translate(".concat(x).concat(unitSuffix, ",").concat(y).concat(unitSuffix, ")");

  if (positionOffset) {
    var defaultX = "".concat(typeof positionOffset.x === 'string' ? positionOffset.x : positionOffset.x + unitSuffix);
    var defaultY = "".concat(typeof positionOffset.y === 'string' ? positionOffset.y : positionOffset.y + unitSuffix);
    translation = "translate(".concat(defaultX, ", ").concat(defaultY, ")") + translation;
  }

  return translation;
}

function getTouch(e
/*: MouseTouchEvent*/
, identifier
/*: number*/
)
/*: ?{clientX: number, clientY: number}*/
{
  return e.targetTouches && (0, _shims.findInArray)(e.targetTouches, function (t) {
    return identifier === t.identifier;
  }) || e.changedTouches && (0, _shims.findInArray)(e.changedTouches, function (t) {
    return identifier === t.identifier;
  });
}

function getTouchIdentifier(e
/*: MouseTouchEvent*/
)
/*: ?number*/
{
  if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
  if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
} // User-select Hacks:
//
// Useful for preventing blue highlights all over everything when dragging.
// Note we're passing `document` b/c we could be iframed


function addUserSelectStyles(doc
/*: ?Document*/
) {
  if (!doc) return;
  var styleEl = doc.getElementById('react-draggable-style-el');

  if (!styleEl) {
    styleEl = doc.createElement('style');
    styleEl.type = 'text/css';
    styleEl.id = 'react-draggable-style-el';
    styleEl.innerHTML = '.react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n';
    styleEl.innerHTML += '.react-draggable-transparent-selection *::selection {all: inherit;}\n';
    doc.getElementsByTagName('head')[0].appendChild(styleEl);
  }

  if (doc.body) addClassName(doc.body, 'react-draggable-transparent-selection');
}

function removeUserSelectStyles(doc
/*: ?Document*/
) {
  if (!doc) return;

  try {
    if (doc.body) removeClassName(doc.body, 'react-draggable-transparent-selection'); // $FlowIgnore: IE

    if (doc.selection) {
      // $FlowIgnore: IE
      doc.selection.empty();
    } else {
      // Remove selection caused by scroll, unless it's a focused input
      // (we use doc.defaultView in case we're in an iframe)
      var selection = (doc.defaultView || window).getSelection();

      if (selection && selection.type !== 'Caret') {
        selection.removeAllRanges();
      }
    }
  } catch (e) {// probably IE
  }
}

function addClassName(el
/*: HTMLElement*/
, className
/*: string*/
) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    if (!el.className.match(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)")))) {
      el.className += " ".concat(className);
    }
  }
}

function removeClassName(el
/*: HTMLElement*/
, className
/*: string*/
) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)"), 'g'), '');
  }
}

/***/ }),

/***/ "../node_modules/react-draggable/build/cjs/utils/getPrefix.js":
/*!********************************************************************!*\
  !*** ../node_modules/react-draggable/build/cjs/utils/getPrefix.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.browserPrefixToKey = browserPrefixToKey;
exports.browserPrefixToStyle = browserPrefixToStyle;
exports["default"] = void 0;
exports.getPrefix = getPrefix;
var prefixes = ['Moz', 'Webkit', 'O', 'ms'];

function getPrefix()
/*: string*/
{
  var _window$document, _window$document$docu;

  var prop
  /*: string*/
  = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'transform';
  // Ensure we're running in an environment where there is actually a global
  // `window` obj
  if (typeof window === 'undefined') return ''; // If we're in a pseudo-browser server-side environment, this access
  // path may not exist, so bail out if it doesn't.

  var style = (_window$document = window.document) === null || _window$document === void 0 ? void 0 : (_window$document$docu = _window$document.documentElement) === null || _window$document$docu === void 0 ? void 0 : _window$document$docu.style;
  if (!style) return '';
  if (prop in style) return '';

  for (var i = 0; i < prefixes.length; i++) {
    if (browserPrefixToKey(prop, prefixes[i]) in style) return prefixes[i];
  }

  return '';
}

function browserPrefixToKey(prop
/*: string*/
, prefix
/*: string*/
)
/*: string*/
{
  return prefix ? "".concat(prefix).concat(kebabToTitleCase(prop)) : prop;
}

function browserPrefixToStyle(prop
/*: string*/
, prefix
/*: string*/
)
/*: string*/
{
  return prefix ? "-".concat(prefix.toLowerCase(), "-").concat(prop) : prop;
}

function kebabToTitleCase(str
/*: string*/
)
/*: string*/
{
  var out = '';
  var shouldCapitalize = true;

  for (var i = 0; i < str.length; i++) {
    if (shouldCapitalize) {
      out += str[i].toUpperCase();
      shouldCapitalize = false;
    } else if (str[i] === '-') {
      shouldCapitalize = true;
    } else {
      out += str[i];
    }
  }

  return out;
} // Default export is the prefix itself, like 'Moz', 'Webkit', etc
// Note that you may have to re-test for certain things; for instance, Chrome 50
// can handle unprefixed `transform`, but not unprefixed `user-select`


var _default = (getPrefix()
/*: string*/
);

exports["default"] = _default;

/***/ }),

/***/ "../node_modules/react-draggable/build/cjs/utils/log.js":
/*!**************************************************************!*\
  !*** ../node_modules/react-draggable/build/cjs/utils/log.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = log;

/*eslint no-console:0*/
function log() {
  var _console;

  if (false) {}
}

/***/ }),

/***/ "../node_modules/react-draggable/build/cjs/utils/positionFns.js":
/*!**********************************************************************!*\
  !*** ../node_modules/react-draggable/build/cjs/utils/positionFns.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.canDragX = canDragX;
exports.canDragY = canDragY;
exports.createCoreData = createCoreData;
exports.createDraggableData = createDraggableData;
exports.getBoundPosition = getBoundPosition;
exports.getControlPosition = getControlPosition;
exports.snapToGrid = snapToGrid;

var _shims = __webpack_require__(/*! ./shims */ "../node_modules/react-draggable/build/cjs/utils/shims.js");

var _domFns = __webpack_require__(/*! ./domFns */ "../node_modules/react-draggable/build/cjs/utils/domFns.js");

function getBoundPosition(draggable
/*: Draggable*/
, x
/*: number*/
, y
/*: number*/
)
/*: [number, number]*/
{
  // If no bounds, short-circuit and move on
  if (!draggable.props.bounds) return [x, y]; // Clone new bounds

  var bounds = draggable.props.bounds;
  bounds = typeof bounds === 'string' ? bounds : cloneBounds(bounds);
  var node = findDOMNode(draggable);

  if (typeof bounds === 'string') {
    var ownerDocument = node.ownerDocument;
    var ownerWindow = ownerDocument.defaultView;
    var boundNode;

    if (bounds === 'parent') {
      boundNode = node.parentNode;
    } else {
      boundNode = ownerDocument.querySelector(bounds);
    }

    if (!(boundNode instanceof ownerWindow.HTMLElement)) {
      throw new Error('Bounds selector "' + bounds + '" could not find an element.');
    }

    var boundNodeEl
    /*: HTMLElement*/
    = boundNode; // for Flow, can't seem to refine correctly

    var nodeStyle = ownerWindow.getComputedStyle(node);
    var boundNodeStyle = ownerWindow.getComputedStyle(boundNodeEl); // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.

    bounds = {
      left: -node.offsetLeft + (0, _shims.int)(boundNodeStyle.paddingLeft) + (0, _shims.int)(nodeStyle.marginLeft),
      top: -node.offsetTop + (0, _shims.int)(boundNodeStyle.paddingTop) + (0, _shims.int)(nodeStyle.marginTop),
      right: (0, _domFns.innerWidth)(boundNodeEl) - (0, _domFns.outerWidth)(node) - node.offsetLeft + (0, _shims.int)(boundNodeStyle.paddingRight) - (0, _shims.int)(nodeStyle.marginRight),
      bottom: (0, _domFns.innerHeight)(boundNodeEl) - (0, _domFns.outerHeight)(node) - node.offsetTop + (0, _shims.int)(boundNodeStyle.paddingBottom) - (0, _shims.int)(nodeStyle.marginBottom)
    };
  } // Keep x and y below right and bottom limits...


  if ((0, _shims.isNum)(bounds.right)) x = Math.min(x, bounds.right);
  if ((0, _shims.isNum)(bounds.bottom)) y = Math.min(y, bounds.bottom); // But above left and top limits.

  if ((0, _shims.isNum)(bounds.left)) x = Math.max(x, bounds.left);
  if ((0, _shims.isNum)(bounds.top)) y = Math.max(y, bounds.top);
  return [x, y];
}

function snapToGrid(grid
/*: [number, number]*/
, pendingX
/*: number*/
, pendingY
/*: number*/
)
/*: [number, number]*/
{
  var x = Math.round(pendingX / grid[0]) * grid[0];
  var y = Math.round(pendingY / grid[1]) * grid[1];
  return [x, y];
}

function canDragX(draggable
/*: Draggable*/
)
/*: boolean*/
{
  return draggable.props.axis === 'both' || draggable.props.axis === 'x';
}

function canDragY(draggable
/*: Draggable*/
)
/*: boolean*/
{
  return draggable.props.axis === 'both' || draggable.props.axis === 'y';
} // Get {x, y} positions from event.


function getControlPosition(e
/*: MouseTouchEvent*/
, touchIdentifier
/*: ?number*/
, draggableCore
/*: DraggableCore*/
)
/*: ?ControlPosition*/
{
  var touchObj = typeof touchIdentifier === 'number' ? (0, _domFns.getTouch)(e, touchIdentifier) : null;
  if (typeof touchIdentifier === 'number' && !touchObj) return null; // not the right touch

  var node = findDOMNode(draggableCore); // User can provide an offsetParent if desired.

  var offsetParent = draggableCore.props.offsetParent || node.offsetParent || node.ownerDocument.body;
  return (0, _domFns.offsetXYFromParent)(touchObj || e, offsetParent, draggableCore.props.scale);
} // Create an data object exposed by <DraggableCore>'s events


function createCoreData(draggable
/*: DraggableCore*/
, x
/*: number*/
, y
/*: number*/
)
/*: DraggableData*/
{
  var state = draggable.state;
  var isStart = !(0, _shims.isNum)(state.lastX);
  var node = findDOMNode(draggable);

  if (isStart) {
    // If this is our first move, use the x and y as last coords.
    return {
      node: node,
      deltaX: 0,
      deltaY: 0,
      lastX: x,
      lastY: y,
      x: x,
      y: y
    };
  } else {
    // Otherwise calculate proper values.
    return {
      node: node,
      deltaX: x - state.lastX,
      deltaY: y - state.lastY,
      lastX: state.lastX,
      lastY: state.lastY,
      x: x,
      y: y
    };
  }
} // Create an data exposed by <Draggable>'s events


function createDraggableData(draggable
/*: Draggable*/
, coreData
/*: DraggableData*/
)
/*: DraggableData*/
{
  var scale = draggable.props.scale;
  return {
    node: coreData.node,
    x: draggable.state.x + coreData.deltaX / scale,
    y: draggable.state.y + coreData.deltaY / scale,
    deltaX: coreData.deltaX / scale,
    deltaY: coreData.deltaY / scale,
    lastX: draggable.state.x,
    lastY: draggable.state.y
  };
} // A lot faster than stringify/parse


function cloneBounds(bounds
/*: Bounds*/
)
/*: Bounds*/
{
  return {
    left: bounds.left,
    top: bounds.top,
    right: bounds.right,
    bottom: bounds.bottom
  };
}

function findDOMNode(draggable
/*: Draggable | DraggableCore*/
)
/*: HTMLElement*/
{
  var node = draggable.findDOMNode();

  if (!node) {
    throw new Error('<DraggableCore>: Unmounted during event!');
  } // $FlowIgnore we can't assert on HTMLElement due to tests... FIXME


  return node;
}

/***/ }),

/***/ "../node_modules/react-draggable/build/cjs/utils/shims.js":
/*!****************************************************************!*\
  !*** ../node_modules/react-draggable/build/cjs/utils/shims.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.dontSetMe = dontSetMe;
exports.findInArray = findInArray;
exports.int = int;
exports.isFunction = isFunction;
exports.isNum = isNum;

// @credits https://gist.github.com/rogozhnikoff/a43cfed27c41e4e68cdc
function findInArray(array
/*: Array<any> | TouchList*/
, callback
/*: Function*/
)
/*: any*/
{
  for (var i = 0, length = array.length; i < length; i++) {
    if (callback.apply(callback, [array[i], i, array])) return array[i];
  }
}

function isFunction(func
/*: any*/
)
/*: boolean %checks*/
{
  // $FlowIgnore[method-unbinding]
  return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
}

function isNum(num
/*: any*/
)
/*: boolean %checks*/
{
  return typeof num === 'number' && !isNaN(num);
}

function int(a
/*: string*/
)
/*: number*/
{
  return parseInt(a, 10);
}

function dontSetMe(props
/*: Object*/
, propName
/*: string*/
, componentName
/*: string*/
)
/*: ?Error*/
{
  if (props[propName]) {
    return new Error("Invalid prop ".concat(propName, " passed to ").concat(componentName, " - do not set this, set it on the child."));
  }
}

/***/ }),

/***/ "../node_modules/shallowequal/index.js":
/*!*********************************************!*\
  !*** ../node_modules/shallowequal/index.js ***!
  \*********************************************/
/***/ ((module) => {

//

module.exports = function shallowEqual(objA, objB, compare, compareContext) {
  var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

  if (ret !== void 0) {
    return !!ret;
  }

  if (objA === objB) {
    return true;
  }

  if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  // Test for A's keys different from B.
  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx];

    if (!bHasOwnProperty(key)) {
      return false;
    }

    var valueA = objA[key];
    var valueB = objB[key];

    ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

    if (ret === false || (ret === void 0 && valueA !== valueB)) {
      return false;
    }
  }

  return true;
};


/***/ }),

/***/ "../node_modules/styled-components/dist/styled-components.browser.esm.js":
/*!*******************************************************************************!*\
  !*** ../node_modules/styled-components/dist/styled-components.browser.esm.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServerStyleSheet: () => (/* binding */ vt),
/* harmony export */   StyleSheetConsumer: () => (/* binding */ Be),
/* harmony export */   StyleSheetContext: () => (/* binding */ $e),
/* harmony export */   StyleSheetManager: () => (/* binding */ Ye),
/* harmony export */   ThemeConsumer: () => (/* binding */ tt),
/* harmony export */   ThemeContext: () => (/* binding */ et),
/* harmony export */   ThemeProvider: () => (/* binding */ ot),
/* harmony export */   __PRIVATE__: () => (/* binding */ gt),
/* harmony export */   createGlobalStyle: () => (/* binding */ ft),
/* harmony export */   css: () => (/* binding */ lt),
/* harmony export */   "default": () => (/* binding */ dt),
/* harmony export */   isStyledComponent: () => (/* binding */ se),
/* harmony export */   keyframes: () => (/* binding */ mt),
/* harmony export */   styled: () => (/* binding */ dt),
/* harmony export */   useTheme: () => (/* binding */ nt),
/* harmony export */   version: () => (/* binding */ v),
/* harmony export */   withTheme: () => (/* binding */ yt)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tslib */ "../node_modules/styled-components/node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _emotion_is_prop_valid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/is-prop-valid */ "../node_modules/styled-components/node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var shallowequal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! shallowequal */ "../node_modules/shallowequal/index.js");
/* harmony import */ var shallowequal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(shallowequal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! stylis */ "../node_modules/stylis/src/Enum.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! stylis */ "../node_modules/stylis/src/Middleware.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! stylis */ "../node_modules/stylis/src/Serializer.js");
/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! stylis */ "../node_modules/stylis/src/Parser.js");
/* harmony import */ var _emotion_unitless__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/unitless */ "../node_modules/styled-components/node_modules/@emotion/unitless/dist/emotion-unitless.esm.js");
var f="undefined"!=typeof process&&void 0!==process.env&&(process.env.REACT_APP_SC_ATTR||process.env.SC_ATTR)||"data-styled",m="active",y="data-styled-version",v="6.1.13",g="/*!sc*/\n",S="undefined"!=typeof window&&"HTMLElement"in window,w=Boolean("boolean"==typeof SC_DISABLE_SPEEDY?SC_DISABLE_SPEEDY:"undefined"!=typeof process&&void 0!==process.env&&void 0!==process.env.REACT_APP_SC_DISABLE_SPEEDY&&""!==process.env.REACT_APP_SC_DISABLE_SPEEDY?"false"!==process.env.REACT_APP_SC_DISABLE_SPEEDY&&process.env.REACT_APP_SC_DISABLE_SPEEDY:"undefined"!=typeof process&&void 0!==process.env&&void 0!==process.env.SC_DISABLE_SPEEDY&&""!==process.env.SC_DISABLE_SPEEDY?"false"!==process.env.SC_DISABLE_SPEEDY&&process.env.SC_DISABLE_SPEEDY:"production"!=="development"),b={},E=/invalid hook call/i,N=new Set,P=function(t,n){if(true){var o=n?' with the id of "'.concat(n,'"'):"",s="The component ".concat(t).concat(o," has been created dynamically.\n")+"You may see this warning because you've called styled inside another component.\nTo resolve this only create new StyledComponents outside of any render method and function component.",i=console.error;try{var a=!0;console.error=function(t){for(var n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o];E.test(t)?(a=!1,N.delete(s)):i.apply(void 0,(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__spreadArray)([t],n,!1))},(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(),a&&!N.has(s)&&(console.warn(s),N.add(s))}catch(e){E.test(e.message)&&N.delete(s)}finally{console.error=i}}},_=Object.freeze([]),C=Object.freeze({});function I(e,t,n){return void 0===n&&(n=C),e.theme!==n.theme&&e.theme||t||n.theme}var A=new Set(["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","track","u","ul","use","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"]),O=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,D=/(^-|-$)/g;function R(e){return e.replace(O,"-").replace(D,"")}var T=/(a)(d)/gi,k=52,j=function(e){return String.fromCharCode(e+(e>25?39:97))};function x(e){var t,n="";for(t=Math.abs(e);t>k;t=t/k|0)n=j(t%k)+n;return(j(t%k)+n).replace(T,"$1-$2")}var V,F=5381,M=function(e,t){for(var n=t.length;n;)e=33*e^t.charCodeAt(--n);return e},z=function(e){return M(F,e)};function $(e){return x(z(e)>>>0)}function B(e){return true&&"string"==typeof e&&e||e.displayName||e.name||"Component"}function L(e){return"string"==typeof e&&( false||e.charAt(0)===e.charAt(0).toLowerCase())}var G="function"==typeof Symbol&&Symbol.for,Y=G?Symbol.for("react.memo"):60115,W=G?Symbol.for("react.forward_ref"):60112,q={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},H={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},U={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},J=((V={})[W]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},V[Y]=U,V);function X(e){return("type"in(t=e)&&t.type.$$typeof)===Y?U:"$$typeof"in e?J[e.$$typeof]:q;var t}var Z=Object.defineProperty,K=Object.getOwnPropertyNames,Q=Object.getOwnPropertySymbols,ee=Object.getOwnPropertyDescriptor,te=Object.getPrototypeOf,ne=Object.prototype;function oe(e,t,n){if("string"!=typeof t){if(ne){var o=te(t);o&&o!==ne&&oe(e,o,n)}var r=K(t);Q&&(r=r.concat(Q(t)));for(var s=X(e),i=X(t),a=0;a<r.length;++a){var c=r[a];if(!(c in H||n&&n[c]||i&&c in i||s&&c in s)){var l=ee(t,c);try{Z(e,c,l)}catch(e){}}}}return e}function re(e){return"function"==typeof e}function se(e){return"object"==typeof e&&"styledComponentId"in e}function ie(e,t){return e&&t?"".concat(e," ").concat(t):e||t||""}function ae(e,t){if(0===e.length)return"";for(var n=e[0],o=1;o<e.length;o++)n+=t?t+e[o]:e[o];return n}function ce(e){return null!==e&&"object"==typeof e&&e.constructor.name===Object.name&&!("props"in e&&e.$$typeof)}function le(e,t,n){if(void 0===n&&(n=!1),!n&&!ce(e)&&!Array.isArray(e))return t;if(Array.isArray(t))for(var o=0;o<t.length;o++)e[o]=le(e[o],t[o]);else if(ce(t))for(var o in t)e[o]=le(e[o],t[o]);return e}function ue(e,t){Object.defineProperty(e,"toString",{value:t})}var pe= true?{1:"Cannot create styled-component for component: %s.\n\n",2:"Can't collect styles once you've consumed a `ServerStyleSheet`'s styles! `ServerStyleSheet` is a one off instance for each server-side render cycle.\n\n- Are you trying to reuse it across renders?\n- Are you accidentally calling collectStyles twice?\n\n",3:"Streaming SSR is only supported in a Node.js environment; Please do not try to call this method in the browser.\n\n",4:"The `StyleSheetManager` expects a valid target or sheet prop!\n\n- Does this error occur on the client and is your target falsy?\n- Does this error occur on the server and is the sheet falsy?\n\n",5:"The clone method cannot be used on the client!\n\n- Are you running in a client-like environment on the server?\n- Are you trying to run SSR on the client?\n\n",6:"Trying to insert a new style tag, but the given Node is unmounted!\n\n- Are you using a custom target that isn't mounted?\n- Does your document not have a valid head element?\n- Have you accidentally removed a style tag manually?\n\n",7:'ThemeProvider: Please return an object from your "theme" prop function, e.g.\n\n```js\ntheme={() => ({})}\n```\n\n',8:'ThemeProvider: Please make your "theme" prop an object.\n\n',9:"Missing document `<head>`\n\n",10:"Cannot find a StyleSheet instance. Usually this happens if there are multiple copies of styled-components loaded at once. Check out this issue for how to troubleshoot and fix the common cases where this situation can happen: https://github.com/styled-components/styled-components/issues/1941#issuecomment-417862021\n\n",11:"_This error was replaced with a dev-time warning, it will be deleted for v4 final._ [createGlobalStyle] received children which will not be rendered. Please use the component without passing children elements.\n\n",12:"It seems you are interpolating a keyframe declaration (%s) into an untagged string. This was supported in styled-components v3, but is not longer supported in v4 as keyframes are now injected on-demand. Please wrap your string in the css\\`\\` helper which ensures the styles are injected correctly. See https://www.styled-components.com/docs/api#css\n\n",13:"%s is not a styled component and cannot be referred to via component selector. See https://www.styled-components.com/docs/advanced#referring-to-other-components for more details.\n\n",14:'ThemeProvider: "theme" prop is required.\n\n',15:"A stylis plugin has been supplied that is not named. We need a name for each plugin to be able to prevent styling collisions between different stylis configurations within the same app. Before you pass your plugin to `<StyleSheetManager stylisPlugins={[]}>`, please make sure each plugin is uniquely-named, e.g.\n\n```js\nObject.defineProperty(importedPlugin, 'name', { value: 'some-unique-name' });\n```\n\n",16:"Reached the limit of how many styled components may be created at group %s.\nYou may only create up to 1,073,741,824 components. If you're creating components dynamically,\nas for instance in your render method then you may be running into this limitation.\n\n",17:"CSSStyleSheet could not be found on HTMLStyleElement.\nHas styled-components' style tag been unmounted or altered by another script?\n",18:"ThemeProvider: Please make sure your useTheme hook is within a `<ThemeProvider>`"}:0;function de(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var n=e[0],o=[],r=1,s=e.length;r<s;r+=1)o.push(e[r]);return o.forEach(function(e){n=n.replace(/%[a-z]/,e)}),n}function he(t){for(var n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o];return false?0:new Error(de.apply(void 0,(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__spreadArray)([pe[t]],n,!1)).trim())}var fe=function(){function e(e){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=e}return e.prototype.indexOfGroup=function(e){for(var t=0,n=0;n<e;n++)t+=this.groupSizes[n];return t},e.prototype.insertRules=function(e,t){if(e>=this.groupSizes.length){for(var n=this.groupSizes,o=n.length,r=o;e>=r;)if((r<<=1)<0)throw he(16,"".concat(e));this.groupSizes=new Uint32Array(r),this.groupSizes.set(n),this.length=r;for(var s=o;s<r;s++)this.groupSizes[s]=0}for(var i=this.indexOfGroup(e+1),a=(s=0,t.length);s<a;s++)this.tag.insertRule(i,t[s])&&(this.groupSizes[e]++,i++)},e.prototype.clearGroup=function(e){if(e<this.length){var t=this.groupSizes[e],n=this.indexOfGroup(e),o=n+t;this.groupSizes[e]=0;for(var r=n;r<o;r++)this.tag.deleteRule(n)}},e.prototype.getGroup=function(e){var t="";if(e>=this.length||0===this.groupSizes[e])return t;for(var n=this.groupSizes[e],o=this.indexOfGroup(e),r=o+n,s=o;s<r;s++)t+="".concat(this.tag.getRule(s)).concat(g);return t},e}(),me=1<<30,ye=new Map,ve=new Map,ge=1,Se=function(e){if(ye.has(e))return ye.get(e);for(;ve.has(ge);)ge++;var t=ge++;if( true&&((0|t)<0||t>me))throw he(16,"".concat(t));return ye.set(e,t),ve.set(t,e),t},we=function(e,t){ge=t+1,ye.set(e,t),ve.set(t,e)},be="style[".concat(f,"][").concat(y,'="').concat(v,'"]'),Ee=new RegExp("^".concat(f,'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')),Ne=function(e,t,n){for(var o,r=n.split(","),s=0,i=r.length;s<i;s++)(o=r[s])&&e.registerName(t,o)},Pe=function(e,t){for(var n,o=(null!==(n=t.textContent)&&void 0!==n?n:"").split(g),r=[],s=0,i=o.length;s<i;s++){var a=o[s].trim();if(a){var c=a.match(Ee);if(c){var l=0|parseInt(c[1],10),u=c[2];0!==l&&(we(u,l),Ne(e,u,c[3]),e.getTag().insertRules(l,r)),r.length=0}else r.push(a)}}},_e=function(e){for(var t=document.querySelectorAll(be),n=0,o=t.length;n<o;n++){var r=t[n];r&&r.getAttribute(f)!==m&&(Pe(e,r),r.parentNode&&r.parentNode.removeChild(r))}};function Ce(){return true?__webpack_require__.nc:0}var Ie=function(e){var t=document.head,n=e||t,o=document.createElement("style"),r=function(e){var t=Array.from(e.querySelectorAll("style[".concat(f,"]")));return t[t.length-1]}(n),s=void 0!==r?r.nextSibling:null;o.setAttribute(f,m),o.setAttribute(y,v);var i=Ce();return i&&o.setAttribute("nonce",i),n.insertBefore(o,s),o},Ae=function(){function e(e){this.element=Ie(e),this.element.appendChild(document.createTextNode("")),this.sheet=function(e){if(e.sheet)return e.sheet;for(var t=document.styleSheets,n=0,o=t.length;n<o;n++){var r=t[n];if(r.ownerNode===e)return r}throw he(17)}(this.element),this.length=0}return e.prototype.insertRule=function(e,t){try{return this.sheet.insertRule(t,e),this.length++,!0}catch(e){return!1}},e.prototype.deleteRule=function(e){this.sheet.deleteRule(e),this.length--},e.prototype.getRule=function(e){var t=this.sheet.cssRules[e];return t&&t.cssText?t.cssText:""},e}(),Oe=function(){function e(e){this.element=Ie(e),this.nodes=this.element.childNodes,this.length=0}return e.prototype.insertRule=function(e,t){if(e<=this.length&&e>=0){var n=document.createTextNode(t);return this.element.insertBefore(n,this.nodes[e]||null),this.length++,!0}return!1},e.prototype.deleteRule=function(e){this.element.removeChild(this.nodes[e]),this.length--},e.prototype.getRule=function(e){return e<this.length?this.nodes[e].textContent:""},e}(),De=function(){function e(e){this.rules=[],this.length=0}return e.prototype.insertRule=function(e,t){return e<=this.length&&(this.rules.splice(e,0,t),this.length++,!0)},e.prototype.deleteRule=function(e){this.rules.splice(e,1),this.length--},e.prototype.getRule=function(e){return e<this.length?this.rules[e]:""},e}(),Re=S,Te={isServer:!S,useCSSOMInjection:!w},ke=function(){function e(e,n,o){void 0===e&&(e=C),void 0===n&&(n={});var r=this;this.options=(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)({},Te),e),this.gs=n,this.names=new Map(o),this.server=!!e.isServer,!this.server&&S&&Re&&(Re=!1,_e(this)),ue(this,function(){return function(e){for(var t=e.getTag(),n=t.length,o="",r=function(n){var r=function(e){return ve.get(e)}(n);if(void 0===r)return"continue";var s=e.names.get(r),i=t.getGroup(n);if(void 0===s||!s.size||0===i.length)return"continue";var a="".concat(f,".g").concat(n,'[id="').concat(r,'"]'),c="";void 0!==s&&s.forEach(function(e){e.length>0&&(c+="".concat(e,","))}),o+="".concat(i).concat(a,'{content:"').concat(c,'"}').concat(g)},s=0;s<n;s++)r(s);return o}(r)})}return e.registerId=function(e){return Se(e)},e.prototype.rehydrate=function(){!this.server&&S&&_e(this)},e.prototype.reconstructWithOptions=function(n,o){return void 0===o&&(o=!0),new e((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)({},this.options),n),this.gs,o&&this.names||void 0)},e.prototype.allocateGSInstance=function(e){return this.gs[e]=(this.gs[e]||0)+1},e.prototype.getTag=function(){return this.tag||(this.tag=(e=function(e){var t=e.useCSSOMInjection,n=e.target;return e.isServer?new De(n):t?new Ae(n):new Oe(n)}(this.options),new fe(e)));var e},e.prototype.hasNameForId=function(e,t){return this.names.has(e)&&this.names.get(e).has(t)},e.prototype.registerName=function(e,t){if(Se(e),this.names.has(e))this.names.get(e).add(t);else{var n=new Set;n.add(t),this.names.set(e,n)}},e.prototype.insertRules=function(e,t,n){this.registerName(e,t),this.getTag().insertRules(Se(e),n)},e.prototype.clearNames=function(e){this.names.has(e)&&this.names.get(e).clear()},e.prototype.clearRules=function(e){this.getTag().clearGroup(Se(e)),this.clearNames(e)},e.prototype.clearTag=function(){this.tag=void 0},e}(),je=/&/g,xe=/^\s*\/\/.*$/gm;function Ve(e,t){return e.map(function(e){return"rule"===e.type&&(e.value="".concat(t," ").concat(e.value),e.value=e.value.replaceAll(",",",".concat(t," ")),e.props=e.props.map(function(e){return"".concat(t," ").concat(e)})),Array.isArray(e.children)&&"@keyframes"!==e.type&&(e.children=Ve(e.children,t)),e})}function Fe(e){var t,n,o,r=void 0===e?C:e,s=r.options,i=void 0===s?C:s,a=r.plugins,c=void 0===a?_:a,l=function(e,o,r){return r.startsWith(n)&&r.endsWith(n)&&r.replaceAll(n,"").length>0?".".concat(t):e},u=c.slice();u.push(function(e){e.type===stylis__WEBPACK_IMPORTED_MODULE_5__.RULESET&&e.value.includes("&")&&(e.props[0]=e.props[0].replace(je,n).replace(o,l))}),i.prefix&&u.push(stylis__WEBPACK_IMPORTED_MODULE_6__.prefixer),u.push(stylis__WEBPACK_IMPORTED_MODULE_7__.stringify);var p=function(e,r,s,a){void 0===r&&(r=""),void 0===s&&(s=""),void 0===a&&(a="&"),t=a,n=r,o=new RegExp("\\".concat(n,"\\b"),"g");var c=e.replace(xe,""),l=stylis__WEBPACK_IMPORTED_MODULE_8__.compile(s||r?"".concat(s," ").concat(r," { ").concat(c," }"):c);i.namespace&&(l=Ve(l,i.namespace));var p=[];return stylis__WEBPACK_IMPORTED_MODULE_7__.serialize(l,stylis__WEBPACK_IMPORTED_MODULE_6__.middleware(u.concat(stylis__WEBPACK_IMPORTED_MODULE_6__.rulesheet(function(e){return p.push(e)})))),p};return p.hash=c.length?c.reduce(function(e,t){return t.name||he(15),M(e,t.name)},F).toString():"",p}var Me=new ke,ze=Fe(),$e=react__WEBPACK_IMPORTED_MODULE_1___default().createContext({shouldForwardProp:void 0,styleSheet:Me,stylis:ze}),Be=$e.Consumer,Le=react__WEBPACK_IMPORTED_MODULE_1___default().createContext(void 0);function Ge(){return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)($e)}function Ye(e){var t=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(e.stylisPlugins),n=t[0],r=t[1],c=Ge().styleSheet,l=(0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function(){var t=c;return e.sheet?t=e.sheet:e.target&&(t=t.reconstructWithOptions({target:e.target},!1)),e.disableCSSOMInjection&&(t=t.reconstructWithOptions({useCSSOMInjection:!1})),t},[e.disableCSSOMInjection,e.sheet,e.target,c]),u=(0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function(){return Fe({options:{namespace:e.namespace,prefix:e.enableVendorPrefixes},plugins:n})},[e.enableVendorPrefixes,e.namespace,n]);(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function(){shallowequal__WEBPACK_IMPORTED_MODULE_2___default()(n,e.stylisPlugins)||r(e.stylisPlugins)},[e.stylisPlugins]);var d=(0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function(){return{shouldForwardProp:e.shouldForwardProp,styleSheet:l,stylis:u}},[e.shouldForwardProp,l,u]);return react__WEBPACK_IMPORTED_MODULE_1___default().createElement($e.Provider,{value:d},react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Le.Provider,{value:u},e.children))}var We=function(){function e(e,t){var n=this;this.inject=function(e,t){void 0===t&&(t=ze);var o=n.name+t.hash;e.hasNameForId(n.id,o)||e.insertRules(n.id,o,t(n.rules,o,"@keyframes"))},this.name=e,this.id="sc-keyframes-".concat(e),this.rules=t,ue(this,function(){throw he(12,String(n.name))})}return e.prototype.getName=function(e){return void 0===e&&(e=ze),this.name+e.hash},e}(),qe=function(e){return e>="A"&&e<="Z"};function He(e){for(var t="",n=0;n<e.length;n++){var o=e[n];if(1===n&&"-"===o&&"-"===e[0])return e;qe(o)?t+="-"+o.toLowerCase():t+=o}return t.startsWith("ms-")?"-"+t:t}var Ue=function(e){return null==e||!1===e||""===e},Je=function(t){var n,o,r=[];for(var s in t){var i=t[s];t.hasOwnProperty(s)&&!Ue(i)&&(Array.isArray(i)&&i.isCss||re(i)?r.push("".concat(He(s),":"),i,";"):ce(i)?r.push.apply(r,(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__spreadArray)(["".concat(s," {")],Je(i),!1),["}"],!1)):r.push("".concat(He(s),": ").concat((n=s,null==(o=i)||"boolean"==typeof o||""===o?"":"number"!=typeof o||0===o||n in _emotion_unitless__WEBPACK_IMPORTED_MODULE_3__["default"]||n.startsWith("--")?String(o).trim():"".concat(o,"px")),";")))}return r};function Xe(e,t,n,o){if(Ue(e))return[];if(se(e))return[".".concat(e.styledComponentId)];if(re(e)){if(!re(s=e)||s.prototype&&s.prototype.isReactComponent||!t)return[e];var r=e(t);return false||"object"!=typeof r||Array.isArray(r)||r instanceof We||ce(r)||null===r||console.error("".concat(B(e)," is not a styled component and cannot be referred to via component selector. See https://www.styled-components.com/docs/advanced#referring-to-other-components for more details.")),Xe(r,t,n,o)}var s;return e instanceof We?n?(e.inject(n,o),[e.getName(o)]):[e]:ce(e)?Je(e):Array.isArray(e)?Array.prototype.concat.apply(_,e.map(function(e){return Xe(e,t,n,o)})):[e.toString()]}function Ze(e){for(var t=0;t<e.length;t+=1){var n=e[t];if(re(n)&&!se(n))return!1}return!0}var Ke=z(v),Qe=function(){function e(e,t,n){this.rules=e,this.staticRulesId="",this.isStatic= false&&0,this.componentId=t,this.baseHash=M(Ke,t),this.baseStyle=n,ke.registerId(t)}return e.prototype.generateAndInjectStyles=function(e,t,n){var o=this.baseStyle?this.baseStyle.generateAndInjectStyles(e,t,n):"";if(this.isStatic&&!n.hash)if(this.staticRulesId&&t.hasNameForId(this.componentId,this.staticRulesId))o=ie(o,this.staticRulesId);else{var r=ae(Xe(this.rules,e,t,n)),s=x(M(this.baseHash,r)>>>0);if(!t.hasNameForId(this.componentId,s)){var i=n(r,".".concat(s),void 0,this.componentId);t.insertRules(this.componentId,s,i)}o=ie(o,s),this.staticRulesId=s}else{for(var a=M(this.baseHash,n.hash),c="",l=0;l<this.rules.length;l++){var u=this.rules[l];if("string"==typeof u)c+=u, true&&(a=M(a,u));else if(u){var p=ae(Xe(u,e,t,n));a=M(a,p+l),c+=p}}if(c){var d=x(a>>>0);t.hasNameForId(this.componentId,d)||t.insertRules(this.componentId,d,n(c,".".concat(d),void 0,this.componentId)),o=ie(o,d)}}return o},e}(),et=react__WEBPACK_IMPORTED_MODULE_1___default().createContext(void 0),tt=et.Consumer;function nt(){var e=(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(et);if(!e)throw he(18);return e}function ot(e){var n=react__WEBPACK_IMPORTED_MODULE_1___default().useContext(et),r=(0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function(){return function(e,n){if(!e)throw he(14);if(re(e)){var o=e(n);if( true&&(null===o||Array.isArray(o)||"object"!=typeof o))throw he(7);return o}if(Array.isArray(e)||"object"!=typeof e)throw he(8);return n?(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)({},n),e):e}(e.theme,n)},[e.theme,n]);return e.children?react__WEBPACK_IMPORTED_MODULE_1___default().createElement(et.Provider,{value:r},e.children):null}var rt={},st=new Set;function it(e,r,s){var i=se(e),a=e,c=!L(e),p=r.attrs,d=void 0===p?_:p,h=r.componentId,f=void 0===h?function(e,t){var n="string"!=typeof e?"sc":R(e);rt[n]=(rt[n]||0)+1;var o="".concat(n,"-").concat($(v+n+rt[n]));return t?"".concat(t,"-").concat(o):o}(r.displayName,r.parentComponentId):h,m=r.displayName,y=void 0===m?function(e){return L(e)?"styled.".concat(e):"Styled(".concat(B(e),")")}(e):m,g=r.displayName&&r.componentId?"".concat(R(r.displayName),"-").concat(r.componentId):r.componentId||f,S=i&&a.attrs?a.attrs.concat(d).filter(Boolean):d,w=r.shouldForwardProp;if(i&&a.shouldForwardProp){var b=a.shouldForwardProp;if(r.shouldForwardProp){var E=r.shouldForwardProp;w=function(e,t){return b(e,t)&&E(e,t)}}else w=b}var N=new Qe(s,g,i?a.componentStyle:void 0);function O(e,r){return function(e,r,s){var i=e.attrs,a=e.componentStyle,c=e.defaultProps,p=e.foldedComponentIds,d=e.styledComponentId,h=e.target,f=react__WEBPACK_IMPORTED_MODULE_1___default().useContext(et),m=Ge(),y=e.shouldForwardProp||m.shouldForwardProp; true&&(0,react__WEBPACK_IMPORTED_MODULE_1__.useDebugValue)(d);var v=I(r,f,c)||C,g=function(e,n,o){for(var r,s=(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)({},n),{className:void 0,theme:o}),i=0;i<e.length;i+=1){var a=re(r=e[i])?r(s):r;for(var c in a)s[c]="className"===c?ie(s[c],a[c]):"style"===c?(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)({},s[c]),a[c]):a[c]}return n.className&&(s.className=ie(s.className,n.className)),s}(i,r,v),S=g.as||h,w={};for(var b in g)void 0===g[b]||"$"===b[0]||"as"===b||"theme"===b&&g.theme===v||("forwardedAs"===b?w.as=g.forwardedAs:y&&!y(b,S)||(w[b]=g[b],y||"development"!=="development"||(0,_emotion_is_prop_valid__WEBPACK_IMPORTED_MODULE_0__["default"])(b)||st.has(b)||!A.has(S)||(st.add(b),console.warn('styled-components: it looks like an unknown prop "'.concat(b,'" is being sent through to the DOM, which will likely trigger a React console error. If you would like automatic filtering of unknown props, you can opt-into that behavior via `<StyleSheetManager shouldForwardProp={...}>` (connect an API like `@emotion/is-prop-valid`) or consider using transient props (`$` prefix for automatic filtering.)')))));var E=function(e,t){var n=Ge(),o=e.generateAndInjectStyles(t,n.styleSheet,n.stylis);return true&&(0,react__WEBPACK_IMPORTED_MODULE_1__.useDebugValue)(o),o}(a,g); true&&e.warnTooManyClasses&&e.warnTooManyClasses(E);var N=ie(p,d);return E&&(N+=" "+E),g.className&&(N+=" "+g.className),w[L(S)&&!A.has(S)?"class":"className"]=N,w.ref=s,(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(S,w)}(D,e,r)}O.displayName=y;var D=react__WEBPACK_IMPORTED_MODULE_1___default().forwardRef(O);return D.attrs=S,D.componentStyle=N,D.displayName=y,D.shouldForwardProp=w,D.foldedComponentIds=i?ie(a.foldedComponentIds,a.styledComponentId):"",D.styledComponentId=g,D.target=i?a.target:e,Object.defineProperty(D,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(e){this._foldedDefaultProps=i?function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];for(var o=0,r=t;o<r.length;o++)le(e,r[o],!0);return e}({},a.defaultProps,e):e}}), true&&(P(y,g),D.warnTooManyClasses=function(e,t){var n={},o=!1;return function(r){if(!o&&(n[r]=!0,Object.keys(n).length>=200)){var s=t?' with the id of "'.concat(t,'"'):"";console.warn("Over ".concat(200," classes were generated for component ").concat(e).concat(s,".\n")+"Consider using the attrs method, together with a style object for frequently changed styles.\nExample:\n  const Component = styled.div.attrs(props => ({\n    style: {\n      background: props.background,\n    },\n  }))`width: 100%;`\n\n  <Component />"),o=!0,n={}}}}(y,g)),ue(D,function(){return".".concat(D.styledComponentId)}),c&&oe(D,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),D}function at(e,t){for(var n=[e[0]],o=0,r=t.length;o<r;o+=1)n.push(t[o],e[o+1]);return n}var ct=function(e){return Object.assign(e,{isCss:!0})};function lt(t){for(var n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o];if(re(t)||ce(t))return ct(Xe(at(_,(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__spreadArray)([t],n,!0))));var r=t;return 0===n.length&&1===r.length&&"string"==typeof r[0]?Xe(r):ct(Xe(at(r,n)))}function ut(n,o,r){if(void 0===r&&(r=C),!o)throw he(1,o);var s=function(t){for(var s=[],i=1;i<arguments.length;i++)s[i-1]=arguments[i];return n(o,r,lt.apply(void 0,(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__spreadArray)([t],s,!1)))};return s.attrs=function(e){return ut(n,o,(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)({},r),{attrs:Array.prototype.concat(r.attrs,e).filter(Boolean)}))},s.withConfig=function(e){return ut(n,o,(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)({},r),e))},s}var pt=function(e){return ut(it,e)},dt=pt;A.forEach(function(e){dt[e]=pt(e)});var ht=function(){function e(e,t){this.rules=e,this.componentId=t,this.isStatic=Ze(e),ke.registerId(this.componentId+1)}return e.prototype.createStyles=function(e,t,n,o){var r=o(ae(Xe(this.rules,t,n,o)),""),s=this.componentId+e;n.insertRules(s,s,r)},e.prototype.removeStyles=function(e,t){t.clearRules(this.componentId+e)},e.prototype.renderStyles=function(e,t,n,o){e>2&&ke.registerId(this.componentId+e),this.removeStyles(e,n),this.createStyles(e,t,n,o)},e}();function ft(n){for(var r=[],s=1;s<arguments.length;s++)r[s-1]=arguments[s];var i=lt.apply(void 0,(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__spreadArray)([n],r,!1)),a="sc-global-".concat($(JSON.stringify(i))),c=new ht(i,a); true&&P(a);var l=function(e){var t=Ge(),n=react__WEBPACK_IMPORTED_MODULE_1___default().useContext(et),r=react__WEBPACK_IMPORTED_MODULE_1___default().useRef(t.styleSheet.allocateGSInstance(a)).current;return true&&react__WEBPACK_IMPORTED_MODULE_1___default().Children.count(e.children)&&console.warn("The global style component ".concat(a," was given child JSX. createGlobalStyle does not render children.")), true&&i.some(function(e){return"string"==typeof e&&-1!==e.indexOf("@import")})&&console.warn("Please do not use @import CSS syntax in createGlobalStyle at this time, as the CSSOM APIs we use in production do not handle it well. Instead, we recommend using a library such as react-helmet to inject a typical <link> meta tag to the stylesheet, or simply embedding it manually in your index.html <head> section for a simpler app."),t.styleSheet.server&&u(r,e,t.styleSheet,n,t.stylis),react__WEBPACK_IMPORTED_MODULE_1___default().useLayoutEffect(function(){if(!t.styleSheet.server)return u(r,e,t.styleSheet,n,t.stylis),function(){return c.removeStyles(r,t.styleSheet)}},[r,e,t.styleSheet,n,t.stylis]),null};function u(e,n,o,r,s){if(c.isStatic)c.renderStyles(e,b,o,s);else{var i=(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)({},n),{theme:I(n,r,l.defaultProps)});c.renderStyles(e,i,o,s)}}return react__WEBPACK_IMPORTED_MODULE_1___default().memo(l)}function mt(t){for(var n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o]; true&&"undefined"!=typeof navigator&&"ReactNative"===navigator.product&&console.warn("`keyframes` cannot be used on ReactNative, only on the web. To do animation in ReactNative please use Animated.");var r=ae(lt.apply(void 0,(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__spreadArray)([t],n,!1))),s=$(r);return new We(s,r)}function yt(e){var n=react__WEBPACK_IMPORTED_MODULE_1___default().forwardRef(function(n,r){var s=I(n,react__WEBPACK_IMPORTED_MODULE_1___default().useContext(et),e.defaultProps);return true&&void 0===s&&console.warn('[withTheme] You are not using a ThemeProvider nor passing a theme prop or a theme in defaultProps in component class "'.concat(B(e),'"')),react__WEBPACK_IMPORTED_MODULE_1___default().createElement(e,(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)({},n,{theme:s,ref:r}))});return n.displayName="WithTheme(".concat(B(e),")"),oe(n,e)}var vt=function(){function e(){var e=this;this._emitSheetCSS=function(){var t=e.instance.toString();if(!t)return"";var n=Ce(),o=ae([n&&'nonce="'.concat(n,'"'),"".concat(f,'="true"'),"".concat(y,'="').concat(v,'"')].filter(Boolean)," ");return"<style ".concat(o,">").concat(t,"</style>")},this.getStyleTags=function(){if(e.sealed)throw he(2);return e._emitSheetCSS()},this.getStyleElement=function(){var n;if(e.sealed)throw he(2);var r=e.instance.toString();if(!r)return[];var s=((n={})[f]="",n[y]=v,n.dangerouslySetInnerHTML={__html:r},n),i=Ce();return i&&(s.nonce=i),[react__WEBPACK_IMPORTED_MODULE_1___default().createElement("style",(0,tslib__WEBPACK_IMPORTED_MODULE_4__.__assign)({},s,{key:"sc-0-0"}))]},this.seal=function(){e.sealed=!0},this.instance=new ke({isServer:!0}),this.sealed=!1}return e.prototype.collectStyles=function(e){if(this.sealed)throw he(2);return react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Ye,{sheet:this.instance},e)},e.prototype.interleaveWithNodeStream=function(e){throw he(3)},e}(),gt={StyleSheet:ke,mainSheet:Me}; true&&"undefined"!=typeof navigator&&"ReactNative"===navigator.product&&console.warn("It looks like you've imported 'styled-components' on React Native.\nPerhaps you're looking to import 'styled-components/native'?\nRead more about this at https://www.styled-components.com/docs/basics#react-native");var St="__sc-".concat(f,"__"); true&&"undefined"!=typeof window&&(window[St]||(window[St]=0),1===window[St]&&console.warn("It looks like there are several instances of 'styled-components' initialized in this application. This may cause dynamic styles to not render properly, errors during the rehydration process, a missing theme prop, and makes your application bigger without good reason.\n\nSee https://s-c.sh/2BAXzed for more info."),window[St]+=1);
//# sourceMappingURL=styled-components.browser.esm.js.map


/***/ }),

/***/ "../node_modules/styled-components/node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js":
/*!***************************************************************************************************************!*\
  !*** ../node_modules/styled-components/node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isPropValid)
/* harmony export */ });
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/memoize */ "../node_modules/styled-components/node_modules/@emotion/memoize/dist/emotion-memoize.esm.js");


var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var isPropValid = /* #__PURE__ */(0,_emotion_memoize__WEBPACK_IMPORTED_MODULE_0__["default"])(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);




/***/ }),

/***/ "../node_modules/styled-components/node_modules/@emotion/memoize/dist/emotion-memoize.esm.js":
/*!***************************************************************************************************!*\
  !*** ../node_modules/styled-components/node_modules/@emotion/memoize/dist/emotion-memoize.esm.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ memoize)
/* harmony export */ });
function memoize(fn) {
  var cache = Object.create(null);
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}




/***/ }),

/***/ "../node_modules/styled-components/node_modules/@emotion/unitless/dist/emotion-unitless.esm.js":
/*!*****************************************************************************************************!*\
  !*** ../node_modules/styled-components/node_modules/@emotion/unitless/dist/emotion-unitless.esm.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ unitlessKeys)
/* harmony export */ });
var unitlessKeys = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};




/***/ }),

/***/ "../node_modules/validator/lib/isFQDN.js":
/*!***********************************************!*\
  !*** ../node_modules/validator/lib/isFQDN.js ***!
  \***********************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isFQDN;

var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "../node_modules/validator/lib/util/assertString.js"));

var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "../node_modules/validator/lib/util/merge.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_fqdn_options = {
  require_tld: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_numeric_tld: false,
  allow_wildcard: false,
  ignore_max_length: false
};

function isFQDN(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_fqdn_options);
  /* Remove the optional trailing dot before checking validity */

  if (options.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1);
  }
  /* Remove the optional wildcard before checking validity */


  if (options.allow_wildcard === true && str.indexOf('*.') === 0) {
    str = str.substring(2);
  }

  var parts = str.split('.');
  var tld = parts[parts.length - 1];

  if (options.require_tld) {
    // disallow fqdns without tld
    if (parts.length < 2) {
      return false;
    }

    if (!options.allow_numeric_tld && !/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false;
    } // disallow spaces


    if (/\s/.test(tld)) {
      return false;
    }
  } // reject numeric TLDs


  if (!options.allow_numeric_tld && /^\d+$/.test(tld)) {
    return false;
  }

  return parts.every(function (part) {
    if (part.length > 63 && !options.ignore_max_length) {
      return false;
    }

    if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    } // disallow full-width chars


    if (/[\uff01-\uff5e]/.test(part)) {
      return false;
    } // disallow parts starting or ending with hyphen


    if (/^-|-$/.test(part)) {
      return false;
    }

    if (!options.allow_underscores && /_/.test(part)) {
      return false;
    }

    return true;
  });
}

module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "../node_modules/validator/lib/isIP.js":
/*!*********************************************!*\
  !*** ../node_modules/validator/lib/isIP.js ***!
  \*********************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isIP;

var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "../node_modules/validator/lib/util/assertString.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
11.3.  Examples

   The following addresses

             fe80::1234 (on the 1st link of the node)
             ff02::5678 (on the 5th link of the node)
             ff08::9abc (on the 10th organization of the node)

   would be represented as follows:

             fe80::1234%1
             ff02::5678%5
             ff08::9abc%10

   (Here we assume a natural translation from a zone index to the
   <zone_id> part, where the Nth zone of any scope is translated into
   "N".)

   If we use interface names as <zone_id>, those addresses could also be
   represented as follows:

            fe80::1234%ne0
            ff02::5678%pvc1.3
            ff08::9abc%interface10

   where the interface "ne0" belongs to the 1st link, "pvc1.3" belongs
   to the 5th link, and "interface10" belongs to the 10th organization.
 * * */
var IPv4SegmentFormat = '(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])';
var IPv4AddressFormat = "(".concat(IPv4SegmentFormat, "[.]){3}").concat(IPv4SegmentFormat);
var IPv4AddressRegExp = new RegExp("^".concat(IPv4AddressFormat, "$"));
var IPv6SegmentFormat = '(?:[0-9a-fA-F]{1,4})';
var IPv6AddressRegExp = new RegExp('^(' + "(?:".concat(IPv6SegmentFormat, ":){7}(?:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){6}(?:").concat(IPv4AddressFormat, "|:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){5}(?::").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,2}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){4}(?:(:").concat(IPv6SegmentFormat, "){0,1}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,3}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){3}(?:(:").concat(IPv6SegmentFormat, "){0,2}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,4}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){2}(?:(:").concat(IPv6SegmentFormat, "){0,3}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,5}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){1}(?:(:").concat(IPv6SegmentFormat, "){0,4}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,6}|:)|") + "(?::((?::".concat(IPv6SegmentFormat, "){0,5}:").concat(IPv4AddressFormat, "|(?::").concat(IPv6SegmentFormat, "){1,7}|:))") + ')(%[0-9a-zA-Z-.:]{1,})?$');

function isIP(str) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  (0, _assertString.default)(str);
  version = String(version);

  if (!version) {
    return isIP(str, 4) || isIP(str, 6);
  }

  if (version === '4') {
    return IPv4AddressRegExp.test(str);
  }

  if (version === '6') {
    return IPv6AddressRegExp.test(str);
  }

  return false;
}

module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "../node_modules/validator/lib/isURL.js":
/*!**********************************************!*\
  !*** ../node_modules/validator/lib/isURL.js ***!
  \**********************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isURL;

var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "../node_modules/validator/lib/util/assertString.js"));

var _isFQDN = _interopRequireDefault(__webpack_require__(/*! ./isFQDN */ "../node_modules/validator/lib/isFQDN.js"));

var _isIP = _interopRequireDefault(__webpack_require__(/*! ./isIP */ "../node_modules/validator/lib/isIP.js"));

var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "../node_modules/validator/lib/util/merge.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
options for isURL method

require_protocol - if set as true isURL will return false if protocol is not present in the URL
require_valid_protocol - isURL will check if the URL's protocol is present in the protocols option
protocols - valid protocols can be modified with this option
require_host - if set as false isURL will not check if host is present in the URL
require_port - if set as true isURL will check if port is present in the URL
allow_protocol_relative_urls - if set as true protocol relative URLs will be allowed
validate_length - if set as false isURL will skip string length validation (IE maximum is 2083)

*/
var default_url_options = {
  protocols: ['http', 'https', 'ftp'],
  require_tld: true,
  require_protocol: false,
  require_host: true,
  require_port: false,
  require_valid_protocol: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
  allow_fragments: true,
  allow_query_components: true,
  validate_length: true
};
var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;

function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
}

function checkHost(host, matches) {
  for (var i = 0; i < matches.length; i++) {
    var match = matches[i];

    if (host === match || isRegExp(match) && match.test(host)) {
      return true;
    }
  }

  return false;
}

function isURL(url, options) {
  (0, _assertString.default)(url);

  if (!url || /[\s<>]/.test(url)) {
    return false;
  }

  if (url.indexOf('mailto:') === 0) {
    return false;
  }

  options = (0, _merge.default)(options, default_url_options);

  if (options.validate_length && url.length >= 2083) {
    return false;
  }

  if (!options.allow_fragments && url.includes('#')) {
    return false;
  }

  if (!options.allow_query_components && (url.includes('?') || url.includes('&'))) {
    return false;
  }

  var protocol, auth, host, hostname, port, port_str, split, ipv6;
  split = url.split('#');
  url = split.shift();
  split = url.split('?');
  url = split.shift();
  split = url.split('://');

  if (split.length > 1) {
    protocol = split.shift().toLowerCase();

    if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
      return false;
    }
  } else if (options.require_protocol) {
    return false;
  } else if (url.slice(0, 2) === '//') {
    if (!options.allow_protocol_relative_urls) {
      return false;
    }

    split[0] = url.slice(2);
  }

  url = split.join('://');

  if (url === '') {
    return false;
  }

  split = url.split('/');
  url = split.shift();

  if (url === '' && !options.require_host) {
    return true;
  }

  split = url.split('@');

  if (split.length > 1) {
    if (options.disallow_auth) {
      return false;
    }

    if (split[0] === '') {
      return false;
    }

    auth = split.shift();

    if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
      return false;
    }

    var _auth$split = auth.split(':'),
        _auth$split2 = _slicedToArray(_auth$split, 2),
        user = _auth$split2[0],
        password = _auth$split2[1];

    if (user === '' && password === '') {
      return false;
    }
  }

  hostname = split.join('@');
  port_str = null;
  ipv6 = null;
  var ipv6_match = hostname.match(wrapped_ipv6);

  if (ipv6_match) {
    host = '';
    ipv6 = ipv6_match[1];
    port_str = ipv6_match[2] || null;
  } else {
    split = hostname.split(':');
    host = split.shift();

    if (split.length) {
      port_str = split.join(':');
    }
  }

  if (port_str !== null && port_str.length > 0) {
    port = parseInt(port_str, 10);

    if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
      return false;
    }
  } else if (options.require_port) {
    return false;
  }

  if (options.host_whitelist) {
    return checkHost(host, options.host_whitelist);
  }

  if (host === '' && !options.require_host) {
    return true;
  }

  if (!(0, _isIP.default)(host) && !(0, _isFQDN.default)(host, options) && (!ipv6 || !(0, _isIP.default)(ipv6, 6))) {
    return false;
  }

  host = host || ipv6;

  if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
    return false;
  }

  return true;
}

module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "../node_modules/validator/lib/util/assertString.js":
/*!**********************************************************!*\
  !*** ../node_modules/validator/lib/util/assertString.js ***!
  \**********************************************************/
/***/ ((module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = assertString;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function assertString(input) {
  var isString = typeof input === 'string' || input instanceof String;

  if (!isString) {
    var invalidType = _typeof(input);

    if (input === null) invalidType = 'null';else if (invalidType === 'object') invalidType = input.constructor.name;
    throw new TypeError("Expected a string but received a ".concat(invalidType));
  }
}

module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "../node_modules/validator/lib/util/merge.js":
/*!***************************************************!*\
  !*** ../node_modules/validator/lib/util/merge.js ***!
  \***************************************************/
/***/ ((module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = merge;

function merge() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaults = arguments.length > 1 ? arguments[1] : undefined;

  for (var key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }

  return obj;
}

module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = ReactDOM;

/***/ }),

/***/ "@elementor/icons":
/*!************************************!*\
  !*** external "elementorV2.icons" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.icons;

/***/ }),

/***/ "@elementor/ui":
/*!*********************************!*\
  !*** external "elementorV2.ui" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui;

/***/ }),

/***/ "@wordpress/i18n":
/*!**************************!*\
  !*** external "wp.i18n" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = wp.i18n;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/arrayLikeToArray.js":
/*!******************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/arrayLikeToArray.js ***!
  \******************************************************************/
/***/ ((module) => {

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/arrayWithHoles.js":
/*!****************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \****************************************************************/
/***/ ((module) => {

function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/arrayWithoutHoles.js":
/*!*******************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ "../node_modules/@babel/runtime/helpers/arrayLikeToArray.js");
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return arrayLikeToArray(r);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/assertThisInitialized.js":
/*!***********************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \***********************************************************************/
/***/ ((module) => {

function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/asyncToGenerator.js":
/*!******************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \******************************************************************/
/***/ ((module) => {

function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!****************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \****************************************************************/
/***/ ((module) => {

function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/createClass.js":
/*!*************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/createClass.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ "../node_modules/@babel/runtime/helpers/toPropertyKey.js");
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/defineProperty.js":
/*!****************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ "../node_modules/@babel/runtime/helpers/toPropertyKey.js");
function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/extends.js":
/*!*********************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/extends.js ***!
  \*********************************************************/
/***/ ((module) => {

function _extends() {
  return module.exports = _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _extends.apply(null, arguments);
}
module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/getPrototypeOf.js":
/*!****************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/getPrototypeOf.js ***!
  \****************************************************************/
/***/ ((module) => {

function _getPrototypeOf(t) {
  return module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _getPrototypeOf(t);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/inherits.js":
/*!**********************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/inherits.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ "../node_modules/@babel/runtime/helpers/setPrototypeOf.js");
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && setPrototypeOf(t, e);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!***********************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \***********************************************************************/
/***/ ((module) => {

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    "default": e
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/iterableToArray.js":
/*!*****************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \*****************************************************************/
/***/ ((module) => {

function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":
/*!**********************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \**********************************************************************/
/***/ ((module) => {

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/nonIterableRest.js":
/*!*****************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \*****************************************************************/
/***/ ((module) => {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/nonIterableSpread.js":
/*!*******************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \*******************************************************************/
/***/ ((module) => {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/objectWithoutProperties.js":
/*!*************************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/objectWithoutProperties.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var objectWithoutPropertiesLoose = __webpack_require__(/*! ./objectWithoutPropertiesLoose.js */ "../node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js");
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
module.exports = _objectWithoutProperties, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js":
/*!******************************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js ***!
  \******************************************************************************/
/***/ ((module) => {

function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (e.includes(n)) continue;
    t[n] = r[n];
  }
  return t;
}
module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js":
/*!***************************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(/*! ./typeof.js */ "../node_modules/@babel/runtime/helpers/typeof.js")["default"]);
var assertThisInitialized = __webpack_require__(/*! ./assertThisInitialized.js */ "../node_modules/@babel/runtime/helpers/assertThisInitialized.js");
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == _typeof(e) || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return assertThisInitialized(t);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/regeneratorRuntime.js":
/*!********************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/regeneratorRuntime.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(/*! ./typeof.js */ "../node_modules/@babel/runtime/helpers/typeof.js")["default"]);
function _regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return e;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function define(t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function value(t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(_typeof(e) + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function stop() {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function complete(t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function finish(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    "catch": function _catch(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/setPrototypeOf.js":
/*!****************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \****************************************************************/
/***/ ((module) => {

function _setPrototypeOf(t, e) {
  return module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _setPrototypeOf(t, e);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/slicedToArray.js":
/*!***************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles.js */ "../node_modules/@babel/runtime/helpers/arrayWithHoles.js");
var iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit.js */ "../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js");
var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "../node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js");
var nonIterableRest = __webpack_require__(/*! ./nonIterableRest.js */ "../node_modules/@babel/runtime/helpers/nonIterableRest.js");
function _slicedToArray(r, e) {
  return arrayWithHoles(r) || iterableToArrayLimit(r, e) || unsupportedIterableToArray(r, e) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js":
/*!***********************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js ***!
  \***********************************************************************/
/***/ ((module) => {

function _taggedTemplateLiteral(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
    raw: {
      value: Object.freeze(t)
    }
  }));
}
module.exports = _taggedTemplateLiteral, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/toConsumableArray.js":
/*!*******************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayWithoutHoles = __webpack_require__(/*! ./arrayWithoutHoles.js */ "../node_modules/@babel/runtime/helpers/arrayWithoutHoles.js");
var iterableToArray = __webpack_require__(/*! ./iterableToArray.js */ "../node_modules/@babel/runtime/helpers/iterableToArray.js");
var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "../node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js");
var nonIterableSpread = __webpack_require__(/*! ./nonIterableSpread.js */ "../node_modules/@babel/runtime/helpers/nonIterableSpread.js");
function _toConsumableArray(r) {
  return arrayWithoutHoles(r) || iterableToArray(r) || unsupportedIterableToArray(r) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/toPrimitive.js":
/*!*************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/toPrimitive.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(/*! ./typeof.js */ "../node_modules/@babel/runtime/helpers/typeof.js")["default"]);
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/toPropertyKey.js":
/*!***************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/toPropertyKey.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(/*! ./typeof.js */ "../node_modules/@babel/runtime/helpers/typeof.js")["default"]);
var toPrimitive = __webpack_require__(/*! ./toPrimitive.js */ "../node_modules/@babel/runtime/helpers/toPrimitive.js");
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/typeof.js":
/*!********************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/typeof.js ***!
  \********************************************************/
/***/ ((module) => {

function _typeof(o) {
  "@babel/helpers - typeof";

  return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js":
/*!****************************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ "../node_modules/@babel/runtime/helpers/arrayLikeToArray.js");
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? arrayLikeToArray(r, a) : void 0;
  }
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "../node_modules/@babel/runtime/regenerator/index.js":
/*!***********************************************************!*\
  !*** ../node_modules/@babel/runtime/regenerator/index.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(/*! ../helpers/regeneratorRuntime */ "../node_modules/@babel/runtime/helpers/regeneratorRuntime.js")();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ "../node_modules/styled-components/node_modules/tslib/tslib.es6.mjs":
/*!**************************************************************************!*\
  !*** ../node_modules/styled-components/node_modules/tslib/tslib.es6.mjs ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __addDisposableResource: () => (/* binding */ __addDisposableResource),
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldIn: () => (/* binding */ __classPrivateFieldIn),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __disposeResources: () => (/* binding */ __disposeResources),
/* harmony export */   __esDecorate: () => (/* binding */ __esDecorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __propKey: () => (/* binding */ __propKey),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __runInitializers: () => (/* binding */ __runInitializers),
/* harmony export */   __setFunctionName: () => (/* binding */ __setFunctionName),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
  function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose;
    if (async) {
        if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
        if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  function next() {
    while (env.stack.length) {
      var rec = env.stack.pop();
      try {
        var result = rec.dispose && rec.dispose.call(rec.value);
        if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
      }
      catch (e) {
          fail(e);
      }
    }
    if (env.hasError) throw env.error;
  }
  return next();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
});


/***/ }),

/***/ "../node_modules/stylis/src/Enum.js":
/*!******************************************!*\
  !*** ../node_modules/stylis/src/Enum.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHARSET: () => (/* binding */ CHARSET),
/* harmony export */   COMMENT: () => (/* binding */ COMMENT),
/* harmony export */   COUNTER_STYLE: () => (/* binding */ COUNTER_STYLE),
/* harmony export */   DECLARATION: () => (/* binding */ DECLARATION),
/* harmony export */   DOCUMENT: () => (/* binding */ DOCUMENT),
/* harmony export */   FONT_FACE: () => (/* binding */ FONT_FACE),
/* harmony export */   FONT_FEATURE_VALUES: () => (/* binding */ FONT_FEATURE_VALUES),
/* harmony export */   IMPORT: () => (/* binding */ IMPORT),
/* harmony export */   KEYFRAMES: () => (/* binding */ KEYFRAMES),
/* harmony export */   LAYER: () => (/* binding */ LAYER),
/* harmony export */   MEDIA: () => (/* binding */ MEDIA),
/* harmony export */   MOZ: () => (/* binding */ MOZ),
/* harmony export */   MS: () => (/* binding */ MS),
/* harmony export */   NAMESPACE: () => (/* binding */ NAMESPACE),
/* harmony export */   PAGE: () => (/* binding */ PAGE),
/* harmony export */   RULESET: () => (/* binding */ RULESET),
/* harmony export */   SCOPE: () => (/* binding */ SCOPE),
/* harmony export */   SUPPORTS: () => (/* binding */ SUPPORTS),
/* harmony export */   VIEWPORT: () => (/* binding */ VIEWPORT),
/* harmony export */   WEBKIT: () => (/* binding */ WEBKIT)
/* harmony export */ });
var MS = '-ms-'
var MOZ = '-moz-'
var WEBKIT = '-webkit-'

var COMMENT = 'comm'
var RULESET = 'rule'
var DECLARATION = 'decl'

var PAGE = '@page'
var MEDIA = '@media'
var IMPORT = '@import'
var CHARSET = '@charset'
var VIEWPORT = '@viewport'
var SUPPORTS = '@supports'
var DOCUMENT = '@document'
var NAMESPACE = '@namespace'
var KEYFRAMES = '@keyframes'
var FONT_FACE = '@font-face'
var COUNTER_STYLE = '@counter-style'
var FONT_FEATURE_VALUES = '@font-feature-values'
var LAYER = '@layer'
var SCOPE = '@scope'


/***/ }),

/***/ "../node_modules/stylis/src/Middleware.js":
/*!************************************************!*\
  !*** ../node_modules/stylis/src/Middleware.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   middleware: () => (/* binding */ middleware),
/* harmony export */   namespace: () => (/* binding */ namespace),
/* harmony export */   prefixer: () => (/* binding */ prefixer),
/* harmony export */   rulesheet: () => (/* binding */ rulesheet)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Enum.js */ "../node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "../node_modules/stylis/src/Utility.js");
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Tokenizer.js */ "../node_modules/stylis/src/Tokenizer.js");
/* harmony import */ var _Serializer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Serializer.js */ "../node_modules/stylis/src/Serializer.js");
/* harmony import */ var _Prefixer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Prefixer.js */ "../node_modules/stylis/src/Prefixer.js");






/**
 * @param {function[]} collection
 * @return {function}
 */
function middleware (collection) {
	var length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(collection)

	return function (element, index, children, callback) {
		var output = ''

		for (var i = 0; i < length; i++)
			output += collection[i](element, index, children, callback) || ''

		return output
	}
}

/**
 * @param {function} callback
 * @return {function}
 */
function rulesheet (callback) {
	return function (element) {
		if (!element.root)
			if (element = element.return)
				callback(element)
	}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 */
function prefixer (element, index, children, callback) {
	if (element.length > -1)
		if (!element.return)
			switch (element.type) {
				case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.DECLARATION: element.return = (0,_Prefixer_js__WEBPACK_IMPORTED_MODULE_2__.prefix)(element.value, element.length, children)
					return
				case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.KEYFRAMES:
					return (0,_Serializer_js__WEBPACK_IMPORTED_MODULE_3__.serialize)([(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {value: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(element.value, '@', '@' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT)})], callback)
				case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.RULESET:
					if (element.length)
						return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.combine)(children = element.props, function (value) {
							switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(value, callback = /(::plac\w+|:read-\w+)/)) {
								// :read-(only|write)
								case ':read-only': case ':read-write':
									(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.lift)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(read-\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + '$1')]}))
									;(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.lift)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [value]}))
									;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.assign)(element, {props: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.filter)(children, callback)})
									break
								// :placeholder
								case '::placeholder':
									;(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.lift)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(plac\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'input-$1')]}))
									;(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.lift)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(plac\w+)/, ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + '$1')]}))
									;(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.lift)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /:(plac\w+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'input-$1')]}))
									;(0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.lift)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.copy)(element, {props: [value]}))
									;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.assign)(element, {props: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.filter)(children, callback)})
									break
							}

							return ''
						})
			}
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 */
function namespace (element) {
	switch (element.type) {
		case _Enum_js__WEBPACK_IMPORTED_MODULE_1__.RULESET:
			element.props = element.props.map(function (value) {
				return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.combine)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_4__.tokenize)(value), function (value, index, children) {
					switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, 0)) {
						// \f
						case 12:
							return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(value, 1, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(value))
						// \0 ( + > ~
						case 0: case 40: case 43: case 62: case 126:
							return value
						// :
						case 58:
							if (children[++index] === 'global')
								children[index] = '', children[++index] = '\f' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(children[index], index = 1, -1)
						// \s
						case 32:
							return index === 1 ? '' : value
						default:
							switch (index) {
								case 0: element = value
									return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(children) > 1 ? '' : value
								case index = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.sizeof)(children) - 1: case 2:
									return index === 2 ? value + element + element : value + element
								default:
									return value
							}
					}
				})
			})
	}
}


/***/ }),

/***/ "../node_modules/stylis/src/Parser.js":
/*!********************************************!*\
  !*** ../node_modules/stylis/src/Parser.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   comment: () => (/* binding */ comment),
/* harmony export */   compile: () => (/* binding */ compile),
/* harmony export */   declaration: () => (/* binding */ declaration),
/* harmony export */   parse: () => (/* binding */ parse),
/* harmony export */   ruleset: () => (/* binding */ ruleset)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Enum.js */ "../node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utility.js */ "../node_modules/stylis/src/Utility.js");
/* harmony import */ var _Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tokenizer.js */ "../node_modules/stylis/src/Tokenizer.js");




/**
 * @param {string} value
 * @return {object[]}
 */
function compile (value) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.dealloc)(parse('', null, null, null, [''], value = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.alloc)(value), 0, [0], value))
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {string[]} rule
 * @param {string[]} rules
 * @param {string[]} rulesets
 * @param {number[]} pseudo
 * @param {number[]} points
 * @param {string[]} declarations
 * @return {object}
 */
function parse (value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0
	var offset = 0
	var length = pseudo
	var atrule = 0
	var property = 0
	var previous = 0
	var variable = 1
	var scanning = 1
	var ampersand = 1
	var character = 0
	var type = ''
	var props = rules
	var children = rulesets
	var reference = rule
	var characters = type

	while (scanning)
		switch (previous = character, character = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.next)()) {
			// (
			case 40:
				if (previous != 108 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(characters, length - 1) == 58) {
					if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.indexof)(characters += (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.delimit)(character), '&', '&\f'), '&\f', (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.abs)(index ? points[index - 1] : 0)) != -1)
						ampersand = -1
					break
				}
			// " ' [
			case 34: case 39: case 91:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.delimit)(character)
				break
			// \t \n \r \s
			case 9: case 10: case 13: case 32:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.whitespace)(previous)
				break
			// \
			case 92:
				characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.escaping)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.caret)() - 1, 7)
				continue
			// /
			case 47:
				switch ((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.peek)()) {
					case 42: case 47:
						;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(comment((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.commenter)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.next)(), (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.caret)()), root, parent, declarations), declarations)
						break
					default:
						characters += '/'
				}
				break
			// {
			case 123 * variable:
				points[index++] = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) * ampersand
			// } ; \0
			case 125 * variable: case 59: case 0:
				switch (character) {
					// \0 }
					case 0: case 125: scanning = 0
					// ;
					case 59 + offset: if (ampersand == -1) characters = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(characters, /\f/g, '')
						if (property > 0 && ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) - length))
							(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(property > 32 ? declaration(characters + ';', rule, parent, length - 1, declarations) : declaration((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(characters, ' ', '') + ';', rule, parent, length - 2, declarations), declarations)
						break
					// @ ;
					case 59: characters += ';'
					// { rule/at-rule
					default:
						;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length, rulesets), rulesets)

						if (character === 123)
							if (offset === 0)
								parse(characters, root, reference, reference, props, rulesets, length, points, children)
							else
								switch (atrule === 99 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.charat)(characters, 3) === 110 ? 100 : atrule) {
									// d l m s
									case 100: case 108: case 109: case 115:
										parse(value, reference, reference, rule && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.append)(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length, children), children), rules, children, length, points, rule ? props : children)
										break
									default:
										parse(characters, reference, reference, reference, [''], children, 0, points, children)
								}
				}

				index = offset = property = 0, variable = ampersand = 1, type = characters = '', length = pseudo
				break
			// :
			case 58:
				length = 1 + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters), property = previous
			default:
				if (variable < 1)
					if (character == 123)
						--variable
					else if (character == 125 && variable++ == 0 && (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.prev)() == 125)
						continue

				switch (characters += (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.from)(character), character * variable) {
					// &
					case 38:
						ampersand = offset > 0 ? 1 : (characters += '\f', -1)
						break
					// ,
					case 44:
						points[index++] = ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) - 1) * ampersand, ampersand = 1
						break
					// @
					case 64:
						// -
						if ((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.peek)() === 45)
							characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.delimit)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.next)())

						atrule = (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.peek)(), offset = length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(type = characters += (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.identifier)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.caret)())), character++
						break
					// -
					case 45:
						if (previous === 45 && (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(characters) == 2)
							variable = 0
				}
		}

	return rulesets
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} index
 * @param {number} offset
 * @param {string[]} rules
 * @param {number[]} points
 * @param {string} type
 * @param {string[]} props
 * @param {string[]} children
 * @param {number} length
 * @param {object[]} siblings
 * @return {object}
 */
function ruleset (value, root, parent, index, offset, rules, points, type, props, children, length, siblings) {
	var post = offset - 1
	var rule = offset === 0 ? rules : ['']
	var size = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.sizeof)(rule)

	for (var i = 0, j = 0, k = 0; i < index; ++i)
		for (var x = 0, y = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, post + 1, post = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.abs)(j = points[i])), z = value; x < size; ++x)
			if (z = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.trim)(j > 0 ? rule[x] + ' ' + y : (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.replace)(y, /&\f/g, rule[x])))
				props[k++] = z

	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.node)(value, root, parent, offset === 0 ? _Enum_js__WEBPACK_IMPORTED_MODULE_2__.RULESET : type, props, children, length, siblings)
}

/**
 * @param {number} value
 * @param {object} root
 * @param {object?} parent
 * @param {object[]} siblings
 * @return {object}
 */
function comment (value, root, parent, siblings) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.node)(value, root, parent, _Enum_js__WEBPACK_IMPORTED_MODULE_2__.COMMENT, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.from)((0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.char)()), (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 2, -2), 0, siblings)
}

/**
 * @param {string} value
 * @param {object} root
 * @param {object?} parent
 * @param {number} length
 * @param {object[]} siblings
 * @return {object}
 */
function declaration (value, root, parent, length, siblings) {
	return (0,_Tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.node)(value, root, parent, _Enum_js__WEBPACK_IMPORTED_MODULE_2__.DECLARATION, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, 0, length), (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.substr)(value, length + 1, -1), length, siblings)
}


/***/ }),

/***/ "../node_modules/stylis/src/Prefixer.js":
/*!**********************************************!*\
  !*** ../node_modules/stylis/src/Prefixer.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   prefix: () => (/* binding */ prefix)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Enum.js */ "../node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "../node_modules/stylis/src/Utility.js");



/**
 * @param {string} value
 * @param {number} length
 * @param {object[]} children
 * @return {string}
 */
function prefix (value, length, children) {
	switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.hash)(value, length)) {
		// color-adjust
		case 5103:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'print-' + value + value
		// animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
		case 5737: case 4201: case 3177: case 3433: case 1641: case 4457: case 2921:
		// text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
		case 5572: case 6356: case 5844: case 3191: case 6645: case 3005:
		// mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
		case 6391: case 5879: case 5623: case 6135: case 4599: case 4855:
		// background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
		case 4215: case 6389: case 5109: case 5365: case 5621: case 3829:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + value
		// tab-size
		case 4789:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + value + value
		// appearance, user-select, transform, hyphens, text-size-adjust
		case 5349: case 4246: case 4810: case 6968: case 2756:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + value + value
		// writing-mode
		case 5936:
			switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 11)) {
				// vertical-l(r)
				case 114:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb') + value
				// vertical-r(l)
				case 108:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value
				// horizontal(-)tb
				case 45:
					return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /[svh]\w+-[tblr]{2}/, 'lr') + value
				// default: fallthrough to below
			}
		// flex, flex-direction, scroll-snap-type, writing-mode
		case 6828: case 4268: case 2903:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + value + value
		// order
		case 6165:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-' + value + value
		// align-items
		case 5187:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(\w+).+(:[^]+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-$1$2' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-$1$2') + value
		// align-self
		case 5443:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-item-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /flex-|-self/g, '') + (!(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(value, /flex-|baseline/) ? _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'grid-row-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /flex-|-self/g, '') : '') + value
		// align-content
		case 4675:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-line-pack' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /align-content|flex-|-self/g, '') + value
		// flex-shrink
		case 5548:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'shrink', 'negative') + value
		// flex-basis
		case 5292:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'basis', 'preferred-size') + value
		// flex-grow
		case 6060:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, '-grow', '') + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'grow', 'positive') + value
		// transition
		case 4554:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /([^-])(transform)/g, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2') + value
		// cursor
		case 6187:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(zoom-|grab)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1'), /(image-set)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1'), value, '') + value
		// background, background-image
		case 5495: case 3959:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(image-set\([^]*)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1' + '$`$1')
		// justify-content
		case 4968:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+:)(flex-)?(.*)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + 'box-pack:$3' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + value + value
		// justify-self
		case 4200:
			if (!(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(value, /flex-|baseline/)) return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'grid-column-align' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(value, length) + value
			break
		// grid-template-(columns|rows)
		case 2592: case 3360:
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'template-', '') + value
		// grid-(row|column)-start
		case 4384: case 3616:
			if (children && children.some(function (element, index) { return length = index, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(element.props, /grid-\w+-end/) })) {
				return ~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.indexof)(value + (children = children[length].value), 'span', 0) ? value : (_Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, '-start', '') + value + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + 'grid-row-span:' + (~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.indexof)(children, 'span', 0) ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(children, /\d+/) : +(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(children, /\d+/) - +(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(value, /\d+/)) + ';')
			}
			return _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, '-start', '') + value
		// grid-(row|column)-end
		case 4896: case 4128:
			return (children && children.some(function (element) { return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.match)(element.props, /grid-\w+-start/) })) ? value : _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, '-end', '-span'), 'span ', '') + value
		// (margin|padding)-inline-(start|end)
		case 4095: case 3583: case 4068: case 2532:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+)-inline(.+)/, _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$1$2') + value
		// (min|max)?(width|height|inline-size|block-size)
		case 8116: case 7059: case 5753: case 5535:
		case 5445: case 5701: case 4933: case 4677:
		case 5533: case 5789: case 5021: case 4765:
			// stretch, max-content, min-content, fill-available
			if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(value) - 1 - length > 6)
				switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 1)) {
					// (m)ax-content, (m)in-content
					case 109:
						// -
						if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 4) !== 45)
							break
					// (f)ill-available, (f)it-content
					case 102:
						return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+:)(.+)-([^]+)/, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2-$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MOZ + ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 3) == 108 ? '$3' : '$2-$3')) + value
					// (s)tretch
					case 115:
						return ~(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.indexof)(value, 'stretch', 0) ? prefix((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'stretch', 'fill-available'), length, children) + value : value
				}
			break
		// grid-(column|row)
		case 5152: case 5920:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function (_, a, b, c, d, e, f) { return (_Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + a + ':' + b + f) + (c ? (_Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + a + '-span:' + (d ? e : +e - +b)) + f : '') + value })
		// position: sticky
		case 4949:
			// stick(y)?
			if ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, length + 6) === 121)
				return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, ':', ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT) + value
			break
		// display: (flex|inline-flex|grid|inline-grid)
		case 6444:
			switch ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, 14) === 45 ? 18 : 11)) {
				// (inline-)?fle(x)
				case 120:
					return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + ((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.WEBKIT + '$2$3' + '$1' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS + '$2box$3') + value
				// (inline-)?gri(d)
				case 100:
					return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, ':', ':' + _Enum_js__WEBPACK_IMPORTED_MODULE_1__.MS) + value
			}
			break
		// scroll-margin, scroll-margin-(top|right|bottom|left)
		case 5719: case 2647: case 2135: case 3927: case 2391:
			return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.replace)(value, 'scroll-', 'scroll-snap-') + value
	}

	return value
}


/***/ }),

/***/ "../node_modules/stylis/src/Serializer.js":
/*!************************************************!*\
  !*** ../node_modules/stylis/src/Serializer.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   serialize: () => (/* binding */ serialize),
/* harmony export */   stringify: () => (/* binding */ stringify)
/* harmony export */ });
/* harmony import */ var _Enum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Enum.js */ "../node_modules/stylis/src/Enum.js");
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utility.js */ "../node_modules/stylis/src/Utility.js");



/**
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function serialize (children, callback) {
	var output = ''

	for (var i = 0; i < children.length; i++)
		output += callback(children[i], i, children, callback) || ''

	return output
}

/**
 * @param {object} element
 * @param {number} index
 * @param {object[]} children
 * @param {function} callback
 * @return {string}
 */
function stringify (element, index, children, callback) {
	switch (element.type) {
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.LAYER: if (element.children.length) break
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.IMPORT: case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.DECLARATION: return element.return = element.return || element.value
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.COMMENT: return ''
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.KEYFRAMES: return element.return = element.value + '{' + serialize(element.children, callback) + '}'
		case _Enum_js__WEBPACK_IMPORTED_MODULE_0__.RULESET: if (!(0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(element.value = element.props.join(','))) return ''
	}

	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_1__.strlen)(children = serialize(element.children, callback)) ? element.return = element.value + '{' + children + '}' : ''
}


/***/ }),

/***/ "../node_modules/stylis/src/Tokenizer.js":
/*!***********************************************!*\
  !*** ../node_modules/stylis/src/Tokenizer.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alloc: () => (/* binding */ alloc),
/* harmony export */   caret: () => (/* binding */ caret),
/* harmony export */   char: () => (/* binding */ char),
/* harmony export */   character: () => (/* binding */ character),
/* harmony export */   characters: () => (/* binding */ characters),
/* harmony export */   column: () => (/* binding */ column),
/* harmony export */   commenter: () => (/* binding */ commenter),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   dealloc: () => (/* binding */ dealloc),
/* harmony export */   delimit: () => (/* binding */ delimit),
/* harmony export */   delimiter: () => (/* binding */ delimiter),
/* harmony export */   escaping: () => (/* binding */ escaping),
/* harmony export */   identifier: () => (/* binding */ identifier),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   lift: () => (/* binding */ lift),
/* harmony export */   line: () => (/* binding */ line),
/* harmony export */   next: () => (/* binding */ next),
/* harmony export */   node: () => (/* binding */ node),
/* harmony export */   peek: () => (/* binding */ peek),
/* harmony export */   position: () => (/* binding */ position),
/* harmony export */   prev: () => (/* binding */ prev),
/* harmony export */   slice: () => (/* binding */ slice),
/* harmony export */   token: () => (/* binding */ token),
/* harmony export */   tokenize: () => (/* binding */ tokenize),
/* harmony export */   tokenizer: () => (/* binding */ tokenizer),
/* harmony export */   whitespace: () => (/* binding */ whitespace)
/* harmony export */ });
/* harmony import */ var _Utility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility.js */ "../node_modules/stylis/src/Utility.js");


var line = 1
var column = 1
var length = 0
var position = 0
var character = 0
var characters = ''

/**
 * @param {string} value
 * @param {object | null} root
 * @param {object | null} parent
 * @param {string} type
 * @param {string[] | string} props
 * @param {object[] | string} children
 * @param {object[]} siblings
 * @param {number} length
 */
function node (value, root, parent, type, props, children, length, siblings) {
	return {value: value, root: root, parent: parent, type: type, props: props, children: children, line: line, column: column, length: length, return: '', siblings: siblings}
}

/**
 * @param {object} root
 * @param {object} props
 * @return {object}
 */
function copy (root, props) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.assign)(node('', null, null, '', null, null, 0, root.siblings), root, {length: -root.length}, props)
}

/**
 * @param {object} root
 */
function lift (root) {
	while (root.root)
		root = copy(root.root, {children: [root]})

	;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)(root, root.siblings)
}

/**
 * @return {number}
 */
function char () {
	return character
}

/**
 * @return {number}
 */
function prev () {
	character = position > 0 ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, --position) : 0

	if (column--, character === 10)
		column = 1, line--

	return character
}

/**
 * @return {number}
 */
function next () {
	character = position < length ? (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, position++) : 0

	if (column++, character === 10)
		column = 1, line++

	return character
}

/**
 * @return {number}
 */
function peek () {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.charat)(characters, position)
}

/**
 * @return {number}
 */
function caret () {
	return position
}

/**
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function slice (begin, end) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.substr)(characters, begin, end)
}

/**
 * @param {number} type
 * @return {number}
 */
function token (type) {
	switch (type) {
		// \0 \t \n \r \s whitespace token
		case 0: case 9: case 10: case 13: case 32:
			return 5
		// ! + , / > @ ~ isolate token
		case 33: case 43: case 44: case 47: case 62: case 64: case 126:
		// ; { } breakpoint token
		case 59: case 123: case 125:
			return 4
		// : accompanied token
		case 58:
			return 3
		// " ' ( [ opening delimit token
		case 34: case 39: case 40: case 91:
			return 2
		// ) ] closing delimit token
		case 41: case 93:
			return 1
	}

	return 0
}

/**
 * @param {string} value
 * @return {any[]}
 */
function alloc (value) {
	return line = column = 1, length = (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.strlen)(characters = value), position = 0, []
}

/**
 * @param {any} value
 * @return {any}
 */
function dealloc (value) {
	return characters = '', value
}

/**
 * @param {number} type
 * @return {string}
 */
function delimit (type) {
	return (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.trim)(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)))
}

/**
 * @param {string} value
 * @return {string[]}
 */
function tokenize (value) {
	return dealloc(tokenizer(alloc(value)))
}

/**
 * @param {number} type
 * @return {string}
 */
function whitespace (type) {
	while (character = peek())
		if (character < 33)
			next()
		else
			break

	return token(type) > 2 || token(character) > 3 ? '' : ' '
}

/**
 * @param {string[]} children
 * @return {string[]}
 */
function tokenizer (children) {
	while (next())
		switch (token(character)) {
			case 0: (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)(identifier(position - 1), children)
				break
			case 2: ;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)(delimit(character), children)
				break
			default: ;(0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.append)((0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.from)(character), children)
		}

	return children
}

/**
 * @param {number} index
 * @param {number} count
 * @return {string}
 */
function escaping (index, count) {
	while (--count && next())
		// not 0-9 A-F a-f
		if (character < 48 || character > 102 || (character > 57 && character < 65) || (character > 70 && character < 97))
			break

	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32))
}

/**
 * @param {number} type
 * @return {number}
 */
function delimiter (type) {
	while (next())
		switch (character) {
			// ] ) " '
			case type:
				return position
			// " '
			case 34: case 39:
				if (type !== 34 && type !== 39)
					delimiter(character)
				break
			// (
			case 40:
				if (type === 41)
					delimiter(type)
				break
			// \
			case 92:
				next()
				break
		}

	return position
}

/**
 * @param {number} type
 * @param {number} index
 * @return {number}
 */
function commenter (type, index) {
	while (next())
		// //
		if (type + character === 47 + 10)
			break
		// /*
		else if (type + character === 42 + 42 && peek() === 47)
			break

	return '/*' + slice(index, position - 1) + '*' + (0,_Utility_js__WEBPACK_IMPORTED_MODULE_0__.from)(type === 47 ? type : next())
}

/**
 * @param {number} index
 * @return {string}
 */
function identifier (index) {
	while (!token(peek()))
		next()

	return slice(index, position)
}


/***/ }),

/***/ "../node_modules/stylis/src/Utility.js":
/*!*********************************************!*\
  !*** ../node_modules/stylis/src/Utility.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   abs: () => (/* binding */ abs),
/* harmony export */   append: () => (/* binding */ append),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   charat: () => (/* binding */ charat),
/* harmony export */   combine: () => (/* binding */ combine),
/* harmony export */   filter: () => (/* binding */ filter),
/* harmony export */   from: () => (/* binding */ from),
/* harmony export */   hash: () => (/* binding */ hash),
/* harmony export */   indexof: () => (/* binding */ indexof),
/* harmony export */   match: () => (/* binding */ match),
/* harmony export */   replace: () => (/* binding */ replace),
/* harmony export */   sizeof: () => (/* binding */ sizeof),
/* harmony export */   strlen: () => (/* binding */ strlen),
/* harmony export */   substr: () => (/* binding */ substr),
/* harmony export */   trim: () => (/* binding */ trim)
/* harmony export */ });
/**
 * @param {number}
 * @return {number}
 */
var abs = Math.abs

/**
 * @param {number}
 * @return {string}
 */
var from = String.fromCharCode

/**
 * @param {object}
 * @return {object}
 */
var assign = Object.assign

/**
 * @param {string} value
 * @param {number} length
 * @return {number}
 */
function hash (value, length) {
	return charat(value, 0) ^ 45 ? (((((((length << 2) ^ charat(value, 0)) << 2) ^ charat(value, 1)) << 2) ^ charat(value, 2)) << 2) ^ charat(value, 3) : 0
}

/**
 * @param {string} value
 * @return {string}
 */
function trim (value) {
	return value.trim()
}

/**
 * @param {string} value
 * @param {RegExp} pattern
 * @return {string?}
 */
function match (value, pattern) {
	return (value = pattern.exec(value)) ? value[0] : value
}

/**
 * @param {string} value
 * @param {(string|RegExp)} pattern
 * @param {string} replacement
 * @return {string}
 */
function replace (value, pattern, replacement) {
	return value.replace(pattern, replacement)
}

/**
 * @param {string} value
 * @param {string} search
 * @param {number} position
 * @return {number}
 */
function indexof (value, search, position) {
	return value.indexOf(search, position)
}

/**
 * @param {string} value
 * @param {number} index
 * @return {number}
 */
function charat (value, index) {
	return value.charCodeAt(index) | 0
}

/**
 * @param {string} value
 * @param {number} begin
 * @param {number} end
 * @return {string}
 */
function substr (value, begin, end) {
	return value.slice(begin, end)
}

/**
 * @param {string} value
 * @return {number}
 */
function strlen (value) {
	return value.length
}

/**
 * @param {any[]} value
 * @return {number}
 */
function sizeof (value) {
	return value.length
}

/**
 * @param {any} value
 * @param {any[]} array
 * @return {any}
 */
function append (value, array) {
	return array.push(value), value
}

/**
 * @param {string[]} array
 * @param {function} callback
 * @return {string}
 */
function combine (array, callback) {
	return array.map(callback).join('')
}

/**
 * @param {string[]} array
 * @param {RegExp} pattern
 * @return {string[]}
 */
function filter (array, pattern) {
	return array.filter(function (value) { return !match(value, pattern) })
}


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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!*******************************************************!*\
  !*** ../modules/ai/assets/js/editor/layout-module.js ***!
  \*******************************************************/


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.AI_ATTACHMENT = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../node_modules/@babel/runtime/regenerator/index.js"));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "../node_modules/@babel/runtime/helpers/asyncToGenerator.js"));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "../node_modules/@babel/runtime/helpers/classCallCheck.js"));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ "../node_modules/@babel/runtime/helpers/createClass.js"));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "../node_modules/@babel/runtime/helpers/getPrototypeOf.js"));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ "../node_modules/@babel/runtime/helpers/inherits.js"));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/defineProperty.js"));
var _aiLayoutBehavior = _interopRequireDefault(__webpack_require__(/*! ./ai-layout-behavior */ "../modules/ai/assets/js/editor/ai-layout-behavior.js"));
var _editorIntegration = __webpack_require__(/*! ./utils/editor-integration */ "../modules/ai/assets/js/editor/utils/editor-integration.js");
var _i18n = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
var _config = __webpack_require__(/*! ./pages/form-layout/context/config */ "../modules/ai/assets/js/editor/pages/form-layout/context/config.js");
var _applyTemplateForAiBehavior = _interopRequireDefault(__webpack_require__(/*! ./integration/library/apply-template-for-ai-behavior */ "../modules/ai/assets/js/editor/integration/library/apply-template-for-ai-behavior.js"));
var _attachments = __webpack_require__(/*! ./pages/form-layout/components/attachments */ "../modules/ai/assets/js/editor/pages/form-layout/components/attachments.js");
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2.default)(o), (0, _possibleConstructorReturn2.default)(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2.default)(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var AI_ATTACHMENT = exports.AI_ATTACHMENT = 'ai-attachment';
var Module = exports["default"] = /*#__PURE__*/function (_elementorModules$edi) {
  function Module() {
    var _this;
    (0, _classCallCheck2.default)(this, Module);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, Module, [].concat(args));
    (0, _defineProperty2.default)(_this, "registerVariationsContextMenu", function (groups, currentElement) {
      var _ElementorAiConfig;
      var saveGroup = groups.find(function (group) {
        return 'save' === group.name;
      });
      if (!saveGroup) {
        return groups;
      }
      var contextMenu = {
        name: 'ai',
        icon: 'eicon-ai',
        isEnabled: function isEnabled() {
          return 0 !== currentElement.getContainer().children.length;
        },
        title: (0, _i18n.__)('Generate variations with AI', 'elementor'),
        callback: function () {
          var _callback = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee() {
            var container, json, attachments;
            return _regenerator.default.wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  container = currentElement.getContainer();
                  json = container.model.toJSON({
                    remove: ['default']
                  });
                  attachments = [{
                    type: 'json',
                    previewHTML: '',
                    content: json,
                    label: container.model.get('title'),
                    source: _attachments.USER_VARIATION_SOURCE
                  }];
                  (0, _editorIntegration.renderLayoutApp)({
                    parentContainer: container.parent,
                    mode: _config.MODE_VARIATION,
                    at: container.view._index,
                    attachments: attachments,
                    onSelect: function onSelect() {
                      container.view.$el.hide();
                    },
                    onClose: function onClose() {
                      container.view.$el.show();
                    },
                    onInsert: function onInsert(template) {
                      (0, _editorIntegration.importToEditor)({
                        parentContainer: container.parent,
                        at: container.view._index,
                        template: template,
                        historyTitle: (0, _i18n.__)('AI Variation', 'elementor'),
                        replace: true
                      });
                    }
                  });
                case 4:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          }));
          function callback() {
            return _callback.apply(this, arguments);
          }
          return callback;
        }()
      };
      if (!((_ElementorAiConfig = ElementorAiConfig) !== null && _ElementorAiConfig !== void 0 && (_ElementorAiConfig = _ElementorAiConfig.usage) !== null && _ElementorAiConfig !== void 0 && _ElementorAiConfig.hasAiSubscription)) {
        var svg = "\n\t\t\t<svg viewBox=\"0 0 24 24\">\n\t\t\t\t<path d=\"M12 5.25C12.2508 5.25 12.485 5.37533 12.6241 5.58397L16.1703 10.9033L20.5315 7.41435C20.7777\n\t\t\t\t7.21743 21.1207 7.19544 21.39 7.35933C21.6592 7.52321 21.7973 7.83798 21.7355 8.14709L19.7355\n\t\t\t\t18.1471C19.6654 18.4977 19.3576 18.75 19 18.75H5.00004C4.64253 18.75 4.33472 18.4977 4.26461\n\t\t\t\t18.1471L2.2646 8.14709C2.20278 7.83798 2.34084 7.52321 2.61012 7.35933C2.8794 7.19544 3.22241\n\t\t\t\t7.21743 3.46856 7.41435L7.82977 10.9033L11.376 5.58397C11.5151 5.37533 11.7493 5.25 12 5.25ZM12\n\t\t\t\t7.35208L8.62408 12.416C8.50748 12.5909 8.32282 12.7089 8.1151 12.7411C7.90738 12.7734 7.69566\n\t\t\t\t12.717 7.53152 12.5857L4.13926 9.87185L5.61489 17.25H18.3852L19.8608 9.87185L16.4686 12.5857C16.3044\n\t\t\t\t12.717 16.0927 12.7734 15.885 12.7411C15.6773 12.7089 15.4926 12.5909 15.376 12.416L12 7.35208Z\">\n\t\t\t\t</path>\n    \t\t</svg>";
        contextMenu.shortcut = "<div class=\"elementor-context-menu-list__item__ai-badge\">".concat(svg, "</div>");
      }

      // Add on top of save group actions
      saveGroup.actions.unshift(contextMenu);
      return groups;
    });
    return _this;
  }
  (0, _inherits2.default)(Module, _elementorModules$edi);
  return (0, _createClass2.default)(Module, [{
    key: "onElementorInit",
    value: function onElementorInit() {
      var _this2 = this;
      elementor.hooks.addFilter('views/add-section/behaviors', this.registerAiLayoutBehavior);
      elementor.hooks.addFilter('elements/container/contextMenuGroups', this.registerVariationsContextMenu);
      elementor.hooks.addFilter('elementor/editor/template-library/template/behaviors', this.registerLibraryActionButtonBehavior);
      elementor.hooks.addFilter('elementor/editor/template-library/template/action-button', this.filterLibraryActionButtonTemplate, 11);
      $e.commands.register('library', 'generate-ai-variation', function (args) {
        return _this2.applyTemplate(args);
      });
    }
  }, {
    key: "applyTemplate",
    value: function applyTemplate(args) {
      window.postMessage({
        type: 'library/attach:start'
      });
      $e.components.get('library').downloadTemplate(args, function (data) {
        var model = args.model;
        window.postMessage({
          type: 'library/attach',
          json: data.content[0],
          html: "<img src=\"".concat(model.get('thumbnail'), "\" />"),
          label: "".concat(model.get('template_id'), " - ").concat(model.get('title')),
          source: _attachments.ELEMENTOR_LIBRARY_SOURCE
        }, window.location.origin);
      });
    }
  }, {
    key: "registerLibraryActionButtonBehavior",
    value: function registerLibraryActionButtonBehavior(behaviors) {
      behaviors.applyAiTemplate = {
        behaviorClass: _applyTemplateForAiBehavior.default
      };
      return behaviors;
    }
  }, {
    key: "registerAiLayoutBehavior",
    value: function registerAiLayoutBehavior(behaviors) {
      behaviors.ai = {
        behaviorClass: _aiLayoutBehavior.default,
        context: {
          documentType: window.elementor.documents.getCurrent().config.type
        }
      };
      return behaviors;
    }
  }, {
    key: "filterLibraryActionButtonTemplate",
    value: function filterLibraryActionButtonTemplate(viewId) {
      var modalConfig = $e.components.get('library').manager.modalConfig;
      var originalCoreViewId = '#tmpl-elementor-template-library-insert-button';
      if (originalCoreViewId !== viewId) {
        return viewId;
      }
      if ($e.routes.current.library !== 'library/templates/blocks') {
        return viewId;
      }
      if (AI_ATTACHMENT === modalConfig.mode) {
        viewId = '#tmpl-elementor-template-library-apply-ai-button';
      } else {
        viewId = '#tmpl-elementor-template-library-insert-and-ai-variations-buttons';
      }
      return viewId;
    }
  }]);
}(elementorModules.editor.utils.Module);
new Module();
})();

/******/ })()
;
//# sourceMappingURL=ai-layout.js.map