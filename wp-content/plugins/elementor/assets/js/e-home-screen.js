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

/***/ "../modules/home/assets/js/components/addons-section.js":
/*!**************************************************************!*\
  !*** ../modules/home/assets/js/components/addons-section.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var PropTypes = __webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js");


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _objectDestructuringEmpty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectDestructuringEmpty */ "../node_modules/@babel/runtime/helpers/objectDestructuringEmpty.js"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _List = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/List */ "@elementor/ui/List"));
var _Link = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/Link */ "@elementor/ui/Link"));
var _Button = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/Button */ "@elementor/ui/Button"));
var _Card = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/Card */ "@elementor/ui/Card"));
var _CardActions = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/CardActions */ "@elementor/ui/CardActions"));
var _CardContent = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/CardContent */ "@elementor/ui/CardContent"));
var _CardMedia = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/CardMedia */ "@elementor/ui/CardMedia"));
var Addons = function Addons(_ref) {
  var props = (0, _extends2.default)({}, ((0, _objectDestructuringEmpty2.default)(_ref), _ref));
  var domain = props.adminUrl.replace('wp-admin/', '');
  var addonsArray = props.addonsData.repeater;
  var cardsPerRow = 3 === addonsArray.length ? 3 : 2;
  return /*#__PURE__*/_react.default.createElement(_ui.Paper, {
    elevation: 0,
    sx: {
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.Box, null, /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "h6"
  }, props.addonsData.header.title), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, props.addonsData.header.description)), /*#__PURE__*/_react.default.createElement(_List.default, {
    sx: {
      display: 'grid',
      gridTemplateColumns: {
        md: "repeat(".concat(cardsPerRow, ", 1fr)"),
        xs: 'repeat(1, 1fr)'
      },
      gap: 2
    }
  }, addonsArray.map(function (item) {
    var linkTarget = item.hasOwnProperty('target') ? item.target : '_blank';
    return /*#__PURE__*/_react.default.createElement(_Card.default, {
      key: item.title,
      elevation: 0,
      sx: {
        display: 'flex',
        border: 1,
        borderRadius: 1,
        borderColor: 'action.focus'
      }
    }, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
      sx: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 3,
        p: 3
      }
    }, /*#__PURE__*/_react.default.createElement(_ui.Box, null, /*#__PURE__*/_react.default.createElement(_CardMedia.default, {
      image: item.image,
      sx: {
        height: '58px',
        width: '58px',
        mb: 2
      }
    }), /*#__PURE__*/_react.default.createElement(_ui.Box, null, /*#__PURE__*/_react.default.createElement(_ui.Typography, {
      variant: "subtitle2"
    }, item.title), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
      variant: "body2",
      color: "text.secondary"
    }, item.description))), /*#__PURE__*/_react.default.createElement(_CardActions.default, {
      sx: {
        p: 0
      }
    }, /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "outlined",
      size: "small",
      color: "promotion",
      href: item.url,
      target: linkTarget
    }, item.button_label))));
  })), /*#__PURE__*/_react.default.createElement(_Link.default, {
    variant: "body2",
    color: "info.main",
    underline: "none",
    href: "".concat(domain).concat(props.addonsData.footer.file_path)
  }, props.addonsData.footer.label));
};
var _default = exports["default"] = Addons;
Addons.propTypes = {
  addonsData: PropTypes.object.isRequired,
  adminUrl: PropTypes.string.isRequired
};

/***/ }),

