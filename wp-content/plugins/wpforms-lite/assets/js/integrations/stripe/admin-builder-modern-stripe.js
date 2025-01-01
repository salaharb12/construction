/* global wpforms_builder, wpforms_builder_stripe */

// noinspection ES6ConvertVarToLetConst
/**
 * Stripe builder function.
 *
 * @since 1.8.4
 */
// eslint-disable-next-line no-var
var WPFormsStripeModernBuilder = window.WPFormsStripeModernBuilder || ( function( document, window, $ ) {
	/**
	 * Elements holder.
	 *
	 * @since 1.8.4
	 *
	 * @type {Object}
	 */
	let el = {};

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.4
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.8.4
		 */
		init() {
			$( app.ready );
		},

		/**
		 * Initialized once the DOM is fully loaded.
		 *
		 * @since 1.8.4
		 */
		ready() {
			if ( app.isLegacySettings() ) {
				return;
			}

			// Cache DOM elements.
			el = {
				$alert:        $( '#wpforms-stripe-credit-card-alert' ),
				$panelContent: $( '#wpforms-panel-content-section-payment-stripe' ),
				$feeNotice:    $( '.wpforms-stripe-notice-info' ),
			};

			app.bindUIActions();

			if ( ! wpforms_builder_stripe.is_pro ) {
				const toggleInput = '.wpforms-panel-content-section-payment-toggle input',
					planNameInput = '.wpforms-panel-content-section-payment-plan-name input';

				$( toggleInput ).each( app.toggleContent );
				$( planNameInput ).each( app.checkPlanName );

				$( '#wpforms-panel-payments' )
					.on( 'click', toggleInput, app.toggleContent )
					.on( 'click', '.wpforms-panel-content-section-payment-plan-head-buttons-toggle', app.togglePlan )
					.on( 'click', '.wpforms-panel-content-section-stripe .wpforms-panel-content-section-payment-plan-head-buttons-delete', app.deletePlan )
					.on( 'input', planNameInput, app.renamePlan )
					.on( 'focusout', planNameInput, app.checkPlanName );
			}
		},

		/**
		 * Process various events as a response to UI interactions.
		 *
		 * @since 1.8.4
		 */
		bindUIActions() {
			const $builder = $( '#wpforms-builder' );

			$builder.on( 'wpformsFieldDelete', app.disableNotifications )
				.on( 'wpformsSaved', app.requiredFieldsCheck )
				.on( 'wpformsFieldAdd', app.fieldAdded )
				.on( 'wpformsFieldDelete', app.fieldDeleted )
				.on( 'wpformsPaymentsPlanCreated', app.toggleMultiplePlansWarning )
				.on( 'wpformsPaymentsPlanDeleted', app.toggleMultiplePlansWarning );
		},

		/**
		 * On form save notify users about required fields.
		 *
		 * @since 1.8.4
		 */
		requiredFieldsCheck() {
			if ( ! $( '#wpforms-panel-field-stripe-enable_recurring' ).is( ':checked' ) || el.$panelContent.hasClass( 'wpforms-hidden' ) ) {
				return;
			}

			el.$panelContent.find( '.wpforms-panel-content-section-payment-plan' ).each( function() {
				const $plan = $( this ),
					planId = $plan.data( 'plan-id' );

				if ( ! $plan.find( `#wpforms-panel-field-stripe-recurring-${ planId }-email` ).val() ) {
					app.recurringEmailAlert();

					return false;
				}
			} );
		},

		/**
		 * Show alert for required recurring email field.
		 *
		 * @since 1.8.4
		 */
		recurringEmailAlert() {
			$.alert( {
				title: wpforms_builder.heads_up,
				content: wpforms_builder.stripe_recurring_email,
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
		 * Disable notifications.
		 *
		 * @since 1.8.4
		 *
		 * @param {Object} e    Event object.
		 * @param {number} id   Field ID.
		 * @param {string} type Field type.
		 */
		disableNotifications( e, id, type ) {
			if ( ! app.isStripeField( type ) ) {
				return;
			}

			const $notificationWrap = $( '.wpforms-panel-content-section-notifications [id*="-stripe-wrap"]' );

			$notificationWrap.find( 'input[id*="-stripe"]' ).prop( 'checked', false );
			$notificationWrap.addClass( 'wpforms-hidden' );
		},

		/**
		 * Determine is legacy settings is loaded.
		 *
		 * @since 1.8.4
		 *
		 * @return {boolean} True is legacy settings loaded.
		 */
		isLegacySettings() {
			return $( '#wpforms-panel-field-stripe-enable' ).length;
		},

		/**
		 * We have to do several actions when the "Stripe" field is added.
		 *
		 * @since 1.8.4
		 *
		 * @param {Object} e    Event object.
		 * @param {number} id   Field ID.
		 * @param {string} type Field type.
		 */
		fieldAdded( e, id, type ) {
			if ( ! app.isStripeField( type ) ) {
				return;
			}

			app.settingsToggle( true );
			el.$feeNotice.toggleClass( 'wpforms-hidden' );
		},

		/**
		 * We have to do several actions when the "Stripe" field is deleted.
		 *
		 * @since 1.8.4
		 *
		 * @param {Object} e    Event object.
		 * @param {number} id   Field ID.
		 * @param {string} type Field type.
		 */
		fieldDeleted( e, id, type ) {
			if ( ! app.isStripeField( type ) ) {
				return;
			}

			app.settingsToggle( false );
			el.$feeNotice.toggleClass( 'wpforms-hidden' );
		},

		/**
		 * Determine if a field type is Stripe credit card.
		 *
		 * @since 1.8.4
		 *
		 * @param {string} type Field type.
		 *
		 * @return {boolean} True if Stripe field.
		 */
		isStripeField( type ) {
			return wpforms_builder_stripe.field_slugs.includes( type );
		},

		/**
		 * Toggles visibility of multiple plans warning.
		 *
		 * @since 1.8.4
		 */
		toggleMultiplePlansWarning() {
			el.$panelContent.find( '.wpforms-stripe-multiple-plans-warning' ).toggleClass( 'wpforms-hidden', el.$panelContent.find( '.wpforms-panel-content-section-payment-plan' ).length === 1 );
		},

		/**
		 * Toggles visibility of the Stripe addon settings.
		 *
		 * @since 1.8.4
		 *
		 * @param {boolean} display Show or hide settings.
		 */
		settingsToggle( display ) {
			if (
				! el.$alert.length &&
				! el.$panelContent.length
			) {
				return;
			}

			el.$alert.toggleClass( 'wpforms-hidden', display );
			el.$panelContent.toggleClass( 'wpforms-hidden', ! display );
		},

		/**
		 * Toggle payments content.
		 *
		 * @since 1.8.4
		 */
		toggleContent() {
			const $input = $( this );

			if (
				$( '#wpforms-panel-field-stripe-enable_recurring' ).is( ':checked' ) &&
				$( '#wpforms-panel-field-stripe-enable_one_time' ).is( ':checked' )
			) {
				$input.prop( 'checked', false );

				$.alert( {
					title: wpforms_builder.heads_up,
					content: $input.attr( 'id' ) === 'wpforms-panel-field-stripe-enable_recurring' ? wpforms_builder_stripe.disabled_recurring : wpforms_builder_stripe.disabled_one_time,
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

				$input.prop( 'checked', false );
			}

			const $wrapper = $input.closest( '.wpforms-panel-content-section-payment' ),
				isChecked = $input.prop( 'checked' ) && ! $( '#wpforms-panel-field-settings-disable_entries' ).prop( 'checked' );

			$wrapper.find( '.wpforms-panel-content-section-payment-toggled-body' ).toggle( isChecked );
			$wrapper.toggleClass( 'wpforms-panel-content-section-payment-open', isChecked );
		},

		/**
		 * Toggle a plan content.
		 *
		 * @since 1.8.4
		 */
		togglePlan() {
			const $plan = $( this ).closest( '.wpforms-panel-content-section-payment-plan' ),
				$icon = $plan.find( '.wpforms-panel-content-section-payment-plan-head-buttons-toggle' );

			$icon.toggleClass( 'fa-chevron-circle-up fa-chevron-circle-down' );
			$plan.find( '.wpforms-panel-content-section-payment-plan-body' ).toggle( $icon.hasClass( 'fa-chevron-circle-down' ) );
		},

		/**
		 * Delete a plan.
		 *
		 * @since 1.8.4
		 */
		deletePlan() {
			// Trigger a warning modal when trying to delete a single plan without pro addon.
			$( '.wpforms-panel-content-section-stripe .wpforms-panel-content-section-payment-button-add-plan' ).click();
		},

		/**
		 * Check a plan name on empty value.
		 *
		 * @since 1.8.4
		 */
		checkPlanName() {
			const $input = $( this ),
				$plan = $input.closest( '.wpforms-panel-content-section-payment-plan' ),
				$planName = $plan.find( '.wpforms-panel-content-section-payment-plan-head-title' );

			if ( $input.val() ) {
				$planName.html( $input.val() );

				return;
			}

			const defaultValue = wpforms_builder_stripe.plan_placeholder;

			$planName.html( defaultValue );
			$input.val( defaultValue );
		},

		/**
		 * Rename a plan.
		 *
		 * @since 1.8.4
		 */
		renamePlan() {
			const $input = $( this ),
				$plan = $input.closest( '.wpforms-panel-content-section-payment-plan' ),
				$planName = $plan.find( '.wpforms-panel-content-section-payment-plan-head-title' );

			if ( ! $input.val() ) {
				$planName.html( '' );

				return;
			}

			$planName.html( $input.val() );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

// Initialize.
WPFormsStripeModernBuilder.init();
