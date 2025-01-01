/* global wpforms_admin */

/**
 * Logger scripts
 *
 * @since 1.6.3
 */

const WPFormsLogger = window.WPFormsLogger || ( function( document, window, $ ) {
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.6.3
		 */
		init() {
			$( app.ready );
		},

		ready() {
			app.bindEvents();
		},

		/**
		 * Bind popup to the click on logger link.
		 *
		 * @since 1.6.3
		 */
		bindPopup() {
			$( '.wpforms-list-table--logs .wp-list-table' ).on( 'click', '.js-single-log-target', function( e ) {
				e.preventDefault();

				app.showPopup( $( this ).attr( 'data-log-id' ) );
			} );
		},

		/**
		 * Bind events.
		 *
		 * @since 1.8.9
		 */
		bindEvents() {
			app.bindPopup();

			$( '#wpforms-setting-logs-enable' ).change( function() {
				app.toggleLogs( $( this ).is( ':checked' ) );
			} );
		},

		/**
		 * Toggle logs settings and logs list.
		 *
		 * @since 1.8.9
		 *
		 * @param {boolean} checked Checked state.
		 */
		toggleLogs( checked ) {
			// Toggle hidden class.
			$( '.wpforms-logs-settings' ).toggleClass( 'wpforms-hidden', ! checked );
		},

		/**
		 * Show popup.
		 *
		 * @since 1.6.3
		 *
		 * @param {number} recordId Record Id.
		 */
		showPopup( recordId ) {
			if ( ! recordId ) {
				return;
			}

			const popupTemplate = wp.template( 'wpforms-log-record' );

			$.dialog( {
				title: false,
				boxWidth: Math.min( 1200, $( window ).width() * 0.8 ),
				content() {
					const self = this;

					return $.get(
						wpforms_admin.ajax_url,
						{
							action: 'wpforms_get_log_record',
							nonce: wpforms_admin.nonce,
							recordId,
						}
					).done( function( res ) {
						if ( ! res.success || ! res.data ) {
							app.error( res.data );
							self.close();

							return;
						}
						self.setContent( popupTemplate( res.data ) );
					} ).fail( function( xhr, textStatus ) {
						app.error( textStatus + ' ' + xhr.responseText );
						self.close();
					} );
				},
				animation: 'scale',
				columnClass: 'medium',
				closeIcon: true,
				closeAnimation: 'scale',
				backgroundDismiss: true,
			} );
		},

		/**
		 * Output error to the console if debug mode is on.
		 *
		 * @since 1.6.4
		 *
		 * @param {string} msg Error text.
		 */
		error( msg ) {
			if ( ! wpforms_admin.debug ) {
				return;
			}

			msg = _.isEmpty( msg ) ? '' : ': ' + msg;
			// eslint-disable-next-line no-console
			console.log( 'WPForms Debug: Error receiving log record data' + msg );
		},

	};

	return app;
}( document, window, jQuery ) );

// Initialize.
WPFormsLogger.init();