/***/ "../modules/home/assets/js/components/create-new-page-dialog.js":
/*!**********************************************************************!*\
  !*** ../modules/home/assets/js/components/create-new-page-dialog.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var __ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n")["__"];
/* provided dependency */ var PropTypes = __webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js");


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _DialogHeader = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/DialogHeader */ "@elementor/ui/DialogHeader"));
var _DialogHeaderGroup = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/DialogHeaderGroup */ "@elementor/ui/DialogHeaderGroup"));
var _DialogTitle = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/DialogTitle */ "@elementor/ui/DialogTitle"));
var _DialogContent = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/DialogContent */ "@elementor/ui/DialogContent"));
var _DialogContentText = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/DialogContentText */ "@elementor/ui/DialogContentText"));
var _TextField = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/TextField */ "@elementor/ui/TextField"));
var _DialogActions = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/DialogActions */ "@elementor/ui/DialogActions"));
var _Button = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/Button */ "@elementor/ui/Button"));
var _Dialog = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/Dialog */ "@elementor/ui/Dialog"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var CreateNewPageDialog = function CreateNewPageDialog(_ref) {
  var url = _ref.url,
    isOpen = _ref.isOpen,
    closedDialogCallback = _ref.closedDialogCallback;
  var _React$useState = _react.default.useState(false),
    _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
    open = _React$useState2[0],
    setOpen = _React$useState2[1];
  var _React$useState3 = _react.default.useState(''),
    _React$useState4 = (0, _slicedToArray2.default)(_React$useState3, 2),
    pageName = _React$useState4[0],
    setPageName = _React$useState4[1];
  (0, _react.useEffect)(function () {
    setOpen(isOpen);
  }, [isOpen]);
  var handleDialogClose = function handleDialogClose() {
    setOpen(false);
    closedDialogCallback();
  };
  var handleChange = function handleChange(event) {
    var urlParams = new URLSearchParams();
    urlParams.append('post_data[post_title]', event.target.value);
    setPageName(urlParams.toString());
  };
  return /*#__PURE__*/_react.default.createElement(_Dialog.default, {
    open: open,
    onClose: handleDialogClose,
    maxWidth: "xs",
    width: "xs",
    fullWidth: true
  }, /*#__PURE__*/_react.default.createElement(_DialogHeader.default, null, /*#__PURE__*/_react.default.createElement(_DialogHeaderGroup.default, null, /*#__PURE__*/_react.default.createElement(_DialogTitle.default, null, __('Name your page', 'elementor')))), /*#__PURE__*/_react.default.createElement(_DialogContent.default, {
    dividers: true
  }, /*#__PURE__*/_react.default.createElement(_DialogContentText.default, {
    sx: {
      mb: 2
    }
  }, __('To proceed, please name your first page,', 'elementor'), /*#__PURE__*/_react.default.createElement("br", null), __('or rename it later.', 'elementor')), /*#__PURE__*/_react.default.createElement(_TextField.default, {
    onChange: handleChange,
    fullWidth: true,
    placeholder: __('New Page', 'elementor')
  })), /*#__PURE__*/_react.default.createElement(_DialogActions.default, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
    onClick: handleDialogClose,
    color: "secondary"
  }, __('Cancel', 'elementor')), /*#__PURE__*/_react.default.createElement(_Button.default, {
    variant: "contained",
    href: pageName ? url + '&' + pageName : url,
    target: "_blank"
  }, __('Save', 'elementor'))));
};
var _default = exports["default"] = CreateNewPageDialog;
CreateNewPageDialog.propTypes = {
  url: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closedDialogCallback: PropTypes.func.isRequired
};

/***/ }),

/***/ "../modules/home/assets/js/components/external-links-section.js":
/*!**********************************************************************!*\
  !*** ../modules/home/assets/js/components/external-links-section.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var PropTypes = __webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js");


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _objectDestructuringEmpty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectDestructuringEmpty */ "../node_modules/@babel/runtime/helpers/objectDestructuringEmpty.js"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _List = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/List */ "@elementor/ui/List"));
var _ListItemButton = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/ListItemButton */ "@elementor/ui/ListItemButton"));
var _ListItemText = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/ListItemText */ "@elementor/ui/ListItemText"));
var _Divider = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/Divider */ "@elementor/ui/Divider"));
var ExternalLinksSection = function ExternalLinksSection(_ref) {
  var props = (0, _extends2.default)({}, ((0, _objectDestructuringEmpty2.default)(_ref), _ref));
  return /*#__PURE__*/_react.default.createElement(_ui.Paper, {
    elevation: 0,
    sx: {
      px: 3
    }
  }, /*#__PURE__*/_react.default.createElement(_List.default, null, props.externalLinksData.map(function (item, index) {
    return /*#__PURE__*/_react.default.createElement(_ui.Box, {
      key: item.label
    }, /*#__PURE__*/_react.default.createElement(_ListItemButton.default, {
      href: item.url,
      target: "_blank",
      sx: {
        '&:hover': {
          backgroundColor: 'initial'
        },
        gap: 2,
        px: 0,
        py: 2
      }
    }, /*#__PURE__*/_react.default.createElement(_ui.Box, {
      component: "img",
      src: item.image,
      sx: {
        width: '38px'
      }
    }), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
      sx: {
        color: 'text.secondary'
      },
      primary: item.label
    })), index < props.externalLinksData.length - 1 && /*#__PURE__*/_react.default.createElement(_Divider.default, null));
  })));
};
var _default = exports["default"] = ExternalLinksSection;
ExternalLinksSection.propTypes = {
  externalLinksData: PropTypes.array.isRequired
};

