/* eslint-disable camelcase */
/* global wpforms_builder_email_template */

// noinspection ES6ConvertVarToLetConst
/**
 * Script for manipulating DOM events in the "Builder" settings page.
 * This script will be accessible in the "WPForms" → "Builder" → "Notifications" tab/page.
 *
 * @since 1.8.5
 */
// eslint-disable-next-line no-var
var WPFormsBuilderEmailTemplate = window.WPFormsBuilderEmailTemplate || ( function( document, window, $, l10n ) {
	/**
	 * Elements holder.
	 *
	 * @since 1.8.5
	 *
	 * @type {Object}
	 */
	const el = {};

	/**
	 * Runtime variables.
	 *
	 * @since 1.8.5
	 *
	 * @type {Object}
	 */
	const vars = {
		/**
		 * Modal instance.
		 *
		 * @since 1.8.5
		 */
		modal: null,

		/**
		 * Generic CSS class names for applying visual changes.
		 *
		 * @since 1.8.5
		 */
		classNames: {
			modalBox: 'wpforms-modal-content-box',
			modalOpen: 'wpforms-email-template-modal-open',
		},
	};

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.5
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.8.5
		 */
		init() {
			$( app.ready );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.8.5
		 */
		ready() {
			app.setup();
			app.bindEvents();
		},

		/**
		 * Setup. Prepare some variables.
		 *
		 * @since 1.8.5
		 */
		setup() {
			// Cache DOM elements.
			el.$document = $( document );
			el.$body = $( 'body' );
		},

		/**
		 * Bind events.
		 *
		 * @since 1.8.5
		 */
		bindEvents() {
			el.$document
				.on( 'change', '.wpforms-email-template-modal-content input[type="radio"]', app.handleOnChangeTemplate )
				.on( 'click', '.wpforms-all-email-template-modal', app.handleOnOpenModal );
		},

		/**
		 * Handle the "change" event for the template radio buttons.
		 * This function updates the select field based on the selected radio button.
		 *
		 * @since 1.8.5
		 *
		 * @param {Object} event The DOM event that triggered the function.
		 */
		handleOnChangeTemplate( event ) {
			// Prevent the default action, which is to handle the change event.
			event.preventDefault();

			// Extract the ID of the field from the element.
			const id = app.getIdFromElm( $( this ) );

			// Get the corresponding select field.
			const $field = $( `#wpforms-panel-field-notifications-${ id }-template` );

			// If the select field doesn't exist, no further action is needed.
			if ( ! $field.length ) {
				return;
			}

			// If the modal doesn't exist, no further action is needed.
			if ( ! vars.modal ) {
				return;
			}

			// Get the value of the radio button that triggered the change.
			const value = $( this ).val();

			// Update the select field with the selected value and trigger the change event.
			$field.val( value ).trigger( 'change' );

			// Close the modal.
			vars.modal.close();
		},

		/**
		 * Handle the "click" event for opening the modal.
		 * This will open the modal with the available templates.
		 *
		 * @since 1.8.5
		 */
		handleOnOpenModal() {
			// Get the email template modal template.
			const template = wp.template( 'wpforms-email-template-modal' );

			// If the template doesn't exist, exit the function.
			if ( ! template.length ) {
				return;
			}

			// Find the closest wrapper and select element.
			const $wrapper = $( this ).closest( '.wpforms-panel-field-email-template-wrap' );
			const $select = $wrapper.find( 'select' );

			// Get the selected value from the select element and its ID.
			const selected = $select.val() || '';
			const id = app.getIdFromElm( $select );

			// Extract relevant data from l10n.
			const { templates, is_pro } = l10n;

			// Prepare the data to be passed to the template.
			const data = { templates, selected, is_pro, id };

			// Generate the modal's content using the template and data.
			const content = template( data );

			// Open the modal.
			vars.modal = $.confirm( {
				content,
				title: '',
				boxWidth: 800,
				contentMaxHeight: 'none',
				backgroundDismiss: true,
				smoothContent: false,
				closeIcon: true,
				buttons: false,
				// Callback function before the modal opens.
				onOpenBefore() {
					this.$body.addClass( vars.classNames.modalBox );
					el.$body.addClass( vars.classNames.modalOpen );
				},
				// Callback function when the modal is closed.
				onClose() {
					el.$body.removeClass( vars.classNames.modalOpen );
				},
			} );
		},

		/**
		 * Get the ID from the element.
		 * This is a helper function for extracting the numeric ID from an element's ID attribute.
		 *
		 * @since 1.8.5
		 *
		 * @param {Object} $elm jQuery object representing the element.
		 *
		 * @return {number} The numeric ID extracted from the element's ID attribute.
		 */
		getIdFromElm( $elm ) {
			// Get the ID attribute from the element.
			const id = $elm.attr( 'id' );

			// If no ID attribute is found, return 0.
			if ( ! id ) {
				return 0;
			}

			// Extract and parse the numeric part from the ID.
			return parseInt( id.match( /\d+/ )[ 0 ], 10 );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery, wpforms_builder_email_template ) );

// Initialize.
WPFormsBuilderEmailTemplate.init();
