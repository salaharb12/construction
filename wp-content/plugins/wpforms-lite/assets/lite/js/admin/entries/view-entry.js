/**
 * View single entry page.
 *
 * @since 1.8.9
 */
const WPFormsViewEntry = window.WPFormsViewEntry || ( function( document, window, $ ) {
	/**
	 * Elements holder.
	 *
	 * @since 1.8.9
	 *
	 * @type {Object}
	 */
	let el = {};

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
		 * Document ready.
		 *
		 * @since 1.8.9
		 */
		ready() {
			app.setup();
			app.events();
		},

		/**
		 * Setup. Prepare some variables.
		 *
		 * @since 1.8.9
		 */
		setup() {
			// Cache DOM elements.
			el = {
				menuClass: '.wpforms-entries-settings-menu',
			};
		},

		/**
		 * Events.
		 *
		 * @since 1.8.9
		 */
		events() {
			$( '#wpforms-entries-settings-button' ).on( 'click', app.menuToggle );
			$( '#wpcontent' ).on( 'click', app.menuHide );
		},

		/**
		 * Handler for the menu toggle behavior.
		 *
		 * @since 1.8.9
		 *
		 * @param {Object} event Event object.
		 */
		menuToggle( event ) {
			event.preventDefault();
			event.stopPropagation();

			// Toggle the visibility of the matched element.
			$( el.menuClass ).toggle( 0, function() {
				const $menu = $( this );

				// When the menu is open, aria-expended="true".
				$menu.attr( 'aria-expanded', $menu.is( ':visible' ) );
			} );
		},

		/**
		 * Handler for hiding the menu when a click is outside of it.
		 *
		 * @since 1.8.9
		 *
		 * @param {Object} event Event object.
		 */
		menuHide( event ) {
			// Check if the clicked element is not the menu container or a child of it.
			if ( ! $( event.target ).closest( `${ el.menuClass }:visible` ).length ) {
				$( el.menuClass ).attr( 'aria-expanded', 'false' ).hide();
			}
		},
	};

	return app;
}( document, window, jQuery ) );

// Initialize the engine.
WPFormsViewEntry.init();