/***/ }),

/***/ "../modules/home/assets/js/components/get-started-list-item.js":
/*!*********************************************************************!*\
  !*** ../modules/home/assets/js/components/get-started-list-item.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var PropTypes = __webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js");


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "../node_modules/@babel/runtime/helpers/slicedToArray.js"));
var _ListItem = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/ListItem */ "@elementor/ui/ListItem"));
var _ListItemText = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/ListItemText */ "@elementor/ui/ListItemText"));
var _Link = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/Link */ "@elementor/ui/Link"));
var _Box = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/Box */ "@elementor/ui/Box"));
var _createNewPageDialog = _interopRequireDefault(__webpack_require__(/*! ./create-new-page-dialog */ "../modules/home/assets/js/components/create-new-page-dialog.js"));
var GetStartedListItem = function GetStartedListItem(_ref) {
  var item = _ref.item,
    image = _ref.image,
    adminUrl = _ref.adminUrl;
  var url = item.is_relative_url ? adminUrl + item.url : item.url;
  var _React$useState = _react.default.useState(false),
    _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
    isOpen = _React$useState2[0],
    openDialog = _React$useState2[1];
  var handleLinkClick = function handleLinkClick(event) {
    if (!item.new_page) {
      return;
    }
    event.preventDefault();
    openDialog(true);
  };
  return /*#__PURE__*/_react.default.createElement(_ListItem.default, {
    alignItems: "flex-start",
    sx: {
      gap: 1,
      p: 0,
      maxWidth: '150px'
    }
  }, /*#__PURE__*/_react.default.createElement(_Box.default, {
    component: "img",
    src: image
  }), /*#__PURE__*/_react.default.createElement(_Box.default, null, /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
    primary: item.title,
    primaryTypographyProps: {
      variant: 'subtitle1'
    },
    sx: {
      my: 0
    }
  }), /*#__PURE__*/_react.default.createElement(_Link.default, {
    variant: "body2",
    color: item.title_small_color ? item.title_small_color : 'text.tertiary',
    underline: "hover",
    href: url,
    target: "_blank",
    onClick: handleLinkClick
  }, item.title_small)), item.new_page && /*#__PURE__*/_react.default.createElement(_createNewPageDialog.default, {
    url: url,
    isOpen: isOpen,
    closedDialogCallback: function closedDialogCallback() {
      return openDialog(false);
    }
  }));
};
var _default = exports["default"] = GetStartedListItem;
GetStartedListItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    title_small: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    new_page: PropTypes.bool,
    is_relative_url: PropTypes.bool,
    title_small_color: PropTypes.string
  }).isRequired,
  adminUrl: PropTypes.string.isRequired,
  image: PropTypes.string
};

/***/ }),

