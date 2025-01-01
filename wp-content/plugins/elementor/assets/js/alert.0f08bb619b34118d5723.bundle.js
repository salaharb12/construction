/*! elementor - v3.26.0 - 22-12-2024 */
"use strict";
(self["webpackChunkelementor"] = self["webpackChunkelementor"] || []).push([["alert"],{

/***/ "../assets/dev/js/frontend/handlers/alert.js":
/*!***************************************************!*\
  !*** ../assets/dev/js/frontend/handlers/alert.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
class Alert extends elementorModules.frontend.handlers.Base {
  getDefaultSettings() {
    return {
      selectors: {
        dismissButton: '.elementor-alert-dismiss'
      }
    };
  }
  getDefaultElements() {
    const selectors = this.getSettings('selectors');
    return {
      $dismissButton: this.$element.find(selectors.dismissButton)
    };
  }
  bindEvents() {
    this.elements.$dismissButton.on('click', this.onDismissButtonClick.bind(this));
  }
  onDismissButtonClick() {
    this.$element.fadeOut();
  }
}
exports["default"] = Alert;

/***/ })

}]);
//# sourceMappingURL=alert.0f08bb619b34118d5723.bundle.js.map