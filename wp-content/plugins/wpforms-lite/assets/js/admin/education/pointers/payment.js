/* eslint-disable camelcase */
/* global ajaxurl, wpforms_education_pointers_payment */

// noinspection ES6ConvertVarToLetConst
/**
 * Module for handling education pointers related to payments in WPForms.
 *
 * @since 1.8.8
 */

// eslint-disable-next-line no-var
var WPFormsPointersPayment = window.WPFormsPointersPayment || ( function( document, window, $, l10n ) {
	/**
	 * Elements holder.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	const el = {};

	/**
	 * Runtime variables.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	const vars = {
		/**
		 * Unique ID for the pointer.
		 *
		 * @since 1.8.8
		 */
		pointerId: l10n.pointer,

		/**
		 * Cryptographic token for validating authorized Ajax data exchange.
		 *
		 * @since 1.8.8
		 */
		nonce: l10n.nonce,
	};

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.8
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.8.8
		 */
		init() {
			$( app.ready );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.8.8
		 */
		ready() {
			app.setup();
			app.bindEvents();
		},

		/**
		 * Setup. Prepare some variables.
		 *
		 * @since 1.8.8
		 */
		setup() {
			// Cache DOM elements.
			el.$document = $( document );
		},

		/**
		 * Bind events.
		 *
		 * @since 1.8.8
		 */
		bindEvents() {
			el.$document.on( 'click', '#toplevel_page_wpforms-overview [href$="-payments"], #wpforms-education-pointers-payments', app.handleOnClick );
		},

		/**
		 * Callback for clicking on the action link.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} event An event which takes place in the DOM.
		 */
		handleOnClick( event ) {
			// Prevent the default action.
			event.preventDefault();

			const $this = $( this );

			// Get the href attribute.
			const href = $this.attr( 'href' );

			// Return early if href is missing.
			if ( ! href ) {
				return;
			}

			// Hide the pointer before redirecting.
			$this.closest( '.wp-pointer-content' ).parent().hide();

			// Send AJAX request.
			$.post(
				ajaxurl,
				{
					pointer_id: vars.pointerId,
					_ajax_nonce: vars.nonce,
					action: 'wpforms_education_pointers_engagement',
				}
			).done( function() {
				window.location.href = href;
			} );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery, wpforms_education_pointers_payment ) );

// Initialize.
WPFormsPointersPayment.init();