/***/ "../modules/home/assets/js/components/get-started-section.js":
/*!*******************************************************************!*\
  !*** ../modules/home/assets/js/components/get-started-section.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var PropTypes = __webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js");


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _objectDestructuringEmpty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectDestructuringEmpty */ "../node_modules/@babel/runtime/helpers/objectDestructuringEmpty.js"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _List = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/List */ "@elementor/ui/List"));
var _getStartedListItem = _interopRequireDefault(__webpack_require__(/*! ./get-started-list-item */ "../modules/home/assets/js/components/get-started-list-item.js"));
var GetStarted = function GetStarted(_ref) {
  var props = (0, _extends2.default)({}, ((0, _objectDestructuringEmpty2.default)(_ref), _ref));
  return /*#__PURE__*/_react.default.createElement(_ui.Paper, {
    elevation: 0,
    sx: {
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.Box, null, /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "h6"
  }, props.getStartedData.header.title), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, props.getStartedData.header.description)), /*#__PURE__*/_react.default.createElement(_List.default, {
    sx: {
      display: 'grid',
      gridTemplateColumns: {
        md: 'repeat(4, 1fr)',
        xs: 'repeat(2, 1fr)'
      },
      columnGap: {
        md: 9,
        xs: 7
      },
      rowGap: 3
    }
  }, props.getStartedData.repeater.map(function (item) {
    return /*#__PURE__*/_react.default.createElement(_getStartedListItem.default, {
      key: item.title,
      item: item,
      image: item.image,
      adminUrl: props.adminUrl
    });
  })));
};
var _default = exports["default"] = GetStarted;
GetStarted.propTypes = {
  getStartedData: PropTypes.object.isRequired,
  adminUrl: PropTypes.string.isRequired
};

/***/ }),

/***/ "../modules/home/assets/js/components/home-screen.js":
/*!***********************************************************!*\
  !*** ../modules/home/assets/js/components/home-screen.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var PropTypes = __webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js");


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _topSection = _interopRequireDefault(__webpack_require__(/*! ./top-section */ "../modules/home/assets/js/components/top-section.js"));
var _sidebarPromotion = _interopRequireDefault(__webpack_require__(/*! ./sidebar-promotion */ "../modules/home/assets/js/components/sidebar-promotion.js"));
var _addonsSection = _interopRequireDefault(__webpack_require__(/*! ./addons-section */ "../modules/home/assets/js/components/addons-section.js"));
var _externalLinksSection = _interopRequireDefault(__webpack_require__(/*! ./external-links-section */ "../modules/home/assets/js/components/external-links-section.js"));
var _getStartedSection = _interopRequireDefault(__webpack_require__(/*! ./get-started-section */ "../modules/home/assets/js/components/get-started-section.js"));
var HomeScreen = function HomeScreen(props) {
  var hasSidebarUpgrade = props.homeScreenData.hasOwnProperty('sidebar_upgrade');
  return /*#__PURE__*/ /*  Box wrapper around the Container is needed to neutralize wp-content area left-padding */_react.default.createElement(_ui.Box, {
    sx: {
      pr: 1
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.Container, {
    disableGutters: true,
    maxWidth: "lg",
    sx: {
      display: 'flex',
      flexDirection: 'column',
      gap: {
        xs: 1,
        md: 3
      },
      pt: {
        xs: 2,
        md: 6
      },
      pb: 2
    }
  }, /*#__PURE__*/_react.default.createElement(_topSection.default, {
    topData: props.homeScreenData.top_with_licences,
    createNewPageUrl: props.homeScreenData.create_new_page_url
  }), /*#__PURE__*/_react.default.createElement(_ui.Box, {
    sx: {
      display: 'flex',
      flexDirection: {
        xs: 'column',
        sm: 'row'
      },
      justifyContent: 'space-between',
      gap: 3
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    sx: {
      flex: 1,
      gap: 3
    }
  }, /*#__PURE__*/_react.default.createElement(_getStartedSection.default, {
    getStartedData: props.homeScreenData.get_started,
    adminUrl: props.adminUrl
  }), /*#__PURE__*/_react.default.createElement(_addonsSection.default, {
    addonsData: props.homeScreenData.add_ons,
    adminUrl: props.adminUrl
  })), /*#__PURE__*/_react.default.createElement(_ui.Container, {
    maxWidth: "xs",
    disableGutters: true,
    sx: {
      width: {
        sm: '305px'
      },
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, hasSidebarUpgrade && /*#__PURE__*/_react.default.createElement(_sidebarPromotion.default, {
    sideData: props.homeScreenData.sidebar_upgrade
  }), /*#__PURE__*/_react.default.createElement(_externalLinksSection.default, {
    externalLinksData: props.homeScreenData.external_links
  })))));
};
HomeScreen.propTypes = {
  homeScreenData: PropTypes.object,
  adminUrl: PropTypes.string
};
var _default = exports["default"] = HomeScreen;

/***/ }),

/***/ "../modules/home/assets/js/components/sidebar-promotion.js":
/*!*****************************************************************!*\
  !*** ../modules/home/assets/js/components/sidebar-promotion.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var PropTypes = __webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js");


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _objectDestructuringEmpty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectDestructuringEmpty */ "../node_modules/@babel/runtime/helpers/objectDestructuringEmpty.js"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _Button = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/Button */ "@elementor/ui/Button"));
var _List = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/List */ "@elementor/ui/List"));
var _ListItem = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/ListItem */ "@elementor/ui/ListItem"));
var _ListItemText = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/ListItemText */ "@elementor/ui/ListItemText"));
var _sideBarCheckIcon = _interopRequireDefault(__webpack_require__(/*! ../icons/side-bar-check-icon */ "../modules/home/assets/js/icons/side-bar-check-icon.js"));
var SideBarPromotion = function SideBarPromotion(_ref) {
  var props = (0, _extends2.default)({}, ((0, _objectDestructuringEmpty2.default)(_ref), _ref));
  return /*#__PURE__*/_react.default.createElement(_ui.Paper, {
    elevation: 0,
    sx: {
      p: 3
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    gap: 1.5,
    sx: {
      alignItems: 'center',
      textAlign: 'center',
      pb: 4
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.Box, {
    component: "img",
    src: props.sideData.header.image
  }), /*#__PURE__*/_react.default.createElement(_ui.Box, null, /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "h6"
  }, props.sideData.header.title), /*#__PURE__*/_react.default.createElement(_ui.Typography, {
    variant: "body2",
    color: "text.secondary"
  }, props.sideData.header.description)), /*#__PURE__*/_react.default.createElement(_Button.default, {
    variant: "contained",
    size: "medium",
    color: "promotion",
    href: props.sideData.cta.url,
    startIcon: /*#__PURE__*/_react.default.createElement(_ui.Box, {
      component: "img",
      src: props.sideData.cta.image,
      sx: {
        width: '16px'
      }
    }),
    target: "_blank",
    sx: {
      maxWidth: 'fit-content'
    }
  }, props.sideData.cta.label)), /*#__PURE__*/_react.default.createElement(_List.default, {
    sx: {
      p: 0
    }
  }, props.sideData.repeater.map(function (item, index) {
    return /*#__PURE__*/_react.default.createElement(_ListItem.default, {
      key: index,
      sx: {
        p: 0,
        gap: 1
      }
    }, /*#__PURE__*/_react.default.createElement(_sideBarCheckIcon.default, null), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
      primaryTypographyProps: {
        variant: 'body2'
      },
      primary: item.title
    }));
  })));
};
var _default = exports["default"] = SideBarPromotion;
SideBarPromotion.propTypes = {
  sideData: PropTypes.object.isRequired
};

