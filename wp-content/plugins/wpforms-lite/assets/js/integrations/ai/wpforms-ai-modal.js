/* global wpforms_ai_chat_element */

// noinspection ES6ConvertVarToLetConst
/**
 * AI modal.
 *
 * @since 1.9.1
 */
// eslint-disable-next-line no-var
var WPFormsAIModal = window.WPFormsAIModal || ( function( document, window, $ ) {
	/**
	 * Public functions and properties.
	 *
	 * @since 1.9.1
	 *
	 * @type {Object}
	 */
	const app = {
		/**
		 * Default modal options.
		 *
		 * @since 1.9.1
		 */
		defaultOptions: {
			title: false,
			content: '',
			type: 'ai',
			smoothContent: true,
			bgOpacity: 1,
			boxWidth: 650,
			contentMaxHeight: 600,
			closeIcon: true,
			buttons: false,
		},

		/**
		 * Start the engine.
		 *
		 * @since 1.9.1
		 */
		init() {
			$( app.ready );
		},

		/**
		 * Initialized once the DOM is fully loaded.
		 *
		 * @since 1.9.1
		 */
		ready() {
			app.extendJqueryConfirm();
			app.bindChoicesActions();
		},

		/**
		 * Process various events for choices modal.
		 *
		 * @since 1.9.1
		 */
		bindChoicesActions() {
			$( document )
				.on( 'click', '.wpforms-ai-choices-button', app.initChoicesModal )
				.on( 'wpformsAIChatBeforeRefreshConfirm', app.beforeChoicesRefreshConfirm )
				.on( 'wpformsAIModalBeforeWarningMessageInsert', app.refreshModalHeight )
				.on( 'wpformsAIChatAfterRefresh', app.refreshModalHeight )
				.on( 'wpformsAIChatCancelRefresh', app.cancelChoicesRefresh )
				.on( 'wpformsAIChatBeforeSendMessage', function( e ) {
					app.resizeChoicesModalHeight( e.detail.fieldId );
				} )
				.on( 'wpformsAIModalAfterChoicesInsert', function( e ) {
					app.hideChoicesModal( e.detail.fieldId );
				} );

			$( window ).on( 'resize', function() {
				$( '.jconfirm-wpforms-ai-modal wpforms-ai-chat' ).each( function() {
					app.resizeChoicesModalHeight( $( this ).attr( 'field-id' ) );
				} );
			} );
		},

		/**
		 * Init modal window.
		 *
		 * @since 1.9.1
		 *
		 * @param {Object} args Modal window arguments.
		 */
		initModal( args ) {
			// Open the modal window.
			$.confirm( { ...app.defaultOptions, ...args } );
		},

		/**
		 * Init choices modal window.
		 *
		 * @since 1.9.1
		 */
		initChoicesModal() {
			const $button = $( this );

			if ( $button.hasClass( 'wpforms-ai-modal-disabled' ) ) {
				$button.trigger( 'blur' );
				return;
			}

			const fieldId = $button.data( 'field-id' ),
				$modal = $( `.jconfirm-wpforms-ai-modal-choices-${ fieldId }` );

			if ( $modal.length ) {
				$modal.removeClass( 'wpforms-hidden' ).fadeIn();
				return;
			}

			const args = {},
				hideChoices = function() {
					app.hideChoicesModal( fieldId );
					return false;
				};

			args.content = `<wpforms-ai-chat mode="choices" field-id="${ fieldId }" />`;
			args.theme = `wpforms-ai-modal, wpforms-ai-purple, wpforms-ai-modal-choices-${ fieldId }`;
			args.backgroundDismiss = hideChoices;
			args.backgroundDismissAnimation = '';
			args.contentMaxHeight = Math.min( app.defaultOptions.contentMaxHeight, app.getMaxModalHeight() );
			args.onOpen = function() {
				// Unbind the click event from the close icon and use our own instead.
				this.$closeIcon.off( 'click' );
				this.$closeIcon.on( 'click', hideChoices );
			};

			app.initModal( args );
		},

		/**
		 * Hide the choices modal window.
		 *
		 * @since 1.9.1
		 *
		 * @param {string} fieldId Choice field ID.
		 */
		hideChoicesModal( fieldId ) {
			$( `.jconfirm-wpforms-ai-modal-choices-${ fieldId }` ).addClass( 'wpforms-hidden' ).fadeOut();
		},

		/**
		 * Show the choices modal window.
		 *
		 * @since 1.9.1
		 *
		 * @param {string} fieldId Choice field ID.
		 */
		showChoicesModal( fieldId ) {
			$( `.jconfirm-wpforms-ai-modal-choices-${ fieldId }` ).removeClass( 'wpforms-hidden' ).fadeIn();
		},

		/**
		 * Resize choices modal window height.
		 *
		 * @since 1.9.1
		 *
		 * @param {string} fieldId Choice field ID.
		 */
		resizeChoicesModalHeight( fieldId ) {
			const modalHeight = app.getMaxModalHeight();

			$( `.jconfirm-wpforms-ai-modal-choices-${ fieldId } .jconfirm-content-pane` )
				.css( {
					height: modalHeight,
					'max-height': modalHeight,
				} );
		},

		/**
		 * Before choices refresh confirm is displayed.
		 *
		 * @since 1.9.1
		 *
		 * @param {Event} e Event object.
		 */
		beforeChoicesRefreshConfirm( e ) {
			const fieldId = e.detail?.fieldId || 0;

			app.hideChoicesModal( fieldId );
		},

		/**
		 * Cancel choices' refresh.
		 *
		 * @since 1.9.1
		 *
		 * @param {Event} e Event object.
		 */
		cancelChoicesRefresh( e ) {
			const fieldId = e.detail?.fieldId || 0;

			app.showChoicesModal( fieldId );
		},

		/**
		 * Refresh the main modal window height.
		 *
		 * @since 1.9.1
		 *
		 * @param {Event} e Event object.
		 */
		refreshModalHeight( e ) {
			const fieldId = e.detail?.fieldId || 0;
			const maxHeight = Math.min( app.getMaxModalHeight(), app.defaultOptions.contentMaxHeight );

			app.showChoicesModal( fieldId );

			// Reset choices modal window height.
			$( `.jconfirm-wpforms-ai-modal-choices-${ fieldId } .jconfirm-content-pane` )
				.css( {
					height: maxHeight,
					'max-height': maxHeight,
				} );
		},

		/**
		 * Get the max modal height.
		 *
		 * @since 1.9.1
		 *
		 * @return {number} The max modal height.
		 */
		getMaxModalHeight() {
			// 80% of the window height, but not more than 800 px.
			return Math.min( $( window ).height() * 0.8, 800 );
		},

		/**
		 * Extend jquery-confirm plugin with support of max-height for the content area.
		 *
		 * @since 1.9.1
		 */
		extendJqueryConfirm() {
			// Extend a method of global instance.
			window.Jconfirm.prototype._updateContentMaxHeight = function() {
				this.$contentPane.css( {
					'max-height': this.contentMaxHeight + 'px',
				} );
			};
		},

		/**
		 * Confirm a modal window.
		 *
		 * This is a wrapper for the `jquery.confirm` plugin.
		 *
		 * @since 1.9.1
		 *
		 * @param {Object} args Modal window arguments.
		 */
		confirmModal( args ) {
			const options = {
				title: false,
				content: '',
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_ai_chat_element.btnYes,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							if ( typeof args.onConfirm === 'function' ) {
								args.onConfirm();
							}
						},
					},
					cancel: {
						text: wpforms_ai_chat_element.btnCancel,
						action() {
							if ( typeof args.onCancel === 'function' ) {
								args.onCancel();
							}
						},
					},
				},
			};

			$.confirm( { ...options, ...args } );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

// Initialize.
WPFormsAIModal.init();
