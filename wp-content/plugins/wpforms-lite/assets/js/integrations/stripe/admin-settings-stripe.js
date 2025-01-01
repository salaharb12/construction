/* global wpforms_admin_settings_stripe, wpforms_admin */

/**
 * Stripe integration settings script.
 *
 * @since 1.8.2
 */

const WPFormsSettingsStripe = window.WPFormsSettingsStripe || ( function( document, window, $ ) {
	/**
	 * Elements holder.
	 *
	 * @since 1.8.2
	 *
	 * @type {Object}
	 */
	const el = {};

	/**
	 * Runtime variables.
	 *
	 * @since 1.8.2
	 *
	 * @type {Object}
	 */
	const vars = {
		alertTitle: wpforms_admin.heads_up,
		alertContent: wpforms_admin_settings_stripe.mode_update,
		ok: wpforms_admin.ok,
		hideClassName: 'wpforms-hide',
	};

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.2
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.8.2
		 */
		init() {
			$( app.ready );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.8.2
		 */
		ready() {
			app.setup();
			app.bindEvents();
		},

		/**
		 * Setup. Prepare some variables.
		 *
		 * @since 1.8.2
		 */
		setup() {
			// Cache DOM elements.
			el.$wrapper = $( '.wpforms-admin-content-payments' );
			el.$liveConnectionBlock = $( '.wpforms-stripe-connection-status-live' );
			el.$testConnectionBlock = $( '.wpforms-stripe-connection-status-test' );
			el.$testModeCheckbox = $( '#wpforms-setting-stripe-test-mode' );
			el.copyButton = $( '#wpforms-setting-row-stripe-webhooks-endpoint-set .wpforms-copy-to-clipboard' );
			el.webhookEndpointUrl = $( 'input#wpforms-stripe-webhook-endpoint-url' );
			el.webhookMethod = $( 'input[name="stripe-webhooks-communication"]' );
		},

		/**
		 * Bind events.
		 *
		 * @since 1.8.2
		 */
		bindEvents() {
			el.$wrapper
				.on( 'change', '#wpforms-setting-stripe-test-mode', app.triggerModeSwitchAlert );
			el.copyButton
				.on( 'click', app.copyWebhooksEndpoint );
			el.webhookMethod
				.on( 'change', app.onMethodChange );
		},

		/**
		 * Conditionally show Stripe mode switch warning.
		 *
		 * @since 1.8.2
		 */
		triggerModeSwitchAlert() {
			if ( el.$testModeCheckbox.is( ':checked' ) ) {
				el.$liveConnectionBlock.addClass( vars.hideClassName );
				el.$testConnectionBlock.removeClass( vars.hideClassName );
			} else {
				el.$testConnectionBlock.addClass( vars.hideClassName );
				el.$liveConnectionBlock.removeClass( vars.hideClassName );
			}

			if ( $( '#wpforms-setting-row-stripe-connection-status .wpforms-connected' ).is( ':visible' ) ) {
				return;
			}

			$.alert( {
				title: vars.alertTitle,
				content: vars.alertContent,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: vars.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
			} );
		},

		/**
		 * Copy webhooks endpoint URL to clipboard.
		 *
		 * @since 1.8.4
		 *
		 * @param {Object} event Event object.
		 */
		copyWebhooksEndpoint( event ) {
			event.preventDefault();

			// Use Clipboard API for modern browsers and HTTPS connections, in other cases use old-fashioned way.
			if ( navigator.clipboard ) {
				navigator.clipboard.writeText( el.webhookEndpointUrl.val() ).then(
					function() {
						el.copyButton.find( 'span' ).removeClass( 'dashicons-admin-page' ).addClass( 'dashicons-yes-alt' );
					}
				);

				return;
			}

			el.webhookEndpointUrl.attr( 'disabled', false ).focus().select();

			document.execCommand( 'copy' );

			el.copyButton.find( 'span' ).removeClass( 'dashicons-admin-page' ).addClass( 'dashicons-yes-alt' );

			el.webhookEndpointUrl.attr( 'disabled', true );
		},

		/**
		 * Update the endpoint URL.
		 *
		 * @since 1.8.4
		 */
		onMethodChange() {
			const checked = el.webhookMethod.filter( ':checked' ).val(),
				newUrl = wpforms_admin_settings_stripe.webhook_urls[ checked ];

			el.webhookEndpointUrl.val( newUrl );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

// Initialize.
WPFormsSettingsStripe.init();
