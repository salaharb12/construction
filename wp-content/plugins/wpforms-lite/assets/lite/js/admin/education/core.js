/* global wpforms_builder, wpforms_education */

/**
 * WPForms Education core for Lite.
 *
 * @since 1.6.6
 */

// noinspection ES6ConvertVarToLetConst
/**
 * @param wpforms_education.upgrade
 * @param wpforms_education.upgrade.button
 * @param wpforms_education.upgrade.doc
 * @param wpforms_education.upgrade.message
 * @param wpforms_education.upgrade.title
 * @param wpforms_education.upgrade.title_plural
 * @param wpforms_education.upgrade_bonus
 */

var WPFormsEducation = window.WPFormsEducation || {}; // eslint-disable-line no-var

WPFormsEducation.liteCore = window.WPFormsEducation.liteCore || ( function( document, window, $ ) {
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
			app.openModalButtonClick();
		},

		/**
		 * Registers click events that should open upgrade modal.
		 *
		 * @since 1.6.6
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
			const $this = $( this );

			if ( $this.data( 'action' ) && [ 'activate', 'install' ].includes( $this.data( 'action' ) ) ) {
				return;
			}

			event.preventDefault();
			event.stopImmediatePropagation();

			let name = $this.data( 'name' );

			if ( $this.hasClass( 'wpforms-add-fields-button' ) ) {
				name = $this.text();
				name += name.indexOf( wpforms_builder.field ) < 0 ? ' ' + wpforms_builder.field : '';
			}

			const utmContent = WPFormsEducation.core.getUTMContentValue( $this );

			app.upgradeModal( name, utmContent, $this.data( 'license' ), $this.data( 'video' ), $this.data( 'plural' ) );
		},

		/**
		 * Upgrade modal.
		 *
		 * @since 1.6.6
		 *
		 * @param {string}  feature    Feature name.
		 * @param {string}  utmContent UTM content.
		 * @param {string}  type       Feature license type: pro or elite.
		 * @param {string}  video      Feature video URL.
		 * @param {boolean} isPlural   Is feature name plural.
		 */
		upgradeModal( feature, utmContent, type, video, isPlural ) {
			// Provide a default value.
			if ( typeof type === 'undefined' || type.length === 0 ) {
				type = 'pro';
			}

			// Make sure we received only a supported type.
			if ( $.inArray( type, [ 'pro', 'elite' ] ) < 0 ) {
				return;
			}

			const message = wpforms_education.upgrade[ type ].message.replace( /%name%/g, feature );
			const isVideoModal = ! _.isEmpty( video );
			const titleMessage = isPlural ? wpforms_education.upgrade[ type ].title_plural : wpforms_education.upgrade[ type ].title;

			let modalWidth = WPFormsEducation.core.getUpgradeModalWidth( isVideoModal );

			const modal = $.alert( {
				backgroundDismiss: true,
				title: feature + ' ' + titleMessage,
				icon: 'fa fa-lock',
				content: message,
				boxWidth: modalWidth,
				theme: 'modern,wpforms-education',
				closeIcon: true,
				onOpenBefore() {
					if ( isVideoModal ) {
						this.$el.addClass( 'has-video' );
					}

					const videoHtml = isVideoModal ? '<iframe src="' + video + '" class="feature-video" allowfullscreen="" width="475" height="267"></iframe>' : '';

					this.$btnc.after( '<div class="discount-note">' + wpforms_education.upgrade_bonus + '</div>' );
					this.$btnc.after( wpforms_education.upgrade[ type ].doc.replace( /%25name%25/g, feature ) );
					this.$btnc.after( videoHtml );

					this.$body.find( '.jconfirm-content' ).addClass( 'lite-upgrade' );
				},
				buttons: {
					confirm: {
						text: wpforms_education.upgrade[ type ].button,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action: () => {
							window.open( WPFormsEducation.core.getUpgradeURL( utmContent, type ), '_blank' );
							WPFormsEducation.core.upgradeModalThankYou( type );
						},
					},
				},
			} );

			$( window ).on( 'resize', function() {
				modalWidth = WPFormsEducation.core.getUpgradeModalWidth( isVideoModal );

				if ( modal.isOpen() ) {
					modal.setBoxWidth( modalWidth );
				}
			} );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

// Initialize.
WPFormsEducation.liteCore.init();
