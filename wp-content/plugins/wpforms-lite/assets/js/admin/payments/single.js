/* global wpforms_admin, wpforms_admin_payments_single */

/**
 * WPForms Single Payment View page.
 *
 * @since 1.8.2
 */

const WPFormsPaymentsSingle = window.WPFormsPaymentsSingle || ( function( document, window, $ ) {
	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.2
	 *
	 * @type {Object}
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
			app.initTooltips();
			app.paymentDeletionAlert();
			app.actionButtons();
		},

		/**
		 * Initialize WPForms admin area tooltips.
		 *
		 * @since 1.8.2
		 */
		initTooltips() {
			if ( typeof jQuery.fn.tooltipster === 'undefined' ) {
				return;
			}

			jQuery( '.wpforms-single-payment-tooltip' ).tooltipster( {
				contentCloning: true,
				theme: 'borderless',
				contentAsHTML: true,
				position: 'top',
				maxWidth: 500,
				multiple: true,
				interactive: true,
				debug: false,
			} );
		},

		/**
		 * Alert user before deleting payment.
		 *
		 * @since 1.8.2
		 */
		paymentDeletionAlert() {
			$( document ).on( 'click', '.wpforms-payment-actions .button-delete', function( event ) {
				event.preventDefault();

				const url = $( this ).attr( 'href' );

				// Trigger alert modal to confirm.
				$.confirm( {
					title: wpforms_admin.heads_up,
					content: wpforms_admin_payments_single.payment_delete_confirm,
					icon: 'fa fa-exclamation-circle',
					type: 'orange',
					buttons: {
						confirm: {
							text: wpforms_admin.ok,
							btnClass: 'btn-confirm',
							keys: [ 'enter' ],
							action() {
								window.location = url;
							},
						},
						cancel: {
							text: wpforms_admin.cancel,
							keys: [ 'esc' ],
						},
					},
				} );
			} );
		},

		/**
		 * Handle payment actions.
		 *
		 * @since 1.8.4
		 */
		actionButtons() {
			$( document ).on( 'click', '.wpforms-payments-single-action', ( event ) => {
				const gateway = $( event.currentTarget ).data( 'gateway' ),
					registeredHandlers = wpforms_admin.single_payment_button_handlers;

				if ( ! registeredHandlers || ! registeredHandlers.includes( gateway ) ) {
					return;
				}

				event.preventDefault();

				const paymentId = $( event.currentTarget ).data( 'action-id' ),
					actionType = $( event.currentTarget ).data( 'action-type' );

				$.confirm( {
					title: wpforms_admin.heads_up,
					content: app.strings[ actionType ].confirm,
					icon: 'fa fa-exclamation-circle',
					type: 'orange',
					buttons: {
						confirm: {
							text: wpforms_admin.ok,
							btnClass: 'btn-confirm',
							keys: [ 'enter' ],
							action: () => {
								app.sendActionRequest( paymentId, gateway, actionType );
							},
						},
						cancel: {
							text: wpforms_admin.cancel,
							keys: [ 'esc' ],
						},
					},
				} );
			} );
		},

		/**
		 * Send action request to server.
		 *
		 * @since 1.8.4
		 *
		 * @param {number} paymentId  Payment ID.
		 * @param {string} gateway    Payment gateway.
		 * @param {string} actionType Action type.
		 */
		sendActionRequest( paymentId, gateway, actionType ) {
			$.ajax( {
				url: wpforms_admin.ajax_url,
				type: 'POST',
				data: {
					action: 'wpforms_' + gateway + '_payments_' + actionType,
					payment_id: paymentId, // eslint-disable-line camelcase
					nonce: wpforms_admin.nonce,
				},
				dataType: 'json',
				success: ( response ) => {
					if ( response.success ) {
						$.alert( {
							title: wpforms_admin.success,
							content: app.strings[ actionType ].success,
							icon: 'fa fa-check-circle',
							type: 'green',
							buttons: {
								confirm: {
									text: wpforms_admin.close_refresh,
									btnClass: 'btn-confirm',
									keys: [ 'enter' ],
									action: () => {
										window.location.reload();
									},
								},
							},
						} );
					} else {
						app.failedResponseAlert( response?.data?.modal_msg || '' );
					}
				},
				error: () => {
					app.failedResponseAlert();
				},
			} );
		},

		/**
		 * Strings.
		 *
		 * @since 1.8.4
		 */
		strings : {
			refund: {
				confirm: wpforms_admin_payments_single.payment_refund_confirm,
				success: wpforms_admin_payments_single.payment_refund_success,
			},
			cancel: {
				confirm: wpforms_admin_payments_single.payment_cancel_confirm,
				success: wpforms_admin_payments_single.payment_cancel_success,
			},
		},

		/**
		 * Alert user when refunding payment failed.
		 *
		 * @since 1.8.4
		 *
		 * @param {string} message Modal message.
		 */
		failedResponseAlert( message = '' ) {
			$.alert( {
				title: wpforms_admin.heads_up,
				content: message === '' ? wpforms_admin.try_again : message,
				icon: 'fa fa-exclamation-circle',
				type: 'red',
				buttons: {
					confirm: {
						text: wpforms_admin.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
			} );
		},
	};

	return app;
}( document, window, jQuery ) );

// Initialize.
WPFormsPaymentsSingle.init();
