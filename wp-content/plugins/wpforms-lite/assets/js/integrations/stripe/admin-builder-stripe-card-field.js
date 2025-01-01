/* global wpforms_builder, wpforms_builder_stripe_card_field */

/**
 * WPForms Stripe Card Field function.
 *
 * @since 1.8.2
 */

'use strict';

var WPFormsStripeCardField = window.WPFormsStripeCardField || ( function( document, window, $ ) {

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.2
	 *
	 * @type {object}
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.8.2
		 */
		init: function() {

			app.bindUIActions();
		},

		/**
		 * Process various events as a response to UI interactions.
		 *
		 * @since 1.8.2
		 */
		bindUIActions: function() {

			$( document ).on( 'wpformsSaved', app.ajaxRequiredCheck );
			$( document ).on( 'wpformsSaved', app.paymentsEnabledCheck );

			$( document ).on( 'click', '#wpforms-add-fields-' + wpforms_builder_stripe_card_field.field_slug, app.stripeKeysCheck );
			$( document ).on( 'change', '.wpforms-field-option-stripe-credit-card .wpforms-field-option-row-sublabel_position select', app.sublabelPositionChange );
			$( document ).on( 'change', '.wpforms-field-option-stripe-credit-card .wpforms-field-option-row-link_email select', app.linkEmailChange );

			$( document ).on( 'wpformsFieldAdd', app.disableAddCardButton );
			$( document ).on( 'wpformsFieldDelete', app.enableAddCardButton );
			$( document ).on( 'wpformsFieldDelete', app.maybeResetLinkEmailField );
		},

		/**
		 * On form save notify users if AJAX submission is required.
		 *
		 * @since 1.8.2
		 */
		ajaxRequiredCheck: function() {

			if ( ! $( '.wpforms-field.wpforms-field-' + wpforms_builder_stripe_card_field.field_slug ).length ||
				$( '#wpforms-panel-field-settings-ajax_submit' ).is( ':checked' ) ) {
				return;
			}

			$.alert( {
				title: wpforms_builder.heads_up,
				content: wpforms_builder.stripe_ajax_required,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
			} );
		},

		/**
		 * On form save notify users if Stripe payments are not enabled.
		 *
		 * @since 1.8.2
		 */
		paymentsEnabledCheck: function() {

			if ( ! $( `.wpforms-field.wpforms-field-${ wpforms_builder_stripe_card_field.field_slug }:visible` ).length ||
				$( '#wpforms-panel-field-stripe-enable' ).is( ':checked' ) ||
				$( '#wpforms-panel-field-stripe-enable_one_time' ).is( ':checked' ) ||
				$( '#wpforms-panel-field-stripe-enable_recurring' ).is( ':checked' )
			) {
				return;
			}

			$.alert( {
				title: wpforms_builder.heads_up,
				content: wpforms_builder.payments_enabled_required,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
			} );
		},

		/**
		 * On adding Stripe Credit Card field notify users if Stripe keys are missing.
		 *
		 * @since 1.8.2
		 */
		stripeKeysCheck: function() {

			if ( ! $( this ).hasClass( 'stripe-keys-required' ) ) {
				return;
			}

			$.alert( {
				title: wpforms_builder.heads_up,
				content: wpforms_builder.stripe_keys_required,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
			} );
		},

		/**
		 * Disable "Add Card" button in the fields list.
		 *
		 * @since 1.8.2
		 *
		 * @param {object} e Event object.
		 * @param {number} id Field ID.
		 * @param {string} type Field type.
		 */
		disableAddCardButton: function( e, id, type ) {

			if ( wpforms_builder_stripe_card_field.field_slug === type ) {
				$( '#wpforms-add-fields-' + wpforms_builder_stripe_card_field.field_slug )
					.prop( 'disabled', true );
			}
		},

		/**
		 * Enable "Add Card" button in the fields list.
		 *
		 * @since 1.8.2
		 *
		 * @param {object} e Event object.
		 * @param {number} id Field ID.
		 * @param {string} type Field type.
		 */
		enableAddCardButton: function( e, id, type ) {

			if ( wpforms_builder_stripe_card_field.field_slug === type ) {
				$( '#wpforms-add-fields-' + wpforms_builder_stripe_card_field.field_slug )
					.prop( 'disabled', false );
			}
		},

		/**
		 * Switch sublabels preview mode.
		 *
		 * @since 1.8.2
		 */
		sublabelPositionChange: function() {

			const fieldId = $( this ).parent().data( 'field-id' ),
				$fieldPreview = $( `#wpforms-field-${fieldId}` ).find( '.wpforms-stripe-payment-element' );

			$fieldPreview.toggleClass( 'above' );
			$fieldPreview.toggleClass( 'floating' );
			$fieldPreview.find( 'select' ).val( $fieldPreview.hasClass( 'above' ) ? 'empty' : 'country' );
		},

		/**
		 * Switch Link Email Field mapping.
		 *
		 * @since 1.8.2
		 */
		linkEmailChange: function() {

			const fieldId = $( this ).parent().data( 'field-id' );

			$( `#wpforms-field-${fieldId}` ).find( '.wpforms-stripe-link-email' ).toggleClass( 'wpforms-hidden', $( this ).val() !== '' );
		},

		/**
		 * Maybe reset link email field if mapped email was removed.
		 *
		 * @since 1.8.2
		 *
		 * @param {object} e Event object.
		 * @param {number} id Field ID.
		 * @param {string} type Field type.
		 */
		maybeResetLinkEmailField: function( e, id, type ) {

			if ( type !== 'email' ) {
				return;
			}

			$( '.wpforms-field-option-stripe-credit-card .wpforms-field-option-row-link_email select' ).trigger( 'change' );
		},
	};

	// Provide access to public functions/properties.
	return app;

}( document, window, jQuery ) );

// Initialize.
WPFormsStripeCardField.init();