/***/ }),

/***/ "../modules/home/assets/js/components/top-section.js":
/*!***********************************************************!*\
  !*** ../modules/home/assets/js/components/top-section.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var PropTypes = __webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js");


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _objectDestructuringEmpty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectDestructuringEmpty */ "../node_modules/@babel/runtime/helpers/objectDestructuringEmpty.js"));
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _Typography = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/Typography */ "@elementor/ui/Typography"));
var _Button = _interopRequireDefault(__webpack_require__(/*! @elementor/ui/Button */ "@elementor/ui/Button"));
var _youtubeIcon = _interopRequireDefault(__webpack_require__(/*! ../icons/youtube-icon */ "../modules/home/assets/js/icons/youtube-icon.js"));
var TopSection = function TopSection(_ref) {
  var props = (0, _extends2.default)({}, ((0, _objectDestructuringEmpty2.default)(_ref), _ref));
  return /*#__PURE__*/_react.default.createElement(_ui.Paper, {
    elevation: 0,
    sx: {
      display: 'flex',
      flexDirection: {
        xs: 'column',
        sm: 'row'
      },
      justifyContent: 'space-between',
      py: {
        xs: 3,
        md: 3
      },
      px: {
        xs: 3,
        md: 4
      },
      gap: {
        xs: 2,
        sm: 3,
        lg: 22
      }
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.Stack, {
    gap: 3,
    justifyContent: "center"
  }, /*#__PURE__*/_react.default.createElement(_ui.Box, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6"
  }, props.topData.title), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2",
    color: "secondary"
  }, props.topData.description)), /*#__PURE__*/_react.default.createElement(_ui.Box, {
    sx: {
      display: 'flex',
      gap: 1
    }
  }, /*#__PURE__*/_react.default.createElement(_Button.default, {
    variant: "contained",
    size: "small",
    href: props.createNewPageUrl,
    target: "_blank"
  }, props.topData.button_create_page_title), /*#__PURE__*/_react.default.createElement(_Button.default, {
    variant: "outlined",
    color: "secondary",
    size: "small",
    startIcon: /*#__PURE__*/_react.default.createElement(_youtubeIcon.default, null),
    href: props.topData.button_watch_url,
    target: "_blank"
  }, props.topData.button_watch_title))), /*#__PURE__*/_react.default.createElement(_ui.Box, {
    component: "iframe",
    src: "https://www.youtube.com/embed/".concat(props.topData.youtube_embed_id),
    title: "YouTube video player",
    frameBorder: "0",
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
    allowFullScreen: true,
    sx: {
      aspectRatio: '16/9',
      borderRadius: 1,
      display: 'flex',
      width: '100%',
      maxWidth: '365px'
    }
  }));
};
TopSection.propTypes = {
  topData: PropTypes.object.isRequired,
  createNewPageUrl: PropTypes.string.isRequired
};
var _default = exports["default"] = TopSection;

