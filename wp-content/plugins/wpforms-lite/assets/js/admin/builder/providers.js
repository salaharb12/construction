/* global wpforms_builder, wpforms_builder_providers, wpf */

// noinspection ES6ConvertVarToLetConst
var WPForms = window.WPForms || {}; // eslint-disable-line no-var
WPForms.Admin = WPForms.Admin || {};
WPForms.Admin.Builder = WPForms.Admin.Builder || {};

/**
 * @param wpforms_builder_providers.custom_fields_placeholder
 */

/**
 * WPForms Providers module.
 *
 * @since 1.4.7
 */
WPForms.Admin.Builder.Providers = WPForms.Admin.Builder.Providers || ( function( document, window, $ ) {
	/**
	 * Private functions and properties.
	 *
	 * @since 1.4.7
	 *
	 * @type {Object}
	 */
	const __private = {

		/**
		 * Internal cache storage.
		 * Do not use it directly, but app.cache.{(get|set|delete|clear)()} instead.
		 * Key is the provider slug, value is a Map, that will have its own key as a connection id (or not).
		 *
		 * @since 1.4.7
		 *
		 * @type {Object.<string, Map>}
		 */
		cache: {},

		/**
		 * Config contains all configuration properties.
		 *
		 * @since 1.4.7
		 *
		 * @type {Object.<string, *>}
		 */
		config: {

			/**
			 * List of default templates that should be compiled.
			 *
			 * @since 1.4.7
			 *
			 * @type {string[]}
			 */
			templates: [
				'wpforms-providers-builder-content-connection-fields',
				'wpforms-providers-builder-content-connection-conditionals',
			],
		},

		/**
		 * Form fields for the current state.
		 *
		 * @since 1.6.1.2
		 *
		 * @type {Object}
		 */
		fields: {},
	};

	/**
	 * Public functions and properties.
	 *
	 * @since 1.4.7
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Panel holder.
		 *
		 * @since 1.5.9
		 *
		 * @type {Object}
		 */
		panelHolder: {},

		/**
		 * Form holder.
		 *
		 * @since 1.4.7
		 *
		 * @type {Object}
		 */
		form: $( '#wpforms-builder-form' ),

		/**
		 * Spinner HTML.
		 *
		 * @since 1.4.7
		 *
		 * @type {Object}
		 */
		spinner: '<i class="wpforms-loading-spinner wpforms-loading-inline"></i>',

		/**
		 * All ajax requests are grouped together with own properties.
		 *
		 * @since 1.4.7
		 */
		ajax: {

			/**
			 * Merge a custom AJAX data object with defaults.
			 *
			 * @since 1.4.7
			 * @since 1.5.9 Added a new parameter - provider
			 *
			 * @param {string} provider Current provider slug.
			 * @param {Object} custom   Ajax data object with custom settings.
			 *
			 * @return {Object} Ajax data.
			 */
			_mergeData( provider, custom ) {
				const data = {
					id: app.form.data( 'id' ),
					// eslint-disable-next-line camelcase
					revision_id: app.form.data( 'revision' ),
					nonce: wpforms_builder.nonce,
					action: 'wpforms_builder_provider_ajax_' + provider,
				};

				$.extend( data, custom );

				return data;
			},

			/**
			 * Make an AJAX request. It's basically a wrapper around jQuery.ajax, but with some defaults.
			 *
			 * @since 1.4.7
			 *
			 * @param {string} provider Current provider slug.
			 * @param {*}      custom   Object of user-defined $.ajax()-compatible parameters.
			 *
			 * @return {Promise} Promise.
			 */
			request( provider, custom ) {
				const $holder = app.getProviderHolder( provider ),
					$lock = $holder.find( '.wpforms-builder-provider-connections-save-lock' ),
					$error = $holder.find( '.wpforms-builder-provider-connections-error' );

				const params = {
					url: wpforms_builder.ajax_url,
					type: 'post',
					dataType: 'json',
					beforeSend() {
						$holder.addClass( 'loading' );
						$lock.val( 1 );
						$error.hide();
					},
				};

				custom.data = app.ajax._mergeData( provider, custom.data || {} );
				$.extend( params, custom );

				// noinspection SpellCheckingInspection, JSUnusedLocalSymbols
				return $.ajax( params )
					.fail( function( jqXHR, textStatus, errorThrown ) { // eslint-disable-line no-unused-vars
						/*
						 * Right now we are logging into the browser console.
						 * In the future, that might be better.
						 */
						console.error( 'provider:', provider ); // eslint-disable-line no-console
						console.error( jqXHR ); // eslint-disable-line no-console
						console.error( textStatus ); // eslint-disable-line no-console

						$lock.val( 1 );
						$error.show();
					} )
					.always( function( dataOrjqXHR, textStatus, jqXHROrerrorThrown ) { // eslint-disable-line no-unused-vars
						$holder.removeClass( 'loading' );

						if ( 'success' === textStatus ) {
							$lock.val( 0 );

							// Update the form state when the provider data is unlocked.
							// We need to do it on the next tick to ensure that provider fields are already initialized.
							setTimeout( function() {
								wpf.savedState = wpf.getFormState( '#wpforms-builder-form' );
							}, 0 );
						}
					} );
			},
		},

		/**
		 * Temporary in-memory cache handling for all providers.
		 *
		 * @since 1.4.7
		 */
		cache: {

			/**
			 * Get the value from cache by key.
			 *
			 * @since 1.4.7
			 * @since 1.5.9 Added a new parameter - provider.
			 *
			 * @param {string} provider Current provider slug.
			 * @param {string} key      Cache key.
			 *
			 * @return {*} Null if some error occurs.
			 */
			get( provider, key ) {
				if (
					typeof __private.cache[ provider ] === 'undefined' ||
					! ( __private.cache[ provider ] instanceof Map )
				) {
					return null;
				}

				return __private.cache[ provider ].get( key );
			},

			/**
			 * Get the value from cache by key and an ID.
			 * Useful when an Object is stored under a key, and we need specific value.
			 *
			 * @since 1.4.7
			 * @since 1.5.9 Added a new parameter - provider.
			 *
			 * @param {string} provider Current provider slug.
			 * @param {string} key      Cache key.
			 * @param {string} id       Cached object ID.
			 *
			 * @return {*} Null if some error occurs.
			 */
			getById( provider, key, id ) {
				if ( typeof this.get( provider, key ) === 'undefined' || typeof this.get( provider, key )[ id ] === 'undefined' ) {
					return null;
				}

				return this.get( provider, key )[ id ];
			},

			/**
			 * Save the data to cache.
			 *
			 * @since 1.4.7
			 * @since 1.5.9 Added a new parameter - provider.
			 *
			 * @param {string} provider Current provider slug.
			 * @param {string} key      Intended to be a string, but can be everything that Map supports as a key.
			 * @param {*}      value    Data you want to save in cache.
			 *
			 * @return {Map} All the cache for the provider. IE11 returns 'undefined' for an undefined reason.
			 */
			set( provider, key, value ) {
				if (
					typeof __private.cache[ provider ] === 'undefined' ||
					! ( __private.cache[ provider ] instanceof Map )
				) {
					__private.cache[ provider ] = new Map();
				}

				return __private.cache[ provider ].set( key, value );
			},

			/**
			 * Add the data to cache to a particular key.
			 *
			 * @since 1.4.7
			 * @since 1.5.9 Added a new parameter - provider.
			 *
			 * @example app.cache.as('provider').addTo('connections', connection_id, connection);
			 *
			 * @param {string} provider Current provider slug.
			 * @param {string} key      Intended to be a string, but can be everything that Map supports as a key.
			 * @param {string} id       ID for a value that should be added to a certain key.
			 * @param {*}      value    Data you want to save in cache.
			 *
			 * @return {Map} All the cache for the provider. IE11 returns 'undefined' for an undefined reason.
			 */
			addTo( provider, key, id, value ) {
				if (
					typeof __private.cache[ provider ] === 'undefined' ||
					! ( __private.cache[ provider ] instanceof Map )
				) {
					__private.cache[ provider ] = new Map();
					this.set( provider, key, {} );
				}

				const data = this.get( provider, key );
				data[ id ] = value;

				return this.set(
					provider,
					key,
					data
				);
			},

			/**
			 * Delete the cache by key.
			 *
			 * @since 1.4.7
			 * @since 1.5.9 Added a new parameter - provider.
			 *
			 * @param {string} provider Current provider slug.
			 * @param {string} key      Cache key.
			 *
			 * @return {boolean|null} True on success, null on data holder failure, false on error.
			 */
			delete( provider, key ) {
				if (
					typeof __private.cache[ provider ] === 'undefined' ||
					! ( __private.cache[ provider ] instanceof Map )
				) {
					return null;
				}

				return __private.cache[ provider ].delete( key );
			},

			/**
			 * Delete particular data from a certain key.
			 *
			 * @since 1.4.7
			 * @since 1.5.9 Added a new parameter - provider.
			 *
			 * @example app.cache.as('provider').deleteFrom('connections', connection_id);
			 *
			 * @param {string} provider Current provider slug.
			 * @param {string} key      Intended to be a string, but can be everything that Map supports as a key.
			 * @param {string} id       ID for a value that should be deleted from a certain key.
			 *
			 * @return {Map} All the cache for the provider. IE11 returns 'undefined' for an undefined reason.
			 */
			deleteFrom( provider, key, id ) {
				if (
					typeof __private.cache[ provider ] === 'undefined' ||
					! ( __private.cache[ provider ] instanceof Map )
				) {
					return null;
				}

				const data = this.get( provider, key );

				delete data[ id ];

				return this.set(
					provider,
					key,
					data
				);
			},

			/**
			 * Clear all the cache data.
			 *
			 * @since 1.4.7
			 * @since 1.5.9 Added a new parameter - provider.
			 *
			 * @param {string} provider Current provider slug.
			 */
			clear( provider ) {
				if (
					typeof __private.cache[ provider ] === 'undefined' ||
					! ( __private.cache[ provider ] instanceof Map )
				) {
					return;
				}

				__private.cache[ provider ].clear();
			},
		},

		/**
		 * Start the engine. DOM is not ready yet, use only to init something.
		 *
		 * @since 1.4.7
		 */
		init() {
			// Do that when DOM is ready.
			$( app.ready );
		},

		/**
		 * DOM is fully loaded.
		 * Should be hooked into in addons; that need to work with DOM, templates, etc.
		 *
		 * @since 1.4.7
		 * @since 1.6.1.2 Added initialization for `__private.fields` property.
		 */
		ready() {
			// Save a current form fields state.
			__private.fields = $.extend( {}, wpf.getFields( false, true ) );

			app.panelHolder = $( '#wpforms-panel-providers, #wpforms-panel-settings' );

			app.Templates = WPForms.Admin.Builder.Templates;
			app.Templates.add( __private.config.templates );

			app.bindActions();
			app.ui.bindActions();

			app.panelHolder.trigger( 'WPForms.Admin.Builder.Providers.ready' );
		},

		/**
		 * Process all generic actions/events, mostly custom that were fired by our API.
		 *
		 * @since 1.4.7
		 * @since 1.6.1.2 Added a calling `app.updateMapSelects()` method.
		 */
		bindActions() {
			// On Form save - notify user about required fields.
			$( document ).on( 'wpformsSaved', function() {
				const $connectionBlocks = app.panelHolder.find( '.wpforms-builder-provider-connection' );

				if ( ! $connectionBlocks.length ) {
					return;
				}

				// We need to show him "Required fields empty" popup only once.
				let isShownOnce = false;

				$connectionBlocks.each( function() {
					let isRequiredEmpty = false;

					// Do actually require fields checking.
					$( this ).find( 'input.wpforms-required, select.wpforms-required, textarea.wpforms-required' ).each( function() {
						const $this = $( this ),
							value = $this.val();

						if ( _.isEmpty( value ) && ! $this.closest( '.wpforms-builder-provider-connection-block' ).hasClass( 'wpforms-hidden' ) ) {
							$( this ).addClass( 'wpforms-error' );
							isRequiredEmpty = true;

							return;
						}

						$( this ).removeClass( 'wpforms-error' );
					} );

					// Notify user.
					if ( isRequiredEmpty && ! isShownOnce ) {
						const $titleArea = $( this ).closest( '.wpforms-builder-provider' ).find( '.wpforms-builder-provider-title' ).clone();
						$titleArea.find( 'button' ).remove();
						const msg = wpforms_builder.provider_required_flds;

						$.alert( {
							title: wpforms_builder.heads_up,
							content: msg.replace( '{provider}', '<strong>' + $titleArea.text().trim() + '</strong>' ),
							icon: 'fa fa-exclamation-circle',
							type: 'red',
							buttons: {
								confirm: {
									text: wpforms_builder.ok,
									btnClass: 'btn-confirm',
									keys: [ 'enter' ],
								},
							},
						} );

						// Save that we have already showed the user, so we won't bug it anymore.
						isShownOnce = true;
					}
				} );

				// On the "Fields" page additional update provider's field mapped items.
				if ( 'fields' === wpf.getQueryString( 'view' ) ) {
					app.updateMapSelects( $connectionBlocks );
				}
			} );

			/*
			 * Update form state when each connection is loaded into the DOM.
			 * This will prevent a please-save-prompt to appear when navigating
			 * out and back to Marketing tab without doing any changes anywhere.
			 */
			app.panelHolder.on( 'connectionRendered', function() {
				if ( wpf.initialSave === true ) {
					wpf.savedState = wpf.getFormState( '#wpforms-builder-form' );
				}
			} );
		},

		/**
		 * Update selects for mapping if any form fields were added, deleted or changed.
		 *
		 * @since 1.6.1.2
		 *
		 * @param {Object} $connections jQuery selector for active connections.
		 */
		// eslint-disable-next-line max-lines-per-function,complexity
		updateMapSelects( $connections ) {
			const fields = $.extend( {}, wpf.getFields() );

			// We should detect changes for labels only.

			// noinspection JSUnusedLocalSymbols
			const currentSaveFields = _.mapObject( fields, function( field, key ) { // eslint-disable-line no-unused-vars
				return field.label;
			} );

			// noinspection JSUnusedLocalSymbols
			const prevSaveFields = _.mapObject( __private.fields, function( field, key ) { // eslint-disable-line no-unused-vars
				return field.label;
			} );

			// Check if a form has any fields and if they have changed labels after a previous saving process.
			if (
				( _.isEmpty( currentSaveFields ) && _.isEmpty( prevSaveFields ) ) ||
				( JSON.stringify( currentSaveFields ) === JSON.stringify( prevSaveFields ) )
			) {
				return;
			}

			// Prepare a current form field IDs.
			const fieldIds = Object.keys( currentSaveFields )
				.map( function( id ) {
					return parseInt( id, 10 );
				} );

			// Determine deleted field IDs - it's a diff between previous and current form state.
			const deleted = Object.keys( prevSaveFields )
				.map( function( id ) {
					return parseInt( id, 10 );
				} )
				.filter( function( id ) {
					return ! fieldIds.includes( id );
				} );

			// Remove from mapping selects "deleted" fields.
			for ( let index = 0; index < deleted.length; index++ ) {
				$( '.wpforms-builder-provider-connection-fields-table .wpforms-builder-provider-connection-field-value option[value="' + deleted[ index ] + '"]', $connections ).remove();
			}

			const options = [];
			const optionsWithSubfields = [];

			for ( const orderNumber in fields ) {
				const field = fields[ orderNumber ];
				const id = field.id;
				const label = wpf.sanitizeHTML( field.label?.toString().trim() || wpforms_builder.field + ' #' + id );

				options.push( { value: id, text: label } );

				if ( 'name' !== field.type || ! field.format ) {
					optionsWithSubfields.push( { value: id, text: label } );

					continue;
				}

				$.each( wpforms_builder.name_field_formats, function( valueSlug, formatLabel ) {
					if ( -1 !== field.format.indexOf( valueSlug ) || valueSlug === 'full' ) {
						optionsWithSubfields.push( { value: field.id + '.' + valueSlug, text: label + ' (' + formatLabel + ')' } );
					}
				} );
			}

			$( '.wpforms-builder-provider-connection-fields-table .wpforms-builder-provider-connection-field-value' ).each( function() {
				const $select = $( this );
				const value = $select.val();
				const $newSelect = $select.clone().empty();
				// Some providers have their own implementation of first/last name subfields
				// and don't have the support-subfields attribute.
				const isSupportSubfields = $select.data( 'support-subfields' ) || Boolean( $select.find( 'option[value$=".first"]' ).length );
				const newOptions = isSupportSubfields ? optionsWithSubfields : options;

				$newSelect.append( $( '<option>', {
					value: '',
					text: wpforms_builder_providers.custom_fields_placeholder,
				} ) );

				newOptions.forEach( function( option ) {
					$newSelect.append( $( '<option>', {
						value: option.value,
						text: option.text,
						selected: value.toString() === option.value.toString(),
					} ) );
				} );

				$select.replaceWith( $newSelect );
			} );

			// If selects for mapping was changed, that whole form state was changed as well.
			// That's why we need to re-save it.
			if ( wpf.savedState !== wpf.getFormState( '#wpforms-builder-form' ) ) {
				wpf.savedState = wpf.getFormState( '#wpforms-builder-form' );
			}

			// Save form fields state for the next saving process.
			__private.fields = fields;

			app.panelHolder.trigger( 'WPForms.Admin.Builder.Providers.updatedMapSelects', [ $connections, fields ] );
		},

		/**
		 * All methods that modify the UI of a page.
		 *
		 * @since 1.4.7
		 */
		ui: {

			/**
			 * Process UI related actions/events: click, change etc. - that are triggered from UI.
			 *
			 * @since 1.4.7
			 */
			bindActions() { // eslint-disable-line max-lines-per-function
				// CONNECTION: ADD/DELETE.
				app.panelHolder
					.on( 'click', '.js-wpforms-builder-provider-account-add', function( e ) {
						e.preventDefault();
						app.ui.account.setProvider( $( this ).data( 'provider' ) );
						app.ui.account.add();
					} )
					.on( 'click', '.js-wpforms-builder-provider-connection-add', function( e ) {
						e.preventDefault();
						app.ui.connectionAdd( $( this ).data( 'provider' ) );
					} )
					.on( 'click', '.js-wpforms-builder-provider-connection-delete', function( e ) {
						const $btn = $( this );

						e.preventDefault();
						app.ui.connectionDelete(
							$btn.closest( '.wpforms-builder-provider' ).data( 'provider' ),
							$btn.closest( '.wpforms-builder-provider-connection' )
						);
					} );

				// CONNECTION: FIELDS - ADD/DELETE.
				app.panelHolder
					.on( 'click', '.js-wpforms-builder-provider-connection-fields-add', function( e ) {
						e.preventDefault();

						const $table = $( this ).parents( '.wpforms-builder-provider-connection-fields-table' ),
							$clone = $table.find( 'tr' ).last().clone( true ),
							nextID = parseInt( /\[.+]\[.+]\[.+]\[(\d+)]/.exec( $clone.find( '.wpforms-builder-provider-connection-field-name' ).attr( 'name' ) )[ 1 ], 10 ) + 1;

						// Clear the row and increment the counter.
						$clone.find( '.wpforms-builder-provider-connection-field-name' )
							.attr( 'name', $clone.find( '.wpforms-builder-provider-connection-field-name' ).attr( 'name' ).replace( /\[fields_meta\]\[(\d+)\]/g, '[fields_meta][' + nextID + ']' ) )
							.val( '' );
						$clone.find( '.wpforms-builder-provider-connection-field-value' )
							.attr( 'name', $clone.find( '.wpforms-builder-provider-connection-field-value' ).attr( 'name' ).replace( /\[fields_meta\]\[(\d+)\]/g, '[fields_meta][' + nextID + ']' ) )
							.val( '' );

						// Re-enable "delete" button.
						$clone.find( '.js-wpforms-builder-provider-connection-fields-delete' ).removeClass( 'hidden' );

						// Put it back to the table.
						$table.find( 'tbody' ).append( $clone.get( 0 ) );
					} )
					.on( 'click', '.js-wpforms-builder-provider-connection-fields-delete', function( e ) {
						e.preventDefault();

						const $row = $( this ).parents( '.wpforms-builder-provider-connection-fields-table tr' );

						$row.remove();
					} );

				// CONNECTION: Generated.
				app.panelHolder.on( 'connectionGenerated', function( e, data ) {
					wpf.initTooltips();

					// Hide provider default settings screen.
					$( this )
						.find( '.wpforms-builder-provider-connection[data-connection_id="' + data.connection.id + '"]' )
						.closest( '.wpforms-panel-content-section' )
						.find( '.wpforms-builder-provider-connections-default' )
						.addClass( 'wpforms-hidden' );
				} );

				// CONNECTION: Rendered.
				app.panelHolder.on( 'connectionRendered', function( e, provider, connectionId ) {
					wpf.initTooltips();

					// Some our addons have another argument for this trigger.
					// We will fix it asap.
					if ( typeof connectionId === 'undefined' ) {
						if ( ! _.isObject( provider ) || ! _.has( provider, 'connection_id' ) ) {
							return;
						}
						connectionId = provider.connection_id;
					}

					// If connection has mapped select fields - call `wpformsFieldUpdate` trigger.
					if ( $( this ).find( '.wpforms-builder-provider-connection[data-connection_id="' + connectionId + '"] .wpforms-field-map-select' ).length ) {
						wpf.fieldUpdate();
					}
				} );

				// Remove error class in required fields if a value is supplied.
				app.panelHolder.on( 'change', '.wpforms-builder-provider select.wpforms-required', function() {
					const $this = $( this );

					if ( ! $this.hasClass( 'wpforms-error' ) || $this.val().length === 0 ) {
						return;
					}

					$this.removeClass( 'wpforms-error' );
				} );

				// Remove the checked icon near the provider title if all its connections are removed.
				app.panelHolder.on( 'connectionDeleted', function( $connection ) {
					app.ui.updateStatus( $connection );
				} );
			},

			/**
			 * Add a connection to a page.
			 * This is a multistep process, where the first step is always the same for all providers.
			 *
			 * @since 1.4.7
			 * @since 1.5.9 Added a new parameter - provider.
			 * @since 1.9.2.3 Added the ability to set default connection name.
			 *
			 * @param {string} provider Current provider slug.
			 */
			connectionAdd( provider ) {
				const providerClass = app.getProviderClass( provider ),
					defaultValue = providerClass && typeof providerClass.setDefaultModalValue === 'function' ? providerClass.setDefaultModalValue() : '';

				$.confirm( {
					title: false,
					content: wpforms_builder_providers.prompt_connection.replace( /%type%/g, 'connection' ) +
						'<input ' + ( defaultValue === '' ? ' autofocus=""' : '' ) + 'type="text" id="wpforms-builder-provider-connection-name" placeholder="' + wpforms_builder_providers.prompt_placeholder + '" value="' + defaultValue + '">' +
						'<p class="error">' + wpforms_builder_providers.error_name + '</p>',
					icon: 'fa fa-info-circle',
					type: 'blue',
					buttons: {
						confirm: {
							text: wpforms_builder.ok,
							btnClass: 'btn-confirm',
							keys: [ 'enter' ],
							action() {
								const name = this.$content.find( '#wpforms-builder-provider-connection-name' ).val().trim(),
									error = this.$content.find( '.error' );

								if ( name === '' ) {
									error.show();
									return false;
								}
								app.getProviderHolder( provider ).trigger( 'connectionCreate', [ name ] );
							},
						},
						cancel: {
							text: wpforms_builder.cancel,
						},
					},
					onContentReady() {
						// Update autofocus to be at the end of string when the default value is set.
						const input = this.$content.find( '#wpforms-builder-provider-connection-name' )[ 0 ];

						if ( defaultValue ) {
							input.setSelectionRange( defaultValue.length, defaultValue.length );
							input.focus();
						}
					},
				} );
			},

			/**
			 * What to do with UI when connection is deleted.
			 *
			 * @since 1.4.7
			 * @since 1.5.9 Added a new parameter - provider.
			 *
			 * @param {string} provider    Current provider slug.
			 * @param {Object} $connection jQuery DOM element for a connection.
			 */
			connectionDelete( provider, $connection ) {
				$.confirm( {
					title: false,
					content: wpforms_builder_providers.confirm_connection,
					icon: 'fa fa-exclamation-circle',
					type: 'orange',
					buttons: {
						confirm: {
							text: wpforms_builder.ok,
							btnClass: 'btn-confirm',
							keys: [ 'enter' ],
							action() {
								// We need this BEFORE removing, as some handlers might need a DOM element.
								app.getProviderHolder( provider ).trigger( 'connectionDelete', [ $connection ] );

								const $section = $connection.closest( '.wpforms-panel-content-section' );

								$connection.fadeOut( 'fast', function() {
									$( this ).remove();

									app.getProviderHolder( provider ).trigger( 'connectionDeleted', [ $connection ] );

									if ( ! $section.find( '.wpforms-builder-provider-connection' ).length ) {
										$section.find( '.wpforms-builder-provider-connections-default' ).removeClass( 'wpforms-hidden' );
									}
								} );
							},
						},
						cancel: {
							text: wpforms_builder.cancel,
						},
					},
				} );
			},

			/**
			 * Update the check icon of the provider in the sidebar.
			 *
			 * @since 1.9.0
			 *
			 * @param {Object} $connection jQuery DOM element for a connection.
			 */
			updateStatus( $connection ) {
				const $section = $connection.target.closest( '.wpforms-panel-content-section' ),
					$sidebarItem = $( '.wpforms-panel-sidebar-section-' + $connection.target.dataset.provider );

				$sidebarItem.find( '.fa-check-circle-o' ).toggleClass( 'wpforms-hidden', $( $section ).find( '.wpforms-builder-provider-connection' ).length <= 0 );
			},

			/**
			 * Account specific methods.
			 *
			 * @since 1.4.8
			 * @since 1.5.8 Added binding `onClose` event.
			 */
			account: {

				/**
				 * Current provider in the context of account creation.
				 *
				 * @since 1.4.8
				 *
				 * @param {string}
				 */
				provider: '',

				/**
				 * Preserve a list of action to perform when a new account creation form is submitted.
				 * Provider specific.
				 *
				 * @since 1.4.8
				 *
				 * @param {Array<string, Function>}
				 */
				submitHandlers: [],

				/**
				 * Set the account-specific provider.
				 *
				 * @since 1.4.8
				 *
				 * @param {string} provider Provider slug.
				 */
				setProvider( provider ) {
					this.provider = provider;
				},

				/**
				 * Add an account for provider.
				 *
				 * @since 1.4.8
				 */
				add() { // eslint-disable-line max-lines-per-function
					const account = this;

					// noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols
					$.confirm( {
						title: false,
						smoothContent: true,
						content() {
							const modal = this;

							return app.ajax
								.request( account.provider, {
									data: {
										task: 'account_template_get',
									},
								} )
								.done( function( response ) {
									if ( ! response.success ) {
										return;
									}

									if ( response.data.title.length ) {
										modal.setTitle( response.data.title );
									}

									if ( response.data.content.length ) {
										modal.setContent( response.data.content );
									}

									if ( response.data.type.length ) {
										modal.setType( response.data.type );
									}

									app.getProviderHolder( account.provider ).trigger( 'accountAddModal.content.done', [ modal, account.provider, response ] );
								} )
								.fail( function() {
									app.getProviderHolder( account.provider ).trigger( 'accountAddModal.content.fail', [ modal, account.provider ] );
								} )
								.always( function() {
									app.getProviderHolder( account.provider ).trigger( 'accountAddModal.content.always', [ modal, account.provider ] );
								} );
						},
						contentLoaded( data, status, xhr ) { // eslint-disable-line no-unused-vars
							const modal = this;

							// Data is already set in content.
							this.buttons.add.enable();
							this.buttons.cancel.enable();

							app.getProviderHolder( account.provider ).trigger( 'accountAddModal.contentLoaded', [ modal ] );
						},
						onOpenBefore() { // Before the modal is displayed.
							const modal = this;

							modal.buttons.add.disable();
							modal.buttons.cancel.disable();
							modal.$body.addClass( 'wpforms-providers-account-add-modal' );

							app.getProviderHolder( account.provider ).trigger( 'accountAddModal.onOpenBefore', [ modal ] );
						},
						onClose() { // Before the modal is hidden.
							// If an account was configured successfully - show a modal with adding a new connection.
							if ( true === app.ui.account.isConfigured( account.provider ) ) {
								app.ui.connectionAdd( account.provider );
							}
						},
						icon: 'fa fa-info-circle',
						type: 'blue',
						buttons: {
							add: {
								text: wpforms_builder.provider_add_new_acc_btn,
								btnClass: 'btn-confirm',
								keys: [ 'enter' ],
								action() {
									const modal = this;

									app.getProviderHolder( account.provider ).trigger( 'accountAddModal.buttons.add.action.before', [ modal ] );

									if (
										! _.isEmpty( account.provider ) &&
										typeof account.submitHandlers[ account.provider ] !== 'undefined'
									) {
										return account.submitHandlers[ account.provider ]( modal );
									}
								},
							},
							cancel: {
								text: wpforms_builder.cancel,
							},
						},
					} );
				},

				/**
				 * Register a template for Add a New Account modal window.
				 *
				 * @param {string}   provider Provider.
				 * @param {Function} handler  Handler.
				 * @since 1.4.8
				 */
				registerAddHandler( provider, handler ) {
					if ( typeof provider === 'string' && typeof handler === 'function' ) {
						this.submitHandlers[ provider ] = handler;
					}
				},

				/**
				 * Check whether the defined provider is configured or not.
				 *
				 * @since 1.5.8
				 * @since 1.5.9 Added a new parameter - provider.
				 *
				 * @param {string} provider Current provider slug.
				 *
				 * @return {boolean} Account status.
				 */
				isConfigured( provider ) {
					// Check if `Add New Account` button is hidden.
					return app.getProviderHolder( provider ).find( '.js-wpforms-builder-provider-account-add' ).hasClass( 'hidden' );
				},
			},
		},

		/**
		 * Get a jQuery DOM object, that has all the provider-related DOM inside.
		 *
		 * @param {string} provider Provider name.
		 * @since 1.4.7
		 *
		 * @return {Object} jQuery DOM element.
		 */
		getProviderHolder( provider ) {
			return $( '#' + provider + '-provider' );
		},

		/**
		 * Get a provider JS object.
		 *
		 * @since 1.9.2.3
		 *
		 * @param {string} provider Provider name.
		 *
		 * @return {Object|null} Return provider object or null.
		 */
		getProviderClass( provider ) {
			const getClassName = provider.charAt( 0 ).toUpperCase() + provider.slice( 1 );

			if ( typeof WPForms.Admin.Builder.Providers[ getClassName ] === 'undefined' ) {
				return null;
			}
			return WPForms.Admin.Builder.Providers[ getClassName ];
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

// Initialize.
WPForms.Admin.Builder.Providers.init();
