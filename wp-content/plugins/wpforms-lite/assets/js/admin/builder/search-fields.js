/**
 * WPForms Builder Search module.
 *
 * @since 1.8.3
 */

'use strict';

var WPForms = window.WPForms || {};

WPForms.Admin = WPForms.Admin || {};
WPForms.Admin.Builder = WPForms.Admin.Builder || {};

WPForms.Admin.Builder.Search = WPForms.Admin.Builder.Search || ( function( document, window, $ ) {

	/**
	 * Elements holder.
	 *
	 * @since 1.8.3
	 *
	 * @type {object}
	 */
	const el = {};

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.3
	 *
	 * @type {object}
	 */
	const app = {

		/**
		 * Start the engine. DOM is not ready yet, use only to init something.
		 *
		 * @since 1.8.3
		 */
		init: function() {

			$( app.ready );
		},

		/**
		 * DOM is fully loaded.
		 *
		 * @since 1.8.3
		 */
		ready: function() {

			app.setup();
			app.events();
			app.scrollSidebar();
		},

		/**
		 * Scroll the sidebar to the height of the search.
		 *
		 * @since 1.8.3
		 */
		scrollSidebar: function() {

			el.$sidebar.scrollTop( el.$searchWrapper.height() + 20 );
		},

		/**
		 * Setup. Prepare some variables.
		 *
		 * @since 1.8.3
		 */
		setup: function() {

			// Cache DOM elements
			el.$document            = $( document );
			el.$builder             = $( '#wpforms-builder' );
			el.$searchInput         = $( '#wpforms-search-fields-input' );
			el.$searchInputCloseBtn = $( '.wpforms-search-fields-input-close' );
			el.$searchWrapper       = $( '.wpforms-search-fields-wrapper' );
			el.$noResults           = $( '.wpforms-search-fields-no-results' );
			el.$listWrapper         = $( '.wpforms-search-fields-list' );
			el.$list                = $( '.wpforms-search-fields-list .wpforms-add-fields-buttons' );
			el.$groups              = $( '.wpforms-tab-content > .wpforms-add-fields-group' );
			el.$sidebar             = $( '#wpforms-panel-fields .wpforms-add-fields' );
		},

		/**
		 * Bind events.
		 *
		 * @since 1.8.3
		 */
		events: function() {

			el.$searchInput.on( 'keyup', app.searchAction );
			el.$searchInputCloseBtn.on( 'click', app.clearSearch );
			el.$document.on( 'wpformsFieldAdd', app.clearSearch );
			el.$document.on( 'wpformsFieldDelete', app.refreshSearchResults );
		},

		/**
		 * Search action.
		 *
		 * @since 1.8.3
		 */
		searchAction: function() {

			const $fields = el.$builder.find( '.wpforms-tab-content > .wpforms-add-fields-group .wpforms-add-fields-button' );
			const searchValue = el.$searchInput.val().toLowerCase();

			el.$list.empty();

			if ( searchValue ) {
				el.$groups.hide();
				el.$listWrapper.show();
				el.$searchInputCloseBtn.addClass( 'active' );

				$fields.each( function() {

					const $item     = $( this );
					const titleText = $item.text().toLowerCase();
					const keywords  = $item.data( 'field-keywords' ) ? $item.data( 'field-keywords' ).toLowerCase() : '';

					if ( titleText.indexOf( searchValue ) >= 0 || ( keywords && keywords.indexOf( searchValue ) >= 0 ) ) {
						const $clone = $item.clone();

						$clone.attr( 'data-target', $clone.attr( 'id' ) );
						$clone.removeAttr( 'id' );
						$clone.addClass( 'wpforms-add-fields-button-clone' );

						el.$list.append( $clone );
					}
				} );

				const $matchingItems = el.$list.find( '.wpforms-add-fields-button' );
				const hasMatchingItems = $matchingItems.length > 0;

				if ( hasMatchingItems ) {
					el.$noResults.hide();
				} else {
					el.$noResults.show();
					el.$listWrapper.hide();
				}
			} else {
				el.$groups.show();
				el.$listWrapper.hide();
				el.$noResults.hide();
				el.$searchInputCloseBtn.removeClass( 'active' );
			}

			WPForms.Admin.Builder.DragFields.setup();
			WPForms.Admin.Builder.DragFields.initSortableFields();
			app.cloneClickAction();
		},

		/**
		 * Clear search.
		 *
		 * @since 1.8.3
		 */
		clearSearch: function() {

			if ( ! el.$searchInput.val() ) {
				return;
			}

			el.$list.empty();
			el.$listWrapper.hide();
			el.$groups.show();
			el.$noResults.hide();
			el.$searchInput.val( '' ).focus();
			el.$searchInputCloseBtn.removeClass( 'active' );
		},

		/**
		 * Refresh search results.
		 *
		 * @since 1.8.3
		 */
		refreshSearchResults: function() {

			// We need to wait for the original field to be unlocked.
			setTimeout( app.searchAction, 0 );
		},

		/**
		 * Clone click action.
		 *
		 * @since 1.8.3
		 */
		cloneClickAction() {
			$( '.wpforms-add-fields-button-clone' ).on( 'click', function( e ) {
				e.preventDefault();
				e.stopPropagation();

				const target = $( this ).attr( 'data-target' );

				$( '#' + target ).trigger( 'click' );
			} );
		},
	};

	// Provide access to public functions/properties.
	return app;

}( document, window, jQuery ) );

// Initialize.
WPForms.Admin.Builder.Search.init();
