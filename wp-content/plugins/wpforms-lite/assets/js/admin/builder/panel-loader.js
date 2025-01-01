/* global wpforms_builder, wpf */

/**
 * Form Builder Panel Loader module.
 *
 * @since 1.8.6
 */

var WPForms = window.WPForms || {}; // eslint-disable-line no-var

WPForms.Admin = WPForms.Admin || {};
WPForms.Admin.Builder = WPForms.Admin.Builder || {};

WPForms.Admin.Builder.PanelLoader = WPForms.Admin.Builder.PanelLoader || ( function( document, window, $ ) {
	/**
	 * Elements holder.
	 *
	 * @since 1.8.6
	 *
	 * @type {Object}
	 */
	const el = {};

	/**
	 * Runtime variables.
	 *
	 * @since 1.8.6
	 *
	 * @type {Object}
	 */
	const vars = [];

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.6
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.8.6
		 */
		init() {
			$( app.ready );
		},

		/**
		 * DOM is fully loaded.
		 *
		 * @since 1.8.6
		 */
		ready() {
			app.setup();
			app.events();

			el.$builder.trigger( 'wpformsBuilderLoaderReady' );
		},

		/**
		 * Setup. Prepare some variables.
		 *
		 * @since 1.8.6
		 */
		setup() {
			// Cache DOM elements.
			el.$builder = $( '#wpforms-builder' );
			el.$form = $( '#wpforms-builder-form' );
			el.$panels = el.$builder.find( '.wpforms-panels' );

			// Init vars.
			vars.currentPanel = wpf.getQueryString( 'view' );
		},

		/**
		 * Bind events.
		 *
		 * @since 1.8.6
		 */
		events() {
			// Panel switching.
			el.$builder.on( 'wpformsPanelSwitch', function( e, panel ) {
				// Skip if the panel is still loading.
				if ( el.$builder.find( `.wpforms-panel-${ panel }-button .wpforms-loading-spinner` ).length ) {
					e.preventDefault();

					return;
				}

				// Open the panel if it is already loaded.
				if ( el.$panels.find( '#wpforms-panel-' + panel ).length ) {
					return;
				}

				// Load panel.
				e.preventDefault();
				app.loadPanel( panel );
			} );
		},

		/**
		 * Load panel.
		 *
		 * @since 1.8.6
		 *
		 * @param {string} panel Panel name.
		 */
		loadPanel( panel ) {
			app.showSpinner( panel );

			// Load panel.
			$.post( wpforms_builder.ajax_url, {
				nonce: wpforms_builder.nonce,
				action: 'wpforms_builder_load_panel',
				panel,
				form_id: wpf.getQueryString( 'form_id' ), // eslint-disable-line camelcase
			} )
				.done( function( response ) {
					if ( ! response.success || ! response.data?.length ) {
						// Show an error message.
						app.displayErrorModal( `<p>${ wpforms_builder.error_load_templates }</p><p>${ wpforms_builder.error_contact_support }</p>` );

						return;
					}

					// Append panel to the DOM.
					app.embedPanel( panel, response.data );

					// Finalize switching to the panel.
					app.switchPanel( panel );

					// Trigger panel loaded event.
					el.$builder.trigger( 'wpformsBuilderPanelLoaded', [ panel ] );
				} )
				.fail( function() {
					// Show an error message.
					app.displayErrorModal( `<p>${ wpforms_builder.something_went_wrong }.</p><p>${ wpforms_builder.error_contact_support }</p>` );
				} )
				.always( function() {
					// Hide loading spinner.
					app.hideSpinner( panel );
				} );
		},

		/**
		 * Show spinner.
		 *
		 * @since 1.8.6
		 *
		 * @param {string} panel Panel name.
		 */
		showSpinner( panel ) {
			const $button = $( `.wpforms-panel-${ panel }-button` );

			$button.find( `i.fa` ).addClass( 'wpforms-hidden' );
			$button.prepend( '<i class="wpforms-loading-spinner wpforms-loading-white"></i>' );
		},

		/**
		 * Hide spinner.
		 *
		 * @since 1.8.6
		 *
		 * @param {string} panel Panel name.
		 */
		hideSpinner( panel ) {
			const $button = $( `.wpforms-panel-${ panel }-button` );

			$button.find( `i.fa` ).removeClass( 'wpforms-hidden' );
			$button.find( `i.wpforms-loading-spinner` ).remove();
		},

		/**
		 * Embed panel to DOM.
		 *
		 * @since 1.8.6
		 *
		 * @param {string} panel     Panel slug.
		 * @param {string} panelHtml Panel HTML.
		 */
		embedPanel( panel, panelHtml ) {
			// Append panel to the DOM.
			el.$panels.append( panelHtml );
		},

		/**
		 * Finalize switching to the panel.
		 *
		 * @since 1.8.6
		 *
		 * @param {string} panel Panel slug.
		 */
		switchPanel( panel ) {
			$( '#wpforms-panels-toggle' ).find( 'button' ).removeClass( 'active' );
			$( '.wpforms-panel' ).removeClass( 'active' );
			$( `.wpforms-panel-${ panel }-button` ).addClass( 'active' );
			$( `#wpforms-panel-${ panel }` ).addClass( 'active' );

			history.replaceState( {}, null, wpf.updateQueryString( 'view', panel ) );

			el.$builder.trigger( 'wpformsPanelSwitched', [ panel ] );
		},

		/**
		 * Display modal window with an error message.
		 *
		 * @since 1.8.6
		 *
		 * @param {string} content Modal content.
		 */
		displayErrorModal( content ) {
			$.alert( {
				title  : wpforms_builder.uh_oh,
				content,
				icon   : 'fa fa-exclamation-circle',
				type   : 'red',
				buttons: {
					cancel: {
						text    : wpforms_builder.close,
						btnClass: 'btn-confirm',
						keys    : [ 'enter' ],
					},
				},
			} );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

// Initialize.
WPForms.Admin.Builder.PanelLoader.init();