/***/ }),

/***/ "../modules/home/assets/js/icons/side-bar-check-icon.js":
/*!**************************************************************!*\
  !*** ../modules/home/assets/js/icons/side-bar-check-icon.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var React = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var SideBarCheckIcon = function SideBarCheckIcon(props) {
  return /*#__PURE__*/React.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M9.09013 3.69078C10.273 3.2008 11.5409 2.94861 12.8213 2.94861C14.1017 2.94861 15.3695 3.2008 16.5525 3.69078C17.7354 4.18077 18.8102 4.89895 19.7156 5.80432C20.621 6.70969 21.3391 7.78452 21.8291 8.96744C22.3191 10.1504 22.5713 11.4182 22.5713 12.6986C22.5713 13.979 22.3191 15.2468 21.8291 16.4298C21.3391 17.6127 20.621 18.6875 19.7156 19.5929C18.8102 20.4983 17.7354 21.2165 16.5525 21.7064C15.3695 22.1964 14.1017 22.4486 12.8213 22.4486C11.5409 22.4486 10.2731 22.1964 9.09013 21.7064C7.9072 21.2165 6.83237 20.4983 5.927 19.5929C5.02163 18.6875 4.30345 17.6127 3.81346 16.4298C3.32348 15.2468 3.07129 13.979 3.07129 12.6986C3.07129 11.4182 3.32348 10.1504 3.81346 8.96744C4.30345 7.78452 5.02163 6.70969 5.927 5.80432C6.83237 4.89895 7.9072 4.18077 9.09013 3.69078ZM12.8213 4.44861C11.7379 4.44861 10.6651 4.662 9.66415 5.0766C8.66321 5.4912 7.75374 6.09889 6.98766 6.86498C6.22157 7.63106 5.61388 8.54053 5.19928 9.54147C4.78468 10.5424 4.57129 11.6152 4.57129 12.6986C4.57129 13.782 4.78468 14.8548 5.19928 15.8557C5.61388 16.8567 6.22157 17.7662 6.98766 18.5322C7.75374 19.2983 8.66322 19.906 9.66415 20.3206C10.6651 20.7352 11.7379 20.9486 12.8213 20.9486C13.9047 20.9486 14.9775 20.7352 15.9784 20.3206C16.9794 19.906 17.8888 19.2983 18.6549 18.5322C19.421 17.7662 20.0287 16.8567 20.4433 15.8557C20.8579 14.8548 21.0713 13.782 21.0713 12.6986C21.0713 11.6152 20.8579 10.5424 20.4433 9.54147C20.0287 8.54053 19.421 7.63106 18.6549 6.86498C17.8888 6.09889 16.9794 5.4912 15.9784 5.0766C14.9775 4.662 13.9047 4.44861 12.8213 4.44861Z",
    fill: "#93003F"
  }), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M17.3213 9.69424C17.6142 9.98713 17.6142 10.462 17.3213 10.7549L12.3732 15.703C12.0803 15.9959 11.6054 15.9959 11.3125 15.703L8.83851 13.2289C8.54562 12.936 8.54562 12.4612 8.83851 12.1683C9.1314 11.8754 9.60628 11.8754 9.89917 12.1683L11.8429 14.112L16.2606 9.69424C16.5535 9.40135 17.0284 9.40135 17.3213 9.69424Z",
    fill: "#93003F"
  }));
};
var _default = exports["default"] = SideBarCheckIcon;

