/* global wpforms, wpformsElementorVars, wpformsModernFileUpload, wpformsRecaptchaLoad, grecaptcha, WPFormsRepeaterField */

'use strict';

/**
 * WPForms integration with Elementor on the frontend.
 *
 * @since 1.6.2 Moved from `wpforms-elementor.js`
 */
var WPFormsElementorFrontend = window.WPFormsElementorFrontend || ( function( document, window, $ ) {

	/**
	 * Public functions and properties.
	 *
	 * @since 1.6.2
	 *
	 * @type {object}
	 */
	var app = {

		/**
		 * Flag to force load ChoicesJS.
		 *
		 * @since 1.9.0
		 *
		 * @type {boolean}
		 */
		forceLoadChoices: false,

		/**
		 * Start the engine.
		 *
		 * @since 1.6.2
		 */
		init: function() {

			app.events();
		},

		/**
		 * Register JS events.
		 *
		 * @since 1.6.2
		 */
		events: function() {

			window.addEventListener( 'elementor/popup/show', function( event ) {

				let $modal = $( '#elementor-popup-modal-' + event.detail.id ),
					$form  = $modal.find( '.wpforms-form' );

				if ( ! $form.length ) {
					return;
				}

				app.initFields( $form );
			} );

			// Force load ChoicesJS for elementor popup.
			$( document ).on( 'elementor/popup/show', () => {
				app.forceLoadChoices = true;

				wpforms.loadChoicesJS();
			} );

			$( document ).on( 'wpformsBeforeLoadElementChoices', ( event, el ) => {
				// Do not initialize on elementor popup.
				if ( ! $( el ).parents( 'div[data-elementor-type="popup"]' ).length || app.forceLoadChoices ) {
					return;
				}

				event.preventDefault();
			} );
		},

		/**
		 * Init all things for WPForms.
		 *
		 * @since 1.6.2
		 *
		 * @param {object} $form jQuery selector.
		 */
		initFields: function( $form ) {

			// Init WPForms things.
			wpforms.ready();

			// Init `Modern File Upload` field.
			if ( 'undefined' !== typeof wpformsModernFileUpload ) {
				wpformsModernFileUpload.init();
			}

			// Init CAPTCHA.
			if ( 'undefined' !== typeof wpformsRecaptchaLoad ) {
				if ( 'recaptcha' === wpformsElementorVars.captcha_provider && 'v3' === wpformsElementorVars.recaptcha_type ) {
					if ( 'undefined' !== typeof grecaptcha ) {
						grecaptcha.ready( wpformsRecaptchaLoad );
					}
				} else {
					wpformsRecaptchaLoad();
				}
			}

			// Init Repeater fields.
			if ( 'undefined' !== typeof WPFormsRepeaterField ) {
				WPFormsRepeaterField.ready();
			}

			// Register a custom event.
			$( document ).trigger( 'wpforms_elementor_form_fields_initialized', [ $form ] );
		},
	};

	return app;

}( document, window, jQuery ) );

// Initialize.
WPFormsElementorFrontend.init();
