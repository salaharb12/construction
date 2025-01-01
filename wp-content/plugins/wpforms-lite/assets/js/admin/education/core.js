/* global wpforms_education, WPFormsBuilder, wpf */

/**
 * WPForms Education Core.
 *
 * @since 1.6.6
 */

// noinspection ES6ConvertVarToLetConst
/**
 * @param wpforms_education.activate_confirm
 * @param wpforms_education.activate_prompt
 * @param wpforms_education.activating
 * @param wpforms_education.addon_activated
 * @param wpforms_education.addon_error
 * @param wpforms_education.ajax_url
 * @param wpforms_education.can_activate_addons
 * @param wpforms_education.can_install_addons
 * @param wpforms_education.cancel
 * @param wpforms_education.close
 * @param wpforms_education.install_confirm
 * @param wpforms_education.install_prompt
 * @param wpforms_education.installing
 * @param wpforms_education.nonce
 * @param wpforms_education.ok
 * @param wpforms_education.plugin_activated
 * @param wpforms_education.save_confirm
 * @param wpforms_education.save_prompt
 * @param wpforms_education.saving
 * @param wpforms_education.thanks_for_interest
 * @param wpforms_education.upgrade
 * @param wpforms_education.upgrade.modal
 * @param wpforms_education.upgrade.url
 * @param wpforms_education.upgrade.url_template
 */

var WPFormsEducation = window.WPFormsEducation || {}; // eslint-disable-line no-var

