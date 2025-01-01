
// noinspection ES6ConvertVarToLetConst
// eslint-disable-next-line no-var, no-unused-vars
var WPFormsUtils = window.WPFormsUtils || ( function( document, window, $ ) {
	/**
	 * Public functions and properties.
	 *
	 * @since 1.7.6
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Wrapper to trigger a native or custom event and return the event object.
		 *
		 * @since 1.7.6
		 *
		 * @param {jQuery} $element  Element to trigger event on.
		 * @param {string} eventName Event name to trigger (custom or native).
		 * @param {Array}  args      Trigger arguments.
		 *
		 * @return {Event} Event object.
		 */
		triggerEvent( $element, eventName, args = [] ) {
			const eventObject = new $.Event( eventName );

			$element.trigger( eventObject, args );

			return eventObject;
		},

		/**
		 * Debounce.
		 *
		 * This function comes directly from underscore.js:
		 *
		 * Returns a function, that, as long as it continues to be invoked, will not
		 * be triggered. The function will be called after it stops being called for
		 * N milliseconds. If `immediate` is passed, trigger the function on the
		 * leading edge, instead of the trailing.
		 *
		 * Debouncing is removing unwanted input noise from buttons, switches or other user input.
		 * Debouncing prevents extra activations or slow functions from triggering too often.
		 *
		 * @param {Function} func      The function to be debounced.
		 * @param {number}   wait      The amount of time to delay calling func.
		 * @param {boolean}  immediate Whether or not to trigger the function on the leading edge.
		 *
		 * @return {Function} Returns a function that, as long as it continues to be invoked, will not be triggered.
		 */
		debounce( func, wait, immediate ) {
			let timeout;

			return function() {
				const context = this,
					args = arguments;
				const later = function() {
					timeout = null;

					if ( ! immediate ) {
						func.apply( context, args );
					}
				};

				const callNow = immediate && ! timeout;

				clearTimeout( timeout );

				timeout = setTimeout( later, wait );

				if ( callNow ) {
					func.apply( context, args );
				}
			};
		},

		/**
		 * CSS color operations.
		 *
		 * @since 1.8.8
		 *
		 * @type {Object}
		 */
		cssColorsUtils: {
			/**
			 * Checks if the provided color has transparency.
			 *
			 * @since 1.8.8
			 *
			 * @param {string} color            The color to check.
			 * @param {number} opacityThreshold The max opacity value of the color that is considered as transparent.
			 *
			 * @return {boolean} Returns true if the color is transparent.
			 */
			isTransparentColor( color, opacityThreshold = 0.33 ) {
				const rgba = app.cssColorsUtils.getColorAsRGBArray( color );
				const opacity = Number( rgba?.[ 3 ] );

				// Compare the opacity value with the threshold.
				return opacity <= opacityThreshold;
			},

			/**
			 * Get color as an array of RGB(A) values.
			 *
			 * @since 1.8.8
			 *
			 * @param {string} color Color.
			 *
			 * @return {Array|boolean} Color as an array of RGBA values. False on error.
			 */
			getColorAsRGBArray( color ) {
				// Check if the given color is a valid CSS color.
				if ( ! app.cssColorsUtils.isValidColor( color ) ) {
					return false;
				}

				// Remove # from the beginning of the string and remove whitespaces.
				color = color.replace( /^#/, '' ).replaceAll( ' ', '' );
				color = color === 'transparent' ? 'rgba(0,0,0,0)' : color;

				const rgba = color;
				let rgbArray;

				// Check if color is in HEX(A) format.
				const isHex = rgba.match( /[0-9a-f]{6,8}$/ig );

				if ( isHex ) {
					// Search and split HEX(A) color into an array of couples of chars.
					rgbArray = rgba.match( /\w\w/g ).map( ( x ) => parseInt( x, 16 ) );
					rgbArray[ 3 ] = rgbArray[ 3 ] || rgbArray[ 3 ] === 0 ? ( rgbArray[ 3 ] / 255 ).toFixed( 2 ) : 1;
				} else {
					rgbArray = rgba.split( '(' )[ 1 ].split( ')' )[ 0 ].split( ',' );
				}

				return rgbArray;
			},

			/**
			 * Check if the given color is a valid CSS color.
			 *
			 * @since 1.8.8
			 *
			 * @param {string} color Color.
			 *
			 * @return {boolean} True if the given color is a valid CSS color.
			 */
			isValidColor( color ) {
				// Create a temporary DOM element and use `style` property.
				const s = new Option().style;

				s.color = color;

				// Invalid color leads to the empty color property of DOM element style.
				return s.color !== '';
			},

			/**
			 * Get contrast color relative to given color.
			 *
			 * @since 1.8.8
			 *
			 * @param {string} color Color.
			 *
			 * @return {string} True if the given color is a valid CSS color.
			 */
			getContrastColor( color ) {
				const rgba = app.cssColorsUtils.getColorAsRGBArray( color );
				const sum = rgba.reduce( ( a, b ) => a + b, 0 );
				const avg = Math.round( ( sum / 3 ) * ( rgba[ 3 ] ?? 1 ) );

				return avg < 128 ? '#ffffff' : '#000000';
			},

			/**
			 * Add opacity to color string.
			 * Supports formats: RGB, RGBA, HEX, HEXA.
			 *
			 * If the given color has an alpha channel, the new alpha channel will be calculated according to the given opacity.
			 *
			 * @since 1.8.9
			 *
			 * @param {string} color   Color.
			 * @param {string} opacity Opacity.
			 *
			 * @return {string} Color in RGBA format with an added alpha channel according to given opacity.
			 */
			getColorWithOpacity( color, opacity ) {
				color = color.trim();

				const rgbArray = app.cssColorsUtils.getColorAsRGBArray( color );

				if ( ! rgbArray ) {
					return color;
				}

				// Default opacity is 1.
				opacity = ! opacity || opacity.length === 0 ? '1' : opacity.toString();

				const alpha = rgbArray.length === 4 ? parseFloat( rgbArray[ 3 ] ) : 1;

				// Calculate new alpha value.
				const newAlpha = parseFloat( opacity ) * alpha;

				// Combine and return the RGBA color.
				return `rgba(${ rgbArray[ 0 ] },${ rgbArray[ 1 ] },${ rgbArray[ 2 ] },${ newAlpha })`.replace( /\s+/g, '' );
			},
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );
