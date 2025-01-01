/* global Stripe, wpforms, wpforms_settings, wpforms_stripe, WPForms */

'use strict';

/**
 * WPForms Stripe Elements function.
 *
 * @since 1.8.2
 */
var WPFormsStripeElements = window.WPFormsStripeElements || ( function( document, window, $ ) {

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.2
	 *
	 * @type {object}
	 */
	const app = {

		stripe: null,

		/**
		 * Number of page locked to switch.
		 *
		 * @since 1.8.2
		 *
		 * @type {int}
		 */
		lockedPageToSwitch: 0,

		/**
		 * Start the engine.
		 *
		 * @since 1.8.2
		 */
		init: function() {

			app.stripe = Stripe( // eslint-disable-line new-cap
				wpforms_stripe.publishable_key,
				{ 'locale': wpforms_stripe.data.element_locale }
			);

			$( document ).on( 'wpformsReady', function() {
				$( '.wpforms-stripe form' )
					.filter( ( _, form ) => typeof $( form ).data( 'formid' ) === 'number' ) // filter out forms which are locked (formid changed to 'locked-...').
					.each( app.setupStripeForm );
			} );

			$( document ).on( 'wpformsBeforePageChange', app.pageChange );
		},

		/**
		 * Setup and configure a Stripe form.
		 *
		 * @since 1.8.2
		 */
		setupStripeForm: function() {

			let $form = $( this );

			app.updateFormSubmitHandler( $form );

			$form.on( 'wpformsAjaxSubmitActionRequired', app.handleCardActionCallback );

			app.updateCardElementStylesModern( $form );
		},

		/**
		 * Setup, mount and configure Stripe Card Element.
		 *
		 * @since 1.8.2
		 *
		 * @param {jQuery} $form Form element.
		 * @param {object} formValidator jQuery Validator object.
		 *
		 * @returns {card|void} Stripe Card element.
		 */
		setupCardElement: function( $form, formValidator ) {

			const $hiddenInput = $form.find( '.wpforms-stripe-credit-card-hidden-input' );

			if ( ! $hiddenInput || $hiddenInput.length === 0 ) {
				return;
			}

			let cardElement =  $hiddenInput.data( 'stripe-element' );

			if ( cardElement ) {
				return cardElement;
			}

			let style = wpforms_stripe.data.element_style;

			if ( $.isEmptyObject( style ) ) {
				style = app.getElementStyleDefault( $hiddenInput );
			}

			let cardSettings = {
				classes       : wpforms_stripe.data.element_classes,
				hidePostalCode: true,
				style         : style,
			};

			cardElement = app.stripe.elements().create( 'card', cardSettings );

			cardElement.mount( $form.find( '.wpforms-field-stripe-credit-card-cardnumber' ).get( 0 ) );

			cardElement.on( 'change', function( e ) {

				if ( ! e.error ) {
					formValidator.hideThese( formValidator.errorsFor( $hiddenInput.get( 0 ) ) );
					return;
				}

				let message = e.error.message;

				if ( 'incomplete_number' === e.error.code || 'invalid_number' === e.error.code ) {
					message = wpforms_settings.val_creditcard;
				}

				app.displayStripeError( $form, message );
			} );

			$hiddenInput.data( 'stripe-element', cardElement );

			return cardElement;
		},

		/**
		 * Get default styles for card settings.
		 *
		 * @since 1.8.2
		 *
		 * @param {jQuery} $hiddenInput Input element.
		 *
		 * @returns {object|void} Base styles.
		 */
		getElementStyleDefault: function( $hiddenInput ) {

			if ( ! $hiddenInput || $hiddenInput.length === 0 ) {
				return;
			}

			const textColor = $hiddenInput.css( 'color' );
			const fontSize = $hiddenInput.css( 'font-size' );

			const style = {
				base: {
					fontSize,
					color: textColor,
					'::placeholder': {
						color: textColor,
						fontSize,
					},
				},
				invalid: {
					color: textColor,
				},
			};

			let fontFamily = $hiddenInput.css( 'font-family' );

			const regExp = /[“”<>!@$%^&*=~`|{}[\]]/;

			if ( regExp.test( fontFamily ) || fontFamily.indexOf( 'MS Shell Dlg' ) !== -1 ) {
				fontFamily = $( 'p' ).css( 'font-family' );
			}

			if ( ! regExp.test( fontFamily ) ) {
				style.base.fontFamily = fontFamily;
				style.base[ '::placeholder' ].fontFamily = fontFamily;
			}

			return style;
		},

		/**
		 * Update submitHandler for the forms containing Stripe.
		 *
		 * @since 1.8.2
		 *
		 * @param {jQuery} $form Form element.
		 */
		updateFormSubmitHandler: function( $form ) {

			let formValidator     = $form.validate(),
				formSubmitHandler = formValidator.settings.submitHandler,
				cardElement       = app.setupCardElement( $form, formValidator ),
				$stripeDiv        = $form.find( '.wpforms-field-stripe-credit-card-cardnumber' );

			// Replace the default submit handler.
			formValidator.settings.submitHandler = function() {

				let valid = $form.validate().form(),
					ccEmpty = $stripeDiv.hasClass( wpforms_stripe.data.element_classes.empty ),
					ccRequired = $stripeDiv.data( 'required' ),
					condHidden = $stripeDiv.closest( '.wpforms-field-stripe-credit-card' ).hasClass( 'wpforms-conditional-hide' ),
					processCard = false;

				if ( ! condHidden ) {
					processCard = ccRequired || ( ! ccEmpty && ! ccRequired );
				}

				if ( valid && processCard ) {

					$form.find( '.wpforms-submit' ).prop( 'disabled', true );
					app.createPaymentMethod( $form, cardElement, ccRequired, formSubmitHandler );

				} else if ( valid ) {

					// Form is valid, however no credit card to process.
					$form.find( '.wpforms-submit' ).prop( 'disabled', false );
					return formSubmitHandler( $form );

				} else {

					$form.find( '.wpforms-submit' ).prop( 'disabled', false );
					$form.validate().cancelSubmit = true;
				}
			};
		},

		/**
		 * Create a PaymentMethod out of card details provided.
		 *
		 * @since 1.8.2
		 *
		 * @param {jQuery}   $form             Form element.
		 * @param {card}     cardElement       Stripe Card element.
		 * @param {boolean}  ccRequired        Card field is required.
		 * @param {Function} formSubmitHandler jQuery Validation SubmitHandler function.
		 */
		createPaymentMethod: function( $form, cardElement, ccRequired, formSubmitHandler ) {

			app.stripe.createPaymentMethod( 'card', cardElement, {
				billing_details: {
					name: $form.find( '.wpforms-field-stripe-credit-card-cardname' ).val(),
				},
			} ).then( function( result ) {

				if ( result.error && ccRequired ) {
					$form.find( '.wpforms-submit' ).prop( 'disabled', false );
					app.displayStripeError( $form, result.error.message );
					$form.validate().cancelSubmit = true;
					return;
				}

				if ( ! result.error ) {
					$form.find( '.wpforms-stripe-payment-method-id' ).remove();
					if ( result.paymentMethod ) {
						$form.append( '<input type="hidden" class="wpforms-stripe-payment-method-id" name="wpforms[payment_method_id]" value="' + result.paymentMethod.id + '">' );
					}
				}

				formSubmitHandler( $form );
			} );
		},

		/**
		 * Handle 'action_required' server response.
		 *
		 * @param {object} e Event object.
		 * @param {object} json Data returned form a server.
		 *
		 * @since 1.8.2
		 */
		handleCardActionCallback: function( e, json ) {

			const $form = $( this );

			if ( json.success && json.data.action_required ) {
				app.stripe.handleCardPayment(
					json.data.payment_intent_client_secret
				).then( function( result ) {
					app.handleCardPaymentCallback( $form, result );
				} );
			}
		},

		/**
		 * Callback for Stripe 'handleCardPayment' method.
		 *
		 * @param {jQuery} $form Form element.
		 * @param {object} result Data returned by 'handleCardPayment'.
		 *
		 * @since 1.8.2
		 */
		handleCardPaymentCallback: function( $form, result ) {

			if ( result.error ) {

				app.formAjaxUnblock( $form );
				$form.find( '.wpforms-field-stripe-credit-card-cardnumber' ).addClass( wpforms_stripe.data.element_classes.invalid );
				app.displayStripeError( $form, result.error.message );

			}  else if ( result.paymentIntent && 'succeeded' === result.paymentIntent.status ) {

				$form.find( '.wpforms-stripe-payment-method-id' ).remove();
				$form.find( '.wpforms-stripe-payment-intent-id' ).remove();
				$form.append( '<input type="hidden" class="wpforms-stripe-payment-intent-id" name="wpforms[payment_intent_id]" value="' + result.paymentIntent.id + '">' );
				wpforms.formSubmitAjax( $form );

			} else {

				app.formAjaxUnblock( $form );
			}
		},

		/**
		 * Display a field error using jQuery Validate library.
		 *
		 * @param {jQuery} $form Form element.
		 * @param {object} message Error message.
		 *
		 * @since 1.8.2
		 */
		displayStripeError: function( $form, message ) {

			const fieldName = $form.find( '.wpforms-stripe-credit-card-hidden-input' ).attr( 'name' ),
				$stripeDiv = $form.find( '.wpforms-field-stripe-credit-card-cardnumber' );
			let errors = {};

			errors[fieldName] = message;

			wpforms.displayFormAjaxFieldErrors( $form, errors );

			// Switch page for the multipage form.
			if ( ! $stripeDiv.is( ':visible' ) && $form.find( '.wpforms-page-indicator-steps' ).length > 0 ) {
				// Empty $json object needed to change the page to the first one.
				wpforms.setCurrentPage( $form, {} );
			}

			wpforms.scrollToError( $stripeDiv );
		},

		/**
		 * Unblock the AJAX form.
		 *
		 * @since 1.8.2
		 *
		 * @param {jQuery} $form Form element.
		 */
		formAjaxUnblock: function( $form ) {

			let $container = $form.closest( '.wpforms-container' ),
				$spinner   = $form.find( '.wpforms-submit-spinner' ),
				$submit    = $form.find( '.wpforms-submit' ),
				submitText = $submit.data( 'submit-text' );

			if ( submitText ) {
				$submit.text( submitText );
			}

			$submit.prop( 'disabled', false );
			$container.css( 'opacity', '' );
			$spinner.hide();
		},

		/**
		 * Callback for a page changing.
		 *
		 * @since 1.8.2
		 *
		 * @param {Event}  event       Event.
		 * @param {int}    currentPage Current page.
		 * @param {jQuery} $form       Current form.
		 * @param {string} action      The navigation action.
		 */
		pageChange: function( event, currentPage, $form, action ) {

			const $stripeDiv = $form.find( '.wpforms-field-stripe-credit-card-cardnumber' ),
				ccComplete = $stripeDiv.hasClass( wpforms_stripe.data.element_classes.complete ),
				ccEmpty = $stripeDiv.hasClass( wpforms_stripe.data.element_classes.empty ),
				ccInvalid = $stripeDiv.hasClass( wpforms_stripe.data.element_classes.invalid );

			// Stop navigation through page break pages.
			if (
				! $stripeDiv.is( ':visible' ) ||
				( ! $stripeDiv.data( 'required' ) && ccEmpty ) ||
				( app.lockedPageToSwitch && app.lockedPageToSwitch !== currentPage ) ||
				action === 'prev'
			) {
				return;
			}

			if ( ccComplete ) {
				$stripeDiv.find( '.wpforms-error' ).remove();

				return;
			}

			app.lockedPageToSwitch = currentPage;

			event.preventDefault();

			if ( ccInvalid ) {
				return;
			}

			app.displayStripeError( $form, wpforms_stripe.i18n.empty_details );
		},

		/**
		 * Get CSS property value.
		 * In case of exception return empty string.
		 *
		 * @since 1.8.6
		 *
		 * @param {jQuery} $element Element.
		 * @param {string} property Property.
		 *
		 * @return {string} Property value.
		 */
		getCssPropertyValue( $element, property ) {
			try {
				return $element.css( property );
			} catch ( e ) {
				return '';
			}
		},

		/**
		 * Update Card Element styles in Modern Markup mode.
		 *
		 * @since 1.8.2
		 *
		 * @param {jQuery} $form Form object.
		 */
		updateCardElementStylesModern( $form ) {
			// Should work only in Modern Markup mode.
			if ( ! window.WPForms || ! WPForms.FrontendModern || ! $.isEmptyObject( wpforms_stripe.data.element_style ) ) {
				return;
			}

			if ( ! $form || $form.length === 0 ) {
				return;
			}

			$form.find( '.wpforms-stripe-credit-card-hidden-input' ).each( function() {
				const $hiddenInput = $( this );
				const cardElement = $hiddenInput.data( 'stripe-element' );

				const inputStyle = {
					fontSize: app.getCssPropertyValue( $hiddenInput, 'font-size' ),
					colorText: app.getCssPropertyValue( $hiddenInput, 'color' ),
				};

				if ( ! cardElement ) {
					return;
				}

				const styles = {
					base: {
						color: inputStyle.colorText,
						fontSize: inputStyle.fontSize,
						'::placeholder': {
							color: WPForms.FrontendModern.getColorWithOpacity( inputStyle.colorText, '0.5' ),
							fontSize: inputStyle.fontSize,
						},
					},
					invalid: {
						color: inputStyle.colorText,
					},
				};

				cardElement.update( { style: styles } );
			} );
		},
	};

	// Provide access to public functions/properties.
	return app;

}( document, window, jQuery ) );

// Initialize.
WPFormsStripeElements.init();