/***/ }),

/***/ "../modules/home/assets/js/icons/youtube-icon.js":
/*!*******************************************************!*\
  !*** ../modules/home/assets/js/icons/youtube-icon.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "../node_modules/@babel/runtime/helpers/typeof.js");
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "../node_modules/@babel/runtime/helpers/extends.js"));
var React = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var YoutubeIcon = function YoutubeIcon(props) {
  return /*#__PURE__*/React.createElement(_ui.SvgIcon, (0, _extends2.default)({
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M7 5.75C5.20507 5.75 3.75 7.20507 3.75 9V15C3.75 16.7949 5.20507 18.25 7 18.25H17C18.7949 18.25 20.25 16.7949 20.25 15V9C20.25 7.20507 18.7949 5.75 17 5.75H7ZM2.25 9C2.25 6.37665 4.37665 4.25 7 4.25H17C19.6234 4.25 21.75 6.37665 21.75 9V15C21.75 17.6234 19.6234 19.75 17 19.75H7C4.37665 19.75 2.25 17.6234 2.25 15V9ZM9.63048 8.34735C9.86561 8.21422 10.1542 8.21786 10.3859 8.35688L15.3859 11.3569C15.6118 11.4924 15.75 11.7366 15.75 12C15.75 12.2634 15.6118 12.5076 15.3859 12.6431L10.3859 15.6431C10.1542 15.7821 9.86561 15.7858 9.63048 15.6526C9.39534 15.5195 9.25 15.2702 9.25 15V9C9.25 8.7298 9.39534 8.48048 9.63048 8.34735ZM10.75 10.3246V13.6754L13.5423 12L10.75 10.3246Z"
  }));
};
var _default = exports["default"] = YoutubeIcon;

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

/***/ "@elementor/ui":
/*!*********************************!*\
  !*** external "elementorV2.ui" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui;

/***/ }),

/***/ "@elementor/ui/Box":
/*!****************************************!*\
  !*** external "elementorV2.ui['Box']" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['Box'];

/***/ }),

/***/ "@elementor/ui/Button":
/*!*******************************************!*\
  !*** external "elementorV2.ui['Button']" ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['Button'];

/***/ }),

/***/ "@elementor/ui/Card":
/*!*****************************************!*\
  !*** external "elementorV2.ui['Card']" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['Card'];

/***/ }),

/***/ "@elementor/ui/CardActions":
/*!************************************************!*\
  !*** external "elementorV2.ui['CardActions']" ***!
  \************************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['CardActions'];

/***/ }),

/***/ "@elementor/ui/CardContent":
/*!************************************************!*\
  !*** external "elementorV2.ui['CardContent']" ***!
  \************************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['CardContent'];

/***/ }),

/***/ "@elementor/ui/CardMedia":
/*!**********************************************!*\
  !*** external "elementorV2.ui['CardMedia']" ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['CardMedia'];

/***/ }),

/***/ "@elementor/ui/Dialog":
/*!*******************************************!*\
  !*** external "elementorV2.ui['Dialog']" ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['Dialog'];

/***/ }),

/***/ "@elementor/ui/DialogActions":
/*!**************************************************!*\
  !*** external "elementorV2.ui['DialogActions']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['DialogActions'];

/***/ }),

/***/ "@elementor/ui/DialogContent":
/*!**************************************************!*\
  !*** external "elementorV2.ui['DialogContent']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['DialogContent'];

/***/ }),

