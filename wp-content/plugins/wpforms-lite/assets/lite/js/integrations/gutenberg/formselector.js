/* jshint es3: false, esversion: 6 */

import education from '../../../../js/integrations/gutenberg/modules/education.js';
import common from '../../../../js/integrations/gutenberg/modules/common.js';
import themesPanel from '../../../../js/integrations/gutenberg/modules/themes-panel.js';
import containerStyles from '../../../../js/integrations/gutenberg/modules/container-styles.js';
import backgroundStyles from '../../../../js/integrations/gutenberg/modules/background-styles.js';
import buttonStyles from '../../../../js/integrations/gutenberg/modules/button-styles.js';
import advancedSettings from '../../../../js/integrations/gutenberg/modules/advanced-settings.js';
import fieldStyles from '../../../../js/integrations/gutenberg/modules/field-styles.js';

/**
 * Gutenberg editor block for Lite.
 *
 * @since 1.8.8
 */
const WPForms = window.WPForms || {};

WPForms.FormSelector = WPForms.FormSelector || ( function() {
	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	const app = {
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
		init() {
			app.education = education;
			app.common = common;
			app.panels.themes = themesPanel;
			app.panels.container = containerStyles;
			app.panels.background = backgroundStyles;
			app.panels.button = buttonStyles;
			app.panels.advanced = advancedSettings;
			app.panels.field = fieldStyles;

			const blockOptions = {
				panels: app.panels,
				getThemesPanel: app.panels.themes.getThemesPanel,
				getFieldStyles: app.panels.field.getFieldStyles,
				getContainerStyles: app.panels.container.getContainerStyles,
				getBackgroundStyles: app.panels.background.getBackgroundStyles,
				getButtonStyles: app.panels.button.getButtonStyles,
				getCommonAttributes: app.getCommonAttributes,
				setStylesHandlers: app.getStyleHandlers(),
				education: app.education,
			};

			// Initialize Advanced Settings module.
			app.panels.advanced.init( app.common );

			// Initialize block.
			app.common.init( blockOptions );
		},

		/**
		 * Get style handlers.
		 *
		 * @since 1.8.8
		 *
		 * @return {Object} Style handlers.
		 */
		getCommonAttributes() {
			return {
				...app.panels.field.getBlockAttributes(),
				...app.panels.container.getBlockAttributes(),
				...app.panels.background.getBlockAttributes(),
				...app.panels.button.getBlockAttributes(),
			};
		},

		/**
		 * Get style handlers.
		 *
		 * @since 1.8.8
		 *
		 * @return {Object} Style handlers.
		 */
		getStyleHandlers() {
			return {
				'background-image': app.panels.background.setContainerBackgroundImage,
				'background-position': app.panels.background.setContainerBackgroundPosition,
				'background-repeat': app.panels.background.setContainerBackgroundRepeat,
				'background-width': app.panels.background.setContainerBackgroundWidth,
				'background-height': app.panels.background.setContainerBackgroundHeight,
				'background-color': app.panels.background.setBackgroundColor,
				'background-url': app.panels.background.setBackgroundUrl,
			};
		},
	};

	// Provide access to public functions/properties.
	return app;
}() );

// Initialize.
WPForms.FormSelector.init();
