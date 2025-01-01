/* global wpformsWpcodeVars, List, wpforms_admin */

/**
 * @param wpformsWpcodeVars.installing_text
 */

// noinspection ES6ConvertVarToLetConst
/**
 * WPCode integration script.
 *
 * @since 1.8.5
 */
// eslint-disable-next-line no-var
var WPFormsWPCode = window.WPFormsWPCode || ( function( document, window, $ ) {
	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.5
	 */
	const app = {

		/**
		 * Blue spinner HTML.
		 *
		 * @since 1.8.5
		 *
		 * @type {Object}
		 */
		spinnerBlue: '<i class="wpforms-loading-spinner wpforms-loading-blue wpforms-loading-inline"></i>',

		/**
		 * White spinner HTML.
		 *
		 * @since 1.8.5
		 *
		 * @type {Object}
		 */
		spinnerWhite: '<i class="wpforms-loading-spinner wpforms-loading-white wpforms-loading-inline"></i>',

		/**
		 * List.js object.
		 *
		 * @since 1.8.5
		 *
		 * @type {Object}
		 */
		snippetSearch: null,

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
			app.snippetSearch = new List(
				'wpforms-wpcode-snippets-list',
				{
					valueNames: [ 'wpforms-wpcode-snippet-title' ],
				}
			);
			app.events();
		},

		/**
		 * Events.
		 *
		 * @since 1.8.5
		 */
		events() {
			$( '.wpforms-wpcode-snippet-button' ).on( 'click', app.installSnippet );

			$( '.wpforms-wpcode-popup-button' ).on( 'click', 	app.installPlugin );

			$( '#wpforms-wpcode-snippet-search' ).on( 'keyup search', function() {
				app.searchSnippet( this );
			} );
		},

		/**
		 * Install snippet.
		 *
		 * @since 1.8.5
		 */
		installSnippet() {
			const $button = $( this );

			if ( $button.data( 'action' ) === 'edit' ) {
				return;
			}

			const originalWidth = $button.width();
			const $badge = $button.prev( '.wpforms-wpcode-snippet-badge' );

			$badge.addClass( 'wpforms-wpcode-installing-in-progress' ).text( wpformsWpcodeVars.installing_text );
			$button.width( originalWidth ).html( app.spinnerBlue );
		},

		/**
		 * Search snippet.
		 *
		 * @param {Object} searchField The search field html element.
		 * @since 1.8.5
		 */
		searchSnippet( searchField ) {
			const searchTerm = $( searchField ).val();
			const searchResults = app.snippetSearch.search( searchTerm );
			const $noResultsMessage = $( '#wpforms-wpcode-no-results' );

			if ( searchResults.length === 0 ) {
				$noResultsMessage.show();
			} else {
				$noResultsMessage.hide();
			}
		},

		/**
		 * Install or activate WPCode plugin by button click.
		 *
		 * @since 1.8.5
		 */
		installPlugin() {
			const $btn = $( this );

			if ( $btn.hasClass( 'disabled' ) ) {
				return;
			}

			const action = $btn.attr( 'data-action' ),
				plugin = $btn.attr( 'data-plugin' ),
				// eslint-disable-next-line camelcase
				args = JSON.stringify( { overwrite_package: true } ),
				ajaxAction = action === 'activate' ? 'wpforms_activate_addon' : 'wpforms_install_addon';

			// Fix original button width, add spinner and disable it.
			$btn.width( $btn.width() ).html( app.spinnerWhite ).addClass( 'disabled' );

			const data = {
				action: ajaxAction,
				nonce: wpforms_admin.nonce,
				plugin,
				args,
				type: 'plugin',
			};

			$.post( wpforms_admin.ajax_url, data )
				.done( function() {
					location.reload();
				} );
		},
	};

	return app;
}( document, window, jQuery ) );

// Initialize.
WPFormsWPCode.init();
