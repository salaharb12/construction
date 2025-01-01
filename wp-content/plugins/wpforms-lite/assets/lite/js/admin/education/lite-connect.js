/* global wpforms_education_lite_connect, WPFormsChallenge */
/**
 * WPForms Education for Lite.
 *
 * Lite Connect feature.
 *
 * @since 1.7.4
 */

// eslint-disable-next-line no-var
var WPFormsEducation = window.WPFormsEducation || {};

WPFormsEducation.liteConnect = window.WPFormsEducation.liteConnect || ( function( document, window, $ ) {
	/**
	 * Public functions and properties.
	 *
	 * @since 1.7.4
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.7.4
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
		 * Document ready.
		 *
		 * @since 1.7.4
		 */
		ready() {

		},

		/**
		 * Page load.
		 *
		 * @since 1.7.4
		 */
		load() {
			app.events();
			app.initLiteConnectToggle();
			app.maybeRevealBuilderTopBar();
		},

		/**
		 * Register JS events.
		 *
		 * @since 1.7.4
		 */
		events() {
			app.enableLiteConnectToggleClick();
			app.enableLiteConnectButtonClick();
			app.dismissBuilderTopBarClick();
			app.autoSaveToggleChange();
			app.enableLiteConnectAIButtonClick();
		},

		/**
		 * Init Lite Connect toggle.
		 *
		 * @since 1.7.5
		 */
		initLiteConnectToggle() {
			$( '.wpforms-toggle-control.wpforms-setting-lite-connect-auto-save-toggle input' ).prop( 'disabled', false );
		},

		/**
		 * Enable Lite Connect toggle mousedown handler.
		 *
		 * @since 1.7.4
		 */
		enableLiteConnectToggleClick() {
			$( document ).on(
				'mousedown touchstart',
				'#wpforms-setting-row-lite-connect-enabled label, .wpforms-setting-lite-connect-auto-save-toggle label',
				function( event ) {
					const isTouchDevice = 'ontouchstart' in document.documentElement;

					if ( ! isTouchDevice ) {
						event.preventDefault();
					}

					const wrapper = $( this ).closest( '#wpforms-setting-row-lite-connect-enabled, .wpforms-setting-lite-connect-auto-save-toggle' );

					const $input = wrapper.find( '#wpforms-setting-lite-connect-enabled' );

					if ( $input.prop( 'disabled' ) ) {
						return;
					}

					const isEnabled = $input.is( ':checked' );

					app.openSettingsLiteConnectModal( isEnabled, function() {
						$input
							.trigger( 'click' )
							.prop( 'disabled', true );
					} );
				}
			);
		},

		/**
		 * Enable Lite Connect button click handler.
		 *
		 * @since 1.7.4
		 */
		enableLiteConnectButtonClick() {
			$( document ).on(
				'click',
				'.wpforms-dyk-lite-connect .button-primary',
				function( event ) {
					event.preventDefault();

					const $button = $( this );

					if ( $button.hasClass( 'wpforms-is-enabled' ) ) {
						window.open( $button.attr( 'href' ) );

						return;
					}

					app.openSettingsLiteConnectModal(
						false,
						app.enableLiteConnectButtonModalConfirm
					);
				}
			);
		},

		/**
		 * Enable Lite Connect button click handler.
		 *
		 * @since 1.9.1
		 */
		enableLiteConnectAIButtonClick() {
			$( document ).on(
				'click',
				'.enable-lite-connect-modal',
				app.handleLiteConnectModalClick,
			);
		},

		/**
		 * Finalize the Lite Connect keys setup.
		 *
		 * @since 1.9.1
		 *
		 * @return {jQuery} AJAX request deferred object.
		 */
		finalizeLiteConnectSetup() {
			return $.get( wpforms_education_lite_connect.ajax_url, {
				action: 'wpforms_lite_connect_finalize',
				nonce: wpforms_education_lite_connect.nonce,
			} );
		},

		/**
		 * Handle Lite Connect modal click.
		 *
		 * @since 1.9.1
		 *
		 * @param {Event} event Event object.
		 */
		handleLiteConnectModalClick( event ) {
			event.preventDefault();

			app.openAILiteConnectEnableModal(
				function() {
					app.saveSettingAjaxPost( true, $(), function() {
						app.switchSettingView( true, $( '#wpforms-builder-lite-connect-top-bar .wpforms-toggle-control' ) );

						// Finalize the Lite Connect keys setup.
						app.finalizeLiteConnectSetup()
							.done( () => {
								app.removeLiteConnectModalOnAIButtons();
							} );
					} );
				}
			);
		},

		/**
		 * Remove Lite Connect modal on AI buttons.
		 *
		 * @since 1.9.1
		 */
		removeLiteConnectModalOnAIButtons() {
			$( '.enable-lite-connect-modal.wpforms-ai-modal-disabled' ).each( function() {
				$( this ).removeClass( 'enable-lite-connect-modal wpforms-ai-modal-disabled' );
			} );
		},

		/**
		 * Enable Lite Connect button modal confirm Callback.
		 *
		 * @since 1.7.4
		 */
		enableLiteConnectButtonModalConfirm() {
			const $toggle = $( '.wpforms-dyk-lite-connect .button-primary' );

			app.saveSettingAjaxPost( true, $toggle, function() {
				app.switchSettingView( true, $toggle );
			} );
		},

		/**
		 * Form Entry Backups information modal.
		 *
		 * @since 1.7.4
		 *
		 * @param {boolean}  isEnabled       Current setting state.
		 * @param {Function} confirmCallback Confirm button action.
		 */
		openSettingsLiteConnectModal( isEnabled, confirmCallback ) {
			if ( isEnabled ) {
				app.openSettingsLiteConnectDisableModal( confirmCallback );
			} else {
				app.openSettingsLiteConnectEnableModal( confirmCallback );
			}
		},

		/**
		 * Form Entry Backups enable information modal.
		 *
		 * @since 1.7.4
		 *
		 * @param {Function} confirmCallback Confirm button action.
		 */
		openSettingsLiteConnectEnableModal( confirmCallback ) {
			const $args = {
				content: wp.template( 'wpforms-settings-lite-connect-modal-content' )(),
				confirm: {
					text: wpforms_education_lite_connect.enable_modal.confirm,
					callback: confirmCallback,
				},
			};

			app.enableModal( $args );
		},

		/**
		 * AI features enable information modal.
		 *
		 * @since 1.9.1
		 *
		 * @param {Function} confirmCallback Confirm button action.
		 */
		openAILiteConnectEnableModal( confirmCallback ) {
			const $args = {
				content: wp.template( 'wpforms-builder-ai-lite-connect-modal-content' )(),
				confirm: {
					text: wpforms_education_lite_connect.enable_ai.confirm,
					callback: confirmCallback,
				},
				theme: 'modern, ai-modal',
			};

			// eslint-disable-next-line camelcase
			wpforms_education_lite_connect.update_result.enabled_title = wpforms_education_lite_connect.enable_ai.enabled_title;

			app.enableModal( $args );
		},

		/**
		 * Render Enable modal.
		 *
		 * @param {Object} $args Modal arguments.
		 */
		enableModal( $args ) {
			$.alert( {
				title: false,
				content: $args.content,
				icon: false,
				type: 'orange',
				boxWidth: 550,
				theme: $args.theme || 'modern',
				useBootstrap: false,
				scrollToPreviousElement: false,
				buttons: {
					confirm: {
						text: $args.confirm.text,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							if ( typeof $args.confirm.callback === 'function' ) {
								$args.confirm.callback();
							}

							// Maybe close Challenge popup.
							if ( window.WPFormsChallenge ) {
								// eslint-disable-next-line no-var
								var completeChallenge = WPFormsChallenge.embed && WPFormsChallenge.embed.completeChallenge;
							}

							if ( typeof completeChallenge === 'function' ) {
								completeChallenge();
							}
						},
					},
					cancel: {
						text: wpforms_education_lite_connect.enable_modal.cancel,
						action() {
							$( '.wpforms-challenge-popup-container' ).removeClass( 'wpforms-invisible' );
						},
					},
				},
				onOpenBefore() {
					$( 'body' ).addClass( 'wpforms-setting-lite-connect-modal' );
					$( '.wpforms-challenge-popup-container' ).addClass( 'wpforms-invisible' );
				},
				onDestroy() {
					$( 'body' ).removeClass( 'wpforms-setting-lite-connect-modal' );
				},
			} );
		},

		/**
		 * Form Entry Backups disable information modal.
		 *
		 * @since 1.7.4
		 *
		 * @param {Function} confirmCallback Confirm button action.
		 */
		openSettingsLiteConnectDisableModal( confirmCallback ) {
			$.alert( {
				title: wpforms_education_lite_connect.disable_modal.title,
				content: wpforms_education_lite_connect.disable_modal.content,
				icon: 'fa fa-exclamation-circle',
				type: 'red',
				boxWidth: '400px',
				theme: 'modern',
				useBootstrap: false,
				animateFromElement: false,
				scrollToPreviousElement: false,
				buttons: {
					cancel: {
						text: wpforms_education_lite_connect.disable_modal.cancel,
						keys: [ 'enter' ],
						btnClass: 'btn-confirm',
					},
					confirm: {
						text: wpforms_education_lite_connect.disable_modal.confirm,
						action() {
							if ( typeof confirmCallback === 'function' ) {
								confirmCallback();
							}
						},
					},
				},
			} );
		},

		/**
		 * Save Lite Connect Enabled setting AJAX post call.
		 *
		 * @since 1.7.4
		 *
		 * @param {boolean}          isEnabled       Lite Connect setting flag.
		 * @param {jQuery|undefined} $toggle         Toggle control outer element.
		 * @param {Function}         successCallback Success result callback.
		 */
		saveSettingAjaxPost( isEnabled, $toggle, successCallback ) {
			$toggle = $toggle || $();

			const $input = $toggle.find( 'input' );

			// Perform AJAX request.
			$.post(
				wpforms_education_lite_connect.ajax_url,
				{
					action: 'wpforms_update_lite_connect_enabled_setting',
					value: isEnabled ? 1 : 0,
					nonce: wpforms_education_lite_connect.nonce,
				}
			).done( function( res ) {
				if ( ! res.success ) {
					$input.prop( 'checked', ! isEnabled );
					app.updateResultModal( 'error' );

					return;
				}

				app.updateResultModal( isEnabled ? 'enabled' : 'disabled' );

				if ( typeof successCallback === 'function' ) {
					successCallback();
				}
			} ).fail( function() {
				$input.prop( 'checked', ! isEnabled );
				app.updateResultModal( 'error' );
			} ).always( function() {
				$input.prop( 'disabled', false );
			} );
		},

		/**
		 * Lite Connect toggle `change` event handler with "auto save" feature.
		 *
		 * @since 1.7.4
		 */
		autoSaveToggleChange() {
			$( document ).on(
				'change',
				'.wpforms-toggle-control.wpforms-setting-lite-connect-auto-save-toggle input',
				function() {
					const $input = $( this ),
						$toggle = $input.closest( '.wpforms-toggle-control' ),
						isEnabled = $input.is( ':checked' );

					app.saveSettingAjaxPost( isEnabled, $toggle, function() {
						app.switchSettingView( isEnabled, $toggle );
						app.removeLiteConnectModalOnAIButtons();

						// Finalize the Lite Connect keys setup.
						app.finalizeLiteConnectSetup();
					} );
				}
			);
		},

		/**
		 * After updating setting via AJAX we should hide toggle container and show info container.
		 *
		 * @since 1.7.4
		 *
		 * @param {boolean} isEnabled Toggle state.
		 * @param {jQuery}  $toggle   Toggle control.
		 */
		switchSettingView( isEnabled, $toggle ) {
			const $wrapper = $toggle.closest( '.wpforms-education-lite-connect-wrapper' ),
				$setting = $wrapper.find( '.wpforms-education-lite-connect-setting' ),
				$enabledInfo = $wrapper.find( '.wpforms-education-lite-connect-enabled-info' );

			$setting.toggleClass( 'wpforms-hidden', isEnabled );
			$enabledInfo.toggleClass( 'wpforms-hidden', ! isEnabled );
		},

		/**
		 * Update result message modal.
		 *
		 * @since 1.7.4
		 *
		 * @param {string} msg Message slug.
		 */
		updateResultModal( msg ) {
			if ( ! wpforms_education_lite_connect.update_result[ msg ] ) {
				return;
			}

			$.alert( {
				title: wpforms_education_lite_connect.update_result[ msg + '_title' ],
				content: wpforms_education_lite_connect.update_result[ msg ],
				icon: 'fa fa-check-circle',
				type: msg === 'error' ? 'red' : 'green',
				theme: 'modern',
				boxWidth: '400px',
				useBootstrap: false,
				animation: 'scale',
				closeAnimation: 'scale',
				animateFromElement: false,
				scrollToPreviousElement: false,
				buttons: {
					confirm: {
						text    : wpforms_education_lite_connect.update_result.close,
						btnClass: 'btn-confirm',
						keys    : [ 'enter' ],
					},
				},
			} );
		},

		/**
		 * Reveal top bar in the Form Builder.
		 *
		 * @since 1.7.4
		 */
		maybeRevealBuilderTopBar() {
			// Skip it is not Form Builder or Entry Backups is already enabled or top bar is dismissed.
			if (
				! window.wpforms_builder ||
				wpforms_education_lite_connect.is_enabled === '1' ||
				$( '#wpforms-builder-lite-connect-top-bar' ).length === 0
			) {
				return;
			}

			setTimeout( function() {
				app.toggleBuilderTopBar( true );
			}, 3000 );
		},

		/**
		 * Toggle top bar in the Form Builder.
		 *
		 * @since 1.7.4
		 *
		 * @param {boolean} open True for open, false for close.
		 */
		toggleBuilderTopBar( open ) {
			const cssVar = '--wpforms-admin-bar-height';
			const root = document.documentElement;
			const topBarHeight = 45;

			let adminBarHeight = parseInt( getComputedStyle( root ).getPropertyValue( cssVar ), 10 );

			adminBarHeight += open ? topBarHeight : -topBarHeight;

			root.setAttribute(
				'style',
				cssVar + ': ' + ( adminBarHeight ) + 'px!important;'
			);
		},

		/**
		 * Dismiss top bar in the Form Builder.
		 *
		 * @since 1.7.4
		 */
		dismissBuilderTopBarClick() {
			$( document ).on(
				'click',
				'#wpforms-builder-lite-connect-top-bar .wpforms-dismiss-button',
				function() {
					app.toggleBuilderTopBar( false );
				}
			);
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

// Initialize.
WPFormsEducation.liteConnect.init();
