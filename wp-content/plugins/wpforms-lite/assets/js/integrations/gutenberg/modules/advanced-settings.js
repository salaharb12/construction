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
export default ( function( $ ) {
	/**
	 * WP core components.
	 *
	 * @since 1.8.8
	 */
	const { addFilter } = wp.hooks;
	const { createHigherOrderComponent } = wp.compose;
	const { Fragment }	= wp.element;
	const { InspectorAdvancedControls } = wp.blockEditor || wp.editor;
	const { TextareaControl } = wp.components;

	/**
	 * Localized data aliases.
	 *
	 * @since 1.8.8
	 */
	const { strings } = wpforms_gutenberg_form_selector;

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	const app = {
		/**
		 * Initialize module.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} commonModule Common module.
		 */
		init( commonModule ) {
			app.common = commonModule;

			app.hooks();
			app.events();
		},

		/**
		 * Hooks.
		 *
		 * @since 1.8.8
		 */
		hooks() {
			addFilter(
				'editor.BlockEdit',
				'editorskit/custom-advanced-control',
				app.withAdvancedControls
			);
		},

		/**
		 * Events.
		 *
		 * @since 1.8.8
		 */
		events() {
			$( document )
				.on( 'focus click', 'textarea', app.copyPasteFocus );
		},

		/**
		 * Copy / Paste Style Settings textarea focus event.
		 *
		 * @since 1.8.8
		 */
		copyPasteFocus() {
			const $input = $( this );

			if ( $input.siblings( 'label' ).text() === strings.copy_paste_settings ) {
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
		getFields( props ) {
			// Proceed only for WPForms block.
			if ( props?.name !== 'wpforms/form-selector' ) {
				return null;
			}

			// Common event handlers.
			const handlers = app.common.getSettingsFieldsHandlers( props );

			return (
				<InspectorAdvancedControls>
					<div className={ app.common.getPanelClass( props ) + ' advanced' }>
						<TextareaControl
							className="wpforms-gutenberg-form-selector-custom-css"
							label={ strings.custom_css }
							rows="5"
							spellCheck="false"
							value={ props.attributes.customCss }
							onChange={ ( value ) => handlers.attrChange( 'customCss', value ) }
						/>
						<div className="wpforms-gutenberg-form-selector-legend" dangerouslySetInnerHTML={ { __html: strings.custom_css_notice } }></div>
						<TextareaControl
							className="wpforms-gutenberg-form-selector-copy-paste-settings"
							label={ strings.copy_paste_settings }
							rows="4"
							spellCheck="false"
							value={ props.attributes.copyPasteJsonValue }
							onChange={ ( value ) => handlers.pasteSettings( value ) }
						/>
						<div className="wpforms-gutenberg-form-selector-legend" dangerouslySetInnerHTML={ { __html: strings.copy_paste_notice } }></div>
					</div>
				</InspectorAdvancedControls>
			);
		},

		/**
		 * Add controls on Advanced Settings Panel.
		 *
		 * @param {Function} BlockEdit Block edit component.
		 *
		 * @return {Function} BlockEdit Modified block edit component.
		 */
		withAdvancedControls: createHigherOrderComponent(
			( BlockEdit ) => {
				return ( props ) => {
					return (
						<Fragment>
							<BlockEdit { ...props } />
							{ app.getFields( props ) }
						</Fragment>
					);
				};
			},
			'withAdvancedControls'
		),
	};

	// Provide access to public functions/properties.
	return app;
}( jQuery ) );
