/* global wpforms_builder, wpf, jconfirm, wpforms_panel_switch, Choices, WPForms, WPFormsFormEmbedWizard, wpCookies, tinyMCE, WPFormsUtils, List, wpforms_preset_choices */

/* noinspection JSUnusedLocalSymbols */
/* eslint-disable no-unused-expressions, no-shadow */

// noinspection ES6ConvertVarToLetConst
var WPFormsBuilder = window.WPFormsBuilder || ( function( document, window, $ ) { // eslint-disable-line no-var
	let s,
		$builder;
	const elements = {},
		browser = {};

	/**
	 * Whether to show the close confirmation dialog or not.
	 *
	 * @since 1.6.0
	 *
	 * @type {boolean}
	 */
	let closeConfirmation = true;

	/**
	 * A field is adding.
	 *
	 * @since 1.7.1
	 *
	 * @type {boolean}
	 */
	let adding = false;

	// noinspection JSUnusedGlobalSymbols
	const app = {
		/* eslint-disable camelcase */

		settings: {
			spinner: '<i class="wpforms-loading-spinner"></i>',
			spinnerInline: '<i class="wpforms-loading-spinner wpforms-loading-inline"></i>',
			tinymceDefaults: {
				tinymce: { toolbar1: 'bold,italic,underline,blockquote,strikethrough,bullist,numlist,alignleft,aligncenter,alignright,undo,redo,link' },
				quicktags: true,
			},
			pagebreakTop: false,
			pagebreakBottom: false,
			upload_img_modal: false,
			choicesLimit: 20, // Choices limit for fields different from Dropdown.
			choicesLimitLong: 250, // Choices limit for Dropdown field.
		},

		/**
		 * Start the engine.
		 *
		 * @since 1.0.0
		 */
		init() {
			const that = this;

			wpforms_panel_switch = true;
			s = this.settings;

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

			$( window ).on( 'beforeunload', function() {
				if ( ! that.formIsSaved() && closeConfirmation ) {
					return wpforms_builder.are_you_sure_to_close;
				}
			} );
		},

		/**
		 * Page load.
		 *
		 * @since 1.0.0
		 * @since 1.7.9 Added `wpformsBuilderReady` hook.
		 *
		 * @return {false|void} False if default event is prevented.
		 */
		load() {
			// Trigger initial save for new forms.
			if ( wpf.getQueryString( 'newform' ) ) {
				app.formSave( false );
			}

			const panel = $( '#wpforms-panels-toggle .active' ).data( 'panel' );

			// Render form preview on the Revisions panel if the panel is active.
			if ( panel === 'revisions' ) {
				app.updateRevisionPreview();
			}

			// Allow callbacks to prevent making Form Builder ready...
			const event = WPFormsUtils.triggerEvent( $builder, 'wpformsBuilderReady' );

			// ...by triggering `event.preventDefault()`.
			if ( event.isDefaultPrevented() ) {
				return false;
			}

			// Hide loading overlay and make the Form Builder ready to use.
			app.hideLoadingOverlay();

			// Maybe display informational modal.

			// noinspection JSUnresolvedReference, EqualityComparisonWithCoercionJS
			if ( wpforms_builder.template_modal_display == '1' && 'fields' === wpf.getQueryString( 'view' ) ) { // eslint-disable-line
				$.alert( {
					title: wpforms_builder.template_modal_title,
					content: wpforms_builder.template_modal_msg,
					icon: 'fa fa-info-circle',
					type: 'blue',
					buttons: {
						confirm: {
							text: wpforms_builder.close,
							btnClass: 'btn-confirm',
							keys: [ 'enter' ],
						},
					},
				} );
			}
		},

		/**
		 * Init elements cache.
		 *
		 * @since 1.9.2
		 */
		initElementsCache() {
			// Cache builder element.
			$builder = $( '#wpforms-builder' );

			browser.isWindows = /Win/.test( navigator.userAgent );
			browser.isLinux = /Linux/.test( navigator.userAgent );
			browser.isMac = /Mac/.test( navigator.userAgent );

			// Action buttons.
			elements.$helpButton = $( '#wpforms-help' );
			elements.$previewButton = $( '#wpforms-preview-btn' );
			elements.$embedButton = $( '#wpforms-embed' );
			elements.$saveButton = $( '#wpforms-save' );
			elements.$exitButton = $( '#wpforms-exit' );

			// Cache other elements.
			elements.$noFieldsOptions = $( '#wpforms-panel-fields .wpforms-no-fields-holder .no-fields' );
			elements.$noFieldsPreview = $( '#wpforms-panel-fields .wpforms-no-fields-holder .no-fields-preview' );
			elements.$formPreview = $( '#wpforms-panel-fields .wpforms-preview-wrap' );
			elements.$revisionPreview = $( '#wpforms-panel-revisions .wpforms-panel-content' );
			elements.defaultEmailSelector = '.wpforms-field-option-email .wpforms-field-option-row-default_value input';
			elements.$defaultEmail = $( elements.defaultEmailSelector );
			elements.$focusOutTarget = null;

			elements.$nextFieldId = $( '#wpforms-field-id' );
			elements.$addFieldsTab = $( '#add-fields a' );
			elements.$fieldOptions = $( '#wpforms-field-options' );
			elements.$fieldsPreviewWrap = $( '#wpforms-panel-fields .wpforms-panel-content-wrap' );
			elements.$sortableFieldsWrap = $( '#wpforms-panel-fields .wpforms-field-wrap' );
			elements.$addFieldsButtons = $( '.wpforms-add-fields-button' ).not( '.not-draggable' ).not( '.warning-modal' ).not( '.education-modal' );
			elements.$fieldsSidebar = $( '#wpforms-panel-fields .wpforms-add-fields' );
			elements.$searchInput = $( '#wpforms-search-fields-input' );
			elements.$sidebarToggle = $( '.wpforms-panels .wpforms-panel-sidebar-content .wpforms-panel-sidebar-toggle' );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.0.0
		 */
		ready() { // eslint-disable-line max-lines-per-function
			if ( app.isVisitedViaBackButton() ) {
				location.reload();

				return;
			}

			app.initElementsCache();

			// Add `_wp_http_referer` to the data of every AJAX request.
			$.ajaxSetup( {
				data: {
					// eslint-disable-next-line camelcase
					_wp_http_referer: wpf.updateQueryString( '_wp_http_referer', null ),
				},
			} );

			// Remove Embed button if builder opened in the popup.
			if ( app.isBuilderInPopup() ) {
				elements.$embedButton.remove();
				elements.$previewButton.addClass( 'wpforms-alone' );
			}

			app.loadMsWinCSS();

			// Bind all actions.
			app.bindUIActions();

			// Setup/cache some vars not available before
			s.formID = $( '#wpforms-builder-form' ).data( 'id' );
			s.pagebreakTop = $( '.wpforms-pagebreak-top' ).length;
			s.pagebreakBottom = $( '.wpforms-pagebreak-bottom' ).length;

			// Disable implicit submission for every form inside the builder.
			// All form values are managed by JS and should not be submitted by pressing Enter.
			$builder.on( 'keypress', '#wpforms-builder-form :input:not(textarea)', function( e ) {
				if ( e.keyCode === 13 ) {
					e.preventDefault();
				}
			} );

			// If there is a section configured, display it.
			// Otherwise, we show the first panel by default.
			$( '.wpforms-panel' ).each( function( index, el ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					$configured = $this.find( '.wpforms-panel-sidebar-section.configured' ).first();

				if ( $configured.length ) {
					const section = $configured.data( 'section' );
					$configured.addClass( 'active' );
					$this.find( '.wpforms-panel-content-section-' + section ).show().addClass( 'active' );
					$this.find( '.wpforms-panel-content-section-default' ).hide();
				} else {
					$this.find( '.wpforms-panel-content-section:first-of-type' ).show().addClass( 'active' );
					$this.find( '.wpforms-panel-sidebar-section:first-of-type' ).addClass( 'active' );
				}
			} );

			app.loadEntryPreviewFields();

			// Drag and drop sortable elements.
			app.fieldChoiceSortable( 'select' );
			app.fieldChoiceSortable( 'radio' );
			app.fieldChoiceSortable( 'checkbox' );
			app.fieldChoiceSortable( 'payment-multiple' );
			app.fieldChoiceSortable( 'payment-checkbox' );
			app.fieldChoiceSortable( 'payment-select' );

			// Set field group visibility.
			$( '.wpforms-add-fields-group' ).each( function( index, el ) { // eslint-disable-line no-unused-vars
				app.fieldGroupToggle( $( this ), 'load' );
			} );

			app.registerTemplates();

			// Trim long form titles.
			app.trimFormTitle();

			// Load Tooltips.
			wpf.initTooltips();

			// Load Color Pickers.
			app.loadColorPickers();

			// Hide/Show CAPTCHA in form.
			app.captchaToggle();

			// Confirmations' initial setup.
			app.confirmationsSetup();

			// Notification settings.
			app.notificationToggle();
			app.notificationsByStatusAlerts();
			app.notificationsUpdateElementsVisibility();

			// Secret builder hotkeys.
			app.builderHotkeys();

			// jquery-confirm defaults.
			jconfirm.defaults = {
				closeIcon: false,
				backgroundDismiss: false,
				escapeKey: true,
				animationBounce: 1,
				useBootstrap: false,
				theme: 'modern',
				boxWidth: '400px',
				animateFromElement: false,
				content: wpforms_builder.something_went_wrong,
			};

			app.dropdownField.init();

			app.iconChoices.init();

			app.checkEmptyDynamicChoices();

			app.initSomeFieldOptions();

			app.dismissNotice();

			wpf.initializeChoicesEventHandlers();
		},

		checkEmptyDynamicChoices() {
			const choices = wpf.orders.choices || {};

			if ( ! Object.keys( choices ).length ) {
				return;
			}

			wpf.orders.fields.forEach( function( fieldId ) { // eslint-disable-line complexity
				const isDynamic = app.dropdownField.helpers.isDynamicChoices( fieldId );

				if ( ! isDynamic ) {
					return;
				}

				const $fieldPreview = $( '#wpforms-field-' + fieldId );
				const type = app.dropdownField.helpers.getDynamicChoicesOptionType( fieldId );
				const source = app.dropdownField.helpers.getDynamicChoicesOptionSource( fieldId );
				const isModern = app.dropdownField.helpers.isDynamicChoicesOptionModern( fieldId );
				let isEmpty = isModern
					? $fieldPreview.find( '.has-no-choices' ).length
					: $fieldPreview.find( '.primary-input option:not(.placeholder), .primary-input li' ).length === 0;

				if ( isModern && ! isEmpty ) {
					const placeholder = $( '#wpforms-field-option-' + fieldId + '-placeholder' ).val();
					const choices = app.dropdownField.helpers.getInitialChoices( fieldId );
					isEmpty = choices.length === 1 && choices[ 0 ].label === placeholder && choices[ 0 ].placeholder === true;
				}

				if ( isEmpty ) {
					app.emptyChoicesNotice( fieldId, source, type );
				}
			} );
		},

		/**
		 * Load Microsoft Windows specific stylesheet.
		 *
		 * @since 1.6.8
		 */
		loadMsWinCSS() {
			// Detect OS & browsers.
			if ( browser.isMac ) {
				return;
			}

			$( '<link>' )
				.appendTo( 'head' )
				.attr( {
					type: 'text/css',
					rel: 'stylesheet',
					href: wpforms_builder.scrollbars_css_url,
				} );
		},

		/**
		 * Builder was visited via back button in the browser.
		 *
		 * @since 1.6.5
		 *
		 * @return {boolean} True if the builder was visited via back button in browser.
		 */
		isVisitedViaBackButton() {
			if ( ! performance ) {
				return false;
			}

			let isVisitedViaBackButton = false;

			performance.getEntriesByType( 'navigation' ).forEach( function( nav ) {
				if ( nav.type === 'back_forward' ) {
					isVisitedViaBackButton = true;
				}
			} );

			return isVisitedViaBackButton;
		},

		/**
		 * Remove loading overlay.
		 *
		 * @since 1.6.8
		 */
		hideLoadingOverlay() {
			const $overlay = $( '#wpforms-builder-overlay' );

			$overlay.addClass( 'fade-out' );

			setTimeout( function() {
				$overlay.hide();
			}, 250 );
		},

		/**
		 * Show loading overlay.
		 *
		 * @since 1.6.8
		 */
		showLoadingOverlay() {
			const $overlay = $( '#wpforms-builder-overlay' );

			$overlay.removeClass( 'fade-out' );
			$overlay.show();
		},

		/**
		 * Initialize some fields options controls.
		 *
		 * @since 1.6.3
		 */
		initSomeFieldOptions() {
			// Show a toggled options groups.
			app.toggleAllOptionGroups( $builder );

			// Date/Time field Date type option.
			$builder.find( '.wpforms-field-option-row-date .type select' ).trigger( 'change' );
		},

		/**
		 * Dropdown field component.
		 *
		 * @since 1.6.1
		 */
		dropdownField: {

			/**
			 * Field configuration.
			 *
			 * @since 1.6.1
			 */
			config: {
				modernClass: 'choicesjs-select',
				args: {
					searchEnabled: false,
					searchChoices: false,
					renderChoiceLimit: 1,
					shouldSort: false,
					callbackOnInit() {
						const $element = $( this.containerOuter.element ),
							$previewSelect = $element.closest( '.wpforms-field' ).find( 'select' );

						// Turn off disabled styles.
						if ( $element.hasClass( 'is-disabled' ) ) {
							$element.removeClass( 'is-disabled' );
						}

						// Disable instances on the preview panel.
						if ( $previewSelect.is( '[readonly]' ) ) {
							this.disable();
							$previewSelect.prop( 'disabled', false );
						}

						if ( this.passedElement.element.multiple ) {
							// Hide a placeholder if field has selected choices.
							if ( this.getValue( true ).length ) {
								$( this.input.element ).addClass( 'choices__input--hidden' );
							}
						}

						// Decode allowed HTML entities for choices.
						$element.find( '.choices__item--selectable' ).each( function() {
							const $choice = $( this );
							const text = wpf.decodeAllowedHTMLEntities( $choice.text() );

							$choice.text( text );
						} );
					},
				},
			},

			/**
			 * Initialization for field component.
			 *
			 * @since 1.6.1
			 */
			init() {
				// Choices.js init.
				$builder.find( '.' + app.dropdownField.config.modernClass ).each( function() {
					app.dropdownField.events.choicesInit( $( this ) );
				} );

				// Multiple option.
				$builder.on(
					'change',
					'.wpforms-field-option-select .wpforms-field-option-row-multiple input',
					app.dropdownField.events.multiple
				);

				// Style option.
				$builder.on(
					'change',
					'.wpforms-field-option-select .wpforms-field-option-row-style select, .wpforms-field-option-payment-select .wpforms-field-option-row-style select',
					app.dropdownField.events.applyStyle
				);

				// Add the ability to close the drop-down menu.
				$builder.on( 'click', '.choices', function( e ) {
					const $choices = $( this ),
						choicesObj = $choices.find( 'select' ).data( 'choicesjs' );

					if (
						choicesObj &&
						$choices.hasClass( 'is-open' ) &&
						e.target.classList.contains( 'choices__inner' )
					) {
						choicesObj.hideDropdown();
					}
				} );
			},

			/**
			 * Field events.
			 *
			 * @since 1.6.1
			 */
			events: {

				/**
				 * Load Choices.js library.
				 *
				 * @since 1.6.1
				 *
				 * @param {Object} $element jQuery element selector.
				 */
				choicesInit( $element ) {
					const useAjax = $element.data( 'choicesjs-use-ajax' ) === 1;
					let instance;

					if ( $element.data( 'choicesjs-callback-fn' ) === 'select_pages' ) {
						instance = WPForms.Admin.Builder.WPFormsChoicesJS.setup(
							$element[ 0 ],
							app.dropdownField.config.args,
							{
								action: 'wpforms_ajax_search_pages_for_dropdown',
								nonce: useAjax ? wpforms_builder.nonce : null,
							}
						);
					} else {
						instance = new Choices( $element[ 0 ], app.dropdownField.config.args );
					}

					app.dropdownField.helpers.setInstance( $element, instance );
					app.dropdownField.helpers.addPlaceholderChoice( $element, instance );

					$element.closest( '.choices' ).toggleClass( 'wpforms-hidden', ! instance.config.choices.length );
				},

				/**
				 * Multiple option callback.
				 *
				 * @since 1.6.1
				 *
				 * @param {Object} event Event object.
				 */
				multiple( event ) {
					const fieldId = $( this ).closest( '.wpforms-field-option-row-multiple' ).data().fieldId,
						$primary = app.dropdownField.helpers.getPrimarySelector( fieldId ),
						$optionChoicesItems = $( '#wpforms-field-option-row-' + fieldId + '-choices input.default' ),
						$placeholder = $primary.find( '.placeholder' ),
						isDynamicChoices = app.dropdownField.helpers.isDynamicChoices( fieldId ),
						isMultiple = event.target.checked,
						choicesType = isMultiple ? 'checkbox' : 'radio';

					// Add/remove a `multiple` attribute.
					$primary.prop( 'multiple', isMultiple );

					// Change a `Choices` fields type:
					//    checkbox - needed for multiple selection
					//    radio - needed for single selection
					$optionChoicesItems.prop( 'type', choicesType );

					// Dynamic Choices doesn't have default choices (selected options) - make all as unselected.
					if ( isDynamicChoices ) {
						$primary.find( 'option:selected' ).prop( 'selected', false );
					}

					// Gets default choices.
					const selectedChoices = $optionChoicesItems.filter( ':checked' );

					if ( ! isMultiple && selectedChoices.length ) {
						// Uncheck all choices.
						$optionChoicesItems.prop( 'checked', false );

						// For single selection, we can choose only one.
						$( selectedChoices.get( 0 ) ).prop( 'checked', true );
					}

					// Toggle selection for a placeholder option based on a select type.
					if ( $placeholder.length ) {
						$placeholder.prop( 'selected', ! isMultiple );
					}

					// Update a primary field.
					app.dropdownField.helpers.update( fieldId, isDynamicChoices );
				},

				/**
				 * Apply a style to <select> - modern or classic.
				 *
				 * @since 1.6.1
				 */
				applyStyle() {
					const $field = $( this ),
						fieldId = $field.closest( '.wpforms-field-option-row-style' ).data().fieldId,
						fieldVal = $field.val();

					if ( 'modern' === fieldVal ) {
						app.dropdownField.helpers.convertClassicToModern( fieldId );
					} else {
						app.dropdownField.helpers.convertModernToClassic( fieldId );
					}
				},
			},

			helpers: {

				/**
				 * Get Modern select options and prepare them for the Classic <select>.
				 *
				 * @since 1.6.1
				 *
				 * @param {string} fieldId Field ID.
				 */
				convertModernToClassic: ( fieldId ) => {
					const $primary = app.dropdownField.helpers.getPrimarySelector( fieldId ),
						isDynamicChoices = app.dropdownField.helpers.isDynamicChoices( fieldId ),
						instance = app.dropdownField.helpers.getInstance( $primary ),
						$sidebarChoices = $( '#wpforms-field-option-row-' + fieldId + '-choices' ),
						$sidebarList = $sidebarChoices.find( '.choices-list' ),
						elementsCount = $sidebarList.find( 'li' ).length;

					if ( instance && typeof instance.destroy === 'function' ) {
						// Destroy the instance of Choices.js.
						instance.destroy();

						// Update a placeholder.
						app.dropdownField.helpers.updatePlaceholderChoice( instance, fieldId );
					}

					// Update choices.
					if ( ! isDynamicChoices ) {
						app.fieldChoiceUpdate( 'select', fieldId, elementsCount );
					}
				},

				/**
				 * Get initial choices.
				 *
				 * @since 1.8.2
				 *
				 * @param {string} fieldId Field ID.
				 *
				 * @return {Object} Choices.
				 */
				getInitialChoices( fieldId ) {
					const $primary = app.dropdownField.helpers.getPrimarySelector( fieldId ),
						instance = app.dropdownField.helpers.getInstance( $primary );

					return instance.config.choices;
				},

				/**
				 * Convert a Classic to Modern style selector.
				 *
				 * @since 1.6.1
				 *
				 * @param {string} fieldId Field ID.
				 */
				convertClassicToModern( fieldId ) {
					const $primary = app.dropdownField.helpers.getPrimarySelector( fieldId ),
						isDynamicChoices = app.dropdownField.helpers.isDynamicChoices( fieldId );

					// Update choices.
					if ( ! isDynamicChoices ) {
						app.fieldChoiceUpdate( 'select', fieldId );
					}

					// Call a Choices.js initialization.
					app.dropdownField.events.choicesInit( $primary );
				},

				/**
				 * Update a primary field.
				 *
				 * @since 1.6.1
				 *
				 * @param {string}  fieldId          Field ID.
				 * @param {boolean} isDynamicChoices True if `Dynamic Choices` is turned on.
				 */
				update( fieldId, isDynamicChoices ) {
					const $primary = app.dropdownField.helpers.getPrimarySelector( fieldId );

					if ( app.dropdownField.helpers.isModernSelect( $primary ) ) {
						// If we had a `Modern` select before, then we need to make re-init - destroy() + init().
						app.dropdownField.helpers.convertModernToClassic( fieldId );

						if ( ! isDynamicChoices ) {
							app.dropdownField.events.choicesInit( $primary );
						}
					} else if ( ! isDynamicChoices ) {
						// Update choices.
						app.fieldChoiceUpdate( 'select', fieldId );
					}
				},

				/**
				 * Add a new choice to behave like a placeholder.
				 *
				 * @since 1.6.1
				 *
				 * @param {Object} $jquerySelector jQuery primary selector.
				 * @param {Object} instance        The instance of Choices.js.
				 *
				 * @return {boolean} False if a fake placeholder wasn't added.
				 */
				addPlaceholderChoice( $jquerySelector, instance ) { // eslint-disable-line complexity
					const wpFormsField = $jquerySelector.closest( '.wpforms-field' );
					if ( wpFormsField.length <= 0 ) {
						return false;
					}

					const fieldId = wpFormsField.data().fieldId;
					let hasDefaults = app.dropdownField.helpers.hasDefaults( fieldId );

					if ( app.dropdownField.helpers.isDynamicChoices( fieldId ) ) {
						hasDefaults = false;
					}

					// Already has a placeholder.
					if ( false !== app.dropdownField.helpers.searchPlaceholderChoice( instance ) ) {
						return false;
					}

					// No choices.
					if ( ! instance.config.choices.length ) {
						return false;
					}

					const placeholder = wpf.decodeAllowedHTMLEntities( instance.config.choices[ 0 ].label ),
						isMultiple = $( instance.passedElement.element ).prop( 'multiple' ),
						selected = ! ( isMultiple || hasDefaults );

					// Add a new choice as a placeholder.
					instance.setChoices(
						[
							{ value: '', label: placeholder, selected, placeholder: true },
						],
						'value',
						'label',
						false
					);

					// Additional case for multiple select.
					if ( isMultiple ) {
						$( instance.input.element ).prop( 'placeholder', placeholder );
					}

					return true;
				},

				/**
				 * Search a choice-placeholder item.
				 *
				 * @since 1.6.1
				 *
				 * @param {Object} instance The instance of Choices.js.
				 *
				 * @return {boolean|object} False if a field doesn't have a choice-placeholder.
				 * Otherwise - return choice item.
				 */
				searchPlaceholderChoice( instance ) {
					let find = false;

					instance.config.choices.forEach( function( item, i, choices ) { // eslint-disable-line no-unused-vars
						if ( 'undefined' !== typeof item.placeholder && true === item.placeholder ) {
							find = {
								key: i,
								item,
							};

							return false;
						}
					} );

					return find;
				},

				/**
				 * Add/update a placeholder.
				 *
				 * @since 1.6.1
				 *
				 * @param {Object} instance The instance of Choices.js.
				 * @param {string} fieldId  Field ID.
				 */
				updatePlaceholderChoice( instance, fieldId ) {
					const $primary = $( instance.passedElement.element ),
						placeholderValue = wpf.sanitizeHTML( $( '#wpforms-field-option-' + fieldId + '-placeholder' ).val() ),
						placeholderChoice = app.dropdownField.helpers.searchPlaceholderChoice( instance );
					let	$placeholderOption = {};

					// Get an option with placeholder.
					// Note: `.placeholder` class is skipped when calling Choices.js destroy() method.
					if ( 'object' === typeof placeholderChoice ) {
						$placeholderOption = $( $primary.find( 'option' ).get( placeholderChoice.key ) );
					}

					// We have a placeholder and need to update the UI with it.
					if ( '' !== placeholderValue ) {
						if ( ! $.isEmptyObject( $placeholderOption ) && $placeholderOption.length ) {
							// Update a placeholder option.
							$placeholderOption
								.addClass( 'placeholder' )
								.text( placeholderValue );
						} else {
							// Add a placeholder option.
							$primary.prepend( '<option value="" class="placeholder">' + placeholderValue + '</option>' );
						}
					} else if ( $placeholderOption.length ) {
						// Remove the placeholder as it's empty.
						$placeholderOption.remove();
					}
				},

				/**
				 * Is it a `Modern` style dropdown field?
				 *
				 * @since 1.6.1
				 *
				 * @param {Object} $jquerySelector jQuery primary selector.
				 *
				 * @return {boolean} True if it's a `Modern` style select, false otherwise.
				 */
				isModernSelect( $jquerySelector ) {
					const instance = app.dropdownField.helpers.getInstance( $jquerySelector );

					if ( 'object' !== typeof instance ) {
						return false;
					}

					if ( $.isEmptyObject( instance ) ) {
						return false;
					}

					return instance.initialised;
				},

				/**
				 * Save an instance of Choices.js.
				 *
				 * @since 1.6.1
				 *
				 * @param {Object} $jquerySelector jQuery primary selector.
				 * @param {Object} instance        The instance of Choices.js.
				 */
				setInstance( $jquerySelector, instance ) {
					$jquerySelector.data( 'choicesjs', instance );
				},

				/**
				 * Retrieve an instance of Choices.js.
				 *
				 * @since 1.6.1
				 *
				 * @param {Object} $jquerySelector jQuery primary selector.
				 *
				 * @return {Object} The instance of Choices.js.
				 */
				getInstance( $jquerySelector ) {
					return $jquerySelector.data( 'choicesjs' );
				},

				/**
				 * Get Dynamic Choices option field.
				 *
				 * @since 1.8.2
				 *
				 * @param {string|number} fieldId Field ID.
				 *
				 * @return {HTMLElement|boolean} False if a field doesn't have a `Dynamic Choices` option.
				 * Otherwise - return option field.
				 */
				getDynamicChoicesOption( fieldId ) {
					const $fieldOption = $( '#wpforms-field-option-' + fieldId + '-dynamic_choices' );

					if ( ! $fieldOption.length ) {
						return false;
					}

					return $fieldOption;
				},

				/**
				 * Is `Dynamic Choices` used?
				 *
				 * @since 1.6.1
				 *
				 * @param {string|number} fieldId Field ID.
				 *
				 * @return {boolean} True if a `Dynamic Choices` active, false otherwise.
				 */
				isDynamicChoices( fieldId ) {
					const $fieldOption = app.dropdownField.helpers.getDynamicChoicesOption( fieldId );

					if ( ! $fieldOption.length ) {
						return false;
					}

					return '' !== $fieldOption.val();
				},

				/**
				 * Is `Dynamic Choices` option type is `Modern`?
				 *
				 * @since 1.8.2
				 *
				 * @param {string|number} fieldId Field ID.
				 * @return {boolean} True if a `Dynamic Choices` option type is `Modern`, false otherwise.
				 */
				isDynamicChoicesOptionModern( fieldId ) {
					const $fieldOption = $( '#wpforms-field-option-' + fieldId + '-style' );

					if ( ! $fieldOption.length ) {
						return false;
					}

					return $fieldOption.val() === 'modern';
				},

				/**
				 * Get a Dynamic Choices option type.
				 *
				 * @since 1.8.2
				 *
				 * @param {string|number} fieldId Field ID.
				 *
				 * @return {string|boolean} False if a field doesn't have a `Dynamic Choices` option.
				 * Otherwise - return option type.
				 */
				getDynamicChoicesOptionType( fieldId ) {
					const $fieldOption = app.dropdownField.helpers.getDynamicChoicesOption( fieldId );

					if ( ! $fieldOption.length ) {
						return false;
					}

					return $fieldOption.val();
				},

				/**
				 * Get a Dynamic Choices option source.
				 *
				 * @since 1.8.2
				 *
				 * @param {string|number} fieldId Field ID.
				 *
				 * @return {string|boolean} False if a field doesn't have a `Dynamic Choices` option.
				 * Otherwise - return option source.
				 */
				getDynamicChoicesOptionSource( fieldId ) {
					const type = app.dropdownField.helpers.getDynamicChoicesOptionType( fieldId );
					const $fieldOption = $( '#wpforms-field-option-' + fieldId + '-dynamic_' + type );

					if ( ! $fieldOption.length ) {
						return false;
					}

					return $fieldOption.find( 'option:selected' ).text();
				},

				/**
				 * Is a field having default choices?
				 *
				 * @since 1.6.1
				 *
				 * @param {string} fieldId Field ID.
				 *
				 * @return {boolean} True if a field has default choices.
				 */
				hasDefaults( fieldId ) {
					const $choicesList = $( '#wpforms-field-option-row-' + fieldId + '-choices .choices-list' );

					return !! $choicesList.find( 'input.default:checked' ).length;
				},

				/**
				 * Retrieve a jQuery selector for the Primary field.
				 *
				 * @since 1.6.1
				 *
				 * @param {string} fieldId Field ID.
				 *
				 * @return {Object} jQuery primary selector.
				 */
				getPrimarySelector( fieldId ) {
					return $( '#wpforms-field-' + fieldId + ' .primary-input' );
				},
			},
		},

		/**
		 * Add number slider events listeners.
		 *
		 * @since 1.5.7
		 *
		 * @param {Object} $builder JQuery object.
		 */
		numberSliderEvents( $builder ) {
			// Minimum update.
			$builder.on(
				'focusout',
				'.wpforms-field-option-row-min_max .wpforms-input-row .wpforms-number-slider-min',
				app.fieldNumberSliderUpdateMin
			);

			// Maximum update.
			$builder.on(
				'focusout',
				'.wpforms-field-option-row-min_max .wpforms-input-row .wpforms-number-slider-max',
				app.fieldNumberSliderUpdateMax
			);

			// Change default input value.
			$builder.on(
				'input',
				'.wpforms-number-slider-default-value',
				_.debounce( app.changeNumberSliderDefaultValue, 500 )
			);

			// Trigger input event on default value input to check if it's valid.
			$builder.find( '.wpforms-number-slider-default-value' ).trigger( 'input' );

			// Change step value.
			$builder.on(
				'input',
				'.wpforms-number-slider-step',
				_.debounce( app.changeNumberSliderStep, 500 )
			);

			// Check step value.
			$builder.on(
				'focusout',
				'.wpforms-number-slider-step',
				app.checkNumberSliderStep
			);

			// Change value display.
			$builder.on(
				'input',
				'.wpforms-number-slider-value-display',
				_.debounce( app.changeNumberSliderValueDisplay, 500 )
			);

			// Change min value.
			$builder.on(
				'input',
				'.wpforms-number-slider-min',
				_.debounce( app.changeNumberSliderMin, 500 )
			);

			// Change max value.
			$builder.on(
				'input',
				'.wpforms-number-slider-max',
				_.debounce( app.changeNumberSliderMax, 500 )
			);
		},

		/**
		 * Change number slider min option.
		 *
		 * @since 1.5.7
		 *
		 * @param {Object} event Input event.
		 */
		changeNumberSliderMin( event ) {
			const value = parseFloat( event.target.value );

			if ( isNaN( value ) ) {
				return;
			}

			const fieldID = $( event.target ).parents( '.wpforms-field-option-row' ).data( 'fieldId' );

			app.updateNumberSliderDefaultValueAttr( fieldID, event.target.value, 'min' );
		},

		/**
		 * Change number slider max option.
		 *
		 * @since 1.5.7
		 *
		 * @param {Object} event Input event.
		 */
		changeNumberSliderMax( event ) {
			const value = parseFloat( event.target.value );

			if ( isNaN( value ) ) {
				return;
			}

			const fieldID = $( event.target ).parents( '.wpforms-field-option-row' ).data( 'fieldId' );

			app.updateNumberSliderDefaultValueAttr( fieldID, event.target.value, 'max' )
				.updateNumberSliderStepValueMaxAttr( fieldID, event.target.value );
		},

		/**
		 * Change number slider value display option.
		 *
		 * @since 1.5.7
		 *
		 * @param {Object} event Input event.
		 */
		changeNumberSliderValueDisplay( event ) {
			const str = event.target.value;
			const fieldID = $( event.target ).parents( '.wpforms-field-option-row' ).data( 'fieldId' );
			const defaultValue = document.getElementById( 'wpforms-field-option-' + fieldID + '-default_value' );

			if ( defaultValue ) {
				app.updateNumberSliderHintStr( fieldID, str )
					.updateNumberSliderHint( fieldID, defaultValue.value );
			}
		},

		/**
		 * Change number slider step option.
		 *
		 * @since 1.5.7
		 *
		 * @param {Object} event Input event.
		 */
		changeNumberSliderStep( event ) {
			const value = parseFloat( event.target.value );

			if ( isNaN( value ) ) {
				return;
			}

			if ( value <= 0 ) {
				return;
			}

			const max = parseFloat( event.target.max );

			if ( value > max ) {
				event.target.value = max;

				return;
			}

			const min = parseFloat( event.target.min );

			if ( value < min ) {
				event.target.value = min;

				return;
			}

			const fieldID = $( event.target ).parents( '.wpforms-field-option-row' ).data( 'fieldId' );
			const defaultValue = $( '#wpforms-field-option-' + fieldID + '-default_value' ).val();

			app.checkMultiplicitySliderDefaultValue( fieldID, defaultValue, value )
				.updateNumberSliderAttr( fieldID, value, 'step' )
				.updateNumberSliderDefaultValueAttr( fieldID, value, 'step' );
		},

		/**
		 * Check multiplicity of a slider default value.
		 *
		 * @since 1.8.4
		 *
		 * @param {string} fieldId Field ID.
		 * @param {number} value   Default value.
		 * @param {number} step    Step value.
		 *
		 * @return {Object} App instance.
		 */
		checkMultiplicitySliderDefaultValue( fieldId, value, step ) {
			const $printSelector = $( `#wpforms-field-option-row-${ fieldId }-default_value` );

			if ( value % step !== 0 ) {
				const message = wpforms_builder.number_slider_error_valid_default_value;
				const closestSmallerMultiple = Math.floor( value / step ) * step;
				const closestLargerMultiple = Math.ceil( value / step ) * step;

				const updatedMessage = message.replace( '{from}', closestSmallerMultiple ).replace( '{to}', closestLargerMultiple );

				app.printNotice( updatedMessage, $printSelector );
			} else {
				app.removeNotice( $printSelector );
			}

			return this;
		},

		/**
		 * Print a notice.
		 *
		 * @since 1.8.4
		 *
		 * @param {string} message        Message to print.
		 * @param {Object} $printSelector jQuery element selector.
		 */
		printNotice( message, $printSelector ) {
			if ( $printSelector.length ) {
				this.removeNotice( $printSelector );
				$printSelector.append( `<div class="wpforms-alert-warning wpforms-alert"><p>${ message }</p></div>` );
			}
		},

		/**
		 * Remove a notice.
		 *
		 * @since 1.8.4
		 *
		 * @param {Object} $printSelector jQuery element selector.
		 */
		removeNotice( $printSelector ) {
			if ( $printSelector.length && $printSelector.find( '.wpforms-alert' ).length ) {
				$printSelector.find( '.wpforms-alert' ).remove();
			}
		},

		/**
		 * Check the number slider step option.
		 *
		 * @since 1.6.2.3
		 *
		 * @param {Object} event Focusout event object.
		 */
		checkNumberSliderStep( event ) {
			const value = parseFloat( event.target.value );

			if ( ! isNaN( value ) && value > 0 ) {
				return;
			}

			const $input = $( this );

			$.confirm( {
				title: wpforms_builder.heads_up,
				content: wpforms_builder.error_number_slider_increment,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							$input.val( '' ).trigger( 'focus' );
						},
					},
				},
			} );
		},

		/**
		 * Change number slider default value option.
		 *
		 * @since 1.5.7
		 *
		 * @param {Object} event Input event.
		 */
		changeNumberSliderDefaultValue( event ) {
			const value = parseFloat( event.target.value );

			if ( ! isNaN( value ) ) {
				const max = parseFloat( event.target.max );

				if ( value > max ) {
					event.target.value = max;

					return;
				}

				const min = parseFloat( event.target.min );

				if ( value < min ) {
					event.target.value = min;

					return;
				}

				const step = parseFloat( event.target.step );
				const fieldID = $( event.target ).parents( '.wpforms-field-option-row-default_value' ).data( 'fieldId' );

				app.checkMultiplicitySliderDefaultValue( fieldID, value, step )
					.updateNumberSlider( fieldID, value )
					.updateNumberSliderHint( fieldID, value );
			}
		},

		/**
		 * Update number slider default value attribute.
		 *
		 * @since 1.5.7
		 *
		 * @param {number} fieldID  Field ID.
		 * @param {*}      newValue Default value attribute.
		 * @param {*}      attr     Attribute name.
		 *
		 * @return {Object} App instance.
		 */
		updateNumberSliderDefaultValueAttr( fieldID, newValue, attr ) {
			const input = document.getElementById( 'wpforms-field-option-' + fieldID + '-default_value' );

			if ( input ) {
				const value = parseFloat( input.value );

				input.setAttribute( attr, newValue );
				newValue = parseFloat( newValue );

				if ( 'max' === attr && value > newValue ) {
					input.value = newValue;
					$( input ).trigger( 'input' );
				}

				if ( 'min' === attr && value < newValue ) {
					input.value = newValue;
					$( input ).trigger( 'input' );
				}
			}

			return this;
		},

		/**
		 * Update number slider value.
		 *
		 * @since 1.5.7
		 *
		 * @param {number} fieldID Field ID.
		 * @param {string} value   Number slider value.
		 *
		 * @return {Object} App instance.
		 */
		updateNumberSlider( fieldID, value ) {
			const numberSlider = document.getElementById( 'wpforms-number-slider-' + fieldID );

			if ( numberSlider ) {
				numberSlider.value = value;
			}

			return this;
		},

		/**
		 * Update number slider attribute.
		 *
		 * @since 1.5.7
		 *
		 * @param {number} fieldID Field ID.
		 * @param {any}    value   Attribute value.
		 * @param {*}      attr    Attribute name.
		 *
		 * @return {Object} App instance.
		 */
		updateNumberSliderAttr( fieldID, value, attr ) {
			const numberSlider = document.getElementById( 'wpforms-number-slider-' + fieldID );

			if ( numberSlider ) {
				numberSlider.setAttribute( attr, value );
			}

			return this;
		},

		/**
		 * Update number slider hint string.
		 *
		 * @since 1.5.7
		 *
		 * @param {number} fieldID Field ID.
		 * @param {string} str     Hint string.
		 *
		 * @return {Object} App instance.
		 */
		updateNumberSliderHintStr( fieldID, str ) {
			const hint = document.getElementById( 'wpforms-number-slider-hint-' + fieldID );

			if ( hint ) {
				hint.dataset.hint = str;
			}

			return this;
		},

		/**
		 * Update number slider Hint value.
		 *
		 * @since 1.5.7
		 *
		 * @param {number} fieldID Field ID.
		 * @param {string} value   Hint value.
		 *
		 * @return {Object} App instance.
		 */
		updateNumberSliderHint( fieldID, value ) {
			const hint = document.getElementById( 'wpforms-number-slider-hint-' + fieldID );

			if ( hint ) {
				hint.innerHTML = wpf.sanitizeHTML( hint.dataset.hint ).replaceAll( '{value}', '<b>' + value + '</b>' );
			}

			return this;
		},

		/**
		 * Update min attribute.
		 *
		 * @since 1.5.7
		 *
		 * @param {Object} event Input event.
		 */
		fieldNumberSliderUpdateMin( event ) {
			const current = parseFloat( event.target.value );

			if ( isNaN( current ) ) {
				return;
			}

			const $options = $( event.target ).parents( '.wpforms-field-option-row-min_max' );
			const max = parseFloat( $options.find( '.wpforms-number-slider-max' ).val() );

			if ( max <= current ) {
				event.preventDefault();
				this.value = max;

				return;
			}

			const fieldId = $options.data( 'field-id' );
			const numberSlider = $builder.find( '#wpforms-field-' + fieldId + ' input[type="range"]' );

			numberSlider.attr( 'min', current );
		},

		/**
		 * Update max attribute.
		 *
		 * @since 1.5.7
		 *
		 * @param {Object} event Input event.
		 */
		fieldNumberSliderUpdateMax( event ) {
			const current = parseFloat( event.target.value );

			if ( isNaN( current ) ) {
				return;
			}

			const $options = $( event.target ).parents( '.wpforms-field-option-row-min_max' );
			const min = parseFloat( $options.find( '.wpforms-number-slider-min' ).val() );

			if ( min >= current ) {
				event.preventDefault();
				this.value = min;

				return;
			}

			const fieldId = $options.data( 'field-id' );
			const numberSlider = $builder.find( '#wpforms-field-' + fieldId + ' input[type="range"]' );

			numberSlider.attr( 'max', current );
		},

		/**
		 * Update max attribute for step value.
		 *
		 * @since 1.5.7
		 *
		 * @param {number} fieldID  Field ID.
		 * @param {*}      newValue Default value attribute.
		 *
		 * @return {Object} App instance.
		 */
		updateNumberSliderStepValueMaxAttr( fieldID, newValue ) {
			const input = document.getElementById( 'wpforms-field-option-' + fieldID + '-step' );

			if ( input ) {
				const value = parseFloat( input.value );

				input.setAttribute( 'max', newValue );
				newValue = parseFloat( newValue );

				if ( value > newValue ) {
					input.value = newValue;
					$( input ).trigger( 'input' );
				}
			}

			return this;
		},

		/**
		 * Update upload selector.
		 *
		 * @since 1.5.6
		 *
		 * @param {Object} target Changed :input.
		 */
		fieldFileUploadPreviewUpdate( target ) {
			const $options = $( target ).parents( '.wpforms-field-option-file-upload' );
			const fieldId = $options.data( 'field-id' );

			const styleOption = $options.find( '#wpforms-field-option-' + fieldId + '-style' ).val();
			const $maxFileNumberRow = $options.find( '#wpforms-field-option-row-' + fieldId + '-max_file_number' );
			const maxFileNumber = parseInt( $maxFileNumberRow.find( 'input' ).val(), 10 );

			const $preview = $( '#wpforms-field-' + fieldId );
			const classicPreview = '.wpforms-file-upload-builder-classic';
			const modernPreview = '.wpforms-file-upload-builder-modern';

			if ( styleOption === 'classic' ) {
				$( classicPreview, $preview ).removeClass( 'wpforms-hide' );
				$( modernPreview, $preview ).addClass( 'wpforms-hide' );
				$maxFileNumberRow.addClass( 'wpforms-hidden' );
			} else {
				// Change hint and title.
				if ( maxFileNumber > 1 ) {
					$preview
						.find( '.modern-title' )
						.text( wpforms_builder.file_upload.preview_title_plural );
					$preview
						.find( '.modern-hint' )
						.text( wpforms_builder.file_upload.preview_hint.replace( '{maxFileNumber}', maxFileNumber ) )
						.removeClass( 'wpforms-hide' );
				} else {
					$preview
						.find( '.modern-title' )
						.text( wpforms_builder.file_upload.preview_title_single );
					$preview
						.find( '.modern-hint' )
						.text( wpforms_builder.file_upload.preview_hint.replace( '{maxFileNumber}', 1 ) )
						.addClass( 'wpforms-hide' );
				}

				// Display the preview.
				$( classicPreview, $preview ).addClass( 'wpforms-hide' );
				$( modernPreview, $preview ).removeClass( 'wpforms-hide' );
				$maxFileNumberRow.removeClass( 'wpforms-hidden' );
			}
		},

		/**
		 * Update limit controls by changing checkbox.
		 *
		 * @since 1.5.6
		 *
		 * @param {number}  id      Field id.
		 * @param {boolean} checked Whether an option is checked or not.
		 */
		updateTextFieldsLimitControls( id, checked ) {
			if ( ! checked ) {
				$( '#wpforms-field-option-row-' + id + '-limit_controls' ).addClass( 'wpforms-hide' );
			} else {
				$( '#wpforms-field-option-row-' + id + '-limit_controls' ).removeClass( 'wpforms-hide' );
			}
		},

		/**
		 * Update disabling today's date controls by changing checkbox.
		 *
		 * @since 1.8.9.4
		 *
		 * @param {number}  id      Field id.
		 * @param {boolean} checked Whether an option is checked or not.
		 */
		updateDisableTodaysDateControls( id, checked ) {
			$( `#wpforms-field-option-row-${ id }-date_disable_todays_date` )
				.toggleClass( 'wpforms-hide', ! checked );
		},

		/**
		 * Update Password Strength controls by changing checkbox.
		 *
		 * @since 1.6.7
		 *
		 * @param {number}  id      Field id.
		 * @param {boolean} checked Whether an option is checked or not.
		 */
		updatePasswordStrengthControls( id, checked ) {
			const $strengthControls = $( '#wpforms-field-option-row-' + id + '-password-strength-level' );

			if ( checked ) {
				$strengthControls.removeClass( 'wpforms-hidden' );
			} else {
				$strengthControls.addClass( 'wpforms-hidden' );
			}
		},

		/**
		 * Update Rich Text media controls by changing checkbox.
		 *
		 * @since 1.7.0
		 */
		updateRichTextMediaFieldsLimitControls() {
			const $this = $( this ),
				fieldId = $this.closest( '.wpforms-field-option-row-media_enabled' ).data( 'field-id' ),
				$mediaControls = $( '#wpforms-field-option-row-' + fieldId + '-media_controls' ),
				$toolbar = $( '#wpforms-field-' + fieldId + ' .wpforms-richtext-wrap .mce-toolbar-grp' );

			if ( ! $this.is( ':checked' ) ) {
				$mediaControls.hide();
				$toolbar.removeClass( 'wpforms-field-richtext-media-enabled' );
			} else {
				$mediaControls.show();
				$toolbar.addClass( 'wpforms-field-richtext-media-enabled' );
			}
		},

		/**
		 * Update Rich Text style preview by changing select.
		 *
		 * @since 1.7.0
		 */
		updateRichTextStylePreview() {
			const $this = $( this ),
				fieldId = $this.closest( '.wpforms-field-option-row-style' ).data( 'field-id' ),
				$toolbar = $( '#wpforms-field-' + fieldId + ' .wpforms-richtext-wrap .mce-toolbar-grp' );

			$toolbar.toggleClass( 'wpforms-field-richtext-toolbar-basic', $this.val() !== 'full' );
		},

		/**
		 * Element bindings.
		 *
		 * @since 1.0.0
		 */
		bindUIActions() {
			// General Panels.
			app.bindUIActionsPanels();

			// Fields Panel.
			app.bindUIActionsFields();

			// Settings Panel.
			app.bindUIActionsSettings();

			// Revisions Panel.
			app.bindUIActionsRevisions();

			// Save and Exit.
			app.bindUIActionsSaveExit();

			// General/ global.
			app.bindUIActionsGeneral();
		},

		//--------------------------------------------------------------------//
		// General Panels
		//--------------------------------------------------------------------//

		/**
		 * Element bindings for general panel tasks.
		 *
		 * @since 1.0.0
		 */
		bindUIActionsPanels() {
			// Panel switching.
			$builder.on( 'click', '#wpforms-panels-toggle button, .wpforms-panel-switch', function( e ) {
				e.preventDefault();
				app.panelSwitch( $( this ).data( 'panel' ) );
			} );

			// Panel sections switching.
			$builder.on( 'click', '.wpforms-panel .wpforms-panel-sidebar-section', function( e ) {
				app.panelSectionSwitch( this, e );
			} );

			// Panel sidebar toggle.
			$builder.on( 'click', '.wpforms-panels .wpforms-panel-sidebar-content .wpforms-panel-sidebar-toggle', function() {
				$( this ).parent().toggleClass( 'wpforms-panel-sidebar-closed' );
			} );
		},

		/**
		 * Switch Panels.
		 *
		 * @since 1.0.0
		 * @since 1.5.9 Added `wpformsPanelSwitched` trigger.
		 *
		 * @param {string} panel Panel slug.
		 *
		 * @return {void|boolean} Void or false.
		 */
		panelSwitch( panel ) {
			const $panel = $( '#wpforms-panel-' + panel );

			if ( ! $panel.hasClass( 'active' ) ) {
				const event = WPFormsUtils.triggerEvent( $builder, 'wpformsPanelSwitch', [ panel ] );

				// Allow callbacks on `wpformsPanelSwitch` to cancel panel switching by triggering `event.preventDefault()`.
				if ( event.isDefaultPrevented() || ! wpforms_panel_switch ) {
					return false;
				}

				$( '#wpforms-panels-toggle' ).find( 'button' ).removeClass( 'active' );
				$( '.wpforms-panel' ).removeClass( 'active' );
				$( '.wpforms-panel-' + panel + '-button' ).addClass( 'active' );
				$panel.addClass( 'active' );

				history.replaceState( {}, null, wpf.updateQueryString( 'view', panel ) );

				$builder.trigger( 'wpformsPanelSwitched', [ panel ] );
			}
		},

		/**
		 * Switch Panel section.
		 *
		 * @since 1.0.0
		 *
		 * @param {Element} el Element.
		 * @param {Event}   e  Event.
		 *
		 * @return {boolean|void} False when not switched.
		 */
		panelSectionSwitch( el, e ) { // eslint-disable-line complexity
			if ( e ) {
				e.preventDefault();
			}

			const $this = $( el );

			if ( $this.hasClass( 'upgrade-modal' ) || $this.hasClass( 'education-modal' ) ) {
				return;
			}

			const $panel = $this.parent().parent(),
				section = $this.data( 'section' ),
				$sectionButton = $panel.find( '.wpforms-panel-sidebar-section-' + section );

			if ( ! $sectionButton.hasClass( 'active' ) ) {
				const event = WPFormsUtils.triggerEvent( $builder, 'wpformsPanelSectionSwitch', section );

				// Allow callbacks on `wpformsPanelSectionSwitch` to cancel panel section switching by triggering `event.preventDefault()`.
				if ( event.isDefaultPrevented() || ! wpforms_panel_switch ) {
					return false;
				}

				const $sectionButtons = $panel.find( '.wpforms-panel-sidebar-section' );

				$sectionButtons.removeClass( 'active' );
				$sectionButton.addClass( 'active' );
				$panel.find( '.wpforms-panel-content-section' ).hide();
				$panel.find( '.wpforms-panel-content-section-' + section ).show();
			}
		},

		//--------------------------------------------------------------------//
		// Setup Panel
		//--------------------------------------------------------------------//

		/**
		 * Element bindings for a Setup panel.
		 *
		 * @since 1.0.0
		 * @since 1.6.8 Deprecated.
		 *
		 * @deprecated Use `WPForms.Admin.Builder.Setup.events()` instead.
		 */
		bindUIActionsSetup() {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Function "WPFormsBuilder.bindUIActionsSetup()" has been deprecated, please use the new "WPForms.Admin.Builder.Setup.events()" function instead!' );

			WPForms.Admin.Builder.Setup.events();
		},

		/**
		 * Select template.
		 *
		 * @since 1.0.0
		 * @since 1.6.8 Deprecated.
		 *
		 * @deprecated Use `WPForms.Admin.Builder.Setup.selectTemplate()` instead.
		 *
		 * @param {Object} el DOM element object.
		 * @param {Object} e  Event object.
		 */
		templateSelect( el, e ) {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Function "WPFormsBuilder.templateSelect()" has been deprecated, please use the new "WPForms.Admin.Builder.Setup.selectTemplate()" function instead!' );

			WPForms.Admin.Builder.Setup.selectTemplate( e );
		},

		//--------------------------------------------------------------------//
		// Fields Panel
		//--------------------------------------------------------------------//

		/**
		 * Element bindings for Fields panel.
		 *
		 * @since 1.0.0
		 */
		bindUIActionsFields() { // eslint-disable-line max-lines-per-function
			// Switched to the Fields panel.
			$builder.on( 'wpformsPanelSwitched', function( e, panel ) {
				if ( panel !== 'fields' ) {
					return;
				}

				// Detect the case when the field Options tab is active, but there is no active field on the preview panel.
				if (
					$( '#field-options a' ).hasClass( 'active' ) &&
					$( '.wpforms-field-wrap .wpforms-field.active' ).length === 0
				) {
					app.fieldTabToggle( 'field-options' );
				}
			} );

			// Field sidebar tab toggle
			$builder.on( 'click', '.wpforms-tab a', function( e ) {
				e.preventDefault();
				app.fieldTabToggle( $( this ).parent().attr( 'id' ) );
			} );

			// Field sidebar group toggle
			$builder.on( 'click', '.wpforms-add-fields-heading', function( e ) {
				e.preventDefault();
				app.fieldGroupToggle( $( this ), 'click' );
			} );

			// Form field preview clicking.
			$builder.on( 'click', '.wpforms-field', function( event ) {
				if ( app.isFieldPreviewActionsDisabled( this ) ) {
					return;
				}

				// Allow clicking on the "dismiss" button inside the field.
				if ( event.target.classList.contains( 'wpforms-dismiss-button' ) ) {
					return;
				}

				// Dismiss the main context menu when it is open.
				if ( WPForms.Admin.Builder.ContextMenu ) {
					WPForms.Admin.Builder.ContextMenu.hideMainContextMenu( event );
				}

				event.stopPropagation();

				app.fieldTabToggle( $( this ).data( 'field-id' ) );
			} );

			// Prevent interactions with inputs on the preview panel.
			$builder.on( 'mousedown click', '.wpforms-field input, .wpforms-field select, .wpforms-field textarea', function( e ) {
				e.preventDefault();
				this.blur();
			} );

			// Field delete.
			$builder.on( 'click', '.wpforms-field-delete', function( e ) {
				e.preventDefault();
				e.stopPropagation();

				if ( app.isFormPreviewActionsDisabled( this ) ) {
					return;
				}

				if ( WPForms.Admin.Builder.ContextMenu ) {
					WPForms.Admin.Builder.ContextMenu.hideMenu();
				}

				app.fieldDelete( $( this ).parent().data( 'field-id' ) );
			} );

			// Field duplicate.
			$builder.on( 'click', '.wpforms-field-duplicate', function( e ) {
				e.preventDefault();
				e.stopPropagation();

				if ( app.isFormPreviewActionsDisabled( this ) ) {
					return;
				}

				if ( WPForms.Admin.Builder.ContextMenu ) {
					WPForms.Admin.Builder.ContextMenu.hideMenu();
				}

				app.fieldDuplicate( $( this ).parent().data( 'field-id' ) );
			} );

			// Field add.
			$builder.on( 'click', '.wpforms-add-fields-button', function( e ) {
				e.preventDefault();

				const $field = $( this );

				if ( $field.hasClass( 'ui-draggable-disabled' ) ) {
					return;
				}

				const type = $field.data( 'field-type' ),
					event = WPFormsUtils.triggerEvent( $builder, 'wpformsBeforeFieldAddOnClick', [ type, $field ] );

				// Allow callbacks on `wpformsBeforeFieldAddOnClick` to cancel adding field
				// by triggering `event.preventDefault()`.
				if ( event.isDefaultPrevented() ) {
					return;
				}

				app.fieldAdd( type, { $sortable: 'default' } );
			} );

			// New field choices should be sortable
			$builder.on( 'wpformsFieldAdd', function( event, id, type ) {
				const fieldTypes = [
					'select',
					'radio',
					'checkbox',
					'payment-multiple',
					'payment-checkbox',
					'payment-select',
				];

				if ( $.inArray( type, fieldTypes ) !== -1 ) {
					app.fieldChoiceSortable( type, `#wpforms-field-option-row-${ id }-choices ul` );
				}
			} );

			// Field option tab toggle.
			$builder.on( 'wpformsFieldOptionTabToggle', function( e, fieldId ) {
				app.fieldLayoutSelectorInit( fieldId );
			} );

			// Field choice "Add new".
			$builder.on( 'click', '.wpforms-field-option-row-choices .add', function( e ) {
				app.fieldChoiceAdd( e, $( this ) );
			} );

			// Field choice "Delete".
			$builder.on( 'click', '.wpforms-field-option-row-choices .remove', function( e ) {
				app.fieldChoiceDelete( e, $( this ) );
			} );

			// Field choices' defaults, before change.
			$builder.on( 'mousedown', '.wpforms-field-option-row-choices input[type=radio]', function( e ) { // eslint-disable-line no-unused-vars
				const $this = $( this );

				if ( $this.is( ':checked' ) ) {
					$this.attr( 'data-checked', '1' );
				} else {
					$this.attr( 'data-checked', '0' );
				}
			} );

			// Field choices' defaults.
			$builder.on( 'click', '.wpforms-field-option-row-choices input[type=radio]', function( e ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					list = $this.parent().parent();

				$this.parent().parent().find( 'input[type=radio]' ).not( this ).prop( 'checked', false );

				if ( $this.attr( 'data-checked' ) === '1' ) {
					$this.prop( 'checked', false );
					$this.attr( 'data-checked', '0' );
				}

				app.fieldChoiceUpdate( list.data( 'field-type' ), list.data( 'field-id' ), list.find( 'li' ).length );
			} );

			// Field choices update preview area.
			$builder.on( 'change', '.wpforms-field-option-row-choices input[type=checkbox]', function( e ) { // eslint-disable-line no-unused-vars
				const list = $( this ).parent().parent();

				app.fieldChoiceUpdate( list.data( 'field-type' ), list.data( 'field-id' ), list.find( 'li' ).length );
			} );

			// Field choices display value toggle.
			$builder.on( 'change', '.wpforms-field-option-row-show_values input', function( e ) { // eslint-disable-line no-unused-vars
				$( this ).closest( '.wpforms-field-option' ).find( '.wpforms-field-option-row-choices ul' ).toggleClass( 'show-values' );
			} );

			// Field choices image toggle.
			$builder.on( 'change', '.wpforms-field-option-row-choices_images input', function() {
				const $this = $( this ),
					$optionRow = $this.closest( '.wpforms-field-option-row' ),
					fieldID = $optionRow.data( 'field-id' ),
					$fieldOptions = $( '#wpforms-field-option-' + fieldID ),
					checked = $this.is( ':checked' ),
					type = $fieldOptions.find( '.wpforms-field-option-hidden-type' ).val(),
					$iconToggle = $optionRow.siblings( '.wpforms-field-option-row-choices_icons' ).find( 'input' );

				// Toggle icon choices off.
				if ( checked && $iconToggle.is( ':checked' ) ) {
					$iconToggle.prop( 'checked', false ).trigger( 'change' );
				}

				$optionRow.find( '.wpforms-alert' ).toggleClass( 'wpforms-hidden' );
				$fieldOptions.find( '.wpforms-field-option-row-choices ul' ).toggleClass( 'show-images' );
				$fieldOptions.find( '.wpforms-field-option-row-choices_images_style' ).toggleClass( 'wpforms-hidden' );
				$fieldOptions.find( '.wpforms-field-option-row-dynamic_choices' ).toggleClass( 'wpforms-hidden', checked );

				if ( checked ) {
					$( '#wpforms-field-option-' + fieldID + '-input_columns' ).val( 'inline' ).trigger( 'change' );
				} else {
					$( '#wpforms-field-option-' + fieldID + '-input_columns' ).val( '' ).trigger( 'change' );
				}

				app.fieldChoiceUpdate( type, fieldID );
			} );

			// Field choices image upload add/remove image.
			$builder.on( 'wpformsImageUploadAdd wpformsImageUploadRemove', function( event, $this, $container ) {
				const $list = $container.closest( '.choices-list' ),
					fieldID = $list.data( 'field-id' ),
					type = $list.data( 'field-type' );

				app.fieldChoiceUpdate( type, fieldID );
			} );

			// Field choices image style toggle.
			$builder.on( 'change', '.wpforms-field-option-row-choices_images_style select', function() {
				const fieldID = $( this ).parent().data( 'field-id' ),
					type = $( '#wpforms-field-option-' + fieldID ).find( '.wpforms-field-option-hidden-type' ).val();

				app.fieldChoiceUpdate( type, fieldID );
			} );

			// Updates field choices text in almost real time.
			$builder.on( 'keyup', '.wpforms-field-option-row-choices input.label, .wpforms-field-option-row-choices input.value', function( e ) { // eslint-disable-line no-unused-vars
				const $list = $( this ).parent().parent();

				app.fieldChoiceUpdate( $list.data( 'field-type' ), $list.data( 'field-id' ) );
			} );

			// Sanitize field choices text on focus out.
			$builder.on( 'focusout', '.wpforms-field-option-row-choices input.label, .wpforms-field-option-row-choices input.value', function( e ) { // eslint-disable-line no-unused-vars
				const input = $( this );

				input.val( wpf.sanitizeHTML( input.val(), wpforms_builder.allowed_label_html_tags ) );
			} );

			// Field Choices Bulk Add
			$builder.on( 'click', '.toggle-bulk-add-display', function( e ) {
				e.preventDefault();
				app.fieldChoiceBulkAddToggle( this );
			} );

			$builder.on( 'click', '.toggle-bulk-add-presets', function( e ) {
				e.preventDefault();

				const $presetList = $( this ).closest( '.bulk-add-display' ).find( 'ul' );

				if ( $presetList.css( 'display' ) === 'block' ) {
					$( this ).text( wpforms_builder.bulk_add_presets_show );
				} else {
					$( this ).text( wpforms_builder.bulk_add_presets_hide );
				}

				$presetList.stop().slideToggle();
			} );

			$builder.on( 'click', '.bulk-add-preset-insert', function( e ) {
				e.preventDefault();

				const $this = $( this ),
					preset = $this.data( 'preset' ),
					$container = $this.closest( '.bulk-add-display' ),
					$presetList = $container.find( 'ul' ),
					$presetToggle = $container.find( '.toggle-bulk-add-presets' ),
					$textarea = $container.find( 'textarea' );

				$textarea.val( '' );
				$textarea.insertAtCaret( wpforms_preset_choices[ preset ].choices.join( '\n' ) );
				$presetToggle.text( wpforms_builder.bulk_add_presets_show );
				$presetList.slideUp();
			} );

			$builder.on( 'click', '.bulk-add-insert', function( e ) {
				e.preventDefault();
				app.fieldChoiceBulkAddInsert( this );
			} );

			// Field Options group tabs.
			$builder.on( 'click', '.wpforms-field-option-group-toggle:not(.education-modal)', function( e ) {
				const event = WPFormsUtils.triggerEvent( $builder, 'wpformsFieldOptionGroupToggle' );

				// Allow callbacks on `wpformsFieldOptionGroupToggle` to cancel tab toggle by triggering `event.preventDefault()`.
				if ( event.isDefaultPrevented() ) {
					return false;
				}

				e.preventDefault();

				const $group = $( this ).closest( '.wpforms-field-option-group' );

				$group.siblings( '.wpforms-field-option-group' ).removeClass( 'active' );
				$group.addClass( 'active' );
			} );

			// Display toggle for an Address field hide address line 2 option.
			$builder.on( 'change', '.wpforms-field-option-address input.wpforms-subfield-hide', function( e ) { // eslint-disable-line no-unused-vars
				const $optionRow = $( this ).closest( '.wpforms-field-option-row' ),
					id = $optionRow.data( 'field-id' ),
					subfield = $optionRow.data( 'subfield' );

				$( '#wpforms-field-' + id ).find( '.wpforms-' + subfield ).toggleClass( 'wpforms-hide' );
			} );

			// Real-time updates for the "Label" field option.
			$builder.on( 'input', '.wpforms-field-option-row-label input, .wpforms-field-option-row-name input', function( e ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					id = $this.parent().data( 'field-id' ),
					$preview = $( '#wpforms-field-' + id ),
					type = $preview.data( 'field-type' );

				let value = $this.val(),
					showEmptyLabel = value.length === 0;

				// Do not modify the label of the HTML field.
				if ( type === 'html' ) {
					showEmptyLabel = false;
				}

				if ( showEmptyLabel ) {
					value = wpforms_builder.empty_label;
				}

				$preview.toggleClass( 'label_empty', showEmptyLabel ).find( '> .label-title .text' ).text( value );
			} );

			// Real-time updates for "Description" field option
			$builder.on( 'input', '.wpforms-field-option-row-description textarea', function() {
				const $this = $( this ),
					value = wpf.sanitizeHTML( $this.val() ),
					id = $this.parent().data( 'field-id' ),
					// IIF description is not following other fields structure and needs to be selected separately.
					$desc = $( `#wpforms-field-${ id } > .description, #wpforms-field-${ id } .wpforms-field-internal-information-row-description` );

				app.updateDescription( $desc, value );

				$this.trigger( 'wpformsDescriptionFieldUpdated', { id, descField: $desc, value } );
			} );

			// Real-time updates for "Required" field option
			$builder.on( 'change', '.wpforms-field-option-row-required input', function( e ) { // eslint-disable-line no-unused-vars
				const id = $( this ).closest( '.wpforms-field-option-row' ).data( 'field-id' );

				$( '#wpforms-field-' + id ).toggleClass( 'required' );
			} );

			// Real-time updates for "Summary" field option
			$builder.on( 'change', '.wpforms-field-option-row-summary input', function() {
				const $this = $( this ),
					id = $this.closest( '.wpforms-field-option-row' ).data( 'field-id' );

				$( `#wpforms-field-${ id }` ).toggleClass( 'wpforms-summary-enabled' );
				$this.closest( '.wpforms-field-option-group-inner' ).find( '.wpforms-total-summary-alert' ).toggleClass( 'wpforms-hidden' );
			} );

			// Real-time updates for "Confirmation" field option
			$builder.on( 'change', '.wpforms-field-option-row-confirmation input', function() {
				const id = $( this ).closest( '.wpforms-field-option-row' ).data( 'field-id' );

				$( '#wpforms-field-' + id ).find( '.wpforms-confirm' ).toggleClass( 'wpforms-confirm-enabled wpforms-confirm-disabled' );
				$( '#wpforms-field-option-' + id ).toggleClass( 'wpforms-confirm-enabled wpforms-confirm-disabled' );
			} );

			// Real-time updates for "Filter" field option
			$builder.on( 'change', '.wpforms-field-option-row-filter_type select', function() {
				const id = $( this ).parent().data( 'field-id' ),
					$toggledField = $( '#wpforms-field-option-' + id );

				if ( $( this ).val() ) {
					$toggledField.removeClass( 'wpforms-filter-allowlist' );
					$toggledField.removeClass( 'wpforms-filter-denylist' );
					$toggledField.addClass( 'wpforms-filter-' + $( this ).val() );
				} else {
					$toggledField.removeClass( 'wpforms-filter-allowlist' );
					$toggledField.removeClass( 'wpforms-filter-denylist' );
				}
			} );

			$builder.on( 'focusout', '.wpforms-field-option-row-allowlist textarea,.wpforms-field-option-row-denylist textarea', function() {
				const $currentField = $( this );

				let $current = 'allow';

				$currentField.next( '.wpforms-alert' ).remove();

				if ( $currentField.val() === '' ) {
					return;
				}

				const $allowField = $( '.wpforms-field-option-row-allowlist textarea' ),
					$denyField = $( '.wpforms-field-option-row-denylist textarea' );

				if ( $currentField.is( $denyField ) ) {
					$current = 'deny';
				}

				$.get(
					wpforms_builder.ajax_url,
					{
						nonce: wpforms_builder.nonce,
						content: JSON.stringify(
							{
								allow: $allowField.val(),
								deny: $denyField.val(),
								current: $current,
							}
						),
						action: 'wpforms_sanitize_restricted_rules',
					},
					function( res ) {
						if ( res.success ) {
							$currentField.val( res.data.currentField );
							const intersect = res.data.intersect;
							if ( intersect.length !== 0 ) {
								const content = '<p>' + wpforms_builder.allow_deny_lists_intersect + '</p>' +
									'<p class="bold">' + intersect + '</p>';
								$.alert( {
									title: wpforms_builder.heads_up,
									content,
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
							}

							const restricted = res.data.restricted || 0;
							if ( restricted ) {
								$currentField.after( '<div class="wpforms-alert-warning wpforms-alert"><p>' + wpforms_builder.restricted_rules + '</p></div>' );
							}
						}
					}
				);
			} );

			// Save focusout target.
			$builder.on( 'focusout', elements.defaultEmailSelector, function() {
				elements.$focusOutTarget = $( this );
				app.focusOutEvent();
			} );

			// Real-time updates for "Size" field option
			$builder.on( 'change', '.wpforms-field-option-row-size select', function( e ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					value = $this.val(),
					id = $this.parent().data( 'field-id' );

				$( '#wpforms-field-' + id ).removeClass( 'size-small size-medium size-large' ).addClass( 'size-' + value );
			} );

			// Real-time updates for "Placeholder" field option.
			$builder.on( 'input', '.wpforms-field-option-row-placeholder input', function() { // eslint-disable-line complexity
				const $this = $( this ),
					id = $this.parent().data( 'field-id' ),
					$preview = $( '#wpforms-field-' + id ),
					$primary = $preview.find( '.primary-input' );

				let value = wpf.sanitizeHTML( $this.val() );

				// Single Item Field - if placeholder is cleared, set it to "price" placeholder.
				if ( $preview.data( 'field-type' ) === 'payment-single' && value === '' ) {
					value = $( '#wpforms-field-option-' + id + '-price' ).prop( 'placeholder' );
				}

				// Set the placeholder value for `input` fields.
				if ( ! $primary.is( 'select' ) ) {
					$primary.prop( 'placeholder', value );
					return;
				}

				// Modern select style.
				if ( app.dropdownField.helpers.isModernSelect( $primary ) ) {
					const choiceInstance = app.dropdownField.helpers.getInstance( $primary );

					// Additional case for multiple select.
					if ( $primary.prop( 'multiple' ) ) {
						$( choiceInstance.input.element ).prop( 'placeholder', value );
					} else {
						choiceInstance.setChoiceByValue( '' );
						$primary.closest( '.choices' ).find( '.choices__inner .choices__placeholder' ).text( value );

						const isDynamicChoices = $( '#wpforms-field-option-' + id + '-dynamic_choices' ).val();

						// We need to re-initialize modern dropdown to properly determine and update placeholder.
						app.dropdownField.helpers.update( id, isDynamicChoices );
					}

					return;
				}

				const $placeholder = $primary.find( '.placeholder' );

				// Classic select style.
				if ( ! value.length && $placeholder.length ) {
					$placeholder.remove();
				} else {
					if ( $placeholder.length ) {
						$placeholder.text( value );
					} else {
						$primary.prepend( '<option value="" class="placeholder">' + value + '</option>' );
					}

					$primary.find( '.placeholder' ).prop( 'selected', ! $primary.prop( 'multiple' ) );
				}
			} );

			// Real-time updates for "Confirmation Placeholder" field option
			$builder.on( 'input', '.wpforms-field-option-row-confirmation_placeholder input', function( e ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					value = $this.val(),
					id = $this.parent().data( 'field-id' );

				$( '#wpforms-field-' + id ).find( '.secondary-input' ).attr( 'placeholder', value );
			} );

			// Real-time updates for Date/Time, and Name "Placeholder" field options
			$builder.on( 'input', '.wpforms-field-option .format-selected input.placeholder', function() {
				const $this = $( this );
				const value = $this.val();
				const $fieldOptionRow = $this.closest( '.wpforms-field-option-row' );
				const id = $fieldOptionRow.data( 'field-id' );
				const subfield = $fieldOptionRow.data( 'subfield' );

				$( '#wpforms-field-' + id ).find( '.wpforms-' + subfield + ' input' ).attr( 'placeholder', value );
			} );

			// Real-time updates for Address field "Placeholder" field options.
			$builder.on( 'input', '.wpforms-field-option-address input.placeholder', function() {
				const $this = $( this );
				const $fieldOptionRow = $this.closest( '.wpforms-field-option-row' );
				const id = $fieldOptionRow.data( 'field-id' );
				const subfield = $fieldOptionRow.data( 'subfield' );
				const $fieldPreviews = $( '#wpforms-field-' + id + ' .wpforms-' + subfield ).find( 'input, select' );
				const $default = $fieldOptionRow.find( '#wpforms-field-option-' + id + '-' + subfield + '_default' );
				const defaultValue = $default.val();
				const defaultText = $default.find( 'option:selected' ).text();

				const placeholderValue = $this.val();

				$fieldPreviews.each( function() {
					const $fieldPreview = $( this );

					if ( $fieldPreview.is( 'select' ) ) {
						const $option = $fieldPreview.find( '.placeholder' );
						const value = defaultValue === '' && placeholderValue !== '' ? placeholderValue : defaultText;

						$option.text( value );

						return;
					}

					$fieldPreview.attr( 'placeholder', placeholderValue );
				} );
			} );

			// Real-time updates for "Default" field option.
			$builder.on( 'input', '.wpforms-field-option-row-default_value input', function() {
				const $this = $( this );
				const value = wpf.sanitizeHTML( $this.val() );
				const id = $this.closest( '.wpforms-field-option-row' ).data( 'field-id' );
				const $preview = $( '#wpforms-field-' + id + ' .primary-input' );

				$preview.val( value );
			} );

			// Real-time updates for "Default" field option of the Name and Address fields.
			$builder.on( 'input', '.wpforms-field-options-column input.default', function() {
				const $this = $( this );
				const value = wpf.sanitizeHTML( $this.val() );
				const $fieldOptionRow = $this.closest( '.wpforms-field-option-row' );
				const id = $fieldOptionRow.data( 'field-id' );
				const subfield = $fieldOptionRow.data( 'subfield' );
				const $fieldPreview = $( '#wpforms-field-' + id + ' .wpforms-' + subfield + ' input' );

				$fieldPreview.val( value );
			} );

			// Real-time updates for "Default" select field option of the Address field.
			$builder.on( 'change', '.wpforms-field-option-address select.default', function() {
				const $this = $( this );
				const value = $this.val();
				const textValue = $this.find( 'option:selected' ).text();
				const $fieldOptionRow = $this.closest( '.wpforms-field-option-row' );
				const id = $fieldOptionRow.data( 'field-id' );
				const subfield = $fieldOptionRow.data( 'subfield' );
				const scheme = $( '#wpforms-field-option-' + id + '-scheme' ).val();
				const $placeholder = $fieldOptionRow.find( '#wpforms-field-option-' + id + '-' + subfield + '_placeholder' );
				const placeholderValue = $placeholder.val();
				const $fieldPreview = $( '#wpforms-field-' + id + ' .wpforms-address-scheme-' + scheme + ' .wpforms-' + subfield + ' .placeholder' );

				value === '' && placeholderValue.trim().length > 0
					? $fieldPreview.text( placeholderValue )
					: $fieldPreview.text( textValue );
			} );

			// Real-time updates for "Confirmation Placeholder" field option
			$builder.on( 'input', '.wpforms-field-option-row-confirmation_placeholder input', function( e ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					value = $this.val(),
					id = $this.parent().data( 'field-id' );

				$( '#wpforms-field-' + id ).find( '.secondary-input' ).attr( 'placeholder', value );
			} );

			// Real-time updates for "Hide Label" field option.
			$builder.on( 'change', '.wpforms-field-option-row-label_hide input', function( e ) { // eslint-disable-line no-unused-vars
				const id = $( this ).closest( '.wpforms-field-option-row' ).data( 'field-id' );

				$( '#wpforms-field-' + id ).toggleClass( 'label_hide' );
			} );

			// Real-time updates for a Sub Label visibility field option.
			$builder.on( 'change', '.wpforms-field-option-row-sublabel_hide input', function( e ) { // eslint-disable-line no-unused-vars
				const id = $( this ).closest( '.wpforms-field-option-row' ).data( 'field-id' );

				$( '#wpforms-field-' + id ).toggleClass( 'sublabel_hide' );
			} );

			// Real-time updates for a Quantity visibility field option.
			$builder.on( 'change', '.wpforms-field-option-row-enable_quantity input', function() {
				const id = $( this ).closest( '.wpforms-field-option-row' ).data( 'field-id' ),
					$preview = $( `#wpforms-field-${ id }` );

				$( `#wpforms-field-option-row-${ id }-quantity` ).toggleClass( 'wpforms-hidden' );
				$preview.find( '.quantity-input' ).toggleClass( 'wpforms-hidden' );
				$preview.toggleClass( 'payment-quantity-enabled' );
			} );

			// Real-time updates for Quantity preview minimum value.
			$builder.on( 'input', '.wpforms-field-option-row-quantity input', function() {
				const $this = $( this );

				// Allow only a positive integer value less than 9999.
				$this.val( Math.min( Math.abs( Math.round( $this.val() ) ), 9999 ) );

				const $optionRow = $this.closest( '.wpforms-field-option-row' ),
					id = $optionRow.data( 'field-id' ),
					isMinInput = $this.hasClass( 'min-quantity-input' ),
					$minInput = $optionRow.find( '.min-quantity-input' ),
					$maxInput = $optionRow.find( '.max-quantity-input' );

				if ( isMinInput ) {
					$( '#wpforms-field-' + id ).find( '.quantity-input option' ).text( $this.val() );
				}

				$minInput.toggleClass( 'wpforms-error', parseInt( $minInput.val(), 10 ) > parseInt( $maxInput.val(), 10 ) );
			} );

			// Real-time updates for Date/Time, Name and Single Item "Format" option.
			$builder.on( 'change', '.wpforms-field-option-row-format select', function() {
				const $this = $( this ),
					value = $this.val(),
					id = $this.parent().data( 'field-id' ),
					$sublabelToggle = $( '#wpforms-field-option-row-' + id + '-sublabel_hide' ),
					$preview = $( '#wpforms-field-' + id );

				$preview.find( '.format-selected' ).removeClass().addClass( 'format-selected format-selected-' + value );
				$( '#wpforms-field-option-' + id ).find( '.format-selected' ).removeClass().addClass( 'format-selected format-selected-' + value );

				// Show toggle for "Hide Sub labels" only when the field consists of more than one subfield.
				if ( [ 'date-time', 'first-last', 'first-middle-last' ].includes( value ) ) {
					$sublabelToggle.removeClass( 'wpforms-hidden' );
				} else {
					$sublabelToggle.addClass( 'wpforms-hidden' );
				}

				// Hide the label field if it's not a single item.
				$( `#wpforms-field-option-row-${ id }-price_label` ).toggleClass( 'wpforms-hidden', value !== 'single' );

				// Toggle options based on Single Item "Format".
				if ( [ 'single', 'user', 'hidden' ].includes( value ) ) {
					const isUserDefined = value === 'user',
						isSingle = value === 'single',
						isHidden = value === 'hidden',
						isQuantityEnabled = $( '#wpforms-field-option-' + id + '-enable_quantity' ).is( ':checked' ),
						$minPriceOption = $( '#wpforms-field-option-' + id + '-min_price' ),
						minPrice = wpf.amountSanitize( $minPriceOption.val() ),
						isValidMinPrice = minPrice >= $minPriceOption.data( 'minimum-price' ),
						$minPriceOptionRow = $( '#wpforms-field-option-row-' + id + '-min_price' );

					// Toggle Placeholder option.
					$( '#wpforms-field-option-row-' + id + '-placeholder' ).toggleClass( 'wpforms-hidden', ! isUserDefined );

					// Toggle Quantity options.
					$( '#wpforms-field-option-row-' + id + '-enable_quantity' ).toggleClass( 'wpforms-hidden', ! isSingle );
					$( '#wpforms-field-option-row-' + id + '-quantities_alert' ).toggleClass( 'wpforms-hidden', ! isSingle );
					$( '#wpforms-field-option-row-' + id + '-quantity' ).toggleClass( 'wpforms-hidden', ! isSingle || ! isQuantityEnabled );
					$preview.find( '.quantity-input' ).toggleClass( 'wpforms-hidden', ! isSingle || ! isQuantityEnabled );

					// Toggle Minimum Price options.
					$minPriceOptionRow.toggleClass( 'wpforms-hidden', ! isUserDefined );
					$minPriceOptionRow.find( '.wpforms-item-minimum-price-alert' ).toggleClass( 'wpforms-hidden', isValidMinPrice );
					$preview.find( '.item-min-price' ).toggleClass( 'wpforms-hidden', isUserDefined && minPrice <= 0 );
					$preview.toggleClass( 'min-price-warning', ! isValidMinPrice );
					$preview.find( '.fa-exclamation-triangle' ).toggleClass( 'wpforms-hidden', isValidMinPrice );

					// Toggle the label
					$( `#wpforms-field-${ id } .item-price-single` ).toggleClass( 'wpforms-hidden', ! isSingle );
					$( `#wpforms-field-${ id } .item-price-hidden` ).toggleClass( 'wpforms-hidden', ! isHidden );
				}
			} );

			// Real-time updates specific for Address "Scheme" option
			$builder.on( 'change', '.wpforms-field-option-row-scheme select', function( e ) { // eslint-disable-line no-unused-vars
				const $this = $( this );
				const value = $this.val();
				const fieldId = $this.parent().data( 'field-id' );

				const $fieldPreview = $( `#wpforms-field-${ fieldId }` );
				const $stateOption = $( `#wpforms-field-option-row-${ fieldId }-state` );
				const $countryOption = $( `#wpforms-field-option-row-${ fieldId }-country` );

				// Switch the scheme in a Preview panel.
				$fieldPreview.find( '.wpforms-address-scheme' ).addClass( 'wpforms-hide' );
				$fieldPreview.find( `.wpforms-address-scheme-${ value }` ).removeClass( 'wpforms-hide' );

				// Show an or hide country option depending on the scheme.
				const $countryPreviewField = $fieldPreview.find( `.wpforms-address-scheme-${ value } .wpforms-country select, .wpforms-address-scheme-${ value } .wpforms-country input` );

				$countryPreviewField.length === 0
					? $countryOption.addClass( 'wpforms-hidden' )
					: $countryOption.removeClass( 'wpforms-hidden' );

				// Inputs/selects for a currently selected scheme and the one that we're changing to.
				const $currentState = $stateOption.find( '.default .default' ).not( '.wpforms-hidden-strict' );
				const $newState = $stateOption.find( `.default [data-scheme="${ value }"]` );
				const $currentCountry = $countryOption.find( '.default .default' ).not( '.wpforms-hidden-strict' );
				const $newCountry = $countryOption.find( `.default [data-scheme="${ value }"]` );

				// Switch the state field type in options to match the scheme.
				$newState.attr( {
					id: $currentState.attr( 'id' ),
					name: $currentState.attr( 'name' ),
				} ).removeClass( 'wpforms-hidden-strict' );
				$currentState.attr( { id: '', name: '' } ).addClass( 'wpforms-hidden-strict' );
				$newCountry.attr( {
					id: $currentCountry.attr( 'id' ),
					name: $currentCountry.attr( 'name' ),
				} ).removeClass( 'wpforms-hidden-strict' );
				$currentCountry.attr( { id: '', name: '' } ).addClass( 'wpforms-hidden-strict' );
			} );

			// Real-time updates for a Date/Time date type
			$builder.on( 'change', '.wpforms-field-option-row-date .type select', function( e ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					value = $this.val(),
					id = $( this ).closest( '.wpforms-field-option-row' ).data( 'field-id' ),
					addClass = value === 'datepicker' ? 'wpforms-date-type-datepicker' : 'wpforms-date-type-dropdown',
					removeClass = value === 'datepicker' ? 'wpforms-date-type-dropdown' : 'wpforms-date-type-datepicker';

				$( '#wpforms-field-' + id ).find( '.wpforms-date' ).addClass( addClass ).removeClass( removeClass );
				$( '#wpforms-field-option-' + id ).addClass( addClass ).removeClass( removeClass );

				const $limitDays = $this.closest( '.wpforms-field-option-group-advanced' )
						.find( '.wpforms-field-option-row-date_limit_days, .wpforms-field-option-row-date_limit_days_options, .wpforms-field-option-row-date_disable_past_dates' ),
					$limitDaysOptions = $( '#wpforms-field-option-row-' + id + '-date_limit_days_options' );

				if ( value === 'dropdown' ) {
					const $dateSelect = $( '#wpforms-field-option-' + id + '-date_format' );

					if ( $dateSelect.find( 'option:selected' ).hasClass( 'datepicker-only' ) ) {
						$dateSelect.prop( 'selectedIndex', 0 ).trigger( 'change' );
					}

					$limitDays.hide();
				} else {
					$limitDays.show();
					$( '#wpforms-field-option-' + id + '-date_limit_days' ).is( ':checked' )
						? $limitDaysOptions.show()
						: $limitDaysOptions.hide();
				}
			} );

			// Real-time updates for Date/Time date select format
			$builder.on( 'change', '.wpforms-field-option-row-date .format select', function( e ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					value = $this.val(),
					id = $( this ).closest( '.wpforms-field-option-row' ).data( 'field-id' ),
					$field = $( '#wpforms-field-' + id );

				if ( value === 'm/d/Y' ) {
					$field.find( '.wpforms-date-dropdown .first option' ).text( wpforms_builder.date_select_month );
					$field.find( '.wpforms-date-dropdown .second option' ).text( wpforms_builder.date_select_day );
				} else if ( value === 'd/m/Y' ) {
					$field.find( '.wpforms-date-dropdown .first option' ).text( wpforms_builder.date_select_day );
					$field.find( '.wpforms-date-dropdown .second option' ).text( wpforms_builder.date_select_month );
				}
			} );

			// Real-time updates for Date/Time select format
			$builder.on( 'change', '.wpforms-field-option-row-time .format select', function( e ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					id = $this.closest( '.wpforms-field-option-row' ).data( 'field-id' );

				let options = '',
					hh;

				// Determine a time format type.
				// If the format contains `g` or `h`, then this is 12-hour format, otherwise 24 hours.
				const format = $this.val().match( /[gh]/ ) ? 12 : 24,
					minHour = format === 12 ? 1 : 0,
					maxHour = format === 12 ? 13 : 24;

				// Generate a new set of hour options.
				for ( let i = minHour; i < maxHour; i++ ) {
					hh = i < 10 ? '0' + i : i;
					options += '<option value="{hh}">{hh}</option>'.replace( /{hh}/g, hh );
				}

				_.forEach( [ 'start', 'end' ], function( field ) {
					const $hour = $builder.find( '#wpforms-field-option-' + id + '-time_limit_hours_' + field + '_hour' ),
						$ampm = $builder.find( '#wpforms-field-option-' + id + '-time_limit_hours_' + field + '_ampm' );

					let hourValue = parseInt( $hour.val(), 10 ),
						ampmValue = $ampm.val();

					if ( format === 24 ) {
						hourValue = ampmValue === 'pm' ? hourValue + 12 : hourValue;
					} else {
						ampmValue = hourValue > 12 ? 'pm' : 'am';
						hourValue = hourValue > 12 ? hourValue - 12 : hourValue;
					}

					hourValue = hourValue < 10 ? '0' + hourValue : hourValue;
					$hour.html( options ).val( hourValue );
					$ampm.toggleClass( 'wpforms-hidden-strict', format === 24 ).val( ampmValue );
					$ampm.nextAll( 'div' ).toggleClass( 'wpforms-hidden-strict', format === 12 );
				} );
			} );

			// Consider the field active when a disabled nav button is clicked
			$builder.on( 'click', '.wpforms-pagebreak-button', function( e ) {
				e.preventDefault();
				$( this ).closest( '.wpforms-field' ).trigger( 'click' );
			} );

			/*
			 * Pagebreak field.
			 */
			app.fieldPageBreakInitDisplayPrevious( $builder.find( '.wpforms-field-pagebreak.wpforms-pagebreak-normal' ).first() );

			$builder
				.on( 'input', '.wpforms-field-option-row-next input', function( e ) { // eslint-disable-line no-unused-vars
					// Real-time updates for "Next" pagebreak field option.
					const $this = $( this ),
						value = $this.val(),
						$next = $( '#wpforms-field-' + $this.parent().data( 'field-id' ) ).find( '.wpforms-pagebreak-next' );

					if ( value ) {
						$next.css( 'display', 'inline-block' ).text( value );
					} else {
						$next.css( 'display', 'none' ).empty();
					}
				} )
				.on( 'input', '.wpforms-field-option-row-prev input', function( e ) { // eslint-disable-line no-unused-vars
					// Real-time updates for "Prev" pagebreak field option.
					const $this = $( this ),
						value = $this.val().trim(),
						$field = $( '#wpforms-field-' + $this.parent().data( 'field-id' ) ),
						$prevBtn = $field.find( '.wpforms-pagebreak-prev' );

					if ( value && $field.prevAll( '.wpforms-field-pagebreak.wpforms-pagebreak-normal' ).length > 0 ) {
						$prevBtn.removeClass( 'wpforms-hidden' ).text( value );
					} else {
						$prevBtn.addClass( 'wpforms-hidden' ).empty();
					}
				} )
				.on( 'change', '.wpforms-field-option-row-prev_toggle input', function( e ) { // eslint-disable-line complexity, no-unused-vars
					// Real-time updates for "Display Previous" pagebreak field option.
					const $input = $( this ),
						$wrapper = $input.closest( '.wpforms-field-option-row-prev_toggle' );

					if ( $wrapper.hasClass( 'wpforms-entry-preview-block' ) ) {
						return;
					}

					const $prev = $input.closest( '.wpforms-field-option-group-inner' ).find( '.wpforms-field-option-row-prev' );

					const $prevLabel = $prev.find( 'input' ),
						$prevBtn = $( '#wpforms-field-' + $input.closest( '.wpforms-field-option' ).data( 'field-id' ) ).find( '.wpforms-pagebreak-prev' );

					$prev.toggleClass( 'wpforms-hidden', ! $input.prop( 'checked' ) );
					$prevBtn.toggleClass( 'wpforms-hidden', ! $input.prop( 'checked' ) );

					if ( $input.prop( 'checked' ) && ! $prevLabel.val() ) {
						let message = $prevLabel.data( 'last-value' );
						message = message && message.trim() ? message.trim() : wpforms_builder.previous;

						$prevLabel.val( message );
					}

					// Backward compatibility for forms that were created before the toggle was added.
					if ( ! $input.prop( 'checked' ) ) {
						$prevLabel.data( 'last-value', $prevLabel.val() );
						$prevLabel.val( '' );
					}

					$prevLabel.trigger( 'input' );
				} )
				.on( 'wpformsFieldAdd', app.fieldPagebreakAdd )
				.on( 'wpformsFieldDelete', app.fieldPagebreakDelete )
				.on( 'wpformsFieldAdd', app.toggleOrderSummaryConfirmation )
				.on( 'wpformsFieldDelete', app.toggleOrderSummaryConfirmation )
				.on( 'wpformsBeforeFieldDelete', app.fieldEntryPreviewDelete );

			// Update Display Previous option visibility for all Pagebreak fields.
			$builder.on( 'wpformsFieldMove wpformsFieldAdd wpformsFieldDelete', function( e ) { // eslint-disable-line no-unused-vars
				$builder.find( '.wpforms-field-pagebreak.wpforms-pagebreak-normal' ).each( function( i ) { // eslint-disable-line no-unused-vars
					app.fieldPageBreakInitDisplayPrevious( $( this ) );
				} );
			} );

			// Real-time updates for "Page Title" pagebreak field option
			$builder.on( 'input', '.wpforms-field-option-row-title input', function( e ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					value = $this.val(),
					id = $this.parent().data( 'field-id' );

				if ( value ) {
					$( '#wpforms-field-' + id ).find( '.wpforms-pagebreak-title' ).text( value );
				} else {
					$( '#wpforms-field-' + id ).find( '.wpforms-pagebreak-title' ).empty();
				}
			} );

			// Real-time updates for "Page Navigation Alignment" pagebreak field option
			$builder.on( 'change', '.wpforms-field-option-row-nav_align select', function( e ) { // eslint-disable-line no-unused-vars
				const $this = $( this );
				let value = $this.val();

				if ( ! value ) {
					value = 'center';
				}

				$( '.wpforms-pagebreak-buttons' )
					.removeClass( 'wpforms-pagebreak-buttons-center wpforms-pagebreak-buttons-left wpforms-pagebreak-buttons-right wpforms-pagebreak-buttons-split' )
					.addClass( 'wpforms-pagebreak-buttons-' + value );
			} );

			// Real-time updates for Single Item field "Item Price" option.
			$builder.on( 'input', '.wpforms-field-option-row-price input', function() {
				const $this = $( this ),
					value = $this.val(),
					formatted = wpf.amountFormat( wpf.amountSanitize( value ) ),
					id = $this.parent().data( 'field-id' ),
					placeholder = $( '#wpforms-field-option-' + id + '-placeholder' ).val().trim(),
					$preview = $( '#wpforms-field-' + id ),
					newValue = value === '' && placeholder !== '' ? '' : formatted;

				$preview.find( '.primary-input' ).val( newValue );
				$preview.find( '.price' ).text( wpf.amountFormatCurrency( value ) );
			} );

			// Real-time updates for Single Item field "Minimum Price" option.
			$builder.on( 'input', '.wpforms-field-option-row-min_price input', function() {
				const $this = $( this ),
					amount = $this.val(),
					sanitized = wpf.amountSanitize( amount ),
					isEmpty = sanitized <= 0,
					isValid = sanitized >= $this.data( 'minimum-price' ),
					$fieldOptionRow = $this.parent(),
					$preview = $( '#wpforms-field-' + $fieldOptionRow.data( 'field-id' ) );

				$fieldOptionRow.find( '.wpforms-item-minimum-price-alert' ).toggleClass( 'wpforms-hidden', isValid );
				$preview.find( '.item-min-price' ).toggleClass( 'wpforms-hidden', isEmpty );
				$preview.toggleClass( 'min-price-warning', ! isValid );
				$preview.find( '.fa-exclamation-triangle' ).toggleClass( 'wpforms-hidden', isValid );

				if ( isEmpty ) {
					return;
				}

				$preview.find( '.min-price' ).text( wpf.amountFormatCurrency( amount ) );
			} );

			// Real-time updates for price label for single item field.
			$builder.on( 'input', '.wpforms-single-item-price-label-display', function() {
				const $this = $( this ),
					value = wpf.sanitizeHTML( $this.val(), '<>' ),
					id = $this.parent().data( 'field-id' ),
					$preview = $( `#wpforms-field-${ id }` ),
					$price = wpf.amountFormatCurrency( $( `#wpforms-field-option-${ id }-price` ).val() );

				if ( ! value ) {
					$this.val( '{price}' );
					$preview.find( '.price-label' ).html( `<span class="price"> ${ $price }  </span>` );
					return;
				}

				$preview.find( '.price-label' ).html( value.replaceAll( '{price}', `<span class="price"> ${ $price }  </span>` ) );
			} );

			// Real-time updates for payment CC icons
			$builder.on( 'change', '.wpforms-field-option-credit-card .payment-icons input', function() {
				const $this = $( this ),
					card = $this.data( 'card' ),
					id = $this.parent().data( 'field-id' );

				$( '#wpforms-field-' + id ).find( 'img.icon-' + card ).toggleClass( 'card_hide' );
			} );

			// Generic updates for various additional placeholder fields (at least Stripe's "Name on Card").
			$builder.on( 'input', '.wpforms-field-option input.placeholder-update', function( e ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					value = $this.val(),
					id = $this.data( 'field-id' ),
					subfield = $this.data( 'subfield' );

				$( '#wpforms-field-' + id ).find( '.wpforms-' + subfield + ' input' ).attr( 'placeholder', value );
			} );

			// Toggle Choice Layout advanced field option.
			$builder.on( 'change', '.wpforms-field-option-row-input_columns select', function() {
				const $this = $( this ),
					value = $this.val(),
					id = $this.parent().data( 'field-id' );

				let cls = '';

				if ( value === '2' ) {
					cls = 'wpforms-list-2-columns';
				} else if ( value === '3' ) {
					cls = 'wpforms-list-3-columns';
				} else if ( value === 'inline' ) {
					cls = 'wpforms-list-inline';
				}

				$( '#wpforms-field-' + id ).removeClass( 'wpforms-list-2-columns wpforms-list-3-columns wpforms-list-inline' ).addClass( cls );
			} );

			// Toggle the toggle field.
			$builder.on( 'change', '.wpforms-field-option-row .wpforms-toggle-control input', function( e ) { // eslint-disable-line no-unused-vars
				const $check = $( this ),
					$control = $check.closest( '.wpforms-toggle-control' ),
					$status = $control.find( '.wpforms-toggle-control-status' ),
					state = $check.is( ':checked' ) ? 'on' : 'off';

				$status.html( $status.data( state ) );
			} );

			// Real-time updates for "Dynamic Choices" field option, for Dropdown,
			// Checkboxes, and Multiple choice fields
			$builder.on( 'change', '.wpforms-field-option-row-dynamic_choices select', function( e ) { // eslint-disable-line no-unused-vars
				app.fieldDynamicChoiceToggle( $( this ) );
			} );

			// Real-time updates for "Dynamic [type] Source" field option, for Dropdown,
			// Checkboxes, and Multiple choice fields
			$builder.on( 'change', '.wpforms-field-option-row-dynamic_taxonomy select, .wpforms-field-option-row-dynamic_post_type select', function( e ) { // eslint-disable-line no-unused-vars
				app.fieldDynamicChoiceSource( $( this ) );
			} );

			// Toggle Layout selector
			$builder.on( 'click', '.toggle-layout-selector-display', function( e ) {
				e.preventDefault();
				app.fieldLayoutSelectorToggle( this );
			} );
			$builder.on( 'click', '.layout-selector-display-layout', function( e ) {
				e.preventDefault();
				app.fieldLayoutSelectorLayout( this );
			} );
			$builder.on( 'click', '.layout-selector-display-columns span', function( e ) {
				e.preventDefault();
				app.fieldLayoutSelectorInsert( this );
			} );

			// Real-time updates for a Rating field scale option.
			$( document ).on( 'change', '.wpforms-field-option-row-scale select', function() {
				const $this = $( this ),
					value = $this.val(),
					id = $this.parent().data( 'field-id' ),
					$icons = $( '#wpforms-field-' + id + ' .rating-icon' );

				let x = 1;

				$icons.each( function( index ) { // eslint-disable-line no-unused-vars
					if ( x <= value ) {
						$( this ).show();
					} else {
						$( this ).hide();
					}
					x++;
				} );
			} );

			// Real-time updates for a Rating field icon option.
			$( document ).on( 'change', '.wpforms-field-option-row-icon select', function() {
				const $this = $( this ),
					value = $this.val(),
					id = $this.parent().data( 'field-id' ),
					$icons = $( '#wpforms-field-' + id + ' .rating-icon' );

				let iconClass = 'fa-star';

				if ( 'heart' === value ) {
					iconClass = 'fa-heart';
				} else if ( 'thumb' === value ) {
					iconClass = 'fa-thumbs-up';
				} else if ( 'smiley' === value ) {
					iconClass = 'fa-smile-o';
				}

				$icons.removeClass( 'fa-star fa-heart fa-thumbs-up fa-smile-o' ).addClass( iconClass );
			} );

			// Real-time updates for a Rating field icon size option.
			$( document ).on( 'change', '.wpforms-field-option-row-icon_size select', function() {
				const $this = $( this ),
					value = $this.val(),
					id = $this.parent().data( 'field-id' ),
					$icons = $( '#wpforms-field-' + id + ' .rating-icon' );

				let fontSize = '28';

				if ( 'small' === value ) {
					fontSize = '18';
				} else if ( 'large' === value ) {
					fontSize = '38';
				}

				$icons.css( 'font-size', fontSize + 'px' );
			} );

			// Real-time updates for a Rating field icon color option.
			$( document ).on( 'input', '.wpforms-field-option-row-icon_color input.wpforms-color-picker', function() {
				const $this = $( this ),
					id = $this.closest( '.wpforms-field-option-row' ).data( 'field-id' ),
					$icons = $( '#wpforms-field-' + id + ' > i.fa' );

				$icons.css( 'color', app.getValidColorPickerValue( $this ) );
			} );

			// Real-time updates for a Checkbox field Disclaimer option.
			$( document ).on( 'change', '.wpforms-field-option-row-disclaimer_format input', function() {
				const $this = $( this ),
					id = $this.closest( '.wpforms-field-option-row' ).data( 'field-id' ),
					$desc = $( '#wpforms-field-' + id + ' .description' );

				$desc.toggleClass( 'disclaimer' );
			} );

			$builder.on(
				'change',
				'.wpforms-field-option-row-limit_enabled input',
				function( event ) {
					app.updateTextFieldsLimitControls( $( event.target ).closest( '.wpforms-field-option-row-limit_enabled' ).data().fieldId, event.target.checked );
				}
			);

			$builder.on(
				'change',
				'.wpforms-field-option-row-date_disable_past_dates input',
				function( event ) {
					app.updateDisableTodaysDateControls( $( event.target ).closest( '.wpforms-field-option-row-date_disable_past_dates' ).data().fieldId, event.target?.checked );
				}
			);

			$builder.on(
				'change',
				'.wpforms-field-option-row-password-strength input',
				function( event ) {
					app.updatePasswordStrengthControls( $( event.target ).parents( '.wpforms-field-option-row-password-strength' ).data().fieldId, event.target.checked );
				}
			);

			$builder.on(
				'change',
				'.wpforms-field-option-richtext .wpforms-field-option-row-media_enabled input',
				app.updateRichTextMediaFieldsLimitControls
			);

			$builder.on(
				'change',
				'.wpforms-field-option-richtext .wpforms-field-option-row-style select',
				app.updateRichTextStylePreview
			);

			// File uploader - change style.
			$builder
				.on(
					'change',
					'.wpforms-field-option-file-upload .wpforms-field-option-row-style select, .wpforms-field-option-file-upload .wpforms-field-option-row-max_file_number input',
					function( event ) {
						app.fieldFileUploadPreviewUpdate( event.target );
					}
				);

			// Real-time updates for Number Slider field.
			app.numberSliderEvents( $builder );

			// Hide image and icon choices if dynamic choices are not off.
			app.fieldDynamicChoiceToggleImageChoices();
			app.fieldDynamicChoiceToggleIconChoices();

			// Real-time updates for Payment field's 'Show price after item label' option.
			$builder.on( 'change', '.wpforms-field-option-row-show_price_after_labels input', function( e ) { // eslint-disable-line no-unused-vars
				const $input = $( this ),
					$list = $input.closest( '.wpforms-field-option-group-basic' ).find( '.wpforms-field-option-row-choices .choices-list' );

				app.fieldChoiceUpdate( $list.data( 'field-type' ), $list.data( 'field-id' ) );
			} );

			$builder
				.on( 'input', '.wpforms-field-option-row-preview-notice textarea', app.updatePreviewNotice )
				.on( 'change', '.wpforms-field-option-row-preview-notice-enable input', app.toggleEntryPreviewNotice )
				.on( 'wpformsFieldAdd', app.maybeLockEntryPreviewGroupOnAdd )
				.on( 'wpformsFieldMove', app.maybeLockEntryPreviewGroupOnMove )
				.on( 'click', '.wpforms-entry-preview-block', app.entryPreviewBlockField );

			app.defaultStateEntryPreviewNotice();
		},

		/**
		 * Check if we had focusout event from certain fields.
		 *
		 * @since 1.7.5
		 */
		focusOutEvent() {
			if ( elements.$focusOutTarget === null ) {
				return;
			}

			if ( elements.$defaultEmail.is( elements.$focusOutTarget ) ) {
				const $field = elements.$focusOutTarget;

				$field.next( '.wpforms-alert' ).remove();

				if ( $field.val() === '' ) {
					return;
				}

				$.get(
					wpforms_builder.ajax_url,
					{
						nonce: wpforms_builder.nonce,
						content: $field.val(),
						action: 'wpforms_sanitize_default_email',
					},
					function( res ) {
						if ( res.success ) {
							$field.val( res.data );
							$field.trigger( 'input' );

							if ( ! res.data ) {
								$field.after( '<div class="wpforms-alert-warning wpforms-alert"><p>' + wpforms_builder.restricted_default_email + '</p></div>' );
							}
						}
					}
				);
			}

			elements.$focusOutTarget = null;
		},

		/**
		 * Determine if the field is disabled for selection/duplication/deletion.
		 *
		 * @since 1.7.1
		 *
		 * @param {any} el DOM element or jQuery object of some container on the field preview.
		 *
		 * @return {boolean} True if actions are disabled.
		 */
		isFieldPreviewActionsDisabled( el ) {
			return app.isFormPreviewActionsDisabled( el ) ||
				$( el ).closest( '.wpforms-field' ).hasClass( 'ui-sortable-disabled' );
		},

		/**
		 * Determine if form wrapper has sorting locked.
		 *
		 * @since 1.7.6
		 *
		 * @param {any} el DOM element or jQuery object of some container on the field preview.
		 *
		 * @return {boolean} True when form preview wrapper sorting is disabled.
		 */
		isFormPreviewActionsDisabled( el ) {
			return $( el ).closest( '.wpforms-field-wrap' ).hasClass( 'ui-sortable-disabled' );
		},

		/**
		 * Toggle field group visibility in the field sidebar.
		 *
		 * @since 1.0.0
		 *
		 * @param {any}    el     DOM element or jQuery object.
		 * @param {string} action Action.
		 */
		fieldGroupToggle( el, action ) {
			const $this = $( el );
			let	$buttons = $this.next( '.wpforms-add-fields-buttons' );
			const $group = $buttons.parent();
			let	$icon = $this.find( 'i' ),
				groupName = $this.data( 'group' ),
				cookieName = 'wpforms_field_group_' + groupName;

			if ( action === 'click' ) {
				if ( $group.hasClass( 'wpforms-closed' ) ) {
					wpCookies.remove( cookieName );
				} else {
					wpCookies.set( cookieName, 'true', 2592000 ); // 1 month
				}
				$icon.toggleClass( 'wpforms-angle-right' );
				$buttons.stop().slideToggle( '', function() {
					$group.toggleClass( 'wpforms-closed' );
				} );

				return;
			}

			if ( action === 'load' ) {
				$buttons = $this.find( '.wpforms-add-fields-buttons' );
				$icon = $this.find( '.wpforms-add-fields-heading i' );
				groupName = $this.find( '.wpforms-add-fields-heading' ).data( 'group' );
				cookieName = 'wpforms_field_group_' + groupName;

				if ( wpCookies.get( cookieName ) === 'true' ) {
					$icon.toggleClass( 'wpforms-angle-right' );
					$buttons.hide();
					$this.toggleClass( 'wpforms-closed' );
				}
			}
		},

		/**
		 * Update description.
		 *
		 * @since 1.6.9
		 *
		 * @param {jQuery} $el   Element.
		 * @param {string} value Value.
		 */
		updateDescription( $el, value ) {
			if ( $el.hasClass( 'nl2br' ) ) {
				value = value.replace( /\n/g, '<br>' );
			}

			$el.html( value );
		},

		/**
		 * Set the default state for the entry preview notice field.
		 *
		 * @since 1.6.9
		 */
		defaultStateEntryPreviewNotice() {
			$( '.wpforms-field-option-row-preview-notice-enable input' ).each( function() {
				$( this ).trigger( 'change' );
			} );
		},

		/**
		 * Update a preview notice for the field preview.
		 *
		 * @since 1.6.9
		 */
		updatePreviewNotice() {
			const $this = $( this );
			let value = wpf.sanitizeHTML( $this.val() ).trim();
			const id = $this.parent().data( 'field-id' ),
				$field = $( '#wpforms-field-' + id ).find( '.wpforms-entry-preview-notice' );

			value = value ? value : wpforms_builder.entry_preview_default_notice;

			app.updateDescription( $field, value );
		},

		/**
		 * Show/hide entry preview notice for the field preview.
		 *
		 * @since 1.6.9
		 */
		toggleEntryPreviewNotice() {
			const $this = $( this ),
				id = $this.closest( '.wpforms-field-option' ).data( 'field-id' ),
				$field = $( '#wpforms-field-' + id ),
				$noticeField = $( '#wpforms-field-option-' + id + ' .wpforms-field-option-row-preview-notice' ),
				$notice = $field.find( '.wpforms-entry-preview-notice' ),
				$defaultNotice = $field.find( '.wpforms-alert-info' );

			if ( $this.is( ':checked' ) ) {
				$defaultNotice.hide();
				$notice.show();
				$noticeField.show();

				return;
			}

			$noticeField.hide();
			$notice.hide();
			$defaultNotice.show();
		},

		/**
		 * Delete a field.
		 *
		 * @param {number} id Field ID.
		 *
		 * @since 1.0.0
		 * @since 1.6.9 Add the entry preview logic.
		 */
		fieldDelete( id ) {
			const $field = $( '#wpforms-field-' + id ),
				type = $field.data( 'field-type' );

			if ( type === 'pagebreak' && $field.hasClass( 'wpforms-field-entry-preview-not-deleted' ) ) {
				app.youCantRemovePageBreakFieldPopup();

				return;
			}

			if ( $field.hasClass( 'no-delete' ) ) {
				app.youCantRemoveFieldPopup();

				return;
			}

			app.confirmFieldDeletion( id, type );
		},

		/**
		 * Show the error message in the popup that you cannot remove the page break field.
		 *
		 * @since 1.6.9
		 */
		youCantRemovePageBreakFieldPopup() {
			$.alert( {
				title: wpforms_builder.heads_up,
				content: wpforms_builder.entry_preview_require_page_break,
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
		},

		/**
		 * Show the error message in the popup that you cannot reorder the field.
		 *
		 * @since 1.7.1
		 * @since 1.7.7 Deprecated.
		 *
		 * @deprecated Use `WPForms.Admin.Builder.DragFields.youCantReorderFieldPopup()` instead.
		 */
		youCantReorderFieldPopup() {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Function "WPFormsBuilder.youCantReorderFieldPopup()" has been deprecated, please use the new "WPForms.Admin.Builder.DragFields.youCantReorderFieldPopup()" function instead!' );

			WPForms.Admin.Builder.DragFields.youCantReorderFieldPopup();
		},

		/**
		 * Show the error message in the popup that you cannot remove the field.
		 *
		 * @since 1.6.9
		 */
		youCantRemoveFieldPopup() {
			$.alert( {
				title: wpforms_builder.field_locked,
				content: wpforms_builder.field_locked_no_delete_msg,
				icon: 'fa fa-info-circle',
				type: 'blue',
				buttons: {
					confirm: {
						text: wpforms_builder.close,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
			} );
		},

		/**
		 * Error alert displayed for invalid From Email Notification field.
		 *
		 * @since 1.8.1
		 *
		 * @param {string} $msg Message.
		 */
		validationErrorNotificationPopup( $msg ) {
			$.alert( {
				title: wpforms_builder.heads_up,
				content: $msg,
				icon: 'fa fa-exclamation-circle',
				type: 'red',
				buttons: {
					confirm: {
						text: wpforms_builder.close,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
			} );
		},

		/**
		 * Show the confirmation popup before the field deletion.
		 *
		 * @param {number} id   Field ID.
		 * @param {string} type Field type.
		 *
		 * @since 1.6.9
		 */
		confirmFieldDeletion( id, type ) {
			const fieldData = {
				id,
				message: wpforms_builder.delete_confirm,
			};

			const event = WPFormsUtils.triggerEvent( $builder, 'wpformsBeforeFieldDeleteAlert', [ fieldData, type ] );

			// Allow callbacks on `wpformsBeforeFieldDeleteAlert` to prevent field deletion by triggering `event.preventDefault()`.
			if ( event.isDefaultPrevented() ) {
				return;
			}

			$.confirm( {
				title: false,
				content: fieldData.message,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							app.fieldDeleteById( id );
						},
					},
					cancel: {
						text: wpforms_builder.cancel,
					},
				},
			} );
		},

		/**
		 * Remove the field by ID.
		 *
		 * @since 1.6.9
		 *
		 * @param {number} id       Field ID.
		 * @param {string} type     Field type (deprecated)
		 * @param {number} duration Duration of animation.
		 */
		fieldDeleteById( id, type = '', duration = 400 ) {
			$( `#wpforms-field-${ id }` ).fadeOut( duration, function() {
				const $field = $( this );
				const $layoutParents = $field.parents( '.wpforms-field-layout-columns' );

				type = $field.data( 'field-type' );

				$builder.trigger( 'wpformsBeforeFieldDelete', [ id, type ] );

				$field.remove();
				$( '#wpforms-field-option-' + id ).remove();
				$( '.wpforms-field, .wpforms-title-desc' ).removeClass( 'active' );
				app.fieldTabToggle( 'add-fields' );

				const $fieldsOptions = $( '.wpforms-field-option' ),
					$submitButton = $builder.find( '.wpforms-field-submit' );

				// No fields remains.
				if ( $fieldsOptions.length < 1 ) {
					elements.$sortableFieldsWrap.append( elements.$noFieldsPreview.clone() );
					elements.$fieldOptions.append( elements.$noFieldsOptions.clone() );
					$submitButton.hide();
				}

				// Only Layout fields remains.
				if ( ! $fieldsOptions.filter( ':not(.wpforms-field-option-layout)' ).length ) {
					$submitButton.hide();
				}

				$builder.trigger( 'wpformsFieldDelete', [ id, type, $layoutParents ] );
			} );
		},

		/**
		 * Load entry preview fields.
		 *
		 * @since 1.6.9
		 */
		loadEntryPreviewFields() {
			const $fields = $( '#wpforms-panel-fields .wpforms-field-wrap .wpforms-field-entry-preview' );

			if ( ! $fields.length ) {
				return;
			}

			$fields.each( function() {
				app.lockEntryPreviewFieldsPosition( $( this ).data( 'field-id' ) );
			} );
		},

		/**
		 * Delete the entry preview field from the form preview.
		 *
		 * @since 1.6.9
		 *
		 * @param {Event}  event Event.
		 * @param {number} id    Field ID.
		 * @param {string} type  Field type.
		 */
		fieldEntryPreviewDelete( event, id, type ) {
			if ( 'entry-preview' !== type ) {
				return;
			}

			const $field = $( '#wpforms-field-' + id ),
				$previousPageBreakField = $field.prevAll( '.wpforms-field-pagebreak' ).first(),
				$nextPageBreakField = $field.nextAll( '.wpforms-field-pagebreak' ).first(),
				nextPageBreakId = $nextPageBreakField.data( 'field-id' ),
				$nextPageBreakOptions = $( '#wpforms-field-option-' + nextPageBreakId );

			$previousPageBreakField.removeClass( 'wpforms-field-not-draggable wpforms-field-entry-preview-not-deleted' );
			$nextPageBreakOptions.find( '.wpforms-entry-preview-block' ).removeClass( 'wpforms-entry-preview-block' );

			$builder.trigger( 'wpformsFieldDragToggle', [ $previousPageBreakField.data( 'field-id' ), $previousPageBreakField.data( 'field-type' ) ] );
		},

		/**
		 * Maybe lock the entry preview and fields nearby after move event.
		 *
		 * @since 1.6.9
		 *
		 * @param {Event}  e  Event.
		 * @param {Object} ui UI sortable object.
		 */
		maybeLockEntryPreviewGroupOnMove( e, ui ) {
			if ( ! ui.item.hasClass( 'wpforms-field-pagebreak' ) ) {
				return;
			}

			app.maybeLockEntryPreviewGroupOnAdd( e, ui.item.data( 'field-id' ), 'pagebreak' );
		},

		/**
		 * Maybe lock the entry preview and fields nearby after adding event.
		 *
		 * @since 1.6.9
		 *
		 * @param {Event}  e       Event.
		 * @param {number} fieldId Field id.
		 * @param {string} type    Field type.
		 */
		maybeLockEntryPreviewGroupOnAdd( e, fieldId, type ) {
			if ( type !== 'pagebreak' ) {
				return;
			}

			const $currentField = $( '#wpforms-field-' + fieldId ),
				$prevField = $currentField.prevAll( '.wpforms-field-entry-preview,.wpforms-field-pagebreak' ).first(),
				$nextField = $currentField.nextAll( '.wpforms-field-entry-preview,.wpforms-field-pagebreak' ).first();

			if ( ! $prevField.hasClass( 'wpforms-field-entry-preview' ) && ! $nextField.hasClass( 'wpforms-field-entry-preview' ) ) {
				return;
			}

			const $currentFieldPrevToggle = $( '#wpforms-field-option-' + fieldId + ' .wpforms-field-option-row-prev_toggle' ),
				$currentFieldPrevToggleField = $currentFieldPrevToggle.find( 'input' ),
				$nextFieldPrevToggle = $( '#wpforms-field-option-' + $nextField.data( 'field-id' ) + ' .wpforms-field-option-row-prev_toggle' );

			if ( $prevField.hasClass( 'wpforms-field-entry-preview' ) ) {
				$currentFieldPrevToggleField.attr( 'checked', 'checked' ).trigger( 'change' );
				$currentFieldPrevToggle.addClass( 'wpforms-entry-preview-block' );
				$nextFieldPrevToggle.removeClass( 'wpforms-entry-preview-block' );

				return;
			}

			const prevFieldId = $prevField.data( 'field-id' ),
				$prevFieldPrevToggle = $( '#wpforms-field-option-' + prevFieldId + ' .wpforms-field-option-row-prev_toggle' ),
				$prevFieldPrevToggleField = $prevFieldPrevToggle.find( 'input' );

			$currentField.addClass( 'wpforms-field-not-draggable wpforms-field-entry-preview-not-deleted' );
			$builder.trigger( 'wpformsFieldDragToggle', [ fieldId, type ] );
			$prevField.removeClass( 'wpforms-field-not-draggable wpforms-field-entry-preview-not-deleted' );
			$builder.trigger( 'wpformsFieldDragToggle', [ prevFieldId, $prevField.data( 'field-type' ) ] );

			if ( $prevField.prevAll( '.wpforms-field-entry-preview,.wpforms-field-pagebreak' ).first().hasClass( 'wpforms-field-entry-preview' ) ) {
				$prevFieldPrevToggleField.attr( 'checked', 'checked' ).trigger( 'change' );
				$prevFieldPrevToggle.addClass( 'wpforms-entry-preview-block' );
			}
		},

		/**
		 * Show the error popup that the entry preview field blocks the field.
		 *
		 * @since 1.6.9
		 *
		 * @param {Event} e Event.
		 */
		entryPreviewBlockField( e ) {
			e.preventDefault();

			$.alert( {
				title: wpforms_builder.heads_up,
				content: wpforms_builder.entry_preview_require_previous_button,
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
		},

		/**
		 * Is it an entry preview field that should be checked before adding?
		 *
		 * @since 1.6.9
		 *
		 * @param {string} type    Field type.
		 * @param {Object} options Field options.
		 *
		 * @return {boolean} True when we should check it.
		 */
		isUncheckedEntryPreviewField( type, options ) {
			// eslint-disable-next-line no-mixed-operators
			return type === 'entry-preview' && ( ! options || options && ! options.passed );
		},

		/**
		 * Add an entry preview field to the form preview.
		 *
		 * @since 1.6.9
		 *
		 * @param {string} type    Field type.
		 * @param {Object} options Field options.
		 */
		addEntryPreviewField( type, options ) { // eslint-disable-line complexity
			const addButton = $( '#wpforms-add-fields-entry-preview' );

			if ( addButton.hasClass( 'wpforms-entry-preview-adding' ) ) {
				return;
			}

			const $fields = $( '#wpforms-panel-fields .wpforms-field-wrap > .wpforms-field' ),
				position = options?.position ? options.position : $fields.length,
				needPageBreakBefore = app.isEntryPreviewFieldRequiresPageBreakBefore( $fields, position ),
				needPageBreakAfter = app.isEntryPreviewFieldRequiresPageBreakAfter( $fields, position );

			addButton.addClass( 'wpforms-entry-preview-adding' );

			if ( ! options ) {
				options = {};
			}

			options.passed = true;

			if ( ! needPageBreakBefore && ! needPageBreakAfter ) {
				app.fieldAdd( 'entry-preview', options ).done( function( res ) {
					app.lockEntryPreviewFieldsPosition( res.data.field.id );
				} );

				return;
			}

			if ( needPageBreakBefore ) {
				app.addPageBreakAndEntryPreviewFields( options, position );

				return;
			}

			app.addEntryPreviewAndPageBreakFields( options, position );
		},

		/**
		 * Add the entry preview field after the page break field.
		 * We should wait for the page break adding to avoid id duplication.
		 *
		 * @since 1.6.9
		 *
		 * @param {Object} options Field options.
		 */
		addEntryPreviewFieldAfterPageBreak( options ) {
			const checkExist = setInterval( function() {
				if ( $( '#wpforms-panel-fields .wpforms-field-wrap' ).find( '.wpforms-pagebreak-bottom, .wpforms-pagebreak-top' ).length === 2 ) {
					app.fieldAdd( 'entry-preview', options ).done( function( res ) {
						app.lockEntryPreviewFieldsPosition( res.data.field.id );
					} );
					clearInterval( checkExist );
				}
			}, 100 );
		},

		/**
		 * Add the entry preview field after the page break field.
		 *
		 * @since 1.6.9
		 *
		 * @param {Object} options  Field options.
		 * @param {number} position The field position.
		 */
		addPageBreakAndEntryPreviewFields( options, position ) {
			const hasPageBreak = $( '#wpforms-panel-fields .wpforms-field-wrap > .wpforms-field-pagebreak' ).length >= 3;

			app.fieldAdd( 'pagebreak', { position } ).done( function( res ) {
				options.position = hasPageBreak ? position + 1 : position + 2;
				app.addEntryPreviewFieldAfterPageBreak( options );

				const $pageBreakOptions = $( '#wpforms-field-option-' + res.data.field.id ),
					$pageBreakPrevToggle = $pageBreakOptions.find( '.wpforms-field-option-row-prev_toggle' ),
					$pageBreakPrevToggleField = $pageBreakPrevToggle.find( 'input' );

				$pageBreakPrevToggleField.attr( 'checked', 'checked' ).trigger( 'change' );
				$pageBreakPrevToggle.addClass( 'wpforms-entry-preview-block' );
			} );
		},

		/**
		 * Duplicate field.
		 *
		 * @since 1.2.9
		 *
		 * @param {string} id Field id.
		 */
		fieldDuplicate( id ) {
			const $field = $( `#wpforms-field-${ id }` );

			if ( $field.hasClass( 'no-duplicate' ) ) {
				$.alert( {
					title: wpforms_builder.field_locked,
					content: wpforms_builder.field_locked_no_duplicate_msg,
					icon: 'fa fa-info-circle',
					type: 'blue',
					buttons: {
						confirm: {
							text: wpforms_builder.close,
							btnClass: 'btn-confirm',
							keys: [ 'enter' ],
						},
					},
				} );

				return;
			}

			$.confirm( {
				title: false,
				content: wpforms_builder.duplicate_confirm,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							// Disable the current button to avoid firing multiple click events.
							// By default, "jconfirm" tends to destroy any modal DOM element upon button click.
							this.$$confirm.prop( 'disabled', true );

							const beforeEvent = WPFormsUtils.triggerEvent( $builder, 'wpformsBeforeFieldDuplicate', [ id, $field ] );

							// Allow callbacks on `wpformsFieldBeforeDuplicate` to cancel field duplication.
							if ( beforeEvent.isDefaultPrevented() ) {
								return;
							}

							const newFieldId = app.fieldDuplicateRoutine( id ),
								$newField = $( `#wpforms-field-${ newFieldId }` );

							// Lastly, update the next ID stored in the database.
							app.increaseNextFieldIdAjaxRequest();

							WPFormsUtils.triggerEvent( $builder, 'wpformsFieldDuplicated', [ id, $field, newFieldId, $newField ] );
						},
					},
					cancel: {
						text: wpforms_builder.cancel,
					},
				},
			} );
		},

		/**
		 * Update the next ID stored in the database.
		 *
		 * @since 1.7.7
		 */
		increaseNextFieldIdAjaxRequest() {
			/* eslint-disable camelcase */
			$.post(
				wpforms_builder.ajax_url,
				{
					form_id: s.formID,
					field_id: elements.$nextFieldId.val(),
					nonce: wpforms_builder.nonce,
					action: 'wpforms_builder_increase_next_field_id',
				}
			);
		},

		/**
		 * Duplicate field routine.
		 *
		 * @since 1.7.7
		 *
		 * @param {number|string} id Field ID.
		 *
		 * @return {number} New field ID.
		 */
		fieldDuplicateRoutine( id ) { // eslint-disable-line max-lines-per-function, complexity
			const $field = $( `#wpforms-field-${ id }` ),
				$fieldOptions = $( `#wpforms-field-option-${ id }` ),
				$fieldActive = elements.$sortableFieldsWrap.find( '>.active' ),
				$visibleOptions = elements.$fieldOptions.find( '>:visible' ),
				$visibleTab = $visibleOptions.find( '>.active' ),
				type = $field.data( 'field-type' ),
				fieldOptionsClass = $fieldOptions.attr( 'class' ),
				isModernDropdown = app.dropdownField.helpers.isModernSelect( $field.find( '> .choices .primary-input' ) );

			// Restore tooltips before cloning.
			wpf.restoreTooltips( $fieldOptions );

			// Force Modern Dropdown conversion to classic before cloning.
			if ( isModernDropdown ) {
				app.dropdownField.helpers.convertModernToClassic( id );
			}

			let newFieldOptions = $fieldOptions.html();

			const $newField = $field.clone(),
				newFieldID = parseInt( elements.$nextFieldId.val(), 10 ),
				$fieldLabel = $( `#wpforms-field-option-${ id }-label` ),
				fieldLabelVal = $fieldLabel.length ? $fieldLabel.val() : $( `#wpforms-field-option-${ id }-name` ).val(),
				nextID = newFieldID + 1,
				regex = {};

			const newFieldLabel = fieldLabelVal !== ''
				? `${ fieldLabelVal } ${ wpforms_builder.duplicate_copy }`
				: `${ wpforms_builder.field } #${ id } ${ wpforms_builder.duplicate_copy }`;

			regex.fieldOptionsID = new RegExp( 'ID #' + id, 'g' );
			regex.fieldID = new RegExp( 'fields\\[' + id + '\\]', 'g' );
			regex.dataFieldID = new RegExp( 'data-field-id="' + id + '"', 'g' );
			regex.referenceID = new RegExp( 'data-reference="' + id + '"', 'g' );
			regex.elementID = new RegExp( '\\b(id|for)="wpforms-(.*?)' + id + '(.*?)"', 'ig' );

			// Toggle visibility states.
			$field.after( $newField );
			$fieldActive.removeClass( 'active' );
			$newField.addClass( 'active' ).attr( {
				id: `wpforms-field-${ newFieldID }`,
				'data-field-id': newFieldID,
			} );

			// Various regexes to adjust the field options to work with the new field ID.
			regex.elementIdReplace = function( match, p1, p2, p3, offset, string ) { // eslint-disable-line no-unused-vars
				return `${ p1 }="wpforms-${ p2 }${ newFieldID }${ p3 }"`;
			};

			newFieldOptions = newFieldOptions.replace( regex.fieldOptionsID, `ID #${ newFieldID }` );
			newFieldOptions = newFieldOptions.replace( regex.fieldID, `fields[${ newFieldID }]` );
			newFieldOptions = newFieldOptions.replace( regex.dataFieldID, `data-field-id="${ newFieldID }"` );
			newFieldOptions = newFieldOptions.replace( regex.referenceID, `data-reference="${ newFieldID }"` );
			newFieldOptions = newFieldOptions.replace( regex.elementID, regex.elementIdReplace );

			// Hide all field options panels.
			$visibleOptions.hide();

			// Add a new field options panel.
			$fieldOptions.after( `<div class="${ fieldOptionsClass }" id="wpforms-field-option-${ newFieldID }" data-field-id="${ newFieldID }">${ newFieldOptions }</div>` );

			// Get a new field options panel.
			const $newFieldOptions = $( `#wpforms-field-option-${ newFieldID }` );

			// If the user duplicates an active field.
			if ( $fieldActive.data( 'field-id' ) === id && $visibleTab.length ) {
				// The following will help identify which tab from the sidebar panel settings is currently being viewed,
				// i.e., "General," "Advanced," "Smart Logic," etc.
				const visibleTabClassName = $visibleTab.attr( 'class' ).match( /wpforms-field-option-group-\S*/i )[ 0 ];
				const $newFieldOptionsTab = $newFieldOptions.find( `>.${ visibleTabClassName }` );

				// Remove any left-over state from previously duplicated options.
				$newFieldOptions.find( '>' ).removeClass( 'active' );

				// Set active tab to the same tab that was active before the duplication.
				$newFieldOptionsTab.addClass( 'active' );
			}

			// If the user duplicates an inactive field.
			if ( $fieldActive.data( 'field-id' ) !== id && $visibleTab.length ) {
				// Remove active class from the current active tab.
				$newFieldOptions.find( '>' ).removeClass( 'active' );

				// Set active tab to "General".
				$newFieldOptions.find( '>.wpforms-field-option-group-basic' ).addClass( 'active' );
			}

			// Copy over values.
			$fieldOptions.find( ':input' ).each( function( index, el ) { // eslint-disable-line complexity, no-unused-vars
				const $this = $( this ),
					name = $this.attr( 'name' );

				if ( ! name ) {
					return 'continue';
				}

				const newName = name.replace( regex.fieldID, `fields[${ newFieldID }]` ),
					type = $this.attr( 'type' );

				if ( type === 'checkbox' || type === 'radio' ) {
					if ( $this.is( ':checked' ) ) {
						$newFieldOptions.find( `[name="${ newName }"]` )
							.prop( 'checked', true )
							.attr( 'checked', 'checked' );
					} else {
						$newFieldOptions.find( `[name="${ newName }"]` )
							.prop( 'checked', false )
							.attr( 'checked', false );
					}

					return;
				}

				if ( $this.is( 'select' ) ) {
					if ( $this.find( 'option:selected' ).length ) {
						const optionVal = $this.find( 'option:selected' ).val();

						$newFieldOptions.find( `[name="${ newName }"]` )
							.find( `[value="${ optionVal }"]` )
							.prop( 'selected', true );
					}

					return;
				}

				const value = $this.val();

				if ( value === '' && $this.hasClass( 'wpforms-money-input' ) ) {
					$newFieldOptions.find( `[name="${ newName }"]` ).val(
						wpf.numberFormat( '0', wpforms_builder.currency_decimals, wpforms_builder.currency_decimal, wpforms_builder.currency_thousands )
					);
				} else {
					// We've removed the empty value check here.
					// If we are duplicating a field with no value, we should respect that.
					$newFieldOptions.find( `[name="${ newName }"]` ).val( value );
				}
			} );

			// ID adjustments.
			$newFieldOptions.find( '.wpforms-field-option-hidden-id' ).val( newFieldID );
			elements.$nextFieldId.val( nextID );

			const $newFieldLabel = type === 'html' ? $( `#wpforms-field-option-${ newFieldID }-name` ) : $( `#wpforms-field-option-${ newFieldID }-label` );

			// Adjust the label to indicate this is a copy.
			$newFieldLabel.val( newFieldLabel ).trigger( 'input' );

			// Fire field adds custom event.
			$builder.trigger( 'wpformsFieldAdd', [ newFieldID, type ] );

			// Re-init tooltips for a new field options panel.
			wpf.initTooltips();

			// Re-init Modern Dropdown.
			if ( isModernDropdown ) {
				app.dropdownField.helpers.convertClassicToModern( id );
				app.dropdownField.helpers.convertClassicToModern( newFieldID );
			}

			// Re-init instance in choices related fields.
			app.fieldChoiceUpdate( $newField.data( 'field-type' ), newFieldID );

			// Re-init color pickers.
			app.loadColorPickers();

			return newFieldID;
		},

		/**
		 * Add the entry preview field before the page break field.
		 *
		 * @since 1.6.9
		 *
		 * @param {Object} options  Field options.
		 * @param {number} position The field position.
		 */
		addEntryPreviewAndPageBreakFields( options, position ) {
			app.fieldAdd( 'entry-preview', options ).done( function( res ) {
				const entryPreviewId = res.data.field.id;

				app.fieldAdd( 'pagebreak', { position: position + 1 } ).done( function( res ) {
					app.lockEntryPreviewFieldsPosition( entryPreviewId );

					const $pageBreakField = $( '#wpforms-field-' + res.data.field.id ),
						$nextField = $pageBreakField.nextAll( '.wpforms-field-pagebreak, .wpforms-field-entry-preview' ).first();

					if ( $nextField.hasClass( 'wpforms-field-entry-preview' ) ) {
						app.lockEntryPreviewFieldsPosition( $nextField.data( 'field-id' ) );
					}
				} );
			} );
		},

		/**
		 * Stick an entry preview field after adding.
		 *
		 * @since 1.6.9
		 *
		 * @param {number} id ID.
		 */
		lockEntryPreviewFieldsPosition( id ) {
			const $entryPreviewField = $( '#wpforms-field-' + id ),
				$pageBreakField = $entryPreviewField.prevAll( '.wpforms-field-pagebreak:not(.wpforms-pagebreak-bottom)' ).first(),
				$nextPageBreakField = $entryPreviewField.nextAll( '.wpforms-field-pagebreak' ).first(),
				nextPageBreakFieldId = $nextPageBreakField.data( 'field-id' ),
				$pageBreakOptions = $( '#wpforms-field-option-' + nextPageBreakFieldId ),
				$pageBreakPrevToggle = $pageBreakOptions.find( '.wpforms-field-option-row-prev_toggle' ),
				$pageBreakPrevToggleField = $pageBreakPrevToggle.find( 'input' );

			$entryPreviewField.addClass( 'wpforms-field-not-draggable' );
			$pageBreakField.addClass( 'wpforms-field-not-draggable wpforms-field-entry-preview-not-deleted' );
			$pageBreakPrevToggleField.prop( 'checked', 'checked' ).trigger( 'change' );
			$pageBreakPrevToggle.addClass( 'wpforms-entry-preview-block' );
			$( '#wpforms-add-fields-entry-preview' ).removeClass( 'wpforms-entry-preview-adding' );

			$builder.trigger( 'wpformsFieldDragToggle', [ id, $entryPreviewField.data( 'field-type' ) ] );
			$builder.trigger( 'wpformsFieldDragToggle', [ $pageBreakField.data( 'field-id' ), $pageBreakField.data( 'field-type' ) ] );
		},

		/**
		 * An entry preview field requires a page break that locates before.
		 *
		 * @since 1.6.9
		 *
		 * @param {jQuery} $fields  List of fields in the form preview.
		 * @param {number} position The field position.
		 *
		 * @return {boolean} True if we need to add a page break field before.
		 */
		isEntryPreviewFieldRequiresPageBreakBefore( $fields, position ) {
			const $beforeFields = $fields.slice( 0, position ).filter( '.wpforms-field-pagebreak,.wpforms-field-entry-preview' );
			let needPageBreakBefore = true;

			if ( ! $beforeFields.length ) {
				return needPageBreakBefore;
			}

			$( $beforeFields.get().reverse() ).each( function() {
				const $this = $( this );

				if ( $this.hasClass( 'wpforms-field-entry-preview' ) ) {
					return false;
				}

				if ( $this.hasClass( 'wpforms-field-pagebreak' ) && ! $this.hasClass( 'wpforms-field-stick' ) ) {
					needPageBreakBefore = false;

					return false;
				}
			} );

			return needPageBreakBefore;
		},

		/**
		 * An entry preview field requires a page break that locates after.
		 *
		 * @since 1.6.9
		 *
		 * @param {jQuery} $fields  List of fields in the form preview.
		 * @param {number} position The field position.
		 *
		 * @return {boolean} True if we need to add a page break field after.
		 */
		isEntryPreviewFieldRequiresPageBreakAfter( $fields, position ) {
			const $afterFields = $fields.slice( position ).filter( '.wpforms-field-pagebreak,.wpforms-field-entry-preview' );
			let needPageBreakAfter = Boolean( $afterFields.length );

			if ( ! $afterFields.length ) {
				return needPageBreakAfter;
			}

			$afterFields.each( function() {
				const $this = $( this );

				if ( $this.hasClass( 'wpforms-field-entry-preview' ) ) {
					return false;
				}

				if ( $this.hasClass( 'wpforms-field-pagebreak' ) ) {
					needPageBreakAfter = false;

					return false;
				}
			} );

			return needPageBreakAfter;
		},

		/**
		 * Add new field.
		 *
		 * @since 1.0.0
		 * @since 1.6.4 Added hCaptcha support.
		 *
		 * @param {string} type    Field type.
		 * @param {Object} options Additional options.
		 *
		 * @return {Promise|void} jQuery.post() promise interface.
		 */
		fieldAdd( type, options ) { // eslint-disable-line max-lines-per-function
			const $btn = $( `#wpforms-add-fields-${ type }` );

			if ( $btn.hasClass( 'upgrade-modal' ) || $btn.hasClass( 'education-modal' ) || $btn.hasClass( 'warning-modal' ) ) {
				return;
			}

			if ( [ 'captcha_turnstile', 'captcha_hcaptcha', 'captcha_recaptcha', 'captcha_none' ].includes( type ) ) {
				app.captchaUpdate();

				return;
			}

			adding = true;

			WPForms.Admin.Builder.DragFields.disableDragAndDrop();
			app.disableFormActions();

			if ( app.isUncheckedEntryPreviewField( type, options ) ) {
				app.addEntryPreviewField( type, options );

				return;
			}

			const defaults = {
				position: 'bottom',
				$sortable: 'base',
				placeholder: false,
				scroll: true,
				defaults: false,
			};

			options = $.extend( {}, defaults, options );

			const data = {
				action: 'wpforms_new_field_' + type,
				id: s.formID,
				type,
				defaults: options.defaults,
				nonce: wpforms_builder.nonce,
			};

			return $.post( wpforms_builder.ajax_url, data, function( res ) { // eslint-disable-line complexity
				if ( ! res.success ) {
					wpf.debug( 'Add field AJAX call is unsuccessful:', res );

					return;
				}

				const $baseFieldsContainer = elements.$sortableFieldsWrap,
					$newField = $( res.data.preview ),
					$newOptions = $( res.data.options );

				let $fieldContainer = options.$sortable;

				adding = false;

				$newField.css( 'display', 'none' );

				if ( options.placeholder ) {
					options.placeholder.remove();
				}

				if ( options.$sortable === 'default' || ! options.$sortable.length ) {
					$fieldContainer = $baseFieldsContainer.find( '.wpforms-fields-sortable-default' );
				}

				if ( options.$sortable === 'base' || ! $fieldContainer.length ) {
					$fieldContainer = $baseFieldsContainer;
				}

				const event = WPFormsUtils.triggerEvent(
					$builder,
					'wpformsBeforeFieldAddToDOM',
					[ options, $newField, $newOptions, $fieldContainer ]
				);

				// Allow callbacks on `wpformsBeforeFieldAddToDOM` to cancel adding field
				// by triggering `event.preventDefault()`.
				if ( event.isDefaultPrevented() ) {
					return;
				}

				// Add field to the base level of fields.
				// Allow callbacks on `wpformsBeforeFieldAddToDOM` to skip adding field to the base level
				// by setting `event.skipAddFieldToBaseLevel = true`.
				if ( ! event.skipAddFieldToBaseLevel ) {
					app.fieldAddToBaseLevel( options, $newField, $newOptions );
				}

				$newField.fadeIn();

				$builder.find( '.no-fields, .no-fields-preview' ).remove();

				if ( $( '.wpforms-field-option:not(.wpforms-field-option-layout)' ).length ) {
					$builder.find( '.wpforms-field-submit' ).show();
				}

				// Scroll to the added field.
				if ( options.scroll && options.position.length ) {
					app.scrollPreviewToField( res.data.field.id );
				}

				// Update next field id hidden input value.
				elements.$nextFieldId.val( res.data.field.id + 1 );

				wpf.initTooltips();
				app.loadColorPickers();
				app.toggleAllOptionGroups();

				$builder.trigger( 'wpformsFieldAdd', [ res.data.field.id, type ] );
			} ).fail( function( xhr, textStatus, e ) { // eslint-disable-line no-unused-vars
				adding = false;

				wpf.debug( 'Add field AJAX call failed:', xhr.responseText );
			} ).always( function() {
				if ( ! adding ) {
					WPForms.Admin.Builder.DragFields.enableDragAndDrop();
					app.enableFormActions();
				}
			} );
		},

		/**
		 * Add new field to the base level of fields.
		 *
		 * @since 1.7.7
		 *
		 * @param {Object} options     Field add additional options.
		 * @param {jQuery} $newField   New field preview object.
		 * @param {jQuery} $newOptions New field options object.
		 */
		fieldAddToBaseLevel( options, $newField, $newOptions ) { // eslint-disable-line complexity
			const $baseFieldsContainer = elements.$sortableFieldsWrap,
				$baseFields = $baseFieldsContainer.children( ':not(.wpforms-field-drag-pending, .no-fields-preview)' ),
				totalBaseFields = $baseFields.length;

			const $fieldOptions = elements.$fieldOptions;

			if ( options.position === 'top' ) {
				// Add field to the top of base level fields.
				$baseFieldsContainer.prepend( $newField );
				$fieldOptions.prepend( $newOptions );

				return;
			}

			const $lastBaseField = $baseFields.last();

			if (
				options.position === 'bottom' && (
					! $lastBaseField.length ||
					! $lastBaseField.hasClass( 'wpforms-field-stick' )
				)
			) {
				// Add field to the bottom of base level fields.
				$baseFieldsContainer.append( $newField );
				$fieldOptions.append( $newOptions );

				return;
			}

			if ( options.position === 'bottom' ) {
				options.position = totalBaseFields;
			}

			if (
				options.position === totalBaseFields &&
				$lastBaseField.length && $lastBaseField.hasClass( 'wpforms-field-stick' )
			) {
				const lastBaseFieldId = $lastBaseField.data( 'field-id' );

				// Check to see if the last field we have is configured to
				// be stuck to the bottom, if so add the field above it.
				$lastBaseField.before( $newField );
				$fieldOptions.find( `#wpforms-field-option-${ lastBaseFieldId }` ).before( $newOptions );

				return;
			}

			const $fieldInPosition = $baseFields.eq( options.position );

			if ( $fieldInPosition.length ) {
				const fieldInPositionId = $fieldInPosition.data( 'field-id' );

				// Add field to a specific location.
				$fieldInPosition.before( $newField );
				$fieldOptions.find( `#wpforms-field-option-${ fieldInPositionId }` ).before( $newOptions );

				return;
			}

			// Something is wrong. Add the field. This should never occur.
			$baseFieldsContainer.append( $newField );
			$fieldOptions.append( $newOptions );
		},

		/**
		 * Scroll the preview panel to the desired field.
		 *
		 * @since 1.7.7
		 *
		 * @param {number} fieldId Field ID.
		 */
		scrollPreviewToField( fieldId ) {
			const $field = $( `#wpforms-field-${ fieldId }` ),
				scrollTop = elements.$fieldsPreviewWrap.scrollTop(),
				$layoutField = $field.closest( '.wpforms-field-layout' );

			let fieldPosition = $field.position().top;

			if ( $layoutField.length ) {
				fieldPosition = $layoutField.position().top + fieldPosition + 20;
			}

			const scrollAmount = fieldPosition > scrollTop ? fieldPosition - scrollTop : fieldPosition + scrollTop;

			elements.$fieldsPreviewWrap.scrollTop( scrollAmount );
		},

		/**
		 * Update CAPTCHA form setting.
		 *
		 * @since 1.6.4
		 *
		 * @return {Object} jqXHR.
		 */
		captchaUpdate() {
			const data = {
				action: 'wpforms_update_field_captcha',
				id: s.formID,
				nonce: wpforms_builder.nonce,
			};

			return $.post( wpforms_builder.ajax_url, data, function( res ) {
				if ( res.success ) {
					const args = {
							title: false,
							content: false,
							icon: 'fa fa-exclamation-circle',
							type: 'orange',
							boxWidth: '450px',
							buttons: {
								confirm: {
									text: wpforms_builder.ok,
									btnClass: 'btn-confirm',
									keys: [ 'enter' ],
								},
							},
						},
						$enableCheckbox = $( '#wpforms-panel-field-settings-recaptcha' );
					let caseName = res.data.current;

					$enableCheckbox.data( 'provider', res.data.provider );

					// Possible cases:
					//
					// not_configured - IF CAPTCHA is not configured in the WPForms plugin settings
					// configured_not_enabled - IF CAPTCHA is configured in WPForms plugin settings, but wasn't set in form settings
					// configured_enabled - IF CAPTCHA is configured in WPForms plugin and form settings
					if ( 'configured_not_enabled' === caseName || 'configured_enabled' === caseName ) {
						// Get a correct case name.
						caseName = $enableCheckbox.prop( 'checked' ) ? 'configured_enabled' : 'configured_not_enabled';

						// Check/uncheck a `CAPTCHA` checkbox in form setting.
						args.buttons.confirm.action = function() {
							$enableCheckbox.prop( 'checked', ( 'configured_not_enabled' === caseName ) ).trigger( 'change' );
						};
					}

					args.title = res.data.cases[ caseName ].title;
					args.content = res.data.cases[ caseName ].content;

					// Do you need a Cancel button?
					if ( res.data.cases[ caseName ].cancel ) {
						args.buttons.cancel = {
							text: wpforms_builder.cancel,
							keys: [ 'esc' ],
						};
					}

					// Call a Confirm modal.
					$.confirm( args );
				} else {
					// eslint-disable-next-line no-console
					console.log( res );
				}
			} ).fail( function( xhr, textStatus, e ) { // eslint-disable-line no-unused-vars
				// eslint-disable-next-line no-console
				console.log( xhr.responseText );
			} );
		},

		/**
		 * Disable drag & drop.
		 *
		 * @since 1.7.1
		 * @since 1.7.7 Deprecated.
		 *
		 * @deprecated Use `WPForms.Admin.Builder.DragFields.disableDragAndDrop()` instead.
		 */
		disableDragAndDrop() {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Function "WPFormsBuilder.disableDragAndDrop()" has been deprecated, please use the new "WPForms.Admin.Builder.DragFields.disableDragAndDrop()" function instead!' );

			WPForms.Admin.Builder.DragFields.disableDragAndDrop();
		},

		/**
		 * Enable drag & drop.
		 *
		 * @since 1.7.1
		 * @since 1.7.7 Deprecated.
		 *
		 * @deprecated Use `WPForms.Admin.Builder.DragFields.enableDragAndDrop()` instead.
		 */
		enableDragAndDrop() {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Function "WPFormsBuilder.enableDragAndDrop()" has been deprecated, please use the new "WPForms.Admin.Builder.DragFields.enableDragAndDrop()" function instead!' );

			WPForms.Admin.Builder.DragFields.enableDragAndDrop();
		},

		/**
		 * Disable Preview, Embed, Save form actions and Form Builder exit button.
		 *
		 * @since 1.7.4
		 */
		disableFormActions() {
			$.each(
				[
					elements.$previewButton,
					elements.$embedButton,
					elements.$saveButton,
					elements.$exitButton,
				],
				function( _index, button ) {
					button.prop( 'disabled', true ).addClass( 'wpforms-disabled' );
				}
			);
		},

		/**
		 * Enable Preview, Embed, Save form actions and Form Builder exit button.
		 *
		 * @since 1.7.4
		 */
		enableFormActions() {
			$.each(
				[
					elements.$previewButton,
					elements.$embedButton,
					elements.$saveButton,
					elements.$exitButton,
				],
				function( _index, button ) {
					button.prop( 'disabled', false ).removeClass( 'wpforms-disabled' );
				}
			);
		},

		/**
		 * Sortable fields in the builder form preview area.
		 *
		 * @since 1.0.0
		 * @since 1.7.7 Deprecated.
		 *
		 * @deprecated Use `WPForms.Admin.Builder.DragFields.initSortableFields()` instead.
		 */
		fieldSortable() {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Function "WPFormsBuilder.fieldSortable()" has been deprecated, please use the new "WPForms.Admin.Builder.DragFields.initSortableFields()" function instead!' );

			WPForms.Admin.Builder.DragFields.initSortableFields();
		},

		/**
		 * Show popup in case if field is not draggable, and cancel moving.
		 *
		 * @since 1.7.5
		 * @since 1.7.6 The showPopUp parameter added.
		 * @since 1.7.7 Deprecated.
		 *
		 * @deprecated Use `WPForms.Admin.Builder.DragFields.fieldDragDisable()` instead.
		 *
		 * @param {jQuery}  $field    A field or list of fields.
		 * @param {boolean} showPopUp Whether the pop-up should be displayed on dragging attempt.
		 */
		fieldDragDisable( $field, showPopUp = true ) {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Function "WPFormsBuilder.fieldDragDisable()" has been deprecated, please use the new "WPForms.Admin.Builder.DragFields.fieldDragDisable()" function instead!' );

			WPForms.Admin.Builder.DragFields.fieldDragDisable( $field, showPopUp );
		},

		/**
		 * Allow field dragging.
		 *
		 * @since 1.7.5
		 * @since 1.7.7 Deprecated.
		 *
		 * @deprecated Use `WPForms.Admin.Builder.DragFields.fieldDragEnable()` instead.
		 *
		 * @param {jQuery} $field A field or list of fields.
		 */
		fieldDragEnable( $field ) {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Function "WPFormsBuilder.fieldDragEnable()" has been deprecated, please use the new "WPForms.Admin.Builder.DragFields.fieldDragEnable()" function instead!' );

			WPForms.Admin.Builder.DragFields.fieldDragEnable( $field );
		},

		/**
		 * Add new field choice.
		 *
		 * @since 1.0.0
		 *
		 * @param {Event}   event Event.
		 * @param {Element} el    Element.
		 */
		fieldChoiceAdd( event, el ) {
			event.preventDefault();

			const $this = $( el ),
				$parent = $this.parent(),
				checked = $parent.find( 'input.default' ).is( ':checked' ),
				fieldID = $this.closest( '.wpforms-field-option-row-choices' ).data( 'field-id' );
			let id = $parent.parent().attr( 'data-next-id' );
			const type = $parent.parent().data( 'field-type' ),
				$choice = $parent.clone().insertAfter( $parent );

			$choice.attr( 'data-key', id );
			$choice.find( 'input.label' ).val( '' ).attr( 'name', 'fields[' + fieldID + '][choices][' + id + '][label]' );
			$choice.find( 'input.value' ).val( '' ).attr( 'name', 'fields[' + fieldID + '][choices][' + id + '][value]' );
			$choice.find( '.wpforms-image-upload input.source' ).val( '' ).attr( 'name', 'fields[' + fieldID + '][choices][' + id + '][image]' );
			$choice.find( '.wpforms-icon-select input.source-icon' ).val( wpforms_builder.icon_choices.default_icon ).attr( 'name', 'fields[' + fieldID + '][choices][' + id + '][icon]' );
			$choice.find( '.wpforms-icon-select input.source-icon-style' ).val( wpforms_builder.icon_choices.default_icon_style ).attr( 'name', 'fields[' + fieldID + '][choices][' + id + '][icon_style]' );
			$choice.find( '.wpforms-icon-select .ic-fa-preview' ).removeClass().addClass( 'ic-fa-preview ic-fa-' + wpforms_builder.icon_choices.default_icon_style + ' ic-fa-' + wpforms_builder.icon_choices.default_icon );
			$choice.find( '.wpforms-icon-select .ic-fa-preview + span' ).text( wpforms_builder.icon_choices.default_icon );
			$choice.find( 'input.default' ).attr( 'name', 'fields[' + fieldID + '][choices][' + id + '][default]' ).prop( 'checked', false );
			$choice.find( '.preview' ).empty();
			$choice.find( '.wpforms-image-upload-add' ).show();
			$choice.find( '.wpforms-money-input' ).trigger( 'focusout' );

			if ( checked === true ) {
				$parent.find( 'input.default' ).prop( 'checked', true );
			}

			id++;

			$parent.parent().attr( 'data-next-id', id );
			$builder.trigger( 'wpformsFieldChoiceAdd', [ fieldID ] );
			app.fieldChoiceUpdate( type, fieldID );
		},

		/**
		 * Delete field choice.
		 *
		 * @since 1.0.0
		 *
		 * @param {Event}   e  Event.
		 * @param {Element} el Element.
		 */
		fieldChoiceDelete( e, el ) {
			e.preventDefault();

			const $this = $( el ),
				$list = $this.parent().parent(),
				total = $list.find( 'li' ).length,
				fieldData = {
					id: $list.data( 'field-id' ),
					choiceId: $this.closest( 'li' ).data( 'key' ),
					message: '<strong>' + wpforms_builder.delete_choice_confirm + '</strong>',
					trigger: false,
				};

			$builder.trigger( 'wpformsBeforeFieldDeleteAlert', [ fieldData ] );

			if ( total === 1 ) {
				app.fieldChoiceDeleteAlert();
			} else {
				const deleteChoice = function() {
					$this.parent().remove();
					app.fieldChoiceUpdate( $list.data( 'field-type' ), $list.data( 'field-id' ) );
					$builder.trigger( 'wpformsFieldChoiceDelete', [ $list.data( 'field-id' ) ] );
				};

				if ( ! fieldData.trigger ) {
					deleteChoice();

					return;
				}

				$.confirm( {
					title: false,
					content: fieldData.message,
					icon: 'fa fa-exclamation-circle',
					type: 'orange',
					buttons: {
						confirm: {
							text: wpforms_builder.ok,
							btnClass: 'btn-confirm',
							keys: [ 'enter' ],
							action() {
								deleteChoice();
							},
						},
						cancel: {
							text: wpforms_builder.cancel,
						},
					},
				} );
			}
		},

		/**
		 * Field choice delete error alert.
		 *
		 * @since 1.6.7
		 */
		fieldChoiceDeleteAlert() {
			$.alert( {
				title: false,
				content: wpforms_builder.error_choice,
				icon: 'fa fa-info-circle',
				type: 'blue',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
			} );
		},

		/**
		 * Make field choices sortable.
		 * Currently used for select, radio, and checkboxes field types.
		 *
		 * @since 1.0.0
		 *
		 * @param {string}           type     Type.
		 * @param {string|undefined} selector Selector.
		 */
		fieldChoiceSortable( type, selector = undefined ) {
			selector = typeof selector !== 'undefined' ? selector : '.wpforms-field-option-' + type + ' .wpforms-field-option-row-choices ul';

			$( selector ).sortable( {
				items: 'li',
				axis: 'y',
				delay: 100,
				opacity: 0.6,
				handle: '.move',
				stop( e, ui ) {
					const id = ui.item.parent().data( 'field-id' );
					app.fieldChoiceUpdate( type, id );
					$builder.trigger( 'wpformsFieldChoiceMove', ui );
				},
				update( e, ui ) { // eslint-disable-line no-unused-vars
				},
			} );
		},

		/**
		 * Generate Choice label. Used in field preview template.
		 *
		 * @since 1.6.2
		 *
		 * @param {Object} data     Template data.
		 * @param {number} choiceID Choice ID.
		 *
		 * @return {string} Label.
		 */
		fieldChoiceLabel( data, choiceID ) { // eslint-disable-line complexity
			const isPaymentChoice = [ 'payment-multiple', 'payment-checkbox' ].includes( data.settings.type ),
				isIconImageChoice = data.settings.choices_icons || data.settings.choices_images,
				isEmptyLabel = typeof data.settings.choices[ choiceID ].label === 'undefined' || data.settings.choices[ choiceID ].label.length === 0;

			// Do not set a placeholder for an empty label in Icon and Image choices except for payment fields.
			if ( isEmptyLabel && ! isPaymentChoice && isIconImageChoice ) {
				return '';
			}

			const placeholder = isPaymentChoice ? wpforms_builder.payment_choice_empty_label_tpl : wpforms_builder.choice_empty_label_tpl;
			let label = ! isEmptyLabel
				? wpf.sanitizeHTML( data.settings.choices[ choiceID ].label, wpforms_builder.allowed_label_html_tags )
				: placeholder.replace( '{number}', choiceID );

			if ( data.settings.show_price_after_labels ) {
				label += ' - ' + wpf.amountFormatCurrency( data.settings.choices[ choiceID ].value );
			}

			return label;
		},

		/**
		 * Update field choices in the preview area for the Fields panel.
		 *
		 * Currently used for select, radio, and checkboxes field types.
		 *
		 * @param {string}        type  Field type.
		 * @param {string|number} id    Field ID.
		 * @param {number}        count Number of choices to show, -1 if not set.
		 *
		 * @since 1.0.0
		 */
		fieldChoiceUpdate: ( type, id, count = -1 ) => { // eslint-disable-line complexity, max-lines-per-function
			const isDynamicChoices = app.dropdownField.helpers.isDynamicChoices( id );

			if ( app.replaceChoicesWithTemplate( type, id, isDynamicChoices ) ) {
				return;
			}

			if ( count === -1 ) {
				count = app.settings.choicesLimitLong;
			}

			// Dropdown payment choices are of select type.
			if ( 'payment-select' === type ) {
				type = 'select';
			}

			const $primary = $( '#wpforms-field-' + id + ' .primary-input' );

			let newChoice = '';

			if ( 'select' === type ) {
				if ( ! isDynamicChoices ) {
					newChoice = '<option value="{label}">{label}</option>';
					$primary.find( 'option' ).not( '.placeholder' ).remove();
				}
			} else if ( 'radio' === type || 'checkbox' === type || 'gdpr-checkbox' === type ) {
				type = 'gdpr-checkbox' === type ? 'checkbox' : type;
				$primary.find( 'li' ).remove();
				newChoice = '<li><input type="' + type + '" disabled>{label}</li>';
			}

			// Building an inner content for Primary field.
			const $choicesList = $( '#wpforms-field-option-row-' + id + '-choices .choices-list' ),
				$choicesToRender = $choicesList.find( 'li' ).slice( 0, count ),
				hasDefaults = !! $choicesList.find( 'input.default:checked' ).length,
				modernSelectChoices = [],
				showPriceAfterLabels = $( '#wpforms-field-option-' + id + '-show_price_after_labels' ).prop( 'checked' ),
				isModernSelect = app.dropdownField.helpers.isModernSelect( $primary );

			$choicesToRender.get().forEach( function( item ) {// eslint-disable-line complexity
				const $this = $( item ),
					value = $this.find( 'input.value' ).val(),
					choiceID = $this.data( 'key' );

				let label = wpf.sanitizeHTML( $this.find( 'input.label' ).val().trim(), wpforms_builder.allowed_label_html_tags ),
					$choice;

				label = label !== '' ? label : wpforms_builder.choice_empty_label_tpl.replace( '{number}', choiceID );
				label += ( showPriceAfterLabels && value ) ? ' - ' + wpf.amountFormatCurrency( value ) : '';

				// Append a new choice.
				if ( ! isModernSelect ) {
					if ( ! isDynamicChoices ) {
						$choice = $( newChoice.replace( /{label}/g, label ) );
						$primary.append( $choice );
					}
				} else {
					modernSelectChoices.push(
						{
							value: label,
							label,
						}
					);
				}

				const selected = $this.find( 'input.default' ).is( ':checked' );

				if ( true === selected ) {
					switch ( type ) {
						case 'select':

							if ( ! isModernSelect ) {
								app.setClassicSelectedChoice( $choice );
							} else {
								modernSelectChoices[ modernSelectChoices.length - 1 ].selected = true;
							}
							break;
						case 'radio':
						case 'checkbox':
							$choice.find( 'input' ).prop( 'checked', 'true' );
							break;
					}
				}
			} );

			if ( isModernSelect ) {
				const placeholderClass = $primary.prop( 'multiple' ) ? 'input.choices__input' : '.choices__inner .choices__placeholder',
					choicesjsInstance = app.dropdownField.helpers.getInstance( $primary );

				if ( ! isDynamicChoices ) {
					choicesjsInstance.removeActiveItems();
				}

				choicesjsInstance.setChoices( modernSelectChoices, 'value', 'label', true );

				// Re-initialize modern dropdown to properly determine and update placeholder.
				app.dropdownField.helpers.update( id, isDynamicChoices );

				// Hide/show a placeholder for Modern select if it has or not default choices.
				$primary
					.closest( '.choices' )
					.find( placeholderClass )
					.toggleClass( 'wpforms-hidden', hasDefaults );
			}
		},

		/**
		 * Generate Choice label. Used in field preview template.
		 *
		 * @since 1.8.6
		 *
		 * @param {string}  type             Field type.
		 * @param {number}  id               Field ID.
		 * @param {boolean} isDynamicChoices Whether the field has dynamic choices.
		 *
		 * @return {boolean} True if the template was used.
		 */
		replaceChoicesWithTemplate: ( type, id, isDynamicChoices ) => { // eslint-disable-line complexity
			// Radio, Checkbox, and Payment Multiple/Checkbox use _ template.
			if ( 'radio' !== type && 'checkbox' !== type && 'payment-multiple' !== type && 'payment-checkbox' !== type ) {
				return false;
			}

			const order = wpf.getChoicesOrder( id ),
				tmpl = wp.template( 'wpforms-field-preview-checkbox-radio-payment-multiple' );

			const fieldSettings = wpf.getField( id ),
				slicedChoices = {},
				slicedOrder = order.slice( 0, app.settings.choicesLimit ),
				data = {
					settings: fieldSettings,
					order: slicedOrder,
					type: 'radio',
				};

			// If Icon Choices is on, get the valid color.
			if ( fieldSettings.choices_icons ) {
				// eslint-disable-next-line camelcase
				data.settings.choices_icons_color = app.getValidColorPickerValue( $( '#wpforms-field-option-' + id + '-choices_icons_color' ) );
			}

			// Slice choices for preview.
			slicedOrder.forEach( function( entry ) {
				slicedChoices[ entry ] = fieldSettings.choices[ entry ];
			} );

			fieldSettings.choices = slicedChoices;

			if ( 'checkbox' === type || 'payment-checkbox' === type ) {
				data.type = 'checkbox';
			}

			if ( ! isDynamicChoices ) {
				$( '#wpforms-field-' + id ).find( 'ul.primary-input' ).replaceWith( tmpl( data ) );
			}

			// Toggle limit choices alert message.
			app.firstNChoicesAlert( id, order.length );

			return true;
		},

		/**
		 * Set classic selected choice.
		 *
		 * @since 1.8.2.3
		 *
		 * @param {jQuery|undefined} $choice Choice option.
		 */
		setClassicSelectedChoice( $choice ) {
			if ( $choice === undefined ) {
				return;
			}

			$choice.prop( 'selected', 'true' );
		},

		/**
		 * Field choice bulk add toggling.
		 *
		 * @since 1.3.7
		 *
		 * @param {Object} el jQuery object.
		 */
		fieldChoiceBulkAddToggle( el ) {
			const $this = $( el ),
				$label = $this.closest( 'label' );

			if ( $this.hasClass( 'bulk-add-showing' ) ) {
				// "Import details" is showing, so hide/remove it.
				const $selector = $label.next( '.bulk-add-display' );

				$selector.slideUp( 400, function() {
					$selector.remove();
				} );

				$this.find( 'span' ).text( wpforms_builder.bulk_add_show );
			} else {
				let importOptions = '<div class="bulk-add-display unfoldable-cont">';

				importOptions += '<p class="heading wpforms-clear">' + wpforms_builder.bulk_add_heading + ' <a href="#" class="toggle-bulk-add-presets">' + wpforms_builder.bulk_add_presets_show + '</a></p>';
				importOptions += '<ul>';

				for ( const key in wpforms_preset_choices ) {
					importOptions += '<li><a href="#" data-preset="' + key + '" class="bulk-add-preset-insert">' + wpforms_preset_choices[ key ].name + '</a></li>';
				}

				importOptions += '</ul>';
				importOptions += '<textarea placeholder="' + wpforms_builder.bulk_add_placeholder + '"></textarea>';
				importOptions += '<button class="bulk-add-insert wpforms-btn wpforms-btn-sm wpforms-btn-blue">' + wpforms_builder.bulk_add_button + '</button>';
				importOptions += '</div>';

				$label.after( importOptions );
				$label.next( '.bulk-add-display' ).slideDown( 400, function() {
					$( this ).find( 'textarea' ).trigger( 'focus' );
				} );
				$this.find( 'span' ).text( wpforms_builder.bulk_add_hide );
			}

			$this.toggleClass( 'bulk-add-showing' );
		},

		/**
		 * Field choice bulk insert the new choices.
		 *
		 * @since 1.3.7
		 *
		 * @param {Object} el DOM element.
		 */
		fieldChoiceBulkAddInsert( el ) {
			const $this = $( el ),
				$container = $this.closest( '.wpforms-field-option-row' ),
				$textarea = $container.find( 'textarea' ),
				$list = $container.find( '.choices-list' ),
				$choice = $list.find( 'li:first-of-type' ).clone().wrap( '<div>' ).parent();
			let choice = '';
			const fieldID = $container.data( 'field-id' ),
				type = $list.data( 'field-type' );
			let nextID = Number( $list.attr( 'data-next-id' ) );
			const newValues = $textarea.val().split( '\n' );
			let newChoices = '';

			$this.prop( 'disabled', true ).html( $this.html() + ' ' + s.spinner );
			$choice.find( 'input.value,input.label' ).attr( 'value', '' );
			$choice.find( 'input.default' ).attr( 'checked', false );
			$choice.find( 'input.source-icon' ).attr( 'value', wpforms_builder.icon_choices.default_icon );
			$choice.find( 'input.source-icon-style' ).attr( 'value', wpforms_builder.icon_choices.default_icon_style );
			$choice.find( '.ic-fa-preview' ).removeClass().addClass( `ic-fa-preview ic-fa-${ wpforms_builder.icon_choices.default_icon_style } ic-fa-${ wpforms_builder.icon_choices.default_icon }` );
			$choice.find( '.ic-fa-preview + span' ).text( wpforms_builder.icon_choices.default_icon );
			choice = $choice.html();

			for ( const key in newValues ) {
				if ( ! newValues.hasOwnProperty( key ) ) {
					continue;
				}

				const value = wpf.sanitizeHTML( newValues[ key ] ).trim().replace( /"/g, '&quot;' );
				let newChoice = choice;

				newChoice = newChoice.replace( /\[choices\]\[(\d+)\]/g, '[choices][' + nextID + ']' );
				newChoice = newChoice.replace( /data-key="(\d+)"/g, 'data-key="' + nextID + '"' );
				newChoice = newChoice.replace( /value="" class="label"/g, 'value="' + value + '" class="label"' );

				// For some reason, IE has its own attribute order.
				newChoice = newChoice.replace( /class="label" type="text" value=""/g, 'class="label" type="text" value="' + value + '"' );
				newChoices += newChoice;
				nextID++;
			}

			$list.attr( 'data-next-id', nextID ).append( newChoices );

			app.fieldChoiceUpdate( type, fieldID, nextID );
			$builder.trigger( 'wpformsFieldChoiceAdd' );
			app.fieldChoiceBulkAddToggle( $container.find( '.toggle-bulk-add-display' ) );
		},

		/**
		 * Trigger $builder event.
		 *
		 * @since 1.9.1
		 *
		 * @param {string} event Event name.
		 */
		triggerBuilderEvent( event ) {
			$builder.trigger( event );
		},

		/**
		 * Toggle fields tabs (Add Fields, Field Options).
		 *
		 * @since 1.0.0
		 *
		 * @param {number|string} id Field Id or `add-fields` or `field-options`.
		 *
		 * @return {false|void} False if event is prevented.
		 */
		fieldTabToggle( id ) {
			const event = WPFormsUtils.triggerEvent( $builder, 'wpformsFieldTabToggle', [ id ] );

			// Allow callbacks on `wpformsFieldTabToggle` to cancel tab toggle by triggering `event.preventDefault()`.
			if ( event.isDefaultPrevented() ) {
				return false;
			}

			$( '.wpforms-tab a' ).removeClass( 'active' );
			$( '.wpforms-field, .wpforms-title-desc' ).removeClass( 'active' );

			if ( id === 'add-fields' ) {
				elements.$addFieldsTab.addClass( 'active' );
				$( '.wpforms-field-options' ).hide();
				$( '.wpforms-add-fields' ).show();
			} else {
				$( '#field-options a' ).addClass( 'active' );

				if ( id === 'field-options' ) {
					const $field = $( '.wpforms-field' ).first();

					$field.addClass( 'active' );
					id = $field.data( 'field-id' );
				} else {
					$( '#wpforms-field-' + id ).addClass( 'active' );
				}

				$( '.wpforms-field-option' ).hide();
				$( '#wpforms-field-option-' + id ).show();
				$( '.wpforms-add-fields' ).hide();
				$( '.wpforms-field-options' ).show();

				$builder.trigger( 'wpformsFieldOptionTabToggle', [ id ] );
			}
		},

		/**
		 * Watches fields being added and listens for a pagebreak field.
		 *
		 * If a pagebreak field is added, and it's the first one, then we
		 * automatically add the top and bottom pagebreak elements to the
		 * builder.
		 *
		 * @param {Object} event Current DOM event.
		 * @param {number} id    Field ID.
		 * @param {string} type  Field type.
		 *
		 * @since 1.2.1
		 */
		fieldPagebreakAdd( event, id, type ) {
			/* eslint-disable camelcase */

			if ( 'pagebreak' !== type ) {
				return;
			}

			let options;

			if ( ! s.pagebreakTop ) {
				s.pagebreakTop = true;
				options = {
					position: 'top',
					scroll: false,
					defaults: {
						position: 'top',
						nav_align: 'left',
					},
				};

				app.fieldAdd( 'pagebreak', options ).done( function( res ) {
					s.pagebreakTop = res.data.field.id;

					const $preview = $( '#wpforms-field-' + res.data.field.id ),
						$options = $( '#wpforms-field-option-' + res.data.field.id );

					$options.find( '.wpforms-field-option-group' ).addClass( 'wpforms-pagebreak-top' );
					$preview.addClass( 'wpforms-field-stick wpforms-pagebreak-top' );
				} );
			} else if ( ! s.pagebreakBottom ) {
				s.pagebreakBottom = true;
				options = {
					position: 'bottom',
					scroll: false,
					defaults: {
						position: 'bottom',
					},
				};
				app.fieldAdd( 'pagebreak', options ).done( function( res ) {
					s.pagebreakBottom = res.data.field.id;

					const $preview = $( '#wpforms-field-' + res.data.field.id ),
						$options = $( '#wpforms-field-option-' + res.data.field.id );

					$options.find( '.wpforms-field-option-group' ).addClass( 'wpforms-pagebreak-bottom' );
					$preview.addClass( 'wpforms-field-stick wpforms-pagebreak-bottom' );
				} );
			}
		},

		/**
		 * Watches fields being deleted and listens for a pagebreak field.
		 *
		 * If a pagebreak field is added, and it's the first one, then we
		 * automatically add the top and bottom pagebreak elements to the
		 * builder.
		 *
		 * @param {Object} event Current DOM event.
		 * @param {number} id    Field ID.
		 * @param {string} type  Field type.
		 *
		 * @since 1.2.1
		 */
		fieldPagebreakDelete( event, id, type ) {
			if ( 'pagebreak' !== type ) {
				return;
			}

			const pagebreaksRemaining = $( '#wpforms-panel-fields .wpforms-field-pagebreak' ).not( '.wpforms-pagebreak-top, .wpforms-pagebreak-bottom' ).length;

			if ( pagebreaksRemaining ) {
				return;
			}

			// All pagebreaks, excluding top/bottom, are gone.
			// So we need to remove the top and bottom pagebreak.
			const $preview = $( '#wpforms-panel-fields .wpforms-preview-wrap' ),
				$top = $preview.find( '.wpforms-pagebreak-top' ),
				topID = $top.data( 'field-id' ),
				$bottom = $preview.find( '.wpforms-pagebreak-bottom' ),
				bottomID = $bottom.data( 'field-id' );

			$top.remove();
			$( '#wpforms-field-option-' + topID ).remove();
			s.pagebreakTop = false;
			$bottom.remove();
			$( '#wpforms-field-option-' + bottomID ).remove();
			s.pagebreakBottom = false;
		},

		/**
		 * Init Display Previous option for Pagebreak field.
		 *
		 * @since 1.5.8
		 *
		 * @param {jQuery} $field Page Break field jQuery object.
		 */
		fieldPageBreakInitDisplayPrevious( $field ) {
			const id = $field.data( 'field-id' ),
				$prevToggle = $( '#wpforms-field-option-row-' + id + '-prev_toggle' ),
				$prev = $( '#wpforms-field-option-row-' + id + '-prev' ),
				$prevBtn = $field.find( '.wpforms-pagebreak-prev' );

			if ( $field.prevAll( '.wpforms-field-pagebreak.wpforms-pagebreak-normal' ).length > 0 ) {
				$prevToggle.removeClass( 'hidden' );
				$prev.removeClass( 'hidden' );
				if ( $prevToggle.find( 'input' ).is( ':checked' ) ) {
					$prevBtn.removeClass( 'wpforms-hidden' ).text( $prev.find( 'input' ).val() );
				}
			} else {
				$prevToggle.addClass( 'hidden' );
				$prev.addClass( 'hidden' );
				$prevBtn.addClass( 'wpforms-hidden' );
			}
		},

		/**
		 * Field Dynamic Choice toggle.
		 *
		 * @since 1.2.8
		 *
		 * @param {Element} el Element.
		 */
		fieldDynamicChoiceToggle( el ) { // eslint-disable-line complexity, max-lines-per-function
			let optionHTML;
			const $this = $( el ),
				$thisOption = $this.parent(),
				value = $this.val(),
				id = $thisOption.data( 'field-id' );
			const $choices = $( '#wpforms-field-option-row-' + id + '-choices' ),
				$images = $( '#wpforms-field-option-' + id + '-choices_images' ),
				$icons = $( '#wpforms-field-option-' + id + '-choices_icons' ),
				$basicOptions = $( `#wpforms-field-option-basic-${ id }` );

			// Hide image and icon choices if "dynamic choices" is not off.
			app.fieldDynamicChoiceToggleImageChoices();
			app.fieldDynamicChoiceToggleIconChoices();

			// Fire an event when a field's dynamic choices option was changed.
			$builder.trigger( 'wpformsFieldDynamicChoiceToggle', [ id ] );

			// Loading
			wpf.fieldOptionLoading( $thisOption );

			// Remove previous dynamic post type or taxonomy source options.
			$( '#wpforms-field-option-row-' + id + '-dynamic_post_type' ).remove();
			$( '#wpforms-field-option-row-' + id + '-dynamic_taxonomy' ).remove();

			/*
			 * Post type- or Taxonomy-based dynamic populating.
			 */
			if ( '' !== value ) {
				// Hide choice images and icons options, not applicable.
				$images.addClass( 'wpforms-hidden' );
				$icons.addClass( 'wpforms-hidden' );

				// Hide `Bulk Add` toggle.
				$choices.find( '.toggle-bulk-add-display' ).addClass( 'wpforms-hidden' );

				// Hide AI Choices button.
				$basicOptions.find( '.wpforms-ai-choices-button' ).addClass( 'wpforms-hidden' );

				const data = {
					type: value,
					field_id: id, // eslint-disable-line camelcase
					action: 'wpforms_builder_dynamic_choices',
					nonce: wpforms_builder.nonce,
				};

				$.post( wpforms_builder.ajax_url, data, function( res ) {
					if ( res.success ) {
						// New option markup.
						$thisOption.after( res.data.markup );
					} else {
						// eslint-disable-next-line no-console
						console.log( res );
					}

					// Hide loading indicator.
					wpf.fieldOptionLoading( $thisOption, true );

					// Re-init tooltips for new field.
					wpf.initTooltips();

					// Trigger Dynamic source updates.
					const $dynamicValue = $( '#wpforms-field-option-' + id + '-dynamic_' + value );

					$dynamicValue.find( 'option' ).first().prop( 'selected', true );
					$dynamicValue.trigger( 'change' );
				} ).fail( function( xhr, textStatus, e ) { // eslint-disable-line no-unused-vars
					// eslint-disable-next-line no-console
					console.log( xhr.responseText );
				} );

				return; // Nothing more for dynamic populating.
			}

			/*
			 * "Off" - no dynamic populating.
			 */

			let type = $( '#wpforms-field-option-' + id ).find( '.wpforms-field-option-hidden-type' ).val();

			// Show choice images and icon options.
			$images.removeClass( 'wpforms-hidden' );
			$icons.removeClass( 'wpforms-hidden' );

			// Show `Bulk Add` toggle.
			$choices.find( '.toggle-bulk-add-display' ).removeClass( 'wpforms-hidden' );

			// Show AI Choices button.
			$basicOptions.find( '.wpforms-ai-choices-button' ).removeClass( 'wpforms-hidden' );

			const $wpformsField = $( '#wpforms-field-' + id );

			$wpformsField.find( '.wpforms-alert' ).remove();

			if ( [ 'checkbox', 'radio', 'payment-multiple', 'payment-checkbox' ].indexOf( type ) > -1 ) {
				app.fieldChoiceUpdate( type, id );

				// Toggle elements and hide loading indicator.
				$choices.find( 'ul' ).removeClass( 'wpforms-hidden' );
				$choices.find( '.wpforms-alert' ).addClass( 'wpforms-hidden' );

				wpf.fieldOptionLoading( $thisOption, true );

				return; // Nothing more for those types.
			}

			// Get original field choices.
			const $field = $wpformsField;

			const choices = [],
				$primary = $field.find( '.primary-input' );
			let key;

			$( '#wpforms-field-option-row-' + id + '-choices li' ).each( function() {
				const $this = $( this );

				choices.push( {
					label: wpf.sanitizeHTML( $this.find( '.label' ).val() ),
					selected: $this.find( '.default' ).is( ':checked' ),
				} );
			} );

			// Restore field to display original field choices.
			if ( $field.hasClass( 'wpforms-field-select' ) ) {
				const isModernSelect = app.dropdownField.helpers.isModernSelect( $primary );

				let selected = false;

				// Remove previous items.
				$primary.find( 'option' ).not( '.placeholder' ).remove();

				// Update Modern Dropdown.
				if ( isModernSelect && choices.length ) {
					app.dropdownField.helpers.update( id, false );
				} else {
					// Update Classic select field.
					for ( key in choices ) {
						selected = choices[ key ].selected;

						optionHTML = '<option';
						optionHTML += selected ? ' selected>' : '>';
						optionHTML += choices[ key ].label + '</option>';

						$primary.append( optionHTML );
					}
				}
			} else {
				type = 'radio';

				if ( $field.hasClass( 'wpforms-field-checkbox' ) ) {
					type = 'checkbox';
				}

				// Remove previous items.
				$primary.empty();

				// Add new items to radio or checkbox field.
				for ( key in choices ) {
					optionHTML = '<li><input type="' + type + '" disabled';
					optionHTML += choices[ key ].selected ? ' selected>' : '>';
					optionHTML += choices[ key ].label + '</li>';

					$primary.append( optionHTML );
				}
			}

			// Toggle elements and hide loading indicator.
			$choices.find( 'ul' ).removeClass( 'wpforms-hidden' );
			$choices.find( '.wpforms-alert' ).addClass( 'wpforms-hidden' );
			$primary.removeClass( 'wpforms-hidden' );

			wpf.fieldOptionLoading( $thisOption, true );
		},

		/**
		 * Field Dynamic Choice Source toggle.
		 *
		 * @since 1.2.8
		 *
		 * @param {Element} el Element.
		 */
		fieldDynamicChoiceSource( el ) { // eslint-disable-line max-lines-per-function
			/* eslint-disable camelcase */
			const $this = $( el ),
				$thisOption = $this.parent(),
				value = $this.val(),
				id = $thisOption.data( 'field-id' ),
				form_id = $( '#wpforms-builder-form' ).data( 'id' ),
				$choices = $( '#wpforms-field-option-row-' + id + '-choices' ),
				$field = $( '#wpforms-field-' + id ),
				type = $( '#wpforms-field-option-' + id + '-dynamic_choices option:selected' ).val();
			let limit = 20;

			// Loading.
			wpf.fieldOptionLoading( $thisOption );

			const data = {
				type,
				source: value,
				field_id: id,
				form_id,
				action: 'wpforms_builder_dynamic_source',
				nonce: wpforms_builder.nonce,
			};

			$.post( wpforms_builder.ajax_url, data, function( res ) {
				if ( ! res.success ) {
					// eslint-disable-next-line no-console
					console.log( res );

					// Toggle elements and hide loading indicator.
					wpf.fieldOptionLoading( $thisOption, true );
					return;
				}

				// Update info box and remove old choices.
				$choices.find( '.dynamic-name' ).text( res.data.source_name );
				$choices.find( '.dynamic-type' ).text( res.data.type_name );
				$choices.find( 'ul' ).addClass( 'wpforms-hidden' );
				$choices.find( '.wpforms-alert' ).removeClass( 'wpforms-hidden' );

				// Update items.
				app.fieldDynamicChoiceSourceItems( $field, res.data.items );

				if ( $field.hasClass( 'wpforms-field-select' ) ) {
					limit = 200;
				}

				// Remove any previous empty message.
				$field.find( '.wpforms-notice-dynamic-empty' ).remove();

				// If the source has more items than the field type can
				// ideally handle alert the user.
				if ( Number( res.data.total ) > limit ) {
					let msg = wpforms_builder.dynamic_choices.limit_message;

					msg = msg.replace( '{source}', res.data.source_name );
					msg = msg.replace( '{type}', res.data.type_name );
					msg = msg.replace( '{limit}', limit );
					msg = msg.replace( '{total}', res.data.total );

					$.alert( {
						title: wpforms_builder.heads_up,
						content: msg,
						icon: 'fa fa-info-circle',
						type: 'blue',
						buttons: {
							confirm: {
								text: wpforms_builder.ok,
								btnClass: 'btn-confirm',
								keys: [ 'enter' ],
							},
						},
					} );
				}

				// Toggle limit choices alert message.
				app.firstNChoicesAlert( id, res.data.total );

				// Toggle empty choices notice message.
				if ( Number( res.data.total ) === 0 ) {
					app.emptyChoicesNotice( id, res.data.source_name, res.data.type );
				}

				// Toggle elements and hide loading indicator.
				wpf.fieldOptionLoading( $thisOption, true );
			} ).fail( function( xhr, textStatus, e ) { // eslint-disable-line no-unused-vars
				// eslint-disable-next-line no-console
				console.log( xhr.responseText );
			} );
		},

		/**
		 * Update a Field Items when `Dynamic Choice` Source is toggled.
		 *
		 * @since 1.6.1
		 *
		 * @param {Object} $field jQuery selector for current field.
		 * @param {Object} items  Items collection.
		 */
		fieldDynamicChoiceSourceItems( $field, items ) {
			const $primary = $field.find( '.primary-input' );
			let key = 0;

			if ( $field.hasClass( 'wpforms-field-select' ) ) {
				const isModernSelect = app.dropdownField.helpers.isModernSelect( $primary );

				if ( isModernSelect ) {
					app.fieldDynamicChoiceSourceForModernSelect( $primary, items );
				} else {
					app.fieldDynamicChoiceSourceForClassicSelect( $primary, items );
				}
			} else {
				let type = 'radio';

				if ( $field.hasClass( 'wpforms-field-checkbox' ) ) {
					type = 'checkbox';
				}

				// Remove previous items.
				$primary.empty();

				// Add new items to radio or checkbox field.
				for ( key in items ) {
					$primary.append( '<li><input type="' + type + '" disabled> ' + wpf.sanitizeHTML( items[ key ] ) + '</li>' );
				}
			}
		},

		/**
		 * Update options for Modern style select when `Dynamic Choice` Source is toggled.
		 *
		 * @since 1.6.1
		 *
		 * @param {Object} $jquerySelector jQuery selector for primary input.
		 * @param {Object} items           Items collection.
		 */
		fieldDynamicChoiceSourceForModernSelect( $jquerySelector, items ) {
			const instance = app.dropdownField.helpers.getInstance( $jquerySelector ),
				fieldId = $jquerySelector.closest( '.wpforms-field' ).data().fieldId;

			// Destroy the instance of Choices.js.
			instance.destroy();

			// Update a placeholder.
			app.dropdownField.helpers.updatePlaceholderChoice( instance, fieldId );

			// Update options.
			app.fieldDynamicChoiceSourceForClassicSelect( $jquerySelector, items );

			// Choices.js init.
			app.dropdownField.events.choicesInit( $jquerySelector );
		},

		/**
		 * Update options for Classic style select when `Dynamic Choice` Source is toggled.
		 *
		 * @since 1.6.1
		 *
		 * @param {Object} $jquerySelector jQuery selector for primary input.
		 * @param {Object} items           Items collection.
		 */
		fieldDynamicChoiceSourceForClassicSelect( $jquerySelector, items ) {
			let index = 0;
			const itemsSize = items.length;

			// Clear.
			$jquerySelector.find( 'option' ).not( '.placeholder' ).remove();

			// Add options (items) to a single <select> field.
			for ( ; index < itemsSize; index++ ) {
				const item = wpf.sanitizeHTML( items[ index ] );

				$jquerySelector.append( '<option value="' + item + '">' + item + '</option>' );
			}

			$jquerySelector.toggleClass( 'wpforms-hidden', ! itemsSize );
		},

		/**
		 * Image choice toggle, hide image choices, image choices style, choices if Dynamic choices is not OFF.
		 *
		 * @since 1.5.8
		 */
		fieldDynamicChoiceToggleImageChoices() {
			$( '#wpforms-builder .wpforms-field-options .wpforms-field-option' ).each( function( key, value ) {
				const $option = $( value ),
					dynamicChoices = $option.find( '.wpforms-field-option-row-dynamic_choices select' ).val(),
					isDynamicChoices = typeof dynamicChoices !== 'undefined' && '' !== dynamicChoices,
					isImageChoices = $option.find( '.wpforms-field-option-row-choices_images input' ).is( ':checked' );

				$option
					.find( '.wpforms-field-option-row-choices_images' )
					.toggleClass( 'wpforms-hidden', isDynamicChoices );

				if ( ! isImageChoices || isDynamicChoices ) {
					$option
						.find( '.wpforms-field-option-row-choices_images_style' )
						.addClass( 'wpforms-hidden' );
				}
			} );
		},

		/**
		 * Hide icon choice toggle, icon choices, color, size and style options if Dynamic choices is not OFF.
		 *
		 * @since 1.7.9
		 */
		fieldDynamicChoiceToggleIconChoices() {
			$( '#wpforms-builder .wpforms-field-options .wpforms-field-option' ).each( function( key, value ) {
				const $option = $( value ),
					dynamicChoices = $option.find( '.wpforms-field-option-row-dynamic_choices select' ).val(),
					isDynamicChoices = typeof dynamicChoices !== 'undefined' && '' !== dynamicChoices,
					isIconChoices = $option.find( '.wpforms-field-option-row-choices_icons input' ).is( ':checked' );

				$option
					.find( '.wpforms-field-option-row-choices_icons' )
					.toggleClass( 'wpforms-hidden', isDynamicChoices );

				if ( ! isIconChoices || isDynamicChoices ) {
					$option
						.find( '.wpforms-field-option-row-choices_icons_color' )
						.addClass( 'wpforms-hidden' );
					$option
						.find( '.wpforms-field-option-row-choices_icons_size' )
						.addClass( 'wpforms-hidden' );
					$option
						.find( '.wpforms-field-option-row-choices_icons_style' )
						.addClass( 'wpforms-hidden' );
				}
			} );
		},

		/**
		 * Show choices limit alert message.
		 *
		 * @since 1.6.9
		 *
		 * @param {number} fieldId Field ID.
		 * @param {number} total   Total number of choices.
		 */
		firstNChoicesAlert: ( fieldId, total ) => {
			const $field = $( '#wpforms-field-' + fieldId );

			// Don't show a message for select fields.
			if ( $field.hasClass( 'wpforms-field-select' ) ) {
				return;
			}

			const tmpl = wp.template( 'wpforms-choices-limit-message' ),
				data = {
					total,
				},
				limit = app.settings.choicesLimit;

			$field.find( '.wpforms-alert-dynamic' ).remove();

			if ( total > limit ) {
				$field.find( '.primary-input' ).after( tmpl( data ) );
			}
		},

		/**
		 * Show an empty choice notice message.
		 *
		 * @since 1.8.2
		 *
		 * @param {number} fieldId Field ID.
		 * @param {string} source  Source name.
		 * @param {string} type    Source type.
		 */
		emptyChoicesNotice( fieldId, source, type ) {
			const field = $( '#wpforms-field-' + fieldId );

			const emptyDynamicChoicesMessage = wpforms_builder.dynamic_choices.empty_message
				.replace( '{source}', source )
				.replace( '{type}', wpforms_builder.dynamic_choices.entities[ type ] );

			const template = wp.template( 'wpforms-empty-choice-message' ),
				data = {
					message: emptyDynamicChoicesMessage,
				};

			field.find( '.label-title' ).after( template( data ) );
		},

		/**
		 * Field layout selector toggling.
		 *
		 * @since 1.3.7
		 *
		 * @param {Element} el Layout selector toggle link element.
		 */
		fieldLayoutSelectorToggle( el ) {
			const $this = $( el ),
				$layoutSelectorDisplay = $this.closest( 'label' ).next( '.layout-selector-display' );

			if ( $this.hasClass( 'layout-selector-showing' ) ) {
				// Selector is showing, so hide it
				$layoutSelectorDisplay.stop().slideUp( 400 );
				$this.find( 'span' ).text( wpforms_builder.layout_selector_show );
			} else {
				$layoutSelectorDisplay.stop().slideDown();
				$this.find( 'span' ).text( wpforms_builder.layout_selector_hide );
			}

			$this.toggleClass( 'layout-selector-showing' );
		},

		/**
		 * Init legacy field layout selector.
		 *
		 * @since 1.7.7
		 *
		 * @param {number} fieldId Field id.
		 */
		fieldLayoutSelectorInit( fieldId ) { // eslint-disable-line max-lines-per-function
			const $layoutSelector = $( `#wpforms-field-option-row-${ fieldId }-css > .layout-selector-display` );

			// Bail if already initialized.
			if ( $layoutSelector.length ) {
				return;
			}

			const layouts = {
				'layout-1': [
					{
						class: 'one-half',
						data: 'wpforms-one-half wpforms-first',
					},
					{
						class: 'one-half',
						data: 'wpforms-one-half',
					},
				],
				'layout-2': [
					{
						class: 'one-third',
						data: 'wpforms-one-third wpforms-first',
					},
					{
						class: 'one-third',
						data: 'wpforms-one-third',
					},
					{
						class: 'one-third',
						data: 'wpforms-one-third',
					},
				],
				'layout-3': [
					{
						class: 'one-fourth',
						data: 'wpforms-one-fourth wpforms-first',
					},
					{
						class: 'one-fourth',
						data: 'wpforms-one-fourth',
					},
					{
						class: 'one-fourth',
						data: 'wpforms-one-fourth',
					},
					{
						class: 'one-fourth',
						data: 'wpforms-one-fourth',
					},
				],
				'layout-4': [
					{
						class: 'one-third',
						data: 'wpforms-one-third wpforms-first',
					},
					{
						class: 'two-third',
						data: 'wpforms-two-thirds',
					},
				],
				'layout-5': [
					{
						class: 'two-third',
						data: 'wpforms-two-thirds wpforms-first',
					},
					{
						class: 'one-third',
						data: 'wpforms-one-third',
					},
				],
				'layout-6': [
					{
						class: 'one-fourth',
						data: 'wpforms-one-fourth wpforms-first',
					},
					{
						class: 'one-fourth',
						data: 'wpforms-one-fourth',
					},
					{
						class: 'two-fourth',
						data: 'wpforms-two-fourths',
					},
				],
				'layout-7': [
					{
						class: 'two-fourth',
						data: 'wpforms-two-fourths wpforms-first',
					},
					{
						class: 'one-fourth',
						data: 'wpforms-one-fourth',
					},
					{
						class: 'one-fourth',
						data: 'wpforms-one-fourth',
					},
				],
				'layout-8': [
					{
						class: 'one-fourth',
						data: 'wpforms-one-fourth wpforms-first',
					},
					{
						class: 'two-fourth',
						data: 'wpforms-two-fourths',
					},
					{
						class: 'one-fourth',
						data: 'wpforms-one-fourth',
					},
				],
			};

			// Create selector options.
			let layout,
				layoutOptions = `<div class="layout-selector-display unfoldable-cont">
					<p class="heading">${ wpforms_builder.layout_selector_layout }</p>
					<div class="layouts">`;

			for ( const key in layouts ) {
				layout = layouts[ key ];

				layoutOptions += '<div class="layout-selector-display-layout">';

				for ( const i in layout ) {
					layoutOptions += `<span class="${ layout[ i ].class }" data-classes="${ layout[ i ].data }"></span>`;
				}

				layoutOptions += '</div>';
			}

			layoutOptions += '</div></div>';

			$( `#wpforms-field-option-row-${ fieldId }-css > label` ).after( layoutOptions );
		},

		/**
		 * Legacy field layout selector, selecting a layout.
		 *
		 * @since 1.3.7
		 *
		 * @param {Element} el Layout selector toggle link.
		 */
		fieldLayoutSelectorLayout( el ) {
			const $this = $( el );

			$this.parent().find( '.layout-selector-display-layout' ).not( $this ).remove();
			$this.parent().find( '.heading' ).text( wpforms_builder.layout_selector_column );
			$this.toggleClass( 'layout-selector-display-layout layout-selector-display-columns' );
		},

		/**
		 * Field layout selector, insert into class field.
		 *
		 * @since 1.3.7
		 *
		 * @param {Element} el Element.
		 */
		fieldLayoutSelectorInsert( el ) {
			const $this = $( el ),
				$selector = $this.closest( '.layout-selector-display' ),
				$parent = $selector.parent(),
				$id = $parent.data( 'field-id' ),
				$label = $parent.find( 'label' ),
				$input = $parent.find( 'input[type=text]' ),
				layoutClassList = [
					'wpforms-one-half',
					'wpforms-first',
					'wpforms-one-third',
					'wpforms-one-fourth',
					'wpforms-two-thirds',
					'wpforms-two-fourths',
				];

			let classes = $this.data( 'classes' ),
				inputVal = $input.val();

			if ( inputVal ) {
				// Remove existing wpforms layout classes before adding new.
				layoutClassList.forEach( ( cls ) => {
					inputVal = inputVal.replace( new RegExp( '\\b' + cls + '\\b', 'gi' ), '' );
				} );

				// Remove any extra spaces.
				inputVal = inputVal.replace( /\s\s+/g, ' ' ).trim();

				// Add new layout classes.
				classes += ' ' + inputVal;
			}

			$input.val( classes );

			// Remove the list, all done!
			$selector.slideUp( 400, function() {
				$selector.remove();
				app.fieldLayoutSelectorInit( $id );
			} );

			$label.find( '.toggle-layout-selector-display' ).removeClass( 'layout-selector-showing' );
			$label.find( '.toggle-layout-selector-display span' ).text( wpforms_builder.layout_selector_show );
		},

		/**
		 * Toggle Order Summary Confirmation settings option.
		 *
		 * @since 1.8.7
		 *
		 * @param {Event}  event Event.
		 * @param {string} id    Field ID.
		 * @param {string} type  Field type.
		 */
		toggleOrderSummaryConfirmation( event, id, type ) {
			if ( type !== 'payment-total' ) {
				return;
			}

			$( '.wpforms-confirmation' ).each( function() {
				$( this ).find( '.wpforms-panel-field-confirmations-message_order_summary' ).closest( '.wpforms-panel-field' ).toggle( $( '#wpforms-panel-fields .wpforms-field-payment-total' ).length !== 0 );
			} );
		},

		//--------------------------------------------------------------------//
		// Settings Panel
		//--------------------------------------------------------------------//

		/**
		 * Element bindings for Settings panel.
		 *
		 * @since 1.0.0
		 */
		bindUIActionsSettings() { // eslint-disable-line max-lines-per-function
			// Clicking form title/desc opens Settings panel.
			$builder.on( 'click', '#wpforms-panel-fields .wpforms-title-desc, #wpforms-panel-fields .wpforms-field-submit-button, .wpforms-center-form-name', function( e ) {
				e.preventDefault();
				app.panelSwitch( 'settings' );
				if ( $( this ).hasClass( 'wpforms-center-form-name' ) || $( this ).hasClass( 'wpforms-title-desc' ) ) {
					setTimeout( function() {
						$( '#wpforms-panel-field-settings-form_title' ).trigger( 'focus' );
					}, 300 );
				}
			} );

			// Clicking form previous page break button.
			$builder.on( 'click', '.wpforms-field-pagebreak-last button', function( e ) {
				e.preventDefault();

				app.panelSwitch( 'settings' );
				$( '#wpforms-panel-field-settings-pagebreak_prev' ).trigger( 'focus' );
			} );

			// Trigger Custom Captcha adding when clicking on its block in the Also Available section.
			$builder.on( 'click', '.wpforms-panel-content-also-available-item-add-captcha', function( e ) {
				e.preventDefault();

				const customCaptcha = $builder.find( '#wpforms-add-fields-captcha' );

				// Show educational modal if Custom Captcha is not installed or activated.
				if ( customCaptcha.data( 'action' ) ) {
					customCaptcha.trigger( 'click' );

					return;
				}

				app.fieldAdd( 'captcha', {} ).done( function( res ) {
					app.panelSwitch( 'fields' );
					$( `#wpforms-field-${ res.data.field.id }` ).trigger( 'click' );
				} );
			} );

			// Clicking form last page break button.
			$builder.on( 'input', '#wpforms-panel-field-settings-pagebreak_prev', function() {
				$( '.wpforms-field-pagebreak-last button' ).text( $( this ).val() );
			} );

			// Real-time updates for editing the form title.
			$builder.on( 'input', '#wpforms-panel-field-settings-form_title, #wpforms-setup-name', function() {
				const title = $( this ).val().toString().trim();

				$( '.wpforms-preview .wpforms-form-name' ).text( title );
				$( '.wpforms-center-form-name.wpforms-form-name' ).text( title );
				app.trimFormTitle();
			} );

			// Real-time updates for editing the form description.
			$builder.on( 'input', '#wpforms-panel-field-settings-form_desc', function() {
				$( '.wpforms-form-desc' ).text( $( this ).val() );
			} );

			// Real-time updates for editing the form submit button.
			$builder.on( 'input', '#wpforms-panel-field-settings-submit_text', function() {
				$( '.wpforms-field-submit input[type=submit]' ).val( $( this ).val() );
			} );

			// Toggle form reCAPTCHA setting.
			$builder.on( 'change', '#wpforms-panel-field-settings-recaptcha', function() {
				app.captchaToggle();
			} );

			// Toggle form confirmation setting fields.
			$builder.on( 'change', '.wpforms-panel-field-confirmations-type', function() {
				app.confirmationFieldsToggle( $( this ) );
			} );

			$builder.on( 'change', '.wpforms-panel-field-confirmations-message_entry_preview', app.confirmationEntryPreviewToggle );

			// Toggle form notification setting fields.
			$builder.on( 'change', '#wpforms-panel-field-settings-notification_enable', app.notificationToggle );

			// Add new settings block.
			$builder.on( 'click', '.wpforms-builder-settings-block-add', function( e ) {
				e.preventDefault();

				if ( ! wpforms_builder.pro ) {
					return;
				}

				app.settingsBlockAdd( $( this ) );
			} );

			// Edit settings block name.
			$builder.on( 'click', '.wpforms-builder-settings-block-edit', function( e ) {
				e.preventDefault();

				const $el = $( this );

				if ( $el.parents( '.wpforms-builder-settings-block-header' ).find( '.wpforms-builder-settings-block-name' ).hasClass( 'editing' ) ) {
					app.settingsBlockNameEditingHide( $el );
				} else {
					app.settingsBlockNameEditingShow( $el );
				}
			} );

			// Update settings block name and close editing interface.
			$builder.on( 'blur', '.wpforms-builder-settings-block-name-edit input', function( e ) {
				// Do not fire if for onBlur user clicked on the edit button - it has its own event processing.
				if ( ! $( e.relatedTarget ).hasClass( 'wpforms-builder-settings-block-edit' ) ) {
					app.settingsBlockNameEditingHide( $( this ) );
				}
			} );

			// Close settings block editing interface with pressed Enter.
			$builder.on( 'keypress', '.wpforms-builder-settings-block-name-edit input', function( e ) {
				// On Enter - hide editing interface.
				if ( e.keyCode === 13 ) {
					app.settingsBlockNameEditingHide( $( this ) );

					// We need this preventDefault() to stop jumping to form name editing input.
					e.preventDefault();
				}
			} );

			// Clone settings block.
			$builder.on( 'click', '.wpforms-builder-settings-block-clone', function( e ) {
				e.preventDefault();

				app.settingsBlockPanelClone( $( this ) );
			} );

			// Toggle settings block - slide up or down.
			$builder.on( 'click', '.wpforms-builder-settings-block-toggle', function( e ) {
				e.preventDefault();

				app.settingsBlockPanelToggle( $( this ) );
			} );

			// Remove settings block.
			$builder.on( 'click', '.wpforms-builder-settings-block-delete', function( e ) {
				e.preventDefault();
				app.settingsBlockDelete( $( this ) );
			} );

			$builder.on( 'wpformsSettingsBlockAdded wpformsSettingsBlockCloned', function( e, $element ) {
				if ( ! $element.hasClass( 'wpforms-notification' ) ) {
					return;
				}

				app.notificationsUpdateElementsVisibility();
				app.notificationUpdateStatus( $element );
			} );

			$builder.on( 'wpformsSettingsBlockDeleted', function( e, type ) {
				if ( type !== 'notification' ) {
					return;
				}

				app.notificationsUpdateElementsVisibility();
			} );

			$builder.on( 'change', '.js-wpforms-enabled-notification input', function() {
				app.notificationUpdateStatus( $( this ).closest( '.wpforms-notification' ) );
			} );

			// Toggle Open Confirmations in New Tab options on AJAX form submit setting change.
			$builder.on( 'change', '#wpforms-panel-field-settings-ajax_submit', function() {
				app.hideOpenConfirmationsInNewTabOptions( ! $( this ).is( ':checked' ) );
			} );
		},

		/**
		 * Toggle Open Confirmations in New Tab options.
		 *
		 * @since 1.9.2
		 *
		 * @param {boolean} hide Whether to hide the options.
		 */
		hideOpenConfirmationsInNewTabOptions( hide ) {
			const $confirmationSection = $builder.find( '.wpforms-panel-content-section-confirmation' ),
				$blocks = $confirmationSection.find( '.wpforms-builder-settings-block' ),
				$options = $blocks.find( '.wpforms-panel-field-confirmations-redirect_new_tab' );

			if ( ! $options.length ) {
				return;
			}

			$options.each( function() {
				$( this ).closest( '.wpforms-panel-field' ).toggle( ! hide );
			} );
		},

		/**
		 * Toggle displaying the CAPTCHA.
		 *
		 * @since 1.6.4
		 */
		captchaToggle() {
			const $preview = $builder.find( '.wpforms-field-recaptcha' ),
				$setting = $( '#wpforms-panel-field-settings-recaptcha' );
			let provider = $setting.data( 'provider' );

			provider = provider || 'recaptcha';

			if ( ! $preview.length ) {
				return;
			}

			if ( $setting.is( ':checked' ) ) {
				$preview
					.show()
					.toggleClass( 'is-recaptcha', 'recaptcha' === provider );
			} else {
				$preview.hide();
			}
		},

		/**
		 * Init confirmations' type.
		 *
		 * @since 1.9.2
		 */
		initConfirmationsType() {
			// Toggle the setting fields in each confirmation block.
			$( '.wpforms-panel-field-confirmations-type' ).each( function() {
				app.confirmationFieldsToggle( $( this ) );
			} );
		},

		/**
		 * Init TinyMCE in given elements.
		 *
		 * @since 1.9.2
		 *
		 * @param {jQuery} $elements Elements.
		 */
		initElementsTinyMCE( $elements ) {
			if ( typeof tinymce === 'undefined' || typeof wp.editor === 'undefined' ) {
				return;
			}

			$elements.each( function() {
				const id = $( this ).attr( 'id' );

				// Destroy previously initialized editor.
				wp.editor.remove( id );

				// Initialize new editor.
				wp.editor.initialize( id, s.tinymceDefaults );
			} );
		},

		/**
		 * Set up the Confirmation blocks.
		 *
		 * @since 1.4.8
		 */
		confirmationsSetup() {
			// Toggle the setting fields in each confirmation block.
			app.initConfirmationsType();

			// Init TinyMCE in each confirmation block.
			app.initElementsTinyMCE( $( '.wpforms-panel-field-confirmations-message' ) );

			// Validate Confirmation Redirect URL.
			$builder.on( 'focusout', '.wpforms-panel-field-confirmations-redirect', function( event ) { // eslint-disable-line no-unused-vars
				const $field = $( this );
				const url = $field.val().trim();

				$field.val( url );

				// The value is either a valid URL or empty, we're done.
				if ( wpf.isURL( url ) || url === '' ) {
					return;
				}

				// Show the error modal and focus the field.
				app.confirmationRedirectValidationError( function() {
					$field.trigger( 'focus' );
				} );
			} );

			// Make sure Confirmation Redirect URL is not empty, verify before leaving the panel or saving.
			$builder.on( 'wpformsBeforeSave wpformsPanelSectionSwitch wpformsPanelSwitch', function( event ) {
				const $confirmations = $( '.wpforms-confirmation' );

				$confirmations.each( function( _index, confirmation ) {
					const $confirmation = $( confirmation );
					const $urlField = $confirmation.find( '.wpforms-panel-field-confirmations-redirect' );

					// We're starting on a panel other than Settings > Confirmations, bail.
					if ( $urlField.is( ':hidden' ) ) {
						return;
					}

					const $typeField = $confirmation.find( '.wpforms-panel-field-confirmations-type' );

					// The Confirmation type is not redirect, bail.
					// If the URL value is non-empty, `focusout` validation takes over.
					if ( $typeField.val() !== 'redirect' || $urlField.val().trim().length > 0 ) {
						return;
					}

					app.confirmationRedirectValidationError( function() {
						$urlField.trigger( 'focus' );
					} );

					event.stopImmediatePropagation();
					event.preventDefault();

					return false;
				} );
			} );
		},

		/**
		 * Display confirmation popup for empty or invalid Confirmation Redirect URL.
		 *
		 * @since 1.7.6
		 *
		 * @param {Function} onDestroyCallback Callback to execute when popup is closed and removed from DOM.
		 */
		confirmationRedirectValidationError( onDestroyCallback ) {
			$.confirm( {
				title: wpforms_builder.heads_up,
				content: wpforms_builder.redirect_url_field_error,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
				onDestroy: onDestroyCallback,
			} );
		},

		/**
		 * Toggle the different form Confirmation setting fields.
		 *
		 * @since 1.4.8
		 *
		 * @param {jQuery} $el Element.
		 */
		confirmationFieldsToggle( $el ) {
			if ( ! $el.length ) {
				return;
			}

			const type = $el.val(),
				$block = $el.closest( '.wpforms-builder-settings-block-content' );

			$block.find( '.wpforms-panel-field' )
				.not( $el.parent() )
				.not( '.wpforms-conditionals-enable-toggle' )
				.hide();

			$block.find( '.wpforms-panel-field-confirmations-' + type ).closest( '.wpforms-panel-field' ).show();

			if ( type === 'message' ) {
				$block.find( '.wpforms-panel-field-confirmations-message_scroll' ).closest( '.wpforms-panel-field' ).show();
				$block.find( '.wpforms-panel-field-confirmations-message_entry_preview' ).trigger( 'change' ).closest( '.wpforms-panel-field' ).show();
				$block.find( '.wpforms-panel-field-confirmations-message_order_summary' ).closest( '.wpforms-panel-field' ).toggle( $( '#wpforms-panel-fields .wpforms-field-payment-total' ).length !== 0 );
			}

			if ( $( '#wpforms-panel-field-settings-ajax_submit' ).is( ':checked' ) ) {
				$block.find( '.wpforms-panel-field-confirmations-redirect_new_tab' ).closest( '.wpforms-panel-field' ).toggle( [ 'redirect', 'page' ].includes( type ) );
			}
		},

		/**
		 * Show/hide an entry preview message.
		 *
		 * @since 1.6.9
		 */
		confirmationEntryPreviewToggle() {
			const $this = $( this ),
				$styleField = $this.closest( '.wpforms-builder-settings-block-content' ).find( '.wpforms-panel-field-confirmations-message_entry_preview_style' ).parent();

			$this.is( ':checked' ) ? $styleField.show() : $styleField.hide();
		},

		/**
		 * Toggle the displaying notification settings depending on if the
		 * notifications are enabled.
		 *
		 * @since 1.1.9
		 */
		notificationToggle() {
			const $notification = $( '#wpforms-panel-field-settings-notification_enable' ),
				$settingsBlock = $notification.closest( '.wpforms-panel-content-section' ).find( '.wpforms-builder-settings-block' ),
				$enabled = $notification.is( ':checked' );

			// Toggle Add new notification button.
			$( '.wpforms-notifications-add' ).toggleClass( 'wpforms-hidden', ! $enabled );

			$enabled ? $settingsBlock.show() : $settingsBlock.hide();
		},

		/**
		 * Notifications by status alerts.
		 *
		 * @since 1.6.6
		 */
		notificationsByStatusAlerts() {
			$builder.on( 'change', '.wpforms-panel-content-section-notifications .wpforms-notification-by-status-alert', function( e ) { // eslint-disable-line no-unused-vars
				const $input = $( this );

				if ( ! $input.prop( 'checked' ) ) {
					return;
				}

				const $enabled = $( '.wpforms-radio-group-' + $input.attr( 'data-radio-group' ) + ':checked:not(#' + $input.attr( 'id' ) + ')' );
				let	alertText;

				if ( $enabled.length === 0 ) {
					alertText = wpforms_builder.notification_by_status_enable_alert;
					alertText = alertText.replace( /%1\$s/g, $input.data( 'provider-title' ) );
				} else {
					alertText = wpforms_builder.notification_by_status_switch_alert;
					alertText = alertText.replace( /%2\$s/g, $enabled.data( 'provider-title' ) );
					alertText = alertText.replace( /%1\$s/g, $input.data( 'provider-title' ) );
				}

				$.confirm( {
					title: wpforms_builder.heads_up,
					content: alertText,
					icon: 'fa fa-exclamation-circle',
					type: 'orange',
					buttons: {
						confirm: {
							text: wpforms_builder.ok,
							btnClass: 'btn-confirm',
						},
					},
				} );
			} );
		},

		/**
		 * Add new settings block.
		 *
		 * @since 1.4.8
		 * @since 1.6.1 Added processing for Field Map table.
		 * @since 1.6.1.2 Registered `wpformsSettingsBlockAdded` trigger.
		 *
		 * @param {jQuery} $el Settings Block jQuery object.
		 */
		settingsBlockAdd( $el ) { // eslint-disable-line max-lines-per-function
			const nextID = Number( $el.attr( 'data-next-id' ) ),
				panelID = $el.closest( '.wpforms-panel-content-section' ).data( 'panel' ),
				blockType = $el.data( 'block-type' ),
				namePrompt = wpforms_builder[ blockType + '_prompt' ],
				nameField = '<input autofocus="" type="text" id="settings-block-name" placeholder="' + wpforms_builder[ blockType + '_ph' ] + '">',
				nameError = '<p class="error">' + wpforms_builder[ blockType + '_error' ] + '</p>',
				modalContent = namePrompt + nameField + nameError;

			const modal = $.confirm( {
				container: $builder,
				title: false,
				content: modalContent,
				icon: 'fa fa-info-circle',
				type: 'blue',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() { // eslint-disable-line complexity, max-lines-per-function
							const settingsBlockName = this.$content.find( 'input#settings-block-name' ).val().toString().trim(),
								error = this.$content.find( '.error' );

							if ( settingsBlockName === '' ) {
								error.show();
								return false;
							}

							const $firstSettingsBlock = $el.closest( '.wpforms-panel-content-section' ).find( '.wpforms-builder-settings-block' ).first();

							// Restore tooltips before cloning.
							wpf.restoreTooltips( $firstSettingsBlock );

							const $newSettingsBlock = $firstSettingsBlock.clone(),
								blockID = $firstSettingsBlock.data( 'block-id' );
							let newSettingsBlock;

							$newSettingsBlock.attr( 'data-block-id', nextID );
							$newSettingsBlock.find( '.wpforms-builder-settings-block-header span' ).text( settingsBlockName );

							/**
							 * Fires to reset settings block elements on adding new settings block.
							 *
							 * @param {jQuery} $element jQuery object of an element.
							 */
							const resetFormElement = function( $element ) {
								if ( $element.attr( 'name' ) ) {
									$element.val( '' ).attr( 'name', $element.attr( 'name' ).replace( /\[(\d+)\]/, '[' + nextID + ']' ) );
									if ( $element.is( 'select' ) ) {
										$element.find( 'option' ).prop( 'selected', false ).attr( 'selected', false );
										$element.find( 'option' ).first().prop( 'selected', true ).attr( 'selected', 'selected' );
									} else if ( $element.attr( 'type' ) === 'checkbox' ) {
										const isChecked = $element.closest( '.wpforms-panel-field' ).hasClass( 'js-wpforms-enabled-notification' );

										$element.prop( 'checked', isChecked ).attr( 'checked', isChecked ).val( '1' );
									} else {
										$element.val( '' ).attr( 'value', '' );
									}
								}
							};

							$newSettingsBlock.find( 'input, textarea, select' ).each( function() {
								const $this = $( this );
								const $parent = $this.parent();

								if ( $this.hasClass( 'wpforms-disabled' ) && ( $parent.hasClass( 'from-name' ) || $parent.hasClass( 'from-email' ) ) ) {
									return;
								}

								resetFormElement( $this );
							} );

							// Update elements IDs.
							const idPrefixPanel = 'wpforms-panel-field-' + panelID + '-',
								idPrefixBlock = idPrefixPanel + blockID;
							$newSettingsBlock.find( '[id^="' + idPrefixBlock + '"], [for^="' + idPrefixBlock + '"]' ).each( function( index, el ) { // eslint-disable-line no-unused-vars
								const $el = $( this ),
									attr = $el.prop( 'tagName' ) === 'LABEL' ? 'for' : 'id',
									elID = $el.attr( attr ).replace( new RegExp( idPrefixBlock, 'g' ), idPrefixPanel + nextID );

								$el.attr( attr, elID );
							} );

							// Update `notification by status` checkboxes.
							const radioGroup = blockID + '-notification-by-status';
							$newSettingsBlock.find( '[data-radio-group="' + radioGroup + '"]' ).each( function( index, el ) { // eslint-disable-line no-unused-vars
								$( this )
									.removeClass( 'wpforms-radio-group-' + radioGroup )
									.addClass( 'wpforms-radio-group-' + nextID + '-notification-by-status' )
									.attr( 'data-radio-group', nextID + '-notification-by-status' );
							} );

							$newSettingsBlock.find( '.wpforms-builder-settings-block-header input' ).val( settingsBlockName ).attr( 'value', settingsBlockName );

							if ( blockType === 'notification' ) {
								$newSettingsBlock.find( '.email-msg textarea' ).val( '{all_fields}' ).attr( 'value', '{all_fields}' );
								$newSettingsBlock.find( '.email-recipient input' ).val( '{admin_email}' ).attr( 'value', '{admin_email}' );
							}

							$newSettingsBlock.removeClass( 'wpforms-builder-settings-block-default' );

							if ( blockType === 'confirmation' ) {
								$newSettingsBlock.find( '.wpforms-panel-field-tinymce' ).remove();
								if ( typeof WPForms !== 'undefined' ) {
									$newSettingsBlock.find( '.wpforms-panel-field-confirmations-type-wrap' )
										.after( WPForms.Admin.Builder.Templates
											.get( 'wpforms-builder-confirmations-message-field' )( {
												id: nextID,
											} )
										);
								}
							}

							// Conditional logic, if present
							const $conditionalLogic = $newSettingsBlock.find( '.wpforms-conditional-block' );
							if ( $conditionalLogic.length && typeof WPForms !== 'undefined' ) {
								$conditionalLogic
									.html( WPForms.Admin.Builder.Templates
										.get( 'wpforms-builder-conditional-logic-toggle-field' )( {
											id: nextID,
											type: blockType,
											actions: JSON.stringify( $newSettingsBlock.find( '.wpforms-panel-field-conditional_logic-checkbox' ).data( 'actions' ) ),
											actionDesc: $newSettingsBlock.find( '.wpforms-panel-field-conditional_logic-checkbox' ).data( 'action-desc' ),
										} )
									);
							}

							// Fields Map Table, if present.
							const $fieldsMapTable = $newSettingsBlock.find( '.wpforms-field-map-table' );
							if ( $fieldsMapTable.length ) {
								$fieldsMapTable.each( function( index, el ) {
									const $table = $( el );

									// Clean table fields.
									$table.find( 'tr:not(:first-child)' ).remove();

									const $input = $table.find( '.key input' ),
										$select = $table.find( '.field select' ),
										name = $select.data( 'name' );

									$input.attr( 'value', '' );
									$select
										.attr( 'name', '' )
										.attr( 'data-name', name.replace( /\[(\d+)\]/, '[' + nextID + ']' ) );
								} );
							}

							newSettingsBlock = $newSettingsBlock.wrap( '<div>' ).parent().html();
							newSettingsBlock = newSettingsBlock.replace( /\[conditionals\]\[(\d+)\]\[(\d+)\]/g, '[conditionals][0][0]' );

							$firstSettingsBlock.before( newSettingsBlock );
							const $addedSettingBlock = $firstSettingsBlock.prev();

							// Reset the confirmation type to the 1st one.
							if ( blockType === 'confirmation' ) {
								app.prepareChoicesJSField( $addedSettingBlock, nextID );
								app.confirmationFieldsToggle( $( '.wpforms-panel-field-confirmations-type' ).first() );
							}

							// Init the WP Editor.
							if ( typeof tinymce !== 'undefined' && typeof wp.editor !== 'undefined' && blockType === 'confirmation' ) {
								wp.editor.initialize( 'wpforms-panel-field-confirmations-message-' + nextID, s.tinymceDefaults );
							}

							// Init tooltips for a new section.
							wpf.initTooltips();

							$builder.trigger( 'wpformsSettingsBlockAdded', [ $addedSettingBlock ] );

							$el.attr( 'data-next-id', nextID + 1 );
						},
					},
					cancel: {
						text: wpforms_builder.cancel,
					},
				},
			} );

			// We need to process this event here, because we need a confirmation
			// modal object defined, so we can intrude into it.
			// Pressing Enter will click the Ok button.
			$builder.on( 'keypress', '#settings-block-name', function( e ) {
				if ( e.keyCode === 13 ) {
					$( modal.buttons.confirm.el ).trigger( 'click' );
				}
			} );
		},

		/**
		 * Reset the 'Select Page' field to it's initial state then
		 * re-initialize ChoicesJS on it.
		 *
		 * @since 1.7.9
		 *
		 * @param {jQuery} $addedSettingBlock  Newly added Settings Block jQuery object.
		 * @param {number} addedSettingBlockID Number ID used when `$addedSettingBlock` was created.
		 */
		prepareChoicesJSField( $addedSettingBlock, addedSettingBlockID ) {
			const $addedConfirmationWrap = $addedSettingBlock.find( `#wpforms-panel-field-confirmations-${ addedSettingBlockID }-page-wrap` );
			if ( $addedConfirmationWrap.length <= 0 ) {
				return;
			}

			const $confirmationSelectPageField = $addedConfirmationWrap.find( `#wpforms-panel-field-confirmations-${ addedSettingBlockID }-page` );
			if ( $confirmationSelectPageField.length <= 0 && ! $confirmationSelectPageField.hasClass( 'choicesjs-select' ) ) {
				return;
			}

			const $choicesWrapper = $addedConfirmationWrap.find( '.choices' );
			if ( $choicesWrapper.length <= 0 ) {
				return;
			}

			// Remove ChoicesJS-related attr.
			const $selectPageField = $confirmationSelectPageField.first();
			$selectPageField.removeAttr( 'data-choice' );
			$selectPageField.removeAttr( 'hidden' );
			$selectPageField.removeClass( 'choices__input' );

			// Move the select page field to it's initial location in the DOM.
			$( $selectPageField ).appendTo( $addedConfirmationWrap.first() );

			// Remove the `.choices` wrapper.
			$choicesWrapper.first().remove();

			// Re-init ChoicesJS.
			app.dropdownField.events.choicesInit( $selectPageField );
		},

		/**
		 * Show settings block editing interface.
		 *
		 * @since 1.4.8
		 *
		 * @param {jQuery} $el Element.
		 */
		settingsBlockNameEditingShow( $el ) {
			const headerHolder = $el.parents( '.wpforms-builder-settings-block-header' ),
				nameHolder = headerHolder.find( '.wpforms-builder-settings-block-name' );

			nameHolder
				.addClass( 'editing' )
				.hide();

			// Make the editing interface active and in focus
			headerHolder.find( '.wpforms-builder-settings-block-name-edit' ).addClass( 'active' );
			wpf.focusCaretToEnd( headerHolder.find( 'input' ) );
		},

		/**
		 * Update settings block name and hide editing interface.
		 *
		 * @since 1.4.8
		 *
		 * @param {jQuery} $el Element.
		 */
		settingsBlockNameEditingHide( $el ) {
			const headerHolder = $el.parents( '.wpforms-builder-settings-block-header' ),
				nameHolder = headerHolder.find( '.wpforms-builder-settings-block-name' ),
				editHolder = headerHolder.find( '.wpforms-builder-settings-block-name-edit' );
			let currentName = editHolder.find( 'input' ).val().trim();
			const blockType = $el.closest( '.wpforms-builder-settings-block' ).data( 'block-type' );

			// Provide a default value for empty settings block name.
			if ( ! currentName.length ) {
				currentName = wpforms_builder[ blockType + '_def_name' ];
			}

			// This is done for sanitizing.
			editHolder.find( 'input' ).val( currentName );
			nameHolder.text( currentName );

			// Editing should be hidden, displaying - active.
			nameHolder
				.removeClass( 'editing' )
				.show();
			editHolder.removeClass( 'active' );
		},

		/**
		 * Clone the Notification block with all of its content and events.
		 * Put the newly created clone above the target.
		 *
		 * @since 1.6.5
		 * @since 1.7.7 Registered `wpformsSettingsBlockCloned` trigger.
		 *
		 * @param {Object} $el Clone icon DOM element.
		 */
		settingsBlockPanelClone( $el ) { // eslint-disable-line max-lines-per-function
			const $panel = $el.closest( '.wpforms-panel-content-section' ),
				$addNewSettingButton = $panel.find( '.wpforms-builder-settings-block-add' ),
				$settingsBlock = $el.closest( '.wpforms-builder-settings-block' ),
				$settingBlockContent = $settingsBlock.find( '.wpforms-builder-settings-block-content' ),
				settingsBlockId = parseInt( $addNewSettingButton.attr( 'data-next-id' ), 10 ),
				settingsBlockType = $settingsBlock.data( 'block-type' ),
				settingsBlockName = $settingsBlock.find( '.wpforms-builder-settings-block-name' ).text().trim() + wpforms_builder[ settingsBlockType + '_clone' ],
				isVisibleContent = $settingBlockContent.is( ':hidden' );

			// Restore tooltips before cloning.
			wpf.restoreTooltips( $settingsBlock );

			const $clone = $settingsBlock.clone( false, true );

			// Save open/close state while cloning.
			app.settingsBlockUpdateState( isVisibleContent, settingsBlockId, settingsBlockType );

			// Change the cloned setting block ID and name.
			$clone.data( 'block-id', settingsBlockId );
			$clone.find( '.wpforms-builder-settings-block-header span' ).text( settingsBlockName );
			$clone.find( '.wpforms-builder-settings-block-header input' ).val( settingsBlockName );
			$clone.removeClass( 'wpforms-builder-settings-block-default' );

			// Change the Next Settings block ID for "Add new" button.
			$addNewSettingButton.attr( 'data-next-id', settingsBlockId + 1 );

			// Change the name attribute.
			$clone.find( 'input, textarea, select' ).each( function() {
				const $this = $( this );

				if ( $this.attr( 'name' ) ) {
					$this.attr( 'name', $this.attr( 'name' ).replace( /\[(\d+)\]/, '[' + settingsBlockId + ']' ) );
				}
				if ( $this.data( 'name' ) ) {
					$this.data( 'name', $this.data( 'name' ).replace( /\[(\d+)\]/, '[' + settingsBlockId + ']' ) );
				}
				if ( $this.attr( 'class' ) ) {
					$this.attr( 'class', $this.attr( 'class' ).replace( /-(\d+)/, '-' + settingsBlockId ) );
				}
				if ( $this.attr( 'data-radio-group' ) ) {
					$this.attr( 'data-radio-group', $this.attr( 'data-radio-group' ).replace( /(\d+)-/, settingsBlockId + '-' ) );
				}
			} );

			// Change IDs/data-attributes in DOM elements.
			$clone.find( '*' ).each( function() {
				const $this = $( this );

				if ( $this.attr( 'id' ) ) {
					$this.attr( 'id', $this.attr( 'id' ).replace( /-(\d+)/, '-' + settingsBlockId ) );
				}
				if ( $this.attr( 'for' ) ) {
					$this.attr( 'for', $this.attr( 'for' ).replace( /-(\d+)-/, '-' + settingsBlockId + '-' ) );
				}
				if ( $this.data( 'input-name' ) ) {
					$this.data( 'input-name', $this.data( 'input-name' ).replace( /\[(\d+)\]/, '[' + settingsBlockId + ']' ) );
				}
			} );

			// Transfer selected values to copy elements since jQuery doesn't clone the current selected state.
			$settingsBlock.find( 'select' ).each( function() {
				const baseSelectName = $( this ).attr( 'name' ),
					clonedSelectName = $( this ).attr( 'name' ).replace( /\[(\d+)\]/, '[' + settingsBlockId + ']' );

				$clone.find( 'select[name="' + clonedSelectName + '"]' ).val( $( this ).attr( 'name', baseSelectName ).val() );
			} );

			// Insert before the target settings block.
			$clone
				.css( 'display', 'none' )
				.insertBefore( $settingsBlock )
				.show( 'fast', function() {
					// Init tooltips for a new section.
					wpf.initTooltips();
				} );

			$builder.trigger( 'wpformsSettingsBlockCloned', [ $clone, $settingsBlock.data( 'block-id' ) ] );
		},

		/**
		 * Show or hide settings block panel content.
		 *
		 * @since 1.4.8
		 *
		 * @param {Object} $el Toggle icon DOM element.
		 */
		settingsBlockPanelToggle( $el ) {
			const $settingsBlock = $el.closest( '.wpforms-builder-settings-block' ),
				settingsBlockId = $settingsBlock.data( 'block-id' ),
				settingsBlockType = $settingsBlock.data( 'block-type' ),
				$content = $settingsBlock.find( '.wpforms-builder-settings-block-content' ),
				isVisible = $content.is( ':visible' );

			$content.stop().slideToggle( {
				duration: 400,
				start() {
					// Send it early to save fast.
					// It's an animation start, so we should save the state for the animation end (reversed).
					app.settingsBlockUpdateState( isVisible, settingsBlockId, settingsBlockType );
				},
				always() {
					if ( $content.is( ':visible' ) ) {
						$el.html( '<i class="fa fa-chevron-circle-up"></i>' );
					} else {
						$el.html( '<i class="fa fa-chevron-circle-down"></i>' );
					}
				},
			} );
		},

		/**
		 * Delete settings block.
		 *
		 * @since 1.4.8
		 * @since 1.6.1.2 Registered `wpformsSettingsBlockDeleted` trigger.
		 *
		 * @param {jQuery} $el Delete button element.
		 */
		settingsBlockDelete( $el ) {
			const $contentSection = $el.closest( '.wpforms-panel-content-section' );

			// Skip if only one block persist.
			// This condition should not execute in normal circumstances.
			if ( $contentSection.find( '.wpforms-builder-settings-block' ).length < 2 ) {
				return;
			}

			const $currentBlock = $el.closest( '.wpforms-builder-settings-block' ),
				blockType = $currentBlock.data( 'block-type' );

			$.confirm( {
				title: false,
				content: wpforms_builder[ blockType + '_delete' ],
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							const settingsBlockId = $currentBlock.data( 'block-id' ),
								settingsBlockType = $currentBlock.data( 'block-type' );

							/* eslint-disable camelcase */
							$.post( wpforms_builder.ajax_url, {
								action: 'wpforms_builder_settings_block_state_remove',
								nonce: wpforms_builder.nonce,
								block_id: settingsBlockId,
								block_type: settingsBlockType,
								form_id: s.formID,
							} );
							/* eslint-enable */

							$currentBlock.remove();

							$builder.trigger( 'wpformsSettingsBlockDeleted', [ blockType, settingsBlockId ] );
						},
					},
					cancel: {
						text: wpforms_builder.cancel,
					},
				},
			} );
		},

		/**
		 * Change open/close state for setting block.
		 *
		 * @since 1.6.5
		 *
		 * @param {boolean} isVisible         State status.
		 * @param {number}  settingsBlockId   Block ID.
		 * @param {string}  settingsBlockType Block type.
		 */
		settingsBlockUpdateState( isVisible, settingsBlockId, settingsBlockType ) {
			/* eslint-disable camelcase */
			$.post( wpforms_builder.ajax_url, {
				action: 'wpforms_builder_settings_block_state_save',
				state: isVisible ? 'closed' : 'opened',
				form_id: s.formID,
				block_id: settingsBlockId,
				block_type: settingsBlockType,
				nonce: wpforms_builder.nonce,
			} );
		},

		/**
		 * Change visibility for notification elements, e.g.,
		 * the Enable This Notification toggle and notification status.
		 * The elements invisible when form has only one notification
		 * and customers can turn off all notifications instead.
		 *
		 * @since 1.9.2
		 */
		notificationsUpdateElementsVisibility() {
			const $notifications = $( '.wpforms-panel-content-section-notifications .wpforms-notification' );
			const $statuses = $notifications.find( '.wpforms-builder-settings-block-status' );
			const isVisible = $notifications.length > 1;
			const $fieldWrappers = $notifications.find( '.js-wpforms-enabled-notification' );

			if ( isVisible ) {
				$fieldWrappers.removeClass( 'wpforms-hidden' );
				$statuses.removeClass( 'wpforms-hidden' );

				return;
			}

			const $inputs = $fieldWrappers.find( 'input' );

			$statuses.addClass( 'wpforms-hidden' );
			$fieldWrappers.addClass( 'wpforms-hidden' );
			$inputs.prop( 'checked', true );
		},

		/**
		 * Update notification status to display if the notification is active or inactive.
		 *
		 * @since 1.9.2
		 *
		 * @since 1.9.2
		 *
		 * @param {jQuery} $notification Notification element.
		 */
		notificationUpdateStatus( $notification ) {
			const isNotificationsEnabled = $( '#wpforms-panel-field-settings-notification_enable' ).is( ':checked' );
			const isEnabledNotification = $notification.find( '.js-wpforms-enabled-notification input' ).is( ':checked' );
			const $status = $notification.find( '.wpforms-builder-settings-block-status' );

			if ( isNotificationsEnabled && isEnabledNotification ) {
				$status.removeClass( 'wpforms-badge-silver' );
				$status.addClass( 'wpforms-badge-green' );
				$status.text( $status.data( 'active' ) );

				return;
			}

			$status.removeClass( 'wpforms-badge-green' );
			$status.addClass( 'wpforms-badge-silver' );
			$status.text( $status.data( 'inactive' ) );
		},

		//--------------------------------------------------------------------//
		// Revisions Panel
		//--------------------------------------------------------------------//

		/**
		 * Element bindings for Revisions panel.
		 *
		 * @since 1.7.3
		 */
		bindUIActionsRevisions() {
			// Update a revisions panel when it becomes active.
			$builder.on( 'wpformsPanelSwitched', function( event, panel ) {
				if ( panel !== 'revisions' ) {
					return;
				}

				app.updateRevisionsList();
				app.updateRevisionPreview();
			} );

			// Update revisions list when the form was saved with a revisions panel being active.
			$builder.on( 'wpformsSaved', function( event ) { // eslint-disable-line no-unused-vars
				if ( wpf.getQueryString( 'view' ) !== 'revisions' ) {
					return;
				}

				app.updateRevisionsList();
			} );
		},

		/**
		 * Fetch and update a list of form revisions.
		 *
		 * @since 1.7.3
		 */
		updateRevisionsList() {
			const $revisionsButtonBadge = $( '.wpforms-panel-revisions-button .badge-exclamation' );

			// Revisions' badge exists, send a request and remove the badge on successful response.
			if ( $revisionsButtonBadge.length ) {
				$.post( wpforms_builder.ajax_url, {
					action: 'wpforms_mark_panel_viewed',
					form_id: s.formID, // eslint-disable-line camelcase
					nonce: wpforms_builder.nonce,
				} )
					.done( function( response ) {
						// eslint-disable-next-line no-unused-expressions
						response.success ? $revisionsButtonBadge.remove() : wpf.debug( response );
					} )
					.fail( function( xhr, textStatus, e ) { // eslint-disable-line no-unused-vars
						wpf.debug( xhr.responseText || textStatus || '' );
					} );
			}

			// Revisions are disabled, no need to fetch a list of revisions.
			if ( ! $builder.hasClass( 'wpforms-revisions-enabled' ) ) {
				return;
			}

			const $revisionsList = $( '#wpforms-panel-revisions .wpforms-revisions-content' );

			// Dim the list, send a request and replace the list on successful response.
			$revisionsList.fadeTo( 250, 0.25, function() {
				$.post( wpforms_builder.ajax_url, {
					action: 'wpforms_get_form_revisions',
					form_id: s.formID, // eslint-disable-line camelcase
					revision_id: wpf.getQueryString( 'revision_id' ), // eslint-disable-line camelcase
					nonce: wpforms_builder.nonce,
				} )
					.done( function( response ) {
						// eslint-disable-next-line no-unused-expressions
						response.success ? $revisionsList.replaceWith( response.data.html ) : wpf.debug( response );
					} )
					.fail( function( xhr, textStatus, e ) { // eslint-disable-line no-unused-vars
						wpf.debug( xhr.responseText || textStatus || '' );

						// Un dim the list to reset the UI.
						$revisionsList.fadeTo( 250, 1 );
					} );
			} );
		},

		/**
		 * Clone form preview from Fields panel.
		 *
		 * @since 1.7.3
		 */
		updateRevisionPreview() {
			// Clone preview DOM from a Fields panel.
			const $preview = elements.$formPreview.clone();

			// Clean up the cloned preview, remove unnecessary elements, set states etc.
			$preview
				.find( '.wpforms-field-duplicate, .wpforms-field-delete, .wpforms-field-helper, .wpforms-debug' )
				.remove()
				.end();
			$preview
				.find( '.wpforms-field-wrap' )
				.removeClass( 'ui-sortable' )
				.addClass( 'ui-sortable-disabled' );
			$preview
				.find( '.wpforms-field' )
				.removeClass( 'ui-sortable-handle ui-draggable ui-draggable-handle active' )
				.removeAttr( 'id data-field-id data-field-type' )
				.removeData();
			$preview
				.find( '.wpforms-field-submit-button' )
				.prop( 'disabled', true );

			// Put the cleaned-up clone into a Preview panel.
			if ( elements.$revisionPreview.hasClass( 'has-preview' ) ) {
				elements
					.$revisionPreview
					.find( '.wpforms-preview-wrap' )
					.replaceWith( $preview );
			} else {
				elements
					.$revisionPreview
					.append( $preview )
					.addClass( 'has-preview' );
			}
		},

		/**
		 * Inform the user about making this version the default if revision is currently loaded, and it was modified.
		 *
		 * @since 1.7.3
		 */
		confirmSaveRevision() {
			$.confirm( {
				title: wpforms_builder.heads_up,
				content: wpforms_builder.revision_update_confirm,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				closeIcon: false,
				buttons: {

					confirm: {
						text: wpforms_builder.save,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							// Put the Form Builder into "saving state".
							$builder.addClass( 'wpforms-revision-is-saving' );

							// Save the revision as current version and reload the Form Builder.
							WPFormsBuilder.formSave( false ).done( app.revisionSavedReload );
						},
					},

					cancel: {
						text: wpforms_builder.cancel,
						action() {
							WPFormsBuilder.setCloseConfirmation( true );
						},
					},
				},
			} );
		},

		/**
		 * When a modified revision was saved as a current version, reload the Form Builder with the current tab active.
		 *
		 * @since 1.7.3
		 */
		revisionSavedReload() {
			wpf.updateQueryString( 'view', wpf.getQueryString( 'view' ) );
			wpf.removeQueryParam( 'revision_id' );

			window.location.reload();
		},

		//--------------------------------------------------------------------//
		// Save and Exit
		//--------------------------------------------------------------------//

		/**
		 * Element bindings for Embed and Save/Exit items.
		 *
		 * @since 1.0.0
		 * @since 1.5.8 Added trigger on `wpformsSaved` event to remove a `newform` URL-parameter.
		 */
		bindUIActionsSaveExit() {
			// Embed form.
			$builder.on( 'click', '#wpforms-embed', function( e ) {
				e.preventDefault();

				if ( $( this ).hasClass( 'wpforms-disabled' ) || $( this ).hasClass( 'wpforms-btn-light-grey-disabled' ) ) {
					return;
				}

				WPFormsFormEmbedWizard.openPopup();
			} );

			// Save form.
			$builder.on( 'click', '#wpforms-save', function( e ) {
				e.preventDefault();
				app.formSave( false );
			} );

			// Exit builder.
			$builder.on( 'click', '#wpforms-exit', function( e ) {
				e.preventDefault();
				app.formExit();
			} );

			// After form save.
			$builder.on( 'wpformsSaved', function( e, data ) { // eslint-disable-line no-unused-vars
				/**
				 * Remove `newform` parameter if it's in URL, otherwise we can to get a "race condition".
				 * E.g., form settings will be updated before some provider connection is loaded.
				 */
				wpf.removeQueryParam( 'newform' );
			} );
		},

		// eslint-disable-next-line jsdoc/require-returns
		/**
		 * Save form.
		 *
		 * @since 1.0.0
		 * @since 1.7.5 Added `wpformsBeforeSave` trigger.
		 *
		 * @param {boolean} redirect Whether to redirect after save.
		 */
		formSave( redirect ) { // eslint-disable-line max-lines-per-function
			// Saving a revision directly is not allowed. We need to notify the user that it will overwrite the current version.
			if ( $builder.hasClass( 'wpforms-is-revision' ) && ! $builder.hasClass( 'wpforms-revision-is-saving' ) ) {
				app.confirmSaveRevision();

				return;
			}

			if ( typeof tinyMCE !== 'undefined' ) {
				tinyMCE.triggerSave();
			}

			const event = WPFormsUtils.triggerEvent( $builder, 'wpformsBeforeSave' );

			// Allow callbacks on `wpformsBeforeSave` to cancel form submission by triggering `event.preventDefault()`.
			if ( event.isDefaultPrevented() ) {
				return;
			}

			const $saveBtn = elements.$saveButton,
				$icon = $saveBtn.find( 'i.fa-check' ),
				$spinner = $saveBtn.find( 'i.wpforms-loading-spinner' ),
				$label = $saveBtn.find( 'span' ),
				text = $label.text();

			$label.text( wpforms_builder.saving );
			$saveBtn.prop( 'disabled', true );
			$icon.addClass( 'wpforms-hidden' );
			$spinner.removeClass( 'wpforms-hidden' );

			const data = {
				action: 'wpforms_save_form',
				data: JSON.stringify( app.serializeAllData( $( '#wpforms-builder-form' ) ) ),
				id: s.formID,
				nonce: wpforms_builder.nonce,
			};

			return $.post( wpforms_builder.ajax_url, data, function( response ) {
				if ( response.success ) {
					wpf.savedState = wpf.getFormState( '#wpforms-builder-form' );
					wpf.initialSave = false;

					$builder.trigger( 'wpformsSaved', response.data );

					if ( true === redirect && app.isBuilderInPopup() ) {
						app.builderInPopupClose( 'saved' );
						return;
					}

					if ( true === redirect ) {
						window.location.href = wpforms_builder.exit_url;
					}
				} else {
					wpf.debug( response );
					app.formSaveError( response.data );
				}
			} ).fail( function( xhr, textStatus, e ) { // eslint-disable-line no-unused-vars
				wpf.debug( xhr );
				app.formSaveError();
			} ).always( function() {
				$label.text( text );
				$saveBtn.prop( 'disabled', false );
				$spinner.addClass( 'wpforms-hidden' );
				$icon.removeClass( 'wpforms-hidden' );
			} );
		},

		/**
		 * Serialize all form data including checkboxes that are not checked.
		 *
		 * @since 1.9.0
		 *
		 * @param {Object} $form Form jQuery object.
		 *
		 * @return {Array} Form data.
		 */
		serializeAllData( $form ) {
			const formData = $form.serializeArray();

			$form.find( '.wpforms-field-option-layout .wpforms-field-option-row-label_hide input[type=checkbox]' ).each( function() {
				const $checkbox = $( this );
				const name = $checkbox.attr( 'name' );
				const value = $checkbox.is( ':checked' ) ? '1' : '';

				if ( ! value ) {
					formData.push( { name, value } );
				}
			} );

			return formData;
		},

		/**
		 * Form save error.
		 *
		 * @since 1.6.3
		 *
		 * @param {string} error Error message.
		 */
		formSaveError( error = '' ) {
			// Default error message.
			if ( wpf.empty( error ) ) {
				error = wpforms_builder.error_save_form;
			}

			// Display error in a modal window.
			$.confirm( {
				title: wpforms_builder.heads_up,
				content: '<p>' + error + '</p><p>' + wpforms_builder.error_contact_support + '</p>',
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
			} );
		},

		/**
		 * Exit form builder.
		 *
		 * @since 1.0.0
		 */
		formExit() {
			if ( app.isBuilderInPopup() && app.formIsSaved() ) {
				app.builderInPopupClose( 'saved' );
				return;
			}

			if ( app.formIsSaved() ) {
				window.location.href = wpforms_builder.exit_url;
			} else {
				$.confirm( {
					title: false,
					content: wpforms_builder.exit_confirm,
					icon: 'fa fa-exclamation-circle',
					type: 'orange',
					closeIcon: true,
					buttons: {
						confirm: {
							text: wpforms_builder.save_exit,
							btnClass: 'btn-confirm',
							keys: [ 'enter' ],
							action() {
								app.formSave( true );
							},
						},
						cancel: {
							text: wpforms_builder.exit,
							action() {
								closeConfirmation = false;

								if ( app.isBuilderInPopup() ) {
									app.builderInPopupClose( 'canceled' );
									return;
								}

								window.location.href = wpforms_builder.exit_url;
							},
						},
					},
				} );
			}
		},

		/**
		 * Close confirmation setter.
		 *
		 * @since 1.6.2
		 *
		 * @param {boolean} confirm Close confirmation flag value.
		 */
		setCloseConfirmation( confirm ) {
			closeConfirmation = !! confirm;
		},

		/**
		 * Check the current form state.
		 *
		 * @since 1.0.0
		 *
		 * @return {boolean} True if the form is saved.
		 */
		formIsSaved() {
			return wpf.savedState === wpf.getFormState( '#wpforms-builder-form' );
		},

		/**
		 * Check if the builder opened in the popup (iframe).
		 *
		 * @since 1.6.2
		 *
		 * @return {boolean} True if builder opened in the popup.
		 */
		isBuilderInPopup() {
			return window.self !== window.parent && window.self.frameElement.id === 'wpforms-builder-iframe';
		},

		/**
		 * Close popup with the form builder.
		 *
		 * @since 1.6.2
		 *
		 * @param {string} action Performed action: saved or canceled.
		 */
		builderInPopupClose( action ) {
			const $popup = window.parent.jQuery( '.wpforms-builder-popup' );
			const $title = $( '.wpforms-center-form-name' ).text();

			$popup.find( '#wpforms-builder-iframe' ).attr( 'src', 'about:blank' );
			$popup.fadeOut();

			$popup.trigger( 'wpformsBuilderInPopupClose', [ action, s.formID, $title ] );
		},

		//--------------------------------------------------------------------//
		// General / global
		//--------------------------------------------------------------------//

		/**
		 * Element bindings for general and global items.
		 *
		 * @since 1.2.0
		 */
		bindUIActionsGeneral() { // eslint-disable-line max-lines-per-function
			// Toggle Smart Tags
			$builder.on( 'click', '.toggle-smart-tag-display', app.smartTagToggle );

			$builder.on( 'click', '.smart-tags-list-display a', app.smartTagInsert );

			// Toggle unfoldable group of fields
			$builder.on( 'click', '.wpforms-panel-fields-group.unfoldable .wpforms-panel-fields-group-title', app.toggleUnfoldableGroup );

			// Hide field preview helper box.
			$builder.on( 'click', '.wpforms-field-helper-hide ', app.hideFieldHelper );

			// Field map table, update key source
			$builder.on( 'input', '.wpforms-field-map-table .key-source', function() {
				const value = $( this ).val(),
					$dest = $( this ).parent().parent().find( '.key-destination' ),
					name = $dest.data( 'name' );

				if ( value ) {
					$dest.attr( 'name', name.replace( '{source}', value.replace( /[^0-9a-zA-Z_-]/gi, '' ) ) );
				}
			} );

			// Field map table, delete row
			$builder.on( 'click', '.wpforms-field-map-table .remove', function( e ) {
				e.preventDefault();
				app.fieldMapTableDeleteRow( e, $( this ) );
			} );

			// Field map table, Add row
			$builder.on( 'click', '.wpforms-field-map-table .add', function( e ) {
				e.preventDefault();
				app.fieldMapTableAddRow( e, $( this ) );
			} );

			// Global select field mapping
			$( document ).on( 'wpformsFieldUpdate', app.fieldMapSelect );

			// Restrict user money input fields
			$builder.on( 'input', '.wpforms-money-input', function( event ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					amount = $this.val(),
					start = $this[ 0 ].selectionStart,
					end = $this[ 0 ].selectionEnd;

				$this.val( amount.replace( /[^0-9.,]/g, '' ) );
				$this[ 0 ].setSelectionRange( start, end );
			} );

			// Format user money input fields
			$builder.on( 'focusout', '.wpforms-money-input', function( event ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					amount = $this.val();

				if ( ! amount ) {
					return amount;
				}

				const sanitized = wpf.amountSanitize( amount ),
					formatted = wpf.amountFormat( sanitized );

				$this.val( formatted );
			} );

			// Show/hide a group of options.
			$builder.on( 'change', '.wpforms-panel-field-toggle', function() {
				const $input = $( this );

				if ( $input.prop( 'disabled' ) ) {
					return;
				}

				$input.prop( 'disabled', true );
				app.toggleOptionsGroup( $input );
			} );

			// Don't allow users to enable payments if storing entries has
			// been disabled in the General settings.
			$builder.on( 'change', app.getPaymentsTogglesSelector(), function( event ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					gateway = $this.attr( 'id' ).replace( /wpforms-panel-field-|-enable|_one_time|_recurring/gi, '' ),
					$notificationWrap = $( '.wpforms-panel-content-section-notifications [id*="-' + gateway + '-wrap"]' ),
					gatewayEnabled = $this.prop( 'checked' ) || $( '#wpforms-panel-field-' + gateway + '-enable_one_time' ).prop( 'checked' ) || $( '#wpforms-panel-field-' + gateway + '-enable_recurring' ).prop( 'checked' );

				if ( gatewayEnabled ) {
					const disabled = $( '#wpforms-panel-field-settings-disable_entries' ).prop( 'checked' );

					if ( disabled ) {
						$.confirm( {
							title: wpforms_builder.heads_up,
							content: wpforms_builder.payments_entries_off,
							icon: 'fa fa-exclamation-circle',
							type: 'orange',
							buttons: {
								confirm: {
									text: wpforms_builder.ok,
									btnClass: 'btn-confirm',
									keys: [ 'enter' ],
								},
							},
						} );

						$this.prop( 'checked', false );
					} else {
						$notificationWrap.removeClass( 'wpforms-hidden' );
					}
				} else {
					$notificationWrap.addClass( 'wpforms-hidden' );
					$notificationWrap.find( 'input[id*="-' + gateway + '"]' ).prop( 'checked', false );
				}
			} );

			// Disable entries toggle.
			$builder.on( 'change', '#wpforms-panel-field-settings-disable_entries', function( event ) { // eslint-disable-line no-unused-vars
				const $this = $( this );

				// Toggle the store spam entries toggle.
				$( '#wpforms-panel-field-settings-store_spam_entries-wrap' ).toggleClass( 'wpforms-hidden', $this.prop( 'checked' ) );

				// Don't allow users to disable entries if payments have been enabled.
				if ( $this.prop( 'checked' ) ) {
					if ( app.isPaymentsEnabled() ) {
						$.confirm( {
							title: wpforms_builder.heads_up,
							content: wpforms_builder.payments_on_entries_off,
							icon: 'fa fa-exclamation-circle',
							type: 'orange',
							buttons: {
								confirm: {
									text: wpforms_builder.ok,
									btnClass: 'btn-confirm',
									keys: [ 'enter' ],
								},
							},
						} );
						$this.prop( 'checked', false );
					} else {
						$.alert( {
							title: wpforms_builder.heads_up,
							content: wpforms_builder.disable_entries,
							icon: 'fa fa-exclamation-circle',
							type: 'orange',
							buttons: {
								confirm: {
									text: wpforms_builder.ok,
									btnClass: 'btn-confirm',
									keys: [ 'enter' ],
								},
							},
						} );
					}
				}
			} );

			// Upload or add an image.
			$builder.on( 'click', '.wpforms-image-upload-add', function( event ) {
				event.preventDefault();

				const $this = $( this );
				const $container = $this.parent();

				const mediaFrame = wpf.initMediaLibrary( {
					title: wpforms_builder.upload_image_title,
					extensions: wpforms_builder.upload_image_extensions,
					extensionsError: wpforms_builder.upload_image_extensions_error,
					buttonText: wpforms_builder.upload_image_button,
				} );

				mediaFrame.on( 'select', function() {
					const mediaAttachment = mediaFrame.state().get( 'selection' ).first().toJSON();
					const $preview = $container.find( '.preview' );

					$container.find( '.source' ).val( mediaAttachment.url );
					$preview.empty();
					$preview.prepend( '<img src="' + mediaAttachment.url + '" alt=""><a href="#" title="' + wpforms_builder.upload_image_remove + '" class="wpforms-image-upload-remove"><i class="fa fa-trash-o"></i></a>' );

					if ( $this.data( 'after-upload' ) === 'hide' ) {
						$this.hide();
					}

					$builder.trigger( 'wpformsImageUploadAdd', [ $this, $container ] );
				} ).on( 'close', function() {
					mediaFrame.off( 'library:selection:add' );
				} );

				// Now that everything has been set, let's open up the frame.
				mediaFrame.open();
			} );

			// Remove and uploaded image.
			$builder.on( 'click', '.wpforms-image-upload-remove', function( event ) {
				event.preventDefault();

				const $container = $( this ).parent().parent();

				$container.find( '.preview' ).empty();
				$container.find( '.wpforms-image-upload-add' ).show();
				$container.find( '.source' ).val( '' );

				$builder.trigger( 'wpformsImageUploadRemove', [ $( this ), $container ] );
			} );

			// Validate email smart tags in Notifications fields.
			$builder.on( 'blur', '.wpforms-notification .wpforms-panel-field-text input', function() {
				app.validateEmailSmartTags( $( this ) );
			} );
			$builder.on( 'blur', '.wpforms-notification .wpforms-panel-field-textarea textarea', function() {
				app.validateEmailSmartTags( $( this ) );
			} );

			// Validate From Email in Notification settings.
			$builder.on( 'focusout', '.wpforms-notification .wpforms-panel-field.js-wpforms-from-email-validation input', app.validateFromEmail );
			$builder.on( 'wpformsPanelSectionSwitch', app.notificationsPanelSectionSwitch );

			// Mobile notice primary button / close icon click.
			$builder.on( 'click', '#wpforms-builder-mobile-notice .wpforms-fullscreen-notice-button-primary, #wpforms-builder-mobile-notice .close', function() {
				window.location.href = wpforms_builder.exit_url;
			} );

			// Mobile notice secondary button click.
			$builder.on( 'click', '#wpforms-builder-mobile-notice .wpforms-fullscreen-notice-button-secondary', function() {
				window.location.href = wpf.updateQueryString( 'force_desktop_view', 1, window.location.href );
			} );

			// License Alert close button click.
			$( '#wpforms-builder-license-alert .close' ).on( 'click', function() {
				window.location.href = wpforms_builder.exit_url;
			} );

			// License Alert dismiss button click.
			$( '#wpforms-builder-license-alert .dismiss' ).on( 'click', function( event ) {
				event.preventDefault();
				$( '#wpforms-builder-license-alert' ).remove();
				wpCookies.set( 'wpforms-builder-license-alert', 'true', 3600 );
			} );

			// Don't allow the Akismet setting to be enabled if the Akismet plugin isn't available.
			$builder.on( 'change', '#wpforms-panel-field-settings-akismet.wpforms-akismet-disabled', function( event ) { // eslint-disable-line no-unused-vars
				const $this = $( this ),
					akismetStatus = $this.data( 'akismet-status' );

				if ( $this.prop( 'checked' ) ) {
					$.alert( {
						title: wpforms_builder.heads_up,
						content: wpforms_builder[ akismetStatus ],
						icon: 'fa fa-exclamation-circle',
						type: 'orange',
						buttons: {
							confirm: {
								text: wpforms_builder.ok,
								btnClass: 'btn-confirm',
								keys: [ 'enter' ],
							},
						},
						onClose() {
							$this.prop( 'checked', false );
						},
					} );
				}
			} );

			// Re-init Show More button for multiselect instances when it's visible.
			$builder.on( 'wpformsPanelSectionSwitch wpformsPanelSwitched', function() {
				wpf.reInitShowMoreChoices( $( '#wpforms-panel-providers, #wpforms-panel-settings' ) );
			} );
		},

		/**
		 * Notification section switch event handler.
		 *
		 * @since 1.8.2.3
		 *
		 * @param {Object} e     Event object.
		 * @param {string} panel Panel name.
		 */
		notificationsPanelSectionSwitch( e, panel ) {
			if ( panel !== 'notifications' ) {
				return;
			}

			$( '.wpforms-notification .wpforms-panel-field.js-wpforms-from-email-validation input' ).trigger( 'focusout' );
		},

		/**
		 * Check if one of the payment addons payments enabled.
		 *
		 * @since 1.7.5
		 *
		 * @return {boolean} True if one of the payment addons payment enabled.
		 */
		isPaymentsEnabled() {
			let paymentEnabled = false;

			$( app.getPaymentsTogglesSelector() ).each( function() {
				if ( $( this ).prop( 'checked' ) ) {
					paymentEnabled = true;

					return false;
				}
			} );

			return paymentEnabled;
		},

		/**
		 * Get Payments toggles selector.
		 *
		 * @since 1.7.5
		 *
		 * @return {string} List of selectors.
		 */
		getPaymentsTogglesSelector() {
			return `.wpforms-panel-content-section-payment-toggle-one-time input,
			.wpforms-panel-content-section-payment-toggle-recurring input,
			#wpforms-panel-field-stripe-enable,
			#wpforms-panel-field-paypal_standard-enable,
			#wpforms-panel-field-authorize_net-enable,
			#wpforms-panel-field-square-enable`;
		},

		/**
		 * Toggle an options group.
		 *
		 * @since 1.6.3
		 *
		 * @param {Object} $input Toggled field.
		 */
		toggleOptionsGroup( $input ) {
			const name = $input.attr( 'name' );
			let value = '';
			const $body = $( '.wpforms-panel-field-toggle-body[data-toggle="' + name + '"]' ),
				enableInput = function() {
					$input.prop( 'disabled', false );
				};

			if ( $body.length === 0 ) {
				enableInput();

				return;
			}

			const type = $input.attr( 'type' );

			if ( 'checkbox' === type || 'radio' === type ) {
				value = $input.prop( 'checked' ) ? $input.val() : '0';
			} else {
				value = $input.val();
			}

			$body.each( function() {
				const $this = $( this );

				// eslint-disable-next-line no-unused-expressions
				$this.attr( 'data-toggle-value' ).toString() === value.toString()
					? $this.slideDown( '', enableInput )
					: $this.slideUp( '', enableInput );
			} );
		},

		/**
		 * Toggle all option groups.
		 *
		 * @since 1.6.3
		 *
		 * @param {jQuery} $context Context container jQuery object.
		 */
		toggleAllOptionGroups( $context ) {
			$context = $context || $builder || $( '#wpforms-builder' ) || $( 'body' );

			if ( ! $context ) {
				return;
			}

			// Show a toggled bodies.
			$context.find( '.wpforms-panel-field-toggle' ).each( function() {
				const $input = $( this );

				$input.prop( 'disabled', true );
				app.toggleOptionsGroup( $input );
			} );
		},

		/**
		 * Toggle unfoldable group of fields.
		 *
		 * @since 1.6.8
		 *
		 * @param {Object} e Event object.
		 */
		toggleUnfoldableGroup( e ) {
			e.preventDefault();

			const $title = $( e.target ),
				$group = $title.closest( '.wpforms-panel-fields-group' ),
				$inner = $group.find( '.wpforms-panel-fields-group-inner' ),
				cookieName = 'wpforms_fields_group_' + $group.data( 'group' );

			if ( $group.hasClass( 'opened' ) ) {
				wpCookies.remove( cookieName );
				$inner.stop().slideUp( 150, function() {
					$group.removeClass( 'opened' );
				} );
			} else {
				wpCookies.set( cookieName, 'true', 2592000 ); // 1 month.
				$group.addClass( 'opened' );
				$inner.stop().slideDown( 150 );
			}
		},

		/**
		 * Hide field preview helper box.
		 *
		 * @since 1.7.1
		 *
		 * @param {Object} e Event object.
		 */
		hideFieldHelper( e ) {
			e.preventDefault();
			e.stopPropagation();

			const $helpers = $( '.wpforms-field-helper' ),
				cookieName = 'wpforms_field_helper_hide';

			wpCookies.set( cookieName, 'true', 30 * 24 * 60 * 60 ); // 1 month.
			$helpers.hide();
		},

		/**
		 * Smart Tag toggling.
		 *
		 * @since 1.0.1
		 * @since 1.6.9 Simplify method.
		 *
		 * @param {Event} e Event.
		 */
		smartTagToggle( e ) {
			e.preventDefault();

			// Prevent ajax to validate the default email queued on focusout event.
			elements.$focusOutTarget = null;

			const $this = $( this ),
				$wrapper = $this.closest( '.wpforms-panel-field,.wpforms-field-option-row' );

			if ( $wrapper.hasClass( 'smart-tags-toggling' ) ) {
				return;
			}

			$wrapper.addClass( 'smart-tags-toggling' );

			if ( $this.hasClass( 'smart-tag-showing' ) ) {
				app.removeSmartTagsList( $this );

				return;
			}

			app.insertSmartTagsList( $this );
		},

		/**
		 * Remove Smart Tag list.
		 *
		 * @since 1.6.9
		 *
		 * @param {jQuery} $el Toggle element.
		 */
		removeSmartTagsList( $el ) {
			const $wrapper = $el.closest( '.wpforms-panel-field,.wpforms-field-option-row' ),
				$list = $wrapper.find( '.smart-tags-list-display' );

			$el.find( 'span' ).text( wpforms_builder.smart_tags_show );

			$list.slideUp( '', function() {
				$list.remove();
				$el.removeClass( 'smart-tag-showing' );
				$wrapper.removeClass( 'smart-tags-toggling' );
			} );
		},

		/**
		 * Insert Smart Tag list.
		 *
		 * @since 1.6.9
		 *
		 * @param {jQuery} $el Toggle element.
		 */
		insertSmartTagsList( $el ) {
			const $wrapper = $el.closest( '.wpforms-panel-field,.wpforms-field-option-row' );
			let $label = $el.closest( 'label' ),
				insideLabel = true;

			if ( ! $label.length ) {
				$label = $wrapper.find( 'label' );
				insideLabel = false;
			}

			const smartTagList = app.getSmartTagsList( $el, $label.attr( 'for' ).indexOf( 'wpforms-field-option-' ) !== -1 );

			// eslint-disable-next-line no-unused-expressions
			insideLabel
				? $label.after( smartTagList )
				: $el.after( smartTagList );

			$el.find( 'span' ).text( wpforms_builder.smart_tags_hide );

			$wrapper.find( '.smart-tags-list-display' ).slideDown( '', function() {
				$el.addClass( 'smart-tag-showing' );
				$wrapper.removeClass( 'smart-tags-toggling' );
			} );
		},

		/**
		 * Get Smart Tag list markup.
		 *
		 * @since 1.6.9
		 *
		 * @param {jQuery}  $el           Toggle element.
		 * @param {boolean} isFieldOption Is a field option.
		 *
		 * @return {string} Smart Tags list markup.
		 */
		getSmartTagsList( $el, isFieldOption ) {
			let smartTagList;

			smartTagList = '<ul class="smart-tags-list-display unfoldable-cont">';
			smartTagList += app.getSmartTagsListFieldsElements( $el );
			smartTagList += app.getSmartTagsListOtherElements( $el, isFieldOption );
			smartTagList += '</ul>';

			return smartTagList;
		},

		/**
		 * Get Smart Tag fields elements markup.
		 *
		 * @since 1.6.9
		 *
		 * @param {jQuery} $el Toggle element.
		 *
		 * @return {string} Smart Tags list elements markup.
		 */
		getSmartTagsListFieldsElements( $el ) {
			const type = $el.data( 'type' );

			if ( ! [ 'fields', 'all' ].includes( type ) ) {
				return '';
			}

			const fields = app.getSmartTagsFields( $el );

			if ( ! fields ) {
				return '<li class="heading">' + wpforms_builder.fields_unavailable + '</li>';
			}

			let smartTagListElements = '';

			smartTagListElements += '<li class="heading">' + wpforms_builder.fields_available + '</li>';

			for ( const fieldKey in fields ) {
				smartTagListElements += app.getSmartTagsListFieldsElement( fields[ fieldKey ] );
			}

			return smartTagListElements;
		},

		/**
		 * Get fields that possible to create smart tag.
		 *
		 * @since 1.6.9
		 *
		 * @param {jQuery} $el Toggle element.
		 *
		 * @return {Array} Fields for smart tags.
		 */
		getSmartTagsFields( $el ) {
			const allowed = $el.data( 'fields' );
			const isAllowedRepeater = $el.data( 'allow-repeated-fields' );
			const allowedFields = allowed ? allowed.split( ',' ) : undefined;

			return wpf.getFields( allowedFields, true, isAllowedRepeater );
		},

		/**
		 * Get field markup for the Smart Tags list.
		 *
		 * @since 1.6.9
		 *
		 * @param {Object} field A field.
		 *
		 * @return {string} Smart Tags field markup.
		 */
		getSmartTagsListFieldsElement( field ) {
			const label = field.label
				? wpf.encodeHTMLEntities( wpf.sanitizeHTML( field.label ) )
				: wpforms_builder.field + ' #' + field.id;

			let html = `<li><a href="#" data-type="field" data-meta="${ field.id }">${ label }</a></li>`;

			const additionalTags = field.additional || [];

			// Add additional tags for `name`, `date/time` and `address` fields.
			if ( additionalTags.length > 1 ) {
				additionalTags.forEach( ( additionalTag ) => {
					// Capitalize the first letter and add space before numbers.
					const additionalTagLabel = additionalTag.charAt( 0 ).toUpperCase() + additionalTag.slice( 1 ).replace( /(\D)(\d)/g, '$1 $2' );
					html += `<li><a href="#" data-type="field" data-meta="${ field.id }" data-additional='${ additionalTag }'>${ label } – ${ additionalTagLabel }</a></li>`;
				} );
			}

			return html;
		},

		/**
		 * Get Smart Tag other elements markup.
		 *
		 * @since 1.6.9
		 *
		 * @param {jQuery}  $el           Toggle element.
		 * @param {boolean} isFieldOption Is a field option.
		 *
		 * @return {string} Smart Tags list elements markup.
		 */
		getSmartTagsListOtherElements( $el, isFieldOption ) {
			const type = $el.data( 'type' );
			let smartTagListElements;

			if ( type !== 'other' && type !== 'all' ) {
				return '';
			}

			smartTagListElements = '<li class="heading">' + wpforms_builder.other + '</li>';

			for ( const smartTagKey in wpforms_builder.smart_tags ) {
				if ( isFieldOption && wpforms_builder.smart_tags_disabled_for_fields.indexOf( smartTagKey ) > -1 ) {
					continue;
				}

				smartTagListElements += '<li><a href="#" data-type="other" data-meta=\'' + smartTagKey + '\'>' + wpforms_builder.smart_tags[ smartTagKey ] + '</a></li>';
			}

			return smartTagListElements;
		},

		/**
		 * Smart Tag insert.
		 *
		 * @since 1.0.1
		 * @since 1.6.9 TinyMCE compatibility.
		 *
		 * @param {Event} e Event.
		 */
		smartTagInsert( e ) { // eslint-disable-line complexity
			e.preventDefault();

			const $this = $( this ),
				$list = $this.closest( '.smart-tags-list-display' ),
				$wrapper = $list.closest( '.wpforms-panel-field,.wpforms-field-option-row' ),
				$toggle = $wrapper.find( '.toggle-smart-tag-display' ),
				$input = $wrapper.find( 'input[type=text], textarea' ),
				meta = $this.data( 'meta' ),
				additional = $this.data( 'additional' ) ? '|' + $this.data( 'additional' ) : '',
				type = $this.data( 'type' );
			let smartTag = type === 'field' ? '{field_id="' + meta + additional + '"}' : '{' + meta + '}',
				editor;

			if ( typeof tinyMCE !== 'undefined' ) {
				editor = tinyMCE.get( $input.prop( 'id' ) );

				if ( editor && ! editor.hasFocus() ) {
					editor.focus( true );
				}
			}

			if ( editor && ! editor.isHidden() ) {
				editor.insertContent( smartTag );
			} else {
				smartTag = ' ' + smartTag + ' ';

				$input.insertAtCaret( smartTag );

				// Remove redundant spaces after wrapping smartTag into spaces.
				$input.val( $input.val().trim().replace( '  ', ' ' ) );
				$input.trigger( 'focus' ).trigger( 'input' );
			}

			// Remove the list, all done!
			$list.slideUp( '', function() {
				$list.remove();
			} );

			$toggle.find( 'span' ).text( wpforms_builder.smart_tags_show );
			$wrapper.find( '.toggle-smart-tag-display' ).removeClass( 'smart-tag-showing' );
		},

		/**
		 * Field map table - Delete row.
		 *
		 * @since 1.2.0
		 * @since 1.6.1.2 Registered `wpformsFieldMapTableDeletedRow` trigger.
		 *
		 * @param {Event}   e  Event.
		 * @param {Element} el Element.
		 */
		fieldMapTableDeleteRow( e, el ) {
			const $this = $( el ),
				$row = $this.closest( 'tr' ),
				$table = $this.closest( 'table' ),
				$block = $row.closest( '.wpforms-builder-settings-block' ),
				total = $table.find( 'tr' ).length;

			if ( total > '1' ) {
				$row.remove();

				$builder.trigger( 'wpformsFieldMapTableDeletedRow', [ $block ] );
			}
		},

		/**
		 * Field map table - Add row.
		 *
		 * @since 1.2.0
		 * @since 1.6.1.2 Registered `wpformsFieldMapTableAddedRow` trigger.
		 *
		 * @param {Event}   e  Event.
		 * @param {Element} el Element.
		 */
		fieldMapTableAddRow( e, el ) {
			const $this = $( el ),
				$row = $this.closest( 'tr' ),
				$block = $row.closest( '.wpforms-builder-settings-block' ),
				choice = $row.clone().insertAfter( $row );

			choice.find( 'input' ).val( '' );
			choice.find( 'select :selected' ).prop( 'selected', false );
			choice.find( '.key-destination' ).attr( 'name', '' );

			$builder.trigger( 'wpformsFieldMapTableAddedRow', [ $block, choice ] );
		},

		/**
		 * Update field mapped select items on form updates.
		 *
		 * @since 1.2.0
		 * @since 1.6.1.2 Registered `wpformsFieldSelectMapped` trigger.
		 *
		 * @param {Event}  e      Event.
		 * @param {Object} fields Fields.
		 */
		fieldMapSelect( e, fields ) { // eslint-disable-line max-lines-per-function
			const event = WPFormsUtils.triggerEvent( $builder, 'wpformsBeforeFieldMapSelectUpdate' );

			// Allow callbacks on `wpformsBeforeFieldMapSelectUpdate` to cancel adding field
			// by triggering `event.preventDefault()`.
			if ( event.isDefaultPrevented() ) {
				return;
			}

			$( '.wpforms-field-map-select' ).each( function( index, el ) { // eslint-disable-line complexity, no-unused-vars
				const $this = $( this );
				let allowedFields = $this.data( 'field-map-allowed' ),
					placeholder = $this.data( 'field-map-placeholder' );

				// Check if custom placeholder was provided.
				if ( typeof placeholder === 'undefined' || ! placeholder ) {
					placeholder = wpforms_builder.select_field;
				}

				// If allowed, fields are not defined, bail.
				if ( typeof allowedFields !== 'undefined' && allowedFields ) {
					allowedFields = allowedFields.split( ' ' );
				} else {
					return;
				}

				const selected = $this.find( 'option:selected' ).val();

				// Reset select and add a placeholder option.
				$this.empty().append( $( '<option>', { value: '', text: placeholder } ) );

				// Loop through the current fields, if we have fields for the form.
				if ( fields && ! $.isEmptyObject( fields ) ) {
					for ( const fieldID in fields ) {
						let label = '';

						if ( ! fields[ fieldID ] ) {
							continue;
						}

						// Prepare the label.
						if ( typeof fields[ fieldID ].label !== 'undefined' && fields[ fieldID ].label.toString().trim() !== '' ) {
							label = wpf.sanitizeHTML( fields[ fieldID ].label.toString().trim() );
						} else {
							label = wpforms_builder.field + ' #' + fieldID;
						}

						// Add to select if it is a field type allowed.
						if ( $.inArray( fields[ fieldID ].type, allowedFields ) >= 0 || $.inArray( 'all-fields', allowedFields ) >= 0 ) {
							$this.append( $( '<option>', { value: fields[ fieldID ].id, text: label } ) );
						}
					}
				}

				// Restore previous value if found.
				if ( selected ) {
					$this.find( 'option[value="' + selected + '"]' ).prop( 'selected', true );
				}

				// Add a "Custom Value" option if it is supported.
				const customValueSupport = $this.data( 'custom-value-support' );

				if ( typeof customValueSupport === 'boolean' && customValueSupport ) {
					$this.append(
						$( '<option>', {
							value: 'custom_value',
							text: wpforms_builder.add_custom_value_label,
							class: 'wpforms-field-map-option-custom-value',
						} )
					);
				}

				$builder.trigger( 'wpformsFieldSelectMapped', [ $this ] );
			} );
		},

		/**
		 * Validate email smart tags in Notifications fields.
		 *
		 * @param {Object} $el Input field to check the value for.
		 *
		 * @since 1.4.9
		 */
		validateEmailSmartTags( $el ) {
			let val = $el.val();

			if ( ! val ) {
				return;
			}

			// Turns '{email@domain.com}' into 'email@domain.com'.
			// Email RegEx inspired by http://emailregex.com
			val = val.replace( /{(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))}/g, function( x ) {
				return x.slice( 1, -1 );
			} );

			$el.val( val );
		},

		/**
		 * Validate From Email in Notification block.
		 *
		 * @since 1.8.1
		 */
		validateFromEmail() {
			const $field = $( this );
			const value = $field.val().trim();
			const $fieldWrapper = $field.parent();
			const $warning = $fieldWrapper.find( '.wpforms-alert-warning-wide' );
			const warningClass = 'wpforms-panel-field-warning';

			const blockedSymbolsRegex = /[\s,;]/g;

			if ( blockedSymbolsRegex.test( value ) ) {
				$warning.remove();
				$fieldWrapper.addClass( warningClass );
				app.validationErrorNotificationPopup( wpforms_builder.allow_only_one_email );

				return;
			}

			const data = {
				form_id: s.formID, // eslint-disable-line camelcase
				email: $field.val(),
				nonce: wpforms_builder.nonce,
				action: 'wpforms_builder_notification_from_email_validate',
			};

			$.post(
				wpforms_builder.ajax_url, data, function( res ) {
					if ( res.success ) {
						$warning.remove();
						$fieldWrapper.removeClass( warningClass );

						return;
					}

					$fieldWrapper.addClass( warningClass );

					if ( $warning.length ) {
						$warning.replaceWith( res.data );

						return;
					}

					$fieldWrapper.append( res.data );
				} )
				.fail( function( xhr, textStatus, e ) { // eslint-disable-line no-unused-vars
					// eslint-disable-next-line no-console
					console.log( xhr.responseText );
				} );
		},

		//--------------------------------------------------------------------//
		// Icon Choices
		//--------------------------------------------------------------------//

		/**
		 * Icon Choices component.
		 *
		 * @since 1.7.9
		 */
		iconChoices: {

			/**
			 * Runtime component cache.
			 *
			 * Field "toggle": "Use icon choices" toggle that initiated the installation.
			 * Field "previousModal": Last open modal that may need to be closed.
			 *
			 * @since 1.7.9
			 */
			cache: {},

			/**
			 * Component configuration settings.
			 *
			 * @since 1.7.9
			 */
			config: {
				colorPropertyName: '--wpforms-icon-choices-color',
			},

			/**
			 * Initialize the component.
			 *
			 * @since 1.7.9
			 */
			init() {
				// Extend jquery-confirm plugin with max-height support for the content area.
				app.iconChoices.extendJqueryConfirm();

				$builder.on( 'wpformsBuilderReady', function( event ) {
					// If there are Icon Choices fields but the library is not installed - force install prompt.
					if ( wpforms_builder.icon_choices.is_active && ! wpforms_builder.icon_choices.is_installed ) {
						app.iconChoices.openInstallPromptModal( true );

						// Prevent the Form Builder from getting ready (hold the loading state).
						event.preventDefault();
					}
				} );

				// Toggle Icon Choices on or off.
				$builder.on( 'change', '.wpforms-field-option-row-choices_icons input', app.iconChoices.toggleIconChoices );

				// Change accent color.
				$builder.on( 'change', '.wpforms-field-option-row-choices_icons_color .wpforms-color-picker', app.iconChoices.changeIconsColor );

				// Update field preview when option value is changed (style, size).
				$builder.on( 'change', '.wpforms-field-option-row-choices_icons_style select, .wpforms-field-option-row-choices_icons_size select', function() {
					const fieldID = $( this ).parent().data( 'field-id' ),
						fieldType = $( '#wpforms-field-option-' + fieldID ).find( '.wpforms-field-option-hidden-type' ).val();

					app.fieldChoiceUpdate( fieldType, fieldID );
				} );

				// Open Icon Picker modal.
				$builder.on( 'click', '.wpforms-field-option-row-choices .choices-list .wpforms-icon-select', app.iconChoices.openIconPickerModal );
			},

			/**
			 * Turn the feature on or off.
			 *
			 * @since 1.7.9
			 */
			toggleIconChoices() { // eslint-disable-line complexity
				const $this = $( this ),
					checked = $this.is( ':checked' );

				// Check if a required icon library is installed.
				if ( checked && ! wpforms_builder.icon_choices.is_installed ) {
					app.iconChoices.cache.toggle = $this;
					app.iconChoices.openInstallPromptModal();

					return;
				}

				const fieldID = $this.closest( '.wpforms-field-option-row' ).data( 'field-id' );
				const $fieldOptions = $( `#wpforms-field-option-${ fieldID }` ),
					$imageChoices = $fieldOptions.find( `#wpforms-field-option-${ fieldID }-choices_images` ),
					$choicesList = $fieldOptions.find( `#wpforms-field-option-row-${ fieldID }-choices ul` );

				// Turn Image Choice off.
				if ( checked && $imageChoices.is( ':checked' ) ) {
					$imageChoices.prop( 'checked', false ).trigger( 'change' );
				}

				// Toggle Advanced > Dynamic Choices on or off.
				$fieldOptions.find( `#wpforms-field-option-row-${ fieldID }-dynamic_choices` ).toggleClass( 'wpforms-hidden', checked );

				// Toggle subfields.
				$fieldOptions.find( `#wpforms-field-option-row-${ fieldID }-choices_icons_color` ).toggleClass( 'wpforms-hidden' );
				$fieldOptions.find( `#wpforms-field-option-row-${ fieldID }-choices_icons_size` ).toggleClass( 'wpforms-hidden' );
				$fieldOptions.find( `#wpforms-field-option-row-${ fieldID }-choices_icons_style` ).toggleClass( 'wpforms-hidden' );

				const $colorOption = $fieldOptions.find( `#wpforms-field-option-${ fieldID }-choices_icons_color` ),
					colorValue = _.isEmpty( $colorOption.val() ) ? wpforms_builder.icon_choices.default_color : $colorOption.val();

				// Set accent color for all choices.
				$choicesList.prop( 'style', `${ app.iconChoices.config.colorPropertyName }: ${ colorValue };` );

				// Toggle icon selectors with previews for all choices.
				$choicesList.toggleClass( 'show-icons', checked );

				// Set layout to inline on activation, revert to one column on deactivation.
				$fieldOptions.find( `#wpforms-field-option-${ fieldID }-input_columns` ).val( checked ? 'inline' : '' ).trigger( 'change' );

				// Finally, update the preview.
				app.fieldChoiceUpdate( $fieldOptions.find( '.wpforms-field-option-hidden-type' ).val(), fieldID );
			},

			/**
			 * Change accent color and update previews.
			 *
			 * @since 1.7.9
			 */
			changeIconsColor() {
				const $this = $( this ),
					fieldID = $this.parents( '.wpforms-field-option-row' ).data( 'field-id' ),
					$field = $( '#wpforms-field-option-' + fieldID ),
					type = $field.find( '.wpforms-field-option-hidden-type' ).val(),
					$choicesList = $field.find( '.wpforms-field-option-row-choices .choices-list' ),
					colorValue = app.getValidColorPickerValue( $this );

				// Update icons color in options panel.
				$choicesList.prop( 'style', `${ app.iconChoices.config.colorPropertyName }: ${ colorValue };` );

				// Update preview.
				app.fieldChoiceUpdate( type, fieldID );
			},

			/**
			 * Open a modal prompting to install the icon library for Icon Choices.
			 *
			 * @since 1.7.9
			 *
			 * @param {boolean} force Whether it's a normal installation procedure or forced if the library is necessary but is missing.
			 */
			openInstallPromptModal( force = false ) {
				const content = force
					? wpforms_builder.icon_choices.strings.reinstall_prompt_content
					: wpforms_builder.icon_choices.strings.install_prompt_content;

				const modal = $.confirm( {
					title: wpforms_builder.heads_up,
					content,
					icon: 'fa fa-info-circle',
					type: 'orange',
					buttons: {
						continue: {
							text: wpforms_builder.continue,
							btnClass: 'btn-confirm',
							keys: [ 'enter' ],
							action() {
								this.setIcon( 'fa fa-cloud-download' );
								this.setTitle( wpforms_builder.icon_choices.strings.install_title );
								this.setContent( wpforms_builder.icon_choices.strings.install_content );

								$.each( this.buttons, function( _index, button ) {
									button.hide();
								} );

								app.iconChoices.installIconLibrary();

								// Do not close the modal.
								return false;
							},
						},
					},
					onOpen() {
						// Turn the toggle off during normal installation.
						if ( ! force && app.iconChoices.cache.toggle ) {
							app.iconChoices.cache.toggle.prop( 'checked', false );
						}

						app.iconChoices.cache.previousModal = this;
					},
				} );

				// Add a Cancel button for normal installation routine only.
				if ( ! force ) {
					modal.buttons.cancel = {
						text: wpforms_builder.cancel,
						keys: [ 'esc' ],
						action() {
							app.iconChoices.cache.toggle.prop( 'checked', false );
						},
					};
				}
			},

			/**
			 * Silently download and install the icon library on the server.
			 *
			 * @since 1.7.9
			 */
			installIconLibrary() {
				const data = {
					// eslint-disable-next-line camelcase
					_wp_http_referer: wpf.updateQueryString( '_wp_http_referer', null ),
					nonce: wpforms_builder.nonce,
					action: 'wpforms_icon_choices_install',
				};

				$.ajaxSetup( {
					type: 'POST',
					timeout: 120000, // 2 minutes.
				} );

				$.post( wpforms_builder.ajax_url, data, function( response ) {
					// eslint-disable-next-line no-unused-expressions
					response.success
						? app.iconChoices.openInstallSuccessModal()
						: app.iconChoices.openInstallErrorModal( response );
				} ).fail( function( jqXHR ) {
					app.iconChoices.openInstallErrorModal( jqXHR );
				} );
			},

			/**
			 * Open a modal on icon library installation success.
			 *
			 * @since 1.7.9
			 */
			openInstallSuccessModal() {
				$.confirm( {
					title: wpforms_builder.done,
					content: wpforms_builder.icon_choices.strings.install_success_content,
					icon: 'fa fa-check-circle',
					type: 'green',
					buttons: {
						confirm: {
							text: wpforms_builder.ok,
							btnClass: 'btn-confirm',
							keys: [ 'enter' ],
							action() {
								if ( app.iconChoices.cache.toggle ) {
									app.iconChoices.cache.toggle.prop( 'checked', true );

									const fieldId = app.iconChoices.cache.toggle.parents( '.wpforms-field-option-row' ).data( 'field-id' );
									const $imageChoices = $builder.find( `#wpforms-field-option-${ fieldId }-choices_images` );

									// Turn Image Choice off, if needed, without triggering change event.
									if ( $imageChoices.is( ':checked' ) ) {
										$imageChoices.prop( 'checked', false );
									}
								}

								app.formSave( false ).done( function() {
									window.location.reload();
								} );
							},
						},
					},
					onOpen() {
						if ( app.iconChoices.cache.toggle ) {
							const fieldId = app.iconChoices.cache.toggle.parents( '.wpforms-field-option-row-choices_icons' ).data( 'field-id' );

							$builder.find( `#wpforms-field-option-${ fieldId }-input_columns` ).val( 'inline' );
						}

						app.iconChoices.cache.previousModal.close();
					},
				} );
			},

			/**
			 * Open a modal on icon library installation failure.
			 *
			 * @since 1.7.9
			 *
			 * @param {Object} errorData Unsuccessful ajax JSON response or jqXHR object.
			 */
			openInstallErrorModal( errorData ) {
				$.confirm( {
					title: wpforms_builder.uh_oh,
					content: wpforms_builder.icon_choices.strings.install_error_content,
					icon: 'fa fa-exclamation-circle',
					type: 'red',
					buttons: {
						confirm: {
							text: wpforms_builder.ok,
							btnClass: 'btn-confirm',
							keys: [ 'enter' ],
							action() {
								if ( app.iconChoices.cache.toggle ) {
									app.iconChoices.cache.toggle.prop( 'checked', false );
								} else {
									app.formSaveError();
								}
							},
						},
					},
					onOpen() {
						wpf.debug( errorData );
						app.iconChoices.cache.previousModal.close();
					},
					onDestroy() {
						// Clean up the cache, we're done.
						delete app.iconChoices.cache.previousModal;
						delete app.iconChoices.cache.toggle;
					},
				} );
			},

			/**
			 * Extend jquery-confirm plugin with support of max-height for the content area.
			 *
			 * @since 1.7.9
			 */
			extendJqueryConfirm() {
				// Extend a method of global instance.
				window.Jconfirm.prototype._updateContentMaxHeight = function() { // noinspection JSUnusedGlobalSymbols
					const height = $( window ).height() - ( this.$jconfirmBox.outerHeight() - this.$contentPane.outerHeight() ) - ( this.offsetTop + this.offsetBottom );

					// Custom property, if set via jquery-confirm options.
					const maxHeight = this.contentMaxHeight || height;

					this.$contentPane.css( {
						'max-height': Math.min( maxHeight, height ) + 'px',
					} );
				};
			},

			/**
			 * Open Icon Picker modal.
			 *
			 * @since 1.7.9
			 */
			openIconPickerModal() {
				const $this = $( this );

				const data = {
					fieldId: $this.parents( '.wpforms-field-option-row' ).data( 'field-id' ),
					choiceId: $this.parent().data( 'key' ),
					selectedIcon: $this.find( '.source-icon' ).val(),
					selectedIconStyle: $this.find( '.source-icon-style' ).val(),
				};

				const title = `
					${ wpforms_builder.icon_choices.strings.icon_picker_title }
					<span class="wpforms-icon-picker-description">${ wpforms_builder.icon_choices.strings.icon_picker_description }</span>
					<input type="text" placeholder="${ wpforms_builder.icon_choices.strings.icon_picker_search_placeholder }" class="search" id="wpforms-icon-picker-search">
				`;

				const content = `
					<div class="wpforms-icon-picker-container" id="wpforms-icon-picker-icons">
						<ul class="wpforms-icon-picker-icons" data-field-id="${ data.fieldId }" data-choice-id="${ data.choiceId }"></ul>
						<ul class="wpforms-icon-picker-pagination"></ul>
						<p class="wpforms-icon-picker-not-found wpforms-hidden" data-message="${ wpforms_builder.icon_choices.strings.icon_picker_not_found }"></>
					</div>`;

				$.confirm( {
					title,
					titleClass: 'wpforms-icon-picker-title',
					content,
					icon: false,
					closeIcon: true,
					type: 'orange',
					backgroundDismiss: true,
					boxWidth: 800,
					contentMaxHeight: 368, // Custom property, see app.iconChoices.extendJqueryConfirm().
					smoothContent: false,
					buttons: false,
					onOpenBefore() {
						// Add custom classes to target various elements.
						this.$body.addClass( 'wpforms-icon-picker-jconfirm-box' );
						this.$contentPane.addClass( 'wpforms-icon-picker-jconfirm-content-pane' );
					},
					onContentReady() {
						const modal = this;

						// Initialize the list of icons with List.js and display the 1st page.
						app.iconChoices.initIconsList( data );

						// Focus the search input.
						modal.$title.find( '.search' ).focus();

						// Listen for clicks on icons to select them.
						modal.$content.find( '.wpforms-icon-picker-icons' ).on( 'click', 'li', function() {
							app.iconChoices.selectIcon( modal, $( this ) );
						} );
					},
				} );
			},

			/**
			 * Initialize List.js in the Icon Selector modal on demand and cache it.
			 *
			 * @since 1.7.9
			 *
			 * @param {Object} data Source option data - field and choice IDs, selected icon name and style.
			 */
			initIconsList( data ) {
				const options = {
					valueNames: [ 'name' ],
					listClass: 'wpforms-icon-picker-icons',
					page: wpforms_builder.icon_choices.icons_per_page,
					pagination: {
						paginationClass: 'wpforms-icon-picker-pagination',
					},
					item( values ) {
						const maybeSelectedClass = ( values.icon === data.selectedIcon && values.style === data.selectedIconStyle ) ? 'class="selected"' : '';

						return `
								<li data-icon="${ values.icon }" data-icon-style="${ values.style }"${ maybeSelectedClass }>
									<i class="ic-fa-${ values.style } ic-fa-${ values.icon }"></i>
									<span class="name">${ values.icon }</span>
								</li>`;
					},
					indexAsync: true,
				};

				// Initialize List.js instance.
				const iconsList = new List( 'wpforms-icon-picker-icons', options, wpforms_builder.icon_choices.icons );

				// Initialize infinite scroll pagination on the list instance.
				app.iconChoices.infiniteScrollPagination( iconsList );

				// Bind search to custom input.
				$( '#wpforms-icon-picker-search' ).on( 'keyup', function() {
					// Custom partial match search.
					iconsList.search( $( this ).val(), [ 'name' ], function( searchString, columns ) { // eslint-disable-line no-unused-vars
						for ( let index = 0, length = iconsList.items.length; index < length; index++ ) {
							iconsList.items[ index ].found = ( new RegExp( searchString ) ).test( iconsList.items[ index ].values().icon );
						}
					} );
				} );

				// Show "nothing found" message if the search returned no results.
				iconsList.on( 'searchComplete', function() {
					const $element = $( '.wpforms-icon-picker-not-found' );

					$element.html( $element.data( 'message' ).replace( '{keyword}', $( '#wpforms-icon-picker-search' ).val() ) );
					$element.toggleClass( 'wpforms-hidden', ! _.isEmpty( iconsList.matchingItems ) );
				} );
			},

			/**
			 * Handle infinite scroll on the list of icons.
			 *
			 * @since 1.7.9
			 *
			 * @param {Object} list List.js instance.
			 */
			infiniteScrollPagination( list ) {
				let page = 1;

				const options = {
					root: document.querySelector( '.wpforms-icon-picker-jconfirm-content-pane' ),
					rootMargin: '600px', // 5 rows of icons. Formula: 20 + ( (96 + 20) * rows ).
				};

				const observer = new IntersectionObserver( function( entries ) {
					if ( ! entries[ 0 ].isIntersecting ) {
						return;
					}

					page++;
					list.show( 0, page * wpforms_builder.icon_choices.icons_per_page );
				}, options );

				observer.observe( document.querySelector( '.wpforms-icon-picker-pagination' ) );
			},

			/**
			 * When an icon is selected, update the choice and the field preview.
			 *
			 * @since 1.7.9
			 *
			 * @param {Object} modal Current jQuery Confirm modal instance.
			 * @param {jQuery} $this The list item (icon) that was clicked.
			 */
			selectIcon( modal, $this ) {
				const fieldId = $this.parent().data( 'field-id' );
				const choiceId = $this.parent().data( 'choice-id' );
				const icon = $this.data( 'icon' );
				const iconStyle = $this.data( 'icon-style' );
				const $choice = $( '#wpforms-field-option-row-' + fieldId + '-choices ul li[data-key=' + choiceId + ']' );
				const fieldType = $( '#wpforms-field-option-row-' + fieldId + '-choices ul' ).data( 'field-type' );

				$this.addClass( 'selected' );
				$this.siblings( '.selected' ).removeClass( 'selected' );

				$choice.find( '.wpforms-icon-select span' ).text( icon );
				$choice.find( '.wpforms-icon-select .ic-fa-preview' ).removeClass().addClass( `ic-fa-preview ic-fa-${ iconStyle } ic-fa-${ icon }` );
				$choice.find( '.wpforms-icon-select .source-icon' ).val( icon );
				$choice.find( '.wpforms-icon-select .source-icon-style' ).val( iconStyle );

				app.fieldChoiceUpdate( fieldType, fieldId );

				modal.close();
			},
		},

		//--------------------------------------------------------------------//
		// Alerts (notices).
		//--------------------------------------------------------------------//

		/**
		 * Click on the Dismiss notice button.
		 *
		 * @since 1.6.7
		 */
		dismissNotice() {
			$builder.on( 'click', '.wpforms-alert-field-not-available .wpforms-dismiss-button', function( e ) {
				e.preventDefault();

				const $button = $( this ),
					$alert = $button.closest( '.wpforms-alert' ),
					fieldId = $button.data( 'field-id' );

				$alert.addClass( 'out' );
				setTimeout( function() {
					$alert.remove();
				}, 250 );

				if ( fieldId ) {
					$( '#wpforms-field-option-' + fieldId ).remove();
				}
			} );
		},

		//--------------------------------------------------------------------//
		// Other functions.
		//--------------------------------------------------------------------//

		/**
		 * Trim long form titles.
		 *
		 * @since 1.0.0
		 */
		trimFormTitle() {
			const $title = $( '.wpforms-center-form-name' );

			if ( $title.text().length > 38 ) {
				const shortTitle = $title.text().trim().substring( 0, 38 ).split( ' ' ).slice( 0, -1 ).join( ' ' ) + '...';

				$title.text( shortTitle );
			}
		},

		/**
		 * Load or refresh color picker.
		 *
		 * @since 1.2.1
		 * @since 1.7.9 Added default value support.
		 */
		loadColorPickers() {
			$( '.wpforms-color-picker' ).each( function() {
				const $this = $( this );

				// If it appears to be already initialized, reset. This is necessary when duplicating fields with color pickers.
				if ( $this.hasClass( 'minicolors-input' ) ) {
					$this.minicolors( 'destroy' );
				}

				$this.minicolors( {
					defaultValue: $this.data( 'fallback-color' ) || '',
				} );
			} );
		},

		/**
		 * Get a valid color value from color picker or a default one.
		 *
		 * @since 1.7.9
		 *
		 * @param {Object} $colorPicker Current field.
		 *
		 * @return {string} Always valid color value.
		 */
		getValidColorPickerValue( $colorPicker ) {
			const color = $colorPicker.minicolors( 'value' );

			// jQuery MiniColors returns "black" RGB object if the color value is invalid.
			const isInvalid = _.isEqual( $colorPicker.minicolors( 'rgbObject' ), { r: 0, g: 0, b: 0 } );
			const isBlack = _.includes( [ '#000', '#000000' ], color );

			// If default value isn't provided via the data attribute, use black.
			const defaultValue = $colorPicker.data( 'fallback-color' ) || '#000000';

			return isInvalid && ! isBlack ? defaultValue : color;
		},

		/**
		 * Hotkeys:
		 * Ctrl+H - Help.
		 * Ctrl+P - Preview.
		 * Ctrl+B - Embed.
		 * Ctrl+E - Entries.
		 * Ctrl+S - Save.
		 * Ctrl+Q - Exit.
		 * Ctrl+/ - Keyboard Shortcuts modal.
		 * Ctrl+F - Focus search fields input.
		 * Ctrl+T - Toggle sidebar (Alt+S on Windows and Linux).
		 *
		 * @since 1.2.4
		 */
		builderHotkeys() {
			$( document ).on( 'keydown', function( e ) { // eslint-disable-line complexity
				// Toggle sidebar on Alt+S (on Windows and Linux).
				if ( ( browser.isLinux || browser.isWindows ) && e.altKey && e.keyCode === 83 ) {
					$( elements.$sidebarToggle, $builder ).trigger( 'click' );

					return;
				}

				if ( ! e.ctrlKey ) {
					return;
				}

				switch ( e.keyCode ) {
					case 72: // Open the Help screen on Ctrl+H.
						$( elements.$helpButton, $builder ).trigger( 'click' );
						break;

					case 80: // Open the Form Preview tab on Ctrl+P.
						window.open( wpforms_builder.preview_url );
						break;

					case 66: // Trigger the Embed modal on Ctrl+B.
						$( elements.$embedButton, $builder ).trigger( 'click' );
						break;

					case 69: // Open the Entries tab on Ctrl+E.
						window.open( wpforms_builder.entries_url );
						break;

					case 83: // Trigger the Builder save on Ctrl+S.
						$( elements.$saveButton, $builder ).trigger( 'click' );
						break;

					case 81: // Trigger the Exit on Ctrl+Q.
						$( elements.$exitButton, $builder ).trigger( 'click' );
						break;

					case 191: // Keyboard shortcuts modal on Ctrl+/.
						app.openKeyboardShortcutsModal();
						break;

					case 84: // Toggle sidebar on Ctrl+T.
						$( elements.$sidebarToggle, $builder ).trigger( 'click' );
						break;

					case 70: // Focus search fields input on Ctrl+F.
						elements.$addFieldsTab.trigger( 'click' );
						elements.$fieldsSidebar.scrollTop( 0 );
						elements.$searchInput.focus();
						break;

					default:
						return;
				}

				return false;
			} );
		},

		/**
		 * Open Keyboard Shortcuts modal.
		 *
		 * @since 1.6.9
		 */
		openKeyboardShortcutsModal() {
			// Close already opened instance.
			if ( $( '.wpforms-builder-keyboard-shortcuts' ).length ) {
				jconfirm.instances[ jconfirm.instances.length - 1 ].close();

				return;
			}

			$.alert( {
				title: wpforms_builder.shortcuts_modal_title,
				content: wpforms_builder.shortcuts_modal_msg + wp.template( 'wpforms-builder-keyboard-shortcuts' )(),
				icon: 'fa fa-keyboard-o',
				type: 'blue',
				boxWidth: '550px',
				smoothContent: false,
				buttons: {
					confirm: {
						text: wpforms_builder.close,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
				onOpenBefore() {
					this.$body.addClass( 'wpforms-builder-keyboard-shortcuts' );
					// Dynamically change the shortcut key documentation on Windows/Linux.
					if ( browser.isLinux || browser.isWindows ) {
						this.$body.find( '.shortcut-key.shortcut-key-ctrl-t' ).html( '<i>alt</i><i>s</i>' );
					}
				},
			} );
		},

		/**
		 * Register JS templates for various elements.
		 *
		 * @since 1.4.8
		 */
		registerTemplates() {
			if ( typeof WPForms === 'undefined' ) {
				return;
			}

			WPForms.Admin.Builder.Templates.add( [
				'wpforms-builder-confirmations-message-field',
				'wpforms-builder-conditional-logic-toggle-field',
			] );
		},

		/**
		 * Exit builder.
		 *
		 * @since 1.5.7
		 * @since 1.7.8 Deprecated.
		 */
		exitBack() {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Function "WPFormsBuilder.exitBack()" has been deprecated.' );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

WPFormsBuilder.init();
