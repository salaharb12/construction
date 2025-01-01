/*! elementor - v3.26.0 - 22-12-2024 */
"use strict";
(self["webpackChunkelementor"] = self["webpackChunkelementor"] || []).push([["progress"],{

/***/ "../assets/dev/js/frontend/handlers/progress.js":
/*!******************************************************!*\
  !*** ../assets/dev/js/frontend/handlers/progress.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
class Progress extends elementorModules.frontend.handlers.Base {
  getDefaultSettings() {
    return {
      selectors: {
        progressNumber: '.elementor-progress-bar'
      }
    };
  }
  getDefaultElements() {
    const selectors = this.getSettings('selectors');
    return {
      $progressNumber: this.$element.find(selectors.progressNumber)
    };
  }
  onInit() {
    super.onInit();
    const observer = this.createObserver();
    observer.observe(this.elements.$progressNumber[0]);
  }
  createObserver() {
    const options = {
      root: null,
      threshold: 0,
      rootMargin: '0px'
    };
    return new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const $progressbar = this.elements.$progressNumber;
          $progressbar.css('width', $progressbar.data('max') + '%');
        }
      });
    }, options);
  }
}
exports["default"] = Progress;

/***/ })

}]);
//# sourceMappingURL=progress.fa9d02f64d572ab7c406.bundle.js.map