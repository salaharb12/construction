/* global wpforms_builder, WPFormsUtils */

/**
 * @param window.DOMPurify
 * @param wpforms_builder.currency_decimal
 * @param wpforms_builder.currency_decimals
 * @param wpforms_builder.currency_symbol
 * @param wpforms_builder.currency_symbol_pos
 * @param wpforms_builder.currency_thousands
 */
const wpf = {

	cachedFields: {},
	savedState: false,
	initialSave: true,
	orders: {
		fields: [],
		choices: {},
	},

	// This file contains a collection of utility functions.

	/**
	 * Start the engine.
	 *
	 * @since 1.0.1
	 */
	init() {
		wpf.bindUIActions();

		// Init Radio Group for Checkboxes.
		wpf.initRadioGroupForCheckboxes();

		jQuery( wpf.ready );
	},

	/**
	 * Document ready.
	 *
	 * @since 1.0.1
	 */
	ready() {
		// Load initial form saved state.
		wpf.savedState = wpf.getFormState( '#wpforms-builder-form' );

		// Save field and choice order for sorting later.
		wpf.setFieldOrders();
		wpf.setChoicesOrders();
	},

	/**
	 * Element bindings.
	 *
	 * @since 1.0.1
	 */
	bindUIActions() {
		// The following items should all trigger the fieldUpdate trigger.
		jQuery( document ).on( 'wpformsFieldAdd', wpf.setFieldOrders );
		jQuery( document ).on( 'wpformsFieldDelete', wpf.setFieldOrders );
		jQuery( document ).on( 'wpformsFieldMove', wpf.setFieldOrders );
		jQuery( document ).on( 'wpformsFieldAdd', wpf.setChoicesOrders );
		jQuery( document ).on( 'wpformsFieldChoiceAdd', wpf.setChoicesOrders );
		jQuery( document ).on( 'wpformsFieldChoiceDelete', wpf.setChoicesOrders );
		jQuery( document ).on( 'wpformsFieldChoiceMove', wpf.setChoicesOrders );
		jQuery( document ).on( 'wpformsFieldAdd', wpf.fieldUpdate );
		jQuery( document ).on( 'wpformsFieldDelete', wpf.fieldUpdate );
		jQuery( document ).on( 'wpformsFieldMove', wpf.fieldUpdate );
		jQuery( document ).on( 'focusout', '.wpforms-field-option-row-label input', wpf.fieldUpdate );
		jQuery( document ).on( 'wpformsFieldChoiceAdd', wpf.fieldUpdate );
		jQuery( document ).on( 'wpformsFieldChoiceDelete', wpf.fieldUpdate );
		jQuery( document ).on( 'wpformsFieldChoiceMove', wpf.fieldUpdate );
		jQuery( document ).on( 'wpformsFieldDynamicChoiceToggle', wpf.fieldUpdate );
		jQuery( document ).on( 'focusout', '.wpforms-field-option-row-choices input.label', wpf.fieldUpdate );
	},

	/**
	 * Store the order of the fields.
	 *
	 * @since 1.4.5
	 */
	setFieldOrders() {
		wpf.orders.fields = [];

		jQuery( '.wpforms-field-option' ).each( function() {
			wpf.orders.fields.push( jQuery( this ).data( 'field-id' ) );
		} );
	},

	/**
	 * Store the order of the choices for each field.
	 *
	 * @since 1.4.5
	 */
	setChoicesOrders() {
		wpf.orders.choices = {};

		jQuery( '.choices-list' ).each( function() {
			const fieldID = jQuery( this ).data( 'field-id' );

			wpf.orders.choices[ 'field_' + fieldID ] = [];

			jQuery( this ).find( 'li' ).each( function() {
				wpf.orders.choices[ 'field_' + fieldID ].push( jQuery( this ).data( 'key' ) );
			} );
		} );
	},

	/**
	 * Return the order of choices for a specific field.
	 *
	 * @since 1.4.5
	 *
	 * @param {number|string} id Field ID.
	 *
	 * @return {Array} Choices.
	 */
	getChoicesOrder( id ) {
		const choices = [];

		jQuery( '#wpforms-field-option-' + id ).find( '.choices-list li' ).each( function() {
			choices.push( jQuery( this ).data( 'key' ) );
		} );

		return choices;
	},

	/**
	 * Maintain multiselect dropdown with search.
	 * If a multiple select has selected choices - hide a placeholder text.
	 * In case if select is empty - we return placeholder text.
	 *
	 * @since 1.7.6
	 *
	 * @param {Object} self Current object.
	 */
	initMultipleSelectWithSearch( self ) {
		const $element = jQuery( self.passedElement.element ),
			$input = jQuery( self.input.element );

		if ( $element.prop( 'multiple' ) ) {
			// On init event.
			$input.data( 'placeholder', $input.attr( 'placeholder' ) );
			// We need to save the style attribute to restore it later and make placeholder visible.
			$input.data( 'style', $input.attr( 'style' ) );

			if ( self.getValue( true ).length ) {
				$input.removeAttr( 'placeholder' );
			}

			// On change event.
			$element.on( 'change', function() {
				// eslint-disable-next-line no-unused-expressions
				self.getValue( true ).length
					? $input.removeAttr( 'placeholder' )
					: $input.attr( 'placeholder', $input.data( 'placeholder' ) ).attr( 'style', $input.data( 'style' ) );
			} );
		}
	},

	/**
	 * Display/hide show more icon inside multiselect dropdown.
	 *
	 * @since 1.8.9
	 *
	 * @param {string} container Container element.
	 */
	showMoreButtonForChoices( container ) {
		if ( jQuery( container ).data( 'type' ) === 'select-one' ) {
			return;
		}

		const first = jQuery( container ).find( '.choices__list--multiple .choices__item' ).first(),
			last = jQuery( container ).find( '.choices__list--multiple .choices__item' ).last();

		jQuery( container ).removeClass( 'choices__show-more' );

		if ( first.length > 0 && last.length > 0 && first.position().top !== last.position().top ) {
			jQuery( container ).addClass( 'choices__show-more' );
		}
	},

	/**
	 * Initialize event handlers for choices.
	 *
	 * @since 1.9.0
	 */
	initializeChoicesEventHandlers() {
		// Show more button for choices.
		jQuery( document ).on( 'addItem removeItem', '.choices:not(.is-disabled)', function() {
			wpf.showMoreButtonForChoices( this );
		} );

		// Remove focus from input when dropdown is hidden.
		jQuery( document ).on( 'hideDropdown', '.choices:not(.is-disabled)', function() {
			jQuery( this ).find( '.choices__inner input.choices__input' ).trigger( 'blur' );
		} );
	},

	/**
	 * Reinitialize show more choices.
	 *
	 * @since 1.9.0
	 *
	 * @param {Object} container Container element.
	 */
	reInitShowMoreChoices( container ) {
		setTimeout( () => {
			container.find( '.choices select' ).each( function() {
				const $choiceInstance = jQuery( this ).data( 'choicesjs' );
				wpf.showMoreButtonForChoices( $choiceInstance.containerOuter.element );
			} );
		}, 100 );
	},

	/**
	 * Trigger fired for all field update related actions.
	 *
	 * @since 1.0.1
	 */
	fieldUpdate() {
		const fields = wpf.getFields();

		jQuery( document ).trigger( 'wpformsFieldUpdate', [ fields ] );

		wpf.debug( 'fieldUpdate triggered' );
	},

	/**
	 * Dynamically get the fields from the current form state.
	 *
	 * @since 1.0.1
	 * @since 1.8.9 Added `allowedFields` parameter.
	 *
	 * @param {Array|boolean|undefined} allowedFields           Allowed fields.
	 * @param {boolean|undefined}       useCache                Use cache.
	 * @param {boolean|undefined}       isAllowedRepeaterFields Is repeater fields allowed?
	 * @param {Object|undefined}        fieldsToExclude         Fields to exclude.
	 *
	 * @return {Object} Fields.
	 */
	getFields( allowedFields = undefined, useCache = undefined, isAllowedRepeaterFields = undefined, fieldsToExclude = undefined ) { // eslint-disable-line complexity, max-lines-per-function
		useCache = useCache || false;

		let fields;

		if ( useCache && ! jQuery.isEmptyObject( wpf.cachedFields ) ) {
			// Use cache if told and cache is primed.
			fields = jQuery.extend( {}, wpf.cachedFields );

			wpf.debug( 'getFields triggered (cached)' );
		} else {
			// Normal processing, get fields from builder and prime cache.
			const formData = wpf.formObject( '#wpforms-field-options' );

			fields = formData.fields;

			const fieldBlockList = [
				'captcha',
				'content',
				'divider',
				'entry-preview',
				'html',
				'internal-information',
				'pagebreak',
				'layout',
			];

			if ( ! fields ) {
				return false;
			}

			for ( const key in fields ) {
				if ( ! fields[ key ].type || jQuery.inArray( fields[ key ].type, fieldBlockList ) > -1 ) {
					delete fields[ key ];
				}

				if ( fields[ key ]?.type === 'repeater' ) {
					Object.values( fields[ key ][ 'columns-json' ] ?? {} ).forEach( ( column ) => {
						Object.values( column?.fields ?? [] ).forEach( ( field ) => {
							if ( ! fields[ field ] ) {
								return;
							}

							fields[ field ].label += ' (' + fields[ key ].label + ')';
							fields[ field ].isRepeater = true;
						} );
					} );

					delete fields[ key ];
				}
			}

			// Add additional fields to the fields object.
			wpf.addAdditionalFields( fields );

			// Cache the all the fields now that they have been ordered and initially processed.
			wpf.cachedFields = jQuery.extend( {}, fields );

			wpf.debug( 'getFields triggered' );
		}

		if ( ! isAllowedRepeaterFields ) {
			for ( const key in fields ) {
				if ( fields[ key ]?.isRepeater ) {
					delete fields[ key ];
				}
			}
		}

		if ( fieldsToExclude ) {
			for ( const key in fieldsToExclude ) {
				delete fields[ key ];
			}
		}

		// If we should only return specific field types, remove the others.
		if ( allowedFields && allowedFields.constructor === Array ) {
			for ( const key in fields ) {
				if ( jQuery.inArray( fields[ key ].type, allowedFields ) === -1 ) {
					delete fields[ key ];
				}
			}
		}

		if ( Object.keys( fields ).length === 0 ) {
			return false;
		}

		const orderedFields = [];

		for ( const fieldKey in wpf.orders.fields ) {
			const fieldId = wpf.orders.fields[ fieldKey ];

			if ( ! fields[ fieldId ] ) {
				continue;
			}

			orderedFields.push( fields[ fieldId ] );
		}

		return Object.assign( {}, orderedFields );
	},

	/**
	 * Add additional fields to the fields object.
	 *
	 * @since 1.8.9
	 *
	 * @param {Object} fields Fields object.
	 *
	 * @return {Object} Fields object with additional fields.
	 */
	addAdditionalFields( fields ) {
		for ( const key in fields ) {
			if ( [ 'name', 'date-time' ].includes( fields[ key ]?.type ) ) {
				// Get the name format and split it into an array.
				const nameFormat = fields[ key ].format;

				// Add the name fields to the fields object
				fields[ key ].additional = nameFormat.split( '-' );
			}

			if ( fields[ key ]?.type === 'address' ) {
				// Get all keys with "_placeholder" in the name (address1_placeholder, address2_placeholder, etc.)
				const addressFields = Object.keys( fields[ key ] ).filter( ( fieldKey ) => fieldKey.includes( '_placeholder' ) );

				// Remove "_placeholder" from the keys
				addressFields.forEach( ( fieldKey, index ) => {
					addressFields[ index ] = fieldKey.replace( '_placeholder', '' );
				} );

				// Add the address fields to the fields object
				fields[ key ].additional = addressFields;
			}
		}

		return fields;
	},

	/**
	 * Get a field settings object.
	 *
	 * @since 1.4.5
	 *
	 * @param {number|string} id Field ID.
	 *
	 * @return {Object} Field settings.
	 */
	getField( id ) {
		const field = wpf.formObject( '#wpforms-field-option-' + id );

		if ( ! Object.keys( field ).length ) {
			return {};
		}

		return field.fields[ Object.keys( field.fields )[ 0 ] ];
	},

	/**
	 * Toggle the loading state/indicator of a field option.
	 *
	 * @since 1.2.8
	 *
	 * @param {string|Element} option jQuery object, or DOM element selector.
	 * @param {boolean}        unload True if you need to unload spinner, and vice versa.
	 */
	fieldOptionLoading( option, unload = undefined ) {
		const $option = jQuery( option ),
			$label = $option.find( 'label' ),
			spinner = '<i class="wpforms-loading-spinner wpforms-loading-inline"></i>';

		unload = typeof unload !== 'undefined';

		if ( unload ) {
			$label.find( '.wpforms-loading-spinner' ).remove();
			$label.find( '.wpforms-help-tooltip' ).show();
			$option.find( 'input,select,textarea' ).prop( 'disabled', false );
		} else {
			$label.append( spinner );
			$label.find( '.wpforms-help-tooltip' ).hide();
			$option.find( 'input,select,textarea' ).prop( 'disabled', true );
		}
	},

	/**
	 * Get form state.
	 *
	 * @since 1.3.8
	 *
	 * @param {Object} el Element.
	 *
	 * @return {string} Form state.
	 */
	getFormState( el ) {
		// Serialize tested the most performant string we can use for comparisons.
		return jQuery( el ).serialize();
	},

	/**
	 * Remove items from an array.
	 *
	 * @since 1.0.1
	 *
	 * @param {Array} array An array.
	 * @param {any}   item  Array item.
	 *
	 * @return {number} Count of removed items.
	 */
	removeArrayItem( array, item ) {
		let removeCounter = 0;

		for ( let index = 0; index < array.length; index++ ) {
			if ( array[ index ] === item ) {
				array.splice( index, 1 );
				removeCounter++;
				index--;
			}
		}

		return removeCounter;
	},

	/**
	 * Sanitize string.
	 *
	 * @since 1.0.1
	 * @deprecated 1.2.8
	 *
	 * @param {string} str String to sanitize.
	 *
	 * @return {string} String after sanitization.
	 */
	sanitizeString( str ) {
		if ( typeof str === 'string' || str instanceof String ) {
			return str.trim();
		}

		return str;
	},

	/**
	 * Update query string in URL.
	 *
	 * @since 1.0.0
	 * @since 1.8.7 Refactored using URL API.
	 *
	 * @param {string}      key   Query string param.
	 * @param {string|null} value Query string value.
	 * @param {string|null} url   URL. If not defined, the current URL will be used.
	 *
	 * @return {string} Updated URL.
	 */
	updateQueryString( key, value, url = null ) {
		if ( ! url ) {
			url = window.location.href;
		}

		const urlObj = new URL( url );

		if ( typeof value !== 'undefined' && value !== null ) {
			// Update value.
			urlObj.searchParams.set( key, value );
		} else {
			// Remove param from the URL.
			urlObj.searchParams.delete( key );
		}

		return urlObj.toString();
	},

	/**
	 * Get query string in a URL.
	 *
	 * @since 1.0.0
	 *
	 * @param {string} name Query string param.
	 *
	 * @return {string} Query string value.
	 */
	getQueryString( name ) {
		const match = new RegExp( '[?&]' + name + '=([^&]*)' ).exec( window.location.search );

		return match && decodeURIComponent( match[ 1 ].replace( /\+/g, ' ' ) );
	},

	/**
	 * Remove defined query parameter in the current URL.
	 *
	 * @see https://gist.github.com/simonw/9445b8c24ddfcbb856ec#gistcomment-3117674
	 *
	 * @since 1.5.8
	 *
	 * @param {string} name The name of the parameter to be removed.
	 */
	removeQueryParam( name ) {
		if ( wpf.getQueryString( name ) ) {
			const replace = '[\\?&]' + name + '=[^&]+',
				re = new RegExp( replace );

			// eslint-disable-next-line no-unused-expressions
			history.replaceState && history.replaceState(
				null, '', location.pathname + location.search.replace( re, '' ).replace( /^&/, '?' ) + location.hash
			);
		}
	},

	/**
	 * Is number?
	 *
	 * @since 1.2.3
	 *
	 * @param {number|string} n Number to check.
	 *
	 * @return {boolean} Whether this is a number.
	 */
	isNumber( n ) {
		return ! isNaN( parseFloat( n ) ) && isFinite( n );
	},

	/**
	 * Sanitize amount and convert to standard format for calculations.
	 *
	 * @since 1.2.6
	 *
	 * @param {string} amount Price amount to sanitize.
	 *
	 * @return {string} Sanitized amount.
	 */
	amountSanitize( amount ) { // eslint-disable-line complexity
		// Convert to string, remove a currency symbol, and allow only numbers, dots, and commas.
		amount = String( amount ).replace( wpforms_builder.currency_symbol, '' ).replace( /[^0-9.,]/g, '' );

		if ( wpforms_builder.currency_decimal === ',' ) {
			if ( wpforms_builder.currency_thousands === '.' && amount.indexOf( wpforms_builder.currency_thousands ) !== -1 ) {
				amount = amount.replace( new RegExp( '\\' + wpforms_builder.currency_thousands, 'g' ), '' );
			} else if ( wpforms_builder.currency_thousands === '' && amount.indexOf( '.' ) !== -1 ) {
				amount = amount.replace( /\./g, '' );
			}
			amount = amount.replace( wpforms_builder.currency_decimal, '.' );
		} else if ( wpforms_builder.currency_thousands === ',' && ( amount.indexOf( wpforms_builder.currency_thousands ) !== -1 ) ) {
			amount = amount.replace( new RegExp( '\\' + wpforms_builder.currency_thousands, 'g' ), '' );
		}

		return wpf.numberFormat( amount, wpforms_builder.currency_decimals, '.', '' );
	},

	/**
	 * Format amount.
	 *
	 * @since 1.2.6
	 *
	 * @param {string} amount Price amount to format.
	 *
	 * @return {string} Formatted amount.
	 */
	amountFormat( amount ) {
		amount = String( amount );

		// Format the amount
		if ( wpforms_builder.currency_decimal === ',' && ( amount.indexOf( wpforms_builder.currency_decimal ) !== -1 ) ) {
			const sepFound = amount.indexOf( wpforms_builder.currency_decimal );

			amount = amount.substr( 0, sepFound ) + '.' + amount.substr( sepFound + 1, amount.length - 1 );
		}

		// Strip "," from the amount (if set as the thousand separators)
		if ( wpforms_builder.currency_thousands === ',' && ( amount.indexOf( wpforms_builder.currency_thousands ) !== -1 ) ) {
			amount = amount.replace( /,/g, '' );
		}

		if ( wpf.empty( amount ) ) {
			amount = '0';
		}

		return wpf.numberFormat( amount, wpforms_builder.currency_decimals, wpforms_builder.currency_decimal, wpforms_builder.currency_thousands );
	},

	/**
	 * Format amount with currency symbol.
	 *
	 * @since 1.6.2
	 *
	 * @param {string} amount Amount to format.
	 *
	 * @return {string} Formatted amount (for instance $ 128.00).
	 */
	amountFormatCurrency( amount ) {
		const sanitized = wpf.amountSanitize( amount ),
			formatted = wpf.amountFormat( sanitized );

		let result;

		if ( wpforms_builder.currency_symbol_pos === 'right' ) {
			result = formatted + ' ' + wpforms_builder.currency_symbol;
		} else {
			result = wpforms_builder.currency_symbol + formatted;
		}

		return result;
	},

	/**
	 * Format number.
	 *
	 * @see http://locutus.io/php/number_format/
	 *
	 * @since 1.2.6
	 *
	 * @param {string} number       Number to format.
	 * @param {number} decimals     How many decimals should be there.
	 * @param {string} decimalSep   What is the decimal separator.
	 * @param {string} thousandsSep What is the thousand separator.
	 *
	 * @return {string} Formatted number.
	 */
	numberFormat( number, decimals, decimalSep, thousandsSep ) { // eslint-disable-line complexity
		number = ( number + '' ).replace( /[^0-9+\-Ee.]/g, '' );
		const n = ! isFinite( +number ) ? 0 : +number;
		const precision = ! isFinite( +decimals ) ? 0 : Math.abs( decimals );
		const sep = ( typeof thousandsSep === 'undefined' ) ? ',' : thousandsSep;
		const dec = ( typeof decimalSep === 'undefined' ) ? '.' : decimalSep;
		let s = '';

		const toFixedFix = function( fixedN, fixedPrecision ) {
			const k = Math.pow( 10, fixedPrecision );
			return '' + ( Math.round( fixedN * k ) / k ).toFixed( fixedPrecision );
		};

		// @todo: for IE parseFloat(0.55).toFixed(0) = 0;
		s = ( precision ? toFixedFix( n, precision ) : '' + Math.round( n ) ).split( '.' );
		if ( s[ 0 ].length > 3 ) {
			s[ 0 ] = s[ 0 ].replace( /\B(?=(?:\d{3})+(?!\d))/g, sep );
		}
		if ( ( s[ 1 ] || '' ).length < precision ) {
			s[ 1 ] = s[ 1 ] || '';
			s[ 1 ] += new Array( precision - s[ 1 ].length + 1 ).join( '0' );
		}

		return s.join( dec );
	},

	/**
	 * Empty check similar to PHP.
	 * {@link http://locutus.io/php/empty}.
	 *
	 * @since 1.2.6
	 *
	 * @param {any} mixedVar A variable to check.
	 *
	 * @return {boolean} True if the variable is empty.
	 */
	empty( mixedVar ) {
		let undef;
		let key;
		let i;
		let len;
		const emptyValues = [ undef, null, false, 0, '', '0' ];

		for ( i = 0, len = emptyValues.length; i < len; i++ ) {
			if ( mixedVar === emptyValues[ i ] ) {
				return true;
			}
		}

		if ( typeof mixedVar === 'object' ) {
			for ( key in mixedVar ) {
				if ( mixedVar.hasOwnProperty( key ) ) {
					return false;
				}
			}
			return true;
		}

		return false;
	},

	/**
	 * Debug output helper.
	 *
	 * @since 1.3.8
	 *
	 * @param {string|number|boolean|Array|Object} msg Debug message (any data).
	 */
	debug( ...msg ) {
		if ( ! wpf.isDebug() ) {
			return;
		}

		// eslint-disable-next-line no-console
		console.log( '%cWPForms Debug: ', 'color: #cd6622;', ...msg );
	},

	/**
	 * Is debug mode.
	 *
	 * @since 1.3.8
	 *
	 * @return {boolean} True if debug mode is enabled.
	 */
	isDebug() {
		return ( ( window.location.hash && '#wpformsdebug' === window.location.hash ) || window.wpforms_builder?.debug );
	},

	/**
	 * Focus the input/textarea and put the caret at the end of the text.
	 *
	 * @since 1.4.1
	 *
	 * @param {jQuery} el Element.
	 */
	focusCaretToEnd( el ) {
		el.trigger( 'focus' );

		const $thisVal = el.val();

		el.val( '' ).val( $thisVal );
	},

	/**
	 * Creates a object from form elements.
	 *
	 * @since 1.4.5
	 *
	 * @param {jQuery|string} el Element.
	 *
	 * @return {Object} Object.
	 */
	formObject( el ) { // eslint-disable-line max-lines-per-function, complexity
		const form = jQuery( el ),
			fields = form.find( '[name]' ),
			json = {},
			arrayNames = {};

		/* eslint-disable max-depth */
		for ( let v = 0; v < fields.length; v++ ) {
			const field = jQuery( fields[ v ] ),
				name = field.prop( 'name' ).replace( /\]/gi, '' ).split( '[' );
			let value = field.val(),
				lineConf = {};

			if ( ( field.is( ':radio' ) || field.is( ':checkbox' ) ) && ! field.is( ':checked' ) ) {
				continue;
			}

			for ( let i = name.length - 1; i >= 0; i-- ) {
				let nestName = name[ i ];

				if ( typeof nestName === 'undefined' ) {
					nestName = '';
				}

				if ( nestName.length === 0 ) {
					lineConf = [];

					if ( typeof arrayNames[ name[ i - 1 ] ] === 'undefined' ) {
						arrayNames[ name[ i - 1 ] ] = 0;
					} else {
						arrayNames[ name[ i - 1 ] ] += 1;
					}

					nestName = arrayNames[ name[ i - 1 ] ];
				}

				if ( i === name.length - 1 ) {
					if ( value ) {
						if ( value === 'true' ) {
							value = true;
						} else if ( value === 'false' ) {
							value = false;
						} else if ( ! isNaN( parseFloat( value ) ) && parseFloat( value ).toString() === value ) {
							value = parseFloat( value );
						} else if ( typeof value === 'string' && ( value.substr( 0, 1 ) === '{' || value.substr( 0, 1 ) === '[' ) ) {
							try {
								value = JSON.parse( value );
							} catch ( e ) {
							}
						} else if ( typeof value === 'object' && value.length && field.is( 'select' ) ) {
							const newValue = {};

							for ( let j = 0; j < value.length; j++ ) {
								newValue[ 'n' + j ] = value[ j ];
							}

							value = newValue;
						}
					}

					lineConf[ nestName ] = value;
				} else {
					const newObj = lineConf;
					lineConf = {};
					lineConf[ nestName ] = newObj;
				}
			}

			jQuery.extend( true, json, lineConf );
		}
		/* eslint-enable max-depth */

		return json;
	},

	/**
	 * Initialize WPForms admin area tooltips.
	 *
	 * @since 1.4.8
	 * @since 1.6.5 Introduced optional $scope parameter.
	 *
	 * @param {jQuery|HTMLElement|null} $scope Searching scope.
	 */
	initTooltips( $scope = null ) {
		if ( typeof jQuery.fn.tooltipster === 'undefined' ) {
			return;
		}

		const isRTL = jQuery( 'body' ).hasClass( 'rtl' );
		const position = isRTL ? 'left' : 'right';

		const $tooltips = ! $scope ? jQuery( '.wpforms-help-tooltip' ) : jQuery( $scope ).find( '.wpforms-help-tooltip' );

		$tooltips.each( function() {
			const $this = jQuery( this );

			$this.tooltipster( {
				contentAsHTML: true,
				position: $this.data( 'tooltip-position' ) || position,
				maxWidth: 300,
				multiple: true,
				interactive: true,
				debug: false,
				IEmin: 11,
				zIndex: 99999999,
			} );
		} );
	},

	/**
	 * Restore WPForms admin area tooltip's title.
	 *
	 * @since 1.6.5
	 *
	 * @param {jQuery|undefined} $scope Searching scope.
	 */
	restoreTooltips( $scope ) {
		$scope = typeof $scope !== 'undefined' && $scope && $scope.length > 0 ? $scope.find( '.wpforms-help-tooltip' ) : jQuery( '.wpforms-help-tooltip' );

		$scope.each( function() {
			const $this = jQuery( this );
			if ( jQuery.tooltipster.instances( this ).length !== 0 ) {
				// Restoring title.
				$this.attr( 'title', $this.tooltipster( 'content' ) );
			}
		} );
	},

	/**
	 * Validate a URL.
	 * source: `https://github.com/segmentio/is-url/blob/master/index.js`
	 *
	 * @since 1.5.8
	 *
	 * @param {string} url URL for checking.
	 *
	 * @return {boolean} True if `url` is a valid URL.
	 */
	isURL( url ) {
		// noinspection RegExpUnnecessaryNonCapturingGroup
		/**
		 * RegExps.
		 * A URL must match #1 and then at least one of #2/#3.
		 * Use two levels of REs to avoid REDOS.
		 */
		const protocolAndDomainRE = /^(?:http(?:s?):)?\/\/(\S+)/;
		/* eslint-disable no-useless-escape */
		// noinspection RegExpRedundantEscape
		const localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
		// noinspection RegExpRedundantEscape
		const nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;
		/* eslint-enable no-useless-escape */

		if ( typeof url !== 'string' ) {
			return false;
		}

		const match = url.match( protocolAndDomainRE );

		if ( ! match ) {
			return false;
		}

		const everythingAfterProtocol = match[ 1 ];
		if ( ! everythingAfterProtocol ) {
			return false;
		}

		return localhostDomainRE.test( everythingAfterProtocol ) || nonLocalhostDomainRE.test( everythingAfterProtocol );
	},

	/**
	 * Sanitize HTML.
	 * Uses: `https://github.com/cure53/DOMPurify`
	 *
	 * @since 1.5.9
	 * @since 1.7.8 Introduced optional allowed parameter.
	 *
	 * @param {string|undefined} string  HTML to sanitize.
	 * @param {Array|undefined}  allowed Array of allowed HTML tags.
	 *
	 * @return {string} Sanitized HTML.
	 */
	sanitizeHTML( string = undefined, allowed = undefined ) {
		const purify = window.DOMPurify;

		if ( typeof purify === 'undefined' || typeof string === 'undefined' ) {
			return string;
		}

		if ( typeof string !== 'string' ) {
			string = string.toString();
		}

		const purifyOptions = {
			ADD_ATTR: [ 'target' ],
		};

		if ( typeof allowed !== 'undefined' ) {
			purifyOptions.ALLOWED_TAGS = allowed;
		}

		return purify.sanitize( string, purifyOptions ).trim();
	},

	/**
	 * Encode HTML entities.
	 * Uses: `https://stackoverflow.com/a/18750001/9745718`
	 *
	 * @since 1.6.3
	 *
	 * @param {string} string HTML to sanitize.
	 *
	 * @return {string} String with encoded HTML entities.
	 */
	encodeHTMLEntities( string ) {
		if ( typeof string !== 'string' ) {
			string = string.toString();
		}

		return string.replace( /[\u00A0-\u9999<>&]/gim, function( i ) {
			return '&#' + i.charCodeAt( 0 ) + ';';
		} );
	},

	/**
	 * Decode allowed HTML entities.
	 *
	 * @since 1.9.0
	 *
	 * @param {string} string String to decode.
	 *
	 * @return {string} String with decoded allowed HTML entities.
	 */
	decodeAllowedHTMLEntities( string ) {
		if ( typeof string !== 'string' ) {
			string = string.toString();
		}

		/**
		 * Filter: `wpforms.allowedHTMLEntities`.
		 * Allow developers to add or remove allowed HTML entities.
		 *
		 * @since 1.9.0
		 *
		 * @param {Object} allowedEntities List of allowed HTML entities.
		 */
		const allowedEntities = wp.hooks.applyFilters(
			'wpforms.allowedHTMLEntities',
			{
				'&amp;': '&',
				'&nbsp;': ' ',
			}
		);

		for ( const entity in allowedEntities ) {
			string = string.replaceAll( entity, allowedEntities[ entity ] );
		}

		return string;
	},

	/**
	 * Radio Group for Checkboxes.
	 *
	 * @since 1.6.6
	 */
	initRadioGroupForCheckboxes() {
		const $ = jQuery;

		$( document ).on( 'change', 'input[type="checkbox"].wpforms-radio-group', function() {
			const $input = $( this );

			if ( ! $input.prop( 'checked' ) ) {
				return;
			}

			const groupName = $input.data( 'radio-group' ),
				$group = $( '.wpforms-radio-group-' + groupName ),
				inputId = $input.attr( 'id' );
			let $item;

			$group.each( function() {
				$item = $( this );
				if ( $item.attr( 'id' ) !== inputId ) {
					$item.prop( 'checked', false );
				}
			} );
		} );
	},

	/**
	 * Pluck a certain field out of each object in a list.
	 *
	 * JS implementation of the `wp_list_pluck()`.
	 *
	 * @since 1.6.8
	 *
	 * @param {Array}  arr    Array of objects.
	 * @param {string} column Column.
	 *
	 * @return {Array} Array with extracted column values.
	 */
	listPluck( arr, column ) {
		return arr.map( function( x ) {
			if ( typeof x !== 'undefined' ) {
				return x[ column ];
			}

			return x;
		} );
	},

	/**
	 * Wrapper to trigger a native or custom event and return the event object.
	 *
	 * @since 1.7.5
	 * @since 1.7.6 Deprecated.
	 *
	 * @deprecated Use `WPFormsUtils.triggerEvent` instead.
	 *
	 * @param {jQuery} $element  Element to trigger event on.
	 * @param {string} eventName Event name to trigger (custom or native).
	 *
	 * @return {Event} Event object.
	 */
	triggerEvent( $element, eventName ) {
		// eslint-disable-next-line no-console
		console.warn( 'WARNING! Function "wpf.triggerEvent( $element, eventName )" has been deprecated, please use the new "WPFormsUtils.triggerEvent( $element, eventName, args )" function instead!' );

		return WPFormsUtils.triggerEvent( $element, eventName );
	},

	/**
	 * Automatically add paragraphs to the text.
	 *
	 * JS implementation of the `wpautop()`.
	 *
	 * @see https://github.com/andymantell/node-wpautop/blob/master/lib/wpautop.js
	 *
	 * @since 1.7.7
	 *
	 * @param {string}  pee Text to be replaced.
	 * @param {boolean} br  Whether remaining \n characters should be replaced with <br />.
	 *
	 * @return {string} Text with replaced paragraphs.
	 */
	wpautop( pee, br = true ) { // eslint-disable-line max-lines-per-function, complexity
		const preTags = new Map();
		const _autopNewlinePreservationHelper = function( matches ) {
			return matches[ 0 ].replace( '\n', '<WPPreserveNewline />' );
		};

		if ( ( typeof pee ) !== 'string' && ! ( pee instanceof String ) ) {
			return pee;
		}

		if ( pee.trim() === '' ) {
			return '';
		}

		pee = pee + '\n'; // Just to make things a little easier, pad the end.

		if ( pee.indexOf( '<pre' ) > -1 ) {
			const peeParts = pee.split( '</pre>' ),
				lastPee = peeParts.pop();

			pee = '';

			peeParts.forEach(
				function( peePart, index ) {
					const start = peePart.indexOf( '<pre' );

					// Malformed html?
					if ( start === -1 ) {
						pee += peePart;
						return;
					}

					const name = '<pre wp-pre-tag-' + index + '></pre>';
					preTags[ name ] = peePart.substring( start ) + '</pre>';
					pee += peePart.substring( 0, start ) + name;
				}
			);

			pee += lastPee;
		}

		pee = pee.replace( /<br \/>\s*<br \/>/, '\n\n' );

		// Space things out a little.
		const allBlocks = '(?:table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|form|map|area|blockquote|address|math|style|p|h[1-6]|hr|fieldset|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary)';

		pee = pee.replace( new RegExp( '(<' + allBlocks + '[^>]*>)', 'gmi' ), '\n$1' );
		pee = pee.replace( new RegExp( '(</' + allBlocks + '>)', 'gmi' ), '$1\n\n' );
		pee = pee.replace( /\r\n|\r/, '\n' ); // cross-platform newlines.

		if ( pee.indexOf( '\n' ) === 0 ) {
			pee = pee.substring( 1 );
		}

		if ( pee.indexOf( '<option' ) > -1 ) {
			// no P/BR around option.
			pee = pee.replace( /(?=(\s*))\2<option'/gmi, '<option' );
			pee = pee.replace( /<\/option>\s*/gmi, '</option>' );
		}

		if ( pee.indexOf( '</object>' ) > -1 ) {
			// no P/BR around param and embed.
			pee = pee.replace( /(<object[^>]*>)\s*/gmi, '$1' );
			pee = pee.replace( /(?=(\s*))\2<\/object>/gmi, '</object>' );
			pee = pee.replace( /(?=(\s*))\2(<\/?(?:param|embed)[^>]*>)((?=(\s*))\2)/gmi, '$1' );
		}

		/* eslint-disable no-useless-escape */

		if ( pee.indexOf( '<source' ) > -1 || pee.indexOf( '<track' ) > -1 ) {
			// no P/BR around source and track.
			pee = pee.replace( /([<\[](?:audio|video)[^>\]]*[>\]])\s*/gmi, '$1' );
			pee = pee.replace( /(?=(\s*))\2([<\[]\/(?:audio|video)[>\]])/gmi, '$1' );
			pee = pee.replace( /(?=(\s*))\2(<(?:source|track)[^>]*>)(?=(\s*))\2/gmi, '$1' );
		}

		pee = pee.replace( /\n\n+/gmi, '\n\n' ); // take care of duplicates.

		// make paragraphs, including one at the end.
		const pees = pee.split( /\n\s*\n/ );

		pee = '';

		pees.forEach(
			function( tinkle ) {
				pee += '<p>' + tinkle.replace( /^(?:\s+|\s+)$/g, '' ) + '</p>\n';
			}
		);

		pee = pee.replace( /<p>\s*<\/p>/gmi, '' ); // Under certain strange conditions, it could create a P of entire whitespace.
		pee = pee.replace( /<p>([^<]+)<\/(div|address|form)>/gmi, '<p>$1</p></$2>' );
		pee = pee.replace( new RegExp( '<p>\s*(</?' + allBlocks + '[^>]*>)\s*</p>', 'gmi' ), '$1', pee ); // don't pee all over a tag.
		pee = pee.replace( /<p>(<li.+?)<\/p>/gmi, '$1' ); // problem with nested lists.
		pee = pee.replace( /<p><blockquote([^>]*)>/gmi, '<blockquote$1><p>' );
		pee = pee.replace( /<\/blockquote><\/p>/gmi, '</p></blockquote>' );
		pee = pee.replace( new RegExp( '<p>\s*(</?' + allBlocks + '[^>]*>)', 'gmi' ), '$1' );
		pee = pee.replace( new RegExp( '(</?' + allBlocks + '[^>]*>)\s*</p>', 'gmi' ), '$1' );

		if ( br ) {
			pee = pee.replace( /<(script|style)(?:.|\n)*?<\/\\1>/gmi, _autopNewlinePreservationHelper ); // /s modifier from php PCRE regexp replaced with (?:.|\n).
			pee = pee.replace( /(<br \/>)?((?=(\s*))\2)\n/gmi, '<br />\n' ); // optionally make line breaks.
			pee = pee.replace( '<WPPreserveNewline />', '\n' );
		}

		pee = pee.replace( new RegExp( '(</?' + allBlocks + '[^>]*>)\s*<br />', 'gmi' ), '$1' );
		pee = pee.replace( /<br \/>(\s*<\/?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)/gmi, '$1' );
		pee = pee.replace( /\n<\/p>$/gmi, '</p>' );

		/* eslint-enable */

		if ( Object.keys( preTags ).length ) {
			pee = pee.replace(
				new RegExp( Object.keys( preTags ).join( '|' ), 'gi' ),
				function( matched ) {
					return preTags[ matched ];
				}
			);
		}

		return pee;
	},

	/**
	 * Init Media Library.
	 *
	 * @since 1.8.6
	 *
	 * @param {Object} args List of arguments.
	 *
	 * @return {wp.media.view.MediaFrame} A media workflow.
	 */
	initMediaLibrary( args ) {
		const mediaFrame = wp.media.frames.wpforms_media_frame = wp.media( {
			className: 'media-frame wpforms-media-frame',
			multiple: false,
			title: args.title,
			library: { type: args.extensions },
			button: {
				text: args.buttonText,
			},
		} );

		mediaFrame.on( 'uploader:ready', function() {
			const accept = args.extensions.join( ',' );

			jQuery( '.wpforms-media-frame .moxie-shim-html5 input[type="file"]' )
				.attr( 'accept', accept );
		} ).on( 'library:selection:add', function() {
			const attachment = mediaFrame.state().get( 'selection' ).first().toJSON();

			if ( ! args.extensions.includes( attachment.file.type ) ) {
				// eslint-disable-next-line no-alert
				alert( args.extensionsError );
				mediaFrame.state().get( 'selection' ).reset();
			}
		} );

		return mediaFrame;
	},

	/**
	 * Determine whether an element is visible in the viewport.
	 *
	 * @since 1.8.8
	 *
	 * @param {jQuery} $element DOM element.
	 *
	 * @return {boolean} true if an element is visible in the viewport.
	 */
	isInViewport( $element ) {
		const rect = $element[ 0 ].getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= ( window.innerHeight || document.documentElement.clientHeight ) &&
			rect.right <= ( window.innerWidth || document.documentElement.clientWidth )
		);
	},
};

wpf.init();
