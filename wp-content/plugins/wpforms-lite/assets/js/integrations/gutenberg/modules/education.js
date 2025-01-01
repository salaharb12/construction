/* global wpforms_education, WPFormsEducation */

/**
 * WPForms Education Modal module.
 *
 * @since 1.8.8
 */
export default ( ( $ ) => {
	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	const app = {
		/**
		 * Open educational popup for users with no Pro license.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} panel   Panel slug.
		 * @param {string} feature Feature name.
		 */
		showProModal( panel, feature ) {
			const type = 'pro';
			const message = wpforms_education.upgrade[ type ].message_plural.replace( /%name%/g, feature );
			const utmContent = {
				container: 'Upgrade to Pro - Container Styles',
				background: 'Upgrade to Pro - Background Styles',
				themes: 'Upgrade to Pro - Themes',
			};

			$.alert( {
				backgroundDismiss: true,
				title: feature + ' ' + wpforms_education.upgrade[ type ].title_plural,
				icon: 'fa fa-lock',
				content: message,
				boxWidth: '550px',
				theme: 'modern,wpforms-education',
				closeIcon: true,
				onOpenBefore: function() { // eslint-disable-line object-shorthand
					this.$btnc.after( '<div class="discount-note">' + wpforms_education.upgrade_bonus + '</div>' );
					this.$btnc.after( wpforms_education.upgrade[ type ].doc.replace( /%25name%25/g, 'AP - ' + feature ) );
					this.$body.find( '.jconfirm-content' ).addClass( 'lite-upgrade' );
				},
				buttons: {
					confirm: {
						text: wpforms_education.upgrade[ type ].button,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action: () => {
							window.open( WPFormsEducation.core.getUpgradeURL( utmContent[ panel ], type ), '_blank' );
							WPFormsEducation.core.upgradeModalThankYou( type );
						},
					},
				},
			} );
		},

		/**
		 * Open license modal.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} feature    Feature name.
		 * @param {string} fieldName  Field name.
		 * @param {string} utmContent UTM content.
		 */
		showLicenseModal( feature, fieldName, utmContent ) {
			WPFormsEducation.proCore.licenseModal( feature, fieldName, utmContent );
		},
	};

	return app;
} )( jQuery );