/***/ "@elementor/ui/DialogContentText":
/*!******************************************************!*\
  !*** external "elementorV2.ui['DialogContentText']" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['DialogContentText'];

/***/ }),

/***/ "@elementor/ui/DialogHeader":
/*!*************************************************!*\
  !*** external "elementorV2.ui['DialogHeader']" ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['DialogHeader'];

/***/ }),

/***/ "@elementor/ui/DialogHeaderGroup":
/*!******************************************************!*\
  !*** external "elementorV2.ui['DialogHeaderGroup']" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['DialogHeaderGroup'];

/***/ }),

/***/ "@elementor/ui/DialogTitle":
/*!************************************************!*\
  !*** external "elementorV2.ui['DialogTitle']" ***!
  \************************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['DialogTitle'];

/***/ }),

/***/ "@elementor/ui/Divider":
/*!********************************************!*\
  !*** external "elementorV2.ui['Divider']" ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['Divider'];

/***/ }),

/***/ "@elementor/ui/Link":
/*!*****************************************!*\
  !*** external "elementorV2.ui['Link']" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['Link'];

/***/ }),

/***/ "@elementor/ui/List":
/*!*****************************************!*\
  !*** external "elementorV2.ui['List']" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['List'];

/***/ }),

/***/ "@elementor/ui/ListItem":
/*!*********************************************!*\
  !*** external "elementorV2.ui['ListItem']" ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['ListItem'];

/***/ }),

/***/ "@elementor/ui/ListItemButton":
/*!***************************************************!*\
  !*** external "elementorV2.ui['ListItemButton']" ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['ListItemButton'];

/***/ }),

/***/ "@elementor/ui/ListItemText":
/*!*************************************************!*\
  !*** external "elementorV2.ui['ListItemText']" ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['ListItemText'];

/***/ }),

/***/ "@elementor/ui/TextField":
/*!**********************************************!*\
  !*** external "elementorV2.ui['TextField']" ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['TextField'];

/***/ }),

/***/ "@elementor/ui/Typography":
/*!***********************************************!*\
  !*** external "elementorV2.ui['Typography']" ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = elementorV2.ui['Typography'];

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

/***/ "../node_modules/@babel/runtime/helpers/objectDestructuringEmpty.js":
/*!**************************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/objectDestructuringEmpty.js ***!
  \**************************************************************************/
/***/ ((module) => {

function _objectDestructuringEmpty(t) {
  if (null == t) throw new TypeError("Cannot destructure " + t);
}
module.exports = _objectDestructuringEmpty, module.exports.__esModule = true, module.exports["default"] = module.exports;

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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************!*\
  !*** ../modules/home/assets/js/app.js ***!
  \****************************************/
/* provided dependency */ var PropTypes = __webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js");


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _react2 = _interopRequireDefault(__webpack_require__(/*! elementor-utils/react */ "../assets/dev/js/utils/react.js"));
var _ui = __webpack_require__(/*! @elementor/ui */ "@elementor/ui");
var _homeScreen = _interopRequireDefault(__webpack_require__(/*! ./components/home-screen */ "../modules/home/assets/js/components/home-screen.js"));
var App = function App(props) {
  return /*#__PURE__*/_react.default.createElement(_ui.DirectionProvider, {
    rtl: props.isRTL
  }, /*#__PURE__*/_react.default.createElement(_ui.LocalizationProvider, null, /*#__PURE__*/_react.default.createElement(_ui.ThemeProvider, {
    colorScheme: 'light'
  }, /*#__PURE__*/_react.default.createElement(_homeScreen.default, {
    homeScreenData: props.homeScreenData,
    adminUrl: props.adminUrl
  }))));
};
var isRTL = elementorCommon.config.isRTL,
  adminUrl = elementorAppConfig.admin_url,
  rootElement = document.querySelector('#e-home-screen');
App.propTypes = {
  isRTL: PropTypes.bool,
  adminUrl: PropTypes.string,
  homeScreenData: PropTypes.object
};
_react2.default.render(/*#__PURE__*/_react.default.createElement(App, {
  isRTL: isRTL,
  homeScreenData: elementorHomeScreenData,
  adminUrl: adminUrl
}), rootElement);
})();

/******/ })()
;
//# sourceMappingURL=e-home-screen.js.map