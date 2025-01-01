/* global wpCookies */

/**
 * Entries list page.
 */
const WPFormsEntryList = window.WPFormsEntryList || ( function( document, window, $ ) {
	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.9
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Initialize the engine.
		 *
		 * @since 1.8.9
		 */
		init() {
			$( app.ready );
		},

		/**
		 * Ready.
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
			// Show sample data for entries when the Explore Entries is clicked.
			$( '#wpforms-entries-explore' ).on( 'click', app.showEntries );

			// Hide sample data for entries when the Hide Sample Data is clicked.
			$( '#wpforms-hide-sample-data' ).on( 'click', app.hideEntries );

			// Toggle the action dropdown.
			$( '#wpforms-list-table-ext-edit-columns-cog' ).on( 'click', app.toggleActionDropdown );
			$( '#wpcontent' ).on( 'click', app.hideActionDropdown );
		},

		/**
		 * Show entries.
		 *
		 * @since 1.8.9
		 *
		 * @param {Object} e Event object.
		 */
		showEntries( e ) {
			e.preventDefault();

			$( '.entries-modal' ).fadeOut( 500, function() {
				$( '#wpforms-sample-entry-main-notice' ).slideDown( 250 );
				$( '#wpforms-entries-list' ).addClass( 'wpforms-entires-sample-view' );
			} );
			wpCookies.set( 'wpforms_sample_entries', 'true', 2592000 ); // 1 month
		},

		/**
		 * Hide entries.
		 *
		 * @since 1.8.9
		 *
		 * @param {Object} e Event object.
		 */
		hideEntries( e ) {
			e.preventDefault();

			// Bypass animation as this is causing fade in/out issues.
			$( '#wpforms-sample-entry-main-notice' ).fadeOut( 250, function() {
				$( '#wpforms-entries-list' ).removeClass( 'wpforms-entires-sample-view' );
				$( '.wpforms-sample-entry-notice' ).removeClass( 'wpf-no-animate' );
				$( '.entries-modal' ).fadeIn( 500 );
			} );

			wpCookies.remove( 'wpforms_sample_entries' );
		},

		/**
		 * Toggle the action dropdown.
		 *
		 * @since 1.8.9
		 *
		 * @param {Object} e Event object.
		 */
		toggleActionDropdown( e ) {
			e.preventDefault();
			e.stopPropagation();

			$( this ).parent().toggleClass( 'is_active' );
		},

		/**
		 * Hide the action dropdown.
		 *
		 * @since 1.8.9
		 */
		hideActionDropdown() {
			const actionColumn = $( '#wpforms-list-table-ext-edit-columns-cog' ).parent();

			if ( actionColumn.hasClass( 'is_active' ) ) {
				actionColumn.removeClass( 'is_active' );
			}
		},
	};

	return app;
}( document, window, jQuery ) );

// Initialize the engine.
WPFormsEntryList.init();
