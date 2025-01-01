/* global wpforms_admin, WPFormsFormTemplates, wpforms_admin_form_templates */

// noinspection ES6ConvertVarToLetConst
/**
 * Admin Subpage Form Templates function.
 *
 * @since 1.7.7
 */

// eslint-disable-next-line no-var
var WPFormsAdminFormTemplates = window.WPFormsAdminFormTemplates || ( function( document, window, $ ) {
	/**
	 * Public functions and properties.
	 *
	 * @since 1.7.7
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.7.7
		 */
		init() {
			$( app.ready );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.7.7
		 */
		ready() {
			WPFormsFormTemplates.setup();
			app.events();
		},

		/**
		 * Bind events.
		 *
		 * @since 1.7.7
		 */
		events() {
			$( '.wpforms-form-setup-content' )
				.on( 'keyup', '#wpforms-setup-template-search', _.debounce( WPFormsFormTemplates.searchTemplate, 200 ) )
				.on( 'click', '.wpforms-setup-templates-categories li div', WPFormsFormTemplates.selectCategory )
				.on( 'click', '.wpforms-setup-templates-categories li .chevron', WPFormsFormTemplates.toggleSubcategoriesList )
				.on( 'click', '.wpforms-setup-templates-subcategories li', WPFormsFormTemplates.selectSubCategory )
				.on( 'click', '.wpforms-template-select', app.selectTemplate )
				.on( 'click', '.wpforms-trigger-blank', app.selectBlankTemplate );
		},

		/**
		 * Select template.
		 *
		 * @since 1.7.7
		 *
		 * @param {Object} event Event object.
		 */
		selectTemplate( event ) {
			event.preventDefault();

			const $button = $( this );
			const spinner = '<i class="wpforms-loading-spinner wpforms-loading-white wpforms-loading-inline"></i>';

			// Don't do anything for templates that trigger education modal OR addons-modal.
			if ( $button.hasClass( 'education-modal' ) ) {
				return;
			}

			// User templates are applied differently for new forms.
			if ( $button.data( 'template' ).match( /wpforms-user-template-(\d+)/ ) && $button.data( 'create-url' ) ) {
				window.location.href = $button.data( 'create-url' );
				return;
			}

			$( '.wpforms-form-setup-content' ).find( '.wpforms-template' ).removeClass( 'active' );
			$button.closest( '.wpforms-template' ).addClass( 'active' );

			// Save the original label.
			$button.data( 'labelOriginal', $button.html() );

			// Display loading indicator.
			$button.html( spinner + wpforms_admin.loading );

			WPFormsFormTemplates.selectTemplateProcess( $button.data( 'template-name-raw' ), $button.data( 'template' ), $button, app.selectTemplateProcessAjax );
		},

		/**
		 * Select Blank template.
		 *
		 * @since 1.7.7
		 *
		 * @param {Object} e Event object.
		 */
		selectBlankTemplate( e ) {
			e.preventDefault();

			app.selectTemplateProcessAjax( 'Blank Form', 'blank' );
		},

		/**
		 * Select template. Create or update form AJAX call.
		 *
		 * @since 1.7.7
		 *
		 * @param {string} formName Name of the form.
		 * @param {string} template Template slug.
		 */
		selectTemplateProcessAjax( formName, template ) {
			const data = {
				title: formName,
				action: 'wpforms_new_form',
				template,
				// eslint-disable-next-line camelcase
				form_id: 0,
				nonce: wpforms_admin_form_templates.nonce,
			};

			const category = $( '.wpforms-setup-templates-categories li.active' ).data( 'category' );

			if ( category && category !== 'all' ) {
				data.category = category;
			}

			const subcategory = $( '.wpforms-setup-templates-subcategories li.active' ).data( 'subcategory' );

			if ( subcategory ) {
				data.subcategory = subcategory;
			}

			$.post( wpforms_admin.ajax_url, data )
				.done( function( res ) {
					if ( res.success ) {
						window.location.href = res.data.redirect;

						return;
					}

					if ( res.data.error_type === 'invalid_template' ) {
						app.selectTemplateProcessInvalidTemplateError( res.data.message, formName );

						return;
					}

					app.selectTemplateProcessError( res.data.message );
				} )
				.fail( function() {
					app.selectTemplateProcessError( '' );
				} );
		},

		/**
		 * Select template AJAX call error modal for invalid template using.
		 *
		 * @since 1.7.7
		 *
		 * @param {string} errorMessage Error message.
		 * @param {string} formName     Name of the form.
		 */
		selectTemplateProcessInvalidTemplateError( errorMessage, formName ) {
			$.alert( {
				title: wpforms_admin.heads_up,
				content: errorMessage,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_admin.use_default_template,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							app.selectTemplateProcessAjax( formName, 'simple-contact-form-template' );
						},
					},
					cancel: {
						text: wpforms_admin.cancel,
						action() {
							WPFormsFormTemplates.selectTemplateCancel();
						},
					},
				},
			} );
		},

		/**
		 * Select template AJAX call error modal.
		 *
		 * @since 1.7.7
		 * @since 1.8.8 Replaced error message with error title.
		 *
		 * @param {string} errorTitle Error title.
		 */
		selectTemplateProcessError( errorTitle ) {
			$.alert( {
				title: errorTitle,
				content: wpforms_admin.error_select_template,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_admin.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							WPFormsFormTemplates.selectTemplateCancel();
						},
					},
				},
			} );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

// Initialize.
WPFormsAdminFormTemplates.init();
