/**
 * WPForms Builder Dropdown List module.
 *
 * @since 1.8.4
 */

/*
 Usage:

 dropdownList = WPForms.Admin.Builder.DropdownList.init( {
 	class: 'insert-field-dropdown',                    // Additional CSS class.
	title: 'Dropdown Title',                           // Dropdown title.
 	list: [                                            // Items list.
 		{ value: '1', text: 'Item 1' },
 		{ value: '2', text: 'Item 2' },
 		{ value: '3', text: 'Item 3' },
 	],
 	container: $( '.holder-container' ),               // Holder container. Optional.
 	scrollableContainer: $( '.scrollable-container' ), // Scrollable container. Optional.
 	button: $( '.button' ),                            // Button.
 	buttonDistance: 21,                                // Distance from dropdown to the button.
 	itemFormat( item ) {                               // Item element renderer. Optional.
 		return `<span>${ item.text }</span>`;
 	},
 	onSelect( event, value, text, $item, instance ) {  // On select event handler.
		console.log( 'Item selected:', text );
 		instance.close();
 		$button.removeClass( 'active' );
 	},
 } );
*/

var WPForms = window.WPForms || {}; // eslint-disable-line no-var

WPForms.Admin = WPForms.Admin || {};
WPForms.Admin.Builder = WPForms.Admin.Builder || {};

WPForms.Admin.Builder.DropdownList = WPForms.Admin.Builder.DropdownList || ( function( document, window, $ ) {
	/**
	 * DropdownList object constructor.
	 *
	 * @since 1.8.4
	 *
	 * @type {Object}
	 */
	function DropdownList( options ) { // eslint-disable-line max-lines-per-function
		const self = this;

		/**
		 * Default options.
		 *
		 * @since 1.8.4
		 *
		 * @type {Object}
		 */
		const defaultOptions = {
			class: '',
			title: '',
			list: [],
			container: null,
			scrollableContainer: null,
			button: null,
			buttonDistance: 10,
			onSelect: null,
			itemFormat( item ) {
				return item.text;
			},
		};

		/**
		 * Options.
		 *
		 * @since 1.8.4
		 *
		 * @type {jQuery}
		 */
		self.options = $.extend( defaultOptions, options );

		/**
		 * Main dropdown container.
		 *
		 * @since 1.8.4
		 *
		 * @type {jQuery}
		 */
		self.$el = null;

		/**
		 * Form builder container.
		 *
		 * @since 1.8.4
		 *
		 * @type {jQuery}
		 */
		self.$builder = $( '#wpforms-builder' );

		/**
		 * Close the dropdown.
		 *
		 * @since 1.8.4
		 */
		self.close = function() {
			self.$el.addClass( 'closed' );
		};

		/**
		 * Open the dropdown.
		 *
		 * @since 1.8.4
		 */
		self.open = function() {
			self.$el.removeClass( 'closed' );
			self.setPosition();

			// Close dropdown on click outside.
			self.$builder.on( 'click.DropdowmList', function( e ) {
				const $target = $( e.target );

				if ( $target.closest( self.$el ).length || $target.hasClass( 'button-insert-field' ) ) {
					return;
				}

				self.$builder.off( 'click.DropdowmList' );

				const $button = $( self.options.button );

				if ( $button.hasClass( 'active' ) ) {
					$button.trigger( 'click' );
				}
			} );
		};

		/**
		 * Generate the dropdown HTML.
		 *
		 * @since 1.8.4
		 *
		 * @return {string} HTML.
		 */
		self.generateHtml = function() {
			const list = self.options.list;

			if ( ! list || list.length === 0 ) {
				return '';
			}

			const itemFormat = typeof self.options.itemFormat === 'function' ? self.options.itemFormat : defaultOptions.itemFormat;

			// Generate HTML.
			const items = [];

			for ( const i in list ) {
				items.push( `<li data-value="${ list[ i ].value }">${ itemFormat( list[ i ] ) }</li>` );
			}

			return `<div class="wpforms-builder-dropdown-list closed ${ self.options.class }">
				<div class="title">${ self.options.title }</div>
				<ul>${ items.join( '' ) }</ul>
			</div>`;
		};

		/**
		 * Attach dropdown to DOM.
		 *
		 * @since 1.8.4
		 */
		self.attach = function() {
			const html = self.generateHtml();

			// Remove old dropdown.
			if ( self.$el && self.$el.length ) {
				self.$el.remove();
			}

			// Create jQuery objects.
			self.$el = $( html );
			self.$button = $( self.options.button );
			self.$container = self.options.container ? $( self.options.container ) : self.$button.parent();
			self.$scrollableContainer = self.options.scrollableContainer ? $( self.options.scrollableContainer ) : null;

			// Add the dropdown to the container.
			self.$container.append( self.$el );

			self.setPosition();
		};

		/**
		 * Set dropdown position.
		 *
		 * @since 1.8.4
		 */
		self.setPosition = function() {
			// Calculate position.
			const buttonOffset = self.$button.offset(),
				containerOffset = self.$container.offset(),
				containerPosition = self.$container.position(),
				dropdownHeight = self.$el.height(),
				scrollTop = self.$scrollableContainer ? self.$scrollableContainer.scrollTop() : 0;

			let top = buttonOffset.top - containerOffset.top - dropdownHeight - self.options.buttonDistance;

			// In the case of the dropdown doesn't fit into the scrollable container to top, it is needed to open the dropdown to the bottom.
			if ( scrollTop + containerPosition.top - dropdownHeight < 0 ) {
				top = buttonOffset.top - containerOffset.top + self.$button.height() + self.options.buttonDistance - 11;
			}

			self.$el.css( 'top', top );

			// The dropdown is outside the field options, it is needed to set `left` positioning value.
			if ( self.$container.closest( '.wpforms-field-option' ).length === 0 ) {
				self.$el.css( 'left', buttonOffset.left - containerOffset.left );
			}
		};

		/**
		 * Events.
		 *
		 * @since 1.8.4
		 */
		self.events = function() {
			// Click (select) the item.
			self.$el.find( 'li' ).off()
				.on( 'click', function( event ) {
					// Bail if callback is not a function.
					if ( typeof self.options.onSelect !== 'function' ) {
						return;
					}

					const $item = $( this );

					self.options.onSelect( event, $item.data( 'value' ), $item.text(), $item, self );
				} );
		};

		/**
		 * Initialize.
		 *
		 * @since 1.8.4
		 *
		 * @param {Array} list List of items.
		 */
		self.init = function( list = null ) {
			self.options.list = list ? list : self.options.list;

			self.attach();
			self.events();

			self.$button.data( 'dropdown-list', self );
		};

		/**
		 * Destroy.
		 *
		 * @since 1.8.4
		 */
		self.destroy = function() {
			self.$button.data( 'dropdown-list', null );
			self.$el.remove();
		};

		// Initialize.
		self.init();
	}

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.4
	 *
	 * @type {Object}
	 */
	return {

		/**
		 * Start the engine. DOM is not ready yet, use only to init something.
		 *
		 * @since 1.8.4
		 *
		 * @param {Object} options Options.
		 *
		 * @return {Object} DropdownList instance.
		 */
		init( options ) {
			return new DropdownList( options );
		},
	};
}( document, window, jQuery ) );
