/* global wpforms_builder, wpf, WPFormsBuilder, WPFormsFormTemplates */
/* eslint-disable no-console */

/**
 * @param wpforms_builder.blank_form
 * @param wpforms_builder.error_select_template
 * @param wpforms_builder.form_meta
 * @param wpforms_builder.template_confirm
 * @param wpforms_builder.use_default_template
 */

// noinspection ES6ConvertVarToLetConst
/**
 * Form Builder Setup Panel module.
 *
 * @since 1.6.8
 */

var WPForms = window.WPForms || {}; // eslint-disable-line no-var

WPForms.Admin = WPForms.Admin || {};
WPForms.Admin.Builder = WPForms.Admin.Builder || {};

WPForms.Admin.Builder.Setup = WPForms.Admin.Builder.Setup || ( function( document, window, $ ) {
	/**
	 * Elements holder.
	 *
	 * @since 1.6.8
	 *
	 * @type {Object}
	 */
	const el = {};

	/**
	 * Runtime variables.
	 *
	 * @since 1.6.8
	 *
	 * @type {Object}
	 */
	const vars = {};

	/**
	 * Active template name.
	 *
	 * @since 1.7.6
	 */
	const activeTemplateName = $( '.wpforms-template.selected .wpforms-template-name' ).text().trim();

	/**
	 * Public functions and properties.
	 *
	 * @since 1.6.8
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.6.8
		 */
		init() {
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
		},

		/**
		 * DOM is fully loaded.
		 *
		 * @since 1.6.8
		 */
		ready() {
			app.setup();
			app.setPanelsToggleState();
			app.setupTitleFocus();
			app.setTriggerBlankLink();
			app.events();

			// Trigger `wpformsBuilderPanelLoaded` event only when the panel is available in DOM.
			if ( el.$panel.length ) {
				el.$builder.trigger( 'wpformsBuilderPanelLoaded', [ 'setup' ] );
			}

			el.$builder.trigger( 'wpformsBuilderSetupReady' );
		},

		/**
		 * Page load.
		 *
		 * @since 1.6.8
		 */
		load() {
			app.applyTemplateOnRequest();
		},

		/**
		 * Setup. Prepare some variables.
		 *
		 * @since 1.6.8
		 */
		setup() {
			// Cache DOM elements.
			el.$builder = $( '#wpforms-builder' );
			el.$form = $( '#wpforms-builder-form' );
			el.$formName = $( '#wpforms-setup-name' );
			el.$panel = $( '#wpforms-panel-setup' );
			el.$categories = $( '#wpforms-panel-setup .wpforms-setup-templates-categories' );
			el.$subcategories = $( '#wpforms-panel-setup .wpforms-setup-templates-subcategories' );

			// Other values.
			vars.spinner = '<i class="wpforms-loading-spinner wpforms-loading-white wpforms-loading-inline"></i>';
			vars.formID = el.$form.data( 'id' );
		},

		/**
		 * Bind events.
		 *
		 * @since 1.6.8
		 */
		events() {
			el.$builder.on( 'wpformsBuilderPanelLoaded', app.panelLoaded );

			// Focus on the form title field when displaying a setup panel.
			el.$builder
				.on( 'wpformsPanelSwitched', app.setupTitleFocus );

			// Sync Setup title and settings title.
			el.$builder
				.on( 'input', '#wpforms-panel-field-settings-form_title', app.syncTitle )
				.on( 'input', '#wpforms-setup-name', app.syncTitle );
		},

		/**
		 * Bind panel events.
		 *
		 * @since 1.8.6
		 */
		panelEvents() {
			el.$panel
				.on( 'keyup', '#wpforms-setup-template-search', _.debounce( WPFormsFormTemplates.searchTemplate, 200 ) )
				.on( 'click', '.wpforms-setup-templates-categories li div', WPFormsFormTemplates.selectCategory )
				.on( 'click', '.wpforms-setup-templates-categories li .chevron', WPFormsFormTemplates.toggleSubcategoriesList )
				.on( 'click', '.wpforms-setup-templates-subcategories li', WPFormsFormTemplates.selectSubCategory )
				.on( 'click', '.wpforms-template-select', app.selectTemplate )
				.on( 'click', '.wpforms-trigger-blank', app.selectBlankTemplate );

			el.$builder
				.on( 'wpformsBuilderReady wpformsBuilderPanelLoaded', app.filterTemplatesBySelectedCategory );
		},

		/**
		 * Panel loaded event.
		 *
		 * @since 1.8.6
		 *
		 * @param {Object} e     Event object.
		 * @param {string} panel Panel name.
		 */
		panelLoaded( e, panel ) {
			if ( panel !== 'setup' ) {
				return;
			}

			WPFormsFormTemplates.setup();
			app.setup();
			app.setSelectedTemplate();
			app.setSelectedCategories();
			app.panelEvents();
		},

		/**
		 * Set panels toggle buttons state.
		 *
		 * @since 1.6.8
		 */
		setPanelsToggleState() {
			el.$builder
				.find( '#wpforms-panels-toggle button:not(.active)' )
				.toggleClass( 'wpforms-disabled', vars.formID === '' );
		},

		/**
		 * Set attributes of "blank template" link.
		 *
		 * @since 1.6.8
		 */
		setTriggerBlankLink() {
			el.$builder
				.find( '.wpforms-trigger-blank' )
				.attr( {
					'data-template-name-raw': 'Blank Form',
					'data-template': 'blank',
				} );
		},

		/**
		 * Force focus on the form title field when switched to the Setup panel.
		 *
		 * @since 1.6.8
		 *
		 * @param {Object|null} e    Event object.
		 * @param {string|null} view Current view.
		 */
		setupTitleFocus( e = null, view = null ) { // eslint-disable-line no-unused-vars
			view = view || wpf.getQueryString( 'view' );

			if ( view !== 'setup' ) {
				return;
			}

			// Clone form title to the Setup page.
			$( '#wpforms-setup-name' ).val( $( '#wpforms-panel-field-settings-form_title' ).val() );

			el.$formName.trigger( 'focus' );
		},

		/**
		 * Mark the current form template as selected.
		 *
		 * @since 1.8.6
		 */
		setSelectedTemplate() {
			if ( ! el.$panel.length || ! wpforms_builder.form_meta?.template ) {
				return;
			}

			const $template = el.$builder
				.find( `.wpforms-template-select[data-template="${ wpforms_builder.form_meta.template }"]` )
				.closest( '.wpforms-template' );

			if ( ! $template.length ) {
				return;
			}

			$template
				.addClass( 'selected' )
				.addClass( 'badge' );

			// Remove existing badge.
			$template.find( '.wpforms-badge' ).remove();

			// Remove edit and delete action buttons from current user template.
			if ( $template.hasClass( 'wpforms-user-template' ) ) {
				$template.find( '.wpforms-template-edit, .wpforms-template-remove' ).remove();
			}
		},

		/**
		 * Set category and/or subcategory active if its template was selected.
		 *
		 * @since 1.8.9
		 */
		setSelectedCategories() {
			if ( ! el.$panel.length || ! wpforms_builder.form_meta?.category ) {
				return;
			}

			const $category = el.$categories.find( `li[data-category="${ wpforms_builder.form_meta.category }"]` );

			if ( ! $category.length ) {
				return;
			}

			el.$categories.find( 'li' ).removeClass( 'active opened' );
			$category.addClass( 'active opened' );

			const $subcategory = el.$subcategories.find( `li[data-subcategory="${ wpforms_builder.form_meta.subcategory }"]` );

			if ( ! $subcategory.length ) {
				return;
			}

			el.$subcategories.find( 'li' ).removeClass( 'active' );
			$subcategory.addClass( 'active' );
		},

		/**
		 * Filter templates by selected category and subcategory.
		 *
		 * @since 1.8.9
		 */
		filterTemplatesBySelectedCategory() {
			const $subCategory = el.$subcategories.find( 'li.active' );

			// If subcategory is available, trigger its click it will update and category also.
			if ( $subCategory.length ) {
				$subCategory.trigger( 'click' );
			}

			const $category = el.$categories.find( '> li.active' );

			// In another case, click on the category.
			if (
				! $subCategory.length &&
				$category.length &&
				$category.data( 'category' ) !== 'all'
			) {
				$category.find( 'div' ).trigger( 'click' );
			}
		},

		/**
		 * Keep Setup title and settings title instances the same.
		 *
		 * @since 1.6.8
		 *
		 * @param {Object} e Event object.
		 */
		syncTitle( e ) {
			if ( e.target.id === 'wpforms-setup-name' ) {
				$( '#wpforms-panel-field-settings-form_title' ).val( e.target.value );
			} else {
				$( '#wpforms-setup-name' ).val( e.target.value );
			}
		},

		/**
		 * Search template.
		 *
		 * @since 1.6.8
		 * @since 1.7.7 Deprecated.
		 *
		 * @deprecated Use `WPFormsFormTemplates.searchTemplate` instead.
		 *
		 * @param {Object} e Event object.
		 */
		searchTemplate( e ) {
			console.warn( 'WARNING! Function "WPForms.Admin.Builder.Setup.searchTemplate( e )" has been deprecated, please use the new "WPFormsFormTemplates.searchTemplate( e )" function instead!' );

			WPFormsFormTemplates.searchTemplate( e );
		},

		/**
		 * Select category.
		 *
		 * @since 1.6.8
		 * @since 1.7.7 Deprecated.
		 *
		 * @deprecated Use `WPFormsFormTemplates.selectCategory` instead.
		 *
		 * @param {Object} e Event object.
		 */
		selectCategory( e ) {
			console.warn( 'WARNING! Function "WPForms.Admin.Builder.Setup.selectCategory( e )" has been deprecated, please use the new "WPFormsFormTemplates.selectCategory( e )" function instead!' );

			WPFormsFormTemplates.selectCategory( e );
		},

		/**
		 * Select template.
		 *
		 * @since 1.6.8
		 *
		 * @param {Object} event Event object.
		 */
		selectTemplate( event ) {
			event.preventDefault();

			const $button = $( this );

			// Don't do anything for templates that trigger education modal OR addons-modal.
			if ( $button.hasClass( 'education-modal' ) ) {
				return;
			}

			const template = $button.data( 'template' );

			// User templates are applied differently for new forms.
			if ( ! vars.formID && template.match( /wpforms-user-template-(\d+)/ ) && $button.data( 'create-url' ) ) {
				window.location.href = $button.data( 'create-url' );
				return;
			}

			el.$panel.find( '.wpforms-template' ).removeClass( 'active' );
			$button.closest( '.wpforms-template' ).addClass( 'active' );

			// Save the original label.
			$button.data( 'labelOriginal', $button.html() );

			// Display loading indicator.
			$button.html( vars.spinner + wpforms_builder.loading );

			const formName = app.getFormName( $button );

			app.applyTemplate( formName, template, $button );
		},

		/**
		 * Get form name.
		 *
		 * @since 1.7.6
		 *
		 * @param {jQuery} $button Pressed template button.
		 *
		 * @return {string} A new form name.
		 */
		getFormName( $button ) {
			const templateName = $button.data( 'template-name-raw' );
			const formName = el.$formName.val();

			if ( ! formName ) {
				return templateName;
			}

			return activeTemplateName === formName ? templateName : formName;
		},

		/**
		 * Apply template.
		 *
		 * The final part of the select template routine.
		 *
		 * @since 1.6.9
		 *
		 * @param {string} formName Name of the form.
		 * @param {string} template Template slug.
		 * @param {jQuery} $button  Use a template button object.
		 */
		applyTemplate( formName, template, $button ) {
			el.$builder.trigger( 'wpformsTemplateSelect', template );

			if ( vars.formID ) {
				// Existing form.
				app.selectTemplateExistingForm( formName, template, $button );
			} else {
				// Create a new form.
				WPFormsFormTemplates.selectTemplateProcess( formName, template, $button, app.selectTemplateProcessAjax );
			}
		},

		/**
		 * Select Blank template.
		 *
		 * @since 1.6.8
		 *
		 * @param {Object} e Event object.
		 */
		selectBlankTemplate( e ) {
			e.preventDefault();

			const $button = $( e.target ),
				formName = el.$formName.val() || wpforms_builder.blank_form,
				template = 'blank';

			app.applyTemplate( formName, template, $button );
		},

		/**
		 * Select template. Existing form.
		 *
		 * @since 1.6.8
		 *
		 * @param {string} formName Name of the form.
		 * @param {string} template Template slug.
		 * @param {jQuery} $button  Use a template button object.
		 */
		selectTemplateExistingForm( formName, template, $button ) {
			$.confirm( {
				title: wpforms_builder.heads_up,
				content: wpforms_builder.template_confirm,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							WPFormsFormTemplates.selectTemplateProcess( formName, template, $button, app.selectTemplateProcessAjax );
						},
					},
					cancel: {
						text: wpforms_builder.cancel,
						action() {
							WPFormsFormTemplates.selectTemplateCancel();
						},
					},
				},
			} );
		},

		/**
		 * Select template.
		 *
		 * @since 1.6.8
		 * @since 1.8.2 Deprecated.
		 *
		 * @deprecated Use `WPFormsFormTemplates.selectTemplateProcess` instead.
		 *
		 * @param {string} formName Name of the form.
		 * @param {string} template Template slug.
		 * @param {jQuery} $button  Use a template button object.
		 */
		selectTemplateProcess( formName, template, $button ) {
			console.warn( 'WARNING! Function "WPForms.Admin.Builder.Setup.selectTemplateProcess( formName, template, $button )" has been deprecated, please use the new "WPFormsFormTemplates.selectTemplateProcess( formName, template, $button, callback )" function instead!' );

			WPFormsFormTemplates.selectTemplateProcess( formName, template, $button, app.selectTemplateProcessAjax );
		},

		/**
		 * Cancel button click routine.
		 *
		 * @since 1.6.8
		 * @since 1.7.7 Deprecated.
		 *
		 * @deprecated Use `WPFormsFormTemplates.selectTemplateCancel` instead.
		 */
		selectTemplateCancel( ) {
			console.warn( 'WARNING! Function "WPForms.Admin.Builder.Setup.selectTemplateCancel" has been deprecated, please use the new "WPFormsFormTemplates.selectTemplateCancel" function instead!' );

			WPFormsFormTemplates.selectTemplateCancel();
		},

		/**
		 * Select template. Create or update form AJAX call.
		 *
		 * @since 1.6.8
		 *
		 * @param {string} formName Name of the form.
		 * @param {string} template Template slug.
		 */
		selectTemplateProcessAjax( formName, template ) {
			WPFormsBuilder.showLoadingOverlay();

			const data = {
				title: formName,
				action: vars.formID ? 'wpforms_update_form_template' : 'wpforms_new_form',
				template,
				form_id: vars.formID, // eslint-disable-line camelcase
				nonce: wpforms_builder.nonce,
			};

			const category = $( '.wpforms-setup-templates-categories li.active' ).data( 'category' );
			const subcategory = $( '.wpforms-setup-templates-subcategories li.active' ).data( 'subcategory' );

			if ( category ) {
				data.category = category;
			}

			if ( subcategory ) {
				data.subcategory = subcategory;
			}

			if ( category === 'all' ) {
				data.subcategory = 'all';
			}

			$.post( wpforms_builder.ajax_url, data )
				.done( function( res ) {
					if ( res.success ) {
						// We have already warned the user that unsaved changes will be ignored.
						WPFormsBuilder.setCloseConfirmation( false );

						window.location.href = wpf.getQueryString( 'force_desktop_view' )
							? wpf.updateQueryString( 'force_desktop_view', '1', res.data.redirect )
							: res.data.redirect;

						return;
					}

					wpf.debug( res );

					if ( res.data.error_type === 'invalid_template' ) {
						app.selectTemplateProcessInvalidTemplateError( res.data.message, formName );

						return;
					}

					app.selectTemplateProcessError( res.data.message );
				} )
				.fail( function( xhr, textStatus ) {
					wpf.debug( xhr.responseText || textStatus || '' );
					app.selectTemplateProcessError( '' );
				} );
		},

		/**
		 * Select template AJAX call error modal for invalid template using.
		 *
		 * @since 1.7.5.3
		 *
		 * @param {string} errorMessage Error message.
		 * @param {string} formName     Name of the form.
		 */
		selectTemplateProcessInvalidTemplateError( errorMessage, formName ) {
			$.alert( {
				title: wpforms_builder.heads_up,
				content: errorMessage,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_builder.use_default_template,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							app.selectTemplateProcessAjax( formName, 'simple-contact-form-template' );
							WPFormsBuilder.hideLoadingOverlay();
						},
					},
					cancel: {
						text: wpforms_builder.cancel,
						action() {
							WPFormsFormTemplates.selectTemplateCancel();
							WPFormsBuilder.hideLoadingOverlay();
						},
					},
				},
			} );
		},

		/**
		 * Select template AJAX call error modal.
		 *
		 * @since 1.6.8
		 * @since 1.8.8 Replaced error message with error title.
		 *
		 * @param {string} errorTitle Error title.
		 */
		selectTemplateProcessError( errorTitle ) {
			$.alert( {
				title: errorTitle,
				content: wpforms_builder.error_select_template,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							WPFormsFormTemplates.selectTemplateCancel();
							WPFormsBuilder.hideLoadingOverlay();
						},
					},
				},
			} );
		},

		/**
		 * Open required addons alert.
		 *
		 * @since 1.6.8
		 * @since 1.8.2 Deprecated.
		 *
		 * @deprecated Use `WPFormsFormTemplates.addonsModal` instead.
		 *
		 * @param {string} formName Name of the form.
		 * @param {string} template Template slug.
		 * @param {jQuery} $button  Use a template button object.
		 */
		addonsModal( formName, template, $button ) {
			console.warn( 'WARNING! Function "WPForms.Admin.Builder.Setup.addonsModal( formName, template, $button )" has been deprecated, please use the new "WPFormsFormTemplates.addonsModal( formName, template, $button, callback )" function instead!' );

			WPFormsFormTemplates.addonsModal( formName, template, $button, app.selectTemplateProcessAjax );
		},

		/**
		 * Install & Activate addons via AJAX.
		 *
		 * @since 1.6.8
		 * @since 1.8.2 Deprecated.
		 *
		 * @deprecated Use `WPFormsFormTemplates.installActivateAddons` instead.
		 *
		 * @param {Array}  addons        Addons slugs.
		 * @param {Object} previousModal Previous modal instance.
		 * @param {string} formName      Name of the form.
		 * @param {string} template      Template slug.
		 */
		installActivateAddons( addons, previousModal, formName, template ) {
			console.warn( 'WARNING! Function "WPForms.Admin.Builder.Setup.installActivateAddons( addons, previousModal, formName, template )" has been deprecated, please use the new "WPFormsFormTemplates.installActivateAddons( addons, previousModal, formName, template, callback )" function instead!' );

			WPFormsFormTemplates.installActivateAddons( addons, previousModal, formName, template, app.selectTemplateProcessAjax );
		},

		/**
		 * Install & Activate addons error modal.
		 *
		 * @since 1.6.8
		 * @since 1.8.2 Deprecated.
		 *
		 * @deprecated Use `WPFormsFormTemplates.installActivateAddonsError` instead.
		 *
		 * @param {string} formName Name of the form.
		 * @param {string} template Template slug.
		 */
		installActivateAddonsError( formName, template ) {
			console.warn( 'WARNING! Function "WPForms.Admin.Builder.Setup.installActivateAddonsError( formName, template )" has been deprecated, please use the new "WPFormsFormTemplates.installActivateAddonsError( formName, template, callback )" function instead!' );

			WPFormsFormTemplates.installActivateAddonsError( formName, template, app.selectTemplateProcessAjax );
		},

		/**
		 * Install & Activate single addon via AJAX.
		 *
		 * @since 1.6.8
		 * @since 1.8.2 Deprecated.
		 *
		 * @deprecated Use `WPFormsFormTemplates.installActivateAddonAjax` instead.
		 *
		 * @param {string} addon Addon slug.
		 *
		 * @return {Promise} jQuery ajax call promise.
		 */
		installActivateAddonAjax( addon ) {
			console.warn( 'WARNING! Function "WPForms.Admin.Builder.Setup.installActivateAddonAjax( addon )" has been deprecated, please use the new "WPFormsFormTemplates.installActivateAddonAjax( addon )" function instead!' );

			return WPFormsFormTemplates.installActivateAddonAjax( addon );
		},

		/**
		 * Initiate template processing for a new form.
		 *
		 * @since 1.6.8
		 */
		applyTemplateOnRequest() {
			const urlParams = new URLSearchParams( window.location.search ),
				templateId = urlParams.get( 'template_id' );

			if (
				urlParams.get( 'view' ) !== 'setup' ||
				urlParams.get( 'form_id' ) ||
				! templateId
			) {
				return;
			}

			el.$panel.find( '.wpforms-template .wpforms-btn[data-template="' + templateId + '"]' ).trigger( 'click' );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

// Initialize.
WPForms.Admin.Builder.Setup.init();
