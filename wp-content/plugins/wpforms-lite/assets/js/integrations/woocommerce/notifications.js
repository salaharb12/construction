/* global wpforms_woocommerce_notifications */

/**
 * WooCommerce Notifications integration script.
 *
 * @since 1.8.9
 */
const WPFormsWoocommerceNotifications = window.WPFormsWoocommerceNotifications || ( function( document, window, $ ) {
	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.9
	 */
	const app = {
		/**
		 * Start the engine.
		 *
		 * @since 1.8.9
		 */
		init() {
			$( app.ready );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.8.9
		 */
		ready() {
			app.events();
		},

		/**
		 * Events.
		 *
		 * @since 1.8.9
		 */
		events() {
			$( '#wpforms-woocommerce-close' ).on( 'click', app.dismiss );
		},

		/**
		 * Hide notification.
		 *
		 * @since 1.8.9
		 */
		dismiss() {
			const $btn = $( this );
			const $notification = $btn.closest( '.wpforms-woocommerce-notification' );

			$notification.remove();

			const data = {
				action: 'wpforms_woocommerce_dismiss',
				nonce: wpforms_woocommerce_notifications.nonce,
			};

			$.post( wpforms_woocommerce_notifications.ajax_url, data, function( res ) {
				if ( ! res.success ) {
					// eslint-disable-next-line no-console
					console.log( res );
				}
			} ).fail( function( xhr ) {
				// eslint-disable-next-line no-console
				console.log( xhr.responseText );
			} );
		},
	};

	return app;
}( document, window, jQuery ) );

// Initialize.
WPFormsWoocommerceNotifications.init();
