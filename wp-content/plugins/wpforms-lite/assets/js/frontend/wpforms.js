/* global wpforms_settings, grecaptcha, hcaptcha, turnstile, wpformsRecaptchaCallback, wpformsRecaptchaV3Execute, wpforms_validate, wpforms_datepicker, wpforms_timepicker, Mailcheck, Choices, WPFormsPasswordField, WPFormsEntryPreview, punycode, tinyMCE, WPFormsUtils, JQueryDeferred, JQueryXHR, WPFormsRepeaterField */

/* eslint-disable no-unused-expressions, no-shadow, no-unused-vars */

/**
 * @param wpforms_settings.hn_data
 */

// noinspection ES6ConvertVarToLetConst
/**
 * WPForms object.
 *
 * @since 1.4.0
 */
var wpforms = window.wpforms || ( function( document, window, $ ) { // eslint-disable-line no-var
	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.9
	 *
	 * @type {Object}
	 */
	const app = {
		/**
		 * Cache.
		 *
		 * @since 1.8.5
		 */
		cache: {},

		/**
		 * Is updating token via ajax flag.
		 *
		 * @since 1.8.8
		 */
		isUpdatingToken: false,

		/**
		 * Start the engine.
		 *
		 * @since 1.2.3
		 */
		init() {
			// Document ready.
			$( app.ready );

			// Page load.
			$( window ).on( 'load', function() {
				// In the case of jQuery 3.+, we need to wait for a ready event first.
				if ( typeof $.ready.then === 'function' ) {
					$.ready.then( app.load );
				} else {
					app.load();
				}
			} );

			app.bindUIActions();
			app.bindOptinMonster();
		},

		/**
		 * Document ready.
		 *
		 * @since 1.2.3
		 */
		ready() {
			// Clear URL - remove wpforms_form_id.
			app.clearUrlQuery();

			// Set user identifier.
			app.setUserIdentifier();

			app.loadValidation();
			app.loadHoneypot();
			app.loadDatePicker();
			app.loadTimePicker();
			app.loadInputMask();
			app.loadSmartPhoneField();
			app.loadPayments();
			app.loadMailcheck();
			app.loadChoicesJS();
			app.initTokenUpdater();
			app.restoreSubmitButtonOnEventPersisted();

			app.bindSmartPhoneField();
			app.bindChoicesJS();

			// Randomize elements.
			$( '.wpforms-randomize' ).each( function() {
				const $list = $( this ),
					$listItems = $list.children();

				while ( $listItems.length ) {
					$list.append( $listItems.splice( Math.floor( Math.random() * $listItems.length ), 1 )[ 0 ] );
				}
			} );

			// Unlock pagebreak navigation.
			$( '.wpforms-page-button' ).prop( 'disabled', false );

			// Init forms' start timestamp.
			app.initFormsStartTime();

			$( document ).trigger( 'wpformsReady' );

			$( '.wpforms-smart-phone-field' ).each( function() {
				app.repairSmartPhoneHiddenField( $( this ) );
			} );
		},

		/**
		 * Page load.
		 *
		 * @since 1.2.3
		 */
		load() {
		},

		//--------------------------------------------------------------------//
		// Initializing
		//--------------------------------------------------------------------//

		/**
		 * Remove wpforms_form_id from URL.
		 *
		 * @since 1.5.2
		 */
		clearUrlQuery() {
			const loc = window.location;
			let query = loc.search;

			if ( query.indexOf( 'wpforms_form_id=' ) !== -1 ) {
				query = query.replace( /([&?]wpforms_form_id=[0-9]*$|wpforms_form_id=[0-9]*&|[?&]wpforms_form_id=[0-9]*(?=#))/, '' );
				history.replaceState( {}, null, loc.origin + loc.pathname + query );
			}
		},

		/**
		 * Load honeypot v2 field.
		 *
		 * @since 1.9.0
		 */
		loadHoneypot() {
			$( '.wpforms-form' ).each( function() {
				const $form = $( this ),
					formId = $form.data( 'formid' ),
					fieldIds = [],
					fieldLabels = [];

				// Bail early if honeypot protection is disabled for the form.
				if ( wpforms_settings.hn_data[ formId ] === undefined ) {
					return;
				}

				// Collect all field IDs and labels.
				$( `#wpforms-form-${ formId } .wpforms-field` ).each( function() {
					const $field = $( this );

					fieldIds.push( $field.data( 'field-id' ) );
					fieldLabels.push( $field.find( '.wpforms-field-label' ).text() );
				} );

				const label = app.getHoneypotRandomLabel( fieldLabels.join( ' ' ).split( ' ' ) ),
					honeypotFieldId = app.getHoneypotFieldId( fieldIds );

				// Insert the honeypot field before a random field.
				const insertBeforeId = fieldIds[ Math.floor( Math.random() * fieldIds.length ) ],
					honeypotIdAttr = `wpforms-${ formId }-field_${ honeypotFieldId }`,
					$insertBeforeField = $( `#wpforms-${ formId }-field_${ insertBeforeId }-container`, $form ),
					inlineStyles = 'position: absolute !important; overflow: hidden !important; display: inline !important; height: 1px !important; width: 1px !important; z-index: -1000 !important; padding: 0 !important;',
					labelInlineStyles = 'counter-increment: none;',
					fieldHTML = `
						<div id="${ honeypotIdAttr }-container" class="wpforms-field wpforms-field-text" data-field-type="text" data-field-id="${ honeypotFieldId }" style="${ inlineStyles }">
							<label class="wpforms-field-label" for="${ honeypotIdAttr }" aria-hidden="true" style="${ labelInlineStyles }">${ label }</label>
							<input type="text" id="${ honeypotIdAttr }" class="wpforms-field-medium" name="wpforms[fields][${ honeypotFieldId }]" aria-hidden="true" style="visibility: hidden;" tabindex="-1">
						</div>`;

				$insertBeforeField.before( fieldHTML );

				// Add inline properties for honeypot field on the form.
				const $fieldContainer = $( `#wpforms-${ formId }-field_${ wpforms_settings.hn_data[ formId ] }-container`, $form );

				$fieldContainer.find( 'input' ).attr( {
					tabindex: '-1',
					'aria-hidden': 'true',
				} );

				$fieldContainer.find( 'label' ).attr( 'aria-hidden', 'true' );
			} );
		},

		/**
		 * Generate random Honeypot label.
		 *
		 * @since 1.9.0
		 *
		 * @param {Array} words List of words.
		 *
		 * @return {string} Honeypot label.
		 */
		getHoneypotRandomLabel( words ) {
			let label = '';

			for ( let i = 0; i < 3; i++ ) {
				label += words[ Math.floor( Math.random() * words.length ) ] + ' ';
			}

			return label.trim();
		},

		/**
		 * Get Honeypot field ID.
		 *
		 * @since 1.9.0
		 *
		 * @param {Array} fieldIds List of the form field IDs.
		 *
		 * @return {number} Honeypot field ID.
		 */
		getHoneypotFieldId( fieldIds ) {
			const maxId = Math.max( ...fieldIds );

			let honeypotFieldId = 0;

			// Find the first available field ID.
			for ( let i = 1; i < maxId; i++ ) {
				if ( ! fieldIds.includes( i ) ) {
					honeypotFieldId = i;
					break;
				}
			}

			// If no available field ID found, use the max ID + 1.
			if ( ! honeypotFieldId ) {
				honeypotFieldId = maxId + 1;
			}

			return honeypotFieldId;
		},

		/**
		 * Load jQuery Validation.
		 *
		 * @since 1.2.3
		 */
		loadValidation() { // eslint-disable-line max-lines-per-function
			// Only load if jQuery validation library exists.
			if ( typeof $.fn.validate !== 'undefined' ) {
				// jQuery Validation library will not correctly validate
				// fields that do not have a name attribute, so we use the
				// `wpforms-input-temp-name` class to add a temporary name
				// attribute before validation is initialized, then remove it
				// before the form submits.
				$( '.wpforms-input-temp-name' ).each( function( index, el ) {
					const random = Math.floor( Math.random() * 9999 ) + 1;
					$( this ).attr( 'name', 'wpf-temp-' + random );
				} );

				// Prepend URL field contents with https:// if user input doesn't contain a schema.
				$( document ).on( 'change', '.wpforms-validate input[type=url]', function() {
					const url = $( this ).val();
					if ( ! url ) {
						return false;
					}
					if ( url.substr( 0, 7 ) !== 'http://' && url.substr( 0, 8 ) !== 'https://' ) {
						$( this ).val( 'https://' + url );
					}
				} );

				$.validator.messages.required = wpforms_settings.val_required;
				$.validator.messages.url = wpforms_settings.val_url;
				$.validator.messages.email = wpforms_settings.val_email;
				$.validator.messages.number = wpforms_settings.val_number;

				// Payments: Validate method for Credit Card Number.
				if ( typeof $.fn.payment !== 'undefined' ) {
					$.validator.addMethod( 'creditcard', function( value, element ) {
						//var type  = $.payment.cardType(value);
						const valid = $.payment.validateCardNumber( value );
						return this.optional( element ) || valid;
					}, wpforms_settings.val_creditcard );

					// @todo validate CVC and expiration
				}

				// Validate method for file extensions.
				$.validator.addMethod( 'extension', function( value, element, param ) {
					param = 'string' === typeof param ? param.replace( /,/g, '|' ) : 'png|jpe?g|gif';
					return this.optional( element ) || value.match( new RegExp( '\\.(' + param + ')$', 'i' ) );
				}, wpforms_settings.val_fileextension );

				// Validate method for file size.
				$.validator.addMethod( 'maxsize', function( value, element, param ) {
					const maxSize = param,
						optionalValue = this.optional( element );
					let i, len, file;

					if ( optionalValue ) {
						return optionalValue;
					}

					if ( element.files && element.files.length ) {
						i = 0;
						len = element.files.length;
						for ( ; i < len; i++ ) {
							file = element.files[ i ];
							if ( file.size > maxSize ) {
								return false;
							}
						}
					}

					return true;
				}, wpforms_settings.val_filesize );

				$.validator.addMethod( 'step', function( value, element, param ) {
					const decimalPlaces = function( num ) {
						if ( Math.floor( num ) === num ) {
							return 0;
						}

						return num.toString().split( '.' )[ 1 ].length || 0;
					};
					const decimals = decimalPlaces( param );
					const decimalToInt = function( num ) {
						return Math.round( num * Math.pow( 10, decimals ) );
					};
					const min = decimalToInt( $( element ).attr( 'min' ) );

					value = decimalToInt( value ) - min;

					return this.optional( element ) || decimalToInt( value ) % decimalToInt( param ) === 0;
				} );

				// Validate email addresses.
				$.validator.methods.email = function( value, element ) {
					/**
					 * This function combines is_email() from WordPress core
					 * and wpforms_is_email() to validate email addresses.
					 *
					 * @see https://developer.wordpress.org/reference/functions/is_email/
					 * @see https://github.com/awesomemotive/wpforms-plugin/blob/develop/wpforms/includes/functions/checks.php#L45
					 *
					 * @param {string} value The email address to validate.
					 *
					 * @return {boolean} True if the email address is valid, false otherwise.
					 */
					const isEmail = function( value ) { // eslint-disable-line complexity
						if ( typeof value !== 'string' ) {
							// Do not allow callables, arrays, and objects.
							return false;
						}

						// Check the length and position of the @ character.
						const atIndex = value.indexOf( '@', 1 );
						if ( value.length < 6 || value.length > 254 || atIndex === -1 ) {
							return false;
						}

						// Check for more than one "@" symbol.
						if ( value.indexOf( '@', atIndex + 1 ) !== -1 ) {
							return false;
						}

						// Split email address into local and domain parts.
						const [ local, domain ] = value.split( '@' );

						// Check local and domain parts for existence.
						if ( ! local || ! domain ) {
							return false;
						}

						// Check local part for invalid characters and length.
						const localRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
						if ( ! localRegex.test( local ) || local.length > 63 ) {
							return false;
						}

						// Check domain part for sequences of periods, leading and trailing periods, and whitespace.
						const domainRegex = /\.{2,}/;
						if ( domainRegex.test( domain ) || domain.trim( ' \t\n\r\0\x0B.' ) !== domain ) {
							return false;
						}

						// Check domain part for length.
						const domainArr = domain.split( '.' );
						if ( domainArr.length < 2 ) {
							return false;
						}

						// Check domain label for length, leading and trailing periods, and whitespace.
						const domainLabelRegex = /^[a-z0-9-]+$/i;
						for ( const domainLabel of domainArr ) {
							if (
								domainLabel.length > 63 ||
								domainLabel.trim( ' \t\n\r\0\x0B-' ) !== domainLabel ||
								! domainLabelRegex.test( domainLabel )
							) {
								return false;
							}
						}

						return true;
					};

					// Congratulations! The email address is valid.
					return this.optional( element ) || isEmail( value );
				};

				// Validate email by allowlist/blocklist.
				$.validator.addMethod( 'restricted-email', function( value, element ) {
					const $el = $( element );

					if ( ! $el.val().length ) {
						return true;
					}

					const $form = $el.closest( '.wpforms-form' ),
						formId = $form.data( 'formid' );

					if (
						! Object.prototype.hasOwnProperty.call( app.cache, formId ) ||
						! Object.prototype.hasOwnProperty.call( app.cache[ formId ], 'restrictedEmailValidation' ) ||
						! Object.prototype.hasOwnProperty.call( app.cache[ formId ].restrictedEmailValidation, value )
					) {
						app.restrictedEmailRequest( element, value );

						return 'pending';
					}

					return app.cache[ formId ].restrictedEmailValidation[ value ];
				}, wpforms_settings.val_email_restricted );

				// Validate confirmations.
				$.validator.addMethod( 'confirm', function( value, element, param ) {
					const field = $( element ).closest( '.wpforms-field' );
					return $( field.find( 'input' )[ 0 ] ).val() === $( field.find( 'input' )[ 1 ] ).val();
				}, wpforms_settings.val_confirm );

				// Validate required payments.
				$.validator.addMethod( 'required-payment', function( value, element ) {
					return app.amountSanitize( value ) > 0;
				}, wpforms_settings.val_requiredpayment );

				// Validate 12-hour time.
				$.validator.addMethod( 'time12h', function( value, element ) {
					// noinspection RegExpRedundantEscape
					return this.optional( element ) || /^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test( value ); // eslint-disable-line no-useless-escape
				}, wpforms_settings.val_time12h );

				// Validate 24-hour time.
				$.validator.addMethod( 'time24h', function( value, element ) {
					// noinspection RegExpRedundantEscape
					return this.optional( element ) || /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(\ ?[AP]M)?$/i.test( value ); // eslint-disable-line no-useless-escape
				}, wpforms_settings.val_time24h );

				// Validate Turnstile captcha.
				$.validator.addMethod( 'turnstile', function( value ) {
					return value;
				}, wpforms_settings.val_turnstile_fail_msg );

				// Validate time limits.
				$.validator.addMethod( 'time-limit', function( value, element ) { // eslint-disable-line complexity
					const $input = $( element ),
						minTime = $input.data( 'min-time' ),
						isLimited = typeof minTime !== 'undefined';

					if ( ! isLimited ) {
						return true;
					}

					const isRequired = $input.prop( 'required' );

					if ( ! isRequired && app.empty( value ) ) {
						return true;
					}

					const maxTime = $input.data( 'max-time' );

					if ( app.compareTimesGreaterThan( maxTime, minTime ) ) {
						return app.compareTimesGreaterThan( value, minTime ) && app.compareTimesGreaterThan( maxTime, value );
					}

					return ( app.compareTimesGreaterThan( value, minTime ) && app.compareTimesGreaterThan( value, maxTime ) ) ||
						( app.compareTimesGreaterThan( minTime, value ) && app.compareTimesGreaterThan( maxTime, value ) );
				}, function( params, element ) {
					const $input = $( element );
					let minTime = $input.data( 'min-time' ),
						maxTime = $input.data( 'max-time' );

					// Replace `00:**pm` with `12:**pm`.
					minTime = minTime.replace( /^00:([0-9]{2})pm$/, '12:$1pm' );
					maxTime = maxTime.replace( /^00:([0-9]{2})pm$/, '12:$1pm' );

					// Proper format time: add space before AM/PM, make uppercase.
					minTime = minTime.replace( /(am|pm)/g, ' $1' ).toUpperCase();
					maxTime = maxTime.replace( /(am|pm)/g, ' $1' ).toUpperCase();

					return wpforms_settings.val_time_limit
						.replace( '{minTime}', minTime )
						.replace( '{maxTime}', maxTime );
				} );

				// Validate checkbox choice limit.
				$.validator.addMethod( 'check-limit', function( value, element ) {
					const $ul = $( element ).closest( 'ul' ),
						choiceLimit = parseInt( $ul.attr( 'data-choice-limit' ) || 0, 10 );

					if ( 0 === choiceLimit ) {
						return true;
					}

					const $checked = $ul.find( 'input[type="checkbox"]:checked' );

					return $checked.length <= choiceLimit;
				}, function( params, element ) {
					const	choiceLimit = parseInt( $( element ).closest( 'ul' ).attr( 'data-choice-limit' ) || 0, 10 );
					return wpforms_settings.val_checklimit.replace( '{#}', choiceLimit );
				} );

				// Validate Smartphone Field.
				if ( typeof window.intlTelInput !== 'undefined' ) {
					$.validator.addMethod( 'smart-phone-field', function( value, element ) {
						if ( value.match( /[^\d()\-+\s]/ ) ) {
							return false;
						}

						const iti = window.intlTelInputGlobals?.getInstance( element );
						const result = $( element ).triggerHandler( 'validate' );

						return this.optional( element ) || iti?.isValidNumberPrecise() || result;
					}, wpforms_settings.val_phone );
				}

				// Validate Inputmask completeness.
				$.validator.addMethod( 'inputmask-incomplete', function( value, element ) {
					if ( value.length === 0 || typeof $.fn.inputmask === 'undefined' ) {
						return true;
					}
					return $( element ).inputmask( 'isComplete' );
				}, wpforms_settings.val_inputmask_incomplete );

				// Validate Payment item value on zero.
				$.validator.addMethod( 'required-positive-number', function( value, element ) {
					return app.amountSanitize( value ) > 0;
				}, wpforms_settings.val_number_positive );

				/**
				 * Validate Payment item minimum price value.
				 *
				 * @since 1.8.6
				 */
				$.validator.addMethod( 'required-minimum-price', function( value, element, param ) {
					const $el = $( element );

					/**
					 * The validation is passed in the following cases:
					 * 1) if a field is not filled in and not required.
					 * 2) if the minimum required price is equal to or less than the typed value.
					 * Note: since the param is returned in decimal format at all times, we need to format the value to compare it.
					 */
					return ( value === '' && ! $el.hasClass( 'wpforms-field-required' ) ) || Number( app.amountSanitize( app.amountFormat( param ) ) ) <= Number( app.amountSanitize( value ) );
				}, wpforms_settings.val_minimum_price );

				// Validate US Phone Field.
				$.validator.addMethod( 'us-phone-field', function( value, element ) {
					if ( value.match( /[^\d()\-+\s]/ ) ) {
						return false;
					}
					return this.optional( element ) || value.replace( /[^\d]/g, '' ).length === 10;
				}, wpforms_settings.val_phone );

				// Validate International Phone Field.
				$.validator.addMethod( 'int-phone-field', function( value, element ) {
					if ( value.match( /[^\d()\-+\s]/ ) ) {
						return false;
					}
					return this.optional( element ) || value.replace( /[^\d]/g, '' ).length > 0;
				}, wpforms_settings.val_phone );

				// Validate password strength.
				$.validator.addMethod( 'password-strength', function( value, element ) {
					const $el = $( element );

					// Need to check if the password strength to remove the error message.
					const strength = WPFormsPasswordField.passwordStrength( value, element );

					/**
					 * The validation is passed in the following cases:
					 * 1) if a field is not filled in and not required.
					 * 2) if the password strength is equal to or greater than the specified level.
					 */
					return ( value === '' && ! $el.hasClass( 'wpforms-field-required' ) ) || strength >= Number( $el.data( 'password-strength-level' ) );
				}, wpforms_settings.val_password_strength );

				// Finally, load jQuery Validation library for our forms.
				$( '.wpforms-validate' ).each( function() { // eslint-disable-line max-lines-per-function
					const form = $( this ),
						formID = form.data( 'formid' );
					let	properties;

					// TODO: cleanup this BC with wpforms_validate.
					if ( typeof window[ 'wpforms_' + formID ] !== 'undefined' && window[ 'wpforms_' + formID ].hasOwnProperty( 'validate' ) ) {
						properties = window[ 'wpforms_' + formID ].validate;
					} else if ( typeof wpforms_validate !== 'undefined' ) {
						properties = wpforms_validate;
					} else {
						properties = {
							errorElement: app.isModernMarkupEnabled() ? 'em' : 'label',
							errorClass: 'wpforms-error',
							validClass: 'wpforms-valid',
							ignore: ':hidden:not(textarea.wp-editor-area), .wpforms-conditional-hide textarea.wp-editor-area',
							ignoreTitle: true,
							errorPlacement( error, element ) { // eslint-disable-line complexity
								if ( app.isLikertScaleField( element ) ) {
									element.closest( 'table' ).hasClass( 'single-row' )
										? element.closest( '.wpforms-field' ).append( error )
										: element.closest( 'tr' ).find( 'th' ).append( error );
								} else if ( app.isWrappedField( element ) ) {
									element.closest( '.wpforms-field' ).append( error );
								} else if ( app.isDateTimeField( element ) ) {
									app.dateTimeErrorPlacement( element, error );
								} else if ( app.isFieldInColumn( element ) ) {
									element.parent().append( error );
								} else if ( app.isFieldHasHint( element ) ) {
									element.parent().append( error );
								} else if ( app.isLeadFormsSelect( element ) ) {
									element.parent().parent().append( error );
								} else if ( element.hasClass( 'wp-editor-area' ) ) {
									element.parent().parent().parent().append( error );
								} else {
									error.insertAfter( element );
								}

								if ( app.isModernMarkupEnabled() ) {
									error.attr( {
										role: 'alert',
										'aria-label': wpforms_settings.errorMessagePrefix,
										for: '',
									} );
								}
							},
							highlight( element, errorClass, validClass ) { // eslint-disable-line complexity
								const $element = $( element ),
									$field = $element.closest( '.wpforms-field' ),
									inputName = $element.attr( 'name' );

								if ( 'radio' === $element.attr( 'type' ) || 'checkbox' === $element.attr( 'type' ) ) {
									$field.find( 'input[name="' + inputName + '"]' ).addClass( errorClass ).removeClass( validClass );
								} else {
									$element.addClass( errorClass ).removeClass( validClass );
								}

								// Remove password strength container for empty required password field.
								if (
									$element.attr( 'type' ) === 'password' &&
									$element.val().trim() === '' &&
									window.WPFormsPasswordField &&
									$element.data( 'rule-password-strength' ) &&
									$element.hasClass( 'wpforms-field-required' )
								) {
									WPFormsPasswordField.passwordStrength( '', element );
								}

								$field.addClass( 'wpforms-has-error' );
							},
							unhighlight( element, errorClass, validClass ) {
								const $element = $( element ),
									$field = $element.closest( '.wpforms-field' ),
									inputName = $element.attr( 'name' );

								if ( 'radio' === $element.attr( 'type' ) || 'checkbox' === $element.attr( 'type' ) ) {
									$field.find( 'input[name="' + inputName + '"]' ).addClass( validClass ).removeClass( errorClass );
								} else {
									$element.addClass( validClass ).removeClass( errorClass );
								}

								// Remove the error class from the field container if there are no subfield errors.
								if ( ! $field.find( ':input.wpforms-error,[data-dz-errormessage]:not(:empty)' ).length ) {
									$field.removeClass( 'wpforms-has-error' );
								}

								// Remove an error message to be sure the next time the `errorPlacement` method will be executed.
								if ( app.isModernMarkupEnabled() ) {
									$element.parent().find( 'em.wpforms-error' ).remove();
								}
							},
							submitHandler( form ) {
								/**
								 * Captcha error handler.
								 *
								 * @since 1.8.4
								 *
								 * @param {jQuery} $form      current form element.
								 * @param {jQuery} $container current form container.
								 */
								const captchaErrorDisplay = function( $form, $container ) {
									let errorTag = 'label',
										errorRole = '';

									if ( app.isModernMarkupEnabled() ) {
										errorTag = 'em';
										errorRole = 'role="alert"';
									}

									const error = `<${ errorTag } id="wpforms-field_recaptcha-error" class="wpforms-error" ${ errorRole }> ${ wpforms_settings.val_recaptcha_fail_msg }</${ errorTag }>`;

									$form.find( '.wpforms-recaptcha-container' ).append( error );
									app.restoreSubmitButton( $form, $container );
								};

								/**
								 * Submit handler routine.
								 *
								 * @since 1.7.2
								 *
								 * @return {boolean|void} False if form won't submit.
								 */
								const submitHandlerRoutine = function() { // eslint-disable-line complexity
									const $form = $( form ),
										$container = $form.closest( '.wpforms-container' ),
										$submit = $form.find( '.wpforms-submit' ),
										isCaptchaInvalid = $submit.data( 'captchaInvalid' ),
										altText = $submit.data( 'alt-text' ),
										recaptchaID = $submit.get( 0 ).recaptchaID;

									if ( $form.data( 'token' ) && 0 === $( '.wpforms-token', $form ).length ) {
										$( '<input type="hidden" class="wpforms-token" name="wpforms[token]" />' )
											.val( $form.data( 'token' ) )
											.appendTo( $form );
									}

									$form.find( '#wpforms-field_recaptcha-error' ).remove();
									$submit.prop( 'disabled', true );

									WPFormsUtils.triggerEvent( $form, 'wpformsFormSubmitButtonDisable', [ $form, $submit ] );

									// Display processing text.
									if ( altText ) {
										$submit.text( altText );
									}

									if ( isCaptchaInvalid ) {
										return captchaErrorDisplay( $form, $container );
									}

									if ( ! app.empty( recaptchaID ) || recaptchaID === 0 ) {
										// The Form contains invisible reCAPTCHA.
										grecaptcha.execute( recaptchaID ).then( null, function() {
											if ( grecaptcha.getResponse() ) {
												return;
											}

											captchaErrorDisplay( $form, $container );
										} );
										return false;
									}

									// Remove name attributes if needed.
									$( '.wpforms-input-temp-name' ).removeAttr( 'name' );

									app.formSubmit( $form );
								};

								// In the case of active Google reCAPTCHA v3, first, we should call `grecaptcha.execute`.
								// This is needed to get a proper grecaptcha token before submitting the form.
								if ( typeof wpformsRecaptchaV3Execute === 'function' ) {
									return wpformsRecaptchaV3Execute( submitHandlerRoutine );
								}

								return submitHandlerRoutine();
							},
							invalidHandler( event, validator ) {
								if ( typeof validator.errorList[ 0 ] !== 'undefined' ) {
									app.scrollToError( $( validator.errorList[ 0 ].element ) );
								}
							},
							onkeyup: WPFormsUtils.debounce( // eslint-disable-next-line complexity
								function( element, event ) {
									// This code is copied from JQuery Validate 'onkeyup' method with only one change: 'wpforms-novalidate-onkeyup' class check.
									const excludedKeys = [ 16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225 ];

									if ( $( element ).hasClass( 'wpforms-novalidate-onkeyup' ) ) {
										return; // Disable onkeyup validation for some elements (e.g. remote calls).
									}

									// eslint-disable-next-line no-mixed-operators
									if ( event.which === 9 && this.elementValue( element ) === '' || $.inArray( event.keyCode, excludedKeys ) !== -1 ) {
									} else if ( element.name in this.submitted || element.name in this.invalid ) {
										this.element( element );
									}
								},
								1000
							),
							onfocusout: function( element ) { // eslint-disable-line complexity, object-shorthand
								// This code is copied from JQuery Validate 'onfocusout' method with only one change: 'wpforms-novalidate-onkeyup' class check.
								let validate = false;

								if ( $( element ).hasClass( 'wpforms-novalidate-onkeyup' ) && ! element.value ) {
									validate = true; // Empty value error handling for elements with onkeyup validation disabled.
								}

								if ( ! this.checkable( element ) && ( element.name in this.submitted || ! this.optional( element ) ) ) {
									validate = true;
								}

								// If the error comes from server validation, we don't need to validate it again,
								// because it will clean the error message too early.
								if ( $( element ).data( 'server-error' ) ) {
									validate = false;
								}

								if ( validate ) {
									this.element( element );
								}
							},
							onclick( element ) {
								let validate = false;
								const type = ( element || {} ).type;
								let $el = $( element );

								if ( [ 'checkbox', 'radio' ].indexOf( type ) > -1 ) {
									if ( $el.hasClass( 'wpforms-likert-scale-option' ) ) {
										$el = $el.closest( 'tr' );
									} else {
										$el = $el.closest( '.wpforms-field' );
									}
									$el.find( 'label.wpforms-error, em.wpforms-error' ).remove();
									validate = true;
								}

								if ( validate ) {
									this.element( element );
								}
							},
						};
					}
					form.validate( properties );
					app.loadValidationGroups( form );
				} );
			}
		},

		/**
		 * Request to check if email is restricted.
		 *
		 * @since 1.8.5
		 *
		 * @param {Element} element Email input field.
		 * @param {string}  value   Field value.
		 */
		restrictedEmailRequest( element, value ) {
			const $el = $( element );
			const $form = $el.closest( 'form' );
			const validator = $form.data( 'validator' );
			const formId = $form.data( 'formid' );
			const $field = $el.closest( '.wpforms-field' );
			const fieldId = $field.data( 'field-id' );

			app.cache[ formId ] = app.cache[ formId ] || {};

			validator.startRequest( element );

			$.post( {
				url: wpforms_settings.ajaxurl,
				type: 'post',
				data: {
					action: 'wpforms_restricted_email',
					form_id: formId, // eslint-disable-line camelcase
					field_id: fieldId, // eslint-disable-line camelcase
					email: value,
				},
				dataType: 'json',
				success( response ) {
					const errors = {};

					const isValid = response.success && response.data;

					if ( ! isValid ) {
						errors[ element.name ] = wpforms_settings.val_email_restricted;
						validator.showErrors( errors );
					}

					app.cache[ formId ].restrictedEmailValidation = app.cache[ formId ].restrictedEmailValidation || [];

					if ( ! Object.prototype.hasOwnProperty.call( app.cache[ formId ].restrictedEmailValidation, value ) ) {
						app.cache[ formId ].restrictedEmailValidation[ value ] = isValid;
					}

					validator.stopRequest( element, isValid );
				},
			} );
		},

		/**
		 * Is field inside column.
		 *
		 * @since 1.6.3
		 *
		 * @param {jQuery} element current form element.
		 *
		 * @return {boolean} true/false.
		 */
		isFieldInColumn( element ) {
			return element.parent().hasClass( 'wpforms-one-half' ) ||
				element.parent().hasClass( 'wpforms-two-fifths' ) ||
				element.parent().hasClass( 'wpforms-one-fifth' );
		},

		/**
		 * Is field has hint (sublabel, description, limit text hint, etc.).
		 *
		 * @since 1.8.1
		 *
		 * @param {jQuery} element current form element.
		 *
		 * @return {boolean} true/false.
		 */
		isFieldHasHint( element ) {
			return element
				.nextAll( '.wpforms-field-sublabel, .wpforms-field-description, .wpforms-field-limit-text, .wpforms-pass-strength-result' )
				.length > 0;
		},

		/**
		 * Is datetime field.
		 *
		 * @since 1.6.3
		 *
		 * @param {jQuery} element current form element.
		 *
		 * @return {boolean} true/false.
		 */
		isDateTimeField( element ) {
			return element.hasClass( 'wpforms-timepicker' ) ||
				element.hasClass( 'wpforms-datepicker' ) ||
				( element.is( 'select' ) && element.attr( 'class' ).match( /date-month|date-day|date-year/ ) );
		},

		/**
		 * Is a field wrapped in some container.
		 *
		 * @since 1.6.3
		 *
		 * @param {jQuery} element current form element.
		 *
		 * @return {boolean} true/false.
		 */
		isWrappedField( element ) { // eslint-disable-line complexity
			return 'checkbox' === element.attr( 'type' ) ||
			'radio' === element.attr( 'type' ) ||
			'range' === element.attr( 'type' ) ||
			'select' === element.is( 'select' ) ||
			1 === element.data( 'is-wrapped-field' ) ||
			element.parent().hasClass( 'iti' ) ||
			element.hasClass( 'wpforms-validation-group-member' ) ||
			element.hasClass( 'choicesjs-select' ) ||
			element.hasClass( 'wpforms-net-promoter-score-option' ) ||
			element.hasClass( 'wpforms-field-payment-coupon-input' );
		},

		/**
		 * Is likert scale field.
		 *
		 * @since 1.6.3
		 *
		 * @param {jQuery} element current form element.
		 *
		 * @return {boolean} true/false.
		 */
		isLikertScaleField( element ) {
			return element.hasClass( 'wpforms-likert-scale-option' );
		},

		/**
		 * Is Lead Forms select field.
		 *
		 * @since 1.8.1
		 *
		 * @param {jQuery} element current form element.
		 *
		 * @return {boolean} true/false.
		 */
		isLeadFormsSelect( element ) {
			return element.parent().hasClass( 'wpforms-lead-forms-select' );
		},

		/**
		 * Is Coupon field.
		 *
		 * @since 1.8.2
		 * @deprecated 1.8.4 Deprecated.
		 *
		 * @param {jQuery} element current form element.
		 *
		 * @return {boolean} true/false.
		 */
		isCoupon( element ) {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Function "wpforms.isCoupon( element )" has been deprecated' );

			return element.closest( '.wpforms-field' ).hasClass( 'wpforms-field-payment-coupon' );
		},

		/**
		 * Print error message into date time fields.
		 *
		 * @since 1.6.3
		 *
		 * @param {jQuery} element current form element.
		 * @param {string} error   Error message.
		 */
		dateTimeErrorPlacement( element, error ) {
			const $wrapper = element.closest( '.wpforms-field-row-block, .wpforms-field-date-time' );
			if ( $wrapper.length ) {
				if ( ! $wrapper.find( 'label.wpforms-error, em.wpforms-error' ).length ) {
					$wrapper.append( error );
				}
			} else {
				element.closest( '.wpforms-field' ).append( error );
			}
		},

		/**
		 * Load jQuery Date Picker.
		 *
		 * @since 1.2.3
		 * @since 1.8.9 Added the `$context` parameter.
		 *
		 * @param {jQuery} $context Container to search for datepicker elements.
		 */
		loadDatePicker( $context ) { // eslint-disable-line max-lines-per-function
			// Only load if jQuery datepicker library exists.
			if ( typeof $.fn.flatpickr === 'undefined' ) {
				return;
			}

			$context = $context?.length ? $context : $( document );

			$context.find( '.wpforms-datepicker-wrap' ).each( function() { // eslint-disable-line complexity, max-lines-per-function
				const element = $( this ),
					$input = element.find( 'input' ),
					form = element.closest( '.wpforms-form' ),
					formID = form.data( 'formid' ),
					fieldID = element.closest( '.wpforms-field' ).data( 'field-id' );

				let properties;

				if ( typeof window[ 'wpforms_' + formID + '_' + fieldID ] !== 'undefined' && window[ 'wpforms_' + formID + '_' + fieldID ].hasOwnProperty( 'datepicker' ) ) {
					properties = window[ 'wpforms_' + formID + '_' + fieldID ].datepicker;
				} else if ( typeof window[ 'wpforms_' + formID ] !== 'undefined' && window[ 'wpforms_' + formID ].hasOwnProperty( 'datepicker' ) ) {
					properties = window[ 'wpforms_' + formID ].datepicker;
				} else if ( typeof wpforms_datepicker !== 'undefined' ) {
					properties = wpforms_datepicker;
				} else {
					properties = {
						disableMobile: true,
					};
				}

				// Redefine locale only if user doesn't do that manually, and we have the locale.
				if (
					! properties.hasOwnProperty( 'locale' ) &&
					typeof wpforms_settings !== 'undefined' &&
					wpforms_settings.hasOwnProperty( 'locale' )
				) {
					properties.locale = wpforms_settings.locale;
				}

				properties.wrap = true;
				properties.dateFormat = $input.data( 'date-format' );

				if ( $input.data( 'disable-past-dates' ) === 1 ) {
					properties.minDate = 'today';

					if ( $input.data( 'disable-todays-date' ) === 1 ) {
						const date = new Date();
						properties.minDate = date.setDate( date.getDate() + 1 );
					}
				}

				let limitDays = $input.data( 'limit-days' );
				const weekDays = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ];

				if ( limitDays && limitDays !== '' ) {
					limitDays = limitDays.split( ',' );

					properties.disable = [ function( date ) {
						let limitDay = null;

						for ( const i in limitDays ) {
							limitDay = weekDays.indexOf( limitDays[ i ] );

							if ( limitDay === date.getDay() ) {
								return false;
							}
						}

						return true;
					} ];
				}

				// Toggle clear date icon.
				properties.onChange = function( selectedDates, dateStr, instance ) { // eslint-disable-line no-unused-vars
					element.find( '.wpforms-datepicker-clear' )
						.css( 'display', dateStr === '' ? 'none' : 'block' );
				};

				element.flatpickr( properties );
			} );
		},

		/**
		 * Load jQuery Time Picker.
		 *
		 * @since 1.2.3
		 * @since 1.8.9 Added the `$context` parameter.
		 *
		 * @param {jQuery} $context Container to search for datepicker elements.
		 */
		loadTimePicker( $context ) {
			// Only load if jQuery timepicker library exists.
			if ( typeof $.fn.timepicker === 'undefined' ) {
				return;
			}

			$context = $context?.length ? $context : $( document );

			$context.find( '.wpforms-timepicker' ).each( function() { // eslint-disable-line complexity
				const element = $( this ),
					form = element.closest( '.wpforms-form' ),
					formID = form.data( 'formid' ),
					fieldID = element.closest( '.wpforms-field' ).data( 'field-id' );

				let properties;

				if (
					typeof window[ 'wpforms_' + formID + '_' + fieldID ] !== 'undefined' &&
					window[ 'wpforms_' + formID + '_' + fieldID ].hasOwnProperty( 'timepicker' )
				) {
					properties = window[ 'wpforms_' + formID + '_' + fieldID ].timepicker;
				} else if (
					typeof window[ 'wpforms_' + formID ] !== 'undefined' &&
					window[ 'wpforms_' + formID ].hasOwnProperty( 'timepicker' )
				) {
					properties = window[ 'wpforms_' + formID ].timepicker;
				} else if ( typeof wpforms_timepicker !== 'undefined' ) {
					properties = wpforms_timepicker;
				} else {
					properties = {
						scrollDefault: 'now',
						forceRoundTime: true,
					};
				}

				// Retrieve the value from the input element.
				const inputValue = element.val();

				element.timepicker( properties );

				// Check if a value is available.
				if ( inputValue ) {
					// Set the input element's value to the retrieved value.
					element.val( inputValue );

					// Trigger the 'changeTime' event to update the timepicker after programmatically setting the value.
					element.trigger( 'changeTime' );
				}
			} );
		},

		/**
		 * Load jQuery input masks.
		 *
		 * @since 1.2.3
		 * @since 1.8.9 Added the `$context` parameter.
		 *
		 * @param {jQuery} $context Container to search for datepicker elements.
		 */
		loadInputMask( $context ) {
			// Only load if jQuery input mask library exists.
			if ( typeof $.fn.inputmask === 'undefined' ) {
				return;
			}

			$context = $context?.length ? $context : $( document );

			// This setting has no effect when switching to the "RTL" mode.
			$context.find( '.wpforms-masked-input' ).inputmask( { rightAlign: false } );
		},

		/**
		 * Fix the Phone field snippets.
		 *
		 * @since 1.8.7.1
		 * @deprecated 1.9.2
		 *
		 * @param {jQuery} $field Phone field element.
		 */
		fixPhoneFieldSnippets( $field ) {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Obsolete function called. Function wpforms.fixPhoneFieldSnippets( $field ) has been deprecated, please use the wpforms.repairSmartPhoneHiddenField( $field ) function instead!' );

			$field.siblings( 'input[type="hidden"]' ).each( function() {
				if ( ! $( this ).attr( 'name' ).includes( 'function' ) ) {
					return;
				}

				const data = $field.data( 'plugin_intlTelInput' );
				const options = data.d || data.options;

				if ( ! options ) {
					return;
				}

				const insta = window.intlTelInputGlobals.getInstance( $field[ 0 ] );
				insta.destroy();

				options.initialCountry = options.initialCountry.toLowerCase();
				options.onlyCountries = options.onlyCountries.map( ( v ) => v.toLowerCase() );
				options.preferredCountries = options.preferredCountries.map( ( v ) => v.toLowerCase() );
				window.intlTelInput( $field[ 0 ], options );
				$field.siblings( 'input[type="hidden"]' ).each( function() {
					const $hiddenInput = $( this );
					$hiddenInput.attr( 'name', $hiddenInput.attr( 'name' ).replace( 'wpf-temp-', '' ) );
				} );
			} );
		},

		/**
		 * Compatibility fix with an old intl-tel-input library that may include in other addons.
		 * Also, for custom snippets that use `options.hiddenInput` to recieve fieldId.
		 *
		 * @since 1.9.2
		 *
		 * @param {jQuery} $field Phone field element.
		 */
		repairSmartPhoneHiddenField( $field ) {
			const fieldId = $field.closest( '.wpforms-field-phone' ).data( 'field-id' );

			if ( $( '[name="wpforms[fields][' + fieldId + ']"]' ).length ) {
				return;
			}

			const iti = $field.data( 'plugin_intlTelInput' );
			let fieldValue = $field.val();
			let inputOptions = {};

			if ( iti ) {
				inputOptions = iti.d || iti.options || {};
				fieldValue = iti.getNumber();

				iti.destroy();
			}

			$field.removeData( 'plugin_intlTelInput' );

			// The field has beautified view. We should use hidden input value before destroying.
			$field.val( fieldValue );

			app.initSmartPhoneField( $field, inputOptions );
		},

		/**
		 * Get a list of default smart phone field options.
		 *
		 * @since 1.9.2
		 *
		 * @return {Object} List of default options.
		 */
		getDefaultSmartPhoneFieldOptions() { // eslint-disable-line complexity
			const inputOptions = {
				countrySearch: false,
				fixDropdownWidth: false,
				preferredCountries: [ 'us', 'gb' ],
				countryListAriaLabel: wpforms_settings.country_list_label,
			};

			// Determine the country by IP if no GDPR restrictions enabled.
			if ( ! wpforms_settings.gdpr ) {
				inputOptions.geoIpLookup = app.currentIpToCountry;
			}

			let countryCode;
			// Try to kick in an alternative solution if GDPR restrictions are enabled.
			if ( wpforms_settings.gdpr ) {
				const lang = app.mapLanguageToIso( this.getFirstBrowserLanguage() );

				countryCode = lang.indexOf( '-' ) > -1 ? lang.split( '-' ).pop() : lang;
			}

			// Make sure the library recognizes browser country code to avoid console error.
			if ( countryCode ) {
				let countryData = window.intlTelInputGlobals.getCountryData();

				countryData = countryData.filter( function( country ) {
					return country.iso2 === countryCode.toLowerCase();
				} );
				countryCode = countryData.length ? countryCode : '';
			}

			// Set default country.
			inputOptions.initialCountry = wpforms_settings.gdpr && countryCode ? countryCode.toLowerCase() : 'auto';

			return inputOptions;
		},

		/**
		 * Load Smartphone field.
		 *
		 * @since 1.5.2
		 * @since 1.8.9 Added the `$context` parameter.
		 *
		 * @param {jQuery} $context Context to search for smartphone elements.
		 */
		loadSmartPhoneField( $context ) {
			if ( typeof window.intlTelInput === 'undefined' ) {
				// Only load if a library exists.
				return;
			}

			app.loadJqueryIntlTelInput();

			$context = $context?.length ? $context : $( document );

			$context.find( '.wpforms-smart-phone-field' ).each( function( i, el ) {
				const $el = $( el );

				// Prevent initialization if the popup is hidden.
				if ( $el.parents( '.elementor-location-popup' ).is( ':hidden' ) ) {
					return false;
				}

				app.initSmartPhoneField( $el, {} );
			} );
		},

		/**
		 * Backward compatibility jQuery plugin for IntlTelInput library, to support custom snippets.
		 * e.g., https://wpforms.com/developers/how-to-set-a-default-flag-on-smart-phone-field-with-gdpr/.
		 *
		 * @since 1.9.2
		 */
		loadJqueryIntlTelInput() {
			if ( typeof $.fn.intlTelInput !== 'undefined' ) {
				return;
			}

			$.fn.extend( {
				intlTelInput( options ) {
					const $el = $( this );

					if ( options === undefined || typeof options === 'object' ) {
						return $el.each( function() {
							const $item = $( this );

							if ( ! $item.data( 'plugin_intlTelInput' ) ) {
								const iti = window.intlTelInput( $item.get( 0 ), options );

								$item.data( 'plugin_intlTelInput', iti );
							}
						} );
					}

					if ( typeof options !== 'string' && options[ 0 ] === '_' ) {
						return;
					}

					const methodName = options;
					let returns = this;

					$el.each( function() {
						const $el = $( this );
						const iti = $el.data( 'plugin_intlTelInput' );

						if ( typeof iti[ methodName ] !== 'function' ) {
							return;
						}

						// IntlTelInput library returned only the last applied method instance in v21.0-
						returns = iti[ methodName ]();

						if ( options === 'destroy' ) {
							$el.removeData( 'plugin_intlTelInput' );
						}
					} );

					return returns;
				},
			} );
		},

		/**
		 * Init smart phone field.
		 *
		 * @since 1.9.2
		 *
		 * @param {jQuery} $el          Input field.
		 * @param {Object} inputOptions Options for intlTelInput.
		 */
		initSmartPhoneField( $el, inputOptions ) {
			if ( typeof $el.data( 'plugin_intlTelInput' ) === 'object' ) {
				// Skip if it was already initialized.
				return;
			}

			inputOptions = Object.keys( inputOptions ).length > 0 ? inputOptions : app.getDefaultSmartPhoneFieldOptions();

			const fieldId = $el.closest( '.wpforms-field-phone' ).data( 'field-id' );
			// Hidden input allows to include country code into submitted data.
			inputOptions.hiddenInput = function() {
				return {
					phone: 'wpforms[fields][' + fieldId + ']',
				};
			};
			inputOptions.utilsScript = wpforms_settings.wpforms_plugin_url + 'assets/pro/lib/intl-tel-input/module.intl-tel-input-utils.min.js';

			const iti = window.intlTelInput( $el.get( 0 ), inputOptions );

			$el.on( 'validate', function() {
				// Validate the field.
				return iti.isValidNumber( iti.getNumber() );
			} );

			$el.data( 'plugin_intlTelInput', iti );

			// For proper validation, we should preserve the name attribute of the input field.
			// But we need to modify the original input name not to interfere with a hidden input.
			$el.attr( 'name', 'wpf-temp-wpforms[fields][' + fieldId + ']' );

			// Add special class to remove name attribute before submitting.
			// So, only the hidden input value will be submitted.
			$el.addClass( 'wpforms-input-temp-name' );

			// Instantly update a hidden form input.
			// Validation is done separately, so we shouldn't worry about it.
			// Previously "blur" only was used, which is broken in case Enter was used to submit the form.
			$el.on( 'blur input', function() {
				const iti = $el.data( 'plugin_intlTelInput' );

				$el.siblings( 'input[type="hidden"]' ).val( iti.getNumber() );
			} );
		},

		/**
		 * Bind Smartphone field event.
		 *
		 * @since 1.8.9
		 */
		bindSmartPhoneField() {
			$( '.wpforms-form' ).on( 'wpformsBeforeFormSubmit', function() {
				const $smartPhoneFields = $( this ).find( '.wpforms-smart-phone-field' );

				$smartPhoneFields.each( function() {
					app.repairSmartPhoneHiddenField( $( this ) );
				} );

				// Update hidden input of the `Smart` phone field to be sure the latest value will be submitted.
				$smartPhoneFields.trigger( 'input' );
			} );
		},

		/**
		 * Payments: Do various payment-related tasks on a load.
		 *
		 * @since 1.2.6
		 */
		loadPayments() {
			// Update Total field(s) with the latest calculation.
			$( '.wpforms-payment-total' ).each( function( index, el ) {
				app.amountTotal( this );
			} );

			// Credit card validation.
			if ( typeof $.fn.payment !== 'undefined' ) {
				$( '.wpforms-field-credit-card-cardnumber' ).payment( 'formatCardNumber' );
				$( '.wpforms-field-credit-card-cardcvc' ).payment( 'formatCardCVC' );
			}
		},

		/**
		 * Load mailcheck.
		 *
		 * @since 1.5.3
		 */
		loadMailcheck() { // eslint-disable-line max-lines-per-function
			// Skip loading if `wpforms_mailcheck_enabled` filter return false.
			if ( ! wpforms_settings.mailcheck_enabled ) {
				return;
			}

			// Only load if a library exists.
			if ( typeof $.fn.mailcheck === 'undefined' ) {
				return;
			}

			if ( wpforms_settings.mailcheck_domains.length > 0 ) {
				Mailcheck.defaultDomains = Mailcheck.defaultDomains.concat( wpforms_settings.mailcheck_domains );
			}
			if ( wpforms_settings.mailcheck_toplevel_domains.length > 0 ) {
				Mailcheck.defaultTopLevelDomains = Mailcheck.defaultTopLevelDomains.concat( wpforms_settings.mailcheck_toplevel_domains );
			}

			// Mailcheck suggestion.
			$( document ).on( 'blur', '.wpforms-field-email input', function() {
				const $input = $( this ),
					id = $input.attr( 'id' );

				$input.mailcheck( {
					suggested( $el, suggestion ) {
						// decodeURI() will throw an error if the percent sign is not followed by two hexadecimal digits.
						suggestion.full = suggestion.full.replace( /%(?![0-9][0-9a-fA-F]+)/g, '%25' );
						suggestion.address = suggestion.address.replace( /%(?![0-9][0-9a-fA-F]+)/g, '%25' );
						suggestion.domain = suggestion.domain.replace( /%(?![0-9][0-9a-fA-F]+)/g, '%25' );

						if ( suggestion.address.match( /^xn--/ ) ) {
							suggestion.full = punycode.toUnicode( decodeURI( suggestion.full ) );

							const parts = suggestion.full.split( '@' );

							suggestion.address = parts[ 0 ];
							suggestion.domain = parts[ 1 ];
						}

						if ( suggestion.domain.match( /^xn--/ ) ) {
							suggestion.domain = punycode.toUnicode( decodeURI( suggestion.domain ) );
						}

						const address = decodeURI( suggestion.address ).replaceAll( /[<>'"()/\\|:;=@%&\s]/ig, '' ).substr( 0, 64 ),
							domain = decodeURI( suggestion.domain ).replaceAll( /[<>'"()/\\|:;=@%&+_\s]/ig, '' );

						suggestion = '<a href="#" class="mailcheck-suggestion" data-id="' + id + '" title="' + wpforms_settings.val_email_suggestion_title + '">' + address + '@' + domain + '</a>';
						suggestion = wpforms_settings.val_email_suggestion.replace( '{suggestion}', suggestion );

						$el.closest( '.wpforms-field' ).find( '#' + id + '_suggestion' ).remove();
						$el.parent().append( '<label class="wpforms-error mailcheck-error" id="' + id + '_suggestion">' + suggestion + '</label>' );
					},
					empty() {
						$( '#' + id + '_suggestion' ).remove();
					},
				} );
			} );

			// Apply a Mailcheck suggestion.
			$( document ).on( 'click', '.wpforms-field-email .mailcheck-suggestion', function( e ) {
				const $suggestion = $( this ),
					$field = $suggestion.closest( '.wpforms-field' ),
					id = $suggestion.data( 'id' );

				e.preventDefault();
				$field.find( '#' + id ).val( $suggestion.text() );
				$suggestion.parent().remove();
			} );
		},

		/**
		 * Load Choices.js library for all Modern style Dropdown fields (<select>).
		 *
		 * @since 1.6.1
		 * @since 1.8.9 Added the `$context` parameter.
		 *
		 * @param {jQuery} $context Container to search for ChoicesJS elements.
		 */
		loadChoicesJS( $context ) { // eslint-disable-line max-lines-per-function
			// Loads if function exists.
			if ( typeof window.Choices !== 'function' ) {
				return;
			}

			$context = $context?.length ? $context : $( document );

			// eslint-disable-next-line max-lines-per-function, complexity
			$context.find( '.wpforms-field-select-style-modern .choicesjs-select, .wpforms-field-payment-select .choicesjs-select' ).each( function( idx, el ) {
				if ( $( el ).data( 'choicesjs' ) ) {
					return;
				}

				/**
				 * Trigger before form element choices initialization.
				 *
				 * @since 1.9.0
				 *
				 * @param {jQuery} el Form element.
				 */
				const event = WPFormsUtils.triggerEvent( $context, 'wpformsBeforeLoadElementChoices', [ el ] );

				// Allow callbacks on `wpformsBeforeLoadElementChoices` to cancel choices initialization by triggering `event.preventDefault()`.
				if ( event.isDefaultPrevented() ) {
					return;
				}

				const args = window.wpforms_choicesjs_config || {},
					searchEnabled = $( el ).data( 'search-enabled' ),
					removeItems = $( el ).data( 'remove-items-enabled' );

				args.searchEnabled = 'undefined' !== typeof searchEnabled ? searchEnabled : true;
				args.removeItems = 'undefined' !== typeof removeItems ? removeItems : true;
				args.removeItemButton = args.removeItems;
				args.searchEnabled = 'undefined' !== typeof searchEnabled ? searchEnabled : true;

				// We can safely allow HTML in the choices since they are sanitized before rendering.
				// Allowing HTML in the choices is necessary for support allowed HTML entities, such as `&`.
				args.allowHTML = true;

				args.callbackOnInit = function() {
					const self = this,
						$element = $( self.passedElement.element ),
						$input = $( self.input.element ),
						sizeClass = $element.data( 'size-class' );

					// Remove hidden attribute and hide `<select>` like a screen-reader text.
					// It's important for field validation.
					$element
						.removeAttr( 'hidden' )
						.addClass( self.config.classNames.input + '--hidden' );

					// Add CSS-class for size.
					if ( sizeClass ) {
						$( self.containerOuter.element ).addClass( sizeClass );
					}

					/**
					 * If a multiple select has selected choices - hide a placeholder text.
					 * In case if select is empty - we return placeholder text.
					 */
					if ( $element.prop( 'multiple' ) ) {
						// On init event.
						$input.data( 'placeholder', $input.attr( 'placeholder' ) ).css( 'width', 'auto' );

						if ( self.getValue( true ).length ) {
							$input.removeAttr( 'placeholder' );
						}

						$input.css( 'width', '1ch' );
					}

					// On change event.
					$element.on( 'change', function() {
						// Listen if multiple select has choices.
						if ( $element.prop( 'multiple' ) ) {
							// eslint-disable-next-line no-unused-expressions
							self.getValue( true ).length
								? $input.removeAttr( 'placeholder' )
								: $input.attr( 'placeholder', $input.data( 'placeholder' ) ).css( 'width', 'auto' );
						}

						const validator = $element.closest( 'form' ).data( 'validator' );

						if ( ! validator ) {
							return;
						}

						validator.element( $element );
					} );
				};

				args.callbackOnCreateTemplates = function() {
					const self = this,
						$element = $( self.passedElement.element );

					return {
						// Change default template for option.
						option( item ) {
							const opt = Choices.defaults.templates.option.call( this, item );

							// Add a `.placeholder` class for placeholder option - it needs for WPForm CL.
							if ( 'undefined' !== typeof item.placeholder && true === item.placeholder ) {
								opt.classList.add( 'placeholder' );
							}

							// Add a `data-amount` attribute for payment dropdown.
							// It will be a copy from a Choices.js `data-custom-properties` attribute.
							if ( $element.hasClass( 'wpforms-payment-price' ) && 'undefined' !== typeof item.customProperties && null !== item.customProperties ) {
								opt.dataset.amount = item.customProperties;
							}

							return opt;
						},
					};
				};

				// Save choicesjs instance for future access.
				$( el ).data( 'choicesjs', new Choices( el, args ) );
			} );
		},

		/**
		 * Bind ChoicesJS' events.
		 *
		 * @since 1.8.9
		 */
		bindChoicesJS() {
			// Add the ability to close the drop-down menu on the frontend.
			$( document ).on( 'click', '.choices', function( e ) {
				const $choices = $( this ),
					choicesObj = $choices.find( 'select' ).data( 'choicesjs' );

				if (
					choicesObj &&
					$choices.hasClass( 'is-open' ) &&
					(
						e.target.classList.contains( 'choices__inner' ) ||
						e.target.classList.contains( 'choices__arrow' )
					)
				) {
					choicesObj.hideDropdown();
				}
			} );
		},

		//--------------------------------------------------------------------//
		// Binds.
		//--------------------------------------------------------------------//

		/**
		 * Element bindings.
		 *
		 * @since 1.2.3
		 */
		bindUIActions() { // eslint-disable-line max-lines-per-function
			const $document = $( document );

			// Pagebreak navigation.
			$document.on( 'click', '.wpforms-page-button', function( event ) {
				event.preventDefault();
				app.pagebreakNav( this );
			} );

			// Payments: Update Total field(s) when latest calculation.
			$document.on( 'change input', '.wpforms-payment-price', function() {
				app.amountTotal( this, true );
			} );

			// Payments: Update Total field(s) when changing quantity.
			$document.on( 'change input', 'select.wpforms-payment-quantity', function() {
				app.amountTotal( this, true );
				app.updateOrderSummaryItemQuantity( $( this ) );
			} );

			// Payments: Restrict user input payment fields.
			$document.on( 'input', '.wpforms-payment-user-input', function() {
				const $this = $( this ),
					amount = $this.val();
				$this.val( amount.replace( /[^0-9.,]/g, '' ) );
			} );

			// Payments: Sanitize/format user input amounts.
			$document.on( 'focusout', '.wpforms-payment-user-input', function() {
				const $this = $( this ),
					amount = $this.val();

				if ( ! amount ) {
					return amount;
				}

				const sanitized = app.amountSanitize( amount ),
					formatted = app.amountFormat( sanitized );

				$this.val( formatted );
			} );

			// Payments: Update Total field(s) when conditionals are processed.
			$document.on( 'wpformsProcessConditionals', function( e, el ) {
				app.amountTotal( el, true );
			} );

			// Rating field: hover effect.
			$document.on( 'mouseenter', '.wpforms-field-rating-item', function() {
				$( this ).parent().find( '.wpforms-field-rating-item' ).removeClass( 'selected hover' );
				$( this ).prevAll().addBack().addClass( 'hover' );
			} ).on( 'mouseleave', '.wpforms-field-rating-item', function() {
				$( this ).parent().find( '.wpforms-field-rating-item' ).removeClass( 'selected hover' );
				$( this ).parent().find( 'input:checked' ).parent().prevAll().addBack().addClass( 'selected' );
			} );

			// Rating field: toggle selected state.
			$( document ).on( 'change', '.wpforms-field-rating-item input', function() {
				const $this = $( this ),
					$wrap = $this.closest( '.wpforms-field-rating-items' ),
					$items = $wrap.find( '.wpforms-field-rating-item' );
				$this.focus(); // Enable keyboard navigation.
				$items.removeClass( 'hover selected' );
				$this.parent().prevAll().addBack().addClass( 'selected' );
			} );

			// Rating field: preselect the selected rating (from dynamic/fallback population).
			$( function() {
				$( '.wpforms-field-rating-item input:checked' ).trigger( 'change' );
			} );

			// Checkbox/Radio/Payment checkbox: make labels keyboard-accessible.
			$document.on( 'keydown', '.wpforms-image-choices-item label', function( event ) {
				const $label = $( this ),
					$field = $label.closest( '.wpforms-field' );

				if ( $field.hasClass( 'wpforms-conditional-hide' ) ) {
					event.preventDefault();
					return false;
				}

				// Cause the input to be clicked when pressing Space bar on the label.
				if ( event.keyCode !== 32 ) {
					return;
				}

				$label.find( 'input' ).trigger( 'click' );
				event.preventDefault();
			} );

			// IE: Click on the `image choice` image should trigger the click event on the input (checkbox or radio) field.
			if ( window.document.documentMode ) {
				$document.on( 'click', '.wpforms-image-choices-item img', function() {
					$( this ).closest( 'label' ).find( 'input' ).trigger( 'click' );
				} );
			}

			$document.on( 'change', '.wpforms-field-checkbox input, .wpforms-field-radio input, .wpforms-field-payment-multiple input, .wpforms-field-payment-checkbox input, .wpforms-field-gdpr-checkbox input', function( event ) {
				const $this = $( this ),
					$field = $this.closest( '.wpforms-field' );

				if ( $field.hasClass( 'wpforms-conditional-hide' ) ) {
					event.preventDefault();
					return false;
				}

				switch ( $this.attr( 'type' ) ) {
					case 'radio':
						$this.closest( 'ul' ).find( 'li' ).removeClass( 'wpforms-selected' ).find( 'input[type=radio]' ).removeProp( 'checked' );
						$this
							.prop( 'checked', true )
							.closest( 'li' ).addClass( 'wpforms-selected' );
						break;

					case 'checkbox':
						if ( $this.is( ':checked' ) ) {
							$this.closest( 'li' ).addClass( 'wpforms-selected' );
							$this.prop( 'checked', true );
						} else {
							$this.closest( 'li' ).removeClass( 'wpforms-selected' );
							$this.prop( 'checked', false );
						}
						break;
				}
			} );

			// Upload fields: Check combined file size.
			$document.on( 'input', '.wpforms-field-file-upload', function() {
				const $this = $( this ),
					$uploads = $this.closest( 'form.wpforms-form' ).find( '.wpforms-field-file-upload input:not(".dropzone-input")' );
				let totalSize = 0,
					postMaxSize = Number( wpforms_settings.post_max_size ),
					errorMsg = '<div class="wpforms-error-container-post_max_size">' + wpforms_settings.val_post_max_size + '</div>';
				const errorCntTpl = '<div class="wpforms-error-container">{errorMsg}</div>';
				const $submitCnt = $this.closest( 'form.wpforms-form' ).find( '.wpforms-submit-container' );
				let $submitBtn = $submitCnt.find( 'button.wpforms-submit' ),
					$errorCnt = $submitCnt.prev();
				const $form = $submitBtn.closest( 'form' ),
					$btnNext = $form.find( '.wpforms-page-next:visible' );

				// For multi-pages layout, use the "Next" button instead of the primary "Submit" button.
				if ( $form.find( '.wpforms-page-indicator' ).length !== 0 && $btnNext.length !== 0 ) {
					$submitBtn = $btnNext;
				}

				// Calculating totalSize.
				$uploads.each( function() {
					const $upload = $( this );
					let i = 0;
					const len = $upload[ 0 ].files.length;

					for ( ; i < len; i++ ) {
						totalSize += $upload[ 0 ].files[ i ].size;
					}
				} );

				// Checking totalSize.
				if ( totalSize < postMaxSize ) {
					// Remove error and release submit button.
					$errorCnt.find( '.wpforms-error-container-post_max_size' ).remove();

					$submitBtn.prop( 'disabled', false );

					WPFormsUtils.triggerEvent( $form, 'wpformsFormSubmitButtonRestore', [ $form, $submitBtn ] );

					WPFormsUtils.triggerEvent( $form, 'wpformsCombinedUploadsSizeOk', [ $form, $errorCnt ] );

					return;
				}

				// Convert sizes to Mb.
				totalSize = Number( ( totalSize / 1048576 ).toFixed( 3 ) );
				postMaxSize = Number( ( postMaxSize / 1048576 ).toFixed( 3 ) );

				// Preparing error message.
				errorMsg = errorMsg.replace( /{totalSize}/, totalSize ).replace( /{maxSize}/, postMaxSize );

				// Output error message.
				if ( $errorCnt.hasClass( 'wpforms-error-container' ) ) {
					$errorCnt.find( '.wpforms-error-container-post_max_size' ).remove();
					$errorCnt.append( errorMsg );
				} else {
					$submitCnt.before( errorCntTpl.replace( /{errorMsg}/, errorMsg ) );
					$errorCnt = $submitCnt.prev();
				}

				// Disable submit button.
				$submitBtn.prop( 'disabled', true );
				WPFormsUtils.triggerEvent( $form, 'wpformsFormSubmitButtonDisable', [ $form, $submitBtn ] );

				WPFormsUtils.triggerEvent( $form, 'wpformsCombinedUploadsSizeError', [ $form, $errorCnt ] );
			} );

			// Number Slider field: update hints.
			$document.on( 'change input', '.wpforms-field-number-slider input[type=range]', function( event ) {
				const hintEl = $( event.target ).siblings( '.wpforms-field-number-slider-hint' );

				hintEl.html( hintEl.data( 'hint' ).replaceAll( '{value}', '<b>' + event.target.value + '</b>' ) );
			} );

			// Enter key event.
			$document.on( 'keydown', '.wpforms-form input', function( e ) {
				if ( e.keyCode !== 13 ) {
					return;
				}

				const $t = $( this ),
					$page = $t.closest( '.wpforms-page' );

				if ( $page.length === 0 ) {
					return;
				}

				if ( [ 'text', 'tel', 'number', 'email', 'url', 'radio', 'checkbox' ].indexOf( $t.attr( 'type' ) ) < 0 ) {
					return;
				}

				if ( $t.hasClass( 'wpforms-datepicker' ) ) {
					$t.flatpickr( 'close' );
				}

				e.preventDefault();

				if ( $page.hasClass( 'last' ) ) {
					$page.closest( '.wpforms-form' ).find( '.wpforms-submit' ).trigger( 'click' );
					return;
				}

				$page.find( '.wpforms-page-next' ).trigger( 'click' );
			} );

			// Allow only numbers, minus and decimal point to be entered into the Numbers field.
			$document.on( 'keypress', '.wpforms-field-number input', function( e ) {
				return /^[-0-9.]+$/.test( String.fromCharCode( e.keyCode || e.which ) );
			} );

			// Start anti-spam timer on interaction of the form fields.
			$document
				.one( 'input', '.wpforms-field input, .wpforms-field textarea, .wpforms-field select', app.formChanged )
				.one( 'change', '.wpforms-field-select-style-modern, .wpforms-timepicker', app.formChanged )
				.one( 'focus', '.dropzone-input', app.formChanged )
				.one( 'click touchstart', '.wpforms-signature-canvas', app.formChanged )
				.one( 'wpformsRichTextContentChange', app.richTextContentChanged );

			$( 'form.wpforms-form' ).on( 'wpformsBeforePageChange', app.skipEmptyPages );
		},

		/**
		 * Skip empty pages (by CL, hidden fields etc.) inside multi-steps forms.
		 *
		 * @since 1.8.5
		 *
		 * @param {Event}  event    Event.
		 * @param {number} nextPage Next page.
		 * @param {jQuery} $form    Current form.
		 * @param {string} action   The navigation action.
		 */
		skipEmptyPages( event, nextPage, $form, action ) {
			const nextNonEmptyPage = app.findNonEmptyPage( nextPage, $form, action );

			if ( nextNonEmptyPage === nextPage ) {
				return;
			}

			event.preventDefault();

			if ( nextNonEmptyPage === 1 && action === 'prev' ) {
				const $secondPage = $form.find( '.wpforms-page-2' );
				const $currentPage = $form.find( '.wpforms-page-' + nextPage );
				// The previous button is optional. We pass the fallback to the original previous button
				// in the case when the previous button on the second page does not exist.
				const $prevButton = $secondPage.find( '.wpforms-page-prev' ).length
					? $secondPage.find( '.wpforms-page-prev' )
					: $currentPage.find( '.wpforms-page-prev' );

				wpforms.navigateToPage( $prevButton, 'prev', 2, $form, $secondPage );

				return;
			}

			// The next page button is always visible.
			// So we take the previous page before the next non-empty page
			// and simulate a jump forward from the next page.
			const prevPage = nextNonEmptyPage - 1;
			const $previousPage = $form.find( '.wpforms-page-' + prevPage );

			wpforms.navigateToPage( $previousPage.find( '.wpforms-page-next' ), 'next', prevPage, $form, $previousPage );
		},

		/**
		 * Find the next non-empty page.
		 *
		 * @since 1.8.5
		 *
		 * @param {number} page   Current page.
		 * @param {jQuery} $form  Current form.
		 * @param {string} action The navigation action.
		 *
		 * @return {number} The next non-empty page number.
		 */
		findNonEmptyPage( page, $form, action ) {
			let nextNonEmptyPage = page;

			while ( app.isEmptyPage( $form, nextNonEmptyPage ) ) {
				if ( action === 'prev' ) {
					nextNonEmptyPage--;
				} else {
					nextNonEmptyPage++;
				}
			}

			return nextNonEmptyPage;
		},

		/**
		 * Check the target page is empty.
		 *
		 * @since 1.8.5
		 *
		 * @param {jQuery} $form Current form.
		 * @param {number} page  Page number.
		 *
		 * @return {boolean} True if page is empty.
		 */
		isEmptyPage( $form, page ) {
			// The first page is always visible.
			if ( page === 1 ) {
				return false;
			}

			const $currentPage = $form.find( '.wpforms-page-' + page );

			// The last page has the "Submit" button, so it's always non-empty.
			if ( $currentPage.hasClass( 'last' ) ) {
				return false;
			}

			const $fieldsOnPage = $currentPage.find( '.wpforms-field:not(.wpforms-field-pagebreak):not(.wpforms-field-hidden)' );

			return $currentPage.find( '.wpforms-conditional-hide' ).length === $fieldsOnPage.length;
		},

		/**
		 * Form changed.
		 *
		 * @since 1.8.3
		 *
		 * @param {Object} event Event object.
		 */
		formChanged( event ) {
			const $form = $( this ).closest( '.wpforms-form' );

			app.maybeSetStartTime( $form );
		},

		/**
		 * Rich text content changed.
		 *
		 * @since 1.8.3
		 *
		 * @param {Object} event    Event object.
		 * @param {Object} mutation Mutation object.
		 * @param {Object} editor   Editor object.
		 */
		richTextContentChanged( event, mutation, editor ) {
			const container = editor.getContainer();

			const $form = $( container ).closest( '.wpforms-form' );

			app.maybeSetStartTime( $form );
		},

		/**
		 * Initialize the start timestamp for each form on the page.
		 *
		 * @since 1.9.0
		 */
		initFormsStartTime() {
			$( '.wpforms-form' ).each( function() {
				app.maybeSetStartTime( $( this ) );
			} );
		},

		/**
		 * Maybe set start time for anti-spam timer.
		 *
		 * @since 1.8.3
		 *
		 * @param {jQuery} $form Form element.
		 */
		maybeSetStartTime( $form ) {
			if ( ! $form.data( 'start_timestamp' ) ) {
				$form.data( 'start_timestamp', app.getTimestampSec() );
			}
		},

		/**
		 * Entry preview field callback for a page changing.
		 *
		 * @since 1.6.9
		 * @deprecated 1.7.0
		 *
		 * @param {Event}  event       Event.
		 * @param {number} currentPage Current page.
		 * @param {jQuery} $form       Current form.
		 */
		entryPreviewFieldPageChange( event, currentPage, $form ) {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Obsolete function called. Function wpforms.entryPreviewFieldPageChange has been deprecated, please use the WPFormsEntryPreview.pageChange function instead!' );
			WPFormsEntryPreview.pageChange( event, currentPage, $form );
		},

		/**
		 * Update the entry preview fields on the page.
		 *
		 * @since 1.6.9
		 * @deprecated 1.7.0
		 *
		 * @param {number} currentPage Current page.
		 * @param {jQuery} $form       Current form.
		 */
		entryPreviewFieldUpdate( currentPage, $form ) {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Obsolete function called. Function wpforms.entryPreviewFieldUpdate has been deprecated, please use the WPFormsEntryPreview.update function instead!' );
			WPFormsEntryPreview.update( currentPage, $form );
		},

		/**
		 * Scroll to and focus on the field with error.
		 *
		 * @since 1.5.8
		 *
		 * @param {jQuery} $el Form, container or input element jQuery object.
		 */
		scrollToError( $el ) {
			if ( $el.length === 0 ) {
				return;
			}

			// Look for a field with an error inside an $el.
			let $field = $el.find( '.wpforms-field.wpforms-has-error' );

			// Look outside in not found inside.
			if ( $field.length === 0 ) {
				$field = $el.closest( '.wpforms-field' );
			}

			if ( $field.length === 0 ) {
				return;
			}

			const offset = $field.offset();

			if ( typeof offset === 'undefined' ) {
				return;
			}

			app.animateScrollTop( offset.top - 75, 750 ).done( function() {
				const $error = $field.find( '.wpforms-error' ).first();
				if ( typeof $error.focus === 'function' ) {
					$error.trigger( 'focus' );
				}
			} );
		},

		/**
		 * Update Pagebreak navigation.
		 *
		 * @since 1.2.2
		 *
		 * @param {jQuery} el jQuery element object.
		 */
		pagebreakNav( el ) {
			const $this = $( el ),
				action = $this.data( 'action' ),
				page = $this.data( 'page' ),
				$form = $this.closest( '.wpforms-form' ),
				$page = $form.find( '.wpforms-page-' + page );

			app.saveTinyMCE();

			if ( 'next' === action && ( typeof $.fn.validate !== 'undefined' ) ) {
				app.checkForInvalidFields( $form, $page, function() {
					app.navigateToPage( $this, action, page, $form, $page );
				} );
				return;
			}

			if ( 'prev' === action || 'next' === action ) {
				app.navigateToPage( $this, action, page, $form, $page );
			}
		},

		/**
		 * Check the validity of all the fields in the current page.
		 *
		 * @since 1.7.6
		 *
		 * @param {jQuery}   $form    WPForms element object.
		 * @param {jQuery}   $page    Current page element object in page break context.
		 * @param {Function} callback Callback to run when all fields are valid.
		 */
		checkForInvalidFields( $form, $page, callback ) {
			const validator = $form.data( 'validator' );
			if ( ! validator ) {
				return;
			}

			if ( validator.pendingRequest > 0 ) {
				setTimeout( function() {
					app.checkForInvalidFields( $form, $page, callback );
				}, 800 );

				return;
			}

			let valid = true;

			$page.find( ':input' ).each( function( index, el ) {
				const $el = $( el );
				// Skip input fields without `name` attribute, which could have fields.
				// E.g. `Placeholder` input for Modern dropdown.
				if ( ! $el.attr( 'name' ) ) {
					return;
				}

				// Skip validation for some fields.
				// E.g., applied coupon hidden field.
				if ( $el.hasClass( 'wpforms-field-skip-validation' ) ) {
					return;
				}

				if ( ! $( el ).valid() ) {
					valid = false;
				}
			} );

			if ( ! valid ) {
				app.scrollToError( $page );
			} else {
				callback();
			}
		},

		/**
		 * Navigate through page break pages.
		 *
		 * @since 1.7.6
		 *
		 * @param {jQuery} $this  jQuery element of the next / prev nav button.
		 * @param {string} action The navigation action.
		 * @param {number} page   Current page number.
		 * @param {jQuery} $form  WPForms element object.
		 * @param {jQuery} $page  Current page element object in page break context.
		 */
		navigateToPage( $this, action, page, $form, $page ) {
			if ( $this.hasClass( 'wpforms-disabled' ) ) {
				return;
			}

			let nextPage = page;

			if ( 'next' === action ) {
				nextPage += 1;
			} else if ( 'prev' === action ) {
				nextPage -= 1;
			}

			const event = WPFormsUtils.triggerEvent( $this, 'wpformsBeforePageChange', [ nextPage, $form, action ] );

			// Allow callbacks on `wpformsBeforePageChange` to cancel page changing by triggering `event.preventDefault()`.
			if ( event.isDefaultPrevented() ) {
				return;
			}

			$form.find( '.wpforms-page' ).hide();

			const $destinationPage = $form.find( '.wpforms-page-' + nextPage );
			$destinationPage.show();

			app.toggleReCaptchaAndSubmitDisplay( $form, action, $destinationPage );
			app.checkTurnstileVisibility( $form );

			const pageScroll = app.getPageScroll( $form );
			if ( pageScroll ) {
				app.animateScrollTop( $form.offset().top - pageScroll, 750, null );
			}

			$this.trigger( 'wpformsPageChange', [ nextPage, $form, action ] );

			app.manipulateIndicator( nextPage, $form );
		},

		/**
		 * Toggle the reCaptcha and submit container display.
		 *
		 * @since 1.7.6
		 *
		 * @param {jQuery} $form            WPForms element object.
		 * @param {string} action           The navigation action.
		 * @param {jQuery} $destinationPage Destination Page element object.
		 */
		toggleReCaptchaAndSubmitDisplay( $form, action, $destinationPage ) {
			const $submit = $form.find( '.wpforms-submit-container' ),
				$reCAPTCHA = $form.find( '.wpforms-recaptcha-container' );

			if ( 'next' === action && $destinationPage.hasClass( 'last' ) ) {
				$reCAPTCHA.show();
				$submit.show();
			} else if ( 'prev' === action ) {
				$reCAPTCHA.hide();
				$submit.hide();
			}
		},

		/**
		 * Update Turnstile container class if invisible mode is chosen.
		 *
		 * @since 1.9.0
		 *
		 * @param {jQuery} $form WPForms element object.
		 */
		checkTurnstileVisibility( $form ) {
			const $turnstile = $form.find( '.wpforms-recaptcha-container' );

			// Check if Turnstile captcha is enabled.
			if ( ! $turnstile.hasClass( 'wpforms-is-turnstile' ) ) {
				return;
			}

			const iframeWrapperHeight = $turnstile.find( '.g-recaptcha' ).height();

			parseInt( iframeWrapperHeight, 10 ) === 0
				? $turnstile.addClass( 'wpforms-is-turnstile-invisible' )
				: $turnstile.removeClass( 'wpforms-is-turnstile-invisible' );
		},

		/**
		 * Get the page scroll position.
		 *
		 * @since 1.7.6
		 *
		 * @param {jQuery} $form WPForms element object.
		 * @return {number|boolean} Returns a number if position to page scroll is found.
		 * Otherwise, return `false` if position isn't found.
		 */
		getPageScroll( $form ) {
			if ( false === window.wpforms_pageScroll ) {
				return false;
			}

			if ( ! app.empty( window.wpform_pageScroll ) ) {
				return window.wpform_pageScroll;
			}

			// Page scroll.
			return $form.find( '.wpforms-page-indicator' ).data( 'scroll' ) !== 0 ? 75 : false;
		},

		/**
		 * Manipulate the indicator.
		 *
		 * @since 1.7.6
		 *
		 * @param {number} nextPage The next's / destination's page number.
		 * @param {jQuery} $form    WPForms element object.
		 */
		manipulateIndicator( nextPage, $form ) {
			const $indicator = $form.find( '.wpforms-page-indicator' );

			if ( ! $indicator ) {
				return;
			}

			const theme = $indicator.data( 'indicator' );

			if ( 'connector' === theme || 'circles' === theme ) {
				app.manipulateConnectorAndCirclesIndicator( $indicator, theme, nextPage );
				return;
			}

			if ( 'progress' === theme ) {
				app.manipulateProgressIndicator( $indicator, $form, nextPage );
			}
		},

		/**
		 * Manipulate 'circles' or 'connector' theme indicator.
		 *
		 * @since 1.7.6
		 *
		 * @param {jQuery} $indicator The indicator jQuery element object.
		 * @param {string} theme      Indicator theme.
		 * @param {number} nextPage   The next's / destination's page number.
		 */
		manipulateConnectorAndCirclesIndicator( $indicator, theme, nextPage ) {
			const color = $indicator.data( 'indicator-color' );

			$indicator.find( '.wpforms-page-indicator-page' ).removeClass( 'active' );
			$indicator.find( '.wpforms-page-indicator-page-' + nextPage ).addClass( 'active' );
			$indicator.find( '.wpforms-page-indicator-page-number' ).removeAttr( 'style' );
			$indicator.find( '.active .wpforms-page-indicator-page-number' ).css( 'background-color', color );

			if ( 'connector' === theme ) {
				$indicator.find( '.wpforms-page-indicator-page-triangle' ).removeAttr( 'style' );
				$indicator.find( '.active .wpforms-page-indicator-page-triangle' ).css( 'border-top-color', color );
			}
		},

		/**
		 * Manipulate 'progress' theme indicator.
		 *
		 * @since 1.7.6
		 *
		 * @param {jQuery} $indicator The indicator jQuery element object.
		 * @param {jQuery} $form      WPForms element object.
		 * @param {number} nextPage   The next's / destination's page number.
		 */
		manipulateProgressIndicator( $indicator, $form, nextPage ) {
			const $pageTitle = $indicator.find( '.wpforms-page-indicator-page-title' ),
				$pageSep = $indicator.find( '.wpforms-page-indicator-page-title-sep' ),
				totalPages = $form.find( '.wpforms-page' ).length,
				width = ( nextPage / totalPages ) * 100;

			$indicator.find( '.wpforms-page-indicator-page-progress' ).css( 'width', width + '%' );
			$indicator.find( '.wpforms-page-indicator-steps-current' ).text( nextPage );

			if ( $pageTitle.data( 'page-' + nextPage + '-title' ) ) {
				$pageTitle.css( 'display', 'inline' ).text( $pageTitle.data( 'page-' + nextPage + '-title' ) );
				$pageSep.css( 'display', 'inline' );
			} else {
				$pageTitle.css( 'display', 'none' );
				$pageSep.css( 'display', 'none' );
			}
		},

		/**
		 * OptinMonster compatibility.
		 *
		 * Re-initialize after OptinMonster loads to accommodate changes that
		 * have occurred to the DOM.
		 *
		 * @since 1.5.0
		 */
		bindOptinMonster() {
			// OM v5.
			document.addEventListener( 'om.Campaign.load', function( event ) {
				app.ready();
				app.optinMonsterRecaptchaReset( event.detail.Campaign.data.id );
			} );

			document.addEventListener( 'om.Campaign.afterShow', function( event ) {
				// Init Repeater fields.
				if ( 'undefined' !== typeof WPFormsRepeaterField ) {
					WPFormsRepeaterField.ready();
				}
			} );

			// OM Legacy.
			$( document ).on( 'OptinMonsterOnShow', function( event, data, object ) {
				app.ready();
				app.optinMonsterRecaptchaReset( data.optin );

				// Init Repeater fields.
				if ( 'undefined' !== typeof WPFormsRepeaterField ) {
					WPFormsRepeaterField.ready();
				}
			} );
		},

		/**
		 * Reset/recreate hCaptcha/reCAPTCHA v2 inside OptinMonster.
		 *
		 * @since 1.5.0
		 * @since 1.6.4 Added hCaptcha support.
		 *
		 * @param {string} optinId OptinMonster ID.
		 */
		optinMonsterRecaptchaReset( optinId ) {
			const $form = $( '#om-' + optinId ).find( '.wpforms-form' ),
				$captchaContainer = $form.find( '.wpforms-recaptcha-container' ),
				$captcha = $form.find( '.g-recaptcha' );

			if ( $form.length && $captcha.length ) {
				const captchaSiteKey = $captcha.attr( 'data-sitekey' ),
					captchaID = 'recaptcha-' + Date.now(),
					apiVar = $captchaContainer.hasClass( 'wpforms-is-hcaptcha' ) ? hcaptcha : grecaptcha;

				$captcha.remove();
				$captchaContainer.prepend( '<div class="g-recaptcha" id="' + captchaID + '" data-sitekey="' + captchaSiteKey + '"></div>' );

				apiVar.render(
					captchaID,
					{
						sitekey: captchaSiteKey,
						callback() {
							wpformsRecaptchaCallback( $( '#' + captchaID ) );
						},
					}
				);
			}
		},

		//--------------------------------------------------------------------//
		// Other functions.
		//--------------------------------------------------------------------//

		/**
		 * Payments: Run amount calculation and update the Total field value.
		 *
		 * @since 1.2.3
		 * @since 1.5.1 Added support for payment-checkbox field.
		 *
		 * @param {Object}  el       jQuery DOM object.
		 * @param {boolean} validate Whether to validate or not.
		 */
		amountTotal( el, validate ) {
			validate = validate || false;

			const $el = $( el ),
				$form = $el.closest( '.wpforms-form' ),
				total = app.amountTotalCalc( $form );

			if ( ! app.allowAmountTotalCalc( $form, $el, total ) ) {
				return;
			}

			const totalFormattedSymbol = app.amountFormatSymbol( total );

			$form.find( '.wpforms-payment-total' ).each( function() {
				if ( 'hidden' === $( this ).attr( 'type' ) || 'text' === $( this ).attr( 'type' ) ) {
					$( this ).val( totalFormattedSymbol );
					if ( 'text' === $( this ).attr( 'type' ) && validate && $form.data( 'validator' ) ) {
						$( this ).valid();
					}
				} else {
					$( this ).text( totalFormattedSymbol );
				}
			} );

			app.updateOrderSummaryItems( $form, $el, totalFormattedSymbol );
		},

		/**
		 * Check if the total amount calculation is allowed.
		 * Cache total amount to avoid multiple triggers.
		 *
		 * @since 1.9.2
		 *
		 * @param {jQuery} $form Form object.
		 * @param {jQuery} $el   Payment field object.
		 * @param {number} total Total amount.
		 *
		 * @return {boolean} True if the total amount calculation is allowed, false otherwise.
		 */
		allowAmountTotalCalc( $form, $el, total ) {
			const formId = $form.data( 'formid' );

			if ( app.getCache( formId, 'amountTotal' ) !== total ) {
				app.updateCache( formId, 'amountTotal', total );

				return true;
			}

			const type = $el.prop( 'type' );

			// Force re-calculation for choices and dropdown fields.
			if ( type === 'radio' || type === 'select-one' ) {
				return true;
			}

			return false;
		},

		/**
		 * Update summary table items visibility and total amount.
		 *
		 * @since 1.8.7
		 *
		 * @param {jQuery} $form         Form object.
		 * @param {jQuery} $paymentField Payment field object.
		 * @param {string} total         Formatted form total.
		 */
		updateOrderSummaryItems( $form, $paymentField, total ) {
			$form.find( '.wpforms-order-summary-preview' ).each( function() {
				const $summary = $( this );

				if ( total !== '' ) {
					$summary.find( '.wpforms-order-summary-preview-total .wpforms-order-summary-item-price' ).text( total );
				}

				$form.find( '.wpforms-payment-price' ).each( function() {
					app.updateOrderSummaryItem( $( this ), $summary );
				} );
			} );
		},

		/**
		 * Update value in cache.
		 *
		 * @since 1.9.2
		 *
		 * @param {string} formId Form ID.
		 * @param {string} key    Cache key.
		 * @param {any}    value  Cache value.
		 */
		updateCache( formId, key, value ) {
			app.cache[ formId ] = app.cache[ formId ] || {};
			app.cache[ formId ][ key ] = value;
		},

		/**
		 * Get a value from the cache.
		 *
		 * @since 1.9.2
		 *
		 * @param {string} formId Form ID.
		 * @param {string} key    Cache key.
		 *
		 * @return {any|boolean} Cache value or false if not found.
		 */
		getCache( formId, key ) {
			if (
				! Object.prototype.hasOwnProperty.call( app.cache, formId ) ||
				! Object.prototype.hasOwnProperty.call( app.cache[ formId ], key )
			) {
				return false;
			}

			return app.cache[ formId ][ key ];
		},

		/**
		 * Update summary table item visibility and amount.
		 *
		 * @since 1.8.7
		 *
		 * @param {jQuery} $paymentField Payment field object.
		 * @param {jQuery} $summary      Summary object.
		 */
		// eslint-disable-next-line complexity
		updateOrderSummaryItem( $paymentField, $summary ) {
			if ( ! $paymentField.hasClass( 'wpforms-payment-price' ) ) {
				return;
			}

			const $field = $paymentField.closest( '.wpforms-field' ),
				fieldId = $field.data( 'field-id' ),
				type = $paymentField.prop( 'type' ),
				isFieldVisible = $field.css( 'display' ) === 'block';

			if ( type === 'checkbox' || type === 'radio' || type === 'select-one' ) {
				// Show only selected items.
				$summary.find( `tr[data-field="${ fieldId }"]` ).each( function() {
					const choiceID = $( this ).data( 'choice' );
					const isChoiceChecked = type === 'select-one'
						? choiceID === parseInt( $field.find( 'select' ).val(), 10 )
						: $field.find( `input[value="${ choiceID }"]` ).is( ':checked' );

					$( this ).toggle( isFieldVisible && isChoiceChecked );
				} );
			} else {
				const $item = $summary.find( `tr[data-field="${ fieldId }"]` ),
					amount = $paymentField.val();

				$item.find( '.wpforms-order-summary-item-price' ).text( app.amountFormatSymbol( app.amountSanitize( amount ) ) );
				$item.toggle( isFieldVisible );
			}

			if ( ! $field.hasClass( 'wpforms-payment-quantities-enabled' ) ) {
				app.updateSummaryPriceWidth( $summary );
				app.toggleSummaryPlaceholder( $summary );

				return;
			}

			app.updateOrderSummaryItemQuantity( $paymentField );
		},

		/**
		 * Update summary table item quantity and price.
		 *
		 * @since 1.8.7
		 *
		 * @param {jQuery} $input Payment input object.
		 */
		updateOrderSummaryItemQuantity( $input ) {
			const $field = $input.closest( '.wpforms-field' ),
				$paymentField = $field.find( 'input.wpforms-payment-price, select.wpforms-payment-price' ),
				$form = $input.closest( '.wpforms-form' ),
				fieldId = $field.data( 'field-id' ),
				quantity = app.getPaymentFieldQuantity( $paymentField ),
				amount = app.getPaymentFieldAmount( $paymentField ),
				type = $paymentField.prop( 'type' );

			$form.find( '.wpforms-order-summary-preview' ).each( function() {
				const $summary = $( this );

				let $item;

				if ( type === 'checkbox' || type === 'radio' || type === 'select-one' ) {
					const choiceId = $paymentField.val();

					$item = $summary.find( `tr[data-field="${ fieldId }"][data-choice="${ choiceId }"]` );
				} else {
					$item = $summary.find( `tr[data-field="${ fieldId }"]` );
				}

				$item.toggle( quantity > 0 );

				// Update field quantity and amount.
				$item.find( '.wpforms-order-summary-item-quantity' ).text( quantity );
				$item.find( '.wpforms-order-summary-item-price' ).text( app.amountFormatSymbol( amount * quantity ) );

				app.updateSummaryPriceWidth( $summary );
				app.toggleSummaryPlaceholder( $summary );
			} );
		},

		/**
		 * Update summary price column width.
		 *
		 * @since 1.8.7
		 *
		 * @param {jQuery} $summary Summary table object.
		 */
		updateSummaryPriceWidth( $summary ) {
			const priceColumnWidth = Math.max( $summary.find( '.wpforms-order-summary-preview-coupon-total .wpforms-order-summary-item-price' ).text().length, $summary.find( '.wpforms-order-summary-preview-total .wpforms-order-summary-item-price' ).text().length + 3 );

			$summary.find( '.wpforms-order-summary-item-price' ).css( 'width', `${ priceColumnWidth }ch` );
		},

		/**
		 * Update summary placeholder visibility.
		 *
		 * @since 1.8.7
		 *
		 * @param {jQuery} $summary Summary table object.
		 */
		toggleSummaryPlaceholder( $summary ) {
			const $placeholder = $summary.find( '.wpforms-order-summary-placeholder' );

			let showPlaceholder = true;

			$summary.find( '.wpforms-order-summary-field' ).each( function() {
				if ( $( this ).css( 'display' ) !== 'none' ) {
					showPlaceholder = false;

					return false;
				}
			} );

			$placeholder.toggle( showPlaceholder );
		},

		/**
		 * Payments: Calculate a total amount without formatting.
		 *
		 * @since 1.6.7.1
		 *
		 * @param {jQuery} $form Form element.
		 *
		 * @return {number} Total amount.
		 */
		amountTotalCalc( $form ) {
			let total = 0;

			$( '.wpforms-payment-price', $form ).each( function() {
				const $this = $( this );

				if ( $this.closest( '.wpforms-field-payment-single' ).hasClass( 'wpforms-conditional-hide' ) ) {
					return;
				}

				const amount = app.getPaymentFieldAmount( $this );

				if ( amount ) {
					total = Number( total ) + ( amount * app.getPaymentFieldQuantity( $this ) );
				}
			} );

			const $document = $( document );

			/**
			 * Trigger whe the total amount has been calculated.
			 *
			 * Allow addons to modify the total amount.
			 *
			 * @since 1.8.2.2
			 *
			 * @param {Object} data Form element and total.
			 */
			const event = WPFormsUtils.triggerEvent( $document, 'wpformsAmountTotalCalculate', [ $form, total ] );

			total = event.result !== undefined && event.result >= 0 ? event.result : total;

			/**
			 * Trigger on the end of the process of calculating the total amount.
			 *
			 * @since 1.8.0.2
			 *
			 * @param {Object} data Form element and total.
			 */
			WPFormsUtils.triggerEvent( $document, 'wpformsAmountTotalCalculated', [ $form, total ] );

			return total;
		},

		/**
		 * Get payment field sanitized amount.
		 *
		 * @since 1.8.7
		 *
		 * @param {jQuery} $field Field element.
		 *
		 * @return {number} Sanitized amount.
		 */
		// eslint-disable-next-line complexity
		getPaymentFieldAmount( $field ) {
			const type = $field.attr( 'type' );

			if ( type === 'text' || type === 'hidden' ) {
				return Number( app.amountSanitize( $field.val() ) );
			}

			if ( ( type === 'radio' || type === 'checkbox' ) && $field.is( ':checked' ) ) {
				return Number( app.amountSanitize( $field.data( 'amount' ) ) );
			}

			if ( $field.is( 'select' ) && $field.find( 'option:selected' ).length > 0 && $field.find( 'option:selected' ).data( 'amount' ) ) {
				return Number( app.amountSanitize( $field.find( 'option:selected' ).data( 'amount' ) ) );
			}

			return 0;
		},

		/**
		 * Get payment field quantity.
		 *
		 * @since 1.8.7
		 *
		 * @param {jQuery} $field Field element.
		 *
		 * @return {number} Quantity value.
		 */
		getPaymentFieldQuantity( $field ) {
			const fieldId = $field.attr( 'id' ),
				$quantityInput = $( `#${ fieldId }-quantity` );

			if ( $quantityInput.length ) {
				return Number( $quantityInput.val() );
			}

			return 1;
		},

		/**
		 * Sanitize amount and convert to standard format for calculations.
		 *
		 * @since 1.2.6
		 *
		 * @param {string} amount Amount to sanitize.
		 *
		 * @return {string} Sanitized amount.
		 */
		// eslint-disable-next-line complexity
		amountSanitize( amount ) {
			const currency = app.getCurrency();

			// Convert to string, remove a currency symbol, and allow only numbers, dots, and commas.
			amount = amount.toString().replace( currency.symbol, '' ).replace( /[^0-9.,]/g, '' );

			if ( currency.decimal_sep === ',' ) {
				if ( currency.thousands_sep === '.' && amount.indexOf( currency.thousands_sep ) !== -1 ) {
					amount = amount.replace( new RegExp( '\\' + currency.thousands_sep, 'g' ), '' );
				} else if ( currency.thousands_sep === '' && amount.indexOf( '.' ) !== -1 ) {
					amount = amount.replace( /\./g, '' );
				}
				amount = amount.replace( currency.decimal_sep, '.' );
			} else if ( currency.thousands_sep === ',' && ( amount.indexOf( currency.thousands_sep ) !== -1 ) ) {
				amount = amount.replace( new RegExp( '\\' + currency.thousands_sep, 'g' ), '' );
			}

			return app.numberFormat( amount, currency.decimals, '.', '' );
		},

		/**
		 * Format amount.
		 *
		 * @since 1.2.6
		 *
		 * @param {string|number} amount Amount to format.
		 *
		 * @return {string} Formatted amount.
		 */
		amountFormat( amount ) {
			const currency = app.getCurrency();

			amount = String( amount );

			// Format the amount
			if ( ',' === currency.decimal_sep && ( amount.indexOf( currency.decimal_sep ) !== -1 ) ) {
				const sepFound = amount.indexOf( currency.decimal_sep ),
					whole = amount.substr( 0, sepFound ),
					part = amount.substr( sepFound + 1, amount.length - 1 );
				amount = whole + '.' + part;
			}

			// Strip "," from the amount (if set as thousands separator)
			if ( ',' === currency.thousands_sep && ( amount.indexOf( currency.thousands_sep ) !== -1 ) ) {
				amount = amount.replace( /,/g, '' );
			}

			if ( app.empty( amount ) ) {
				amount = 0;
			}

			return app.numberFormat( amount, currency.decimals, currency.decimal_sep, currency.thousands_sep );
		},

		/**
		 * Format amount with the currency symbol.
		 *
		 * @since 1.8.4
		 *
		 * @param {string|number} amount Amount to format.
		 *
		 * @return {string} Formatted amount.
		 */
		amountFormatSymbol( amount ) {
			const currency = app.getCurrency(),
				amountFormatted = app.amountFormat( amount );

			if ( currency.symbol_pos === 'left' ) {
				return currency.symbol + amountFormatted;
			}

			return amountFormatted + ' ' + currency.symbol;
		},

		/**
		 * Get site currency settings.
		 *
		 * @since 1.2.6
		 *
		 * @return {Object} Currency data object.
		 */
		getCurrency() { // eslint-disable-line complexity
			const currency = {
				code: 'USD',
				thousands_sep: ',', // eslint-disable-line camelcase
				decimals: 2,
				decimal_sep: '.', // eslint-disable-line camelcase
				symbol: '$',
				symbol_pos: 'left', // eslint-disable-line camelcase
			};

			// Backwards compatibility.
			if ( typeof wpforms_settings.currency_code !== 'undefined' ) {
				currency.code = wpforms_settings.currency_code;
			}
			if ( typeof wpforms_settings.currency_thousands !== 'undefined' ) {
				currency.thousands_sep = wpforms_settings.currency_thousands; // eslint-disable-line camelcase
			}
			if ( typeof wpforms_settings.currency_decimals !== 'undefined' ) {
				currency.decimals = wpforms_settings.currency_decimals;
			}
			if ( typeof wpforms_settings.currency_decimal !== 'undefined' ) {
				currency.decimal_sep = wpforms_settings.currency_decimal; // eslint-disable-line camelcase
			}
			if ( typeof wpforms_settings.currency_symbol !== 'undefined' ) {
				currency.symbol = wpforms_settings.currency_symbol;
			}
			if ( typeof wpforms_settings.currency_symbol_pos !== 'undefined' ) {
				currency.symbol_pos = wpforms_settings.currency_symbol_pos; // eslint-disable-line camelcase
			}

			return currency;
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
			const sep = ( 'undefined' === typeof thousandsSep ) ? ',' : thousandsSep;
			const dec = ( 'undefined' === typeof decimalSep ) ? '.' : decimalSep;

			const toFixedFix = function( n, prec ) {
				const k = Math.pow( 10, prec );
				return '' + ( Math.round( n * k ) / k ).toFixed( prec );
			};

			// @todo: for IE parseFloat(0.55).toFixed(0) = 0;
			const s = ( precision ? toFixedFix( n, precision ) : '' + Math.round( n ) ).split( '.' );

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
		 *
		 * @see http://locutus.io/php/empty/
		 *
		 * @since 1.2.6
		 *
		 * @param {any} mixedVar Variable to check.
		 *
		 * @return {boolean} Whether the var is empty or not.
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

			if ( 'object' === typeof mixedVar ) {
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
		 * Set cookie container user UUID.
		 *
		 * @since 1.3.3
		 */
		setUserIdentifier() { // eslint-disable-line complexity
			if ( ( ( ! window.hasRequiredConsent && typeof wpforms_settings !== 'undefined' && wpforms_settings.uuid_cookie ) || ( window.hasRequiredConsent && window.hasRequiredConsent() ) ) && ! app.getCookie( '_wpfuuid' ) ) {
				// Generate UUID - http://stackoverflow.com/a/873856/1489528
				const s = new Array( 36 ),
					hexDigits = '0123456789abcdef';

				for ( let i = 0; i < 36; i++ ) {
					s[ i ] = hexDigits.substr( Math.floor( Math.random() * 0x10 ), 1 );
				}

				s[ 14 ] = '4';

				// eslint-disable-next-line no-bitwise
				s[ 19 ] = hexDigits.substr( ( s[ 19 ] & 0x3 ) | 0x8, 1 );
				s[ 8 ] = s[ 13 ] = s[ 18 ] = s[ 23 ] = '-';

				const uuid = s.join( '' );

				app.createCookie( '_wpfuuid', uuid, 3999 );
			}
		},

		/**
		 * Create cookie.
		 *
		 * @since 1.3.3
		 *
		 * @param {string} name  Cookie name.
		 * @param {string} value Cookie value.
		 * @param {number} days  Whether it should expire and when.
		 */
		createCookie( name, value, days ) {
			let expires = '';
			let secure = '';

			if ( wpforms_settings.is_ssl ) {
				secure = ';secure';
			}

			// If we have a "days" value, set it in the expiry of the cookie.
			if ( days ) {
				// If -1 is our value, set a session-based cookie instead of a persistent cookie.
				if ( -1 === days ) {
					expires = '';
				} else {
					const date = new Date();
					date.setTime( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
					expires = ';expires=' + date.toGMTString();
				}
			} else {
				expires = ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
			}

			// Write the cookie.
			document.cookie = name + '=' + value + expires + ';path=/;samesite=strict' + secure;
		},

		/**
		 * Retrieve cookie.
		 *
		 * @since 1.3.3
		 *
		 * @param {string} name Cookie name.
		 *
		 * @return {string|null} Cookie value or null when it doesn't exist.
		 */
		getCookie( name ) {
			const nameEQ = name + '=',
				ca = document.cookie.split( ';' );

			for ( let i = 0; i < ca.length; i++ ) {
				let c = ca[ i ];
				while ( ' ' === c.charAt( 0 ) ) {
					c = c.substring( 1, c.length );
				}
				if ( 0 === c.indexOf( nameEQ ) ) {
					return c.substring( nameEQ.length, c.length );
				}
			}

			return null;
		},

		/**
		 * Delete cookie.
		 *
		 * @since 1.3.3
		 *
		 * @param {string} name Cookie name.
		 */
		removeCookie( name ) {
			app.createCookie( name, '', -1 );
		},

		/**
		 * Get user browser preferred language.
		 *
		 * @since 1.5.2
		 *
		 * @return {string} Language code.
		 */
		getFirstBrowserLanguage() { // eslint-disable-line complexity
			const nav = window.navigator,
				browserLanguagePropertyKeys = [ 'language', 'browserLanguage', 'systemLanguage', 'userLanguage' ];
			let i,
				language;

			// Support for HTML 5.1 "navigator.languages".
			if ( Array.isArray( nav.languages ) ) {
				for ( i = 0; i < nav.languages.length; i++ ) {
					language = nav.languages[ i ];
					if ( language && language.length ) {
						return language;
					}
				}
			}

			// Support for other well-known properties in browsers.
			for ( i = 0; i < browserLanguagePropertyKeys.length; i++ ) {
				language = nav[ browserLanguagePropertyKeys[ i ] ];
				if ( language && language.length ) {
					return language;
				}
			}

			return '';
		},

		/**
		 * Function maps lang code like `el` to `el-GR`.
		 *
		 * @since 1.9.0
		 *
		 * @param {string} lang Language code.
		 *
		 * @return {string} Language code with ISO.
		 */
		mapLanguageToIso( lang ) {
			const langMap = {
				ar: 'ar-SA',
				bg: 'bg-BG',
				ca: 'ca-ES',
				cs: 'cs-CZ',
				da: 'da-DK',
				de: 'de-DE',
				el: 'el-GR',
				en: 'en-US',
				es: 'es-ES',
				fi: 'fi-FI',
				fr: 'fr-FR',
				he: 'he-IL',
				hi: 'hi-IN',
				hr: 'hr-HR',
				hu: 'hu-HU',
				id: 'id-ID',
				it: 'it-IT',
				ja: 'ja-JP',
				ko: 'ko-KR',
				lt: 'lt-LT',
				lv: 'lv-LV',
				ms: 'ms-MY',
				nl: 'nl-NL',
				no: 'nb-NO',
				pl: 'pl-PL',
				pt: 'pt-PT',
				ro: 'ro-RO',
				ru: 'ru-RU',
				sk: 'sk-SK',
				sl: 'sl-SI',
				sr: 'sr-RS',
				sv: 'sv-SE',
				th: 'th-TH',
				tr: 'tr-TR',
				uk: 'uk-UA',
				vi: 'vi-VN',
				zh: 'zh-CN',
			};

			return langMap[ lang ] || lang;
		},

		/**
		 * Asynchronously fetches country code using current IP
		 * and executes a callback provided with a country code parameter.
		 *
		 * @since 1.5.2
		 *
		 * @param {Function} callback Executes once the fetch is completed.
		 */
		currentIpToCountry( callback ) {
			if ( wpforms_settings.country ) {
				callback( wpforms_settings.country );
				return;
			}

			const fallback = function() {
				$.get( 'https://ipapi.co/jsonp', function() {}, 'jsonp' )
					.always( function( resp ) {
						let countryCode = resp?.country ? resp.country : '';

						if ( ! countryCode ) {
							const lang = app.getFirstBrowserLanguage();
							countryCode = lang.indexOf( '-' ) > -1 ? lang.split( '-' ).pop() : '';
						}

						callback( countryCode );
					} );
			};

			$.get( 'https://geo.wpforms.com/v3/geolocate/json' )
				.done( function( resp ) {
					if ( resp && resp.country_iso ) {
						callback( resp.country_iso );
					} else {
						fallback();
					}
				} )
				.fail( function( resp ) {
					fallback();
				} );
		},

		/**
		 * Form submit.
		 *
		 * @since 1.5.3
		 * @since 1.7.6 Allow canceling form submission.
		 *
		 * @param {jQuery} $form Form element.
		 */
		formSubmit( $form ) {
			// Form element was passed from vanilla JavaScript.
			if ( ! ( $form instanceof jQuery ) ) {
				$form = $( $form );
			}

			app.saveTinyMCE();

			const event = WPFormsUtils.triggerEvent( $form, 'wpformsBeforeFormSubmit', [ $form ] );

			// Allow callbacks on `wpformsBeforeFormSubmit` to cancel form submission by triggering `event.preventDefault()`.
			if ( event.isDefaultPrevented() ) {
				app.restoreSubmitButton( $form, $form.closest( '.wpforms-container' ) );

				return;
			}

			if ( $form.hasClass( 'wpforms-ajax-form' ) && typeof FormData !== 'undefined' ) {
				app.formSubmitAjax( $form );
			} else {
				app.formSubmitNormal( $form );
			}
		},

		/**
		 * Restore default state for the form submit button.
		 *
		 * @since 1.7.6
		 *
		 * @param {jQuery} $form      Form element.
		 * @param {jQuery} $container Form container.
		 */
		restoreSubmitButton( $form, $container ) {
			const $submit = $form.find( '.wpforms-submit' ),
				submitText = $submit.data( 'submit-text' );

			if ( submitText ) {
				$submit.text( submitText );
			}

			$submit.prop( 'disabled', false );

			WPFormsUtils.triggerEvent( $form, 'wpformsFormSubmitButtonRestore', [ $form, $submit ] );

			$container.css( 'opacity', '' );
			$form.find( '.wpforms-submit-spinner' ).hide();
		},

		/**
		 * Normal submit of a form with page reload.
		 *
		 * @since 1.5.3
		 *
		 * @param {jQuery} $form Form element.
		 */
		formSubmitNormal( $form ) {
			if ( ! $form.length ) {
				return;
			}

			const $submit = $form.find( '.wpforms-submit' ),
				recaptchaID = $submit.get( 0 ).recaptchaID;

			if ( ! app.empty( recaptchaID ) || recaptchaID === 0 ) {
				$submit.get( 0 ).recaptchaID = false;
			}

			$form.append( '<input type="hidden" name="start_timestamp" value="' + $form.data( 'start_timestamp' ) + '">' );
			$form.append( '<input type="hidden" name="end_timestamp" value="' + app.getTimestampSec() + '">' );

			$form.get( 0 ).submit();
		},

		/**
		 * Does the form have a captcha?
		 *
		 * @since 1.7.6
		 *
		 * @param {jQuery} $form Form element.
		 *
		 * @return {boolean} True when the form has a captcha.
		 */
		formHasCaptcha( $form ) {
			if ( ! $form || ! $form.length ) {
				return false;
			}

			if ( typeof hcaptcha === 'undefined' && typeof grecaptcha === 'undefined' && typeof turnstile === 'undefined' ) {
				return false;
			}

			const $captchaContainer = $form.find( '.wpforms-recaptcha-container' );

			return Boolean( $captchaContainer.length );
		},

		/**
		 * Reset form captcha.
		 *
		 * @since 1.5.3
		 * @since 1.6.4 Added hCaptcha support.
		 *
		 * @param {jQuery} $form Form element.
		 */
		resetFormRecaptcha( $form ) { // eslint-disable-line complexity
			if ( ! app.formHasCaptcha( $form ) ) {
				return;
			}

			const $captchaContainer = $form.find( '.wpforms-recaptcha-container' );
			let apiVar,
				recaptchaID;

			if ( $captchaContainer.hasClass( 'wpforms-is-hcaptcha' ) ) {
				apiVar = hcaptcha;
			} else if ( $captchaContainer.hasClass( 'wpforms-is-turnstile' ) ) {
				apiVar = turnstile;
			} else {
				apiVar = grecaptcha;
			}

			// Check for invisible recaptcha first.
			recaptchaID = $form.find( '.wpforms-submit' ).get( 0 ).recaptchaID;

			// Check for hcaptcha/recaptcha v2, if invisible recaptcha is not found.
			if ( app.empty( recaptchaID ) && recaptchaID !== 0 ) {
				recaptchaID = $form.find( '.g-recaptcha' ).data( 'recaptcha-id' );
			}

			// Reset captcha.
			if ( ! app.empty( recaptchaID ) || recaptchaID === 0 ) {
				apiVar.reset( recaptchaID );
			}
		},

		/**
		 * Console log AJAX error.
		 *
		 * @since 1.5.3
		 *
		 * @param {string} error Error text (optional).
		 */
		consoleLogAjaxError( error ) {
			if ( error ) {
				console.error( 'WPForms AJAX submit error:\n%s', error ); // eslint-disable-line no-console
			} else {
				console.error( 'WPForms AJAX submit error' ); // eslint-disable-line no-console
			}
		},

		/**
		 * Display form AJAX errors.
		 *
		 * @since 1.5.3
		 *
		 * @param {jQuery} $form  Form element.
		 * @param {Object} errors Errors in format { general: { generalErrors }, field: { fieldErrors } }.
		 */
		displayFormAjaxErrors( $form, errors ) { // eslint-disable-line complexity
			if ( 'string' === typeof errors ) {
				app.displayFormAjaxGeneralErrors( $form, errors );
				return;
			}

			errors = errors && ( 'errors' in errors ) ? errors.errors : null;

			if ( app.empty( errors ) || ( app.empty( errors.general ) && app.empty( errors.field ) ) ) {
				app.consoleLogAjaxError();
				return;
			}

			if ( ! app.empty( errors.general ) ) {
				app.displayFormAjaxGeneralErrors( $form, errors.general );
			}

			if ( ! app.empty( errors.field ) ) {
				app.displayFormAjaxFieldErrors( $form, errors.field );
			}
		},

		/**
		 * Display form AJAX general errors that cannot be displayed using jQuery Validation plugin.
		 *
		 * @since 1.5.3
		 *
		 * @param {jQuery} $form  Form element.
		 * @param {Object} errors Errors in format { errorType: errorText }.
		 */
		displayFormAjaxGeneralErrors( $form, errors ) { // eslint-disable-line complexity
			if ( ! $form || ! $form.length ) {
				return;
			}

			if ( app.empty( errors ) ) {
				return;
			}

			if ( app.isModernMarkupEnabled() ) {
				$form.attr( {
					'aria-invalid': 'true',
					'aria-errormessage': '',
				} );
			}

			// Safety net for random errors thrown by a third-party code. Should never be used intentionally.
			if ( 'string' === typeof errors ) {
				const roleAttr = app.isModernMarkupEnabled() ? ' role="alert"' : '',
					errPrefix = app.isModernMarkupEnabled() ? `<span class="wpforms-hidden">${ wpforms_settings.formErrorMessagePrefix }</span>` : '';

				$form
					.find( '.wpforms-submit-container' )
					.before( `<div class="wpforms-error-container"${ roleAttr }>${ errPrefix }${ errors }</div>` );

				app.setCurrentPage( $form, {} );

				return;
			}

			const formId = $form.data( 'formid' );

			app.printGeneralErrors( $form, errors, formId );
		},

		/**
		 * Print general errors.
		 *
		 * @since 1.8.3
		 *
		 * @param {jQuery} $form  Form element.
		 * @param {Object} errors Error Object.
		 * @param {string} formId Form ID.
		 */
		printGeneralErrors( $form, errors, formId ) {
			/**
			 * Handle header error.
			 *
			 * @since 1.8.6
			 *
			 * @param {string} html Error HTML.
			 */
			function handleHeaderError( html ) {
				$form.prepend( html );
			}

			/**
			 * Handle footer error.
			 *
			 * @since 1.8.6
			 *
			 * @param {string} html Error HTML.
			 */
			function handleFooterError( html ) {
				if ( $form.find( '.wpforms-page-indicator' ).length === 0 ) {
					$form.find( '.wpforms-submit-container' ).before( html );
				} else {
					// Check if it is a multipage form.
					// If it is a multipage form, we need error only on the first page.
					$form.find( '.wpforms-page-1' ).append( html );
				}
			}

			/**
			 * Handle reCAPTCHA error.
			 *
			 * @since 1.8.6
			 *
			 * @param {string} html Error HTML.
			 */
			function handleRecaptchaError( html ) {
				$form.find( '.wpforms-recaptcha-container' ).append( html );
			}

			$.each( errors, function( type, html ) {
				switch ( type ) {
					case 'header':
					case 'header_styled':
						handleHeaderError( html );
						break;
					case 'footer':
					case 'footer_styled':
						handleFooterError( html );
						break;
					case 'recaptcha':
						handleRecaptchaError( html );
						break;
				}

				if ( app.isModernMarkupEnabled() ) {
					const errormessage = $form.attr( 'aria-errormessage' ) || '';
					$form.attr( 'aria-errormessage', `${ errormessage } wpforms-${ formId }-${ type }-error` );
				}
			} );

			if ( $form.find( '.wpforms-error-container' ).length ) {
				app.animateScrollTop( $form.find( '.wpforms-error-container' ).first().offset().top - 100 );
			}
		},

		/**
		 * Clear forms AJAX general errors that cannot be cleared using jQuery Validation plugin.
		 *
		 * @since 1.5.3
		 *
		 * @param {jQuery} $form Form element.
		 */
		clearFormAjaxGeneralErrors( $form ) {
			$form.find( '.wpforms-error-container' ).remove();
			$form.find( '#wpforms-field_recaptcha-error' ).remove();

			// Clear form accessibility attributes.
			if ( app.isModernMarkupEnabled() ) {
				$form.attr( {
					'aria-invalid': 'false',
					'aria-errormessage': '',
				} );
			}
		},

		/**
		 * Display form AJAX field errors using jQuery Validation plugin.
		 *
		 * @since 1.5.3
		 *
		 * @param {jQuery} $form  Form element.
		 * @param {Object} errors Errors in format { fieldName: errorText }.
		 */
		displayFormAjaxFieldErrors( $form, errors ) {
			if ( ! $form || ! $form.length ) {
				return;
			}

			if ( app.empty( errors ) ) {
				return;
			}

			const validator = $form.data( 'validator' );

			if ( ! validator ) {
				return;
			}

			errors = app.splitFieldErrors( errors );

			// Set data attribute for each field with server error.
			$.each( errors, function( field, message ) {
				$( '[name="' + field + '"]', $form ).attr( 'data-server-error', message );
			} );

			validator.showErrors( errors );

			if ( ! app.formHasCaptcha( $form ) ) {
				validator.focusInvalid();
			}
		},

		/**
		 * Split field errors.
		 *
		 * @since 1.8.9
		 *
		 * @param {Object} errors Errors.
		 *
		 * @return {Object} Errors.
		 */
		splitFieldErrors: ( errors ) => {
			$.each( errors, function( field, message ) {
				if ( 'string' === typeof message ) {
					return;
				}

				// If errors an object consisting of { subfield: errorMessage }, then iterate each to display error.
				$.each( message, function( subfield, errorMessage ) {
					// Get the last part of the field (in []) and check if it is the same as subfield.
					const lastPart = field.split( '[' ).pop().replace( ']', '' );
					// Get from the `field` name all except what we caught in `lastPart`.
					const fieldNameBase = field.replace( '[' + lastPart + ']', '' );

					if ( lastPart === subfield ) {
						errors[ field ] = errorMessage;
					} else if ( 'string' === typeof subfield && isNaN( subfield ) ) {
						errors[ fieldNameBase + '[' + subfield + ']' ] = errorMessage;
					}
				} );
			} );

			return errors;
		},

		/**
		 * Submit a form using AJAX.
		 *
		 * @since 1.5.3
		 * @since 1.7.6 Allow canceling Ajax submission.
		 *
		 * @param {jQuery} $form Form element.
		 *
		 * @return {JQueryXHR|JQueryDeferred} Promise like an object for async callbacks.
		 */
		formSubmitAjax: ( $form ) => { // eslint-disable-line max-lines-per-function
			if ( ! $form.length ) {
				return $.Deferred().reject(); // eslint-disable-line new-cap
			}

			const $container = $form.closest( '.wpforms-container' ),
				$spinner = $form.find( '.wpforms-submit-spinner' );
			let $confirmationScroll;

			$container.css( 'opacity', 0.6 );
			$spinner.show();

			app.clearFormAjaxGeneralErrors( $form );

			const formData = new FormData( $form.get( 0 ) );

			formData.append( 'action', 'wpforms_submit' );
			formData.append( 'start_timestamp', $form.data( 'start_timestamp' ) );
			formData.append( 'end_timestamp', app.getTimestampSec() );

			const args = {
				type       : 'post',
				dataType   : 'json',
				url        : wpforms_settings.ajaxurl,
				data       : formData,
				cache      : false,
				contentType: false,
				processData: false,
			};

			args.success = function( json ) { // eslint-disable-line complexity
				if ( ! json ) {
					app.consoleLogAjaxError();
					return;
				}

				if ( json.data && json.data.action_required ) {
					$form.trigger( 'wpformsAjaxSubmitActionRequired', json );
					return;
				}

				if ( ! json.success ) {
					app.resetFormRecaptcha( $form );
					app.displayFormAjaxErrors( $form, json.data );
					$form.trigger( 'wpformsAjaxSubmitFailed', json );
					app.setCurrentPage( $form, json.data );
					return;
				}

				$form.trigger( 'wpformsAjaxSubmitSuccess', json );

				if ( ! json.data ) {
					return;
				}

				if ( json.data.redirect_url ) {
					const newTab = json.data.new_tab || false;
					$form.trigger( 'wpformsAjaxSubmitBeforeRedirect', json );

					if ( newTab ) {
						window.open( json.data.redirect_url, '_blank' );
						location.reload();
						return;
					}

					window.location = json.data.redirect_url;
					return;
				}

				if ( json.data.confirmation ) {
					$container.html( json.data.confirmation );
					$confirmationScroll = $container.find( 'div.wpforms-confirmation-scroll' );

					$container.trigger( 'wpformsAjaxSubmitSuccessConfirmation', json );

					if ( $confirmationScroll.length ) {
						app.animateScrollTop( $confirmationScroll.offset().top - 100 );
					}
				}
			};

			args.error = function( jqHXR, textStatus, error ) {
				app.consoleLogAjaxError( error );

				$form.trigger( 'wpformsAjaxSubmitError', [ jqHXR, textStatus, error ] );
			};

			args.complete = function( jqHXR, textStatus ) {
				/*
				 * Do not make form active if the action is required, or
				 * if the ajax request was successful and the form has a redirect.
				 */
				if (
					jqHXR.responseJSON &&
					jqHXR.responseJSON.data &&
					(
						jqHXR.responseJSON.data.action_required ||
						( textStatus === 'success' && jqHXR.responseJSON.data.redirect_url )
					)
				) {
					return;
				}

				app.restoreSubmitButton( $form, $container );

				$form.trigger( 'wpformsAjaxSubmitCompleted', [ jqHXR, textStatus ] );
			};

			const event = WPFormsUtils.triggerEvent( $form, 'wpformsAjaxBeforeSubmit', [ $form ] );

			// Allow callbacks on `wpformsAjaxBeforeSubmit` to cancel Ajax form submission by triggering `event.preventDefault()`.
			if ( event.isDefaultPrevented() ) {
				app.restoreSubmitButton( $form, $container );

				return $.Deferred().reject(); // eslint-disable-line new-cap
			}

			return $.ajax( args );
		},

		/**
		 * Display page with error for multiple page form.
		 *
		 * @since 1.7.9
		 *
		 * @param {jQuery} $form Form element.
		 * @param {Object} $json Error json.
		 */
		setCurrentPage( $form, $json ) { // eslint-disable-line complexity
			// Return for one-page forms.
			if ( $form.find( '.wpforms-page-indicator' ).length === 0 ) {
				return;
			}

			const $errorPages = [];

			$form.find( '.wpforms-page' ).each( function( index, el ) {
				if ( $( el ).find( '.wpforms-has-error' ).length >= 1 ) {
					return $errorPages.push( $( el ) );
				}
			} );

			// Do not change the page if there is a captcha error and there are no other field or footer errors.
			if (
				$errorPages.length === 0 &&
				$json.errors !== undefined &&
				$json.errors.general !== undefined &&
				$json.errors.general.footer === undefined &&
				$json.errors.general.recaptcha !== undefined
			) {
				return;
			}

			// Get the first page with error.
			const $currentPage = $errorPages.length > 0 ? $errorPages[ 0 ] : $form.find( '.wpforms-page-1' );
			const currentPage = $currentPage.data( 'page' );

			let $page,
				action = 'prev';

			// If error is on the first page, or we have general errors among others, go to the first page.
			if ( currentPage === 1 || ( $json.errors !== undefined && $json.errors.general.footer !== undefined ) ) {
				$page = $form.find( '.wpforms-page-1' ).next();
			} else {
				$page = $currentPage.next().length !== 0 ? $currentPage.next() : $currentPage.prev();
				action = $currentPage.next().length !== 0 ? 'prev' : 'next';
			}

			// Take the page from which navigate to error.
			const $nextBtn = $page.find( '.wpforms-page-next' ),
				page = $page.data( 'page' );

			// Imitate navigation to the page with error.
			app.navigateToPage( $nextBtn, action, page, $form, $( '.wpforms-page-' + page ) );
		},

		/**
		 * Scroll to position with animation.
		 *
		 * @since 1.5.3
		 *
		 * @param {number}   position Position (in pixels) to scroll to,
		 * @param {number}   duration Animation duration.
		 * @param {Function} complete Function to execute after animation is complete.
		 *
		 * @return {Promise} A promise object for async callbacks.
		 */
		animateScrollTop( position, duration, complete ) {
			duration = duration || 1000;
			complete = typeof complete === 'function' ? complete : function() {};
			return $( 'html, body' ).animate( { scrollTop: parseInt( position, 10 ) }, { duration, complete } ).promise();
		},

		/**
		 * Save tinyMCE.
		 *
		 * @since 1.7.0
		 */
		saveTinyMCE() {
			if ( typeof tinyMCE !== 'undefined' ) {
				tinyMCE.triggerSave();
			}
		},

		/**
		 * Check if an object is a function.
		 *
		 * @deprecated 1.6.7
		 *
		 * @since 1.5.8
		 *
		 * @param {any} object Object to check if it is a function.
		 *
		 * @return {boolean} True if an object is a function.
		 */
		isFunction( object ) {
			return !! ( object && object.constructor && object.call && object.apply );
		},

		/**
		 * Compare times.
		 *
		 * @since 1.7.1
		 *
		 * @param {string} time1 Time 1.
		 * @param {string} time2 Time 2.
		 *
		 * @return {boolean} True if time1 is greater than time2.
		 */
		compareTimesGreaterThan( time1, time2 ) {
			// Proper format time: add space before AM/PM, make uppercase.
			time1 = time1.replace( /(am|pm)/g, ' $1' ).toUpperCase();
			time2 = time2.replace( /(am|pm)/g, ' $1' ).toUpperCase();

			const time1Date = Date.parse( '01 Jan 2021 ' + time1 ),
				time2Date = Date.parse( '01 Jan 2021 ' + time2 );

			return time1Date >= time2Date;
		},

		/**
		 * Determine whether the modern markup setting is enabled.
		 *
		 * @since 1.8.1
		 *
		 * @return {boolean} True if modern markup is enabled.
		 */
		isModernMarkupEnabled() {
			return !! wpforms_settings.isModernMarkupEnabled;
		},

		/**
		 * Initialize token updater.
		 *
		 * Maybe update token via AJAX if it looks like outdated.
		 *
		 * @since 1.8.8
		 */
		initTokenUpdater() {
			// Attach event handler to all forms with class `wpforms-form`
			$( '.wpforms-form' ).on( 'focusin', function( event ) {
				const $form = $( event.target.closest( 'form' ) );
				const timestamp = Date.now();
				if ( ! this.needsTokenUpdate( timestamp, $form ) ) {
					return;
				}

				this.updateToken( timestamp, $form, event );
			}.bind( this ) ); // Bind `this` to maintain context inside the function
		},

		/**
		 * Check if the form needs a new token.
		 *
		 * @param {number} timestamp Timestamp.
		 * @param {jQuery} $form     Form.
		 *
		 * @return {boolean} Whether token needs update or not.
		 *
		 * @since 1.8.9
		 */
		needsTokenUpdate( timestamp, $form ) {
			const tokenTime = $form.attr( 'data-token-time' ) || 0;
			const diff = timestamp - ( tokenTime * 1000 );

			// Check if the token is expired.
			return diff >= wpforms_settings.token_cache_lifetime * 1000 && ! this.isUpdatingToken;
		},

		/**
		 * Update the token for the form.
		 *
		 * @param {number} timestamp Timestamp.
		 * @param {jQuery} $form     Form.
		 * @param {Event}  event     Event.
		 *
		 * @since 1.8.9
		 */
		updateToken( timestamp, $form, event ) {
			const formId = $form.data( 'formid' );
			const $submitBtn = $form.find( '.wpforms-submit' );

			this.isUpdatingToken = true;
			$submitBtn.prop( 'disabled', true );

			$.post( wpforms_settings.ajaxurl, {
				action: 'wpforms_get_token',
				formId,
			} ).done( function( response ) {
				if ( response.success ) {
					$form.attr( 'data-token-time', timestamp );
					$form.attr( 'data-token', response.data.token );

					// Re-enable the 'submit' button.
					$submitBtn.prop( 'disabled', false );

					// Trigger form submission if the focus was on the 'submit' button.
					if ( event.target === $submitBtn[ 0 ] ) {
						$submitBtn.trigger( 'click' );
					}
				} else {
					// eslint-disable-next-line no-console
					console.error( 'Failed to update token: ', response );
				}
			} ).fail( function( jqXHR, textStatus, errorThrown ) {
				// eslint-disable-next-line no-console
				console.error( 'AJAX request failed: ', textStatus, errorThrown );
			} ).always( function() {
				this.isUpdatingToken = false;

				// Re-enable the 'submit' button.
				$submitBtn.prop( 'disabled', false );
			}.bind( this ) );
		},

		/**
		 * Restore Submit button on Mobile.
		 *
		 * @since 1.8.9
		 */
		restoreSubmitButtonOnEventPersisted() {
			window.onpageshow = function( event ) {
				// If back/forward button has been clicked, restore submit button for all forms on the page.
				if ( event.persisted ) {
					$( '.wpforms-form' ).each( function() {
						const $form = $( this );
						app.restoreSubmitButton( $form, $form.closest( '.wpforms-container' ) );
					} );
				}
			};
		},

		/**
		 * We need separate method for loading validation groups
		 * because we may dynamically extend them.
		 *
		 * @since 1.9.2.3
		 *
		 * @param {jQuery} $context Form element or some container inside specific form.
		 */
		loadValidationGroups( $context ) {
			const validator = $context.closest( '.wpforms-form' ).data( 'validator' );

			if ( ! validator ) {
				return;
			}

			$.extend( validator.groups, app.getDateTimeValidationGroups( $context ) );
		},

		/**
		 * Return validation groups for Date / Time field with
		 * dropdown and there should only one error message for whole field.
		 *
		 * @since 1.9.2.3
		 *
		 * @param {jQuery} $context Container to search for Date/Time fields.
		 *
		 * @return {Object} Object with validation groups, e.g. {
		 * "wpforms[fields][1][date][m]": "wpforms-198-field_1",
		 * "wpforms[fields][1][date][d]": "wpforms-198-field_1"
		 * "wpforms[fields][1][date][y]": "wpforms-198-field_1",
		 * ...
		 * }
		 */
		getDateTimeValidationGroups( $context ) {
			const groups = {};

			// Create groups for the Date / Time field.
			$context.find( '.wpforms-field.wpforms-field-date-time' ).each( function() {
				const $field = $( this );

				// Bail out if the date dropdown is NOT used for this field.
				if ( ! $field.find( '.wpforms-field-date-dropdown-wrap' ).length ) {
					return;
				}

				// e.g. wpforms-198-field_1
				const groupName = $field.attr( 'id' ).replace( '-container', '' );

				$.each( [ 'month', 'day', 'year' ], function( i, subfield ) {
					const $subfield = $( `#${ groupName }-${ subfield }` );
					const subFieldName = $subfield.attr( 'name' );

					groups[ subFieldName ] = groupName;
				} );
			} );

			return groups;
		},

		/**
		 * Retrieve current timestamp in seconds.
		 *
		 * @since 1.9.2.3
		 *
		 * @return {number} Current timestamp in seconds.
		 */
		getTimestampSec() {
			return Math.floor( Date.now() / 1000 );
		},
	};

	return app;
}( document, window, jQuery ) );

// Initialize.
wpforms.init();