WPFormsEducation.core = window.WPFormsEducation.core || ( function( document, window, $ ) {
	/**
	 * Spinner markup.
	 *
	 * @since 1.7.0
	 *
	 * @type {string}
	 */
	const spinner = '<i class="wpforms-loading-spinner wpforms-loading-white wpforms-loading-inline"></i>';

	/**
	 * Public functions and properties.
	 *
	 * @since 1.6.6
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.6.6
		 */
		init() {
			$( app.ready );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.6.6
		 */
		ready() {
			app.events();
		},

		/**
		 * Register JS events.
		 *
		 * @since 1.6.6
		 */
		events() {
			app.dismissEvents();
			app.openModalButtonClick();
			app.setDykColspan();
			app.gotoAdvancedTabClick();
		},

		/**
		 * Open education modal.
		 *
		 * @since 1.7.0
		 */
		openModalButtonClick() {
			$( document )
				.on( 'click', '.education-modal:not(.wpforms-add-fields-button)', app.openModalButtonHandler )
				.on( 'mousedown', '.education-modal.wpforms-add-fields-button', app.openModalButtonHandler );
		},

		/**
		 * Open education modal handler.
		 *
		 * @since 1.8.0
		 *
		 * @param {Event} event Event.
		 */
		openModalButtonHandler( event ) {
			event.preventDefault();

			const $this = $( this );

			switch ( $this.data( 'action' ) ) {
				case 'activate':
					app.activateModal( $this );
					break;
				case 'install':
					app.installModal( $this );
					break;
			}
		},

		/**
		 * Dismiss button events.
		 *
		 * @since 1.6.6
		 */
		dismissEvents() {
			$( document ).on( 'click', '.wpforms-dismiss-container .wpforms-dismiss-button', function() {
				const $this = $( this ),
					$cont = $this.closest( '.wpforms-dismiss-container' ),
					data = {
						action: 'wpforms_education_dismiss',
						nonce: wpforms_education.nonce,
						section: $this.data( 'section' ),
						page: typeof window.pagenow === 'string' ? window.pagenow : '',
					};
				let $out = $cont.find( '.wpforms-dismiss-out' );

				if ( $cont.hasClass( 'wpforms-dismiss-out' ) ) {
					$out = $cont;
				}

				if ( $out.length > 0 ) {
					$out.addClass( 'out' );
					setTimeout(
						function() {
							$cont.remove();
						},
						300
					);
				} else {
					$cont.remove();
				}

				$.post( wpforms_education.ajax_url, data );
			} );
		},

		/**
		 * Calculate and dynamically set the DYK block cell colspan attribute.
		 *
		 * @since 1.7.3
		 */
		setDykColspan() {
			$( '#adv-settings' ).on(
				'change',
				'input.hide-column-tog',
				function() {
					const $dykCell = $( '.wpforms-dyk td' ),
						colCount = $( '.wp-list-table thead .manage-column' ).not( '.hidden' ).length;

					$dykCell.attr( 'colspan', colCount );
				}
			);
		},

		/**
		 * Go to Advanced tab when click on the link in Calculations educational notice.
		 *
		 * @since 1.8.4.1
		 */
		gotoAdvancedTabClick() {
			$( document )
				.on( 'click', '.wpforms-educational-alert.wpforms-calculations a', function( e ) {
					const $a = $( this );

					if ( $a.attr( 'href' ) !== '#advanced-tab' ) {
						return;
					}

					e.preventDefault();

					$a.closest( '.wpforms-field-option' )
						.find( '.wpforms-field-option-group-advanced .wpforms-field-option-group-toggle' )
						.trigger( 'click' );
				} );
		},

		/**
		 * Get UTM content for different elements.
		 *
		 * @since 1.6.9
		 *
		 * @param {jQuery} $el Element.
		 *
		 * @return {string} UTM content string.
		 */
		getUTMContentValue( $el ) {
			// UTM content for Fields.
			if ( $el.hasClass( 'wpforms-add-fields-button' ) ) {
				return $el.data( 'utm-content' ) + ' Field';
			}

			// UTM content for Templates.
			if ( $el.hasClass( 'wpforms-template-select' ) ) {
				return app.slugToUTMContent( $el.data( 'slug' ) );
			}

			// UTM content for Addons (sidebar).
			if ( $el.hasClass( 'wpforms-panel-sidebar-section' ) ) {
				return app.slugToUTMContent( $el.data( 'slug' ) ) + ' Addon';
			}

			// UTM content by default with fallback `data-name`.
			return $el.data( 'utm-content' ) || $el.data( 'name' );
		},

		/**
		 * Convert slug to UTM content.
		 *
		 * @since 1.6.9
		 *
		 * @param {string} slug Slug.
		 *
		 * @return {string} UTM content string.
		 */
		slugToUTMContent( slug ) {
			if ( ! slug ) {
				return '';
			}

			return slug.toString()

				// Replace all non-alphanumeric characters with space.
				.replace( /[^a-z\d ]/gi, ' ' )

				// Uppercase each word.
				.replace( /\b[a-z]/g, function( char ) {
					return char.toUpperCase();
				} );
		},

		/**
		 * Get upgrade URL according to the UTM content and license type.
		 *
		 * @since 1.6.9
		 *
		 * @param {string} utmContent UTM content.
		 * @param {string} type       Feature license type: pro or elite.
		 *
		 * @return {string} Upgrade URL.
		 */
		getUpgradeURL( utmContent, type ) {
			let baseURL = wpforms_education.upgrade[ type ].url;

			if ( utmContent.toLowerCase().indexOf( 'template' ) > -1 ) {
				baseURL = wpforms_education.upgrade[ type ].url_template;
			}

			// Test if the base URL already contains `?`.
			let appendChar = /(\?)/.test( baseURL ) ? '&' : '?';

			// If the upgrade link is changed by partners, appendChar has to be encoded.
			if ( baseURL.indexOf( 'https://wpforms.com' ) === -1 ) {
				appendChar = encodeURIComponent( appendChar );
			}

			return baseURL + appendChar + 'utm_content=' + encodeURIComponent( utmContent.trim() );
		},

		/**
		 * Upgrade modal second state.
		 *
		 * @since 1.6.6
		 *
		 * @param {string} type Feature license type: pro or elite.
		 */
		upgradeModalThankYou: ( type ) => {
			$.alert( {
				title: wpforms_education.thanks_for_interest,
				content: wpforms_education.upgrade[ type ].modal,
				icon: 'fa fa-info-circle',
				type: 'blue',
				boxWidth: '565px',
				buttons: {
					confirm: {
						text: wpforms_education.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
			} );
		},

		/**
		 * Get spinner markup.
		 *
		 * @since 1.7.6
		 *
		 * @return {string} Spinner markup.
		 */
		getSpinner: () => {
			return spinner;
		},

		/**
		 * Addon activate modal.
		 *
		 * @since 1.7.0
		 *
		 * @param {jQuery} $button jQuery button element.
		 */
		activateModal( $button ) {
			const feature = $button.data( 'name' ),
				message = $button.data( 'message' );

			const canActivateAddons = wpforms_education.can_activate_addons;

			$.alert( {
				title: false,
				content: message ? message : wpforms_education.activate_prompt.replace( /%name%/g, feature ),
				icon: 'fa fa-info-circle',
				type: 'blue',
				buttons: {
					confirm: {
						text: wpforms_education.activate_confirm,
						btnClass: 'btn-confirm' + ( ! canActivateAddons ? ' hidden' : '' ),
						keys: [ 'enter' ],
						isHidden: ! canActivateAddons,
						action() {
							this.$$confirm
								.prop( 'disabled', true )
								.html( spinner + wpforms_education.activating );

							this.$$cancel
								.prop( 'disabled', true );

							app.activateAddon( $button, this );

							return false;
						},
					},
					cancel: {
						text: wpforms_education.cancel,
					},
				},
			} );
		},

		/**
		 * Activate addon via AJAX.
		 *
		 * @since 1.7.0
		 *
		 * @param {jQuery} $button       jQuery button element.
		 * @param {Object} previousModal Previous modal instance.
		 */
		activateAddon( $button, previousModal ) {
			const path = $button.data( 'path' ),
				pluginType = $button.data( 'type' ),
				nonce = $button.data( 'nonce' ),
				hideOnSuccess = $button.data( 'hide-on-success' );

			$.post(
				wpforms_education.ajax_url,
				{
					action: 'wpforms_activate_addon',
					nonce,
					plugin: path,
					type: pluginType,
				},
				function( res ) {
					previousModal.close();

					if ( res.success ) {
						if ( hideOnSuccess ) {
							$button.hide();
						}

						app.saveModal( pluginType === 'plugin' ? wpforms_education.plugin_activated : wpforms_education.addon_activated );
					} else {
						$.alert( {
							title: false,
							content: res.data,
							icon: 'fa fa-exclamation-circle',
							type: 'orange',
							buttons: {
								confirm: {
									text: wpforms_education.close,
									btnClass: 'btn-confirm',
									keys: [ 'enter' ],
								},
							},
						} );
					}
				}
			);
		},

		/**
		 * Ask user if they would like to save form and refresh form builder.
		 *
		 * @since 1.7.0
		 *
		 * @param {string}         title   Modal title.
		 * @param {string|boolean} content Modal content.
		 * @param {Object}         args    Additional arguments.
		 */
		saveModal( title, content = false, args = undefined ) {
			title = title || wpforms_education.addon_activated;
			content = content || wpforms_education.save_prompt;

			$.alert( {
				title: title.replace( /\.$/, '' ), // Remove a dot in the title end.
				content,
				icon: 'fa fa-check-circle',
				type: 'green',
				buttons: {
					confirm: {
						text: args?.saveConfirm || wpforms_education.save_confirm,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							if ( typeof WPFormsBuilder === 'undefined' ) {
								location.reload();

								return;
							}

							this.$$confirm
								.prop( 'disabled', true )
								.html( spinner + wpforms_education.saving );

							this.$$cancel
								.prop( 'disabled', true );

							if ( WPFormsBuilder.formIsSaved() ) {
								app.redirect( args?.redirectUrl );

								return;
							}

							const saveForm = WPFormsBuilder.formSave( false );

							if ( ! saveForm ) {
								return true;
							}

							saveForm.done( function() {
								app.redirect( args?.redirectUrl );
							} );

							return false;
						},
					},
					cancel: {
						text: wpforms_education.close,
					},
				},
			} );
		},

		/**
		 * Redirect to URL or reload the page.
		 *
		 * @since 1.9.2
		 *
		 * @param {string} url Redirect URL.
		 */
		redirect( url ) {
			if ( url ) {
				location.href = url;
			} else {
				location.reload();
			}
		},

		/**
		 * Addon install modal.
		 *
		 * @since 1.7.0
		 *
		 * @param {jQuery} $button jQuery button element.
		 */
		installModal( $button ) {
			const feature = $button.data( 'name' ),
				url = $button.data( 'url' );

			if ( ! url || '' === url ) {
				wpf.debug( `Couldn't install the ${ feature } addon: Empty install URL.` );
				return;
			}

			const canInstallAddons = wpforms_education.can_install_addons,
				message = $button.data( 'message' );

			$.alert( {
				title: false,
				content: message ? message : wpforms_education.install_prompt.replace( /%name%/g, feature ),
				icon: 'fa fa-info-circle',
				type: 'blue',
				boxWidth: '425px',
				buttons: {
					confirm: {
						text: wpforms_education.install_confirm,
						btnClass: 'btn-confirm' + ( ! canInstallAddons ? ' hidden' : '' ),
						keys: [ 'enter' ],
						isHidden: ! canInstallAddons,
						action() {
							this.$$confirm.prop( 'disabled', true )
								.html( spinner + wpforms_education.installing );

							this.$$cancel
								.prop( 'disabled', true );

							app.installAddon( $button, this );

							return false;
						},
					},
					cancel: {
						text: wpforms_education.cancel,
					},
				},
			} );
		},

		/**
		 * Install addon via AJAX.
		 *
		 * @since 1.7.0
		 *
		 * @param {jQuery} $button       Button object.
		 * @param {Object} previousModal Previous modal instance.
		 */
		installAddon( $button, previousModal ) {
			const url = $button.data( 'url' ),
				pluginType = $button.data( 'type' ),
				nonce = $button.data( 'nonce' ),
				hideOnSuccess = $button.data( 'hide-on-success' );

			$.post(
				wpforms_education.ajax_url,
				{
					action: 'wpforms_install_addon',
					nonce,
					plugin: url,
					type: pluginType,
				},
				function( res ) {
					previousModal.close();

					if ( res.success ) {
						if ( hideOnSuccess ) {
							$button.hide();
						}

						app.saveModal( res.data.msg );
					} else {
						let message = res.data;

						if ( 'object' === typeof res.data ) {
							message = wpforms_education.addon_error;
						}

						$.alert( {
							title: false,
							content: message,
							icon: 'fa fa-exclamation-circle',
							type: 'orange',
							buttons: {
								confirm: {
									text: wpforms_education.close,
									btnClass: 'btn-confirm',
									keys: [ 'enter' ],
								},
							},
						} );
					}
				}
			);
		},

		/**
		 * Get upgrade modal width.
		 *
		 * @since 1.7.3
		 *
		 * @param {boolean} isVideoModal Upgrade a modal type (with video or not).
		 *
		 * @return {string} Modal width in pixels.
		 */
		getUpgradeModalWidth( isVideoModal ) {
			const windowWidth = $( window ).width();

			if ( windowWidth <= 300 ) {
				return '250px';
			}

			if ( windowWidth <= 750 ) {
				return '350px';
			}

			if ( ! isVideoModal || windowWidth <= 1024 ) {
				return '550px';
			}

			return windowWidth > 1070 ? '1040px' : '994px';
		},

		/**
		 * Error modal.
		 *
		 * @since 1.7.6
		 *
		 * @param {string} title   Modal title.
		 * @param {string} content Modal content.
		 */
		errorModal( title, content ) {
			$.alert( {
				title: title || false,
				content,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_education.close,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
			} );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

WPFormsEducation.core.init();
